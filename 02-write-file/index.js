
const path = require('path');
const fs = require('fs');
const toFile = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const { stdin, stdout } = process;

stdin.on ('data', data => {
  if (data.toString().trim() == 'exit') process.exit();
  toFile.write(data);
});

process.on ('SIGINT',() => process.exit ());
process.on ('exit', () => stdout.write ('...Программа завершена'));
stdout.write ('Введите текст...\n');