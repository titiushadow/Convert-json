const inputArquivo = document.getElementById('arquivo-json');
const fileNameDisplay = document.getElementById('file-name');
const conteudo = document.getElementById('conteudo');
let currentCardIndex = 0;
let cards = [];

const defaultTitle = "Convert JSON";

inputArquivo.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) {
    return;
  }

  // Obtém o nome do arquivo e exibe no elemento de exibição
  const fileName = file.name.replace(/\.[^/.]+$/, "");
  fileNameDisplay.textContent = fileName || defaultTitle;

  // Cria um leitor de arquivo
  const reader = new FileReader();
  reader.onload = () => {
    // Faz o parse do arquivo JSON
    const data = JSON.parse(reader.result);
    conteudo.innerHTML = '';

    const ordensProcessadas = new Set();
    let cardCount = 0;

    // Itera sobre as perguntas no JSON
    for (const pergunta of data) {
      if (!ordensProcessadas.has(pergunta.order)) {
        ordensProcessadas.add(pergunta.order);
        cardCount++;

        // Cria elementos HTML para exibir as perguntas
        const perguntaContainer = document.createElement('div');
        // Adiciona classes CSS ao contêiner da pergunta
        perguntaContainer.classList.add('mb-4', 'flex', 'justify-center');
        perguntaContainer.style.display = 'none'; 

        // Cria o link do card
        const cardLink = document.createElement('a');
        // Adiciona classes CSS ao link do card
        cardLink.classList.add('w-[800px]', 'h-[400px]', 'block', 'm-auto', 'p-6', 'border', 'border-gray-900', 'rounded-lg', 'shadow', 'dark:bg-gray-800', 'dark:border-gray-700', 'relative');
        perguntaContainer.appendChild(cardLink);

        // Cria o número do card
        const cardNumber = document.createElement('span');
        // Adiciona classes CSS ao número do card
        cardNumber.classList.add('absolute', 'top-0', 'left-0', 'bg-gray-900', 'font-bold', 'text-dark', 'm-0.5', 'px-2', 'py-1', 'rounded-md', 'bg-white');
        cardNumber.textContent = cardCount;
        cardLink.appendChild(cardNumber);

        // Cria o cabeçalho do card
        const header = document.createElement('h3');
        // Adiciona classes CSS ao cabeçalho do card
        header.classList.add('text-lg', 'font-bold', 'text-gray-900', 'dark:text-white', 'text-center', 'border-b-2', 'border-blue-500', 'py-2', 'w-full' ,'absolute', 'top-10', 'left-0', 'transform', '-translate-y-full'); 
        header.textContent = pergunta.sub_type.charAt(0).toUpperCase() + pergunta.sub_type.slice(1);
        cardLink.appendChild(header);

        // Cria o conteúdo do card
        const contentWrapper = document.createElement('div');
        // Adiciona classes CSS ao conteúdo do card
        contentWrapper.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'flex-1', 'py-4');
        cardLink.appendChild(contentWrapper);

        // Cria o botão de resposta
        const answerButton = document.createElement('button');
        // Adiciona classes CSS ao botão de resposta
        answerButton.classList.add('absolute', 'bottom-2', 'left-2', 'bg-blue-500', 'text-white', 'px-2', 'py-1', 'rounded');
        answerButton.textContent = 'Answer';
        contentWrapper.appendChild(answerButton);

        // Adiciona evento de clique ao botão de resposta
        answerButton.addEventListener('click', () => {
          // Verifica o tipo de pergunta e executa a lógica correspondente
          if (pergunta.sub_type === 'alternativas') {
            highlightCorrectAnswer(pergunta, contentWrapper);
          } else {
            const resposta = contentWrapper.querySelector('.resposta');
            if (resposta) {
              resposta.remove(); 
              const startEnd = contentWrapper.querySelector('.startEnd');
              if (startEnd) {
                startEnd.textContent = `${pergunta.start} ______ ${pergunta.end}`;
              }
            } else {
              const respostaParagrafo = document.createElement('p');
              respostaParagrafo.classList.add('resposta', 'mt-2', 'text-sm', 'text-gray-700', 'dark:text-gray-400', 'text-center');
              contentWrapper.appendChild(respostaParagrafo);
              const startEnd = contentWrapper.querySelector('.startEnd');
              if (startEnd) {
                startEnd.textContent = `${pergunta.start} ${pergunta.answer} ${pergunta.end}`;
              }
            }
          }
        });

        // Verifica se há uma próxima questão fonética
        const proximaQuestao = data.find(item => item.order === pergunta.order && item.type === 'fonetico');
        if (proximaQuestao) {
          // Cria e adiciona o elemento de áudio
          const audio = new Audio(proximaQuestao.audio);
          contentWrapper.appendChild(audio);
          // Cria e adiciona o ícone de reprodução
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

          // Adiciona funcionalidade de clique ao ícone de reprodução
          const togglePlayIcon = () => {
            if (audio.paused) {
              audio.play();
              path.setAttribute("d", "M6 4h3v16H6V4zm9 0h3v16h-3V4z");
            } else {
              audio.pause();
              path.setAttribute("d", "M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z");
            }
          };

          playIcon.addEventListener('click', togglePlayIcon);

          // Adiciona evento de término da reprodução de áudio
          audio.addEventListener('ended', () => {
            path.setAttribute("d", "M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z");
          });
        }

        // Cria e adiciona o título da pergunta
        const titulo = document.createElement('h5');
        // Adiciona classes CSS ao título da pergunta
        titulo.classList.add('mb-12', 'text-2xl', 'font-bold', 'tracking-tight', 'text-gray-900', 'dark:text-white', 'text-center', 'mt-8');
        titulo.textContent = pergunta.title;
        contentWrapper.appendChild(titulo);

        // Cria e adiciona o campo de preenchimento da pergunta
        if (pergunta.start && pergunta.end) {
          const startEnd = document.createElement('p');
          // Adiciona classes CSS ao campo de preenchimento da pergunta
          startEnd.classList.add('mb-2', 'text-lg', 'text-gray-700', 'dark:text-gray-400', 'text-center', 'startEnd');
          startEnd.textContent = `${pergunta.start} ______ ${pergunta.end}`;
          contentWrapper.appendChild(startEnd);
        }

        // Itera sobre as chaves da pergunta
        for (const key in pergunta) {
          if (pergunta[key] !== null && key !== 'id' && key !== 'created_at' && key !== 'subtitle' && key !== 'title' && key !== 'type' && key !== 'lesson_id' && key !== 'order' && key !== 'audio' && key !== 'sub_type' && key !== 'start' && key !== 'translate' && key !== 'end' && key !== 'answer' && !(key === 'size' && pergunta[key] === 4)) {
            const campo = document.createElement('p');
            // Adiciona classes CSS ao campo de pergunta
            campo.classList.add('text-sm', 'text-gray-700', 'dark:text-gray-400', 'text-center', 'mt-4'); 
            campo.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${pergunta[key]}`;
            contentWrapper.appendChild(campo);
            
            // Adiciona uma classe adicional para campos de alternativa
            if (key.match(/[a-z]/i)) {
              campo.classList.add('alternativa');
            }
          }
        }

        // Cria e adiciona o botão de tradução
        const translationButton = document.createElement('button');
        translationButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#1967D2" focusable="false" class="ep0rzf NMm5M"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"></path></svg>`;
        translationButton.classList.add('border', 'border-black', 'bg-white', 'block', 'mx-auto', 'mt-4', 'p-1', 'rounded-md', 'absolute', 'bottom-2', 'left-1/2', 'transform', '-translate-x-1/2'); 
        contentWrapper.appendChild(translationButton);

        // Adiciona funcionalidade de clique ao botão de tradução
        let translationVisible = false; 
        let translationParagraph;

        translationButton.addEventListener('click', async () => {
          // Mostra ou oculta a tradução
          if (translationVisible) {
            translationParagraph.remove();
            translationVisible = false;
          } else {
            const perguntasFoneticas = data.filter(item => item.type === 'fonetico');
            if (perguntasFoneticas.length > 0) {
              const perguntaFonetica = perguntasFoneticas.find(item => item.order === pergunta.order);
              if (perguntaFonetica && perguntaFonetica.translate !== null) {
                try {
                  const translation = await fetchTranslation(perguntaFonetica.translate);

                  translationParagraph = document.createElement('p');
                  translationParagraph.classList.add('text-center', 'text-white', 'dark:text-white', 'mt-2', 'translation-paragraph', 'text-lg');
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

        // Adiciona o contêiner da pergunta ao conteúdo
        conteudo.appendChild(perguntaContainer);
        cards.push(perguntaContainer);

        // Evento de clique para o botão "Next"
        const nextButtonLogic = document.createElement('button');
        nextButtonLogic.textContent = 'Next';
        nextButtonLogic.classList.add('bg-blue-500', 'text-white', 'px-2', 'py-1', 'rounded', 'absolute', 'bottom-2', 'right-2');
        conteudo.appendChild(nextButtonLogic);

        // Estilização botão de voltar
        const previousButtonLogic = document.createElement('button');
        previousButtonLogic.textContent = 'Previous';
        previousButtonLogic.classList.add('bg-blue-500', 'text-white', 'px-2', 'py-1', 'rounded', 'absolute', 'bottom-2', 'right-20');
        conteudo.appendChild(previousButtonLogic);

        contentWrapper.appendChild(previousButtonLogic);
        conteudo.appendChild(perguntaContainer);

        contentWrapper.appendChild(nextButtonLogic);
        conteudo.appendChild(perguntaContainer);

        // Logica para botão next
        nextButtonLogic.addEventListener('click', () => {
          // Oculta o card atual
          cards[currentCardIndex].style.display = 'none';
          
          // Atualiza o índice para o próximo card
          currentCardIndex++;

          // Verifica se chegamos ao final dos cards, se sim, volta para o primeiro
          if (currentCardIndex >= cards.length) {
            currentCardIndex = 0;
          }

          // Exibe o próximo card
          cards[currentCardIndex].style.display = 'block';
        });

        // Logica para botão previous
        previousButtonLogic.addEventListener('click', () => {
          // Oculta o card atual
          cards[currentCardIndex].style.display = 'none';
          
          // Atualiza o índice para o próximo card
          currentCardIndex--;

          // Verifica se chegamos ao final dos cards, se sim, volta para o primeiro
          if (currentCardIndex >= cards.length) {
            currentCardIndex = 0;
          }

          // Exibe o card anterior
          cards[currentCardIndex].style.display = 'block';
        });

      }
    } 
    // Exibe o primeiro cartão após carregar os dados
    if (cards.length > 0) {
      cards[currentCardIndex].style.display = 'block';
    }
  };
  reader.readAsText(file);
});

// Define o título padrão
fileNameDisplay.textContent = defaultTitle;

// Função para buscar tradução
async function fetchTranslation(text) {
  // Simula uma busca de tradução usando uma API externa, por exemplo
  return text; 
}

// Função para destacar a resposta correta
function highlightCorrectAnswer(pergunta, contentWrapper) {
  const resposta = contentWrapper.querySelector('.resposta');
  if (resposta) {
    return;
  }

  const correctAnswer = pergunta.answer.toUpperCase();
  const alternativeElements = contentWrapper.querySelectorAll('.alternativa');

  for (const element of alternativeElements) {
    const answerLetter = element.textContent.trim().charAt(0).toUpperCase();

    if (answerLetter === correctAnswer) {
      element.style.color = 'lightgreen';
    }
  }
}
