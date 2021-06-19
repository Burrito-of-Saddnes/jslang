let fs = require('fs');
let start = fs.readFileSync('components/std_lib.js', 'utf-8');

let lexer = new (require('./components/lexer.js'))(fs.readFileSync('script.ms', 'utf-8'));
let tokens = lexer.tokenize();

let parser = new (require('./components/parser.js'))( tokens );
let result = parser.parse().compile();
// console.log("РЕЗУЛЬТАТ:\n" + result);

eval(fs.readFileSync('components/std_lib.js', 'utf-8') + '\n;\n' + result);
fs.writeFileSync('script.js', fs.readFileSync('components/std_lib.js', 'utf-8') + ';\n\n' + result);


/// `node main` in commandpront to start