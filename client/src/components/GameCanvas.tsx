// GameCanvas.tsx — Jogo Campo Minado com Canvas 2D e tema botânico
// Renderização 2D com efeitos visuais, animações e estética envelhecida

import { useEffect, useRef, useState } from "react";
import { GameWorld } from "@/game/GameWorld";
import GameUI from "./GameUI";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 10;
const MINE_COUNT = 10;
const CELL_SIZE = 50;
const CELL_SPACING = 3;

const COLORS = {
  background: "#ebe5d9",
  cellEmpty: "#ede8dc",
  cellRevealed: "#d4c5a9",
  cellHover: "#e8dcc8",
  mine: "#8b3a3a",
  text: "#3d2817",
  accentGreen: "#6b8e5f",
  shadow: "rgba(0, 0, 0, 0.15)",
  border: "#9a8b7e",
  number: ["#228B22", "#0000FF", "#FF0000", "#00008B", "#800080", "#FF8C00", "#808000", "#000000"],
};

interface CellState {
  isRevealed: boolean;
  isFlagged: boolean;
  isMine: boolean;
  adjacentMines: number;
  revealTime?: number; // Para animação de revelação
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameWorldRef = useRef<GameWorld | null>(null);
  const cellStatesRef = useRef<Map<string, CellState>>(new Map());
  const hoverCellRef = useRef<{ x: number; y: number } | null>(null);
  const animationTimeRef = useRef<number>(0);

  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const [mineCount, setMineCount] = useState(MINE_COUNT);
  const [flaggedCount, setFlaggedCount] = useState(0);

  const boardWidth = BOARD_WIDTH * (CELL_SIZE + CELL_SPACING);
  const boardHeight = BOARD_HEIGHT * (CELL_SIZE + CELL_SPACING);

  // Inicializar jogo
  useEffect(() => {
    gameWorldRef.current = new GameWorld(BOARD_WIDTH, BOARD_HEIGHT, MINE_COUNT);
    cellStatesRef.current.clear();
    setMineCount(MINE_COUNT);
    setFlaggedCount(0);
    setGameState("playing");
  }, []);

