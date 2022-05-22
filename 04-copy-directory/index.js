
const path = require('path');
const oldPath = path.join(__dirname, 'files');
const newPath = path.join(__dirname, 'files-copy');
const { mkdir } = require('fs/promises');	
const { copyFile } = require('fs/promises');
const { readdir } = require('fs/promises');
const { rm } = require('fs/promises');
const { stdout } = require('process');

copyDir (oldPath, newPath);
console.log('Запущен процесс копирования папки...');

async function copyDir (fromDir, toDir){ 
  let count = 0;
  await rm (newPath, {force: true, recursive: true});
  await mkdir (newPath);
  const files = await readdir (fromDir,  { withFileTypes: true });
  for (const file of files) {		 
    if (file.isDirectory()) continue;
    const filePath = path.join(fromDir, file.name);	
    const newPath = path.join (toDir, file.name);
    await copyFile (filePath, newPath);
    count++;
  }
  stdout.write (`Копированных файлов: ${count}`);
}