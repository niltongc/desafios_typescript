
let requestToken: string;

let login = document.getElementById('login') as HTMLInputElement;
let senha = document.getElementById('senha') as HTMLInputElement;
let api_key = document.getElementById('api-key') as HTMLInputElement;

let username = login.value;
let password = senha.value;
let apiKey = api_key.value;

let sessionId: string;
let listId: string = '7101979';

let loginButton = document.getElementById('login-button') as HTMLButtonElement;
let searchButton = document.getElementById('search-button') as HTMLButtonElement;
let searchContainer = document.getElementById('search-container') as HTMLDivElement;

loginButton.addEventListener('click', async () => {
  await criarRequestToken();
  await logar();
  await criarSessao();
})

searchButton.addEventListener('click', async () => {
  let lista: any = document.getElementById("lista") as HTMLUListElement;
  if (lista) {
    lista.outerHTML = "";
  }
  let query = (document.getElementById('search') as HTMLInputElement).value;
  let listaDeFilmes = await procurarFilme(query);
  let ul = document.createElement('ul');
  ul.id = "lista"
  for (let item of listaDeFilmes.results) {
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(item.original_title))
    ul.appendChild(li)
  }
  console.log(listaDeFilmes);
  searchContainer.appendChild(ul);
})

window.addEventListener('change', senhaLoginApi)

function senhaLoginApi(){

  let password = senha.value;
  let username = login.value;
  let apiKey = api_key.value;
  validateLoginButton(password, username, apiKey)
}

function validateLoginButton(password: string, username: string, apiKey: string): void {
  if (password && username && apiKey) {
    loginButton.disabled = false;
    loginButton.style.backgroundColor = "green";
    loginButton.style.color = "white";
  } else {
    loginButton.disabled = true;
    
  }
}

class HttpClient {
  static async get(url: string, method: string, body?: {}) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      let body;
      request.open(method, url, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject({
            status: request.status,
            statusText: request.statusText
          })
        }
      }
      request.onerror = () => {
        reject({
          status: request.status,
          statusText: request.statusText
        })
      }

      if (body) {
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        body = JSON.stringify(body);
      }
      request.send(body);
    })
  }
}

async function procurarFilme(query: string) {
  query = encodeURI(query)
  console.log(query)
  let result: any = await HttpClient.get(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
    "GET")
  return result
}

async function adicionarFilme(filmeId: number) {
  let result = await HttpClient.get(
    `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
    "GET"
  )
  console.log(result);
}

async function criarRequestToken () {
  let result: any = await HttpClient.get(
    `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    "GET"
  )
  requestToken = result.request_token
}

async function logar() {
  await HttpClient.get(
    `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    "POST",
    {
      username: `${username}`,
      password: `${password}`,
      request_token: `${requestToken}`
    }
  )
}

async function criarSessao() {
  let result: any = await HttpClient.get(
    `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    "GET"
  )
  sessionId = result.session_id;
}

async function criarLista(nomeDaLista: string, descricao: string, language?: string) {
  let result = await HttpClient.get(
    `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
    "POST",
    {
      name: nomeDaLista,
      description: descricao,
      language: "pt-br"
    }
  )
  console.log(result);
}

async function adicionarFilmeNaLista(filmeId: number, listaId: number) {
  let result = await HttpClient.get(
    `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
    "POST",
    {
      media_id: filmeId
    }
  )
  console.log(result);
}

async function pegarLista() {
  let result = await HttpClient.get(
    `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    "GET"
  )
  console.log(result);
}
