require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Cliente = require('./models/cliente');
const { collapseTextChangeRangesAcrossMultipleVersions } = require('typescript');

const {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_CLUSTER,
  MONGODB_DATABASE
} = process.env

mongoose.connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.mongodb.net/${MONGODB_DATABASE}?retryWrites=true&w=majority`)
.then(()=>{
  console.log("Conexão Ok")
}).catch((e)=>{
  console.log("Conexão NOK")
  console.log(e)
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

//Substitui o middleware de cima.
app.use(cors());


//Função alvo(post [se for get não entra]), anres dela faz o tratamento (com o middleware)
app.post('/api/clientes', (req, res, next) => {
  const cliente = new Cliente({
    nome:req.body.nome,
    fone:req.body.fone,
    email:req.body.email,
  })
  cliente.save().then((clienteInserido) => {
    console.log(cliente);
    res.status(201).json({
      mensagem: 'Cliente Inserido',
      id: clienteInserido._id
    })
  });
});

app.get('/api/clientes', (req, res, next) => {
  Cliente.find().then((documents) => {
    res.json({
      mensagem: "Tudo OK",
      clientes: documents
    })
  });
});

//GET http://localhost:3000/api/clientes/1234
app.get('/api/clientes/:id', (req, res) => {
  Cliente.findById(req.params.id)
  .then((cli) => {
    if (cli){
      res.status(200).json(cli)
    } else {
      res.status(404).json({mensagem: "Cliente não encontrado."})
    }
  })
})

//DELETE http://localhost:3000/api/clientes/123456
app.delete('/api/clientes/:id', (req, res, next) => {
  Cliente.deleteOne({_id: req.params.id}).then(resultado => {
    //atualizar a lista local
    this.clientes = this.clientes.filter(cli => cli.id !== id);
    this.listaClientesAtualizada.next([...this.clientes]);
    //notificar os componentes interessados (ClienteListaComponent)
    console.log(`Cliente de id: ${id} removido.`)
    res.status(200).json({mensagem: "Cliente removido"});
  })
});

// PUT http://localhost:3000/api/clientes/1234
app.put('/api/clientes/:id', (req, res) => {
  //1. construir um objeto cliente com os dados extraidos da requisição
  const cliente = new Cliente({
    _id: req.params.id,
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email
  })
  //2.atualizar o documento que representa o cliente na base gerenciada pelo mongo
  Cliente.updateOne({_id: req.params.id}, cliente)
  .then(resultado => {
    console.log(resultado)
    //3. responde so cliente que deu tudo certo
    res.status(204).json({mensagem: 'Atualização realizada com sucesso'})
  })
})

module.exports = app;
