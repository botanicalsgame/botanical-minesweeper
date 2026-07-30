/**
 * scene.ts — Integração Babylon.js com lógica do jogo
 * Renderiza o tabuleiro, blocos, números e gerencia interações
 */

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Camera } from "@babylonjs/core/Cameras/camera";
import { GameWorld, Cell } from "./GameWorld";

export interface SceneCallbacks {
  onStateChange?: (state: "playing" | "won" | "lost") => void;
  onFlaggedChange?: (count: number) => void;
  onMineCountChange?: (count: number) => void;
}

export interface GameHandle {
  scene: Scene;
  dispose: () => void;
  reset: () => void;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 10;
const MINE_COUNT = 10;
const CELL_SIZE = 50;
const CELL_SPACING = 3;

// Cores do tema botânico antigo
const COLORS = {
  background: new Color3(0.92, 0.9, 0.85), // Bege envelhecido
  cellEmpty: new Color3(0.93, 0.87, 0.82), // Papel claro
  cellRevealed: new Color3(0.83, 0.77, 0.66), // Terra clara
  cellHover: new Color3(0.88, 0.82, 0.75), // Terra mais clara (hover)
  mine: new Color3(0.55, 0.23, 0.23), // Vermelho-escuro
  text: new Color3(0.24, 0.16, 0.09), // Marrom-escuro
  accentGreen: new Color3(0.42, 0.56, 0.37), // Verde-musgo
  shadow: new Color3(0.3, 0.25, 0.2), // Sombra
};

interface CellMesh {
  mesh: any;
  material: StandardMaterial;
  cell: Cell;
  textMesh?: any;
}

export async function createGameScene(
  engine: Engine,
  canvas: HTMLCanvasElement,
  callbacks?: SceneCallbacks
): Promise<GameHandle> {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(
    COLORS.background.r,
    COLORS.background.g,
    COLORS.background.b,
    1
  );

  // Câmera ortográfica para visualização 2D
  const camera = new UniversalCamera("camera", new Vector3(0, 0, 100), scene);
  camera.attachControl(canvas, true);
  camera.mode = Camera.ORTHOGRAPHIC_CAMERA;

  // Calcular dimensões do tabuleiro
  const boardWidth = BOARD_WIDTH * (CELL_SIZE + CELL_SPACING);
  const boardHeight = BOARD_HEIGHT * (CELL_SIZE + CELL_SPACING);

  // Posicionar câmera para ver todo o tabuleiro com margem
  const margin = 100;
  camera.orthoLeft = -boardWidth / 2 - margin;
  camera.orthoRight = boardWidth / 2 + margin;
  camera.orthoTop = boardHeight / 2 + margin;
  camera.orthoBottom = -boardHeight / 2 - margin;

  // Criar mundo do jogo
  let gameWorld = new GameWorld(BOARD_WIDTH, BOARD_HEIGHT, MINE_COUNT);

  // Armazenar meshes das células
  let cellMeshes: CellMesh[] = [];

  // Função para criar células do tabuleiro
  function createBoard(): void {
    // Limpar meshes antigos
    cellMeshes.forEach((cm) => {
      cm.mesh.dispose();
      if (cm.textMesh) cm.textMesh.dispose();
    });
    cellMeshes = [];

    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const cell = gameWorld.getCell(x, y)!;
        const posX =
          x * (CELL_SIZE + CELL_SPACING) - boardWidth / 2 + CELL_SIZE / 2;
        const posY =
          -y * (CELL_SIZE + CELL_SPACING) + boardHeight / 2 - CELL_SIZE / 2;

        // Criar material da célula
        const material = new StandardMaterial(`cell_${x}_${y}`, scene);
        material.emissiveColor = COLORS.cellEmpty;
        material.specularColor = Color3.Black();
        material.backFaceCulling = false;

        // Criar mesh da célula (plano em vez de caixa)
        const cellMesh = MeshBuilder.CreateBox(
          `cell_${x}_${y}`,
          { size: CELL_SIZE, depth: 2 },
          scene
        );
        cellMesh.position = new Vector3(posX, posY, 0);
        cellMesh.material = material;

        // Adicionar sombra
        const shadowMesh = MeshBuilder.CreateBox(
          `shadow_${x}_${y}`,
          { size: CELL_SIZE + 2, depth: 1 },
          scene
        );
        shadowMesh.position = new Vector3(posX, posY, -1);
        const shadowMaterial = new StandardMaterial(`shadowMat_${x}_${y}`, scene);
        shadowMaterial.emissiveColor = COLORS.shadow;
        shadowMaterial.alpha = 0.3;
        shadowMesh.material = shadowMaterial;

        // Armazenar referência
        cellMeshes.push({
          mesh: cellMesh,
          material,
          cell,
        });

        // Adicionar dados de posição ao mesh para interação
        (cellMesh as any).gridX = x;
        (cellMesh as any).gridY = y;
      }
    }
  }

  // Função para renderizar número em texto 3D
  function renderNumberText(mesh: any, num: number): void {
    // Criar um plano com textura de número
    const textMesh = MeshBuilder.CreatePlane(
      `text_${mesh.name}`,
      { size: CELL_SIZE * 0.8 },
      scene
    );
    textMesh.position = mesh.position.clone();
    textMesh.position.z = 1;

    const textMaterial = new StandardMaterial(`textMat_${mesh.name}`, scene);
    textMaterial.emissiveColor = COLORS.text;
    textMaterial.backFaceCulling = false;

    textMesh.material = textMaterial;

    // Armazenar referência
    const cellMesh = cellMeshes.find((cm) => cm.mesh === mesh);
    if (cellMesh) {
      cellMesh.textMesh = textMesh;
    }
  }

  // Função para atualizar visual de uma célula
  function updateCellVisual(x: number, y: number): void {
    const cell = gameWorld.getCell(x, y);
    if (!cell) return;

    const cellMesh = cellMeshes.find(
      (cm) => (cm.mesh as any).gridX === x && (cm.mesh as any).gridY === y
    );
    if (!cellMesh) return;

    if (cell.isRevealed) {
      cellMesh.material.emissiveColor = COLORS.cellRevealed;

      if (cell.isMine) {
        // Renderizar mina (erva daninha) em vermelho
        cellMesh.material.emissiveColor = COLORS.mine;
      } else if (cell.adjacentMines > 0) {
        // Renderizar número com cor diferente
        const colors = [
          new Color3(0.0, 0.5, 0.0), // Verde
          new Color3(0.0, 0.0, 1.0), // Azul
          new Color3(1.0, 0.0, 0.0), // Vermelho
          new Color3(0.0, 0.0, 0.5), // Azul escuro
          new Color3(0.5, 0.0, 0.5), // Roxo
          new Color3(1.0, 0.5, 0.0), // Laranja
          new Color3(0.5, 0.5, 0.0), // Olive
          new Color3(0.0, 0.0, 0.0), // Preto
        ];
        cellMesh.material.emissiveColor = colors[cell.adjacentMines - 1];
      }
    } else if (cell.isFlagged) {
      cellMesh.material.emissiveColor = COLORS.accentGreen;
    }
  }

  // Gerenciar cliques
  scene.onPointerObservable.add((pointerInfo) => {
    if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
      const pickResult = scene.pick(
        scene.pointerX,
        scene.pointerY,
        (mesh) => mesh.name.startsWith("cell_") && !mesh.name.startsWith("shadow")
      );

      if (pickResult && pickResult.hit && pickResult.pickedMesh) {
        const mesh = pickResult.pickedMesh as any;
        const x = mesh.gridX;
        const y = mesh.gridY;

        // Clique esquerdo = revelar
        if (pointerInfo.event.button === 0) {
          gameWorld.reveal(x, y);

          // Atualizar células adjacentes
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              updateCellVisual(x + dx, y + dy);
            }
          }

          // Notificar callbacks
          const stats = gameWorld.getStats();
          callbacks?.onStateChange?.(stats.state);
        }
        // Clique direito = marcar
        else if (pointerInfo.event.button === 2) {
          pointerInfo.event.preventDefault();
          gameWorld.toggleFlag(x, y);
          updateCellVisual(x, y);

          // Notificar callbacks
          const stats = gameWorld.getStats();
          callbacks?.onFlaggedChange?.(stats.flaggedCount);
        }
      }
    }
  });

  // Criar tabuleiro inicial
  createBoard();

  // Inicializar visual de todas as células
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      updateCellVisual(x, y);
    }
  }

  // Notificar contagem inicial de minas
  callbacks?.onMineCountChange?.(MINE_COUNT);

  // Handle para cleanup e reset
  const handle: GameHandle = {
    scene,
    dispose: () => {
      scene.dispose();
    },
    reset: () => {
      gameWorld.reset();
      createBoard();

      for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          updateCellVisual(x, y);
        }
      }

      callbacks?.onStateChange?.("playing");
      callbacks?.onFlaggedChange?.(0);
      callbacks?.onMineCountChange?.(MINE_COUNT);
    },
  };

  return handle;
}
