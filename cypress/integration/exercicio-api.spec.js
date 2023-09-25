/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

     let token
     before(() => {
          cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
     });


     it('0- Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(resposta => {
               return contrato.validateAsync(resposta.body)
          });

     });

     it('1- Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'

          }).then((resposta) => {
               expect(resposta.status).to.equal(200)
               expect(resposta.body).to.have.property('quantidade')

          });
     });

     it.only('2- Deve cadastrar um usuário com sucesso', () => {
          let nome = `Nome ${Math.floor(Math.random() * 10000000)}`
          let email = `email${Math.floor(Math.random() * 10000000) + '@email.com.br'}`
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": nome,
                    "email": email,
                    "password": "teste",
                    "administrador": "true"
               }

          }).then((resposta) => {
               expect(resposta.status).to.equal(201)
               expect(resposta.body.message).to.equal('Cadastro realizado com sucesso')
          })

     });

     it.only('3- Deve validar um usuário com email inválido', () => {
          let nome = `Nome ${Math.floor(Math.random() * 10000000)}`
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": nome,
                    "email": 'larissa.teste.inválio',
                    "password": "teste",
                    "administrador": "true"
               },

               failOnStatusCode: false

          }).then((resposta) => {
               expect(resposta.status).to.equal(400)
               expect(resposta.body.email).to.equal('email deve ser um email válido')
          })

     });

     it('4- Deve editar um usuário previamente cadastrado', () => {
          let nome = `Nome ${Math.floor(Math.random() * 10000000)}`
          let email = `email${Math.floor(Math.random() * 10000000) + '@email.com.br'}`
          cy.cadastrarUsuario(token, nome, email)
               .then(resposta => {
                    let id = resposta.body._id
                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         headers: { authorization: token },
                         body: {
                              "nome": nome,
                              "email": email,
                              "password": "teste",
                              "administrador": "true"
                         }

                    })

               }).then((resposta) => {
                    expect(resposta.status).to.equal(200)
                    expect(resposta.body.message).to.equal('Registro alterado com sucesso')
               })
     });

     it('5- Deve deletar um usuário previamente cadastrado', () => {
          let nome = `Nome ${Math.floor(Math.random() * 10000000)}`
          let email = `email${Math.floor(Math.random() * 10000000) + '@email.com.br'}`
          cy.cadastrarUsuario(token, nome, email)
               .then(resposta => {
                    let id = resposta.body._id
                    cy.request({
                         method: 'DELETE',
                         url:  `usuarios/${id}`
                    })

               }).then((resposta) => {
                    expect(resposta.status).to.equal(200)
                    expect(resposta.body.message).to.equal('Registro excluído com sucesso')
               })
     })



})
