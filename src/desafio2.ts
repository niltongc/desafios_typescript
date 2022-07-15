interface Pessoa {
    nome?: string;
    idade?: number;
    profissao?: 'atriz' | 'padeiro'
}

let pessoa1: Pessoa = {};
pessoa1.nome = "maria";
pessoa1.idade = 29;
pessoa1.profissao = "atriz"

let pessoa2: Pessoa = {}
pessoa2.nome = "roberto";
pessoa2.idade = 19;
pessoa2.profissao = "padeiro"

let pessoa3: Pessoa = {
    nome: "laura",
    idade: 32,
    profissao: "atriz"
};


let pessoa4: Pessoa = {
    nome: "carlos",
    idade: 19,
    profissao: "padeiro"
}
