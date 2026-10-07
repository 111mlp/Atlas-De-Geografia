# Atlas Orbit

Página cartográfica responsiva em **HTML, CSS e JavaScript puros**, sem framework, dependências de runtime ou compilação. Interface em português, com navegação por camadas, temas claro/escuro e uma projeção de mapa que se mantém constante entre as seleções.

## Executar

- Abra `index.html` no navegador. Para abrir via HTTP em localhost: `python3 -m http.server 8080` neste diretório e visite `http://localhost:8080`.
- No preview Atlas Orbit, o mapa gerado fica em armazenamento do projeto. O arquivo `assets/world-map.svg` está incluído como fallback/fonte vetorial local e é mostrado automaticamente ao abrir `index.html` com `file://`.

## Trocar a imagem do mapa

Edite `assets/world-map.svg` em qualquer editor vetorial/textual, ou coloque sua própria imagem na pasta `assets`. Em `index.html`, atualize a tag `<img id="world-map" ...>` para apontar ao novo arquivo e ajuste `data-fallback` para o caminho local correspondente. **Não há troca da imagem ao selecionar outra camada:** navegação modifica a apresentação visual por CSS, mantendo o mesmo elemento de imagem.

## Editar textos

Cada camada tem seu próprio conteúdo placeholder no objeto `sections` em `script.js` (título, parágrafo, cartão informativo e rótulos). Substitua o Lorem Ipsum pelos textos finais sem modificar o mecanismo de transição.

## Arquivos

- `index.html` — estrutura semântica e metadados.
- `styles.css` — temas, componentes, estados, layout móvel e animações.
- `script.js` — seleção das camadas, persistência do tema e controles de teclado.
- `assets/world-map.svg` — mapa vetorial de base editável.
- `manus-routes.json` — rota inicial servida pelo Preview.
