"use strict";
let inputTitulo = document.getElementById('titulo-recado');
let inputDescricao = document.getElementById('descricao-recado');
let btnSalvar = document.getElementById('btn-salvar');
let tabela = document.getElementById('tabela');
let botaoEditarModal = document.getElementById('btn-editar');
let modalSalvar = new bootstrap.Modal('#modal-salvar');
let modalEditar = new bootstrap.Modal('#modal-editar');
let modalApagar = new bootstrap.Modal('#modal-apagar');
let btnConfirma = document.getElementById('btn-apagar');
let usuarioLogado = sessionStorage.getItem('usuarioLogado');
document.addEventListener('DOMContentLoaded', () => {
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }
    carregarDados();
});
function salvarMensagem() {
    let listaRecados = buscarRecados();
    let maiorIndice = 1;
    let novoRecado;
    if (listaRecados.length > 0) {
        let maior = listaRecados.reduce((anterior, proximo) => {
            if (anterior.codigo > proximo.codigo) {
                return anterior;
            }
            return proximo;
        });
        maiorIndice = maior.codigo;
        novoRecado = {
            codigo: ++maiorIndice,
            descricao: inputDescricao.value,
            titulo: inputTitulo.value
        };
    }
    else {
        novoRecado = {
            codigo: ++maiorIndice,
            descricao: inputDescricao.value,
            titulo: inputTitulo.value
        };
    }
    listaRecados.push(novoRecado);
    salvarRecadoStorage(listaRecados);
    mostrarNoHTML(novoRecado);
    inputTitulo.value = '';
    inputDescricao.value = '';
    modalSalvar.hide();
}
function buscarRecados() {

    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    let indiceUsuarioLogado = usuarios.findIndex((usuario) => usuario.login === usuarioLogado);
    return usuarios[indiceUsuarioLogado].recados;
}
function salvarRecadoStorage(recados) {
   
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    let indiceUsuarioLogado = usuarios.findIndex((usuario) => usuario.login === usuarioLogado);
    usuarios[indiceUsuarioLogado].recados = recados;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}
function mostrarNoHTML(recado) {
    let novaLinha = document.createElement('tr');
    let colunaCodigo = document.createElement('td');
    let colunaTitulo = document.createElement('td');
    let colunaDescricao = document.createElement('td');
    let colunaAcoes = document.createElement('td');
    let botaoEditar = document.createElement('button');
    let botaoApagar = document.createElement('button');
    colunaTitulo.innerHTML = recado.titulo;
    colunaDescricao.innerHTML = recado.descricao;
    colunaCodigo.innerHTML = `${recado.codigo}`;
    botaoEditar.setAttribute('type', 'button');
    botaoEditar.setAttribute('class', 'btn btn-success');
    botaoEditar.setAttribute('data-bs-toggle', 'modal');
    botaoEditar.setAttribute('data-bs-target', '#modal-editar');
    botaoEditar.addEventListener('click', () => {
        prepararEdicao(recado);
    });
    botaoEditar.innerHTML = `<i class="bi bi-pencil-square"></i>`;
    botaoApagar.setAttribute('type', 'button');
    botaoApagar.setAttribute('class', 'btn btn-danger');
    botaoApagar.setAttribute('data-bs-toggle', 'modal');
    botaoApagar.setAttribute('data-bs-target', '#modal-apagar');
    botaoApagar.addEventListener('click', () => {
        apagarRecado(recado.codigo);
    });
    botaoApagar.innerHTML = `<i class="bi bi-trash"></i>`;
    novaLinha.setAttribute('id', `${recado.codigo}`);
    colunaAcoes.appendChild(botaoEditar);
    colunaAcoes.appendChild(botaoApagar);
    novaLinha.appendChild(colunaCodigo);
    novaLinha.appendChild(colunaTitulo);
    novaLinha.appendChild(colunaDescricao);
    novaLinha.appendChild(colunaAcoes);
    tabela.appendChild(novaLinha);
}
function carregarDados() {
    let listaRecados = buscarRecados();
    for (let recado of listaRecados) {
        mostrarNoHTML(recado);
    }
}
function prepararEdicao(recado) {
    let inputDescricaoEditar = document.getElementById('descricao-recado-editar');
    let inputTituloEditar = document.getElementById('titulo-recado-editar');
    inputTituloEditar.value = recado.titulo;
    inputDescricaoEditar.value = recado.descricao;
    botaoEditarModal.addEventListener('click', () => {
        let recadoAtualizado = {
            codigo: recado.codigo,
            titulo: inputTituloEditar.value,
            descricao: inputDescricaoEditar.value
        };
        atualizarRecado(recadoAtualizado);
    });
}
function atualizarRecado(recadoAtualizado) {
    let recados = buscarRecados();
    let indiceRecado = recados.findIndex((recado) => recado.codigo === recadoAtualizado.codigo);
    recados[indiceRecado] = recadoAtualizado;
    salvarRecadoStorage(recados);
    modalEditar.hide();
    window.location.reload();
}
function apagarRecado(codigo) {
    btnConfirma.addEventListener('click', () => {
        let listaRecados = buscarRecados();
        let indiceRecado = listaRecados.findIndex((registro) => registro.codigo == codigo);
        listaRecados.splice(indiceRecado, 1);
        salvarRecadoStorage(listaRecados);
        modalApagar.hide();
        window.location.reload();
    });
}
