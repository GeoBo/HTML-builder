const path = require('path');
const fs = require('fs');
const stream = fs.createReadStream(path.join(__dirname, 'text.txt'));
const { stdout } = process;

stream.on('data', chunk => stdout.write(chunk));
stream.on('end', () => stdout.write('...Файл успешно загружен!'));
stream.on('error', error => stdout.write(`Ошибка: ${error.message}`));

stdout.write('Начинаем чтение файла...\n');