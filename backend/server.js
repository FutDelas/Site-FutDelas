const express = require("express");//importa o módulo express que contruir o servidior
const cors = require("cors");//permite que acesse rotas diferentes(domínios)
const bodyParser= require("body-parser")// middleware que analisa o corpo da requisição de entrada HTTP(dados que vem do formulario)
const {v4:uuid} = require("uuid")//função responsavel por gerar ID´s unicos 
const fs =require("fs"); //MANIPULA OS ARQUIVOS JSON
const path =require("path");// DEFINE O CAMINHO DOS ARQUIVO JSON
// INSTANCIANDO O EXPRESS
const app = express();
// DEFINE A PORTA DO SERVIDOR
const Port = 3001;

//USANDO O CORS
app.use(cors());
//USANDO O BODY PARSER
app.use(bodyParser.json());

//Local onde o arquivo se localiza
const caminho = path.join(__dirname,"perfis.json")

//função para ler os dados no arquivo JSON
const lerPerfis=()=>{
try{
    const data = fs.readFileSync(caminho,"utf-8")
    return JSON.parse(data);
}catch(error){
    console.log("Erro ao ler o arquivo",error);
    return [];
}
}


//Função para gravar dados no arquivo

const salvarPerfis=(data)=>{
    try{
        fs.writeFileSync(caminho, JSON.stringify(data,null,2), "utf-8");
    }catch(error){
        console.log("Erro ao salvar o arquivo",error)
    }
}

//variável que recebe a função ler perfis
let perfis =lerPerfis();


//ROTA CADASTRAR PERFIS
app.post("/perfil",(req,res)=>{
    // desestruct- requisição das variaveis que serão manipuladas no corpo da aplicação
    const {nome,dataNascimento,email,senha,tipo} = req.body
    //validando os campos das variáveis
    if (!nome || !dataNascimento || !email || !senha || !tipo) {
        return res.status(400).json({message:"Todos os campos são obrigatórios"})
    }
    //realiza o novo cadastro com id, nome, data de nascimento, email, senha e tipo
    const novoPerfil ={id:uuid(),nome,dataNascimento,email,senha,tipo}
    //pega o que foi cadastrado e coloca no array perfis
    perfis.push(novoPerfil);
    //salva os dados no aquivo JSON
    salvarPerfis(perfis);
    //retorna a mensagem de sucesso
    res.status(201).json({message:"Perfil cadastrado com sucesso!"})
})

//Rota para consultar todos os perfis cadastrados
app.get("/perfis",(req,res)=>{
    res.json(perfis)
})


//rota para consulta personalizada (get)
app.get("/perfil/search",(req,res)=>{
    //obtem parametro de pesquisa na url
    const {pesquisa} = req.query;
    //validando pesquisa
    if(!pesquisa){
        return res.status(400).json({message:"Pesquisa não encontrada"})
    }
    //converte o termo de pesquisa para minúscula
    const termoPesquisa = pesquisa.toLowerCase();
    //filtra os perfis que contenham o termo de pesquisa
    const resultado = perfis.filter(perfil=>perfil.nome.toLowerCase().includes(termoPesquisa))
    res.json(resultado)
})