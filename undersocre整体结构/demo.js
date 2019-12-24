(function(root){
    var push = Array.prototype.push;

    // 构造函数
    // 支持_(obj)实例对象调用
    var _ = function(obj){
        if (obj instanceof _){
            return obj;
        }

        if (!(this instanceof _)){
            return new _(obj);
        }

        // 给当前_的实例对象扩展this._wrapped用于存储数据obj
        this._wrapped = obj;
    }

    _.unique = function(arr, callbacks){
        var ret = [];
        var target, i = 0;
        for(; i < arr.length; i++){
            target = callbacks ? callbacks(arr[i]) : arr[i];
            if (ret.indexOf(target) === -1){
                ret.push(target);
            }
        }
        return ret;
    }

    _.map = function(args){
        return args;
    }

    // 开启链式调用，obj为创建underscore的实例对象的时候传入的数据
    _.chain = function(obj){
        // 创建_的实例对象
        var instance = _(obj);
        // 给instance扩展_chain标识符，确定为链式调用，并返回该instance
        instance._chain = true;
        return instance;
    }

    // 辅助函数，判断是否为链式调用，是则返回instance，否则返回处理之后的数据
    var result = function(instance, obj){
        return instance._chain ? _(obj).chain() : obj;
    }

    // 中断_的实例对象的链式调用，并返回最终处理完毕的数据
    _.prototype.value = function(){
        return this._wrapped;
    }

    _.functions = function(obj){
        var result = [];
        var key;
        for(key in obj) {
            result.push(key);
        }
        return result;
    }

    _.isArray = function(array){
        return toString.call(array) === '[object Array]';
    }

    _.each = function(target, callback){
        var key, i = 0;
        if (_.isArray(target)){
            var length = target.length;
            for(; i < length; i++){
                // 将调用_.each()传入的回调绑定到target上，同时给该回调传入参数target[i]
                callback.call(target, target[i], i);
            }
        } else {
			for (key in target) {
				callback.call(target, key, target[key]);
			}
		}
    }

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

    _.mixin(_);
    root._ = _;
})(this);