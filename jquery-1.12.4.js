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

    // Support: Android<4.1, IE<9 此版本下 \s 不支持不间断空格 \xA0 \uFEFF是字节次序标记
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
    },

    // Take an array of elements and push it onto the stack
    // (returning the new matched element set)
    pushStack: function ( elems ) {

        // Bulid a new jQuery matched element set
        var ret = jQuery.merge( this.constructor(), elems );

        // Add the old ovject onto the stack (as a reference)
        ret.prevObject = this;
        ret.context = this.context;

        // Return the newly-formed element set
        return ret;
    },

    // Execute a callback for every element in the matched set.
    each: function ( callback ) {
        return jQuery.each( this, callback );
    },

    map: function ( callback ) {
      return this.pushStack( jQuery.map( this, function ( elem, i ) {
          return callback( i, elem, elem );
      } ) );
    },

    slice: function () {
        return this.pushStack( slice.apply( this, arguments ) );
    },

    first: function () {
        return this.eq( 0 );
    },

    last: function () {
        return this.eq( -1 );
    },

    eq: function ( i ) {
      var len = this.length,
          j = +i + ( i < 0 ? len : 0 );
      return this.pushStack( j >=0 && j < len ? [ this[ j ] ] : [] );
    },

    end: function () {
        return this.prevObject || this.constructor();
    },

    // For internal use only.
    // Beheaves like an ARray's method, not like a jQuery method.
    push: push,
    sort: deletedIds.sort,
    splice: deletedIds.splice
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
        var key;
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

    type: function ( obj ) {
        if ( obj == null ) { // 如果参数是 null 或 undefined 直接返回
            return obj + "";
        }
        return typeof obj === "object" || typeof obj === "function" ?
            class2type[ toString.call( obj ) ] || "object" :
            typeof obj; // 简单类型的（非new）直接返回 typeof 的值
    },

    // Workarounds based on findings by Jim Driscoll
    // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
    globalEval: function ( data ) {
        if( data && jQuery.trim( data ) ) {
            // https://www.cnblogs.com/bender/p/3362449.html
            // We use execScript on Internet Explorer                    //IE浏览器我们用window.execScript，同时我们用了匿名函数从而让context是window
            // We use an anonymous function so that context is window    //如果不用匿名函数，在FF浏览器中，context是jquery对象。在FF中我们用window["eval"]
            // rather than jQuery in Firefox                            //确保环境是window
            ( window.execScript || function ( data ) { // eval 的 this 指向问题,execScript无论是在什么作用域(global/local)内被调用，它所接受到的表达式(expression)或语句(statements)字符串都将在全局作用域内执行(global)；eval则是在它被调用时所在的作用域内运行它所接受到的表达式(expression)或语句(statements)字符串
              window[ "eval" ].call( window, data ); // jscs:ignore requireDotNotation ??
            } )( data );
        }
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
    },

    // Support: Android<4.1, IE<9
    trim: function ( text ) {
        return text == null ?
            "" : // 参数是 null 和 undefiend 返回 ""
            ( text + "" ).replace( rtrim, "" );// 不再使用ES5的 String.prototype.trim
    },

    // results is for internal usage only  results 仅在内部使用
    makeArray: function (arr, results ) {
      var ret = results || [];

      if ( arr != null ) {
          if ( isArrayLike( Object( arr ) ) ) {
              jQuery.merge( ret ,
              typeof arr === "string" ?
              [ arr ] : arr  // 如果arr是字符串,不放到[] 中会被merge拆分成单个字母
              );
          } else {
              push.call( ret , arr );
          }
      }

      return ret;
    },

    inArray: function ( elem, arr, i ) {
        var len;

        if( arr ) {
            if( indexOf ) {
                return indexOf.call( arr, elem, i);
            }

            len = arr.length; //如果i<0 修正为从后查找, 如果 len + i 仍为负数则修正i为0
            i = i ? i < 0 ? Math.max( 0, len + i ) : i  :0;

            for ( ; i < len; i++ ) {

                // Skip accessing in sparse arrays 在稀疏数组中跳过查找
               if ( i in arr && arr[ i ] === elem ) {
                   return i;
               }
            }
        }

        return -1;
    },

    merge: function ( first, second ) { // 合并数组 second 可以是类数组
        var len = +second.length,
            j = 0,
            i = first.length;

        while ( j < len ) {
            first[ i++ ] = second[ j++ ];
        }

        // Support: IE<9
        // Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)  工作区会将类数组对象的 length 属性转化为 NaN
        if ( len !== len ) {
            while ( second[ j ] !== undefined ) {
                first[ i++ ] = second[ j++ ];
            }
        }

        first.length = i; // 修正 first 的length

        return first;
    },

    grep: function ( elems, callback, invert ) {//callback 返回布尔值, invert 为 FALSE 返回满足过滤条件的值组成的数组
        var callbackInverse,
            matches = [],
            i = 0,
            length = elsms.length,
            callbackExpect = !invert;

        // Go through the array , only saving the items
        // that pass the validator function
        for ( ; i < length; i++ ) {
            callbackInverse = !callback( elems[ i ], i );
            if ( callbackInverse !== callbackExpect ) {
                mathches.push( elems[ i ] );
            }
        }

        return matches;
    },

    // arg is for internal uasge only | arg 仅在内部使用
    map: function ( elems, callback, arg ) {
        var length, value,
            i = 0,
            ret = [];

        // ?? Go through the array, translating each of the items to their new values
        if ( isArrayLike( elems ) ) {
            length = elems.length;
            for ( ; i < length; i++ ) {
                value = callback( elems[ i ], i, arg );

                if ( value != null ) {
                    ret.push( value );
                }
            }

        // Go through every key on the object,
        } else {
            for ( i in elems ) {
                value = callback( elems[ i ], i, arg );

                if ( value != null ) {
                    ret.push( value );
                }
            }
        }

        // Flatten any nested arrays
        return concat.apply( [], ret );
    },

    // A global GUID counter for objects 一个全局的计数器用于事件与缓存模块
    guid: 1,

    // Bind a function to a context, optionally partially applying any arguments.
    // 接收一个函数返回一个新函数,新函数总有特定的上下文,有两种用法; proxy(fn, context) 指定fn函数的上下文始终为context
    proxy: function ( fn, context ) {  //proxy(context,name) 指定参数name对应函数的上下文始终为context,name这个函数必须是前一个参数 ‘context’ 对象的属性
        var args, proxy, tmp;

        if ( typeof context === "string" ) {//第二种调用方式
            tmp = fn[ context ];
            context = fn;
            fn = tmp;
        }

        // Quick check to determine if target is callable, in the spec
        // this throws a TypeError, but we will just return undefined.
        if ( !jQuery.isFunction( fn ) ) { //如果 fn 不是函数,防止报错返回undefi
            return undefined;
        }

        // Simulated bind
        args = slice.call( arguments, 2 );
        proxy = function () {
            return fn.apply( context || this, args.concat( slice.call( arguments ) ) ); //柯里化,arguments 表示形参 ,和上两行的并不相同
        };

        // Set the guid of unique handler to the same of original handler, so it can be removed
        proxy.guid = fn.guid = fn.guid || jQuery.guid++;

        return proxy; //??
    },

    now: function () {
        return +( new Date() );
    },

    // jQuery.support is not used in Core but other projects attach their
    // properties to it so it needs to exist.
    spport: support //jQuery.support 没有这个代码核心中使用, 但是其它项目依赖于它的属性,所以它需要存在
} );


// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
    /* jshint ignore: start */
    if ( typeof Symbol === "function" ) { // ?? 如果Symbol 存在,为JQuery.fn 指定遍历器
        jQuery.fn[ Symbol.iterator ] = deletedIds[ Symbol.iterator ];
    }
/* jshint ignore: end */

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
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function ( window ) {

var i,// 索引
  support, //浏览器支持
  Expr, // 扩展方法和属性
  getText, // 兼容的getText函数
  isXML, // 文档根节点是否是 xml
  tokenize, // 解析CSSselector，分组
  compile, //
  select, //
  outermostContext,
  sortInput,
  hasDuplicate,

  // Local document vars
  setDocument,
  document,
  docElem,
  documentIsHTML,
  rbuggyQSA, // querySelectorAll 的bug
  rbuggyMatches,
  matches,
  contains,

  // Instance-specific data 实例的具体特性
  expando = "sizzle" + 1 * new Date(), // 使用 1* 将new Date() 转换为数字，唯一标识符
  preferredDoc = window.document,
  dirruns = 0,
  done = 0,
  classCache = createCache(),
  tockenCache = createCache(),
  compilerCache = createCache(), // 编译缓存
  sortOrder = function ( a, b ) { // 如果a与b相等，重置hasDuplicat 为true
    if ( a === b ) {
        hasDuplicate = true;
    }
    return 0;
  },
 // General-purpose constants 通用的常量
  MAX_NEGATIVE = 1 << 31, // 最大负数

  // Instance methods
  hasOwn = ({}).hasOwnProperty,
  arr =  [],
  pop = arr.pop,
  push_native = arr.push,
  push = arr.push,
  slice = arr.slice,
  // Use a stripped-down indexOf as it's faster than native
  // http://jsperf.com/thor-indexof-vs-for/5
  indexOf = function ( list, elem ) {
    var i = 0,
      len = list.length;
    for ( ; i < len; i++ ) {
        if ( list[i] === elem ) {
            return i;
        }
    }
    return -1;
  },
    // 布尔值的属性
  booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

  // Regular expressions  正则表达式

  // http://www.w3.org/TR/css3-selectors/#whitespace 空白符
  whitespace = "[\\x20\\t\\r\\n\\f]",

  // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier  [^\\x00-\\xa0]表示双字节字符
  identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",


    // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors  属性选择符
    attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
        // Operator (capture 2)
        "*([*^$|!~]?=)" + whitespace +
        // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
        "*\\]",
    // 伪类
    pseudos = ":(" + identifier + ")(?:\\((" +
        // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
        // 1. quoted (capture 3; capture 4 or capture 5)
        "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
        // 2. simple (capture 6)
        "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
        // 3. anything else (capture 2)
        ".*" +
        ")\\)|)",

    // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
    rwhitespace = new RegExp( whitespace + "+", "g" ),
    rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ), //空白开头，或（\.开头 或 不是\的字符，以空白结尾的字符串）

    rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ), // 匹配逗号
    rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ), // 关系选择符
    //转换为非字符串正则表达式：([^\]'"]*?) 表示尽可能少的匹配不是\]'"的字符后面接任意空白符和]     //结果的捕获组1是属性的value
    rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

    rpseudo = new RegExp( pseudos ), // 伪类
    ridentifier = new RegExp( "^" + identifier + "$" ), //  匹配identifier字符串

    matchExpr = {
        "ID": new RegExp( "^#(" + identifier + ")" ),
        "CLASS": new RegExp( "^\\.(" + identifier + ")" ),
        "TAG": new RegExp( "^(" + identifier + "|[*])" ),
        "ATTR": new RegExp( "^" + attributes ),
        "PSEUDO": new RegExp( "^" + pseudos ),
        "CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
            "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
            "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
        "bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
        // For use in libraries implementing .is()    //以下情况需要知道上下文
        // We use this for POS matching in `select`        //以关系选择符开头(除开空白符) //以伪类选择符开头（除去空白符），后面可能有数字，接空白符，接末尾，或非-字符
        "needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
            whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
    },

    rinputs = /^(?:input|select|textarea|button)$/i, 	//匹配input,select,textarea,button
    rheader = /^h\d$/i,   //匹配标题

    rnative = /^[^{]+\{\s*\[native \w/, //匹配XXX{[native

    // Easily-parseable/retrievable ID or TAG or CLASS selectors
    rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,  //快速的获得ID TAG CLASS选择符

    rsibling = /[+~]/, //兄弟选择符
    rescape = /'|\\/g, //单引号或斜杠

    // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
    runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ), 	//匹配'\'加（1到6个16进制数or空白or非换行符）
    funescape = function( _, escaped, escapedWhitespace ) { // 处理字符串中的转义字符
        var high = "0x" + escaped - 0x10000;
        // NaN means non-codepoint
        // Support: Firefox<24
        // Workaround erroneous numeric interpretation of +"0x"
        return high !== high || escapedWhitespace ?   //如果匹配到字母类，high为NaN，NaN！=NaN，返回本身
            escaped : //或escaped匹配到\x20空格，high==high;再判断捕获组2的内容，如果有内容说明是空白符 也返回本身escaped
            high < 0 ?
                // BMP codepoint
                String.fromCharCode( high + 0x10000 ) :
                // Supplemental Plane codepoint (surrogate pair)
                String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
    },

    // Used for iframes
    // See setDocument()
    // Removing the function wrapper causes a "Permission Denied"
    // error in IE
    unloadHandler = function() {
        setDocument();
    };

// Optimize for push.apply( _, NodeList ) 优化...
try { // 检测push.apply 是否支持伪数组
    push.apply(
        ( arr = slice.call( preferredDoc.childNodes )),
        preferredDoc.childNodes
    );
    // Support: Android<4.0
    // Detect silently failing push.apply
    arr[ preferredDoc.childNodes.length ].nodeType;
} catch( e ) {
    push = { apply: arr.length ?

      // Leverage slice if possible
        function ( target, els ) {
            push_native.apply( target, slice.call(els) );
        } :
        // Support: IE<9
        // Otherwise append directly
        function ( target, els ) {
            var j = target.length,
                i = 0;
            // Can't trust NodeList.length
            while ( (target[j++] = els[i++])) {}
            target.length = j;
        }

    };
}

function Sizzle( selector, context, results, seed ) { //selector: css选择器表达式 ,context: 上下文, results: 可选的数组或类数组 把查找到的结果加入其中, seed: 可选的元素集合 从该元素中过滤出符合匹配选择器表达式元素的集合
    var m, i, elem, nid, nidselect, match, groups, newSelector,
        newContext = context && context.ownerDocument,

        // nodeType defaults to 9, since context defaults to document
        nodeType = context ? context.nodeType : 9;

    results = results || [];

    // Return early from calls with invalid selector or context  从无效的 selector 或 context 调用中提前返回
    if ( typeof selector !== "string" || !selector ||
        nodeType !== 1 || nodeType !== 9 || nodeType !== 11 ) {

        return results;
    }

    // Try to shortcut find operations (as opposed to filters) in HTML documents 尝试在HTML文档中快捷地查找操作（而不是过滤器）
    if (!seed ) {

        if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
            setDocument( context );
        }
        context = context || document;

        if ( documentIsHTML ) {
            // 如果选择符足够简单, 尝试使用 "get*By*" 系列 DOM 方法, （除了documentfragment语境，这些方法不存在）
            // If the selector is sufficiently simple, try using a "get*By*" DOM method
            // (excepting DocumentFragment context, where the methods don't exist)
            if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
                //selector只存在三种选择器的情况下（id，tag，class）,的快速处理方法 context类型不是DocumentFragment,且selector中匹配到rquickExpr
                // ID selector
                if ( (m = match[1]) ){

                    // Dccument context
                    if ( nodeType === 9 ) {
                        if ( (elem = context.getElementById( m )) ) {

                            // Support: IE, Opera, Webkit
                            // TODO: identify versions
                            // getElementById can match elements by name instead of ID 有些浏览器使用getElementById也返回name，需要去除
                            if ( elem.id === m ) {
                                results.push( elem );
                                return results;
                            }
                        } else {
                            return results;
                        }

                    // Element context
                    } else {

                        // Support: IE, Opera, Webkit
                        // TODO: identify versions
                        // getElementById can match elements by name instead of ID
                        if ( newContext && (elem = newContext.getElementById( m )) && //上下文不是Document类型，如果context.ownerDocument存在且其中存在id/name为m的元素，
                            contains( context, elem  ) &&  //  且该元素是context的子元素,且该元素的id为m
                            elem.id === m ) {

                            results.push( elem );                         //添加elem到结果集，返回结果
                            return results;
                        }
                    }

                // Type selector
                } else if( match[2] ) {
                    push.apply( results , context.getElementsByTagName( selector ) );
                    return results;

                // Class selector
                } else if ( (m = match[3]) && support.getElementsByClassName &&
                    context.getElementsByClassName ) {

                    push.apply( results, context.getElementsByClassName( m ) );
                    return results;
                }
            }

        // Take advantage of querySelectorAll 使用 querySelector
        if ( support.qsa &&  //浏览器支持querySelectorAll
            !compilerCache[ selector + " " ] && // 且 不存在缓存
            (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {  //且（rbbuggyQSA不存在或selector没有与rbuggyQSA匹配的）

            if ( nodeType !== 1 ) { // 如果不是不是子节点
                newContext = context;
                newSelector = selector;

            // qSA looks outside Element context, which is not what we want
            // Thanks to Andrew Dupont for this workaround technique
            // Support: IE <=8
            // Exclude object elements 不包括对象元素
            } else if ( context.nodeName.toLowerCase() !== "object" ) {

                // Capture the context ID, setting it first if necessary 捕捉上下文的 id,必要时先设置它
                if ( (nid = context.getAttribute( "id" )) ) { // /如果上下文有id属性，赋给nid
                    nid = nid.replace( rescape, "\\$&"); ///修改nid的值为 替换old中的每个单引号和斜杠为$&
                } else {  ////没有id属性，则给上下文设置id属性为nid = expando, //这样保证context有id属性，让QSA正常工作
                    context.setAttribute( "id", (nid = expando) );
                }

                // Prefix every selector in the list 对selector进行分组
                groups = tokenize( selector );
                i = groups.length;
                nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
                while ( i-- ) {  // 	//给分组的每个选择器添加头部 nidselect + " " 属性选择器
                    groups[i] = nidselect + " " + toSelector( groups[i] );
                }
                newSelector = groups.join( "," );

                // Expand context for sibling selectors } 如果selector存在+~兄弟选择器，且上下文的父节点是符合要求的上下文（看testContext测试参数是否有getElementsByTageName，返回参数本身或false）
                newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||  //返回context.parentNode
                    context; //否则返回context本身
            }

            if ( newSelector ) {
                try {
                    push.apply( results,
                        newContext.querySelectorAll( newSelector )
                    );
                    return results;
                } catch ( qsaError ) {
                } finally {
                    if (nid === expando ) {
                        context.removeAttribute( "id" );
                    }
                }
            }
        }
        }
    }

    // All others //其他情况调用select函数，去掉selector前后的空白作为参数
    return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
    var keys = [];

    function cache( key, value ) {
        // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
        if ( keys.push( key + " " ) > Expr.cacheLength ) {
            // Only keep the most recent entries
            delete cache[ keys.shift() ];
        }
        return (cache[ key + " " ] = value);
    }
    return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) { // 标记函数
    fn[ expando ] = true;
    return fn;
}

/**
 * Support testing using an element 使用一个元素支持测试
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
    var div = document.createElement("div");

    try {
        return !!fn( div );
    } catch ( e ) {
        return false;
    } finally {
        // Remove from its parent by default 移除创建的节点
        if( div.parentNode ) {
            div.parentNode.removeChild( div );
        }
        // release memory in IE 在 ie 中手动释放内存
        div = null ;
    }
}

/**
 * Adds the same handler for all of the specified attrs   用 | 分割 attrs 的属性列表
 * @param {String} attrs Pipe-separated list of attributes    //给所有属性添加相同的处理函数
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
    var arr = attrs.split("|"),
        i = arr.length;

    while ( i-- ) {
        Expr.attrHandle[ arr[i] ] = handler;
    }
}

/**
 * Checks document order of two siblings 检测 a b 的先后顺序
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b // a在b之前返回小于0.
 */
function siblingCheck( a, b ) {
    var cur = b && a, ////如果b存在且a存在，返回a
        diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
            ( ~b.sourceIndex || MAX_NEGATIVE ) -  ///~b.index即对b.index按位取反，不能转换为数字则返回NaN
            ( ~a.sourceIndex || MAX_NEGATIVE );

    // Use IE sourceIndex if available on both nodes 	//ie支持sourceIndex就使用它
    if ( diff ) {
        return diff;
    }

    // Check if b follows a  检测 b 跟随 a
    if ( cur ) {
        while ( (cur = cur.nextSibling ) ) {
            if ( cur === b ) {
                return -1;
            }
        }
    }

    return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types 返回一个函数用来检测 elem 是input类型且它的type为传入的type值
 * @param {String} type
 */
function createInputPseudo( type ) {
    return function ( elem ) {
        var name = elem.nodeName.toLowerCase();
        return name === "input" && elem.type === type;
    };
}

/**
 * Returns a function to use in pseudos for buttons 返回一个检测节点名是input或button，type属性是指定的type的函数
 * @param {String} type
 */
function createButtonPseudo( type ) {
    return function ( elem ) {
        var name = elem.nodeName.toLowerCase();
        return (name === "input" || name === "button") && elem.type === type;
    };
}

/**
 * Returns a function to use in pseudos for positionals  //传入参数fn，返回一个函数，调用这个函数（argument）又返回一个函数（seed，matches），
 * @param {Function} fn  //这个函数给fn传入参数[],seed.length,argument  // fn返回matchIndexes，seed中匹配matchIndexes的项取反，matches得到匹配项
 *///由fn获得匹配元素的index值，再将seed中未匹配的项置为false，matches添加匹配的项
function createPositionalPseudo( fn ) {
    return markFunction( function ( argument ) {
       argument = +argument;
       return markFunction( function ( seed, matches ) {
          var j,
              matchIndexes = fn( [], seed.length, argument ),
              i = matchIndexes.length;

          // Match elements found at the specified indexes 匹配在指定索引处找到的元素
           while ( i-- ) {
               if ( seed[ (j = matchIndexes[i]) ] ) {
                   seed[j] = !(matches[j] = seed[j]);
               }
           }
       });
    });
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
    return context && typeof context.getElementsByTagName !=="undefiend" && context;
}

// Expose support vars for convenience  为了方便暴露 support 变量
support = Sizzle.support = {};

/**
 * Detects XML nodes 检测 XML 节点
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function ( elem ) {
    // documentElement is verified for cases where it doesn't yet exist
    // (such as loading iframes in IE - #4833)
    var documentElement = elem && (elem.ownerDocument || elem).documentElement;
    return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 *///Sizzle的setDocument函数，根据当前文档设置文档相关的变量，参数element or document，返回current document 这个函数主要任务是测试浏览器对相关函数的支持，从而写出兼容的ID，TAG，CLASS的find和filter函数；测试浏览器对querySelectorAll函数的支持程度，建立对不支持的情况过滤的正则表达式rbuggyQSA；重写兼容的contains和sortOrder方法。
setDocument = Sizzle.setDocument = function ( node ) {
    var hasCompare, parent,
        doc = node ? node.ownerDocument || node : preferredDoc;
    // Return early if doc is invalid or already selected 如果doc是无效的或者是被选择的提前返回(非document的节点??)
    if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
        return document;  // 初次执行时document是undefiend
    }

  // Update global variables
  document = doc;
  docElem = document.documentElement;
  documentIsHTML = !isXML( document );

  // Support: IE 9-11, Edge 	//IE678不支持defaultView属性，parent会是undefined
  // Accessing iframe documents after unload throws "permission denied" 访问卸载后的 iframe documents 将会抛出没有权限的异常
  if ( (parent = document.defaultView) && parent.top !== parent ) {
      // Support:IE 11  //IE11没有attachEvent，所以先检查addEventListerer
    if ( parent.addEventListener ) {
        parent.addEventListener( "unload", unloadHandler, false );

      // Support: IE 9 - 10 only
    } else if ( parent.attachEvent ) {
        parent.attachEvent( "onunload", unloadHandler );
    }

  }

  /* Attributes
     ---------------------------------------------------------------------- */

  // Support: IE<8
  // Verify that getAttribute really returns attributes and not properties //检查getAttribute真的返回了属性值，而不是（调用它的对象的）属性
  // (excepting IE8 booleans)   //(排除IE8的布尔值)
  support.attributes = assert(function ( div ) {
    div.className = "i"; //这里设置了类名，应该用"       "取得i;如果使用“className”取得i，返回false;
    return !div.getAttribute("className");    //即设置了DOM元素的attribute，而不是对象的property

  });

   /* getElement(s)By*
     ---------------------------------------------------------------------- */

  // Check if getElementsByTagName("*") returns only elements  检查getELementsByTagName（“*”）返回的是否只有元素节点类型（可能有注释节点）
    support.getElementsByTagName = assert(function ( div ) {
      div.appendChild( document.createComment("") ); 	//创建并添加注释节点
      return !div.getElementsByTagName("*").length; //使用getElementsByTagName("*")如果得到结果length不为0，返回false
    })

  // Support: IE<9 //检测是否有该方法
  support.getElementsByClassName = rnative.test( document.getElementsByClassName );
  // Support: IE<10
  // Check if getElementById returns elements by name
  // The broken getElementById methods don't pick up programatically-set names,
  // so use a roundabout getElementsByName test
  support.getById = assert(function ( div ) {
    docElem.appendChild( div ).id = expando;  // 通过getElementsByName 能否取到 id 来检测getElementById 的兼容性，来检测getElementById在低版本Ie中可能会取到相同name的标签
    return !document.getElementsByName || !document.getElementsByName( expando ).length;
  });

    // ID find and filter
    if ( support.getById ) {
        Expr.find["ID"] = function ( id, context ) {
            if ( typeof  context.getElementById !== "undefined" && documentIsHTML ) {
                var m = context.getElementById( id );
                return m ? [ m ] : [];
            }
        };
        Expr.filter["ID"] = function ( id ) {
            var attrId = id.replace( runescape, funescape );
            return function ( elem ) {
                return elem.getAttribute("id") === attrId;
            };
        };
    } else {
        // Support: IE6/7
        // getElementById is not reliable as a find shortcut
        delete Expr.find["ID"];

        Expr.filter["ID"] = function ( id ) {
            var attrId = id.replace( runescape, funescape );
            return function ( elem ) {
                var node = typeof elem.getAttributeNode !== "undefined" &&
                        elem.getAttributeNode("id");
                return node && node.value === attrId;
            };
        };
    }

    // Tag
    Expr.find["TAG"] = support.getElementsByTagName ?
        function ( tag, context ) {
            if ( typeof context.getElementsByTagName !== "undefined" ) {
                return context.getElementsByTagName( tag );

                // DocumentFragment nodes don't have gEBTN  DocumentFragment 节点 没有getElementsByClassName
            } else if ( support.qsa ) {
                return context.querySelectorAll( tag );
            }
        } :

        function ( tag, context ) {
            var elem,
                tmp = [],
                i = 0,
                // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
                results = context.getElementsByTagName( tag );

            // Filter out possible comments 过滤掉可能出现的注释节点
            if ( tag === "*" ) {
                while ( (elem = results[i++]) ) {
                    if ( elem.nodeType === 1) {
                        tmp.push( elem );
                    }
                }

                return tmp;
            }
            return results;
        };

    // Class
    Expr.find["CLASS"] = support.getElementsByClassName && function ( className, context ) {
            if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
                return context.getElementsByClassName( className );
            }
        };

    /* QSA/matchesSelector
     ---------------------------------------------------------------------- */

    // QSA and matchesSelector support

    // matchesSelector(:active) reports false when true (IE9/Opera 11.5) (:active)选择符在IE9、Opera11.5中报错，当它应该是正确的时候
    rbuggyMatches = [];

    // qSa(:focus) reports false when true (Chrome 21)  qsa(:focus)选择符报错，当应该是正确的时候，在Chrome21中
    // We allow this because of a bug in IE8/9 that throws an error  在IE8/9中访问iframe的document.activeElement总会抛出错误
    // whenever `document.activeElement` is accessed on an iframe
    // So, we allow :focus to pass through QSA all the time to avoid the IE error  所以我们允许 :focus 总是能通过QSA去避免在IE中的错误
    // See http://bugs.jquery.com/ticket/13378
    rbuggyQSA = [];

    if ( (support.qsa = rnative.test( document.querySelectorAll)) ) {
        // Build QSA regex
        // Regex strategy adopted from Diego Perini
        assert(function ( div ) {
            // Select is set to empty string on purpose  //select被故意置空字符串
            // This is to test IE's treatment of not explicitly // 用来测试ie不明确的处理
            // setting a boolean content attribute, // 设置一个布尔值属性，
            // since its presence should be enough  // 因为它的存在就足够了
            // http://bugs.jquery.com/ticket/12359
            docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
                "<select id='" + expando + "-\r\\' msallowcapture=''>" +
                "<option selected=''></option></select>";
        });
    }

}


Sizzle.error = function ( msg ) {
  throw new Error( "Syntax error, unrecognized expression: " +msg );
};


Expr = Sizzle.selector = {// 减少字符，缩短作用域链，方便压缩

  // Can be adjusted by the user
  cacheLength: 50,

  createPseudo: markFunction,

  match: matchExpr,

  attrHandle: {},

  find: {},

  relative: {
    ">": { dir: "parentNode", first: true },
    " ": { dir: "parentNode" },
    "+": { dir: "previousSibling", first: true },
    "~": { dir: "previousSibling" }
  },
    
  filter: {
      "TAG": function ( nodeNameSelector ) {
          var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
          return nodeNameSelector === "*" ?
              function() { return true; } :
              function ( elem ) {
                  return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
              };
      },
      "CLASS": function ( className ) {
          var pattern = classCache[ className + " " ];

      }
  }  

};

// Initialize against the default document 初始化默认文档
setDocument();

// tokens 转化为selector
function toSelector( tokens ) {
    var i = 0,
        len = tokens.length,
        selector = "";
    for ( ; i < len; i++ ) {
        selector += tokens[i].value;
    }
    return selector;
}


    })( window );


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
