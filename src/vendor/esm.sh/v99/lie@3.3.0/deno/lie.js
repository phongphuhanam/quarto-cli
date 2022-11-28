/* esm.sh - esbuild bundle(lie@3.3.0) deno production */
import __immediate$ from "/v99/immediate@3.0.6/deno/immediate.js";var D=Object.create;var m=Object.defineProperty;var I=Object.getOwnPropertyDescriptor;var N=Object.getOwnPropertyNames;var _=Object.getPrototypeOf,A=Object.prototype.hasOwnProperty;var x=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+e+'" is not supported')});var P=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var S=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of N(t))!A.call(e,o)&&o!==r&&m(e,o,{get:()=>t[o],enumerable:!(n=I(t,o))||n.enumerable});return e};var U=(e,t,r)=>(r=e!=null?D(_(e)):{},S(t||!e||!e.__esModule?m(r,"default",{value:e,enumerable:!0}):r,e));var F=P((K,T)=>{"use strict";var G=__immediate$;function l(){}var i={},d=["REJECTED"],p=["FULFILLED"],w=["PENDING"];T.exports=a;function a(e){if(typeof e!="function")throw new TypeError("resolver must be a function");this.state=w,this.queue=[],this.outcome=void 0,e!==l&&j(this,e)}a.prototype.finally=function(e){if(typeof e!="function")return this;var t=this.constructor;return this.then(r,n);function r(o){function u(){return o}return t.resolve(e()).then(u)}function n(o){function u(){throw o}return t.resolve(e()).then(u)}};a.prototype.catch=function(e){return this.then(null,e)};a.prototype.then=function(e,t){if(typeof e!="function"&&this.state===p||typeof t!="function"&&this.state===d)return this;var r=new this.constructor(l);if(this.state!==w){var n=this.state===p?e:t;y(r,n,this.outcome)}else this.queue.push(new h(r,e,t));return r};function h(e,t,r){this.promise=e,typeof t=="function"&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),typeof r=="function"&&(this.onRejected=r,this.callRejected=this.otherCallRejected)}h.prototype.callFulfilled=function(e){i.resolve(this.promise,e)};h.prototype.otherCallFulfilled=function(e){y(this.promise,this.onFulfilled,e)};h.prototype.callRejected=function(e){i.reject(this.promise,e)};h.prototype.otherCallRejected=function(e){y(this.promise,this.onRejected,e)};function y(e,t,r){G(function(){var n;try{n=t(r)}catch(o){return i.reject(e,o)}n===e?i.reject(e,new TypeError("Cannot resolve promise with itself")):i.resolve(e,n)})}i.resolve=function(e,t){var r=E(J,t);if(r.status==="error")return i.reject(e,r.value);var n=r.value;if(n)j(e,n);else{e.state=p,e.outcome=t;for(var o=-1,u=e.queue.length;++o<u;)e.queue[o].callFulfilled(t)}return e};i.reject=function(e,t){e.state=d,e.outcome=t;for(var r=-1,n=e.queue.length;++r<n;)e.queue[r].callRejected(t);return e};function J(e){var t=e&&e.then;if(e&&(typeof e=="object"||typeof e=="function")&&typeof t=="function")return function(){t.apply(e,arguments)}}function j(e,t){var r=!1;function n(s){r||(r=!0,i.reject(e,s))}function o(s){r||(r=!0,i.resolve(e,s))}function u(){t(o,n)}var c=E(u);c.status==="error"&&n(c.value)}function E(e,t){var r={};try{r.value=e(t),r.status="success"}catch(n){r.status="error",r.value=n}return r}a.resolve=O;function O(e){return e instanceof this?e:i.resolve(new this(l),e)}a.reject=Q;function Q(e){var t=new this(l);return i.reject(t,e)}a.all=V;function V(e){var t=this;if(Object.prototype.toString.call(e)!=="[object Array]")return this.reject(new TypeError("must be an array"));var r=e.length,n=!1;if(!r)return this.resolve([]);for(var o=new Array(r),u=0,c=-1,s=new this(l);++c<r;)f(e[c],c);return s;function f(C,q){t.resolve(C).then(L,function(v){n||(n=!0,i.reject(s,v))});function L(v){o[q]=v,++u===r&&!n&&(n=!0,i.resolve(s,o))}}}a.race=z;function z(e){var t=this;if(Object.prototype.toString.call(e)!=="[object Array]")return this.reject(new TypeError("must be an array"));var r=e.length,n=!1;if(!r)return this.resolve([]);for(var o=-1,u=new this(l);++o<r;)c(e[o]);return u;function c(s){t.resolve(s).then(function(f){n||(n=!0,i.resolve(u,f))},function(f){n||(n=!0,i.reject(u,f))})}}});var g=U(F()),{resolve:M,reject:W,all:X,race:Y}=g,{default:R,...B}=g,Z=R!==void 0?R:B;export{X as all,Z as default,Y as race,W as reject,M as resolve};
