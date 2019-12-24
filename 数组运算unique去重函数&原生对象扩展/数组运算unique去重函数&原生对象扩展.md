#数组运算unique去重函数&原生对象扩展

##_.unique
1、语法：_.unique(array, isSorted, iteratee)
2、根据iteratee设置的重复标准，对array进行去重。通过isSorted，提高对有序数组的去重效率。
源码：

    _.unique = function(array, isSorted, iteratee, context){
        // 没有传入isSorted参数
        if (!_.isBoolean(isSorted)) {
            context = iterate;
            iterate = isSorted;
            isSorted = false;
        }
        // 如果有迭代函数
        if (iteratee != null) {
            iteratee = cb(iteratee, context);
        }

        var result = [];
        // 用来过滤重复值
        var seen;

        for(var i = 0 ; i < array.length; i++) {
            var computed = iteratee ? iteratee(array[i], i, array) : array[i];
            if (isSorted) {
                if (!i || seen !== computed) {
                    result.push(computed);
                }
                seen = computed;
            } else if (result.indexOf(computed) === -1) {
                result.push(computed);
            }
        }

        return result;
    }

##_.compact
去除array中所有‘假值’项目。
在js中，下面这些值被认为具有“假值”意向：false null 0 "" undefined NAN
如何验证？Boolean()

##_.range
_.range(start, stop, step)：设置步长step，产生一个[start, n]的序列。
例子：

    产生[n, m)内的数组
    range(1, 11) => [1,2,3,4,5,6,7,8,9,10]

    指定步长：
    range(1, 11 ,2) => [1,3,5,7,9]

    从[0, n)
    range(5) => [1,2,3,4]
range函数作用：快速产生一个落在区间范围内的数组。