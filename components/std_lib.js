let env = {

    'PI': 3.14,
    'true': true,
    'false': false,
    break: false,
    log(...params) {
        console.log(...params);
    },

    if(bool = false, trueAction = function(){}, falseAction = function(){}){
        if(bool) {
            trueAction.call({env: this.env});
        }
        else {
            falseAction.call({env: this.env});
        }
    },

    while(bool = false, trueAction = function(){}, falseAction = function(){}){
        while (bool) {
            // console.log('while')
            if (bool) {
                // console.log('if')
                trueAction.call({env: this.env});   
            }
            else {
                console.log('else')
                falseAction.call({env: this.env});
            }
        }
    },

    param0(i=0) {
        return process.argv[i];
    },

    param1(i=1) {
        return process.argv[i];
    },
    param2(i=2) {
        return process.argv[i];
    },

    float(number) {
        return parseFloat(number);
    },

    string(a){
        return a.toString(a);
    },

    function(block) {
        let result = function(...params){
            let result = null;
            let oldenv = this.env;
            let env = Object.assign({}, oldenv, {
                return(value){
                    result = value;
                },
                param0(i=0) {
                    return params[0];
                },
                param1(i=1) {
                    return params[1];
                },
                param2(i=2) {
                    return params[2];
                },
            });
            block.call({env});
            return result;
        }
        return result;
    },

}