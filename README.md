# Atlas Orbit

Página cartográfica responsiva em **HTML, CSS e JavaScript puros**, sem framework, dependências de runtime ou compilação. Interface em português, com navegação por camadas, temas claro/escuro e uma projeção de mapa que se mantém constante entre as seleções.

## Executar

- Abra `index.html` no navegador. Para abrir via HTTP em localhost: `python3 -m http.server 8080` neste diretório e visite `http://localhost:8080`.
- No preview Atlas Orbit, o mapa gerado fica em armazenamento do projeto. O arquivo `assets/world-map.svg` está incluído como fallback/fonte vetorial local e é mostrado automaticamente ao abrir `index.html` com `file://`.

## Editar textos

Cada camada tem seu próprio conteúdo placeholder no objeto `sections` em `data.js` (título, parágrafo, cartão informativo e rótulos).

## Arquivos

- `index.html` — estrutura semântica e metadados.
- `styles.css` — temas, componentes, estados, layout móvel e animações.
- `app.js` — seleção das camadas, persistência do tema e controles de teclado.
- `data.js` — onde estão os textos.


## Desenvolvedores

Desenvolvido por:<BR> 
- Ana Beatriz Rossi<br>
- Antonella Januário<BR>
- Beatriz Masschio<BR>
- Eduardo Augusto<BR>
- Jhonatan Augusto<BR>
- Klara Guimarães<br>
- Lorena Andrade<BR>
- Maria Clara Bertellini<br>
- Mayana Cruz<BR>
- Vitória Vasconcelos
