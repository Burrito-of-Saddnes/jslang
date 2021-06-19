while = #function {
    a=#param0 0;
    b=#param1 1;
    c=#param2 2;
    #if b % '<'{
        #if a<c{
            #log a;
            #return (#while a+1 b c);
        }{
            #return a;
        }
    }
    @if b % '>'{
        #if a>c{
            #log c;
            #return (#while a b c+1);
        }{
            #return c;
        }
    }
    @if b % '%'{
        #if a%c{
            #return a+'=='+c;
        }
        @if a>c{
            #log c;
            #return (#while a b c+1);
        }
        @if a<c{
            #log a;
            #return (#while a+1 b c);
        }
    };  
};

#log #while 10 '%' 1;
