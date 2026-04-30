import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const usersFilePath = join(__dirname, '../../src/data/users.json');
const tasksFilePath = join(__dirname, '../../src/data/tasks.json');

async function resetDataFiles() {
  await writeFile(usersFilePath, '[]\n');
  await writeFile(tasksFilePath, '[]\n');
}

export { resetDataFiles };
