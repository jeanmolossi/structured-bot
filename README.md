# Estruturação do Bot

## backend

All modules services have test files. It helps to write correctly code with funcionalities in rules of business. That was really awesome to study.

That architeture makes the applications so easy to change libs integration to any another lib.

Its make so easy too the new ones implementations.

Look the architecture:

- config
  - Configuration files from project

- modules
  - Product
    - dtos
    - entities
    - infra
    - repositories
    - services
  - User
    - dtos
    - entities [Model of entities to application]
    - infra [used Libs to funcionalities]
    - repositories
      - fakes [Fake respository to tests]
    - services [Real funcionality application - Rules of business]
- shared
  - container [For dependency injection]
  - errors [Global error handler]
  - infra [Libs domains to funcionalities]
  - services [Global services from application]

## Business Rules

(pt-BR)
-

- Usuário Administrador
  - [x] Deve poder cadastrar um email e uma senha
  - [x] Deve poder alterar o cadastro de um cliente
  - [ ] Deve poder excluir o cadastro de um cliente
  - [x] Deve poder cadastrar produtos
  - [ ] Deve poder syncronizar produtos com grupos

---

- Produto
  - [ ] Deve poder ser sincronizado nos grupos
  - [ ] Deve poder ser removido da sincronização

---

- Bot
  - [ ] Deve poder executar limpeza no grupo
  - [ ] Deve poder cadastrar um usuário padrão
  - [ ] Deve poder adicionar assinatura para usuário


### Functional rules

(pt-BR)
-
- Usuário padrão
  - Deve poder cadastrar um email e uma senha
    * Rota simples, não autenticada
  - Deve poder cadastrar uma transação da Monetizze
    - Rota autenticada
  - Deve poder recuperar senha através do telegram
    - Bot envia mensagem com link e código de recuperação
  - Deve poder acessar lista de grupos de seus produtos
    - Rota autenticada
- Usuário Administrador - *Todas rotas autenticadas*
  - Deve poder cadastrar produtos
  - Deve poder syncronizar produtos com grupos
  - Deve poder alterar o cadastro de um cliente
  - Deve poder excluir o cadastro de um cliente

---

- Produto
  - Deve poder ser sincronizado nos grupos
  - Deve poder ser removido da sincronização

---

- Bot
  - Deve poder executar limpeza no grupo
  - Deve poder enviar um código de recuperação de senha para o usuário

## frontend
