/**
 * Configuração central da Landing Page — Tênis Speed
 * Edite SOMENTE este arquivo para trocar imagens, tamanhos, checkout e avaliações.
 * Nada aqui deve exigir mexer no HTML/CSS.
 */

/* ==========================================================================
   GALERIA — seleção editorial inicial (aparece antes de escolher uma cor)
   Usa todas as fotos oficiais do produto (assets/landing/produto/),
   intercalando as 4 cores em vez de agrupar cor por cor.
   ========================================================================== */
const GALLERY_IMAGES = [
  { src: "assets/landing/produto/preto-1.webp", alt: "Tênis SPEED preto — foto 1" },
  { src: "assets/landing/produto/branco-1.webp", alt: "Tênis SPEED branco/turquesa — foto 1" },
  { src: "assets/landing/produto/cinza-1.webp", alt: "Tênis SPEED cinza/turquesa — foto 1" },
  { src: "assets/landing/produto/rosa-1.webp", alt: "Tênis SPEED rosa — foto 1" },
  { src: "assets/landing/produto/preto-2.webp", alt: "Tênis SPEED preto — foto 2" },
  { src: "assets/landing/produto/branco-2.webp", alt: "Tênis SPEED branco/turquesa — foto 2" },
  { src: "assets/landing/produto/cinza-2.webp", alt: "Tênis SPEED cinza/turquesa — foto 2" },
  { src: "assets/landing/produto/rosa-2.webp", alt: "Tênis SPEED rosa — foto 2" },
  { src: "assets/landing/produto/preto-3.webp", alt: "Tênis SPEED preto — foto 3" },
  { src: "assets/landing/produto/branco-3.webp", alt: "Tênis SPEED branco/turquesa — foto 3" },
  { src: "assets/landing/produto/cinza-3.webp", alt: "Tênis SPEED cinza/turquesa — foto 3" },
  { src: "assets/landing/produto/rosa-3.webp", alt: "Tênis SPEED rosa — foto 3" },
  { src: "assets/landing/produto/preto-4.webp", alt: "Tênis SPEED preto — foto 4" },
  { src: "assets/landing/produto/branco-4.webp", alt: "Tênis SPEED branco/turquesa — foto 4" },
  { src: "assets/landing/produto/cinza-4.webp", alt: "Tênis SPEED cinza/turquesa — foto 4" },
  { src: "assets/landing/produto/rosa-4.webp", alt: "Tênis SPEED rosa — foto 4" },
  { src: "assets/landing/produto/preto-5.webp", alt: "Tênis SPEED preto — foto 5" },
  { src: "assets/landing/produto/branco-5.webp", alt: "Tênis SPEED branco/turquesa — foto 5" },
  { src: "assets/landing/produto/preto-6.webp", alt: "Tênis SPEED preto — foto 6" },
  { src: "assets/landing/produto/branco-6.webp", alt: "Tênis SPEED branco/turquesa — foto 6" },
  { src: "assets/landing/produto/preto-7.webp", alt: "Tênis SPEED preto — foto 7" },
];

/* ==========================================================================
   GALERIA POR COR
   Todas as fotos reais de cada variante. Ao escolher a cor do Par 1, a
   galeria passa a priorizar as fotos dessa cor (isso é só um apoio visual —
   não afeta a seleção do Par 2).
   ========================================================================== */
const PRODUCT_IMAGES = {
  preto: [
    "assets/landing/produto/preto-1.webp",
    "assets/landing/produto/preto-2.webp",
    "assets/landing/produto/preto-3.webp",
    "assets/landing/produto/preto-4.webp",
    "assets/landing/produto/preto-5.webp",
    "assets/landing/produto/preto-6.webp",
    "assets/landing/produto/preto-7.webp",
  ],
  "branco-turquesa": [
    "assets/landing/produto/branco-1.webp",
    "assets/landing/produto/branco-2.webp",
    "assets/landing/produto/branco-3.webp",
    "assets/landing/produto/branco-4.webp",
    "assets/landing/produto/branco-5.webp",
    "assets/landing/produto/branco-6.webp",
  ],
  "cinza-turquesa": [
    "assets/landing/produto/cinza-1.webp",
    "assets/landing/produto/cinza-2.webp",
    "assets/landing/produto/cinza-3.webp",
    "assets/landing/produto/cinza-4.webp",
  ],
  rosa: [
    "assets/landing/produto/rosa-1.webp",
    "assets/landing/produto/rosa-2.webp",
    "assets/landing/produto/rosa-3.webp",
    "assets/landing/produto/rosa-4.webp",
  ],
};

