# Pulseira Maker - Brainstorm de Design

## Contexto
Aplicação web para gerar gabaritos SVG personalizados de pulseiras de silicone. O público-alvo são operadores de produção e donos de pequenas empresas de personalização. A interface precisa ser funcional, rápida e clara.

---

<response>
## Ideia 1: "Industrial Workshop" — Estética de Oficina Técnica

**Design Movement**: Brutalismo funcional com toques de design industrial/técnico

**Core Principles**:
- Hierarquia visual extrema com tipografia bold
- Grid rígido e modular como uma mesa de trabalho
- Feedback visual imediato e direto
- Contraste alto para legibilidade em ambientes de produção

**Color Philosophy**: Fundo cinza escuro (#1a1a2e) com acentos em laranja industrial (#f58634) e verde de confirmação (#00a859). A paleta remete a um ambiente de fábrica/oficina, transmitindo confiança e profissionalismo.

**Layout Paradigm**: Layout em painel lateral fixo à esquerda (configurações/dados) com área de preview central dominante. A planilha aparece como tabela compacta no painel, e o SVG gerado ocupa 70% da tela.

**Signature Elements**:
- Bordas tracejadas nos cards (remetendo a linhas de corte)
- Indicadores de status com LEDs coloridos (verde/amarelo/vermelho)
- Tipografia monospace para dados técnicos

**Interaction Philosophy**: Cliques diretos, sem modais desnecessários. Drag-and-drop para reordenar pedidos. Hover revela ações rápidas.

**Animation**: Transições curtas e mecânicas (100-200ms). Efeito de "estampa" ao gerar SVG. Progress bars lineares sem easing.

**Typography System**: Space Grotesk para títulos (bold, impactante), JetBrains Mono para dados/tabelas, e sistema sans-serif para corpo.

<probability>0.06</probability>
</response>

---

<response>
## Ideia 2: "Clean Craft Studio" — Estúdio de Artesanato Limpo

**Design Movement**: Design Escandinavo com influência de Material Design 3

**Core Principles**:
- Clareza absoluta — cada elemento tem propósito
- Espaço branco generoso para respiração visual
- Cores suaves com acentos vibrantes nas pulseiras
- Acessibilidade como prioridade

**Color Philosophy**: Base em branco quente (#fafaf8) com cinza neutro (#64748b) para texto secundário. A cor primária é um azul petróleo (#0f4c75) que transmite confiabilidade. As cores das pulseiras são os únicos elementos vibrantes, criando contraste natural.

**Layout Paradigm**: Layout em etapas verticais (stepper): 1) Conectar planilha → 2) Configurar cores/fontes → 3) Preview e download. Cada etapa é uma seção full-width com transição suave.

**Signature Elements**:
- Cards com sombra suave e borda arredondada (8px)
- Ícones de linha fina (Lucide) com animação sutil
- Preview da pulseira em tamanho real com régua de escala

**Interaction Philosophy**: Wizard guiado com validação em tempo real. Tooltips informativos. Undo/redo para alterações.

**Animation**: Easing suave (cubic-bezier), fade-in para novos elementos, scale sutil em hover (1.02). Skeleton loading para dados da planilha.

**Typography System**: DM Sans para títulos (medium/bold), sistema sans-serif para corpo, Calibri simulado para preview das pulseiras.

<probability>0.05</probability>
</response>

---

<response>
## Ideia 3: "Neon Craftworks" — Estética Cyberpunk Artesanal

**Design Movement**: Neomorfismo escuro com toques de neon

**Core Principles**:
- Fundo escuro para destacar as cores das pulseiras
- Glow effects nas cores selecionadas
- Interface compacta e densa em informação
- Sensação de "painel de controle" futurista

**Color Philosophy**: Base em preto azulado (#0d1117) com superfícies em cinza escuro (#161b22). Acentos em ciano (#58a6ff) e magenta (#f778ba). As cores das pulseiras ganham efeito de glow contra o fundo escuro.

**Layout Paradigm**: Dashboard com grid de 3 colunas: dados da planilha | configuração | preview. Tudo visível simultaneamente sem scroll.

**Signature Elements**:
- Glow colorido ao redor dos previews de pulseira
- Bordas com gradiente sutil
- Contadores animados para quantidade de pedidos

**Interaction Philosophy**: Tudo em uma tela. Filtros rápidos por cor/tamanho. Atalhos de teclado para power users.

**Animation**: Glow pulsante nas cores selecionadas, transições com blur, contadores numéricos animados.

**Typography System**: Inter Tight para títulos, sistema monospace para dados, sans-serif para corpo.

<probability>0.04</probability>
</response>
