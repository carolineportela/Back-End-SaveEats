/***************************************************************************************************************************************************
 * Objetivo: Responsavel pela regra de negocio referente ao CRUD do RESTAURANTE
 * (GET, POST, PUT, DELETE)
 * Data: 31/08/2023
 * Autor: Caroline Portela
 * Versão: 1.0
 ***************************************************************************************************************************************************/

//Import do arquivo de configuração das variaveis, constantes e funções globais
var message = require('./modulo/config.js')


var restauranteDAO = require('../model/DAO/restauranteDAO.js')

const inserirRestaurante = async function (dadosRestaurante) {

    if (
        dadosRestaurante.nome_proprietario == '' || dadosRestaurante.nome_proprietario == undefined || dadosRestaurante.nome_proprietario.length > 150 ||
        dadosRestaurante.nome_fantasia == '' || dadosRestaurante.nome_fantasia == undefined || dadosRestaurante.nome_fantasia.length > 150 ||
        dadosRestaurante.razao_social == '' || dadosRestaurante.razao_social == undefined || dadosRestaurante.razao_social > 150 ||
        dadosRestaurante.email == '' || dadosRestaurante.email == undefined || dadosRestaurante.email > 255 ||
        dadosRestaurante.senha == '' || dadosRestaurante.senha == undefined || dadosRestaurante.senha > 150 ||
        dadosRestaurante.id_categoria_restaurante == '' || dadosRestaurante.id_categoria_restaurante == undefined || isNaN(dadosRestaurante.id_categoria_restaurante) ||
        dadosRestaurante.id_endereco_restaurante == '' || dadosRestaurante.id_endereco_restaurante == undefined || isNaN(dadosRestaurante.id_endereco_restaurante) ||
        dadosRestaurante.cnpj == '' || dadosRestaurante.cnpj == undefined ||
        dadosRestaurante.token_recuperar_senha == '' || dadosRestaurante.token_recuperar_senha == undefined ||
        dadosRestaurante.tempo_expiracao == '' || dadosRestaurante.tempo_expiracao == undefined  

    ){
        return message.ERROR_REQUIRED_FIELDS
    }else {
        //Envia os dados para a model inserir no banco de dados
        let resultDados = await restauranteDAO.insertRestaurante(dadosRestaurante)

        //Import do JWT
         const jwt = require("../middleware/middlewareJWT.js");

        //Valida se o banco de dados inseriu corretamente os dados
        if (resultDados) {

            //let tokenUser = await jwt.createJWT(dadosRestaurante[0].id)

            let novoRestaurante = await restauranteDAO.selectLastId()

            let dadosRestauranteJSON = {}

            dadosRestauranteJSON.status = message.SUCESS_CREATED_ITEM.status
           // dadosRestauranteJSON.token = tokenUser
            dadosRestauranteJSON.restaurantes = novoRestaurante

            return dadosRestauranteJSON
        }
        else {
            return message.ERROR_INTERNAL_SERVER
        }

    }

}

const deletarRestaurante = async function (idRestaurante) {
    let statusId = await restauranteDAO.selectRestauranteByID(idRestaurante);

    if (statusId) {
        if (idRestaurante == '' || idRestaurante == undefined || isNaN(idRestaurante)) {
            return message.ERROR_INVALID_ID; //Status code 400
        } else {
            let resultDados = await restauranteDAO.deleteRestaurante(idRestaurante)

            if (resultDados) {
                return message.SUCESS_DELETED_ITEM
            } else {
                return message.ERROR_INTERNAL_SERVER
            }
        }
    } else {
        return message.ERROR_NOT_FOUND
    }

}

