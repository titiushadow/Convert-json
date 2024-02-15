const inputArquivo = document.getElementById('arquivo-json');

inputArquivo.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const data = JSON.parse(reader.result);
    const conteudo = document.getElementById('conteudo');
    conteudo.innerHTML = ''; // Limpar a interface

    const ordensProcessadas = new Set(); // Conjunto para armazenar as ordens que já foram processadas

    for (const pergunta of data) {
      // Verifica se a ordem já foi processada
      if (!ordensProcessadas.has(pergunta.order)) {
        ordensProcessadas.add(pergunta.order); // Adiciona a ordem ao conjunto de ordens processadas

        // Cria um container para a pergunta
        const perguntaContainer = document.createElement('div');
        perguntaContainer.classList.add('mb-4', 'flex', 'justify-center'); // Centraliza os cards horizontalmente

        // Cria o link que será o card
        const cardLink = document.createElement('a');
        cardLink.href = '#';
        cardLink.classList.add('block', 'max-w-2xl', 'p-6', 'bg-white', 'border', 'border-gray-200', 'rounded-lg', 'shadow', 'hover:bg-gray-100', 'dark:bg-gray-800', 'dark:border-gray-700', 'dark:hover:bg-gray-700', 'relative'); // Adiciona 'relative' para posicionamento absoluto do botão 'Answer'
        perguntaContainer.appendChild(cardLink);

        // Botão para exibir a resposta
        const answerButton = document.createElement('button');
        answerButton.classList.add('absolute', 'bottom-2', 'left-2', 'bg-blue-500', 'text-white', 'px-2', 'py-1', 'rounded');
        answerButton.textContent = 'Answer';
        cardLink.appendChild(answerButton);

        // Função para exibir a resposta ao clicar no botão 'Answer'
        answerButton.addEventListener('click', () => {
          // Verifica se a resposta já está visível
          const resposta = cardLink.querySelector('.resposta');
          if (resposta) {
            resposta.remove(); // Remove a resposta se já estiver visível
          } else {
            // Cria um parágrafo para exibir a resposta
            const respostaParagrafo = document.createElement('p');
            respostaParagrafo.classList.add('resposta', 'mt-2', 'text-sm', 'text-gray-700', 'dark:text-gray-400', 'text-center');
            respostaParagrafo.textContent = `Answer: ${pergunta.answer}`; // Exibe a resposta
            cardLink.appendChild(respostaParagrafo);
          }
        });

        // Subtipo da pergunta
        const subTipo = document.createElement('h6');
        subTipo.classList.add('mb-2', 'text-lg', 'font-bold', 'text-gray-700', 'dark:text-white', 'text-center'); // Texto centralizado
        subTipo.textContent = pergunta.sub_type.charAt(0).toUpperCase() + pergunta.sub_type.slice(1); // Transforma a primeira letra em maiúscula
        cardLink.appendChild(subTipo);

        // Adiciona o áudio no canto superior direito
        if (pergunta.audio) {
          const audioContainer = document.createElement('div');
          audioContainer.classList.add('absolute', 'top-2', 'right-2');
          const audio = document.createElement('audio');
          audio.src = pergunta.audio;
          audio.controls = true;
          audio.classList.add('w-8', 'h-8');
          audioContainer.appendChild(audio);
          cardLink.appendChild(audioContainer);
        }

        // Título da pergunta
        const titulo = document.createElement('h5');
        titulo.classList.add('mb-2', 'text-2xl', 'font-bold', 'tracking-tight', 'text-gray-900', 'dark:text-white', 'text-center'); // Texto centralizado
        titulo.textContent = pergunta.title;
        cardLink.appendChild(titulo);

        // Adiciona os valores de 'start' e 'end' abaixo do título
        if (pergunta.start && pergunta.end) {
          const startEnd = document.createElement('p');
          startEnd.classList.add('mb-2', 'text-sm', 'text-gray-700', 'dark:text-gray-400', 'text-center'); // Texto centralizado
          startEnd.textContent = `${pergunta.start} ______ ${pergunta.end}`;
          cardLink.appendChild(startEnd);
        }

        // Adiciona os outros campos (que foram removidos anteriormente) à interface
        for (const key in pergunta) {
          if (pergunta[key] !== null && key !== 'id' && key !== 'created_at' && key !== 'title' && key !== 'type' && key !== 'lesson_id' && key !== 'order' && key !== 'audio' && key !== 'sub_type' && key !== 'start' && key !== 'end' && key !== 'answer') {
            const campo = document.createElement('p');
            campo.classList.add('text-sm', 'text-gray-700', 'dark:text-gray-400', 'text-center'); // Texto centralizado
            campo.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${pergunta[key]}`;
            cardLink.appendChild(campo);
          }
        }

        // Adiciona a pergunta à interface
        conteudo.appendChild(perguntaContainer);
      }
    }
  };
  reader.readAsText(file);
});