  // Renderizar canvas com animações
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameWorldRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configurar tamanho do canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Desenhar fundo com textura
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Adicionar textura sutil ao fundo
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.02})`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 50 + 10,
        Math.random() * 50 + 10
      );
    }

    // Calcular posição inicial do tabuleiro (centralizado)
    const offsetX = (canvas.width - boardWidth) / 2;
    const offsetY = (canvas.height - boardHeight) / 2 + 60;

    // Incrementar tempo de animação
    animationTimeRef.current += 0.016; // ~60fps

    // Desenhar células
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const cell = gameWorldRef.current.getCell(x, y);
        if (!cell) continue;

        const cellX = offsetX + x * (CELL_SIZE + CELL_SPACING);
        const cellY = offsetY + y * (CELL_SIZE + CELL_SPACING);
        const isHovered =
          hoverCellRef.current?.x === x && hoverCellRef.current?.y === y;

        // Desenhar sombra
        ctx.fillStyle = COLORS.shadow;
        ctx.fillRect(cellX + 2, cellY + 2, CELL_SIZE, CELL_SIZE);

        // Determinar cor da célula
        let cellColor = COLORS.cellEmpty;
        if (cell.isRevealed) {
          cellColor = COLORS.cellRevealed;
        } else if (cell.isFlagged) {
          cellColor = COLORS.accentGreen;
        } else if (isHovered) {
          cellColor = COLORS.cellHover;
        }

        // Desenhar célula com efeito de profundidade
        ctx.fillStyle = cellColor;
        ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);

        // Desenhar borda com efeito 3D
        ctx.strokeStyle = COLORS.border;
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX, cellY, CELL_SIZE, CELL_SIZE);

        // Desenhar highlight sutil
        if (isHovered && !cell.isRevealed) {
          ctx.strokeStyle = "rgba(200, 150, 100, 0.5)";
          ctx.lineWidth = 2;
          ctx.strokeRect(cellX - 1, cellY - 1, CELL_SIZE + 2, CELL_SIZE + 2);
        }

        // Desenhar conteúdo
        if (cell.isRevealed) {
          if (cell.isMine) {
            // Desenhar mina (erva daninha estilizada)
            drawMineIcon(ctx, cellX, cellY);
          } else if (cell.adjacentMines > 0) {
            // Desenhar número em caligrafia
            drawNumber(ctx, cellX, cellY, cell.adjacentMines);
          }
        } else if (cell.isFlagged) {
          // Desenhar bandeira/marcação
          drawFlagIcon(ctx, cellX, cellY);
        }
      }
    }

    // Armazenar offset para uso em cliques
    (canvas as any).boardOffsetX = offsetX;
    (canvas as any).boardOffsetY = offsetY;

    // Animar continuamente
    requestAnimationFrame(() => {});
  }, [gameState, flaggedCount, hoverCellRef.current]);

  // Funções de desenho
  function drawNumber(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    num: number
  ) {
    ctx.fillStyle = COLORS.number[num - 1];
    ctx.font = "bold 28px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillText(num.toString(), x + CELL_SIZE / 2, y + CELL_SIZE / 2);
    ctx.shadowColor = "transparent";
  }

  function drawMineIcon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ) {
    const centerX = x + CELL_SIZE / 2;
    const centerY = y + CELL_SIZE / 2;
    const radius = CELL_SIZE / 3;

    // Desenhar espinho central
    ctx.fillStyle = COLORS.mine;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Desenhar espinhos
    ctx.strokeStyle = COLORS.mine;
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * i) / 4;
      const x1 = centerX + Math.cos(angle) * radius * 0.5;
      const y1 = centerY + Math.sin(angle) * radius * 0.5;
      const x2 = centerX + Math.cos(angle) * radius;
      const y2 = centerY + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  function drawFlagIcon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ) {
    const centerX = x + CELL_SIZE / 2;
    const centerY = y + CELL_SIZE / 2;

    // Desenhar marcação de naturalista (círculo com ponto)
    ctx.fillStyle = COLORS.accentGreen;
    ctx.beginPath();
    ctx.arc(centerX, centerY, CELL_SIZE / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = COLORS.background;
    ctx.beginPath();
    ctx.arc(centerX, centerY, CELL_SIZE / 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = COLORS.accentGreen;
    ctx.beginPath();
    ctx.arc(centerX, centerY, CELL_SIZE / 10, 0, Math.PI * 2);
    ctx.fill();
  }

  // Gerenciar movimento do mouse para hover
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const offsetX = (canvas as any).boardOffsetX;
      const offsetY = (canvas as any).boardOffsetY;

      const gridX = Math.floor((x - offsetX) / (CELL_SIZE + CELL_SPACING));
      const gridY = Math.floor((y - offsetY) / (CELL_SIZE + CELL_SPACING));

      if (
        gridX >= 0 &&
        gridX < BOARD_WIDTH &&
        gridY >= 0 &&
        gridY < BOARD_HEIGHT
      ) {
        hoverCellRef.current = { x: gridX, y: gridY };
        canvas.style.cursor = "pointer";
      } else {
        hoverCellRef.current = null;
        canvas.style.cursor = "default";
      }
    };

    const handleMouseLeave = () => {
      hoverCellRef.current = null;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Gerenciar cliques
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameWorldRef.current) return;

    const handleClick = (e: MouseEvent) => {
      if (gameState !== "playing") return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const offsetX = (canvas as any).boardOffsetX;
      const offsetY = (canvas as any).boardOffsetY;

      const gridX = Math.floor((x - offsetX) / (CELL_SIZE + CELL_SPACING));
      const gridY = Math.floor((y - offsetY) / (CELL_SIZE + CELL_SPACING));

      if (gridX < 0 || gridX >= BOARD_WIDTH || gridY < 0 || gridY >= BOARD_HEIGHT)
        return;

      if (e.button === 0) {
        // Clique esquerdo
        gameWorldRef.current!.reveal(gridX, gridY);
        const stats = gameWorldRef.current!.getStats();
        setGameState(stats.state);
      } else if (e.button === 2) {
        // Clique direito
        e.preventDefault();
        gameWorldRef.current!.toggleFlag(gridX, gridY);
        const stats = gameWorldRef.current!.getStats();
        setFlaggedCount(stats.flaggedCount);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    canvas.addEventListener("mousedown", handleClick);
    canvas.addEventListener("contextmenu", handleContextMenu);

    return () => {
      canvas.removeEventListener("mousedown", handleClick);
      canvas.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [gameState]);

  const handleReset = () => {
    gameWorldRef.current?.reset();
    cellStatesRef.current.clear();
    setGameState("playing");
    setFlaggedCount(0);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 h-full w-full outline-none"
        style={{ touchAction: "none" }}
      />
      <GameUI
        mineCount={mineCount}
        flaggedCount={flaggedCount}
        gameState={gameState}
        onReset={handleReset}
      />
    </>
  );
}
