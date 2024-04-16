(function(a,h){typeof exports=="object"&&typeof module<"u"?module.exports=h():typeof define=="function"&&define.amd?define(h):(a=typeof globalThis<"u"?globalThis:a||self,a.suggestions=h())})(this,function(){"use strict";var z=Object.defineProperty;var O=(a,h,d)=>h in a?z(a,h,{enumerable:!0,configurable:!0,writable:!0,value:d}):a[h]=d;var r=(a,h,d)=>(O(a,typeof h!="symbol"?h+"":h,d),d);function a(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}var h=E,d=Object.prototype.hasOwnProperty;function E(){for(var o={},t=0;t<arguments.length;t++){var s=arguments[t];for(var e in s)d.call(s,e)&&(o[e]=s[e])}return o}const I=a(h);var b={exports:{}};(function(o,t){(function(){var s={};o.exports=s,s.simpleFilter=function(e,i){return i.filter(function(n){return s.test(e,n)})},s.test=function(e,i){return s.match(e,i)!==null},s.match=function(e,i,n){n=n||{};var l=0,u=[],f=i.length,m=0,c=0,g=n.pre||"",S=n.post||"",y=n.caseSensitive&&i||i.toLowerCase(),p;e=n.caseSensitive&&e||e.toLowerCase();for(var v=0;v<f;v++)p=i[v],y[v]===e[l]?(p=g+p+S,l+=1,c+=1+c):c=0,m+=c,u[u.length]=p;return l===e.length?(m=y===e?1/0:m,{rendered:u.join(""),score:m}):null},s.filter=function(e,i,n){return!i||i.length===0?[]:typeof e!="string"?i:(n=n||{},i.reduce(function(l,u,f,m){var c=u;n.extract&&(c=n.extract(u));var g=s.match(e,c,n);return g!=null&&(l[l.length]={string:g.rendered,score:g.score,index:f,original:u}),l},[]).sort(function(l,u){var f=u.score-l.score;return f||l.index-u.index}))}})()})(b);var x=b.exports;const L=a(x);class C{constructor(t){this.component=t,this.id="suggestions-"+Math.random().toString(36).substr(2,16),this.items=[],this.active=0,this.wrapper=document.createElement("div"),this.wrapper.className="suggestions-wrapper",this.element=document.createElement("ul"),this.element.className="suggestions",this.element.id=this.id,this.element.setAttribute("role","listbox"),this.element.setAttribute("aria-label","Results"),this.wrapper.appendChild(this.element),this.selectingListItem=!1,t.el.parentNode.insertBefore(this.wrapper,t.el.nextSibling)}show(){this.element.style.display="block"}hide(){this.element.style.display="none"}add(t){this.items.push(t)}clear(){this.items=[],this.active=0}isEmpty(){return!this.items.length}isVisible(){return this.element.style.display==="block"}draw(){if(this.element.innerHTML="",this.items.length===0){this.hide();return}for(let t=0;t<this.items.length;t++)this.drawItem(this.items[t],this.active===t);this.show()}drawItem(t,s){const e=document.createElement("li"),i=document.createElement("a"),n=this.id+"-"+this.items.indexOf(t);e.setAttribute("id",n),e.setAttribute("role","option"),s&&(this.component.el.setAttribute("aria-activedescendant",n),e.className+=" active",e.setAttribute("aria-selected","true")),i.innerHTML=t.string,i.setAttribute("aria-label",i.textContent),e.appendChild(i),this.element.appendChild(e),e.addEventListener("mousedown",()=>{this.selectingListItem=!0}),e.addEventListener("mouseup",()=>{this.handleMouseUp(t)})}handleMouseUp(t){this.selectingListItem=!1,this.component.value(t.original),this.clear(),this.draw()}move(t){this.active=t,this.draw()}previous(){this.move(this.active===0?this.items.length-1:this.active-1)}next(){this.move(this.active===this.items.length-1?0:this.active+1)}drawError(t){const s=document.createElement("li");s.innerHTML=t,this.element.appendChild(s),this.show()}}class w{constructor(t,s,e){r(this,"handleKeyUp",function(t){t===40||t===38||t===27||t===13||t===9||this.handleInputChange(this.el.value)});r(this,"handleKeyDown",function(t){switch(t.keyCode){case 13:case 9:this.list.isEmpty()||(this.list.isVisible()&&t.preventDefault(),this.value(this.list.items[this.list.active].original),this.list.hide());break;case 27:this.list.isEmpty()||this.list.hide();break;case 38:this.list.previous();break;case 40:this.list.next();break}});r(this,"handleBlur",function(){!this.list.selectingListItem&&this.options.hideOnBlur&&this.list.hide()});r(this,"handlePaste",function(t){if(t.clipboardData)this.handleInputChange(t.clipboardData.getData("Text"));else{var s=this;setTimeout(function(){s.handleInputChange(t.target.value)},100)}});r(this,"handleInputChange",function(t){if(this.query=this.normalize(t),this.list.clear(),this.query.length<this.options.minLength){this.list.draw();return}this.getCandidates((function(s){for(var e=0;e<s.length&&(this.list.add(s[e]),e!==this.options.limit-1);e++);this.list.draw()}).bind(this))});r(this,"handleFocus",function(){this.list.isEmpty()||this.list.show(),this.list.selectingListItem=!1});r(this,"update",function(t){this.data=t,this.handleKeyUp()});r(this,"clear",function(){this.data=[],this.list.clear()});r(this,"normalize",function(t){return t=t.toLowerCase(),t});r(this,"match",function(t,s){return t.indexOf(s)>-1});r(this,"value",function(t){if(this.selected=t,this.el.value=this.getItemValue(t),document.createEvent){var s=document.createEvent("HTMLEvents");s.initEvent("change",!0,!1),this.el.dispatchEvent(s)}else this.el.fireEvent("onchange")});r(this,"getCandidates",function(t){var s={pre:"<strong>",post:"</strong>",extract:(function(i){return this.getItemValue(i)}).bind(this)},e;this.options.filter?(e=L.filter(this.query,this.data,s),e=e.map((function(i){return{original:i.original,string:this.render(i.original,i.string)}}).bind(this))):e=this.data.map((function(i){var n=this.render(i);return{original:i,string:n}}).bind(this)),t(e)});r(this,"getItemValue",function(t){return t});r(this,"render",function(t,s){if(s)return s;for(var e=t.original?this.getItemValue(t.original):this.getItemValue(t),i=this.normalize(e),n=i.lastIndexOf(this.query);n>-1;){var l=n+this.query.length;e=e.slice(0,n)+"<strong>"+e.slice(n,l)+"</strong>"+e.slice(l),n=i.slice(0,n).lastIndexOf(this.query)}return e});r(this,"renderError",function(t){this.list.drawError(t)});e=e||{},this.options=I({minLength:2,limit:5,filter:!0,hideOnBlur:!0},e),this.el=t,this.data=s||[],this.list=new C(this),this.el.setAttribute("role","combobox"),this.el.setAttribute("aria-autocomplete","list"),this.el.setAttribute("aria-controls",this.list.id),this.query="",this.selected=null,this.list.draw(),this.el.addEventListener("keyup",(function(i){this.handleKeyUp(i.keyCode)}).bind(this),!1),this.el.addEventListener("keydown",(function(i){this.handleKeyDown(i)}).bind(this)),this.el.addEventListener("focus",(function(){this.handleFocus()}).bind(this)),this.el.addEventListener("blur",(function(){this.handleBlur()}).bind(this)),this.el.addEventListener("paste",(function(i){this.handlePaste(i)}).bind(this)),this.render=this.options.render?this.options.render.bind(this):this.render.bind(this),this.getItemValue=this.options.getItemValue?this.options.getItemValue.bind(this):this.getItemValue.bind(this)}}return typeof window<"u"&&(window.Suggestions=w),w});
