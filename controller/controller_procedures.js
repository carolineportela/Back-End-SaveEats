/***************************************************************************************************************************************************
 * Objetivo: Responsavel pela regra de negocio referente as procedures
 * Data: 14/09/2023
 * Autor: Caroline Portela
 * Versão: 1.0
 ***************************************************************************************************************************************************/

var message = require('./modulo/config.js')

var proceduresDAO = require('../model/DAO/procedureDAO.js')

const inserirCadastroProcedure = async (dadosCadastro) => {

    if  (dadosCadastro.nome_categoria == '' || dadosCadastro.nome_categoria == undefined  
    ) {

        return message.ERROR_REQUIRED_FIELDS

    } else {

        let dadosJSON = {}

        let resultadoDados = await proceduresDAO.proceduresRestauranteCadastro(dadosCadastro)

        if (resultadoDados) {

            

            dadosJSON.status = message.SUCESS_CREATED_ITEM.status
            dadosJSON.message = message.SUCESS_CREATED_ITEM.message
            

            return dadosJSON

        } else {

            return message.ERROR_INTERNAL_SERVER

        }

    }

}

const inserirEnderecoClienteCadastro = async (dadosEndereco) => {

    if  (dadosEndereco.rua == '' || dadosEndereco.rua == undefined  
    ) {

        return message.ERROR_REQUIRED_FIELDS

    } else {

        let dadosJSON = {}

        let resultadoDados = await proceduresDAO.procedureInsertEnderecoCliente(dadosEndereco)

        if (resultadoDados) {

            
            dadosJSON.status = message.SUCESS_CREATED_ITEM.status
            dadosJSON.message = message.SUCESS_CREATED_ITEM.message
            

            return dadosJSON

        } else {

            return message.ERROR_INTERNAL_SERVER

        }

    }

}


module.exports = {
    inserirCadastroProcedure,
    inserirEnderecoClienteCadastro
}