class NumberExpression {

    constructor(text = "null") {
        this.value = text;
    }

    compile() {
        return this.value;
    }

}

class StringExpression {

    constructor(text = "null", sub = '"') {
        this.text = text;
        this.sub = sub;
    }

    compile() {
        return this.sub + this.text + this.sub;
    }

}

class CommandExpression {

    constructor(expr1, ...params) {
        this.expr1 = expr1;
        this.params = params;
    }

    compile() {
        let params = [];
        this.params.forEach(p =>  {
            params.push(p.compile());
        });

        return `${this.expr1.compile()}.call({env},${params.join(',')})`;
    }

}

class NameExpression {

    constructor(text) {
        this.name = text;
    }

    compile(return_name = false) {
        if(return_name) {
            return this.name;
        }
        else {
            return `env["${this.name}"]`;
        }
        
    }

}

class BinaryExpression {

    constructor(operator, expr1, expr2) {
        this.operator = operator;
        this.expr1 = expr1;
        this.expr2 = expr2;
    }

    compile() {
        switch(this.operator) {
            case '+':
                return `${this.expr1.compile()} + ${this.expr2.compile()}`;
            case '-':
                return `${this.expr1.compile()} - ${this.expr2.compile()}`;
            case '*':
                return `${this.expr1.compile()} * ${this.expr2.compile()}`;
            case '/':
                return `${this.expr1.compile()} / ${this.expr2.compile()}`;
            case '=':
                return `${this.expr1.compile()} = ${this.expr2.compile()}`;
            case ';':
                let e1 = this.expr1 !== undefined ? this.expr1.compile() : "";
                let e2 = this.expr2 !== undefined ? this.expr2.compile() : ""
                return `${e1};\n${e2}`;
            case '%':
                return `${this.expr1.compile()} == ${this.expr2.compile()}`;
            case '>':
                return `${this.expr1.compile()} > ${this.expr2.compile()}`;
            case '<':
                return `${this.expr1.compile()} < ${this.expr2.compile()}`;
            case '&':
                return `${this.expr1.compile()} && ${this.expr2.compile()}`;
            case '|':
                return `${this.expr1.compile()} || ${this.expr2.compile()}`;
            default:
                break;
        }
    }

}

class ParenExpression {

    constructor(paren, expr) {
        this.paren = paren;
        this.expr = expr;
    }

    compile() {

        if(this.paren == '(') {
            return `(() => ${this.expr.compile()})()`;
        }
        else if(this.paren == '{') {
            return `function(){let env = this.env; \n${this.expr.compile()}\n}`;
        }

    }

}

class UnaryExpression {

    constructor(operator, expr) {
        this.operator = operator;
        this.expr = expr;
    }

    compile() {
        switch(this.operator) {
            case '!':
                return `!${this.expr.compile()}`;
            case '-':
                return `-${this.expr.compile()}`;
            default:
                break;
        }
    }

}

