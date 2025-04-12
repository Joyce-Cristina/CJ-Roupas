function loadProducts() {
    fetch("./data/produtos.json")
        .then(response => response.json())
        .then(data => {
            const produtosDiv = document.getElementById("produtos");
            produtosDiv.innerHTML = ""; // Limpa o conteúdo antes de adicionar novos produtos

            data.forEach(produto => {
                const produtoDiv = document.createElement("div");
                produtoDiv.classList.add("produto");

                // Verifica se 'tamanhos' existe e é um array
                let tamanhos = "Tamanho não disponível"; // Valor padrão

                if (Array.isArray(produto.tamanhos) && produto.tamanhos.length > 0) {
                    tamanhos = produto.tamanhos.join(", "); // Converte o array de tamanhos em uma string
                } else if (produto.tamanhos) {
                    tamanhos = produto.tamanhos; // Caso tamanho não seja um array mas um valor único
                }

                produtoDiv.innerHTML = `
                    <img src="${produto.imagem}" alt="${produto.nome}">
                    <h3>${produto.nome}</h3>
                    <h>Categoria: ${produto.categoria || "Sem categoria"}</h6> <!-- Se não existir, mostra "Sem categoria" -->
                    <h6>Tamanhos: ${tamanhos}</h6> <!-- Exibe os tamanhos corretamente -->
                    <p><strong>${produto.preco}</strong></p>
                `;

                produtosDiv.appendChild(produtoDiv);
            });
        })
        .catch(error => console.error("Erro ao carregar produtos:", error));  
}

 function changeBackground() {
     const cores = ["#FFD700", "#FF4500", "#4682B4", "#32CD32", "#8A2BE2"];
     const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
     document.body.style.backgroundColor = corAleatoria;
 }
 function removerAcentos(str) {
    return str
        .normalize("NFD")                        // remove acentos
        .replace(/[\u0300-\u036f]/g, "")         // remove marcas de acento
        .replace(/[^\w\s]/gi, "")                // remove outros caracteres especiais
        .replace(/\s+/g, " ")                    // substitui múltiplos espaços por um só
        .trim();                                 // remove espaços no início/fim
}
 
 function selecionarSugestao(word) {
     document.getElementById("search-box").value = word;
     document.getElementById("suggestions").innerHTML = "";
     document.getElementById("suggestions").style.display = "none";
 }
 
 // Lista de sugestões (exemplo)
 const suggestions = [
     "Camiseta", "Moleton", "Jaqueta", "Calça", "Shorts", "Tenis","Camisa","Calçado","Sapato"
 
 ];
 const sinonimos = {
    "camiseta": ["camiseta", "camisa", "blusa", "regata"],
    "tenis": ["tenis", "sapatenis", "calcado", "sapato"],
    "calça": ["calca", "jeans", "legging"],
    "moleton": ["blusa de frio"],
    // adicione mais conforme necessário
};
 function removerAcentos(str) {
     return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
 }
 
 function buscarProdutos() {
    const searchBox = document.getElementById('search-box');
    const inputOriginal = searchBox.value.trim();
    const input = removerAcentos(inputOriginal.toLowerCase());
    const produtosDiv = document.getElementById("produtos");

    if (input === "") return;

    fetch("./data/produtos.json")
        .then(response => response.json())
        .then(data => {
            produtosDiv.innerHTML = "";
            let termosBusca = [input];

// Verifica se o input está no dicionário de sinônimos e adiciona os sinônimos à busca
for (let chave in sinonimos) {
    if (sinonimos[chave].includes(input)) {
        termosBusca = sinonimos[chave];
        break;
    }
}

let produtosFiltrados = data.filter(produto => {
    let nomeProduto = removerAcentos(produto.nome.toLowerCase());
    return termosBusca.some(termo => nomeProduto.includes(termo));
});
            

            if (produtosFiltrados.length === 0) {
                produtosDiv.innerHTML = "<p>Nenhum produto encontrado.</p>";
            } else {
                produtosFiltrados.forEach(produto => {
                    const produtoDiv = document.createElement("div");
                    produtoDiv.classList.add("produto-item");

                    const tamanhos = Array.isArray(produto.tamanhos) && produto.tamanhos.length > 0
                        ? produto.tamanhos.join(", ")
                        : "Tamanho não disponível";

                    produtoDiv.innerHTML = `
                        <img src="${produto.imagem}" alt="${produto.nome}" style="width: 100px;">
                        <h3 class="produto-nome">${produto.nome}</h3>
                        <p><strong>Categoria:</strong> ${produto.categoria || "Sem categoria"}</p>
                        <p><strong>Tamanhos:</strong> ${tamanhos}</p>
                        <p class="produto-preco"><strong>Preço:</strong> ${produto.preco}</p>
                    `;

                    produtosDiv.appendChild(produtoDiv);
                });
            }

            // ✅ SALVA no histórico apenas a palavra pesquisada, sem duplicatas
            let historico = JSON.parse(localStorage.getItem('historicoPesquisa')) || [];

            if (inputOriginal && !historico.includes(inputOriginal)) {
                historico.unshift(inputOriginal); // adiciona ao topo
                if (historico.length > 10) historico.pop(); // limita a 10
                localStorage.setItem('historicoPesquisa', JSON.stringify(historico));
            }

            // ✅ Atualiza visualmente o histórico
            exibirHistorico();

            // ✅ Limpa o campo de busca
            searchBox.value = "";

            // ✅ Fecha o modal
            fecharModalPesquisa();
        })
        .catch(error => console.error("Erro ao carregar produtos:", error));
}

 
 function buscarSugestao() {
     let input = removerAcentos(document.getElementById('search-box').value);
     let suggestionsBox = document.getElementById('suggestions');
     let matchingSuggestions = [];
 
     if (input) {
         matchingSuggestions = suggestions.filter(item => 
             removerAcentos(item.toLowerCase()).includes(input.toLowerCase())
         );
     }
     // Atualiza histórico de pesquisa no localStorage
let historico = JSON.parse(localStorage.getItem('historicoPesquisa')) || [];

// Evita duplicatas
if (!historico.includes(input)) {
    historico.unshift(input); // Adiciona no início
    if (historico.length > 10) historico.pop(); // Limita o histórico a 10 itens
    localStorage.setItem('historicoPesquisa', JSON.stringify(historico));
}

 
     suggestionsBox.innerHTML = '';
 
     if (matchingSuggestions.length > 0) {
         matchingSuggestions.forEach(suggestion => {
             let suggestionItem = document.createElement('div');
             suggestionItem.classList.add('suggestion-item'); 
             suggestionItem.textContent = suggestion;
             suggestionItem.onclick = function() { selecionarSugestao(suggestion); }; // Corrigido!
             suggestionsBox.appendChild(suggestionItem);
         });
 
         suggestionsBox.style.display = 'block';
     } else {
         suggestionsBox.style.display = 'none';
     }
 }
 
 function selecionarSugestao(word) {
     document.getElementById("search-box").value = word;
     buscarProdutos(); // Agora faz a busca corretamente
 }
 
 // Fechar sugestões quando clicar fora do campo de pesquisa
 document.addEventListener('click', function(event) {
     let suggestionsBox = document.getElementById('suggestions');
     if (!event.target.closest('.modal-body') && !event.target.closest('#search-box')) {
         suggestionsBox.style.display = 'none';
     }
 });
 
 // Faz as sugestões clicáveis
 document.getElementById("suggestions").addEventListener("click", function(event) {
     if (event.target.classList.contains("suggestion-item")) {
         selecionarSugestao(event.target.textContent);
     }
 });
 
 function fecharModalPesquisa() {
     let modal = document.getElementById("searchModal");
     let bootstrapModal = bootstrap.Modal.getInstance(modal);
     bootstrapModal.hide();
 }
 
 // Evento para buscar ao pressionar "Enter"
 document.getElementById("search-box").addEventListener("keypress", function(event) {
     if (event.key === "Enter") {
         buscarProdutos();
     }
 });
 
 function selecionarSugestao(word) {
     document.getElementById("search-box").value = word;
     buscarProdutos(); // Busca automaticamente ao selecionar
 }
 
 
 document.addEventListener("DOMContentLoaded", function () {
    let searchBox = document.getElementById("search-box");
    let searchHistory = document.getElementById("search-history");
    let suggestionsBox = document.getElementById("suggestions-box");

    // Posiciona o histórico logo abaixo da barra de pesquisa
    function posicionarHistorico() {
        let boxRect = searchBox.getBoundingClientRect();
        searchHistory.style.top = boxRect.bottom + "px"; // Define a posição logo abaixo
        searchHistory.style.left = boxRect.left + "px";
        searchHistory.style.width = boxRect.width + "px"; // Faz o histórico ter a mesma largura da barra
    }

    // Exibir histórico ao focar na barra de pesquisa
    searchBox.addEventListener("focus", function () {
        let historico = JSON.parse(localStorage.getItem('historicoPesquisa')) || [];
        if (historico.length > 0) {
            posicionarHistorico(); // Ajusta a posição antes de mostrar
            searchHistory.style.display = "block";
        }
    });

    // Ocultar histórico ao digitar para que as sugestões fiquem visíveis
    searchBox.addEventListener("input", function () {
        searchHistory.style.display = "none";
        suggestionsBox.style.display = "block";
    });

   
    // Exibir histórico ao carregar a página
    exibirHistorico();
});
document.addEventListener("DOMContentLoaded", function () {
    const categoriaSelect = document.getElementById("categoria");
    const tamanhoSelect = document.getElementById("tamanho");
    const precoSelect = document.getElementById("preco");
    const produtosContainer = document.getElementById("produtos");

    let produtos = [];
    let produtosVisiveis = false; // Para controlar se os produtos já foram carregados

    function carregarProdutos() {
        fetch("./data/produtos.json")
            .then(response => response.json())
            .then(data => {
                produtos = data;
                produtosContainer.innerHTML = ""; // Limpa os produtos ao carregar
                produtosVisiveis = true;
                atualizarLista(); // Exibir os produtos
            })
            .catch(error => console.error("Erro ao carregar produtos:", error));
    }

    function atualizarLista() {
        if (!produtosVisiveis) return; // Se os produtos ainda não foram carregados, não faz nada

        const categoriaSelecionada = categoriaSelect.value.trim();
        const tamanhoSelecionado = tamanhoSelect.value.trim();
        const precoSelecionado = precoSelect.value.trim();

        console.log("Categoria:", categoriaSelecionada);
        console.log("Tamanho:", tamanhoSelecionado);
        console.log("Faixa de preço:", precoSelecionado);

        const produtosFiltrados = produtos.filter(produto => {
            const correspondeCategoria = categoriaSelecionada === "" || 
                produto.categoria.toLowerCase() === categoriaSelecionada.toLowerCase();

            const correspondeTamanho = tamanhoSelecionado === "" || 
                (Array.isArray(produto.tamanhos) && produto.tamanhos.map(t => t.toLowerCase()).includes(tamanhoSelecionado.toLowerCase()));

            let precoNumerico = parseFloat(produto.preco.replace("R$", "").trim());

            let correspondePreco = true;
            if (!isNaN(precoNumerico)) {
                if (precoSelecionado === "baixo") {
                    correspondePreco = precoNumerico <= 50;
                } else if (precoSelecionado === "medio") {
                    correspondePreco = precoNumerico > 50 && precoNumerico <= 150;
                } else if (precoSelecionado === "alto") {
                    correspondePreco = precoNumerico > 150;
                }
            }

            return correspondeCategoria && correspondeTamanho && correspondePreco;
        });

        produtosContainer.innerHTML = "";

        if (produtosFiltrados.length > 0) {
            produtosFiltrados.forEach(produto => {
                const produtoDiv = document.createElement("div");
                produtoDiv.classList.add("produto-item");

                let tamanhos = Array.isArray(produto.tamanhos) && produto.tamanhos.length > 0
                    ? produto.tamanhos.join(", ")
                    : "Tamanho não disponível";

                produtoDiv.innerHTML = `
                    <img src="${produto.imagem}" alt="${produto.nome}" style="width: 100px;">
                    <h3 class="produto-nome">${produto.nome}</h3>
                    <p><strong>Categoria:</strong> ${produto.categoria || "Sem categoria"}</p>
                    <p><strong>Tamanhos:</strong> ${tamanhos}</p>
                    <p class="produto-preco"><strong>Preço:</strong> ${produto.preco}</p>
                `;

                produtosContainer.appendChild(produtoDiv);
            });
        } else {
            produtosContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
        }
    }

    // Adiciona evento para filtrar os produtos quando os selects mudam
    categoriaSelect.addEventListener("change", atualizarLista);
    tamanhoSelect.addEventListener("change", atualizarLista);
    precoSelect.addEventListener("change", atualizarLista);

    // Faz o botão carregar os produtos ao ser clicado
    window.loadProducts = carregarProdutos;
});
function removerDoHistorico(term) {
    let historico = JSON.parse(localStorage.getItem('historicoPesquisa')) || [];
    historico = historico.filter(item => item !== term);
    localStorage.setItem('historicoPesquisa', JSON.stringify(historico));
    exibirHistorico(); // <- Isso atualiza a lista imediatamente
}
function exibirHistorico() {
    let historico = JSON.parse(localStorage.getItem('historicoPesquisa')) || [];
    let historicoLista = document.getElementById('history-list');
    let searchHistory = document.getElementById("search-history");
    historicoLista.innerHTML = ''; // limpa tudo antes de redesenhar

    historico.forEach(item => {
        let li = document.createElement('li');
        li.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-2', 'bg-light', 'p-2', 'rounded');

        let span = document.createElement('span');
        span.textContent = item;
        span.style.cursor = "pointer";
        span.onclick = () => selecionarSugestao(item);

        let btnRemove = document.createElement('button');
        btnRemove.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        btnRemove.classList.add('btn', 'btn-sm', 'btn-link', 'text-danger', 'p-0', 'ms-2');
        btnRemove.onclick = (e) => {
            e.stopPropagation(); // impede o clique de ativar a sugestão
            removerDoHistorico(item); // <- chama a função que atualiza a lista
        };

        li.appendChild(span);
        li.appendChild(btnRemove);
        historicoLista.appendChild(li);
    });

    searchHistory.style.display = historico.length > 0 ? "block" : "none";
}
