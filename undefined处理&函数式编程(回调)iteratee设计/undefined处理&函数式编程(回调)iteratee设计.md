#undefined处理&函数式编程(回调)iteratee设计

##undefined的处理
因为在js中，undefined不可靠，因为它可以随意被改写。
常见的用法是通过(void 0)来获得undefined。

##iteratee
一个迭代至少由两部分构成：
1、被迭代集合
2、当前迭代过程
在underscore中，当前迭代过程是一个函数，成为iteratee(迭代器)，它将对当前迭代元素进行处理。
例子如下：

    // obj:数据 iteratee:迭代器 context:上下文this指向
    _.map = function(obj, iteratee, context){
        // 生成不同功能的迭代器
        var iteratee = cb(iteratee, context);
        // 分辨obj是数组对象，还是object对象
        var keys = !_.isArray(obj) && Object.keys(obj); // obj为对象，则keys为真，否则为false
        var length = (keys || obj).length;              // keys为真获取keys的length，否则获取obj的length（obj为数组）
        var result = Array(length);                     // 根据length生成[]

        for(var index = 0; index < length; index++){
            var currentKey = keys ? keys[index] : index;
            result[index] = iteratee(obj[currentKey], index, obj);
        }

        // iteratee为处理过后的迭代器，如下：其中func就是调用_.map()传入的回调iteratee
        // function(value, index, obj){
        //     return func.call(context, value, index, obj);
        // };
    }

cb: 我们传递给_.map的第二个参数就是一个iteratee，它可能是函数、对象甚至字符串，underscore会将其同意处理成一个函数。这个处理由underscore内置函数cb完成。cb将根据不同情况，为我们的迭代创建一个迭代过程iteratee，服务于每轮迭代。

    var cb = function(value, context, argCount) {
        if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
        if (value == null) return _.identity;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
        return _.property(value);
    };

optimizeCb:当传入的value是一个函数时，value还要经过内置函数optimizeCb才能获得最终的iteratee。
1、含义：是一个对最终返回的iteratee进行优化的过程。
2、源码：
    
    //optimizeCb优化迭代器
    var optimizeCb = function(func, context, count) {
        if (context == void 0) {
            return func;
        }

        switch (count == null ? 3 : count) {
            case 1:
                return function(value) {
                    return func.call(context, value);
                };
            case 3:
                return function(value, index, obj) {
                    return func.call(context, value, index, obj);
                };
        }
    }

    var optimizeCb = function(func, context, argCount) {
        if (context === void 0) return func;
        switch (argCount == null ? 3 : argCount) {
            case 1: return function(value) {
                return func.call(context, value);
            };
            // The 2-argument case is omitted because we’re not using it.
            case 3: return function(value, index, collection) {
                return func.call(context, value, index, collection);
            };
            case 4: return function(accumulator, value, index, collection) {
                return func.call(context, accumulator, value, index, collection);
            };
        }
        return function() {
            return func.apply(context, arguments);
        };
    };
3、总体思路：可选传入待优化的回调函数func，以及迭代回调需要的参数个数argCount，根据参数个数分情况进行优化。