/* ==========================================================================
   CORES DISPONÍVEIS
   "image" é a foto real usada como miniatura do seletor (close/produto
   isolado, não lifestyle). "swatch" é o fallback de cor caso a foto não
   carregue.
   ========================================================================== */
const COLOR_OPTIONS = [
  {
    id: "preto",
    label: "Preto",
    swatch: "#1c1c1e",
    image: "assets/landing/produto/preto-4.webp",
  },
  {
    id: "branco-turquesa",
    label: "Branco/Turquesa",
    swatch: "linear-gradient(135deg, #ffffff 50%, #12b4a6 50%)",
    image: "assets/landing/produto/branco-1.webp",
  },
  {
    id: "cinza-turquesa",
    label: "Cinza/Turquesa",
    swatch: "linear-gradient(135deg, #9aa1a9 50%, #12b4a6 50%)",
    image: "assets/landing/produto/cinza-1.webp",
  },
  {
    id: "rosa",
    label: "Rosa",
    swatch: "#f0a8c4",
    image: "assets/landing/produto/rosa-4.webp",
  },
];

/* ==========================================================================
   NA VIDA REAL — FOTOS (não usado pela seção "Veja o SPEED na vida real"
   desde 17/08/2026, quando ela passou a mostrar vídeos — ver
   REALLIFE_VIDEOS logo abaixo). Mantido de propósito, sem apagar nada:
   nenhuma foto foi removida do projeto, essas 20 imagens continuam em
   assets/landing/avaliacoes/. Chave = id da cor (mesmos ids de
   COLOR_OPTIONS).
   ========================================================================== */
const REALLIFE_PHOTOS = {
  preto: [
    { src: "assets/landing/avaliacoes/vida-real-preto-1.webp", alt: "Tênis SPEED preto — foto real de comprador" },
    { src: "assets/landing/avaliacoes/vida-real-preto-2.webp", alt: "Tênis SPEED preto — foto real de comprador" },
    { src: "assets/landing/avaliacoes/vida-real-preto-3.webp", alt: "Tênis SPEED preto — foto real de comprador" },
    { src: "assets/landing/avaliacoes/vida-real-preto-4.webp", alt: "Tênis SPEED preto — foto real de comprador" },
    { src: "assets/landing/avaliacoes/vida-real-preto-5.webp", alt: "Tênis SPEED preto — foto real de comprador" },
  ],
  "branco-turquesa": [
    { src: "assets/landing/avaliacoes/vida-real-branco-1.webp", alt: "Tênis SPEED branco/turquesa — foto real de comprador" },
    { src: "assets/landing/avaliacoes/vida-real-branco-2.webp", alt: "Tênis SPEED branco/turquesa — foto real de comprador" },
    { src: "assets/landing/avaliacoes/vida-real-branco-3.webp", alt: "Tênis SPEED branco/turquesa — foto real de comprador" },
    { src: "assets/landing/avaliacoes/vida-real-branco-4.webp", alt: "Tênis SPEED branco/turquesa — foto real de comprador" },
    { src: "assets/landing/avaliacoes/vida-real-branco-5.webp", alt: "Tênis SPEED branco/turquesa — foto real de comprador" },
    { src: "assets/landing/avaliacoes/vida-real-branco-6.webp", alt: "Tênis SPEED branco/turquesa — foto real de comprador" },
  ],
  "cinza-turquesa": [
    { src: "assets/landing/avaliacoes/vida-real-cinza-1.webp", alt: "Tênis SPEED cinza/turquesa — foto real de comprador" },
    { src: "assets/landing/avaliacoes/vida-real-cinza-2.webp", alt: "Tênis SPEED cinza/turquesa — foto real de comprador" },
    { src: "assets/landing/avaliacoes/vida-real-cinza-3.webp", alt: "Tênis SPEED cinza/turquesa — foto real de comprador" },
    { src: "assets/landing/avaliacoes/vida-real-cinza-4.webp", alt: "Tênis SPEED cinza/turquesa — foto real de comprador" },
    { src: "assets/landing/avaliacoes/vida-real-cinza-5.webp", alt: "Tênis SPEED cinza/turquesa — foto real de comprador" },
  ],
  rosa: [
    { src: "assets/landing/avaliacoes/vida-real-rosa-1.webp", alt: "Tênis SPEED rosa — foto real de comprador" },
    { src: "assets/landing/avaliacoes/vida-real-rosa-2.webp", alt: "Tênis SPEED rosa — foto real de comprador" },
    { src: "assets/landing/avaliacoes/vida-real-rosa-3.webp", alt: "Tênis SPEED rosa — foto real de comprador" },
    { src: "assets/landing/avaliacoes/vida-real-rosa-4.webp", alt: "Tênis SPEED rosa — foto real de comprador" },
  ],
};

