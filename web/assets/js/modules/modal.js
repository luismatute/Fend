define("modal",[],function(){function t(t,n){return this.$el=$(t),this._defaults=e,this._name=o,this.options=$.extend({},e,n),this.init(),!1}var o="modal",e={title:"SSG",body_class:"has-modal",show_title:!0,show_close:!0,close_btn:!1,modal_container:"modal-container",inner_container:"modal-content"};t.prototype={init:function(){var t=this;console.log("["+this._name+"-plugin]: Initiated"),t.$el.off("click").on("click",function(o){o.preventDefault(),t.create_template(t.$el,t.options)})},create_template:function(t,o){"use strict";function e(t){return t.stopPropagation(),"undefined"!=typeof this&&t.target!==this?!1:(i.remove(),a.add("body").removeClass(o.body_class),void $(document).off("keyup"))}{var n,a=$(".main-wrap"),i=$("<div />",{"class":"modal-container"}),s=$("<div />",{"class":"modal-content container"}),l=$("<div />",{"class":"row"}),c=($("<h1 />",{"class":"modal-title"}),$("<a />",{"class":"modal-exit-btn close-modal"})),d=$("<i />",{"class":"icon-cross close-modal"}),r=$("<div />",{"class":"modal-message"});l.clone(),$("<div />",{"class":"col l12 m12 s12 center-text"}),$("<a />",{"class":"btn-green btn-lg flt-none close-modal"})}""!==t.attr("href")&&(0===t.attr("href").indexOf("#")?(n=$(t.attr("href")),r.html(n.html())):$.get(t.attr("href"),function(t){r.html(t)})),o.show_close===!0&&(c.append(d),s.append(c)),"undefined"!=typeof n&&s.attr("id",n.attr("id")),s.append(r),i.append(s),a.addClass(o.body_class),$("body").addClass(o.body_class).append(i),i.add(i.find(".close-modal")).off("click").on("click",e),$(document).off("keyup").on("keyup",function(t){27==t.keyCode&&e(t)})}},$.fn[o]=function(e){if("string"==typeof e){var n=Array.prototype.slice.call(arguments,1);this.each(function(){var t=$.data(this,o);return t?$.isFunction(t[e])&&"_"!==e.charAt(0)?void t[e].apply(t,n):void console.error("no such method '"+e+"' for "+o+" instance"):void console.error("cannot call methods on "+o+" prior to initialization; attempted to call method '"+e+"'")})}else this.each(function(){var n=$.data(this,o);n||$.data(this,o,new t(this,e))});return this}});
//# sourceMappingURL=../maps/modules/modal.js.map