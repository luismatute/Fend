!function(e,o){function t(e,o,t){console.log("%c"+e,"background: "+o+"; color: "+t+"; padding: 2px 4px;")}var n={log:function(e,o,n){o="undefined"==typeof o?"#00abe6":o,n="undefined"==typeof n?"#fff":n,t(e,o,n)},debug:function(e){bg="undefined"==typeof bg?"#49B571":bg,color="undefined"==typeof color?"#fff":color,t(e,bg,color)},error:function(e){bg="undefined"==typeof bg?"#EF4836":bg,color="undefined"==typeof color?"#fff":color,t(e,bg,color)},loadCSS:function(e,o){function t(e){var o=document.createElement("link");o.type="text/css",o.rel="stylesheet",o.href=e,document.getElementsByTagName("head")[0].appendChild(o)}"string"==typeof e?t(e):$.each(e,function(o){t(e[o])}),"function"==typeof o&&o()},legacy:function(){for(var o,t=function(){},n=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"],r=n.length,i=e.console=e.console||{};r--;)o=n[r],i[o]||(i[o]=t);"placeholder"in document.createElement("input")||($("input[placeholder], textarea[placeholder]").each(function(){var e=$(this).attr("placeholder");""===this.value&&(this.value=e),$(this).focus(function(){this.value===e&&(this.value="")}).blur(function(){""===$.trim(this.value)&&(this.value=e)})}),$("form").submit(function(){$(this).find("input[placeholder], textarea[placeholder]").each(function(){this.value===$(this).attr("placeholder")&&(this.value="")})})),"function"!=typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}),Object.keys||(Object.keys=function(){var e=Object.prototype.hasOwnProperty,o=!{toString:null}.propertyIsEnumerable("toString"),t=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],n=t.length;return function(r){if("object"!=typeof r&&"function"!=typeof r||null===r)throw new TypeError("Object.keys called on non-object");var i=[];for(var c in r)e.call(r,c)&&i.push(c);if(o)for(var l=0;n>l;l++)e.call(r,t[l])&&i.push(t[l]);return i}}()),Array.prototype.map||(Array.prototype.map=function(e,o){var t,n,r;if(null===this)throw new TypeError(" this is null or not defined");var i=Object(this),c=i.length>>>0;if("function"!=typeof e)throw new TypeError(e+" is not a function");for(o&&(t=o),n=new Array(c),r=0;c>r;){var l,a;if(r in i){var u=r.toString();l=i[u],a=e.call(t,l,r,i),n[u]=a}r++}return n})},dump_form:function(e){console.group("%c Form data sent to backend:","color: #2c3e50"),$.each(e.serializeArray(),function(){console.log("%c "+$(this)[0].name+"%c = %c"+$(this)[0].value,"color: #c0392b","color: #2c3e50","color: #27ae60")}),console.groupEnd()},getUrlParameter:function(o){for(var t=e.location.search.substring(1),n=t.split("&"),r=0;r<n.length;r++){var i=n[r].split("=");if(i[0]==o)return i[1]}}};"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=n:"function"==typeof define&&define.amd&&define("_util",[],function(){return n}),"object"==typeof e&&"object"==typeof e.document&&(e._util=n,e._===o&&(e._=n))}(window);
//# sourceMappingURL=../maps/modules/util.js.map