/* ==========================================================================
   NA VIDA REAL — VÍDEOS (usado pela seção "Veja o SPEED na vida real")
   Galeria geral, sem organização por cor (mudou em 18/08/2026 — antes cada
   vídeo era associado a uma cor/filtro; o cliente pediu pra remover isso,
   já que nem toda cor tem vídeo). Sempre exatamente 4 itens, cada um com:
     { caption: "texto pequeno mostrado abaixo do vídeo", src: "...", poster: "..." }
   Coloque os arquivos em Landing Page/assets/landing/videos/ com os nomes
   video-1.mp4 .. video-4.mp4. Se um item tiver "src: null", o card mostra
   o placeholder tracejado direto (sem tentar tocar).
   Os 4 são vídeos reais do cliente (tocam com áudio, H.264/AAC) — não são
   mais rotulados por cor porque a seção deixou de usar cor. O vídeo 4
   (18/08/2026) é "Tenis Speed video 3.mp4" da pasta de origem — o mesmo
   arquivo mostra branco → rosa → preto em sequência, sem problema agora
   que não há mais associação de vídeo com cor específica.
   ========================================================================== */
const REALLIFE_VIDEOS = [
  {
    caption: "Detalhes do SPEED",
    src: "assets/landing/videos/video-1.mp4",
    poster: "assets/landing/videos/poster-1.webp",
  },
  {
    caption: "SPEED no dia a dia",
    src: "assets/landing/videos/video-3.mp4",
    poster: "assets/landing/videos/poster-3.webp",
  },
  {
    caption: "Veja de perto",
    src: "assets/landing/videos/video-2.mp4",
    poster: "assets/landing/videos/poster-2.webp",
  },
  {
    caption: "Veja como fica no pé",
    src: "assets/landing/videos/video-4.mp4",
    poster: "assets/landing/videos/poster-4.webp",
  },
];

/* ==========================================================================
   TAMANHOS DISPONÍVEIS — tabela de medidas real, confirmada pelo cliente.
   Par 1 e Par 2 usam esta mesma lista, de forma independente.
   ========================================================================== */
const AVAILABLE_SIZES = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44];

/* Guia de tamanhos — imagem real da tabela de medidas (mostrada em modal) */
const SIZE_GUIDE_IMAGE = "assets/landing/produto/tabela-medidas.webp";

/* ==========================================================================
   FOTO DA COMBINAÇÃO NO CHECKOUT
   Imagem com os dois tênis juntos, por combinação de cores (a ordem dos pares
   não importa: "preto|rosa" e "rosa|preto" usam a mesma foto).
   ========================================================================== */
