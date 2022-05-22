
const path = require('path');
const fromDir = path.join(__dirname, 'styles');
const toDir = path.join(__dirname, 'project-dist');
const fs = require('fs');
const { rm } = require('fs/promises');
const { readdir } = require('fs/promises');

mergeStyles (fromDir, toDir);
console.log('Запущен процесс слияния файлов CSS...');

async function mergeStyles (from, to){ 

  const data = [];
  const output = path.join(to, 'bundle.css');	 
  await rm (output, {force: true});
	
  const files = await readdir (from,  { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join (from, file.name);	 
    const ext = path.extname(filePath).slice(1);		
    if (file.isDirectory() || ext != 'css') continue;			
    data.push (filePath);	
  }

  console.log(`Обнаружено файлов css: ${data.length}`);
  const writeStream = fs.createWriteStream (output, {flags: 'a'});
  addToFile (data);
	
  function addToFile (data, i = 0) {
    const readStream = fs.createReadStream (data[i]);
    readStream.on ('data', chunk => writeStream.write(chunk));
    readStream.on ('close', function() {
      if (i == data.length - 1) {
        writeStream.close();
        console.log('Слияние завершено');
        return;
      }
      writeStream.write('\n'); //Чтобы не сливались стили
      addToFile (data, i+1);
    });
  }
}