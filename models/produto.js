// vamos construir a estrutura de dados  e vincular ela com o mongoDB
// importar o mongoose
const mongoose = require('mongoose');

// Schemas -> É a estrutura de dados de um documento(linha da tabela).
// Documents -> sao os nossos dados da nossa collection (linha da tabela)
// Model ->  É um construtor que pega uma estrutura de dados(schema) e cria uma instancia de um documento.
// Collections -> sao equivalentes as nossas tabelas no banco de dados relacional que pode conter varios documentos JSON.

// Criar e inicializar o meu Schema

const produtoSchema = new mongoose.Schema({
  titulo: {type: String, required: true},
  descricao: {type: String, required: true},
  prioridade: {type: String, required: true},
  status: {type: String, required: true},
  capa: {type: String },
  prazo: {type: String },
  dataCriacao: { type: Date, default: Date.now }
})
// criar e inicializando meu model baseado no meu schema
const User = mongoose.model('produtos', produtoSchema);

const validate = (data) => {
	const schema = Joi.object({
    titulo: Joi.string().titulo().required().label("Titulo"),
		descricao: Joi.string().descricao().required().label("Descricao"),
		prioridade: Joi.string().prioridade().required().label("Prioridade"),
    status: Joi.string().status().required().label("Status"),
    capa: Joi.string().capa().required().label("capa"),
    prazo: Joi.string().prazo().required().label("Prazo"),
    dataCriacao: Joi.string().dataCriacao().required().label("dataCriação"),
	});
	return schema.validate(data);
};

module.exports = { User, validate };








