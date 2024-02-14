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

                const titulo = document.createElement('h2');
                titulo.textContent = pergunta.title;
                conteudo.appendChild(titulo);

                const tipo = document.createElement('p');
                tipo.textContent = `Tipo: ${pergunta.type}`;
                conteudo.appendChild(tipo);

                // Verifica se há um próximo item com a mesma ordem e se o tipo é 'fonetico'
                const proximaQuestao = data.find(item => item.order === pergunta.order && item.type === 'fonetico');
                if (proximaQuestao) {
                    // Se houver, cria um elemento de áudio e atribui o URL
                    const audio = document.createElement('audio');
                    audio.controls = true;
                    audio.src = proximaQuestao.audio;
                    conteudo.appendChild(audio);
                }

                // Adicione verificação para cada campo e adicione-o ao conteúdo se não for nulo
                for (const key in pergunta) {
                    if (pergunta[key] !== null && key !== 'id' && key !== 'created_at' && key !== 'title' && key !== 'type' && key !== 'lesson_id') {
                        const campo = document.createElement('p');
                        if ((key === 'start' || key === 'end') && pergunta.type === 'gramatico' && pergunta.sub_type === 'complete') {
                            campo.textContent = pergunta[key];
                        } else {
                            campo.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${pergunta[key]}`;
                        }
                        conteudo.appendChild(campo);
                    }
                }

                const quebraLinha = document.createElement('br');
                conteudo.appendChild(quebraLinha);
            }
        }
    };
    reader.readAsText(file);
});
