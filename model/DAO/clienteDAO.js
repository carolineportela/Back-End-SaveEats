/***************************************************************************************************************************************************
 * Objetivo: Responsavel pela manipulação de dados dos USUARIOS CLIENTES no Banco de Dados
 * Data: 31/08/2023
 * Autor: Caroline Portela
 * Versão: 1.0
 ***************************************************************************************************************************************************///Import da biblioteca do prisma client


 var { PrismaClient } = require('@prisma/client')

var prisma = new PrismaClient()


////////////////////////Inserts//////////////////////////
const insertCliente = async function (dadosCliente) {
    let sql = `insert into tbl_cliente (
        nome,
        email,
        senha,
        cpf,
        foto,
        telefone,
        token_recuperar_senha,
        tempo_expiracao
    ) values (
        '${dadosCliente.nome}',
        '${dadosCliente.email}',
        '${dadosCliente.senha}',
        '${dadosCliente.cpf}',
        '${dadosCliente.foto}',
        '${dadosCliente.telefone}',
        '${dadosCliente.token_recuperar_senha}',
        '${dadosCliente.tempo_expiracao}'
    )`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    } else {
        return false
    }

}

//////////////////////Deletes///////////////////////////
const deleteCliente = async function (id) {
    let sql = `delete from tbl_cliente where id = ${id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus){
        return true
    } else {
        return false
    }

}


///////////////////////Updates//////////////////////////
const updateCliente = async function (dadosCliente) {
    let sql = `update tbl_cliente set
                    nome = '${dadosCliente.nome}',
                    email = '${dadosCliente.email}',
                    senha = '${dadosCliente.senha}',
                    cpf = '${dadosCliente.cpf}',
                    foto = '${dadosCliente.foto}',
                    telefone = '${dadosCliente.telefone}'


                where id = ${dadosCliente.id}    
            `

    //Executa o scriptSQL no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus){
        return true
    } else {
        return false
    }
}

///////////////////////Selects//////////////////////////
const selectAllClientes = async function () {
    let sql = `select * from tbl_cliente`

    let rsCliente = await prisma.$queryRawUnsafe(sql)

    if (rsCliente.length > 0) {
        return rsCliente;
    }
    else {
        return false;
    }
}

const selectClienteByID = async function (id) {
    let sql = `select * from tbl_cliente where id = ${id}`

    let rsCliente = await prisma.$queryRawUnsafe(sql)

    if (rsCliente.length > 0){
        return rsCliente
    }{
        return false
    }
    
        
}

const selectClienteByEmailPassword = async function(email, password){
    let sql = `select * from tbl_cliente where email = '${email}' and senha = '${password}';`

    let rsCliente = await prisma.$queryRawUnsafe(sql);

    if (rsCliente.length > 0){
        return rsCliente
    } else{
        return false
    }
}


const selectClienteByEmail = async function(email){
    let sql = `select * from tbl_cliente where email = '${email}';`

    let rsCliente = await prisma.$queryRawUnsafe(sql);

    if (rsCliente.length > 0){
        return rsCliente
    } else{
        return false
    }
}

//Funcao pra verificar se o email que for inserido no cadastro ja existe no banco
const verificarEmailExistenteCliente = async function (email) {
    let sql = `SELECT  * FROM tbl_cliente WHERE email = '${email}';`

    let rsEmailCliente = await prisma.$queryRawUnsafe(sql)

    if (rsEmailCliente.length > 0) {
        return rsEmailCliente;
    }
    else {
        return false;
    }
}

const selectLastId = async function () {
    let sql = `select * from tbl_cliente order by id desc limit 1;`

    let rsCliente = await prisma.$queryRawUnsafe(sql)

    if (rsCliente.length > 0){
        return rsCliente
    } else{
        return false
    }
   
}          

//trazer endereco de um cliente
const selectEnderecoByIdCliente = async function (id) {
    let sql = `SELECT
    tbl_cliente.id AS id_cliente,
    tbl_cliente.nome AS nome_cliente,
    tbl_cliente.telefone AS telefone_cliente,
    tbl_intermed_endereco_cliente.id AS id_intermed_endereco_cliente,
    tbl_endereco_cliente.id AS id_endereco_cliente,
    tbl_endereco_cliente.logradouro AS logradouro_cliente,
    tbl_endereco_cliente.cep AS cep_cliente,
    tbl_endereco_cliente.bairro AS bairro_cliente,
    tbl_endereco_cliente.numero AS numero_endereco_cliente,
    tbl_endereco_cliente.complemento AS complemento_cliente,
    tbl_endereco_cliente.uf AS uf_cliente,
	tbl_endereco_cliente.localidade AS localidade_cliente
    FROM
    tbl_intermed_endereco_cliente
    INNER JOIN
    tbl_cliente ON tbl_intermed_endereco_cliente.id_cliente = tbl_cliente.id
    INNER JOIN
    tbl_endereco_cliente ON tbl_intermed_endereco_cliente.id_endereco_cliente = tbl_endereco_cliente.id
    WHERE
    tbl_cliente.id = ${id}
`

    let rsCliente = await prisma.$queryRawUnsafe(sql)

    if (rsCliente.length > 0){
        return rsCliente
    }{
        return false
    }
    
        
}


module.exports = {
    insertCliente,
    deleteCliente,
    selectLastId,
    selectClienteByID,
    updateCliente,
    selectAllClientes,
    selectClienteByEmailPassword,
    verificarEmailExistenteCliente,
    selectClienteByEmail,
    selectEnderecoByIdCliente
}