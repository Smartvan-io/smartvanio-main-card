/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(s,t,i)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:o,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:c,getOwnPropertySymbols:p,getPrototypeOf:h}=Object,u=globalThis,g=u.trustedTypes,m=g?g.emptyScript:"",v=u.reactiveElementPolyfillSupport,f=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},x=(t,e)=>!o(t,e),y={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:x};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let _=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const a=s?.call(this);r?.call(this,e),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=h(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...c(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=s;const a=r.fromAttribute(e,t.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const a=this.constructor;if(!1===s&&(r=this[t]),i??=a.getPropertyOptions(t),!((i.hasChanged??x)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},a){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==r||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[f("elementProperties")]=new Map,_[f("finalized")]=new Map,v?.({ReactiveElement:_}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,$=t=>t,k=w.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,M="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+T,E=`<${C}>`,P=document,A=()=>P.createComment(""),z=t=>null===t||"object"!=typeof t&&"function"!=typeof t,L=Array.isArray,O="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,F=/>/g,N=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,B=/"/g,V=/^(?:script|style|textarea|title)$/i,j=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),G=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),U=new WeakMap,W=P.createTreeWalker(P,129);function H(t,e){if(!L(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Y=(t,e)=>{const i=t.length-1,s=[];let r,a=2===e?"<svg>":3===e?"<math>":"",n=I;for(let e=0;e<i;e++){const i=t[e];let o,l,d=-1,c=0;for(;c<i.length&&(n.lastIndex=c,l=n.exec(i),null!==l);)c=n.lastIndex,n===I?"!--"===l[1]?n=D:void 0!==l[1]?n=F:void 0!==l[2]?(V.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=N):void 0!==l[3]&&(n=N):n===N?">"===l[0]?(n=r??I,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,o=l[1],n=void 0===l[3]?N:'"'===l[3]?B:R):n===B||n===R?n=N:n===D||n===F?n=I:(n=N,r=void 0);const p=n===N&&t[e+1].startsWith("/>")?" ":"";a+=n===I?i+E:d>=0?(s.push(o),i.slice(0,d)+M+i.slice(d)+T+p):i+T+(-2===d?e:p)}return[H(t,a+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class X{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,a=0;const n=t.length-1,o=this.parts,[l,d]=Y(t,e);if(this.el=X.createElement(l,i),W.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=W.nextNode())&&o.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(M)){const e=d[a++],i=s.getAttribute(t).split(T),n=/([.?@])?(.*)/.exec(e);o.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?tt:"?"===n[1]?et:"@"===n[1]?it:Q}),s.removeAttribute(t)}else t.startsWith(T)&&(o.push({type:6,index:r}),s.removeAttribute(t));if(V.test(s.tagName)){const t=s.textContent.split(T),e=t.length-1;if(e>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],A()),W.nextNode(),o.push({type:2,index:++r});s.append(t[e],A())}}}else if(8===s.nodeType)if(s.data===C)o.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(T,t+1));)o.push({type:7,index:r}),t+=T.length-1}r++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,s){if(e===G)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const a=z(e)?void 0:e._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),void 0===a?r=void 0:(r=new a(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=K(t,r._$AS(t,e.values),r,s)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??P).importNode(e,!0);W.currentNode=s;let r=W.nextNode(),a=0,n=0,o=i[0];for(;void 0!==o;){if(a===o.index){let e;2===o.type?e=new Z(r,r.nextSibling,this,t):1===o.type?e=new o.ctor(r,o.name,o.strings,this,t):6===o.type&&(e=new st(r,this,t)),this._$AV.push(e),o=i[++n]}a!==o?.index&&(r=W.nextNode(),a++)}return W.currentNode=P,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),z(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==G&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>L(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=X.createElement(H(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new J(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=U.get(t.strings);return void 0===e&&U.set(t.strings,e=new X(t)),e}k(t){L(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new Z(this.O(A()),this.O(A()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=$(t).nextSibling;$(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(t,e=this,i,s){const r=this.strings;let a=!1;if(void 0===r)t=K(this,t,e,0),a=!z(t)||t!==this._$AH&&t!==G,a&&(this._$AH=t);else{const s=t;let n,o;for(t=r[0],n=0;n<r.length-1;n++)o=K(this,s[i+n],e,n),o===G&&(o=this._$AH[n]),a||=!z(o)||o!==this._$AH[n],o===q?t=q:t!==q&&(t+=(o??"")+r[n+1]),this._$AH[n]=o}a&&!s&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class et extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class it extends Q{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??q)===G)return;const i=this._$AH,s=t===q&&i!==q||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==q&&(i===q||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(X,Z),(w.litHtmlVersions??=[]).push("3.3.2");const at=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let nt=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new Z(e.insertBefore(A(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}};nt._$litElement$=!0,nt.finalized=!0,at.litElementHydrateSupport?.({LitElement:nt});const ot=at.litElementPolyfillSupport;ot?.({LitElement:nt}),(at.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt=1,dt=2,ct=3,pt=4,ht=t=>(...e)=>({_$litDirective$:t,values:e});class ut{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gt=t=>void 0===t.strings,mt={};function vt(t,e){const i=t.indexOf(e);i>-1&&t.splice(i,1)}const ft=(t,e,i)=>i>e?e:i<t?t:i;function bt(t,e){return e?`${t}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${e}`:t}let xt=()=>{},yt=()=>{};"undefined"!=typeof process&&"production"!==process.env?.NODE_ENV&&(xt=(t,e,i)=>{t||"undefined"==typeof console||console.warn(bt(e,i))},yt=(t,e,i)=>{if(!t)throw new Error(bt(e,i))});const _t={},wt=t=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t);const $t=t=>/^0[^.\s]+$/u.test(t);function kt(t){let e;return()=>(void 0===e&&(e=t()),e)}const St=t=>t,Mt=(t,e)=>i=>e(t(i)),Tt=(...t)=>t.reduce(Mt),Ct=(t,e,i)=>{const s=e-t;return 0===s?1:(i-t)/s};class Et{constructor(){this.subscriptions=[]}add(t){var e,i;return e=this.subscriptions,i=t,-1===e.indexOf(i)&&e.push(i),()=>vt(this.subscriptions,t)}notify(t,e,i){const s=this.subscriptions.length;if(s)if(1===s)this.subscriptions[0](t,e,i);else for(let r=0;r<s;r++){const s=this.subscriptions[r];s&&s(t,e,i)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const Pt=t=>1e3*t,At=t=>t/1e3;function zt(t,e){return e?t*(1e3/e):0}const Lt=(t,e,i)=>(((1-3*i+3*e)*t+(3*i-6*e))*t+3*e)*t;function Ot(t,e,i,s){if(t===e&&i===s)return St;const r=e=>function(t,e,i,s,r){let a,n,o=0;do{n=e+(i-e)/2,a=Lt(n,s,r)-t,a>0?i=n:e=n}while(Math.abs(a)>1e-7&&++o<12);return n}(e,0,1,t,i);return t=>0===t||1===t?t:Lt(r(t),e,s)}const It=t=>e=>e<=.5?t(2*e)/2:(2-t(2*(1-e)))/2,Dt=t=>e=>1-t(1-e),Ft=Ot(.33,1.53,.69,.99),Nt=Dt(Ft),Rt=It(Nt),Bt=t=>t>=1?1:(t*=2)<1?.5*Nt(t):.5*(2-Math.pow(2,-10*(t-1))),Vt=t=>1-Math.sin(Math.acos(t)),jt=Dt(Vt),Gt=It(Vt),qt=Ot(.42,0,1,1),Ut=Ot(0,0,.58,1),Wt=Ot(.42,0,.58,1),Ht=t=>Array.isArray(t)&&"number"!=typeof t[0];function Yt(t,e){return Ht(t)?t[((t,e,i)=>{const s=e-t;return((i-t)%s+s)%s+t})(0,t.length,e)]:t}const Xt=t=>Array.isArray(t)&&"number"==typeof t[0],Kt={linear:St,easeIn:qt,easeInOut:Wt,easeOut:Ut,circIn:Vt,circInOut:Gt,circOut:jt,backIn:Nt,backInOut:Rt,backOut:Ft,anticipate:Bt},Jt=t=>{if(Xt(t)){yt(4===t.length,"Cubic bezier arrays must contain four numerical values.","cubic-bezier-length");const[e,i,s,r]=t;return Ot(e,i,s,r)}return"string"==typeof t?(yt(void 0!==Kt[t],`Invalid easing type '${t}'`,"invalid-easing-type"),Kt[t]):t},Zt=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"];function Qt(t,e){let i=!1,s=!0;const r={delta:0,timestamp:0,isProcessing:!1},a=()=>i=!0,n=Zt.reduce((t,e)=>(t[e]=function(t){let e=new Set,i=new Set,s=!1,r=!1;const a=new WeakSet;let n={delta:0,timestamp:0,isProcessing:!1};function o(e){a.has(e)&&(l.schedule(e),t()),e(n)}const l={schedule:(t,r=!1,n=!1)=>{const o=n&&s?e:i;return r&&a.add(t),o.add(t),t},cancel:t=>{i.delete(t),a.delete(t)},process:t=>{if(n=t,s)return void(r=!0);s=!0;const a=e;e=i,i=a,e.forEach(o),e.clear(),s=!1,r&&(r=!1,l.process(t))}};return l}(a),t),{}),{setup:o,read:l,resolveKeyframes:d,preUpdate:c,update:p,preRender:h,render:u,postRender:g}=n,m=()=>{const a=_t.useManualTiming,n=a?r.timestamp:performance.now();i=!1,a||(r.delta=s?1e3/60:Math.max(Math.min(n-r.timestamp,40),1)),r.timestamp=n,r.isProcessing=!0,o.process(r),l.process(r),d.process(r),c.process(r),p.process(r),h.process(r),u.process(r),g.process(r),r.isProcessing=!1,i&&e&&(s=!1,t(m))};return{schedule:Zt.reduce((e,a)=>{const o=n[a];return e[a]=(e,a=!1,n=!1)=>(i||(i=!0,s=!0,r.isProcessing||t(m)),o.schedule(e,a,n)),e},{}),cancel:t=>{for(let e=0;e<Zt.length;e++)n[Zt[e]].cancel(t)},state:r,steps:n}}const{schedule:te,cancel:ee,state:ie}=Qt("undefined"!=typeof requestAnimationFrame?requestAnimationFrame:St,!0);let se;function re(){se=void 0}const ae={now:()=>(void 0===se&&ae.set(ie.isProcessing||_t.useManualTiming?ie.timestamp:performance.now()),se),set:t=>{se=t,queueMicrotask(re)}},ne=t=>e=>"string"==typeof e&&e.startsWith(t),oe=ne("--"),le=ne("var(--"),de=t=>!!le(t)&&ce.test(t.split("/*")[0].trim()),ce=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;function pe(t){return"string"==typeof t&&t.split("/*")[0].includes("var(--")}const he={test:t=>"number"==typeof t,parse:parseFloat,transform:t=>t},ue={...he,transform:t=>ft(0,1,t)},ge={...he,default:1},me=t=>Math.round(1e5*t)/1e5,ve=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;const fe=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,be=(t,e)=>i=>Boolean("string"==typeof i&&fe.test(i)&&i.startsWith(t)||e&&!function(t){return null==t}(i)&&Object.prototype.hasOwnProperty.call(i,e)),xe=(t,e,i)=>s=>{if("string"!=typeof s)return s;const[r,a,n,o]=s.match(ve);return{[t]:parseFloat(r),[e]:parseFloat(a),[i]:parseFloat(n),alpha:void 0!==o?parseFloat(o):1}},ye={...he,transform:t=>Math.round((t=>ft(0,255,t))(t))},_e={test:be("rgb","red"),parse:xe("red","green","blue"),transform:({red:t,green:e,blue:i,alpha:s=1})=>"rgba("+ye.transform(t)+", "+ye.transform(e)+", "+ye.transform(i)+", "+me(ue.transform(s))+")"};const we={test:be("#"),parse:function(t){let e="",i="",s="",r="";return t.length>5?(e=t.substring(1,3),i=t.substring(3,5),s=t.substring(5,7),r=t.substring(7,9)):(e=t.substring(1,2),i=t.substring(2,3),s=t.substring(3,4),r=t.substring(4,5),e+=e,i+=i,s+=s,r+=r),{red:parseInt(e,16),green:parseInt(i,16),blue:parseInt(s,16),alpha:r?parseInt(r,16)/255:1}},transform:_e.transform},$e=t=>({test:e=>"string"==typeof e&&e.endsWith(t)&&1===e.split(" ").length,parse:parseFloat,transform:e=>`${e}${t}`}),ke=$e("deg"),Se=$e("%"),Me=$e("px"),Te=$e("vh"),Ce=$e("vw"),Ee=(()=>({...Se,parse:t=>Se.parse(t)/100,transform:t=>Se.transform(100*t)}))(),Pe={test:be("hsl","hue"),parse:xe("hue","saturation","lightness"),transform:({hue:t,saturation:e,lightness:i,alpha:s=1})=>"hsla("+Math.round(t)+", "+Se.transform(me(e))+", "+Se.transform(me(i))+", "+me(ue.transform(s))+")"},Ae={test:t=>_e.test(t)||we.test(t)||Pe.test(t),parse:t=>_e.test(t)?_e.parse(t):Pe.test(t)?Pe.parse(t):we.parse(t),transform:t=>"string"==typeof t?t:t.hasOwnProperty("red")?_e.transform(t):Pe.transform(t),getAnimatableNone:t=>{const e=Ae.parse(t);return e.alpha=0,Ae.transform(e)}},ze=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;const Le="number",Oe="color",Ie=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function De(t){const e=t.toString(),i=[],s={color:[],number:[],var:[]},r=[];let a=0;const n=e.replace(Ie,t=>(Ae.test(t)?(s.color.push(a),r.push(Oe),i.push(Ae.parse(t))):t.startsWith("var(")?(s.var.push(a),r.push("var"),i.push(t)):(s.number.push(a),r.push(Le),i.push(parseFloat(t))),++a,"${}")).split("${}");return{values:i,split:n,indexes:s,types:r}}function Fe({split:t,types:e}){const i=t.length;return s=>{let r="";for(let a=0;a<i;a++)if(r+=t[a],void 0!==s[a]){const t=e[a];r+=t===Le?me(s[a]):t===Oe?Ae.transform(s[a]):s[a]}return r}}const Ne=(t,e)=>"number"==typeof t?e?.trim().endsWith("/")?t:0:(t=>"number"==typeof t?0:Ae.test(t)?Ae.getAnimatableNone(t):t)(t);const Re={test:function(t){return isNaN(t)&&"string"==typeof t&&(t.match(ve)?.length||0)+(t.match(ze)?.length||0)>0},parse:function(t){return De(t).values},createTransformer:function(t){return Fe(De(t))},getAnimatableNone:function(t){const e=De(t);return Fe(e)(e.values.map((t,i)=>Ne(t,e.split[i])))}};function Be(t,e,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?t+6*(e-t)*i:i<.5?e:i<2/3?t+(e-t)*(2/3-i)*6:t}function Ve(t,e){return i=>i>0?e:t}const je=(t,e,i)=>t+(e-t)*i,Ge=(t,e,i)=>{const s=t*t,r=i*(e*e-s)+s;return r<0?0:Math.sqrt(r)},qe=[we,_e,Pe];function Ue(t){const e=(t=>qe.find(e=>e.test(t)))(t);if(xt(Boolean(e),`'${t}' is not an animatable color. Use the equivalent color code instead.`,"color-not-animatable"),!Boolean(e))return!1;let i=e.parse(t);return e===Pe&&(i=function({hue:t,saturation:e,lightness:i,alpha:s}){t/=360,i/=100;let r=0,a=0,n=0;if(e/=100){const s=i<.5?i*(1+e):i+e-i*e,o=2*i-s;r=Be(o,s,t+1/3),a=Be(o,s,t),n=Be(o,s,t-1/3)}else r=a=n=i;return{red:Math.round(255*r),green:Math.round(255*a),blue:Math.round(255*n),alpha:s}}(i)),i}const We=(t,e)=>{const i=Ue(t),s=Ue(e);if(!i||!s)return Ve(t,e);const r={...i};return t=>(r.red=Ge(i.red,s.red,t),r.green=Ge(i.green,s.green,t),r.blue=Ge(i.blue,s.blue,t),r.alpha=je(i.alpha,s.alpha,t),_e.transform(r))},He=new Set(["none","hidden"]);function Ye(t,e){return i=>je(t,e,i)}function Xe(t){return"number"==typeof t?Ye:"string"==typeof t?de(t)?Ve:Ae.test(t)?We:Ze:Array.isArray(t)?Ke:"object"==typeof t?Ae.test(t)?We:Je:Ve}function Ke(t,e){const i=[...t],s=i.length,r=t.map((t,i)=>Xe(t)(t,e[i]));return t=>{for(let e=0;e<s;e++)i[e]=r[e](t);return i}}function Je(t,e){const i={...t,...e},s={};for(const r in i)void 0!==t[r]&&void 0!==e[r]&&(s[r]=Xe(t[r])(t[r],e[r]));return t=>{for(const e in s)i[e]=s[e](t);return i}}const Ze=(t,e)=>{const i=Re.createTransformer(e),s=De(t),r=De(e);return s.indexes.var.length===r.indexes.var.length&&s.indexes.color.length===r.indexes.color.length&&s.indexes.number.length>=r.indexes.number.length?He.has(t)&&!r.values.length||He.has(e)&&!s.values.length?function(t,e){return He.has(t)?i=>i<=0?t:e:i=>i>=1?e:t}(t,e):Tt(Ke(function(t,e){const i=[],s={color:0,var:0,number:0};for(let r=0;r<e.values.length;r++){const a=e.types[r],n=t.indexes[a][s[a]],o=t.values[n]??0;i[r]=o,s[a]++}return i}(s,r),r.values),i):(xt(!0,`Complex values '${t}' and '${e}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`,"complex-values-different"),Ve(t,e))};function Qe(t,e,i){if("number"==typeof t&&"number"==typeof e&&"number"==typeof i)return je(t,e,i);return Xe(t)(t,e)}const ti=t=>{const e=({timestamp:e})=>t(e);return{start:(t=!0)=>te.update(e,t),stop:()=>ee(e),now:()=>ie.isProcessing?ie.timestamp:ae.now()}},ei=(t,e,i=10)=>{let s="";const r=Math.max(Math.round(e/i),2);for(let e=0;e<r;e++)s+=Math.round(1e4*t(e/(r-1)))/1e4+", ";return`linear(${s.substring(0,s.length-2)})`},ii=2e4;function si(t){let e=0;let i=t.next(e);for(;!i.done&&e<ii;)e+=50,i=t.next(e);return e>=ii?1/0:e}function ri(t,e=100,i){const s=i({...t,keyframes:[0,e]}),r=Math.min(si(s),ii);return{type:"keyframes",ease:t=>s.next(r*t).value/e,duration:At(r)}}const ai=100,ni=10,oi=1,li=0,di=800,ci=.3,pi=.3,hi={granular:.01,default:2},ui={granular:.005,default:.5},gi=.01,mi=10,vi=.05,fi=1;function bi(t,e){return t*Math.sqrt(1-e*e)}const xi=.001;const yi=["duration","bounce"],_i=["stiffness","damping","mass"];function wi(t,e){return e.some(e=>void 0!==t[e])}function $i(t){let e={velocity:li,stiffness:ai,damping:ni,mass:oi,isResolvedFromDuration:!1,...t};if(!wi(t,_i)&&wi(t,yi))if(e.velocity=0,t.visualDuration){const i=t.visualDuration,s=2*Math.PI/(1.2*i),r=s*s,a=2*ft(.05,1,1-(t.bounce||0))*Math.sqrt(r);e={...e,mass:oi,stiffness:r,damping:a}}else{const i=function({duration:t=di,bounce:e=ci,velocity:i=li,mass:s=oi}){let r,a;xt(t<=Pt(mi),"Spring duration must be 10 seconds or less","spring-duration-limit");let n=1-e;n=ft(vi,fi,n),t=ft(gi,mi,At(t)),n<1?(r=e=>{const s=e*n,r=s*t,a=s-i,o=bi(e,n),l=Math.exp(-r);return xi-a/o*l},a=e=>{const s=e*n*t,a=s*i+i,o=Math.pow(n,2)*Math.pow(e,2)*t,l=Math.exp(-s),d=bi(Math.pow(e,2),n);return(-r(e)+xi>0?-1:1)*((a-o)*l)/d}):(r=e=>Math.exp(-e*t)*((e-i)*t+1)-.001,a=e=>Math.exp(-e*t)*(t*t*(i-e)));const o=function(t,e,i){let s=i;for(let i=1;i<12;i++)s-=t(s)/e(s);return s}(r,a,5/t);if(t=Pt(t),isNaN(o))return{stiffness:ai,damping:ni,duration:t};{const e=Math.pow(o,2)*s;return{stiffness:e,damping:2*n*Math.sqrt(s*e),duration:t}}}({...t,velocity:0});e={...e,...i,mass:oi},e.isResolvedFromDuration=!0}return e}function ki(t=pi,e=ci){const i="object"!=typeof t?{visualDuration:t,keyframes:[0,1],bounce:e}:t;let{restSpeed:s,restDelta:r}=i;const a=i.keyframes[0],n=i.keyframes[i.keyframes.length-1],o={done:!1,value:a},{stiffness:l,damping:d,mass:c,duration:p,velocity:h,isResolvedFromDuration:u}=$i({...i,velocity:-At(i.velocity||0)}),g=h||0,m=d/(2*Math.sqrt(l*c)),v=n-a,f=At(Math.sqrt(l/c)),b=Math.abs(v)<5;let x,y,_,w,$,k;if(s||(s=b?hi.granular:hi.default),r||(r=b?ui.granular:ui.default),m<1)_=bi(f,m),w=(g+m*f*v)/_,x=t=>{const e=Math.exp(-m*f*t);return n-e*(w*Math.sin(_*t)+v*Math.cos(_*t))},$=m*f*w+v*_,k=m*f*v-w*_,y=t=>Math.exp(-m*f*t)*($*Math.sin(_*t)+k*Math.cos(_*t));else if(1===m){x=t=>n-Math.exp(-f*t)*(v+(g+f*v)*t);const t=g+f*v;y=e=>Math.exp(-f*e)*(f*t*e-g)}else{const t=f*Math.sqrt(m*m-1);x=e=>{const i=Math.exp(-m*f*e),s=Math.min(t*e,300);return n-i*((g+m*f*v)*Math.sinh(s)+t*v*Math.cosh(s))/t};const e=(g+m*f*v)/t,i=m*f*e-v*t,s=m*f*v-e*t;y=e=>{const r=Math.exp(-m*f*e),a=Math.min(t*e,300);return r*(i*Math.sinh(a)+s*Math.cosh(a))}}const S={calculatedDuration:u&&p||null,velocity:t=>Pt(y(t)),next:t=>{if(!u&&m<1){const e=Math.exp(-m*f*t),i=Math.sin(_*t),a=Math.cos(_*t),l=n-e*(w*i+v*a),d=Pt(e*($*i+k*a));return o.done=Math.abs(d)<=s&&Math.abs(n-l)<=r,o.value=o.done?n:l,o}const e=x(t);if(u)o.done=t>=p;else{const i=Pt(y(t));o.done=Math.abs(i)<=s&&Math.abs(n-e)<=r}return o.value=o.done?n:e,o},toString:()=>{const t=Math.min(si(S),ii),e=ei(e=>S.next(t*e).value,t,30);return t+"ms "+e},toTransition:()=>{}};return S}ki.applyToOptions=t=>{const e=ri(t,100,ki);return t.ease=e.ease,t.duration=Pt(e.duration),t.type="keyframes",t};function Si(t,e,i){const s=Math.max(e-5,0);return zt(i-t(s),e-s)}function Mi({keyframes:t,velocity:e=0,power:i=.8,timeConstant:s=325,bounceDamping:r=10,bounceStiffness:a=500,modifyTarget:n,min:o,max:l,restDelta:d=.5,restSpeed:c}){const p=t[0],h={done:!1,value:p},u=t=>void 0===o?l:void 0===l||Math.abs(o-t)<Math.abs(l-t)?o:l;let g=i*e;const m=p+g,v=void 0===n?m:n(m);v!==m&&(g=v-p);const f=t=>-g*Math.exp(-t/s),b=t=>v+f(t),x=t=>{const e=f(t),i=b(t);h.done=Math.abs(e)<=d,h.value=h.done?v:i};let y,_;const w=t=>{(t=>void 0!==o&&t<o||void 0!==l&&t>l)(h.value)&&(y=t,_=ki({keyframes:[h.value,u(h.value)],velocity:Si(b,t,h.value),damping:r,stiffness:a,restDelta:d,restSpeed:c}))};return w(0),{calculatedDuration:null,next:t=>{let e=!1;return _||void 0!==y||(e=!0,x(t),w(t)),void 0!==y&&t>=y?_.next(t-y):(!e&&x(t),h)}}}function Ti(t,e,{clamp:i=!0,ease:s,mixer:r}={}){const a=t.length;if(yt(a===e.length,"Both input and output ranges must be the same length","range-length"),1===a)return()=>e[0];if(2===a&&e[0]===e[1])return()=>e[1];const n=t[0]===t[1];t[0]>t[a-1]&&(t=[...t].reverse(),e=[...e].reverse());const o=function(t,e,i){const s=[],r=i||_t.mix||Qe,a=t.length-1;for(let i=0;i<a;i++){let a=r(t[i],t[i+1]);if(e){const t=Array.isArray(e)?e[i]||St:e;a=Tt(t,a)}s.push(a)}return s}(e,s,r),l=o.length,d=i=>{if(n&&i<t[0])return e[0];let s=0;if(l>1)for(;s<t.length-2&&!(i<t[s+1]);s++);const r=Ct(t[s],t[s+1],i);return o[s](r)};return i?e=>d(ft(t[0],t[a-1],e)):d}function Ci(t,e){const i=t[t.length-1];for(let s=1;s<=e;s++){const r=Ct(0,e,s);t.push(je(i,1,r))}}function Ei(t){const e=[0];return Ci(e,t.length-1),e}function Pi({duration:t=300,keyframes:e,times:i,ease:s="easeInOut"}){const r=Ht(s)?s.map(Jt):Jt(s),a={done:!1,value:e[0]},n=function(t,e){return t.map(t=>t*e)}(i&&i.length===e.length?i:Ei(e),t),o=Ti(n,e,{ease:Array.isArray(r)?r:(l=e,d=r,l.map(()=>d||Wt).splice(0,l.length-1))});var l,d;return{calculatedDuration:t,next:e=>(a.value=o(e),a.done=e>=t,a)}}const Ai=t=>null!==t;function zi(t,{repeat:e,repeatType:i="loop"},s,r=1){const a=t.filter(Ai),n=r<0||e&&"loop"!==i&&e%2==1?0:a.length-1;return n&&void 0!==s?s:a[n]}const Li={decay:Mi,inertia:Mi,tween:Pi,keyframes:Pi,spring:ki};function Oi(t){"string"==typeof t.type&&(t.type=Li[t.type])}class Ii{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(t=>{this.resolve=t})}notifyFinished(){this.resolve()}then(t,e){return this.finished.then(t,e)}}const Di=t=>t/100;class Fi extends Ii{constructor(t){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.delayState={done:!1,value:void 0},this.stop=()=>{const{motionValue:t}=this.options;t&&t.updatedAt!==ae.now()&&this.tick(ae.now()),this.isStopped=!0,"idle"!==this.state&&(this.teardown(),this.options.onStop?.())},this.options=t,this.initAnimation(),this.play(),!1===t.autoplay&&this.pause()}initAnimation(){const{options:t}=this;Oi(t);const{type:e=Pi,repeat:i=0,repeatDelay:s=0,repeatType:r,velocity:a=0}=t;let{keyframes:n}=t;const o=e||Pi;o!==Pi&&"number"!=typeof n[0]&&(this.mixKeyframes=Tt(Di,Qe(n[0],n[1])),n=[0,100]);const l=o({...t,keyframes:n});"mirror"===r&&(this.mirroredGenerator=o({...t,keyframes:[...n].reverse(),velocity:-a})),null===l.calculatedDuration&&(l.calculatedDuration=si(l));const{calculatedDuration:d}=l;this.calculatedDuration=d,this.resolvedDuration=d+s,this.totalDuration=this.resolvedDuration*(i+1)-s,this.generator=l}updateTime(t){const e=Math.round(t-this.startTime)*this.playbackSpeed;null!==this.holdTime?this.currentTime=this.holdTime:this.currentTime=e}tick(t,e=!1){const{generator:i,totalDuration:s,mixKeyframes:r,mirroredGenerator:a,resolvedDuration:n,calculatedDuration:o}=this;if(null===this.startTime)return i.next(0);const{delay:l=0,keyframes:d,repeat:c,repeatType:p,repeatDelay:h,type:u,onUpdate:g,finalKeyframe:m}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,t):this.speed<0&&(this.startTime=Math.min(t-s/this.speed,this.startTime)),e?this.currentTime=t:this.updateTime(t);const v=this.currentTime-l*(this.playbackSpeed>=0?1:-1),f=this.playbackSpeed>=0?v<0:v>s;this.currentTime=Math.max(v,0),"finished"===this.state&&null===this.holdTime&&(this.currentTime=s);let b,x=this.currentTime,y=i;if(c){const t=Math.min(this.currentTime,s)/n;let e=Math.floor(t),i=t%1;!i&&t>=1&&(i=1),1===i&&e--,e=Math.min(e,c+1);Boolean(e%2)&&("reverse"===p?(i=1-i,h&&(i-=h/n)):"mirror"===p&&(y=a)),x=ft(0,1,i)*n}f?(this.delayState.value=d[0],b=this.delayState):b=y.next(x),r&&!f&&(b.value=r(b.value));let{done:_}=b;f||null===o||(_=this.playbackSpeed>=0?this.currentTime>=s:this.currentTime<=0);const w=null===this.holdTime&&("finished"===this.state||"running"===this.state&&_);return w&&u!==Mi&&(b.value=zi(d,this.options,m,this.speed)),g&&g(b.value),w&&this.finish(),b}then(t,e){return this.finished.then(t,e)}get duration(){return At(this.calculatedDuration)}get iterationDuration(){const{delay:t=0}=this.options||{};return this.duration+At(t)}get time(){return At(this.currentTime)}set time(t){t=Pt(t),this.currentTime=t,null===this.startTime||null!==this.holdTime||0===this.playbackSpeed?this.holdTime=t:this.driver&&(this.startTime=this.driver.now()-t/this.playbackSpeed),this.driver?this.driver.start(!1):(this.startTime=0,this.state="paused",this.holdTime=t,this.tick(t))}getGeneratorVelocity(){const t=this.currentTime;if(t<=0)return this.options.velocity||0;if(this.generator.velocity)return this.generator.velocity(t);return Si(t=>this.generator.next(t).value,t,this.generator.next(t).value)}get speed(){return this.playbackSpeed}set speed(t){const e=this.playbackSpeed!==t;e&&this.driver&&this.updateTime(ae.now()),this.playbackSpeed=t,e&&this.driver&&(this.time=At(this.currentTime))}play(){if(this.isStopped)return;const{driver:t=ti,startTime:e}=this.options;this.driver||(this.driver=t(t=>this.tick(t))),this.options.onPlay?.();const i=this.driver.now();"finished"===this.state?(this.updateFinished(),this.startTime=i):null!==this.holdTime?this.startTime=i-this.holdTime:this.startTime||(this.startTime=e??i),"finished"===this.state&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(ae.now()),this.holdTime=this.currentTime}complete(){"running"!==this.state&&this.play(),this.state="finished",this.holdTime=null}finish(){this.notifyFinished(),this.teardown(),this.state="finished",this.options.onComplete?.()}cancel(){this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),this.options.onCancel?.()}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(t){return this.startTime=0,this.tick(t,!0)}attachTimeline(t){return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),this.driver?.stop(),t.observe(this)}}const Ni=t=>180*t/Math.PI,Ri=t=>{const e=Ni(Math.atan2(t[1],t[0]));return Vi(e)},Bi={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:t=>(Math.abs(t[0])+Math.abs(t[3]))/2,rotate:Ri,rotateZ:Ri,skewX:t=>Ni(Math.atan(t[1])),skewY:t=>Ni(Math.atan(t[2])),skew:t=>(Math.abs(t[1])+Math.abs(t[2]))/2},Vi=t=>((t%=360)<0&&(t+=360),t),ji=t=>Math.sqrt(t[0]*t[0]+t[1]*t[1]),Gi=t=>Math.sqrt(t[4]*t[4]+t[5]*t[5]),qi={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:ji,scaleY:Gi,scale:t=>(ji(t)+Gi(t))/2,rotateX:t=>Vi(Ni(Math.atan2(t[6],t[5]))),rotateY:t=>Vi(Ni(Math.atan2(-t[2],t[0]))),rotateZ:Ri,rotate:Ri,skewX:t=>Ni(Math.atan(t[4])),skewY:t=>Ni(Math.atan(t[1])),skew:t=>(Math.abs(t[1])+Math.abs(t[4]))/2};function Ui(t){return t.includes("scale")?1:0}function Wi(t,e){if(!t||"none"===t)return Ui(e);const i=t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);let s,r;if(i)s=qi,r=i;else{const e=t.match(/^matrix\(([-\d.e\s,]+)\)$/u);s=Bi,r=e}if(!r)return Ui(e);const a=s[e],n=r[1].split(",").map(Hi);return"function"==typeof a?a(n):n[a]}function Hi(t){return parseFloat(t.trim())}const Yi=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],Xi=(()=>new Set(Yi))(),Ki=t=>t===he||t===Me,Ji=new Set(["x","y","z"]),Zi=Yi.filter(t=>!Ji.has(t));const Qi={width:({x:t},{paddingLeft:e="0",paddingRight:i="0",boxSizing:s})=>{const r=t.max-t.min;return"border-box"===s?r:r-parseFloat(e)-parseFloat(i)},height:({y:t},{paddingTop:e="0",paddingBottom:i="0",boxSizing:s})=>{const r=t.max-t.min;return"border-box"===s?r:r-parseFloat(e)-parseFloat(i)},top:(t,{top:e})=>parseFloat(e),left:(t,{left:e})=>parseFloat(e),bottom:({y:t},{top:e})=>parseFloat(e)+(t.max-t.min),right:({x:t},{left:e})=>parseFloat(e)+(t.max-t.min),x:(t,{transform:e})=>Wi(e,"x"),y:(t,{transform:e})=>Wi(e,"y")};Qi.translateX=Qi.x,Qi.translateY=Qi.y;const ts=new Set;let es=!1,is=!1,ss=!1;function rs(){if(is){const t=Array.from(ts).filter(t=>t.needsMeasurement),e=new Set(t.map(t=>t.element)),i=new Map;e.forEach(t=>{const e=function(t){const e=[];return Zi.forEach(i=>{const s=t.getValue(i);void 0!==s&&(e.push([i,s.get()]),s.set(i.startsWith("scale")?1:0))}),e}(t);e.length&&(i.set(t,e),t.render())}),t.forEach(t=>t.measureInitialState()),e.forEach(t=>{t.render();const e=i.get(t);e&&e.forEach(([e,i])=>{t.getValue(e)?.set(i)})}),t.forEach(t=>t.measureEndState()),t.forEach(t=>{void 0!==t.suspendedScrollY&&window.scrollTo(0,t.suspendedScrollY)})}is=!1,es=!1,ts.forEach(t=>t.complete(ss)),ts.clear()}function as(){ts.forEach(t=>{t.readKeyframes(),t.needsMeasurement&&(is=!0)})}class ns{constructor(t,e,i,s,r,a=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...t],this.onComplete=e,this.name=i,this.motionValue=s,this.element=r,this.isAsync=a}scheduleResolve(){this.state="scheduled",this.isAsync?(ts.add(this),es||(es=!0,te.read(as),te.resolveKeyframes(rs))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:t,name:e,element:i,motionValue:s}=this;if(null===t[0]){const r=s?.get(),a=t[t.length-1];if(void 0!==r)t[0]=r;else if(i&&e){const s=i.readValue(e,a);null!=s&&(t[0]=s)}void 0===t[0]&&(t[0]=a),s&&void 0===r&&s.set(t[0])}!function(t){for(let e=1;e<t.length;e++)t[e]??(t[e]=t[e-1])}(t)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(t=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,t),ts.delete(this)}cancel(){"scheduled"===this.state&&(ts.delete(this),this.state="pending")}resume(){"pending"===this.state&&this.scheduleResolve()}}function os(t,e,i){(t=>t.startsWith("--"))(e)?t.style.setProperty(e,i):t.style[e]=i}const ls={};function ds(t,e){const i=kt(t);return()=>ls[e]??i()}const cs=ds(()=>void 0!==window.ScrollTimeline,"scrollTimeline"),ps=ds(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch(t){return!1}return!0},"linearEasing"),hs=([t,e,i,s])=>`cubic-bezier(${t}, ${e}, ${i}, ${s})`,us={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:hs([0,.65,.55,1]),circOut:hs([.55,0,1,.45]),backIn:hs([.31,.01,.66,-.59]),backOut:hs([.33,1.53,.69,.99])};function gs(t,e){return t?"function"==typeof t?ps()?ei(t,e):"ease-out":Xt(t)?hs(t):Array.isArray(t)?t.map(t=>gs(t,e)||us.easeOut):us[t]:void 0}function ms(t,e,i,{delay:s=0,duration:r=300,repeat:a=0,repeatType:n="loop",ease:o="easeOut",times:l}={},d=void 0){const c={[e]:i};l&&(c.offset=l);const p=gs(o,r);Array.isArray(p)&&(c.easing=p);const h={delay:s,duration:r,easing:Array.isArray(p)?"linear":p,fill:"both",iterations:a+1,direction:"reverse"===n?"alternate":"normal"};d&&(h.pseudoElement=d);return t.animate(c,h)}function vs(t){return"function"==typeof t&&"applyToOptions"in t}class fs extends Ii{constructor(t){if(super(),this.finishedTime=null,this.isStopped=!1,this.manualStartTime=null,!t)return;const{element:e,name:i,keyframes:s,pseudoElement:r,allowFlatten:a=!1,finalKeyframe:n,onComplete:o}=t;this.isPseudoElement=Boolean(r),this.allowFlatten=a,this.options=t,yt("string"!=typeof t.type,'Mini animate() doesn\'t support "type" as a string.',"mini-spring");const l=function({type:t,...e}){return vs(t)&&ps()?t.applyToOptions(e):(e.duration??(e.duration=300),e.ease??(e.ease="easeOut"),e)}(t);this.animation=ms(e,i,s,l,r),!1===l.autoplay&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!r){const t=zi(s,this.options,n,this.speed);this.updateMotionValue&&this.updateMotionValue(t),os(e,i,t),this.animation.cancel()}o?.(),this.notifyFinished()}}play(){this.isStopped||(this.manualStartTime=null,this.animation.play(),"finished"===this.state&&this.updateFinished())}pause(){this.animation.pause()}complete(){this.animation.finish?.()}cancel(){try{this.animation.cancel()}catch(t){}}stop(){if(this.isStopped)return;this.isStopped=!0;const{state:t}=this;"idle"!==t&&"finished"!==t&&(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){const t=this.options?.element;!this.isPseudoElement&&t?.isConnected&&this.animation.commitStyles?.()}get duration(){const t=this.animation.effect?.getComputedTiming?.().duration||0;return At(Number(t))}get iterationDuration(){const{delay:t=0}=this.options||{};return this.duration+At(t)}get time(){return At(Number(this.animation.currentTime)||0)}set time(t){const e=null!==this.finishedTime;this.manualStartTime=null,this.finishedTime=null,this.animation.currentTime=Pt(t),e&&this.animation.pause()}get speed(){return this.animation.playbackRate}set speed(t){t<0&&(this.finishedTime=null),this.animation.playbackRate=t}get state(){return null!==this.finishedTime?"finished":this.animation.playState}get startTime(){return this.manualStartTime??Number(this.animation.startTime)}set startTime(t){this.manualStartTime=this.animation.startTime=t}attachTimeline({timeline:t,rangeStart:e,rangeEnd:i,observe:s}){return this.allowFlatten&&this.animation.effect?.updateTiming({easing:"linear"}),this.animation.onfinish=null,t&&cs()?(this.animation.timeline=t,e&&(this.animation.rangeStart=e),i&&(this.animation.rangeEnd=i),St):s(this)}}const bs={anticipate:Bt,backInOut:Rt,circInOut:Gt};function xs(t){"string"==typeof t.ease&&t.ease in bs&&(t.ease=bs[t.ease])}class ys extends fs{constructor(t){xs(t),Oi(t),super(t),void 0!==t.startTime&&!1!==t.autoplay&&(this.startTime=t.startTime),this.options=t}updateMotionValue(t){const{motionValue:e,onUpdate:i,onComplete:s,element:r,...a}=this.options;if(!e)return;if(void 0!==t)return void e.set(t);const n=new Fi({...a,autoplay:!1}),o=Math.max(10,ae.now()-this.startTime),l=ft(0,10,o-10),d=n.sample(o).value,{name:c}=this.options;r&&c&&os(r,c,d),e.setWithVelocity(n.sample(Math.max(0,o-l)).value,d,l),n.stop()}}const _s=(t,e)=>"zIndex"!==e&&(!("number"!=typeof t&&!Array.isArray(t))||!("string"!=typeof t||!Re.test(t)&&"0"!==t||t.startsWith("url(")));function ws(t){t.duration=0,t.type="keyframes"}const $s=new Set(["opacity","clipPath","filter","transform"]),ks=/^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;const Ss=new Set(["color","backgroundColor","outlineColor","fill","stroke","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"]),Ms=kt(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function Ts(t){const{motionValue:e,name:i,repeatDelay:s,repeatType:r,damping:a,type:n,keyframes:o}=t,l=e?.owner?.current;if(!(l instanceof HTMLElement))return!1;const{onUpdate:d,transformTemplate:c}=e.owner.getProps();return Ms()&&i&&($s.has(i)||Ss.has(i)&&function(t){for(let e=0;e<t.length;e++)if("string"==typeof t[e]&&ks.test(t[e]))return!0;return!1}(o))&&("transform"!==i||!c)&&!d&&!s&&"mirror"!==r&&0!==a&&"inertia"!==n}class Cs extends Ii{constructor({autoplay:t=!0,delay:e=0,type:i="keyframes",repeat:s=0,repeatDelay:r=0,repeatType:a="loop",keyframes:n,name:o,motionValue:l,element:d,...c}){super(),this.stop=()=>{this._animation&&(this._animation.stop(),this.stopTimeline?.()),this.keyframeResolver?.cancel()},this.createdAt=ae.now();const p={autoplay:t,delay:e,type:i,repeat:s,repeatDelay:r,repeatType:a,name:o,motionValue:l,element:d,...c},h=d?.KeyframeResolver||ns;this.keyframeResolver=new h(n,(t,e,i)=>this.onKeyframesResolved(t,e,p,!i),o,l,d),this.keyframeResolver?.scheduleResolve()}onKeyframesResolved(t,e,i,s){this.keyframeResolver=void 0;const{name:r,type:a,velocity:n,delay:o,isHandoff:l,onUpdate:d}=i;this.resolvedAt=ae.now();let c=!0;(function(t,e,i,s){const r=t[0];if(null===r)return!1;if("display"===e||"visibility"===e)return!0;const a=t[t.length-1],n=_s(r,e),o=_s(a,e);return xt(n===o,`You are trying to animate ${e} from "${r}" to "${a}". "${n?a:r}" is not an animatable value.`,"value-not-animatable"),!(!n||!o)&&(function(t){const e=t[0];if(1===t.length)return!0;for(let i=0;i<t.length;i++)if(t[i]!==e)return!0}(t)||("spring"===i||vs(i))&&s)})(t,r,a,n)||(c=!1,!_t.instantAnimations&&o||d?.(zi(t,i,e)),t[0]=t[t.length-1],ws(i),i.repeat=0);const p={startTime:s?this.resolvedAt&&this.resolvedAt-this.createdAt>40?this.resolvedAt:this.createdAt:void 0,finalKeyframe:e,...i,keyframes:t},h=c&&!l&&Ts(p),u=p.motionValue?.owner?.current;let g;if(h)try{g=new ys({...p,element:u})}catch{g=new Fi(p)}else g=new Fi(p);g.finished.then(()=>{this.notifyFinished()}).catch(St),this.pendingTimeline&&(this.stopTimeline=g.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=g}get finished(){return this._animation?this.animation.finished:this._finished}then(t,e){return this.finished.finally(t).then(()=>{})}get animation(){return this._animation||(this.keyframeResolver?.resume(),ss=!0,as(),rs(),ss=!1),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(t){this.animation.time=t}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(t){this.animation.speed=t}get startTime(){return this.animation.startTime}attachTimeline(t){return this._animation?this.stopTimeline=this.animation.attachTimeline(t):this.pendingTimeline=t,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){this._animation&&this.animation.cancel(),this.keyframeResolver?.cancel()}}class Es{constructor(t){this.stop=()=>this.runAll("stop"),this.animations=t.filter(Boolean)}get finished(){return Promise.all(this.animations.map(t=>t.finished))}getAll(t){return this.animations[0][t]}setAll(t,e){for(let i=0;i<this.animations.length;i++)this.animations[i][t]=e}attachTimeline(t){const e=this.animations.map(e=>e.attachTimeline(t));return()=>{e.forEach((t,e)=>{t&&t(),this.animations[e].stop()})}}get time(){return this.getAll("time")}set time(t){this.setAll("time",t)}get speed(){return this.getAll("speed")}set speed(t){this.setAll("speed",t)}get state(){return this.getAll("state")}get startTime(){return this.getAll("startTime")}get duration(){return Ps(this.animations,"duration")}get iterationDuration(){return Ps(this.animations,"iterationDuration")}runAll(t){this.animations.forEach(e=>e[t]())}play(){this.runAll("play")}pause(){this.runAll("pause")}cancel(){this.runAll("cancel")}complete(){this.runAll("complete")}}function Ps(t,e){let i=0;for(let s=0;s<t.length;s++){const r=t[s][e];null!==r&&r>i&&(i=r)}return i}class As extends Es{then(t,e){return this.finished.finally(t).then(()=>{})}}const zs=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function Ls(t,e,i=1){yt(i<=4,`Max CSS variable fallback depth detected in property "${t}". This may indicate a circular fallback dependency.`,"max-css-var-depth");const[s,r]=function(t){const e=zs.exec(t);if(!e)return[,];const[,i,s,r]=e;return[`--${i??s}`,r]}(t);if(!s)return;const a=window.getComputedStyle(e).getPropertyValue(s);if(a){const t=a.trim();return wt(t)?parseFloat(t):t}return de(r)?Ls(r,e,i+1):r}const Os={type:"spring",stiffness:500,damping:25,restSpeed:10},Is={type:"keyframes",duration:.8},Ds={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},Fs=(t,{keyframes:e})=>e.length>2?Is:Xi.has(t)?t.startsWith("scale")?{type:"spring",stiffness:550,damping:0===e[1]?2*Math.sqrt(550):30,restSpeed:10}:Os:Ds;function Ns(t,e){if(t?.inherit&&e){const{inherit:i,...s}=t;return{...e,...s}}return t}function Rs(t,e){const i=t?.[e]??t?.default??t;return i!==t?Ns(i,t):i}const Bs=new Set(["when","delay","delayChildren","staggerChildren","staggerDirection","repeat","repeatType","repeatDelay","from","elapsed"]);const Vs=(t,e,i,s={},r,a)=>n=>{const o=Rs(s,t)||{},l=o.delay||s.delay||0;let{elapsed:d=0}=s;d-=Pt(l);const c={keyframes:Array.isArray(i)?i:[null,i],ease:"easeOut",velocity:e.getVelocity(),...o,delay:-d,onUpdate:t=>{e.set(t),o.onUpdate&&o.onUpdate(t)},onComplete:()=>{n(),o.onComplete&&o.onComplete()},name:t,motionValue:e,element:a?void 0:r};(function(t){for(const e in t)if(!Bs.has(e))return!0;return!1})(o)||Object.assign(c,Fs(t,c)),c.duration&&(c.duration=Pt(c.duration)),c.repeatDelay&&(c.repeatDelay=Pt(c.repeatDelay)),void 0!==c.from&&(c.keyframes[0]=c.from);let p=!1;if((!1===c.type||0===c.duration&&!c.repeatDelay)&&(ws(c),0===c.delay&&(p=!0)),(_t.instantAnimations||_t.skipAnimations||r?.shouldSkipAnimations)&&(p=!0,ws(c),c.delay=0),c.allowFlatten=!o.type&&!o.ease,p&&!a&&void 0!==e.get()){const t=zi(c.keyframes,o);if(void 0!==t)return void te.update(()=>{c.onUpdate(t),c.onComplete()})}return o.isSync?new Fi(c):new Cs(c)};function js(t){const e=[{},{}];return t?.values.forEach((t,i)=>{e[0][i]=t.get(),e[1][i]=t.getVelocity()}),e}function Gs(t,e,i,s){if("function"==typeof e){const[r,a]=js(s);e=e(void 0!==i?i:t.custom,r,a)}if("string"==typeof e&&(e=t.variants&&t.variants[e]),"function"==typeof e){const[r,a]=js(s);e=e(void 0!==i?i:t.custom,r,a)}return e}const qs=new Set(["width","height","top","left","right","bottom",...Yi]);class Us{constructor(t,e={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=t=>{const e=ae.now();if(this.updatedAt!==e&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(t),this.current!==this.prev&&(this.events.change?.notify(this.current),this.dependents))for(const t of this.dependents)t.dirty()},this.hasAnimated=!1,this.setCurrent(t),this.owner=e.owner}setCurrent(t){var e;this.current=t,this.updatedAt=ae.now(),null===this.canTrackVelocity&&void 0!==t&&(this.canTrackVelocity=(e=this.current,!isNaN(parseFloat(e))))}setPrevFrameValue(t=this.current){this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt}onChange(t){return this.on("change",t)}on(t,e){this.events[t]||(this.events[t]=new Et);const i=this.events[t].add(e);return"change"===t?()=>{i(),te.read(()=>{this.events.change.getSize()||this.stop()})}:i}clearListeners(){for(const t in this.events)this.events[t].clear()}attach(t,e){this.passiveEffect=t,this.stopPassiveEffect=e}set(t){this.passiveEffect?this.passiveEffect(t,this.updateAndNotify):this.updateAndNotify(t)}setWithVelocity(t,e,i){this.set(e),this.prev=void 0,this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt-i}jump(t,e=!0){this.updateAndNotify(t),this.prev=t,this.prevUpdatedAt=this.prevFrameValue=void 0,e&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){this.events.change?.notify(this.current)}addDependent(t){this.dependents||(this.dependents=new Set),this.dependents.add(t)}removeDependent(t){this.dependents&&this.dependents.delete(t)}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const t=ae.now();if(!this.canTrackVelocity||void 0===this.prevFrameValue||t-this.updatedAt>30)return 0;const e=Math.min(this.updatedAt-this.prevUpdatedAt,30);return zt(parseFloat(this.current)-parseFloat(this.prevFrameValue),e)}start(t){return this.stop(),new Promise(e=>{this.hasAnimated=!0,this.animation=t(e),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.dependents?.clear(),this.events.destroy?.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function Ws(t,e){return new Us(t,e)}function Hs(t,e,i){t.hasValue(e)?t.getValue(e).set(i):t.addValue(e,Ws(i))}function Ys(t){return(t=>Array.isArray(t))(t)?t[t.length-1]||0:t}function Xs(t,e){const i=function(t,e){const i=t.getProps();return Gs(i,e,i.custom,t)}(t,e);let{transitionEnd:s={},transition:r={},...a}=i||{};a={...a,...s};for(const e in a){Hs(t,e,Ys(a[e]))}}const Ks=t=>Boolean(t&&t.getVelocity);function Js(t,e){const i=t.getValue("willChange");if(s=i,Boolean(Ks(s)&&s.add))return i.add(e);if(!i&&_t.WillChange){const i=new _t.WillChange("auto");t.addValue("willChange",i),i.add(e)}var s}function Zs(t){return t.replace(/([A-Z])/g,t=>`-${t.toLowerCase()}`)}const Qs="data-"+Zs("framerAppearId");function tr(t){return t.props[Qs]}function er({protectedKeys:t,needsAnimating:e},i){const s=t.hasOwnProperty(i)&&!0!==e[i];return e[i]=!1,s}function ir(t,e,{delay:i=0,transitionOverride:s,type:r}={}){let{transition:a,transitionEnd:n,...o}=e;const l=t.getDefaultTransition();a=a?Ns(a,l):l;const d=a?.reduceMotion;s&&(a=s);const c=[],p=r&&t.animationState&&t.animationState.getState()[r];for(const e in o){const s=t.getValue(e,t.latestValues[e]??null),r=o[e];if(void 0===r||p&&er(p,e))continue;const n={delay:i,...Rs(a||{},e)},l=s.get();if(void 0!==l&&!s.isAnimating()&&!Array.isArray(r)&&r===l&&!n.velocity){te.update(()=>s.set(r));continue}let h=!1;if(window.MotionHandoffAnimation){const i=tr(t);if(i){const t=window.MotionHandoffAnimation(i,e,te);null!==t&&(n.startTime=t,h=!0)}}Js(t,e);const u=d??t.shouldReduceMotion;s.start(Vs(e,s,r,u&&qs.has(e)?{type:!1}:n,t,h));const g=s.animation;g&&c.push(g)}if(n){const e=()=>te.update(()=>{n&&Xs(t,n)});c.length?Promise.all(c).then(e):e()}return c}const sr=t=>e=>e.test(t),rr=[he,Me,Se,ke,Ce,Te,{test:t=>"auto"===t,parse:t=>t}],ar=t=>rr.find(sr(t));function nr(t){return"number"==typeof t?0===t:null===t||("none"===t||"0"===t||$t(t))}const or=new Set(["brightness","contrast","saturate","opacity"]);function lr(t){const[e,i]=t.slice(0,-1).split("(");if("drop-shadow"===e)return t;const[s]=i.match(ve)||[];if(!s)return t;const r=i.replace(s,"");let a=or.has(e)?1:0;return s!==i&&(a*=100),e+"("+a+r+")"}const dr=/\b([a-z-]*)\(.*?\)/gu,cr={...Re,getAnimatableNone:t=>{const e=t.match(dr);return e?e.map(lr).join(" "):t}},pr={...Re,getAnimatableNone:t=>{const e=Re.parse(t);return Re.createTransformer(t)(e.map(t=>"number"==typeof t?0:"object"==typeof t?{...t,alpha:1}:t))}},hr={...he,transform:Math.round},ur={borderWidth:Me,borderTopWidth:Me,borderRightWidth:Me,borderBottomWidth:Me,borderLeftWidth:Me,borderRadius:Me,borderTopLeftRadius:Me,borderTopRightRadius:Me,borderBottomRightRadius:Me,borderBottomLeftRadius:Me,width:Me,maxWidth:Me,height:Me,maxHeight:Me,top:Me,right:Me,bottom:Me,left:Me,inset:Me,insetBlock:Me,insetBlockStart:Me,insetBlockEnd:Me,insetInline:Me,insetInlineStart:Me,insetInlineEnd:Me,padding:Me,paddingTop:Me,paddingRight:Me,paddingBottom:Me,paddingLeft:Me,paddingBlock:Me,paddingBlockStart:Me,paddingBlockEnd:Me,paddingInline:Me,paddingInlineStart:Me,paddingInlineEnd:Me,margin:Me,marginTop:Me,marginRight:Me,marginBottom:Me,marginLeft:Me,marginBlock:Me,marginBlockStart:Me,marginBlockEnd:Me,marginInline:Me,marginInlineStart:Me,marginInlineEnd:Me,fontSize:Me,backgroundPositionX:Me,backgroundPositionY:Me,...{rotate:ke,rotateX:ke,rotateY:ke,rotateZ:ke,scale:ge,scaleX:ge,scaleY:ge,scaleZ:ge,skew:ke,skewX:ke,skewY:ke,distance:Me,translateX:Me,translateY:Me,translateZ:Me,x:Me,y:Me,z:Me,perspective:Me,transformPerspective:Me,opacity:ue,originX:Ee,originY:Ee,originZ:Me},zIndex:hr,fillOpacity:ue,strokeOpacity:ue,numOctaves:hr},gr={...ur,color:Ae,backgroundColor:Ae,outlineColor:Ae,fill:Ae,stroke:Ae,borderColor:Ae,borderTopColor:Ae,borderRightColor:Ae,borderBottomColor:Ae,borderLeftColor:Ae,filter:cr,WebkitFilter:cr,mask:pr,WebkitMask:pr},mr=t=>gr[t],vr=new Set([cr,pr]);function fr(t,e){let i=mr(t);return vr.has(i)||(i=Re),i.getAnimatableNone?i.getAnimatableNone(e):void 0}const br=new Set(["auto","none","0"]);class xr extends ns{constructor(t,e,i,s,r){super(t,e,i,s,r,!0)}readKeyframes(){const{unresolvedKeyframes:t,element:e,name:i}=this;if(!e||!e.current)return;super.readKeyframes();for(let i=0;i<t.length;i++){let s=t[i];if("string"==typeof s&&(s=s.trim(),de(s))){const r=Ls(s,e.current);void 0!==r&&(t[i]=r),i===t.length-1&&(this.finalKeyframe=s)}}if(this.resolveNoneKeyframes(),!qs.has(i)||2!==t.length)return;const[s,r]=t,a=ar(s),n=ar(r);if(pe(s)!==pe(r)&&Qi[i])this.needsMeasurement=!0;else if(a!==n)if(Ki(a)&&Ki(n))for(let e=0;e<t.length;e++){const i=t[e];"string"==typeof i&&(t[e]=parseFloat(i))}else Qi[i]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){const{unresolvedKeyframes:t,name:e}=this,i=[];for(let e=0;e<t.length;e++)(null===t[e]||nr(t[e]))&&i.push(e);i.length&&function(t,e,i){let s,r=0;for(;r<t.length&&!s;){const e=t[r];"string"==typeof e&&!br.has(e)&&De(e).values.length&&(s=t[r]),r++}if(s&&i)for(const r of e)t[r]=fr(i,s)}(t,i,e)}measureInitialState(){const{element:t,unresolvedKeyframes:e,name:i}=this;if(!t||!t.current)return;"height"===i&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=Qi[i](t.measureViewportBox(),window.getComputedStyle(t.current)),e[0]=this.measuredOrigin;const s=e[e.length-1];void 0!==s&&t.getValue(i,s).jump(s,!1)}measureEndState(){const{element:t,name:e,unresolvedKeyframes:i}=this;if(!t||!t.current)return;const s=t.getValue(e);s&&s.jump(this.measuredOrigin,!1);const r=i.length-1,a=i[r];i[r]=Qi[e](t.measureViewportBox(),window.getComputedStyle(t.current)),null!==a&&void 0===this.finalKeyframe&&(this.finalKeyframe=a),this.removedTransforms?.length&&this.removedTransforms.forEach(([e,i])=>{t.getValue(e).set(i)}),this.resolveNoneKeyframes()}}const yr=(t,e)=>e&&"number"==typeof t?e.transform(t):t,{schedule:_r}=Qt(queueMicrotask,!1);function wr(t){return"object"==typeof(e=t)&&null!==e&&"ownerSVGElement"in t;var e}const $r=[...rr,Ae,Re],kr=()=>({x:{min:0,max:0},y:{min:0,max:0}}),Sr=new WeakMap;const Mr=["initial","animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"];function Tr(t){return function(t){return null!==t&&"object"==typeof t&&"function"==typeof t.start}(t.animate)||Mr.some(e=>function(t){return"string"==typeof t||Array.isArray(t)}(t[e]))}const Cr={current:null},Er={current:!1},Pr="undefined"!=typeof window;const Ar=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];let zr={};class Lr{scrapeMotionValuesFromProps(t,e,i){return{}}constructor({parent:t,props:e,presenceContext:i,reducedMotionConfig:s,skipAnimations:r,blockInitialAnimation:a,visualState:n},o={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.shouldSkipAnimations=!1,this.values=new Map,this.KeyframeResolver=ns,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.hasBeenMounted=!1,this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const t=ae.now();this.renderScheduledAt<t&&(this.renderScheduledAt=t,te.render(this.render,!1,!0))};const{latestValues:l,renderState:d}=n;this.latestValues=l,this.baseTarget={...l},this.initialValues=e.initial?{...l}:{},this.renderState=d,this.parent=t,this.props=e,this.presenceContext=i,this.depth=t?t.depth+1:0,this.reducedMotionConfig=s,this.skipAnimationsConfig=r,this.options=o,this.blockInitialAnimation=Boolean(a),this.isControllingVariants=Tr(e),this.isVariantNode=function(t){return Boolean(Tr(t)||t.variants)}(e),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=Boolean(t&&t.current);const{willChange:c,...p}=this.scrapeMotionValuesFromProps(e,{},this);for(const t in p){const e=p[t];void 0!==l[t]&&Ks(e)&&e.set(l[t])}}mount(t){if(this.hasBeenMounted)for(const t in this.initialValues)this.values.get(t)?.jump(this.initialValues[t]),this.latestValues[t]=this.initialValues[t];this.current=t,Sr.set(t,this),this.projection&&!this.projection.instance&&this.projection.mount(t),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((t,e)=>this.bindToMotionValue(e,t)),"never"===this.reducedMotionConfig?this.shouldReduceMotion=!1:"always"===this.reducedMotionConfig?this.shouldReduceMotion=!0:(Er.current||function(){if(Er.current=!0,Pr)if(window.matchMedia){const t=window.matchMedia("(prefers-reduced-motion)"),e=()=>Cr.current=t.matches;t.addEventListener("change",e),e()}else Cr.current=!1}(),this.shouldReduceMotion=Cr.current),this.shouldSkipAnimations=this.skipAnimationsConfig??!1,this.parent?.addChild(this),this.update(this.props,this.presenceContext),this.hasBeenMounted=!0}unmount(){this.projection&&this.projection.unmount(),ee(this.notifyUpdate),ee(this.render),this.valueSubscriptions.forEach(t=>t()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),this.parent?.removeChild(this);for(const t in this.events)this.events[t].clear();for(const t in this.features){const e=this.features[t];e&&(e.unmount(),e.isMounted=!1)}this.current=null}addChild(t){this.children.add(t),this.enteringChildren??(this.enteringChildren=new Set),this.enteringChildren.add(t)}removeChild(t){this.children.delete(t),this.enteringChildren&&this.enteringChildren.delete(t)}bindToMotionValue(t,e){if(this.valueSubscriptions.has(t)&&this.valueSubscriptions.get(t)(),e.accelerate&&$s.has(t)&&this.current instanceof HTMLElement){const{factory:i,keyframes:s,times:r,ease:a,duration:n}=e.accelerate,o=new fs({element:this.current,name:t,keyframes:s,times:r,ease:a,duration:Pt(n)}),l=i(o);return void this.valueSubscriptions.set(t,()=>{l(),o.cancel()})}const i=Xi.has(t);i&&this.onBindTransform&&this.onBindTransform();const s=e.on("change",e=>{this.latestValues[t]=e,this.props.onUpdate&&te.preRender(this.notifyUpdate),i&&this.projection&&(this.projection.isTransformDirty=!0),this.scheduleRender()});let r;"undefined"!=typeof window&&window.MotionCheckAppearSync&&(r=window.MotionCheckAppearSync(this,t,e)),this.valueSubscriptions.set(t,()=>{s(),r&&r(),e.owner&&e.stop()})}sortNodePosition(t){return this.current&&this.sortInstanceNodePosition&&this.type===t.type?this.sortInstanceNodePosition(this.current,t.current):0}updateFeatures(){let t="animation";for(t in zr){const e=zr[t];if(!e)continue;const{isEnabled:i,Feature:s}=e;if(!this.features[t]&&s&&i(this.props)&&(this.features[t]=new s(this)),this.features[t]){const e=this.features[t];e.isMounted?e.update():(e.mount(),e.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):{x:{min:0,max:0},y:{min:0,max:0}}}getStaticValue(t){return this.latestValues[t]}setStaticValue(t,e){this.latestValues[t]=e}update(t,e){(t.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=t,this.prevPresenceContext=this.presenceContext,this.presenceContext=e;for(let e=0;e<Ar.length;e++){const i=Ar[e];this.propEventSubscriptions[i]&&(this.propEventSubscriptions[i](),delete this.propEventSubscriptions[i]);const s=t["on"+i];s&&(this.propEventSubscriptions[i]=this.on(i,s))}this.prevMotionValues=function(t,e,i){for(const s in e){const r=e[s],a=i[s];if(Ks(r))t.addValue(s,r);else if(Ks(a))t.addValue(s,Ws(r,{owner:t}));else if(a!==r)if(t.hasValue(s)){const e=t.getValue(s);!0===e.liveStyle?e.jump(r):e.hasAnimated||e.set(r)}else{const e=t.getStaticValue(s);t.addValue(s,Ws(void 0!==e?e:r,{owner:t}))}}for(const s in i)void 0===e[s]&&t.removeValue(s);return e}(this,this.scrapeMotionValuesFromProps(t,this.prevProps||{},this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(t){return this.props.variants?this.props.variants[t]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(t){const e=this.getClosestVariantNode();if(e)return e.variantChildren&&e.variantChildren.add(t),()=>e.variantChildren.delete(t)}addValue(t,e){const i=this.values.get(t);e!==i&&(i&&this.removeValue(t),this.bindToMotionValue(t,e),this.values.set(t,e),this.latestValues[t]=e.get())}removeValue(t){this.values.delete(t);const e=this.valueSubscriptions.get(t);e&&(e(),this.valueSubscriptions.delete(t)),delete this.latestValues[t],this.removeValueFromRenderState(t,this.renderState)}hasValue(t){return this.values.has(t)}getValue(t,e){if(this.props.values&&this.props.values[t])return this.props.values[t];let i=this.values.get(t);return void 0===i&&void 0!==e&&(i=Ws(null===e?void 0:e,{owner:this}),this.addValue(t,i)),i}readValue(t,e){let i=void 0===this.latestValues[t]&&this.current?this.getBaseTargetFromProps(this.props,t)??this.readValueFromInstance(this.current,t,this.options):this.latestValues[t];return null!=i&&("string"==typeof i&&(wt(i)||$t(i))?i=parseFloat(i):!(t=>$r.find(sr(t)))(i)&&Re.test(e)&&(i=fr(t,e)),this.setBaseTarget(t,Ks(i)?i.get():i)),Ks(i)?i.get():i}setBaseTarget(t,e){this.baseTarget[t]=e}getBaseTarget(t){const{initial:e}=this.props;let i;if("string"==typeof e||"object"==typeof e){const s=Gs(this.props,e,this.presenceContext?.custom);s&&(i=s[t])}if(e&&void 0!==i)return i;const s=this.getBaseTargetFromProps(this.props,t);return void 0===s||Ks(s)?void 0!==this.initialValues[t]&&void 0===i?void 0:this.baseTarget[t]:s}on(t,e){return this.events[t]||(this.events[t]=new Et),this.events[t].add(e)}notify(t,...e){this.events[t]&&this.events[t].notify(...e)}scheduleRenderMicrotask(){_r.render(this.render)}}class Or extends Lr{constructor(){super(...arguments),this.KeyframeResolver=xr}sortInstanceNodePosition(t,e){return 2&t.compareDocumentPosition(e)?1:-1}getBaseTargetFromProps(t,e){const i=t.style;return i?i[e]:void 0}removeValueFromRenderState(t,{vars:e,style:i}){delete e[t],delete i[t]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:t}=this.props;Ks(t)&&(this.childSubscription=t.on("change",t=>{this.current&&(this.current.textContent=`${t}`)}))}}const Ir={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},Dr=Yi.length;function Fr(t,e,i){const{style:s,vars:r,transformOrigin:a}=t;let n=!1,o=!1;for(const t in e){const i=e[t];if(Xi.has(t))n=!0;else if(oe(t))r[t]=i;else{const e=yr(i,ur[t]);t.startsWith("origin")?(o=!0,a[t]=e):s[t]=e}}if(e.transform||(n||i?s.transform=function(t,e,i){let s="",r=!0;for(let a=0;a<Dr;a++){const n=Yi[a],o=t[n];if(void 0===o)continue;let l=!0;if("number"==typeof o)l=o===(n.startsWith("scale")?1:0);else{const t=parseFloat(o);l=n.startsWith("scale")?1===t:0===t}if(!l||i){const t=yr(o,ur[n]);l||(r=!1,s+=`${Ir[n]||n}(${t}) `),i&&(e[n]=t)}}return s=s.trim(),i?s=i(e,r?"":s):r&&(s="none"),s}(e,t.transform,i):s.transform&&(s.transform="none")),o){const{originX:t="50%",originY:e="50%",originZ:i=0}=a;s.transformOrigin=`${t} ${e} ${i}`}}function Nr(t,{style:e,vars:i},s,r){const a=t.style;let n;for(n in e)a[n]=e[n];for(n in r?.applyProjectionStyles(a,s),i)a.setProperty(n,i[n])}function Rr(t,e){return e.max===e.min?0:t/(e.max-e.min)*100}const Br={correct:(t,e)=>{if(!e.target)return t;if("string"==typeof t){if(!Me.test(t))return t;t=parseFloat(t)}return`${Rr(t,e.target.x)}% ${Rr(t,e.target.y)}%`}},Vr={correct:(t,{treeScale:e,projectionDelta:i})=>{const s=t,r=Re.parse(t);if(r.length>5)return s;const a=Re.createTransformer(t),n="number"!=typeof r[0]?1:0,o=i.x.scale*e.x,l=i.y.scale*e.y;r[0+n]/=o,r[1+n]/=l;const d=je(o,l,.5);return"number"==typeof r[2+n]&&(r[2+n]/=d),"number"==typeof r[3+n]&&(r[3+n]/=d),a(r)}},jr={borderRadius:{...Br,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:Br,borderTopRightRadius:Br,borderBottomLeftRadius:Br,borderBottomRightRadius:Br,boxShadow:Vr};function Gr(t,{layout:e,layoutId:i}){return Xi.has(t)||t.startsWith("origin")||(e||void 0!==i)&&(!!jr[t]||"opacity"===t)}function qr(t,e,i){const s=t.style,r=e?.style,a={};if(!s)return a;for(const e in s)(Ks(s[e])||r&&Ks(r[e])||Gr(e,t)||void 0!==i?.getValue(e)?.liveStyle)&&(a[e]=s[e]);return a}class Ur extends Or{constructor(){super(...arguments),this.type="html",this.renderInstance=Nr}readValueFromInstance(t,e){if(Xi.has(e))return this.projection?.isProjecting?Ui(e):((t,e)=>{const{transform:i="none"}=getComputedStyle(t);return Wi(i,e)})(t,e);{const s=(i=t,window.getComputedStyle(i)),r=(oe(e)?s.getPropertyValue(e):s[e])||0;return"string"==typeof r?r.trim():r}var i}measureInstanceViewportBox(t,{transformPagePoint:e}){return function(t,e){return function({top:t,left:e,right:i,bottom:s}){return{x:{min:e,max:i},y:{min:t,max:s}}}(function(t,e){if(!e)return t;const i=e({x:t.left,y:t.top}),s=e({x:t.right,y:t.bottom});return{top:i.y,left:i.x,bottom:s.y,right:s.x}}(t.getBoundingClientRect(),e))}(t,e)}build(t,e,i){Fr(t,e,i.transformTemplate)}scrapeMotionValuesFromProps(t,e,i){return qr(t,e,i)}}class Wr extends Lr{constructor(){super(...arguments),this.type="object"}readValueFromInstance(t,e){if(function(t,e){return t in e}(e,t)){const i=t[e];if("string"==typeof i||"number"==typeof i)return i}}getBaseTargetFromProps(){}removeValueFromRenderState(t,e){delete e.output[t]}measureInstanceViewportBox(){return{x:{min:0,max:0},y:{min:0,max:0}}}build(t,e){Object.assign(t.output,e)}renderInstance(t,{output:e}){Object.assign(t,e)}sortInstanceNodePosition(){return 0}}const Hr={offset:"stroke-dashoffset",array:"stroke-dasharray"},Yr={offset:"strokeDashoffset",array:"strokeDasharray"};const Xr=["offsetDistance","offsetPath","offsetRotate","offsetAnchor"];function Kr(t,{attrX:e,attrY:i,attrScale:s,pathLength:r,pathSpacing:a=1,pathOffset:n=0,...o},l,d,c){if(Fr(t,o,d),l)return void(t.style.viewBox&&(t.attrs.viewBox=t.style.viewBox));t.attrs=t.style,t.style={};const{attrs:p,style:h}=t;p.transform&&(h.transform=p.transform,delete p.transform),(h.transform||p.transformOrigin)&&(h.transformOrigin=p.transformOrigin??"50% 50%",delete p.transformOrigin),h.transform&&(h.transformBox=c?.transformBox??"fill-box",delete p.transformBox);for(const t of Xr)void 0!==p[t]&&(h[t]=p[t],delete p[t]);void 0!==e&&(p.x=e),void 0!==i&&(p.y=i),void 0!==s&&(p.scale=s),void 0!==r&&function(t,e,i=1,s=0,r=!0){t.pathLength=1;const a=r?Hr:Yr;t[a.offset]=""+-s,t[a.array]=`${e} ${i}`}(p,r,a,n,!1)}const Jr=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]);class Zr extends Or{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=kr}getBaseTargetFromProps(t,e){return t[e]}readValueFromInstance(t,e){if(Xi.has(e)){const t=mr(e);return t&&t.default||0}return e=Jr.has(e)?e:Zs(e),t.getAttribute(e)}scrapeMotionValuesFromProps(t,e,i){return function(t,e,i){const s=qr(t,e,i);for(const i in t)(Ks(t[i])||Ks(e[i]))&&(s[-1!==Yi.indexOf(i)?"attr"+i.charAt(0).toUpperCase()+i.substring(1):i]=t[i]);return s}(t,e,i)}build(t,e,i){Kr(t,e,this.isSVGTag,i.transformTemplate,i.style)}renderInstance(t,e,i,s){!function(t,e,i,s){Nr(t,e,void 0,s);for(const i in e.attrs)t.setAttribute(Jr.has(i)?i:Zs(i),e.attrs[i])}(t,e,0,s)}mount(t){var e;this.isSVGTag="string"==typeof(e=t.tagName)&&"svg"===e.toLowerCase(),super.mount(t)}}function Qr(t){return"object"==typeof t&&!Array.isArray(t)}function ta(t,e,i,s){return null==t?[]:"string"==typeof t&&Qr(e)?function(t,e,i){if(null==t)return[];if(t instanceof EventTarget)return[t];if("string"==typeof t){let s=document;e&&(s=e.current);const r=i?.[t]??s.querySelectorAll(t);return r?Array.from(r):[]}return Array.from(t).filter(t=>null!=t)}(t,i,s):t instanceof NodeList?Array.from(t):Array.isArray(t)?t.filter(t=>null!=t):[t]}function ea(t,e,i){return t*(e+1)}function ia(t,e,i,s){return"number"==typeof e?e:e.startsWith("-")||e.startsWith("+")?Math.max(0,t+parseFloat(e)):"<"===e?i:e.startsWith("<")?Math.max(0,i+parseFloat(e.slice(1))):s.get(e)??t}function sa(t,e,i,s,r,a){!function(t,e,i){for(let s=0;s<t.length;s++){const r=t[s];r.at>e&&r.at<i&&(vt(t,r),s--)}}(t,r,a);for(let n=0;n<e.length;n++)t.push({value:e[n],at:je(r,a,s[n]),easing:Yt(i,n)})}function ra(t,e){for(let i=0;i<t.length;i++)t[i]=t[i]/(e+1)}function aa(t,e){return t.at===e.at?null===t.value?1:null===e.value?-1:0:t.at-e.at}function na(t,e){return!e.has(t)&&e.set(t,{}),e.get(t)}function oa(t,e){return e[t]||(e[t]=[]),e[t]}function la(t){return Array.isArray(t)?t:[t]}function da(t,e){return t&&t[e]?{...t,...t[e]}:{...t}}const ca=t=>"number"==typeof t,pa=t=>t.every(ca);function ha(t){const e={presenceContext:null,props:{},visualState:{renderState:{transform:{},transformOrigin:{},style:{},vars:{},attrs:{}},latestValues:{}}},i=wr(t)&&!function(t){return wr(t)&&"svg"===t.tagName}(t)?new Zr(e):new Ur(e);i.mount(t),Sr.set(t,i)}function ua(t){const e=new Wr({presenceContext:null,props:{},visualState:{renderState:{output:{}},latestValues:{}}});e.mount(t),Sr.set(t,e)}function ga(t,e,i,s){const r=[];if(function(t,e){return Ks(t)||"number"==typeof t||"string"==typeof t&&!Qr(e)}(t,e))r.push(function(t,e,i){const s=Ks(t)?t:Ws(t);return s.start(Vs("",s,e,i)),s.animation}(t,Qr(e)&&e.default||e,i&&i.default||i));else{if(null==t)return r;const a=ta(t,e,s),n=a.length;yt(Boolean(n),"No valid elements provided.","no-valid-elements");for(let t=0;t<n;t++){const s=a[t],o=s instanceof Element?ha:ua;Sr.has(s)||o(s);const l=Sr.get(s),d={...i};"delay"in d&&"function"==typeof d.delay&&(d.delay=d.delay(t,n)),r.push(...ir(l,{...e,transition:d},{}))}}return r}function ma(t,e,i){const s=[],r=function(t,{defaultTransition:e={},...i}={},s,r){const a=e.duration||.3,n=new Map,o=new Map,l={},d=new Map;let c=0,p=0,h=0;for(let i=0;i<t.length;i++){const n=t[i];if("string"==typeof n){d.set(n,p);continue}if(!Array.isArray(n)){d.set(n.name,ia(p,n.at,c,d));continue}let[u,g,m={}]=n;void 0!==m.at&&(p=ia(p,m.at,c,d));let v=0;const f=(t,i,s,n=0,o=0)=>{const l=la(t),{delay:d=0,times:c=Ei(l),type:u=e.type||"keyframes",repeat:g,repeatType:m,repeatDelay:f=0,...b}=i;let{ease:x=e.ease||"easeOut",duration:y}=i;const _="function"==typeof d?d(n,o):d,w=l.length,$=vs(u)?u:r?.[u||"keyframes"];if(w<=2&&$){let t=100;if(2===w&&pa(l)){const e=l[1]-l[0];t=Math.abs(e)}const i={...e,...b};void 0!==y&&(i.duration=Pt(y));const s=ri(i,t,$);x=s.ease,y=s.duration}y??(y=a);const k=p+_;1===c.length&&0===c[0]&&(c[1]=1);const S=c.length-l.length;if(S>0&&Ci(c,S),1===l.length&&l.unshift(null),g){yt(g<20,"Repeat count too high, must be less than 20","repeat-count-high"),y=ea(y,g);const t=[...l],e=[...c];x=Array.isArray(x)?[...x]:[x];const i=[...x];for(let s=0;s<g;s++){l.push(...t);for(let r=0;r<t.length;r++)c.push(e[r]+(s+1)),x.push(0===r?"linear":Yt(i,r-1))}ra(c,g)}const M=k+y;sa(s,l,x,c,k,M),v=Math.max(_+y,v),h=Math.max(M,h)};if(Ks(u))f(g,m,oa("default",na(u,o)));else{const t=ta(u,g,s,l),e=t.length;for(let i=0;i<e;i++){const s=na(t[i],o);for(const t in g)f(g[t],da(m,t),oa(t,s),i,e)}}c=p,p+=v}return o.forEach((t,s)=>{for(const r in t){const a=t[r];a.sort(aa);const o=[],l=[],d=[];for(let t=0;t<a.length;t++){const{at:e,value:i,easing:s}=a[t];o.push(i),l.push(Ct(0,h,e)),d.push(s||"easeOut")}0!==l[0]&&(l.unshift(0),o.unshift(o[0]),d.unshift("easeInOut")),1!==l[l.length-1]&&(l.push(1),o.push(null)),n.has(s)||n.set(s,{keyframes:{},transition:{}});const c=n.get(s);c.keyframes[r]=o;const{type:p,...u}=e;c.transition[r]={...u,duration:h,ease:d,times:l,...i}}}),n}(t.map(t=>{if(Array.isArray(t)&&"function"==typeof t[0]){const e=t[0],i=Ws(0);return i.on("change",e),1===t.length?[i,[0,1]]:2===t.length?[i,[0,1],t[1]]:[i,t[1],t[2]]}return t}),e,i,{spring:ki});return r.forEach(({keyframes:t,transition:e},i)=>{s.push(...ga(i,t,e))}),s}const va=function(t={}){const{scope:e,reduceMotion:i}=t;return function(t,s,r){let a,n=[];if(o=t,Array.isArray(o)&&o.some(Array.isArray)){const{onComplete:r,...o}=s||{};"function"==typeof r&&(a=r),n=ma(t,void 0!==i?{reduceMotion:i,...o}:o,e)}else{const{onComplete:o,...l}=r||{};"function"==typeof o&&(a=o),n=ga(t,s,void 0!==i?{reduceMotion:i,...l}:l,e)}var o;const l=new As(n);return a&&l.finished.then(a),e&&(e.animations.push(l),l.finished.then(()=>{vt(e.animations,l)})),l}}();class fa{constructor(t){this.host=t,t.addController(this),this.dragging=!1,this.itemId=null,this.w=1,this.h=1,this.previewCol=0,this.previewRow=0,this._tileEl=null,this._ghostEl=null,this._offsetX=0,this._offsetY=0,this._gridRect=null,this._gridPadLeft=16,this._gridPadTop=12,this._scrollEl=null,this._scrollRAF=null,this._pointerId=null,this._pending=!1,this._startX=0,this._startY=0,this._dragThreshold=8,this._onPointerMove=this._onPointerMove.bind(this),this._onPointerUp=this._onPointerUp.bind(this)}hostConnected(){}hostDisconnected(){this._cleanup()}start(t){if(t.target.closest("button, input, select, .resize-btn"))return!1;const e=t.target.closest(".grid-tile");if(!e)return!1;const i=e.dataset.tileId;if(!i)return!1;t.preventDefault();const s=this.host.shadowRoot.querySelector(".unified-grid");if(!s)return!1;const r=e.getBoundingClientRect();return this._pending=!0,this._startX=t.clientX,this._startY=t.clientY,this.itemId=i,this.w=parseInt(e.dataset.tileW,10)||1,this.h=parseInt(e.dataset.tileH,10)||1,this._tileEl=e,this._scrollEl=s,this._pointerId=t.pointerId,this._offsetX=t.clientX-r.left,this._offsetY=t.clientY-r.top,s.setPointerCapture(t.pointerId),s.addEventListener("pointermove",this._onPointerMove),s.addEventListener("pointerup",this._onPointerUp),s.addEventListener("pointercancel",this._onPointerUp),!0}_beginDrag(){this._pending=!1,this.dragging=!0;const t=this._scrollEl,e=this._tileEl;if(!t||!e)return;const i=e.getBoundingClientRect();this._gridRect=t.getBoundingClientRect(),this.previewCol=parseInt(e.dataset.tileCol,10)||0,this.previewRow=parseInt(e.dataset.tileRow,10)||0,this._createGhost(e,i),e.style.opacity="0",e.style.pointerEvents="none",this.host.requestUpdate()}_onPointerMove(t){if(this._pending){const e=t.clientX-this._startX,i=t.clientY-this._startY;if(!(Math.sqrt(e*e+i*i)>=this._dragThreshold))return;this._beginDrag()}if(!this.dragging)return;this._ghostEl&&(this._ghostEl.style.left=t.clientX-this._offsetX+"px",this._ghostEl.style.top=t.clientY-this._offsetY+"px");const e=this.host._gridCellW||80,i=this.host._gridGap||12,s=this._scrollEl,r=s?.scrollTop||0,a=s?.getBoundingClientRect()??this._gridRect,n=t.clientX-this._offsetX,o=t.clientY-this._offsetY,l=n-a.left-this._gridPadLeft,d=o-a.top-this._gridPadTop+r,c=Math.max(0,Math.min(this.host._gridCols-this.w,Math.round(l/(e+i)))),p=Math.max(0,Math.round(d/(e+i)));c===this.previewCol&&p===this.previewRow||(this.previewCol=c,this.previewRow=p,this.host.onTileDragMove(this.itemId,c,p)),this._autoScroll(t)}_onPointerUp(t){if(this._pending)return this._pending=!1,this.host.onTileTap&&this.host.onTileTap(this.itemId),void this._cleanup();this.dragging&&(this.host.onTileDragEnd(this.itemId,this.previewCol,this.previewRow),this._cleanup(),this.host.requestUpdate())}_createGhost(t,e){const i=t.cloneNode(!0);i.classList.add("drag-ghost"),i.style.cssText=`\n      position: fixed;\n      left: ${e.left}px;\n      top: ${e.top}px;\n      width: ${e.width}px;\n      height: ${e.height}px;\n      z-index: 10000;\n      opacity: 0.85;\n      pointer-events: none;\n      box-shadow: 0 8px 30px rgba(0,0,0,0.5);\n      border-radius: 16px;\n      transition: none;\n      animation: none;\n    `,this.host.shadowRoot.appendChild(i),this._ghostEl=i}_autoScroll(t){this._scrollRAF&&cancelAnimationFrame(this._scrollRAF);const e=this._scrollEl;if(!e)return;const i=e.getBoundingClientRect(),s=40;let r=0;if(t.clientY>i.bottom-s?r=(t.clientY-(i.bottom-s))/s*10:t.clientY<i.top+s&&(r=(i.top+s-t.clientY)/s*-10),Math.abs(r)>.5){const t=()=>{e.scrollTop+=r,this._gridRect=e.getBoundingClientRect(),this.dragging&&(this._scrollRAF=requestAnimationFrame(t))};this._scrollRAF=requestAnimationFrame(t)}}_cleanup(){this._pending=!1,this._scrollRAF&&(cancelAnimationFrame(this._scrollRAF),this._scrollRAF=null),this._ghostEl&&(this._ghostEl.remove(),this._ghostEl=null),this._tileEl&&(this._tileEl.style.opacity="",this._tileEl.style.pointerEvents="",this._tileEl=null);const t=this.host.shadowRoot?.querySelector(".unified-grid");if(t&&null!=this._pointerId){try{t.releasePointerCapture(this._pointerId)}catch(t){}t.removeEventListener("pointermove",this._onPointerMove),t.removeEventListener("pointerup",this._onPointerUp),t.removeEventListener("pointercancel",this._onPointerUp)}this.dragging=!1,this.itemId=null,this._pointerId=null}}function ba(t,e){const i=[];for(const[s,r]of Object.entries(t))for(let t=r.row;t<r.row+r.h;t++){i[t]||(i[t]=new Array(e).fill(null));for(let a=r.col;a<r.col+r.w;a++)a<e&&(i[t][a]=s)}return i}function xa(t,e,i,s,r,a){if(e+s>a||e<0)return!1;for(let a=i;a<i+r;a++)for(let i=e;i<e+s;i++)if(null!=t[a]?.[i])return!1;return!0}function ya(t,e,i,s,r,a,n){for(let o=i;o<i+r;o++){t[o]||(t[o]=new Array(n).fill(null));for(let i=e;i<e+s;i++)i<n&&(t[o][i]=a)}}function _a(t,e,i,s){for(let r=0;r<200;r++)for(let a=0;a<=e-i;a++)if(xa(t,a,r,i,s,e))return{col:a,row:r};return{col:0,row:0}}function wa(t,e,i){const s={},r=[];for(const a of t){if("spacer"===a.type)continue;const{w:t,h:n}=i(a),o=_a(r,e,t,n);s[a.id]={col:o.col,row:o.row,w:t,h:n},ya(r,o.col,o.row,t,n,a.id,e)}return s}function $a(t,e){return!(t.col+t.w<=e.col||e.col+e.w<=t.col||t.row+t.h<=e.row||e.row+e.h<=t.row)}function ka(t,e){const i=t[e],s=[];for(const[r,a]of Object.entries(t))r!==e&&$a(i,a)&&s.push(r);return s}function Sa(t,e,i,s,r){const a={};for(const[e,i]of Object.entries(t))a[e]={...i};const n=a[e];if(!n)return a;i=Math.max(0,Math.min(r-n.w,i)),s=Math.max(0,s),n.col=i,n.row=s;for(let t=0;t<50;t++){const i=ka(a,e);if(0===i.length)break;for(const e of i){const i=a[e],s=n.col+n.w;if(s+i.w<=r){const t={col:i.col,row:i.row};i.col=s;if(0===ka(a,e).length)continue;i.col=t.col,i.row=t.row}const o=n.col-i.w;if(o>=0){const t={col:i.col,row:i.row};i.col=o;if(0===ka(a,e).length)continue;i.col=t.col,i.row=t.row}i.row=n.row+n.h,Ma(a,e,50-t)}}return a}function Ma(t,e,i){for(let s=0;s<i;s++){const i=ka(t,e);if(0===i.length)return;let s=0;for(const e of i){const i=t[e];s=Math.max(s,i.row+i.h)}t[e].row=s}}function Ta(t,e,i,s){const r={},a=[],n=new Map(e.filter(t=>"spacer"!==t.type).map(t=>[t.id,t]));for(const e of t){if(null==e)continue;const t=n.get(e);if(!t)continue;const{w:o,h:l}=s(t),d=_a(a,i,o,l);r[e]={col:d.col,row:d.row,w:o,h:l},ya(a,d.col,d.row,o,l,e,i),n.delete(e)}for(const[t,e]of n){const{w:n,h:o}=s(e),l=_a(a,i,n,o);r[t]={col:l.col,row:l.row,w:n,h:o},ya(a,l.col,l.row,n,o,t,i)}return r}const Ca=[{name:"Warm",r:255,g:180,b:107},{name:"Cool",r:200,g:220,b:255},{name:"White",r:255,g:255,b:255},{name:"Red",r:255,g:50,b:50},{name:"Blue",r:50,g:100,b:255},{name:"Green",r:50,g:200,b:80}],Ea=[{keyword:"water",label:"Water",icon:"mdi:water",color:"#2196F3",warnBelow:25},{keyword:"gas",label:"Gas",icon:"mdi:gas-cylinder",color:"#FF9800",warnBelow:20},{keyword:"waste",label:"Waste",icon:"mdi:delete-empty",color:"#78909C",warnAbove:75}];function Pa(t,e,i){return"#"+[t,e,i].map(t=>t.toString(16).padStart(2,"0")).join("")}const Aa=a`
  .toggle {
    width: 44px;
    height: 26px;
    border-radius: 13px;
    background: var(--disabled-color, #bdbdbd);
    position: relative;
    flex-shrink: 0;
    transition: background 0.25s;
  }

  .toggle.on {
    background: var(--primary-color, #03a9f4);
  }

  .toggle-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    position: absolute;
    top: 3px;
    left: 3px;
    transition: transform 0.25s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .toggle.on .toggle-dot {
    transform: translateX(18px);
  }

  .tile-edit-icon {
    --mdc-icon-size: 18px;
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }

  .br-slider {
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    border-radius: 3px;
    outline: none;
  }

  .br-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--sc, var(--primary-color));
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  }

  .br-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--sc, var(--primary-color));
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  }

  .editable {
    cursor: pointer;
    border-color: color-mix(in srgb, var(--primary-color) 40%, transparent) !important;
    border-style: dashed !important;
  }

  .editable:hover {
    border-color: var(--primary-color) !important;
  }
`;customElements.define("smartvanio-select",class extends nt{static get properties(){return{value:{type:String},options:{type:Array},placeholder:{type:String},variant:{type:String},disabled:{type:Boolean}}}constructor(){super(),this.value="",this.options=[],this.placeholder=void 0,this.variant="default"}_onChange(t){this.dispatchEvent(new CustomEvent("smartvanio-change",{detail:{value:t.target.value},bubbles:!0,composed:!0}))}_option(t){return j`<option value="${t.value}" ?selected=${this.value===t.value}>${t.label}</option>`}render(){return j`
      <div class="wrap ${this.variant??"default"}">
        <select .value=${this.value??""} ?disabled=${this.disabled} @change=${this._onChange}>
          ${void 0!==this.placeholder?j`<option value="" ?selected=${!this.value}>${this.placeholder}</option>`:""}
          ${(this.options??[]).map(t=>void 0!==t.groupLabel?j`<optgroup label="${t.groupLabel}">${(t.options??[]).map(t=>this._option(t))}</optgroup>`:this._option(t))}
        </select>
      </div>
    `}static get styles(){return a`
      :host { display: block; min-width: 0; }

      .wrap {
        position: relative;
        display: block;
      }

      /* custom chevron */
      .wrap::after {
        content: "";
        pointer-events: none;
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 5px solid var(--secondary-text-color, #888);
      }
      .wrap.add::after {
        border-top-color: var(--primary-color, #03a9f4);
      }

      select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 100%;
        padding: 9px 32px 9px 12px;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 8px;
        background: var(--secondary-background-color, #f5f5f5);
        color: var(--primary-text-color);
        font-size: 14px;
        font-family: inherit;
        outline: none;
        cursor: pointer;
        transition: border-color 0.2s;
        box-sizing: border-box;
      }
      select:focus {
        border-color: var(--primary-color);
      }
      select:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .wrap.add select {
        border-style: dashed;
        border-color: var(--primary-color, #03a9f4);
        background: color-mix(in srgb, var(--primary-color) 6%, var(--card-background-color, #fff));
        color: var(--primary-color);
        font-weight: 500;
      }
      .wrap.add select:focus {
        border-style: solid;
      }
    `}});customElements.define("smartvanio-entity-picker",class extends nt{static get properties(){return{hass:{type:Object},value:{type:String},domains:{type:Array},excludeDomains:{type:Array},excludeEntities:{type:Array},pinnedEntity:{type:String,attribute:"pinned-entity"},placeholder:{type:String},_open:{type:Boolean},_search:{type:String}}}constructor(){super(),this.hass=null,this.value="",this.domains=[],this.excludeDomains=[],this.excludeEntities=[],this.pinnedEntity="",this.placeholder="Select entity",this._open=!1,this._search="",this._onKeydown=t=>{"Escape"===t.key&&this._open&&this._close()}}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKeydown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKeydown)}updated(t){t.has("_open")&&this._open&&requestAnimationFrame(()=>{this.shadowRoot?.querySelector(".ep-search")?.focus()})}_getEntities(){if(!this.hass?.states)return[];const t=this.domains??[],e=new Set(this.excludeDomains??[]),i=new Set(this.excludeEntities??[]);return Object.entries(this.hass.states).filter(([s])=>{if(i.has(s))return!1;const r=s.split(".")[0];return!e.has(r)&&(0===t.length||t.includes(r))}).map(([t,e])=>{const i=e.attributes?.friendly_name??t.split(".").pop().replace(/_/g," ");return{eid:t,name:i,icon:e.attributes?.icon||this._domainIcon(t),val:e.state,unit:e.attributes?.unit_of_measurement??""}}).sort((t,e)=>t.name.localeCompare(e.name))}_domainIcon(t){return{sensor:"mdi:eye",binary_sensor:"mdi:checkbox-blank-circle-outline",switch:"mdi:toggle-switch",light:"mdi:lightbulb",fan:"mdi:fan",button:"mdi:gesture-tap-button",script:"mdi:script-text",input_boolean:"mdi:toggle-switch-outline",number:"mdi:numeric",scene:"mdi:palette",select:"mdi:form-select"}[t.split(".")[0]]??"mdi:puzzle"}_filtered(){const t=this._getEntities();if(!this._search)return t;const e=this._search.toLowerCase();return t.filter(t=>t.name.toLowerCase().includes(e)||t.eid.toLowerCase().includes(e))}_select(t){this._open=!1,this._search="",this.dispatchEvent(new CustomEvent("smartvanio-change",{detail:{value:t},bubbles:!0,composed:!0}))}_clear(t){t.stopPropagation(),this._select("")}_formatVal(t,e){if("unavailable"===t||"unknown"===t)return t;const i=parseFloat(t);if(!isNaN(i)){const s=Number.isInteger(i)?t:i.toFixed(1);return e?`${s} ${e}`:s}return t}_open_(){this._open=!0,this._search=""}_close(){this._open=!1,this._search=""}_onOverlayClick(t){t.target===t.currentTarget&&this._close()}render(){const t=this.value?this.hass?.states?.[this.value]:null,e=t?.attributes?.friendly_name??(this.value?this.value.split(".").pop().replace(/_/g," "):""),i=t?.attributes?.icon||(this.value?this._domainIcon(this.value):""),s=t?this._formatVal(t.state,t.attributes?.unit_of_measurement):"";return j`
      <div class="picker">
        <div class="selected" @click=${()=>this._open_()}>
          ${this.value?j`
            <ha-icon class="sel-icon" icon="${i}" style="--mdc-icon-size:18px"></ha-icon>
            <span class="sel-name">${e}</span>
            <span class="sel-val">${s}</span>
            <button class="sel-clear" @click=${this._clear}>✕</button>
          `:j`
            <span class="sel-placeholder">${this.placeholder}</span>
          `}
          <span class="chevron"></span>
        </div>
        ${this._open?this._renderSheet():""}
      </div>
    `}_renderSheet(){const t=this.pinnedEntity&&this.hass?.states?.[this.pinnedEntity],e=t?this.hass.states[this.pinnedEntity]:null,i=e?.attributes?.friendly_name??(t?this.pinnedEntity.split(".").pop().replace(/_/g," "):""),s=e?.attributes?.icon||(t?this._domainIcon(this.pinnedEntity):""),r=this._filtered().filter(t=>t.eid!==this.pinnedEntity);return j`
      <div class="ep-overlay" @click=${this._onOverlayClick}>
        <div class="ep-sheet" @click=${t=>t.stopPropagation()}>
          <div class="ep-header">
            <span class="ep-title">${this.placeholder??"Select entity"}</span>
            <button class="ep-close" @click=${()=>this._close()} aria-label="Close">
              <ha-icon icon="mdi:close" style="--mdc-icon-size:22px"></ha-icon>
            </button>
          </div>
          <input class="ep-search" type="search"
            inputmode="search" enterkeyhint="search" autocomplete="off"
            placeholder="Search entities..."
            .value=${this._search}
            @input=${t=>{this._search=t.target.value}} />
          <div class="ep-list">
            ${t?j`
              <div class="option pinned ${this.pinnedEntity===this.value?"active":""}"
                   @click=${()=>this._select(this.pinnedEntity)}>
                <ha-icon class="opt-icon" icon="${s}" style="--mdc-icon-size:22px"></ha-icon>
                <div class="opt-info">
                  <span class="opt-name">${i}</span>
                  <span class="opt-eid">${this.pinnedEntity}</span>
                </div>
                <span class="pinned-badge">this entity</span>
              </div>
              <div class="pinned-divider"></div>
            `:""}
            ${r.map(t=>j`
              <div class="option ${t.eid===this.value?"active":""}"
                   @click=${()=>this._select(t.eid)}>
                <ha-icon class="opt-icon" icon="${t.icon}" style="--mdc-icon-size:22px"></ha-icon>
                <div class="opt-info">
                  <span class="opt-name">${t.name}</span>
                  <span class="opt-eid">${t.eid}</span>
                </div>
                <span class="opt-val">${this._formatVal(t.val,t.unit)}</span>
              </div>
            `)}
            ${0!==r.length||t?"":j`
              <div class="no-results">No entities found</div>
            `}
          </div>
        </div>
      </div>
    `}static get styles(){return a`
      :host { display: block; min-width: 0; }

      .picker { position: relative; }

      .selected {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border: 1px solid var(--sv-border, rgba(255,255,255,0.08));
        border-radius: 8px;
        background: var(--sv-bg-surface, #16161E);
        cursor: pointer;
        min-height: 20px;
        transition: border-color 0.2s;
      }
      .selected:hover { border-color: var(--sv-accent, #4a9eff); }

      .sel-icon { color: var(--sv-text-secondary, #888); flex-shrink: 0; }
      .sel-name { flex: 1; font-size: 13px; color: var(--sv-text-primary, #fff); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .sel-val  { font-size: 12px; color: var(--sv-accent, #4a9eff); flex-shrink: 0; }
      .sel-placeholder { flex: 1; font-size: 13px; color: var(--sv-text-secondary, #888); }
      .sel-clear {
        background: none; border: none; color: var(--sv-text-secondary, #888);
        cursor: pointer; font-size: 12px; padding: 2px 4px; line-height: 1;
      }
      .sel-clear:hover { color: var(--sv-red, #ff5252); }

      .chevron {
        flex-shrink: 0;
        width: 0; height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 5px solid var(--sv-text-secondary, #888);
      }

      /* ── Picker sheet (full-screen modal) ───────────────────── */

      .ep-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        z-index: 10000;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        animation: ep-fade-in 0.18s ease-out;
      }

      @keyframes ep-fade-in {
        from { background: rgba(0, 0, 0, 0); }
        to   { background: rgba(0, 0, 0, 0.55); }
      }

      .ep-sheet {
        background: var(--sv-bg-overlay, #161B22);
        border: 1px solid var(--sv-border, rgba(255,255,255,0.08));
        border-radius: 0 0 18px 18px;
        width: min(640px, 100%);
        max-height: 92dvh;
        display: flex;
        flex-direction: column;
        padding: 14px;
        gap: 12px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.6);
        animation: ep-slide-down 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      }

      @keyframes ep-slide-down {
        from { transform: translateY(-20px); opacity: 0; }
        to   { transform: translateY(0);     opacity: 1; }
      }

      .ep-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 2px 4px;
      }
      .ep-title {
        font-size: 17px;
        font-weight: 600;
        color: var(--sv-text-primary, #fff);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .ep-close {
        width: 44px;
        height: 44px;
        flex-shrink: 0;
        background: var(--sv-bg-elevated, #1E1E2A);
        border: 1px solid var(--sv-border, rgba(255,255,255,0.08));
        border-radius: 22px;
        color: var(--sv-text-secondary, #888);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s, color 0.15s;
      }
      .ep-close:hover { background: var(--sv-border, #2A2A38); color: var(--sv-text-primary, #fff); }
      .ep-close:active { background: var(--sv-bg-input, #212830); }

      .ep-search {
        width: 100%;
        font-size: 16px;        /* >=16px prevents iOS Safari auto-zoom on focus */
        font-family: inherit;
        padding: 14px 16px;
        border: 1px solid var(--sv-border, rgba(255,255,255,0.08));
        border-radius: 12px;
        background: var(--sv-bg-input, #212830);
        color: var(--sv-text-primary, #fff);
        outline: none;
        box-sizing: border-box;
        transition: border-color 0.15s;
      }
      .ep-search:focus { border-color: var(--sv-accent, #4a9eff); }
      .ep-search::placeholder { color: var(--sv-text-secondary, #888); }

      .ep-list {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        touch-action: pan-y;
        margin: 0 -4px;
        padding: 0 4px 4px;
      }
      .ep-list::-webkit-scrollbar { width: 4px; }
      .ep-list::-webkit-scrollbar-thumb { background: var(--sv-border, #333); border-radius: 2px; }

      .option {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        cursor: pointer;
        border-radius: 10px;
        transition: background 0.1s;
        touch-action: manipulation;
      }
      .option:hover { background: var(--sv-bg-surface, #16161E); }
      .option:active { background: var(--sv-bg-elevated, #1E1E2A); }
      .option.active { background: color-mix(in srgb, var(--sv-accent, #4a9eff) 14%, transparent); }

      .opt-icon { color: var(--sv-text-secondary, #888); flex-shrink: 0; }
      .opt-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .opt-name { font-size: 15px; color: var(--sv-text-primary, #fff); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .opt-eid  { font-size: 11px; color: var(--sv-text-secondary, #666); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .opt-val  { font-size: 13px; color: var(--sv-accent, #4a9eff); flex-shrink: 0; white-space: nowrap; }

      .option.pinned {
        background: color-mix(in srgb, var(--sv-accent, #4a9eff) 8%, transparent);
      }
      .option.pinned:hover {
        background: color-mix(in srgb, var(--sv-accent, #4a9eff) 16%, transparent);
      }

      .pinned-badge {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--sv-accent, #4a9eff);
        background: color-mix(in srgb, var(--sv-accent, #4a9eff) 18%, transparent);
        padding: 3px 7px;
        border-radius: 5px;
        flex-shrink: 0;
      }

      .pinned-divider {
        height: 1px;
        background: var(--sv-border, rgba(255,255,255,0.08));
        margin: 6px 4px;
      }

      .no-results {
        padding: 24px 16px;
        text-align: center;
        color: var(--sv-text-secondary, #888);
        font-size: 14px;
      }
    `}});const za=["mdi:thermometer","mdi:temperature-celsius","mdi:snowflake-thermometer","mdi:water","mdi:water-percent","mdi:water-pump","mdi:water-thermometer","mdi:gauge","mdi:gauge-low","mdi:gauge-full","mdi:speedometer","mdi:battery","mdi:battery-50","mdi:battery-charging","mdi:battery-heart","mdi:lightning-bolt","mdi:flash","mdi:power-plug","mdi:power","mdi:solar-power","mdi:solar-panel","mdi:white-balance-sunny","mdi:weather-sunny","mdi:current-ac","mdi:current-dc","mdi:sine-wave","mdi:meter-electric","mdi:meter-gas","mdi:counter","mdi:fuel","mdi:gas-station","mdi:propane-tank","mdi:lightbulb","mdi:lightbulb-outline","mdi:lightbulb-group","mdi:led-strip","mdi:led-strip-variant","mdi:ceiling-light","mdi:lamp","mdi:floor-lamp","mdi:desk-lamp","mdi:wall-sconce","mdi:toggle-switch","mdi:toggle-switch-off","mdi:electric-switch-closed","mdi:fan","mdi:fan-off","mdi:hvac","mdi:air-conditioner","mdi:snowflake","mdi:fire","mdi:radiator","mdi:heat-wave","mdi:coolant-temperature","mdi:home","mdi:home-thermometer","mdi:home-lightning-bolt","mdi:car","mdi:car-battery","mdi:car-electric","mdi:rv-truck","mdi:caravan","mdi:bus","mdi:signal","mdi:wifi","mdi:bluetooth","mdi:motion-sensor","mdi:door-open","mdi:door-closed","mdi:window-open","mdi:window-closed","mdi:lock","mdi:lock-open","mdi:shield","mdi:camera","mdi:cctv","mdi:eye","mdi:clock","mdi:timer","mdi:timer-sand","mdi:calendar","mdi:bell","mdi:alert","mdi:alert-circle","mdi:check-circle","mdi:close-circle","mdi:information","mdi:map-marker","mdi:compass","mdi:navigation","mdi:speedometer","mdi:chart-line","mdi:chart-bar","mdi:pulse","mdi:heart-pulse","mdi:wave","mdi:volume-high","mdi:volume-off","mdi:speaker","mdi:music","mdi:radio","mdi:television","mdi:fridge","mdi:stove","mdi:microwave","mdi:washing-machine","mdi:dishwasher","mdi:shower","mdi:toilet","mdi:faucet","mdi:trash-can","mdi:recycle","mdi:delete-empty","mdi:leaf","mdi:flower","mdi:tree","mdi:cloud","mdi:weather-cloudy","mdi:weather-rainy","mdi:umbrella","mdi:weather-windy","mdi:earth","mdi:terrain","mdi:waves","mdi:rope","mdi:hook","mdi:wrench","mdi:hammer","mdi:cog","mdi:tune","mdi:tools","mdi:arrow-up","mdi:arrow-down","mdi:arrow-left","mdi:arrow-right","mdi:swap-vertical","mdi:swap-horizontal","mdi:upload","mdi:download","mdi:sync","mdi:plus","mdi:minus","mdi:close","mdi:magnify","mdi:filter","mdi:star","mdi:heart","mdi:thumb-up","mdi:account","mdi:account-group","mdi:help-circle","mdi:puzzle","mdi:tag","mdi:label","mdi:bookmark","mdi:flag","mdi:pin","mdi:link","mdi:attachment","mdi:folder","mdi:file","mdi:file-document","mdi:image","mdi:video","mdi:microphone","mdi:printer","mdi:cellphone","mdi:laptop","mdi:server","mdi:database","mdi:chip","mdi:usb","mdi:ethernet","mdi:access-point","mdi:smoke-detector","mdi:fire-extinguisher","mdi:medical-bag","mdi:pill","mdi:bed","mdi:sofa","mdi:table-furniture","mdi:scale-bathroom","mdi:weight","mdi:ruler","mdi:tape-measure","mdi:inclinometer","mdi:angle-acute","mdi:gas-cylinder","mdi:barrel"];customElements.define("smartvanio-icon-picker",class extends nt{static get properties(){return{value:{type:String},placeholder:{type:String},_open:{type:Boolean},_search:{type:String}}}constructor(){super(),this.value="",this.placeholder="Choose icon",this._open=!1,this._search="",this._onDocClick=t=>{this._open&&(t.composedPath().includes(this)||(this._open=!1))}}connectedCallback(){super.connectedCallback(),document.addEventListener("pointerdown",this._onDocClick,!0)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._onDocClick,!0)}_filtered(){if(!this._search)return za;const t=this._search.toLowerCase().replace("mdi:","");return za.filter(e=>e.toLowerCase().includes(t))}_select(t){this._open=!1,this._search="",this.dispatchEvent(new CustomEvent("smartvanio-change",{detail:{value:t},bubbles:!0,composed:!0}))}_clear(t){t.stopPropagation(),this._select("")}_shortName(t){return t.replace("mdi:","").replace(/-/g," ")}render(){return j`
      <div class="picker">
        <div class="selected" @click=${()=>{this._open=!this._open,this._search=""}}>
          ${this.value?j`
            <ha-icon class="sel-icon" icon="${this.value}" style="--mdc-icon-size:18px"></ha-icon>
            <span class="sel-name">${this._shortName(this.value)}</span>
            <button class="sel-clear" @click=${this._clear}>&times;</button>
          `:j`
            <span class="sel-placeholder">${this.placeholder}</span>
          `}
          <span class="chevron"></span>
        </div>
        ${this._open?j`
          <div class="dropdown">
            <input class="search" type="text" placeholder="Search icons..."
              .value=${this._search}
              @input=${t=>{this._search=t.target.value}}
              @click=${t=>t.stopPropagation()} />
            <div class="grid">
              ${this._filtered().map(t=>j`
                <div class="icon-cell ${t===this.value?"active":""}"
                     title="${this._shortName(t)}"
                     @click=${()=>this._select(t)}>
                  <ha-icon icon="${t}" style="--mdc-icon-size:22px"></ha-icon>
                  <span class="icon-label">${this._shortName(t)}</span>
                </div>
              `)}
              ${0===this._filtered().length?j`
                <div class="no-results">
                  No matches
                  ${this._search.startsWith("mdi:")?j`
                    <button class="use-custom" @click=${()=>this._select(this._search)}>
                      Use "${this._search}"
                    </button>
                  `:""}
                </div>
              `:""}
            </div>
          </div>
        `:""}
      </div>
    `}static get styles(){return a`
      :host { display: block; width: 100%; }

      .picker { position: relative; width: 100%; }

      .selected {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border: 1px solid var(--sv-border, rgba(255,255,255,0.08));
        border-radius: 8px;
        background: var(--sv-bg-surface, #16161E);
        cursor: pointer;
        min-height: 20px;
        transition: border-color 0.2s;
      }
      .selected:hover { border-color: var(--sv-accent, #4a9eff); }

      .sel-icon { color: var(--sv-accent, #4a9eff); flex-shrink: 0; }
      .sel-name { flex: 1; font-size: 13px; color: var(--sv-text-primary, #fff); }
      .sel-placeholder { flex: 1; font-size: 13px; color: var(--sv-text-secondary, #888); }
      .sel-clear {
        background: none; border: none; color: var(--sv-text-secondary, #888);
        cursor: pointer; font-size: 14px; padding: 2px 4px; line-height: 1;
      }
      .sel-clear:hover { color: var(--sv-red, #ff5252); }

      .chevron {
        flex-shrink: 0;
        width: 0; height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 5px solid var(--sv-text-secondary, #888);
      }

      .dropdown {
        position: absolute;
        top: calc(100% + 4px);
        left: 0; right: 0;
        z-index: 200;
        background: var(--sv-bg-elevated, #1E1E2A);
        border: 1px solid var(--sv-border, rgba(255,255,255,0.08));
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        overflow: hidden;
      }

      .search {
        width: 100%;
        padding: 10px 12px;
        border: none;
        border-bottom: 1px solid var(--sv-border, rgba(255,255,255,0.08));
        background: transparent;
        color: var(--sv-text-primary, #fff);
        font-size: 13px;
        font-family: inherit;
        outline: none;
        box-sizing: border-box;
      }
      .search::placeholder { color: var(--sv-text-secondary, #888); }

      .grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2px;
        max-height: 240px;
        overflow-y: auto;
        padding: 4px;
      }
      .grid::-webkit-scrollbar { width: 4px; }
      .grid::-webkit-scrollbar-thumb { background: var(--sv-border, #333); border-radius: 2px; }

      .icon-cell {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        padding: 8px 4px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.1s;
        color: var(--sv-text-secondary, #888);
      }
      .icon-cell:hover {
        background: var(--sv-bg-surface, #16161E);
        color: var(--sv-text-primary, #fff);
      }
      .icon-cell.active {
        background: color-mix(in srgb, var(--sv-accent, #4a9eff) 15%, transparent);
        color: var(--sv-accent, #4a9eff);
      }

      .icon-label {
        font-size: 9px;
        text-align: center;
        line-height: 1.1;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .no-results {
        grid-column: 1 / -1;
        padding: 16px;
        text-align: center;
        color: var(--sv-text-secondary, #888);
        font-size: 13px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;
      }

      .use-custom {
        background: var(--sv-bg-surface, #16161E);
        border: 1px solid var(--sv-border);
        border-radius: 6px;
        color: var(--sv-accent, #4a9eff);
        padding: 6px 12px;
        cursor: pointer;
        font-size: 12px;
      }
      .use-custom:hover { border-color: var(--sv-accent); }
    `}});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const La=(t,e)=>{const i=t._$AN;if(void 0===i)return!1;for(const t of i)t._$AO?.(e,!1),La(t,e);return!0},Oa=t=>{let e,i;do{if(void 0===(e=t._$AM))break;i=e._$AN,i.delete(t),t=e}while(0===i?.size)},Ia=t=>{for(let e;e=t._$AM;t=e){let i=e._$AN;if(void 0===i)e._$AN=i=new Set;else if(i.has(t))break;i.add(t),Na(e)}};function Da(t){void 0!==this._$AN?(Oa(this),this._$AM=t,Ia(this)):this._$AM=t}function Fa(t,e=!1,i=0){const s=this._$AH,r=this._$AN;if(void 0!==r&&0!==r.size)if(e)if(Array.isArray(s))for(let t=i;t<s.length;t++)La(s[t],!1),Oa(s[t]);else null!=s&&(La(s,!1),Oa(s));else La(this,t)}const Na=t=>{t.type==dt&&(t._$AP??=Fa,t._$AQ??=Da)};class Ra extends ut{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,i){super._$AT(t,e,i),Ia(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(La(this,t),Oa(this))}setValue(t){if(gt(this._$Ct))this._$Ct._$AI(t,this);else{const e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}const Ba=new WeakMap,Va=ht(class extends Ra{render(t){return q}update(t,[e]){const i=e!==this.G;return i&&void 0!==this.G&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=e,this.ht=t.options?.host,this.rt(this.ct=t.element)),q}rt(t){if(this.isConnected||(t=void 0),"function"==typeof this.G){const e=this.ht??globalThis;let i=Ba.get(e);void 0===i&&(i=new WeakMap,Ba.set(e,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,t),void 0!==t&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return"function"==typeof this.G?Ba.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});customElements.define("smartvanio-modal-edit",class extends nt{static get properties(){return{hass:{type:Object},entityId:{type:String,attribute:"entity-id"},deviceId:{type:String,attribute:"device-id"},editName:{type:String,attribute:"edit-name"},editArea:{type:String,attribute:"edit-area"},_areaPickerOpen:{type:Boolean,state:!0},_areaFilter:{type:String,state:!0},_selectedSegIdx:{type:Number,state:!0},_dragRemoveIdx:{type:Number,state:!0},_ledTab:{type:String,state:!0},_rightTab:{type:String,state:!0},_modalView:{type:String,state:!0},lightPatterns:{type:Object},entityPatterns:{type:Object},activePattern:{type:String,attribute:"active-pattern"},_patternStops:{type:Array,state:!0},_editingPatternName:{type:String,state:!0},_selectedStopIdx:{type:Number,state:!0},editRows:{type:Array},editSaving:{type:Boolean,attribute:"edit-saving"},editLoading:{type:Boolean,attribute:"edit-loading"},calPoints:{type:Array},calKind:{type:String,attribute:"cal-kind"},lightSegments:{type:Array},maxLeds:{type:Number,attribute:"max-leds"},expandedSegColor:{type:String,attribute:"expanded-seg-color"},saveError:{type:String,attribute:"save-error"},isButton:{type:Boolean,attribute:"is-button"},isSwitch:{type:Boolean,attribute:"is-switch"},switchMode:{type:Object},isTank:{type:Boolean,attribute:"is-tank"},isLight:{type:Boolean,attribute:"is-light"},isSensor:{type:Boolean,attribute:"is-sensor"},targetEntities:{type:Array},sourceEntities:{type:Array}}}constructor(){super(),this.editRows=[],this.lightSegments=[],this.lightPatterns={},this.entityPatterns={},this.activePattern=null,this._patternStops=null,this._editingPatternName="",this._selectedStopIdx=null,this._ledTab="segments",this._rightTab=null,this._modalView=null,this.maxLeds=0,this.switchMode=null,this.calPoints=null,this.calKind="linear",this.targetEntities=[],this.sourceEntities=[],this._presetColors=[[255,180,107],[255,100,100],[100,200,255],[100,255,130]]}updated(t){super.updated(t),t.has("entityId")&&void 0!==t.get("entityId")&&(this._modalView=null,this._wheelDrawn=!1)}_rgbToWheelPos(t,e){if(!t)return null;const[i,s,r]=t.map(t=>t/255),a=Math.max(i,s,r),n=a-Math.min(i,s,r);if(0===a)return null;let o;o=0===n?0:a===i?((s-r)/n+6)%6*60:a===s?60*((r-i)/n+2):60*((i-s)/n+4);const l=n/a,d=e/2,c=d-4,p=o*Math.PI/180,h=l*c;return{x:d+Math.cos(p)*h,y:d+Math.sin(p)*h}}_onWheelRef(t){t&&!t._wheelDrawn&&(this._drawColorWheel(t),t._wheelDrawn=!0)}_drawColorWheel(t){if(!t)return;const e=t.getContext("2d"),i=t.width/2,s=t.height/2,r=i-4;e.clearRect(0,0,t.width,t.height);for(let t=0;t<360;t+=1){const a=(t-1)*Math.PI/180,n=(t+1)*Math.PI/180,o=e.createRadialGradient(i,s,0,i,s,r),[l,d,c]=this._hsvToRgb(t,1,1);o.addColorStop(0,"#fff"),o.addColorStop(1,`rgb(${l},${d},${c})`),e.beginPath(),e.moveTo(i,s),e.arc(i,s,r,a,n),e.closePath(),e.fillStyle=o,e.fill()}}_hsvToRgb(t,e,i){const s=i*e,r=s*(1-Math.abs(t/60%2-1)),a=i-s;let n,o,l;return t<60?(n=s,o=r,l=0):t<120?(n=r,o=s,l=0):t<180?(n=0,o=s,l=r):t<240?(n=0,o=r,l=s):t<300?(n=r,o=0,l=s):(n=s,o=0,l=r),[Math.round(255*(n+a)),Math.round(255*(o+a)),Math.round(255*(l+a))]}_ctrlBriPick(t,e){if(e&&(t.target.setPointerCapture(t.pointerId),this._briDragging=!0),!t.buttons&&!e)return;t.stopPropagation();const i=t.currentTarget.getBoundingClientRect(),s=Math.max(20,Math.min(t.clientX-i.left,i.width-20)),r=Math.round((s-20)/(i.width-40)*100);this._localBri=r,this.requestUpdate();const a=Date.now();(!this._lastBriEmit||a-this._lastBriEmit>80)&&(this._lastBriEmit=a,this._emit("smartvanio-light-brightness",{brightness:r}))}_ctrlBriRelease(t){t.target.releasePointerCapture(t.pointerId),this._briDragging=!1,null!=this._localBri&&this._emit("smartvanio-light-brightness",{brightness:this._localBri}),setTimeout(()=>{this._localBri=null,this.requestUpdate()},500)}_ctrlColorPick(t,e){if(e&&(t.target.setPointerCapture(t.pointerId),this._colorDragging=!0),!t.buttons&&!e)return;t.stopPropagation();const i=t.currentTarget,s=i.getBoundingClientRect(),r=i.width/s.width,a=i.width/2,n=i.height/2,o=a-4,l=(t.clientX-s.left)*r-a,d=(t.clientY-s.top)*r-n,c=Math.sqrt(l*l+d*d);if(c>o+8)return;const p=(180*Math.atan2(d,l)/Math.PI+360)%360,h=Math.min(c/o,1),[u,g,m]=this._hsvToRgb(p,h,1);this._localRgb=[u,g,m],this.requestUpdate();const v=Date.now();(!this._lastColorEmit||v-this._lastColorEmit>80)&&(this._lastColorEmit=v,this._emit("smartvanio-light-color",{rgb:[u,g,m]}))}_ctrlColorRelease(t){t.target.releasePointerCapture(t.pointerId),this._colorDragging=!1,this._localRgb&&this._emit("smartvanio-light-color",{rgb:[...this._localRgb]}),setTimeout(()=>{this._localRgb=null,this.requestUpdate()},500)}_patternGradientCSS(t){if(!t?.length)return"";const e=[...t].sort((t,e)=>t.pos-e.pos),i=e[e.length-1].pos||1,s=e.map(t=>{const e=(t.brightness??100)/100;return`rgb(${Math.round(t.r*e)},${Math.round(t.g*e)},${Math.round(t.b*e)}) ${(t.pos/i*100).toFixed(1)}%`});return`linear-gradient(to right, ${s.join(", ")})`}_renderControlView(){const t=this.entityId,e=this.hass?.states?.[t],i="on"===e?.state,s=e?.attributes??{},r=null!=s.brightness?Math.round(s.brightness/255*100):i?100:0,a=this._localBri??r,n=s.rgb_color,o=(s.supported_color_modes??[]).some(t=>["rgb","hs","xy","rgbw","rgbww"].includes(t)),l=this.entityPatterns??{},d=Object.keys(l);let c=null;this.activePattern?.startsWith(t+":")&&(c=this.activePattern.slice(t.length+1));const p=c?l[c]:null,h=p?this._patternGradientCSS(p):null,u=this._localRgb||n,g=u?`rgb(${u.join(",")})`:"var(--primary-color)";return j`
      <div class="ctrl-view">
        <div class="ctrl-power-row">
          <div class="ctrl-status">
            <ha-icon icon="mdi:lightbulb${i?"":"-outline"}"
              style="--mdc-icon-size:24px; color:${i&&u?`rgb(${u.join(",")})`:i?"var(--primary-color)":"var(--secondary-text-color)"}"></ha-icon>
            <span class="ctrl-status-text">${i?`${a}%`:"Off"}</span>
          </div>
          <button class="ctrl-power-btn ${i?"on":""}"
            @click=${()=>this._emit("smartvanio-light-toggle")}>
            <ha-icon icon="mdi:power" style="--mdc-icon-size:22px"></ha-icon>
          </button>
        </div>

        <div class="ctrl-bri-bar" style="--bri:${a}; --bri-color:${g}"
          @pointerdown=${t=>this._ctrlBriPick(t,!0)}
          @pointermove=${t=>this._ctrlBriPick(t,!1)}
          @pointerup=${t=>this._ctrlBriRelease(t)}>
          <div class="ctrl-bri-track"><div class="ctrl-bri-fill" style="${h?`background:${h}; width:100%; opacity:0.35`:""}"></div></div>
          <div class="ctrl-bri-thumb" style="${h?"background:none; border-color:rgba(255,255,255,0.8)":""}"></div>
        </div>

        ${o?(()=>{const t=this._localRgb||n,e=this._rgbToWheelPos(t,200);return j`
          <div class="ctrl-wheel-wrap">
            <canvas class="ctrl-color-wheel" width="200" height="200"
              ${Va(t=>{t&&this._onWheelRef(t)})}
              @pointerdown=${t=>this._ctrlColorPick(t,!0)}
              @pointermove=${t=>this._ctrlColorPick(t,!1)}
              @pointerup=${t=>this._ctrlColorRelease(t)}></canvas>
            ${e?j`<div class="ctrl-wheel-indicator" style="left:${e.x}px;top:${e.y}px;background:rgb(${t.join(",")})"></div>`:""}
          </div>
          <div class="ctrl-presets">
            ${this._presetColors.map(([t,e,i])=>j`
              <span class="ctrl-swatch" style="background:rgb(${t},${e},${i})"
                @click=${()=>this._emit("smartvanio-light-color",{rgb:[t,e,i]})}></span>
            `)}
          </div>
          `})():""}
        ${d.length?j`
          <div class="ctrl-patterns">
            ${d.map(e=>j`
              <div class="ctrl-pattern-chip ${this.activePattern===`${t}:${e}`?"active":""}"
                title="${e}"
                @click=${()=>this._emit("smartvanio-light-pattern",{name:e,stops:l[e]})}>
                <div class="ctrl-pattern-gradient" style="background:${this._patternGradientCSS(l[e])}"></div>
                <span class="ctrl-pattern-name">${e}</span>
              </div>
            `)}
          </div>
        `:""}
      </div>
    `}_renderAreaPicker(){const t=Object.values(this.hass?.areas??{}).sort((t,e)=>t.name.localeCompare(e.name)),e=this.editArea||"",i=this._areaPickerOpen,s=(this._areaFilter??"").toLowerCase(),r=s?t.filter(t=>t.name.toLowerCase().includes(s)):t;return j`
      <div class="area-picker">
        <button class="area-picker-btn" @click=${()=>{this._areaPickerOpen=!i,this._areaFilter=""}}>
          ${e?j`<ha-icon icon="mdi:map-marker" style="--mdc-icon-size:16px; color:var(--primary-color)"></ha-icon><span>${e}</span>`:j`<span class="area-picker-placeholder">Select area…</span>`}
          <ha-icon icon="mdi:chevron-${i?"up":"down"}" style="--mdc-icon-size:18px; margin-left:auto; opacity:0.5"></ha-icon>
        </button>
        ${i?j`
          <div class="area-picker-overlay"
            @click=${t=>{t.target===t.currentTarget&&(this._areaPickerOpen=!1)}}>
            <div class="area-picker-sheet" @click=${t=>t.stopPropagation()}>
              <div class="area-picker-sheet-header">
                <span class="area-picker-sheet-title">Select area</span>
                <button class="area-picker-sheet-close" @click=${()=>{this._areaPickerOpen=!1}} aria-label="Close">
                  <ha-icon icon="mdi:close" style="--mdc-icon-size:22px"></ha-icon>
                </button>
              </div>
              <input class="area-picker-search" type="search"
                inputmode="search" enterkeyhint="search" autocomplete="off"
                placeholder="Search areas…"
                .value=${this._areaFilter??""}
                @input=${t=>{this._areaFilter=t.target.value}}
              />
              <div class="area-picker-list">
                ${e?j`
                  <div class="area-picker-item clear" @click=${()=>{this._emit("smartvanio-update-edit-area",{value:""}),this._areaPickerOpen=!1}}>
                    <ha-icon icon="mdi:close" style="--mdc-icon-size:18px"></ha-icon><span>Clear selection</span>
                  </div>
                `:""}
                ${r.map(t=>j`
                  <div class="area-picker-item ${t.name===e?"selected":""}"
                    @click=${()=>{this._emit("smartvanio-update-edit-area",{value:t.name}),this._areaPickerOpen=!1}}>
                    <ha-icon icon="${t.icon||"mdi:map-marker"}" style="--mdc-icon-size:20px"></ha-icon>
                    <span>${t.name}</span>
                  </div>
                `)}
                ${r.length?"":j`<div class="area-picker-empty">No areas found</div>`}
              </div>
            </div>
          </div>
        `:""}
      </div>
    `}updated(t){super.updated?.(t),t.has("_areaPickerOpen")&&this._areaPickerOpen&&requestAnimationFrame(()=>{this.shadowRoot?.querySelector(".area-picker-search")?.focus()})}_emit(t,e={}){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}_renderCalibrationSection(){const t=this.entityId+"_voltage",e=parseFloat(this.hass?.states[t]?.state??0),i=this.calPoints??[];return j`
      <div class="modal-section">
        <div class="modal-section-header">
          <span class="modal-label">Calibration</span>
          <span class="cal-live">Live: ${e.toFixed(3)} V</span>
        </div>
        <div class="cal-header-row">
          <span class="cal-col-hdr">Voltage (V)</span>
          <span class="cal-col-hdr">Level (%)</span>
          <span></span><span></span>
        </div>
        ${i.map((t,e)=>j`
            <div class="cal-row">
              <input
                type="number"
                class="cal-input"
                min="0"
                max="3.3"
                step="0.001"
                .value=${String(t[0])}
                @change=${t=>this._emit("smartvanio-update-cal-point",{index:e,field:0,value:t.target.value})}
              />
              <input
                type="number"
                class="cal-input"
                min="0"
                max="100"
                step="1"
                .value=${String(t[1])}
                @change=${t=>this._emit("smartvanio-update-cal-point",{index:e,field:1,value:t.target.value})}
              />
              <button
                class="capture-btn"
                title="Capture current voltage"
                @click=${()=>this._emit("smartvanio-capture-voltage",{index:e})}
              >
                <ha-icon icon="mdi:crosshairs-gps"></ha-icon>
              </button>
              <button
                class="delete-row-btn"
                @click=${()=>this._emit("smartvanio-remove-cal-point",{index:e})}
              >
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
          `)}
        <button class="add-row-btn" @click=${()=>this._emit("smartvanio-add-cal-point")}>
          <ha-icon icon="mdi:plus"></ha-icon> Add Point
        </button>
      </div>
      <div class="modal-section">
        <label class="modal-label">Interpolation Type</label>
        <smartvanio-select
          .value=${this.calKind}
          .options=${[{value:"linear",label:"Linear"},{value:"cubic",label:"Cubic"},{value:"quadratic",label:"Quadratic"},{value:"slinear",label:"Smooth Linear"}]}
          @smartvanio-change=${t=>this._emit("smartvanio-update-cal-point",{field:"kind",value:t.detail.value})}
        ></smartvanio-select>
      </div>
    `}_renderLightSegmentsSection(){const t=this.lightSegments??[],e=this.maxLeds||100,i=this._selectedSegIdx,s=null!=i&&t[i]?t[i]:null;return j`
      <div class="modal-section">
        <div class="modal-section-header">
          <span class="modal-label">LED Strip</span>
          <div class="seg-max-wrap">
            <span class="seg-max-label">LEDs:</span>
            <input type="number" class="seg-max-input" min="1" step="1"
              .value=${String(e)}
              @change=${t=>this._emit("smartvanio-update-segment",{id:"__maxLeds__",field:"maxLeds",value:Math.max(1,+t.target.value)})} />
          </div>
        </div>

        <!-- Visual strip -->
        <div class="strip-wrap">
          <div class="strip-bar"
            @click=${i=>this._onStripClick(i,t,e)}>
            ${t.map((s,r)=>{const a=s.start/e*100,n=(s.end-s.start+1)/e*100;return j`
                <div class="strip-seg ${i===r?"selected":""} ${this._dragRemoveIdx===r?"drag-removing":""}"
                  style="left:${a}%;width:${n}%;background:rgba(${s.r},${s.g},${s.b},${(s.brightness??100)/100})"
                  @click=${t=>{if(t.stopPropagation(),this._segLpFired)return void(this._segLpFired=!1);this._selectedSegIdx=r,this.requestUpdate();const e=t.currentTarget.querySelector(".strip-seg-color");e&&e.click()}}
                  @pointerdown=${t=>{t.target.closest(".strip-handle")||(this._segLpFired=!1,this._segLpTimer=setTimeout(()=>{this._segLpTimer=null,this._segLpFired=!0,this._startSegDragRemove(t,r)},400))}}
                  @pointerup=${()=>{this._segLpTimer&&(clearTimeout(this._segLpTimer),this._segLpTimer=null)}}
                  @pointerleave=${()=>{this._segLpTimer&&(clearTimeout(this._segLpTimer),this._segLpTimer=null)}}>
                  <span class="strip-seg-label">${s.name||`${s.start}-${s.end}`}</span>
                  <input type="color" class="strip-seg-color"
                    .value=${Pa(s.r,s.g,s.b)}
                    @click=${t=>t.stopPropagation()}
                    @input=${t=>{t.stopPropagation(),this._emitSegUpdate(r,"color",t.target.value)}} />
                  <!-- Left drag handle -->
                  <div class="strip-handle strip-handle-l"
                    @pointerdown=${i=>this._onHandleDrag(i,r,"start",t,e)}></div>
                  <!-- Right drag handle -->
                  <div class="strip-handle strip-handle-r"
                    @pointerdown=${i=>this._onHandleDrag(i,r,"end",t,e)}></div>
                </div>
              `})}
            <!-- LED markers -->
            ${e<=120?j`<div class="strip-ticks">
              ${[0,Math.floor(e/4),Math.floor(e/2),Math.floor(3*e/4),e-1].map(t=>j`
                <span class="strip-tick" style="left:${t/e*100}%">${t}</span>
              `)}
            </div>`:""}
          </div>
        </div>

        <!-- Selected segment detail -->
        ${s?j`
          <div class="seg-detail">
            <div class="seg-detail-row">
              <input type="text" class="modal-input seg-name-input" placeholder="Segment name"
                .value=${s.name}
                @input=${t=>this._emitSegUpdate(i,"name",t.target.value)} />
              <button class="delete-row-btn" @click=${()=>{this._selectedSegIdx=null,this._emit("smartvanio-remove-segment",{id:s.id??i})}}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
          </div>
        `:j`
          <div class="seg-hint">${t.length?"Tap a segment to edit, or tap empty space to add":"Tap the strip to add your first segment"}</div>
        `}

        <!-- Segment list -->
        ${t.length?j`
          <div class="seg-list">
            ${t.map((t,e)=>j`
              <div class="seg-list-item ${i===e?"active":""}" @click=${()=>{this._selectedSegIdx=e,this.requestUpdate()}}>
                <label class="seg-list-swatch-label">
                  <span class="seg-list-swatch" style="background:rgb(${t.r},${t.g},${t.b})"></span>
                  <input type="color" class="seg-list-color-input"
                    .value=${Pa(t.r,t.g,t.b)}
                    @click=${t=>t.stopPropagation()}
                    @input=${t=>{t.stopPropagation(),this._emitSegUpdate(e,"color",t.target.value)}} />
                </label>
                <span class="seg-list-name">${t.name||`Segment ${e+1}`}</span>
                <span class="seg-list-range">${t.start}–${t.end}</span>
                <button class="seg-list-del" @click=${s=>{s.stopPropagation(),i===e&&(this._selectedSegIdx=null),this._emit("smartvanio-remove-segment",{id:t.id??e})}}>
                  <ha-icon icon="mdi:close" style="--mdc-icon-size:14px"></ha-icon>
                </button>
              </div>
            `)}
          </div>
        `:""}
      </div>
    `}_startSegDragRemove(t,e){const i=t.currentTarget,s=t.clientY;this._dragRemoveIdx=e,i.setPointerCapture(t.pointerId);const r=t=>{const e=t.clientY-s;e>60?(i.style.transform=`translateY(${e}px)`,i.style.opacity=Math.max(0,1-(e-60)/60).toString()):(i.style.transform=`translateY(${Math.max(0,e)}px)`,i.style.opacity="1")},a=t=>{i.removeEventListener("pointermove",r),i.removeEventListener("pointerup",a),i.removeEventListener("pointercancel",a),i.releasePointerCapture(t.pointerId),i.style.transform="",i.style.opacity="",this._dragRemoveIdx=null;if(t.clientY-s>80){this._selectedSegIdx===e&&(this._selectedSegIdx=null);const t=this.lightSegments??[];this._emit("smartvanio-remove-segment",{id:t[e]?.id??e})}this.requestUpdate()};i.addEventListener("pointermove",r),i.addEventListener("pointerup",a),i.addEventListener("pointercancel",a)}_emitSegUpdate(t,e,i){const s=(this.lightSegments??[])[t];s&&(this._emit("smartvanio-update-segment",{id:s.id??t,field:e,value:i}),this._segPreviewTimer&&clearTimeout(this._segPreviewTimer),this._segPreviewTimer=setTimeout(()=>this._emit("smartvanio-segment-preview"),80))}_onStripClick(t,e,i){const s=t.currentTarget.getBoundingClientRect(),r=t.clientX-s.left,a=Math.round(r/s.width*i),n=e.some(t=>a>=t.start&&a<=t.end);if(n)return;let o=0,l=i-1;for(const t of e)t.end<a&&t.end+1>o&&(o=t.end+1),t.start>a&&t.start-1<l&&(l=t.start-1);const d=Math.max(o,a-5),c=Math.min(l,a+5);this._emit("smartvanio-add-segment-at",{start:d,end:c}),this._selectedSegIdx=e.length,this.requestUpdate()}_onHandleDrag(t,e,i,s,r){t.stopPropagation(),t.preventDefault();const a=t.target;a.setPointerCapture(t.pointerId);const n=a.closest(".strip-bar").getBoundingClientRect(),o=s[e];this._selectedSegIdx=e;const l=s.map((t,e)=>({...t,_i:e})).sort((t,e)=>t.start-e.start),d=l.findIndex(t=>t._i===e),c=d>0?l[d-1]:null,p=d<l.length-1?l[d+1]:null;let h=null;const u=()=>{h&&clearTimeout(h),h=setTimeout(()=>this._emit("smartvanio-segment-preview"),60)},g=t=>{const s=t.clientX-n.left;let a=Math.round(s/n.width*r);a=Math.max(0,Math.min(r-1,a)),"start"===i?(a=Math.min(a,o.end),a=c?Math.max(c.start+1,a):Math.max(0,a),c&&a<=c.end&&this._emit("smartvanio-update-segment",{id:c.id??c._i,field:"end",value:a-1}),this._emit("smartvanio-update-segment",{id:o.id??e,field:"start",value:a})):(a=Math.max(a,o.start),a=p?Math.min(p.end-1,a):Math.min(r-1,a),p&&a>=p.start&&this._emit("smartvanio-update-segment",{id:p.id??p._i,field:"start",value:a+1}),this._emit("smartvanio-update-segment",{id:o.id??e,field:"end",value:a})),u()},m=()=>{a.releasePointerCapture(t.pointerId),a.removeEventListener("pointermove",g),a.removeEventListener("pointerup",m),h&&clearTimeout(h),setTimeout(()=>this._emit("smartvanio-segment-preview"),80)};a.addEventListener("pointermove",g),a.addEventListener("pointerup",m)}get _maxPos(){return Math.max(1,this.maxLeds||100)}_normalizeStops(t){if(!t?.length)return t;const e=Math.max(1,...t.map(t=>t.pos)),i=this._maxPos;return e===i?t:t.map(t=>({...t,pos:Math.round(t.pos/e*i)}))}_initPatternStops(){if(!this._patternStops){const t=this._maxPos,e=this.entityId;let i=null;this.activePattern?.startsWith(e+":")&&(i=this.activePattern.slice(e.length+1));const s=i?(this.entityPatterns??{})[i]:null;s?.length?(this._patternStops=this._normalizeStops([...s]),this._editingPatternName=i):(this._patternStops=[{pos:0,r:75,g:0,b:130,brightness:100},{pos:Math.round(.25*t),r:138,g:43,b:226,brightness:100},{pos:Math.round(.5*t),r:23,g:13,b:89,brightness:80},{pos:Math.round(.75*t),r:199,g:21,b:133,brightness:100},{pos:t,r:25,g:25,b:112,brightness:90}],this._emit("smartvanio-pattern-preview",{stops:this._patternStops}))}}_gradientCSS(t){if(!t?.length)return"linear-gradient(to right, #333, #333)";const e=[...t].sort((t,e)=>t.pos-e.pos),i=this._maxPos,s=e.map(t=>{const e=(t.brightness??100)/100;return`rgb(${Math.round(t.r*e)},${Math.round(t.g*e)},${Math.round(t.b*e)}) ${(t.pos/i*100).toFixed(1)}%`});return`linear-gradient(to right, ${s.join(", ")})`}_renderPatternsSection(){this._initPatternStops();const t=this._patternStops??[],e=this._maxPos,i=this._selectedStopIdx,s=null!=i&&t[i]?t[i]:null,r=this.lightPatterns??{},a=Object.keys(r),n=this._editingPatternName??"";return j`
      <div class="modal-section pat-section">

        <!-- Gradient preview + stop handles (cssgradient.io style) -->
        <div class="pat-editor">
          <div class="pat-bar-wrap">
            <!-- Checkerboard background -->
            <div class="pat-bar-bg"></div>
            <!-- Gradient overlay -->
            <div class="pat-bar" style="background:${this._gradientCSS(t)}"
              @click=${e=>this._onPatternStripClick(e,t)}></div>
          </div>
          <!-- Stop handles below the bar -->
          <div class="pat-handle-track"
            @click=${e=>this._onPatternStripClick(e,t)}>
            ${t.map((s,r)=>{const a=e>0?s.pos/e*100:0;return j`
                <div class="pat-handle ${i===r?"selected":""}"
                  style="left:${a}%"
                  @click=${t=>{t.stopPropagation(),this._selectedStopIdx=r,this.requestUpdate()}}
                  @pointerdown=${e=>this._onStopDrag(e,r,t)}>
                  <div class="pat-handle-arrow"></div>
                  <div class="pat-handle-color" style="background:rgb(${s.r},${s.g},${s.b})"></div>
                </div>
              `})}
          </div>
        </div>

        <!-- Selected stop controls -->
        ${s?j`
          <div class="pat-stop-ctrl">
            <label class="pat-color-label">
              <div class="pat-color-preview" style="background:rgb(${s.r},${s.g},${s.b})"></div>
              <input type="color" class="pat-color-input"
                .value=${Pa(s.r,s.g,s.b)}
                @input=${t=>this._updateStop(i,"color",t.target.value)} />
            </label>
            <div class="pat-hex-wrap">
              <span class="pat-field-label">Hex</span>
              <input type="text" class="pat-hex-input"
                .value=${Pa(s.r,s.g,s.b)}
                @change=${t=>{const e=t.target.value.replace(/[^0-9a-fA-F]/g,"").slice(0,6);6===e.length&&this._updateStop(i,"color","#"+e)}} />
            </div>
            <div class="pat-pos-wrap">
              <span class="pat-field-label">LED</span>
              <input type="number" class="pat-pos-input" min="0" max="${e}"
                .value=${String(s.pos)}
                @change=${t=>this._updateStop(i,"pos",Math.max(0,Math.min(e,+t.target.value)))} />
            </div>
            <button class="pat-stop-del" ?disabled=${t.length<=2} @click=${()=>{t.length<=2||(this._patternStops=t.filter((t,e)=>e!==i),this._selectedStopIdx=null,this._emit("smartvanio-pattern-preview",{stops:this._patternStops}),this.requestUpdate())}}>
              <ha-icon icon="mdi:delete-outline" style="--mdc-icon-size:18px"></ha-icon>
            </button>
          </div>
        `:j`
          <div class="pat-hint">Tap the gradient bar to add a color stop</div>
        `}

        <!-- Save pattern -->
        <div class="pat-save-row">
          <input type="text" class="modal-input pat-name-input" placeholder="Pattern name…"
            .value=${n}
            @input=${t=>{this._editingPatternName=t.target.value}} />
          <button class="modal-btn save pat-save-btn"
            ?disabled=${!n.trim()||t.length<2}
            @click=${()=>{const e=n.trim();!e||t.length<2||this._emit("smartvanio-save-pattern",{name:e,stops:t})}}>Save</button>
        </div>

        <!-- Saved patterns list -->
        ${a.length?j`
          <div class="pat-list">
            ${a.map(t=>j`
                <div class="pat-list-item ${t===n?"active":""}" @click=${()=>{this._patternStops=this._normalizeStops([...r[t]]),this._editingPatternName=t,this._selectedStopIdx=null,this._emit("smartvanio-pattern-preview",{stops:this._patternStops}),this.requestUpdate()}}>
                  <span class="pat-list-grad" style="background:${this._gradientCSS(this._normalizeStops(r[t]))}"></span>
                  <span class="pat-list-name">${t}</span>
                  <button class="pat-list-del" @click=${e=>{e.stopPropagation(),this._emit("smartvanio-delete-pattern",{name:t})}}>
                    <ha-icon icon="mdi:close" style="--mdc-icon-size:14px"></ha-icon>
                  </button>
                </div>
              `)}
          </div>
        `:""}

        <!-- Add new pattern button -->
        <button class="pat-add-btn" @click=${()=>this._newRandomPattern()}>
          <ha-icon icon="mdi:plus" style="--mdc-icon-size:18px"></ha-icon>
          Add Pattern
        </button>
      </div>
    `}_newRandomPattern(){const t=this._maxPos,e=[[75,0,130],[138,43,226],[23,13,89],[199,21,133],[25,25,112],[72,61,139],[148,0,211],[186,85,211],[255,20,147],[0,0,139],[65,105,225],[30,144,255],[0,191,255],[123,104,238],[218,112,214],[255,0,255],[75,0,180],[100,0,150],[0,50,120],[180,50,200]],i=()=>e[Math.floor(Math.random()*e.length)],s=4+Math.floor(3*Math.random()),r=[];for(let e=0;e<s;e++){const[a,n,o]=i();r.push({pos:Math.round(e/(s-1)*t),r:a,g:n,b:o,brightness:70+Math.floor(31*Math.random())})}this._patternStops=r,this._editingPatternName="",this._selectedStopIdx=null,this._emit("smartvanio-pattern-preview",{stops:r}),this.requestUpdate()}_onPatternStripClick(t,e){const i=t.target.closest(".pat-editor")?.querySelector(".pat-handle-track"),s=(i||t.currentTarget).getBoundingClientRect(),r=t.clientX-s.left,a=this._maxPos,n=Math.round(r/s.width*a),o=[...e].sort((t,e)=>t.pos-e.pos);let l=255,d=255,c=255;if(o.length>=2){let t=o[0],e=o[o.length-1];for(let i=0;i<o.length-1;i++)if(n>=o[i].pos&&n<=o[i+1].pos){t=o[i],e=o[i+1];break}const i=e.pos-t.pos,s=i>0?(n-t.pos)/i:0;l=Math.round(t.r+s*(e.r-t.r)),d=Math.round(t.g+s*(e.g-t.g)),c=Math.round(t.b+s*(e.b-t.b))}const p=[...e,{pos:n,r:l,g:d,b:c,brightness:100}];this._patternStops=p,this._selectedStopIdx=p.length-1,this._emit("smartvanio-pattern-preview",{stops:p}),this.requestUpdate()}_onStopDrag(t,e,i){t.stopPropagation(),t.preventDefault();const s=t.target.closest(".pat-editor"),r=s?.querySelector(".pat-handle-track"),a=(r||s).getBoundingClientRect();this._selectedStopIdx=e;const n=t.clientY;let o=!1;const l=this._maxPos,d=t=>{if(Math.abs(t.clientY-n)>80&&i.length>2)return void(o||(o=!0,this._patternStops=i.filter((t,i)=>i!==e),this._selectedStopIdx=null,this._emit("smartvanio-pattern-preview",{stops:this._patternStops}),this.requestUpdate()));const s=t.clientX-a.left;let r=Math.round(s/a.width*l);r=Math.max(0,Math.min(l,r));const d=[...this._patternStops];d[e]={...d[e],pos:r},this._patternStops=d,this._emit("smartvanio-pattern-preview",{stops:d}),this.requestUpdate()},c=()=>{document.removeEventListener("pointermove",d),document.removeEventListener("pointerup",c)};document.addEventListener("pointermove",d),document.addEventListener("pointerup",c)}_updateStop(t,e,i){const s=[...this._patternStops??[]];if(s[t]){if("color"===e){const e=i.replace("#","");s[t]={...s[t],r:parseInt(e.substring(0,2),16),g:parseInt(e.substring(2,4),16),b:parseInt(e.substring(4,6),16)}}else s[t]={...s[t],[e]:i};this._patternStops=s,this._emit("smartvanio-pattern-preview",{stops:s}),this.requestUpdate()}}_renderAutomationsSection(){return j`
      <div class="modal-section">
        <div class="modal-section-header">
          <span class="modal-label">Automations</span>
          <button class="add-row-btn" @click=${()=>this._emit("smartvanio-add-edit-row")}>
            <ha-icon icon="mdi:plus"></ha-icon> Add
          </button>
        </div>
        ${(this.editRows??[]).length?"":j`<div class="no-automations">No automations yet — click Add to create one.</div>`}
        ${(this.editRows??[]).map((t,e)=>j`
            <div class="automation-row-v2">
              <div class="auto-row-trigger">
                <span class="auto-row-label-text">Trigger</span>
                <smartvanio-entity-picker
                  .hass=${this.hass}
                  .value=${t.source_entity_id}
                  .domains=${["binary_sensor","button","switch"]}
                  pinned-entity=${this.entityId}
                  placeholder="Select trigger…"
                  @smartvanio-change=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"source_entity_id",value:t.detail.value})}
                ></smartvanio-entity-picker>
                <smartvanio-select
                  .value=${t.gesture}
                  .options=${this._eventsForSource(t.source_entity_id).map(t=>({value:t.value,label:t.label}))}
                  placeholder="— event —"
                  ?disabled=${!t.source_entity_id}
                  @smartvanio-change=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"gesture",value:t.detail.value})}
                ></smartvanio-select>
              </div>
              <div class="auto-row-target">
                <span class="auto-row-label-text">Target</span>
                <smartvanio-entity-picker
                  .hass=${this.hass}
                  .value=${t.target_entity_id}
                  .domains=${["light","switch","fan","scene","cover","lock"]}
                  pinned-entity=${this.entityId}
                  placeholder="Select target…"
                  @smartvanio-change=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"target_entity_id",value:t.detail.value})}
                ></smartvanio-entity-picker>
              </div>
              <div class="auto-row-action">
                <span class="auto-row-label-text">Action</span>
                <smartvanio-select
                  .value=${t.action}
                  .options=${this._actionsForEntity(t.target_entity_id).map(t=>({value:t,label:this._actionLabel(t)}))}
                  placeholder="— select —"
                  ?disabled=${!t.target_entity_id}
                  @smartvanio-change=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"action",value:t.detail.value})}
                ></smartvanio-select>
                ${"turn_on_for"===t.action?j`
                  <div class="auto-duration-input">
                    <input type="number" min="1" max="480" .value=${t.duration||"5"}
                      @input=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"duration",value:t.target.value})}
                    />
                    <span class="auto-duration-unit">min</span>
                  </div>
                `:""}
                ${"set_brightness"===t.action?j`
                  <div class="auto-brightness-input">
                    <input type="range" min="1" max="100" .value=${t.brightness_pct||"50"}
                      @input=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"brightness_pct",value:t.target.value})}
                    />
                    <span class="auto-brightness-value">${t.brightness_pct||50}%</span>
                  </div>
                `:""}
              </div>
              <button
                class="delete-row-btn auto-row-delete"
                @click=${()=>this._emit("smartvanio-remove-edit-row",{id:e})}
              >
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
          `)}
      </div>
    `}render(){if(!this.entityId)return j``;const t=this.entityId,e=this.hass?.entities?.[t]?.device_id,i=e?this.hass?.devices?.[e]:null,s=i?.name_by_user??i?.name??null,r=this.hass?.entities?.[t]?.name,a=this.hass?.states[t]?.attributes?.friendly_name??"",n=r||(s&&a.startsWith(s+" ")?a.slice(s.length+1):a||t.split(".").pop()),o=this._modalView??(this.isLight?"control":"settings");return j`
      <div
        class="modal-overlay"
        @click=${t=>{t.target===t.currentTarget&&this._emit("smartvanio-modal-close")}}
      >
        <div class="modal ${"control"===o?"modal-control":""}">
          <div class="modal-header">
            ${"settings"===o&&this.isLight?j`
              <button class="modal-header-btn" @click=${()=>{this._modalView="control"}}>
                <ha-icon icon="mdi:arrow-left" style="--mdc-icon-size:20px"></ha-icon>
              </button>
            `:""}
            <span>${"control"===o?n:`Edit ${n}`}${s?j`<span class="modal-header-device">${s}</span>`:""}</span>
            <div class="modal-header-actions">
              ${"control"===o&&this.isLight?j`
                <button class="modal-header-btn" @click=${()=>{this._modalView="settings"}}>
                  <ha-icon icon="mdi:cog" style="--mdc-icon-size:20px"></ha-icon>
                </button>
              `:""}
              <button class="modal-close" @click=${()=>this._emit("smartvanio-modal-close")}>
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </div>
          </div>

          ${"control"===o?j`
            <div class="modal-body">
              ${this._renderControlView()}
            </div>
          `:j`
          <div class="modal-body two-col">
            ${this.editLoading?j`<div class="modal-loading">Loading…</div>`:j`
                  <div class="modal-col-left">
                    <div class="modal-section">
                      <label class="modal-label">Display Name</label>
                      <input
                        class="modal-input"
                        type="text"
                        .value=${this.editName??""}
                        @input=${t=>this._emit("smartvanio-update-edit-name",{value:t.target.value})}
                      />
                    </div>

                    <div class="modal-section">
                      <label class="modal-label">Area</label>
                      ${this._renderAreaPicker()}
                    </div>

                    ${this.isSwitch&&this.switchMode?j`
                    <div class="modal-section">
                      <label class="modal-label">Relay Mode</label>
                      <smartvanio-select
                        .value=${this.switchMode.current}
                        .options=${(this.switchMode.options??[]).map(t=>({value:t,label:t}))}
                        @smartvanio-change=${t=>this._emit("smartvanio-set-switch-mode",{value:t.detail.value})}
                      ></smartvanio-select>
                      <p class="switch-mode-hint">Choose "Normally Closed" for relays wired NC, so this switch reflects the device's real power state (on = circuit closed).</p>
                    </div>
                    `:""}

                    ${this.isTank?this._renderCalibrationSection():""}
                  </div>

                  <div class="modal-col-right">
                    ${this.isLight?j`
                      <div class="right-tabs">
                        <button class="right-tab ${"segments"===(this._rightTab??"segments")?"active":""}"
                          @click=${()=>{this._rightTab="segments",this._emit("smartvanio-segment-preview")}}>Segments</button>
                        <button class="right-tab ${"patterns"===this._rightTab?"active":""}"
                          @click=${()=>{this._rightTab="patterns",this._patternStops?.length&&this._emit("smartvanio-pattern-preview",{stops:this._patternStops})}}>Patterns</button>
                        <button class="right-tab ${"automations"===this._rightTab?"active":""}"
                          @click=${()=>{this._rightTab="automations"}}>Automations</button>
                      </div>
                      ${"segments"===(this._rightTab??"segments")?this._renderLightSegmentsSection():"patterns"===this._rightTab?this._renderPatternsSection():this._renderAutomationsSection()}
                    `:this.isSensor?j`
                    <!-- Simplified sensor automation: value above/below threshold → target → action -->
                    <div class="modal-section">
                      <div class="modal-section-header">
                        <span class="modal-label">Automations</span>
                        <button class="add-row-btn" @click=${()=>this._emit("smartvanio-add-edit-row")}>
                          <ha-icon icon="mdi:plus"></ha-icon> Add
                        </button>
                      </div>
                      ${(this.editRows??[]).length?"":j`<div class="no-automations">No automations yet — click Add to create one.</div>`}
                      ${(this.editRows??[]).map((t,e)=>j`
                          <div class="automation-row-v2">
                            <div class="auto-row-condition">
                              <span class="auto-row-label-text">When value is</span>
                              <div class="sensor-condition-row">
                                <smartvanio-select
                                  .value=${t.gesture||"above"}
                                  .options=${[{value:"above",label:"Above"},{value:"below",label:"Below"}]}
                                  @smartvanio-change=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"gesture",value:t.detail.value})}
                                ></smartvanio-select>
                                <input type="number" class="sensor-threshold-input"
                                  placeholder="Value"
                                  .value=${t.threshold??""}
                                  @input=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"threshold",value:t.target.value})} />
                              </div>
                            </div>
                            <div class="auto-row-target">
                              <span class="auto-row-label-text">Target</span>
                              <smartvanio-entity-picker
                                .hass=${this.hass}
                                .value=${t.target_entity_id}
                                .domains=${["light","switch","fan","scene","cover","lock"]}
                                pinned-entity=${this.entityId}
                                placeholder="Select target…"
                                @smartvanio-change=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"target_entity_id",value:t.detail.value})}
                              ></smartvanio-entity-picker>
                            </div>
                            <div class="auto-row-action">
                              <span class="auto-row-label-text">Action</span>
                              <smartvanio-select
                                .value=${t.action}
                                .options=${this._actionsForEntity(t.target_entity_id).map(t=>({value:t,label:this._actionLabel(t)}))}
                                placeholder="— select —"
                                ?disabled=${!t.target_entity_id}
                                @smartvanio-change=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"action",value:t.detail.value})}
                              ></smartvanio-select>
                            </div>
                            <button
                              class="delete-row-btn auto-row-delete"
                              @click=${()=>this._emit("smartvanio-remove-edit-row",{id:e})}
                            >
                              <ha-icon icon="mdi:delete-outline"></ha-icon>
                            </button>
                          </div>
                        `)}
                    </div>
                  `:j`
                    <div class="modal-section">
                      <div class="modal-section-header">
                        <span class="modal-label">Automations</span>
                        <button class="add-row-btn" @click=${()=>this._emit("smartvanio-add-edit-row")}>
                          <ha-icon icon="mdi:plus"></ha-icon> Add
                        </button>
                      </div>
                      ${(this.editRows??[]).length?"":j`<div class="no-automations">No automations yet — click Add to create one.</div>`}
                      ${(this.editRows??[]).map((t,e)=>j`
                          <div class="automation-row-v2">
                            <div class="auto-row-trigger">
                              <span class="auto-row-label-text">Trigger</span>
                              <smartvanio-entity-picker
                                .hass=${this.hass}
                                .value=${t.source_entity_id}
                                .domains=${["binary_sensor","button","switch"]}
                                pinned-entity=${this.entityId}
                                placeholder="Select trigger…"
                                @smartvanio-change=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"source_entity_id",value:t.detail.value})}
                              ></smartvanio-entity-picker>
                              <smartvanio-select
                                .value=${t.gesture}
                                .options=${this._eventsForSource(t.source_entity_id).map(t=>({value:t.value,label:t.label}))}
                                placeholder="— event —"
                                ?disabled=${!t.source_entity_id}
                                @smartvanio-change=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"gesture",value:t.detail.value})}
                              ></smartvanio-select>
                            </div>
                            <div class="auto-row-target">
                              <span class="auto-row-label-text">Target</span>
                              <smartvanio-entity-picker
                                .hass=${this.hass}
                                .value=${t.target_entity_id}
                                .domains=${["light","switch","fan","scene","cover","lock"]}
                                pinned-entity=${this.entityId}
                                placeholder="Select target…"
                                @smartvanio-change=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"target_entity_id",value:t.detail.value})}
                              ></smartvanio-entity-picker>
                            </div>
                            <div class="auto-row-action">
                              <span class="auto-row-label-text">Action</span>
                              <smartvanio-select
                                .value=${t.action}
                                .options=${this._actionsForEntity(t.target_entity_id).map(t=>({value:t,label:this._actionLabel(t)}))}
                                placeholder="— select —"
                                ?disabled=${!t.target_entity_id}
                                @smartvanio-change=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"action",value:t.detail.value})}
                              ></smartvanio-select>
                              ${"turn_on_for"===t.action?j`
                                <div class="auto-duration-input">
                                  <input type="number" min="1" max="480" .value=${t.duration||"5"}
                                    @input=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"duration",value:t.target.value})}
                                  />
                                  <span class="auto-duration-unit">min</span>
                                </div>
                              `:""}
                              ${"set_brightness"===t.action?j`
                                <div class="auto-brightness-input">
                                  <input type="range" min="1" max="100" .value=${t.brightness_pct||"50"}
                                    @input=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"brightness_pct",value:t.target.value})}
                                  />
                                  <span class="auto-brightness-value">${t.brightness_pct||50}%</span>
                                </div>
                              `:""}
                            </div>
                            <button
                              class="delete-row-btn auto-row-delete"
                              @click=${()=>this._emit("smartvanio-remove-edit-row",{id:e})}
                            >
                              <ha-icon icon="mdi:delete-outline"></ha-icon>
                            </button>
                          </div>
                        `)}
                    </div>
                  `}
                  </div>
                `}
          </div>

          ${this.saveError?j`<div class="save-error">${this.saveError}</div>`:""}
          <div class="modal-footer">
            <button class="modal-btn cancel" @click=${()=>this._emit("smartvanio-modal-close")}>
              Cancel
            </button>
            <button
              class="modal-btn save"
              ?disabled=${this.editSaving}
              @click=${()=>this._emit("smartvanio-save-edit",{entity_id:this.entityId,name:this.editName,area:this.editArea,rows:this.editRows,calPoints:this.calPoints,calKind:this.calKind,lightSegments:this.lightSegments,maxLeds:this.maxLeds})}
            >
              ${this.editSaving?"Saving…":"Save"}
            </button>
          </div>
          `}
        </div>
      </div>
    `}_actionsForEntity(t){const e=t?.split(".")?.[0];return"light"===e?["toggle","turn_on","turn_off","turn_on_for","set_brightness"]:"switch"===e||"fan"===e?["toggle","turn_on","turn_off","turn_on_for"]:"scene"===e?["turn_on"]:"lock"===e?["lock","unlock"]:"cover"===e?["open_cover","close_cover","stop_cover"]:["toggle"]}_actionLabel(t){return{toggle:"Toggle",turn_on:"Turn On",turn_off:"Turn Off",turn_on_for:"Turn On for…",set_brightness:"Set Brightness…",lock:"Lock",unlock:"Unlock",open_cover:"Open",close_cover:"Close",stop_cover:"Stop"}[t]??t.replace(/_/g," ").replace(/\b\w/g,t=>t.toUpperCase())}_eventsForSource(t){const e=t?.split(".")?.[0];return"binary_sensor"===e||"button"===e?[{value:"press",label:"Pressed"},{value:"double_press",label:"Double Pressed"},{value:"hold",label:"Held"}]:"switch"===e||"light"===e||"fan"===e?[{value:"off_to_on",label:"Turned On"},{value:"on_to_off",label:"Turned Off"}]:"cover"===e?[{value:"off_to_on",label:"Opened"},{value:"on_to_off",label:"Closed"}]:"lock"===e?[{value:"off_to_on",label:"Unlocked"},{value:"on_to_off",label:"Locked"}]:[{value:"press",label:"Activated"}]}static get styles(){return[Aa,a`
        :host { display: block; }

        /* ── Modal overlay ──── */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          align-items: stretch;
          justify-content: center;
          z-index: 1000;
          padding: 0;
        }

        .modal {
          background: var(--card-background-color, #fff);
          border-radius: 16px;
          width: 100%;
          max-width: 1060px;
          max-height: 100dvh;
          height: 100dvh;
          border-radius: 0;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
          font-size: 16px;
          font-weight: 600;
          color: var(--primary-text-color);
          flex-shrink: 0;
        }

        .modal-header-device {
          display: block;
          font-size: 11px;
          font-weight: 400;
          color: var(--secondary-text-color);
          margin-top: 2px;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          color: var(--secondary-text-color);
          transition: color 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .modal-close:hover {
          color: var(--primary-text-color);
        }
        .modal-close ha-icon {
          --mdc-icon-size: 20px;
        }

        .modal-body {
          padding: 18px;
          overflow-y: auto;
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .modal-body.two-col {
          flex-direction: row;
          gap: 24px;
        }

        .modal-col-left {
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
          min-width: 0;
        }

        .switch-mode-hint {
          margin: 8px 0 0;
          font-size: 12px;
          line-height: 1.4;
          color: var(--secondary-text-color);
        }

        .modal-col-right {
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
          min-width: 0;
        }

        .modal-body.two-col .modal-col-right {
          border-left: 1px solid var(--sv-border, rgba(255, 255, 255, 0.06));
          padding-left: 24px;
        }

        .modal-loading {
          text-align: center;
          color: var(--secondary-text-color);
          padding: 20px;
        }

        .modal-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .modal-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--secondary-text-color);
        }

        .modal-input {
          width: 100%;
          padding: 9px 12px;
          border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
          border-radius: 8px;
          background: var(--secondary-background-color, #f5f5f5);
          color: var(--primary-text-color);
          font-size: 14px;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s;
        }
        .modal-input:focus {
          border-color: var(--primary-color);
        }

        /* ── Automation rows ──── */
        .no-automations {
          font-size: 13px;
          color: var(--secondary-text-color);
          text-align: center;
          padding: 8px 0;
        }

        .add-row-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: 1px solid var(--primary-color, #03a9f4);
          border-radius: 6px;
          color: var(--primary-color);
          font-size: 13px;
          font-weight: 500;
          padding: 4px 10px;
          cursor: pointer;
          transition: background 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .add-row-btn:hover {
          background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        }
        .add-row-btn ha-icon {
          --mdc-icon-size: 16px;
        }

        .automation-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        smartvanio-select {
          flex: 1;
          min-width: 100px;
        }

        .delete-row-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          color: var(--secondary-text-color);
          transition: color 0.2s, background 0.2s;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .delete-row-btn:hover {
          color: var(--error-color, #f44336);
          background: rgba(244, 67, 54, 0.08);
        }
        .delete-row-btn ha-icon {
          --mdc-icon-size: 18px;
        }

        /* ── Automation row v2 ──── */

        .automation-row-v2 {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 8px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px 4px;
        }

        .auto-row-trigger,
        .auto-row-target,
        .auto-row-action {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .auto-row-trigger > *,
        .auto-row-target > *,
        .auto-row-action > * {
          min-width: 0;
        }

        .auto-row-trigger smartvanio-entity-picker,
        .auto-row-target smartvanio-entity-picker {
          flex: 2;
        }

        .auto-row-trigger smartvanio-select {
          flex: 1;
        }

        .auto-row-action smartvanio-select {
          flex: 1;
        }

        .auto-row-label-text {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--secondary-text-color);
          min-width: 50px;
          width: 50px;
          flex-shrink: 0;
          letter-spacing: 0.5px;
        }

        .auto-row-trigger .auto-row-label-text {
          color: var(--primary-color, #4a9eff);
        }

        .auto-row-target .auto-row-label-text {
          color: #ffb830;
        }

        .auto-row-action .auto-row-label-text {
          color: #66bb6a;
        }

        .auto-row-condition .auto-row-label-text {
          color: var(--primary-color, #4a9eff);
        }

        .sensor-condition-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sensor-condition-row smartvanio-select {
          flex: 0 0 auto;
          min-width: 100px;
        }

        .sensor-threshold-input {
          flex: 1;
          min-width: 70px;
          max-width: 120px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: var(--primary-text-color);
          font-size: 14px;
          padding: 9px 12px;
          text-align: center;
          -moz-appearance: textfield;
        }

        .sensor-threshold-input::-webkit-inner-spin-button,
        .sensor-threshold-input::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .sensor-threshold-input:focus {
          outline: none;
          border-color: var(--primary-color, #4a9eff);
        }

        .auto-duration-input {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .auto-duration-input input[type="number"] {
          width: 60px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: var(--primary-text-color);
          font-size: 14px;
          padding: 9px 12px;
          text-align: center;
          -moz-appearance: textfield;
        }
        .auto-duration-input input[type="number"]::-webkit-inner-spin-button,
        .auto-duration-input input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .auto-duration-input input:focus {
          outline: none;
          border-color: var(--primary-color, #4a9eff);
        }

        .auto-duration-unit {
          font-size: 13px;
          color: var(--secondary-text-color);
        }

        .auto-brightness-input {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .auto-brightness-input input[type="range"] {
          flex: 1;
          height: 4px;
          -webkit-appearance: none;
          background: rgba(255, 255, 255, 0.12);
          border-radius: 2px;
          outline: none;
        }
        .auto-brightness-input input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--primary-color, #4a9eff);
          cursor: pointer;
        }

        .auto-brightness-value {
          font-size: 13px;
          font-weight: 500;
          color: var(--primary-text-color);
          min-width: 36px;
          text-align: right;
        }

        .auto-row-trigger,
        .auto-row-target,
        .auto-row-action {
          grid-column: 1;
        }

        .auto-row-delete {
          grid-column: 2;
          grid-row: 1 / -1;
          align-self: center;
        }

        /* ── Save error ──── */
        .save-error {
          padding: 8px 12px;
          margin: 0 16px 8px;
          background: rgba(220, 50, 50, 0.15);
          border: 1px solid rgba(220, 50, 50, 0.4);
          border-radius: 6px;
          color: #ff6b6b;
          font-size: 12px;
          word-break: break-word;
        }

        /* ── Modal footer ──── */
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 14px 18px;
          border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
          flex-shrink: 0;
        }

        .modal-btn {
          padding: 9px 20px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, opacity 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .modal-btn.cancel {
          background: var(--secondary-background-color, #f0f0f0);
          color: var(--primary-text-color);
        }
        .modal-btn.cancel:hover {
          background: var(--divider-color);
        }
        .modal-btn.save {
          background: var(--primary-color, #03a9f4);
          color: white;
        }
        .modal-btn.save:hover {
          opacity: 0.88;
        }
        .modal-btn[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ── Calibration section ──── */
        .cal-live {
          font-size: 13px;
          font-weight: 600;
          color: var(--primary-color);
        }

        .cal-header-row {
          display: grid;
          grid-template-columns: 1fr 1fr auto auto;
          gap: 6px;
          padding: 0 2px;
        }

        .cal-col-hdr {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--secondary-text-color);
        }

        .cal-row {
          display: grid;
          grid-template-columns: 1fr 1fr auto auto;
          gap: 6px;
          align-items: center;
        }

        .cal-input {
          width: 100%;
          padding: 9px 12px;
          border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
          border-radius: 8px;
          background: var(--secondary-background-color, #f5f5f5);
          color: var(--primary-text-color);
          font-size: 14px;
          box-sizing: border-box;
          outline: none;
        }
        .cal-input:focus {
          border-color: var(--primary-color);
        }

        .capture-btn {
          background: none;
          border: 1px solid var(--primary-color);
          border-radius: 6px;
          padding: 5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          color: var(--primary-color);
          transition: background 0.15s;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .capture-btn:hover {
          background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        }
        .capture-btn ha-icon {
          --mdc-icon-size: 16px;
        }

        /* ── Segment cards ──── */
        .seg-card {
          background: var(--secondary-background-color, #f5f5f5);
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 10px;
        }

        .seg-card-top {
          display: grid;
          grid-template-columns: 36px 1fr auto;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .seg-card-bottom {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .seg-field {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .seg-field-label {
          font-size: 0.75rem;
          color: var(--secondary-text-color, #888);
          white-space: nowrap;
        }

        .seg-field .cal-input {
          width: 60px;
        }

        .seg-name-input {
          min-width: 0;
          flex: 1;
        }

        /* Segment brightness slider */
        .seg-bri-slider-wrap {
          flex: 1;
          position: relative;
          height: 36px;
          cursor: pointer;
          touch-action: none;
          user-select: none;
        }
        .seg-bri-track {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,0.06);
        }
        .seg-bri-fill {
          height: 100%;
          background: var(--seg-color, var(--primary-color));
          opacity: 0.3;
          width: calc(12px + (100% - 24px) * var(--seg-bri, 100) / 100);
        }
        .seg-bri-thumb {
          position: absolute;
          top: 50%;
          left: calc(12px + (100% - 24px) * var(--seg-bri, 100) / 100);
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--seg-color, var(--primary-color));
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .seg-bri-value {
          font-size: 12px;
          color: var(--secondary-text-color, #888);
          min-width: 32px;
          text-align: right;
          flex-shrink: 0;
        }

        /* Swatch color picker in segment list */
        .seg-list-swatch-label {
          position: relative;
          display: inline-flex;
          cursor: pointer;
          flex-shrink: 0;
        }
        .seg-list-color-input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          border: none;
          padding: 0;
        }

        /* ── Visual strip editor ──── */
        .strip-wrap {
          margin: 8px 0 12px;
        }

        .strip-bar {
          position: relative;
          width: 100%;
          height: 64px;
          background: repeating-linear-gradient(
            90deg,
            var(--secondary-background-color, #222) 0px,
            var(--secondary-background-color, #222) 1px,
            transparent 1px,
            transparent 10px
          );
          border: 1px solid var(--divider-color, rgba(255,255,255,0.1));
          border-radius: 8px;
          cursor: pointer;
          overflow: visible;
          touch-action: none;
        }

        .strip-seg {
          position: absolute;
          top: 2px;
          bottom: 2px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: box-shadow 0.15s;
          min-width: 12px;
          z-index: 1;
        }

        .strip-seg.selected {
          box-shadow: 0 0 0 2px var(--primary-color, #03a9f4);
          z-index: 2;
        }
        .strip-seg.drag-removing {
          z-index: 10;
          transition: none;
        }
        .strip-seg-color {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          border: none;
          padding: 0;
          pointer-events: none;
        }

        .strip-seg-label {
          font-size: 10px;
          font-weight: 600;
          color: rgba(0,0,0,0.7);
          text-shadow: 0 1px 2px rgba(255,255,255,0.4);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 6px;
          pointer-events: none;
        }

        .strip-handle {
          position: absolute;
          top: -4px;
          bottom: -4px;
          width: 28px;
          cursor: col-resize;
          z-index: 3;
          touch-action: none;
        }
        .strip-handle::after {
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 5px;
          height: 28px;
          border-radius: 3px;
          background: rgba(255,255,255,0.7);
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .strip-handle-l {
          left: -8px;
        }
        .strip-handle-l::after {
          left: 10px;
        }
        .strip-handle-r {
          right: -8px;
        }
        .strip-handle-r::after {
          right: 10px;
        }
        .strip-handle:hover::after,
        .strip-handle:active::after {
          background: rgba(255,255,255,1);
          height: 32px;
          width: 6px;
        }

        .strip-ticks {
          position: absolute;
          bottom: -16px;
          left: 0;
          right: 0;
          height: 12px;
          pointer-events: none;
        }
        .strip-tick {
          position: absolute;
          font-size: 9px;
          color: var(--secondary-text-color, #888);
          transform: translateX(-50%);
        }

        .seg-detail {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          background: var(--secondary-background-color, #f5f5f5);
          border-radius: 8px;
          margin-top: 8px;
        }
        .seg-detail-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .seg-hint {
          text-align: center;
          color: var(--secondary-text-color, #888);
          font-size: 13px;
          padding: 12px 0 4px;
        }

        /* Segment list */
        .seg-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 8px;
          border-top: 1px solid var(--divider-color, rgba(255,255,255,0.08));
          padding-top: 8px;
        }
        .seg-list-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: background 0.15s;
        }
        .seg-list-item:hover { background: rgba(255,255,255,0.05); }
        .seg-list-item.active { background: rgba(var(--rgb-primary-color, 66,135,245), 0.15); outline: 1px solid rgba(var(--rgb-primary-color, 66,135,245), 0.5); }
        .seg-list-swatch {
          width: 14px; height: 14px;
          border-radius: 3px;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .seg-list-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .seg-list-range {
          color: var(--secondary-text-color, #888);
          font-size: 12px;
          flex-shrink: 0;
        }
        .seg-list-bri {
          color: var(--secondary-text-color, #888);
          font-size: 12px;
          flex-shrink: 0;
          min-width: 32px;
          text-align: right;
        }
        .seg-list-del {
          background: none;
          border: none;
          color: var(--secondary-text-color, #888);
          cursor: pointer;
          padding: 2px;
          opacity: 0.5;
          transition: opacity 0.15s;
        }
        .seg-list-del:hover { opacity: 1; color: var(--error-color, #f44); }

        /* Right column tabs (Segments / Patterns / Automations) */
        .right-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 12px;
          border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.08));
        }
        .right-tab {
          flex: 1;
          background: none;
          border: none;
          color: var(--secondary-text-color, #888);
          font-size: 13px;
          padding: 10px 12px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: color 0.15s, border-color 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .right-tab:hover { color: var(--primary-text-color, #fff); }
        .right-tab.active {
          color: var(--primary-color, #4287f5);
          border-bottom-color: var(--primary-color, #4287f5);
        }

        /* Pattern gradient editor */
        /* ── Pattern editor (cssgradient.io inspired) ──── */
        .pat-section { display: flex; flex-direction: column; gap: 12px; }

        .pat-editor {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .pat-bar-wrap {
          position: relative;
          height: 48px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
        }
        .pat-bar-bg {
          position: absolute; inset: 0;
          background: repeating-conic-gradient(rgba(255,255,255,0.06) 0% 25%, transparent 0% 50%) 0 0 / 12px 12px;
        }
        .pat-bar {
          position: absolute; inset: 0;
          cursor: crosshair;
        }

        /* Stop handle track — overlaps bottom of gradient bar */
        .pat-handle-track {
          position: relative;
          height: 28px;
          margin: -6px 11px 0;
          cursor: crosshair;
          overflow: visible;
          z-index: 3;
        }
        .pat-handle {
          position: absolute;
          top: 0;
          transform: translateX(-50%);
          cursor: grab;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          touch-action: none;
          -webkit-tap-highlight-color: transparent;
        }
        .pat-handle-arrow {
          width: 0; height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-bottom: 7px solid rgba(255,255,255,0.4);
          transition: border-bottom-color 0.15s;
        }
        .pat-handle-color {
          width: 22px; height: 22px;
          border-radius: 4px;
          border: 2.5px solid rgba(255,255,255,0.55);
          box-shadow: 0 1px 4px rgba(0,0,0,0.5);
          box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .pat-handle:active { cursor: grabbing; }
        .pat-handle:hover .pat-handle-color {
          border-color: rgba(255,255,255,0.85);
        }
        .pat-handle.selected .pat-handle-color {
          border-color: var(--primary-color, #4287f5);
          box-shadow: 0 0 0 2px var(--primary-color, #4287f5), 0 1px 4px rgba(0,0,0,0.5);
        }
        .pat-handle.selected .pat-handle-arrow {
          border-bottom-color: var(--primary-color, #4287f5);
        }

        /* Selected stop controls */
        .pat-stop-ctrl {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: var(--secondary-background-color, rgba(255,255,255,0.04));
          border-radius: 8px;
        }
        .pat-color-label {
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
        }
        .pat-color-preview {
          width: 40px; height: 40px;
          border-radius: 8px;
          border: 2px solid rgba(255,255,255,0.2);
          box-sizing: border-box;
        }
        .pat-color-input {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          opacity: 0; cursor: pointer;
          border: none; padding: 0;
        }
        .pat-field-label {
          font-size: 10px;
          color: var(--secondary-text-color, #888);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }
        .pat-hex-wrap, .pat-pos-wrap {
          display: flex;
          flex-direction: column;
        }
        .pat-hex-input {
          width: 72px;
          background: var(--card-background-color, #1c1c1c);
          color: var(--primary-text-color, #fff);
          border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
          border-radius: 6px;
          padding: 6px 8px;
          font-size: 13px;
          font-family: monospace;
        }
        .pat-pos-input {
          width: 56px;
          background: var(--card-background-color, #1c1c1c);
          color: var(--primary-text-color, #fff);
          border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
          border-radius: 6px;
          padding: 6px 8px;
          font-size: 13px;
          text-align: center;
        }
        .pat-stop-del {
          margin-left: auto;
          background: none;
          border: none;
          color: var(--secondary-text-color, #999);
          cursor: pointer;
          padding: 6px;
          opacity: 0.5;
          transition: opacity 0.15s;
        }
        .pat-stop-del:hover { opacity: 1; color: var(--error-color, #f44); }
        .pat-stop-del:disabled { opacity: 0.15; cursor: default; }

        .pat-hint {
          text-align: center;
          color: var(--secondary-text-color, #888);
          font-size: 13px;
          padding: 8px 0;
        }

        /* Save row */
        .pat-save-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .pat-name-input { flex: 1; }
        .pat-save-btn { flex-shrink: 0; min-width: 60px; }

        /* Saved patterns list */
        .pat-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          border-top: 1px solid var(--divider-color, rgba(255,255,255,0.08));
          padding-top: 8px;
        }
        .pat-list-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .pat-list-item:hover { background: rgba(255,255,255,0.05); }
        .pat-list-item.active {
          background: rgba(var(--rgb-primary-color, 66,135,245), 0.15);
          outline: 1px solid rgba(var(--rgb-primary-color, 66,135,245), 0.5);
        }
        .pat-list-grad {
          width: 48px; height: 24px;
          border-radius: 4px;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .pat-list-name {
          flex: 1;
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .pat-list-del {
          background: none;
          border: none;
          color: var(--secondary-text-color, #888);
          cursor: pointer;
          padding: 2px;
          opacity: 0.5;
          transition: opacity 0.15s;
        }
        .pat-list-del:hover { opacity: 1; color: var(--error-color, #f44); }

        .pat-add-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 10px;
          border: 1px dashed var(--divider-color, rgba(255,255,255,0.15));
          border-radius: 8px;
          background: none;
          color: var(--secondary-text-color, #888);
          font-size: 13px;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
        }
        .pat-add-btn:hover {
          color: var(--primary-text-color, #fff);
          border-color: var(--primary-color, #4287f5);
        }

        .seg-max-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .seg-max-label {
          font-size: 12px;
          color: var(--secondary-text-color, #888);
        }
        .seg-max-input {
          width: 60px;
          padding: 9px 12px;
          border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
          border-radius: 8px;
          background: var(--secondary-background-color, #f5f5f5);
          color: var(--primary-text-color);
          font-size: 14px;
          text-align: center;
        }

        /* ── Area picker ──── */
        .area-picker {
          position: relative;
        }
        .area-picker-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 9px 12px;
          border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
          border-radius: 8px;
          background: var(--secondary-background-color, #f5f5f5);
          color: var(--primary-text-color);
          font-size: 14px;
          font-family: inherit;
          cursor: pointer;
          box-sizing: border-box;
          text-align: left;
        }
        .area-picker-placeholder {
          color: var(--secondary-text-color, #888);
        }
        /* ── Area picker sheet (full-screen modal, escapes parent clipping) ── */
        .area-picker-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          z-index: 10000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          animation: ap-fade-in 0.18s ease-out;
        }
        @keyframes ap-fade-in {
          from { background: rgba(0, 0, 0, 0); }
          to   { background: rgba(0, 0, 0, 0.55); }
        }
        .area-picker-sheet {
          background: var(--card-background-color, #fff);
          border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
          border-radius: 0 0 18px 18px;
          width: min(640px, 100%);
          max-height: 92dvh;
          display: flex;
          flex-direction: column;
          padding: 14px;
          gap: 12px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          animation: ap-slide-down 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes ap-slide-down {
          from { transform: translateY(-20px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        .area-picker-sheet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 2px 4px;
        }
        .area-picker-sheet-title {
          font-size: 17px;
          font-weight: 600;
          color: var(--primary-text-color);
        }
        .area-picker-sheet-close {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          background: var(--secondary-background-color, #f5f5f5);
          border: 1px solid var(--divider-color, rgba(0,0,0,0.08));
          border-radius: 22px;
          color: var(--secondary-text-color);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }
        .area-picker-sheet-close:hover {
          background: var(--divider-color, rgba(0,0,0,0.12));
          color: var(--primary-text-color);
        }
        .area-picker-search {
          width: 100%;
          font-size: 16px;  /* >=16px prevents iOS auto-zoom on focus */
          font-family: inherit;
          padding: 14px 16px;
          border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
          border-radius: 12px;
          background: var(--secondary-background-color, #f5f5f5);
          color: var(--primary-text-color);
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.15s;
        }
        .area-picker-search:focus { border-color: var(--primary-color); }
        .area-picker-list {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overscroll-behavior: contain;
          touch-action: pan-y;
          margin: 0 -4px;
          padding: 0 4px 4px;
        }
        .area-picker-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          cursor: pointer;
          font-size: 15px;
          border-radius: 10px;
          transition: background 0.15s;
          touch-action: manipulation;
        }
        .area-picker-item:hover { background: var(--secondary-background-color, #f5f5f5); }
        .area-picker-item:active { background: var(--divider-color, rgba(0,0,0,0.08)); }
        .area-picker-item.selected {
          color: var(--primary-color);
          font-weight: 600;
          background: color-mix(in srgb, var(--primary-color, #4a9eff) 12%, transparent);
        }
        .area-picker-item.clear {
          color: var(--error-color, #db4437);
          font-size: 14px;
          border-bottom: 1px solid var(--divider-color, rgba(0,0,0,0.08));
          margin-bottom: 4px;
          border-radius: 10px 10px 0 0;
        }
        .area-picker-empty {
          padding: 24px 16px;
          text-align: center;
          color: var(--secondary-text-color, #888);
          font-size: 14px;
        }

        /* ── Modal header actions ──── */
        .modal-header-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .modal-header-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          color: var(--secondary-text-color);
          transition: color 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .modal-header-btn:hover {
          color: var(--primary-text-color);
        }

        /* ── Control view (compact modal for lights) ──── */
        .modal.modal-control {
          max-width: 400px;
        }
        .ctrl-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .ctrl-power-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .ctrl-status {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ctrl-status-text {
          font-size: 18px;
          font-weight: 600;
          color: var(--primary-text-color);
        }
        .ctrl-power-btn {
          background: none;
          border: 2px solid var(--divider-color, rgba(255,255,255,0.1));
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--secondary-text-color);
          transition: all 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .ctrl-power-btn.on {
          color: var(--primary-color, #4a9eff);
          border-color: var(--primary-color, #4a9eff);
        }
        .ctrl-power-btn:hover { opacity: 0.8; }
        .ctrl-bri-bar {
          position: relative;
          width: 100%;
          height: 40px;
          border-radius: 20px;
          background: var(--secondary-background-color, #1a1a2e);
          cursor: pointer;
          touch-action: none;
        }
        .ctrl-bri-track {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          overflow: hidden;
        }
        .ctrl-bri-fill {
          height: 100%;
          background: var(--bri-color, var(--primary-color));
          opacity: 0.25;
          width: calc(20px + (100% - 40px) * var(--bri, 0) / 100);
        }
        .ctrl-bri-thumb {
          position: absolute;
          top: 50%;
          left: calc(20px + (100% - 40px) * var(--bri, 0) / 100);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bri-color, var(--primary-color));
          border: 3px solid #fff;
          box-shadow: 0 1px 6px rgba(0,0,0,0.4);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .ctrl-wheel-wrap {
          position: relative;
          width: 200px;
          height: 200px;
        }
        .ctrl-color-wheel {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          cursor: pointer;
          touch-action: none;
        }
        .ctrl-wheel-indicator {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid #fff;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.4);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .ctrl-presets {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .ctrl-swatch {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.15s, transform 0.15s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .ctrl-swatch:hover { transform: scale(1.15); border-color: var(--primary-text-color); }
        .ctrl-patterns {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          width: 100%;
        }
        .ctrl-pattern-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          border: 2px solid transparent;
          border-radius: 8px;
          padding: 6px;
          transition: border-color 0.15s, transform 0.15s;
          min-width: 60px;
          flex: 1;
        }
        .ctrl-pattern-gradient {
          width: 100%;
          height: 24px;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .ctrl-pattern-name {
          font-size: 11px;
          color: var(--secondary-text-color);
          text-align: center;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ctrl-pattern-chip:hover { transform: scale(1.05); border-color: var(--primary-text-color); }
        .ctrl-pattern-chip.active { border-color: var(--primary-color, #4a9eff); box-shadow: 0 0 8px rgba(74, 158, 255, 0.4); }
        .ctrl-pattern-chip.active .ctrl-pattern-name { color: var(--primary-color, #4a9eff); }

        /* ── Responsive: tablets & smaller screens ──── */
        @media (max-width: 900px) {
          .modal-body.two-col {
            flex-direction: column;
          }
          .modal-body.two-col .modal-col-right {
            border-left: none;
            padding-left: 0;
            border-top: 1px solid var(--sv-border, rgba(255, 255, 255, 0.06));
            padding-top: 16px;
          }
        }

        @media (max-width: 768px) {
          .modal-header { padding: 12px 14px; font-size: 15px; }
          .modal-body { padding: 14px; gap: 16px; }
          .modal-input {
            font-size: 16px;
            padding: 10px 12px;
          }
          .cal-input {
            font-size: 16px;
            padding: 10px 12px;
          }
          .seg-max-input {
            font-size: 16px;
            padding: 10px 12px;
            width: 70px;
          }
          .seg-name-input {
            font-size: 16px !important;
            padding: 10px 12px !important;
          }
          .seg-detail {
            padding: 14px;
          }
          .seg-detail-row { gap: 10px; }
          .seg-field-label { font-size: 12px; }
          .strip-bar { height: 72px; }
          .strip-handle { width: 36px; }
          .strip-handle-l { left: -12px; }
          .strip-handle-r { right: -12px; }
          .strip-handle::after {
            width: 6px;
            height: 32px;
          }
          .strip-seg-label { font-size: 11px; }
          .seg-list-item {
            padding: 10px 10px;
            font-size: 14px;
          }
          .pat-bar-wrap { height: 56px; }
          .pat-handle-color { width: 26px; height: 26px; }
          .pat-hex-input, .pat-pos-input {
            font-size: 16px;
            padding: 8px 10px;
          }
          .pat-color-preview { width: 44px; height: 44px; }
          .right-tab {
            font-size: 14px;
            padding: 12px;
          }
          .modal-btn {
            padding: 12px 24px;
            font-size: 15px;
          }
          .add-row-btn {
            padding: 8px 14px;
            font-size: 14px;
          }
        }
      `]}});customElements.define("smartvanio-modal-scene",class extends nt{static get properties(){return{hass:{type:Object},editingScene:{type:String,attribute:"editing-scene"},sceneEditName:{type:String,attribute:"scene-edit-name"},sceneEditLights:{type:Array},sceneEditSaving:{type:Boolean,attribute:"scene-edit-saving"},deviceId:{type:String,attribute:"device-id"},lightOptions:{type:Array},allScenes:{type:Array}}}constructor(){super(),this.sceneEditLights=[],this.lightOptions=[],this.allScenes=[]}_entityLabel(t){const e=this.hass?.entities?.[t]?.name;if(e)return e;const i=this.hass?.states[t]?.attributes?.friendly_name??"",s=this.hass?.entities?.[t]?.device_id,r=s?this.hass?.devices?.[s]:null,a=r?.name_by_user??r?.name??"";return a&&i.startsWith(a+" ")?i.slice(a.length+1):i||t.split(".").pop()}_emit(t,e={}){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}render(){if(!this.editingScene)return j``;const t="new"===this.editingScene,e=new Set((this.sceneEditLights??[]).map(t=>t.entity_id)),i=!!this.hass&&Object.keys(this.hass.states).some(t=>t.startsWith("light.")&&!e.has(t));return j`
      <div
        class="modal-overlay"
        @click=${t=>{t.target===t.currentTarget&&this._emit("smartvanio-modal-close")}}
      >
        <div class="modal">
          <div class="modal-header">
            <span>${t?"New Scene":"Edit Scene"}</span>
            <button class="modal-close" @click=${()=>this._emit("smartvanio-modal-close")}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>

          <div class="modal-body">
            <!-- Name -->
            <div class="modal-section">
              <label class="modal-label">Scene Name</label>
              <input
                class="modal-input"
                type="text"
                placeholder="e.g. Evening Glow"
                .value=${this.sceneEditName??""}
                @input=${t=>this._emit("smartvanio-update-scene-name",{value:t.target.value})}
              />
            </div>

            <!-- Lights -->
            <div class="modal-section">
              <div class="modal-section-header">
                <span class="modal-label">Lights</span>
                <button
                  class="add-row-btn"
                  title="Snapshot current HA state into each light"
                  @click=${()=>this._emit("smartvanio-capture-scene-state")}
                >
                  <ha-icon icon="mdi:camera"></ha-icon> Capture
                </button>
              </div>

              <!-- Add-light picker -->
              <smartvanio-entity-picker
                .hass=${this.hass}
                .value=${""}
                .domains=${["light"]}
                .excludeEntities=${[...e]}
                placeholder=${i?"+ Add light…":"All lights added"}
                @smartvanio-change=${t=>{t.detail.value&&this._emit("smartvanio-add-scene-light",{entity_id:t.detail.value})}}
              ></smartvanio-entity-picker>

              <!-- Light list -->
              ${(this.sceneEditLights??[]).length?"":j`<div class="no-automations">No lights added yet.</div>`}
              ${(this.sceneEditLights??[]).map(t=>{const e="ON"===(t.state??"ON").toUpperCase(),[i,s,r]=t.rgb_color??[255,255,255],a=Math.round((t.brightness??255)/255*100),n=this.hass?.states[t.entity_id],o=n?.attributes?.supported_color_modes?.includes("rgb")??!1,l=n?.attributes?.effect_list??[],d=l.length>0,c=t.effect??"",p=Pa(i,s,r),h=e?`rgb(${i},${s},${r})`:"rgba(128,128,128,0.4)",u=`linear-gradient(to right, ${h} 0%, ${h} ${a}%, var(--slider-track,#e0e0e0) ${a}%, var(--slider-track,#e0e0e0) 100%)`,g=this._entityLabel(t.entity_id);return j`
                  <div class="scene-light-card">
                    <div class="scene-light-row">
                      <span class="scene-light-name">${g}</span>
                      <button
                        class="scene-state-btn ${e?"on":""}"
                        @click=${()=>this._emit("smartvanio-update-scene-light",{entity_id:t.entity_id,field:"state",value:e?"OFF":"ON"})}
                      >
                        ${e?"On":"Off"}
                      </button>
                      <button
                        class="delete-row-btn"
                        @click=${()=>this._emit("smartvanio-remove-scene-light",{entity_id:t.entity_id})}
                      >
                        <ha-icon icon="mdi:close"></ha-icon>
                      </button>
                    </div>
                    <div class="scene-light-controls">
                      ${e?j`
                        <input
                          type="range"
                          class="br-slider scene-light-bri"
                          min="1"
                          max="100"
                          .value=${String(a)}
                          style="--sc:rgb(${i},${s},${r}); background:${u}"
                          @input=${t=>{const e=t.target.value,a=`rgb(${i},${s},${r})`;t.target.style.background=`linear-gradient(to right,${a} 0%,${a} ${e}%,var(--slider-track,#e0e0e0) ${e}%,var(--slider-track,#e0e0e0) 100%)`}}
                          @change=${e=>this._emit("smartvanio-update-scene-light",{entity_id:t.entity_id,field:"brightness",value:Math.round(+e.target.value/100*255)})}
                        />
                        ${o&&!c?j`
                          <input
                            type="color"
                            class="seg-color-input scene-light-color"
                            .value=${p}
                            @input=${e=>{const[i,s,r]=function(t){const e=parseInt(t.slice(1),16);return[e>>16&255,e>>8&255,255&e]}(e.target.value);this._emit("smartvanio-update-scene-light",{entity_id:t.entity_id,field:"rgb_color",value:[i,s,r]})}}
                          />
                        `:""}
                      `:""}
                      <smartvanio-select
                        .value=${c}
                        ?disabled=${!d}
                        .options=${d?[{value:"",label:"No effect"},...l.map(t=>({value:t,label:t}))]:[{value:"",label:"No effects"}]}
                        @smartvanio-change=${e=>this._emit("smartvanio-update-scene-light",{entity_id:t.entity_id,field:"effect",value:e.detail.value||null})}
                      ></smartvanio-select>
                    </div>
                  </div>
                `})}
            </div>
          </div>

          <div class="modal-footer">
            ${t?"":j`
                  <button class="modal-btn delete" @click=${()=>this._emit("smartvanio-delete-scene")}>
                    Delete
                  </button>
                `}
            <button class="modal-btn cancel" @click=${()=>this._emit("smartvanio-modal-close")}>
              Cancel
            </button>
            <button
              class="modal-btn save"
              ?disabled=${this.sceneEditSaving}
              @click=${()=>this._emit("smartvanio-save-scene")}
            >
              ${this.sceneEditSaving?"Saving…":"Save"}
            </button>
          </div>
        </div>
      </div>
    `}static get styles(){return[Aa,a`
        :host { display: block; }

        /* ── Modal overlay ──── */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }

        .modal {
          background: var(--card-background-color, #fff);
          border-radius: 16px;
          width: 100%;
          max-width: 480px;
          max-height: 90dvh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
          font-size: 16px;
          font-weight: 600;
          color: var(--primary-text-color);
          flex-shrink: 0;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          color: var(--secondary-text-color);
          transition: color 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .modal-close:hover {
          color: var(--primary-text-color);
        }
        .modal-close ha-icon {
          --mdc-icon-size: 20px;
        }

        .modal-body {
          padding: 18px;
          overflow-y: auto;
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .modal-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .modal-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--secondary-text-color);
        }

        .modal-input {
          width: 100%;
          padding: 9px 12px;
          border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
          border-radius: 8px;
          background: var(--secondary-background-color, #f5f5f5);
          color: var(--primary-text-color);
          font-size: 14px;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s;
        }
        .modal-input:focus {
          border-color: var(--primary-color);
        }

        .no-automations {
          font-size: 13px;
          color: var(--secondary-text-color);
          text-align: center;
          padding: 8px 0;
        }

        .add-row-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: 1px solid var(--primary-color, #03a9f4);
          border-radius: 6px;
          color: var(--primary-color);
          font-size: 13px;
          font-weight: 500;
          padding: 4px 10px;
          cursor: pointer;
          transition: background 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .add-row-btn:hover {
          background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        }
        .add-row-btn ha-icon {
          --mdc-icon-size: 16px;
        }

        .delete-row-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          color: var(--secondary-text-color);
          transition: color 0.2s, background 0.2s;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .delete-row-btn:hover {
          color: var(--error-color, #f44336);
          background: rgba(244, 67, 54, 0.08);
        }
        .delete-row-btn ha-icon {
          --mdc-icon-size: 18px;
        }

        /* ── Scene light cards ──── */
        .scene-light-card {
          padding: 10px 12px;
          border-radius: 8px;
          background: var(--secondary-background-color, rgba(255,255,255,0.04));
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .scene-light-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: nowrap;
        }
        .scene-light-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .scene-light-controls smartvanio-select {
          flex: 1;
          min-width: 120px;
        }

        .scene-light-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        .scene-state-btn {
          padding: 4px 10px;
          border-radius: 12px;
          border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.15));
          background: var(--secondary-background-color, #f5f5f5);
          color: var(--secondary-text-color);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .scene-state-btn.on {
          background: color-mix(in srgb, var(--primary-color) 15%, transparent);
          border-color: var(--primary-color);
          color: var(--primary-color);
        }

        .scene-light-bri {
          flex: 1;
          min-width: 60px;
        }

        .scene-light-color {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
        }

        .seg-color-input {
          width: 36px;
          height: 36px;
          padding: 2px;
          border: none;
          border-radius: 6px;
          background: transparent;
          cursor: pointer;
        }

        /* ── Modal footer ──── */
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 14px 18px;
          border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
          flex-shrink: 0;
        }

        .modal-btn {
          padding: 9px 20px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, opacity 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .modal-btn.cancel {
          background: var(--secondary-background-color, #f0f0f0);
          color: var(--primary-text-color);
        }
        .modal-btn.cancel:hover {
          background: var(--divider-color);
        }
        .modal-btn.save {
          background: var(--primary-color, #03a9f4);
          color: white;
        }
        .modal-btn.save:hover {
          opacity: 0.88;
        }
        .modal-btn[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .modal-btn.delete {
          background: none;
          border: 1px solid var(--error-color, #f44336);
          color: var(--error-color, #f44336);
          margin-right: auto;
        }
        .modal-btn.delete:hover {
          background: rgba(244, 67, 54, 0.08);
        }
      `]}});customElements.define("smartvanio-modal-device",class extends nt{static get properties(){return{hass:{type:Object},device:{type:Object},deviceId:{type:String,attribute:"device-id"},entities:{type:Array},inCardEids:{type:Object},slots:{type:Object},_tab:{type:String,state:!0},_calTab:{type:String,state:!0},_calData:{type:Object,state:!0},_calSaving:{type:Boolean,state:!0},_calNames:{type:Object,state:!0},_renamingSensor:{type:String,state:!0}}}constructor(){super(),this.entities=[],this.inCardEids=new Set,this.slots={},this._tab="entities",this._calTab="",this._calData={},this._calSaving=!1,this._calNames={},this._renamingSensor=null}_emit(t,e={}){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}_getResistiveSensors(){const t=[];for(const e of this.entities){const i=e.eid,s=i.match(/sensor\.(.+?)_(sensor_\d+)_raw$/);if(!s)continue;const r=s[1],a=s[2],n=`sensor.${r}_${a}_interpolated_value`,o=this.hass?.states[n],l=o?.attributes??{},d=this.hass?.entities?.[n],c=`Sensor ${a.replace("sensor_","")}`,p=d?.name||l.friendly_name||c,h=this._parsePoints(null!=l.calibration_points?JSON.stringify(l.calibration_points):null),u=l.calibration_kind??"linear",g=this.deviceId||"",m=`${g}/text/${a}_interpolation_points/command`,v=`${g}/select/${a}_interpolation_kind/command`;t.push({key:a,label:p,defaultLabel:c,rawEid:i,interpEid:n,pointsCommandTopic:m,kindCommandTopic:v,rawValue:parseFloat(e.state?.state??0),currentPoints:h,currentKind:u})}return t}_parsePoints(t){if(!t)return[[0,0],[3.3,100]];try{const e=JSON.parse(t);if(Array.isArray(e)&&e.length>=2)return e}catch{}return[[0,0],[3.3,100]]}resetCalData(){this._calData={},this._calNames={},this._calTab=""}_ensureCalData(t){let e=!1;const i={...this._calData},s={...this._calNames};for(const r of t)i[r.key]||(i[r.key]={points:r.currentPoints.map(t=>[...t]),kind:r.currentKind},e=!0),void 0===s[r.key]&&(s[r.key]=r.label,e=!0);e&&(this._calData=i,this._calNames=s),!this._calTab&&t.length&&(this._calTab=t[0].key)}_updateCalPoint(t,e,i,s){const r={...this._calData},a={...r[t]},n=a.points.map(t=>[...t]);n[e][i]=parseFloat(s),a.points=n,r[t]=a,this._calData=r}_captureVoltage(t,e,i){const s={...this._calData},r={...s[t]},a=r.points.map(t=>[...t]);a[e][0]=i,r.points=a,s[t]=r,this._calData=s}_addCalPoint(t){const e={...this._calData},i={...e[t]};i.points=[...i.points,[0,0]],e[t]=i,this._calData=e}_removeCalPoint(t,e){const i={...this._calData},s={...i[t]};s.points=s.points.filter((t,i)=>i!==e),i[t]=s,this._calData=i}_updateCalKind(t,e){const i={...this._calData};i[t]={...i[t],kind:e},this._calData=i}_updateCalName(t,e){this._calNames={...this._calNames,[t]:e}}async _mqttPublish(t,e){await this.hass.callService("mqtt","publish",{topic:t,payload:e,retain:!1})}async _saveCalibration(){this._calSaving=!0;const t=this._getResistiveSensors();try{for(const e of t){const t=this._calData[e.key];if(!t)continue;const i=[...t.points].sort((t,e)=>t[0]-e[0]);e.pointsCommandTopic&&await this._mqttPublish(e.pointsCommandTopic,JSON.stringify(i)),e.kindCommandTopic&&await this._mqttPublish(e.kindCommandTopic,t.kind);const s=(this._calNames[e.key]??"").trim(),r=this.hass?.entities?.[e.interpEid]?.name;s&&s!==e.label&&s!==r&&await this.hass.callWS({type:"config/entity_registry/update",entity_id:e.interpEid,name:s})}}catch(t){console.error("SmartVan: failed to save calibration",t)}finally{this._calSaving=!1}}_defaultDomainIcon(t){return{light:"mdi:lightbulb",switch:"mdi:toggle-switch",sensor:"mdi:eye",binary_sensor:"mdi:door-open",number:"mdi:numeric",select:"mdi:form-dropdown",scene:"mdi:palette",script:"mdi:script-text"}[t]??"mdi:puzzle"}_label(t){return this.hass?.entities?.[t]?.name||this.hass?.states[t]?.attributes?.friendly_name||t.split(".").pop()}render(){if(!this.device)return j``;const t=this.device.name_by_user??this.device.name??"Unknown",e=this._getResistiveSensors();this._ensureCalData(e);const i=[{id:"entities",label:"Entities"}];return e.length>0&&i.push({id:"calibration",label:"Calibration"}),j`
      <div class="modal-overlay" @click=${t=>{t.target===t.currentTarget&&this._emit("smartvanio-device-modal-close")}}>
        <div class="modal">
          <div class="modal-header">
            <span>${t}</span>
            <button class="modal-close" @click=${()=>this._emit("smartvanio-device-modal-close")}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>

          ${i.length>1?j`
            <div class="tab-bar">
              ${i.map(t=>j`
                <button class="tab-btn ${this._tab===t.id?"active":""}"
                  @click=${()=>{this._tab=t.id}}>
                  ${t.label}
                </button>
              `)}
            </div>
          `:""}

          <div class="modal-body">
            ${"entities"===this._tab?this._renderEntitiesTab():""}
            ${"calibration"===this._tab?this._renderCalibrationTab(e):""}
          </div>
        </div>
      </div>
    `}_renderEntitiesTab(){const t=this.entities.filter(t=>this.inCardEids.has(t.eid)),e=this.entities.filter(t=>!this.inCardEids.has(t.eid));return j`
      ${t.length?j`
        <div class="ent-section">
          <div class="ent-label">In card</div>
          ${t.map(t=>this._renderEntity(t,!0))}
        </div>
      `:""}
      ${e.length?j`
        <div class="ent-section">
          <div class="ent-label">Available</div>
          ${e.map(t=>this._renderEntity(t,!1))}
        </div>
      `:""}
      ${t.length||e.length?"":j`
        <div class="empty-msg">No entities found for this device.</div>
      `}
    `}_renderEntity(t,e){const i=t.eid.split(".")[0],s=t.state.attributes?.icon??this._defaultDomainIcon(i),r=this._label(t.eid),a=t.state.state,n="unavailable"===a,o=t.state.attributes?.unit_of_measurement??"";return j`
      <div class="ent-row ${e?"in-card":""} ${n?"unavail":""}">
        <ha-icon icon="${s}" style="--mdc-icon-size:16px"></ha-icon>
        <span class="ent-name" title="${t.eid}">${r}</span>
        <span class="ent-state">${n?"N/A":a}${o&&!n?" "+o:""}</span>
        ${e?j`<span class="ent-action remove" title="Remove from card"
              @click=${()=>this._emit("smartvanio-device-remove-entity",{eid:t.eid,domain:i})}>
              <ha-icon icon="mdi:close" style="--mdc-icon-size:14px"></ha-icon>
            </span>`:j`<span class="ent-action add" title="Add to card"
              @click=${()=>this._emit("smartvanio-device-add-entity",{eid:t.eid,domain:i})}>
              <ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon>
            </span>`}
      </div>
    `}_renderCalibrationTab(t){const e=t.find(t=>t.key===this._calTab)??t[0];return e?j`
      ${t.length>1?j`
        <div class="cal-tabs">
          ${t.map(t=>j`
            <button class="cal-tab ${this._calTab===t.key?"active":""}"
              @click=${()=>{this._calTab=t.key}}>
              ${this._calNames[t.key]||t.defaultLabel}
            </button>
          `)}
        </div>
      `:""}
      ${this._renderSensorCalibration(e)}
      <div class="cal-footer">
        <button class="modal-btn save" ?disabled=${this._calSaving}
          @click=${()=>this._saveCalibration()}>
          ${this._calSaving?"Saving...":"Save Calibration"}
        </button>
      </div>
    `:j`<div class="empty-msg">No sensors found.</div>`}_renderSensorCalibration(t){const e=this._calData[t.key]??{points:[],kind:"linear"},i=parseFloat(this.hass?.states[t.rawEid]?.state??0),s=this.hass?.states[t.interpEid],r=s?.state??"—",a=this._calNames[t.key]??t.label;return j`
      <div class="cal-sensor">
        <div class="cal-sensor-header">
          <div class="cal-name-row">
            <label class="cal-name-label">Name</label>
            <input type="text" class="cal-name-input"
              .value=${a}
              @input=${e=>this._updateCalName(t.key,e.target.value)}
              placeholder="${t.defaultLabel}"
            />
          </div>
          <div class="cal-live-values">
            <div class="cal-live-item">
              <span class="cal-live-label">Raw</span>
              <span class="cal-live-value">${i.toFixed(3)} V</span>
            </div>
            <div class="cal-live-item">
              <span class="cal-live-label">Value</span>
              <span class="cal-live-value interp">${r}</span>
            </div>
          </div>
        </div>

        <div class="cal-table">
          <div class="cal-header-row">
            <span class="cal-col-hdr">Voltage (V)</span>
            <span class="cal-col-hdr">Mapped Value</span>
            <span></span><span></span>
          </div>

          ${e.points.map((e,s)=>j`
            <div class="cal-row">
              <input type="number" class="cal-input" min="0" max="5" step="0.001"
                .value=${String(e[0])}
                @change=${e=>this._updateCalPoint(t.key,s,0,e.target.value)}
              />
              <input type="number" class="cal-input" min="0" step="1"
                .value=${String(e[1])}
                @change=${e=>this._updateCalPoint(t.key,s,1,e.target.value)}
              />
              <button class="capture-btn" title="Capture current voltage"
                @click=${()=>this._captureVoltage(t.key,s,i)}>
                <ha-icon icon="mdi:crosshairs-gps"></ha-icon>
              </button>
              <button class="delete-row-btn" title="Remove point"
                @click=${()=>this._removeCalPoint(t.key,s)}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
          `)}
        </div>

        <button class="add-row-btn" @click=${()=>this._addCalPoint(t.key)}>
          <ha-icon icon="mdi:plus"></ha-icon> Add Point
        </button>

        <div class="cal-kind-row">
          <label class="cal-kind-label">Interpolation</label>
          <smartvanio-select
            .value=${e.kind}
            .options=${[{value:"linear",label:"Linear"},{value:"cubic",label:"Cubic"},{value:"quadratic",label:"Quadratic"},{value:"slinear",label:"Smooth Linear"}]}
            @smartvanio-change=${e=>this._updateCalKind(t.key,e.detail.value)}
          ></smartvanio-select>
        </div>
      </div>
    `}static get styles(){return a`
      :host { display: block; }

      .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 16px;
      }

      .modal {
        background: var(--card-background-color, #fff);
        border-radius: 16px;
        width: 100%;
        max-width: 680px;
        max-height: 88dvh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        overflow: hidden;
      }

      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 22px;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
        font-size: 17px;
        font-weight: 600;
        color: var(--primary-text-color);
        flex-shrink: 0;
      }

      .modal-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 6px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        color: var(--secondary-text-color);
        transition: color 0.2s;
        -webkit-tap-highlight-color: transparent;
      }
      .modal-close:hover { color: var(--primary-text-color); }
      .modal-close ha-icon { --mdc-icon-size: 22px; }

      /* ── Top-level tabs ──���─ */
      .tab-bar {
        display: flex;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
        padding: 0 22px;
        flex-shrink: 0;
      }

      .tab-btn {
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        padding: 12px 18px;
        font-size: 14px;
        font-weight: 500;
        color: var(--secondary-text-color);
        cursor: pointer;
        transition: color 0.2s, border-color 0.2s;
        -webkit-tap-highlight-color: transparent;
      }
      .tab-btn.active {
        color: var(--primary-color, #03a9f4);
        border-bottom-color: var(--primary-color, #03a9f4);
      }
      .tab-btn:hover:not(.active) {
        color: var(--primary-text-color);
      }

      /* ── Body ──── */
      .modal-body {
        padding: 18px 22px;
        overflow-y: auto;
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .empty-msg {
        text-align: center;
        color: var(--secondary-text-color);
        font-size: 14px;
        padding: 24px 0;
      }

      /* ── Entity rows ──── */
      .ent-section {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .ent-label {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
        opacity: 0.7;
      }

      .ent-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border-radius: 8px;
        font-size: 13px;
        color: var(--secondary-text-color);
        transition: background 0.15s;
      }
      .ent-row:hover { background: var(--secondary-background-color); }
      .ent-row.in-card { color: var(--primary-text-color); }
      .ent-row.unavail { opacity: 0.4; }

      .ent-name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }

      .ent-state {
        font-size: 12px;
        color: var(--secondary-text-color);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        opacity: 0.6;
      }

      .ent-action {
        cursor: pointer;
        opacity: 0.4;
        transition: opacity 0.15s, color 0.15s;
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }
      .ent-action:hover { opacity: 1; }
      .ent-action.add { color: var(--success-color, #4caf50); }
      .ent-action.remove { color: var(--error-color, #f44336); }

      /* ── Calibration sensor tabs ──── */
      .cal-tabs {
        display: flex;
        gap: 6px;
        flex-shrink: 0;
      }

      .cal-tab {
        flex: 1;
        background: var(--secondary-background-color, #f5f5f5);
        border: 2px solid transparent;
        border-radius: 10px;
        padding: 10px 14px;
        font-size: 14px;
        font-weight: 500;
        color: var(--secondary-text-color);
        cursor: pointer;
        transition: border-color 0.2s, color 0.2s, background 0.2s;
        text-align: center;
        -webkit-tap-highlight-color: transparent;
      }
      .cal-tab.active {
        border-color: var(--primary-color, #03a9f4);
        color: var(--primary-color, #03a9f4);
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, var(--secondary-background-color, #f5f5f5));
      }
      .cal-tab:hover:not(.active) {
        color: var(--primary-text-color);
      }

      /* ── Calibration panel ──── */
      .cal-sensor {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .cal-sensor-header {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .cal-name-row {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .cal-name-label {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--secondary-text-color);
      }

      .cal-name-input {
        width: 100%;
        padding: 9px 12px;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 8px;
        background: var(--secondary-background-color, #f5f5f5);
        color: var(--primary-text-color);
        font-size: 14px;
        box-sizing: border-box;
        outline: none;
        transition: border-color 0.2s;
      }
      .cal-name-input:focus { border-color: var(--primary-color); }

      .cal-live-values {
        display: flex;
        gap: 16px;
      }

      .cal-live-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        background: var(--secondary-background-color, #f5f5f5);
        border-radius: 8px;
      }

      .cal-live-label {
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
      }

      .cal-live-value {
        font-size: 14px;
        font-weight: 700;
        color: var(--primary-color);
        font-variant-numeric: tabular-nums;
      }
      .cal-live-value.interp {
        color: var(--success-color, #4caf50);
      }

      /* ── Calibration table ──── */
      .cal-table {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .cal-header-row {
        display: grid;
        grid-template-columns: 1fr 1fr 44px 44px;
        gap: 8px;
        padding: 0 2px;
      }

      .cal-col-hdr {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--secondary-text-color);
      }

      .cal-row {
        display: grid;
        grid-template-columns: 1fr 1fr 44px 44px;
        gap: 8px;
        align-items: center;
      }

      .cal-input {
        width: 100%;
        padding: 9px 12px;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 8px;
        background: var(--secondary-background-color, #f5f5f5);
        color: var(--primary-text-color);
        font-size: 14px;
        box-sizing: border-box;
        outline: none;
        transition: border-color 0.2s;
      }
      .cal-input:focus { border-color: var(--primary-color); }

      .capture-btn {
        width: 44px;
        height: 44px;
        background: none;
        border: 1px solid var(--primary-color);
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-color);
        transition: background 0.15s;
        flex-shrink: 0;
        -webkit-tap-highlight-color: transparent;
      }
      .capture-btn:hover {
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
      }
      .capture-btn ha-icon { --mdc-icon-size: 20px; }

      .delete-row-btn {
        width: 44px;
        height: 44px;
        background: none;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--error-color, #f44336);
        opacity: 0.6;
        transition: opacity 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .delete-row-btn:hover { opacity: 1; }
      .delete-row-btn ha-icon { --mdc-icon-size: 20px; }

      .add-row-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        background: none;
        border: 1px solid var(--primary-color, #03a9f4);
        border-radius: 10px;
        color: var(--primary-color);
        font-size: 14px;
        font-weight: 500;
        padding: 10px 16px;
        cursor: pointer;
        transition: background 0.15s;
        align-self: flex-start;
        -webkit-tap-highlight-color: transparent;
      }
      .add-row-btn:hover {
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
      }
      .add-row-btn ha-icon { --mdc-icon-size: 18px; }

      .cal-kind-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 4px;
      }

      .cal-kind-label {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .cal-footer {
        display: flex;
        justify-content: flex-end;
        padding-top: 4px;
      }

      .modal-btn {
        padding: 12px 28px;
        border-radius: 10px;
        border: none;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.15s, opacity 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .modal-btn.save {
        background: var(--primary-color, #03a9f4);
        color: white;
      }
      .modal-btn.save:hover { opacity: 0.88; }
      .modal-btn[disabled] { opacity: 0.5; cursor: not-allowed; }
    `}});
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ja=ht(class extends ut{constructor(t){if(super(t),t.type!==ct&&t.type!==lt&&t.type!==pt)throw Error("The `live` directive is not allowed on child or event bindings");if(!gt(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[e]){if(e===G||e===q)return e;const i=t.element,s=t.name;if(t.type===ct){if(e===i[s])return G}else if(t.type===pt){if(!!e===i.hasAttribute(s))return G}else if(t.type===lt&&i.getAttribute(s)===e+"")return G;return((t,e=mt)=>{t._$AH=e})(t),e}});customElements.define("smartvanio-tile-light",class extends nt{static get properties(){return{hass:{type:Object},entityId:{type:String,attribute:"entity-id"},editMode:{type:Boolean,attribute:"edit-mode"},deviceId:{type:String,attribute:"device-id"},_dragState:{type:Object,state:!0},_expandedSegColor:{type:String,state:!0}}}constructor(){super(),this._dragState=new Map,this._expandedSegColor=null,this._sendThrottle=new Map}disconnectedCallback(){super.disconnectedCallback();for(const t of this._sendThrottle.values())t.pending&&clearTimeout(t.pending);this._sendThrottle.clear()}_throttledSendBrightness(t,e){const i=performance.now();let s=this._sendThrottle.get(t);s||(s={lastSent:0,pending:null,pendingValue:e},this._sendThrottle.set(t,s)),s.pendingValue=e;const r=i-s.lastSent;if(r>=150)return s.pending&&(clearTimeout(s.pending),s.pending=null),s.lastSent=i,void this._setBrightness(t,e);s.pending||(s.pending=setTimeout(()=>{const e=this._sendThrottle.get(t);e&&(e.lastSent=performance.now(),e.pending=null,this._setBrightness(t,e.pendingValue))},150-r))}_flushBrightness(t,e){const i=this._sendThrottle.get(t);i?.pending&&(clearTimeout(i.pending),i.pending=null),i&&(i.lastSent=performance.now()),this._setBrightness(t,e)}_lightIsOn(t){return"on"===this.hass.states[t]?.state}_lightRgb(t){return this.hass.states[t]?.attributes?.rgb_color??[255,255,255]}_lightSupRgb(t){return this.hass.states[t]?.attributes?.supported_color_modes?.includes("rgb")??!1}_lightBrightness(t){const e=this._dragState.get(t);if(e?.active)return e.brightness;const i=parseFloat(localStorage.getItem(`smartvanio_bri_${t}`));if(!isNaN(i))return i;const s=this.hass.states[t];return s?.attributes?.brightness??s?.attributes?.last_brightness??255}_persistBrightness(t,e){localStorage.setItem(`smartvanio_bri_${t}`,e)}_lightPct(t){return Math.round(this._lightBrightness(t)/255*100)}_toggleLight(t){this.hass.callService("light","toggle",{entity_id:t})}_setBrightness(t,e){this.hass.callService("light","turn_on",{entity_id:t,brightness:Math.round(e)})}_setColor(t,e,i,s){this.hass.callService("light","turn_on",{entity_id:t,rgb_color:[e,i,s]})}_onSliderInput(t,e){const i=e.target.value/100*255;this._dragState=new Map(this._dragState).set(t,{active:!0,brightness:i}),this._updateSliderFill(e.target),this._throttledSendBrightness(t,i)}_onSliderChange(t,e){const i=e.target.value/100*255;this._dragState=new Map(this._dragState).set(t,{active:!1,brightness:i}),this._persistBrightness(t,i),this._flushBrightness(t,i)}_updateSliderFill(t){const e=t.value,i=t.style.getPropertyValue("--sc")||"var(--primary-color)";t.style.background=`linear-gradient(to right, ${i} 0%, ${i} ${e}%, var(--slider-track, #e0e0e0) ${e}%, var(--slider-track, #e0e0e0) 100%)`}_emitEdit(){this.dispatchEvent(new CustomEvent("smartvanio-edit-entity",{detail:{entity_id:this.entityId},bubbles:!0,composed:!0}))}_renderSegCtrlRow(t){const[e,i,s]=t.attributes.rgb_color??[255,255,255],r=this._lightBrightness(t.entity_id),a=Math.round(r/255*100),n=this.hass.entities?.[t.entity_id]?.name||t.attributes.friendly_name||"Segment",o="on"===t.state,l=this._expandedSegColor===t.entity_id,d=o?`rgb(${e},${i},${s})`:`rgba(${e},${i},${s},0.35)`,c=`linear-gradient(to right, ${d} 0%, ${d} ${a}%, var(--slider-track,#e0e0e0) ${a}%, var(--slider-track,#e0e0e0) 100%)`;return j`
      <div class="seg-ctrl-row ${o?"on":""}">
        <button
          class="seg-ctrl-toggle ${o?"on":""}"
          style="${o?`background:rgba(${e},${i},${s},0.2); color:rgb(${e},${i},${s})`:""}"
          @click=${e=>{e.stopPropagation(),this.hass.callService("light","toggle",{entity_id:t.entity_id})}}
        ><ha-icon icon="mdi:power"></ha-icon></button>
        <span class="seg-ctrl-name">${n}</span>
        <input
          type="range"
          min="1"
          max="100"
          .value=${this._dragState.get(t.entity_id)?.active?q:ja(a)}
          class="br-slider seg-ctrl-bri"
          style="--sc:rgb(${e},${i},${s}); background:${c}"
          @input=${e=>this._onSliderInput(t.entity_id,e)}
          @change=${e=>this._onSliderChange(t.entity_id,e)}
        />
        <button
          class="seg-ctrl-color-btn"
          style="background:rgb(${e},${i},${s}); ${l?"outline:2px solid var(--primary-color)":""}"
          title="Change colour"
          @click=${e=>{e.stopPropagation(),this._expandedSegColor=l?null:t.entity_id}}
        ></button>
      </div>
      ${l?j`
            <div class="seg-ctrl-colors">
              ${Ca.map(e=>j`
                  <button
                    class="color-dot"
                    style="background:rgb(${e.r},${e.g},${e.b})"
                    title="${e.name}"
                    @click=${i=>{i.stopPropagation(),this._setColor(t.entity_id,e.r,e.g,e.b),this._expandedSegColor=null}}
                  ></button>
                `)}
            </div>
          `:""}
    `}render(){if(!this.hass||!this.entityId)return j``;const t=this.entityId,e=this._lightIsOn(t),[i,s,r]=this._lightRgb(t),a=this._lightPct(t),n=this._lightSupRgb(t),o=this.hass.entities?.[t]?.name||this.hass.states[t]?.attributes?.friendly_name||t.split(".").pop(),l=e?`rgba(${i},${s},${r},0.4)`:"transparent",d=e?`rgb(${i},${s},${r})`:"var(--secondary-text-color, #888)",c=e?`linear-gradient(to right, rgb(${i},${s},${r}) 0%, rgb(${i},${s},${r}) ${a}%, var(--slider-track,#e0e0e0) ${a}%, var(--slider-track,#e0e0e0) 100%)`:"",p=Object.values(this.hass.states).filter(e=>e.entity_id.startsWith("light.")&&e.attributes?.smartvanio_parent_entity_id===t).sort((t,e)=>(t.attributes.segment_start??0)-(e.attributes.segment_start??0));return j`
      <div
        class="light-tile ${e?"on":""} ${this.editMode?"editable":""}"
        data-eid="${t}"
      >
        <div
          class="lt-header"
          @click=${()=>this.editMode?this._emitEdit():this._toggleLight(t)}
        >
          <div class="lt-icon" style="--glow:${l}; --ic:${d}">
            <ha-icon icon="mdi:lightbulb${e?"-on":"-outline"}"></ha-icon>
          </div>
          <div class="lt-info">
            <div class="lt-name">${o}</div>
            <div class="lt-state">${e?`${a}%`:"Off"}</div>
          </div>
          ${this.editMode?j`<ha-icon class="tile-edit-icon" icon="mdi:pencil-outline"></ha-icon>`:j`<div class="toggle ${e?"on":""}">
                <div class="toggle-dot"></div>
              </div>`}
        </div>

        ${this.editMode?j`
              ${p.length?j`
                    <div class="seg-edit-list">
                      ${p.map(t=>{const[e,i,s]=t.attributes.rgb_color??[255,255,255],r="on"===t.state?(t.attributes.brightness??255)/255:.3,a=this.hass.entities?.[t.entity_id]?.name||t.attributes.friendly_name||t.entity_id,n=t.attributes.segment_start??0,o=t.attributes.segment_end??0,l="on"===t.state;return j`
                          <div
                            class="seg-row ${l?"on":""}"
                            @click=${e=>{e.stopPropagation(),this.hass.callService("light",l?"turn_off":"turn_on",{entity_id:t.entity_id})}}
                          >
                            <span
                              class="seg-row-swatch"
                              style="background:rgba(${e},${i},${s},${r})"
                            ></span>
                            <span class="seg-row-name">${a}</span>
                            <span class="seg-row-range">${n}–${o}</span>
                            <ha-icon
                              class="seg-row-toggle-icon"
                              icon="mdi:power${l?"":"-off"}"
                            ></ha-icon>
                          </div>
                        `})}
                    </div>
                  `:""}
            `:j`
              <div class="lt-controls">
                <input
                  type="range"
                  min="1"
                  max="100"
                  .value=${this._dragState.get(t)?.active?q:ja(a)}
                  @input=${e=>{if(p.length){const i=e.target.value/100*255,s=new Map(this._dragState);s.set(t,{active:!0,brightness:i}),p.forEach(t=>{s.set(t.entity_id,{active:!0,brightness:i}),this._throttledSendBrightness(t.entity_id,i)}),this._dragState=s,this._updateSliderFill(e.target)}else this._onSliderInput(t,e)}}
                  @change=${e=>{if(p.length){const i=e.target.value/100*255,s=new Map(this._dragState);s.set(t,{active:!1,brightness:i}),this._persistBrightness(t,i),p.forEach(t=>{s.set(t.entity_id,{active:!1,brightness:i}),this._persistBrightness(t.entity_id,i),this._flushBrightness(t.entity_id,i)}),this._dragState=s}else this._onSliderChange(t,e)}}
                  class="br-slider"
                  style="--sc:rgb(${i},${s},${r}); background:${c}"
                />
                ${n?j`
                      ${p.length?j`
                            <div class="seg-ctrl-list">
                              ${p.map(t=>this._renderSegCtrlRow(t))}
                            </div>
                          `:j`
                            <div class="color-row">
                              ${Ca.map(e=>j`
                                  <button
                                    class="color-dot"
                                    style="background:rgb(${e.r},${e.g},${e.b})"
                                    title="${e.name}"
                                    @click=${()=>this._setColor(t,e.r,e.g,e.b)}
                                  ></button>
                                `)}
                            </div>
                          `}
                    `:""}
              </div>
            `}
      </div>
    `}static get styles(){return[Aa,a`
        :host {
          display: block;
          --slider-track: var(--secondary-background-color, #e0e0e0);
        }

        .light-tile {
          background: var(--tile-bg, var(--card-background-color, #fff));
          border: 1px solid var(--tile-border, var(--divider-color, rgba(0,0,0,0.08)));
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .light-tile.on {
          border-color: var(--primary-color, #03a9f4);
        }

        .lt-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .lt-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: color-mix(in srgb, var(--ic) 12%, transparent);
          box-shadow: 0 0 12px var(--glow);
          transition: all 0.3s;
        }

        .lt-icon ha-icon {
          --mdc-icon-size: 20px;
          color: var(--ic);
          transition: color 0.3s;
        }

        .lt-info {
          flex: 1;
          min-width: 0;
        }

        .lt-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .lt-state {
          font-size: 12px;
          color: var(--secondary-text-color);
          margin-top: 1px;
        }

        .lt-controls {
          padding: 0 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* ── Colour presets ──── */
        .color-row {
          display: flex;
          gap: 7px;
          justify-content: center;
        }

        .color-dot {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2px solid var(--tile-border, var(--divider-color, rgba(0,0,0,0.08)));
          padding: 0;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        .color-dot:active {
          transform: scale(1.2);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        }

        /* ── Inline segment controls ──── */
        .seg-ctrl-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 6px;
        }

        .seg-ctrl-row {
          display: grid;
          grid-template-columns: 28px 1fr minmax(60px, 1fr) 22px;
          align-items: center;
          gap: 6px;
          padding: 3px 0;
        }

        .seg-ctrl-toggle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--divider-color, rgba(0,0,0,0.1));
          color: var(--secondary-text-color, #888);
          flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
          -webkit-tap-highlight-color: transparent;
        }

        .seg-ctrl-toggle ha-icon {
          --mdc-icon-size: 15px;
        }

        .seg-ctrl-name {
          font-size: 12px;
          font-weight: 500;
          color: var(--primary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .seg-ctrl-bri {
          width: 100%;
        }

        .seg-ctrl-color-btn {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid rgba(0,0,0,0.15);
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.15s;
          -webkit-tap-highlight-color: transparent;
        }

        .seg-ctrl-color-btn:hover {
          transform: scale(1.15);
        }

        .seg-ctrl-colors {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 4px 2px 4px 34px;
        }

        /* ── Segment rows in edit mode tile ──── */
        .seg-edit-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px 10px 6px;
        }

        .seg-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 6px;
          border-radius: 6px;
          cursor: pointer;
          transition: opacity 0.15s;
          background: var(--secondary-background-color, #f5f5f5);
        }

        .seg-row.on {
          background: color-mix(
            in srgb,
            var(--primary-color, #03a9f4) 10%,
            var(--secondary-background-color, #f5f5f5)
          );
        }

        .seg-row-swatch {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          flex-shrink: 0;
          border: 1px solid rgba(0, 0, 0, 0.15);
        }

        .seg-row-name {
          flex: 1;
          font-size: 12px;
          color: var(--primary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .seg-row-range {
          font-size: 11px;
          color: var(--secondary-text-color, #888);
          flex-shrink: 0;
        }

        .seg-row:hover {
          opacity: 0.8;
        }

        .seg-row-toggle-icon {
          --mdc-icon-size: 14px;
          color: var(--secondary-text-color, #888);
          flex-shrink: 0;
        }

        .seg-row.on .seg-row-toggle-icon {
          color: var(--primary-color, #03a9f4);
        }
      `]}});customElements.define("smartvanio-tile-switch",class extends nt{static get properties(){return{hass:{type:Object},entityId:{type:String,attribute:"entity-id"},editMode:{type:Boolean,attribute:"edit-mode"},icon:{type:String},label:{type:String}}}constructor(){super(),this.icon="mdi:electric-switch"}_emitEdit(){this.dispatchEvent(new CustomEvent("smartvanio-edit-entity",{detail:{entity_id:this.entityId},bubbles:!0,composed:!0}))}_toggle(){const t="on"===this.hass.states[this.entityId]?.state;this.hass.callService("switch",t?"turn_off":"turn_on",{entity_id:this.entityId})}render(){if(!this.hass||!this.entityId)return j``;const t="on"===this.hass.states[this.entityId]?.state,e=this.label||this.hass.entities?.[this.entityId]?.name||this.hass.states[this.entityId]?.attributes?.friendly_name||this.entityId.split(".").pop();return j`
      <div
        class="switch-tile ${t?"on":""} ${this.editMode?"editable":""}"
        data-eid="${this.entityId}"
        @click=${()=>this.editMode?this._emitEdit():this._toggle()}
      >
        <ha-icon icon="${this.icon}" class="sw-icon"></ha-icon>
        <span class="sw-label">${e}</span>
        ${this.editMode?j`<ha-icon class="tile-edit-icon" icon="mdi:pencil-outline"></ha-icon>`:j`<div class="toggle ${t?"on":""}">
              <div class="toggle-dot"></div>
            </div>`}
      </div>
    `}static get styles(){return[Aa,a`
        :host { display: block; }

        .switch-tile {
          background: var(--tile-bg, var(--card-background-color, #fff));
          border: 1px solid var(--tile-border, var(--divider-color, rgba(0,0,0,0.08)));
          border-radius: 12px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          transition: border-color 0.2s;
        }

        .switch-tile.on {
          border-color: var(--primary-color, #03a9f4);
        }

        .sw-icon {
          --mdc-icon-size: 22px;
          color: var(--secondary-text-color);
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .switch-tile.on .sw-icon {
          color: var(--primary-color, #03a9f4);
        }

        .sw-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-text-color);
          flex: 1;
        }
      `]}});customElements.define("smartvanio-tile-tank",class extends nt{static get properties(){return{hass:{type:Object},entityId:{type:String,attribute:"entity-id"},editMode:{type:Boolean,attribute:"edit-mode"},label:{type:String}}}_emitEdit(){this.dispatchEvent(new CustomEvent("smartvanio-edit-entity",{detail:{entity_id:this.entityId},bubbles:!0,composed:!0}))}render(){if(!this.hass||!this.entityId)return j``;const t=this.entityId,e=this.label||this.hass.entities?.[t]?.name||this.hass.states[t]?.attributes?.friendly_name||t.split(".").pop(),i=function(t,e){return Ea.find(e=>t.includes(e.keyword))??{label:e,icon:"mdi:gauge",color:"var(--primary-color)"}}(t,e),s=this.hass.states[t],r=parseFloat(s?.state??"0"),a=isNaN(r)?0:r,n=s?.attributes?.unit_of_measurement??"%",o=void 0!==i.warnBelow&&a<=i.warnBelow||void 0!==i.warnAbove&&a>=i.warnAbove,l=o?"var(--error-color, #f44336)":i.color;return j`
      <div
        class="tank ${this.editMode?"editable":""}"
        data-eid="${t}"
        @click=${this.editMode?()=>this._emitEdit():void 0}
      >
        <div class="tank-top">
          <ha-icon icon="${i.icon}" style="color:${l}"></ha-icon>
          <span class="tank-label">${e}</span>
          ${this.editMode?j`<ha-icon class="tile-edit-icon" icon="mdi:pencil-outline"></ha-icon>`:j`<span class="tank-pct ${o?"warn":""}">${Math.round(a)}${n}</span>`}
        </div>
        <div class="tank-track">
          <div
            class="tank-fill"
            style="width:${Math.min(100,Math.max(0,a))}%; background:${l}"
          ></div>
        </div>
      </div>
    `}static get styles(){return[Aa,a`
        :host { display: block; }

        .tank {
          background: var(--tile-bg, var(--card-background-color, #fff));
          border: 1px solid var(--tile-border, var(--divider-color, rgba(0,0,0,0.08)));
          border-radius: 12px;
          padding: 12px 12px 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tank-top {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tank-top ha-icon {
          --mdc-icon-size: 18px;
          flex-shrink: 0;
        }

        .tank-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--primary-text-color);
          flex: 1;
        }

        .tank-pct {
          font-size: 14px;
          font-weight: 700;
          color: var(--primary-text-color);
        }

        .tank-pct.warn {
          color: var(--error-color, #f44336);
        }

        .tank-track {
          height: 8px;
          border-radius: 4px;
          background: var(--slider-track, var(--secondary-background-color, #e0e0e0));
          overflow: hidden;
        }

        .tank-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }
      `]}});customElements.define("smartvanio-tile-binary-sensor",class extends nt{static get properties(){return{hass:{type:Object},entityId:{type:String,attribute:"entity-id"},editMode:{type:Boolean,attribute:"edit-mode"},variant:{type:String},deviceId:{type:String,attribute:"device-id"},channel:{type:String}}}constructor(){super(),this.variant="door"}_emitEdit(){this.dispatchEvent(new CustomEvent("smartvanio-edit-entity",{detail:{entity_id:this.entityId},bubbles:!0,composed:!0}))}_pressButton(){const t=`smartvanio/${this.deviceId}/binary_sensor/${this.channel}/state`;this.hass.callService("mqtt","publish",{topic:t,payload:'{"state":"ON"}'}),setTimeout(()=>{this.hass.callService("mqtt","publish",{topic:t,payload:'{"state":"OFF"}'})},150)}_renderDoor(){const t=this.entityId,e="on"===this.hass.states[t]?.state,i=this.hass.entities?.[t]?.name||this.hass.states[t]?.attributes?.friendly_name||t.split(".").pop();return j`
      <div
        class="sensor-tile ${e?"active":""} ${this.editMode?"editable":""}"
        data-eid="${t}"
        @click=${this.editMode?()=>this._emitEdit():void 0}
      >
        <ha-icon icon="${e?"mdi:door-open":"mdi:door-closed"}"></ha-icon>
        <span class="sensor-label">${i}</span>
        ${this.editMode?j`<ha-icon class="tile-edit-icon" icon="mdi:pencil-outline"></ha-icon>`:j`<span class="sensor-state">${e?"Open":"Closed"}</span>`}
      </div>
    `}_renderButton(){const t=this.entityId,e="on"===this.hass.states[t]?.state,i=this.hass.entities?.[t]?.name||this.hass.states[t]?.attributes?.friendly_name||t.split(".").pop();return j`
      <div
        class="btn-tile ${e?"active":""} ${this.editMode?"editable":""}"
        data-eid="${t}"
        @click=${()=>{this.editMode?this._emitEdit():this._pressButton()}}
      >
        ${this.editMode?j`<ha-icon class="btn-edit-icon" icon="mdi:cog-outline"></ha-icon>`:j`<ha-icon icon="${e?"mdi:circle-slice-8":"mdi:circle-outline"}"></ha-icon>`}
        <span>${i}</span>
        <span class="btn-state">${this.editMode?"Edit":e?"Pressed":"—"}</span>
      </div>
    `}render(){return this.hass&&this.entityId?"button"===this.variant?this._renderButton():this._renderDoor():j``}static get styles(){return[Aa,a`
        :host { display: block; }

        /* ── Door / sensor tile ──── */
        .sensor-tile {
          background: var(--tile-bg, var(--card-background-color, #fff));
          border: 1px solid var(--tile-border, var(--divider-color, rgba(0,0,0,0.08)));
          border-radius: 12px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: border-color 0.2s;
        }

        .sensor-tile ha-icon {
          --mdc-icon-size: 22px;
          color: var(--secondary-text-color);
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .sensor-tile.active {
          border-color: var(--warning-color, #ff9800);
        }
        .sensor-tile.active ha-icon {
          color: var(--warning-color, #ff9800);
        }

        .sensor-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-text-color);
          flex: 1;
        }

        .sensor-state {
          font-size: 12px;
          color: var(--secondary-text-color);
          font-weight: 500;
        }

        .sensor-tile.active .sensor-state {
          color: var(--warning-color, #ff9800);
        }

        /* ── Button tile ──── */
        .btn-tile {
          background: var(--tile-bg, var(--card-background-color, #fff));
          border: 1px solid var(--tile-border, var(--divider-color, rgba(0,0,0,0.08)));
          border-radius: 12px;
          padding: 14px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--primary-text-color);
          text-align: center;
          transition: border-color 0.2s, background 0.1s;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .btn-tile:active:not(.editable) {
          background: var(--secondary-background-color);
        }

        .btn-tile ha-icon {
          --mdc-icon-size: 24px;
          color: var(--secondary-text-color);
          transition: color 0.15s;
        }

        .btn-tile.active {
          border-color: var(--primary-color, #03a9f4);
        }
        .btn-tile.active ha-icon {
          color: var(--primary-color, #03a9f4);
        }

        .btn-state {
          font-size: 11px;
          color: var(--secondary-text-color);
        }

        .btn-tile.active .btn-state {
          color: var(--primary-color, #03a9f4);
        }

        .btn-edit-icon {
          --mdc-icon-size: 24px;
          color: var(--primary-color);
        }
      `]}});customElements.define("smartvanio-tile-inclinometer",class extends nt{static get properties(){return{pitch:{type:Number},roll:{type:Number}}}constructor(){super(),this.pitch=0,this.roll=0}render(){const t=isNaN(this.pitch)?0:this.pitch,e=isNaN(this.roll)?0:this.roll,i=t=>Math.max(-1,Math.min(1,t)),s=34*i(e/15),r=34*i(-t/15),a=Math.sqrt(t**2+e**2),n=a<1.5?"var(--success-color, #4caf50)":a<5?"var(--warning-color, #ff9800)":"var(--error-color, #f44336)",o=a<1.5,l=t=>{if(isNaN(t))return"—";return`${t>=0?"+":""}${t.toFixed(1)}°`};return j`
      <div class="level-tile">
        <div class="level-arena" style="--lvl-status:${n}">
          <div class="level-crosshair-h"></div>
          <div class="level-crosshair-v"></div>
          <div
            class="level-bubble"
            style="transform:translate(${s}px,${r}px);background:${n}"
          ></div>
        </div>
        <div class="level-readouts">
          <div class="level-row">
            <ha-icon icon="mdi:swap-vertical" class="level-icon"></ha-icon>
            <span class="level-label">Pitch</span>
            <span class="level-value" style="color:${n}">${l(t)}</span>
          </div>
          <div class="level-row">
            <ha-icon icon="mdi:swap-horizontal" class="level-icon"></ha-icon>
            <span class="level-label">Roll</span>
            <span class="level-value" style="color:${n}">${l(e)}</span>
          </div>
          <div class="level-status" style="color:${n}">
            <ha-icon icon="${o?"mdi:check-circle":"mdi:alert-circle"}"></ha-icon>
            ${o?"Level":"Off level"}
          </div>
        </div>
      </div>
    `}static get styles(){return a`
      :host { display: block; }

      .level-tile {
        display: flex;
        align-items: center;
        gap: 24px;
        background: var(--tile-bg, var(--card-background-color, #fff));
        border: 1px solid var(--tile-border, var(--divider-color, rgba(0,0,0,0.08)));
        border-radius: 12px;
        padding: 16px 20px;
      }

      .level-arena {
        position: relative;
        width: 88px;
        height: 88px;
        border-radius: 50%;
        background: var(--secondary-background-color, #f5f5f5);
        border: 2px solid var(--lvl-status, var(--divider-color));
        flex-shrink: 0;
        overflow: hidden;
        transition: border-color 0.4s ease;
      }

      .level-crosshair-h,
      .level-crosshair-v {
        position: absolute;
        background: rgba(0, 0, 0, 0.1);
        pointer-events: none;
      }
      .level-crosshair-h {
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        transform: translateY(-50%);
      }
      .level-crosshair-v {
        left: 50%;
        top: 0;
        bottom: 0;
        width: 1px;
        transform: translateX(-50%);
      }

      .level-bubble {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin: -10px 0 0 -10px;
        opacity: 0.9;
        transition:
          transform 0.5s ease,
          background 0.4s ease;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
      }

      .level-readouts {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .level-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .level-icon {
        --mdc-icon-size: 16px;
        color: var(--secondary-text-color);
        flex-shrink: 0;
      }

      .level-label {
        font-size: 13px;
        color: var(--secondary-text-color);
        flex: 1;
      }

      .level-value {
        font-size: 16px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        transition: color 0.4s ease;
      }

      .level-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 600;
        margin-top: 2px;
        transition: color 0.4s ease;
      }
      .level-status ha-icon {
        --mdc-icon-size: 16px;
      }
    `}});function Ga(t){return null!==t&&"object"==typeof t&&"constructor"in t&&t.constructor===Object}function qa(t={},e={}){const i=["__proto__","constructor","prototype"];Object.keys(e).filter(t=>i.indexOf(t)<0).forEach(i=>{void 0===t[i]?t[i]=e[i]:Ga(e[i])&&Ga(t[i])&&Object.keys(e[i]).length>0&&qa(t[i],e[i])})}customElements.define("smartvanio-tile-scene",class extends nt{static get properties(){return{hass:{type:Object},entityId:{type:String,attribute:"entity-id"},editMode:{type:Boolean,attribute:"edit-mode"},label:{type:String}}}_emitEdit(){this.dispatchEvent(new CustomEvent("smartvanio-edit-entity",{detail:{entity_id:this.entityId},bubbles:!0,composed:!0}))}_emitOpenSceneModal(){this.dispatchEvent(new CustomEvent("smartvanio-open-scene-modal",{detail:{entity_id:this.entityId},bubbles:!0,composed:!0}))}render(){if(!this.hass||!this.entityId)return j``;const t=this.entityId,e=this.hass.states[t],i=e?.attributes?.icon??"mdi:palette",s=e?.attributes?.light_count??0,r=e?.state,a=!r||"unknown"===r||"unavailable"===r?"Never activated":function(t){try{const e=Date.now()-new Date(t).getTime(),i=Math.floor(e/6e4);if(i<1)return"just now";if(i<60)return`${i}m ago`;const s=Math.floor(i/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}catch{return"—"}}(r),n=this.label||this.hass.entities?.[t]?.name||e?.attributes?.friendly_name||t.split(".").pop();return j`
      <div
        class="scene-tile ${this.editMode?"editable":""}"
        @click=${()=>this.editMode?this._emitOpenSceneModal():this.hass.callService("scene","turn_on",{entity_id:t})}
      >
        <div class="scene-icon-wrap">
          <ha-icon icon="${i}"></ha-icon>
        </div>
        <div class="scene-info">
          <div class="scene-name">${n}</div>
          <div class="scene-meta">
            <span>${s} light${1!==s?"s":""}</span>
            <span class="scene-dot">·</span>
            <span>${a}</span>
          </div>
        </div>
        ${this.editMode?j`<ha-icon class="tile-edit-icon" icon="mdi:pencil-outline"></ha-icon>`:""}
      </div>
    `}static get styles(){return[Aa,a`
        :host { display: block; }

        .scene-tile {
          background: var(--tile-bg, var(--card-background-color, #fff));
          border: 1px solid var(--tile-border, var(--divider-color, rgba(0,0,0,0.08)));
          border-radius: 12px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          transition: border-color 0.2s, background 0.1s;
        }
        .scene-tile:active:not(.editable) {
          background: var(--secondary-background-color);
        }

        .scene-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: color-mix(in srgb, var(--primary-color) 12%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .scene-icon-wrap ha-icon {
          --mdc-icon-size: 22px;
          color: var(--primary-color);
        }

        .scene-info {
          flex: 1;
          min-width: 0;
        }
        .scene-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .scene-meta {
          font-size: 12px;
          color: var(--secondary-text-color);
          margin-top: 2px;
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .scene-dot {
          opacity: 0.5;
        }
      `]}});const Ua={body:{},addEventListener(){},removeEventListener(){},activeElement:{blur(){},nodeName:""},querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,createEvent:()=>({initEvent(){}}),createElement:()=>({children:[],childNodes:[],style:{},setAttribute(){},getElementsByTagName:()=>[]}),createElementNS:()=>({}),importNode:()=>null,location:{hash:"",host:"",hostname:"",href:"",origin:"",pathname:"",protocol:"",search:""}};function Wa(){const t="undefined"!=typeof document?document:{};return qa(t,Ua),t}const Ha={document:Ua,navigator:{userAgent:""},location:{hash:"",host:"",hostname:"",href:"",origin:"",pathname:"",protocol:"",search:""},history:{replaceState(){},pushState(){},go(){},back(){}},CustomEvent:function(){return this},addEventListener(){},removeEventListener(){},getComputedStyle:()=>({getPropertyValue:()=>""}),Image(){},Date(){},screen:{},setTimeout(){},clearTimeout(){},matchMedia:()=>({}),requestAnimationFrame:t=>"undefined"==typeof setTimeout?(t(),null):setTimeout(t,0),cancelAnimationFrame(t){"undefined"!=typeof setTimeout&&clearTimeout(t)}};function Ya(){const t="undefined"!=typeof window?window:{};return qa(t,Ha),t}function Xa(t,e=0){return setTimeout(t,e)}function Ka(){return Date.now()}function Ja(t,e="x"){const i=Ya();let s,r,a;const n=function(t){const e=Ya();let i;return e.getComputedStyle&&(i=e.getComputedStyle(t,null)),!i&&t.currentStyle&&(i=t.currentStyle),i||(i=t.style),i}(t);return i.WebKitCSSMatrix?(r=n.transform||n.webkitTransform,r.split(",").length>6&&(r=r.split(", ").map(t=>t.replace(",",".")).join(", ")),a=new i.WebKitCSSMatrix("none"===r?"":r)):(a=n.MozTransform||n.OTransform||n.MsTransform||n.msTransform||n.transform||n.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,"),s=a.toString().split(",")),"x"===e&&(r=i.WebKitCSSMatrix?a.m41:16===s.length?parseFloat(s[12]):parseFloat(s[4])),"y"===e&&(r=i.WebKitCSSMatrix?a.m42:16===s.length?parseFloat(s[13]):parseFloat(s[5])),r||0}function Za(t){return"object"==typeof t&&null!==t&&t.constructor&&"Object"===Object.prototype.toString.call(t).slice(8,-1)}function Qa(t){return"undefined"!=typeof window&&void 0!==window.HTMLElement?t instanceof HTMLElement:t&&(1===t.nodeType||11===t.nodeType)}function tn(...t){const e=Object(t[0]);for(let i=1;i<t.length;i+=1){const s=t[i];if(null!=s&&!Qa(s)){const t=Object.keys(Object(s)).filter(t=>"__proto__"!==t&&"constructor"!==t&&"prototype"!==t);for(let i=0,r=t.length;i<r;i+=1){const r=t[i],a=Object.getOwnPropertyDescriptor(s,r);void 0!==a&&a.enumerable&&(Za(e[r])&&Za(s[r])?s[r].__swiper__?e[r]=s[r]:tn(e[r],s[r]):!Za(e[r])&&Za(s[r])?(e[r]={},s[r].__swiper__?e[r]=s[r]:tn(e[r],s[r])):e[r]=s[r])}}}return e}function en(t,e,i){t.style.setProperty(e,i)}function sn({swiper:t,targetPosition:e,side:i}){const s=Ya(),r=-t.translate;let a,n=null;const o=t.params.speed;t.wrapperEl.style.scrollSnapType="none",s.cancelAnimationFrame(t.cssModeFrameID);const l=e>r?"next":"prev",d=(t,e)=>"next"===l&&t>=e||"prev"===l&&t<=e,c=()=>{a=(new Date).getTime(),null===n&&(n=a);const l=Math.max(Math.min((a-n)/o,1),0),p=.5-Math.cos(l*Math.PI)/2;let h=r+p*(e-r);if(d(h,e)&&(h=e),t.wrapperEl.scrollTo({[i]:h}),d(h,e))return t.wrapperEl.style.overflow="hidden",t.wrapperEl.style.scrollSnapType="",setTimeout(()=>{t.wrapperEl.style.overflow="",t.wrapperEl.scrollTo({[i]:h})}),void s.cancelAnimationFrame(t.cssModeFrameID);t.cssModeFrameID=s.requestAnimationFrame(c)};c()}function rn(t,e=""){const i=Ya(),s=[...t.children];return i.HTMLSlotElement&&t instanceof HTMLSlotElement&&s.push(...t.assignedElements()),e?s.filter(t=>t.matches(e)):s}function an(t){try{return void console.warn(t)}catch(t){}}function nn(t,e=[]){const i=document.createElement(t);return i.classList.add(...Array.isArray(e)?e:function(t=""){return t.trim().split(" ").filter(t=>!!t.trim())}(e)),i}function on(t,e){return Ya().getComputedStyle(t,null).getPropertyValue(e)}function ln(t){let e,i=t;if(i){for(e=0;null!==(i=i.previousSibling);)1===i.nodeType&&(e+=1);return e}}function dn(t,e){const i=[];let s=t.parentElement;for(;s;)e?s.matches(e)&&i.push(s):i.push(s),s=s.parentElement;return i}function cn(t,e,i){const s=Ya();return t["width"===e?"offsetWidth":"offsetHeight"]+parseFloat(s.getComputedStyle(t,null).getPropertyValue("width"===e?"margin-right":"margin-top"))+parseFloat(s.getComputedStyle(t,null).getPropertyValue("width"===e?"margin-left":"margin-bottom"))}function pn(t){return(Array.isArray(t)?t:[t]).filter(t=>!!t)}function hn(t,e=""){"undefined"!=typeof trustedTypes?t.innerHTML=trustedTypes.createPolicy("html",{createHTML:t=>t}).createHTML(e):t.innerHTML=e}let un,gn,mn;function vn(){return un||(un=function(){const t=Ya(),e=Wa();return{smoothScroll:e.documentElement&&e.documentElement.style&&"scrollBehavior"in e.documentElement.style,touch:!!("ontouchstart"in t||t.DocumentTouch&&e instanceof t.DocumentTouch)}}()),un}function fn(t={}){return gn||(gn=function({userAgent:t}={}){const e=vn(),i=Ya(),s=i.navigator.platform,r=t||i.navigator.userAgent,a={ios:!1,android:!1},n=i.screen.width,o=i.screen.height,l=r.match(/(Android);?[\s\/]+([\d.]+)?/);let d=r.match(/(iPad)(?!\1).*OS\s([\d_]+)/);const c=r.match(/(iPod)(.*OS\s([\d_]+))?/),p=!d&&r.match(/(iPhone\sOS|iOS)\s([\d_]+)/),h="Win32"===s;let u="MacIntel"===s;return!d&&u&&e.touch&&["1024x1366","1366x1024","834x1194","1194x834","834x1112","1112x834","768x1024","1024x768","820x1180","1180x820","810x1080","1080x810"].indexOf(`${n}x${o}`)>=0&&(d=r.match(/(Version)\/([\d.]+)/),d||(d=[0,1,"13_0_0"]),u=!1),l&&!h&&(a.os="android",a.android=!0),(d||p||c)&&(a.os="ios",a.ios=!0),a}(t)),gn}function bn(){return mn||(mn=function(){const t=Ya(),e=fn();let i=!1;function s(){const e=t.navigator.userAgent.toLowerCase();return e.indexOf("safari")>=0&&e.indexOf("chrome")<0&&e.indexOf("android")<0}if(s()){const e=String(t.navigator.userAgent);if(e.includes("Version/")){const[t,s]=e.split("Version/")[1].split(" ")[0].split(".").map(t=>Number(t));i=t<16||16===t&&s<2}}const r=/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(t.navigator.userAgent),a=s();return{isSafari:i||a,needPerspectiveFix:i,need3dFix:a||r&&e.ios,isWebView:r}}()),mn}var xn={on(t,e,i){const s=this;if(!s.eventsListeners||s.destroyed)return s;if("function"!=typeof e)return s;const r=i?"unshift":"push";return t.split(" ").forEach(t=>{s.eventsListeners[t]||(s.eventsListeners[t]=[]),s.eventsListeners[t][r](e)}),s},once(t,e,i){const s=this;if(!s.eventsListeners||s.destroyed)return s;if("function"!=typeof e)return s;function r(...i){s.off(t,r),r.__emitterProxy&&delete r.__emitterProxy,e.apply(s,i)}return r.__emitterProxy=e,s.on(t,r,i)},onAny(t,e){const i=this;if(!i.eventsListeners||i.destroyed)return i;if("function"!=typeof t)return i;const s=e?"unshift":"push";return i.eventsAnyListeners.indexOf(t)<0&&i.eventsAnyListeners[s](t),i},offAny(t){const e=this;if(!e.eventsListeners||e.destroyed)return e;if(!e.eventsAnyListeners)return e;const i=e.eventsAnyListeners.indexOf(t);return i>=0&&e.eventsAnyListeners.splice(i,1),e},off(t,e){const i=this;return!i.eventsListeners||i.destroyed?i:i.eventsListeners?(t.split(" ").forEach(t=>{void 0===e?i.eventsListeners[t]=[]:i.eventsListeners[t]&&i.eventsListeners[t].forEach((s,r)=>{(s===e||s.__emitterProxy&&s.__emitterProxy===e)&&i.eventsListeners[t].splice(r,1)})}),i):i},emit(...t){const e=this;if(!e.eventsListeners||e.destroyed)return e;if(!e.eventsListeners)return e;let i,s,r;"string"==typeof t[0]||Array.isArray(t[0])?(i=t[0],s=t.slice(1,t.length),r=e):(i=t[0].events,s=t[0].data,r=t[0].context||e),s.unshift(r);return(Array.isArray(i)?i:i.split(" ")).forEach(t=>{e.eventsAnyListeners&&e.eventsAnyListeners.length&&e.eventsAnyListeners.forEach(e=>{e.apply(r,[t,...s])}),e.eventsListeners&&e.eventsListeners[t]&&e.eventsListeners[t].forEach(t=>{t.apply(r,s)})}),e}};const yn=(t,e,i)=>{e&&!t.classList.contains(i)?t.classList.add(i):!e&&t.classList.contains(i)&&t.classList.remove(i)};const _n=(t,e,i)=>{e&&!t.classList.contains(i)?t.classList.add(i):!e&&t.classList.contains(i)&&t.classList.remove(i)};const wn=(t,e)=>{if(!t||t.destroyed||!t.params)return;const i=e.closest(t.isElement?"swiper-slide":`.${t.params.slideClass}`);if(i){let e=i.querySelector(`.${t.params.lazyPreloaderClass}`);!e&&t.isElement&&(i.shadowRoot?e=i.shadowRoot.querySelector(`.${t.params.lazyPreloaderClass}`):requestAnimationFrame(()=>{i.shadowRoot&&(e=i.shadowRoot.querySelector(`.${t.params.lazyPreloaderClass}`),e&&!e.lazyPreloaderManaged&&e.remove())})),e&&!e.lazyPreloaderManaged&&e.remove()}},$n=(t,e)=>{if(!t.slides[e])return;const i=t.slides[e].querySelector('[loading="lazy"]');i&&i.removeAttribute("loading")},kn=t=>{if(!t||t.destroyed||!t.params)return;let e=t.params.lazyPreloadPrevNext;const i=t.slides.length;if(!i||!e||e<0)return;e=Math.min(e,i);const s="auto"===t.params.slidesPerView?t.slidesPerViewDynamic():Math.ceil(t.params.slidesPerView),r=t.activeIndex;if(t.params.grid&&t.params.grid.rows>1){const i=r,a=[i-e];return a.push(...Array.from({length:e}).map((t,e)=>i+s+e)),void t.slides.forEach((e,i)=>{a.includes(e.column)&&$n(t,i)})}const a=r+s-1;if(t.params.rewind||t.params.loop)for(let s=r-e;s<=a+e;s+=1){const e=(s%i+i)%i;(e<r||e>a)&&$n(t,e)}else for(let s=Math.max(r-e,0);s<=Math.min(a+e,i-1);s+=1)s!==r&&(s>a||s<r)&&$n(t,s)};var Sn={updateSize:function(){const t=this;let e,i;const s=t.el;e=void 0!==t.params.width&&null!==t.params.width?t.params.width:s.clientWidth,i=void 0!==t.params.height&&null!==t.params.height?t.params.height:s.clientHeight,0===e&&t.isHorizontal()||0===i&&t.isVertical()||(e=e-parseInt(on(s,"padding-left")||0,10)-parseInt(on(s,"padding-right")||0,10),i=i-parseInt(on(s,"padding-top")||0,10)-parseInt(on(s,"padding-bottom")||0,10),Number.isNaN(e)&&(e=0),Number.isNaN(i)&&(i=0),Object.assign(t,{width:e,height:i,size:t.isHorizontal()?e:i}))},updateSlides:function(){const t=this;function e(e,i){return parseFloat(e.getPropertyValue(t.getDirectionLabel(i))||0)}const i=t.params,{wrapperEl:s,slidesEl:r,rtlTranslate:a,wrongRTL:n}=t,o=t.virtual&&i.virtual.enabled,l=o?t.virtual.slides.length:t.slides.length,d=rn(r,`.${t.params.slideClass}, swiper-slide`),c=o?t.virtual.slides.length:d.length;let p=[];const h=[],u=[];let g=i.slidesOffsetBefore;"function"==typeof g&&(g=i.slidesOffsetBefore.call(t));let m=i.slidesOffsetAfter;"function"==typeof m&&(m=i.slidesOffsetAfter.call(t));const v=t.snapGrid.length,f=t.slidesGrid.length,b=t.size-g-m;let x=i.spaceBetween,y=-g,_=0,w=0;if(void 0===b)return;"string"==typeof x&&x.indexOf("%")>=0?x=parseFloat(x.replace("%",""))/100*b:"string"==typeof x&&(x=parseFloat(x)),t.virtualSize=-x-g-m,d.forEach(t=>{a?t.style.marginLeft="":t.style.marginRight="",t.style.marginBottom="",t.style.marginTop=""}),i.centeredSlides&&i.cssMode&&(en(s,"--swiper-centered-offset-before",""),en(s,"--swiper-centered-offset-after","")),i.cssMode&&(en(s,"--swiper-slides-offset-before",`${g}px`),en(s,"--swiper-slides-offset-after",`${m}px`));const $=i.grid&&i.grid.rows>1&&t.grid;let k;$?t.grid.initSlides(d):t.grid&&t.grid.unsetSlides();const S="auto"===i.slidesPerView&&i.breakpoints&&Object.keys(i.breakpoints).filter(t=>void 0!==i.breakpoints[t].slidesPerView).length>0;for(let s=0;s<c;s+=1){k=0;const r=d[s];if(!r||($&&t.grid.updateSlide(s,r,d),"none"!==on(r,"display"))){if(o&&"auto"===i.slidesPerView)i.virtual.slidesPerViewAutoSlideSize&&(k=i.virtual.slidesPerViewAutoSlideSize),k&&r&&(i.roundLengths&&(k=Math.floor(k)),r.style[t.getDirectionLabel("width")]=`${k}px`);else if("auto"===i.slidesPerView){S&&(r.style[t.getDirectionLabel("width")]="");const s=getComputedStyle(r),a=r.style.transform,n=r.style.webkitTransform;if(a&&(r.style.transform="none"),n&&(r.style.webkitTransform="none"),i.roundLengths)k=t.isHorizontal()?cn(r,"width"):cn(r,"height");else{const t=e(s,"width"),i=e(s,"padding-left"),a=e(s,"padding-right"),n=e(s,"margin-left"),o=e(s,"margin-right"),l=s.getPropertyValue("box-sizing");if(l&&"border-box"===l)k=t+n+o;else{const{clientWidth:e,offsetWidth:s}=r;k=t+i+a+n+o+(s-e)}}a&&(r.style.transform=a),n&&(r.style.webkitTransform=n),i.roundLengths&&(k=Math.floor(k))}else k=(b-(i.slidesPerView-1)*x)/i.slidesPerView,i.roundLengths&&(k=Math.floor(k)),r&&(r.style[t.getDirectionLabel("width")]=`${k}px`);r&&(r.swiperSlideSize=k),u.push(k),i.centeredSlides?(y=y+k/2+_/2+x,0===_&&0!==s&&(y=y-b/2-x),0===s&&(y=y-b/2-x),Math.abs(y)<.001&&(y=0),i.roundLengths&&(y=Math.floor(y)),w%i.slidesPerGroup===0&&p.push(y),h.push(y)):(i.roundLengths&&(y=Math.floor(y)),(w-Math.min(t.params.slidesPerGroupSkip,w))%t.params.slidesPerGroup===0&&p.push(y),h.push(y),y=y+k+x),t.virtualSize+=k+x,_=k,w+=1}}if(t.virtualSize=Math.max(t.virtualSize,b)+m,a&&n&&("slide"===i.effect||"coverflow"===i.effect)&&(s.style.width=`${t.virtualSize+x}px`),i.setWrapperSize&&(s.style[t.getDirectionLabel("width")]=`${t.virtualSize+x}px`),$&&t.grid.updateWrapperSize(k,p),!i.centeredSlides){const e="auto"!==i.slidesPerView&&i.slidesPerView%1!=0,s=i.snapToSlideEdge&&!i.loop&&("auto"===i.slidesPerView||e);let r=p.length;if(s){let t;if("auto"===i.slidesPerView){t=1;let e=0;for(let i=u.length-1;i>=0&&(e+=u[i]+(i<u.length-1?x:0),e<=b);i-=1)t=u.length-i}else t=Math.floor(i.slidesPerView);r=Math.max(c-t,0)}const a=[];for(let e=0;e<p.length;e+=1){let n=p[e];i.roundLengths&&(n=Math.floor(n)),s?e<=r&&a.push(n):p[e]<=t.virtualSize-b&&a.push(n)}p=a,Math.floor(t.virtualSize-b)-Math.floor(p[p.length-1])>1&&(s||p.push(t.virtualSize-b))}if(o&&i.loop){const e=u[0]+x;if(i.slidesPerGroup>1){const s=Math.ceil((t.virtual.slidesBefore+t.virtual.slidesAfter)/i.slidesPerGroup),r=e*i.slidesPerGroup;for(let t=0;t<s;t+=1)p.push(p[p.length-1]+r)}for(let s=0;s<t.virtual.slidesBefore+t.virtual.slidesAfter;s+=1)1===i.slidesPerGroup&&p.push(p[p.length-1]+e),h.push(h[h.length-1]+e),t.virtualSize+=e}if(0===p.length&&(p=[0]),0!==x){const e=t.isHorizontal()&&a?"marginLeft":t.getDirectionLabel("marginRight");d.filter((t,e)=>!(i.cssMode&&!i.loop)||e!==d.length-1).forEach(t=>{t.style[e]=`${x}px`})}if(i.centeredSlides&&i.centeredSlidesBounds){let t=0;u.forEach(e=>{t+=e+(x||0)}),t-=x;const e=t>b?t-b:0;p=p.map(t=>t<=0?-g:t>e?e+m:t)}if(i.centerInsufficientSlides){let t=0;if(u.forEach(e=>{t+=e+(x||0)}),t-=x,t<b){const e=(b-t)/2;p.forEach((t,i)=>{p[i]=t-e}),h.forEach((t,i)=>{h[i]=t+e})}}if(Object.assign(t,{slides:d,snapGrid:p,slidesGrid:h,slidesSizesGrid:u}),i.centeredSlides&&i.cssMode&&!i.centeredSlidesBounds){en(s,"--swiper-centered-offset-before",-p[0]+"px"),en(s,"--swiper-centered-offset-after",t.size/2-u[u.length-1]/2+"px");const e=-t.snapGrid[0],i=-t.slidesGrid[0];t.snapGrid=t.snapGrid.map(t=>t+e),t.slidesGrid=t.slidesGrid.map(t=>t+i)}if(c!==l&&t.emit("slidesLengthChange"),p.length!==v&&(t.params.watchOverflow&&t.checkOverflow(),t.emit("snapGridLengthChange")),h.length!==f&&t.emit("slidesGridLengthChange"),i.watchSlidesProgress&&t.updateSlidesOffset(),t.emit("slidesUpdated"),!(o||i.cssMode||"slide"!==i.effect&&"fade"!==i.effect)){const e=`${i.containerModifierClass}backface-hidden`,s=t.el.classList.contains(e);c<=i.maxBackfaceHiddenSlides?s||t.el.classList.add(e):s&&t.el.classList.remove(e)}},updateAutoHeight:function(t){const e=this,i=[],s=e.virtual&&e.params.virtual.enabled;let r,a=0;"number"==typeof t?e.setTransition(t):!0===t&&e.setTransition(e.params.speed);const n=t=>s?e.slides[e.getSlideIndexByData(t)]:e.slides[t];if("auto"!==e.params.slidesPerView&&e.params.slidesPerView>1)if(e.params.centeredSlides)(e.visibleSlides||[]).forEach(t=>{i.push(t)});else for(r=0;r<Math.ceil(e.params.slidesPerView);r+=1){const t=e.activeIndex+r;if(t>e.slides.length&&!s)break;i.push(n(t))}else i.push(n(e.activeIndex));for(r=0;r<i.length;r+=1)if(void 0!==i[r]){const t=i[r].offsetHeight;a=t>a?t:a}(a||0===a)&&(e.wrapperEl.style.height=`${a}px`)},updateSlidesOffset:function(){const t=this,e=t.slides,i=t.isElement?t.isHorizontal()?t.wrapperEl.offsetLeft:t.wrapperEl.offsetTop:0;for(let s=0;s<e.length;s+=1)e[s].swiperSlideOffset=(t.isHorizontal()?e[s].offsetLeft:e[s].offsetTop)-i-t.cssOverflowAdjustment()},updateSlidesProgress:function(t=this&&this.translate||0){const e=this,i=e.params,{slides:s,rtlTranslate:r,snapGrid:a}=e;if(0===s.length)return;void 0===s[0].swiperSlideOffset&&e.updateSlidesOffset();let n=-t;r&&(n=t),e.visibleSlidesIndexes=[],e.visibleSlides=[];let o=i.spaceBetween;"string"==typeof o&&o.indexOf("%")>=0?o=parseFloat(o.replace("%",""))/100*e.size:"string"==typeof o&&(o=parseFloat(o));for(let t=0;t<s.length;t+=1){const l=s[t];let d=l.swiperSlideOffset;i.cssMode&&i.centeredSlides&&(d-=s[0].swiperSlideOffset);const c=(n+(i.centeredSlides?e.minTranslate():0)-d)/(l.swiperSlideSize+o),p=(n-a[0]+(i.centeredSlides?e.minTranslate():0)-d)/(l.swiperSlideSize+o),h=-(n-d),u=h+e.slidesSizesGrid[t],g=h>=0&&h<=e.size-e.slidesSizesGrid[t],m=h>=0&&h<e.size-1||u>1&&u<=e.size||h<=0&&u>=e.size;m&&(e.visibleSlides.push(l),e.visibleSlidesIndexes.push(t)),yn(l,m,i.slideVisibleClass),yn(l,g,i.slideFullyVisibleClass),l.progress=r?-c:c,l.originalProgress=r?-p:p}},updateProgress:function(t){const e=this;if(void 0===t){const i=e.rtlTranslate?-1:1;t=e&&e.translate&&e.translate*i||0}const i=e.params,s=e.maxTranslate()-e.minTranslate();let{progress:r,isBeginning:a,isEnd:n,progressLoop:o}=e;const l=a,d=n;if(0===s)r=0,a=!0,n=!0;else{r=(t-e.minTranslate())/s;const i=Math.abs(t-e.minTranslate())<1,o=Math.abs(t-e.maxTranslate())<1;a=i||r<=0,n=o||r>=1,i&&(r=0),o&&(r=1)}if(i.loop){const i=e.getSlideIndexByData(0),s=e.getSlideIndexByData(e.slides.length-1),r=e.slidesGrid[i],a=e.slidesGrid[s],n=e.slidesGrid[e.slidesGrid.length-1],l=Math.abs(t);o=l>=r?(l-r)/n:(l+n-a)/n,o>1&&(o-=1)}Object.assign(e,{progress:r,progressLoop:o,isBeginning:a,isEnd:n}),(i.watchSlidesProgress||i.centeredSlides&&i.autoHeight)&&e.updateSlidesProgress(t),a&&!l&&e.emit("reachBeginning toEdge"),n&&!d&&e.emit("reachEnd toEdge"),(l&&!a||d&&!n)&&e.emit("fromEdge"),e.emit("progress",r)},updateSlidesClasses:function(){const t=this,{slides:e,params:i,slidesEl:s,activeIndex:r}=t,a=t.virtual&&i.virtual.enabled,n=t.grid&&i.grid&&i.grid.rows>1,o=t=>rn(s,`.${i.slideClass}${t}, swiper-slide${t}`)[0];let l,d,c;if(a)if(i.loop){let e=r-t.virtual.slidesBefore;e<0&&(e=t.virtual.slides.length+e),e>=t.virtual.slides.length&&(e-=t.virtual.slides.length),l=o(`[data-swiper-slide-index="${e}"]`)}else l=o(`[data-swiper-slide-index="${r}"]`);else n?(l=e.find(t=>t.column===r),c=e.find(t=>t.column===r+1),d=e.find(t=>t.column===r-1)):l=e[r];l&&(n||(c=function(t,e){const i=[];for(;t.nextElementSibling;){const s=t.nextElementSibling;e?s.matches(e)&&i.push(s):i.push(s),t=s}return i}(l,`.${i.slideClass}, swiper-slide`)[0],i.loop&&!c&&(c=e[0]),d=function(t,e){const i=[];for(;t.previousElementSibling;){const s=t.previousElementSibling;e?s.matches(e)&&i.push(s):i.push(s),t=s}return i}(l,`.${i.slideClass}, swiper-slide`)[0],i.loop&&0===!d&&(d=e[e.length-1]))),e.forEach(t=>{_n(t,t===l,i.slideActiveClass),_n(t,t===c,i.slideNextClass),_n(t,t===d,i.slidePrevClass)}),t.emitSlidesClasses()},updateActiveIndex:function(t){const e=this,i=e.rtlTranslate?e.translate:-e.translate,{snapGrid:s,params:r,activeIndex:a,realIndex:n,snapIndex:o}=e;let l,d=t;const c=t=>{let i=t-e.virtual.slidesBefore;return i<0&&(i=e.virtual.slides.length+i),i>=e.virtual.slides.length&&(i-=e.virtual.slides.length),i};if(void 0===d&&(d=function(t){const{slidesGrid:e,params:i}=t,s=t.rtlTranslate?t.translate:-t.translate;let r;for(let t=0;t<e.length;t+=1)void 0!==e[t+1]?s>=e[t]&&s<e[t+1]-(e[t+1]-e[t])/2?r=t:s>=e[t]&&s<e[t+1]&&(r=t+1):s>=e[t]&&(r=t);return i.normalizeSlideIndex&&(r<0||void 0===r)&&(r=0),r}(e)),s.indexOf(i)>=0)l=s.indexOf(i);else{const t=Math.min(r.slidesPerGroupSkip,d);l=t+Math.floor((d-t)/r.slidesPerGroup)}if(l>=s.length&&(l=s.length-1),d===a&&!e.params.loop)return void(l!==o&&(e.snapIndex=l,e.emit("snapIndexChange")));if(d===a&&e.params.loop&&e.virtual&&e.params.virtual.enabled)return void(e.realIndex=c(d));const p=e.grid&&r.grid&&r.grid.rows>1;let h;if(e.virtual&&r.virtual.enabled)h=r.loop?c(d):d;else if(p){const t=e.slides.find(t=>t.column===d);let i=parseInt(t.getAttribute("data-swiper-slide-index"),10);Number.isNaN(i)&&(i=Math.max(e.slides.indexOf(t),0)),h=Math.floor(i/r.grid.rows)}else if(e.slides[d]){const t=e.slides[d].getAttribute("data-swiper-slide-index");h=t?parseInt(t,10):d}else h=d;Object.assign(e,{previousSnapIndex:o,snapIndex:l,previousRealIndex:n,realIndex:h,previousIndex:a,activeIndex:d}),e.initialized&&kn(e),e.emit("activeIndexChange"),e.emit("snapIndexChange"),(e.initialized||e.params.runCallbacksOnInit)&&(n!==h&&e.emit("realIndexChange"),e.emit("slideChange"))},updateClickedSlide:function(t,e){const i=this,s=i.params;let r=t.closest(`.${s.slideClass}, swiper-slide`);!r&&i.isElement&&e&&e.length>1&&e.includes(t)&&[...e.slice(e.indexOf(t)+1,e.length)].forEach(t=>{!r&&t.matches&&t.matches(`.${s.slideClass}, swiper-slide`)&&(r=t)});let a,n=!1;if(r)for(let t=0;t<i.slides.length;t+=1)if(i.slides[t]===r){n=!0,a=t;break}if(!r||!n)return i.clickedSlide=void 0,void(i.clickedIndex=void 0);i.clickedSlide=r,i.virtual&&i.params.virtual.enabled?i.clickedIndex=parseInt(r.getAttribute("data-swiper-slide-index"),10):i.clickedIndex=a,s.slideToClickedSlide&&void 0!==i.clickedIndex&&i.clickedIndex!==i.activeIndex&&i.slideToClickedSlide()}};var Mn={getTranslate:function(t=(this.isHorizontal()?"x":"y")){const{params:e,rtlTranslate:i,translate:s,wrapperEl:r}=this;if(e.virtualTranslate)return i?-s:s;if(e.cssMode)return s;let a=Ja(r,t);return a+=this.cssOverflowAdjustment(),i&&(a=-a),a||0},setTranslate:function(t,e){const i=this,{rtlTranslate:s,params:r,wrapperEl:a,progress:n}=i;let o,l=0,d=0;i.isHorizontal()?l=s?-t:t:d=t,r.roundLengths&&(l=Math.floor(l),d=Math.floor(d)),i.previousTranslate=i.translate,i.translate=i.isHorizontal()?l:d,r.cssMode?a[i.isHorizontal()?"scrollLeft":"scrollTop"]=i.isHorizontal()?-l:-d:r.virtualTranslate||(i.isHorizontal()?l-=i.cssOverflowAdjustment():d-=i.cssOverflowAdjustment(),a.style.transform=`translate3d(${l}px, ${d}px, 0px)`);const c=i.maxTranslate()-i.minTranslate();o=0===c?0:(t-i.minTranslate())/c,o!==n&&i.updateProgress(t),i.emit("setTranslate",i.translate,e)},minTranslate:function(){return-this.snapGrid[0]},maxTranslate:function(){return-this.snapGrid[this.snapGrid.length-1]},translateTo:function(t=0,e=this.params.speed,i=!0,s=!0,r){const a=this,{params:n,wrapperEl:o}=a;if(a.animating&&n.preventInteractionOnTransition)return!1;const l=a.minTranslate(),d=a.maxTranslate();let c;if(c=s&&t>l?l:s&&t<d?d:t,a.updateProgress(c),n.cssMode){const t=a.isHorizontal();if(0===e)o[t?"scrollLeft":"scrollTop"]=-c;else{if(!a.support.smoothScroll)return sn({swiper:a,targetPosition:-c,side:t?"left":"top"}),!0;o.scrollTo({[t?"left":"top"]:-c,behavior:"smooth"})}return!0}return 0===e?(a.setTransition(0),a.setTranslate(c),i&&(a.emit("beforeTransitionStart",e,r),a.emit("transitionEnd"))):(a.setTransition(e),a.setTranslate(c),i&&(a.emit("beforeTransitionStart",e,r),a.emit("transitionStart")),a.animating||(a.animating=!0,a.onTranslateToWrapperTransitionEnd||(a.onTranslateToWrapperTransitionEnd=function(t){a&&!a.destroyed&&t.target===this&&(a.wrapperEl.removeEventListener("transitionend",a.onTranslateToWrapperTransitionEnd),a.onTranslateToWrapperTransitionEnd=null,delete a.onTranslateToWrapperTransitionEnd,a.animating=!1,i&&a.emit("transitionEnd"))}),a.wrapperEl.addEventListener("transitionend",a.onTranslateToWrapperTransitionEnd))),!0}};function Tn({swiper:t,runCallbacks:e,direction:i,step:s}){const{activeIndex:r,previousIndex:a}=t;let n=i;n||(n=r>a?"next":r<a?"prev":"reset"),t.emit(`transition${s}`),e&&"reset"===n?t.emit(`slideResetTransition${s}`):e&&r!==a&&(t.emit(`slideChangeTransition${s}`),"next"===n?t.emit(`slideNextTransition${s}`):t.emit(`slidePrevTransition${s}`))}var Cn={slideTo:function(t=0,e,i=!0,s,r){"string"==typeof t&&(t=parseInt(t,10));const a=this;let n=t;n<0&&(n=0);const{params:o,snapGrid:l,slidesGrid:d,previousIndex:c,activeIndex:p,rtlTranslate:h,wrapperEl:u,enabled:g}=a;if(!g&&!s&&!r||a.destroyed||a.animating&&o.preventInteractionOnTransition)return!1;void 0===e&&(e=a.params.speed);const m=Math.min(a.params.slidesPerGroupSkip,n);let v=m+Math.floor((n-m)/a.params.slidesPerGroup);v>=l.length&&(v=l.length-1);const f=-l[v];if(o.normalizeSlideIndex)for(let t=0;t<d.length;t+=1){const e=-Math.floor(100*f),i=Math.floor(100*d[t]),s=Math.floor(100*d[t+1]);void 0!==d[t+1]?e>=i&&e<s-(s-i)/2?n=t:e>=i&&e<s&&(n=t+1):e>=i&&(n=t)}if(a.initialized&&n!==p){if(!a.allowSlideNext&&(h?f>a.translate&&f>a.minTranslate():f<a.translate&&f<a.minTranslate()))return!1;if(!a.allowSlidePrev&&f>a.translate&&f>a.maxTranslate()&&(p||0)!==n)return!1}let b;n!==(c||0)&&i&&a.emit("beforeSlideChangeStart"),a.updateProgress(f),b=n>p?"next":n<p?"prev":"reset";const x=a.virtual&&a.params.virtual.enabled;if(!(x&&r)&&(h&&-f===a.translate||!h&&f===a.translate))return a.updateActiveIndex(n),o.autoHeight&&a.updateAutoHeight(),a.updateSlidesClasses(),"slide"!==o.effect&&a.setTranslate(f),"reset"!==b&&(a.transitionStart(i,b),a.transitionEnd(i,b)),!1;if(o.cssMode){const t=a.isHorizontal(),i=h?f:-f;if(0===e)x&&(a.wrapperEl.style.scrollSnapType="none",a._immediateVirtual=!0),x&&!a._cssModeVirtualInitialSet&&a.params.initialSlide>0?(a._cssModeVirtualInitialSet=!0,requestAnimationFrame(()=>{u[t?"scrollLeft":"scrollTop"]=i})):u[t?"scrollLeft":"scrollTop"]=i,x&&requestAnimationFrame(()=>{a.wrapperEl.style.scrollSnapType="",a._immediateVirtual=!1});else{if(!a.support.smoothScroll)return sn({swiper:a,targetPosition:i,side:t?"left":"top"}),!0;u.scrollTo({[t?"left":"top"]:i,behavior:"smooth"})}return!0}const y=bn().isSafari;return x&&!r&&y&&a.isElement&&a.virtual.update(!1,!1,n),a.setTransition(e),a.setTranslate(f),a.updateActiveIndex(n),a.updateSlidesClasses(),a.emit("beforeTransitionStart",e,s),a.transitionStart(i,b),0===e?a.transitionEnd(i,b):a.animating||(a.animating=!0,a.onSlideToWrapperTransitionEnd||(a.onSlideToWrapperTransitionEnd=function(t){a&&!a.destroyed&&t.target===this&&(a.wrapperEl.removeEventListener("transitionend",a.onSlideToWrapperTransitionEnd),a.onSlideToWrapperTransitionEnd=null,delete a.onSlideToWrapperTransitionEnd,a.transitionEnd(i,b))}),a.wrapperEl.addEventListener("transitionend",a.onSlideToWrapperTransitionEnd)),!0},slideToLoop:function(t=0,e,i=!0,s){if("string"==typeof t){t=parseInt(t,10)}const r=this;if(r.destroyed)return;void 0===e&&(e=r.params.speed);const a=r.grid&&r.params.grid&&r.params.grid.rows>1;let n=t;if(r.params.loop)if(r.virtual&&r.params.virtual.enabled)n+=r.virtual.slidesBefore;else{let t;if(a){const e=n*r.params.grid.rows;t=r.slides.find(t=>1*t.getAttribute("data-swiper-slide-index")===e).column}else t=r.getSlideIndexByData(n);const e=a?Math.ceil(r.slides.length/r.params.grid.rows):r.slides.length,{centeredSlides:i,slidesOffsetBefore:o,slidesOffsetAfter:l}=r.params,d=i||!!o||!!l;let c=r.params.slidesPerView;"auto"===c?c=r.slidesPerViewDynamic():(c=Math.ceil(parseFloat(r.params.slidesPerView,10)),d&&c%2==0&&(c+=1));let p=e-t<c;if(d&&(p=p||t<Math.ceil(c/2)),s&&d&&"auto"!==r.params.slidesPerView&&!a&&(p=!1),p){const i=d?t<r.activeIndex?"prev":"next":t-r.activeIndex-1<r.params.slidesPerView?"next":"prev";r.loopFix({direction:i,slideTo:!0,activeSlideIndex:"next"===i?t+1:t-e+1,slideRealIndex:"next"===i?r.realIndex:void 0})}if(a){const t=n*r.params.grid.rows;n=r.slides.find(e=>1*e.getAttribute("data-swiper-slide-index")===t).column}else n=r.getSlideIndexByData(n)}return requestAnimationFrame(()=>{r.slideTo(n,e,i,s)}),r},slideNext:function(t,e=!0,i){const s=this,{enabled:r,params:a,animating:n}=s;if(!r||s.destroyed)return s;void 0===t&&(t=s.params.speed);let o=a.slidesPerGroup;"auto"===a.slidesPerView&&1===a.slidesPerGroup&&a.slidesPerGroupAuto&&(o=Math.max(s.slidesPerViewDynamic("current",!0),1));const l=s.activeIndex<a.slidesPerGroupSkip?1:o,d=s.virtual&&a.virtual.enabled;if(a.loop){if(n&&!d&&a.loopPreventsSliding)return!1;if(s.loopFix({direction:"next"}),s._clientLeft=s.wrapperEl.clientLeft,s.activeIndex===s.slides.length-1&&a.cssMode)return requestAnimationFrame(()=>{s.slideTo(s.activeIndex+l,t,e,i)}),!0}return a.rewind&&s.isEnd?s.slideTo(0,t,e,i):s.slideTo(s.activeIndex+l,t,e,i)},slidePrev:function(t,e=!0,i){const s=this,{params:r,snapGrid:a,slidesGrid:n,rtlTranslate:o,enabled:l,animating:d}=s;if(!l||s.destroyed)return s;void 0===t&&(t=s.params.speed);const c=s.virtual&&r.virtual.enabled;if(r.loop){if(d&&!c&&r.loopPreventsSliding)return!1;s.loopFix({direction:"prev"}),s._clientLeft=s.wrapperEl.clientLeft}function p(t){return t<0?-Math.floor(Math.abs(t)):Math.floor(t)}const h=p(o?s.translate:-s.translate),u=a.map(t=>p(t)),g=r.freeMode&&r.freeMode.enabled;let m=a[u.indexOf(h)-1];if(void 0===m&&(r.cssMode||g)){let t;a.forEach((e,i)=>{h>=e&&(t=i)}),void 0!==t&&(m=g?a[t]:a[t>0?t-1:t])}let v=0;if(void 0!==m&&(v=n.indexOf(m),v<0&&(v=s.activeIndex-1),"auto"===r.slidesPerView&&1===r.slidesPerGroup&&r.slidesPerGroupAuto&&(v=v-s.slidesPerViewDynamic("previous",!0)+1,v=Math.max(v,0))),r.rewind&&s.isBeginning){const r=s.params.virtual&&s.params.virtual.enabled&&s.virtual?s.virtual.slides.length-1:s.slides.length-1;return s.slideTo(r,t,e,i)}return r.loop&&0===s.activeIndex&&r.cssMode?(requestAnimationFrame(()=>{s.slideTo(v,t,e,i)}),!0):s.slideTo(v,t,e,i)},slideReset:function(t,e=!0,i){const s=this;if(!s.destroyed)return void 0===t&&(t=s.params.speed),s.slideTo(s.activeIndex,t,e,i)},slideToClosest:function(t,e=!0,i,s=.5){const r=this;if(r.destroyed)return;void 0===t&&(t=r.params.speed);let a=r.activeIndex;const n=Math.min(r.params.slidesPerGroupSkip,a),o=n+Math.floor((a-n)/r.params.slidesPerGroup),l=r.rtlTranslate?r.translate:-r.translate;if(l>=r.snapGrid[o]){const t=r.snapGrid[o];l-t>(r.snapGrid[o+1]-t)*s&&(a+=r.params.slidesPerGroup)}else{const t=r.snapGrid[o-1];l-t<=(r.snapGrid[o]-t)*s&&(a-=r.params.slidesPerGroup)}return a=Math.max(a,0),a=Math.min(a,r.slidesGrid.length-1),r.slideTo(a,t,e,i)},slideToClickedSlide:function(){const t=this;if(t.destroyed)return;const{params:e,slidesEl:i}=t,s="auto"===e.slidesPerView?t.slidesPerViewDynamic():e.slidesPerView;let r,a=t.getSlideIndexWhenGrid(t.clickedIndex);const n=t.isElement?"swiper-slide":`.${e.slideClass}`,o=t.grid&&t.params.grid&&t.params.grid.rows>1;if(e.loop){if(t.animating)return;r=parseInt(t.clickedSlide.getAttribute("data-swiper-slide-index"),10),e.centeredSlides?t.slideToLoop(r):a>(o?(t.slides.length-s)/2-(t.params.grid.rows-1):t.slides.length-s)?(t.loopFix(),a=t.getSlideIndex(rn(i,`${n}[data-swiper-slide-index="${r}"]`)[0]),Xa(()=>{t.slideTo(a)})):t.slideTo(a)}else t.slideTo(a)}};var En={loopCreate:function(t,e){const i=this,{params:s,slidesEl:r}=i;if(!s.loop||i.virtual&&i.params.virtual.enabled)return;const a=()=>{rn(r,`.${s.slideClass}, swiper-slide`).forEach((t,e)=>{t.setAttribute("data-swiper-slide-index",e)})},n=i.grid&&s.grid&&s.grid.rows>1;s.loopAddBlankSlides&&(s.slidesPerGroup>1||n)&&(()=>{const t=rn(r,`.${s.slideBlankClass}`);t.forEach(t=>{t.remove()}),t.length>0&&(i.recalcSlides(),i.updateSlides())})();const o=s.slidesPerGroup*(n?s.grid.rows:1),l=i.slides.length%o!==0,d=n&&i.slides.length%s.grid.rows!==0,c=t=>{for(let e=0;e<t;e+=1){const t=i.isElement?nn("swiper-slide",[s.slideBlankClass]):nn("div",[s.slideClass,s.slideBlankClass]);i.slidesEl.append(t)}};if(l){if(s.loopAddBlankSlides){c(o-i.slides.length%o),i.recalcSlides(),i.updateSlides()}else an("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");a()}else if(d){if(s.loopAddBlankSlides){c(s.grid.rows-i.slides.length%s.grid.rows),i.recalcSlides(),i.updateSlides()}else an("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");a()}else a();const p=s.centeredSlides||!!s.slidesOffsetBefore||!!s.slidesOffsetAfter;i.loopFix({slideRealIndex:t,direction:p?void 0:"next",initial:e})},loopFix:function({slideRealIndex:t,slideTo:e=!0,direction:i,setTranslate:s,activeSlideIndex:r,initial:a,byController:n,byMousewheel:o}={}){const l=this;if(!l.params.loop)return;l.emit("beforeLoopFix");const{slides:d,allowSlidePrev:c,allowSlideNext:p,slidesEl:h,params:u}=l,{centeredSlides:g,slidesOffsetBefore:m,slidesOffsetAfter:v,initialSlide:f}=u,b=g||!!m||!!v;if(l.allowSlidePrev=!0,l.allowSlideNext=!0,l.virtual&&u.virtual.enabled)return e&&(b||0!==l.snapIndex?b&&l.snapIndex<u.slidesPerView?l.slideTo(l.virtual.slides.length+l.snapIndex,0,!1,!0):l.snapIndex===l.snapGrid.length-1&&l.slideTo(l.virtual.slidesBefore,0,!1,!0):l.slideTo(l.virtual.slides.length,0,!1,!0)),l.allowSlidePrev=c,l.allowSlideNext=p,void l.emit("loopFix");let x=u.slidesPerView;"auto"===x?x=l.slidesPerViewDynamic():(x=Math.ceil(parseFloat(u.slidesPerView,10)),b&&x%2==0&&(x+=1));const y=u.slidesPerGroupAuto?x:u.slidesPerGroup;let _=b?Math.max(y,Math.ceil(x/2)):y;_%y!==0&&(_+=y-_%y),_+=u.loopAdditionalSlides,l.loopedSlides=_;const w=l.grid&&u.grid&&u.grid.rows>1;d.length<x+_||"cards"===l.params.effect&&d.length<x+2*_?an("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters"):w&&"row"===u.grid.fill&&an("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");const $=[],k=[],S=w?Math.ceil(d.length/u.grid.rows):d.length,M=a&&S-f<x&&!b;let T=M?f:l.activeIndex;void 0===r?r=l.getSlideIndex(d.find(t=>t.classList.contains(u.slideActiveClass))):T=r;const C="next"===i||!i,E="prev"===i||!i;let P=0,A=0;const z=(w?d[r].column:r)+(b&&void 0===s?-x/2+.5:0);if(z<_){P=Math.max(_-z,y);for(let t=0;t<_-z;t+=1){const e=t-Math.floor(t/S)*S;if(w){const t=S-e-1;for(let e=d.length-1;e>=0;e-=1)d[e].column===t&&$.push(e)}else $.push(S-e-1)}}else if(z+x>S-_){A=Math.max(z-(S-2*_),y),M&&(A=Math.max(A,x-S+f+1));for(let t=0;t<A;t+=1){const e=t-Math.floor(t/S)*S;w?d.forEach((t,i)=>{t.column===e&&k.push(i)}):k.push(e)}}if(l.__preventObserver__=!0,requestAnimationFrame(()=>{l.__preventObserver__=!1}),"cards"===l.params.effect&&d.length<x+2*_&&(k.includes(r)&&k.splice(k.indexOf(r),1),$.includes(r)&&$.splice($.indexOf(r),1)),E&&$.forEach(t=>{d[t].swiperLoopMoveDOM=!0,h.prepend(d[t]),d[t].swiperLoopMoveDOM=!1}),C&&k.forEach(t=>{d[t].swiperLoopMoveDOM=!0,h.append(d[t]),d[t].swiperLoopMoveDOM=!1}),l.recalcSlides(),"auto"===u.slidesPerView?l.updateSlides():w&&($.length>0&&E||k.length>0&&C)&&l.slides.forEach((t,e)=>{l.grid.updateSlide(e,t,l.slides)}),u.watchSlidesProgress&&l.updateSlidesOffset(),e)if($.length>0&&E){if(void 0===t){const t=l.slidesGrid[T],e=l.slidesGrid[T+P]-t;o?l.setTranslate(l.translate-e):(l.slideTo(T+Math.ceil(P),0,!1,!0),s&&(l.touchEventsData.startTranslate=l.touchEventsData.startTranslate-e,l.touchEventsData.currentTranslate=l.touchEventsData.currentTranslate-e))}else if(s){const t=w?$.length/u.grid.rows:$.length;l.slideTo(l.activeIndex+t,0,!1,!0),l.touchEventsData.currentTranslate=l.translate}}else if(k.length>0&&C)if(void 0===t){const t=l.slidesGrid[T],e=l.slidesGrid[T-A]-t;o?l.setTranslate(l.translate-e):(l.slideTo(T-A,0,!1,!0),s&&(l.touchEventsData.startTranslate=l.touchEventsData.startTranslate-e,l.touchEventsData.currentTranslate=l.touchEventsData.currentTranslate-e))}else{const t=w?k.length/u.grid.rows:k.length;l.slideTo(l.activeIndex-t,0,!1,!0)}if(l.allowSlidePrev=c,l.allowSlideNext=p,l.controller&&l.controller.control&&!n){const a={slideRealIndex:t,direction:i,setTranslate:s,activeSlideIndex:r,byController:!0};Array.isArray(l.controller.control)?l.controller.control.forEach(t=>{!t.destroyed&&t.params.loop&&t.loopFix({...a,slideTo:t.params.slidesPerView===u.slidesPerView&&e})}):l.controller.control instanceof l.constructor&&l.controller.control.params.loop&&l.controller.control.loopFix({...a,slideTo:l.controller.control.params.slidesPerView===u.slidesPerView&&e})}l.emit("loopFix")},loopDestroy:function(){const t=this,{params:e,slidesEl:i}=t;if(!e.loop||!i||t.virtual&&t.params.virtual.enabled)return;t.recalcSlides();const s=[];t.slides.forEach(t=>{const e=void 0===t.swiperSlideIndex?1*t.getAttribute("data-swiper-slide-index"):t.swiperSlideIndex;s[e]=t}),t.slides.forEach(t=>{t.removeAttribute("data-swiper-slide-index")}),s.forEach(t=>{i.append(t)}),t.recalcSlides(),t.slideTo(t.realIndex,0)}};function Pn(t,e,i){const s=Ya(),{params:r}=t,a=r.edgeSwipeDetection,n=r.edgeSwipeThreshold;return!a||!(i<=n||i>=s.innerWidth-n)||"prevent"===a&&(e.preventDefault(),!0)}function An(t){const e=this,i=Wa();let s=t;s.originalEvent&&(s=s.originalEvent);const r=e.touchEventsData;if("pointerdown"===s.type){if(null!==r.pointerId&&r.pointerId!==s.pointerId)return;r.pointerId=s.pointerId}else"touchstart"===s.type&&1===s.targetTouches.length&&(r.touchId=s.targetTouches[0].identifier);if("touchstart"===s.type)return void Pn(e,s,s.targetTouches[0].pageX);const{params:a,touches:n,enabled:o}=e;if(!o)return;if(!a.simulateTouch&&"mouse"===s.pointerType)return;if(e.animating&&a.preventInteractionOnTransition)return;!e.animating&&a.cssMode&&a.loop&&e.loopFix();let l=s.target;if("wrapper"===a.touchEventsTarget&&!function(t,e){const i=Ya();let s=e.contains(t);!s&&i.HTMLSlotElement&&e instanceof HTMLSlotElement&&(s=[...e.assignedElements()].includes(t),s||(s=function(t,e){const i=[e];for(;i.length>0;){const e=i.shift();if(t===e)return!0;i.push(...e.children,...e.shadowRoot?e.shadowRoot.children:[],...e.assignedElements?e.assignedElements():[])}}(t,e)));return s}(l,e.wrapperEl))return;if("which"in s&&3===s.which)return;if("button"in s&&s.button>0)return;if(r.isTouched&&r.isMoved)return;const d=!!a.noSwipingClass&&""!==a.noSwipingClass,c=s.composedPath?s.composedPath():s.path;d&&s.target&&s.target.shadowRoot&&c&&(l=c[0]);const p=a.noSwipingSelector?a.noSwipingSelector:`.${a.noSwipingClass}`,h=!(!s.target||!s.target.shadowRoot);if(a.noSwiping&&(h?function(t,e=this){return function e(i){if(!i||i===Wa()||i===Ya())return null;i.assignedSlot&&(i=i.assignedSlot);const s=i.closest(t);return s||i.getRootNode?s||e(i.getRootNode().host):null}(e)}(p,l):l.closest(p)))return void(e.allowClick=!0);if(a.swipeHandler&&!l.closest(a.swipeHandler))return;n.currentX=s.pageX,n.currentY=s.pageY;const u=n.currentX,g=n.currentY;if(!Pn(e,s,u))return;Object.assign(r,{isTouched:!0,isMoved:!1,allowTouchCallbacks:!0,isScrolling:void 0,startMoving:void 0}),n.startX=u,n.startY=g,r.touchStartTime=Ka(),e.allowClick=!0,e.updateSize(),e.swipeDirection=void 0,a.threshold>0&&(r.allowThresholdMove=!1);let m=!0;l.matches(r.focusableElements)&&(m=!1,"SELECT"===l.nodeName&&(r.isTouched=!1)),i.activeElement&&i.activeElement.matches(r.focusableElements)&&i.activeElement!==l&&("mouse"===s.pointerType||"mouse"!==s.pointerType&&!l.matches(r.focusableElements))&&i.activeElement.blur();const v=m&&e.allowTouchMove&&a.touchStartPreventDefault;!a.touchStartForcePreventDefault&&!v||l.isContentEditable||s.preventDefault(),a.freeMode&&a.freeMode.enabled&&e.freeMode&&e.animating&&!a.cssMode&&e.freeMode.onTouchStart(),e.emit("touchStart",s)}function zn(t){const e=Wa(),i=this,s=i.touchEventsData,{params:r,touches:a,rtlTranslate:n,enabled:o}=i;if(!o)return;if(!r.simulateTouch&&"mouse"===t.pointerType)return;let l,d=t;if(d.originalEvent&&(d=d.originalEvent),"pointermove"===d.type){if(null!==s.touchId)return;if(d.pointerId!==s.pointerId)return}if("touchmove"===d.type){if(l=[...d.changedTouches].find(t=>t.identifier===s.touchId),!l||l.identifier!==s.touchId)return}else l=d;if(!s.isTouched)return void(s.startMoving&&s.isScrolling&&i.emit("touchMoveOpposite",d));const c=l.pageX,p=l.pageY;if(d.preventedByNestedSwiper)return a.startX=c,void(a.startY=p);if(!i.allowTouchMove)return d.target.matches(s.focusableElements)||(i.allowClick=!1),void(s.isTouched&&(Object.assign(a,{startX:c,startY:p,currentX:c,currentY:p}),s.touchStartTime=Ka()));if(r.touchReleaseOnEdges&&!r.loop)if(i.isVertical()){if(p<a.startY&&i.translate<=i.maxTranslate()||p>a.startY&&i.translate>=i.minTranslate())return s.isTouched=!1,void(s.isMoved=!1)}else{if(n&&(c>a.startX&&-i.translate<=i.maxTranslate()||c<a.startX&&-i.translate>=i.minTranslate()))return;if(!n&&(c<a.startX&&i.translate<=i.maxTranslate()||c>a.startX&&i.translate>=i.minTranslate()))return}if(e.activeElement&&e.activeElement.matches(s.focusableElements)&&e.activeElement!==d.target&&"mouse"!==d.pointerType&&e.activeElement.blur(),e.activeElement&&d.target===e.activeElement&&d.target.matches(s.focusableElements))return s.isMoved=!0,void(i.allowClick=!1);s.allowTouchCallbacks&&i.emit("touchMove",d),a.previousX=a.currentX,a.previousY=a.currentY,a.currentX=c,a.currentY=p;const h=a.currentX-a.startX,u=a.currentY-a.startY;if(i.params.threshold&&Math.sqrt(h**2+u**2)<i.params.threshold)return;if(void 0===s.isScrolling){let t;i.isHorizontal()&&a.currentY===a.startY||i.isVertical()&&a.currentX===a.startX?s.isScrolling=!1:h*h+u*u>=25&&(t=180*Math.atan2(Math.abs(u),Math.abs(h))/Math.PI,s.isScrolling=i.isHorizontal()?t>r.touchAngle:90-t>r.touchAngle)}if(s.isScrolling&&i.emit("touchMoveOpposite",d),void 0===s.startMoving&&(a.currentX===a.startX&&a.currentY===a.startY||(s.startMoving=!0)),s.isScrolling||"touchmove"===d.type&&s.preventTouchMoveFromPointerMove)return void(s.isTouched=!1);if(!s.startMoving)return;i.allowClick=!1,!r.cssMode&&d.cancelable&&d.preventDefault(),r.touchMoveStopPropagation&&!r.nested&&d.stopPropagation();let g=i.isHorizontal()?h:u,m=i.isHorizontal()?a.currentX-a.previousX:a.currentY-a.previousY;r.oneWayMovement&&(g=Math.abs(g)*(n?1:-1),m=Math.abs(m)*(n?1:-1)),a.diff=g,g*=r.touchRatio,n&&(g=-g,m=-m);const v=i.touchesDirection;i.swipeDirection=g>0?"prev":"next",i.touchesDirection=m>0?"prev":"next";const f=i.params.loop&&!r.cssMode,b="next"===i.touchesDirection&&i.allowSlideNext||"prev"===i.touchesDirection&&i.allowSlidePrev;if(!s.isMoved){if(f&&b&&i.loopFix({direction:i.swipeDirection}),s.startTranslate=i.getTranslate(),i.setTransition(0),i.animating){const t=new window.CustomEvent("transitionend",{bubbles:!0,cancelable:!0,detail:{bySwiperTouchMove:!0}});i.wrapperEl.dispatchEvent(t)}s.allowMomentumBounce=!1,!r.grabCursor||!0!==i.allowSlideNext&&!0!==i.allowSlidePrev||i.setGrabCursor(!0),i.emit("sliderFirstMove",d)}if((new Date).getTime(),!1!==r._loopSwapReset&&s.isMoved&&s.allowThresholdMove&&v!==i.touchesDirection&&f&&b&&Math.abs(g)>=1)return Object.assign(a,{startX:c,startY:p,currentX:c,currentY:p,startTranslate:s.currentTranslate}),s.loopSwapReset=!0,void(s.startTranslate=s.currentTranslate);i.emit("sliderMove",d),s.isMoved=!0,s.currentTranslate=g+s.startTranslate;let x=!0,y=r.resistanceRatio;if(r.touchReleaseOnEdges&&(y=0),g>0?(f&&b&&s.allowThresholdMove&&s.currentTranslate>(r.centeredSlides?i.minTranslate()-i.slidesSizesGrid[i.activeIndex+1]-("auto"!==r.slidesPerView&&i.slides.length-r.slidesPerView>=2?i.slidesSizesGrid[i.activeIndex+1]+i.params.spaceBetween:0)-i.params.spaceBetween:i.minTranslate())&&i.loopFix({direction:"prev",setTranslate:!0,activeSlideIndex:0}),s.currentTranslate>i.minTranslate()&&(x=!1,r.resistance&&(s.currentTranslate=i.minTranslate()-1+(-i.minTranslate()+s.startTranslate+g)**y))):g<0&&(f&&b&&s.allowThresholdMove&&s.currentTranslate<(r.centeredSlides?i.maxTranslate()+i.slidesSizesGrid[i.slidesSizesGrid.length-1]+i.params.spaceBetween+("auto"!==r.slidesPerView&&i.slides.length-r.slidesPerView>=2?i.slidesSizesGrid[i.slidesSizesGrid.length-1]+i.params.spaceBetween:0):i.maxTranslate())&&i.loopFix({direction:"next",setTranslate:!0,activeSlideIndex:i.slides.length-("auto"===r.slidesPerView?i.slidesPerViewDynamic():Math.ceil(parseFloat(r.slidesPerView,10)))}),s.currentTranslate<i.maxTranslate()&&(x=!1,r.resistance&&(s.currentTranslate=i.maxTranslate()+1-(i.maxTranslate()-s.startTranslate-g)**y))),x&&(d.preventedByNestedSwiper=!0),!i.allowSlideNext&&"next"===i.swipeDirection&&s.currentTranslate<s.startTranslate&&(s.currentTranslate=s.startTranslate),!i.allowSlidePrev&&"prev"===i.swipeDirection&&s.currentTranslate>s.startTranslate&&(s.currentTranslate=s.startTranslate),i.allowSlidePrev||i.allowSlideNext||(s.currentTranslate=s.startTranslate),r.threshold>0){if(!(Math.abs(g)>r.threshold||s.allowThresholdMove))return void(s.currentTranslate=s.startTranslate);if(!s.allowThresholdMove)return s.allowThresholdMove=!0,a.startX=a.currentX,a.startY=a.currentY,s.currentTranslate=s.startTranslate,void(a.diff=i.isHorizontal()?a.currentX-a.startX:a.currentY-a.startY)}r.followFinger&&!r.cssMode&&((r.freeMode&&r.freeMode.enabled&&i.freeMode||r.watchSlidesProgress)&&(i.updateActiveIndex(),i.updateSlidesClasses()),r.freeMode&&r.freeMode.enabled&&i.freeMode&&i.freeMode.onTouchMove(),i.updateProgress(s.currentTranslate),i.setTranslate(s.currentTranslate))}function Ln(t){const e=this,i=e.touchEventsData;let s,r=t;r.originalEvent&&(r=r.originalEvent);if("touchend"===r.type||"touchcancel"===r.type){if(s=[...r.changedTouches].find(t=>t.identifier===i.touchId),!s||s.identifier!==i.touchId)return}else{if(null!==i.touchId)return;if(r.pointerId!==i.pointerId)return;s=r}if(["pointercancel","pointerout","pointerleave","contextmenu"].includes(r.type)){if(!(["pointercancel","contextmenu"].includes(r.type)&&(e.browser.isSafari||e.browser.isWebView)))return}i.pointerId=null,i.touchId=null;const{params:a,touches:n,rtlTranslate:o,slidesGrid:l,enabled:d}=e;if(!d)return;if(!a.simulateTouch&&"mouse"===r.pointerType)return;if(i.allowTouchCallbacks&&e.emit("touchEnd",r),i.allowTouchCallbacks=!1,!i.isTouched)return i.isMoved&&a.grabCursor&&e.setGrabCursor(!1),i.isMoved=!1,void(i.startMoving=!1);a.grabCursor&&i.isMoved&&i.isTouched&&(!0===e.allowSlideNext||!0===e.allowSlidePrev)&&e.setGrabCursor(!1);const c=Ka(),p=c-i.touchStartTime;if(e.allowClick){const t=r.path||r.composedPath&&r.composedPath();e.updateClickedSlide(t&&t[0]||r.target,t),e.emit("tap click",r),p<300&&c-i.lastClickTime<300&&e.emit("doubleTap doubleClick",r)}if(i.lastClickTime=Ka(),Xa(()=>{e.destroyed||(e.allowClick=!0)}),!i.isTouched||!i.isMoved||!e.swipeDirection||0===n.diff&&!i.loopSwapReset||i.currentTranslate===i.startTranslate&&!i.loopSwapReset)return i.isTouched=!1,i.isMoved=!1,void(i.startMoving=!1);let h;if(i.isTouched=!1,i.isMoved=!1,i.startMoving=!1,h=a.followFinger?o?e.translate:-e.translate:-i.currentTranslate,a.cssMode)return;if(a.freeMode&&a.freeMode.enabled)return void e.freeMode.onTouchEnd({currentPos:h});const u=h>=-e.maxTranslate()&&!e.params.loop;let g=0,m=e.slidesSizesGrid[0];for(let t=0;t<l.length;t+=t<a.slidesPerGroupSkip?1:a.slidesPerGroup){const e=t<a.slidesPerGroupSkip-1?1:a.slidesPerGroup;void 0!==l[t+e]?(u||h>=l[t]&&h<l[t+e])&&(g=t,m=l[t+e]-l[t]):(u||h>=l[t])&&(g=t,m=l[l.length-1]-l[l.length-2])}let v=null,f=null;a.rewind&&(e.isBeginning?f=a.virtual&&a.virtual.enabled&&e.virtual?e.virtual.slides.length-1:e.slides.length-1:e.isEnd&&(v=0));const b=(h-l[g])/m,x=g<a.slidesPerGroupSkip-1?1:a.slidesPerGroup;if(p>a.longSwipesMs){if(!a.longSwipes)return void e.slideTo(e.activeIndex);"next"===e.swipeDirection&&(b>=a.longSwipesRatio?e.slideTo(a.rewind&&e.isEnd?v:g+x):e.slideTo(g)),"prev"===e.swipeDirection&&(b>1-a.longSwipesRatio?e.slideTo(g+x):null!==f&&b<0&&Math.abs(b)>a.longSwipesRatio?e.slideTo(f):e.slideTo(g))}else{if(!a.shortSwipes)return void e.slideTo(e.activeIndex);e.navigation&&(r.target===e.navigation.nextEl||r.target===e.navigation.prevEl)?r.target===e.navigation.nextEl?e.slideTo(g+x):e.slideTo(g):("next"===e.swipeDirection&&e.slideTo(null!==v?v:g+x),"prev"===e.swipeDirection&&e.slideTo(null!==f?f:g))}}function On(){const t=this,{params:e,el:i}=t;if(i&&0===i.offsetWidth)return;e.breakpoints&&t.setBreakpoint();const{allowSlideNext:s,allowSlidePrev:r,snapGrid:a}=t,n=t.virtual&&t.params.virtual.enabled;t.allowSlideNext=!0,t.allowSlidePrev=!0,t.updateSize(),t.updateSlides(),t.updateSlidesClasses();const o=n&&e.loop;if(!("auto"===e.slidesPerView||e.slidesPerView>1)||!t.isEnd||t.isBeginning||t.params.centeredSlides||o)t.params.loop&&!n?t.slideToLoop(t.realIndex,0,!1,!0):t.slideTo(t.activeIndex,0,!1,!0);else{const e=n?t.virtual.slides:t.slides;t.slideTo(e.length-1,0,!1,!0)}t.autoplay&&t.autoplay.running&&t.autoplay.paused&&(clearTimeout(t.autoplay.resizeTimeout),t.autoplay.resizeTimeout=setTimeout(()=>{t.autoplay&&t.autoplay.running&&t.autoplay.paused&&t.autoplay.resume()},500)),t.allowSlidePrev=r,t.allowSlideNext=s,t.params.watchOverflow&&a!==t.snapGrid&&t.checkOverflow()}function In(t){const e=this;e.enabled&&(e.allowClick||(e.params.preventClicks&&t.preventDefault(),e.params.preventClicksPropagation&&e.animating&&(t.stopPropagation(),t.stopImmediatePropagation())))}function Dn(){const t=this,{wrapperEl:e,rtlTranslate:i,enabled:s}=t;if(!s)return;let r;t.previousTranslate=t.translate,t.isHorizontal()?t.translate=-e.scrollLeft:t.translate=-e.scrollTop,0===t.translate&&(t.translate=0),t.updateActiveIndex(),t.updateSlidesClasses();const a=t.maxTranslate()-t.minTranslate();r=0===a?0:(t.translate-t.minTranslate())/a,r!==t.progress&&t.updateProgress(i?-t.translate:t.translate),t.emit("setTranslate",t.translate,!1)}function Fn(t){const e=this;wn(e,t.target),e.params.cssMode||"auto"!==e.params.slidesPerView&&!e.params.autoHeight||e.update()}function Nn(){const t=this;t.documentTouchHandlerProceeded||(t.documentTouchHandlerProceeded=!0,t.params.touchReleaseOnEdges&&(t.el.style.touchAction="auto"))}const Rn=(t,e)=>{const i=Wa(),{params:s,el:r,wrapperEl:a,device:n}=t,o=!!s.nested,l="on"===e?"addEventListener":"removeEventListener",d=e;r&&"string"!=typeof r&&(i[l]("touchstart",t.onDocumentTouchStart,{passive:!1,capture:o}),r[l]("touchstart",t.onTouchStart,{passive:!1}),r[l]("pointerdown",t.onTouchStart,{passive:!1}),i[l]("touchmove",t.onTouchMove,{passive:!1,capture:o}),i[l]("pointermove",t.onTouchMove,{passive:!1,capture:o}),i[l]("touchend",t.onTouchEnd,{passive:!0}),i[l]("pointerup",t.onTouchEnd,{passive:!0}),i[l]("pointercancel",t.onTouchEnd,{passive:!0}),i[l]("touchcancel",t.onTouchEnd,{passive:!0}),i[l]("pointerout",t.onTouchEnd,{passive:!0}),i[l]("pointerleave",t.onTouchEnd,{passive:!0}),i[l]("contextmenu",t.onTouchEnd,{passive:!0}),(s.preventClicks||s.preventClicksPropagation)&&r[l]("click",t.onClick,!0),s.cssMode&&a[l]("scroll",t.onScroll),s.updateOnWindowResize?t[d](n.ios||n.android?"resize orientationchange observerUpdate":"resize observerUpdate",On,!0):t[d]("observerUpdate",On,!0),r[l]("load",t.onLoad,{capture:!0}))};const Bn=(t,e)=>t.grid&&e.grid&&e.grid.rows>1;var Vn={setBreakpoint:function(){const t=this,{realIndex:e,initialized:i,params:s,el:r}=t,a=s.breakpoints;if(!a||a&&0===Object.keys(a).length)return;const n=Wa(),o="window"!==s.breakpointsBase&&s.breakpointsBase?"container":s.breakpointsBase,l=["window","container"].includes(s.breakpointsBase)||!s.breakpointsBase?t.el:n.querySelector(s.breakpointsBase),d=t.getBreakpoint(a,o,l);if(!d||t.currentBreakpoint===d)return;const c=(d in a?a[d]:void 0)||t.originalParams,p=Bn(t,s),h=Bn(t,c),u=t.params.grabCursor,g=c.grabCursor,m=s.enabled;p&&!h?(r.classList.remove(`${s.containerModifierClass}grid`,`${s.containerModifierClass}grid-column`),t.emitContainerClasses()):!p&&h&&(r.classList.add(`${s.containerModifierClass}grid`),(c.grid.fill&&"column"===c.grid.fill||!c.grid.fill&&"column"===s.grid.fill)&&r.classList.add(`${s.containerModifierClass}grid-column`),t.emitContainerClasses()),u&&!g?t.unsetGrabCursor():!u&&g&&t.setGrabCursor(),["navigation","pagination","scrollbar"].forEach(e=>{if(void 0===c[e])return;const i=s[e]&&s[e].enabled,r=c[e]&&c[e].enabled;i&&!r&&t[e].disable(),!i&&r&&t[e].enable()});const v=c.direction&&c.direction!==s.direction,f=s.loop&&(c.slidesPerView!==s.slidesPerView||v),b=s.loop;v&&i&&t.changeDirection(),tn(t.params,c);const x=t.params.enabled,y=t.params.loop;Object.assign(t,{allowTouchMove:t.params.allowTouchMove,allowSlideNext:t.params.allowSlideNext,allowSlidePrev:t.params.allowSlidePrev}),m&&!x?t.disable():!m&&x&&t.enable(),t.currentBreakpoint=d,t.emit("_beforeBreakpoint",c),i&&(f?(t.loopDestroy(),t.loopCreate(e),t.updateSlides()):!b&&y?(t.loopCreate(e),t.updateSlides()):b&&!y&&t.loopDestroy()),t.emit("breakpoint",c)},getBreakpoint:function(t,e="window",i){if(!t||"container"===e&&!i)return;let s=!1;const r=Ya(),a="window"===e?r.innerHeight:i.clientHeight,n=Object.keys(t).map(t=>{if("string"==typeof t&&0===t.indexOf("@")){const e=parseFloat(t.substr(1));return{value:a*e,point:t}}return{value:t,point:t}});n.sort((t,e)=>parseInt(t.value,10)-parseInt(e.value,10));for(let t=0;t<n.length;t+=1){const{point:a,value:o}=n[t];"window"===e?r.matchMedia(`(min-width: ${o}px)`).matches&&(s=a):o<=i.clientWidth&&(s=a)}return s||"max"}};var jn={init:!0,direction:"horizontal",oneWayMovement:!1,swiperElementNodeName:"SWIPER-CONTAINER",touchEventsTarget:"wrapper",initialSlide:0,speed:300,cssMode:!1,updateOnWindowResize:!0,resizeObserver:!0,nested:!1,createElements:!1,eventsPrefix:"swiper",enabled:!0,focusableElements:"input, select, option, textarea, button, video, label",width:null,height:null,preventInteractionOnTransition:!1,userAgent:null,url:null,edgeSwipeDetection:!1,edgeSwipeThreshold:20,autoHeight:!1,setWrapperSize:!1,virtualTranslate:!1,effect:"slide",breakpoints:void 0,breakpointsBase:"window",spaceBetween:0,slidesPerView:1,slidesPerGroup:1,slidesPerGroupSkip:0,slidesPerGroupAuto:!1,centeredSlides:!1,centeredSlidesBounds:!1,slidesOffsetBefore:0,slidesOffsetAfter:0,normalizeSlideIndex:!0,centerInsufficientSlides:!1,snapToSlideEdge:!1,watchOverflow:!0,roundLengths:!1,touchRatio:1,touchAngle:45,simulateTouch:!0,shortSwipes:!0,longSwipes:!0,longSwipesRatio:.5,longSwipesMs:300,followFinger:!0,allowTouchMove:!0,threshold:5,touchMoveStopPropagation:!1,touchStartPreventDefault:!0,touchStartForcePreventDefault:!1,touchReleaseOnEdges:!1,uniqueNavElements:!0,resistance:!0,resistanceRatio:.85,watchSlidesProgress:!1,grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slideToClickedSlide:!1,loop:!1,loopAddBlankSlides:!0,loopAdditionalSlides:0,loopPreventsSliding:!0,rewind:!1,allowSlidePrev:!0,allowSlideNext:!0,swipeHandler:null,noSwiping:!0,noSwipingClass:"swiper-no-swiping",noSwipingSelector:null,passiveListeners:!0,maxBackfaceHiddenSlides:10,containerModifierClass:"swiper-",slideClass:"swiper-slide",slideBlankClass:"swiper-slide-blank",slideActiveClass:"swiper-slide-active",slideVisibleClass:"swiper-slide-visible",slideFullyVisibleClass:"swiper-slide-fully-visible",slideNextClass:"swiper-slide-next",slidePrevClass:"swiper-slide-prev",wrapperClass:"swiper-wrapper",lazyPreloaderClass:"swiper-lazy-preloader",lazyPreloadPrevNext:0,runCallbacksOnInit:!0,_emitClasses:!1};function Gn(t,e){return function(i={}){const s=Object.keys(i)[0],r=i[s];"object"==typeof r&&null!==r?(!0===t[s]&&(t[s]={enabled:!0}),"navigation"===s&&t[s]&&t[s].enabled&&!t[s].prevEl&&!t[s].nextEl&&(t[s].auto=!0),["pagination","scrollbar"].indexOf(s)>=0&&t[s]&&t[s].enabled&&!t[s].el&&(t[s].auto=!0),s in t&&"enabled"in r?("object"!=typeof t[s]||"enabled"in t[s]||(t[s].enabled=!0),t[s]||(t[s]={enabled:!1}),tn(e,i)):tn(e,i)):tn(e,i)}}const qn={eventsEmitter:xn,update:Sn,translate:Mn,transition:{setTransition:function(t,e){const i=this;i.params.cssMode||(i.wrapperEl.style.transitionDuration=`${t}ms`,i.wrapperEl.style.transitionDelay=0===t?"0ms":""),i.emit("setTransition",t,e)},transitionStart:function(t=!0,e){const i=this,{params:s}=i;s.cssMode||(s.autoHeight&&i.updateAutoHeight(),Tn({swiper:i,runCallbacks:t,direction:e,step:"Start"}))},transitionEnd:function(t=!0,e){const i=this,{params:s}=i;i.animating=!1,s.cssMode||(i.setTransition(0),Tn({swiper:i,runCallbacks:t,direction:e,step:"End"}))}},slide:Cn,loop:En,grabCursor:{setGrabCursor:function(t){const e=this;if(!e.params.simulateTouch||e.params.watchOverflow&&e.isLocked||e.params.cssMode)return;const i="container"===e.params.touchEventsTarget?e.el:e.wrapperEl;e.isElement&&(e.__preventObserver__=!0),i.style.cursor="move",i.style.cursor=t?"grabbing":"grab",e.isElement&&requestAnimationFrame(()=>{e.__preventObserver__=!1})},unsetGrabCursor:function(){const t=this;t.params.watchOverflow&&t.isLocked||t.params.cssMode||(t.isElement&&(t.__preventObserver__=!0),t["container"===t.params.touchEventsTarget?"el":"wrapperEl"].style.cursor="",t.isElement&&requestAnimationFrame(()=>{t.__preventObserver__=!1}))}},events:{attachEvents:function(){const t=this,{params:e}=t;t.onTouchStart=An.bind(t),t.onTouchMove=zn.bind(t),t.onTouchEnd=Ln.bind(t),t.onDocumentTouchStart=Nn.bind(t),e.cssMode&&(t.onScroll=Dn.bind(t)),t.onClick=In.bind(t),t.onLoad=Fn.bind(t),Rn(t,"on")},detachEvents:function(){Rn(this,"off")}},breakpoints:Vn,checkOverflow:{checkOverflow:function(){const t=this,{isLocked:e,params:i}=t,{slidesOffsetBefore:s}=i;if(s){const e=t.slides.length-1,i=t.slidesGrid[e]+t.slidesSizesGrid[e]+2*s;t.isLocked=t.size>i}else t.isLocked=1===t.snapGrid.length;!0===i.allowSlideNext&&(t.allowSlideNext=!t.isLocked),!0===i.allowSlidePrev&&(t.allowSlidePrev=!t.isLocked),e&&e!==t.isLocked&&(t.isEnd=!1),e!==t.isLocked&&t.emit(t.isLocked?"lock":"unlock")}},classes:{addClasses:function(){const t=this,{classNames:e,params:i,rtl:s,el:r,device:a}=t,n=function(t,e){const i=[];return t.forEach(t=>{"object"==typeof t?Object.keys(t).forEach(s=>{t[s]&&i.push(e+s)}):"string"==typeof t&&i.push(e+t)}),i}(["initialized",i.direction,{"free-mode":t.params.freeMode&&i.freeMode.enabled},{autoheight:i.autoHeight},{rtl:s},{grid:i.grid&&i.grid.rows>1},{"grid-column":i.grid&&i.grid.rows>1&&"column"===i.grid.fill},{android:a.android},{ios:a.ios},{"css-mode":i.cssMode},{centered:i.cssMode&&i.centeredSlides},{"watch-progress":i.watchSlidesProgress}],i.containerModifierClass);e.push(...n),r.classList.add(...e),t.emitContainerClasses()},removeClasses:function(){const{el:t,classNames:e}=this;t&&"string"!=typeof t&&(t.classList.remove(...e),this.emitContainerClasses())}}},Un={};class Wn{constructor(...t){let e,i;1===t.length&&t[0].constructor&&"Object"===Object.prototype.toString.call(t[0]).slice(8,-1)?i=t[0]:[e,i]=t,i||(i={}),i=tn({},i),e&&!i.el&&(i.el=e);const s=Wa();if(i.el&&"string"==typeof i.el&&s.querySelectorAll(i.el).length>1){const t=[];return s.querySelectorAll(i.el).forEach(e=>{const s=tn({},i,{el:e});t.push(new Wn(s))}),t}const r=this;r.__swiper__=!0,r.support=vn(),r.device=fn({userAgent:i.userAgent}),r.browser=bn(),r.eventsListeners={},r.eventsAnyListeners=[],r.modules=[...r.__modules__],i.modules&&Array.isArray(i.modules)&&i.modules.forEach(t=>{"function"==typeof t&&r.modules.indexOf(t)<0&&r.modules.push(t)});const a={};r.modules.forEach(t=>{t({params:i,swiper:r,extendParams:Gn(i,a),on:r.on.bind(r),once:r.once.bind(r),off:r.off.bind(r),emit:r.emit.bind(r)})});const n=tn({},jn,a);return r.params=tn({},n,Un,i),r.originalParams=tn({},r.params),r.passedParams=tn({},i),r.params&&r.params.on&&Object.keys(r.params.on).forEach(t=>{r.on(t,r.params.on[t])}),r.params&&r.params.onAny&&r.onAny(r.params.onAny),Object.assign(r,{enabled:r.params.enabled,el:e,classNames:[],slides:[],slidesGrid:[],snapGrid:[],slidesSizesGrid:[],isHorizontal:()=>"horizontal"===r.params.direction,isVertical:()=>"vertical"===r.params.direction,activeIndex:0,realIndex:0,isBeginning:!0,isEnd:!1,translate:0,previousTranslate:0,progress:0,velocity:0,animating:!1,cssOverflowAdjustment(){return Math.trunc(this.translate/2**23)*2**23},allowSlideNext:r.params.allowSlideNext,allowSlidePrev:r.params.allowSlidePrev,touchEventsData:{isTouched:void 0,isMoved:void 0,allowTouchCallbacks:void 0,touchStartTime:void 0,isScrolling:void 0,currentTranslate:void 0,startTranslate:void 0,allowThresholdMove:void 0,focusableElements:r.params.focusableElements,lastClickTime:0,clickTimeout:void 0,velocities:[],allowMomentumBounce:void 0,startMoving:void 0,pointerId:null,touchId:null},allowClick:!0,allowTouchMove:r.params.allowTouchMove,touches:{startX:0,startY:0,currentX:0,currentY:0,diff:0},imagesToLoad:[],imagesLoaded:0}),r.emit("_swiper"),r.params.init&&r.init(),r}getDirectionLabel(t){return this.isHorizontal()?t:{width:"height","margin-top":"margin-left","margin-bottom ":"margin-right","margin-left":"margin-top","margin-right":"margin-bottom","padding-left":"padding-top","padding-right":"padding-bottom",marginRight:"marginBottom"}[t]}getSlideIndex(t){const{slidesEl:e,params:i}=this,s=ln(rn(e,`.${i.slideClass}, swiper-slide`)[0]);return ln(t)-s}getSlideIndexByData(t){return this.getSlideIndex(this.slides.find(e=>1*e.getAttribute("data-swiper-slide-index")===t))}getSlideIndexWhenGrid(t){return this.grid&&this.params.grid&&this.params.grid.rows>1&&("column"===this.params.grid.fill?t=Math.floor(t/this.params.grid.rows):"row"===this.params.grid.fill&&(t%=Math.ceil(this.slides.length/this.params.grid.rows))),t}recalcSlides(){const{slidesEl:t,params:e}=this;this.slides=rn(t,`.${e.slideClass}, swiper-slide`)}enable(){const t=this;t.enabled||(t.enabled=!0,t.params.grabCursor&&t.setGrabCursor(),t.emit("enable"))}disable(){const t=this;t.enabled&&(t.enabled=!1,t.params.grabCursor&&t.unsetGrabCursor(),t.emit("disable"))}setProgress(t,e){const i=this;t=Math.min(Math.max(t,0),1);const s=i.minTranslate(),r=(i.maxTranslate()-s)*t+s;i.translateTo(r,void 0===e?0:e),i.updateActiveIndex(),i.updateSlidesClasses()}emitContainerClasses(){const t=this;if(!t.params._emitClasses||!t.el)return;const e=t.el.className.split(" ").filter(e=>0===e.indexOf("swiper")||0===e.indexOf(t.params.containerModifierClass));t.emit("_containerClasses",e.join(" "))}getSlideClasses(t){const e=this;return e.destroyed?"":t.className.split(" ").filter(t=>0===t.indexOf("swiper-slide")||0===t.indexOf(e.params.slideClass)).join(" ")}emitSlidesClasses(){const t=this;if(!t.params._emitClasses||!t.el)return;const e=[];t.slides.forEach(i=>{const s=t.getSlideClasses(i);e.push({slideEl:i,classNames:s}),t.emit("_slideClass",i,s)}),t.emit("_slideClasses",e)}slidesPerViewDynamic(t="current",e=!1){const{params:i,slides:s,slidesGrid:r,slidesSizesGrid:a,size:n,activeIndex:o}=this;let l=1;if("number"==typeof i.slidesPerView)return i.slidesPerView;if(i.centeredSlides){let t,e=s[o]?Math.ceil(s[o].swiperSlideSize):0;for(let i=o+1;i<s.length;i+=1)s[i]&&!t&&(e+=Math.ceil(s[i].swiperSlideSize),l+=1,e>n&&(t=!0));for(let i=o-1;i>=0;i-=1)s[i]&&!t&&(e+=s[i].swiperSlideSize,l+=1,e>n&&(t=!0))}else if("current"===t)for(let t=o+1;t<s.length;t+=1){(e?r[t]+a[t]-r[o]<n:r[t]-r[o]<n)&&(l+=1)}else for(let t=o-1;t>=0;t-=1){r[o]-r[t]<n&&(l+=1)}return l}update(){const t=this;if(!t||t.destroyed)return;const{snapGrid:e,params:i}=t;function s(){const e=t.rtlTranslate?-1*t.translate:t.translate,i=Math.min(Math.max(e,t.maxTranslate()),t.minTranslate());t.setTranslate(i),t.updateActiveIndex(),t.updateSlidesClasses()}let r;if(i.breakpoints&&t.setBreakpoint(),[...t.el.querySelectorAll('[loading="lazy"]')].forEach(e=>{e.complete&&wn(t,e)}),t.updateSize(),t.updateSlides(),t.updateProgress(),t.updateSlidesClasses(),i.freeMode&&i.freeMode.enabled&&!i.cssMode)s(),i.autoHeight&&t.updateAutoHeight();else{if(("auto"===i.slidesPerView||i.slidesPerView>1)&&t.isEnd&&!i.centeredSlides){const e=t.virtual&&i.virtual.enabled?t.virtual.slides:t.slides;r=t.slideTo(e.length-1,0,!1,!0)}else r=t.slideTo(t.activeIndex,0,!1,!0);r||s()}i.watchOverflow&&e!==t.snapGrid&&t.checkOverflow(),t.emit("update")}changeDirection(t,e=!0){const i=this,s=i.params.direction;return t||(t="horizontal"===s?"vertical":"horizontal"),t===s||"horizontal"!==t&&"vertical"!==t||(i.el.classList.remove(`${i.params.containerModifierClass}${s}`),i.el.classList.add(`${i.params.containerModifierClass}${t}`),i.emitContainerClasses(),i.params.direction=t,i.slides.forEach(e=>{"vertical"===t?e.style.width="":e.style.height=""}),i.emit("changeDirection"),e&&i.update()),i}changeLanguageDirection(t){const e=this;e.rtl&&"rtl"===t||!e.rtl&&"ltr"===t||(e.rtl="rtl"===t,e.rtlTranslate="horizontal"===e.params.direction&&e.rtl,e.rtl?(e.el.classList.add(`${e.params.containerModifierClass}rtl`),e.el.dir="rtl"):(e.el.classList.remove(`${e.params.containerModifierClass}rtl`),e.el.dir="ltr"),e.update())}mount(t){const e=this;if(e.mounted)return!0;let i=t||e.params.el;if("string"==typeof i&&(i=document.querySelector(i)),!i)return!1;i.swiper=e,i.parentNode&&i.parentNode.host&&i.parentNode.host.nodeName===e.params.swiperElementNodeName.toUpperCase()&&(e.isElement=!0);const s=()=>`.${(e.params.wrapperClass||"").trim().split(" ").join(".")}`;let r=(()=>{if(i&&i.shadowRoot&&i.shadowRoot.querySelector){return i.shadowRoot.querySelector(s())}return rn(i,s())[0]})();return!r&&e.params.createElements&&(r=nn("div",e.params.wrapperClass),i.append(r),rn(i,`.${e.params.slideClass}`).forEach(t=>{r.append(t)})),Object.assign(e,{el:i,wrapperEl:r,slidesEl:e.isElement&&!i.parentNode.host.slideSlots?i.parentNode.host:r,hostEl:e.isElement?i.parentNode.host:i,mounted:!0,rtl:"rtl"===i.dir.toLowerCase()||"rtl"===on(i,"direction"),rtlTranslate:"horizontal"===e.params.direction&&("rtl"===i.dir.toLowerCase()||"rtl"===on(i,"direction")),wrongRTL:"-webkit-box"===on(r,"display")}),!0}init(t){const e=this;if(e.initialized)return e;if(!1===e.mount(t))return e;e.emit("beforeInit"),e.params.breakpoints&&e.setBreakpoint(),e.addClasses(),e.updateSize(),e.updateSlides(),e.params.watchOverflow&&e.checkOverflow(),e.params.grabCursor&&e.enabled&&e.setGrabCursor(),e.params.loop&&e.virtual&&e.params.virtual.enabled?e.slideTo(e.params.initialSlide+e.virtual.slidesBefore,0,e.params.runCallbacksOnInit,!1,!0):e.slideTo(e.params.initialSlide,0,e.params.runCallbacksOnInit,!1,!0),e.params.loop&&e.loopCreate(void 0,!0),e.attachEvents();const i=[...e.el.querySelectorAll('[loading="lazy"]')];return e.isElement&&i.push(...e.hostEl.querySelectorAll('[loading="lazy"]')),i.forEach(t=>{t.complete?wn(e,t):t.addEventListener("load",t=>{wn(e,t.target)})}),kn(e),e.initialized=!0,kn(e),e.emit("init"),e.emit("afterInit"),e}destroy(t=!0,e=!0){const i=this,{params:s,el:r,wrapperEl:a,slides:n}=i;return void 0===i.params||i.destroyed||(i.emit("beforeDestroy"),i.initialized=!1,i.detachEvents(),s.loop&&i.loopDestroy(),e&&(i.removeClasses(),r&&"string"!=typeof r&&r.removeAttribute("style"),a&&a.removeAttribute("style"),n&&n.length&&n.forEach(t=>{t.classList.remove(s.slideVisibleClass,s.slideFullyVisibleClass,s.slideActiveClass,s.slideNextClass,s.slidePrevClass),t.removeAttribute("style"),t.removeAttribute("data-swiper-slide-index")})),i.emit("destroy"),Object.keys(i.eventsListeners).forEach(t=>{i.off(t)}),!1!==t&&(i.el&&"string"!=typeof i.el&&(i.el.swiper=null),function(t){const e=t;Object.keys(e).forEach(t=>{try{e[t]=null}catch(t){}try{delete e[t]}catch(t){}})}(i)),i.destroyed=!0),null}static extendDefaults(t){tn(Un,t)}static get extendedDefaults(){return Un}static get defaults(){return jn}static installModule(t){Wn.prototype.__modules__||(Wn.prototype.__modules__=[]);const e=Wn.prototype.__modules__;"function"==typeof t&&e.indexOf(t)<0&&e.push(t)}static use(t){return Array.isArray(t)?(t.forEach(t=>Wn.installModule(t)),Wn):(Wn.installModule(t),Wn)}}function Hn(t=""){return`.${t.trim().replace(/([\.:!+\/()[\]#>~*^$|=,'"@{}\\])/g,"\\$1").replace(/ /g,".")}`}function Yn({swiper:t,extendParams:e,on:i,emit:s}){const r="swiper-pagination";let a;e({pagination:{el:null,bulletElement:"span",clickable:!1,hideOnClick:!1,renderBullet:null,renderProgressbar:null,renderFraction:null,renderCustom:null,progressbarOpposite:!1,type:"bullets",dynamicBullets:!1,dynamicMainBullets:1,formatFractionCurrent:t=>t,formatFractionTotal:t=>t,bulletClass:`${r}-bullet`,bulletActiveClass:`${r}-bullet-active`,modifierClass:`${r}-`,currentClass:`${r}-current`,totalClass:`${r}-total`,hiddenClass:`${r}-hidden`,progressbarFillClass:`${r}-progressbar-fill`,progressbarOppositeClass:`${r}-progressbar-opposite`,clickableClass:`${r}-clickable`,lockClass:`${r}-lock`,horizontalClass:`${r}-horizontal`,verticalClass:`${r}-vertical`,paginationDisabledClass:`${r}-disabled`}}),t.pagination={el:null,bullets:[]};let n=0;function o(){return!t.params.pagination.el||!t.pagination.el||Array.isArray(t.pagination.el)&&0===t.pagination.el.length}function l(e,i){const{bulletActiveClass:s}=t.params.pagination;e&&(e=e[("prev"===i?"previous":"next")+"ElementSibling"])&&(e.classList.add(`${s}-${i}`),(e=e[("prev"===i?"previous":"next")+"ElementSibling"])&&e.classList.add(`${s}-${i}-${i}`))}function d(e){const i=e.target.closest(Hn(t.params.pagination.bulletClass));if(!i)return;e.preventDefault();const s=ln(i)*t.params.slidesPerGroup;if(t.params.loop){if(t.realIndex===s)return;const e=(r=t.realIndex,a=s,n=t.slides.length,(a%=n)===1+(r%=n)?"next":a===r-1?"previous":void 0);"next"===e?t.slideNext():"previous"===e?t.slidePrev():t.slideToLoop(s)}else t.slideTo(s);var r,a,n}function c(){const e=t.rtl,i=t.params.pagination;if(o())return;let r,d,c=t.pagination.el;c=pn(c);const p=t.virtual&&t.params.virtual.enabled?t.virtual.slides.length:t.slides.length,h=t.params.loop?Math.ceil(p/t.params.slidesPerGroup):t.snapGrid.length;if(t.params.loop?(d=t.previousRealIndex||0,r=t.params.slidesPerGroup>1?Math.floor(t.realIndex/t.params.slidesPerGroup):t.realIndex):void 0!==t.snapIndex?(r=t.snapIndex,d=t.previousSnapIndex):(d=t.previousIndex||0,r=t.activeIndex||0),"bullets"===i.type&&t.pagination.bullets&&t.pagination.bullets.length>0){const s=t.pagination.bullets;let o,p,h;if(i.dynamicBullets&&(a=cn(s[0],t.isHorizontal()?"width":"height"),c.forEach(e=>{e.style[t.isHorizontal()?"width":"height"]=a*(i.dynamicMainBullets+4)+"px"}),i.dynamicMainBullets>1&&void 0!==d&&(n+=r-(d||0),n>i.dynamicMainBullets-1?n=i.dynamicMainBullets-1:n<0&&(n=0)),o=Math.max(r-n,0),p=o+(Math.min(s.length,i.dynamicMainBullets)-1),h=(p+o)/2),s.forEach(t=>{const e=[...["","-next","-next-next","-prev","-prev-prev","-main"].map(t=>`${i.bulletActiveClass}${t}`)].map(t=>"string"==typeof t&&t.includes(" ")?t.split(" "):t).flat();t.classList.remove(...e)}),c.length>1)s.forEach(e=>{const s=ln(e);s===r?e.classList.add(...i.bulletActiveClass.split(" ")):t.isElement&&e.setAttribute("part","bullet"),i.dynamicBullets&&(s>=o&&s<=p&&e.classList.add(...`${i.bulletActiveClass}-main`.split(" ")),s===o&&l(e,"prev"),s===p&&l(e,"next"))});else{const e=s[r];if(e&&e.classList.add(...i.bulletActiveClass.split(" ")),t.isElement&&s.forEach((t,e)=>{t.setAttribute("part",e===r?"bullet-active":"bullet")}),i.dynamicBullets){const t=s[o],e=s[p];for(let t=o;t<=p;t+=1)s[t]&&s[t].classList.add(...`${i.bulletActiveClass}-main`.split(" "));l(t,"prev"),l(e,"next")}}if(i.dynamicBullets){const r=Math.min(s.length,i.dynamicMainBullets+4),n=(a*r-a)/2-h*a,o=e?"right":"left";s.forEach(e=>{e.style[t.isHorizontal()?o:"top"]=`${n}px`})}}c.forEach((e,a)=>{if("fraction"===i.type&&(e.querySelectorAll(Hn(i.currentClass)).forEach(t=>{t.textContent=i.formatFractionCurrent(r+1)}),e.querySelectorAll(Hn(i.totalClass)).forEach(t=>{t.textContent=i.formatFractionTotal(h)})),"progressbar"===i.type){let s;s=i.progressbarOpposite?t.isHorizontal()?"vertical":"horizontal":t.isHorizontal()?"horizontal":"vertical";const a=(r+1)/h;let n=1,o=1;"horizontal"===s?n=a:o=a,e.querySelectorAll(Hn(i.progressbarFillClass)).forEach(e=>{e.style.transform=`translate3d(0,0,0) scaleX(${n}) scaleY(${o})`,e.style.transitionDuration=`${t.params.speed}ms`})}"custom"===i.type&&i.renderCustom?(hn(e,i.renderCustom(t,r+1,h)),0===a&&s("paginationRender",e)):(0===a&&s("paginationRender",e),s("paginationUpdate",e)),t.params.watchOverflow&&t.enabled&&e.classList[t.isLocked?"add":"remove"](i.lockClass)})}function p(){const e=t.params.pagination;if(o())return;const i=t.virtual&&t.params.virtual.enabled?t.virtual.slides.length:t.grid&&t.params.grid.rows>1?t.slides.length/Math.ceil(t.params.grid.rows):t.slides.length;let r=t.pagination.el;r=pn(r);let a="";if("bullets"===e.type){let s=t.params.loop?Math.ceil(i/t.params.slidesPerGroup):t.snapGrid.length;t.params.freeMode&&t.params.freeMode.enabled&&s>i&&(s=i);for(let i=0;i<s;i+=1)e.renderBullet?a+=e.renderBullet.call(t,i,e.bulletClass):a+=`<${e.bulletElement} ${t.isElement?'part="bullet"':""} class="${e.bulletClass}"></${e.bulletElement}>`}"fraction"===e.type&&(a=e.renderFraction?e.renderFraction.call(t,e.currentClass,e.totalClass):`<span class="${e.currentClass}"></span> / <span class="${e.totalClass}"></span>`),"progressbar"===e.type&&(a=e.renderProgressbar?e.renderProgressbar.call(t,e.progressbarFillClass):`<span class="${e.progressbarFillClass}"></span>`),t.pagination.bullets=[],r.forEach(i=>{"custom"!==e.type&&hn(i,a||""),"bullets"===e.type&&t.pagination.bullets.push(...i.querySelectorAll(Hn(e.bulletClass)))}),"custom"!==e.type&&s("paginationRender",r[0])}function h(){t.params.pagination=function(t,e,i,s){return t.params.createElements&&Object.keys(s).forEach(r=>{if(!i[r]&&!0===i.auto){let a=rn(t.el,`.${s[r]}`)[0];a||(a=nn("div",s[r]),a.className=s[r],t.el.append(a)),i[r]=a,e[r]=a}}),i}(t,t.originalParams.pagination,t.params.pagination,{el:"swiper-pagination"});const e=t.params.pagination;if(!e.el)return;let i;"string"==typeof e.el&&t.isElement&&(i=t.el.querySelector(e.el)),i||"string"!=typeof e.el||(i=[...document.querySelectorAll(e.el)]),i||(i=e.el),i&&0!==i.length&&(t.params.uniqueNavElements&&"string"==typeof e.el&&Array.isArray(i)&&i.length>1&&(i=[...t.el.querySelectorAll(e.el)],i.length>1&&(i=i.find(e=>dn(e,".swiper")[0]===t.el))),Array.isArray(i)&&1===i.length&&(i=i[0]),Object.assign(t.pagination,{el:i}),i=pn(i),i.forEach(i=>{"bullets"===e.type&&e.clickable&&i.classList.add(...(e.clickableClass||"").split(" ")),i.classList.add(e.modifierClass+e.type),i.classList.add(t.isHorizontal()?e.horizontalClass:e.verticalClass),"bullets"===e.type&&e.dynamicBullets&&(i.classList.add(`${e.modifierClass}${e.type}-dynamic`),n=0,e.dynamicMainBullets<1&&(e.dynamicMainBullets=1)),"progressbar"===e.type&&e.progressbarOpposite&&i.classList.add(e.progressbarOppositeClass),e.clickable&&i.addEventListener("click",d),t.enabled||i.classList.add(e.lockClass)}))}function u(){const e=t.params.pagination;if(o())return;let i=t.pagination.el;i&&(i=pn(i),i.forEach(i=>{i.classList.remove(e.hiddenClass),i.classList.remove(e.modifierClass+e.type),i.classList.remove(t.isHorizontal()?e.horizontalClass:e.verticalClass),e.clickable&&(i.classList.remove(...(e.clickableClass||"").split(" ")),i.removeEventListener("click",d))})),t.pagination.bullets&&t.pagination.bullets.forEach(t=>t.classList.remove(...e.bulletActiveClass.split(" ")))}i("changeDirection",()=>{if(!t.pagination||!t.pagination.el)return;const e=t.params.pagination;let{el:i}=t.pagination;i=pn(i),i.forEach(i=>{i.classList.remove(e.horizontalClass,e.verticalClass),i.classList.add(t.isHorizontal()?e.horizontalClass:e.verticalClass)})}),i("init",()=>{!1===t.params.pagination.enabled?g():(h(),p(),c())}),i("activeIndexChange",()=>{void 0===t.snapIndex&&c()}),i("snapIndexChange",()=>{c()}),i("snapGridLengthChange",()=>{p(),c()}),i("destroy",()=>{u()}),i("enable disable",()=>{let{el:e}=t.pagination;e&&(e=pn(e),e.forEach(e=>e.classList[t.enabled?"remove":"add"](t.params.pagination.lockClass)))}),i("lock unlock",()=>{c()}),i("click",(e,i)=>{const r=i.target,a=pn(t.pagination.el);if(t.params.pagination.el&&t.params.pagination.hideOnClick&&a&&a.length>0&&!r.classList.contains(t.params.pagination.bulletClass)){if(t.navigation&&(t.navigation.nextEl&&r===t.navigation.nextEl||t.navigation.prevEl&&r===t.navigation.prevEl))return;const e=a[0].classList.contains(t.params.pagination.hiddenClass);s(!0===e?"paginationShow":"paginationHide"),a.forEach(e=>e.classList.toggle(t.params.pagination.hiddenClass))}});const g=()=>{t.el.classList.add(t.params.pagination.paginationDisabledClass);let{el:e}=t.pagination;e&&(e=pn(e),e.forEach(e=>e.classList.add(t.params.pagination.paginationDisabledClass))),u()};Object.assign(t.pagination,{enable:()=>{t.el.classList.remove(t.params.pagination.paginationDisabledClass);let{el:e}=t.pagination;e&&(e=pn(e),e.forEach(e=>e.classList.remove(t.params.pagination.paginationDisabledClass))),h(),p(),c()},disable:g,render:p,update:c,init:h,destroy:u})}Object.keys(qn).forEach(t=>{Object.keys(qn[t]).forEach(e=>{Wn.prototype[e]=qn[t][e]})}),Wn.use([function({swiper:t,on:e,emit:i}){const s=Ya();let r=null,a=null;const n=()=>{t&&!t.destroyed&&t.initialized&&(i("beforeResize"),i("resize"))},o=()=>{t&&!t.destroyed&&t.initialized&&i("orientationchange")};e("init",()=>{t.params.resizeObserver&&void 0!==s.ResizeObserver?t&&!t.destroyed&&t.initialized&&(r=new ResizeObserver(e=>{a=s.requestAnimationFrame(()=>{const{width:i,height:s}=t;let r=i,a=s;e.forEach(({contentBoxSize:e,contentRect:i,target:s})=>{s&&s!==t.el||(r=i?i.width:(e[0]||e).inlineSize,a=i?i.height:(e[0]||e).blockSize)}),r===i&&a===s||n()})}),r.observe(t.el)):(s.addEventListener("resize",n),s.addEventListener("orientationchange",o))}),e("destroy",()=>{a&&s.cancelAnimationFrame(a),r&&r.unobserve&&t.el&&(r.unobserve(t.el),r=null),s.removeEventListener("resize",n),s.removeEventListener("orientationchange",o)})},function({swiper:t,extendParams:e,on:i,emit:s}){const r=[],a=Ya(),n=(e,i={})=>{const n=new(a.MutationObserver||a.WebkitMutationObserver)(e=>{if(t.__preventObserver__)return;if(1===e.length)return void s("observerUpdate",e[0]);const i=function(){s("observerUpdate",e[0])};a.requestAnimationFrame?a.requestAnimationFrame(i):a.setTimeout(i,0)});n.observe(e,{attributes:void 0===i.attributes||i.attributes,childList:t.isElement||(void 0===i.childList||i).childList,characterData:void 0===i.characterData||i.characterData}),r.push(n)};e({observer:!1,observeParents:!1,observeSlideChildren:!1}),i("init",()=>{if(t.params.observer){if(t.params.observeParents){const e=dn(t.hostEl);for(let t=0;t<e.length;t+=1)n(e[t])}n(t.hostEl,{childList:t.params.observeSlideChildren}),n(t.wrapperEl,{attributes:!1})}}),i("destroy",()=>{r.forEach(t=>{t.disconnect()}),r.splice(0,r.length)})}]);const Xn=[{id:"climate",icon:"mdi:thermometer",label:"Climate"},{id:"scenes",icon:"mdi:palette",label:"Scenes"},{id:"actions",icon:"mdi:lightning-bolt",label:"Automations"},{id:"level",icon:"mdi:spirit-level",label:"Level"},{id:"status",icon:"mdi:gauge",label:"Status"}],Kn=100,Jn=100,Zn=135,Qn=270,to=22140*Math.PI/180,eo=16740*Math.PI/180;function io(t,e,i,s){const r=s*Math.PI/180;return[t+i*Math.cos(r),e+i*Math.sin(r)]}function so(t,e=270){const[i,s]=io(Kn,Jn,t,Zn),[r,a]=io(Kn,Jn,t,Zn+e),n=e>180?1:0;return`M ${i.toFixed(2)} ${s.toFixed(2)} A ${t} ${t} 0 ${n} 1 ${r.toFixed(2)} ${a.toFixed(2)}`}customElements.define("smartvanio-main-card",class extends nt{static get properties(){return{hass:{type:Object},config:{type:Object},_selectedId:{type:String},_dragState:{type:Object},_pendingTargetTemp:{type:Number},_openSections:{type:Object},_activeTab:{type:String},_setupMode:{type:Boolean},_pendingSlots:{type:Object},_cardConfig:{type:Object},_mqttDeviceConfig:{type:Object},_deviceStatuses:{type:Object},_knownDevices:{type:Object},_editingEntity:{type:String},_editName:{type:String},_editArea:{type:String},_editRows:{type:Array},_editSaving:{type:Boolean},_editLoading:{type:Boolean},_saveError:{type:String},_autoModal:{type:Object},_tilePopover:{type:Object},_editingScene:{type:String},_sceneEditName:{type:String},_sceneEditLights:{type:Array},_sceneEditSaving:{type:Boolean},_lightSegments:{type:Array},_lightPatterns:{type:Object},_maxLeds:{type:Number},_switchMode:{type:Object},_footerModal:{type:Object},_footerAddMenu:{type:Boolean},_lightModal:{type:Object},_activePatterns:{type:Object},_layoutMode:{type:Boolean},_layoutDrag:{type:Object},_page:{type:String},_deviceModal:{type:Object},_theme:{type:String},_showRightPanel:{type:Boolean},_navDrawerOpen:{type:Boolean}}}constructor(){super(),this._theme=localStorage.getItem("smartvanio-theme")||"dark",this._showRightPanel="1"===localStorage.getItem("smartvanio-show-right-panel"),this._navDrawerOpen=!1,this._onNavKeydown=t=>{"Escape"===t.key&&this._navDrawerOpen&&this._closeNavDrawer()},this._selectedId=null,this._dragState=new Map,this._pendingTargetTemp=null,this._climateDragging=!1,this._openSections={groups:!0,lighting:!0},this._lpTimer=null,this._lpOrigin=null,this._activeTab="climate",this._setupMode=!1,this._pendingSlots=null,this._cardConfig={pinnedActions:[]},this._mqttDeviceConfig=null,this._mqttUnsub=null,this._mqttDevUnsub=null,this._statusUnsub=null,this._allDevCfgUnsub=null,this._patternsUnsub=null,this._deviceStatuses={},this._knownDevices={},this._editingEntity=null,this._editName="",this._editRows=[],this._editSaving=!1,this._editLoading=!1,this._editOriginalIds={},this._saveError=null,this._autoModal=null,this._tilePopover=null,this._tileLpTimer=null,this._tileLpOrigin=null,this._editingScene=null,this._sceneEditName="",this._sceneEditLights=[],this._lightSegments=[],this._lightPatterns={},this._maxLeds=0,this._sceneEditSaving=!1,this._footerModal=null,this._footerAddMenu=!1,this._lightModal=null,this._tankLpTimer=null,this._layoutMode=!1,this._layoutDrag=null,this._page="dashboard",this._deviceModal=null,this._sceneConfigs={},this._sceneConfigsLoaded=!1,this._entityPatterns={},this._gridRo=null,this._gridCols=4,this._gridRows=4,this._gridCellW=72,this._gridKey="4",this._currentLayout=null,this._dragController=new fa(this),this._cmMove=t=>this._onClimatePointerMove(t),this._cmUp=()=>this._onClimatePointerUp()}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onNavKeydown);const t=()=>{const t=this.getBoundingClientRect().top,e=window.innerHeight-t;e>100&&(this.style.height=`${e}px`)};this._ro=new ResizeObserver(t),this._ro.observe(document.documentElement),requestAnimationFrame(t),this._cleanupNebulaBg()}setConfig(t){if(!t)throw new Error("smartvanio-main-card: config required");this.config=t,t.device_id&&(this._selectedId=t.device_id),t.theme&&(this._theme=t.theme)}shouldUpdate(){return!0}updated(t){super.updated?.(t),t.has("_selectedId")?(this._mqttUnsub&&(this._mqttUnsub(),this._mqttUnsub=null),this._selectedId&&this.hass&&this._subscribeMqttConfig()):t.has("hass")&&this._selectedId&&(this._mqttUnsub||this._subscribeMqttConfig()),this.hass&&!this._statusUnsub&&this._subscribeBoardStatuses(),this.hass&&!this._allDevCfgUnsub&&this._subscribeAllBoardConfigs(),this.hass&&!this._sceneConfigsLoaded&&this._loadSceneConfigs(),this._setupGridObserver(),t.has("_setupMode")&&this.classList.toggle("dnd-active",this._setupMode),t.has("_theme")&&this.setAttribute("theme",this._theme),this._initSwiper()}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onNavKeydown),this._destroySwiper(),this._cleanupNebulaBg(),this._ro?.disconnect(),this._ro=null,this._gridRo?.disconnect(),this._gridRo=null,this._mqttUnsub&&(this._mqttUnsub(),this._mqttUnsub=null),this._statusUnsub&&(this._statusUnsub(),this._statusUnsub=null),this._allDevCfgUnsub&&(this._allDevCfgUnsub(),this._allDevCfgUnsub=null),this._patternsUnsub&&(this._patternsUnsub(),this._patternsUnsub=null),window.removeEventListener("pointermove",this._cmMove),window.removeEventListener("pointerup",this._cmUp)}_cleanupNebulaBg(){document.documentElement.style.removeProperty("background"),document.body.style.removeProperty("background");let t=this;for(;t;){const e=t.getRootNode();if(e instanceof ShadowRoot){const i=e.getElementById("smartvanio-nebula");i&&i.remove(),e.host.style.removeProperty("background"),t=e.host}else{if(!t.parentElement)break;t.style.removeProperty("background"),t=t.parentElement}}}getCardSize(){return 8}static getStubConfig(){return{slots:{resources:[],pitch:"",roll:"",temperature:"",fans:[],lights:[],switches:[],status_sensors:[]}}}async _subscribeMqttConfig(){if(!this.hass||!this._selectedId)return;const t=`smartvanio/${this._selectedId}/hmi_config`;try{const e=await this.hass.connection.subscribeMessage(t=>{if(!this._setupMode&&!this._mqttSaveGuard&&t?.payload)try{const e=JSON.parse(t.payload);this._cardConfig={pinnedActions:[],...e},this._currentLayout=null,this._gridCols>0&&this._applyLayoutForCurrentGrid()}catch{}},{type:"mqtt/subscribe",topic:t});this._mqttUnsub=e}catch(t){console.warn("[VanCtl HMI] MQTT config subscribe failed:",t)}}async _subscribeBoardStatuses(){if(this.hass)try{const t=await this.hass.connection.subscribeMessage(t=>{if(!t?.topic||!t?.payload)return;const e=t.topic.split("/");if(e.length<3)return;const i=e[1];try{const e=JSON.parse(t.payload);this._deviceStatuses={...this._deviceStatuses,[i]:"online"===e.state?"online":"offline"}}catch{}},{type:"mqtt/subscribe",topic:"smartvanio/+/status"});this._statusUnsub=t}catch(t){console.warn("[VanCtl HMI] MQTT status subscribe failed:",t)}}async _subscribeAllBoardConfigs(){if(this.hass)try{const t=await this.hass.connection.subscribeMessage(t=>{if(t?.payload)try{const e=JSON.parse(t.payload);if(!e.device_id)return;this._knownDevices={...this._knownDevices,[e.device_id]:{name:e.name,model:e.model,firmware:e.firmware,entities:e.entities??[]}},e.device_id===this._selectedId&&(this._mqttDeviceConfig=e),this._subscribeDevicePatterns(e.device_id)}catch{}},{type:"mqtt/subscribe",topic:"smartvanio/+/config"});this._allDevCfgUnsub=t}catch(t){console.warn("[VanCtl HMI] MQTT board config subscribe failed:",t)}}_subscribeDevicePatterns(t){if(!this.hass||!t)return;const e=`_patSub_${t}`;this[e]||this.hass.connection.subscribeMessage(e=>{if(e?.topic&&e?.payload)try{const i=JSON.parse(e.payload);if("object"!=typeof i||null===i||Array.isArray(i))return;const s=e.topic.split("/")[3],r=`${t}/${s}`;this._entityPatterns={...this._entityPatterns,[r]:i},this.requestUpdate()}catch{}},{type:"mqtt/subscribe",topic:`smartvanio/${t}/light/+/patterns`}).then(t=>{this[e]=t}).catch(e=>console.warn("[VanCtl] pattern sub failed for",t,e))}_getEntityPatterns(t){const e=this._resolveEntityTopic(t);if(!e)return{};const i=e.channel.replace(/_seg_.*$/,""),s=`${e.deviceId}/${i}`;return this._entityPatterns[s]??{}}_patternGradientCSS(t){if(!t?.length)return"";const e=[...t].sort((t,e)=>t.pos-e.pos),i=e[e.length-1].pos||1,s=e.map(t=>{const e=(t.brightness??100)/100;return`rgb(${Math.round(t.r*e)},${Math.round(t.g*e)},${Math.round(t.b*e)}) ${(t.pos/i*100).toFixed(1)}%`});return`linear-gradient(to right, ${s.join(", ")})`}_resolveSlots(){if(this._setupMode&&this._pendingSlots){const t=this._pendingSlots,e=t=>(t??[]).map(t=>"string"==typeof t?{entity:t}:{...t});return{resources:e(t.resources),pitch:t.pitch??null,roll:t.roll??null,temperature:t.temperature??null,fans:e(t.fans),lights:e(t.lights),switches:e(t.switches),status_sensors:t.status_sensors??[],water_temp:t.water_temp??null,target_temp:t.target_temp??null,fan_speed:t.fan_speed??null,climate_mode:t.climate_mode??null,heater:t.heater??null,water_pump:t.water_pump??null,water_mode:t.water_mode??null,heating_active:t.heating_active??null,groups:(t.groups??[]).map(t=>({id:t.id??`grp_${Math.random().toString(36).slice(2)}`,name:t.name??"Group",lights:t.lights??[],scenes:t.scenes??[]})),tileOrder:t.tileOrder??null,layouts:t.layouts??null,buttons:e(t.buttons??[]),footerSwitches:e(t.footerSwitches??[]),power:t.power??null,topbarStats:e(t.topbarStats??[]),sceneOrder:t.sceneOrder??[],hiddenScenes:t.hiddenScenes??[],lightOrder:t.lightOrder??[],hiddenLights:t.hiddenLights??[]}}const t=this._cardConfig?.slots??this.config?.slots;if(void 0===t){const t=this._mqttDeviceConfig;return t?.entities?.some(t=>t.slot)?this._buildSlotsFromManifest(t):null}const e=t=>(t??[]).map(t=>"string"==typeof t?{entity:t}:{...t});return{resources:e(t.resources),pitch:t.pitch??null,roll:t.roll??null,temperature:t.temperature??null,fans:e(t.fans),lights:e(t.lights),switches:e(t.switches),status_sensors:t.status_sensors??[],water_temp:t.water_temp??null,target_temp:t.target_temp??null,fan_speed:t.fan_speed??null,climate_mode:t.climate_mode??null,heater:t.heater??null,water_pump:t.water_pump??null,water_mode:t.water_mode??null,heating_active:t.heating_active??null,groups:(t.groups??[]).map(t=>({id:t.id??`grp_${Math.random().toString(36).slice(2)}`,name:t.name??"Group",lights:t.lights??[],scenes:t.scenes??[]})),tileOrder:t.tileOrder??null,footerSwitches:e(t.footerSwitches??[]),power:t.power??null,topbarStats:e(t.topbarStats??[]),sceneOrder:t.sceneOrder??[],hiddenScenes:t.hiddenScenes??[],lightOrder:t.lightOrder??[],hiddenLights:t.hiddenLights??[]}}_buildSlotsFromManifest(t){const e=this._entities(),i={resources:[],pitch:null,roll:null,temperature:null,fans:[],lights:[],switches:[],buttons:[],status_sensors:[],water_temp:null,target_temp:null,fan_speed:null,climate_mode:null,heater:null,water_pump:null,footerSwitches:[]};for(const s of t.entities){if(!s.slot)continue;const t=this._findEntityByChannel(s.type,s.channel,e);if(!t)continue;const r=s.slot;"resources"===r||"fans"===r||"lights"===r||"switches"===r||"buttons"===r?i[r].push({entity:t,name:s.name??s.channel}):"status_sensors"===r?i.status_sensors.push(t):r in i&&(i[r]=t)}return i}_findEntityByChannel(t,e,i){if(!i)return null;const s=i[{sensor:"sensors",switch:"switches",light:"lights",binary_sensor:"binary_sensors",number:"numbers",select:"selects"}[t]]??[];return s.find(({eid:t})=>t.includes(e))?.eid??null}_saveMqttConfig(){this.hass&&this._selectedId&&(this._mqttSaveGuard=!0,clearTimeout(this._mqttSaveGuardTimer),this._mqttSaveGuardTimer=setTimeout(()=>{this._mqttSaveGuard=!1},2e3),this.hass.callService("mqtt","publish",{topic:`smartvanio/${this._selectedId}/hmi_config`,payload:JSON.stringify(this._cardConfig),retain:!0,qos:1}))}_saveCardConfig(t){this._cardConfig=t,this._saveMqttConfig(),this.requestUpdate()}_enterSetupMode(){const t=this._resolveSlots()??{resources:[],pitch:null,roll:null,temperature:null,fans:[],lights:[],switches:[],buttons:[],status_sensors:[],groups:[],water_temp:null,target_temp:null,fan_speed:null,climate_mode:null,heater:null,water_pump:null,power:null,topbarStats:[]},e=JSON.parse(JSON.stringify(t)),i=this._entities();if(i){const t=(t,e)=>{const i=new Set(t.map(t=>t.entity));return[...t,...e.filter(t=>!i.has(t.eid)).map(t=>({entity:t.eid,name:null}))]};e.lights=t(e.lights,i.lights),e.switches=t(e.switches,this._powerSwitches(i.switches)),e.buttons=t(e.buttons??[],this._buttonEntities(i.binary_sensors));const s=new Set(e.resources.map(t=>t.entity)),r=t=>i.sensors.find(({eid:e})=>t.test(e))?.eid;[{eid:r(/water_tank$/),name:"Water",color:"#5cacff"},{eid:r(/gas_tank$/),name:"Gas",color:"#f0b72f"},{eid:r(/waste_tank$/),name:"Waste",color:"#ff9492"},{eid:r(/fuel_level/),name:"Fuel",color:"#2bd853"}].forEach(({eid:t,name:i,color:r})=>{t&&!s.has(t)&&e.resources.push({entity:t,name:i,color:r})})}e.layouts=structuredClone(this._cardConfig?.slots?.layouts??{}),e.footerSwitches||(e.footerSwitches=structuredClone(this._cardConfig?.slots?.footerSwitches??[])),e.power=structuredClone(this._cardConfig?.slots?.power??null),e.topbarStats?.length||(e.topbarStats=structuredClone(this._cardConfig?.slots?.topbarStats??[])),this._pendingSlots=e,this._setupMode=!0}_cancelSetupMode(){this._setupMode=!1,this._pendingSlots=null}_saveSetupMode(){if(this._currentLayout){const t={...this._pendingSlots?.layouts??{}};t[this._gridKey]=structuredClone(this._currentLayout);const e=Object.entries(this._currentLayout).sort(([,t],[,e])=>t.row-e.row||t.col-e.col).map(([t])=>t);this._pendingSlots={...this._pendingSlots,layouts:t,tileOrder:e}}this._cardConfig={...this._cardConfig,slots:this._pendingSlots},this._saveMqttConfig(),this._setupMode=!1,this._pendingSlots=null}_setPS(t,e){this._pendingSlots={...this._pendingSlots,[t]:e}}_addPSItem(t,e){this._pendingSlots={...this._pendingSlots,[t]:[...this._pendingSlots[t]??[],e]}}_removePSItem(t,e){const i=[...this._pendingSlots[t]??[]];i.splice(e,1),this._pendingSlots={...this._pendingSlots,[t]:i}}_updatePSItem(t,e,i,s){const r=[...this._pendingSlots[t]??[]];r[e]={...r[e],[i]:s},this._pendingSlots={...this._pendingSlots,[t]:r}}_isGroupOn(t){return(t.lights??[]).some(t=>"on"===this.hass.states[t]?.state)}_toggleGroup(t){const e=this._isGroupOn(t)?"turn_off":"turn_on";for(const i of t.lights??[])this.hass.callService("light",e,{entity_id:i})}_groupBrightness(t){const e=(t.lights??[]).map(t=>this.hass?.states?.[t]).filter(t=>"on"===t?.state).map(t=>t.attributes?.brightness??255);return e.length?Math.round(e.reduce((t,e)=>t+e,0)/e.length):0}_setGroupBrightness(t,e){for(const i of t.lights??[])this.hass.callService("light","turn_on",{entity_id:i,brightness:e})}static TILE_SIZES={group:[[1,1],[3,3]],light:[[1,1]],switch:[[1,1]]};_allowedSizes(t){return this.constructor.TILE_SIZES[t.type]??[[1,1]]}_cycleTileSize(t,e){if(!this._currentLayout?.[t])return;const i=this._allowedSizes(e);if(i.length<=1)return;const s=this._currentLayout[t],r=i.findIndex(([t,e])=>t===s.w&&e===s.h),[a,n]=i[(r+1)%i.length],o=()=>{const e={...this._currentLayout};e[t]={...s,w:a,h:n},this._currentLayout=Sa(e,t,s.col,s.row,this._gridCols)};this._setupMode?(o(),this.requestUpdate()):this._animateGridTransition(o)}_onGroupPointerDown(t,e){const i=this._currentLayout?.[e.id];i&&i.w>=3&&i.h>=3||0!==t.button&&"touch"!==t.pointerType||(this._lpOrigin={x:t.clientX,y:t.clientY},this._lpTimer=setTimeout(()=>{this._lpTimer=null,this._lpOrigin=null,this._cycleTileSize(e.id,{type:"group"})},500))}_onGroupPointerMove(t,e){const i=this._currentLayout?.[e.id];if(i&&i.w>=3&&i.h>=3)return;if(!this._lpTimer||!this._lpOrigin)return;const s=t.clientX-this._lpOrigin.x,r=t.clientY-this._lpOrigin.y;Math.sqrt(s*s+r*r)>8&&(clearTimeout(this._lpTimer),this._lpTimer=null,this._lpOrigin=null)}_onGroupPointerUp(t,e){const i=this._currentLayout?.[e.id];i&&i.w>=3&&i.h>=3||this._lpTimer&&(clearTimeout(this._lpTimer),this._lpTimer=null,this._lpOrigin=null,t.target.closest("button, input, select, ha-entity-toggle")||this._toggleGroup(e))}_setupGridObserver(){if(this._gridRo)return;const t=this.shadowRoot?.querySelector(".unified-grid");if(!t)return;const e=12;this._gridRo=new ResizeObserver(()=>{const i=t.clientWidth-32,s=t.clientHeight-24;if(i<1||s<1)return;let r=Math.max(3,Math.floor((i+e)/92)),a=(i-e*(r-1))/r;for(;a>140&&r<20;)r++,a=(i-e*(r-1))/r;for(;a<80&&r>3;)r--,a=(i-e*(r-1))/r;a=Math.round(a);let n=Math.max(3,Math.floor((s+e)/(a+e)));const o=r>1?(i-r*a)/(r-1):e,l=n>1?(s-n*a)/(n-1):e,d=Math.max(e,Math.round(Math.min(o,l)));t.style.gridTemplateColumns=`repeat(${r}, ${a}px)`,t.style.gridTemplateRows=`repeat(${n}, ${a}px)`,t.style.gap=`${d}px`,t.style.setProperty("--smartvanio-grid-cell-w",`${a}px`);const c=this._gridKey;this._gridCols=r,this._gridRows=n,this._gridCellW=a,this._gridGap=d,this._gridKey=`${r}`,c===this._gridKey&&this._currentLayout||this._applyLayoutForCurrentGrid()}),this._gridRo.observe(t)}_tileSizeFor(t){const e=this._allowedSizes(t);return{w:e[0][0],h:e[0][1]}}_applyLayoutForCurrentGrid(){const t=this._cardConfig?.slots?.layouts??{},e=this._gridKey,i=this._getAllTileItems();let s=t[e]?e:null;if(!s)for(const i of Object.keys(t))if(i.startsWith(e+"x")){s=i;break}if(s)this._currentLayout=this._mergeNewItems(structuredClone(t[s]),i);else{const e=function(t,e){let i=null,s=1/0;for(const r of Object.keys(t)){const t=r.split("x").map(Number)[0],a=Math.abs(t-e);a<s&&(s=a,i=r)}return i}(t,this._gridCols,this._gridRows);e&&t[e]?this._currentLayout=this._mergeNewItems(function(t,e){const i=Object.entries(t).sort(([,t],[,e])=>t.row-e.row||t.col-e.col),s={},r=[];for(const[t,a]of i){const i=Math.min(a.w,e),n=a.h,o=_a(r,e,i,n);s[t]={col:o.col,row:o.row,w:i,h:n},ya(r,o.col,o.row,i,n,t,e)}return s}(t[e],this._gridCols),i):this._cardConfig?.slots?.tileOrder?.length?this._currentLayout=Ta(this._cardConfig.slots.tileOrder,i,this._gridCols,t=>this._tileSizeFor(t)):this._currentLayout=wa(i,this._gridCols,t=>this._tileSizeFor(t))}this.requestUpdate()}_getAllTileItems(){const t=this._resolveSlots(),e=this._entities()??{lights:[],switches:[]},i=(t,e)=>{const i=(t??[]).map(({entity:t,name:e})=>({eid:t,state:this.hass?.states?.[t],_slotName:e})).filter(t=>t.eid&&this.hass?.states?.[t.eid]),s=new Set(i.map(t=>t.eid));return[...i,...e.filter(t=>!s.has(t.eid))]},s=i(t?.lights,e.lights),r=i(t?.switches,this._powerSwitches?.(e.switches)??[]),a=t?.groups??[];return this._orderedTiles(a,s,r,null)}_mergeNewItems(t,e){const i=new Set(e.filter(t=>"spacer"!==t.type).map(t=>t.id));for(const e of Object.keys(t))i.has(e)||delete t[e];const s=ba(t,this._gridCols);for(const i of e){if(t[i.id])continue;if("spacer"===i.type)continue;const{w:e,h:r}=this._tileSizeFor(i);let a=!1;for(let n=0;n<200&&!a;n++)for(let o=0;o<=this._gridCols-e&&!a;o++){let l=!0;for(let t=n;t<n+r&&l;t++)for(let i=o;i<o+e&&l;i++)null!=s[t]?.[i]&&(l=!1);if(l){t[i.id]={col:o,row:n,w:e,h:r};for(let t=n;t<n+r;t++){s[t]||(s[t]=new Array(this._gridCols).fill(null));for(let r=o;r<o+e;r++)s[t][r]=i.id}a=!0}}}return t}onTileDragMove(t,e,i){const s=this._getAllTileItems(),r=s.find(e=>e.id===t),a=this._tileAtCell(e,i,t),n=a?s.find(t=>t.id===a):null;if(r&&n&&this._canMerge(r,n))this._mergeTargetId=a,this._dragController.previewCol=e,this._dragController.previewRow=i;else if(this._mergeTargetId=null,this._currentLayout){const s=Sa(this._currentLayout,t,e,i,this._gridCols)[t];s&&(this._dragController.previewCol=s.col,this._dragController.previewRow=s.row)}this.requestUpdate()}onTileDragEnd(t,e,i){if(this._mergeTargetId=null,!this._currentLayout)return;const s=this._getAllTileItems(),r=s.find(e=>e.id===t);if(r&&("light"===r.type||"group"===r.type)){const a=this._tileAtCell(e,i,t),n=a?s.find(t=>t.id===a):null;if(n&&this._canMerge(r,n))return void this._mergeIntoGroup(r,n,e,i)}this._currentLayout=Sa(this._currentLayout,t,e,i,this._gridCols),this.requestUpdate()}onTileTap(t){this._setupMode&&this._openEditModal(t)}_tileAtCell(t,e,i){if(!this._currentLayout)return null;for(const[s,r]of Object.entries(this._currentLayout))if(s!==i&&t>=r.col&&t<r.col+r.w&&e>=r.row&&e<r.row+r.h)return s;return null}_canMerge(t,e){return"light"===t.type&&"light"===e.type||("light"===t.type&&"group"===e.type||"group"===t.type&&"light"===e.type)}_activeSlots(){return this._setupMode&&this._pendingSlots?this._pendingSlots:this._cardConfig?.slots??{}}_writeSlots(t){this._setupMode?this._pendingSlots=t:(this._cardConfig={...this._cardConfig,slots:t},this._saveMqttConfig())}_mergeIntoGroup(t,e,i,s){const r={...this._activeSlots()},a=[...r.groups??[]],n=t=>"light"===t.type?[t.id]:"group"===t.type?[...t.data?.lights??[]]:[],o=n(t),l=n(e),d=[...new Set([...l,...o])];let c;if("group"===e.type){c=e.id;const t=a.findIndex(t=>t.id===c);-1!==t&&(a[t]={...a[t],lights:d})}else if("group"===t.type){c=t.id;const e=a.findIndex(t=>t.id===c);-1!==e&&(a[e]={...a[e],lights:d})}else c=`grp_${Date.now()}`,a.push({id:c,name:"New Group",lights:d,scenes:[]});r.groups=a,this._writeSlots(r);const p={...this._currentLayout},h=p[e.id];if(delete p[t.id],"group"===e.type);else{if("group"!==t.type){delete p[e.id];const t=h?.col??i,r=h?.row??s;return p[c]={col:t,row:r,w:3,h:3},this._currentLayout=Sa(p,c,t,r,this._gridCols),void this.requestUpdate()}delete p[e.id]}this._currentLayout=p,this.requestUpdate()}_animateGridTransition(t){const e=this.shadowRoot?.querySelector(".unified-grid");if(!e)return void t();const i=[...e.children],s=new Map;i.forEach(t=>s.set(t.dataset.tileId,t.getBoundingClientRect())),t(),this.updateComplete.then(()=>{[...e.children].forEach(t=>{const e=t.dataset.tileId,i=s.get(e);if(!i)return;const r=t.getBoundingClientRect(),a=i.left-r.left,n=i.top-r.top,o=i.width/(r.width||1),l=i.height/(r.height||1);Math.abs(a)<1&&Math.abs(n)<1&&Math.abs(o-1)<.02||t.animate([{transform:`translate(${a}px, ${n}px) scale(${o}, ${l})`,transformOrigin:"top left"},{transform:"translate(0,0) scale(1,1)",transformOrigin:"top left"}],{duration:280,easing:"cubic-bezier(0.4, 0, 0.2, 1)"})})})}_orderedTiles(t,e,i,s){const r=new Set(t.flatMap(t=>t.lights??[])),a=e.filter(t=>!r.has(t.eid)),n=[];if(t.forEach(t=>n.push({type:"group",id:t.id,data:t})),a.forEach(t=>n.push({type:"light",id:t.eid,data:t})),i.forEach(t=>n.push({type:"switch",id:t.eid,data:t})),!s?.length)return n;const o=new Map(n.map(t=>[t.id,t])),l=[];let d=0;for(const t of s)if(null===t)l.push({type:"spacer",id:"_spacer_"+d++,data:null});else{const e=o.get(t);e&&(l.push(e),o.delete(t))}for(const t of o.values())l.push(t);return l}_saveTileOrder(t){const e=t.map(t=>t.id),i={...this._cardConfig?.slots??{},tileOrder:e};this._cardConfig={...this._cardConfig,slots:i},this._saveMqttConfig()}_onGrpLightPointerDown(t,e,i){if(0!==t.button&&"touch"!==t.pointerType)return;t.stopPropagation();const s=t.currentTarget,r=t.clientX,a=t.clientY;let n=null,o=!1,l=!1;const d=this.shadowRoot?.querySelector(".unified-grid");if(!d)return;d.setPointerCapture(t.pointerId);const c=this.shadowRoot?.querySelector(`.grid-tile[data-tile-id="${e}"]`),p=this.hass?.states?.[i],h="on"===p?.state,u=p?.attributes?.rgb_color??[255,200,80],g=this._label(i),m=this._gridCellW||80,v=(t,e)=>{if(!c)return!1;const i=c.getBoundingClientRect();return t>=i.left&&t<=i.right&&e>=i.top&&e<=i.bottom},f=t=>{const e=t.clientX-r,i=t.clientY-a;if(!o&&Math.sqrt(e*e+i*i)>10&&(o=!0,s.style.opacity="0.3"),!o)return;const d=v(t.clientX,t.clientY);n&&d===l||(n&&n.remove(),n=d?(()=>{const t=s.cloneNode(!0);return t.style.cssText=`\n        position:fixed; z-index:10000; pointer-events:none;\n        width:${s.offsetWidth}px; opacity:0.85;\n        background:rgba(22,27,34,0.95); border-radius:8px; padding:6px 10px;\n        box-shadow:0 4px 16px rgba(0,0,0,0.5);\n        display:flex; align-items:center; gap:10px;\n        transition:width 0.15s,height 0.15s,border-radius 0.15s;\n      `,t})():(()=>{const t=document.createElement("div");return t.innerHTML=`\n        <ha-icon icon="mdi:lightbulb" style="--mdc-icon-size:22px;color:${h?`rgb(${u[0]},${u[1]},${u[2]})`:"var(--sv-text-secondary)"}"></ha-icon>\n        <span style="font-size:10px;font-weight:500;color:${h?"var(--sv-text-heading)":"var(--sv-text-secondary)"};text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%">${g}</span>\n      `,t.style.cssText=`\n        position:fixed; z-index:10000; pointer-events:none;\n        width:${m}px; height:${m}px;\n        display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px;\n        border-radius:16px; padding:6px 4px; box-sizing:border-box;\n        background:${h?`rgba(${u[0]},${u[1]},${u[2]},0.12)`:"rgba(22,27,34,0.85)"};\n        box-shadow:0 8px 30px rgba(0,0,0,0.5);\n        opacity:0.9; transition:width 0.15s,height 0.15s,border-radius 0.15s;\n      `,t})(),this.shadowRoot.appendChild(n),l=d),l?(n.style.left=t.clientX-s.offsetWidth/2+"px",n.style.top=t.clientY-16+"px"):(n.style.left=t.clientX-m/2+"px",n.style.top=t.clientY-m/2+"px")},b=t=>{d.removeEventListener("pointermove",f),d.removeEventListener("pointerup",b),d.removeEventListener("pointercancel",b);try{d.releasePointerCapture(t.pointerId)}catch(t){}if(n&&n.remove(),s.style.opacity="",!o)return;if(v(t.clientX,t.clientY))return;const r=this._gridGap||12,a=d.getBoundingClientRect(),l=t.clientX-a.left-16,c=t.clientY-a.top-12+(d.scrollTop||0),p=Math.max(0,Math.min(this._gridCols-1,Math.round(l/(m+r)))),h=Math.max(0,Math.round(c/(m+r)));this._removeLightFromGroup(e,i,p,h),this.requestUpdate()};d.addEventListener("pointermove",f),d.addEventListener("pointerup",b),d.addEventListener("pointercancel",b)}_renameGroup(t,e){if(!e?.trim())return;const i={...this._activeSlots()},s=[...i.groups??[]],r=s.findIndex(e=>e.id===t);-1!==r&&(s[r]={...s[r],name:e.trim()},i.groups=s,this._writeSlots(i))}_removeLightFromGroup(t,e,i,s){const r={...this._activeSlots()},a=[...r.groups??[]],n=a.findIndex(e=>e.id===t);if(-1===n)return;const o={...a[n]};if(o.lights=o.lights.filter(t=>t!==e),0===o.lights.length?a.splice(n,1):a[n]=o,r.groups=a,this._writeSlots(r),this._currentLayout){const r={...this._currentLayout};if(0===o.lights.length&&delete r[t],null!=i&&null!=s)r[e]={col:i,row:s,w:1,h:1};else{const i=r[t],s=i?i.col+i.w:0,a=i?.row??0;r[e]={col:Math.min(s,this._gridCols-1),row:a,w:1,h:1}}this._currentLayout=Sa(r,e,r[e].col,r[e].row,this._gridCols)}}_renderGroupTileBody(t,e){const i=(t.lights??[]).map(t=>({eid:t,state:this.hass.states[t]})).filter(t=>t.state),s=(t.scenes??[]).map(t=>({eid:t,name:this.hass.states[t]?.attributes?.friendly_name??t.split(".").pop()})).filter(t=>this.hass.states[t.eid]);return j`
      ${i.length?j`
            <div class="group-lights-list">
              ${i.map(({eid:e,state:i})=>{const s="on"===i.state,r=i.attributes?.rgb_color??[255,255,255],a=`#${r.map(t=>t.toString(16).padStart(2,"0")).join("")}`,n=s?`rgb(${r[0]},${r[1]},${r[2]})`:"var(--sv-text-disabled)",o=s?`0 0 6px rgb(${r[0]},${r[1]},${r[2]})`:"none",l=this._label(e),d=(i.attributes?.supported_color_modes??[]).some(t=>["rgb","rgbw","rgbww","hs","xy"].includes(t));return j`
                  <div class="grp-light-row ${s?"on":""}"
                    data-grp-light-eid=${e}
                    data-grp-id=${t.id}
                    @click=${t=>{t.stopPropagation(),this._toggleLight(e)}}
                    @pointerdown=${this._setupMode?i=>this._onGrpLightPointerDown(i,t.id,e):null}>
                    <div class="grp-light-dot" style="background:${n};box-shadow:${o}">
                      ${d?j`
                        <input type="color" class="grp-light-color" .value=${a}
                          @click=${t=>t.stopPropagation()}
                          @pointerdown=${t=>t.stopPropagation()}
                          @change=${t=>{t.stopPropagation();const i=t.target.value;this.hass.callService("light","turn_on",{entity_id:e,rgb_color:[parseInt(i.slice(1,3),16),parseInt(i.slice(3,5),16),parseInt(i.slice(5,7),16)]})}}
                        />
                      `:""}
                    </div>
                    <span class="grp-light-name">${l}</span>
                    ${this._setupMode?j`
                      <ha-icon class="grp-light-grip" icon="mdi:drag-horizontal-variant"></ha-icon>
                    `:""}
                  </div>
                `})}
            </div>
          `:""}
      ${s.length?j`
            <div class="group-scenes">
              ${s.map(({eid:t,name:e})=>j`
                  <button
                    class="scene-chip"
                    @click=${e=>{e.stopPropagation(),this._triggerScene(t)}}
                  >
                    ${e}
                  </button>
                `)}
            </div>
          `:""}
    `}_renderGroupTile(t,e){const i=t.lights.some(t=>"on"===this.hass?.states?.[t]?.state),s=e&&e.w>=3&&e.h>=3;return j`
      <div
        class="gtile ${i?"on":""} ${s?"expanded":""}"
        data-tile-id=${t.id}
        @pointerdown=${e=>this._onGroupPointerDown(e,t)}
        @pointermove=${e=>this._onGroupPointerMove(e,t)}
        @pointerup=${e=>this._onGroupPointerUp(e,t)}
        @pointerleave=${()=>{clearTimeout(this._lpTimer),this._lpTimer=null}}
      >
        <div class="gtile-hdr">
          <ha-icon
            class="gtile-icon ${i?"on":""}"
            icon="mdi:apps"
          ></ha-icon>
          ${s&&this._setupMode?j`
            <input class="gtile-name-input" type="text"
              .value=${t.name}
              @click=${t=>t.stopPropagation()}
              @pointerdown=${t=>t.stopPropagation()}
              @change=${e=>{e.stopPropagation(),this._renameGroup(t.id,e.target.value)}}
              @keydown=${t=>{"Enter"===t.key&&t.target.blur()}}
            />
          `:j`<span class="gtile-name">${t.name}</span>`}
          ${s?j`
            <button class="gtile-toggle ${i?"on":""}"
              @click=${e=>{e.stopPropagation(),this._toggleGroup(t)}}
              @pointerdown=${t=>t.stopPropagation()}>
              <div class="gtile-toggle-thumb"></div>
            </button>
          `:""}
        </div>
        ${s?j`
          <div class="gtile-brightness" @click=${t=>t.stopPropagation()} @pointerdown=${t=>t.stopPropagation()}>
            <ha-icon icon="mdi:brightness-6" style="--mdc-icon-size:14px;color:var(--sv-text-secondary);flex-shrink:0"></ha-icon>
            <input type="range" class="gtile-bri-slider" min="0" max="255" .value=${this._groupBrightness(t)}
              @input=${e=>this._setGroupBrightness(t,parseInt(e.target.value))}
            />
          </div>
        `:""}

        ${s?"":j`
          <div class="gtile-dots">
            ${(t.lights??[]).map(t=>{const e=this.hass?.states?.[t],i="on"===e?.state,s=e?.attributes?.rgb_color??[255,255,255],r=i?`rgb(${s[0]},${s[1]},${s[2]})`:"var(--sv-text-disabled)";return j`<div class="gtile-dot" style="background:${r};${i?`box-shadow:0 0 4px ${r}`:""}"></div>`})}
          </div>
        `}

        <div class="gtile-body">
          ${s?this._renderGroupTileBody(t,i):""}
        </div>
      </div>
    `}_renderSetupGroups(){const t=this._pendingSlots,e=t.groups??[],i=(t.lights??[]).map(t=>({eid:t.entity,label:t.name||this._label(t.entity)})).filter(t=>t.eid);return j`
      <div class="setup-list">
        ${e.map((t,e)=>j`
            <div class="group-edit-card">
              <div class="group-edit-hdr">
                <input
                  class="setup-name-input group-edit-name"
                  .value=${t.name??""}
                  placeholder="Group name"
                  @change=${t=>this._updatePSItem("groups",e,"name",t.target.value)}
                />
                <button
                  class="setup-del"
                  @click=${()=>{this._removePSItem("groups",e)}}
                >
                  ✕
                </button>
              </div>

              <div class="group-edit-section-title">Lights</div>
              <div class="group-lights-grid">
                ${i.map(({eid:i,label:s})=>{const r=(t.lights??[]).includes(i);return j`
                    <label
                      class="group-light-chip ${r?"on":""}"
                      @click=${()=>{const s=r?(t.lights??[]).filter(t=>t!==i):[...t.lights??[],i];this._updatePSItem("groups",e,"lights",s)}}
                    >
                      ${s}
                    </label>
                  `})}
                ${i.length?"":j`<span class="group-edit-hint"
                      >Add lights in the Lighting section first.</span
                    >`}
              </div>

              <div class="group-edit-section-title">Scenes</div>
              ${(t.scenes??[]).map((i,s)=>j`
                  <div class="setup-row">
                    ${this._entitySelect(["scene"],i,i=>{const r=[...t.scenes??[]];r[s]=i,this._updatePSItem("groups",e,"scenes",r)})}
                    <button
                      class="setup-del"
                      @click=${()=>{const i=(t.scenes??[]).filter((t,e)=>e!==s);this._updatePSItem("groups",e,"scenes",i)}}
                    >
                      ✕
                    </button>
                  </div>
                `)}
              <button
                class="setup-add"
                @click=${()=>{const i=[...t.scenes??[],""];this._updatePSItem("groups",e,"scenes",i)}}
              >
                + Add scene
              </button>
            </div>
          `)}
        <button
          class="setup-add"
          @click=${()=>this._addPSItem("groups",{id:`grp_${Date.now()}`,name:"New Group",lights:[],scenes:[]})}
        >
          + Add group
        </button>
      </div>
    `}_entityOptions(t){return this.hass?.states?Object.entries(this.hass.states).filter(([e])=>t.some(t=>e.startsWith(t+"."))).map(([t,e])=>({eid:t,label:e.attributes?.friendly_name??t.split(".").pop()})).sort((t,e)=>t.label.localeCompare(e.label)):[]}_entitySelect(t,e,i){const s=this._entityOptions(t).map(({eid:t,label:e})=>({value:t,label:e}));return j`
      <smartvanio-select
        class="setup-entity-select"
        .value=${e??""}
        .options=${s}
        placeholder="— choose —"
        @smartvanio-change=${t=>i(t.detail.value||null)}
      >
      </smartvanio-select>
    `}_renderSetupClimate(){const t=this._pendingSlots;return j`
      <div class="setup-panel">
        <div class="setup-row">
          <span class="setup-label">Cabin Temperature</span>
          ${this._entitySelect(["sensor"],t.temperature,t=>this._setPS("temperature",t))}
        </div>
        <div class="setup-row">
          <span class="setup-label">Target Setpoint</span>
          ${this._entitySelect(["number"],t.target_temp,t=>this._setPS("target_temp",t))}
        </div>
        <div class="setup-row">
          <span class="setup-label">Fan Mode</span>
          ${this._entitySelect(["select"],t.fan_speed,t=>this._setPS("fan_speed",t))}
        </div>
        <div class="setup-row">
          <span class="setup-label">Water Mode</span>
          ${this._entitySelect(["select"],t.water_mode,t=>this._setPS("water_mode",t))}
        </div>
        <div class="setup-row">
          <span class="setup-label">Heating Active</span>
          ${this._entitySelect(["binary_sensor"],t.heating_active,t=>this._setPS("heating_active",t))}
        </div>
      </div>
    `}_renderSetupLevel(){const t=this._pendingSlots;return j`
      <div class="setup-panel">
        <div class="setup-row">
          <span class="setup-label">Pitch</span>
          ${this._entitySelect(["sensor"],t.pitch,t=>this._setPS("pitch",t))}
        </div>
        <div class="setup-row">
          <span class="setup-label">Roll</span>
          ${this._entitySelect(["sensor"],t.roll,t=>this._setPS("roll",t))}
        </div>
      </div>
    `}_renderSetupStatus(){const t=this._pendingSlots;return j`
      <div class="setup-panel">
        ${(t.status_sensors??[]).map((e,i)=>j`
            <div class="setup-row">
              ${this._entitySelect(["sensor","binary_sensor","number"],e,e=>{const s=[...t.status_sensors??[]];s[i]=e,this._setPS("status_sensors",s)})}
              <button
                class="setup-del"
                @click=${()=>this._removePSItem("status_sensors",i)}
              >
                ✕
              </button>
            </div>
          `)}
        <button
          class="setup-add"
          @click=${()=>this._addPSItem("status_sensors","")}
        >
          + Add sensor
        </button>
      </div>
    `}_renderSetupLighting(){const t=this._pendingSlots;return j`
      <div class="setup-list">
        ${(t.lights??[]).map((t,e)=>j`
            <div class="setup-row">
              <input
                class="setup-name-input"
                .value=${t.name??""}
                placeholder="Name"
                @change=${t=>this._updatePSItem("lights",e,"name",t.target.value)}
              />
              ${this._entitySelect(["light"],t.entity,t=>this._updatePSItem("lights",e,"entity",t))}
              <button
                class="setup-del"
                @click=${()=>this._removePSItem("lights",e)}
              >
                ✕
              </button>
            </div>
          `)}
        <button
          class="setup-add"
          @click=${()=>this._addPSItem("lights",{entity:"",name:""})}
        >
          + Add light
        </button>
      </div>
    `}_renderSetupSwitches(){const t=this._pendingSlots;return j`
      <div class="setup-list">
        ${(t.switches??[]).map((t,e)=>j`
            <div class="setup-row">
              <input
                class="setup-name-input"
                .value=${t.name??""}
                placeholder="Name"
                @change=${t=>this._updatePSItem("switches",e,"name",t.target.value)}
              />
              ${this._entitySelect(["switch","input_boolean","button"],t.entity,t=>this._updatePSItem("switches",e,"entity",t))}
              <button
                class="setup-del"
                @click=${()=>this._removePSItem("switches",e)}
              >
                ✕
              </button>
            </div>
          `)}
        <button
          class="setup-add"
          @click=${()=>this._addPSItem("switches",{entity:"",name:""})}
        >
          + Add switch
        </button>
      </div>
    `}_renderSetupButtons(){const t=this._pendingSlots;return j`
      <div class="setup-list">
        ${(t.buttons??[]).map((t,e)=>j`
            <div class="setup-row">
              <input
                class="setup-name-input"
                .value=${t.name??""}
                placeholder="Name"
                @change=${t=>this._updatePSItem("buttons",e,"name",t.target.value)}
              />
              ${this._entitySelect(["binary_sensor"],t.entity,t=>this._updatePSItem("buttons",e,"entity",t))}
              <button
                class="setup-del"
                @click=${()=>this._removePSItem("buttons",e)}
              >
                ✕
              </button>
            </div>
          `)}
        <button
          class="setup-add"
          @click=${()=>this._addPSItem("buttons",{entity:"",name:""})}
        >
          + Add button
        </button>
      </div>
    `}_renderButtonTile({eid:t,state:e,_slotName:i=null}){const s="on"===e?.state,r=this._label(t,i);return j`
      <div class="btile ${s?"active":""} ${this._setupMode?"editable":""}"
        @click=${()=>this._setupMode?this._openEditModal(t):void 0}>
        <ha-icon class="btile-icon"
          icon="${s?"mdi:circle-slice-8":"mdi:gesture-tap-button"}"></ha-icon>
        <span class="btile-name">${r}</span>
        <span class="btile-state">${this._setupMode?"Edit automations":s?"Pressed":"—"}</span>
      </div>
    `}_renderSetupResources(){const t=this._pendingSlots,e=["var(--sv-accent)","#f0b72f","#ff9492","#2bd853","#d3abff"];return j`
      ${(t.resources??[]).map((t,i)=>j`
          <div class="setup-res-row">
            <input
              type="color"
              class="setup-color-swatch"
              .value=${t.color??e[i%e.length]}
              @change=${t=>this._updatePSItem("resources",i,"color",t.target.value)}
            />
            <input
              class="setup-name-input"
              .value=${t.name??""}
              placeholder="Label"
              @change=${t=>this._updatePSItem("resources",i,"name",t.target.value)}
            />
            ${this._entitySelect(["sensor"],t.entity,t=>this._updatePSItem("resources",i,"entity",t))}
            <button
              class="setup-del"
              @click=${()=>this._removePSItem("resources",i)}
            >
              ✕
            </button>
          </div>
        `)}
      <button
        class="setup-add setup-res-add"
        @click=${()=>this._addPSItem("resources",{entity:"",name:"",color:e[(t.resources?.length??0)%e.length]})}
      >
        + Add
      </button>
    `}_isPinned(t){return(this._cardConfig.pinnedActions??[]).some(e=>e.id===t)}_addPinnedAction(t,e){if(this._isPinned(t))return;const i=[...this._cardConfig.pinnedActions??[],{id:t,label:e}];this._cardConfig={...this._cardConfig,pinnedActions:i},this._saveMqttConfig()}_removePinnedAction(t){const e=(this._cardConfig.pinnedActions??[]).filter(e=>e.id!==t);this._cardConfig={...this._cardConfig,pinnedActions:e},this._saveMqttConfig()}_triggerScene(t){if(this._isSceneActive(t)){const e=this._sceneConfigs[t];if(e?.entities){const t=Object.keys(e.entities).filter(t=>t.startsWith("light."));if(t.length)return this.hass.callService("light","turn_off",{entity_id:t})}}return this.hass.callService("scene","turn_on",{entity_id:t})}_runAction(t){const e=t.split(".")[0];if("scene"===e)return this._triggerScene(t);if("script"===e)return this.hass.callService("script","turn_on",{entity_id:t});if("switch"===e){const e="on"===this.hass.states[t]?.state;return this.hass.callService("switch",e?"turn_off":"turn_on",{entity_id:t})}return"light"===e?this.hass.callService("light","toggle",{entity_id:t}):void 0}_haDevice(){return this._selectedId&&this.hass?Object.values(this.hass.devices??{}).find(t=>t.identifiers?.some(([t,e])=>"smartvanio"===t&&e===this._selectedId))??null:null}_allSmartvanioDeviceIds(){return this.hass?new Set(Object.values(this.hass.devices??{}).filter(t=>t.identifiers?.some(([t])=>"smartvanio"===t)).map(t=>t.id)):new Set}_entities(){if(!this.hass)return null;const t=this._allSmartvanioDeviceIds();if(!t.size)return null;const e={lights:[],switches:[],sensors:[],binary_sensors:[],numbers:[],selects:[]};for(const[i,s]of Object.entries(this.hass.entities??{})){if(!t.has(s.device_id))continue;const r=this.hass.states[i];if(!r)continue;const a=i.split(".")[0];"light"===a?e.lights.push({eid:i,state:r}):"switch"===a?e.switches.push({eid:i,state:r}):"sensor"===a?e.sensors.push({eid:i,state:r}):"binary_sensor"===a?e.binary_sensors.push({eid:i,state:r}):"number"===a?e.numbers.push({eid:i,state:r}):"select"===a&&e.selects.push({eid:i,state:r})}return e}_levelEntities(t=null){if(!this.hass)return null;if(t){const e=t.pitch?this.hass.states[t.pitch]:null,i=t.roll?this.hass.states[t.roll]:null;return e||i?{pitch:e,roll:i}:null}const e=Object.values(this.hass.states),i=t=>"°"===t.attributes?.unit_of_measurement,s=e.find(t=>i(t)&&/adjusted.*pitch|pitch.*adjusted/i.test(t.entity_id))??e.find(t=>i(t)&&/pitch/i.test(t.entity_id)),r=e.find(t=>i(t)&&/adjusted.*roll|roll.*adjusted/i.test(t.entity_id))??e.find(t=>i(t)&&/roll/i.test(t.entity_id));return s||r?{pitch:s,roll:r}:null}_deviceScenes(){const t=this._allSmartvanioDeviceIds();return t.size?Object.entries(this.hass.entities??{}).filter(([e,i])=>e.startsWith("scene.")&&t.has(i.device_id)).map(([t])=>({eid:t,state:this.hass.states[t]})).filter(({state:t})=>t).sort((t,e)=>t.eid.localeCompare(e.eid)):[]}_allActions(){const t=[];for(const[e,i]of Object.entries(this.hass.states??{})){const s=e.split(".")[0];if("scene"===s||"script"===s){const r=i.attributes?.friendly_name??e.split(".").pop();t.push({id:e,label:r,domain:s})}}return t.sort((t,e)=>t.label.localeCompare(e.label))}_label(t,e=null){if(e)return e;const i=this.hass.entities?.[t]?.name;if(i)return i;const s=this.hass.states[t]?.attributes?.friendly_name??"",r=this.hass.entities?.[t]?.device_id,a=r?this.hass.devices?.[r]:null,n=a?.name_by_user??a?.name??"";return n&&s.startsWith(n+" ")?s.slice(n.length+1):s||t.split(".").pop()}_smartvanioDeviceId(t){const e=this.hass?.entities?.[t]?.device_id;if(!e)return null;const i=this.hass?.devices?.[e],s=i?.identifiers?.find(([t])=>"smartvanio"===t);return s?.[1]??null}_entityByChannel(t,e,i){for(const[s,r]of Object.entries(this._knownDevices)){if(r.model!==t)continue;const a=`${e}.${s.replace(/-/g,"_")}_${i}`;if(this.hass.states[a])return a}return null}_powerSwitches(t){return t.filter(({eid:t})=>!/heater|water_pump|inclinometer/i.test(t))}_buttonEntities(t){return t.filter(({eid:t,state:e})=>"door"!==e?.attributes?.device_class&&!/door/i.test(t))}_channelFromEntity(t){const e=this.hass.entities?.[t]?.device_id,i=e?this.hass.devices?.[e]:null,s=i?(i.name_by_user??i.name??"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/,""):this._selectedId;return t.split(".")[1].replace(s+"_","")}_automationId(t,e){const i=this._channelFromEntity(t);return`smartvanio_${this._selectedId}_${i}_${e}`}_getTargetEntities(){const t=this._resolveSlots(),e=[],i=new Set,s=(t?.lights??[]).map(({entity:t,name:e})=>({entity_id:t,label:e||this._label(t),domain:"light"}));s.length&&(e.push({label:"SmartVan.io Lights",entities:s}),s.forEach(t=>i.add(t.entity_id)));const r=(t?.switches??[]).map(({entity:t,name:e})=>({entity_id:t,label:e||this._label(t),domain:"switch"}));r.length&&(e.push({label:"SmartVan.io Switches",entities:r}),r.forEach(t=>i.add(t.entity_id)));const a=this._allSmartvanioDeviceIds(),n=Object.entries(this.hass.states??{}).filter(([t])=>t.startsWith("scene.")).filter(([t])=>a.size&&Object.values(this.hass.entities??{}).find(e=>e.entity_id===t&&a.has(e.device_id))).map(([t,e])=>({entity_id:t,label:this.hass.entities?.[t]?.name||e.attributes?.friendly_name||t.split(".")[1],domain:"scene"}));n.length&&(e.push({label:"SmartVan.io Scenes",entities:n}),n.forEach(t=>i.add(t.entity_id)));const o=(t,s)=>{const r=Object.entries(this.hass.states??{}).filter(([e])=>{if(i.has(e))return!1;if(!e.startsWith(t+"."))return!1;const s=this.hass.entities?.[e];return!s?.entity_category}).map(([e,i])=>({entity_id:e,label:this._label(e),domain:t})).sort((t,e)=>t.label.localeCompare(e.label));r.length&&e.push({label:s,entities:r})};o("light","Other Lights"),o("switch","Other Switches"),o("fan","Fans"),o("cover","Covers"),o("lock","Locks");const l=Object.entries(this.hass.states??{}).filter(([t])=>t.startsWith("scene.")&&!i.has(t)).map(([t,e])=>({entity_id:t,label:this.hass.entities?.[t]?.name||e.attributes?.friendly_name||t.split(".")[1],domain:"scene"})).sort((t,e)=>t.label.localeCompare(e.label));return l.length&&e.push({label:"Other Scenes",entities:l}),e}_buildAutomationConfig(t,e,i,s,r={}){const a=i.split(".")[0],n=this._label(t),o={press:"Press",double_press:"Double Press",hold:"Hold",above:`Above ${r.threshold??""}`,below:`Below ${r.threshold??""}`}[e]??e,l=JSON.stringify({smartvanio:!0,entity_id:t,gesture:e,target_entity_id:i,action:s,...r});let d;if("turn_on_for"===s){d=[{action:`${a}.turn_on`,target:{entity_id:i}},{delay:{minutes:parseInt(r.duration??5,10)}},{action:`${a}.turn_off`,target:{entity_id:i}}]}else if("set_brightness"===s){d=[{action:"light.turn_on",target:{entity_id:i},data:{brightness_pct:parseInt(r.brightness_pct??50,10)}}]}else{d=[{action:{lock:"lock.lock",unlock:"lock.unlock",open_cover:"cover.open_cover",close_cover:"cover.close_cover",stop_cover:"cover.stop_cover"}[s]??`${a}.${s}`,target:{entity_id:i}}]}const c={alias:`[VanCtl] ${n} — ${o}`,description:l,initial_state:!0,conditions:[],mode:"single"};return"press"===e?{...c,triggers:[{trigger:"state",entity_id:t,from:"off",to:"on"}],actions:d}:"hold"===e?{...c,triggers:[{trigger:"state",entity_id:t,from:"off",to:"on",for:"0:00:02"}],actions:d}:"double_press"===e?{...c,triggers:[{trigger:"state",entity_id:t,from:"off",to:"on"}],actions:[{wait_for_trigger:[{trigger:"state",entity_id:t,from:"off",to:"on"}],timeout:"0:00:00.500",continue_on_timeout:!1},...d]}:"off_to_on"===e?{...c,triggers:[{trigger:"state",entity_id:t,from:"off",to:"on"}],actions:d}:"on_to_off"===e?{...c,triggers:[{trigger:"state",entity_id:t,from:"on",to:"off"}],actions:d}:"above"===e?{...c,triggers:[{trigger:"numeric_state",entity_id:t,above:parseFloat(r.threshold??0)}],actions:d}:"below"===e?{...c,triggers:[{trigger:"numeric_state",entity_id:t,below:parseFloat(r.threshold??0)}],actions:d}:{...c,triggers:[],actions:d}}_getSourceEntities(){this._allSmartvanioDeviceIds();const t=[],e=new Set,i=this._resolveSlots(),s=this._entities(),r=i?.buttons?.length?i.buttons.map(({entity:t,name:e})=>({entity_id:t,label:e||this._label(t)})):this._buttonEntities(s?.binary_sensors??[]).map(({eid:t,_slotName:e})=>({entity_id:t,label:e||this._label(t)}));r.length&&(t.push({label:"SmartVan.io Buttons",entities:r}),r.forEach(t=>e.add(t.entity_id)));const a=(i?.switches?.length?i.switches:(s?.switches??[]).map(({eid:t,_slotName:e})=>({entity:t,name:e}))).map(({entity:t,name:e,eid:i})=>({entity_id:t??i,label:e||this._label(t??i)}));a.length&&(t.push({label:"SmartVan.io Switches",entities:a}),a.forEach(t=>e.add(t.entity_id)));const n=Object.entries(this.hass.states??{}).filter(([t,i])=>{if(e.has(t))return!1;const s=t.split(".")[0];if("binary_sensor"!==s&&"button"!==s)return!1;if("door"===i.attributes?.device_class||/door/i.test(t))return!1;const r=this.hass.entities?.[t];return!r?.entity_category}).map(([t,e])=>({entity_id:t,label:this._label(t)})).sort((t,e)=>t.label.localeCompare(e.label));n.length&&t.push({label:"Other Buttons",entities:n});const o=Object.entries(this.hass.states??{}).filter(([t])=>{if(e.has(t))return!1;if(!t.startsWith("switch."))return!1;const i=this.hass.entities?.[t];return!i?.entity_category}).map(([t])=>({entity_id:t,label:this._label(t)})).sort((t,e)=>t.label.localeCompare(e.label));return o.length&&t.push({label:"Other Switches",entities:o}),t}_eventsForSource(t){const e=t?.split(".")?.[0];return"binary_sensor"===e||"button"===e?[{value:"press",label:"Press"},{value:"double_press",label:"Double Press"},{value:"hold",label:"Press & Hold"}]:"switch"===e||"light"===e||"fan"===e?[{value:"off_to_on",label:"Turned On"},{value:"on_to_off",label:"Turned Off"}]:"cover"===e?[{value:"off_to_on",label:"Opened"},{value:"on_to_off",label:"Closed"}]:"lock"===e?[{value:"off_to_on",label:"Unlocked"},{value:"on_to_off",label:"Locked"}]:[]}_actionsForTarget(t){const e=t?.split(".")?.[0];return"scene"===e?[{value:"turn_on",label:"Activate"}]:"light"===e?[{value:"toggle",label:"Toggle"},{value:"turn_on",label:"Turn On"},{value:"turn_off",label:"Turn Off"},{value:"turn_on_for",label:"Turn On for…"},{value:"set_brightness",label:"Set Brightness…"}]:"switch"===e||"fan"===e?[{value:"toggle",label:"Toggle"},{value:"turn_on",label:"Turn On"},{value:"turn_off",label:"Turn Off"},{value:"turn_on_for",label:"Turn On for…"}]:"lock"===e?[{value:"lock",label:"Lock"},{value:"unlock",label:"Unlock"}]:"cover"===e?[{value:"open_cover",label:"Open"},{value:"close_cover",label:"Close"},{value:"stop_cover",label:"Stop"}]:[{value:"toggle",label:"Toggle"}]}_eventLabel(t){return{press:"Press",double_press:"Double Press",hold:"Press & Hold",off_to_on:"Off → On",on_to_off:"On → Off"}[t]??t}_buildAutoFromModal(t,e,i,s){const r=`smartvanio_${this._selectedId}_${this._channelFromEntity(t)}_${e}`,a=this._label(t),n=this._eventLabel(e),o=this._label(i),l={action:`${i.split(".")[0]}.${s}`,target:{entity_id:i}},d={alias:`[VanCtl] ${a} — ${n} — ${o}`,description:JSON.stringify({smartvanio:!0,configKey:r,entity_id:t,event:e,target_entity_id:i,action:s}),initial_state:!0,conditions:[],mode:"single"};return"press"===e?{...d,configKey:r,triggers:[{trigger:"state",entity_id:t,from:"off",to:"on"}],actions:[l]}:"hold"===e?{...d,configKey:r,triggers:[{trigger:"state",entity_id:t,from:"off",to:"on",for:"0:00:02"}],actions:[l]}:"double_press"===e?{...d,configKey:r,triggers:[{trigger:"state",entity_id:t,from:"off",to:"on"}],actions:[{wait_for_trigger:[{trigger:"state",entity_id:t,from:"off",to:"on"}],timeout:"0:00:00.500",continue_on_timeout:!1},l]}:"off_to_on"===e?{...d,configKey:r,triggers:[{trigger:"state",entity_id:t,from:"off",to:"on"}],actions:[l]}:"on_to_off"===e?{...d,configKey:r,triggers:[{trigger:"state",entity_id:t,from:"on",to:"off"}],actions:[l]}:{...d,configKey:r,triggers:[],actions:[l]}}_listVanctlAutomations(){return Object.entries(this.hass?.states??{}).filter(([t,e])=>t.startsWith("automation.")&&e.attributes?.friendly_name?.startsWith("[VanCtl]")).map(([t,e])=>({eid:t,alias:e.attributes.friendly_name})).sort((t,e)=>t.alias.localeCompare(e.alias))}async _deleteAuto(t){const e=this.hass.entities?.[t.eid]?.unique_id;if(e)try{await this.hass.callApi("DELETE",`config/automation/config/${e}`),await this.hass.callService("automation","reload",{})}catch(t){console.error("[VanCtl] delete automation failed",t)}else console.error("[VanCtl] cannot delete: no unique_id for",t.eid)}_openAutoModal(){this._autoModal={source:"",event:"",target:"",action:"",saving:!1,error:null}}_updateAutoModal(t){this._autoModal={...this._autoModal,...t}}async _saveAutoModal(){const{source:t,event:e,target:i,action:s}=this._autoModal;if(t&&e&&i&&s){this._updateAutoModal({saving:!0,error:null});try{const r=this._buildAutoFromModal(t,e,i,s),{configKey:a,...n}=r;await this.hass.callApi("POST",`config/automation/config/${a}`,n),await this.hass.callService("automation","reload",{}),this._autoModal=null}catch(t){this._updateAutoModal({saving:!1,error:"Save failed: "+(t.message||JSON.stringify(t))})}}else this._updateAutoModal({error:"Please fill in all fields."})}_renderAutoModal(){if(!this._autoModal)return j``;const t=this._autoModal,e=this._getSourceEntities().map(t=>({groupLabel:t.label,options:t.entities.map(t=>({value:t.entity_id,label:t.label}))})),i=t.source?this._eventsForSource(t.source).map(t=>({value:t.value,label:t.label})):[],s=this._getTargetEntities().map(t=>({groupLabel:t.label,options:t.entities.map(t=>({value:t.entity_id,label:t.label}))})),r=t.target?this._actionsForTarget(t.target).map(t=>({value:t.value,label:t.label})):[];return j`
      <div
        class="auto-modal-overlay"
        @click=${t=>{t.target===t.currentTarget&&(this._autoModal=null)}}
      >
        <div class="auto-modal">
          <div class="auto-modal-header">
            <span class="auto-modal-title">Add Action</span>
            <button
              class="auto-modal-close"
              @click=${()=>{this._autoModal=null}}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="auto-modal-body">
            <div class="auto-field">
              <label class="auto-label">When this</label>
              <smartvanio-select
                .value=${t.source}
                .options=${e}
                placeholder="— Select trigger —"
                @smartvanio-change=${t=>this._updateAutoModal({source:t.detail.value,event:"",action:""})}
              ></smartvanio-select>
            </div>
            <div class="auto-field">
              <label class="auto-label">Does this</label>
              <smartvanio-select
                .value=${t.event}
                .options=${i}
                placeholder="— Select event —"
                ?disabled=${!t.source}
                @smartvanio-change=${t=>this._updateAutoModal({event:t.detail.value})}
              ></smartvanio-select>
            </div>
            <div class="auto-field-sep">then</div>
            <div class="auto-field">
              <label class="auto-label">On this</label>
              <smartvanio-select
                .value=${t.target}
                .options=${s}
                placeholder="— Select target —"
                @smartvanio-change=${t=>this._updateAutoModal({target:t.detail.value,action:""})}
              ></smartvanio-select>
            </div>
            <div class="auto-field">
              <label class="auto-label">Do this</label>
              <smartvanio-select
                .value=${t.action}
                .options=${r}
                placeholder="— Select action —"
                ?disabled=${!t.target}
                @smartvanio-change=${t=>this._updateAutoModal({action:t.detail.value})}
              ></smartvanio-select>
            </div>
            ${t.error?j`<div class="auto-modal-error">${t.error}</div>`:""}
          </div>
          <div class="auto-modal-footer">
            <button
              class="auto-btn cancel"
              @click=${()=>{this._autoModal=null}}
            >
              Cancel
            </button>
            <button
              class="auto-btn save"
              ?disabled=${t.saving}
              @click=${()=>this._saveAutoModal()}
            >
              ${t.saving?"Saving…":"Save"}
            </button>
          </div>
        </div>
      </div>
    `}async _openEditModal(t){if(this._editingEntity=t,this._editName=this._label(t),this._editArea=(this._cardConfig?.slots?.lights??[]).find(e=>e.entity===t)?.area??"",this._editRows=[],this._editOriginalIds={},this._lightSegments=[],this._maxLeds=0,this._switchMode=null,t.startsWith("switch.")){const e=this._resolveEntityTopic(t);if(e?.deviceId&&e?.channel){const t=`${e.deviceId}_${e.channel}_mode`,i=Object.keys(this.hass.entities??{}).find(e=>e.startsWith("select.")&&this.hass.entities[e]?.unique_id===t);if(i){const t=this.hass.states[i];this._switchMode={entityId:i,options:t?.attributes?.options??["Normally Open","Normally Closed"],current:t?.state??"Normally Open"}}}}this._editLoading=!0,this._editSaving=!1,this._saveError=null;const e=t.split(".")[0];try{{const e=[],i={},s=Object.entries(this.hass?.states??{}).filter(([t,e])=>t.startsWith("automation.")&&e.attributes?.friendly_name?.startsWith("[VanCtl]"));for(const[r,a]of s)try{const s=this.hass.entities?.[r]?.unique_id||a.attributes?.id;if(!s)continue;const n=await this.hass.callApi("GET",`config/automation/config/${s}`),o=JSON.parse(n.description??"{}");if(!o.smartvanio)continue;o.entity_id!==t&&o.target_entity_id!==t||(e.push({id:s,source_entity_id:o.entity_id??"",gesture:o.gesture??o.event??"",target_entity_id:o.target_entity_id??"",action:o.action??"",duration:o.duration??"",brightness_pct:o.brightness_pct??"",threshold:o.threshold??""}),i[s]=s)}catch{}if(!e.length){const i=t.split(".")[0];("binary_sensor"===i||"button"===i||"switch"===i)&&e.push({id:null,source_entity_id:t,gesture:"switch"===i?"off_to_on":"press",target_entity_id:"",action:"",duration:"",brightness_pct:""})}this._editRows=e,this._editOriginalIds=i}if("light"===e&&this._isSmartvanioLight(t)){const e=this.hass.states[t];this._maxLeds=parseInt(e?.attributes?.max_leds??0,10);const i=Object.values(this.hass.states).filter(e=>e.attributes?.smartvanio_parent_entity_id===t);this._originalSegments=i.map(t=>({id:t.attributes.segment_id??`seg_${t.attributes.segment_start}_${t.attributes.segment_end}`,entity_id:t.entity_id})),this._lightSegments=i.map(e=>({id:e.attributes.segment_id??`seg_${e.attributes.segment_start}_${e.attributes.segment_end}`,name:this._label(e.entity_id),start:parseInt(e.attributes.segment_start??0,10),end:parseInt(e.attributes.segment_end??0,10),r:e.attributes.rgb_color?.[0]??255,g:e.attributes.rgb_color?.[1]??255,b:e.attributes.rgb_color?.[2]??255,brightness:Math.round(parseInt(e.attributes.brightness??255,10)/255*100),parent_entity_id:t})).sort((t,e)=>t.start-e.start),this._initialSegments=this._lightSegments.map(t=>({...t})),this._previewTurnedOn=!1,this._patternPreviewActive=!1;const s=this.hass.states[t];this._modalOpenState={state:s?.state,brightness:s?.attributes?.brightness,rgb_color:s?.attributes?.rgb_color?[...s.attributes.rgb_color]:null,effect:this._getActivePatternName(t)},this._stripTouched=!1;const r=this._resolveSegmentTopic();if(r)try{const t=await this.hass.connection.subscribeMessage(e=>{try{const t=JSON.parse(e.payload);"object"!=typeof t||null===t||Array.isArray(t)||(this._lightPatterns=t)}catch{}t()},{type:"mqtt/subscribe",topic:`smartvanio/${r.deviceId}/light/${r.channel}/patterns`});setTimeout(()=>{try{t()}catch{}},2e3)}catch{}}}catch(t){console.error("VanCtl: failed to load edit data",t)}finally{this._editLoading=!1}}_setSwitchMode(t){this._switchMode?.entityId&&(this._switchMode={...this._switchMode,current:t},this.hass.callService("select","select_option",{entity_id:this._switchMode.entityId,option:t}))}async _saveEdit({entity_id:t,name:e,area:i,rows:s,lightSegments:r,maxLeds:a}){this._editSaving=!0,this._saveError=null,this._initialSegments=null,this._previewTurnedOn=!1;try{const n=this.hass.entities?.[t]?.name,o=e?.trim();if((o||null)!==(n||null)&&await this.hass.callWS({type:"config/entity_registry/update",entity_id:t,name:o||null}),void 0!==i){const s={...this._cardConfig?.slots??{}},r=[...s.lights??[]],a=r.findIndex(e=>e.entity===t);a>=0?r[a]={...r[a],area:i?.trim()||""}:r.push({entity:t,name:e||"",area:i?.trim()||""}),s.lights=r,this._cardConfig={...this._cardConfig,slots:s},this._saveMqttConfig()}const l=t.split(".")[0];if(s?.length||Object.keys(this._editOriginalIds??{}).length){const e=new Set;for(const i of s??[]){const s="sensor"===l;if(s&&(i.source_entity_id=t,i.gesture||(i.gesture="above")),!s&&i.source_entity_id&&!i.gesture){const t=i.source_entity_id.split(".")[0];"binary_sensor"===t||"button"===t?i.gesture="press":"switch"!==t&&"light"!==t&&"fan"!==t||(i.gesture="off_to_on")}const r=[];if(i.source_entity_id||r.push("trigger"),i.gesture||r.push("event"),!s||void 0!==i.threshold&&""!==i.threshold||r.push("threshold value"),i.target_entity_id||r.push("target"),i.action||r.push("action"),r.length)return this._saveError=`Incomplete automation row — please fill in: ${r.join(", ")}`,void(this._editSaving=!1);const a=i.source_entity_id.split(".")[1]??"unknown",n=i.target_entity_id.split(".")[1]??"unknown",o=`smartvanio_${a}_${i.gesture}_${n}`,d={};i.duration&&(d.duration=i.duration),i.brightness_pct&&(d.brightness_pct=i.brightness_pct),void 0!==i.threshold&&(d.threshold=i.threshold);const c=this._buildAutomationConfig(i.source_entity_id,i.gesture,i.target_entity_id,i.action,d);try{await this.hass.callApi("POST",`config/automation/config/${o}`,c)}catch(t){this._saveError="Failed to save automation: "+(t.message||JSON.stringify(t))}e.add(o)}for(const t of Object.keys(this._editOriginalIds??{}))if(!e.has(t))try{await this.hass.callApi("DELETE",`config/automation/config/${t}`)}catch{}await this.hass.callService("automation","reload",{})}if("light"===l&&r){const e=this.hass.entities?.[t]?.device_id,i=e?this.hass.devices?.[e]:null,s=i?.identifiers?.find(([t])=>"smartvanio"===t),n=s?.[1]??"";let o="";if(n&&this._knownDevices[n]){const e=this._knownDevices[n],i=this.hass.states[t]?.attributes?.friendly_name??"";for(const s of e.entities??[])if("light"===s.type&&(t.includes(s.channel)||i.includes(s.name))){o=s.channel;break}}if(n&&o||console.warn("[smartvanio] Could not resolve device/channel for",t,"haDeviceId=",e,"deviceId=",n,"knownDevices=",this._knownDevices),n&&o){const e={max_leds:a||0,segments:(r??[]).map(e=>({id:e.id||`seg_${e.start}_${e.end}`,name:e.name||`Segment ${e.start}-${e.end}`,start:e.start,end:e.end,r:e.r??255,g:e.g??255,b:e.b??255,brightness:e.brightness??100,parent_entity_id:t}))};await this.hass.callService("mqtt","publish",{topic:`smartvanio/${n}/light/${o}/segments`,payload:JSON.stringify(e),retain:!0}),this._initialSegments=(r??[]).map(t=>({...t})),this._lightSegments=(r??[]).map(t=>({...t})),this._restoreOnCancel();const i=new Set((r??[]).map(t=>t.id||`seg_${t.start}_${t.end}`));for(const t of this._originalSegments??[])if(!i.has(t.id))try{await this.hass.callWS({type:"config/entity_registry/remove",entity_id:t.entity_id})}catch(e){console.warn("[smartvanio] Failed to remove segment entity",t.entity_id,e)}}}this._editingEntity=null}catch(t){this._saveError="Save failed: "+(t.message||t.error||JSON.stringify(t))}finally{this._editSaving=!1}}_toggleSection(t){this._openSections={...this._openSections,[t]:!this._openSections[t]}}_bri(t){const e=this._dragState.get(t);if(e?.active)return e.brightness;const i=parseFloat(localStorage.getItem(`smartvanio_bri_${t}`));if(!isNaN(i))return i;const s=this.hass.states[t];return s?.attributes?.brightness??s?.attributes?.last_brightness??255}_toggleLight(t){this.hass.callService("light","toggle",{entity_id:t})}_setBri(t,e){this.hass.callService("light","turn_on",{entity_id:t,brightness:Math.round(e)})}_onClimatePointerDown(t,e){const i=this.shadowRoot.querySelector(".climate-svg");if(!i)return;const s=i.getBoundingClientRect(),r=200/s.width,a=(t.clientX-s.left)*r,n=(t.clientY-s.top)*r,o=a-Kn,l=n-Jn;if(Math.abs(Math.sqrt(o*o+l*l)-62)>20)return;t.preventDefault(),this._climateDragging=!0,this._climateTargetEid=e,this._swiperInstance&&(this._swiperInstance.allowTouchMove=!1),this._climateSvgRect=s;const d=e?this.hass.states[e]:null;this._climateTempMin=parseFloat(d?.attributes?.min??0),this._climateTempMax=parseFloat(d?.attributes?.max??30),this._climateTempStep=parseFloat(d?.attributes?.step??1),window.addEventListener("pointermove",this._cmMove),window.addEventListener("pointerup",this._cmUp)}_onClimatePointerMove(t){if(!this._climateDragging)return;const e=this._climateSvgRect,i=200/e.width,s=(t.clientX-e.left)*i,r=(t.clientY-e.top)*i,a=s-Kn,n=r-Jn;let o=180*Math.atan2(n,a)/Math.PI;o<0&&(o+=360);let l=o-Zn;l<0&&(l+=360),l>Qn&&(l=l>315?0:Qn);const d=this._climateTempMin??0,c=this._climateTempMax??30,p=this._climateTempStep??1,h=d+l/Qn*(c-d);this._pendingTargetTemp=Math.round(h/p)*p}_onClimatePointerUp(){this._climateDragging&&(this._climateDragging=!1,null!==this._pendingTargetTemp&&this._climateTargetEid&&this.hass.callService("number","set_value",{entity_id:this._climateTargetEid,value:this._pendingTargetTemp}),this._pendingTargetTemp=null,this._swiperInstance&&(this._swiperInstance.allowTouchMove=!0),window.removeEventListener("pointermove",this._cmMove),window.removeEventListener("pointerup",this._cmUp))}async _loadSceneConfigs(){this._sceneConfigsLoaded=!0;const t=Object.entries(this.hass.states??{}).filter(([t])=>t.startsWith("scene.")),e={};for(const[i,s]of t){const t=s.attributes?.id;if(t)try{const s=await this.hass.callApi("GET",`config/scene/config/${t}`);e[i]=s}catch(t){}}this._sceneConfigs=e,this.requestUpdate()}_resolveEntityTopic(t){const e=this.hass.entities?.[t]?.unique_id;if(e){const t=e.match(/^(smartvanio-[^_]+-[^_]+)_(.+)$/);if(t)return{deviceId:t[1],channel:t[2]}}const i=t.replace(/^light\./,"").match(/^(smartvanio_[a-z]+_[a-f0-9]+)_(.+)$/);if(!i)return null;return{deviceId:i[1].replace(/_/g,"-"),channel:i[2]}}_getSceneColors(t){const e=this._sceneConfigs[t];if(!e?.entities)return[];const i=[];for(const[t,s]of Object.entries(e.entities))if("on"===s.state){if(s.effect){const e=this._getEntityPatterns(t)[s.effect];if(e?.length){for(const t of e)i.push([t.r,t.g,t.b]);continue}}s.rgb_color&&i.push(s.rgb_color)}return i}_isSceneActive(t){const e=this._sceneConfigs[t];if(!e?.entities)return!1;const i=Object.entries(e.entities).filter(([t])=>t.startsWith("light."));if(!i.length)return!1;for(const[t,e]of i){const i=this.hass.states[t];if(!i)return!1;if("on"===e.state){if("on"!==i.state)return!1;if(e.rgb_color&&i.attributes?.rgb_color){const[t,s,r]=e.rgb_color,[a,n,o]=i.attributes.rgb_color;if(Math.abs(t-a)+Math.abs(s-n)+Math.abs(r-o)>60)return!1}if(null!=e.brightness&&null!=i.attributes?.brightness&&Math.abs(e.brightness-i.attributes.brightness)>30)return!1}else if("off"!==i.state)return!1}return!0}_sceneCardGradient(t){if(!this._isSceneActive(t))return"linear-gradient(135deg, var(--sv-bg-elevated), var(--sv-bg-surface))";const e=this._getSceneColors(t);if(!e.length)return"linear-gradient(135deg, var(--sv-bg-elevated), var(--sv-bg-surface))";const i=e.map(([t,e,i])=>`rgb(${Math.round(.45*t)},${Math.round(.45*e)},${Math.round(.45*i)})`);return 1===i.length?`linear-gradient(135deg, ${i[0]}, var(--sv-bg-surface))`:`linear-gradient(135deg, ${i.join(", ")})`}_renderSceneCarousel(){let t=Object.entries(this.hass.states??{}).filter(([t])=>t.startsWith("scene.")).map(([t,e])=>({eid:t,state:e}));const e=this._resolveSlots()??{},i=this._layoutMode?this._layoutHiddenScenes:new Set(e.hiddenScenes??[]);if(this._layoutMode)this._syncOrder(this._layoutSceneOrder,t.map(t=>t.eid)),t.sort((t,e)=>this._layoutSceneOrder.indexOf(t.eid)-this._layoutSceneOrder.indexOf(e.eid));else{const i=e.sceneOrder??[];if(i.length){const e=new Map(i.map((t,e)=>[t,e]));t.sort((t,i)=>(e.get(t.eid)??999)-(e.get(i.eid)??999))}}const s=this._layoutMode?t:t.filter(t=>!i.has(t.eid));return j`
      <div class="sc-hero">
        <h2 class="sc-label">Quick Scenes</h2>
        <div class="sc-carousel ${this._layoutMode?"layout-mode":""}">
          ${s.map(({eid:t,state:e},s)=>{const r=this._sceneCardGradient(t),a=i.has(t),n=this._getSceneColors(t),o=this._isSceneActive(t);return this._layoutMode?j`
                <div class="sc-card layout-item ${a?"hidden-item":""}" style="background:${r}"
                     @pointerdown=${t=>this._onLayoutPointerDown("scene",s,t)}
                     @pointermove=${t=>this._onLayoutPointerMove(t)}
                     @pointerup=${t=>this._onLayoutPointerUp(t)}>
                  <div class="layout-overlay" style="justify-content:flex-end">
                    <span class="layout-touch" style="padding:2px 4px;min-width:unset;min-height:unset"
                      @pointerdown=${t=>t.stopPropagation()}
                      @click=${e=>{e.stopPropagation(),this._toggleLayoutHidden("scene",t)}}>
                      <ha-icon class="layout-eye" icon="${a?"mdi:eye-off":"mdi:eye"}" style="--mdc-icon-size:16px"></ha-icon>
                    </span>
                  </div>
                  <ha-icon class="sc-card-icon" icon="${t.startsWith("script.")?"mdi:script-text":"mdi:palette"}" style="--mdc-icon-size:28px"></ha-icon>
                  <span class="sc-card-name">${this._label(t)}</span>
                  ${n.length?j`
                    <div class="sc-dots">
                      ${n.map(([t,e,i])=>j`<span class="sc-dot" style="background:rgb(${t},${e},${i})"></span>`)}
                    </div>
                  `:""}
                </div>
              `:j`
              <div class="sc-card ${o?"active":""}" style="background:${r}"
                   @click=${()=>this._triggerScene(t)}
                   @contextmenu=${e=>{e.preventDefault(),this._openSceneModal(t)}}
                   @pointerdown=${e=>{this._sceneLpTimer=setTimeout(()=>{this._sceneLpTimer=null,this._openSceneModal(t)},500)}}
                   @pointerup=${()=>{this._sceneLpTimer&&clearTimeout(this._sceneLpTimer)}}
                   @pointerleave=${()=>{this._sceneLpTimer&&clearTimeout(this._sceneLpTimer)}}>
                <ha-icon class="sc-card-icon" icon="${t.startsWith("script.")?"mdi:script-text":"mdi:palette"}" style="--mdc-icon-size:28px"></ha-icon>
                <span class="sc-card-name">${this._label(t)}</span>
                ${n.length?j`
                  <div class="sc-dots">
                    ${n.map(([t,e,i])=>j`
                      <span class="sc-dot" style="background:rgb(${t},${e},${i})"></span>
                    `)}
                  </div>
                `:""}
              </div>
            `})}
          ${this._layoutMode?"":j`
            <div class="sc-card sc-card-add" @click=${()=>this._openNewSceneModal()}>
              <ha-icon icon="mdi:plus" style="--mdc-icon-size:28px; color:var(--sv-text-secondary)"></ha-icon>
              <span class="sc-card-name" style="color:var(--sv-text-secondary)">Add Scene</span>
            </div>
          `}
        </div>
      </div>
    `}_renderLightsPanel(t){const e=this._resolveSlots()??{},i=this._layoutMode?this._layoutHiddenLights:new Set(e.hiddenLights??[]);let s=[...t];if(this._layoutMode)this._syncOrder(this._layoutLightOrder,s.map(t=>t.eid)),s.sort((t,e)=>this._layoutLightOrder.indexOf(t.eid)-this._layoutLightOrder.indexOf(e.eid));else{const t=e.lightOrder??[];if(t.length){const e=new Map(t.map((t,e)=>[t,e]));s.sort((t,i)=>(e.get(t.eid)??999)-(e.get(i.eid)??999))}s=s.filter(t=>!i.has(t.eid))}const r=s.filter(t=>"on"===t.state?.state).length;return j`
      <div class="lp-panel">
        <h3 class="lp-label">Lights <span class="lp-count">${r} / ${s.length}</span></h3>
        <div class="lp-list">
          ${s.map(({eid:t,state:e,_slotName:s},r)=>{const a="on"===e?.state,n=!e||"unavailable"===e.state||"unknown"===e.state,o=a?Math.round((e?.attributes?.brightness??255)/2.55):0,l=s||this._label(t),d=this._lightIcon(t),c=!!e?.attributes?.smartvanio_parent_entity_id,p=!c&&/strip/i.test(t),h=c?"Segment":p?"Strip":"";e?.attributes?.supported_color_modes?.some(t=>"rgb"===t||"hs"===t||"xy"===t);const u=e?.attributes?.rgb_color,g=i.has(t);if(this._layoutMode){const e=this._isSmartvanioLight(t);return j`
                <div class="lp-row layout-item ${a?"on":""} ${n?"unavail":""} ${g?"hidden-item":""}"
                     @pointerdown=${t=>this._onLayoutPointerDown("light",r,t)}
                     @pointermove=${t=>this._onLayoutPointerMove(t)}
                     @pointerup=${t=>this._onLayoutPointerUp(t)}>
                  <ha-icon class="layout-drag" icon="mdi:drag-vertical" style="--mdc-icon-size:20px"></ha-icon>
                  <ha-icon class="lp-icon" icon="${d}"
                    style="--mdc-icon-size:20px; opacity:${n?.25:a?1:.55}; color:${n?"var(--sv-red)":a&&u?`rgb(${u.join(",")})`:a?"var(--sv-accent)":"var(--sv-text-secondary)"}"></ha-icon>
                  <div class="lp-info">
                    <span class="lp-name"><span class="lp-name-text">${l}</span>${h?j`<span class="lp-type">${h}</span>`:""}${e?"":j`<span class="lp-type">External</span>`}</span>
                    <span class="lp-bri">${n?"Unavailable":a?o+"%":"Off"}</span>
                  </div>
                  ${e?"":j`
                    <span class="layout-touch"
                      @pointerdown=${t=>t.stopPropagation()}
                      @click=${e=>{e.stopPropagation(),this._removeLightFromSlots(t)}}>
                      <ha-icon class="layout-del" icon="mdi:delete-outline" style="--mdc-icon-size:18px; color:var(--sv-red)"></ha-icon>
                    </span>
                  `}
                  <span class="layout-touch"
                    @pointerdown=${t=>t.stopPropagation()}
                    @click=${e=>{e.stopPropagation(),this._toggleLayoutHidden("light",t)}}>
                    <ha-icon class="layout-eye" icon="${g?"mdi:eye-off":"mdi:eye"}" style="--mdc-icon-size:18px"></ha-icon>
                  </span>
                </div>
              `}const m=c?e?.attributes?.smartvanio_parent_entity_id??t:t,v=this._getActivePatternName(t),f=v?this._getEntityPatterns(t)?.[v]??null:null,b=f?.length?`rgb(${f[0].r},${f[0].g},${f[0].b})`:null,x=n?"var(--sv-red)":a&&b?b:a&&u?`rgb(${u.join(",")})`:a?"var(--sv-accent)":"var(--sv-text-secondary)";return j`
              <div class="lp-row ${a?"on":""} ${n?"unavail":""}"
                   @pointerdown=${()=>{this._lightLpFired=!1,this._lightLpTimer=setTimeout(()=>{this._lightLpTimer=null,this._lightLpFired=!0,this._openEditModal(m)},500)}}
                   @pointerup=${()=>{this._lightLpTimer&&(clearTimeout(this._lightLpTimer),this._lightLpTimer=null)}}
                   @pointerleave=${()=>{this._lightLpTimer&&(clearTimeout(this._lightLpTimer),this._lightLpTimer=null)}}
                   @pointercancel=${()=>{this._lightLpTimer&&(clearTimeout(this._lightLpTimer),this._lightLpTimer=null),this._lightLpFired=!1}}>
                <div class="lp-header" @click=${()=>{this._lightLpFired?this._lightLpFired=!1:n||this._toggleLight(t)}}>
                  <ha-icon class="lp-icon" icon="${d}"
                    style="--mdc-icon-size:30px; opacity:${n?.25:a?1:.55}; color:${x}"></ha-icon>
                  <div class="lp-info">
                    <span class="lp-name"><span class="lp-name-text">${l}</span>${h?j`<span class="lp-type">${h}</span>`:""}</span>
                    <span class="lp-bri">${n?"Unavailable":a?o+"%":"Off"}</span>
                  </div>
                  <button class="lp-power" @click=${e=>{e.stopPropagation(),n||this._toggleLight(t)}}
                    style="color:${a?"var(--sv-accent)":"var(--sv-text-disabled)"}">
                    <ha-icon icon="mdi:power" style="--mdc-icon-size:26px"></ha-icon>
                  </button>
                </div>
              </div>
            `})}
          ${this._layoutMode?j`
            <div class="lp-add-btn" @click=${()=>this._openAddLightModal()}>
              <ha-icon icon="mdi:plus" style="--mdc-icon-size:16px"></ha-icon>
              <span>Add Light</span>
            </div>
          `:""}
        </div>
      </div>
    `}_openAddLightModal(){this._lightModal={item:{entity:"",name:""},isNew:!0}}_saveLightModal(){const t=this._lightModal;if(!t||!t.item.entity)return;const e={...this._cardConfig?.slots??{}},i=[...e.lights??[]];i.some(e=>e.entity===t.item.entity)||(i.push({entity:t.item.entity,name:t.item.name||""}),e.lights=i,this._cardConfig={...this._cardConfig,slots:e},this._saveMqttConfig(),this._layoutLightOrder.includes(t.item.entity)||this._layoutLightOrder.push(t.item.entity)),this._lightModal=null}_cancelLightModal(){this._lightModal=null}_toggleLight(t){"on"===this.hass.states[t]?.state?this.hass.callService("light","turn_off",{entity_id:t}):this.hass.callService("light","turn_on",{entity_id:t})}_getActivePatternName(t){const e=this._activePatterns?.get(t);if(e)return e;const i=this.hass?.states?.[t]?.attributes,s=i?.smartvanio_effect||i?.effect;return s&&"None"!==s?s:null}_applyPattern(t,e,i){const s=this._resolveEntityTopic(t);if(!s||!i?.length)return;const r=s.channel.replace(/_seg_.*$/,""),a=`${s.deviceId}/light/${r}/pattern_set`;this.hass.callService("mqtt","publish",{topic:a,payload:JSON.stringify({stops:i})}),this.hass.callService("light","turn_on",{entity_id:t,effect:e}),this._activePatterns||(this._activePatterns=new Map),this._activePatterns.set(t,e)}_clearPattern(t){const e=this._resolveEntityTopic(t);if(!e)return;const i=e.channel.replace(/_seg_.*$/,""),s=`${e.deviceId}/light/${i}/pattern_set`;this.hass.callService("mqtt","publish",{topic:s,payload:JSON.stringify({stops:[]})}),this.hass.callService("light","turn_on",{entity_id:t,effect:"None"}),this._activePatterns?.delete(t)}_resolveSegmentTopic(){const t=this._editingEntity;if(!t)return null;const e=this.hass.entities?.[t]?.device_id,i=e?this.hass.devices?.[e]:null,s=i?.identifiers?.find(([t])=>"smartvanio"===t),r=s?.[1]??"";let a="";if(r&&this._knownDevices[r]){const e=this._knownDevices[r],i=this.hass.states[t]?.attributes?.friendly_name??"";for(const s of e.entities??[])if("light"===s.type&&(t.includes(s.channel)||i.includes(s.name))){a=s.channel;break}}return r&&a?{deviceId:r,channel:a}:null}_sendSegmentsToStrip(t){const e=this._resolveSegmentTopic();if(!e)return;const{deviceId:i,channel:s}=e;this.hass.callService("mqtt","publish",{topic:`${i}/light/${s}/command`,payload:JSON.stringify({state:"ON"})}),t.forEach((t,e)=>{this.hass.callService("mqtt","publish",{topic:`${i}/light/${s}/segment_set`,payload:JSON.stringify({id:e,state:"ON",segment:{start:t.start,end:t.end},color:{r:t.r,g:t.g,b:t.b},brightness:Math.round(2.55*(t.brightness??100))})})})}_sendSegmentPreview(){const t=this._resolveSegmentTopic();if(!t)return void console.warn("[smartvanio] segment preview: no topic resolved for",this._editingEntity);const e=this._editingEntity,i=e?this.hass.states[e]:null;i&&"on"!==i.state&&(this._previewTurnedOn=!0),this._patternPreviewActive=!0;const s=this._segmentsToPatternStops(this._lightSegments),r=`${t.deviceId}/light/${t.channel}/pattern_set`,a=JSON.stringify({stops:s});this.hass.callService("mqtt","publish",{topic:r,payload:a})}_segmentsToPatternStops(t){const e=[],i=[...t??[]].sort((t,e)=>t.start-e.start);for(let t=0;t<i.length;t++){const s=i[t],r=(s.brightness??100)/100,a=Math.round((s.r??255)*r),n=Math.round((s.g??255)*r),o=Math.round((s.b??255)*r);s.start>0&&(0===t||i[t-1].end<s.start-1)&&e.push({pos:s.start>0?s.start-1:0,r:0,g:0,b:0,brightness:100}),e.push({pos:s.start,r:a,g:n,b:o,brightness:100}),e.push({pos:s.end,r:a,g:n,b:o,brightness:100}),(t===i.length-1||i[t+1].start>s.end+1)&&e.push({pos:s.end+1,r:0,g:0,b:0,brightness:100})}return e}_restoreOnCancel(){const t=this._editingEntity,e=this._modalOpenState,i=this._resolveSegmentTopic();if(!e)return this._patternPreviewActive=!1,void(this._previewTurnedOn=!1);const s=this._initialSegments&&JSON.stringify(this._lightSegments)!==JSON.stringify(this._initialSegments);if(this._patternPreviewActive||this._previewTurnedOn||s||this._stripTouched){if(i&&this.hass.callService("mqtt","publish",{topic:`${i.deviceId}/light/${i.channel}/pattern_set`,payload:JSON.stringify({stops:[]})}),this._patternPreviewActive=!1,t)if("off"===e.state)this.hass.callService("light","turn_off",{entity_id:t}),this._activePatterns?.delete(t);else if(e.effect){const i=this._getEntityPatterns(t),s=i?.[e.effect];s&&this._applyPattern(t,e.effect,s),null!=e.brightness&&this.hass.callService("light","turn_on",{entity_id:t,brightness:e.brightness})}else{const i={entity_id:t,effect:"None"};e.rgb_color&&(i.rgb_color=e.rgb_color),null!=e.brightness&&(i.brightness=e.brightness),this.hass.callService("light","turn_on",i),this._activePatterns?.delete(t)}s&&i&&this._sendSegmentsToStrip(this._initialSegments),this._modalOpenState=null,this._previewTurnedOn=!1}else this._modalOpenState=null}_sendPatternPreview(t){const e=this._resolveSegmentTopic();e&&(this._patternPreviewActive=!0,this.hass.callService("mqtt","publish",{topic:`${e.deviceId}/light/${e.channel}/pattern_set`,payload:JSON.stringify({stops:t})}))}_savePattern(t,e){const i=this._editingEntity,s=this._resolveSegmentTopic();if(!s)return;const r={...this._lightPatterns??{}};r[t]=e,this._lightPatterns=r,this.hass.callService("mqtt","publish",{topic:`smartvanio/${s.deviceId}/light/${s.channel}/patterns`,payload:JSON.stringify(r),retain:!0}),i&&(this._applyPattern(i,t,e),this._modalOpenState={state:"on",brightness:this.hass.states[i]?.attributes?.brightness,rgb_color:null,effect:t})}_deletePattern(t){const e=this._resolveSegmentTopic();if(!e)return;const i={...this._lightPatterns??{}};delete i[t],this._lightPatterns=i,this.hass.callService("mqtt","publish",{topic:`smartvanio/${e.deviceId}/light/${e.channel}/patterns`,payload:JSON.stringify(i),retain:!0})}_removeLightFromSlots(t){const e={...this._cardConfig?.slots??{}};e.lights=(e.lights??[]).filter(e=>e.entity!==t),this._cardConfig={...this._cardConfig,slots:e},this._saveMqttConfig(),this._layoutLightOrder=this._layoutLightOrder.filter(e=>e!==t),this._layoutHiddenLights.delete(t),this.requestUpdate()}_isSmartvanioLight(t){const e=this.hass?.entities?.[t]?.device_id;if(!e)return!1;const i=this.hass?.devices?.[e];return i?.identifiers?.some(([t])=>"smartvanio"===t)??!1}_renderLightModal(){const t=this._lightModal;return t?j`
      <div class="fm-overlay" @click=${t=>{t.target===t.currentTarget&&this._cancelLightModal()}}>
        <div class="fm-modal">
          <div class="fm-header">
            <span>Add Light</span>
            <button class="fm-close" @click=${()=>this._cancelLightModal()}>
              <ha-icon icon="mdi:close" style="--mdc-icon-size:16px"></ha-icon>
            </button>
          </div>
          <div class="fm-body">
            <div class="fm-field">
              <label class="fm-label">Entity</label>
              ${this._entitySelect(["light"],t.item.entity,e=>{this._lightModal={...t,item:{...t.item,entity:e}}})}
            </div>
            <div class="fm-field">
              <label class="fm-label">Label (optional)</label>
              <input class="fm-input" type="text" placeholder="e.g. Kitchen Light"
                .value=${t.item.name??""}
                @input=${e=>{this._lightModal={...t,item:{...t.item,name:e.target.value}}}} />
            </div>
          </div>
          <div class="fm-footer">
            <button class="fm-btn cancel" @click=${()=>this._cancelLightModal()}>Cancel</button>
            <button class="fm-btn save" ?disabled=${!t.item.entity} @click=${()=>this._saveLightModal()}>Add</button>
          </div>
        </div>
      </div>
    `:""}_renderRightPanel(t,e,i){return j`
      <div class="rp-swiper swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="rp-page">${this._renderClimatePanel(t,e)}</div>
          </div>
          <div class="swiper-slide">
            <div class="rp-page">${this._renderLevelPanel(i)}</div>
          </div>
          <div class="swiper-slide">
            <div class="rp-page">${this._renderOverviewPanel(t,e)}</div>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    `}_initSwiper(){if(this._swiperInstance)return;const t=this.renderRoot?.querySelector(".rp-swiper");t&&(this._swiperInstance=new Wn(t,{modules:[Yn],slidesPerView:1,speed:400,pagination:{el:t.querySelector(".swiper-pagination"),clickable:!0}}))}_destroySwiper(){this._swiperInstance&&(this._swiperInstance.destroy(!0,!0),this._swiperInstance=null)}_getTankData(t,e){const{sensors:i}=t,s=t=>i.find(({eid:e})=>t.test(e))?.eid,r=new Set((e?.resources??[]).map(t=>t.entity)),a=[{eid:s(/water_tank$/),label:"Water",icon:"mdi:water",color:"var(--sv-accent)"},{eid:s(/gas_tank$/),label:"Gas",icon:"mdi:gas-cylinder",color:"var(--sv-amber)"},{eid:s(/waste_tank$/),label:"Waste",icon:"mdi:delete-empty",color:"var(--sv-red)"}].filter(({eid:t})=>t&&!r.has(t)),n=(e?.resources??[]).map(({entity:t,name:e,color:i,icon:s})=>({eid:t,slotName:e,icon:s||"mdi:gauge",color:i??"var(--sv-accent)"}));return[...n,...a].map(t=>({...t,label:t.slotName||this._label(t.eid)||t.label,value:Math.max(0,Math.min(100,parseFloat(this.hass.states[t.eid]?.state)||0))}))}_openFooterModal(t,e){const i=this._setupMode?this._pendingSlots:this._resolveSlots(),s=i?.[t]??[];if(e>=s.length)return;const r=s[e],a="resources"===t?"tank":"switch";this._footerModal={key:t,idx:e,item:{...r},type:a}}_openNewFooterModal(t){const e={power:{key:"power",item:{soc:"",voltage:"",current:"",time_left:""}},tank:{key:"resources",item:{entity:"",name:"",color:"#4a9eff",icon:"mdi:gauge"}},switch:{key:"footerSwitches",item:{entity:"",name:"",color:"",icon:""}},stat:{key:"topbarStats",item:{entity:"",name:"",color:"",icon:""}}},i=e[t]??e.switch;this._footerModal={key:i.key,item:i.item,type:t,isNew:!0},this._footerAddMenu=!1}async _openEditFooterModal(t,e){if("power"===t){const t=this._pendingSlots??this._resolveSlots(),e=t?.power;if(!e)return;return void(this._footerModal={key:"power",item:{soc:e.soc??"",voltage:e.voltage??"",current:e.current??"",time_left:e.time_left??""},type:"power",isNew:!1})}const i=this._pendingSlots??this._resolveSlots(),s=i?.[t]??[];if(e>=s.length)return;const r="resources"===t?"tank":"topbarStats"===t?"stat":"switch",a={key:t,idx:e,item:{...s[e]},type:r,isNew:!1,autoRows:[],autoOrigIds:{}};if("switch"===r&&a.item.entity)try{const t=[],e={},i=a.item.entity,s=Object.entries(this.hass?.states??{}).filter(([t,e])=>t.startsWith("automation.")&&e.attributes?.friendly_name?.startsWith("[VanCtl]"));for(const[r,a]of s)try{const s=this.hass.entities?.[r]?.unique_id||a.attributes?.id;if(!s)continue;const n=await this.hass.callApi("GET",`config/automation/config/${s}`),o=JSON.parse(n.description??"{}");if(!o.smartvanio)continue;o.entity_id!==i&&o.target_entity_id!==i||(t.push({id:s,source_entity_id:o.entity_id??"",gesture:o.gesture??o.event??"",target_entity_id:o.target_entity_id??"",action:o.action??"",duration:o.duration??"",brightness_pct:o.brightness_pct??"",threshold:o.threshold??""}),e[s]=s)}catch{}if(!t.length){const e=i.split(".")[0];t.push({id:null,source_entity_id:i,gesture:"switch"===e?"off_to_on":"press",target_entity_id:"",action:"",duration:"",brightness_pct:""})}a.autoRows=t,a.autoOrigIds=e}catch{}this._footerModal=a}_saveFooterModal(){const t=this._footerModal;if(t){if("power"===t.type){const e={};if(t.item.soc&&(e.soc=t.item.soc),t.item.voltage&&(e.voltage=t.item.voltage),t.item.current&&(e.current=t.item.current),t.item.time_left&&(e.time_left=t.item.time_left),!Object.keys(e).length)return;return this._setPS("power",e),void(this._footerModal=null)}t.item.entity&&(t.isNew?this._addPSItem(t.key,t.item):(this._updatePSItem(t.key,t.idx,"entity",t.item.entity),this._updatePSItem(t.key,t.idx,"name",t.item.name),void 0!==t.item.color&&this._updatePSItem(t.key,t.idx,"color",t.item.color),void 0!==t.item.icon&&this._updatePSItem(t.key,t.idx,"icon",t.item.icon)),"switch"===t.type&&t.autoRows?.length&&t.item.entity&&this._saveEdit({entity_id:t.item.entity,name:this._label(t.item.entity),area:"",rows:t.autoRows,lightSegments:[],maxLeds:0}).catch(()=>{}),this._footerModal=null)}}_cancelFooterModal(){this._footerModal=null}_renderFooter(t,e){const i=this._getTankData(t,e),s=e?.power;let r=null,a=null,n=null,o="var(--sv-text-secondary)",l=!1;const d=t=>{const e=t?this.hass.states[t]:null;return e&&"unavailable"!==e.state&&"unknown"!==e.state?parseFloat(e.state):null};if(s)r=d(s.soc),a=d(s.voltage),d(s.current),d(s.time_left),n=null!==r?Math.max(0,Math.min(100,r)):null!==a?Math.max(0,Math.min(100,(a-11.5)/1.7*100)):null,o=null===n?"var(--sv-text-secondary)":n>50?"var(--sv-green)":n>20?"var(--sv-amber)":"var(--sv-red)",l=null===n;else{const e=t.sensors.find(({eid:t})=>/battery/.test(t))?.eid;e&&(a=d(e),l=null===a,n=null!==a?Math.max(0,Math.min(100,(a-11.5)/1.7*100)):null,o=null===a?"var(--sv-text-secondary)":n>50?"var(--sv-green)":n>20?"var(--sv-amber)":"var(--sv-red)")}const c=s||null!==a,p=(e?.footerSwitches??[]).map(({entity:t,name:e,icon:i,color:s},r)=>({eid:t,name:e||this._label(t),icon:i||null,color:s||null,idx:r}));return j`
      <div class="ft-bar">
        <div class="ft-tanks">
          ${i.map((t,e)=>{const i=!this.hass.states[t.eid]||"unavailable"===this.hass.states[t.eid]?.state;return j`
              <div class="ft-tank ${i?"unavail":""} ${this._setupMode?"setup":""}"
                   @click=${()=>{this._setupMode&&this._openEditFooterModal("resources",e)}}
                   @pointerdown=${e=>{this._setupMode||(this._tankLpTimer=setTimeout(()=>{this._tankLpTimer=null,this._openEditModal(t.eid)},500))}}
                   @pointerup=${()=>{this._tankLpTimer&&clearTimeout(this._tankLpTimer)}}
                   @pointerleave=${()=>{this._tankLpTimer&&clearTimeout(this._tankLpTimer)}}>
                <div class="ft-tank-top">
                  <ha-icon icon="${t.icon}" style="--mdc-icon-size:32px; color:${i?"var(--sv-red)":t.color}"></ha-icon>
                  <div class="ft-tank-text">
                    <span class="ft-tank-label">${t.label}</span>
                    <span class="ft-tank-pct" style="color:${i?"var(--sv-red)":t.color}">${i?"—":Math.round(t.value)+"%"}</span>
                  </div>
                </div>
                <div class="ft-tank-bar">
                  <div class="ft-tank-fill" style="width:${i?0:t.value.toFixed(0)}%;background:${t.color}"></div>
                </div>
              </div>
            `})}
          ${c?j`
            <div class="ft-tank ${l?"unavail":""} ${this._setupMode&&s?"setup":""}"
                 @click=${()=>{this._setupMode&&s&&this._openEditFooterModal("power")}}
                 @pointerdown=${t=>{if(this._setupMode)return;const e=s?.soc,i=s?.voltage,r=e||i;r&&(this._tankLpTimer=setTimeout(()=>{this._tankLpTimer=null,this._openEditModal(r)},500))}}
                 @pointerup=${()=>{this._tankLpTimer&&clearTimeout(this._tankLpTimer)}}
                 @pointerleave=${()=>{this._tankLpTimer&&clearTimeout(this._tankLpTimer)}}>
              <div class="ft-tank-top">
                <ha-icon icon="mdi:battery" style="--mdc-icon-size:32px; color:${l?"var(--sv-red)":o}"></ha-icon>
                <div class="ft-tank-text">
                  <span class="ft-tank-label">Battery</span>
                  <span class="ft-tank-pct" style="color:${l?"var(--sv-red)":o}">${l?"—":null!==n?Math.round(n)+"%":"—"}${null!==a?j`<span class="ft-tank-sub">${a.toFixed(1)}V</span>`:""}</span>
                </div>
              </div>
              <div class="ft-tank-bar">
                <div class="ft-tank-fill" style="width:${l?0:(n??0).toFixed(0)}%;background:${o}"></div>
              </div>
            </div>
          `:""}
          ${this._setupMode?j`
            <div class="ft-add-wrap">
              <div class="ft-tank-add" @click=${()=>{this._footerAddMenu=!this._footerAddMenu}}>
                <ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon>
              </div>
              ${this._footerAddMenu?j`
                <div class="ft-add-backdrop" @click=${()=>{this._footerAddMenu=!1}}></div>
                <div class="ft-add-menu">
                  <div class="ft-add-menu-item" @click=${()=>this._openNewFooterModal("tank")}>
                    <ha-icon icon="mdi:gauge" style="--mdc-icon-size:16px"></ha-icon>
                    <span>Tank</span>
                  </div>
                  <div class="ft-add-menu-item" @click=${()=>this._openNewFooterModal("power")}>
                    <ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:16px"></ha-icon>
                    <span>Power</span>
                  </div>
                </div>
              `:""}
            </div>
          `:""}
        </div>
        <div class="ft-right">
          ${p.map(({eid:t,name:e,icon:i,color:s,idx:r})=>{const a=this.hass.states[t],n=!a||"unavailable"===a.state||"unknown"===a.state;return j`
              <div class="ft-sw ${"on"===a?.state?"on":""} ${n?"unavail":""} ${this._setupMode?"setup":""} ${i&&!this._setupMode?"icon-only":""}"
                   style="${s?`--ft-sw-color:${s}`:""}"
                   title="${e}${n&&!this._setupMode?" (offline)":""}"
                   @click=${()=>this._setupMode?this._openEditFooterModal("footerSwitches",r):!n&&this._toggleSwitch(t)}>
                ${this._setupMode?j`<ha-icon icon="mdi:pencil" style="--mdc-icon-size:14px"></ha-icon><span>${e}</span>`:i?j`<ha-icon icon="${i}" style="--mdc-icon-size:24px"></ha-icon>`:j`<span class="ft-sw-toggle"><span class="ft-sw-knob"></span></span><span>${e}${n?" (offline)":""}</span>`}
              </div>
            `})}
          ${this._setupMode?j`
            <div class="ft-sw-add" @click=${()=>this._openNewFooterModal("switch")}>
              <ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon>
            </div>
          `:""}
          <button class="ft-ha-btn" title="Toggle Home Assistant UI"
            @click=${()=>this._toggleHaSidebar()}>
            <ha-icon icon="mdi:home-assistant" style="--mdc-icon-size:18px"></ha-icon>
          </button>
        </div>
      </div>

    `}_renderFooterModalFields(t){return j`
      <div class="fm-field">
        <label class="fm-label">Entity</label>
        <smartvanio-entity-picker .hass=${this.hass} .value=${t.item.entity??""}
          .domains=${["switch","light","script","button","input_boolean"]}
          placeholder="Select entity"
          @smartvanio-change=${e=>{this._footerModal={...t,item:{...t.item,entity:e.detail.value}}}}
        ></smartvanio-entity-picker>
      </div>
      <div class="fm-field">
        <label class="fm-label">Label</label>
        <input class="fm-input" type="text" placeholder="e.g. Water Pump"
          .value=${t.item.name??""}
          @input=${e=>{this._footerModal={...t,item:{...t.item,name:e.target.value}}}} />
      </div>
      <div class="fm-row">
        <div class="fm-field" style="flex:1">
          <label class="fm-label">Color</label>
          <input type="color" class="fm-color"
            .value=${t.item.color??""}
            @input=${e=>{this._footerModal={...t,item:{...t.item,color:e.target.value}}}} />
        </div>
        <div class="fm-field" style="flex:2">
          <label class="fm-label">Icon</label>
          <smartvanio-icon-picker .value=${t.item.icon??""}
            @smartvanio-change=${e=>{this._footerModal={...t,item:{...t.item,icon:e.detail.value}}}}
          ></smartvanio-icon-picker>
        </div>
      </div>
    `}_renderFooterModalAutomations(t){const e=t.autoRows??[],i=t.item.entity;return j`
      <div class="fm-auto-header">
        <span class="fm-label">Automations</span>
        <button class="add-row-btn" @click=${()=>{const s=i?.split(".")?.[0],r="binary_sensor"===s||"button"===s||"switch"===s;this._footerModal={...t,autoRows:[...e,{id:null,source_entity_id:r?i:"",gesture:r?"switch"===s?"off_to_on":"press":"",target_entity_id:r?"":i,action:"",duration:"",brightness_pct:""}]}}}>
          <ha-icon icon="mdi:plus"></ha-icon> Add
        </button>
      </div>
      ${e.length?e.map((i,s)=>j`
          <div class="fm-auto-row">
            <div class="auto-row-trigger">
              <span class="auto-row-label-text">Trigger</span>
              <smartvanio-entity-picker
                .hass=${this.hass}
                .value=${i.source_entity_id}
                .domains=${["binary_sensor","button","switch"]}
                placeholder="Select trigger…"
                @smartvanio-change=${i=>{const r=[...e];r[s]={...r[s],source_entity_id:i.detail.value},this._footerModal={...t,autoRows:r}}}
              ></smartvanio-entity-picker>
              <smartvanio-select
                .value=${i.gesture}
                .options=${this._eventsForSource(i.source_entity_id).map(t=>({value:t.value,label:t.label}))}
                placeholder="— event —"
                ?disabled=${!i.source_entity_id}
                @smartvanio-change=${i=>{const r=[...e];r[s]={...r[s],gesture:i.detail.value},this._footerModal={...t,autoRows:r}}}
              ></smartvanio-select>
            </div>
            <div class="auto-row-target">
              <span class="auto-row-label-text">Target</span>
              <smartvanio-entity-picker
                .hass=${this.hass}
                .value=${i.target_entity_id}
                .domains=${["light","switch","fan","scene","cover","lock"]}
                placeholder="Select target…"
                @smartvanio-change=${i=>{const r=[...e];r[s]={...r[s],target_entity_id:i.detail.value},this._footerModal={...t,autoRows:r}}}
              ></smartvanio-entity-picker>
            </div>
            <div class="auto-row-action">
              <span class="auto-row-label-text">Action</span>
              <smartvanio-select
                .value=${i.action}
                .options=${this._actionsForTarget(i.target_entity_id)}
                placeholder="— select —"
                ?disabled=${!i.target_entity_id}
                @smartvanio-change=${i=>{const r=[...e];r[s]={...r[s],action:i.detail.value},this._footerModal={...t,autoRows:r}}}
              ></smartvanio-select>
            </div>
            <button class="delete-row-btn" @click=${()=>{const i=[...e];i.splice(s,1),this._footerModal={...t,autoRows:i}}}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </button>
          </div>
        `):j`<div class="fm-auto-empty">No automations yet</div>`}
    `}_renderFooterModal(){const t=this._footerModal;if(!t)return"";const e=`${t.isNew?"Add":"Edit"} ${{power:"Power",tank:"Tank",switch:"Switch",stat:"Status"}[t.type]??"Item"}`,i="power"===t.type?!!(t.item.soc||t.item.voltage||t.item.current||t.item.time_left):!!t.item.entity,s="switch"===t.type&&!t.isNew;return j`
      <div class="fm-overlay" @click=${t=>{t.target===t.currentTarget&&this._cancelFooterModal()}}>
        <div class="fm-modal ${s?"fm-wide":""}">
          <div class="fm-header">
            <span>${e}</span>
            <button class="fm-close" @click=${()=>this._cancelFooterModal()}>
              <ha-icon icon="mdi:close" style="--mdc-icon-size:16px"></ha-icon>
            </button>
          </div>
          <div class="fm-body ${s?"fm-two-col":""}">
            ${s?j`
              <div class="fm-col-left">
                ${this._renderFooterModalFields(t)}
              </div>
              <div class="fm-col-right">
                ${this._renderFooterModalAutomations(t)}
              </div>
            `:"power"===t.type?j`
              <div class="fm-field">
                <label class="fm-label">State of Charge</label>
                <smartvanio-entity-picker .hass=${this.hass} .value=${t.item.soc??""}
                  .domains=${["sensor","number"]} placeholder="Select SoC entity"
                  @smartvanio-change=${e=>{this._footerModal={...t,item:{...t.item,soc:e.detail.value}}}}
                ></smartvanio-entity-picker>
              </div>
              <div class="fm-field">
                <label class="fm-label">Voltage</label>
                <smartvanio-entity-picker .hass=${this.hass} .value=${t.item.voltage??""}
                  .domains=${["sensor","number"]} placeholder="Select voltage entity"
                  @smartvanio-change=${e=>{this._footerModal={...t,item:{...t.item,voltage:e.detail.value}}}}
                ></smartvanio-entity-picker>
              </div>
              <div class="fm-field">
                <label class="fm-label">Current Consumption</label>
                <smartvanio-entity-picker .hass=${this.hass} .value=${t.item.current??""}
                  .domains=${["sensor","number"]} placeholder="Select current entity"
                  @smartvanio-change=${e=>{this._footerModal={...t,item:{...t.item,current:e.detail.value}}}}
                ></smartvanio-entity-picker>
              </div>
              <div class="fm-field">
                <label class="fm-label">Time Left</label>
                <smartvanio-entity-picker .hass=${this.hass} .value=${t.item.time_left??""}
                  .domains=${["sensor","number"]} placeholder="Select time remaining entity"
                  @smartvanio-change=${e=>{this._footerModal={...t,item:{...t.item,time_left:e.detail.value}}}}
                ></smartvanio-entity-picker>
              </div>
            `:"tank"===t.type?j`
              <div class="fm-field">
                <label class="fm-label">Entity</label>
                <smartvanio-entity-picker .hass=${this.hass} .value=${t.item.entity??""}
                  .domains=${["sensor","number"]} placeholder="Select tank sensor"
                  @smartvanio-change=${e=>{this._footerModal={...t,item:{...t.item,entity:e.detail.value}}}}
                ></smartvanio-entity-picker>
              </div>
              <div class="fm-field">
                <label class="fm-label">Label</label>
                <input class="fm-input" type="text" placeholder="e.g. Fresh Water"
                  .value=${t.item.name??""}
                  @input=${e=>{this._footerModal={...t,item:{...t.item,name:e.target.value}}}} />
              </div>
              <div class="fm-row">
                <div class="fm-field" style="flex:1">
                  <label class="fm-label">Color</label>
                  <input type="color" class="fm-color"
                    .value=${t.item.color??"#4a9eff"}
                    @input=${e=>{this._footerModal={...t,item:{...t.item,color:e.target.value}}}} />
                </div>
                <div class="fm-field" style="flex:2">
                  <label class="fm-label">Icon</label>
                  <smartvanio-icon-picker .value=${t.item.icon??""}
                    @smartvanio-change=${e=>{this._footerModal={...t,item:{...t.item,icon:e.detail.value}}}}
                  ></smartvanio-icon-picker>
                </div>
              </div>
            `:j`
              <div class="fm-field">
                <label class="fm-label">Entity</label>
                <smartvanio-entity-picker .hass=${this.hass} .value=${t.item.entity??""}
                  .domains=${"stat"===t.type?["sensor","number","binary_sensor"]:["switch","light","script","button","input_boolean"]}
                  placeholder="Select entity"
                  @smartvanio-change=${e=>{this._footerModal={...t,item:{...t.item,entity:e.detail.value}}}}
                ></smartvanio-entity-picker>
              </div>
              <div class="fm-field">
                <label class="fm-label">Label</label>
                <input class="fm-input" type="text" placeholder="${"stat"===t.type?"e.g. Temperature":"e.g. Water Pump"}"
                  .value=${t.item.name??""}
                  @input=${e=>{this._footerModal={...t,item:{...t.item,name:e.target.value}}}} />
              </div>
              ${"stat"===t.type?j`
                <div class="fm-field">
                  <label class="fm-label">Icon</label>
                  <smartvanio-icon-picker .value=${t.item.icon??""}
                    @smartvanio-change=${e=>{this._footerModal={...t,item:{...t.item,icon:e.detail.value}}}}
                  ></smartvanio-icon-picker>
                </div>
              `:j`
                <div class="fm-row">
                  <div class="fm-field" style="flex:1">
                    <label class="fm-label">Color</label>
                    <input type="color" class="fm-color"
                      .value=${t.item.color??""}
                      @input=${e=>{this._footerModal={...t,item:{...t.item,color:e.target.value}}}} />
                  </div>
                  <div class="fm-field" style="flex:2">
                    <label class="fm-label">Icon</label>
                    <smartvanio-icon-picker .value=${t.item.icon??""}
                      @smartvanio-change=${e=>{this._footerModal={...t,item:{...t.item,icon:e.detail.value}}}}
                    ></smartvanio-icon-picker>
                  </div>
                </div>
              `}
            `}
          </div>
          <div class="fm-footer">
            ${t.isNew?"":j`
              <button class="fm-btn delete" @click=${()=>{"power"===t.type?this._setPS("power",null):this._removePSItem(t.key,t.idx),this._footerModal=null}}>
                Delete
              </button>
            `}
            <button class="fm-btn cancel" @click=${()=>this._cancelFooterModal()}>Cancel</button>
            <button class="fm-btn save" ?disabled=${!i} @click=${()=>this._saveFooterModal()}>
              ${t.isNew?"Add":"Save"}
            </button>
          </div>
        </div>
      </div>
    `}_enterLayoutMode(){const t=this._resolveSlots()??{};this._layoutSceneOrder=[...t.sceneOrder??[]],this._layoutHiddenScenes=new Set(t.hiddenScenes??[]),this._layoutLightOrder=[...t.lightOrder??[]],this._layoutHiddenLights=new Set(t.hiddenLights??[]),this._layoutMode=!0,this._layoutDrag=null}_cancelLayoutMode(){this._layoutMode=!1,this._layoutDrag=null}_saveLayoutMode(){const t={...this._cardConfig?.slots??{}};t.sceneOrder=this._layoutSceneOrder,t.hiddenScenes=[...this._layoutHiddenScenes],t.lightOrder=this._layoutLightOrder,t.hiddenLights=[...this._layoutHiddenLights],this._cardConfig={...this._cardConfig,slots:t},this._saveMqttConfig(),this._layoutMode=!1,this._layoutDrag=null}_toggleLayoutHidden(t,e){const i="scene"===t?this._layoutHiddenScenes:this._layoutHiddenLights;i.has(e)?i.delete(e):i.add(e),this.requestUpdate()}_syncOrder(t,e){const i=new Set(t);for(let i=t.length-1;i>=0;i--)e.includes(t[i])||t.splice(i,1);for(const s of e)i.has(s)||t.push(s);return t}_layoutReorder(t,e,i){const s="scene"===t?this._layoutSceneOrder:this._layoutLightOrder;if(e===i||e<0||i<0||i>=s.length)return;const r="scene"===t?this.shadowRoot.querySelector(".sc-carousel"):this.shadowRoot.querySelector(".lp-list"),a=(r?[...r.querySelectorAll(".layout-item")]:[]).map(t=>t.getBoundingClientRect()),[n]=s.splice(e,1);s.splice(i,0,n),this.requestUpdate(),this.updateComplete.then(()=>{(r?[...r.querySelectorAll(".layout-item")]:[]).forEach((t,e)=>{if(!a[e])return;const i=t.getBoundingClientRect(),s=a[e].left-i.left,r=a[e].top-i.top;(Math.abs(s)>1||Math.abs(r)>1)&&va(t,{x:[s,0],y:[r,0]},{duration:.25,easing:"ease-out"})})})}_onLayoutPointerDown(t,e,i){if(0!==i.button&&"touch"!==i.pointerType)return;const s=i.currentTarget;s.setPointerCapture(i.pointerId),this._layoutDrag={type:t,idx:e,el:s,startX:i.clientX,startY:i.clientY,offsetX:0,offsetY:0,moved:!1},s.style.zIndex="10",s.style.transition="none"}_onLayoutPointerMove(t){const e=this._layoutDrag;if(!e)return;const i=t.clientX-e.startX,s=t.clientY-e.startY;if(!e.moved&&Math.abs(i)<4&&Math.abs(s)<4)return;e.moved=!0,e.offsetX=i,e.offsetY=s;const r="scene"===e.type;e.el.style.transform=r?`translateX(${i}px)`:`translateY(${s}px)`,e.el.style.opacity="0.85";const a="scene"===e.type?this.shadowRoot.querySelector(".sc-carousel"):this.shadowRoot.querySelector(".lp-list"),n=[...a.querySelectorAll(".layout-item")],o=e.el.getBoundingClientRect(),l=r?o.left+o.width/2:o.top+o.height/2;for(let i=0;i<n.length;i++){if(i===e.idx)continue;const s=n[i].getBoundingClientRect(),o=r?s.left+s.width/2:s.top+s.height/2;if(e.idx<i&&l>o||e.idx>i&&l<o){e.el.style.transform="",e.el.style.opacity="",e.el.style.zIndex="",e.el.style.transition="";const s=e.idx;return e.idx=i,this._layoutReorder(e.type,s,i),void this.updateComplete.then(()=>{const s=[...a.querySelectorAll(".layout-item")];s[i]&&(e.el=s[i],e.startX=t.clientX,e.startY=t.clientY,e.el.style.zIndex="10",e.el.style.transition="none",e.el.setPointerCapture(t.pointerId))})}}}_onLayoutPointerUp(t){const e=this._layoutDrag;e&&(e.el.style.transform="",e.el.style.opacity="",e.el.style.zIndex="",e.el.style.transition="",this._layoutDrag=null)}_toggleSwitch(t){const e=t.split(".")[0],i="on"===this.hass.states[t]?.state;this.hass.callService(e,i?"turn_off":"turn_on",{entity_id:t})}_toggleTheme(){this._theme="dark"===this._theme?"light":"dark",localStorage.setItem("smartvanio-theme",this._theme)}_toggleRightPanel(){this._showRightPanel=!this._showRightPanel,localStorage.setItem("smartvanio-show-right-panel",this._showRightPanel?"1":"0"),this._showRightPanel?this.updateComplete.then(()=>this._initSwiper()):this._destroySwiper()}_openNavDrawer(){this._navDrawerOpen=!0}_closeNavDrawer(){this._navDrawerOpen=!1}_toggleHaSidebar(){const t=new URL(window.location.href);t.searchParams.has("disable_km")?t.searchParams.delete("disable_km"):t.searchParams.set("disable_km",""),window.location.href=t.toString()}_renderTabBar(){return j`
      <div class="tab-bar">
        ${Xn.map(t=>j`
            <div
              class="tab-btn ${this._activeTab===t.id?"active":""}"
              @click=${()=>{this._activeTab=t.id}}
            >
              <ha-icon class="tab-icon" .icon=${t.icon}></ha-icon>
              <span class="tab-label">${t.label}</span>
            </div>
          `)}
      </div>
    `}_renderLeftPanel(t,e,i=null){if(this._setupMode)switch(this._activeTab){case"climate":return this._renderSetupClimate();case"scenes":return this._renderScenesPanel();case"actions":return this._renderActionsPanel();case"level":return this._renderSetupLevel();case"status":return this._renderSetupStatus();default:return j`<div class="panel-empty">No settings for this tab.</div>`}switch(this._activeTab){case"climate":return this._renderClimatePanel(t,i);case"scenes":return this._renderScenesPanel();case"actions":return this._renderActionsPanel();case"level":return this._renderLevelPanel(e);case"status":return this._renderStatusPanel(t,i);default:return j``}}_renderClimatePanel(t,e=null){const i="ESP32 Truma Heater Controller",s=e?.temperature??this._entityByChannel(i,"sensor","current_room_temperature"),r=e?.target_temp??this._entityByChannel(i,"number","room_temperature_setpoint"),a=e?.fan_speed??this._entityByChannel(i,"select","fan_mode"),n=e?.water_mode??this._entityByChannel(i,"select","water_mode"),o=e?.heating_active??this._entityByChannel(i,"binary_sensor","heating_active"),l=e?.climate_mode??t.selects.find(({eid:t})=>/climate_mode/.test(t))?.eid,d=e?.heater??t.switches.find(({eid:t})=>/\bheater\b/.test(t)&&!/water/.test(t))?.eid,c=e?.water_pump??t.switches.find(({eid:t})=>/water_pump/.test(t))?.eid,p=s&&parseFloat(this.hass.states[s]?.state)||null,h=r?this.hass.states[r]:null,u=parseFloat(h?.attributes?.min??0),g=parseFloat(h?.attributes?.max??30);parseFloat(h?.attributes?.step??1);const m=g-u||30,v=this._pendingTargetTemp??(r&&parseFloat(h?.state)||u),f=a?this.hass.states[a]?.state??"Off":"Off",b=a?this.hass.states[a]?.attributes?.options??["Off","Low","Medium","High"]:["Off","Low","Medium","High"],x=n?this.hass.states[n]?.state??"Off":null,y=n?this.hass.states[n]?.attributes?.options??["Off","Eco","Hot"]:null,_=!!o&&"on"===this.hass.states[o]?.state,w=l?this.hass.states[l]?.state??"Off":null,$=!!d&&"on"===this.hass.states[d]?.state;c&&this.hass.states[c];const k=_||$?1:0,S=m>0?Math.max(0,Math.min(1,(v-u)/m)):0,M=to*k,T=eo*S,C=Zn+S*Qn,[E,P]=io(Kn,Jn,62,C),A=_||$?"var(--sv-amber)":"var(--sv-gauge-inactive)",z={Off:"○",Eco:"💧",Hot:"♨"},L={Off:"○","Fan Only":"⊙",Cooling:"❄",Heating:"🔥"};return j`
      <div class="panel-climate">
        <svg
          class="climate-svg"
          viewBox="0 0 200 200"
          @pointerdown=${t=>this._onClimatePointerDown(t,r)}
          style="touch-action:none"
        >
          <!-- tracks -->
          <path
            d="${so(82)}"
            fill="none"
            stroke="var(--sv-gauge-track)"
            stroke-width="14"
            stroke-linecap="butt"
          />
          <path
            d="${so(62)}"
            fill="none"
            stroke="var(--sv-gauge-track)"
            stroke-width="14"
            stroke-linecap="butt"
          />

          <!-- heating status fill (outer) -->
          <path
            d="${so(82)}"
            fill="none"
            stroke="${A}"
            stroke-width="14"
            stroke-linecap="round"
            stroke-dasharray="${M.toFixed(1)} ${(to+20).toFixed(1)}"
            style="transition:stroke-dasharray 1s ease,stroke 0.6s ease"
          />

          <!-- target temp fill (inner) -->
          <path
            d="${so(62)}"
            fill="none"
            stroke="var(--sv-accent)"
            stroke-width="14"
            stroke-linecap="round"
            stroke-dasharray="${T.toFixed(1)} ${(eo+20).toFixed(1)}"
            style="transition:stroke-dasharray 0.15s ease"
          />

          <!-- arc labels -->
          <text x="24" y="155" text-anchor="middle" class="c-arc-tag">
            HEATER
          </text>
          <text
            x="24"
            y="170"
            text-anchor="middle"
            class="c-arc-val"
            style="fill:${A}"
          >
            ${_||$?"ON":"OFF"}
          </text>
          <text x="176" y="155" text-anchor="middle" class="c-arc-tag">
            SET
          </text>
          <text
            x="176"
            y="170"
            text-anchor="middle"
            class="c-arc-val"
            style="fill:var(--sv-accent)"
          >
            ${v>0?v.toFixed(0)+"°":"OFF"}
          </text>

          <!-- drag thumb -->
          <circle
            cx="${E.toFixed(1)}"
            cy="${P.toFixed(1)}"
            r="11"
            fill="var(--sv-accent)"
            stroke="var(--sv-bg-base)"
            stroke-width="2.5"
            style="cursor:grab;filter:drop-shadow(0 0 7px var(--sv-accent-muted))"
          />
          <circle
            cx="${E.toFixed(1)}"
            cy="${P.toFixed(1)}"
            r="4"
            fill="var(--sv-accent-hover)"
            pointer-events="none"
          />

          <!-- cabin temp centre -->
          <text
            x="${Kn}"
            y="${86}"
            text-anchor="middle"
            class="c-main-val"
          >
            ${null!==p?p.toFixed(1):"--"}
          </text>
          <text
            x="${Kn}"
            y="${106}"
            text-anchor="middle"
            class="c-main-unit"
          >
            °C CABIN
          </text>

          <!-- heating status indicator -->
          <g>
            <circle
              cx="${Kn}"
              cy="${128}"
              r="13"
              fill="${_||$?"#7a2a00":"var(--sv-gauge-track)"}"
              stroke="${_||$?"var(--sv-amber)":"var(--sv-bg-input)"}"
              stroke-width="1.5"
              style="transition:fill 0.3s,stroke 0.3s;filter:${_||$?"drop-shadow(0 0 5px rgba(240,183,47,0.53))":"none"}"
            />
            <text
              x="${Kn}"
              y="${133}"
              text-anchor="middle"
              style="font-size:13px;pointer-events:none"
            >
              🔥
            </text>
          </g>
          <text
            x="${Kn}"
            y="${150}"
            text-anchor="middle"
            class="c-btn-label"
          >
            ${_||$?"HEATING":"IDLE"}
          </text>
        </svg>

        <div class="climate-controls">
          <!-- fan speed -->
          <span class="climate-control-label">Fan</span>
          <div class="fan-row">
            ${b.map(t=>j`
                <div
                  class="fan-btn ${f===t?"active":""}"
                  @click=${()=>a&&this.hass.callService("select","select_option",{entity_id:a,option:t})}
                >
                  ${t}
                </div>
              `)}
          </div>

          <!-- water mode (Truma) or climate mode (generic) -->
          ${y?j`
              <span class="climate-control-label">Water</span>
              <div class="mode-row">
                ${y.map(t=>j`
                    <div
                      class="mode-btn ${x===t?"active":""}"
                      @click=${()=>n&&this.hass.callService("select","select_option",{entity_id:n,option:t})}
                    >
                      <span class="mode-icon">${z[t]??"○"}</span>
                      <span class="mode-lbl">${t}</span>
                    </div>
                  `)}
              </div>
            `:null!==w?j`
                <span class="climate-control-label">Mode</span>
                <div class="mode-row">
                  ${["Off","Fan Only","Cooling","Heating"].map(t=>j`
                      <div
                        class="mode-btn ${w===t?"active":""}"
                        @click=${()=>l&&this.hass.callService("select","select_option",{entity_id:l,option:t})}
                      >
                      <span class="mode-icon">${L[t]}</span>
                      <span class="mode-lbl">${t}</span>
                    </div>
                  `)}
              </div>
            `:""}
        </div>
      </div>
    `}_getSceneLightOptions(){if(!this.hass)return[];const t=this._allSmartvanioDeviceIds();if(!t.size)return[];const e=[],i={};for(const[s,r]of Object.entries(this.hass.entities??{})){if(!s.startsWith("light."))continue;if(!t.has(r.device_id))continue;const a=this.hass.states[s];if(!a)continue;const n=a.attributes?.smartvanio_parent_entity_id;n?(i[n]??=[]).push(s):e.push(s)}for(const t of Object.values(i))t.sort((t,e)=>(this.hass.states[t]?.attributes?.segment_start??0)-(this.hass.states[e]?.attributes?.segment_start??0));return e.map(t=>{const e=i[t]??[],s=this._label(t);return e.length?{groupLabel:s,options:[{value:t,label:`${s} (all LEDs)`},...e.map(t=>({value:t,label:this._label(t)}))]}:{groupLabel:null,options:[{value:t,label:s}]}})}_openSceneModal(t){const e=this.hass.states[t];this._editingScene=t,this._sceneEditName=this._label(t),this._sceneEditSaving=!1;const i=this._sceneConfigs[t];if(i?.entities)this._sceneEditLights=Object.entries(i.entities).filter(([t])=>t.startsWith("light.")).map(([t,e])=>({entity_id:t,state:(e.state??"on").toUpperCase(),brightness:e.brightness??255,rgb_color:e.rgb_color??this.hass.states[t]?.attributes?.rgb_color??[255,255,255],effect:e.effect??null}));else{const t=e?.attributes?.entity_id??[];this._sceneEditLights=t.filter(t=>t.startsWith("light.")).map(t=>{const e=this.hass.states[t];return{entity_id:t,state:"on"===e?.state?"ON":"OFF",brightness:e?.attributes?.brightness??255,rgb_color:e?.attributes?.rgb_color??[255,255,255],effect:e?.attributes?.effect??null}})}}_openNewSceneModal(){this._editingScene="new",this._sceneEditName="",this._sceneEditSaving=!1,this._sceneEditLights=[]}_addSceneLight(t){if(!t||this._sceneEditLights.find(e=>e.entity_id===t))return;const e=this.hass.states[t],i="on"===e?.state;this._sceneEditLights=[...this._sceneEditLights,{entity_id:t,state:i?"ON":"OFF",brightness:e?.attributes?.brightness??255,rgb_color:e?.attributes?.rgb_color??null}]}_removeSceneLight(t){this._sceneEditLights=this._sceneEditLights.filter(e=>e.entity_id!==t)}_updateSceneLight(t,e,i){this._sceneEditLights=this._sceneEditLights.map(s=>s.entity_id===t?{...s,[e]:i}:s)}_captureSceneState(){if(!this._sceneEditLights.length){const t=Object.entries(this.hass.states).filter(([t,e])=>t.startsWith("light.")&&"on"===e.state).map(([t,e])=>({entity_id:t,state:"ON",brightness:e.attributes?.brightness??255,rgb_color:e.attributes?.rgb_color??[255,255,255],effect:e.attributes?.effect??null}));return void(this._sceneEditLights=t)}this._sceneEditLights=this._sceneEditLights.map(t=>{const e=this.hass.states[t.entity_id];return{...t,state:e?.state?.toUpperCase()??t.state,brightness:e?.attributes?.brightness??t.brightness,rgb_color:e?.attributes?.rgb_color??t.rgb_color,effect:e?.attributes?.effect??t.effect??null}})}async _saveScene(){this._sceneEditSaving=!0;try{const t=this._sceneEditName.trim()||"Unnamed Scene",e={};for(const t of this._sceneEditLights){const i={state:(t.state??"ON").toLowerCase()};"on"===i.state&&(null!=t.brightness&&(i.brightness=t.brightness),null!=t.rgb_color&&(i.rgb_color=t.rgb_color),t.effect&&(i.effect=t.effect)),e[t.entity_id]=i}const i="new"!==this._editingScene&&this.hass.states[this._editingScene]?.attributes?.id||String(Date.now());await this.hass.callApi("POST",`config/scene/config/${i}`,{id:i,name:t,entities:e}),await this.hass.callService("scene","reload",{}),this._sceneConfigsLoaded=!1,this._editingScene=null}catch(t){console.error("VanCtl: save scene failed:",t)}finally{this._sceneEditSaving=!1}}async _deleteScene(){try{const t=this.hass.states[this._editingScene]?.attributes?.id;t&&(await this.hass.callApi("DELETE",`config/scene/config/${t}`),await this.hass.callService("scene","reload",{}),this._sceneConfigsLoaded=!1)}catch(t){console.error("VanCtl: delete scene failed:",t)}this._editingScene=null}_renderScenesPanel(){const t=this._deviceScenes(),e=Object.entries(this.hass.states??{}).filter(([t])=>t.startsWith("script.")).map(([t,e])=>({eid:t,label:e.attributes?.friendly_name??t.split(".").pop()})).sort((t,e)=>t.label.localeCompare(e.label));return t.length||e.length?this._setupMode?j`
        <div class="panel-actions">
          ${t.map(({eid:t})=>j`
            <div class="auto-row">
              <ha-icon class="auto-row-icon" icon="mdi:palette"></ha-icon>
              <span class="auto-row-label">${this._label(t)}</span>
              <button class="auto-row-edit" title="Edit" @click=${()=>this._openSceneModal(t)}>
                <ha-icon icon="mdi:pencil-outline"></ha-icon>
              </button>
            </div>
          `)}
          ${e.map(({eid:t,label:e})=>j`
            <div class="auto-row">
              <ha-icon class="auto-row-icon" icon="mdi:play-circle-outline" style="color:var(--sv-accent)"></ha-icon>
              <span class="auto-row-label">${e}</span>
            </div>
          `)}
          <button class="add-action-btn-full" @click=${()=>this._openNewSceneModal()}>
            + New Scene
          </button>
        </div>
      `:j`
      <div class="panel-scenes">
        ${t.map(({eid:t})=>{const e=this._sceneCardGradient(t),i=this._getSceneColors(t),s=this._isSceneActive(t);return j`
            <div class="scene-tile ${s?"active":""}" style="background:${e}"
                 @click=${()=>this._triggerScene(t)}>
              <ha-icon class="scene-icon" icon="mdi:palette"></ha-icon>
              <span class="scene-name">${this._label(t)}</span>
              ${i.length?j`
                <div class="scene-dots">
                  ${i.map(([t,e,i])=>j`<span class="scene-dot" style="background:rgb(${t},${e},${i})"></span>`)}
                </div>
              `:""}
            </div>
          `})}
        ${e.map(({eid:t,label:e})=>j`
          <div class="scene-tile scene-tile--script" @click=${()=>this._runAction(t)}>
            <ha-icon class="scene-icon" icon="mdi:play-circle-outline"></ha-icon>
            <span class="scene-name">${e}</span>
          </div>
        `)}
      </div>
    `:j`<div class="panel-empty">No scenes or scripts configured.</div>`}_renderActionsPanel(){const t=this._listVanctlAutomations();return j`
      <div class="panel-actions">
        ${t.length?t.map(t=>j`
                <div class="auto-row">
                  <ha-icon
                    class="auto-row-icon"
                    icon="mdi:lightning-bolt"
                  ></ha-icon>
                  <span class="auto-row-label"
                    >${t.alias.replace(/^\[VanCtl\]\s*/,"").replace(/\s*—\s*/g," · ")}</span
                  >
                  ${this._setupMode?j`
                        <button
                          class="auto-row-delete"
                          title="Delete"
                          @click=${()=>this._deleteAuto(t)}
                        >
                          <ha-icon icon="mdi:delete-outline"></ha-icon>
                        </button>
                      `:""}
                </div>
              `):j`<div class="panel-empty">No automations configured .</div>`}
        ${this._setupMode?j`
              <button
                class="add-action-btn-full"
                @click=${()=>this._openAutoModal()}
              >
                <ha-icon icon="mdi:plus"></ha-icon> Add Action
              </button>
            `:""}
      </div>
    `}_buildInCardEids(t,e){const i=new Set,s=e;if(s){const t=t=>(t??[]).forEach(t=>{const e="string"==typeof t?t:t.entity;e&&i.add(e)});t(s.lights),t(s.switches),t(s.resources),t(s.fans),t(s.buttons),t(s.footerSwitches),t(s.topbarStats),(s.status_sensors??[]).forEach(t=>i.add(t)),s.pitch&&i.add(s.pitch),s.roll&&i.add(s.roll),s.temperature&&i.add(s.temperature),s.water_temp&&i.add(s.water_temp),s.target_temp&&i.add(s.target_temp),s.fan_speed&&i.add(s.fan_speed),s.climate_mode&&i.add(s.climate_mode),s.heater&&i.add(s.heater),s.water_pump&&i.add(s.water_pump),s.power&&(s.power.soc&&i.add(s.power.soc),s.power.voltage&&i.add(s.power.voltage),s.power.current&&i.add(s.power.current),s.power.time_left&&i.add(s.power.time_left)),(s.groups??[]).forEach(t=>(t.lights??[]).forEach(t=>i.add(t))),(s.hiddenLights??[]).forEach(t=>i.add(t))}for(const e of t.lights)i.add(e.eid);for(const e of t.switches)i.add(e.eid);return i}_renderDevicesPage(t,e){const i=Object.values(this.hass.devices??{}).filter(t=>t.identifiers?.some(([t])=>"smartvanio"===t)),s={};for(const t of i)s[t.id]=[];for(const[t,e]of Object.entries(this.hass.entities??{}))if(void 0!==s[e.device_id]){const i=this.hass.states[t];i&&s[e.device_id].push({eid:t,state:i,entry:e})}const r=this._buildInCardEids(t,e);return j`
      <div class="dev-page">
        <div class="dev-grid">
          ${i.map(t=>{const i=t.identifiers?.find(([t])=>"smartvanio"===t)?.[1],a=i?this._knownDevices[i]:null,n=i?this._deviceStatuses[i]:null,o="online"===n,l="offline"===n,d=s[t.id]||[],c=d.filter(t=>r.has(t.eid)),p=d.filter(t=>!r.has(t.eid)),h=t.name_by_user??t.name??i??"Unknown",u=a?.model??t.model??"",g=a?.firmware??t.sw_version??"";return j`
              <div class="dev-card">
                <div class="dev-card-header">
                  <div class="dev-card-status ${o?"online":l?"offline":"unknown"}"></div>
                  <div class="dev-card-info">
                    <span class="dev-card-name">${h}</span>
                    ${u?j`<span class="dev-card-meta">${u}${g?` · v${g}`:""}</span>`:""}
                  </div>
                  <span class="dev-card-cfg" @click=${()=>this._openDeviceModal(t,i,d,r,e)} title="Configure">
                    <ha-icon icon="mdi:cog" style="--mdc-icon-size:16px"></ha-icon>
                  </span>
                  <a class="dev-card-link" href="/config/devices/device/${t.id}" target="_top" title="Open in HA">
                    <ha-icon icon="mdi:open-in-new" style="--mdc-icon-size:16px"></ha-icon>
                  </a>
                </div>

                <div class="dev-card-stats">
                  <span class="dev-stat">${d.length} entities</span>
                  <span class="dev-stat-sep">·</span>
                  <span class="dev-stat in">${c.length} in card</span>
                  ${p.length?j`
                    <span class="dev-stat-sep">·</span>
                    <span class="dev-stat out">${p.length} unused</span>
                  `:""}
                </div>
              </div>
            `})}
        </div>
      </div>
    `}_openDeviceModal(t,e,i,s,r){this._deviceModal={device:t,deviceId:e,entities:i,inCardEids:s,slots:r},requestAnimationFrame(()=>{const t=this.shadowRoot?.querySelector("smartvanio-modal-device");t&&t.resetCalData()})}_refreshDeviceModal(){this._deviceModal&&requestAnimationFrame(()=>{const t=this._deviceModal,e=this._cardConfig?.slots??{};Object.values(this.hass.devices??{}).filter(t=>t.identifiers?.some(([t])=>"smartvanio"===t));const i=[];for(const[e,s]of Object.entries(this.hass.entities??{}))if(s.device_id===t.device.id){const t=this.hass.states[e];t&&i.push({eid:e,state:t,entry:s})}const s={lights:[],switches:[]};for(const[t,e]of Object.entries(this.hass.entities??{})){const i=Object.values(this.hass.devices??{}).find(t=>t.identifiers?.some(([t])=>"smartvanio"===t)&&t.id===e.device_id);if(!i)continue;const r=this.hass.states[t];r&&(t.startsWith("light.")?s.lights.push({eid:t,state:r}):t.startsWith("switch.")&&s.switches.push({eid:t,state:r}))}const r=this._buildInCardEids(s,e);this._deviceModal={...t,entities:i,inCardEids:r,slots:e}})}_addEntityToCard(t,e){const i={...this._cardConfig?.slots??{}};if("light"===e){const e=[...i.lights??[]];e.some(e=>("string"==typeof e?e:e.entity)===t)||(e.push({entity:t}),i.lights=e)}else if("switch"===e){const e=[...i.switches??[]];e.some(e=>("string"==typeof e?e:e.entity)===t)||(e.push({entity:t}),i.switches=e)}else if("sensor"===e||"binary_sensor"===e||"number"===e||"select"===e){const e=[...i.status_sensors??[]];e.includes(t)||(e.push(t),i.status_sensors=e)}this._saveCardConfig({...this._cardConfig,slots:i})}_removeEntityFromCard(t,e){const i={...this._cardConfig?.slots??{}};"light"===e?(i.lights=(i.lights??[]).filter(e=>("string"==typeof e?e:e.entity)!==t),i.hiddenLights=(i.hiddenLights??[]).filter(e=>e!==t),i.groups&&(i.groups=i.groups.map(e=>({...e,lights:(e.lights??[]).filter(e=>e!==t)})))):"switch"===e?(i.switches=(i.switches??[]).filter(e=>("string"==typeof e?e:e.entity)!==t),i.footerSwitches=(i.footerSwitches??[]).filter(e=>("string"==typeof e?e:e.entity)!==t)):"sensor"!==e&&"binary_sensor"!==e&&"number"!==e&&"select"!==e||(i.status_sensors=(i.status_sensors??[]).filter(e=>e!==t),i.topbarStats=(i.topbarStats??[]).filter(e=>("string"==typeof e?e:e.entity)!==t),i.resources=(i.resources??[]).filter(e=>("string"==typeof e?e:e.entity)!==t)),this._saveCardConfig({...this._cardConfig,slots:i})}_renderOverviewPanel(t,e){const i=e?.lights??[],s=new Set(e?.hiddenLights??[]),r=[...new Set([...i.map(t=>t.entity),...t.lights.map(t=>t.eid)])].filter(t=>!s.has(t)),a={};for(const t of r){const e=i.find(e=>e.entity===t),s=e?.area?.trim()||"Other";a[s]||(a[s]={all:[],on:[],icon:"mdi:map-marker"}),a[s].all.push(t),"on"===this.hass.states[t]?.state&&a[s].on.push(t)}const n=Object.entries(a).filter(([,t])=>t.all.length>0);n.reduce((t,[,e])=>t+e.on.length,0);const o=e?.power,l=t=>{const e=t?this.hass.states[t]:null;return e&&"unavailable"!==e.state&&"unknown"!==e.state?parseFloat(e.state):null},d=o?l(o.soc):null,c=o?l(o.voltage):null,p=o?l(o.current):null,h=o?l(o.time_left):null,u=Object.keys(this.hass?.states??{}).find(t=>t.startsWith("weather.")),g=u?this.hass.states[u]:null,m=g?parseFloat(g.attributes?.temperature):null,v=g?.state;return j`
      <div class="ov-panel">
        <div class="ov-grid">
          <!-- Area tiles -->
          ${n.map(([t,{all:e,on:i,icon:s}])=>j`
            <div class="ov-card ov-card-area ${i.length?"active":""}" @click=${()=>{i.length?i.forEach(t=>this.hass.callService("light","turn_off",{entity_id:t})):e.forEach(t=>this.hass.callService("light","turn_on",{entity_id:t}))}}>
              <div class="ov-card-header">
                <ha-icon icon="${s}" style="--mdc-icon-size:18px; color:${i.length?"var(--sv-amber)":"var(--sv-text-disabled)"}"></ha-icon>
                <span class="ov-card-title">${t}</span>
              </div>
              <span class="ov-area-status" style="color:${i.length?"var(--sv-amber)":"var(--sv-text-secondary)"}">${i.length?`${i.length}/${e.length} on`:`${e.length} lights`}</span>
            </div>
          `)}

          <!-- Power -->
          ${o?j`
            <div class="ov-card">
              <div class="ov-card-header">
                <ha-icon icon="mdi:battery" style="--mdc-icon-size:18px; color:${null!==d?d>50?"var(--sv-green)":d>20?"var(--sv-amber)":"var(--sv-red)":"var(--sv-text-disabled)"}"></ha-icon>
                <span class="ov-card-title">Power</span>
              </div>
              <div class="ov-power-rows">
                ${null!==p?j`<div class="ov-power-row"><span class="ov-power-label">Draw</span><span class="ov-power-val">${p.toFixed(1)}A</span></div>`:""}
                ${null!==h?j`<div class="ov-power-row"><span class="ov-power-label">Left</span><span class="ov-power-val">${h.toFixed(0)}h</span></div>`:""}
                ${null!==c?j`<div class="ov-power-row"><span class="ov-power-label">Volts</span><span class="ov-power-val">${c.toFixed(1)}V</span></div>`:""}
              </div>
            </div>
          `:""}

          <!-- Weather -->
          ${g?j`
            <div class="ov-card">
              <div class="ov-card-header">
                <ha-icon icon="${{sunny:"mdi:weather-sunny","clear-night":"mdi:weather-night",partlycloudy:"mdi:weather-partly-cloudy",partly_cloudy:"mdi:weather-partly-cloudy",cloudy:"mdi:weather-cloudy",rainy:"mdi:weather-rainy",pouring:"mdi:weather-pouring",snowy:"mdi:weather-snowy","snowy-rainy":"mdi:weather-snowy-rainy",fog:"mdi:weather-fog",hail:"mdi:weather-hail",windy:"mdi:weather-windy","windy-variant":"mdi:weather-windy-variant",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",exceptional:"mdi:alert-circle-outline"}[v]||"mdi:weather-cloudy"}" style="--mdc-icon-size:18px; color:var(--sv-accent)"></ha-icon>
                <span class="ov-card-title">Weather</span>
              </div>
              <span class="ov-card-value">${null!==m?Math.round(m)+"°":"—"}<span class="ov-card-sub">${v?v.replace(/-/g," "):""}</span></span>
            </div>
          `:""}
        </div>
      </div>
    `}_renderLevelPanel(t){const e=parseFloat(t?.pitch?.state)||0,i=parseFloat(t?.roll?.state)||0,s=70,r=t=>Math.max(-1,Math.min(1,t)),a=52*r(i/15),n=52*r(-e/15),o=Math.sqrt(e**2+i**2),l=o<1.5?"#2bd853":o<5?"#f0b72f":"#ff9492",d=o<1.5;return j`
      <div class="panel-level">
        <svg class="bubble-lg" viewBox="${"-84 -84 168 168"}">
          <circle
            r="${s}"
            fill="var(--sv-bg-base)"
            stroke="${l}"
            stroke-width="2"
            style="transition:stroke 0.4s ease"
          />
          <circle
            r="${42}"
            fill="none"
            stroke="var(--sv-bg-input)"
            stroke-width="1"
          />
          <circle
            r="${21}"
            fill="none"
            stroke="var(--sv-bg-input)"
            stroke-width="0.8"
          />
          <line
            x1="${-70}"
            y1="0"
            x2="${s}"
            y2="0"
            stroke="var(--sv-bg-input)"
            stroke-width="1"
          />
          <line
            x1="0"
            y1="${-70}"
            x2="0"
            y2="${s}"
            stroke="var(--sv-bg-input)"
            stroke-width="1"
          />
          <circle
            r="${14}"
            fill="${l}"
            opacity="0.9"
            style="transform:translate(${a.toFixed(1)}px,${n.toFixed(1)}px);
                   transition:transform 0.55s ease,fill 0.4s ease;
                   filter:drop-shadow(0 0 7px ${l}88)"
          />
          <circle r="3" fill="none" stroke="var(--sv-bg-input)" stroke-width="1" />
        </svg>

        <div class="level-stats">
          <div class="lstat">
            <span class="lstat-label">PITCH</span>
            <span class="lstat-val ${Math.abs(e)>5?"warn":""}">
              ${e>=0?"+":""}${e.toFixed(1)}°
            </span>
          </div>
          <div class="lstat">
            <span class="lstat-label">ROLL</span>
            <span class="lstat-val ${Math.abs(i)>5?"warn":""}">
              ${i>=0?"+":""}${i.toFixed(1)}°
            </span>
          </div>
          <div class="lstat">
            <span class="lstat-label">STATUS</span>
            <span class="lstat-val ${d?"ok":"warn"}"
              >${d?"Level":"Tilted"}</span
            >
          </div>
        </div>
      </div>
    `}_renderStatusPanel(t,e=null){const i=e?.status_sensors??[],s={sensor:"Sensors",binary_sensor:"Binary Sensors",number:"Numbers",select:"Settings",input_boolean:"Toggles"},r=Object.entries(this._knownDevices),a=r.length?j`
          <div class="sstat-group-label">Boards</div>
          ${r.map(([t,e])=>{const i=this._deviceStatuses[t],s="online"===i,r="offline"===i;return j`
              <div class="sstat-row">
                <span class="sstat-row-name">${e.name??t}</span>
                <span
                  class="board-dot ${s?"online":r?"offline":"unknown"}"
                  title="${s?"Online":r?"Offline":"Unknown"}"
                >
                </span>
              </div>
            `})}
        `:"";if(!i.length)return j` <div class="panel-status">
        ${a}
        ${r.length?j`
              <div class="sstat-group-label" style="margin-top:10px">
                Sensors
              </div>
              <div class="sstat-hint">Tap ⚙ → Status to add sensors.</div>
            `:j`
              <div class="panel-empty">
                No status sensors configured.<br />Tap ⚙ → Status to add some.
              </div>
            `}
      </div>`;const n=new Map;for(const t of i){const e=t.split(".")[0];n.has(e)||n.set(e,[]),n.get(e).push(t)}return j`
      <div class="panel-status">
        ${a}
        ${[...n.entries()].map(([t,e])=>j`
            ${n.size>1||r.length?j`
                  <div class="sstat-group-label">
                    ${s[t]??t}
                  </div>
                `:""}
            ${e.map(t=>{const e=this.hass.states[t],i=e?.state??null,s=e?.attributes?.unit_of_measurement??"",r=this._smartvanioDeviceId(t),a=r&&"offline"===this._deviceStatuses[r];return j`
                <div class="sstat-row">
                  <span class="sstat-row-name">
                    ${a?j`<span
                          class="board-dot offline"
                          title="Board offline"
                        ></span>`:""}
                    ${this._label(t)}
                  </span>
                  <span class="sstat-row-val ${a?"val-offline":""}">
                    ${null!==i?i+(s?" "+s:""):"—"}
                  </span>
                </div>
              `})}
          `)}
      </div>
    `}_renderPinnedActions(){const t=this._cardConfig?.pinnedActions??[];return t.length||this._setupMode?j`
      <div class="pinned-strip">
        ${t.map(t=>j`
            <div
              class="pinned-btn"
              @click=${()=>this._setupMode?this._removePinnedAction(t.id):this._runAction(t.id)}
            >
              <span class="pinned-lbl">${t.label}</span>
              ${this._setupMode?j`<span class="pinned-x">✕</span>`:""}
            </div>
          `)}
        ${this._setupMode?j`
              <div
                class="pinned-add"
                @click=${()=>{this._activeTab="actions"}}
              >
                + Add
              </div>
            `:""}
      </div>
    `:j``}_lightIcon(t){const e=this.hass?.states[t];return e?.attributes?.smartvanio_parent_entity_id?"mdi:led-strip":/strip/i.test(t)?"mdi:led-strip-variant":/spot/i.test(t)?"mdi:spotlight-beam":/main/i.test(t)?"mdi:lightbulb":"mdi:lightbulb-outline"}_onTilePointerDown(t,e){this._setupMode||0!==t.button&&"touch"!==t.pointerType||(this._tileLpOrigin={x:t.clientX,y:t.clientY},this._tileLpTimer=setTimeout(()=>{this._tileLpTimer=null,this._tileLpOrigin=null;const i=t.currentTarget.getBoundingClientRect();this._tilePopover={eid:e,x:i.left+i.width/2,y:i.top}},400))}_onTilePointerMove(t){if(this._setupMode)return;if(!this._tileLpTimer||!this._tileLpOrigin)return;const e=t.clientX-this._tileLpOrigin.x,i=t.clientY-this._tileLpOrigin.y;Math.sqrt(e*e+i*i)>8&&(clearTimeout(this._tileLpTimer),this._tileLpTimer=null,this._tileLpOrigin=null)}_onTilePointerUp(t,e){this._setupMode?this._openEditModal(e):this._tileLpTimer&&(clearTimeout(this._tileLpTimer),this._tileLpTimer=null,this._tileLpOrigin=null,this._toggleLight(e))}_renderTilePopover(){const t=this._tilePopover;if(!t)return j``;const e=t.eid,i=this.hass.states[e],s="on"===i?.state,r=this._bri(e),a=Math.round(r/255*100),n=i?.attributes?.rgb_color??[255,200,80],[o,l,d]=n,c=(i?.attributes?.supported_color_modes??[]).some(t=>["rgb","rgbw","rgbww","hs","xy"].includes(t)),p="#"+n.map(t=>t.toString(16).padStart(2,"0")).join(""),h=s?`rgb(${o},${l},${d})`:"var(--sv-text-disabled)",u=`linear-gradient(to right, ${h} 0%, ${h} ${a}%, rgba(255,255,255,0.08) ${a}%, rgba(255,255,255,0.08) 100%)`,g=this._getEntityPatterns(e),m=Object.keys(g),v=this._getActivePatternName(e);return j`
      <div class="popover-overlay" @click=${()=>{this._tilePopover=null}}>
        <div
          class="popover"
          style="left:${t.x}px; top:${t.y}px"
          @click=${t=>t.stopPropagation()}
        >
          <div class="popover-hdr">
            <span class="popover-name">${this._label(e)}</span>
            <button class="popover-toggle ${s?"on":""}" @click=${()=>this._toggleLight(e)}>
              ${s?"ON":"OFF"}
            </button>
          </div>
          <div class="popover-body">
            <div class="popover-row">
              <ha-icon icon="mdi:brightness-6" style="--mdc-icon-size:16px; color:var(--sv-text-secondary)"></ha-icon>
              <input
                type="range" min="1" max="255"
                .value=${r}
                class="popover-slider"
                style="background:${u}"
                @input=${t=>{this._dragState=new Map(this._dragState).set(e,{active:!0,brightness:+t.target.value})}}
                @change=${t=>{const i=+t.target.value;this._setBri(e,i),localStorage.setItem(`smartvanio_bri_${e}`,i),this._dragState=new Map(this._dragState).set(e,{active:!1,brightness:i})}}
              />
              <span class="popover-pct">${a}%</span>
            </div>
            ${c?j`
              <div class="popover-row">
                <ha-icon icon="mdi:palette" style="--mdc-icon-size:16px; color:var(--sv-text-secondary)"></ha-icon>
                <input
                  type="color"
                  class="popover-color"
                  .value=${p}
                  @change=${t=>{const i=t.target.value;this.hass.callService("light","turn_on",{entity_id:e,rgb_color:[parseInt(i.slice(1,3),16),parseInt(i.slice(3,5),16),parseInt(i.slice(5,7),16)]})}}
                />
                <div class="popover-swatch" style="background:${p}"
                  @click=${t=>t.target.previousElementSibling.click()}></div>
              </div>
            `:""}
            ${m.length?j`
              <div class="popover-patterns">
                ${m.map(t=>j`
                  <div class="popover-pat-chip ${v===t?"active":""}"
                    @click=${()=>{this._applyPattern(e,t,g[t]),this._tilePopover=null}}>
                    <div class="popover-pat-grad" style="background:${this._patternGradientCSS(g[t])}"></div>
                    <span class="popover-pat-name">${t}</span>
                  </div>
                `)}
              </div>
            `:""}
          </div>
        </div>
      </div>
    `}_renderNavDrawer(){const t="dark"===this._theme;return j`
      <div class="nd-overlay" @click=${t=>{t.target===t.currentTarget&&this._closeNavDrawer()}}>
        <div class="nd-panel" @click=${t=>t.stopPropagation()}>
          <div class="nd-header">
            <span class="nd-title">Menu</span>
            <button class="nd-close" @click=${()=>this._closeNavDrawer()} aria-label="Close menu">
              <ha-icon icon="mdi:close" style="--mdc-icon-size:22px"></ha-icon>
            </button>
          </div>
          <div class="nd-body">
            <div class="nd-section-label">View</div>
            <button class="nd-row" @click=${()=>{this._toggleTheme(),this._closeNavDrawer()}}>
              <ha-icon class="nd-row-icon" icon="${t?"mdi:weather-night":"mdi:weather-sunny"}" style="--mdc-icon-size:22px"></ha-icon>
              <span class="nd-row-label">Theme</span>
              <span class="nd-row-state on">${t?"Dark":"Light"}</span>
            </button>

            <div class="nd-section-label">Navigate</div>
            <button class="nd-row" @click=${()=>{this._page="devices",this._closeNavDrawer()}}>
              <ha-icon class="nd-row-icon" icon="mdi:chip" style="--mdc-icon-size:22px"></ha-icon>
              <span class="nd-row-label">Devices</span>
              <ha-icon class="nd-row-chevron" icon="mdi:chevron-right"></ha-icon>
            </button>

            <div class="nd-section-label">Edit</div>
            <button class="nd-row" @click=${()=>{this._enterLayoutMode(),this._closeNavDrawer()}}>
              <ha-icon class="nd-row-icon" icon="mdi:sort" style="--mdc-icon-size:22px"></ha-icon>
              <span class="nd-row-label">Reorder &amp; hide</span>
              <ha-icon class="nd-row-chevron" icon="mdi:chevron-right"></ha-icon>
            </button>
            <button class="nd-row" @click=${()=>{this._enterSetupMode(),this._closeNavDrawer()}}>
              <ha-icon class="nd-row-icon" icon="mdi:cog" style="--mdc-icon-size:22px"></ha-icon>
              <span class="nd-row-label">Settings</span>
              <ha-icon class="nd-row-chevron" icon="mdi:chevron-right"></ha-icon>
            </button>
          </div>
        </div>
      </div>
    `}_renderClimateTab(){if("dashboard"!==this._page)return"";if(this._setupMode||this._layoutMode)return"";const t=!!this._showRightPanel;return j`
      <button class="ct-tab ${t?"open":""}"
              @click=${()=>this._toggleRightPanel()}
              aria-label="${t?"Hide climate panel":"Show climate panel"}"
              title="${t?"Hide climate panel":"Show climate panel"}">
        <ha-icon class="ct-tab-chev"
                 icon="${t?"mdi:chevron-right":"mdi:chevron-left"}"
                 style="--mdc-icon-size:22px"></ha-icon>
        <span class="ct-tab-label">Climate</span>
      </button>
    `}_renderLightTile({eid:t,state:e,_slotName:i=null}){const s="on"===e?.state,r=!e||"unavailable"===e.state,a=this._bri(t),n=Math.round(a/255*100),o=e?.attributes?.rgb_color??[255,200,80],[l,d,c]=o,p=r?"background: rgba(28,28,30,0.35)":s?`background: rgba(${l},${d},${c},${.12+a/255*.22})`:"background: rgba(28,28,30,0.65)",h=r?"#6b3030":s?`rgb(${l},${d},${c})`:"var(--sv-text-disabled)",u=this._lightIcon(t),g=this._label(t,i);return j`
      <div
        class="ltile ${s?"on":""} ${r?"offline":""} ${this._setupMode?"edit-mode":""}"
        style="${p}"
        data-tile-id=${t}
        @pointerdown=${e=>this._onTilePointerDown(e,t)}
        @pointermove=${t=>this._onTilePointerMove(t)}
        @pointerup=${e=>this._onTilePointerUp(e,t)}
        @contextmenu=${t=>t.preventDefault()}
      >
        <ha-icon
          class="ltile-icon"
          icon=${this._setupMode?"mdi:pencil":r?"mdi:cloud-off-outline":u}
          style="color:${this._setupMode?"var(--sv-text-disabled)":h}"
        ></ha-icon>
        <span class="ltile-name">${g}</span>
        ${r?j`<span class="ltile-bri" style="color:#6b3030">Offline</span>`:!this._setupMode&&s?j`<span class="ltile-bri">${n}%</span>`:""}
      </div>
    `}_renderUnifiedGrid(t,e,i){const s=t?.groups??[],r=t?.tileOrder??null,a=this._orderedTiles(s,e,i,r);if(!this._currentLayout){const t=this._cardConfig?.slots?.layouts??{};let e=t[this._gridKey]?this._gridKey:null;if(!e)for(const i of Object.keys(t))if(i.startsWith(this._gridKey+"x")){e=i;break}this._currentLayout=e?this._mergeNewItems(structuredClone(t[e]),a):r?.length?Ta(r,a,this._gridCols,t=>this._tileSizeFor(t)):wa(a,this._gridCols,t=>this._tileSizeFor(t))}const n=new Set(a.filter(t=>"spacer"!==t.type).map(t=>t.id));if(this._currentLayout)for(const t of Object.keys(this._currentLayout))n.has(t)||delete this._currentLayout[t];const o=this._currentLayout??{},l=this._dragController;return j`
      <div class="unified-grid-wrap">
        <div class="unified-grid-hdr">
          <span class="section-label">Controls</span>
          ${this._setupMode?j`<span class="dnd-hint">Tap to edit · Hold &amp; drag to reorder</span>`:""}
        </div>
        <div class="unified-grid ${this._setupMode?"dnd-mode":""}"
             @pointerdown=${this._setupMode?t=>this._dragController.start(t):null}>
          ${a.filter(t=>"spacer"!==t.type).map(t=>{const e=o[t.id];if(!e)return"";const i=this._mergeTargetId===t.id,s=`grid-column: ${e.col+1} / span ${e.w}; grid-row: ${e.row+1} / span ${e.h};`;return j`
              <div class="grid-tile ${i?"merge-target":""}" data-tile-id=${t.id}
                   data-tile-w=${e.w} data-tile-h=${e.h}
                   data-tile-col=${e.col} data-tile-row=${e.row}
                   style=${s}>
                ${this._setupMode&&this._allowedSizes(t).length>1?j`
                  <button class="resize-btn" @click=${e=>{e.stopPropagation(),this._cycleTileSize(t.id,t)}}
                    title="Resize tile">
                    <ha-icon icon="mdi:resize"></ha-icon>
                  </button>
                `:""}
                ${"group"===t.type?this._renderGroupTile(t.data,e):"light"===t.type?this._renderLightTile(t.data):"switch"===t.type?this._renderSwitchTile(t.data):""}
              </div>
            `})}
          ${this._setupMode?this._renderEmptyCells(o):""}
          ${l.dragging&&!this._mergeTargetId?j`
            <div class="drop-preview"
                 style="grid-column: ${l.previewCol+1} / span ${l.w}; grid-row: ${l.previewRow+1} / span ${l.h};">
            </div>
          `:""}
        </div>
      </div>
    `}_renderEmptyCells(t){const e=ba(t,this._gridCols);let i=0;for(const e of Object.values(t))i=Math.max(i,e.row+e.h);const s=Math.max(i,this._gridRows||4),r=[];for(let t=0;t<s;t++)for(let i=0;i<this._gridCols;i++)e[t]?.[i]||r.push(j`
            <div class="empty-cell"
                 style="grid-column: ${i+1}; grid-row: ${t+1};">
            </div>
          `);return r}_renderLightRow({eid:t,state:e,_slotName:i=null}){const s="on"===e?.state,r=this._bri(t),a=Math.round(r/255*100),n=e?.attributes?.rgb_color??[255,255,255],o=s?`rgb(${n[0]},${n[1]},${n[2]})`:"var(--sv-bg-input)",l=s?`0 0 9px rgb(${n[0]},${n[1]},${n[2]})`:"none",d=s?a:0,c=`linear-gradient(to right, var(--sv-accent) ${d}%, var(--sv-gauge-track) ${d}%)`,p=(e?.attributes?.supported_color_modes??[]).some(t=>["rgb","rgbw","rgbww","hs","xy"].includes(t)),h="#"+n.map(t=>t.toString(16).padStart(2,"0")).join("");return j`
      <div
        class="lrow ${s?"on":""}"
        @click=${()=>this._toggleLight(t)}
      >
        <div
          class="ldot"
          style="background:${o};box-shadow:${l}"
        ></div>
        <span class="lname">${this._label(t,i)}</span>
        <div class="lright" @click=${t=>t.stopPropagation()}>
          ${p?j`
                <label
                  class="color-swatch"
                  style="background:${s?h:"var(--sv-bg-input)"}"
                >
                  <input
                    type="color"
                    class="color-input"
                    .value=${h}
                    @change=${e=>{const i=e.target.value;this.hass.callService("light","turn_on",{entity_id:t,rgb_color:[parseInt(i.slice(1,3),16),parseInt(i.slice(3,5),16),parseInt(i.slice(5,7),16)]})}}
                  />
                </label>
              `:""}
          <input
            type="range"
            min="1"
            max="255"
            .value=${r}
            class="lslider"
            style="background:${c}"
            @input=${e=>{const i=+e.target.value;this._dragState=new Map(this._dragState).set(t,{active:!0,brightness:i})}}
            @change=${e=>{const i=+e.target.value;this._setBri(t,i),localStorage.setItem(`smartvanio_bri_${t}`,i),this._dragState=new Map(this._dragState).set(t,{active:!1,brightness:i})}}
          />
          <span class="lpct">${s?a+"%":"—"}</span>
        </div>
      </div>
    `}_renderSwitchTile({eid:t,state:e,_slotName:i=null}){const s="on"===e?.state,r=t.includes("fan")?"mdi:fan":"mdi:power-plug";return j`
      <div
        class="stile ${s?"on":""}"
        data-tile-id=${t}
        @click=${()=>{this._setupMode?this._openEditModal(t):this.hass.callService(t.split(".")[0],"toggle",{},{entity_id:t})}}
      >
        <ha-icon class="stile-icon" icon=${this._setupMode?"mdi:pencil":r} style="color:${this._setupMode?"var(--sv-text-disabled)":""}"></ha-icon>
        <span class="stile-name">${this._label(t,i)}</span>
        <span class="stile-badge">${this._setupMode?"":s?"ON":"OFF"}</span>
      </div>
    `}_renderResources(t,e=null){const{sensors:i}=t,s=t=>i.find(({eid:e})=>t.test(e))?.eid,r=new Set((e?.resources??[]).map(t=>t.entity)),a=[{eid:s(/water_tank$/),label:"Water",color:"#5cacff"},{eid:s(/gas_tank$/),label:"Gas",color:"#f0b72f"},{eid:s(/waste_tank$/),label:"Waste",color:"#ff9492"},{eid:s(/fuel_level/),label:"Fuel",color:"#2bd853"}].filter(({eid:t})=>t&&!r.has(t)),n=(e?.resources??[]).map(({entity:t,name:e,color:i})=>({eid:t,label:e??t.split(".").pop(),color:i??"var(--sv-accent)"})),o=[...n,...a],l=e?.resources?.find(t=>/battery|soc/i.test(t.entity)),d=l?null:s(/battery/),c=d?parseFloat(this.hass.states[d]?.state):null,p=null!==c?Math.max(0,Math.min(100,(c-11.5)/1.7*100)):0,h=null===c?"var(--sv-text-secondary)":p>50?"#2bd853":p>20?"#f0b72f":"#ff9492";return o.length||d?j`
      ${o.map(({eid:t,label:e,color:i})=>{const s=t&&parseFloat(this.hass.states[t]?.state)||0,r=Math.max(0,Math.min(100,s));return j`
          <div class="res-item">
            <span class="res-label">${e}</span>
            <div class="res-bar-wrap">
              <div
                class="res-bar-fill"
                style="width:${r.toFixed(1)}%;background:${i}"
              ></div>
            </div>
            <span class="res-val" style="color:${i}"
              >${Math.round(s)}%</span
            >
          </div>
        `})}
      ${d?j`
            <div class="res-item">
              <span class="res-label">Battery</span>
              <div class="res-bar-wrap">
                <div
                  class="res-bar-fill"
                  style="width:${p.toFixed(1)}%;background:${h}"
                ></div>
              </div>
              <span class="res-val" style="color:${h}">
                ${null!==c?c.toFixed(1)+"V":"—"}
              </span>
            </div>
          `:""}
    `:j``}_renderPicker(){const t=Object.values(this.hass.devices??{}).filter(t=>t.identifiers?.some(([t])=>"smartvanio"===t)).map(t=>({id:t.identifiers.find(([t])=>"smartvanio"===t)[1],name:t.name_by_user??t.name})).sort((t,e)=>t.name.localeCompare(e.name));return j`
      <div class="picker">
        <div class="picker-title">VanCtl HMI</div>
        <div class="picker-sub">Select a device</div>
        ${t.map(t=>j`
            <div
              class="picker-row"
              @click=${()=>{this._selectedId=t.id}}
            >
              <span class="picker-name">${t.name}</span>
              <span class="picker-id">${t.id}</span>
            </div>
          `)}
        ${t.length?"":j`<div class="picker-empty">No VanCtl devices found.</div>`}
      </div>
    `}render(){if(!this.hass)return j``;const t=this._resolveSlots(),e=this._entities();if(!this._selectedId){const t=Object.values(this.hass.devices??{}).filter(t=>t.identifiers?.some(([t])=>"smartvanio"===t));t.length&&(this._selectedId=t[0].identifiers.find(([t])=>"smartvanio"===t)[1])}if(!e&&!this._allSmartvanioDeviceIds().size)return j`<div class="picker"><div class="picker-title">SmartVan.io</div><div class="picker-empty">No devices found. Add a device via Settings → Devices & Services.</div></div>`;const i=e??{lights:[],switches:[],sensors:[],binary_sensors:[],numbers:[],selects:[]},s=this._levelEntities(t),r=(t,e)=>{const i=(t??[]).map(({entity:t,name:e})=>({eid:t,state:this.hass.states[t],_slotName:e})).filter(t=>t.eid&&this.hass.states[t.eid]),s=new Set(i.map(t=>t.eid));return[...i,...e.filter(t=>!s.has(t.eid))]},a=r(t?.lights,i.lights);r(t?.switches,this._powerSwitches(i.switches));const n=(new Date).getHours(),o=n<12?"Good Morning":n<18?"Good Afternoon":"Good Evening",l=t?.topbarStats??[],d=this._getTankData(i,t);let c=null;if(!l.length){const e=t?.temperature??i.sensors.find(({eid:t})=>/temperature/.test(t)&&!/heater/.test(t))?.eid,s=e&&parseFloat(this.hass.states[e]?.state)||null,r=i.sensors.find(({eid:t})=>/battery/.test(t))?.eid,a=r?parseFloat(this.hass.states[r]?.state):null,n=null!==a?Math.max(0,Math.min(100,(a-11.5)/1.7*100)):null,o=d.find(t=>/water/i.test(t.label)),l=d.find(t=>/waste|grey/i.test(t.label));c={cabinTemp:s,battV:a,battPct:n,waterTank:o,wasteTank:l}}return j`
      <div class="hmi">
        <!-- Top bar -->
        <div class="top-bar">
          <span class="tb-greeting">${o} <span style="font-size:10px;opacity:0.4;font-weight:400">v159</span></span>
          <div class="tb-stats">
            ${l.length?l.map(({entity:t,name:e,icon:i},s)=>{const r=this.hass.states[t];if(!r)return"";const a=r.state,n=r.attributes?.unit_of_measurement??"",o=i&&i.length>0?i:r.attributes?.icon||"mdi:eye",l="unavailable"===a?"—":(parseFloat(a)==parseFloat(a)?Number.isInteger(parseFloat(a))?a:parseFloat(a).toFixed(1):a)+(n?" "+n:"");return j`
                ${s>0?j`<span class="tb-divider"></span>`:""}
                <span class="tb-stat ${this._setupMode?"setup":""}"
                      @click=${()=>{this._setupMode&&this._openEditFooterModal("topbarStats",s)}}>
                  <ha-icon icon="${o}" style="--mdc-icon-size:20px"></ha-icon>
                  ${e?j`<span class="tb-stat-label">${e}</span>`:""}
                  ${l}
                </span>
              `}):c?j`
              ${null!==c.battV?j`
                <span class="tb-stat">
                  <ha-icon icon="mdi:battery" style="--mdc-icon-size:14px; color:${c.battPct>50?"var(--sv-green)":c.battPct>20?"var(--sv-amber)":"var(--sv-red)"}"></ha-icon>
                  ${c.battV.toFixed(1)}V ${Math.round(c.battPct)}%
                </span>
              `:""}
              ${c.waterTank?j`
                <span class="tb-stat">
                  <ha-icon icon="mdi:water" style="--mdc-icon-size:14px; color:var(--sv-accent)"></ha-icon>
                  ${Math.round(c.waterTank.value)}%
                </span>
              `:""}
              ${c.wasteTank?j`
                <span class="tb-stat">
                  <ha-icon icon="mdi:delete-empty" style="--mdc-icon-size:14px; color:var(--sv-amber)"></ha-icon>
                  ${Math.round(c.wasteTank.value)}%
                </span>
              `:""}
              ${null!==c.cabinTemp?j`
                <span class="tb-stat">
                  <ha-icon icon="mdi:thermometer" style="--mdc-icon-size:14px"></ha-icon>
                  ${c.cabinTemp.toFixed(0)}°C
                </span>
              `:""}
            `:""}
            ${this._setupMode?j`
              <span class="tb-stat-add" @click=${()=>this._openNewFooterModal("stat")}>
                <ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon>
              </span>
            `:""}
          </div>
          <div class="tb-right">
            <span class="tb-time">${(new Date).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</span>
            ${this._layoutMode?j`
              <button class="setup-cancel-btn" @click=${()=>this._cancelLayoutMode()}>Cancel</button>
              <button class="setup-save-btn" @click=${()=>this._saveLayoutMode()}>Save</button>
            `:this._setupMode?j`
              <button class="setup-cancel-btn" @click=${()=>this._cancelSetupMode()}>Cancel</button>
              <button class="setup-save-btn" @click=${()=>this._saveSetupMode()}>Save</button>
            `:j`
              <span class="tb-cfg ${this._navDrawerOpen?"active":""}"
                    @click=${()=>this._openNavDrawer()} title="Menu">
                <ha-icon icon="mdi:menu" style="--mdc-icon-size:24px"></ha-icon>
              </span>
            `}
          </div>
        </div>

        ${"devices"===this._page?this._renderDevicesPage(i,t):j`
        <div class="main-content">
          <!-- Scene carousel -->
          ${this._renderSceneCarousel()}

          <!-- Two-column control area (right panel collapsible) -->
          <div class="control-area ${this._showRightPanel?"":"solo-left"}">
            <!-- Left: lights list -->
            ${this._renderLightsPanel(a)}

            <!-- Right: climate / level swipeable -->
            ${this._showRightPanel?this._renderRightPanel(i,t,s):""}
          </div>
        </div>

        <!-- Footer -->
        ${this._renderFooter(i,t)}
        `}

        ${this._renderAutoModal()}
        ${this._renderTilePopover()}
        ${this._navDrawerOpen?this._renderNavDrawer():""}
        ${this._renderClimateTab()}
        ${this._footerModal?this._renderFooterModal():""}
        ${this._lightModal?this._renderLightModal():""}
        ${this._editingScene?j`
          <smartvanio-modal-scene
            .hass=${this.hass}
            editing-scene=${this._editingScene}
            .sceneEditName=${this._sceneEditName}
            .sceneEditLights=${this._sceneEditLights}
            ?scene-edit-saving=${this._sceneEditSaving}
            device-id=${this._selectedId}
            .lightOptions=${this._getSceneLightOptions()}
            .allScenes=${this._deviceScenes().map(({eid:t,state:e})=>({id:e.attributes.scene_id,name:this._label(t)}))}
            @smartvanio-modal-close=${()=>{this._editingScene=null}}
            @smartvanio-update-scene-name=${t=>{this._sceneEditName=t.detail.value}}
            @smartvanio-capture-scene-state=${()=>this._captureSceneState()}
            @smartvanio-add-scene-light=${t=>this._addSceneLight(t.detail.entity_id)}
            @smartvanio-remove-scene-light=${t=>this._removeSceneLight(t.detail.entity_id)}
            @smartvanio-update-scene-light=${t=>this._updateSceneLight(t.detail.entity_id,t.detail.field,t.detail.value)}
            @smartvanio-save-scene=${()=>this._saveScene()}
            @smartvanio-delete-scene=${()=>this._deleteScene()}
          ></smartvanio-modal-scene>
        `:""}
        ${this._editingEntity?j`
              <smartvanio-modal-edit
                .hass=${this.hass}
                entity-id=${this._editingEntity}
                edit-name=${this._editName}
                edit-area=${this._editArea??""}
                .editRows=${this._editRows}
                ?edit-saving=${this._editSaving}
                ?edit-loading=${this._editLoading}
                ?is-button=${this._editingEntity.startsWith("button.")||this._editingEntity.startsWith("binary_sensor.")}
                ?is-switch=${this._editingEntity.startsWith("switch.")}
                .switchMode=${this._switchMode}
                ?is-light=${this._editingEntity.startsWith("light.")&&this._isSmartvanioLight(this._editingEntity)}
                ?is-tank=${this._editingEntity.startsWith("sensor.")&&("volume"===this.hass.states[this._editingEntity]?.attributes?.device_class||this._editingEntity.includes("tank"))}
                ?is-sensor=${this._editingEntity.startsWith("sensor.")}
                .lightSegments=${this._lightSegments}
                .lightPatterns=${this._lightPatterns}
                .entityPatterns=${this._getEntityPatterns(this._editingEntity)}
                active-pattern=${(()=>{const t=this._getActivePatternName(this._editingEntity);return t?`${this._editingEntity}:${t}`:""})()}
                max-leds=${this._maxLeds}
                .targetEntities=${this._getTargetEntities()}
                .sourceEntities=${this._getSourceEntities()}
                save-error=${this._saveError??""}
                @smartvanio-modal-close=${()=>{this._restoreOnCancel(),this._editingEntity=null,this._saveError=null}}
                @smartvanio-light-toggle=${()=>{const t=this._editingEntity;t&&this._toggleLight(t)}}
                @smartvanio-light-brightness=${t=>{const e=this._editingEntity;if(!e)return;const i=t.detail.brightness;if(i>0){const t={entity_id:e,brightness:Math.round(2.55*i)};this._getActivePatternName(e)||(t.effect="None"),this.hass.callService("light","turn_on",t)}else this.hass.callService("light","turn_off",{entity_id:e})}}
                @smartvanio-light-color=${t=>{const e=this._editingEntity;e&&(this._activePatterns?.delete(e),this.hass.callService("light","turn_on",{entity_id:e,rgb_color:t.detail.rgb,effect:"None"}))}}
                @smartvanio-light-pattern=${t=>{const e=this._editingEntity;e&&this._applyPattern(e,t.detail.name,t.detail.stops)}}
                @smartvanio-update-edit-name=${t=>{this._editName=t.detail.value}}
                @smartvanio-update-edit-area=${t=>{this._editArea=t.detail.value}}
                @smartvanio-add-edit-row=${()=>{const t=this._editingEntity,e=t?.split(".")?.[0],i="binary_sensor"===e||"button"===e||"switch"===e,s=i?"switch"===e?"off_to_on":"press":"";this._editRows=[...this._editRows,{id:null,source_entity_id:i?t:"",gesture:s,target_entity_id:i?"":t,action:"",duration:"",brightness_pct:""}]}}
                @smartvanio-remove-edit-row=${t=>{this._editRows=this._editRows.filter((e,i)=>i!==t.detail.id)}}
                @smartvanio-update-edit-row=${t=>{const{id:e,field:i,value:s}=t.detail;this._editRows=this._editRows.map((t,r)=>{if(r!==e)return t;const a={...t,[i]:s};if("source_entity_id"===i){const t=s?.split(".")?.[0];a.gesture="binary_sensor"===t||"button"===t?"press":"switch"===t||"light"===t||"fan"===t||"cover"===t||"lock"===t?"off_to_on":""}return"target_entity_id"===i&&(a.action="",a.duration="",a.brightness_pct=""),"action"===i&&(a.duration="",a.brightness_pct=""),a})}}
                @smartvanio-add-segment=${()=>{const t=this._lightSegments.length?Math.max(...this._lightSegments.map(t=>t.end))+1:0,e=Math.min(t+9,Math.max((this._maxLeds||100)-1,t));this._lightSegments=[...this._lightSegments,{id:`seg_${Date.now()}`,name:"",start:t,end:e,r:255,g:255,b:255,brightness:100,parent_entity_id:this._editingEntity}],setTimeout(()=>this._sendSegmentPreview(),100)}}
                @smartvanio-remove-segment=${t=>{this._lightSegments=this._lightSegments.filter((e,i)=>(e.id??i)!==t.detail.id),setTimeout(()=>this._sendSegmentPreview(),100)}}
                @smartvanio-update-segment=${t=>{const{id:e,field:i,value:s}=t.detail;"maxLeds"!==i?this._lightSegments=this._lightSegments.map((t,r)=>{if((t.id??r)!==e)return t;if("color"===i){const e=parseInt(s.slice(1,3),16),i=parseInt(s.slice(3,5),16),r=parseInt(s.slice(5,7),16);return{...t,r:e,g:i,b:r}}return{...t,[i]:s}}):this._maxLeds=s}}
                @smartvanio-add-segment-at=${t=>{const{start:e,end:i}=t.detail;this._lightSegments=[...this._lightSegments,{id:`seg_${Date.now()}`,name:"",start:e,end:i,r:255,g:255,b:255,brightness:100,parent_entity_id:this._editingEntity}],setTimeout(()=>this._sendSegmentPreview(),100)}}
                @smartvanio-segment-preview=${()=>this._sendSegmentPreview()}
                @smartvanio-pattern-preview=${t=>this._sendPatternPreview(t.detail.stops)}
                @smartvanio-save-pattern=${t=>this._savePattern(t.detail.name,t.detail.stops)}
                @smartvanio-delete-pattern=${t=>this._deletePattern(t.detail.name)}
                @smartvanio-save-edit=${t=>this._saveEdit(t.detail)}
              ></smartvanio-modal-edit>
            `:""}
        ${this._deviceModal?j`
              <smartvanio-modal-device
                .hass=${this.hass}
                .device=${this._deviceModal.device}
                device-id=${this._deviceModal.deviceId??""}
                .entities=${this._deviceModal.entities}
                .inCardEids=${this._deviceModal.inCardEids}
                .slots=${this._deviceModal.slots}
                @smartvanio-device-modal-close=${()=>{this._deviceModal=null}}
                @smartvanio-device-add-entity=${t=>{this._addEntityToCard(t.detail.eid,t.detail.domain),this._refreshDeviceModal()}}
                @smartvanio-device-remove-entity=${t=>{this._removeEntityFromCard(t.detail.eid,t.detail.domain),this._refreshDeviceModal()}}
              ></smartvanio-modal-device>
            `:""}

      </div>
    `}static get styles(){return a`
      :host {
        display: block;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
        -webkit-font-smoothing: antialiased;
        background: var(--sv-bg-base);
        color: var(--sv-text-primary);

        /* ── Dark theme (default) ── */
        --sv-bg-base: #050509;
        --sv-bg-surface: #141420;
        --sv-bg-elevated: #1C1C2A;
        --sv-bg-rail: #08080C;
        --sv-bg-input: #212830;
        --sv-bg-overlay: rgba(22,27,34,0.96);
        --sv-border: #2A2A38;
        --sv-border-subtle: #1E1E2A;
        --sv-text-primary: #E8E8F0;
        --sv-text-heading: var(--sv-text-heading);
        --sv-text-secondary: #9898AA;
        --sv-text-disabled: #55556A;
        --sv-accent: #4A9EFF;
        --sv-accent-hover: var(--sv-accent-hover);
        --sv-accent-muted: rgba(74, 158, 255, 0.15);
        --sv-green: #34C759;
        --sv-amber: #FFB830;
        --sv-red: #FF453A;
        --sv-orange: #FF9F0A;
        --sv-radius: 16px;
        --sv-radius-sm: 8px;
        --sv-gauge-track: #151b23;
        --sv-gauge-inactive: #30363d;
        --sv-tile-off-bg: rgba(28,28,30,0.65);
        --sv-shadow: rgba(0,0,0,0.4);
        --sv-nebula-1: rgba(74, 158, 255, 0.08);
        --sv-nebula-2: rgba(138, 80, 255, 0.06);

        color-scheme: dark;

        /* Legacy HA vars */
        --primary-color: var(--sv-accent);
        --primary-text-color: var(--sv-text-primary);
        --secondary-text-color: var(--sv-text-secondary);
        --secondary-background-color: var(--sv-bg-surface);
        --card-background-color: var(--sv-bg-surface);
        --divider-color: var(--sv-border-subtle);
        --error-color: var(--sv-red);
        --warning-color: var(--sv-amber);
        --disabled-color: var(--sv-text-disabled);
        --slider-track: var(--sv-border-subtle);
        --tile-bg: var(--sv-bg-surface);
        --tile-border: var(--sv-border-subtle);
      }

      /* ── Light theme ── */
      :host([theme="light"]) {
        --sv-bg-base: #FDF8F0;
        --sv-bg-surface: #FFFFFF;
        --sv-bg-elevated: #F5EDE0;
        --sv-bg-rail: #FAF4EA;
        --sv-bg-input: #F0E8D8;
        --sv-bg-overlay: rgba(255,252,245,0.97);
        --sv-border: #E0D5C0;
        --sv-border-subtle: #EDE5D5;
        --sv-text-primary: #2C2416;
        --sv-text-heading: #1A1208;
        --sv-text-secondary: #8A7D6B;
        --sv-text-disabled: #C0B5A0;
        --sv-accent: #D4880A;
        --sv-accent-hover: #E09A1A;
        --sv-accent-muted: rgba(212, 136, 10, 0.12);
        --sv-green: #2D9B46;
        --sv-amber: #D4880A;
        --sv-red: #CC3B30;
        --sv-orange: #D4720A;
        --sv-gauge-track: #EDE5D5;
        --sv-gauge-inactive: #E0D5C0;
        --sv-tile-off-bg: rgba(240,232,216,0.65);
        --sv-shadow: rgba(120,100,70,0.12);
        --sv-nebula-1: rgba(212, 136, 10, 0.06);
        --sv-nebula-2: rgba(180, 120, 60, 0.04);
        color-scheme: light;
      }

      /* ── Layout ─────────────────────────────────────────── */

      .hmi {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 400px;
        background:
          radial-gradient(ellipse 80% 60% at 15% 20%, var(--sv-nebula-1) 0%, transparent 60%),
          radial-gradient(ellipse 60% 80% at 85% 75%, var(--sv-nebula-2) 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 50% 50%, var(--sv-nebula-1) 0%, transparent 50%),
          var(--sv-bg-base);
        border-radius: 0;
        overflow: hidden;
        position: relative;
      }

      /* ── Top bar ────────────────────────────────────────── */

      .top-bar {
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px 0 24px;
        background: var(--sv-bg-rail);
        border-bottom: 1px solid var(--sv-border);
        flex-shrink: 0;
        z-index: 20;
      }

      .tb-greeting {
        font-size: 16px;
        font-weight: 500;
      }

      .tb-stats {
        display: flex;
        align-items: center;
        gap: 14px;
        font-size: 16px;
        color: var(--sv-text-secondary);
      }

      .tb-divider {
        width: 1px;
        height: 18px;
        background: var(--sv-border);
        opacity: 0.5;
      }

      .tb-stat {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .tb-stat.setup {
        cursor: pointer;
        border-radius: 4px;
        padding: 2px 6px;
        margin: -2px -6px;
        border: 1px dashed transparent;
      }
      .tb-stat.setup:hover {
        border-color: var(--sv-accent);
      }

      .tb-stat-label {
        opacity: 0.7;
      }

      .tb-stat-add {
        display: flex;
        align-items: center;
        cursor: pointer;
        color: var(--sv-text-secondary);
        border: 1px dashed var(--sv-border);
        border-radius: 4px;
        padding: 2px 6px;
        transition: all 0.2s;
      }
      .tb-stat-add:hover {
        border-color: var(--sv-accent);
        color: var(--sv-accent);
      }

      .tb-right {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .tb-time {
        font-size: 14px;
        color: var(--sv-text-secondary);
      }

      .tb-cfg {
        width: 44px;
        height: 44px;
        border-radius: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--sv-text-secondary);
        background: transparent;
        transition: background 0.15s, color 0.15s;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }
      .tb-cfg:hover  { background: rgba(255,255,255,0.06); color: var(--sv-text-primary); }
      .tb-cfg:active { background: rgba(255,255,255,0.10); }
      .tb-cfg.active { background: var(--sv-accent-muted); color: var(--sv-accent); }

      /* ── Nav drawer ────────────────────────────────────── */

      .nd-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        z-index: 9000;
        display: flex;
        justify-content: flex-end;
        animation: nd-fade-in 0.18s ease-out;
      }
      @keyframes nd-fade-in {
        from { background: rgba(0, 0, 0, 0); }
        to   { background: rgba(0, 0, 0, 0.55); }
      }

      .nd-panel {
        background: var(--sv-bg-surface);
        border-left: 1px solid var(--sv-border);
        width: min(360px, 100%);
        height: 100dvh;
        display: flex;
        flex-direction: column;
        box-shadow: -12px 0 40px rgba(0, 0, 0, 0.5);
        animation: nd-slide-in 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes nd-slide-in {
        from { transform: translateX(100%); }
        to   { transform: translateX(0); }
      }

      .nd-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 18px;
        border-bottom: 1px solid var(--sv-border-subtle);
        flex-shrink: 0;
      }
      .nd-title {
        font-size: 17px;
        font-weight: 600;
        color: var(--sv-text-heading);
      }
      .nd-close {
        width: 44px;
        height: 44px;
        border-radius: 22px;
        background: var(--sv-bg-elevated);
        border: 1px solid var(--sv-border);
        color: var(--sv-text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        touch-action: manipulation;
        transition: background 0.15s, color 0.15s;
      }
      .nd-close:hover { background: var(--sv-border); color: var(--sv-text-primary); }

      .nd-body {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 8px 10px 16px;
        overscroll-behavior: contain;
      }

      .nd-section-label {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: var(--sv-text-disabled);
        padding: 16px 12px 6px;
      }

      .nd-row {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 12px;
        background: transparent;
        border: none;
        border-radius: 10px;
        color: var(--sv-text-primary);
        cursor: pointer;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        min-height: 56px;
        font-family: inherit;
        text-align: left;
      }
      .nd-row:hover  { background: var(--sv-bg-elevated); }
      .nd-row:active { background: var(--sv-border-subtle); }

      .nd-row-icon { color: var(--sv-text-secondary); flex-shrink: 0; }
      .nd-row-label {
        flex: 1;
        font-size: 16px;
        font-weight: 500;
        color: var(--sv-text-primary);
      }
      .nd-row-state {
        font-size: 13px;
        color: var(--sv-text-secondary);
        background: var(--sv-bg-elevated);
        padding: 4px 10px;
        border-radius: 12px;
      }
      .nd-row-state.on {
        color: var(--sv-accent);
        background: var(--sv-accent-muted);
      }
      .nd-row-chevron {
        color: var(--sv-text-disabled);
        --mdc-icon-size: 20px;
      }

      /* ── Climate panel edge tab ────────────────────────── */

      .ct-tab {
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 32px;
        height: 140px;
        border-radius: 14px 0 0 14px;
        background: var(--sv-bg-elevated);
        border: 1px solid var(--sv-border);
        border-right: none;
        color: var(--sv-text-secondary);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 14px 0;
        box-shadow: -4px 0 16px rgba(0, 0, 0, 0.35);
        cursor: pointer;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        transition: background 0.15s, color 0.15s, transform 0.18s;
        z-index: 50;
      }
      .ct-tab:hover  { background: var(--sv-border); color: var(--sv-text-primary); }
      .ct-tab:active { transform: translateY(-50%) translateX(-1px); }
      .ct-tab.open {
        background: var(--sv-accent-muted);
        color: var(--sv-accent);
        border-color: transparent;
      }
      .ct-tab-chev { flex-shrink: 0; }
      .ct-tab-label {
        writing-mode: vertical-rl;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        user-select: none;
      }

      /* ── Main content ──────────────────────────────────── */

      .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      /* ── Scene carousel ────────────────────────────────── */

      .sc-hero {
        padding: 20px 24px 16px;
        flex-shrink: 0;
      }

      .sc-label {
        font-size: 12px;
        color: var(--sv-text-disabled);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin: 0 0 12px;
        font-weight: 600;
      }

      .sc-carousel {
        display: flex;
        gap: 12px;
        overflow-x: auto;
        padding-bottom: 4px;
        scroll-snap-type: x mandatory;
      }

      .sc-carousel::-webkit-scrollbar { height: 0; }

      .sc-card {
        flex-shrink: 0;
        width: 160px;
        height: 100px;
        border-radius: var(--sv-radius);
        background: var(--sv-bg-surface);
        border: 1px solid var(--sv-border);
        padding: 16px;
        cursor: pointer;
        transition: all 0.25s;
        scroll-snap-align: start;
        user-select: none;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      .sc-card:active { transform: scale(0.96); }
      .sc-card:hover { border-color: rgba(74, 158, 255, 0.4); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25); }
      .sc-card.active { border-color: var(--sv-accent); box-shadow: 0 0 12px rgba(74, 158, 255, 0.35), 0 4px 16px rgba(0, 0, 0, 0.25); }

      .sc-card-icon {
        color: rgba(255, 255, 255, 0.85);
        --mdc-icon-size: 32px;
        filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
      }

      .sc-card-name {
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
      }

      .sc-dots {
        display: flex;
        gap: 4px;
      }

      .sc-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
      }

      .sc-card-add {
        border-style: dashed;
        opacity: 0.6;
      }

      /* ── Control area (two-column) ─────────────────────── */

      .control-area {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0;
        overflow: hidden;
        border-top: 1px solid var(--sv-border);
      }

      /* Right panel collapsed — lights take the full width */
      .control-area.solo-left {
        grid-template-columns: 1fr;
      }
      .control-area.solo-left .lp-panel {
        border-right: none;
      }

      /* Below this width, side-by-side would squeeze the lights panel narrower
         than 2 tile-columns can fit. Stack instead so the lights grid keeps the
         same column count whether the right panel is open or closed. */
      @media (max-width: 900px) {
        .control-area {
          grid-template-columns: 1fr;
          grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
        }
        .control-area.solo-left {
          grid-template-rows: 1fr;
        }
        .lp-panel {
          border-right: none;
          border-bottom: 1px solid var(--sv-border);
        }
        .control-area.solo-left .lp-panel {
          border-bottom: none;
        }
      }

      /* ── Lights panel (left) ───────────────────────────── */

      .lp-panel {
        padding: 16px 20px;
        overflow-y: auto;
        border-right: 1px solid var(--sv-border);
        touch-action: pan-y;
        overscroll-behavior: contain;
        /* Enables @container queries below — tile column count is driven by
           the panel's actual width, not the viewport, so side-by-side mode
           shrinks the columns correctly. */
        container-type: inline-size;
      }

      .lp-panel::-webkit-scrollbar { width: 3px; }
      .lp-panel::-webkit-scrollbar-thumb { background: var(--sv-border); border-radius: 2px; }

      .lp-label {
        font-size: 14px;
        color: var(--sv-text-disabled);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin: 0 0 16px;
        font-weight: 600;
      }

      .lp-count {
        font-weight: 400;
        margin-left: 8px;
        color: var(--sv-text-secondary);
        text-transform: none;
        letter-spacing: 0;
      }

      .lp-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
      }

      /* Column count is driven by .lp-panel's width (container query).
         Bumped breakpoints so each tile has room for icon + name + 48px power
         button without text truncation at typical names. */
      @container (min-width: 600px) {
        .lp-list { grid-template-columns: repeat(2, 1fr); }
      }
      @container (min-width: 880px) {
        .lp-list { grid-template-columns: repeat(3, 1fr); }
      }
      @container (min-width: 1160px) {
        .lp-list { grid-template-columns: repeat(4, 1fr); }
      }

      .lp-add-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 10px 16px;
        border: 1px dashed var(--sv-border);
        border-radius: var(--sv-radius);
        color: var(--sv-text-secondary);
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
        grid-column: 1 / -1;
      }
      .lp-add-btn:hover {
        border-color: var(--sv-accent);
        color: var(--sv-accent);
      }

      .lp-row {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 18px;
        min-height: 96px;
        background: var(--sv-bg-surface);
        border: 1px solid var(--sv-border);
        border-radius: var(--sv-radius);
        transition: all 0.25s;
        user-select: none;
        cursor: pointer;
        touch-action: manipulation;
      }

      .lp-row:active:not(.unavail):not(.expanded) { transform: scale(0.99); }

      .lp-row.on {
        border-color: rgba(74, 158, 255, 0.2);
        background: var(--sv-bg-elevated);
      }



      .lp-header {
        display: flex;
        align-items: center;
        gap: 16px;
        width: 100%;
        cursor: pointer;
        min-height: 48px;
      }

      .lp-icon { flex-shrink: 0; }

      .lp-info { flex: 1; min-width: 0; }

      .lp-power {
        flex-shrink: 0;
        background: none;
        border: none;
        cursor: pointer;
        padding: 12px;
        min-width: 48px;
        min-height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.15s;
      }
      .lp-power:hover { background: rgba(255,255,255,0.05); }
      .lp-power:active { background: rgba(255,255,255,0.1); }

      .lp-name {
        font-size: 17px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
      }

      .lp-name-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }

      .lp-type {
        font-size: 11px;
        font-weight: 500;
        padding: 2px 6px;
        border-radius: 4px;
        background: var(--sv-bg-surface);
        border: 1px solid var(--sv-border);
        color: var(--sv-text-disabled);
        white-space: nowrap;
        flex-shrink: 0;
      }

      .lp-bri {
        font-size: 14px;
        color: var(--sv-text-disabled);
        margin-top: 3px;
      }

      /* ── Right panel (climate / level swipeable) ────────── */

      /* ── Swiper core styles (needed inside shadow DOM) ── */
      .swiper {
        overflow: hidden;
        position: relative;
      }
      .swiper-wrapper {
        display: flex;
        transition-property: transform;
        box-sizing: content-box;
      }
      .swiper-slide {
        flex-shrink: 0;
        width: 100%;
        position: relative;
      }
      .swiper-pagination {
        position: absolute;
        bottom: 4px;
        left: 0;
        width: 100%;
        text-align: center;
        z-index: 10;
      }
      .swiper-pagination-bullet {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--sv-text-disabled, #555);
        opacity: 1;
        margin: 0 3px;
        cursor: pointer;
      }
      .swiper-pagination-bullet-active {
        background: var(--sv-accent, #4fc3f7);
      }

      .rp-swiper {
        width: 100%;
        height: 100%;
      }

      .rp-page {
        height: 100%;
        overflow-y: auto;
        padding: 0 0 16px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .rp-page::-webkit-scrollbar { width: 3px; }
      .rp-page::-webkit-scrollbar-thumb { background: var(--sv-border); border-radius: 2px; }

      /* ── Overview panel ──────────────────────────────────── */

      .ov-panel {
        padding: 12px 16px;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
      }

      .ov-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        width: 100%;
      }

      .ov-card {
        background: var(--sv-bg-surface);
        border: 1px solid var(--sv-border);
        border-radius: var(--sv-radius-sm);
        padding: 10px 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .ov-card-header {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .ov-card-title {
        font-size: 11px;
        font-weight: 600;
        color: var(--sv-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .ov-card-value {
        font-size: 22px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        line-height: 1.1;
      }

      .ov-card-value-sm {
        font-size: 14px;
        font-weight: 600;
      }

      .ov-card-sub {
        font-size: 12px;
        font-weight: 400;
        color: var(--sv-text-secondary);
        margin-left: 4px;
      }

      .ov-action {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        margin-top: 2px;
        background: rgba(255, 69, 58, 0.1);
        border: 1px solid rgba(255, 69, 58, 0.25);
        border-radius: 6px;
        color: var(--sv-red);
        font-size: 11px;
        font-weight: 500;
        cursor: pointer;
        align-self: flex-start;
        transition: background 0.15s;
      }
      .ov-action:hover {
        background: rgba(255, 69, 58, 0.2);
      }

      .ov-power-rows {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .ov-power-row {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
      }

      .ov-power-label {
        color: var(--sv-text-secondary);
      }

      .ov-power-val {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      .ov-card-area {
        cursor: pointer;
        transition: background 0.2s, border-color 0.2s;
      }
      .ov-card-area:hover {
        background: var(--sv-bg-elevated);
      }
      .ov-card-area.active {
        border-color: rgba(255, 184, 48, 0.25);
        background: rgba(255, 184, 48, 0.05);
      }

      .ov-area-status {
        font-size: 13px;
        font-weight: 600;
      }

      .ov-card-action {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: background 0.2s;
      }
      .ov-card-action:hover {
        background: rgba(255, 69, 58, 0.1);
      }

      /* ── Devices page ──────────────────────────────────── */

      .dev-page {
        flex: 1;
        overflow-y: auto;
        padding: 16px 20px;
      }
      .dev-page::-webkit-scrollbar { width: 3px; }
      .dev-page::-webkit-scrollbar-thumb { background: var(--sv-border); border-radius: 2px; }

      .dev-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 12px;
      }

      .dev-card {
        background: var(--sv-bg-surface);
        border: 1px solid var(--sv-border);
        border-radius: var(--sv-radius-sm);
        padding: 14px 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .dev-card-header {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .dev-card-status {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
        background: var(--sv-text-disabled);
      }
      .dev-card-status.online { background: var(--sv-green); box-shadow: 0 0 6px var(--sv-green); }
      .dev-card-status.offline { background: var(--sv-red); }
      .dev-card-status.unknown { background: var(--sv-text-disabled); }

      .dev-card-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .dev-card-name {
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .dev-card-meta {
        font-size: 11px;
        color: var(--sv-text-disabled);
      }

      .dev-card-link {
        color: var(--sv-text-secondary);
        opacity: 0.5;
        transition: opacity 0.15s, color 0.15s;
        cursor: pointer;
        text-decoration: none;
        flex-shrink: 0;
      }
      .dev-card-link:hover { opacity: 1; color: var(--sv-accent); }

      .dev-card-cfg {
        color: var(--sv-text-secondary);
        opacity: 0.5;
        transition: opacity 0.15s, color 0.15s;
        cursor: pointer;
        flex-shrink: 0;
      }
      .dev-card-cfg:hover { opacity: 1; color: var(--sv-accent); }

      .dev-card-stats {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--sv-text-secondary);
      }
      .dev-stat-sep { opacity: 0.3; }
      .dev-stat.in { color: var(--sv-green); }
      .dev-stat.out { color: var(--sv-text-disabled); }

      /* ── Footer bar ─────────────────────────────────────── */

      .ft-bar {
        min-height: 68px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0 0 20px;
        background: var(--sv-bg-rail);
        border-top: 1px solid var(--sv-border);
        flex-shrink: 0;
        z-index: 20;
      }

      .ft-tanks {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        position: relative;
      }

      .ft-tank {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
        cursor: default;
        user-select: none;
        min-width: 90px;
      }

      .ft-tank-top {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ft-tank-text {
        display: flex;
        flex-direction: column;
        min-width: 0;
        flex: 1;
      }

      .ft-tank-label {
        font-size: 13px;
        color: var(--sv-text-secondary);
        line-height: 1.2;
      }

      .ft-tank-pct {
        font-size: 13px;
        font-weight: 600;
        line-height: 1.2;
      }

      .ft-tank-sub {
        font-size: 11px;
        font-weight: 400;
        color: var(--sv-text-secondary);
        margin-left: 4px;
      }

      .ft-power-inline {
        font-size: 11px;
        font-weight: 400;
        color: var(--sv-text-secondary);
        margin-left: 6px;
      }
      .ft-power-inline span + span::before {
        content: ' · ';
      }

      .ft-tank-bar {
        width: 100%;
        height: 4px;
        background: var(--sv-border);
        border-radius: 2px;
        overflow: hidden;
      }

      .ft-tank-fill {
        height: 100%;
        border-radius: 2px;
        transition: width 0.5s;
      }

      .ft-tank-add {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 6px 14px;
        border-radius: var(--sv-radius-sm);
        background: var(--sv-bg-surface);
        border: 1px dashed var(--sv-border);
        cursor: pointer;
        color: var(--sv-text-secondary);
        font-size: 12px;
        transition: all 0.2s;
        align-self: center;
        flex-shrink: 0;
      }

      .ft-add-wrap {
        position: relative;
        display: flex;
        align-items: center;
      }

      .ft-tank-add:hover { border-color: var(--sv-accent); color: var(--sv-accent); }

      .ft-sw-add {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 14px;
        background: none;
        border: none;
        border-left: 1px dashed var(--sv-border);
        border-radius: 0;
        cursor: pointer;
        color: var(--sv-text-secondary);
        transition: background 0.2s, color 0.2s;
      }

      .ft-sw-add:hover { background: var(--sv-bg-elevated); color: var(--sv-accent); }

      .ft-add-backdrop {
        position: fixed;
        inset: 0;
        z-index: 99;
      }

      .ft-add-menu {
        position: absolute;
        bottom: calc(100% + 6px);
        left: 0;
        z-index: 100;
        background: var(--sv-bg-elevated);
        border: 1px solid var(--sv-border);
        border-radius: var(--sv-radius-sm);
        padding: 4px 0;
        min-width: 140px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.4);
      }

      .ft-add-menu-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        cursor: pointer;
        color: var(--sv-text-primary);
        font-size: 13px;
        transition: background 0.15s;
      }

      .ft-add-menu-item:hover {
        background: var(--sv-bg-surface);
        color: var(--sv-accent);
      }

      .ft-power-stats {
        display: flex;
        gap: 6px;
        margin-top: 2px;
      }

      .ft-power-badge {
        font-size: 10px;
        color: var(--sv-text-secondary);
        background: var(--sv-bg-surface);
        padding: 1px 5px;
        border-radius: 4px;
      }

      .ft-power-badge.solar {
        color: var(--sv-amber);
      }

      .ft-right {
        display: flex;
        align-items: stretch;
        align-self: stretch;
      }

      .ft-sw {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 0 16px;
        background: none;
        border: none;
        border-left: 1px solid var(--sv-border);
        border-radius: 0;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: background 0.2s, color 0.2s;
        user-select: none;
        color: var(--sv-text-secondary);
      }

      .ft-sw:hover { background: var(--sv-bg-elevated); }
      .ft-sw:active { background: var(--sv-bg-surface); }
      .ft-sw.on { color: var(--sv-text-primary); }

      .ft-sw.icon-only {
        padding: 0 14px;
        color: var(--sv-text-disabled);
        transition: background 0.2s, color 0.2s;
      }
      .ft-sw.icon-only.on {
        color: var(--ft-sw-color, var(--sv-accent));
        background: color-mix(in srgb, var(--ft-sw-color, var(--sv-accent)) 10%, transparent);
      }

      .ft-sw-toggle {
        position: relative;
        width: 28px;
        height: 16px;
        border-radius: 8px;
        background: var(--sv-bg-surface);
        border: 1px solid var(--sv-border);
        flex-shrink: 0;
        transition: background 0.2s, border-color 0.2s;
      }

      .ft-sw-knob {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--sv-text-disabled);
        transition: transform 0.2s, background 0.2s;
      }

      .ft-sw.on .ft-sw-toggle {
        background: rgba(52, 199, 89, 0.2);
        border-color: rgba(52, 199, 89, 0.4);
      }

      .ft-sw.on .ft-sw-knob {
        transform: translateX(12px);
        background: var(--sv-green);
      }

      .ft-ha-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: stretch;
        padding: 0 24px;
        background: none;
        border: none;
        border-left: 1px solid var(--sv-border);
        border-radius: 0;
        color: var(--sv-text-secondary);
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
        box-sizing: border-box;
      }

      .ft-ha-btn:hover { background: var(--sv-bg-elevated); color: var(--sv-text-primary); }
      .ft-ha-btn:active { background: var(--sv-bg-surface); }

      /* ── Unavailable state ──────────────────────────────── */

      .lp-row.unavail { opacity: 0.5; }
      .lp-row.unavail .lp-bri { color: var(--sv-red); }
      .ft-tank.setup { cursor: pointer; outline: 1px dashed var(--sv-accent); outline-offset: 4px; border-radius: 4px; }
      .ft-tank.unavail { opacity: 0.5; }
      .ft-sw.unavail { opacity: 0.5; cursor: default; }
      .ft-sw.unavail:active { transform: none; }
      .ft-sw.setup { border-left-style: dashed; color: var(--sv-accent); cursor: pointer; }
      .ft-sw.setup:hover { background: color-mix(in srgb, var(--sv-accent) 8%, transparent); }

      /* ── Layout mode ──────────────────────────────────── */

      .layout-item {
        cursor: grab;
        touch-action: none;
        user-select: none;
        position: relative;
      }

      .layout-item:active { cursor: grabbing; }

      .layout-item.hidden-item { opacity: 0.35; }

      .layout-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        pointer-events: none;
        z-index: 2;
        padding: 4px;
      }

      .layout-overlay > * { pointer-events: auto; }

      .layout-touch {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        min-height: 40px;
        padding: 4px 10px;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        border-radius: 8px;
      }

      .layout-touch:active { background: rgba(255, 255, 255, 0.1); }

      .layout-drag {
        color: rgba(255, 255, 255, 0.8);
        cursor: grab;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
      }

      .lp-row .layout-drag {
        color: var(--sv-text-disabled);
        filter: none;
        flex-shrink: 0;
      }

      .layout-eye {
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        flex-shrink: 0;
        transition: color 0.15s;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
      }

      .layout-eye:hover { color: var(--sv-accent); }

      .lp-row .layout-eye {
        color: var(--sv-text-secondary);
        filter: none;
      }

      .lp-row .layout-touch:active { background: rgba(255, 255, 255, 0.05); }

      .hidden-item .layout-eye { color: var(--sv-text-disabled); }

      /* ── Footer modal ──────────────────────────────────── */

      .fm-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 16px;
      }

      .fm-modal {
        background: var(--sv-bg-surface);
        border: 1px solid var(--sv-border);
        border-radius: var(--sv-radius);
        width: 100%;
        max-width: 400px;
        max-height: 90dvh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        overflow: hidden;
      }
      .fm-modal.fm-wide { max-width: 900px; }

      .fm-body.fm-two-col {
        flex-direction: row;
        gap: 0;
      }
      .fm-col-left {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding-right: 18px;
        min-width: 0;
      }
      .fm-col-right {
        flex: 1.4;
        display: flex;
        flex-direction: column;
        gap: 8px;
        border-left: 1px solid var(--sv-border);
        padding-left: 18px;
        min-width: 0;
      }
      .fm-auto-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .fm-auto-empty {
        font-size: 12px;
        color: var(--sv-text-disabled);
        padding: 8px 0;
      }
      .fm-auto-row {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 8px;
        padding: 10px;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 6px 4px;
      }
      .fm-auto-row .auto-row-trigger,
      .fm-auto-row .auto-row-target,
      .fm-auto-row .auto-row-action {
        grid-column: 1;
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
      }
      .fm-auto-row .auto-row-trigger > *,
      .fm-auto-row .auto-row-target > *,
      .fm-auto-row .auto-row-action > * { min-width: 0; }
      .fm-auto-row smartvanio-entity-picker { flex: 2; }
      .fm-auto-row smartvanio-select { flex: 1; }
      .fm-auto-row .auto-row-label-text {
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        color: var(--sv-text-disabled);
        min-width: 44px;
        width: 44px;
        flex-shrink: 0;
        letter-spacing: 0.5px;
      }
      .fm-auto-row .auto-row-trigger .auto-row-label-text { color: var(--sv-accent); }
      .fm-auto-row .auto-row-target .auto-row-label-text { color: var(--sv-amber); }
      .fm-auto-row .auto-row-action .auto-row-label-text { color: var(--sv-green); }
      .fm-auto-row .delete-row-btn {
        grid-column: 2;
        grid-row: 1 / -1;
        align-self: center;
        background: none;
        border: none;
        color: var(--sv-red);
        cursor: pointer;
        padding: 4px;
        opacity: 0.5;
        transition: opacity 0.15s;
      }
      .fm-auto-row .delete-row-btn:hover { opacity: 1; }
      .fm-auto-header .add-row-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: none;
        border: 1px solid var(--sv-border);
        border-radius: 6px;
        color: var(--sv-accent);
        font-size: 11px;
        padding: 4px 10px;
        cursor: pointer;
        transition: background 0.15s;
      }
      .fm-auto-header .add-row-btn:hover { background: rgba(74, 158, 255, 0.1); }

      .fm-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 18px;
        border-bottom: 1px solid var(--sv-border);
        font-size: 15px;
        font-weight: 600;
      }

      .fm-close {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: var(--sv-bg-elevated);
        border: none;
        color: var(--sv-text-secondary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .fm-body {
        padding: 16px 18px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
      }

      .fm-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .fm-row {
        display: flex;
        gap: 12px;
      }

      .fm-label {
        font-size: 11px;
        color: var(--sv-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .fm-optional {
        text-transform: none;
        font-size: 10px;
        opacity: 0.6;
      }

      .fm-input {
        background: var(--sv-bg-elevated);
        border: 1px solid var(--sv-border);
        border-radius: var(--sv-radius-sm);
        padding: 8px 12px;
        font-size: 13px;
        color: var(--sv-text-primary);
        outline: none;
        font-family: inherit;
      }

      .fm-input:focus { border-color: var(--sv-accent); }

      .fm-color {
        width: 40px;
        height: 32px;
        border: 1px solid var(--sv-border);
        border-radius: 6px;
        background: none;
        cursor: pointer;
        padding: 2px;
      }

      .fm-footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 12px 18px;
        border-top: 1px solid var(--sv-border);
      }

      .fm-btn {
        padding: 8px 16px;
        border-radius: var(--sv-radius-sm);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        border: 1px solid var(--sv-border);
        background: var(--sv-bg-elevated);
        color: var(--sv-text-primary);
        transition: all 0.2s;
        font-family: inherit;
      }

      .fm-btn.delete { color: var(--sv-red); margin-right: auto; }
      .fm-btn.save { background: var(--sv-accent); border-color: var(--sv-accent); color: #fff; }
      .fm-btn[disabled] { opacity: 0.4; cursor: default; }
      /* ── Panel: empty state ─────────────────────────────── */

      .panel-empty {
        padding: 40px 20px;
        text-align: center;
        font-size: 14px;
        color: var(--sv-text-secondary);
      }

      /* ── Panel: climate ─────────────────────────────────── */

      .panel-climate {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 16px 20px 20px;
        box-sizing: border-box;
      }

      .climate-svg {
        display: block;
        width: 100%;
        max-width: min(240px, 100%);
        height: auto;
        overflow: visible;
        filter: drop-shadow(0 2px 8px rgba(0,0,0,0.1));
      }

      .c-main-val {
        fill: var(--sv-text-heading);
        font-size: 34px;
        font-weight: 200;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.03em;
      }

      .c-main-unit {
        fill: var(--sv-text-secondary);
        font-size: 9px;
        font-weight: 700;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
        letter-spacing: 0.18em;
      }

      .c-arc-tag {
        fill: var(--sv-text-secondary);
        font-size: 8px;
        font-weight: 700;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
        letter-spacing: 0.15em;
      }

      .c-arc-val {
        font-size: 14px;
        font-weight: 600;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
        font-variant-numeric: tabular-nums;
      }

      .c-btn-label {
        fill: var(--sv-text-secondary);
        font-size: 9px;
        font-weight: 700;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
        letter-spacing: 0.12em;
      }

      .climate-controls {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        max-width: min(260px, 100%);
      }

      .climate-control-label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.15em;
        color: var(--sv-text-secondary);
        text-transform: uppercase;
        margin: 4px 0 0;
      }

      .fan-row,
      .mode-row {
        display: flex;
        gap: 5px;
        width: 100%;
      }

      .fan-btn {
        flex: 1;
        text-align: center;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.04em;
        color: var(--sv-text-secondary);
        padding: 8px 0;
        border: 1px solid var(--sv-border);
        border-radius: var(--sv-radius-sm);
        background: var(--sv-bg-surface);
        cursor: pointer;
        transition:
          border-color 0.2s,
          color 0.2s,
          background 0.2s,
          box-shadow 0.2s;
        user-select: none;
      }

      .fan-btn.active {
        border-color: var(--sv-accent);
        color: var(--sv-accent);
        background: var(--sv-accent-muted);
        box-shadow: 0 0 8px var(--sv-accent-muted);
      }
      .fan-btn:hover:not(.active) {
        border-color: var(--sv-text-secondary);
        color: var(--sv-text-primary);
      }

      .mode-btn {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        padding: 8px 4px;
        border: 1px solid var(--sv-border);
        border-radius: var(--sv-radius-sm);
        background: var(--sv-bg-surface);
        cursor: pointer;
        transition:
          border-color 0.2s,
          background 0.2s,
          box-shadow 0.2s;
        user-select: none;
      }

      .mode-btn.active {
        border-color: var(--sv-accent);
        background: var(--sv-accent-muted);
        box-shadow: 0 0 8px var(--sv-accent-muted);
      }
      .mode-btn:hover:not(.active) {
        border-color: var(--sv-text-secondary);
      }

      .mode-icon {
        font-size: 15px;
        line-height: 1;
      }

      .mode-lbl {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.04em;
        color: var(--sv-text-secondary);
        white-space: nowrap;
      }

      .mode-btn.active .mode-lbl {
        color: var(--sv-accent-hover);
      }

      /* ── Panel: scenes ──────────────────────────────────── */

      .panel-scenes {
        padding: 10px 12px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        align-content: start;
      }

      .scene-tile {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;
        padding: 14px 10px;
        background: linear-gradient(135deg, var(--sv-bg-elevated), var(--sv-bg-surface));
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 12px;
        cursor: pointer;
        text-align: center;
        transition: border-color 0.25s, box-shadow 0.25s, transform 0.15s;
        user-select: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        -webkit-tap-highlight-color: transparent;
        aspect-ratio: 1;
      }

      .scene-tile:hover {
        border-color: rgba(74, 158, 255, 0.4);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      }
      .scene-tile:active {
        transform: scale(0.96);
      }

      .scene-tile.active {
        border-color: var(--sv-accent);
        box-shadow: 0 0 12px rgba(74, 158, 255, 0.35), 0 4px 16px rgba(0, 0, 0, 0.35);
      }
      .scene-tile.active .scene-icon {
        color: #fff;
      }
      .scene-tile.active .scene-name {
        color: #fff;
      }

      .scene-tile--script .scene-icon {
        color: var(--sv-accent);
      }

      .scene-icon {
        --mdc-icon-size: 24px;
        color: rgba(255, 255, 255, 0.55);
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        transition: color 0.2s;
      }

      .scene-name {
        font-size: 12px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.75);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        transition: color 0.2s;
      }

      .scene-dots {
        display: flex;
        gap: 4px;
      }
      .scene-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        box-shadow: 0 0 4px currentColor;
      }

      /* ── Panel: actions ─────────────────────────────────── */

      .panel-actions {
        display: flex;
        flex-direction: column;
      }

      .actions-hint {
        padding: 8px 14px 4px;
        flex-shrink: 0;
      }

      .hint-text {
        font-size: 10px;
        color: var(--sv-text-secondary);
      }

      .hint-link {
        color: var(--sv-accent);
        cursor: pointer;
        text-decoration: underline;
      }

      .action-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        border-bottom: 1px solid var(--sv-gauge-track);
        cursor: pointer;
        transition: background 0.15s;
        user-select: none;
      }

      .action-row:hover {
        background: var(--sv-accent-muted);
      }
      .action-row.pinned {
        background: var(--sv-accent-muted);
      }

      .action-domain {
        --mdc-icon-size: 16px;
        color: var(--sv-text-secondary);
        flex-shrink: 0;
      }

      .action-label {
        flex: 1;
        font-size: 14px;
        font-weight: 400;
        color: var(--sv-text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .action-run {
        font-size: 12px;
        color: var(--sv-text-disabled);
        flex-shrink: 0;
      }

      .action-pin {
        font-size: 18px;
        color: var(--sv-text-disabled);
        flex-shrink: 0;
        transition: color 0.2s;
      }

      .action-pin.pinned {
        color: var(--sv-accent);
      }

      /* ── Actions sub-sections ───────────────────────────── */

      .actions-sub-hdr {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px 6px;
        border-bottom: 1px solid var(--sv-border-subtle);
      }

      .actions-sub-title {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--sv-text-secondary);
      }

      .add-action-btn-full {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        width: calc(100% - 28px);
        margin: 8px 14px;
        padding: 9px 0;
        background: none;
        border: 1px dashed var(--sv-border);
        border-radius: 8px;
        color: var(--sv-text-secondary);
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition:
          border-color 0.15s,
          color 0.15s;
        --mdc-icon-size: 14px;
      }
      .add-action-btn-full:hover {
        border-color: var(--sv-accent);
        color: var(--sv-accent);
      }
      .add-action-btn-full ha-icon {
        --mdc-icon-size: 14px;
      }

      .actions-empty-hint {
        padding: 10px 14px;
        font-size: 12px;
        color: var(--sv-text-disabled);
        font-style: italic;
      }

      .auto-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-bottom: 1px solid var(--sv-gauge-track);
      }

      .auto-row-icon {
        --mdc-icon-size: 15px;
        color: var(--sv-accent);
        flex-shrink: 0;
      }

      .auto-row-label {
        flex: 1;
        font-size: 13px;
        color: var(--sv-text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .auto-row-delete {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--sv-text-disabled);
        padding: 0;
        line-height: 1;
        transition: color 0.15s;
        --mdc-icon-size: 16px;
      }
      .auto-row-delete:hover {
        color: #ff9492;
      }
      .auto-row-delete ha-icon {
        --mdc-icon-size: 16px;
      }

      .auto-row-edit {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--sv-text-disabled);
        padding: 0;
        line-height: 1;
        transition: color 0.15s;
      }
      .auto-row-edit:hover { color: var(--sv-accent); }
      .auto-row-edit ha-icon { --mdc-icon-size: 16px; }

      .scene-name-input {
        width: 100%;
        background: #0d1117;
        border: 1px solid var(--sv-border);
        border-radius: 8px;
        color: var(--sv-text-heading);
        font-size: 14px;
        padding: 9px 12px;
        outline: none;
        transition: border-color 0.15s;
        box-sizing: border-box;
      }
      .scene-name-input:focus { border-color: var(--sv-accent); }

      /* ── Add-Action modal ───────────────────────────────── */

      .auto-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
        padding: 16px;
      }

      .auto-modal {
        background: #161b22;
        border: 1px solid var(--sv-border);
        border-radius: 14px;
        width: 100%;
        max-width: 400px;
        max-height: 90dvh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        overflow: hidden;
      }

      .auto-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px 12px;
        border-bottom: 1px solid var(--sv-border-subtle);
      }

      .auto-modal-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--sv-text-heading);
      }

      .auto-modal-close {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--sv-text-secondary);
        padding: 0;
        line-height: 1;
        --mdc-icon-size: 18px;
      }
      .auto-modal-close:hover {
        color: var(--sv-text-heading);
      }

      .auto-modal-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;
        overflow-y: auto;
        flex: 1;
        min-height: 0;
      }

      .auto-field {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .auto-label {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--sv-text-secondary);
      }

      .auto-field-sep {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--sv-text-disabled);
        text-align: center;
        padding: 0 0 4px;
      }

      .auto-modal-error {
        font-size: 12px;
        color: #ff9492;
        padding: 6px 10px;
        background: rgba(255, 148, 146, 0.1);
        border-radius: 6px;
        border: 1px solid rgba(255, 148, 146, 0.25);
      }

      .auto-modal-footer {
        display: flex;
        gap: 10px;
        padding: 12px 16px;
        border-top: 1px solid var(--sv-border-subtle);
        justify-content: flex-end;
      }

      .auto-btn {
        padding: 8px 18px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        border: 1px solid transparent;
        transition:
          background 0.15s,
          opacity 0.15s;
      }
      .auto-btn.cancel {
        background: var(--sv-border-subtle);
        border-color: var(--sv-border);
        color: var(--sv-text-secondary);
      }
      .auto-btn.cancel:hover {
        background: #2d333b;
      }
      .auto-btn.save {
        background: var(--sv-accent);
        color: var(--sv-bg-base);
        font-weight: 600;
      }
      .auto-btn.save:hover {
        background: var(--sv-accent-hover);
      }
      .auto-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* ── Panel: level ───────────────────────────────────── */

      .panel-level {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding: 20px 16px;
      }

      .bubble-lg {
        display: block;
        width: 100%;
        max-width: min(200px, 100%);
        height: auto;
        overflow: visible;
        filter: drop-shadow(0 2px 8px rgba(0,0,0,0.1));
      }

      .level-stats {
        display: flex;
        gap: 12px;
        justify-content: center;
        width: 100%;
        max-width: min(280px, 100%);
      }

      .lstat {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 10px 8px;
        background: var(--sv-bg-surface);
        border: 1px solid var(--sv-border);
        border-radius: var(--sv-radius-sm);
      }

      .lstat-label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.15em;
        color: var(--sv-text-secondary);
        text-transform: uppercase;
      }

      .lstat-val {
        font-size: 20px;
        font-weight: 300;
        color: var(--sv-text-heading);
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.02em;
        transition: color 0.4s;
      }

      .lstat-val.warn {
        color: var(--sv-amber);
      }
      .lstat-val.ok {
        color: #2bd853;
      }

      /* ── Panel: status ──────────────────────────────────── */

      .panel-status {
        display: flex;
        flex-direction: column;
        padding: 8px 14px;
        gap: 0;
        padding: 12px 14px;
      }

      .sstat-group-label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--sv-text-secondary);
        padding: 10px 0 4px;
      }

      .sstat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid var(--sv-gauge-track);
      }

      .sstat-row:last-child {
        border-bottom: none;
      }

      .sstat-row-name {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: var(--sv-text-primary);
      }

      .sstat-row-val {
        font-size: 13px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: var(--sv-text-heading);
      }

      .val-offline {
        color: var(--sv-text-disabled);
      }

      .sstat-hint {
        font-size: 11px;
        color: var(--sv-text-secondary);
        padding: 4px 0 8px;
      }

      /* ── Board status dot ──────────────────────────────────── */

      .board-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .board-dot.online {
        background: #2bd853;
        box-shadow: 0 0 5px #2bd85388;
      }
      .board-dot.offline {
        background: #ff9492;
        box-shadow: 0 0 5px #ff949288;
      }
      .board-dot.unknown {
        background: var(--sv-bg-elevated);
      }

      .door-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .door-list-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.18em;
        color: var(--sv-text-secondary);
        text-transform: uppercase;
        padding: 0 2px;
      }

      .dstat {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        background: var(--sv-gauge-track);
        border: 1px solid var(--sv-border);
        border-radius: 8px;
        font-size: 14px;
        color: var(--sv-text-primary);
        transition: border-color 0.2s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      .dstat.open {
        border-color: var(--sv-amber);
      }

      .dstat-name {
        flex: 1;
        font-size: 13px;
        color: var(--sv-text-primary);
      }

      .dstat-state {
        font-size: 12px;
        font-weight: 600;
        color: var(--sv-text-secondary);
      }

      .dstat.open .dstat-state {
        color: var(--sv-amber);
      }

      /* ── Right panel top bar ────────────────────────────── */

      .list-topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 22px;
        height: 48px;
        border-bottom: 1px solid var(--sv-border);
        flex-shrink: 0;
        background: var(--sv-bg-base);
      }

      .list-title {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.2em;
        color: var(--sv-text-secondary);
        text-transform: uppercase;
      }

      .cfg-btn {
        font-size: 18px;
        color: var(--sv-text-secondary);
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
        transition:
          color 0.2s,
          background 0.2s;
        user-select: none;
        line-height: 1;
      }

      .cfg-btn:hover {
        color: var(--sv-text-heading);
        background: var(--sv-accent-muted);
      }
      .cfg-btn.active {
        color: var(--sv-accent);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.06em;
      }

      /* ── Pinned actions strip ───────────────────────────── */

      .pinned-strip {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 8px 14px;
        border-bottom: 1px solid var(--sv-border);
        background: var(--sv-gauge-track);
        flex-shrink: 0;
      }

      .pinned-btn {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 6px 12px;
        border: 1px solid var(--sv-text-secondary);
        border-radius: 20px;
        background: var(--sv-bg-input);
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        color: var(--sv-text-primary);
        transition:
          border-color 0.2s,
          background 0.2s,
          color 0.2s,
          box-shadow 0.2s;
        user-select: none;
        white-space: nowrap;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
      }

      .pinned-btn:hover {
        border-color: var(--sv-accent);
        color: var(--sv-text-heading);
        background: var(--sv-accent-muted);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      .pinned-x {
        font-size: 10px;
        color: #ff9492;
        font-weight: 700;
      }

      .pinned-add {
        display: flex;
        align-items: center;
        padding: 6px 12px;
        border: 1px dashed var(--sv-border);
        border-radius: 20px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        color: var(--sv-text-secondary);
        transition:
          border-color 0.2s,
          color 0.2s;
        user-select: none;
      }

      .pinned-add:hover {
        border-color: var(--sv-accent);
        color: var(--sv-accent);
      }

      /* ── Accordion scroll wrapper ──────────────────────── */

      .acc-scroll {
        flex: 1;
        overflow-y: auto;
        min-height: 0;
      }

      .acc-scroll::-webkit-scrollbar {
        width: 3px;
      }
      .acc-scroll::-webkit-scrollbar-thumb {
        background: var(--sv-bg-elevated);
        border-radius: 2px;
      }
      .acc-scroll::-webkit-scrollbar-track {
        background: transparent;
      }

      /* ── Accordion ──────────────────────────────────────── */

      .acc-section {
        border-bottom: 1px solid var(--sv-border);
        display: flex;
        flex-direction: column;
      }

      .acc-hdr {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 22px;
        height: 48px;
        cursor: pointer;
        user-select: none;
        flex-shrink: 0;
        transition: background 0.15s;
      }

      .acc-hdr:hover {
        background: var(--sv-accent-muted);
      }

      .acc-title {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.2em;
        color: var(--sv-accent);
        text-transform: uppercase;
      }

      .acc-chevron {
        font-size: 22px;
        color: var(--sv-text-disabled);
        line-height: 1;
        transform: rotate(90deg);
        transition:
          transform 0.2s ease,
          color 0.2s;
        display: inline-block;
      }

      .acc-chevron.open {
        transform: rotate(-90deg);
        color: var(--sv-accent);
      }

      /* ── Light rows ─────────────────────────────────────── */

      .lights {
        overflow-y: auto;
      }

      .lrow {
        display: flex;
        align-items: center;
        gap: 12px;
        height: 56px;
        padding: 0 22px;
        border-bottom: 1px solid var(--sv-gauge-track);
        cursor: pointer;
        user-select: none;
        transition: background 0.15s;
      }

      .lrow:hover {
        background: var(--sv-accent-muted);
      }
      .lrow:last-child {
        border-bottom: none;
      }

      .ldot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        flex-shrink: 0;
        transition:
          background 0.3s,
          box-shadow 0.3s;
      }

      .lname {
        flex: 1;
        font-size: 15px;
        font-weight: 400;
        color: var(--sv-text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 0.2s;
        min-width: 0;
      }

      .lrow.on .lname {
        color: var(--sv-text-heading);
      }

      .lright {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
      }

      /* ── Color swatch ───────────────────────────────────── */

      .color-swatch {
        display: block;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 2px solid var(--sv-text-secondary);
        cursor: pointer;
        flex-shrink: 0;
        overflow: hidden;
        transition: border-color 0.2s;
      }

      .color-swatch:hover {
        border-color: var(--sv-text-heading);
      }

      .color-input {
        opacity: 0;
        position: absolute;
        width: 0;
        height: 0;
        pointer-events: none;
      }

      /* ── Light slider ───────────────────────────────────── */

      .lslider {
        -webkit-appearance: none;
        appearance: none;
        width: 96px;
        height: 5px;
        border-radius: 3px;
        outline: none;
        cursor: pointer;
      }

      .lslider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--sv-accent);
        cursor: pointer;
        border: none;
        box-shadow: 0 0 7px var(--sv-accent-muted);
      }

      .lslider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--sv-accent);
        cursor: pointer;
        border: none;
      }

      .lpct {
        font-size: 13px;
        color: var(--sv-text-secondary);
        width: 32px;
        text-align: right;
        font-variant-numeric: tabular-nums;
        flex-shrink: 0;
      }

      .lrow.on .lpct {
        color: var(--sv-accent);
      }

      /* ── CarPlay tile shared ────────────────────────────── */

      .section-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--sv-accent);
      }

      .dnd-hint {
        font-size: 10px;
        color: var(--sv-accent);
        opacity: 0.7;
        font-style: italic;
      }

      .dnd-toggle-btn {
        background: none;
        border: none;
        color: var(--sv-text-secondary);
        cursor: pointer;
        padding: 2px;
        display: flex;
        align-items: center;
        border-radius: 6px;
        transition: color 0.15s, background 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .dnd-toggle-btn:hover { color: var(--sv-text-heading); background: rgba(255,255,255,0.06); }
      .dnd-toggle-btn ha-icon { --mdc-icon-size: 18px; }

      .dnd-done-btn {
        background: var(--sv-accent);
        border: none;
        color: var(--sv-bg-base);
        font-size: 11px;
        font-weight: 600;
        padding: 4px 12px;
        border-radius: 10px;
        cursor: pointer;
        font-family: inherit;
        -webkit-tap-highlight-color: transparent;
        transition: background 0.15s;
      }
      .dnd-done-btn:hover { background: #79baff; }

      /* In DnD mode, remove overflow clipping from ancestors above
         the grid so the ghost can move freely. Keep .unified-grid
         overflow intact to avoid scrollbar-width layout shift. */
      :host(.dnd-active) .hmi-card,
      :host(.dnd-active) .main-row,
      :host(.dnd-active) .list,
      :host(.dnd-active) .cluster,
      :host(.dnd-active) .unified-grid-wrap {
        overflow: visible !important;
      }

      .unified-grid.dnd-mode {
        touch-action: none;
      }

      /* ── Grid tiles (positioned via grid-column/grid-row) ── */
      .grid-tile {
        position: relative;
        min-width: 0;
        min-height: 0;
        box-sizing: border-box;
      }

      /* In DnD mode, tiles are draggable from anywhere */
      .unified-grid.dnd-mode .grid-tile {
        cursor: grab;
        touch-action: none;
      }
      .unified-grid.dnd-mode .grid-tile:active {
        cursor: grabbing;
      }

      /* Tiles must fill their grid cell */
      .grid-tile .gtile,
      .grid-tile .ltile,
      .grid-tile .stile {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }

      /* Merge target highlight — bright border when dragging over a compatible tile */
      .grid-tile.merge-target {
        outline: 3px solid rgba(92,172,255,0.8);
        outline-offset: -3px;
        border-radius: 16px;
        animation: merge-pulse 0.6s ease-in-out infinite alternate;
      }
      /* Stop jiggle on merge target */
      .unified-grid.dnd-mode .grid-tile.merge-target {
        animation: merge-pulse 0.6s ease-in-out infinite alternate;
      }
      @keyframes merge-pulse {
        from { outline-color: rgba(92,172,255,0.5); box-shadow: 0 0 8px rgba(92,172,255,0.1); }
        to   { outline-color: rgba(92,172,255,1); box-shadow: 0 0 16px rgba(92,172,255,0.3); }
      }

      /* Resize button — bottom-right of tile in DnD mode */
      .resize-btn {
        position: absolute;
        bottom: 2px;
        right: 2px;
        z-index: 5;
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        background: rgba(92,172,255,0.15);
        border: none;
        cursor: pointer;
        padding: 0;
      }
      .resize-btn ha-icon {
        --mdc-icon-size: 14px;
        color: rgba(92,172,255,0.7);
      }

      /* Drop preview — shows where the tile will land */
      .drop-preview {
        border: 2px dashed rgba(92,172,255,0.5);
        border-radius: 16px;
        background: rgba(92,172,255,0.08);
        pointer-events: none;
        z-index: 1;
        box-sizing: border-box;
      }

      /* Jiggle animation for DnD mode */
      @keyframes tile-jiggle {
        0%   { transform: rotate(-0.7deg); }
        50%  { transform: rotate(0.7deg); }
        100% { transform: rotate(-0.7deg); }
      }

      /* DnD mode tile styling */
      .unified-grid.dnd-mode .grid-tile {
        animation: tile-jiggle 0.25s ease-in-out infinite;
      }
      /* Stagger the jiggle so tiles don't all move in sync */
      .unified-grid.dnd-mode .grid-tile:nth-child(2n) {
        animation-delay: 0.12s;
      }

      .unified-grid.dnd-mode .gtile,
      .unified-grid.dnd-mode .ltile,
      .unified-grid.dnd-mode .stile {
        transition: background 0.2s !important;
        overflow: visible;
      }

      /* ── Unified grid (iOS homescreen layout) ──────────── */

      .unified-grid-wrap {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
      }

      .unified-grid-hdr {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 16px 4px;
        flex-shrink: 0;
      }

      .unified-grid {
        flex: 1;
        min-height: 0;
        display: grid;
        /* grid-template-columns/rows and gaps set dynamically by ResizeObserver */
        grid-template-columns: repeat(4, 80px);
        grid-template-rows: repeat(4, 80px);
        gap: 12px;
        padding: 12px 16px;
        overflow-y: auto;
        align-content: start;
        position: relative;
      }

      .unified-grid::-webkit-scrollbar { width: 3px; }
      .unified-grid::-webkit-scrollbar-thumb { background: var(--sv-bg-elevated); border-radius: 2px; }
      .unified-grid::-webkit-scrollbar-track { background: transparent; }

      /* Empty cells — faded tile placeholders in DnD mode */
      .empty-cell {
        border: 1px dashed rgba(92,172,255,0.15);
        border-radius: 16px;
        background: rgba(92,172,255,0.03);
        box-sizing: border-box;
      }

      /* Drag ghost — appended to shadow root by controller */
      .drag-ghost {
        pointer-events: none;
      }

      /* ── Group tiles (.gtile) ──────────────────────────── */

      .gtile {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        border-radius: 16px;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        padding: 6px 4px;
        background: rgba(28,28,30,0.65);
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        overflow: hidden;
        transition: background 0.2s, transform 0.1s;
        will-change: transform;
        transform-origin: top left;
      }

      
      .gtile.on {
        background: rgba(92,172,255,0.15);
      }

      .gtile.expanded {
        aspect-ratio: auto;
        width: 100%;
        height: 100%;
        border-radius: 14px;
        padding: 10px;
        align-items: stretch;
        justify-content: flex-start;
        background: rgba(22,27,34,0.85);
        box-shadow:
          0 4px 20px rgba(92,172,255,0.12),
          0 4px 12px rgba(0,0,0,0.5);
      }

      .gtile-hdr {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .gtile:not(.expanded) .gtile-hdr {
        flex-direction: column;
        gap: 3px;
      }

      .gtile-icon {
        --mdc-icon-size: 22px;
        color: var(--sv-text-disabled);
        flex-shrink: 0;
        transition: color 0.2s;
      }

      .gtile-icon.on {
        color: var(--sv-accent);
        filter: drop-shadow(0 0 4px rgba(92,172,255,0.5));
      }

      .gtile.expanded .gtile-icon {
        --mdc-icon-size: 16px;
      }

      .gtile-name {
        font-size: 10px;
        font-weight: 500;
        color: var(--sv-text-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        transition: color 0.2s;
      }

      .gtile.on .gtile-name { color: var(--sv-text-heading); }

      .gtile.expanded .gtile-name {
        font-size: 13px;
        font-weight: 600;
        color: var(--sv-text-heading);
        text-align: left;
        flex: 1;
      }

      .gtile-name-input {
        flex: 1;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(92,172,255,0.25);
        border-radius: 6px;
        color: var(--sv-text-heading);
        font-size: 13px;
        font-weight: 600;
        padding: 2px 6px;
        outline: none;
        min-width: 0;
      }
      .gtile-name-input:focus {
        border-color: rgba(92,172,255,0.5);
      }

      /* Group toggle switch */
      .gtile-toggle {
        flex-shrink: 0;
        width: 36px;
        height: 20px;
        border-radius: 10px;
        border: none;
        background: var(--sv-border);
        padding: 2px;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: background 0.2s;
        -webkit-tap-highlight-color: transparent;
      }
      .gtile-toggle.on {
        background: rgba(92,172,255,0.6);
      }
      .gtile-toggle-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--sv-text-heading);
        transition: transform 0.2s;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      }
      .gtile-toggle.on .gtile-toggle-thumb {
        transform: translateX(16px);
      }

      /* Group brightness slider */
      .gtile-brightness {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 2px 0 4px;
      }
      .gtile-bri-slider {
        flex: 1;
        height: 4px;
        -webkit-appearance: none;
        appearance: none;
        background: var(--sv-border);
        border-radius: 2px;
        outline: none;
        cursor: pointer;
      }
      .gtile-bri-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--sv-text-heading);
        box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        cursor: pointer;
      }
      .gtile-bri-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--sv-text-heading);
        border: none;
        box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        cursor: pointer;
      }

      .gtile-collapse-btn {
        flex-shrink: 0;
        margin-left: auto;
        background: none;
        border: none;
        color: var(--sv-text-secondary);
        cursor: pointer;
        padding: 2px;
        display: flex;
        align-items: center;
        border-radius: 4px;
        transition: color 0.2s;
      }
      .gtile-collapse-btn:hover { color: var(--sv-text-primary); }
      .gtile-collapse-btn ha-icon { --mdc-icon-size: 16px; }

      .gtile-dots {
        display: flex;
        gap: 4px;
        justify-content: center;
        padding: 2px 0 0;
      }

      .gtile-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        transition: background 0.3s, box-shadow 0.3s;
      }

      .gtile-body {
        overflow: hidden;
      }

      .gtile:not(.expanded) .gtile-body {
        display: none;
      }

      .gtile.expanded .gtile-body {
        padding-top: 8px;
      }

      .ltile {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        border-radius: 16px;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        transition: background 0.2s, transform 0.1s;
        padding: 6px 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        overflow: hidden;
        will-change: transform;
        transform-origin: top left;
      }

      
      .ltile-icon {
        --mdc-icon-size: 22px;
        transition: color 0.2s;
        flex-shrink: 0;
      }

      .ltile-name {
        font-size: 10px;
        font-weight: 500;
        color: var(--sv-text-secondary);
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        padding: 0 4px;
        box-sizing: border-box;
        transition: color 0.2s;
      }

      .ltile.on .ltile-name { color: var(--sv-text-heading); }
      .ltile.offline { opacity: 0.5; }
      .ltile.offline .ltile-name { color: #6b3030; }

      .ltile-bri {
        font-size: 9px;
        font-weight: 600;
        color: rgba(255,255,255,0.55);
        line-height: 1;
      }

      /* ── Tile popover ─────────────────────────────────────── */

      .popover-overlay {
        position: fixed;
        inset: 0;
        z-index: 500;
      }

      .popover {
        position: fixed;
        transform: translate(-50%, -100%) translateY(-10px);
        background: rgba(22,27,34,0.96);
        border: 1px solid var(--sv-border);
        border-radius: 14px;
        box-shadow: 0 8px 28px rgba(0,0,0,0.6);
        padding: 12px 14px;
        min-width: 210px;
        max-width: 260px;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        z-index: 501;
      }

      .popover-hdr {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }

      .popover-name {
        font-size: 13px;
        font-weight: 600;
        color: var(--sv-text-heading);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .popover-toggle {
        padding: 3px 10px;
        border-radius: 10px;
        border: 1px solid var(--sv-border);
        background: rgba(255,255,255,0.06);
        color: var(--sv-text-secondary);
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s, color 0.15s, border-color 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .popover-toggle.on {
        background: rgba(92,172,255,0.15);
        border-color: var(--sv-accent);
        color: var(--sv-accent);
      }

      .popover-body {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .popover-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .popover-slider {
        flex: 1;
        -webkit-appearance: none;
        appearance: none;
        height: 6px;
        border-radius: 3px;
        outline: none;
        cursor: pointer;
      }
      .popover-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--sv-text-heading);
        box-shadow: 0 1px 4px rgba(0,0,0,0.5);
        cursor: pointer;
      }
      .popover-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--sv-text-heading);
        border: none;
        box-shadow: 0 1px 4px rgba(0,0,0,0.5);
        cursor: pointer;
      }

      .popover-pct {
        font-size: 12px;
        font-weight: 600;
        color: var(--sv-text-secondary);
        width: 36px;
        text-align: right;
        font-variant-numeric: tabular-nums;
      }

      .popover-color {
        width: 0;
        height: 0;
        padding: 0;
        border: none;
        opacity: 0;
        position: absolute;
      }

      .popover-swatch {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.15);
        cursor: pointer;
        flex-shrink: 0;
        transition: border-color 0.15s;
      }
      .popover-swatch:hover {
        border-color: rgba(255,255,255,0.4);
      }

      .popover-patterns {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        padding-top: 4px;
      }
      .popover-pat-chip {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        cursor: pointer;
        border: 2px solid transparent;
        border-radius: 8px;
        padding: 3px;
        transition: border-color 0.15s, transform 0.15s;
        flex: 1;
        min-width: 48px;
      }
      .popover-pat-chip:hover { transform: scale(1.05); border-color: rgba(255,255,255,0.3); }
      .popover-pat-chip.active { border-color: var(--primary-color, #4a9eff); box-shadow: 0 0 6px rgba(74,158,255,0.4); }
      .popover-pat-grad {
        width: 100%;
        height: 18px;
        border-radius: 5px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      }
      .popover-pat-name {
        font-size: 10px;
        color: var(--secondary-text-color, rgba(255,255,255,0.6));
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
      }
      .popover-pat-chip.active .popover-pat-name { color: var(--primary-color, #4a9eff); }

      /* (switches-panel removed — switches now in unified grid) */

      /* ── Switch grid (setup mode only) ──────────────────── */

      .switch-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1px;
        background: #1c2128;
      }

      /* ── Switch tiles (matches .ltile) ──────────────────── */

      .stile {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        padding: 6px 4px;
        background: rgba(28,28,30,0.65);
        border-radius: 16px;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        transition: background 0.15s, transform 0.1s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        overflow: hidden;
        will-change: transform;
        transform-origin: top left;
      }

      
      .stile.on {
        background: rgba(255,255,255,0.92);
      }

      .stile-icon {
        --mdc-icon-size: 22px;
        color: var(--sv-text-disabled);
        transition: color 0.2s;
      }

      .stile.on .stile-icon {
        color: #1C1C1E;
      }

      .stile-name {
        font-size: 10px;
        font-weight: 500;
        color: var(--sv-text-secondary);
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        padding: 0 4px;
        box-sizing: border-box;
        transition: color 0.2s;
      }

      .stile.on .stile-name {
        color: #1C1C1E;
        font-weight: 600;
      }

      .stile-badge {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.04em;
        color: rgba(255,255,255,0.35);
        transition: color 0.2s;
      }

      .stile.on .stile-badge {
        color: var(--sv-text-disabled);
      }

      /* ── Button tiles ───────────────────────────────────── */

      .btile {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        background: var(--sv-bg-base);
        min-height: 52px;
        cursor: default;
        user-select: none;
        transition:
          background 0.15s,
          border-color 0.15s;
        -webkit-tap-highlight-color: transparent;
      }

      .btile:hover {
        background: var(--sv-gauge-track);
      }

      .btile.active {
        background: var(--sv-gauge-track);
      }

      .btile.editable {
        cursor: pointer;
      }
      .btile.editable:hover {
        background: var(--sv-accent-muted);
      }

      .btile-icon {
        --mdc-icon-size: 20px;
        color: var(--sv-text-secondary);
        flex-shrink: 0;
        transition: color 0.15s;
      }

      .btile.active .btile-icon {
        color: var(--sv-accent);
      }
      .btile.editable .btile-icon {
        color: var(--sv-accent);
      }

      .btile-name {
        font-size: 13px;
        font-weight: 500;
        color: var(--sv-text-secondary);
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: color 0.2s;
      }

      .btile.active .btile-name {
        color: var(--sv-text-heading);
      }

      .btile-state {
        font-size: 11px;
        color: var(--sv-text-disabled);
        flex-shrink: 0;
        white-space: nowrap;
      }

      .btile.active .btile-state {
        color: var(--sv-accent);
      }
      .btile.editable .btile-state {
        color: var(--sv-accent);
        font-size: 11px;
      }

      /* ── Resources bar ──────────────────────────────────── */

      .res-item {
        display: flex;
        flex-direction: column;
        gap: 3px;
        flex: 1;
        padding: 0 10px;
        border-right: 1px solid var(--sv-border);
      }

      .res-item:last-child {
        border-right: none;
      }

      .res-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.12em;
        color: var(--sv-text-secondary);
        text-transform: uppercase;
      }

      .res-bar-wrap {
        height: 5px;
        background: var(--sv-bg-input);
        border-radius: 3px;
        overflow: hidden;
      }

      .res-bar-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 1s ease;
      }

      .res-val {
        font-size: 14px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      .kiosk-toggle-btn {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: none;
        border: none;
        color: var(--sv-text-secondary);
        cursor: pointer;
        padding: 0;
        transition: color 0.2s;
      }
      .kiosk-toggle-btn:hover {
        color: var(--sv-text-primary);
      }
      .kiosk-toggle-btn ha-icon {
        --mdc-icon-size: 22px;
      }

      /* ── Device picker ──────────────────────────────────── */

      .picker {
        padding: 40px 28px;
        background: var(--sv-bg-base);
        border-radius: 14px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        min-height: 260px;
        justify-content: center;
      }

      .picker-title {
        font-size: 22px;
        font-weight: 200;
        color: var(--sv-text-primary);
        letter-spacing: 0.06em;
      }
      .picker-sub {
        font-size: 12px;
        color: var(--sv-text-secondary);
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      .picker-row {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 16px 32px;
        border: 1px solid var(--sv-text-secondary);
        border-radius: 10px;
        cursor: pointer;
        min-width: 240px;
        transition:
          border-color 0.2s,
          background 0.2s,
          box-shadow 0.2s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      .picker-row:hover {
        border-color: var(--sv-accent);
        background: var(--sv-gauge-track);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
      }

      .picker-name {
        font-size: 16px;
        color: var(--sv-text-primary);
      }
      .picker-id {
        font-size: 12px;
        color: var(--sv-text-secondary);
      }
      .picker-empty {
        font-size: 14px;
        color: var(--sv-text-secondary);
        text-align: center;
      }

      /* ── Group tile body content (scenes, lights list) ─── */

      .group-scenes {
        display: flex;
        flex-wrap: nowrap;
        gap: 6px;
        overflow-x: auto;
        min-width: 0;
        scrollbar-width: none;
        -ms-overflow-style: none;
        padding-bottom: 2px;
      }
      .group-scenes::-webkit-scrollbar {
        display: none;
      }

      .scene-chip {
        background: var(--sv-bg-base);
        border: 1px solid var(--sv-border);
        border-radius: 5px;
        color: var(--sv-text-primary);
        font-size: 11px;
        padding: 5px 10px;
        cursor: pointer;
        font-family: inherit;
        white-space: nowrap;
        transition:
          border-color 0.15s,
          color 0.15s;
      }

      .scene-chip:hover {
        border-color: var(--sv-accent);
        color: var(--sv-accent);
      }

      .group-no-scenes {
        font-size: 11px;
        color: var(--sv-text-secondary);
        font-style: italic;
      }

      .group-lights-list {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 6px 0;
        flex: 1;
        overflow-y: auto;
      }

      .grp-light-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 8px;
        cursor: pointer;
        border-radius: 8px;
        -webkit-tap-highlight-color: transparent;
        transition: background 0.15s;
      }
      .grp-light-row:hover {
        background: rgba(255,255,255,0.04);
      }

      .grp-light-dot {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        position: relative;
        transition: background 0.3s, box-shadow 0.3s;
      }

      .grp-light-color {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        border: none;
        padding: 0;
        border-radius: 50%;
      }

      .grp-light-name {
        flex: 1;
        font-size: 13px;
        color: var(--sv-text-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: color 0.2s;
      }
      .grp-light-row.on .grp-light-name {
        color: var(--sv-text-heading);
      }

      .grp-light-grip {
        flex-shrink: 0;
        --mdc-icon-size: 16px;
        color: rgba(92,172,255,0.5);
        cursor: grab;
      }

      .grp-light-bar-wrap {
        height: 3px;
        background: var(--sv-bg-base);
        border-radius: 2px;
        overflow: hidden;
        margin-top: -4px;
      }

      .grp-light-bar {
        height: 100%;
        border-radius: 2px;
        transition:
          width 0.4s ease,
          background 0.3s ease;
        opacity: 0.7;
      }

      /* ── Group setup editor ──────────────────────────────── */

      .group-edit-card {
        background: var(--sv-gauge-track);
        border: 1px solid var(--sv-border);
        border-radius: 10px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      .group-edit-hdr {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .group-edit-name {
        flex: 1;
      }

      .group-edit-section-title {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--sv-text-secondary);
        margin-top: 4px;
      }

      .group-lights-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .group-light-chip {
        background: var(--sv-bg-base);
        border: 1px solid var(--sv-border);
        border-radius: 6px;
        color: var(--sv-text-secondary);
        font-size: 12px;
        padding: 5px 10px;
        cursor: pointer;
        user-select: none;
        transition: all 0.15s;
      }

      .group-light-chip.on {
        border-color: var(--sv-accent);
        color: var(--sv-accent);
        background: var(--sv-accent-muted);
      }

      .group-edit-hint {
        font-size: 11px;
        color: var(--sv-text-secondary);
        font-style: italic;
      }

      /* ── Setup mode ─────────────────────────────────────── */

      .setup-title {
        color: var(--sv-accent);
      }

      .setup-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .setup-save-btn,
      .setup-cancel-btn {
        border: none;
        border-radius: 6px;
        padding: 6px 14px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        font-family: inherit;
      }

      .setup-save-btn {
        background: var(--sv-accent);
        color: var(--sv-text-heading);
      }

      .setup-save-btn:hover {
        background: var(--sv-accent);
      }

      .setup-cancel-btn {
        background: var(--sv-bg-input);
        color: var(--sv-text-primary);
      }

      .setup-cancel-btn:hover {
        background: var(--sv-bg-elevated);
      }

      .setup-panel,
      .setup-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 14px 12px;
      }

      .setup-section-title {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--sv-text-secondary);
        margin-top: 4px;
      }

      .setup-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .setup-label {
        font-size: 12px;
        color: var(--sv-text-primary);
        flex: 0 0 64px;
        white-space: nowrap;
      }

      /* Theme smartvanio-select to match the HMI dark palette */
      .setup-entity-select {
        flex: 1;
        min-width: 0;
        --primary-text-color: var(--sv-text-heading);
        --secondary-background-color: var(--sv-gauge-track);
        --divider-color: var(--sv-border);
        --primary-color: var(--sv-accent);
        --card-background-color: var(--sv-gauge-track);
      }

      .setup-name-input {
        flex: 0 0 90px;
        background: var(--sv-gauge-track);
        border: 1px solid var(--sv-border);
        border-radius: 6px;
        color: var(--sv-text-heading);
        font-size: 13px;
        padding: 6px 8px;
        font-family: inherit;
        outline: none;
      }

      .setup-name-input:focus {
        border-color: var(--sv-accent);
      }

      .setup-del {
        flex-shrink: 0;
        background: none;
        border: none;
        color: var(--sv-text-secondary);
        font-size: 14px;
        cursor: pointer;
        padding: 4px 6px;
        border-radius: 4px;
        line-height: 1;
      }

      .setup-del:hover {
        color: #ff9492;
        background: rgba(255, 148, 146, 0.1);
      }

      .setup-add {
        background: none;
        border: 1px dashed var(--sv-border);
        border-radius: 6px;
        color: var(--sv-text-secondary);
        font-size: 12px;
        padding: 6px 12px;
        cursor: pointer;
        font-family: inherit;
        text-align: left;
        transition:
          border-color 0.2s,
          color 0.2s;
      }

      .setup-add:hover {
        border-color: var(--sv-accent);
        color: var(--sv-accent);
      }

      /* Resources bar in setup mode — expands to show rows */

      .resources-setup {
        height: auto !important;
        flex-direction: column !important;
        align-items: stretch !important;
        padding: 10px 16px !important;
        gap: 6px;
        max-height: 180px;
        overflow-y: auto;
      }

      .setup-res-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .setup-color-swatch {
        flex-shrink: 0;
        width: 28px;
        height: 28px;
        padding: 2px;
        border: 1px solid var(--sv-border);
        border-radius: 6px;
        background: var(--sv-gauge-track);
        cursor: pointer;
      }

      .setup-res-row .setup-name-input {
        flex: 0 0 70px;
      }

      .setup-res-add {
        align-self: flex-start;
        margin-top: 2px;
      }

      /* ── Scrollbars ─────────────────────────────────────── */

      .tab-content::-webkit-scrollbar,
      .lights::-webkit-scrollbar,
      .list::-webkit-scrollbar {
        width: 3px;
      }

      .tab-content::-webkit-scrollbar-thumb,
      .lights::-webkit-scrollbar-thumb,
      .list::-webkit-scrollbar-thumb {
        background: var(--sv-bg-elevated);
        border-radius: 2px;
      }

      .tab-content::-webkit-scrollbar-track,
      .lights::-webkit-scrollbar-track,
      .list::-webkit-scrollbar-track {
        background: transparent;
      }

      /* ── Responsive: tablet ≤1400px ────────────────────── */

      @media (max-width: 1400px) {
        /* Shrink scene tiles */
        .sc-card {
          width: 110px;
          height: 60px;
          padding: 8px 10px;
          gap: 4px;
        }
        .sc-card-icon { --mdc-icon-size: 18px; }
        .sc-card-name { font-size: 11px; }
        .sc-dots { display: none; }

        /* Shrink climate gauge */
        .climate-svg { max-width: min(200px, 100%); }
        .panel-climate { gap: 8px; padding: 8px 12px 12px; }
        .climate-controls { max-width: min(200px, 100%); }
        .fan-btn, .mode-btn { padding: 6px 0; font-size: 10px; }
        .climate-control-label { font-size: 8px; margin: 2px 0 0; }

        /* Shrink level bubble */
        .bubble-lg { max-width: min(180px, 100%); }
        .panel-level { gap: 10px; padding: 8px 12px; }
        .lstat-val { font-size: 18px; }
        .lstat-label { font-size: 8px; }

        /* Light rows compact */
        .lp-row {
          gap: 8px;
        }
      }
    `}}),window.customCards=window.customCards||[],window.customCards.push({type:"smartvanio-hmi-card",name:"VanCtl HMI",description:"Instrument-cluster dashboard — tabbed cluster, climate arc, pinned quick actions",preview:!0});
