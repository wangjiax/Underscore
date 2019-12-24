#Underscore整体结构
通过立即执行函数来包裹自己的业务逻辑
目的：
<ul>
    <li>避免全局污染</li>
    <li>隐私保护</li>
</ul>

##Underscore结构
<p>_对象</p>
underscore有下划线的意思，所以underscore通过一个下划线变量来标识自身。
注意：_是一个对象，之后所有的api都会挂载到这个对象上，如_.each,_.map等。

    (function(root) {
        var _ = function(){
            
        };
        _.unique = function() {
            
        }
        
        _.map = function(){
            
        }
        root._ = _;
    })(this);
    
##面向对象风格支持
<p>_()</p>
虽然Underscore推崇函数式编程，但也支持面向对象风格的函数调用，仅需要通过_()来包裹对象即可。
当我们进行调用：_([1,2,3,4])，会创建一个新的underscore对象（从而能够调用underscore提供的方法），并在this._wrapped中存储传入的数据。

    // 构造函数
    // 支持_(obj)面向对象方式调用
    var _ = function(obj) {
        if (obj instanceof _) {
            return obj;
        }

        if (!(this instanceof _)) {
            return new _(obj);
        }
        this._wrapped = obj;
    }

##mixin
<ul>
<li>（混入）模式是增加代码复用度的一个广泛使用的设计模式。</li>
<li>_.mixin(obj)：为underscore对象混入obj具有的功能。</li>
为什么underscore既支持纯函数调用又支持面向对象调用呢？
原因是：underscore构造函数的所有方法都是静态方法，通过underscore的内置函数_.mixin()将underscore的静态方法扩展到underscore的原型上，从而支持面向对象调用。

    // 用于给_的原型扩展属性和方法 
    _.mixin = function(obj){
        _.each(_.functions(obj), function(name){
            var func = obj[name];

            _.prototype[name] = function() {
                // 通过arguments可以获取实例对象调用原型上方法传入的回调函数
                // 通过this._wrapped获取数据
                // 将上面获取到的方法以及数据绑定到func上，通过apply()
                var args = [this._wrapped];         // 将this._wrapped转为数组格式，方便合并
                push.apply(args, arguments);        // push为Array.prototype.push的引用，args = [this._wrapped, arguments]
                // func.apply(this, args);          // 通过apply()将func()绑定的this(调用func的实例对象)上，并传入参数args
                return result(this, func.apply(this, args));  // 通过result判断是否为链式调用
            }
        });
    }

</ul>

##链接式调用
_.chain()
<ul>
<li>_.chain(obj)：为underscore对象的方法增加链式调用能力</li>
<li>_.chain源码如下：</li>

    _.chain = function(obj){
        var instance = _(obj);
        instance._chain = true;
        return instance;
    }

    // 如果需要支持链式调用，必须先调用chain()方法，如下：
    _([1,2,3,4,5,4,5,6,"a","A"]).chain().unique().map()

<li>underscore还提供了一个帮助函数result，该函数将会判断方法调用结果，如果该方法的调用者被标识了需要链化，则链化当前的方法执行结果。</li>

    var chainResult = function()(instance, obj) {
        return instance._chain ? _(obj).chain() : obj;
    }

</ul>