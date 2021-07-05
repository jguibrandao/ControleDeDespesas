const ulTransacoes = document.querySelector("#transactions");
const saldoDisplay = document.querySelector("#balance");
const gastosDisplay = document.querySelector("#money-minus");
const receitasDisplay = document.querySelector("#money-plus");
const form = document.querySelector("#form");
const inputNomeDaTransacao = document.querySelector("#text");
const inputValorDaTransacao = document.querySelector("#amount");

const transacoesDoLocalStorage = JSON.parse(localStorage
    .getItem("transacoes"));

let transacoes = localStorage
    .getItem("transacoes") !== null ? transacoesDoLocalStorage : [];

const removerTransacao = ID => {
 transacoes = transacoes.filter(transacao =>
        transacao.id !== ID);
    atualizaLocalStorage();
    init();
    
}

const adicionaTransacoesNoDom = transacao => {
    const operador = transacao.valor < 0 ? "-" : "+";
    const CSSClass = transacao.valor < 0 ? "minus" : "plus";
    const valorAbsoluto = Math.abs(transacao.valor);
    const li = document.createElement("li");
    li.classList.add(CSSClass);
    li.innerHTML = `
    ${transacao.nome}
    <span>${operador} R$ ${valorAbsoluto}</span>
    <button class="delete-btn" onClick="removerTransacao(${transacao.id})">
    x
    </button>
    `;
    ulTransacoes.prepend(li);
}

const atualizaValores = () => {
    const valorDasTransacoes = transacoes
        .map(transacao => transacao.valor);

    const total = valorDasTransacoes
        .reduce((acumulador, transacao) => acumulador + transacao, 0).toFixed(2);

    const receitas = valorDasTransacoes
        .filter(valor => valor > 0)
        .reduce((acumulador, valor) => acumulador + valor, 0)
        .toFixed(2);

        const despesas = Math.abs(valorDasTransacoes
        .filter(valor => valor < 0)
        .reduce((acumulador, valor) => acumulador + valor, 0))
        .toFixed(2);

        saldoDisplay.textContent = `R$ ${total}`;
        if(total < 0) {
            saldoDisplay.style.color = "red";
        } else if(total > 0) {
            saldoDisplay.style.color = "rgb(71, 188, 0)";
        } else if(total == 0) {
            saldoDisplay.style.color = "#2e75cc";
        }
        receitasDisplay.textContent = `R$ ${receitas}`;
        gastosDisplay.textContent = `R$ ${despesas}`;
}

const init = () => {
    ulTransacoes.innerHTML = "";
 transacoes.forEach(adicionaTransacoesNoDom);
    atualizaValores();

}

init();

const atualizaLocalStorage = () => {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

const gerarID = () => {
    return Math.round(Math.random() * 1000000);
}

const lidaComSubmitDoForm = evento => {
    evento.preventDefault();

    const nomeDaTransacao = inputNomeDaTransacao.value.trim();
    const valorDaTransacao = inputValorDaTransacao.value.trim();

    if(nomeDaTransacao === "" || valorDaTransacao === "") {
        alert("Preencha os dois campos");
        return
    }

    const transacao = {id: gerarID(), 
    nome: nomeDaTransacao, 
    valor: Number(valorDaTransacao)};

    transacoes.push(transacao);
    init();
    atualizaLocalStorage();

    inputNomeDaTransacao.value = "";
    inputValorDaTransacao.value = "";
}

form.addEventListener("submit", lidaComSubmitDoForm);