const atualizarRestaurante = async function (dadosRestaurante, idRestaurante) {

    if (
        dadosRestaurante.nome_proprietario == '' || dadosRestaurante.nome_proprietario == undefined || dadosRestaurante.nome_proprietario.length > 150 ||
        dadosRestaurante.nome_fantasia == '' || dadosRestaurante.nome_fantasia == undefined || dadosRestaurante.nome_fantasia.length > 150 ||
        dadosRestaurante.razao_social == '' || dadosRestaurante.razao_social == undefined || dadosRestaurante.razao_social > 150 ||
        dadosRestaurante.email == '' || dadosRestaurante.email == undefined || dadosRestaurante.email > 255 ||
        dadosRestaurante.senha == '' || dadosRestaurante.senha == undefined || dadosRestaurante.senha > 150 ||
        dadosRestaurante.id_categoria_restaurante == '' || dadosRestaurante.id_categoria_restaurante == undefined || isNaN(dadosRestaurante.id_categoria_restaurante) ||
        dadosRestaurante.id_endereco_restaurante == '' || dadosRestaurante.id_endereco_restaurante == undefined || isNaN(dadosRestaurante.id_endereco_restaurante) ||
        dadosRestaurante.cnpj == '' || dadosRestaurante.cnpj == undefined ||
        dadosRestaurante.token == '' || dadosRestaurante.token == undefined ||
        dadosRestaurante.tempo_expiracao == '' || dadosRestaurante.tempo_expiracao == undefined  

    ){
        return message.ERROR_INTERNAL_SERVER.ERROR_REQUIRED_FIELDS

    } else if (idRestaurante == '' || idRestaurante == undefined || idRestaurante == isNaN(idRestaurante)) {

        return message.message.ERROR_INVALID_ID
    } else {
        dadosRestaurante.id = idRestaurante;

        let statusId = await restauranteDAO.selectLastId();

        if (statusId) {
      
            let resultDados = await restauranteDAO.updateRestaurante(dadosRestaurante);

            if (resultDados) {

                let dadosRestauranteJSON = {}
                dadosRestauranteJSON.status = message.SUCESS_UPDATED_ITEM.status
                dadosRestauranteJSON.message = message.SUCESS_UPDATED_ITEM.message
                dadosRestauranteJSON.cliente = dadosRestaurante

                return dadosRestauranteJSON
            } else
                return message.ERROR_INTERNAL_SERVER

        } else {
            return message.ERROR_NOT_FOUND
        }
    }
}

const getRestaurantes = async function () {
    let dadosRestaurantesJSON = {};

    let dadosRestaurante = await restauranteDAO.selectAllRestaurante();

    if (dadosRestaurante) {

        dadosRestaurantesJSON.status = message.SUCESS_REQUEST.status
        dadosRestaurantesJSON.message = message.SUCESS_REQUEST.message
        dadosRestaurantesJSON.quantidade = dadosRestaurante.length;
        dadosRestaurantesJSON.restaurantes = dadosRestaurante
        return dadosRestaurantesJSON
    } else {
        return message.ERROR_NOT_FOUND
    }

}

const getRestauranteByEmailSenha = async function (email, password) {
    
    if (
        email == '' || email == undefined || email.length > 255 ||
        password == '' || password == undefined || password.length > 150
    ) {
        return message.ERROR_REQUIRED_FIELDS

    } else {

        // Import do JWT
        const jwt = require("../middleware/middlewareJWT.js");

        let RestauranteJsonEmailpassword = {}

        let dadosRestaurante = await restauranteDAO.selectRestauranteByEmailPassword(email, password)

        if (dadosRestaurante != null && dadosRestaurante != undefined) {

            let tokenUser = await jwt.createJWT(dadosRestaurante[0].id);
            
            // Inclua o token no objeto dadosRestaurante
            dadosRestaurante[0].token = tokenUser;

            RestauranteJsonEmailpassword.status = message.SUCESS_REQUEST.status
            RestauranteJsonEmailpassword.Restaurante = dadosRestaurante;

            return RestauranteJsonEmailpassword

        } else {
            return message.ERROR_INVALID_EMAIL_PASSWORD
        }
    }
}


const getRestaurantePorID = async function (id) {

    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosJSON = {}

        let dados = await restauranteDAO.selectRestauranteByID(id)

        if (dados) {
            dadosJSON.status = message.SUCESS_REQUEST.status
            dadosJSON.message = message.SUCESS_REQUEST.message
            dadosJSON.restaurantes = dados
            return dadosJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    }
}

const autenticarLoginRestauranteEmailSenha = async function (email, password) {
    
    if (
        email == '' || email == undefined || email.length > 255 ||
        password == '' || password == undefined || password.length > 150
    ) {
        return message.ERROR_REQUIRED_FIELDS

    } else {

        // Import do JWT
        const jwt = require("../middleware/middlewareJWT.js");

        let restauranteJSONEmailpassword = {}

        let dadosRestaurante = await restauranteDAO.selectRestauranteByEmailPassword(email, password)

        if (dadosRestaurante != null && dadosRestaurante != undefined) {

            let tokenUser = await jwt.createJWT(dadosRestaurante[0].id);
            
            // Inclua o token no objeto dadosRestaurante
            dadosRestaurante[0].token = tokenUser;

            restauranteJSONEmailpassword.status = message.SUCESS_REQUEST.status
            restauranteJSONEmailpassword.restaurante = dadosRestaurante;

            return restauranteJSONEmailpassword

        } else {
            return message.ERROR_INVALID_EMAIL_PASSWORD
        }
    }
}

module.exports = {
    inserirRestaurante,
    deletarRestaurante,
    atualizarRestaurante,
    getRestaurantes,
    getRestaurantePorID,
    getRestauranteByEmailSenha,
    autenticarLoginRestauranteEmailSenha

}