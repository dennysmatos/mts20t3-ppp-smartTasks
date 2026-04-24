# Testing Strategy

## Objetivo

Garantir que a API entregue comportamento consistente, seguro e previsível do ponto de vista de contrato e regra de negócio.

## Ferramentas

- Mocha
- Chai
- Supertest

## Tipo de teste atual

O projeto utiliza principalmente testes de integração de API, exercitando a aplicação pelo ponto de entrada HTTP.

## Cobertura atual

### Usuários

- criação com sucesso
- email duplicado
- senha inválida

### Autenticação

- login com sucesso
- senha incorreta
- email não cadastrado
- payload inválido
- consulta do usuário autenticado

### Tarefas

- criação com sucesso
- listagem somente do usuário autenticado
- filtros por `status`
- busca textual por `title` e `description`
- ordenação por `createdAt`, `updatedAt` e `title`
- paginação com `page` e `limit`
- busca por ID
- atualização parcial
- exclusão
- token ausente
- token inválido
- status inválido
- payload vazio no `PATCH`
- campos desconhecidos
- recurso inexistente
- recurso pertencente a outro usuário

### Tratamento global de erro

- rota inexistente
- JSON malformado

## Decisões importantes

- autenticação inválida retorna `401`
- recurso de outro usuário retorna `404` para evitar vazamento de informação
- payload com campos desconhecidos retorna `400`
- `PATCH` exige ao menos um campo válido para atualização
- queries inválidas de filtro, paginação e ordenação retornam `400`

## Próximos incrementos sugeridos

- testes para cenários de concorrência na persistência em JSON
- testes de contrato mais detalhados para Swagger
- cobertura de casos de borda para `users` e `auth`
- validação dos workflows de CI no GitHub Actions
