import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import request from 'supertest';
import { expect } from 'chai';
import bcrypt from 'bcryptjs';

import app from '../../src/app.js';
import { resetDataFiles } from '../helpers/testDataHelper.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const usersFilePath = join(__dirname, '../../src/data/users.json');

describe('POST /users', () => {
  beforeEach(async () => {
    await resetDataFiles();
  });

  it('deve criar um usuário com senha criptografada', async () => {
    const payload = {
      name: 'Maria Silva',
      email: 'maria@email.com',
      password: '123456',
    };

    const response = await request(app).post('/users').send(payload);

    const savedUsers = JSON.parse(await readFile(usersFilePath, 'utf-8'));

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal('Usuário criado com sucesso');
    expect(response.body.data).to.include({
      name: payload.name,
      email: payload.email,
    });
    expect(response.body.data).to.not.have.property('password');
    expect(savedUsers).to.have.lengthOf(1);
    expect(savedUsers[0].password).to.not.equal(payload.password);
    expect(
      await bcrypt.compare(payload.password, savedUsers[0].password)
    ).to.equal(true);
  });

  it('deve retornar conflito quando o e-mail já está cadastrado', async () => {
    const payload = {
      name: 'Maria Silva',
      email: 'maria@email.com',
      password: '123456',
    };

    await request(app).post('/users').send(payload);
    const response = await request(app).post('/users').send(payload);

    expect(response.status).to.equal(409);
    expect(response.body).to.deep.equal({
      message: 'E-mail já está cadastrado',
      errors: [],
    });
  });

  it('deve retornar erro de validação quando a senha é curta demais', async () => {
    const payload = {
      name: 'Maria Silva',
      email: 'maria@email.com',
      password: '123',
    };

    const response = await request(app).post('/users').send(payload);

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({
      message: 'Erro de validação',
      errors: ['a senha deve ter pelo menos 6 caracteres'],
    });
  });

  it('deve retornar erro de validação quando o payload contém campos desconhecidos', async () => {
    const response = await request(app).post('/users').send({
      name: 'Maria Silva',
      email: 'maria@email.com',
      password: '123456',
      role: 'admin',
    });

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({
      message: 'Erro de validação',
      errors: ['campos desconhecidos não são permitidos: role'],
    });
  });

  it('deve retornar erro de validação quando múltiplos campos desconhecidos são enviados', async () => {
    const response = await request(app).post('/users').send({
      name: 'Maria Silva',
      email: 'maria@email.com',
      password: '123456',
      role: 'admin',
      isAdmin: true,
    });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Erro de validação');
    expect(response.body.errors).to.have.lengthOf(1);
    expect(response.body.errors[0]).to.include(
      'campos desconhecidos não são permitidos'
    );
    expect(response.body.errors[0]).to.include('role');
    expect(response.body.errors[0]).to.include('isAdmin');
  });
});
