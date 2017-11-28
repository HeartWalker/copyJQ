
(function ( global, factory ) {

    if(typeof module === "object" && typeof module.exports ==="object"){
        //如果符合 CommonJS 规范
        module.exports = global.document ?
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
