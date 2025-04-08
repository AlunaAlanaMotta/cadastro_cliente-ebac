document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-cadastro");
    const inputs = form.querySelectorAll("input");

    const dadosSalvos = JSON.parse(localStorage.getItem("formCadastro"));
    if (dadosSalvos) {
        inputs.forEach(input => {
            if (dadosSalvos[input.id]) {
                input.value = dadosSalvos[input.id];
            }
        });
    }


    inputs.forEach(input => {
        input.addEventListener("input", () => {
            const dados = {};
            inputs.forEach(inp => {
                dados[inp.id] = inp.value;
            });
            localStorage.setItem("formCadastro", JSON.stringify(dados));
        });
    });


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

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Dados salvos com sucesso!");
    });
});
