import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { readJsonFile, writeJsonFile } from '../utils/fileHelper.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const usersFilePath = join(__dirname, '../data/users.json');

async function findAll() {
  return readJsonFile(usersFilePath);
}

async function findByEmail(email) {
  const users = await findAll();

  return (
    users.find((user) => user.email === email.trim().toLowerCase()) || null
  );
}

async function findById(userId) {
  const users = await findAll();

  return users.find((user) => user.id === userId) || null;
}

async function create(user) {
  const users = await findAll();

  users.push(user);

  await writeJsonFile(usersFilePath, users);

  return user;
}

export { create, findAll, findById, findByEmail };
