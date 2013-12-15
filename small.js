typeof DEBUG === 'undefined' && (DEBUG = 1);
'use strict';
(function(WIN,DOM,OBJ,ARRAY){
    DEBUG && console.time('core');
    var small = (function(){
        var small = function(selector){
            return new small.fn.init(selector);
        };
        small.prototype = small.fn = {
            constructor : small,
            init : function(selector){
                if(!selector){
                    return this;
                }else{
                  var dom = small.getDOM(selector);
                  dom = dom || [];
                  dom.__proto__ = small.prototype;
                  dom.selector = selector || '';
                  return dom;
                }
            }
        };
        small.fn.init.prototype = small.fn;
        small.extend = small.fn.extend = function(){
            var options,name,src,copy,copyIsArray,clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;
            if(typeof target === 'boolean'){
                deep = target;
                target = arguments[1] || {};
                i = 2;
            }
            if(typeof target !== 'object' && !small.isFunction(target)){
                target = {};
            }
            if(length === i){
                target = this;
                --i;
            }
            for(;i < length ; i++){
                if((options=arguments[i]) != null){
                    for(name in options){
                        src = target[name];
                        copy = options[name];
                        if(target === copy){
                            continue;
                        }
                        if(deep&&copy&&(small.isPlainObject(copy) || (copyIsArray = small.isArray(copy)))){
                            if(copyIsArray){
                                copyIsArray = false;
                                clone = src && small.isArray(src) ? src : [];
                            }else{
                                clone = src && small.isPlainObject(src) ? src : {};
                            }
                            target[name] = small.extend(deep,clone,copy);
                        }else if(copy !== undefined){
                            target[name] = copy;
                        }
                    }
                }
            }
            return target;
        };
        small.extend(OBJ.prototype,{
            each: function(fn, scope) {
              if (small.isArray(this)) {
                ARRAY.prototype.forEach.apply(this, arguments);
              } else {
                for (var key in this) if (small.hasOwnProperty(this, key)) {
                  fn.call(scope, this[key], key, this);
                }
              }
            },
            map: function(fn, scope) {
              if (small.isArray(this)) {
                return ARRAY.prototype.map.apply(this, arguments);
              } else {
                var result = {};
                this.each(function(value, key, object) {
                  result[key] = fn.call(scope, value, key, object);
                });
                return result;
              }
            },
            toArray: function(object, begin, end) {
              return ARRAY.prototype.slice.call(this, begin, end);
            }
        });
        DEBUG && console.timeEnd('core');
        DEBUG && console.time('util');
        small.extend({
            indexOf : ARRAY.prototype.indexOf,
            each : ARRAY.prototype.forEach,
            map : ARRAY.prototype.map,
            filter : ARRAY.prototype.filter,
            hasOwnProperty : function(object,property){
                return OBJ.prototype.hasOwnProperty.call(object, property);
            },
            time : function(format){
                var time = new Date();
                var o = { 
                  "M+" : time.getMonth()+1, //month 
                  "d+" : time.getDate(), //day 
                  "h+" : time.getHours(), //hour 
                  "m+" : time.getMinutes(), //minute 
                  "s+" : time.getSeconds(), //second 
                  "q+" : Math.floor((time.getMonth()+3)/3), //quarter 
                  "S" : time.getMilliseconds() //millisecond 
                } 
                if(this.isDefined(format)||format===''||format===null)format = 'yyyy-MM-dd hh-mm-ss'
                if(this.isString(format)){
                    if(/(y+)/.test(format)) { 
                      format = format.replace(RegExp.$1, (time.getFullYear()+"").substr(4 - RegExp.$1.length)); 
                    } 
                    for(var k in o) { 
                      if(new RegExp("("+ k +")").test(format)) { 
                        format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
                      } 
                    }
                }
                return format; 
            },
            type : function(obj){
                return typeof obj;
            },
            isArray : ARRAY.isArray,
            isObject : function(obj){
              return typeof obj === 'object';
            },
            isNumber : function(obj){
                return typeof obj === 'number';
            },
            isString : function(obj){
                return typeof obj === 'string';
            },
            isDefined : function(obj){
                return obj === undefined;
            },
            isNull : function(obj){
                return obj === null;
            },
            isBoolean : function(obj){
                return typeof obj === 'boolean';
            },
            isTrue : function(obj){
                return obj === true;
            },
            isFalse : function(obj){
                return obj === false;
            },
            string : function(obj){
                return small.isString(obj)?obj:
                        small.isObject(obj)?JSON.stringify(obj):
                        String(obj);
            },
            getDOM : function(selector){
                selector = selector.trim();
                return small.query(DOM,selector);
            },
            query : function(doms,selector){
                var _HTML = /^\s*<(\w+|!)[^>]*>/;
                var _CLASS = /^\.([\w-]+)$/;
                var _ID = /^#[\w\d-]+$/;
                var _TAG = /^[\w-]+$/;
                var elements;
                if(_CLASS.test(selector)){
                    elements = doms.getElementsByClassName(selector.substring(1));
                }else if(_ID.test(selector)&&doms===DOM){
                    elements = doms.getElementById(selector.substring(1));
                }else if(_TAG.test(selector)){
                    elements = doms.getElementsByTagName(selector);
                }else{
                    elements = doms.querySelectorAll(selector);
                }
                if(!elements)elements = [];
                return elements.nodeType ? [elements] : elements.toArray();
            }
        });
        DEBUG && console.timeEnd('util');
        DEBUG && console.time('dom');
        small.extend(small.fn,{
            parent : function(selector){},
            children : function(selector){},
            brother : function(selector){},
            val : function(obj){
                if(!obj){
                    var result = [];
                    this.each(function(item){
                        result.push(item.value?item.value:null);
                    });
                    return result.length?(result.length===1?result[0]:result):null;
                }else{
                    this.each(function(item){
                        item.value = small.string(obj);
                    });
                    return this;
                }
            },
            text : function(obj){
                if(!obj){
                    var result = [];
                    this.each(function(item){
                        result.push(item.textContent?item.textContent:null);
                    });
                    return result.length?(result.length===1?result[0]:result):null;
                }else{
                    this.each(function(item){
                        item.textContent = small.string(obj);
                    });
                    return this;
                }
            },
            html : function(obj){
                if(!obj){
                    var result = [];
                    this.each(function(item){
                        result.push(item.innerHTML?item.innerHTML:null);
                    });
                    return result.length?(result.length===1?result[0]:result):null;
                }else{
                    if(small.isString(obj)||small.isNumber(obj)){
                        this.each(function(item){
                            item.innerHTML = obj;
                        });
                    }else if(small.isArray(obj)){
                        this.each(function(item){
                            item.innerHTML = null;
                            obj.each(function(child){
                                item.appendChild(child);
                            });
                        });
                    }else{
                        this.each(function(item){
                            item.innerHTML = null;
                            item.appendChild(obj);
                        });
                    }
                    return this;
                }
            },
            css : function(property,value){
                var VENDORS = ['-webkit-', '-moz-', '-ms-', '-o-', ''];
                if(small.isString(property)){
                    if(small.isString(value)){
                        this.each(function(item){
                            VENDORS.each(function(vendor){
                                item.style[vendor+property] = value;
                            });
                        });
                    }else{
                        var result = [];
                        this.each(function(item){
                            result.push(item.style[property]||document.defaultView.getComputedStyle(item,'')[property]);
                        });
                        return result.length?(result.length===1?result[0]:result):null;
                    }
                }else if(small.isObject(property)){
                    var items = this;
                    property.each(function(value,key){
                        items.css(key,value);
                    });
                }
                return this;
            },
            attr : function(property,value){
                if(small.isString(property)){
                    if(!value){
                        var result = [];
                        this.each(function(item){
                            result.push(item.getAttribute(property));
                        });
                        return result.length?(result.length===1?result[0]:result):null;
                    }else{
                        this.each(function(item){
                            item.setAttribute(property,small.string(value));
                        });
                    }
                }else if(small.isObject(property)){
                    var items = this;
                    property.each(function(value,key){
                        items.attr(key,value);
                    });
                }
                return this;
            },
            removeAttr : function(property){
                if(small.isString(property)){
                    this.each(function(item){
                        item.removeAttribute(property);
                    });
                }
                return this;
            },
            hide : function(){
                this.css('display','none');
                return this;
            },
            show : function(){
                this.css('display','block');
                return this;
            }
        });
        DEBUG && console.timeEnd('dom');
        return small;
    })();
    WIN.small = WIN.$ = small;
})(window,document,Object,Array);
