# Campo Minado Botânico — Plano de Desenvolvimento

## Objetivo
Criar um jogo de Campo Minado estilizado como um antigo diário de campo botânico, com blocos de papel envelhecido, minas como ervas daninhas espinhosas e números escritos à mão.

## Arquitetura

### Componentes Principais

**1. GameWorld (client/src/game/GameWorld.ts)**
- Lógica pura do jogo em TypeScript
- Gerencia o estado do tabuleiro (10x10 com 10 minas)
- Implementa algoritmo de flood-fill para revelação de células vazias
- Rastreia estado de jogo (playing, won, lost)
- Métodos: `reveal()`, `toggleFlag()`, `getCell()`, `reset()`

**2. GameCanvas (client/src/components/GameCanvas.tsx)**
- Componente React que renderiza o jogo
- Usa Canvas 2D para renderização (em vez de Babylon.js para simplicidade)
- Gerencia interação do usuário (cliques esquerdo/direito)
- Controla hover visual dos blocos
- Comunica estado do jogo via callbacks

**3. GameUI (client/src/components/GameUI.tsx)**
- Interface sobreposta com controles
- Exibe cabeçalho com logo, título e botão "Recomeçar"
- Mostra contador de minas restantes e bandeiras
- Exibe modal de vitória/derrota
- Instruções na parte inferior

## Fluxo de Jogo

1. **Inicialização**: GameWorld cria tabuleiro 10x10, coloca 10 minas aleatoriamente
2. **Renderização**: Canvas desenha células com cores baseadas em estado (vazio, revelado, marcado)
3. **Interação**: Usuário clica em células
   - Clique esquerdo: revela célula
   - Clique direito: marca/desmarcar como suspeita
4. **Lógica**: GameWorld processa ação, atualiza estado
5. **Feedback Visual**: Canvas re-renderiza com novo estado
6. **Condições de Vitória/Derrota**:
   - Vitória: todas as células seguras reveladas
   - Derrota: célula com mina revelada

## Tema Visual — Diário Botânico Antigo

### Paleta de Cores
- **Fundo**: Bege envelhecido (#ebe5d9)
- **Blocos Vazios**: Papel claro (#ede8dc)
- **Blocos Revelados**: Terra clara (#d4c5a9)
- **Minas**: Vermelho-escuro (#8b3a3a)
- **Números**: Cores variadas (verde, azul, vermelho, etc.)
- **Acento Verde**: Verde-musgo (#6b8e5f) para marcações

### Elementos Visuais
- **Números**: Caligrafia em Georgia serif (elegante e histórica)
- **Minas**: Ícone de espinho estilizado com radiação
- **Bandeiras**: Marcação de naturalista (círculo com ponto central)
- **Sombras**: Efeito de profundidade sutil
- **Hover**: Mudança de cor ao passar o mouse

## Recursos Implementados

✅ Tabuleiro 10x10 com 10 minas
✅ Revelação de células com flood-fill
✅ Marcação de suspeitas (bandeiras)
✅ Contagem de minas adjacentes
✅ Interface com cabeçalho e status
✅ Modal de vitória/derrota
✅ Botão de recomeço
✅ Efeitos visuais de hover
✅ Números em caligrafia
✅ Ícones de minas e bandeiras
✅ Tema botânico antigo

## Tecnologias Utilizadas

- **React 19**: Framework UI
- **Canvas 2D**: Renderização do jogo
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilos da UI
- **Vite**: Build tool

## Próximos Passos Opcionais

- Adicionar níveis de dificuldade (fácil, médio, difícil)
- Implementar timer de jogo
- Adicionar animações de revelação mais suaves
- Suporte a teclado (setas + espaço/enter)
- Salvar high scores
- Modo escuro/claro
- Sons de efeito
