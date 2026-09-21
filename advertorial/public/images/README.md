# Imagens do advertorial

Coloque os arquivos abaixo diretamente nesta pasta (`public/images/`), com estes nomes exatos.
Enquanto um arquivo não existir, a página mostra um placeholder visual no lugar — nada quebra.

**Versão atual da página usa exatamente 3 imagens:**

| Arquivo               | Onde aparece                          | Conteúdo | Peso alvo |
|------------------------|----------------------------------------|----------|-----------|
| `hero-tenis.webp`      | Imagem principal, topo da matéria (abertura) | 1 par preto + 1 par branco/turquesa, pista de atletismo | até 150KB |
| `tenis-cores.webp`     | Seção "cores disponíveis", no meio do corpo do texto | 4 tênis individuais: preto, branco/turquesa, cinza/turquesa, rosa | até 150KB |
| `tenis-kit-par.webp`   | Bloco de encerramento, logo antes da oferta | 1 par branco/turquesa + 1 par rosa, ambiente residencial | até 150KB |

Os arquivos abaixo tinham prompt de geração de imagem já preparado, mas não são usados na página atual (ela usa só as 3 acima). Ficam aqui como opcionais para o futuro:

| Arquivo               | Uso original                          |
|------------------------|----------------------------------------|
| `tenis-sola.webp`      | Detalhe do solado                      |
| `tenis-academia.webp`  | Cenário de uso — academia              |
| `tenis-caminhada.webp` | Cenário de uso — caminhada             |
| `tenis-detalhes.webp`  | Detalhe de acabamento/materiais        |

Recomendações:

- Formato `.webp` (ou `.avif`) para peso menor. Se só tiver `.jpg`/`.png`, dá para usar — só trocar a extensão no `src` da tag `<img>` correspondente em `index.html`.
- Fotos do próprio produto (fundo neutro para os closes de sola/detalhes; contexto real para academia/caminhada) tendem a converter melhor que imagens genéricas de banco de imagens.
- Evite arquivos acima de ~150KB — a página foi construída para carregar rápido em anúncios pagos.
