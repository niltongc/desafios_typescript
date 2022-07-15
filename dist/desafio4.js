"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let requestToken;
let login = document.getElementById('login');
let senha = document.getElementById('senha');
let api_key = document.getElementById('api-key');
let username = login.value;
let password = senha.value;
let apiKey = api_key.value;
let sessionId;
let listId = '7101979';
let loginButton = document.getElementById('login-button');
let searchButton = document.getElementById('search-button');
let searchContainer = document.getElementById('search-container');
loginButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    yield criarRequestToken();
    yield logar();
    yield criarSessao();
}));
searchButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    let lista = document.getElementById("lista");
    if (lista) {
        lista.outerHTML = "";
    }
    let query = document.getElementById('search').value;
    let listaDeFilmes = yield procurarFilme(query);
    let ul = document.createElement('ul');
    ul.id = "lista";
    for (let item of listaDeFilmes.results) {
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(item.original_title));
        ul.appendChild(li);
    }
    console.log(listaDeFilmes);
    searchContainer.appendChild(ul);
}));
window.addEventListener('change', senhaLoginApi);
function senhaLoginApi() {
    let password = senha.value;
    let username = login.value;
    let apiKey = api_key.value;
    validateLoginButton(password, username, apiKey);
}
function validateLoginButton(password, username, apiKey) {
    if (password && username && apiKey) {
        loginButton.disabled = false;
        loginButton.style.backgroundColor = "green";
        loginButton.style.color = "white";
    }
    else {
        loginButton.disabled = true;
    }
}
class HttpClient {
    static get(url, method, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let request = new XMLHttpRequest();
                let body;
                request.open(method, url, true);
                request.onload = () => {
                    if (request.status >= 200 && request.status < 300) {
                        resolve(JSON.parse(request.responseText));
                    }
                    else {
                        reject({
                            status: request.status,
                            statusText: request.statusText
                        });
                    }
                };
                request.onerror = () => {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                };
                if (body) {
                    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    body = JSON.stringify(body);
                }
                request.send(body);
            });
        });
    }
}
function procurarFilme(query) {
    return __awaiter(this, void 0, void 0, function* () {
        query = encodeURI(query);
        console.log(query);
        let result = yield HttpClient.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`, "GET");
        return result;
    });
}
function adicionarFilme(filmeId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get(`https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`, "GET");
        console.log(result);
    });
}
function criarRequestToken() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get(`https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`, "GET");
        requestToken = result.request_token;
    });
}
function logar() {
    return __awaiter(this, void 0, void 0, function* () {
        yield HttpClient.get(`https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`, "POST", {
            username: `${username}`,
            password: `${password}`,
            request_token: `${requestToken}`
        });
    });
}
function criarSessao() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get(`https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`, "GET");
        sessionId = result.session_id;
    });
}
function criarLista(nomeDaLista, descricao, language) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get(`https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`, "POST", {
            name: nomeDaLista,
            description: descricao,
            language: "pt-br"
        });
        console.log(result);
    });
}
function adicionarFilmeNaLista(filmeId, listaId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get(`https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`, "POST", {
            media_id: filmeId
        });
        console.log(result);
    });
}
function pegarLista() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get(`https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`, "GET");
        console.log(result);
    });
}
