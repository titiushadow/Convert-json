const inputArquivo = document.getElementById('arquivo-json');
const fileNameDisplay = document.getElementById('file-name');

const defaultTitle = "Convert JSON";

inputArquivo.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) {
    return;
  }

  const fileName = file.name.replace(/\.[^/.]+$/, "");

  fileNameDisplay.textContent = fileName || defaultTitle; 

  const reader = new FileReader();
  reader.onload = () => {
    const data = JSON.parse(reader.result);
    const conteudo = document.getElementById('conteudo');
    conteudo.innerHTML = ''; 

    const ordensProcessadas = new Set(); 
    let cardCount = 0;

    for (const pergunta of data) {
      // Verifica se a ordem já foi processada
      if (!ordensProcessadas.has(pergunta.order)) {
        ordensProcessadas.add(pergunta.order); // Adiciona a ordem ao conjunto de ordens processadas
        cardCount++; // Incrementa o contador de cartões

        // Cria um container para a pergunta
        const perguntaContainer = document.createElement('div');
        perguntaContainer.classList.add('mb-4', 'flex', 'justify-center'); // Centraliza os cards horizontalmente

        // Cria o link que será o card
        const cardLink = document.createElement('a');
        cardLink.classList.add('w-[500px]', 'h-[250px]', 'block', 'max-w-2xl', 'p-6', 'border', 'border-gray-900', 'rounded-lg', 'shadow', 'dark:bg-gray-800', 'dark:border-gray-700', 'relative');
        perguntaContainer.appendChild(cardLink);

        // Cria o número do card no canto superior esquerdo
        const cardNumber = document.createElement('span');
        cardNumber.classList.add('absolute', 'top-0', 'left-0', 'bg-gray-900', 'font-bold', 'text-dark', 'm-0.5', 'px-2', 'py-1', 'rounded-md', 'bg-white');
        cardNumber.textContent = cardCount; // Define o número do card
        cardLink.appendChild(cardNumber);

        // Estilização do header
        const header = document.createElement('h3');
        header.classList.add('text-lg', 'font-bold', 'text-gray-900', 'dark:text-white', 'text-center', 'border-b-2', 'border-blue-500', 'py-2', 'w-full' ,'absolute', 'top-10', 'left-0', 'transform', '-translate-y-full'); 
        header.textContent = pergunta.sub_type.charAt(0).toUpperCase() + pergunta.sub_type.slice(1);
        cardLink.appendChild(header);

        // Estilização do conteúdo abaixo do header
        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'flex-1', 'py-4');
        cardLink.appendChild(contentWrapper);

        // Botão para exibir a resposta
        const answerButton = document.createElement('button');
        answerButton.classList.add('absolute', 'bottom-2', 'left-2', 'bg-blue-500', 'text-white', 'px-2', 'py-1', 'rounded');
        answerButton.textContent = 'Answer';
        contentWrapper.appendChild(answerButton);

        // Função para exibir a resposta ao clicar no botão 'Answer'
        answerButton.addEventListener('click', () => {
          // Verifica se a resposta já está visível
          const resposta = contentWrapper.querySelector('.resposta');
          if (resposta) {
            resposta.remove(); 
            // Restaura os traços entre os valores de 'start' e 'end'
            const startEnd = contentWrapper.querySelector('.startEnd');
            if (startEnd) {
              startEnd.textContent = `${pergunta.start} ______ ${pergunta.end}`;
            }
          } else {
            // Cria um parágrafo para exibir a resposta
            const respostaParagrafo = document.createElement('p');
            respostaParagrafo.classList.add('resposta', 'mt-2', 'text-sm', 'text-gray-700', 'dark:text-gray-400', 'text-center');
            contentWrapper.appendChild(respostaParagrafo);

            // Substitui os traços entre os valores de 'start' e 'end' pela resposta
            const startEnd = contentWrapper.querySelector('.startEnd');
            if (startEnd) {
              startEnd.textContent = `${pergunta.start} ${pergunta.answer} ${pergunta.end}`;
            }
          }
        });

        // Adiciona o resto do conteúdo abaixo do botão de resposta
        const proximaQuestao = data.find(item => item.order === pergunta.order && item.type === 'fonetico');
        if (proximaQuestao) {
      
          const audio = new Audio(proximaQuestao.audio);
          contentWrapper.appendChild(audio);
          const playIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          playIcon.setAttribute("class", "w-6 h-6 text-gray-800 dark:text-white cursor-pointer absolute top-[47px] right-2 border-2 rounded-lg border-gray-900 dark:border-gray-600");
          playIcon.setAttribute("aria-hidden", "true");
          playIcon.setAttribute("fill", "currentColor");
          playIcon.setAttribute("viewBox", "0 0 24 24");
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("fill-rule", "evenodd");
          path.setAttribute("d", "M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z");
          path.setAttribute("clip-rule", "evenodd");
          playIcon.appendChild(path);
          contentWrapper.appendChild(playIcon);

          // Função para controlar o estado do ícone de reprodução
          const togglePlayIcon = () => {
            if (audio.paused) {
              audio.play();
              path.setAttribute("d", "M6 4h3v16H6V4zm9 0h3v16h-3V4z");
            } else {
              audio.pause();
              path.setAttribute("d", "M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z");
            }
          };

          // Adiciona o evento de reprodução de áudio ao clicar no ícone
          playIcon.addEventListener('click', togglePlayIcon);

          // Adiciona o evento para controlar o estado do ícone de reprodução quando o áudio terminar
          audio.addEventListener('ended', () => {
            path.setAttribute("d", "M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z");
          });
        }

        // Título da pergunta
        const titulo = document.createElement('h5');
        titulo.classList.add('mb-2', 'text-2xl', 'font-bold', 'tracking-tight', 'text-gray-900', 'dark:text-white', 'text-center', 'mt-8'); // Texto centralizado
        titulo.textContent = pergunta.title;
        contentWrapper.appendChild(titulo);

        // Adiciona os valores de 'start' e 'end' abaixo do título
        if (pergunta.start && pergunta.end) {
          const startEnd = document.createElement('p');
          startEnd.classList.add('mb-2', 'text-sm', 'text-gray-700', 'dark:text-gray-400', 'text-center', 'startEnd'); // Texto centralizado
          startEnd.textContent = `${pergunta.start} ______ ${pergunta.end}`;
          contentWrapper.appendChild(startEnd);
        }

        // Adiciona os outros campos (que foram removidos anteriormente) à interface
        for (const key in pergunta) {
          if (pergunta[key] !== null && key !== 'id' && key !== 'created_at' && key !== 'title' && key !== 'type' && key !== 'lesson_id' && key !== 'order' && key !== 'audio' && key !== 'sub_type' && key !== 'start' && key !== 'translate' && key !== 'end' && key !== 'answer' && !(key === 'size' && pergunta[key] === 4)) {
            const campo = document.createElement('p');
            campo.classList.add('text-sm', 'text-gray-700', 'dark:text-gray-400', 'text-center'); // Texto centralizado
            campo.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${pergunta[key]}`;
            contentWrapper.appendChild(campo);
          }
        }

        // Adiciona o botão de tradução
        const translationButton = document.createElement('button');
        translationButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#1967D2" focusable="false" class="ep0rzf NMm5M"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"></path></svg>`;
        translationButton.classList.add('border', 'border-black', 'bg-white', 'block', 'mx-auto', 'mt-4', 'p-1', 'rounded-md'); 
        contentWrapper.appendChild(translationButton);

        let translationVisible = false; 
        let translationParagraph;

        // Função para adicionar ou remover a tradução ao clicar no botão de tradução
        translationButton.addEventListener('click', async () => {
          // Se a tradução estiver visível, remove-a
          if (translationVisible) {
              translationParagraph.remove();
              translationVisible = false;
          } else {
              // Se a tradução não estiver visível e existir uma tradução disponível
              const perguntasFoneticas = data.filter(item => item.type === 'fonetico');
              if (perguntasFoneticas.length > 0) {
                  const perguntaFonetica = perguntasFoneticas.find(item => item.order === pergunta.order);
                  if (perguntaFonetica && perguntaFonetica.translate !== null) {
                      // Busca a tradução fonética
                      try {
                          const translation = await fetchTranslation(perguntaFonetica.translate);

                          translationParagraph = document.createElement('p');
                          translationParagraph.classList.add('text-center', 'text-gray-700', 'dark:text-gray-400', 'mt-2', 'translation-paragraph');
                          translationParagraph.textContent = `${translation.charAt(0).toUpperCase() + translation.slice(1).toLowerCase()}`;
      
                          contentWrapper.insertBefore(translationParagraph, translationButton);
      
                          translationVisible = true; 
                      } catch (error) {
                          console.error('Erro ao buscar a tradução:', error);
                      }
                  } else {
                      console.error('Pergunta fonética não encontrada ou não possui tradução.');
                  }
              } else {
                  console.error('Não há perguntas do tipo fonético no JSON.');
              }
          }
      });

        conteudo.appendChild(perguntaContainer);
      }
    } 
  };
  reader.readAsText(file);
});

fileNameDisplay.textContent = defaultTitle;

async function fetchTranslation(text) {

  // retorna a tradução da pergunta
  return text; 
}