module.exports = class Parser {

    constructor(tokens = false) {
        console.log(typeof(tokens), tokens);
        if(tokens) 
        this.init(tokens);
    }

    init(tokens = []) {
        this.tokens = tokens;
        this.pos = 0;
    }

    parse() {
        return this.semicolon();
    }

    semicolon() {
        let r = this.equal();

        if(!this.current || !r) {
            return r;
        }

        if(this.current.type == 'OPERATOR' && this.current.text == ';') {
            this.next();
            r = new BinaryExpression(';', r, this.semicolon())
        }

        return r;
    }

    // # and @
    operator1() {

        if(!this.current) {
            return;
        }

        if(this.current.type == 'OPERATOR' && this.current.text == '#') {
            this.next();
            let name = this.comparative();
            let params = [];

            while(true) {
                let r = this.operator1();

                if(r) {
                    params.push(r);
                    continue;
                }

                break;
            }

            return new CommandExpression(name, ...params);
        }

        if(this.current.type == 'OPERATOR' && this.current.text == '@') {
            this.next();
            let name = this.comparative1();
            let params = [];

            while(true) {
                let r = this.operator1();

                if(r) {
                    params.push(r);
                    continue;
                }

                break;
            }

            return new ParenExpression('{', new CommandExpression(name, ...params));
        }

        return this.comparative1();
    }

    equal() {
        let r = this.operator1();

        if(!this.current || !r) {
            return r;
        }

        if(this.current.type == 'OPERATOR' && this.current.text == '=') {
            this.next();
            r = new BinaryExpression('=', r, this.operator1())
        }
    
        return r;
    }

    comparative() {
        let r = this.additive();

        if(!this.current || !r) {
            return r;
        }

        if(this.current.type == 'OPERATOR' && this.current.text == '>') {
            this.next();
            r = new BinaryExpression('>', r, this.additive())
        }
        else if(this.current.type == 'OPERATOR' && this.current.text == '<') {
            this.next();
            r = new BinaryExpression('<', r, this.additive())
        }
        else if(this.current.type == 'OPERATOR' && this.current.text == '%') {
            this.next();
            r = new BinaryExpression('%', r, this.additive())
        }

        return r;
    }

    additive() {
        let r = this.multiplecative();

        if(!this.current || !r) {
            return r;
        }

        if(this.current.type == 'OPERATOR' && this.current.text == '+') {
            this.next();
            r = new BinaryExpression('+', r, this.additive())
        }
        else if(this.current.type == 'OPERATOR' && this.current.text == '-') {
            this.next();
            r = new BinaryExpression('-', r, this.additive())
        }

        return r;
    }

    comparative1() {
        let r = this.comparative();

        if(!this.current || !r) {
            return r;
        }

        if(this.current.type == 'OPERATOR' && this.current.text == '&') {
            this.next();
            r = new BinaryExpression('&', r, this.comparative())
        }
        else if(this.current.type == 'OPERATOR' && this.current.text == '|') {
            this.next();
            r = new BinaryExpression('|', r, this.comparative())
        }

        return r;
    }

    multiplecative() {
        let r = this.unary();

        if(!this.current || !r) {
            return r;
        }

        if(this.current.type == 'OPERATOR' && this.current.text == '*') {
            this.next();
            r = new BinaryExpression('*', r, this.multiplecative())
        }
        else if(this.current.type == 'OPERATOR' && this.current.text == '/') {
            this.next();
            r = new BinaryExpression('/', r, this.multiplecative())
        }

        return r;
    }

    unary() {
        let r;

        if(this.current.type == 'OPERATOR' && this.current.text == '-') {
            this.next();
            r = new UnaryExpression('-', this.name())
        }
        else if(this.current.type == 'OPERATOR' && this.current.text == '!') {
            this.next();
            r = new UnaryExpression('!', this.name())
        }
        else {
            r = this.name();
        }

        return r;
    }

    name() {

        if(!this.current) {
            return undefined;
        }
        
        if(this.current.type == 'NAME'){
            let c = this.current;
            this.next();

            return new NameExpression(c.text);
        }
        
        return this.primary();
    }

    primary() {
        let r;

        if(this.current.type == 'NUMBER') {
            let c = this.current;
            this.next();
            return new NumberExpression(c.text);
        }

        if(this.current.type == 'STRING') {
            let c = this.current;
            this.next();
            return new StringExpression(c.text, c.sub);
        }

        if(this.current.type == 'OPERATOR' && this.current.text == '(') {
            this.next();
            let r = this.operator1();

            if(this.current.text == ')') {
                this.next();
                return new ParenExpression('(', r);
            }

        }

        if(this.current.type == 'OPERATOR' && this.current.text == '{') {
            this.next();
            let r = this.semicolon();

            if(this.current.text == '}') {
                this.next();
                return new ParenExpression('{', r);
            }

        }

        return r;
    }

    next() {
        this.pos++;
    }

    get current() {
        return this.tokens[this.pos];
    }

}