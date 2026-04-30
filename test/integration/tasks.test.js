import request from 'supertest';
import { expect } from 'chai';

import app from '../../src/app.js';
import { createUserAndGetToken } from '../helpers/authHelper.js';
import { resetDataFiles } from '../helpers/testDataHelper.js';

describe('Rotas de Tarefas', () => {
  beforeEach(async () => {
    await resetDataFiles();
  });

  describe('POST /tasks', () => {
    it('deve criar uma tarefa para o usuário autenticado', async () => {
      const { token } = await createUserAndGetToken();

      const payload = {
        title: 'Estudar testes de API',
        description: 'Praticar testes de integração com Supertest',
        status: 'pending',
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal('Tarefa criada com sucesso');
      expect(response.body.data).to.include(payload);
      expect(response.body.data.userId).to.be.a('string');
      expect(response.body.data.id).to.be.a('string');
    });

    it('deve retornar não autorizado quando o token está ausente', async () => {
      const response = await request(app).post('/tasks').send({
        title: 'Estudar testes de API',
        description: 'Praticar testes de integração com Supertest',
        status: 'pending',
      });

      expect(response.status).to.equal(401);
      expect(response.body).to.deep.equal({
        message: 'Token de autenticação é obrigatório',
        errors: [],
      });
    });

    it('deve retornar não autorizado quando o token é inválido', async () => {
      const response = await request(app)
        .post('/tasks')
        .set('Authorization', 'Bearer token-invalido')
        .send({
          title: 'Estudar testes de API',
          description: 'Praticar testes de integração com Supertest',
          status: 'pending',
        });

      expect(response.status).to.equal(401);
      expect(response.body).to.deep.equal({
        message: 'Token de autenticação inválido',
        errors: [],
      });
    });

    it('deve retornar erro de validação quando o status é inválido', async () => {
      const { token } = await createUserAndGetToken();

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Estudar testes de API',
          description: 'Praticar testes de integração com Supertest',
          status: 'archived',
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({
        message: 'Erro de validação',
        errors: ['status deve ser um dos seguintes: pending, in_progress, done'],
      });
    });

    it('deve retornar erro de validação quando o payload contém campos desconhecidos', async () => {
      const { token } = await createUserAndGetToken();

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Estudar testes de API',
          description: 'Praticar testes de integração com Supertest',
          status: 'pending',
          priority: 'high',
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({
        message: 'Erro de validação',
        errors: ['campos desconhecidos não são permitidos: priority'],
      });
    });
  });

  describe('GET /tasks', () => {
    it('deve listar apenas as tarefas do usuário autenticado', async () => {
      const mariaAuth = await createUserAndGetToken();
      const joaoAuth = await createUserAndGetToken({
        name: 'Joao Souza',
        email: 'joao@email.com',
      });

      await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${mariaAuth.token}`)
        .send({
          title: 'Tarefa da Maria',
          description: 'Pertence à Maria',
          status: 'pending',
        });

      await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${joaoAuth.token}`)
        .send({
          title: 'Tarefa do João',
          description: 'Pertence ao João',
          status: 'done',
        });

      const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${mariaAuth.token}`);

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Tarefas retornadas com sucesso');
      expect(response.body.data).to.have.lengthOf(1);
      expect(response.body.meta).to.deep.equal({
        page: 1,
        limit: 1,
        totalItems: 1,
        totalPages: 1,
      });
      expect(response.body.data[0]).to.include({
        title: 'Tarefa da Maria',
        description: 'Pertence à Maria',
        status: 'pending',
      });
    });

    it('deve filtrar tarefas por status', async () => {
      const { token } = await createUserAndGetToken();

      await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Tarefa pendente',
          description: 'Ainda em aberto',
          status: 'pending',
        });

      await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Tarefa concluída',
          description: 'Já finalizada',
          status: 'done',
        });

      const response = await request(app)
        .get('/tasks?status=done')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.lengthOf(1);
      expect(response.body.meta.totalItems).to.equal(1);
      expect(response.body.data[0]).to.include({
        title: 'Tarefa concluída',
        status: 'done',
      });
    });

    it('deve filtrar tarefas por termo de busca de forma case-insensitive', async () => {
      const { token } = await createUserAndGetToken();

      await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Estudar testes de API',
          description: 'Praticar com Supertest',
          status: 'pending',
        });

      await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Ler documentação',
          description: 'Referência do Swagger',
          status: 'done',
        });

      const response = await request(app)
        .get('/tasks?search=superTEST')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.lengthOf(1);
      expect(response.body.meta.totalItems).to.equal(1);
      expect(response.body.data[0]).to.include({
        title: 'Estudar testes de API',
      });
    });

    it('deve combinar filtros de status e busca textual', async () => {
      const { token } = await createUserAndGetToken();

      await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Revisar testes de API',
          description: 'Revisão pendente',
          status: 'pending',
        });

      await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Revisar testes de API',
          description: 'Revisão concluída',
          status: 'done',
        });

      const response = await request(app)
        .get('/tasks?status=done&search=revisar')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.lengthOf(1);
      expect(response.body.meta.totalItems).to.equal(1);
      expect(response.body.data[0]).to.include({
        title: 'Revisar testes de API',
        status: 'done',
      });
    });

    it('deve ordenar tarefas por título em ordem ascendente', async () => {
      const { token } = await createUserAndGetToken();

      await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Zulu task',
          description: 'Último alfabeticamente',
          status: 'pending',
        });

      await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Alpha task',
          description: 'Primeiro alfabeticamente',
          status: 'done',
        });

      const response = await request(app)
        .get('/tasks?sortBy=title&order=asc')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.lengthOf(2);
      expect(response.body.data[0].title).to.equal('Alpha task');
      expect(response.body.data[1].title).to.equal('Zulu task');
    });

    it('deve paginar as tarefas', async () => {
      const { token } = await createUserAndGetToken();

      await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Tarefa 1',
          description: 'Primeira tarefa',
          status: 'pending',
        });

      await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Tarefa 2',
          description: 'Segunda tarefa',
          status: 'pending',
        });

      await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Tarefa 3',
          description: 'Terceira tarefa',
          status: 'done',
        });

      const response = await request(app)
        .get('/tasks?sortBy=title&order=asc&page=2&limit=1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.lengthOf(1);
      expect(response.body.data[0].title).to.equal('Tarefa 2');
      expect(response.body.meta).to.deep.equal({
        page: 2,
        limit: 1,
        totalItems: 3,
        totalPages: 3,
      });
    });

    it('deve retornar erro de validação quando o filtro de status é inválido', async () => {
      const { token } = await createUserAndGetToken();

      const response = await request(app)
        .get('/tasks?status=archived')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({
        message: 'Erro de validação',
        errors: [
          'o parâmetro status deve ser um dos seguintes: pending, in_progress, done',
        ],
      });
    });

    it('deve retornar erro de validação quando o parâmetro search está vazio', async () => {
      const { token } = await createUserAndGetToken();

      const response = await request(app)
        .get('/tasks?search=')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({
        message: 'Erro de validação',
        errors: ['o parâmetro search não pode ser vazio'],
      });
    });

    it('deve retornar erro de validação quando parâmetros de query desconhecidos são fornecidos', async () => {
      const { token } = await createUserAndGetToken();

      const response = await request(app)
        .get('/tasks?priority=high')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({
        message: 'Erro de validação',
        errors: ['parâmetros de query desconhecidos não são permitidos: priority'],
      });
    });

    it('deve retornar erro de validação quando o sortBy é inválido', async () => {
      const { token } = await createUserAndGetToken();

      const response = await request(app)
        .get('/tasks?sortBy=priority')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({
        message: 'Erro de validação',
        errors: [
          'o parâmetro sortBy deve ser um dos seguintes: createdAt, updatedAt, title',
        ],
      });
    });

    it('deve retornar erro de validação quando o order é inválido', async () => {
      const { token } = await createUserAndGetToken();

      const response = await request(app)
        .get('/tasks?order=descending')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({
        message: 'Erro de validação',
        errors: ['o parâmetro order deve ser um dos seguintes: asc, desc'],
      });
    });

    it('deve retornar erro de validação quando o page é inválido', async () => {
      const { token } = await createUserAndGetToken();

      const response = await request(app)
        .get('/tasks?page=0')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({
        message: 'Erro de validação',
        errors: ['o parâmetro page deve ser um inteiro maior ou igual a 1'],
      });
    });

    it('deve retornar erro de validação quando o limit é inválido', async () => {
      const { token } = await createUserAndGetToken();

      const response = await request(app)
        .get('/tasks?limit=101')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({
        message: 'Erro de validação',
        errors: ['o parâmetro limit deve ser um inteiro entre 1 e 100'],
      });
    });
  });

  describe('GET /tasks/:id', () => {
    it('deve retornar uma tarefa que pertence ao usuário autenticado', async () => {
      const { token } = await createUserAndGetToken();

      const createdTaskResponse = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Estudar mocks',
          description: 'Revisar test doubles',
          status: 'pending',
        });

      const response = await request(app)
        .get(`/tasks/${createdTaskResponse.body.data.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Tarefa retornada com sucesso');
      expect(response.body.data).to.include({
        title: 'Estudar mocks',
        description: 'Revisar test doubles',
        status: 'pending',
      });
    });

    it('deve retornar não encontrado quando a tarefa pertence a outro usuário', async () => {
      const mariaAuth = await createUserAndGetToken();
      const joaoAuth = await createUserAndGetToken({
        name: 'Joao Souza',
        email: 'joao@email.com',
      });

      const createdTaskResponse = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${mariaAuth.token}`)
        .send({
          title: 'Tarefa privada da Maria',
          description: 'Pertence à Maria',
          status: 'pending',
        });

      const response = await request(app)
        .get(`/tasks/${createdTaskResponse.body.data.id}`)
        .set('Authorization', `Bearer ${joaoAuth.token}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        message: 'Tarefa não encontrada',
        errors: [],
      });
    });

    it('deve retornar não encontrado quando o ID da tarefa não existe', async () => {
      const { token } = await createUserAndGetToken();

      const response = await request(app)
        .get('/tasks/id-de-tarefa-inexistente')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        message: 'Tarefa não encontrada',
        errors: [],
      });
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('deve atualizar parcialmente uma tarefa', async () => {
      const { token } = await createUserAndGetToken();

      const createdTaskResponse = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Estudar testes de API',
          description: 'Descrição inicial',
          status: 'pending',
        });

      const response = await request(app)
        .patch(`/tasks/${createdTaskResponse.body.data.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'done',
        });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Tarefa atualizada com sucesso');
      expect(response.body.data).to.include({
        title: 'Estudar testes de API',
        description: 'Descrição inicial',
        status: 'done',
      });
    });

    it('deve retornar erro de validação quando o payload está vazio', async () => {
      const { token } = await createUserAndGetToken();

      const createdTaskResponse = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Estudar testes de API',
          description: 'Descrição inicial',
          status: 'pending',
        });

      const response = await request(app)
        .patch(`/tasks/${createdTaskResponse.body.data.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({
        message: 'Erro de validação',
        errors: ['pelo menos um campo válido deve ser fornecido'],
      });
    });

    it('deve retornar erro de validação quando o payload contém campos desconhecidos', async () => {
      const { token } = await createUserAndGetToken();

      const createdTaskResponse = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Estudar testes de API',
          description: 'Descrição inicial',
          status: 'pending',
        });

      const response = await request(app)
        .patch(`/tasks/${createdTaskResponse.body.data.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'done',
          priority: 'high',
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({
        message: 'Erro de validação',
        errors: ['campos desconhecidos não são permitidos: priority'],
      });
    });

    it('deve retornar não encontrado ao tentar atualizar a tarefa de outro usuário', async () => {
      const mariaAuth = await createUserAndGetToken();
      const joaoAuth = await createUserAndGetToken({
        name: 'Joao Souza',
        email: 'joao@email.com',
      });

      const createdTaskResponse = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${mariaAuth.token}`)
        .send({
          title: 'Tarefa privada da Maria',
          description: 'Pertence à Maria',
          status: 'pending',
        });

      const response = await request(app)
        .patch(`/tasks/${createdTaskResponse.body.data.id}`)
        .set('Authorization', `Bearer ${joaoAuth.token}`)
        .send({
          status: 'done',
        });

      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        message: 'Tarefa não encontrada',
        errors: [],
      });
    });

    it('deve retornar não encontrado ao tentar atualizar uma tarefa inexistente', async () => {
      const { token } = await createUserAndGetToken();

      const response = await request(app)
        .patch('/tasks/id-de-tarefa-inexistente')
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'done',
        });

      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        message: 'Tarefa não encontrada',
        errors: [],
      });
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('deve excluir uma tarefa que pertence ao usuário autenticado', async () => {
      const { token } = await createUserAndGetToken();

      const createdTaskResponse = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Estudar testes de API',
          description: 'Tarefa a excluir',
          status: 'pending',
        });

      const deleteResponse = await request(app)
        .delete(`/tasks/${createdTaskResponse.body.data.id}`)
        .set('Authorization', `Bearer ${token}`);

      const getResponse = await request(app)
        .get(`/tasks/${createdTaskResponse.body.data.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(deleteResponse.status).to.equal(204);
      expect(deleteResponse.body).to.deep.equal({});
      expect(getResponse.status).to.equal(404);
    });

    it('deve retornar não encontrado ao tentar excluir a tarefa de outro usuário', async () => {
      const mariaAuth = await createUserAndGetToken();
      const joaoAuth = await createUserAndGetToken({
        name: 'Joao Souza',
        email: 'joao@email.com',
      });

      const createdTaskResponse = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${mariaAuth.token}`)
        .send({
          title: 'Tarefa privada da Maria',
          description: 'Pertence à Maria',
          status: 'pending',
        });

      const response = await request(app)
        .delete(`/tasks/${createdTaskResponse.body.data.id}`)
        .set('Authorization', `Bearer ${joaoAuth.token}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        message: 'Tarefa não encontrada',
        errors: [],
      });
    });

    it('deve retornar não encontrado ao tentar excluir uma tarefa inexistente', async () => {
      const { token } = await createUserAndGetToken();

      const response = await request(app)
        .delete('/tasks/id-de-tarefa-inexistente')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        message: 'Tarefa não encontrada',
        errors: [],
      });
    });
  });
});