const COMBO_IMAGE_DIR = "assets/landing/combinacoes/";
const COMBO_IMAGES = {
  "preto|preto": "preto-preto.webp",
  "preto|branco-turquesa": "preto-branco-turquesa.webp",
  "preto|cinza-turquesa": "preto-cinza-turquesa.webp",
  "preto|rosa": "preto-rosa.webp",
  "branco-turquesa|preto": "preto-branco-turquesa.webp",
  "branco-turquesa|branco-turquesa": "branco-turquesa-branco-turquesa.webp",
  "branco-turquesa|cinza-turquesa": "branco-turquesa-cinza-turquesa.webp",
  "branco-turquesa|rosa": "branco-turquesa-rosa.webp",
  "cinza-turquesa|preto": "preto-cinza-turquesa.webp",
  "cinza-turquesa|branco-turquesa": "branco-turquesa-cinza-turquesa.webp",
  "cinza-turquesa|cinza-turquesa": "cinza-turquesa-cinza-turquesa.webp",
  "cinza-turquesa|rosa": "cinza-turquesa-rosa.webp",
  "rosa|preto": "preto-rosa.webp",
  "rosa|branco-turquesa": "branco-turquesa-rosa.webp",
  "rosa|cinza-turquesa": "cinza-turquesa-rosa.webp",
  "rosa|rosa": "rosa-rosa.webp",
};

/* ==========================================================================
   CHECKOUT PIX (gateway ADEX, via backend api-tenis-speed)
   URL pública do backend, sem barra no final. Em desenvolvimento aponta pro
   backend local. Hoje aponta pro backend no Railway.
   ========================================================================== */
const API_URL = "https://api-tenis-speed-production.up.railway.app";

/* Total da oferta exibido no checkout (o valor cobrado de verdade é definido
   no servidor). */
const OFFER_TOTAL_LABEL = "R$149,90";

/* ==========================================================================
   AVALIAÇÕES
   Enviadas pelo cliente (16/08/2026). Fotos são reais de compradores
   ("Review X.X" da pasta de origem), copiadas pra
   assets/landing/avaliacoes/review-0N-*.webp — não usar fotos comerciais
   do produto (produto/) aqui. Formato de cada item:
   {
     name: "Nome",
     rating: 5,
     color: "Cinza/Turquesa",
     text: "Comentário...",
     images: ["assets/landing/avaliacoes/arquivo1.webp", "assets/landing/avaliacoes/arquivo2.webp"]
   }
   "images" é opcional e aceita 0, 1 ou várias fotos (array vazio ou omitido
   = sem foto, card mostra só nota, nome e texto). A primeira vira a foto do
   card; as demais (se houver) aparecem como miniaturas abaixo do texto.
   Clicar em qualquer foto abre um lightbox pra navegar entre as fotos
   daquela avaliação.
   ========================================================================== */
