# Estrutura do Projeto — Campo Minado Botânico

## Arquivos Principais

```
botanical-minesweeper/
├── client/
│   ├── public/
│   │   └── (arquivos de configuração — favicon, robots.txt)
│   ├── src/
│   │   ├── components/
│   │   │   ├── GameCanvas.tsx       # Renderização do jogo com Canvas 2D
│   │   │   ├── GameUI.tsx           # Interface sobreposta (cabeçalho, status, modal)
│   │   │   └── (outros componentes shadcn/ui)
│   │   ├── game/
│   │   │   ├── GameWorld.ts         # Lógica pura do jogo (tabuleiro, minas, etc)
│   │   │   └── scene.ts             # (Arquivo legado — não usado na versão final)
│   │   ├── pages/
│   │   │   └── Home.tsx             # Página principal (renderiza GameCanvas)
│   │   ├── App.tsx                  # Router principal
│   │   ├── main.tsx                 # Entry point React
│   │   └── index.css                # Estilos globais e tema
│   └── index.html                   # Template HTML
├── ideas.md                         # Brainstorming de design (estética botânica)
├── PLAN.md                          # Plano de desenvolvimento
├── STRUCTURE.md                     # Este arquivo
├── ASSETS.md                        # Referências de assets gerados
└── package.json                     # Dependências do projeto
```

## Componentes React

### GameCanvas.tsx
Componente principal que renderiza o jogo usando Canvas 2D. Gerencia:
- Inicialização do GameWorld
- Renderização do tabuleiro e células
- Interação do usuário (cliques e hover)
- Comunicação de estado com GameUI

### GameUI.tsx
Interface sobreposta com:
- Cabeçalho com logo, título e botão de recomeço
- Contador de minas restantes e bandeiras
- Modal de vitória/derrota
- Instruções na parte inferior

### Home.tsx
Página principal que renderiza apenas o GameCanvas (tela cheia).

## Lógica do Jogo

### GameWorld.ts
Classe que encapsula toda a lógica do jogo:

**Propriedades**:
- `grid`: Matriz de células (10x10)
- `width`, `height`: Dimensões do tabuleiro
- `mineCount`: Número de minas (10)
- `state`: Estado do jogo (playing, won, lost)
- `revealedCount`, `flaggedCount`: Contadores

**Métodos Públicos**:
- `reveal(x, y)`: Revela célula e aplica flood-fill se vazia
- `toggleFlag(x, y)`: Marca/desmarcar célula como suspeita
- `getCell(x, y)`: Retorna célula em posição
- `getGrid()`: Retorna matriz completa
- `getState()`: Retorna estado do jogo
- `getStats()`: Retorna estatísticas
- `reset()`: Reinicia o jogo

**Métodos Privados**:
- `initializeGrid()`: Cria matriz vazia
- `placeMines()`: Coloca 10 minas aleatoriamente
- `calculateAdjacentMines()`: Calcula números para cada célula
- `floodFill(x, y)`: Revela recursivamente células vazias adjacentes
- `revealAllMines()`: Revela todas as minas (derrota)
- `checkWinCondition()`: Verifica se jogador venceu

## Fluxo de Dados

```
GameCanvas
  ├─ GameWorld (lógica)
  │  ├─ Inicializa tabuleiro
  │  ├─ Processa cliques
  │  └─ Retorna estado
  ├─ Canvas 2D (renderização)
  │  ├─ Desenha células
  │  ├─ Desenha números/minas
  │  └─ Aplica cores e efeitos
  └─ GameUI (interface)
     ├─ Exibe cabeçalho
     ├─ Exibe status
     └─ Exibe modal de resultado
```

## Estilos e Tema

### Paleta de Cores (definida em GameCanvas.tsx)
- `background`: #ebe5d9 (bege envelhecido)
- `cellEmpty`: #ede8dc (papel claro)
- `cellRevealed`: #d4c5a9 (terra clara)
- `cellHover`: #e8dcc8 (terra mais clara)
- `mine`: #8b3a3a (vermelho-escuro)
- `accentGreen`: #6b8e5f (verde-musgo)
- `number`: Array de 8 cores para números 1-8

### Tipografia
- Títulos: Georgia serif (elegante)
- Números: Georgia serif bold (caligrafia)
- Interface: Tailwind CSS (sans-serif)

## Assets Gerados

Imagens criadas com IA (referências em ASSETS.md):
1. Logo — Lupa com folha (favicon, cabeçalho)
2. Textura de papel envelhecido
3. Ornamento botânico de canto
4. Ícone de erva daninha espinhosa
5. Amostra de números caligrafados

## Dependências Principais

- `@babylonjs/core`: Não utilizado na versão final (mantido para compatibilidade)
- `react`: Framework UI
- `react-dom`: Renderização React
- `tailwindcss`: Utilitários CSS
- `shadcn/ui`: Componentes UI pré-construídos

## Build e Deploy

- **Dev**: `pnpm run dev` (Vite dev server)
- **Build**: `pnpm run build` (Vite + esbuild)
- **Check**: `pnpm check` (TypeScript check)
- **Deploy**: Via Manus WebDev Publish (não manual)
