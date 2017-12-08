/*!
 * jQuery JavaScript Library v1.12.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:17Z
 */

;(function ( global, factory ) {

    if(typeof module === "object" && typeof module.exports ==="object"){
        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get jQuery.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var jQuery = require("jquery")(window);
        // See ticket #14549 for more info.
        module.exports = global.document ?   //如果符合 CommonJS 规范
            factory( global, true ) : // 如果是 window.document 执行 factory ,如果是 CommonJS 规范,应该是是非全局的,noGlobal 是 true
            function( w ) {           //需要不存在 global.document, 返回一个需要传入参数 w 的函数,
                if( !w.document ){    //如果 w 不是 window 抛出异常, 如果没有 w 会报错
                    throw new Error('jQuery requires a window with a document');
                }
                return factory( w ); //返回函数, 如果 w 是 window 正常执行, 如果不是大部分功能不能用
            };
    } else { //非 CommonJS 规范
        factory( global );
    }

//window 存在传入参数 window, 否则 global 为this
}(typeof window !== "undefiend" ? window : this,function ( window, noGlobal ) {





// 缓存变量,减少作用域查找,方便压缩,提取常用变量与函数
var deletedIds = [];

var document = window.document;

var slice = deletedIds.slice;

var concat = deletedIds.concat;

var push = deletedIds.push;

var indexOf = deletedIds.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
    version = "1.12.4", //版本

    // Define  a local copy of jQuery
    jQuery = function ( selector , context ) {

    // jQuery 实际上是 init 构造函数的增强
    // Need init if jQuery is called (just allow error to be thrown if not included) jQuey 被调用的时候需要初始化(如果没有被引用仅仅允许抛出错误)
        return new jQuery.fn.init( selector, context);
    },

    // Support: Android<4.1, IE<9
    // Make sure we trim BOM and NBSP
    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, //匹配两端空格

    //Matches dashed string for camelizing  将虚线和字符串转化为驼峰
    rmsPrefix = /^-ms-/, // IE中的前缀 -ms 转成： ms- 例如 -ms-transform 对应 msTransform 而不是 MsTransform,-moz-Transform 对应 MozTransform
    rdashAlpha = /-([\da-z])/gi, //转大小写   -left  转成 Left

    // Used by jQuery.cameCase as callback to replace()
    fcameCase = function ( all ,letter ) { //  replace 的替换函数, 对第一个分组执行toUpperCase()后将匹配到的字符串替换
        return letter.toUpperCase();
    };

jQuery.fn = jQuery.prototype = {

    // 版本
    jquery: version,

    constructor: jQuery,//覆盖 constructor

    // Start with an empty selector
    selector: "",//初始的空选择器

    //jQuery 的默认 length 属性
    length: 0,

    toArray: function () {
        return slice.call( this ); //将类数组转化为数组
    },

    // Get the Nth element in the matched element set OR 获取匹配元素中的第 n 个元素,或
    //Get the whole matched element set as a clear array 将整个匹配元素设置成一个干净的数组
    get: function ( num ) { //修正 get
        return num != null ?

            // Return just the one element form the set
            ( num < 0 ? this[ num + this.length ] : this[ num ] ) :
            //如果 num 小于 0, 修正为数组的倒序下标,否则就是当前下标
            // Return all the elements in a clean array
            slice.call( this );//如果是 undefiend 或 null,返回一个数组
    }
};
//  用来将多个对象合并到第一个对象 target, 如果只有一个对象, target 将被忽略, 对象会被合并到 jQuery 或 jQuery.fn上
jQuery.extend = jQuery.fn.extend = function () { //params ([deep],target,object1,[object2])
    var src, copyIsArray, copy, name, options, clone,  //options 指向某个源对象,name 某个源对象的某个属性名,clone 深度复制是原始值的修正值
        target = arguments[ 0 ] || {},//目标对象,      //src 目标对象的某个属性的原始值,copy 某个源对象的某个属性的值,copyIsArray 指示变量是否是数组;
        i = 1,                    //源对象起始下标
        length = arguments.length,//参数个数
        deep = false;             //是否执行深度复制

    //Handle a deep copy situation 处理深拷贝
    if( typeof target === "boolean" ) {
        deep = target;

        //slip the boolean and the target
        target = arguments[ i ] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if( typeof target !== "object" && !jQuery.isFunction( target ) ) {
        target = {}; // 如果 target 不是对象或函数, 将 target 设置为 {},因为简单类型不能设置属性
    }

    // extend jQuery itself if only one argument is passed
    if( i === length ) {
        target = this;
        i--;
    }

    for ( ; i < length; i++ ) {

        // Only deal with non-null/undefined values 仅仅处理非 null 和 undefined 的值
        if ( ( options = arguments[ i ] != null ) ) {

            // Extend the base object
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                //Prevent never-ending loop 避免深度遍历是死循环 如: var o = {};
                if ( target === copy ) {                        // o.n1 = o;
                    continue;                                   // $.extend(true,o,{n2:o});
                }

                // Recures if we're merging plain objects or arrays 如果我们合并的是普通对象或数组则递归
                if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
                    ( copyIsArray  = jQuery.isArray( copy ) ) ) ) {

                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray( src ) ? src : [];
                        //修正 src 为同名简单类型时的情况
                    } else {
                        clone = src && jQuery.isPlainObject( src ) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[ name ] = jQuery.extend( deep, clone ,copy );

                // Don't bring in undefined values 若果不是深拷贝且 copy 不是 undefined
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};

jQuery.extend( {

    // Unique for each copy of jQuery on the pate 每一个页面上的 jQuery 副本都是唯一的
    expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ) ,

    // Assume jQuery is ready without the ready moudle
    isReady: true, //??

    error: function ( msg ) {
        throw new Errow( msg );
    },

    noop: function () {},

    // See test/unit/core.js for details concerning isFunction.
    // Since version 1.3, DOM methods and functions like alert
    // aren't supported. They return false on IE (#2968). //此方法在 IE 下无法正确识别 DOM 方法和一些函数（例如 alert 方法等）。
    isFunction: function ( obj ) {
      return jQuery.type( obj ) === "function";
    },

    isArray: Array.isArray || function ( obj ) {
        return jQuery.type( obj ) === "array";
    },
  
    isWindow: function ( obj ) {
        /* jshint eqeqeq: false */  //配置 jshint 忽略 != 与 == 的报告
      return obj != null && obj == obj.window; //检测对自身的引用
    },

    isNumeric: function ( obj ) {
        //??
        // parseFloat NaNs numeric-cast false positives (null|true|false|"")
        // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
        // subtraction forces infinities to NaN
        // adding 1 corrects loss of precision from parseFloat (#15100)
        var realStringObj = obj && obj.toString(); //首先过滤掉数组, 这里不能把object类型的过滤掉，因为通过new Number()实例化的数值型变量，也是数字
        return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
    },

    isEmptyObject: function ( obj ) {
        var name;
        for ( name in obj ) {
            return false;
        }
        return true;
    },

    isPlainObject: function ( obj ) { //检测是否是纯粹的对象 既 用 {} 或 new Object() 创建的对象

        //Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if ( !obj || jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
            return false;
        }

        try {

            // Not own constructor property must be Object ??
            if ( obj.constructor &&
                !hasOwn.call( obj, "constructor" ) &&
                !hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
                return false;
            }
        } catch ( e ) {

            // IE8,9 Will throw exceptions on certain host objects $9897
            return false;
        }

        // Support: IE<9 现代浏览器先循环实例中的属性，再循环原型中的属性。低版本浏览器相反。
        // Handle iteration over inherited properties before own properties.
        if( !support.ownFirst ) { //?? 在自己的属性之前迭代继承属性
            for ( key in obj ) {
                return hasOwn.call( obj, key );
            }
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.
        for ( key in obj ) {}
        //for...in循环中先循环的是非继承属性然后是继承属性，当然非继承属性的propertyIsEnumerable必须为true利用这个原理如果最后被循环的属性是继承属性那就返回false,如果最后一个是非继承属性那就肯定全是非继承属性返回true
        return key === undefined || hasOwn.call( obj ,key );
    },

    // Convert dashed to camelCase; used by the css and data modules 将前划线转为驼峰
    // Microsoft forgot to hump their vendor prefix (#9572)
    camelCase: function ( string ) {
        return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcameCase );
    },
    // 检测 DOM 元素节点名称是否与传入的值相等,DOM 元素的 nodeName 返回其节点名称,HTML 返回大写但是 xml 区分大小写会返回源码的值
    nodeName: function ( elem, name ) {
      return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    },

    type: function ( obj ) {
      if ( obj == null ) { // 如果参数是 null 或 undefined 直接返回
          return obj + "";
      }
      return typeof obj === "object" || typeof obj === "function" ?
        class2type[ toString.call( obj ) ] || "object" :
        typeof obj; // 简单类型的（非new）直接返回 typeof 的值
    },

    each: function ( obj, callback ) {
        var length, i = 0;

        if ( isArrayLike( obj ) ) {
            length = obj.length;
            for ( ; i < length; i++ ) {
                if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                    break;
                }
            }
        } else {
            for ( i in obj ) {
                if ( callback.call( obj[ i ], i, obj[ i ]) === false ) {
                    break;
                }
            }
        }

        return obj;
    }


    
});
// 全局用到的方法和变量
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Sympol".split( " " ),
function ( i, name ) {
  class2type[ "[object " + name +"]" ] = name.toLowerCase();
});

function isArrayLike( obj ) {

  // Support: iOS 8.2 (not reproducible in simulator)
  // `in` check used to prevent JIT error (gh-2145)
  // hasOwn isn't used here due to false negatives
  // regarding Nodelist length in IE
  var length = !!obj && "length" in obj && obj.length, // 如果 obj 为true，有length属性，则length等于obj.length,否则length为false
      type = jQuery.type( obj );

  if (type === "function" || jQuery.isWindow( obj ) ) {
      return false;
  }
    // obj本身是数组，则返回true obj不是数组，但有length属性且为0，例如{length : 0}，则返回true
  return type === "array" || length === 0 ||
        typeof length === "number" && length > 0 && ( length - 1 ) in obj;      // obj不是数组,但有length属性且为整数数值，obj[length - 1]存在，则返回true

}



//兼容 AMD 规范
if ( typeof define === "function" && define.amd ) {
    define( "jquery", [], function() {
        return jQuery;
    } );
}



var
    _jQuery = window.jQuery, //映射全局的 jQuery 为 _jQuery
    _$ = window.$;           //映射全局的 $ 为 _$

jQuery.noConflict = function ( deep ) {
    if( window.$ === jQuery ){ //若果全局的 $ 为当前的 jQuery
        window.$ = _$;         //重置全局 $ 为上一个 $,即 _$
    }

    if( deep && window.jQuery === jQuery){ //如果 deep 为 true,全局的 $ 为当前的 jQuery
        window.jQuery = _jQuery;           //重置全局 jQuery 为上一个 jQuery,即 _jQuery
    }

    return jQuery; //返回本脚本的 jQuery
}


//在 全局环境下 将 jQuery 暴露出来, 并挂载到全局环境下
    if ( !noGlobal ) {
        window.jQuery = window.$ = jQuery;
    }

return jQuery;
}));
