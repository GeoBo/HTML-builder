

//***
//Соблюдение порядка стилей не требуется в соответствии с заданием, 
//поэтому в футере неправильные отступы
//-----------------

const path = require('path');
const dist = path.join(__dirname, 'project-dist');
const { mkdir } = require('fs/promises');	
const { readFile } = require('fs/promises');	
const { rm } = require('fs/promises');
const { writeFile } = require('fs/promises');
const { appendFile } = require('fs/promises');
const { readdir } = require('fs/promises');
const { stat } = require('fs/promises');
const { copyFile } = require('fs/promises');

console.log ('Запущен процесс создания DIST...');
createDist ();
process.on('exit', () => console.log('...Процесс завершен'));

async function createDist (){ 
  await rm (dist, {recursive: true, force: true});	
  await mkdir (dist, {recursive: true});
  createIndexHTML ();
  mergeStyles (); 
  copyAssets ();
}

async function createIndexHTML () { 
  const templateFile = path.join(__dirname, 'template.html');
  const compDir = path.join(__dirname, 'components');
  let template = await readFile (templateFile, 'utf-8');
  let templateInfo = [...template.matchAll(/{{(\S+)}}/g)];
  let dataShift = 0;
	
  for (const arr of templateInfo) {
    const fileName = `${arr[1]}.html`;
    const filePath = path.join (compDir, fileName);
    const file = await stat (filePath);	//try - catch
		
    if (!file || file.isDirectory()) continue;
    const data = await readFile (filePath);
    if (!data) continue;
    template = template.slice(0, arr.index + dataShift) + data + template.slice (arr.index + arr[0].length + dataShift);
    dataShift += data.length - arr[0].length;
  }
  await writeFile (path.join(dist, 'index.html'), template);
  console.log ('DIST: файл index.html создан');
}

async function mergeStyles (){
  const styles = path.join(__dirname, 'styles'); 
  const output = path.join(dist, 'style.css');	 
  let count = 0;
  await rm (output, {force: true});
    
  const files = await readdir (styles,  { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join (styles, file.name);	 
    const ext = path.extname(filePath).slice(1);		
    if (file.isDirectory() || ext != 'css') continue;			
    const data = await readFile (filePath) + '\n'; //Чтобы не сливались стили
    await appendFile (output, data);
    count++;
  }
  console.log ('DIST: файл style.css создан', `(использовано файлов css: ${count})`);
}


async function copyAssets (){
  const assets = path.join(__dirname, 'assets');
  const distAssets = path.join(dist, 'assets');
  await rm (distAssets, {force: true, recursive: true});
  await copyDir (assets, distAssets);
  console.log ('DIST: каталог assets создан');
}

async function copyDir (src, dest) {
  await mkdir(dest, { recursive: true });
  let entries = await readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if( entry.isDirectory() ) await copyDir (srcPath, destPath); 
    else await copyFile(srcPath, destPath);
  }
}