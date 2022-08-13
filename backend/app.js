require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Cliente = require('./models/cliente');

const {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_CLUSTER,
  MONGODB_DATABASE
} = process.env

mongoose.connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.mongodb.net/${MONGODB_DATABASE}?retryWrites=true&w=majority`)
.then(()=>{
  console.log("Conexão Ok")
}).catch(()=>{
  console.log("Conexão NOK")
});
//aqui estamos especificado um 1º middleware (trata o corpo da requisição)
app.use(bodyParser.json());

const clientes = [
  {
    id: '1',
    nome: 'José',
    fone: '11223344',
    email: 'jose@email.com'
  },
  {
    id:'2',
    nome: 'Jaqueline',
    fone: '22112211',
    email: 'jaqueline@email.com'
  }
]

//não tem bloqueio CORS
//cliente http://exemplo.com:7000
//servidor http://exemplo.com:7000

//tem bloqueio CORS
//cliente http://exemplo.com:7001
//servidor http://exemplo.com:7000

//tem bloqueio CORS
//cliente https://exemplo.com:7000
//servidor http://exemplo.com:7000

//tem bloqueio CORS
//cliente http://exemplo2.com:7000
//servidor http://exemplo.com:7000

//2º middleware 
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', "*");
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
//   next();
// })

app.use(cors());


//Função alvo(post [se for get não entra]), anres dela faz o tratamento (com o middleware)
app.post('/api/clientes', (req, res, next) => {
  const cliente = new Cliente({
    nome:req.body.nome,
    fone:req.body.fone,
    email:req.body.email,
  })
  cliente.save();
  console.log(cliente);
  res.status(201).json({mensagem: 'Cliente inserido'});
});

app.get('/api/clientes', (req, res, next) => {
  Cliente.find().then((documents) => {
    res.json({
      mensagem: "Tudo OK",
      clientes: documents
    })
  });
});

module.exports = app;
