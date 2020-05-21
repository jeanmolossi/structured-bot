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
- Usuário padrão
  - Deve poder cadastrar uma senha
  - Deve poder recuperar senha através do telegram
  - Deve poder acessar lista de grupos de seus produtos
- Usuário Administrador
  - Deve poder cadastrar produtos
  - Deve poder syncronizar produtos com grupos
  - Deve poder alterar o cadastro de um cliente
  - Deve poder excluir o cadastro de um cliente

## frontend
