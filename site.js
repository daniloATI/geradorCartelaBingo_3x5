function clickStart() {
  // Filtra linhas vazias para evitar erros no sorteio
  const listaTotal = document.querySelector("#casasBingo").value.split("\n").filter(line => line.trim() !== "");
  const qtdCartelas = parseInt(document.querySelector("#qtdCartelas").value, 10);
  const nomeBingo = document.querySelector("#nomeBingo").value;
  const imgCartela = document.querySelector("#imgCartela").value;
  const tipoBingo = parseInt(document.querySelector('input[name="tipoBingo"]:checked').value, 10);

  // Para 3x5, precisamos de 15 casas. 14 itens + 1 imagem.
  if (!listaTotal || listaTotal.length < 20) {
    alert("É necessário uma lista de, pelo menos, 20 itens para gerar cartelas variadas!");
    return;
  }

  const gen = new Gerador(listaTotal, imgCartela, tipoBingo);
  const out = document.querySelector("#output");
  out.className = "";
  out.innerHTML = "";
  out.classList.add(tipoBingo === 1 ? "bingo-num" : "bingo-text");

  for (let i = 0; i < qtdCartelas; i++) {
    var t = new Cartela(nomeBingo, gen.GerarCartela());
    out.append(t.genNode());
  }
}

function gerarValoresPadroes() {
  const tipoBingo = parseInt(document.querySelector('input[name="tipoBingo"]:checked').value, 10);
  const valores = document.querySelector("#casasBingo");
  if (tipoBingo === 1) {
    valores.value = Array.from({ length: 90 }, (_, i) => i + 1).join("\n");
  } else {
    valores.value = "";
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Gerador {
  constructor(lista, imagem, tipoBingo) {
    this.listaBase = lista.map(item => new CasaCartela(item.trim()));
    this.tipoBingo = tipoBingo;
    this.casaImagem = new CasaCartela(null, imagem || "passaros.png");
  }

  GerarCartela() {
    let baseCopia = [...this.listaBase]; // Copia a lista para poder remover itens sorteados
    let sorteados = [];

    // Sorteia exatamente 14 itens únicos
    while (sorteados.length < 14) {
      let index = getRandomInt(0, baseCopia.length - 1);
      sorteados.push(baseCopia.splice(index, 1)[0]); // Remove da cópia para não repetir
    }

    if (this.tipoBingo === 1) {
      sorteados.sort((a, b) => parseInt(a.display, 10) - parseInt(b.display, 10));
    }

    // Insere a imagem no centro (índice 7 de uma lista de 15)
    sorteados.splice(7, 0, this.casaImagem);
    return sorteados;
  }
}

class Cartela {
  constructor(_titulo, _casas) {
    this.titulo = _titulo;
    this.casas = [];
    // Transforma a lista de 15 em uma matriz de 3 linhas e 5 colunas
    for (let i = 0; i < 3; i++) {
      this.casas.push(_casas.slice(i * 5, (i + 1) * 5));
    }
  }
}

Cartela.prototype.genNode = function () {
  let container = document.createElement("div");
  container.classList.add("cartela");
  container.innerHTML = `
        <h2 class="cartela-titulo">${this.titulo}</h2>
        <div class="cartela-corpo">
            ${this.casas.map(linha => `
                <div class="cartela-linha">
                    ${linha.map(casa => casa.genTemplate()).join("")}
                </div>
            `).join("")}
        </div>`;
  return container;
};

class CasaCartela {
  constructor(valor, imagem) {
    this.display = valor !== null ? valor : imagem;
    this.tipo = valor !== null ? 1 : 2;
  }
  genTemplate() {
    if (this.tipo === 1) return `<div class="cartela-casa">${this.display}</div>`;
    return `<div class="cartela-casa cartela-casa-img"><img src='${this.display}' /></div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => gerarValoresPadroes());