const REVIEWS = [
  {
    name: "Sandra Mendes",
    rating: 5,
    color: "Cinza/Turquesa",
    text: "Chegou certinho e antes do que eu esperava. Gostei bastante do tênis, achei leve e confortável para caminhar.",
    images: ["assets/landing/avaliacoes/review-01-a.png", "assets/landing/avaliacoes/review-01-b.png"],
  },
  {
    name: "Nina Duarte",
    rating: 5,
    color: "Cinza/Turquesa",
    text: "Gostei muito. O cinza é bonito pessoalmente e ficou certinho no pé. Estou usando para caminhada e academia.",
    images: ["assets/landing/avaliacoes/review-02-a.png"],
  },
  {
    name: "Antônia Guedes",
    rating: 5,
    color: "Rosa",
    text: "Achei o rosa muito bonito, igual eu esperava. Ficou confortável no pé e não achei pesado.",
    images: ["assets/landing/avaliacoes/review-03-a.png", "assets/landing/avaliacoes/review-03-b.png"],
  },
  {
    name: "Patrícia Mendes",
    rating: 5,
    color: "Rosa",
    text: "Comprei o rosa e gostei bastante. Uso mais para caminhada e para sair no dia a dia, achei bem confortável.",
    images: ["assets/landing/avaliacoes/review-04-a.png"],
  },
  {
    name: "Dácio da Rocha",
    rating: 5,
    color: "Branco/Turquesa",
    text: "Tênis bem leve e confortável. Já usei algumas vezes para caminhar e até agora estou gostando bastante.",
    images: ["assets/landing/avaliacoes/review-05-a.png"],
  },
  {
    name: "Valéria Alves",
    rating: 5,
    color: "Branco/Turquesa",
    text: "O branco com azul é lindo pessoalmente. Tênis leve e macio, gostei bastante da compra.",
    images: ["assets/landing/avaliacoes/review-06-a.png", "assets/landing/avaliacoes/review-06-b.png"],
  },
  {
    name: "Caio Morgado",
    rating: 5,
    color: "Preto",
    text: "Peguei o preto para academia e caminhada. Gostei do acabamento e ficou confortável no meu pé.",
    images: ["assets/landing/avaliacoes/review-07-a.png", "assets/landing/avaliacoes/review-07-b.png"],
  },
  {
    name: "Rita Camilo",
    rating: 5,
    text: "Chegou tudo certo. Pelo valor achei que compensou bastante, principalmente levando dois pares.",
  },
  {
    name: "Cleide Farias",
    rating: 5,
    text: "Gostei muito dos tênis. São leves e confortáveis para usar durante o dia. A numeração ficou boa para mim.",
  },
  {
    name: "Ailê Bernardes",
    rating: 5,
    text: "Estou usando principalmente para caminhada. Achei confortável e bonito, compraria novamente.",
  },
];

/* Quantas avaliações mostrar antes do botão "Ler mais" */
const REVIEWS_PAGE_SIZE = 6;

/* ==========================================================================
   DISPONIBILIDADE (ESTOQUE)
   Não inventar quantidade. Enquanto STOCK_QUANTITY for null, o bloco mostra
   só "Em estoque" (sem número, sem barra). Quantidade real confirmada pelo
   cliente em 18/09/2026.
   STOCK_BAR_PERCENT é só o preenchimento visual da barrinha abaixo do texto
   (não representa um "estoque total" divulgado em lugar nenhum) — ajuste
   livremente pra deixar a barra mais ou menos cheia.
   ========================================================================== */
const STOCK_QUANTITY = 74;
const STOCK_BAR_PERCENT = 55;

/* ==========================================================================
   FORMAS DE PAGAMENTO
   Vazio até você confirmar quais formas o checkout realmente vai aceitar.
   Cada item: { label: "Pix" }. A faixa fica escondida enquanto estiver
   vazio — sem inventar meio de pagamento nem copiar logo de referência.
   ========================================================================== */
const PAYMENT_METHODS = [{ label: "Pix" }];

/* ==========================================================================
   FRETE — confirmado pelo cliente (17/08/2026).
   Linha 1: SHIPPING_BOLD (negrito) + SHIPPING_NORMAL (peso normal), mesma
   frase. Linha 2: SHIPPING_HIGHLIGHT, em verde e negrito.
   ========================================================================== */
const SHIPPING_BOLD = "Frete Grátis";
const SHIPPING_NORMAL = "Via Correios Expresso";
const SHIPPING_HIGHLIGHT = "para todo o Brasil";

/* ==========================================================================
   DEVOLUÇÕES — confirmado pelo cliente (17/08/2026).
   RETURNS_TITLE em verde e negrito. As duas linhas seguintes em texto
   escuro normal.
   ========================================================================== */
const RETURNS_TITLE = "Devoluções Gratuitas";
const RETURNS_LINE_1 = "Estorno de 100% do seu dinheiro";
const RETURNS_LINE_2 = "7 dias após o recebimento da mercadoria.";

/* ==========================================================================
   SELO DE CREDIBILIDADE — imagem real do selo "Líder Platinum" do vendedor.
   Mostrado na coluna de informações do produto, logo abaixo dos blocos de
   pagamento/frete/trocas. Não recriar o conteúdo dessa imagem em HTML/CSS —
   é uma imagem única.
   ========================================================================== */
const TRUST_BADGE_IMAGE = "assets/landing/lider-platinum.png";
