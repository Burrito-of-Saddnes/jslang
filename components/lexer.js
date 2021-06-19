class Token {

    constructor(type, text = type, sub = false) {
        this.type = type;
        this.text = text;

        if(sub !== false) {
            this.sub = sub;
        }

    }

    write() {
        console.log(this.type.toUpperCase(), ':', this.text)
    }
}

module.exports = class Lexer {

    constructor(code) {

        if(code) {
            this.init(code);
        }

    }

    init(code) {
        this.code = code;
        this.pos = 0;
        this.tokens = [];
    }

    tokenize() {

        while(this.current !== undefined) {

            if (this.isNumber()) this.tokenizeNumber()
            else if (this.isName()) this.tokenizeName()
            else if (this.isOperator()) this.tokenizeOperator()
            else if (this.isString()) this.tokenizeString()
            else this.next();

        }

        return this.tokens;
    }

    isNumber() {
        return '0123456789'.indexOf(this.current) !== -1;
    }

    isName() {
        return '$_abcdefjhigklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(this.current) !== -1;
    }

    isOperator() {
        return '#;+-*/(){}[]=><@%!&|'.indexOf(this.current) !== -1;
    }

    isString(t = 0) {

        if(t == 0) {
            return `'"`.indexOf(this.current) !== -1 ? this.current : false;
        }
        else {
            return t == this.current;
        }

    }

    tokenizeNumber() {

        let buffer = this.current;
        this.next();

        while(this.isNumber()) {
            buffer += this.current;
            this.next();
        }

        this.tokens.push(new Token('NUMBER', buffer));

    }

    tokenizeName() {

        let buffer = this.current;
        this.next();

        while(this.isName() || this.isNumber()) {
            buffer += this.current;
            this.next();
        }

        this.tokens.push(new Token('NAME', buffer));

    }

    tokenizeOperator() {

        if(this.current == '#') {
            this.tokens.push( new Token('OPERATOR', '#') );
            this.next();
            return;
        }

        if(this.current == ';') {
            this.tokens.push( new Token('OPERATOR', ';') );
            this.next();
            return;
        }

        if(this.current == '+') {
            this.tokens.push( new Token('OPERATOR', '+') );
            this.next();
            return;
        }

        if(this.current == '-') {
            this.tokens.push( new Token('OPERATOR', '-') );
            this.next();
            return;
        }

        if(this.current == '*') {
            this.tokens.push( new Token('OPERATOR', '*') );
            this.next();
            return;
        }

        if(this.current == '/') {
            this.tokens.push( new Token('OPERATOR', '/') );
            this.next();
            return;
        }

        if(this.current == '(') {
            this.tokens.push( new Token('OPERATOR', '(') );
            this.next();
            return;
        }

        if(this.current == ')') {
            this.tokens.push( new Token('OPERATOR', ')') );
            this.next();
            return;
        }

        if(this.current == '=') {
            this.tokens.push( new Token('OPERATOR', '=') );
            this.next();
            return;
        }

        if(this.current == ';') {
            this.tokens.push( new Token('OPERATOR', ';') );
            this.next();
            return;
        }

        if(this.current == '{') {
            this.tokens.push( new Token('OPERATOR', '{') );
            this.next();
            return;
        }

        if(this.current == '}') {
            this.tokens.push( new Token('OPERATOR', '}') );
            this.next();
            return;
        }

        if(this.current == '>') {
            this.tokens.push( new Token('OPERATOR', '>') );
            this.next();
            return;
        }

        if(this.current == '<') {
            this.tokens.push( new Token('OPERATOR', '<') );
            this.next();
            return;
        }

        if(this.current == '%') {
            this.tokens.push( new Token('OPERATOR', '%') );
            this.next();
            return;
        }

        if(this.current == '@') {
            this.tokens.push( new Token('OPERATOR', '@') );
            this.next();
            return;
        }

        if(this.current == '!') {
            this.tokens.push( new Token('OPERATOR', '!') );
            this.next();
            return;
        }

        if(this.current == '&') {
            this.tokens.push( new Token('OPERATOR', '&') );
            this.next();
            return;
        }

        if(this.current == '|') {
            this.tokens.push( new Token('OPERATOR', '|') );
            this.next();
            return;
        }

        this.next();

    }

    tokenizeString() {

        let buffer = '';
        let t = this.current;
        this.next();

        while(!this.isString(t)) {
            buffer += this.current;
            this.next();
        }

        this.next();
        this.tokens.push(new Token('STRING', buffer, t));

    }

    next() {
        this.pos++;
    }

    peek(pos = 0) {
        return this.code[this.pos + pos];
    }

    get current() {
        return this.peek();
    }

}