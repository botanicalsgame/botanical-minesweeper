# Campo Minado Botânico — Design Brainstorm

## Abordagem Escolhida: Diário de Campo Naturalista Antigo

### Design Movement
**Naturalism Ilustrado (séc. XIX)** — Inspirado em diários de campo de naturalistas como Darwin e Wallace, com a estética de cadernos de exploração botânica do século XIX.

### Core Principles
1. **Autenticidade Envelhecida**: Papel amarelado, tintas desbotadas, bordas gastas e manchas de água sugerem um artefato histórico real
2. **Elegância Manuscrita**: Números e textos em caligrafia delicada, como anotações de um naturalista cuidadoso
3. **Harmonia Botânica**: Paleta de cores derivada de plantas secas, terras naturais e pigmentos históricos
4. **Interatividade Tátil**: Cliques revelam blocos com efeito de "raspar papel", feedback visual que reforça a sensação de exploração

### Color Philosophy
- **Fundo Principal**: Bege/creme envelhecido (oklch(0.92 0.02 80)) — papel antigo
- **Blocos Revelados**: Tons de terra (ocre, siena, umber) — como plantas prensadas
- **Minas (Ervas Daninhas)**: Vermelha-escura (oklch(0.45 0.15 25)) — espinhos perigosos
- **Números**: Marrom-escuro caligrafado (oklch(0.3 0.05 50)) — tinta histórica
- **Acentos**: Verde-musgo (oklch(0.55 0.08 130)) — folhas secas

### Layout Paradigm
- **Tabuleiro Centralizado**: Grid de blocos quadrados em papel, cercado por margens amplas que imitam as bordas de um caderno
- **Cabeçalho Naturalista**: Título em caligrafia, ícone de lupa (exploração), contador de minas
- **Rodapé Histórico**: Assinatura estilizada, data fictícia, pequenas anotações botânicas

### Signature Elements
1. **Blocos de Papel Texturizado**: Cada quadrado tem textura de papel envelhecido, com sombras suaves que criam profundidade
2. **Ervas Daninhas Espinhosas**: Ícone SVG estilizado de espinho/flor silvestre para representar minas
3. **Números Caligrafados**: Dígitos 1-8 em fonte manuscrita elegante, com leve variação de tamanho/ângulo

### Interaction Philosophy
- **Hover**: Blocos ganham brilho sutil (como se iluminados por luz natural) e cursor muda para "explorador"
- **Clique**: Transição suave de revelação com efeito de "raspar" — o bloco se abre revelando o conteúdo
- **Bandeira**: Clique direito marca com um pequeno símbolo de "marcação de naturalista" (círculo + ponto)
- **Vitória**: Confete de pétalas e folhas; mensagem em caligrafia

### Animation
- **Entrada**: Blocos aparecem com fade-in suave (200ms) em cascata
- **Revelação**: Efeito de "raspar papel" (150ms) com rotação leve e mudança de cor
- **Derrota**: Minas explodem com partículas de espinhos vermelhos (300ms)
- **Vitória**: Pétalas caem em movimento sinuoso (1000ms+)

### Typography System
- **Display (Títulos)**: "Playfair Display" ou "Crimson Text" — elegância clássica, peso 700
- **Body (Números)**: "Tangerine" ou "Dancing Script" — caligrafia delicada, peso 400-700
- **Anotações (Rodapé)**: "Crimson Text" — peso 400, itálico, tamanho pequeno

### Brand Essence
**Posicionamento**: Um jogo de estratégia que resgata a estética de exploração científica do século XIX, transformando o campo minado em uma experiência de descoberta naturalista.

**3 Personality Adjectives**: Erudito, Aventureiro, Elegante

### Brand Voice
- **Títulos**: "Exploração Botânica" (em vez de "Minesweeper")
- **CTAs**: "Revelar Segredo", "Marcar Suspeita", "Recomeçar Expedição"
- **Microcopy**: "Quantas ervas daninhas consegue evitar?" em vez de "How many mines can you avoid?"

### Wordmark & Logo
**Logo**: Um ícone de lupa com uma folha dentro (símbolo de exploração botânica) — sem texto, apenas o símbolo em marrom-escuro sobre fundo transparente.

### Signature Brand Color
**Verde-Musgo Histórico**: oklch(0.55 0.08 130) — cor que evoca folhas prensadas em diários antigos.

---

## Paleta de Cores Final
| Elemento | Cor OKLCH | Uso |
|----------|----------|-----|
| Fundo | oklch(0.92 0.02 80) | Papel envelhecido |
| Bloco Vazio | oklch(0.88 0.01 85) | Quadrado seguro |
| Bloco com Número | oklch(0.85 0.02 70) | Fundo para números |
| Mina (Espinho) | oklch(0.45 0.15 25) | Erva daninha |
| Texto Número | oklch(0.3 0.05 50) | Dígitos caligrafados |
| Acento Verde | oklch(0.55 0.08 130) | Detalhes decorativos |
| Sombra | oklch(0 0 0 / 0.15) | Profundidade |

---

## Referências Visuais
- Diários de campo de naturalistas do século XIX
- Ilustrações botânicas históricas
- Cadernos de exploração envelhecidos
- Tipografia manuscrita elegante
