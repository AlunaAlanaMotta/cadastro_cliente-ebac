document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-cadastro");
    const inputs = form.querySelectorAll("input");

    // Restaurar os dados do localStorage
    const dadosSalvos = JSON.parse(localStorage.getItem("formCadastro"));
    if (dadosSalvos) {
        inputs.forEach(input => {
            if (dadosSalvos[input.id]) {
                input.value = dadosSalvos[input.id];
            }
        });
    }

    // Salvar dados ao digitar
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            const dados = {};
            inputs.forEach(inp => {
                dados[inp.id] = inp.value;
            });
            localStorage.setItem("formCadastro", JSON.stringify(dados));
        });
    });

    // Preenchimento automático com ViaCEP
    document.getElementById("cep").addEventListener("blur", (evento) => {
        const cep = evento.target.value.replace(/\D/g, "");
        if (cep.length !== 8) return;

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById("logradouro").value = data.logradouro;
                    document.getElementById("bairro").value = data.bairro;
                    document.getElementById("cidade").value = data.localidade;
                    document.getElementById("estado").value = data.uf;

                    // Atualiza o localStorage após preencher os campos automaticamente
                    const dados = {};
                    inputs.forEach(inp => {
                        dados[inp.id] = inp.value;
                    });
                    localStorage.setItem("formCadastro", JSON.stringify(dados));
                } else {
                    alert("CEP não encontrado.");
                }
            })
            .catch(error => {
                console.error("Erro ao buscar o CEP:", error);
            });
    });

    document.getElementById("limpar").addEventListener("click", () => {
        localStorage.removeItem("formCadastro");
        document.getElementById("form-cadastro").reset();
    });

    // Salvar ao submeter (opcional)
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Dados salvos com sucesso!");
    });
});
