#reset参数-Underscore创建对象方式

##reset参数
1、即自由参数、松散参数，自由和松散指参数个数是随意的，与之对应的是固定参数。
2、ES6引入reset参数（形式为...变量名），用于获取函数的多余参数，这样就不需要使用arguments对象。
3、reset参数搭配的变量是一个数组，该变量将多余的参数放入数组中。

##_.restArguments
underscore的官方实现，它暴露了一个_.resetArguments方法，通过给该方法传递一个函数，能够使得函数支持rest参数。

##Object.create polyfill
Object.create()
1、Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__;
2、Object.create()不依赖构造函数，它内部已维护了一个构造函数，并将该构造函数的prototype属性指向传入的对象，因此，它比new更灵活。

Underscore如何创建对象？
underscore利用baseCreate创建对象时，会先坚持当前环境是否已支持Object.create()，如不支持，会创建一个简易的polyfill。
