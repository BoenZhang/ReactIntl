const fs = require('fs');
const babel = require('babel-core');

let options = process.argv,
    words = {},
    totalFiles = '',
    DealedFiles = 0,
    filesList = [],
    babelConf = {comments: false};

let getExtractWords = function (dir) {
  let dirname = getAllFiles(dir);
    totalFiles = dirname.length;

  filesList = dirname;
  dirname.length > 0 && dirname.forEach((item) => parseFileWords(item));
}

let getAllFiles = function (root) {
  let res = [], files = fs.readdirSync(root);
  files.forEach(function (file) {
    let pathname = root + '/' + file,
        stat = fs.lstatSync(pathname);

    if (!stat.isDirectory()) {
      pathname.indexOf('js') > 0 && res.push(pathname.replace(/\/\//g, '/'));
    } else {
      res = res.concat(getAllFiles(pathname));
    }
  });
  return res
}

let parseFileWords = function (file) {
  fs.readFile(file, function (err, buffer) {
    if (err) throw err;

    babelConf = Object.assign(babelConf, JSON.parse(fs.readFileSync('../.babelrc').toString()));

    let content = buffer.toString();
    content = babel.transform(content, babelConf);
    content = content.code;
    content = content.replace(/\\u\w{4}/g, all =>  eval('\'' + all +  '\''));
    content = content.match(/[\u4e00-\u9fa5]+/g);
    content && content.forEach((item) => words[item] == undefined && (words[item] = ''));

    console.log(`processed file: ${file}`)

    DealedFiles += 1;
    if (totalFiles == DealedFiles) {
      fs.writeFile(options[3], `export default ${JSON.stringify(words)}`, 'utf8', function () {
        console.log(`\x1b[32m写入成功！${options[3]}\x1b[30m`)
      });
      let files = filesList.join('\n');
    }
  });
}

if (!options[3]) {
  console.log('\x1b[30m./extract.sh srcDir|srcFile destFile \n\x1b[30mexample: \x1b[31m./extract.sh ../src/portals/ ./translate-EN.js\x1b[30m')
} else {
  fs.stat(options[3], function(err, stat){
    if(stat && stat.isFile()) {
      words = JSON.parse(fs.readFileSync(options[3]).toString().replace(/^export default /, ''));
      console.log(words);
    }
  });
  if (fs.lstatSync(options[2]).isDirectory()) {
    try {
      getExtractWords(options[2])
    }
    catch (e){
      console.log(e);
    }
  } else {
    totalFiles = 1;
    parseFileWords(options[2])
  }
}
