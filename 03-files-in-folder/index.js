
const { readdir } = require('fs/promises');
const { stat } = require('fs/promises');
const path = require('path');
const { stdout } = process;
const secretFolder = path.join(__dirname, 'secret-folder');

getFiles (secretFolder);

async function getFiles (dirPath){
  const files = await readdir (dirPath);
  for (const fileName of files) {
    const filePath = path.join (dirPath, fileName);	 
    const file = await stat (filePath);
    if (file.isDirectory()) continue; 
    const ext = path.extname(filePath);
    const name = path.basename(filePath, ext);
    const size = formatSize (file.size);
    if (ext) stdout.write(`${name} - ${ext.slice(1)} - ${size}\n`);
    else stdout.write(`${name} - ? - ${size}\n`);
  }
}

function formatSize (fileSize){
  var i = 0, type = ['bytes','KB','MB','GB','TB'];
  while ((fileSize / 1000 | 0) && i < type.length - 1) {
    fileSize /= 1024;
    i++;
  }
  return fileSize.toFixed(3) + ' ' + type [i];
}