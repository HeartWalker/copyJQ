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

(function ( global, factory ) {

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
    rmsPrefix = /^-ms-/, // IE中的前缀 -ms 转成： Ms
    rdashAlpha = /-([\da-z])/gi,
    rmsPrefix = /^-ms-/,   //转大小写   -left  转成 Left

    // Used by jQuery.cameCase as callback to replace()
    fcameCase = function ( all ,letter ) { //使用处??
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
        return slice.call( this ); //??转化为数组
    }

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
