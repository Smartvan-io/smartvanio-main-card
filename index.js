/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let o=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(s,t,i)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:h}=Object,u=globalThis,g=u.trustedTypes,b=g?g.emptyScript:"",f=u.reactiveElementPolyfillSupport,m=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?b:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},_=(t,e)=>!a(t,e),x={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:_};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);o?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const t=h(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const r=o.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const r=this.constructor;if(!1===s&&(o=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??_)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[m("elementProperties")]=new Map,y[m("finalized")]=new Map,f?.({ReactiveElement:y}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,$=t=>t,k=w.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,M="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+E,A=`<${C}>`,z=document,P=()=>z.createComment(""),I=t=>null===t||"object"!=typeof t&&"function"!=typeof t,L=Array.isArray,O="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,N=/>/g,j=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,D=/"/g,B=/^(?:script|style|textarea|title)$/i,F=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),q=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),H=new WeakMap,W=z.createTreeWalker(z,129);function V(t,e){if(!L(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Y=(t,e)=>{const i=t.length-1,s=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=T;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,d=0;for(;d<i.length&&(n.lastIndex=d,l=n.exec(i),null!==l);)d=n.lastIndex,n===T?"!--"===l[1]?n=R:void 0!==l[1]?n=N:void 0!==l[2]?(B.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=j):void 0!==l[3]&&(n=j):n===j?">"===l[0]?(n=o??T,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?j:'"'===l[3]?D:U):n===D||n===U?n=j:n===R||n===N?n=T:(n=j,o=void 0);const p=n===j&&t[e+1].startsWith("/>")?" ":"";r+=n===T?i+A:c>=0?(s.push(a),i.slice(0,c)+M+i.slice(c)+E+p):i+E+(-2===c?e:p)}return[V(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[l,c]=Y(t,e);if(this.el=K.createElement(l,i),W.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=W.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(M)){const e=c[r++],i=s.getAttribute(t).split(E),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:i,ctor:"."===n[1]?tt:"?"===n[1]?et:"@"===n[1]?it:Z}),s.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(B.test(s.tagName)){const t=s.textContent.split(E),e=t.length-1;if(e>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],P()),W.nextNode(),a.push({type:2,index:++o});s.append(t[e],P())}}}else if(8===s.nodeType)if(s.data===C)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(E,t+1));)a.push({type:7,index:o}),t+=E.length-1}o++}}static createElement(t,e){const i=z.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,s){if(e===q)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const r=I(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=X(t,o._$AS(t,e.values),o,s)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??z).importNode(e,!0);W.currentNode=s;let o=W.nextNode(),r=0,n=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Q(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new st(o,this,t)),this._$AV.push(e),a=i[++n]}r!==a?.index&&(o=W.nextNode(),r++)}return W.currentNode=z,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),I(t)?t===G||null==t||""===t?(this._$AH!==G&&this._$AR(),this._$AH=G):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>L(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==G&&I(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(V(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new J(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=H.get(t.strings);return void 0===e&&H.set(t.strings,e=new K(t)),e}k(t){L(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new Q(this.O(P()),this.O(P()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=$(t).nextSibling;$(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Z{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=G,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=G}_$AI(t,e=this,i,s){const o=this.strings;let r=!1;if(void 0===o)t=X(this,t,e,0),r=!I(t)||t!==this._$AH&&t!==q,r&&(this._$AH=t);else{const s=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=X(this,s[i+n],e,n),a===q&&(a=this._$AH[n]),r||=!I(a)||a!==this._$AH[n],a===G?t=G:t!==G&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!s&&this.j(t)}j(t){t===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===G?void 0:t}}class et extends Z{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==G)}}class it extends Z{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??G)===q)return;const i=this._$AH,s=t===G&&i!==G||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==G&&(i===G||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const ot=w.litHtmlPolyfillSupport;ot?.(K,Q),(w.litHtmlVersions??=[]).push("3.3.2");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class nt extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new Q(e.insertBefore(P(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}nt._$litElement$=!0,nt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:nt});const at=rt.litElementPolyfillSupport;at?.({LitElement:nt}),(rt.litElementVersions??=[]).push("4.2.2");class lt{constructor(t){this.host=t,t.addController(this),this.dragging=!1,this.itemId=null,this.w=1,this.h=1,this.previewCol=0,this.previewRow=0,this._tileEl=null,this._ghostEl=null,this._offsetX=0,this._offsetY=0,this._gridRect=null,this._gridPadLeft=16,this._gridPadTop=12,this._scrollEl=null,this._scrollRAF=null,this._pointerId=null,this._onPointerMove=this._onPointerMove.bind(this),this._onPointerUp=this._onPointerUp.bind(this)}hostConnected(){}hostDisconnected(){this._cleanup()}start(t){if(t.target.closest("button, input, select, .resize-btn"))return!1;const e=t.target.closest(".grid-tile");if(!e)return!1;const i=e.dataset.tileId;if(!i)return!1;t.preventDefault();const s=this.host.shadowRoot.querySelector(".unified-grid");if(!s)return!1;const o=e.getBoundingClientRect(),r=s.getBoundingClientRect();return this.itemId=i,this.w=parseInt(e.dataset.tileW,10)||1,this.h=parseInt(e.dataset.tileH,10)||1,this.dragging=!0,this._tileEl=e,this._gridRect=r,this._scrollEl=s,this._pointerId=t.pointerId,this._offsetX=t.clientX-o.left,this._offsetY=t.clientY-o.top,this.previewCol=parseInt(e.dataset.tileCol,10)||0,this.previewRow=parseInt(e.dataset.tileRow,10)||0,this._createGhost(e,o),e.style.opacity="0",e.style.pointerEvents="none",s.setPointerCapture(t.pointerId),s.addEventListener("pointermove",this._onPointerMove),s.addEventListener("pointerup",this._onPointerUp),s.addEventListener("pointercancel",this._onPointerUp),this.host.requestUpdate(),!0}_onPointerMove(t){if(!this.dragging)return;this._ghostEl&&(this._ghostEl.style.left=t.clientX-this._offsetX+"px",this._ghostEl.style.top=t.clientY-this._offsetY+"px");const e=this.host._gridCellW||80,i=this.host._gridGap||12,s=this._scrollEl,o=s?.scrollTop||0,r=s?.getBoundingClientRect()??this._gridRect,n=t.clientX-this._offsetX,a=t.clientY-this._offsetY,l=n-r.left-this._gridPadLeft,c=a-r.top-this._gridPadTop+o,d=Math.max(0,Math.min(this.host._gridCols-this.w,Math.round(l/(e+i)))),p=Math.max(0,Math.round(c/(e+i)));d===this.previewCol&&p===this.previewRow||(this.previewCol=d,this.previewRow=p,this.host.onTileDragMove(this.itemId,d,p)),this._autoScroll(t)}_onPointerUp(t){this.dragging&&(this.host.onTileDragEnd(this.itemId,this.previewCol,this.previewRow),this._cleanup(),this.host.requestUpdate())}_createGhost(t,e){const i=t.cloneNode(!0);i.classList.add("drag-ghost"),i.style.cssText=`\n      position: fixed;\n      left: ${e.left}px;\n      top: ${e.top}px;\n      width: ${e.width}px;\n      height: ${e.height}px;\n      z-index: 10000;\n      opacity: 0.85;\n      pointer-events: none;\n      box-shadow: 0 8px 30px rgba(0,0,0,0.5);\n      border-radius: 16px;\n      transition: none;\n      animation: none;\n    `,this.host.shadowRoot.appendChild(i),this._ghostEl=i}_autoScroll(t){this._scrollRAF&&cancelAnimationFrame(this._scrollRAF);const e=this._scrollEl;if(!e)return;const i=e.getBoundingClientRect(),s=40;let o=0;if(t.clientY>i.bottom-s?o=(t.clientY-(i.bottom-s))/s*10:t.clientY<i.top+s&&(o=(i.top+s-t.clientY)/s*-10),Math.abs(o)>.5){const t=()=>{e.scrollTop+=o,this._gridRect=e.getBoundingClientRect(),this.dragging&&(this._scrollRAF=requestAnimationFrame(t))};this._scrollRAF=requestAnimationFrame(t)}}_cleanup(){this._scrollRAF&&(cancelAnimationFrame(this._scrollRAF),this._scrollRAF=null),this._ghostEl&&(this._ghostEl.remove(),this._ghostEl=null),this._tileEl&&(this._tileEl.style.opacity="",this._tileEl.style.pointerEvents="",this._tileEl=null);const t=this.host.shadowRoot?.querySelector(".unified-grid");if(t&&null!=this._pointerId){try{t.releasePointerCapture(this._pointerId)}catch(t){}t.removeEventListener("pointermove",this._onPointerMove),t.removeEventListener("pointerup",this._onPointerUp),t.removeEventListener("pointercancel",this._onPointerUp)}this.dragging=!1,this.itemId=null,this._pointerId=null}}function ct(t,e){const i=[];for(const[s,o]of Object.entries(t))for(let t=o.row;t<o.row+o.h;t++){i[t]||(i[t]=new Array(e).fill(null));for(let r=o.col;r<o.col+o.w;r++)r<e&&(i[t][r]=s)}return i}function dt(t,e,i,s,o,r){if(e+s>r||e<0)return!1;for(let r=i;r<i+o;r++)for(let i=e;i<e+s;i++)if(null!=t[r]?.[i])return!1;return!0}function pt(t,e,i,s,o,r,n){for(let a=i;a<i+o;a++){t[a]||(t[a]=new Array(n).fill(null));for(let i=e;i<e+s;i++)i<n&&(t[a][i]=r)}}function ht(t,e,i,s){for(let o=0;o<200;o++)for(let r=0;r<=e-i;r++)if(dt(t,r,o,i,s,e))return{col:r,row:o};return{col:0,row:0}}function ut(t,e,i){const s={},o=[];for(const r of t){if("spacer"===r.type)continue;const{w:t,h:n}=i(r),a=ht(o,e,t,n);s[r.id]={col:a.col,row:a.row,w:t,h:n},pt(o,a.col,a.row,t,n,r.id,e)}return s}function gt(t,e){return!(t.col+t.w<=e.col||e.col+e.w<=t.col||t.row+t.h<=e.row||e.row+e.h<=t.row)}function bt(t,e){const i=t[e],s=[];for(const[o,r]of Object.entries(t))o!==e&&gt(i,r)&&s.push(o);return s}function ft(t,e,i,s,o){const r={};for(const[e,i]of Object.entries(t))r[e]={...i};const n=r[e];if(!n)return r;i=Math.max(0,Math.min(o-n.w,i)),s=Math.max(0,s),n.col=i,n.row=s;for(let t=0;t<50;t++){const i=bt(r,e);if(0===i.length)break;for(const e of i){const i=r[e],s=n.col+n.w;if(s+i.w<=o){const t={col:i.col,row:i.row};i.col=s;if(0===bt(r,e).length)continue;i.col=t.col,i.row=t.row}const a=n.col-i.w;if(a>=0){const t={col:i.col,row:i.row};i.col=a;if(0===bt(r,e).length)continue;i.col=t.col,i.row=t.row}i.row=n.row+n.h,mt(r,e,50-t)}}return r}function mt(t,e,i){for(let s=0;s<i;s++){const i=bt(t,e);if(0===i.length)return;let s=0;for(const e of i){const i=t[e];s=Math.max(s,i.row+i.h)}t[e].row=s}}function vt(t,e,i,s){const o={},r=[],n=new Map(e.filter(t=>"spacer"!==t.type).map(t=>[t.id,t]));for(const e of t){if(null==e)continue;const t=n.get(e);if(!t)continue;const{w:a,h:l}=s(t),c=ht(r,i,a,l);o[e]={col:c.col,row:c.row,w:a,h:l},pt(r,c.col,c.row,a,l,e,i),n.delete(e)}for(const[t,e]of n){const{w:n,h:a}=s(e),l=ht(r,i,n,a);o[t]={col:l.col,row:l.row,w:n,h:a},pt(r,l.col,l.row,n,a,t,i)}return o}const _t=[{name:"Warm",r:255,g:180,b:107},{name:"Cool",r:200,g:220,b:255},{name:"White",r:255,g:255,b:255},{name:"Red",r:255,g:50,b:50},{name:"Blue",r:50,g:100,b:255},{name:"Green",r:50,g:200,b:80}],xt=[{keyword:"water",label:"Water",icon:"mdi:water",color:"#2196F3",warnBelow:25},{keyword:"gas",label:"Gas",icon:"mdi:gas-cylinder",color:"#FF9800",warnBelow:20},{keyword:"waste",label:"Waste",icon:"mdi:delete-empty",color:"#78909C",warnAbove:75}];function yt(t,e,i){return"#"+[t,e,i].map(t=>t.toString(16).padStart(2,"0")).join("")}const wt=r`
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
`;customElements.define("smartvanio-select",class extends nt{static get properties(){return{value:{type:String},options:{type:Array},placeholder:{type:String},variant:{type:String}}}constructor(){super(),this.value="",this.options=[],this.placeholder=void 0,this.variant="default"}_onChange(t){this.dispatchEvent(new CustomEvent("smartvanio-change",{detail:{value:t.target.value},bubbles:!0,composed:!0}))}_option(t){return F`<option value="${t.value}" ?selected=${this.value===t.value}>${t.label}</option>`}render(){return F`
      <div class="wrap ${this.variant??"default"}">
        <select .value=${this.value??""} @change=${this._onChange}>
          ${void 0!==this.placeholder?F`<option value="" ?selected=${!this.value}>${this.placeholder}</option>`:""}
          ${(this.options??[]).map(t=>void 0!==t.groupLabel?F`<optgroup label="${t.groupLabel}">${(t.options??[]).map(t=>this._option(t))}</optgroup>`:this._option(t))}
        </select>
      </div>
    `}static get styles(){return r`
      :host { display: contents; }

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
    `}});customElements.define("smartvanio-modal-edit",class extends nt{static get properties(){return{hass:{type:Object},entityId:{type:String,attribute:"entity-id"},deviceId:{type:String,attribute:"device-id"},editName:{type:String,attribute:"edit-name"},editRows:{type:Array},editSaving:{type:Boolean,attribute:"edit-saving"},editLoading:{type:Boolean,attribute:"edit-loading"},calPoints:{type:Array},calKind:{type:String,attribute:"cal-kind"},lightSegments:{type:Array},maxLeds:{type:Number,attribute:"max-leds"},expandedSegColor:{type:String,attribute:"expanded-seg-color"},saveError:{type:String,attribute:"save-error"},isButton:{type:Boolean,attribute:"is-button"},isTank:{type:Boolean,attribute:"is-tank"},isLight:{type:Boolean,attribute:"is-light"},targetEntities:{type:Array}}}constructor(){super(),this.editRows=[],this.lightSegments=[],this.maxLeds=0,this.calPoints=null,this.calKind="linear",this.targetEntities=[]}_emit(t,e={}){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}_renderCalibrationSection(){const t=this.entityId+"_voltage",e=parseFloat(this.hass?.states[t]?.state??0),i=this.calPoints??[];return F`
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
        ${i.map((t,e)=>F`
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
    `}_renderLightSegmentsSection(){const t=this.lightSegments??[];return F`
      <div class="modal-section">
        <div class="modal-section-header">
          <span class="modal-label">LED Strip</span>
        </div>
        <div class="seg-field">
          <span class="seg-field-label">Max LEDs</span>
          <input
            type="number"
            class="cal-input"
            min="1"
            step="1"
            .value=${String(this.maxLeds||"")}
            placeholder="e.g. 60"
            @change=${t=>this._emit("smartvanio-update-segment",{id:"__maxLeds__",field:"maxLeds",value:Math.max(1,+t.target.value)})}
          />
        </div>
      </div>
      <div class="modal-section">
        <div class="modal-section-header">
          <span class="modal-label">Segments</span>
          <button class="add-row-btn" @click=${()=>this._emit("smartvanio-add-segment")}>
            <ha-icon icon="mdi:plus"></ha-icon> Add
          </button>
        </div>
        ${t.length?"":F`<div class="no-automations">No segments — click Add to create one.</div>`}
        ${t.map((t,e)=>F`
            <div class="seg-card">
              <div class="seg-card-top">
                <input
                  type="color"
                  class="seg-color-input"
                  .value=${yt(t.r,t.g,t.b)}
                  @input=${i=>this._emit("smartvanio-update-segment",{id:t.id??e,field:"color",value:i.target.value})}
                />
                <input
                  type="text"
                  class="modal-input seg-name-input"
                  .value=${t.name}
                  placeholder="Name"
                  @input=${i=>this._emit("smartvanio-update-segment",{id:t.id??e,field:"name",value:i.target.value})}
                />
                <button
                  class="delete-row-btn"
                  @click=${()=>this._emit("smartvanio-remove-segment",{id:t.id??e})}
                >
                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                </button>
              </div>
              <div class="seg-card-bottom">
                <div class="seg-field">
                  <span class="seg-field-label">Start</span>
                  <input
                    type="number"
                    class="cal-input"
                    min="0"
                    step="1"
                    .value=${String(t.start??0)}
                    @change=${i=>this._emit("smartvanio-update-segment",{id:t.id??e,field:"start",value:Math.max(0,+i.target.value)})}
                  />
                </div>
                <div class="seg-field">
                  <span class="seg-field-label">End</span>
                  <input
                    type="number"
                    class="cal-input"
                    min="0"
                    step="1"
                    .value=${String(t.end??0)}
                    @change=${i=>this._emit("smartvanio-update-segment",{id:t.id??e,field:"end",value:Math.max(0,+i.target.value)})}
                  />
                </div>
                <div class="seg-field">
                  <span class="seg-field-label">Brightness</span>
                  <input
                    type="number"
                    class="cal-input"
                    min="1"
                    max="100"
                    .value=${String(t.brightness)}
                    @change=${i=>this._emit("smartvanio-update-segment",{id:t.id??e,field:"brightness",value:Math.max(1,Math.min(100,+i.target.value))})}
                  />
                  <span class="seg-bri-unit">%</span>
                </div>
              </div>
            </div>
          `)}
      </div>
    `}render(){if(!this.entityId)return F``;const t=this.entityId,e=this.hass?.entities?.[t]?.name||this.hass?.states[t]?.attributes?.friendly_name||t.split(".").pop();return F`
      <div
        class="modal-overlay"
        @click=${t=>{t.target===t.currentTarget&&this._emit("smartvanio-modal-close")}}
      >
        <div class="modal">
          <div class="modal-header">
            <span>Edit ${e}</span>
            <button class="modal-close" @click=${()=>this._emit("smartvanio-modal-close")}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>

          <div class="modal-body">
            ${this.editLoading?F`<div class="modal-loading">Loading…</div>`:F`
                  <div class="modal-section">
                    <label class="modal-label">Display Name</label>
                    <input
                      class="modal-input"
                      type="text"
                      .value=${this.editName??""}
                      @input=${t=>this._emit("smartvanio-update-edit-name",{value:t.target.value})}
                    />
                  </div>

                  ${this.isLight?this._renderLightSegmentsSection():""}
                  ${this.isTank?this._renderCalibrationSection():""}
                  ${this.isButton?F`
                        <div class="modal-section">
                          <div class="modal-section-header">
                            <span class="modal-label">Automations</span>
                            <button class="add-row-btn" @click=${()=>this._emit("smartvanio-add-edit-row")}>
                              <ha-icon icon="mdi:plus"></ha-icon> Add
                            </button>
                          </div>
                          ${(this.editRows??[]).length?"":F`<div class="no-automations">No automations yet — click Add to create one.</div>`}
                          ${(this.editRows??[]).map((t,e)=>F`
                              <div class="automation-row">
                                <smartvanio-select
                                  .value=${t.gesture}
                                  .options=${[{value:"press",label:"Press"},{value:"double_press",label:"Double Press"},{value:"hold",label:"Press & Hold"}]}
                                  placeholder="— Gesture —"
                                  @smartvanio-change=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"gesture",value:t.detail.value})}
                                ></smartvanio-select>

                                <smartvanio-select
                                  .value=${t.target_entity_id}
                                  .options=${(this.targetEntities??[]).map(t=>({groupLabel:t.label,options:t.entities.map(t=>({value:t.entity_id,label:t.label}))}))}
                                  placeholder="— Target —"
                                  @smartvanio-change=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"target_entity_id",value:t.detail.value})}
                                ></smartvanio-select>

                                <smartvanio-select
                                  .value=${t.action}
                                  .options=${this._actionsForEntity(t.target_entity_id).map(t=>({value:t,label:this._actionLabel(t)}))}
                                  placeholder="— Action —"
                                  @smartvanio-change=${t=>this._emit("smartvanio-update-edit-row",{id:e,field:"action",value:t.detail.value})}
                                ></smartvanio-select>

                                <button
                                  class="delete-row-btn"
                                  @click=${()=>this._emit("smartvanio-remove-edit-row",{id:e})}
                                >
                                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                                </button>
                              </div>
                            `)}
                        </div>
                      `:""}
                `}
          </div>

          ${this.saveError?F`<div class="save-error">${this.saveError}</div>`:""}
          <div class="modal-footer">
            <button class="modal-btn cancel" @click=${()=>this._emit("smartvanio-modal-close")}>
              Cancel
            </button>
            <button
              class="modal-btn save"
              ?disabled=${this.editSaving}
              @click=${()=>this._emit("smartvanio-save-edit",{entity_id:this.entityId,name:this.editName,rows:this.editRows,calPoints:this.calPoints,calKind:this.calKind,lightSegments:this.lightSegments,maxLeds:this.maxLeds})}
            >
              ${this.editSaving?"Saving…":"Save"}
            </button>
          </div>
        </div>
      </div>
    `}_actionsForEntity(t){const e=t?.split(".")?.[0];return"light"===e||"switch"===e?["toggle","turn_on","turn_off"]:"scene"===e?["turn_on"]:["toggle"]}_actionLabel(t){return"turn_on"===t?"Activate":"turn_off"===t?"Turn off":"toggle"===t?"Toggle":t.replace(/_/g," ").replace(/\b\w/g,t=>t.toUpperCase())}static get styles(){return[wt,r`
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
          max-height: 90vh;
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
          display: flex;
          flex-direction: column;
          gap: 20px;
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
          padding: 7px 8px;
          border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
          border-radius: 8px;
          background: var(--secondary-background-color, #f5f5f5);
          color: var(--primary-text-color);
          font-size: 13px;
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

        .seg-color-input {
          width: 36px;
          height: 36px;
          padding: 2px;
          border: none;
          border-radius: 6px;
          background: transparent;
          cursor: pointer;
        }

        .seg-name-input {
          min-width: 0;
        }

        .seg-bri-unit {
          font-size: 0.75rem;
          color: var(--secondary-text-color, #888);
        }
      `]}});customElements.define("smartvanio-modal-scene",class extends nt{static get properties(){return{hass:{type:Object},editingScene:{type:String,attribute:"editing-scene"},sceneEditName:{type:String,attribute:"scene-edit-name"},sceneEditLights:{type:Array},sceneEditSaving:{type:Boolean,attribute:"scene-edit-saving"},deviceId:{type:String,attribute:"device-id"},lightOptions:{type:Array},allScenes:{type:Array}}}constructor(){super(),this.sceneEditLights=[],this.lightOptions=[],this.allScenes=[]}_emit(t,e={}){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}render(){if(!this.editingScene)return F``;const t="new"===this.editingScene,e=new Set((this.sceneEditLights??[]).map(t=>t.entity_id)),i=this.lightOptions??[],s=i.some(t=>t.options?t.options.some(t=>!e.has(t.value)):!e.has(t.value));return F`
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

              <!-- Add-light dropdown -->
              <smartvanio-select
                variant="add"
                value=""
                .options=${i.map(t=>{if(t.options){const i=t.options.filter(t=>!e.has(t.value));return i.length?t.groupLabel?{groupLabel:t.groupLabel,options:i}:i[0]:null}return e.has(t.value)?null:t}).filter(Boolean)}
                .placeholder=${s?"+ Add light…":"All lights added"}
                @smartvanio-change=${t=>{t.detail.value&&this._emit("smartvanio-add-scene-light",{entity_id:t.detail.value})}}
              ></smartvanio-select>

              <!-- Light list -->
              ${(this.sceneEditLights??[]).length?"":F`<div class="no-automations">No lights added yet.</div>`}
              ${(this.sceneEditLights??[]).map(t=>{const e="ON"===(t.state??"ON").toUpperCase(),[i,s,o]=t.rgb_color??[255,255,255],r=Math.round((t.brightness??255)/255*100),n=this.hass?.states[t.entity_id]?.attributes?.supported_color_modes?.includes("rgb")??!1,a=yt(i,s,o),l=e?`rgb(${i},${s},${o})`:"rgba(128,128,128,0.4)",c=`linear-gradient(to right, ${l} 0%, ${l} ${r}%, var(--slider-track,#e0e0e0) ${r}%, var(--slider-track,#e0e0e0) 100%)`,d=this.hass?.entities?.[t.entity_id]?.name||this.hass?.states[t.entity_id]?.attributes?.friendly_name||t.entity_id.split(".").pop();return F`
                  <div class="scene-light-row">
                    <span class="scene-light-name">${d}</span>
                    <button
                      class="scene-state-btn ${e?"on":""}"
                      @click=${()=>this._emit("smartvanio-update-scene-light",{entity_id:t.entity_id,field:"state",value:e?"OFF":"ON"})}
                    >
                      ${e?"On":"Off"}
                    </button>
                    ${e?F`
                          <input
                            type="range"
                            class="br-slider scene-light-bri"
                            min="1"
                            max="100"
                            .value=${String(r)}
                            style="--sc:rgb(${i},${s},${o}); background:${c}"
                            @input=${t=>{const e=t.target.value,r=`rgb(${i},${s},${o})`;t.target.style.background=`linear-gradient(to right,${r} 0%,${r} ${e}%,var(--slider-track,#e0e0e0) ${e}%,var(--slider-track,#e0e0e0) 100%)`}}
                            @change=${e=>this._emit("smartvanio-update-scene-light",{entity_id:t.entity_id,field:"brightness",value:Math.round(+e.target.value/100*255)})}
                          />
                          ${n?F`
                                <input
                                  type="color"
                                  class="seg-color-input scene-light-color"
                                  .value=${a}
                                  @input=${e=>{const[i,s,o]=function(t){const e=parseInt(t.slice(1),16);return[e>>16&255,e>>8&255,255&e]}(e.target.value);this._emit("smartvanio-update-scene-light",{entity_id:t.entity_id,field:"rgb_color",value:[i,s,o]})}}
                                />
                              `:""}
                        `:""}
                    <button
                      class="delete-row-btn"
                      @click=${()=>this._emit("smartvanio-remove-scene-light",{entity_id:t.entity_id})}
                    >
                      <ha-icon icon="mdi:close"></ha-icon>
                    </button>
                  </div>
                `})}
            </div>
          </div>

          <div class="modal-footer">
            ${t?"":F`
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
    `}static get styles(){return[wt,r`
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
          max-height: 90vh;
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

        /* ── Scene light rows ──── */
        .scene-light-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
          flex-wrap: nowrap;
        }
        .scene-light-row:last-child {
          border-bottom: none;
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
      `]}});customElements.define("smartvanio-tile-light",class extends nt{static get properties(){return{hass:{type:Object},entityId:{type:String,attribute:"entity-id"},editMode:{type:Boolean,attribute:"edit-mode"},deviceId:{type:String,attribute:"device-id"},_dragState:{type:Object,state:!0},_expandedSegColor:{type:String,state:!0}}}constructor(){super(),this._dragState=new Map,this._expandedSegColor=null}_lightIsOn(t){return"on"===this.hass.states[t]?.state}_lightRgb(t){return this.hass.states[t]?.attributes?.rgb_color??[255,255,255]}_lightSupRgb(t){return this.hass.states[t]?.attributes?.supported_color_modes?.includes("rgb")??!1}_lightBrightness(t){const e=this._dragState.get(t);if(e?.active)return e.brightness;const i=parseFloat(localStorage.getItem(`smartvanio_bri_${t}`));if(!isNaN(i))return i;const s=this.hass.states[t];return s?.attributes?.brightness??s?.attributes?.last_brightness??255}_persistBrightness(t,e){localStorage.setItem(`smartvanio_bri_${t}`,e)}_lightPct(t){return Math.round(this._lightBrightness(t)/255*100)}_toggleLight(t){this.hass.callService("light","toggle",{entity_id:t})}_setBrightness(t,e){this.hass.callService("light","turn_on",{entity_id:t,brightness:Math.round(e)})}_setColor(t,e,i,s){this.hass.callService("light","turn_on",{entity_id:t,rgb_color:[e,i,s]})}_onSliderInput(t,e){const i=e.target.value/100*255;this._dragState=new Map(this._dragState).set(t,{active:!0,brightness:i}),this._updateSliderFill(e.target)}_onSliderChange(t,e){const i=e.target.value/100*255;this._dragState=new Map(this._dragState).set(t,{active:!1,brightness:i}),this._persistBrightness(t,i),this._setBrightness(t,i)}_updateSliderFill(t){const e=t.value,i=t.style.getPropertyValue("--sc")||"var(--primary-color)";t.style.background=`linear-gradient(to right, ${i} 0%, ${i} ${e}%, var(--slider-track, #e0e0e0) ${e}%, var(--slider-track, #e0e0e0) 100%)`}_emitEdit(){this.dispatchEvent(new CustomEvent("smartvanio-edit-entity",{detail:{entity_id:this.entityId},bubbles:!0,composed:!0}))}_renderSegCtrlRow(t){const[e,i,s]=t.attributes.rgb_color??[255,255,255],o=this._lightBrightness(t.entity_id),r=Math.round(o/255*100),n=this.hass.entities?.[t.entity_id]?.name||t.attributes.friendly_name||"Segment",a="on"===t.state,l=this._expandedSegColor===t.entity_id,c=a?`rgb(${e},${i},${s})`:`rgba(${e},${i},${s},0.35)`;return F`
      <div class="seg-ctrl-row ${a?"on":""}">
        <button
          class="seg-ctrl-toggle ${a?"on":""}"
          style="${a?`background:rgba(${e},${i},${s},0.2); color:rgb(${e},${i},${s})`:""}"
          @click=${e=>{e.stopPropagation(),this.hass.callService("light","toggle",{entity_id:t.entity_id})}}
        ><ha-icon icon="mdi:power"></ha-icon></button>
        <span class="seg-ctrl-name">${n}</span>
        <input
          type="range"
          min="1"
          max="100"
          .value=${r}
          class="br-slider seg-ctrl-bri"
          style="--sc:rgb(${e},${i},${s}); background:${`linear-gradient(to right, ${c} 0%, ${c} ${r}%, var(--slider-track,#e0e0e0) ${r}%, var(--slider-track,#e0e0e0) 100%)`}"
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
      ${l?F`
            <div class="seg-ctrl-colors">
              ${_t.map(e=>F`
                  <button
                    class="color-dot"
                    style="background:rgb(${e.r},${e.g},${e.b})"
                    title="${e.name}"
                    @click=${i=>{i.stopPropagation(),this._setColor(t.entity_id,e.r,e.g,e.b),this._expandedSegColor=null}}
                  ></button>
                `)}
            </div>
          `:""}
    `}render(){if(!this.hass||!this.entityId)return F``;const t=this.entityId,e=this._lightIsOn(t),[i,s,o]=this._lightRgb(t),r=this._lightPct(t),n=this._lightSupRgb(t),a=this.hass.entities?.[t]?.name||this.hass.states[t]?.attributes?.friendly_name||t.split(".").pop(),l=e?`rgba(${i},${s},${o},0.4)`:"transparent",c=e?`rgb(${i},${s},${o})`:"var(--secondary-text-color, #888)",d=e?`linear-gradient(to right, rgb(${i},${s},${o}) 0%, rgb(${i},${s},${o}) ${r}%, var(--slider-track,#e0e0e0) ${r}%, var(--slider-track,#e0e0e0) 100%)`:"",p=Object.values(this.hass.states).filter(e=>e.entity_id.startsWith("light.")&&e.attributes?.smartvanio_parent_entity_id===t).sort((t,e)=>(t.attributes.segment_start??0)-(e.attributes.segment_start??0));return F`
      <div
        class="light-tile ${e?"on":""} ${this.editMode?"editable":""}"
        data-eid="${t}"
      >
        <div
          class="lt-header"
          @click=${()=>this.editMode?this._emitEdit():this._toggleLight(t)}
        >
          <div class="lt-icon" style="--glow:${l}; --ic:${c}">
            <ha-icon icon="mdi:lightbulb${e?"-on":"-outline"}"></ha-icon>
          </div>
          <div class="lt-info">
            <div class="lt-name">${a}</div>
            <div class="lt-state">${e?`${r}%`:"Off"}</div>
          </div>
          ${this.editMode?F`<ha-icon class="tile-edit-icon" icon="mdi:pencil-outline"></ha-icon>`:F`<div class="toggle ${e?"on":""}">
                <div class="toggle-dot"></div>
              </div>`}
        </div>

        ${this.editMode?F`
              ${p.length?F`
                    <div class="seg-edit-list">
                      ${p.map(t=>{const[e,i,s]=t.attributes.rgb_color??[255,255,255],o="on"===t.state?(t.attributes.brightness??255)/255:.3,r=this.hass.entities?.[t.entity_id]?.name||t.attributes.friendly_name||t.entity_id,n=t.attributes.segment_start??0,a=t.attributes.segment_end??0,l="on"===t.state;return F`
                          <div
                            class="seg-row ${l?"on":""}"
                            @click=${e=>{e.stopPropagation(),this.hass.callService("light",l?"turn_off":"turn_on",{entity_id:t.entity_id})}}
                          >
                            <span
                              class="seg-row-swatch"
                              style="background:rgba(${e},${i},${s},${o})"
                            ></span>
                            <span class="seg-row-name">${r}</span>
                            <span class="seg-row-range">${n}–${a}</span>
                            <ha-icon
                              class="seg-row-toggle-icon"
                              icon="mdi:power${l?"":"-off"}"
                            ></ha-icon>
                          </div>
                        `})}
                    </div>
                  `:""}
            `:F`
              <div class="lt-controls">
                <input
                  type="range"
                  min="1"
                  max="100"
                  .value=${r}
                  @input=${e=>this._onSliderInput(t,e)}
                  @change=${e=>{if(p.length){const i=e.target.value/100*255,s=new Map(this._dragState);s.set(t,{active:!1,brightness:i}),this._persistBrightness(t,i),p.forEach(t=>{s.set(t.entity_id,{active:!1,brightness:i}),this._persistBrightness(t.entity_id,i),this._setBrightness(t.entity_id,i)}),this._dragState=s}else this._onSliderChange(t,e)}}
                  class="br-slider"
                  style="--sc:rgb(${i},${s},${o}); background:${d}"
                />
                ${n?F`
                      ${p.length?F`
                            <div class="seg-ctrl-list">
                              ${p.map(t=>this._renderSegCtrlRow(t))}
                            </div>
                          `:F`
                            <div class="color-row">
                              ${_t.map(e=>F`
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
    `}static get styles(){return[wt,r`
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
      `]}});customElements.define("smartvanio-tile-switch",class extends nt{static get properties(){return{hass:{type:Object},entityId:{type:String,attribute:"entity-id"},editMode:{type:Boolean,attribute:"edit-mode"},icon:{type:String},label:{type:String}}}constructor(){super(),this.icon="mdi:electric-switch"}_emitEdit(){this.dispatchEvent(new CustomEvent("smartvanio-edit-entity",{detail:{entity_id:this.entityId},bubbles:!0,composed:!0}))}_toggle(){const t="on"===this.hass.states[this.entityId]?.state;this.hass.callService("switch",t?"turn_off":"turn_on",{entity_id:this.entityId})}render(){if(!this.hass||!this.entityId)return F``;const t="on"===this.hass.states[this.entityId]?.state,e=this.label||this.hass.entities?.[this.entityId]?.name||this.hass.states[this.entityId]?.attributes?.friendly_name||this.entityId.split(".").pop();return F`
      <div
        class="switch-tile ${t?"on":""} ${this.editMode?"editable":""}"
        data-eid="${this.entityId}"
        @click=${()=>this.editMode?this._emitEdit():this._toggle()}
      >
        <ha-icon icon="${this.icon}" class="sw-icon"></ha-icon>
        <span class="sw-label">${e}</span>
        ${this.editMode?F`<ha-icon class="tile-edit-icon" icon="mdi:pencil-outline"></ha-icon>`:F`<div class="toggle ${t?"on":""}">
              <div class="toggle-dot"></div>
            </div>`}
      </div>
    `}static get styles(){return[wt,r`
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
      `]}});customElements.define("smartvanio-tile-tank",class extends nt{static get properties(){return{hass:{type:Object},entityId:{type:String,attribute:"entity-id"},editMode:{type:Boolean,attribute:"edit-mode"},label:{type:String}}}_emitEdit(){this.dispatchEvent(new CustomEvent("smartvanio-edit-entity",{detail:{entity_id:this.entityId},bubbles:!0,composed:!0}))}render(){if(!this.hass||!this.entityId)return F``;const t=this.entityId,e=this.label||this.hass.entities?.[t]?.name||this.hass.states[t]?.attributes?.friendly_name||t.split(".").pop(),i=function(t,e){return xt.find(e=>t.includes(e.keyword))??{label:e,icon:"mdi:gauge",color:"var(--primary-color)"}}(t,e),s=this.hass.states[t],o=parseFloat(s?.state??"0"),r=isNaN(o)?0:o,n=s?.attributes?.unit_of_measurement??"%",a=void 0!==i.warnBelow&&r<=i.warnBelow||void 0!==i.warnAbove&&r>=i.warnAbove,l=a?"var(--error-color, #f44336)":i.color;return F`
      <div
        class="tank ${this.editMode?"editable":""}"
        data-eid="${t}"
        @click=${this.editMode?()=>this._emitEdit():void 0}
      >
        <div class="tank-top">
          <ha-icon icon="${i.icon}" style="color:${l}"></ha-icon>
          <span class="tank-label">${e}</span>
          ${this.editMode?F`<ha-icon class="tile-edit-icon" icon="mdi:pencil-outline"></ha-icon>`:F`<span class="tank-pct ${a?"warn":""}">${Math.round(r)}${n}</span>`}
        </div>
        <div class="tank-track">
          <div
            class="tank-fill"
            style="width:${Math.min(100,Math.max(0,r))}%; background:${l}"
          ></div>
        </div>
      </div>
    `}static get styles(){return[wt,r`
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
      `]}});customElements.define("smartvanio-tile-binary-sensor",class extends nt{static get properties(){return{hass:{type:Object},entityId:{type:String,attribute:"entity-id"},editMode:{type:Boolean,attribute:"edit-mode"},variant:{type:String},deviceId:{type:String,attribute:"device-id"},channel:{type:String}}}constructor(){super(),this.variant="door"}_emitEdit(){this.dispatchEvent(new CustomEvent("smartvanio-edit-entity",{detail:{entity_id:this.entityId},bubbles:!0,composed:!0}))}_pressButton(){const t=`smartvanio/${this.deviceId}/binary_sensor/${this.channel}/state`;this.hass.callService("mqtt","publish",{topic:t,payload:'{"state":"ON"}'}),setTimeout(()=>{this.hass.callService("mqtt","publish",{topic:t,payload:'{"state":"OFF"}'})},150)}_renderDoor(){const t=this.entityId,e="on"===this.hass.states[t]?.state,i=this.hass.entities?.[t]?.name||this.hass.states[t]?.attributes?.friendly_name||t.split(".").pop();return F`
      <div
        class="sensor-tile ${e?"active":""} ${this.editMode?"editable":""}"
        data-eid="${t}"
        @click=${this.editMode?()=>this._emitEdit():void 0}
      >
        <ha-icon icon="${e?"mdi:door-open":"mdi:door-closed"}"></ha-icon>
        <span class="sensor-label">${i}</span>
        ${this.editMode?F`<ha-icon class="tile-edit-icon" icon="mdi:pencil-outline"></ha-icon>`:F`<span class="sensor-state">${e?"Open":"Closed"}</span>`}
      </div>
    `}_renderButton(){const t=this.entityId,e="on"===this.hass.states[t]?.state,i=this.hass.entities?.[t]?.name||this.hass.states[t]?.attributes?.friendly_name||t.split(".").pop();return F`
      <div
        class="btn-tile ${e?"active":""} ${this.editMode?"editable":""}"
        data-eid="${t}"
        @click=${()=>{this.editMode?this._emitEdit():this._pressButton()}}
      >
        ${this.editMode?F`<ha-icon class="btn-edit-icon" icon="mdi:cog-outline"></ha-icon>`:F`<ha-icon icon="${e?"mdi:circle-slice-8":"mdi:circle-outline"}"></ha-icon>`}
        <span>${i}</span>
        <span class="btn-state">${this.editMode?"Edit":e?"Pressed":"—"}</span>
      </div>
    `}render(){return this.hass&&this.entityId?"button"===this.variant?this._renderButton():this._renderDoor():F``}static get styles(){return[wt,r`
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
      `]}});customElements.define("smartvanio-tile-inclinometer",class extends nt{static get properties(){return{pitch:{type:Number},roll:{type:Number}}}constructor(){super(),this.pitch=0,this.roll=0}render(){const t=isNaN(this.pitch)?0:this.pitch,e=isNaN(this.roll)?0:this.roll,i=t=>Math.max(-1,Math.min(1,t)),s=34*i(e/15),o=34*i(-t/15),r=Math.sqrt(t**2+e**2),n=r<1.5?"var(--success-color, #4caf50)":r<5?"var(--warning-color, #ff9800)":"var(--error-color, #f44336)",a=r<1.5,l=t=>{if(isNaN(t))return"—";return`${t>=0?"+":""}${t.toFixed(1)}°`};return F`
      <div class="level-tile">
        <div class="level-arena" style="--lvl-status:${n}">
          <div class="level-crosshair-h"></div>
          <div class="level-crosshair-v"></div>
          <div
            class="level-bubble"
            style="transform:translate(${s}px,${o}px);background:${n}"
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
            <ha-icon icon="${a?"mdi:check-circle":"mdi:alert-circle"}"></ha-icon>
            ${a?"Level":"Off level"}
          </div>
        </div>
      </div>
    `}static get styles(){return r`
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
    `}});customElements.define("smartvanio-tile-scene",class extends nt{static get properties(){return{hass:{type:Object},entityId:{type:String,attribute:"entity-id"},editMode:{type:Boolean,attribute:"edit-mode"},label:{type:String}}}_emitEdit(){this.dispatchEvent(new CustomEvent("smartvanio-edit-entity",{detail:{entity_id:this.entityId},bubbles:!0,composed:!0}))}_emitOpenSceneModal(){this.dispatchEvent(new CustomEvent("smartvanio-open-scene-modal",{detail:{entity_id:this.entityId},bubbles:!0,composed:!0}))}render(){if(!this.hass||!this.entityId)return F``;const t=this.entityId,e=this.hass.states[t],i=e?.attributes?.icon??"mdi:palette",s=e?.attributes?.light_count??0,o=e?.state,r=!o||"unknown"===o||"unavailable"===o?"Never activated":function(t){try{const e=Date.now()-new Date(t).getTime(),i=Math.floor(e/6e4);if(i<1)return"just now";if(i<60)return`${i}m ago`;const s=Math.floor(i/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}catch{return"—"}}(o),n=this.label||this.hass.entities?.[t]?.name||e?.attributes?.friendly_name||t.split(".").pop();return F`
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
            <span>${r}</span>
          </div>
        </div>
        ${this.editMode?F`<ha-icon class="tile-edit-icon" icon="mdi:pencil-outline"></ha-icon>`:""}
      </div>
    `}static get styles(){return[wt,r`
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
      `]}});const $t=[{id:"climate",icon:"mdi:thermometer",label:"Climate"},{id:"scenes",icon:"mdi:palette",label:"Scenes"},{id:"actions",icon:"mdi:lightning-bolt",label:"Automations"},{id:"level",icon:"mdi:spirit-level",label:"Level"},{id:"status",icon:"mdi:gauge",label:"Status"}],kt=100,St=100,Mt=135,Et=270,Ct=22140*Math.PI/180,At=16740*Math.PI/180;function zt(t,e,i,s){const o=s*Math.PI/180;return[t+i*Math.cos(o),e+i*Math.sin(o)]}function Pt(t,e=270){const[i,s]=zt(kt,St,t,Mt),[o,r]=zt(kt,St,t,Mt+e),n=e>180?1:0;return`M ${i.toFixed(2)} ${s.toFixed(2)} A ${t} ${t} 0 ${n} 1 ${o.toFixed(2)} ${r.toFixed(2)}`}customElements.define("smartvanio-main-card",class extends nt{static get properties(){return{hass:{type:Object},config:{type:Object},_selectedId:{type:String},_dragState:{type:Object},_pendingTargetTemp:{type:Number},_openSections:{type:Object},_activeTab:{type:String},_setupMode:{type:Boolean},_pendingSlots:{type:Object},_cardConfig:{type:Object},_mqttDeviceConfig:{type:Object},_deviceStatuses:{type:Object},_knownDevices:{type:Object},_editingEntity:{type:String},_editName:{type:String},_editRows:{type:Array},_editSaving:{type:Boolean},_editLoading:{type:Boolean},_saveError:{type:String},_autoModal:{type:Object},_tilePopover:{type:Object},_editingScene:{type:String},_sceneEditName:{type:String},_sceneEditLights:{type:Array},_sceneEditSaving:{type:Boolean},_dndMode:{type:Boolean}}}constructor(){super(),this._selectedId=null,this._dragState=new Map,this._pendingTargetTemp=null,this._climateDragging=!1,this._openSections={groups:!0,lighting:!0},this._lpTimer=null,this._lpOrigin=null,this._activeTab="climate",this._setupMode=!1,this._pendingSlots=null,this._cardConfig={pinnedActions:[]},this._mqttDeviceConfig=null,this._mqttUnsub=null,this._mqttDevUnsub=null,this._statusUnsub=null,this._allDevCfgUnsub=null,this._deviceStatuses={},this._knownDevices={},this._editingEntity=null,this._editName="",this._editRows=[],this._editSaving=!1,this._editLoading=!1,this._editOriginalIds={},this._saveError=null,this._autoModal=null,this._tilePopover=null,this._tileLpTimer=null,this._tileLpOrigin=null,this._editingScene=null,this._sceneEditName="",this._sceneEditLights=[],this._sceneEditSaving=!1,this._dndMode=!1,this._gridRo=null,this._gridCols=4,this._gridRows=4,this._gridCellW=72,this._gridKey="4x4",this._currentLayout=null,this._dragController=new lt(this),this._cmMove=t=>this._onClimatePointerMove(t),this._cmUp=()=>this._onClimatePointerUp()}connectedCallback(){super.connectedCallback();const t=()=>{const t=this.getBoundingClientRect().top,e=window.innerHeight-t;e>100&&(this.style.height=`${e}px`)};this._ro=new ResizeObserver(t),this._ro.observe(document.documentElement),requestAnimationFrame(t),this._applyNebulaBg()}setConfig(t){if(!t)throw new Error("smartvanio-main-card: config required");this.config=t,t.device_id&&(this._selectedId=t.device_id)}shouldUpdate(){return!0}updated(t){super.updated?.(t),t.has("_selectedId")?(this._mqttUnsub&&(this._mqttUnsub(),this._mqttUnsub=null),this._selectedId&&this.hass&&this._subscribeMqttConfig()):t.has("hass")&&this._selectedId&&(this._mqttUnsub||this._subscribeMqttConfig()),this.hass&&!this._statusUnsub&&this._subscribeBoardStatuses(),this.hass&&!this._allDevCfgUnsub&&this._subscribeAllBoardConfigs(),this._setupMode?(this._gridRo?.disconnect(),this._gridRo=null):this._setupGridObserver(),(t.has("_dndMode")||t.has("_setupMode"))&&this.classList.toggle("dnd-active",this._dndMode&&!this._setupMode)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=null,this._gridRo?.disconnect(),this._gridRo=null,this._mqttUnsub&&(this._mqttUnsub(),this._mqttUnsub=null),this._statusUnsub&&(this._statusUnsub(),this._statusUnsub=null),this._allDevCfgUnsub&&(this._allDevCfgUnsub(),this._allDevCfgUnsub=null),window.removeEventListener("pointermove",this._cmMove),window.removeEventListener("pointerup",this._cmUp)}_applyNebulaBg(){const t=["radial-gradient(ellipse at 15% 20%, rgba(124,131,255,0.18) 0%, transparent 50%)","radial-gradient(ellipse at 85% 15%, rgba(34,211,238,0.10) 0%, transparent 40%)","radial-gradient(ellipse at 70% 75%, rgba(244,114,182,0.08) 0%, transparent 45%)","radial-gradient(ellipse at 30% 65%, rgba(99,102,241,0.14) 0%, transparent 38%)","radial-gradient(ellipse at 50% 50%, rgba(52,211,153,0.05) 0%, transparent 55%)","#0A0E1A"].join(",");document.documentElement.style.setProperty("background",t,"important"),document.body.style.setProperty("background","transparent","important");const e="smartvanio-nebula";let i=this;for(;i;){const t=i.getRootNode();if(t instanceof ShadowRoot){if(!t.getElementById(e)){const i=document.createElement("style");i.id=e,i.textContent="\n      :host {\n        background: transparent !important;\n        --primary-background-color: transparent !important;\n        --lovelace-background: transparent !important;\n        --ha-card-background: transparent !important;\n      }\n    ",t.appendChild(i)}t.host.style.setProperty("background","transparent","important"),i=t.host}else{if(!i.parentElement)break;i.style.setProperty("background","transparent","important"),i=i.parentElement}}}getCardSize(){return 8}static getStubConfig(){return{slots:{resources:[],pitch:"",roll:"",temperature:"",fans:[],lights:[],switches:[],status_sensors:[]}}}async _subscribeMqttConfig(){if(!this.hass||!this._selectedId)return;const t=`smartvanio/${this._selectedId}/hmi_config`;try{const e=await this.hass.connection.subscribeMessage(t=>{if(!this._dndMode&&!this._mqttSaveGuard&&t?.payload)try{const e=JSON.parse(t.payload);this._cardConfig={pinnedActions:[],...e},this._currentLayout=null,this._gridCols>0&&this._applyLayoutForCurrentGrid()}catch{}},{type:"mqtt/subscribe",topic:t});this._mqttUnsub=e}catch(t){console.warn("[VanCtl HMI] MQTT config subscribe failed:",t)}}async _subscribeBoardStatuses(){if(this.hass)try{const t=await this.hass.connection.subscribeMessage(t=>{if(!t?.topic||!t?.payload)return;const e=t.topic.split("/");if(e.length<3)return;const i=e[1];try{const e=JSON.parse(t.payload);this._deviceStatuses={...this._deviceStatuses,[i]:"online"===e.state?"online":"offline"}}catch{}},{type:"mqtt/subscribe",topic:"smartvanio/+/status"});this._statusUnsub=t}catch(t){console.warn("[VanCtl HMI] MQTT status subscribe failed:",t)}}async _subscribeAllBoardConfigs(){if(this.hass)try{const t=await this.hass.connection.subscribeMessage(t=>{if(t?.payload)try{const e=JSON.parse(t.payload);if(!e.device_id)return;this._knownDevices={...this._knownDevices,[e.device_id]:{name:e.name,model:e.model,firmware:e.firmware}},e.device_id===this._selectedId&&(this._mqttDeviceConfig=e)}catch{}},{type:"mqtt/subscribe",topic:"smartvanio/+/config"});this._allDevCfgUnsub=t}catch(t){console.warn("[VanCtl HMI] MQTT board config subscribe failed:",t)}}_resolveSlots(){const t=this._cardConfig?.slots??this.config?.slots;if(void 0===t){const t=this._mqttDeviceConfig;return t?.entities?.some(t=>t.slot)?this._buildSlotsFromManifest(t):null}const e=t=>(t??[]).map(t=>"string"==typeof t?{entity:t}:{...t});return{resources:e(t.resources),pitch:t.pitch??null,roll:t.roll??null,temperature:t.temperature??null,fans:e(t.fans),lights:e(t.lights),switches:e(t.switches),status_sensors:t.status_sensors??[],water_temp:t.water_temp??null,target_temp:t.target_temp??null,fan_speed:t.fan_speed??null,climate_mode:t.climate_mode??null,heater:t.heater??null,water_pump:t.water_pump??null,groups:(t.groups??[]).map(t=>({id:t.id??`grp_${Math.random().toString(36).slice(2)}`,name:t.name??"Group",lights:t.lights??[],scenes:t.scenes??[]})),tileOrder:t.tileOrder??null}}_buildSlotsFromManifest(t){const e=this._entities(),i={resources:[],pitch:null,roll:null,temperature:null,fans:[],lights:[],switches:[],buttons:[],status_sensors:[],water_temp:null,target_temp:null,fan_speed:null,climate_mode:null,heater:null,water_pump:null};for(const s of t.entities){if(!s.slot)continue;const t=this._findEntityByChannel(s.type,s.channel,e);if(!t)continue;const o=s.slot;"resources"===o||"fans"===o||"lights"===o||"switches"===o||"buttons"===o?i[o].push({entity:t,name:s.name??s.channel}):"status_sensors"===o?i.status_sensors.push(t):o in i&&(i[o]=t)}return i}_findEntityByChannel(t,e,i){if(!i)return null;const s=i[{sensor:"sensors",switch:"switches",light:"lights",binary_sensor:"binary_sensors",number:"numbers",select:"selects"}[t]]??[];return s.find(({eid:t})=>t.includes(e))?.eid??null}_saveMqttConfig(){this.hass&&this._selectedId&&(this._mqttSaveGuard=!0,clearTimeout(this._mqttSaveGuardTimer),this._mqttSaveGuardTimer=setTimeout(()=>{this._mqttSaveGuard=!1},2e3),this.hass.callService("mqtt","publish",{topic:`smartvanio/${this._selectedId}/hmi_config`,payload:JSON.stringify(this._cardConfig),retain:!0,qos:1}))}_enterSetupMode(){this._dndMode=!1;const t=this._resolveSlots()??{resources:[],pitch:null,roll:null,temperature:null,fans:[],lights:[],switches:[],buttons:[],status_sensors:[],groups:[],water_temp:null,target_temp:null,fan_speed:null,climate_mode:null,heater:null,water_pump:null},e=JSON.parse(JSON.stringify(t)),i=this._entities();if(i){const t=(t,e)=>{const i=new Set(t.map(t=>t.entity));return[...t,...e.filter(t=>!i.has(t.eid)).map(t=>({entity:t.eid,name:null}))]};e.lights=t(e.lights,i.lights),e.switches=t(e.switches,this._powerSwitches(i.switches)),e.buttons=t(e.buttons??[],this._buttonEntities(i.binary_sensors));const s=new Set(e.resources.map(t=>t.entity)),o=t=>i.sensors.find(({eid:e})=>t.test(e))?.eid;[{eid:o(/water_tank$/),name:"Water",color:"#5cacff"},{eid:o(/gas_tank$/),name:"Gas",color:"#f0b72f"},{eid:o(/waste_tank$/),name:"Waste",color:"#ff9492"},{eid:o(/fuel_level/),name:"Fuel",color:"#2bd853"}].forEach(({eid:t,name:i,color:o})=>{t&&!s.has(t)&&e.resources.push({entity:t,name:i,color:o})})}this._pendingSlots=e,this._setupMode=!0}_cancelSetupMode(){this._setupMode=!1,this._pendingSlots=null}_saveSetupMode(){this._cardConfig={...this._cardConfig,slots:this._pendingSlots},this._saveMqttConfig(),this._setupMode=!1,this._pendingSlots=null}_setPS(t,e){this._pendingSlots={...this._pendingSlots,[t]:e}}_addPSItem(t,e){this._pendingSlots={...this._pendingSlots,[t]:[...this._pendingSlots[t]??[],e]}}_removePSItem(t,e){const i=[...this._pendingSlots[t]??[]];i.splice(e,1),this._pendingSlots={...this._pendingSlots,[t]:i}}_updatePSItem(t,e,i,s){const o=[...this._pendingSlots[t]??[]];o[e]={...o[e],[i]:s},this._pendingSlots={...this._pendingSlots,[t]:o}}_isGroupOn(t){return(t.lights??[]).some(t=>"on"===this.hass.states[t]?.state)}_toggleGroup(t){const e=this._isGroupOn(t)?"turn_off":"turn_on";for(const i of t.lights??[])this.hass.callService("light",e,{entity_id:i})}_groupBrightness(t){const e=(t.lights??[]).map(t=>this.hass?.states?.[t]).filter(t=>"on"===t?.state).map(t=>t.attributes?.brightness??255);return e.length?Math.round(e.reduce((t,e)=>t+e,0)/e.length):0}_setGroupBrightness(t,e){for(const i of t.lights??[])this.hass.callService("light","turn_on",{entity_id:i,brightness:e})}static TILE_SIZES={group:[[1,1],[3,3]],light:[[1,1]],switch:[[1,1]]};_allowedSizes(t){return this.constructor.TILE_SIZES[t.type]??[[1,1]]}_cycleTileSize(t,e){if(!this._currentLayout?.[t])return;const i=this._allowedSizes(e);if(i.length<=1)return;const s=this._currentLayout[t],o=i.findIndex(([t,e])=>t===s.w&&e===s.h),[r,n]=i[(o+1)%i.length],a=()=>{const e={...this._currentLayout};e[t]={...s,w:r,h:n},this._currentLayout=ft(e,t,s.col,s.row,this._gridCols)};this._dndMode?(a(),this.requestUpdate()):this._animateGridTransition(a)}_enterDndMode(){this._dndMode=!0}_exitDndMode(){if(this._currentLayout){const t={...this._cardConfig?.slots?.layouts??{}};t[this._gridKey]=structuredClone(this._currentLayout);const e=Object.entries(this._currentLayout).sort(([,t],[,e])=>t.row-e.row||t.col-e.col).map(([t])=>t),i={...this._cardConfig?.slots??{},layouts:t,tileOrder:e};this._cardConfig={...this._cardConfig,slots:i}}this._saveMqttConfig(),this._dndMode=!1}_onGroupPointerDown(t,e){const i=this._currentLayout?.[e.id];i&&i.w>=3&&i.h>=3||0!==t.button&&"touch"!==t.pointerType||(this._lpOrigin={x:t.clientX,y:t.clientY},this._lpTimer=setTimeout(()=>{this._lpTimer=null,this._lpOrigin=null,this._cycleTileSize(e.id,{type:"group"})},500))}_onGroupPointerMove(t,e){const i=this._currentLayout?.[e.id];if(i&&i.w>=3&&i.h>=3)return;if(!this._lpTimer||!this._lpOrigin)return;const s=t.clientX-this._lpOrigin.x,o=t.clientY-this._lpOrigin.y;Math.sqrt(s*s+o*o)>8&&(clearTimeout(this._lpTimer),this._lpTimer=null,this._lpOrigin=null)}_onGroupPointerUp(t,e){const i=this._currentLayout?.[e.id];i&&i.w>=3&&i.h>=3||this._lpTimer&&(clearTimeout(this._lpTimer),this._lpTimer=null,this._lpOrigin=null,t.target.closest("button, input, select, ha-entity-toggle")||this._toggleGroup(e))}_setupGridObserver(){if(this._gridRo)return;const t=this.shadowRoot?.querySelector(".unified-grid");if(!t)return;const e=12;this._gridRo=new ResizeObserver(()=>{const i=t.clientWidth-32,s=t.clientHeight-24;if(i<1||s<1)return;let o=Math.max(3,Math.floor((i+e)/92)),r=(i-e*(o-1))/o;for(;r>140&&o<20;)o++,r=(i-e*(o-1))/o;for(;r<80&&o>3;)o--,r=(i-e*(o-1))/o;r=Math.round(r);let n=Math.max(3,Math.floor((s+e)/(r+e)));const a=o>1?(i-o*r)/(o-1):e,l=n>1?(s-n*r)/(n-1):e,c=Math.max(e,Math.round(Math.min(a,l)));t.style.gridTemplateColumns=`repeat(${o}, ${r}px)`,t.style.gridTemplateRows=`repeat(${n}, ${r}px)`,t.style.gap=`${c}px`,t.style.setProperty("--smartvanio-grid-cell-w",`${r}px`);const d=this._gridKey;this._gridCols=o,this._gridRows=n,this._gridCellW=r,this._gridGap=c,this._gridKey=`${o}x${n}`,d===this._gridKey&&this._currentLayout||this._applyLayoutForCurrentGrid()}),this._gridRo.observe(t)}_tileSizeFor(t){const e=this._allowedSizes(t);return{w:e[0][0],h:e[0][1]}}_applyLayoutForCurrentGrid(){const t=this._cardConfig?.slots?.layouts??{},e=this._gridKey,i=this._getAllTileItems();if(t[e])this._currentLayout=this._mergeNewItems(structuredClone(t[e]),i);else{const e=function(t,e,i){let s=null,o=1/0;for(const r of Object.keys(t)){const[t,n]=r.split("x").map(Number),a=10*Math.abs(t-e)+Math.abs(n-i);a<o&&(o=a,s=r)}return s}(t,this._gridCols,this._gridRows);e&&t[e]?this._currentLayout=this._mergeNewItems(function(t,e){const i=Object.entries(t).sort(([,t],[,e])=>t.row-e.row||t.col-e.col),s={},o=[];for(const[t,r]of i){const i=Math.min(r.w,e),n=r.h,a=ht(o,e,i,n);s[t]={col:a.col,row:a.row,w:i,h:n},pt(o,a.col,a.row,i,n,t,e)}return s}(t[e],this._gridCols),i):this._cardConfig?.slots?.tileOrder?.length?this._currentLayout=vt(this._cardConfig.slots.tileOrder,i,this._gridCols,t=>this._tileSizeFor(t)):this._currentLayout=ut(i,this._gridCols,t=>this._tileSizeFor(t))}this.requestUpdate()}_getAllTileItems(){const t=this._resolveSlots(),e=this._entities()??{lights:[],switches:[]},i=(t,e)=>{const i=(t??[]).map(({entity:t,name:e})=>({eid:t,state:this.hass?.states?.[t],_slotName:e})),s=new Set(i.map(t=>t.eid));return[...i,...e.filter(t=>!s.has(t.eid))]},s=i(t?.lights,e.lights),o=i(t?.switches,this._powerSwitches?.(e.switches)??[]),r=t?.groups??[];return this._orderedTiles(r,s,o,null)}_mergeNewItems(t,e){const i=new Set(e.filter(t=>"spacer"!==t.type).map(t=>t.id));for(const e of Object.keys(t))i.has(e)||delete t[e];const s=ct(t,this._gridCols);for(const i of e){if(t[i.id])continue;if("spacer"===i.type)continue;const{w:e,h:o}=this._tileSizeFor(i);let r=!1;for(let n=0;n<200&&!r;n++)for(let a=0;a<=this._gridCols-e&&!r;a++){let l=!0;for(let t=n;t<n+o&&l;t++)for(let i=a;i<a+e&&l;i++)null!=s[t]?.[i]&&(l=!1);if(l){t[i.id]={col:a,row:n,w:e,h:o};for(let t=n;t<n+o;t++){s[t]||(s[t]=new Array(this._gridCols).fill(null));for(let o=a;o<a+e;o++)s[t][o]=i.id}r=!0}}}return t}onTileDragMove(t,e,i){const s=this._getAllTileItems(),o=s.find(e=>e.id===t),r=this._tileAtCell(e,i,t),n=r?s.find(t=>t.id===r):null;if(o&&n&&this._canMerge(o,n))this._mergeTargetId=r,this._dragController.previewCol=e,this._dragController.previewRow=i;else if(this._mergeTargetId=null,this._currentLayout){const s=ft(this._currentLayout,t,e,i,this._gridCols)[t];s&&(this._dragController.previewCol=s.col,this._dragController.previewRow=s.row)}this.requestUpdate()}onTileDragEnd(t,e,i){if(this._mergeTargetId=null,!this._currentLayout)return;const s=this._getAllTileItems(),o=s.find(e=>e.id===t);if(o&&("light"===o.type||"group"===o.type)){const r=this._tileAtCell(e,i,t),n=r?s.find(t=>t.id===r):null;if(n&&this._canMerge(o,n))return void this._mergeIntoGroup(o,n,e,i)}this._currentLayout=ft(this._currentLayout,t,e,i,this._gridCols),this.requestUpdate()}_tileAtCell(t,e,i){if(!this._currentLayout)return null;for(const[s,o]of Object.entries(this._currentLayout))if(s!==i&&t>=o.col&&t<o.col+o.w&&e>=o.row&&e<o.row+o.h)return s;return null}_canMerge(t,e){return"light"===t.type&&"light"===e.type||("light"===t.type&&"group"===e.type||"group"===t.type&&"light"===e.type)}_mergeIntoGroup(t,e,i,s){const o={...this._cardConfig?.slots??{}},r=[...o.groups??[]],n=t=>"light"===t.type?[t.id]:"group"===t.type?[...t.data?.lights??[]]:[],a=n(t),l=n(e),c=[...new Set([...l,...a])];let d;if("group"===e.type){d=e.id;const t=r.findIndex(t=>t.id===d);-1!==t&&(r[t]={...r[t],lights:c})}else if("group"===t.type){d=t.id;const e=r.findIndex(t=>t.id===d);-1!==e&&(r[e]={...r[e],lights:c})}else d=`grp_${Date.now()}`,r.push({id:d,name:"New Group",lights:c,scenes:[]});o.groups=r,this._cardConfig={...this._cardConfig,slots:o};const p={...this._currentLayout},h=p[e.id];if(delete p[t.id],"group"===e.type);else{if("group"!==t.type){delete p[e.id];const t=h?.col??i,o=h?.row??s;return p[d]={col:t,row:o,w:3,h:3},this._currentLayout=ft(p,d,t,o,this._gridCols),void this.requestUpdate()}delete p[e.id]}this._currentLayout=p,this.requestUpdate()}_animateGridTransition(t){const e=this.shadowRoot?.querySelector(".unified-grid");if(!e)return void t();const i=[...e.children],s=new Map;i.forEach(t=>s.set(t.dataset.tileId,t.getBoundingClientRect())),t(),this.updateComplete.then(()=>{[...e.children].forEach(t=>{const e=t.dataset.tileId,i=s.get(e);if(!i)return;const o=t.getBoundingClientRect(),r=i.left-o.left,n=i.top-o.top,a=i.width/(o.width||1),l=i.height/(o.height||1);Math.abs(r)<1&&Math.abs(n)<1&&Math.abs(a-1)<.02||t.animate([{transform:`translate(${r}px, ${n}px) scale(${a}, ${l})`,transformOrigin:"top left"},{transform:"translate(0,0) scale(1,1)",transformOrigin:"top left"}],{duration:280,easing:"cubic-bezier(0.4, 0, 0.2, 1)"})})})}_orderedTiles(t,e,i,s){const o=new Set(t.flatMap(t=>t.lights??[])),r=e.filter(t=>!o.has(t.eid)),n=[];if(t.forEach(t=>n.push({type:"group",id:t.id,data:t})),r.forEach(t=>n.push({type:"light",id:t.eid,data:t})),i.forEach(t=>n.push({type:"switch",id:t.eid,data:t})),!s?.length)return n;const a=new Map(n.map(t=>[t.id,t])),l=[];let c=0;for(const t of s)if(null===t)l.push({type:"spacer",id:"_spacer_"+c++,data:null});else{const e=a.get(t);e&&(l.push(e),a.delete(t))}for(const t of a.values())l.push(t);return l}_saveTileOrder(t){const e=t.map(t=>t.id),i={...this._cardConfig?.slots??{},tileOrder:e};this._cardConfig={...this._cardConfig,slots:i},this._saveMqttConfig()}_onGrpLightPointerDown(t,e,i){if(0!==t.button&&"touch"!==t.pointerType)return;t.stopPropagation();const s=t.currentTarget,o=t.clientX,r=t.clientY;let n=null,a=!1,l=!1;const c=this.shadowRoot?.querySelector(".unified-grid");if(!c)return;c.setPointerCapture(t.pointerId);const d=this.shadowRoot?.querySelector(`.grid-tile[data-tile-id="${e}"]`),p=this.hass?.states?.[i],h="on"===p?.state,u=p?.attributes?.rgb_color??[255,200,80],g=this._label(i),b=this._gridCellW||80,f=(t,e)=>{if(!d)return!1;const i=d.getBoundingClientRect();return t>=i.left&&t<=i.right&&e>=i.top&&e<=i.bottom},m=t=>{const e=t.clientX-o,i=t.clientY-r;if(!a&&Math.sqrt(e*e+i*i)>10&&(a=!0,s.style.opacity="0.3"),!a)return;const c=f(t.clientX,t.clientY);n&&c===l||(n&&n.remove(),n=c?(()=>{const t=s.cloneNode(!0);return t.style.cssText=`\n        position:fixed; z-index:10000; pointer-events:none;\n        width:${s.offsetWidth}px; opacity:0.85;\n        background:rgba(22,27,34,0.95); border-radius:8px; padding:6px 10px;\n        box-shadow:0 4px 16px rgba(0,0,0,0.5);\n        display:flex; align-items:center; gap:10px;\n        transition:width 0.15s,height 0.15s,border-radius 0.15s;\n      `,t})():(()=>{const t=document.createElement("div");return t.innerHTML=`\n        <ha-icon icon="mdi:lightbulb" style="--mdc-icon-size:22px;color:${h?`rgb(${u[0]},${u[1]},${u[2]})`:"#9198a1"}"></ha-icon>\n        <span style="font-size:10px;font-weight:500;color:${h?"#f0f6fc":"#9198a1"};text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%">${g}</span>\n      `,t.style.cssText=`\n        position:fixed; z-index:10000; pointer-events:none;\n        width:${b}px; height:${b}px;\n        display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px;\n        border-radius:16px; padding:6px 4px; box-sizing:border-box;\n        background:${h?`rgba(${u[0]},${u[1]},${u[2]},0.12)`:"rgba(22,27,34,0.85)"};\n        box-shadow:0 8px 30px rgba(0,0,0,0.5);\n        opacity:0.9; transition:width 0.15s,height 0.15s,border-radius 0.15s;\n      `,t})(),this.shadowRoot.appendChild(n),l=c),l?(n.style.left=t.clientX-s.offsetWidth/2+"px",n.style.top=t.clientY-16+"px"):(n.style.left=t.clientX-b/2+"px",n.style.top=t.clientY-b/2+"px")},v=t=>{c.removeEventListener("pointermove",m),c.removeEventListener("pointerup",v),c.removeEventListener("pointercancel",v);try{c.releasePointerCapture(t.pointerId)}catch(t){}if(n&&n.remove(),s.style.opacity="",!a)return;if(f(t.clientX,t.clientY))return;const o=this._gridGap||12,r=c.getBoundingClientRect(),l=t.clientX-r.left-16,d=t.clientY-r.top-12+(c.scrollTop||0),p=Math.max(0,Math.min(this._gridCols-1,Math.round(l/(b+o)))),h=Math.max(0,Math.round(d/(b+o)));this._removeLightFromGroup(e,i,p,h),this.requestUpdate()};c.addEventListener("pointermove",m),c.addEventListener("pointerup",v),c.addEventListener("pointercancel",v)}_renameGroup(t,e){if(!e?.trim())return;const i={...this._cardConfig?.slots??{}},s=[...i.groups??[]],o=s.findIndex(e=>e.id===t);-1!==o&&(s[o]={...s[o],name:e.trim()},i.groups=s,this._cardConfig={...this._cardConfig,slots:i},this._saveMqttConfig())}_removeLightFromGroup(t,e,i,s){const o={...this._cardConfig?.slots??{}},r=[...o.groups??[]],n=r.findIndex(e=>e.id===t);if(-1===n)return;const a={...r[n]};if(a.lights=a.lights.filter(t=>t!==e),0===a.lights.length?r.splice(n,1):r[n]=a,o.groups=r,this._cardConfig={...this._cardConfig,slots:o},this._saveMqttConfig(),this._currentLayout){const o={...this._currentLayout};if(0===a.lights.length&&delete o[t],null!=i&&null!=s)o[e]={col:i,row:s,w:1,h:1};else{const i=o[t],s=i?i.col+i.w:0,r=i?.row??0;o[e]={col:Math.min(s,this._gridCols-1),row:r,w:1,h:1}}this._currentLayout=ft(o,e,o[e].col,o[e].row,this._gridCols)}}_renderGroupTileBody(t,e){const i=(t.lights??[]).map(t=>({eid:t,state:this.hass.states[t]})).filter(t=>t.state),s=(t.scenes??[]).map(t=>({eid:t,name:this.hass.states[t]?.attributes?.friendly_name??t.split(".").pop()})).filter(t=>this.hass.states[t.eid]);return F`
      ${i.length?F`
            <div class="group-lights-list">
              ${i.map(({eid:e,state:i})=>{const s="on"===i.state,o=i.attributes?.rgb_color??[255,255,255],r=`#${o.map(t=>t.toString(16).padStart(2,"0")).join("")}`,n=s?`rgb(${o[0]},${o[1]},${o[2]})`:"#3a3a3c",a=s?`0 0 6px rgb(${o[0]},${o[1]},${o[2]})`:"none",l=this._label(e),c=(i.attributes?.supported_color_modes??[]).some(t=>["rgb","rgbw","rgbww","hs","xy"].includes(t));return F`
                  <div class="grp-light-row ${s?"on":""}"
                    data-grp-light-eid=${e}
                    data-grp-id=${t.id}
                    @click=${t=>{t.stopPropagation(),this._toggleLight(e)}}
                    @pointerdown=${this._dndMode?i=>this._onGrpLightPointerDown(i,t.id,e):null}>
                    <div class="grp-light-dot" style="background:${n};box-shadow:${a}">
                      ${c?F`
                        <input type="color" class="grp-light-color" .value=${r}
                          @click=${t=>t.stopPropagation()}
                          @pointerdown=${t=>t.stopPropagation()}
                          @change=${t=>{t.stopPropagation();const i=t.target.value;this.hass.callService("light","turn_on",{entity_id:e,rgb_color:[parseInt(i.slice(1,3),16),parseInt(i.slice(3,5),16),parseInt(i.slice(5,7),16)]})}}
                        />
                      `:""}
                    </div>
                    <span class="grp-light-name">${l}</span>
                    ${this._dndMode?F`
                      <ha-icon class="grp-light-grip" icon="mdi:drag-horizontal-variant"></ha-icon>
                    `:""}
                  </div>
                `})}
            </div>
          `:""}
      ${s.length?F`
            <div class="group-scenes">
              ${s.map(({eid:t,name:e})=>F`
                  <button
                    class="scene-chip"
                    @click=${e=>{e.stopPropagation(),this._triggerScene(t)}}
                  >
                    ${e}
                  </button>
                `)}
            </div>
          `:""}
    `}_renderGroupTile(t,e){const i=t.lights.some(t=>"on"===this.hass?.states?.[t]?.state),s=e&&e.w>=3&&e.h>=3;return F`
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
          ${s&&this._dndMode?F`
            <input class="gtile-name-input" type="text"
              .value=${t.name}
              @click=${t=>t.stopPropagation()}
              @pointerdown=${t=>t.stopPropagation()}
              @change=${e=>{e.stopPropagation(),this._renameGroup(t.id,e.target.value)}}
              @keydown=${t=>{"Enter"===t.key&&t.target.blur()}}
            />
          `:F`<span class="gtile-name">${t.name}</span>`}
          ${s?F`
            <button class="gtile-toggle ${i?"on":""}"
              @click=${e=>{e.stopPropagation(),this._toggleGroup(t)}}
              @pointerdown=${t=>t.stopPropagation()}>
              <div class="gtile-toggle-thumb"></div>
            </button>
          `:""}
        </div>
        ${s?F`
          <div class="gtile-brightness" @click=${t=>t.stopPropagation()} @pointerdown=${t=>t.stopPropagation()}>
            <ha-icon icon="mdi:brightness-6" style="--mdc-icon-size:14px;color:#9198a1;flex-shrink:0"></ha-icon>
            <input type="range" class="gtile-bri-slider" min="0" max="255" .value=${this._groupBrightness(t)}
              @input=${e=>this._setGroupBrightness(t,parseInt(e.target.value))}
            />
          </div>
        `:""}

        ${s?"":F`
          <div class="gtile-dots">
            ${(t.lights??[]).map(t=>{const e=this.hass?.states?.[t],i="on"===e?.state,s=e?.attributes?.rgb_color??[255,255,255],o=i?`rgb(${s[0]},${s[1]},${s[2]})`:"#3a3a3c";return F`<div class="gtile-dot" style="background:${o};${i?`box-shadow:0 0 4px ${o}`:""}"></div>`})}
          </div>
        `}

        <div class="gtile-body">
          ${s?this._renderGroupTileBody(t,i):""}
        </div>
      </div>
    `}_renderSetupGroups(){const t=this._pendingSlots,e=t.groups??[],i=(t.lights??[]).map(t=>({eid:t.entity,label:t.name||this._label(t.entity)})).filter(t=>t.eid);return F`
      <div class="setup-list">
        ${e.map((t,e)=>F`
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
                ${i.map(({eid:i,label:s})=>{const o=(t.lights??[]).includes(i);return F`
                    <label
                      class="group-light-chip ${o?"on":""}"
                      @click=${()=>{const s=o?(t.lights??[]).filter(t=>t!==i):[...t.lights??[],i];this._updatePSItem("groups",e,"lights",s)}}
                    >
                      ${s}
                    </label>
                  `})}
                ${i.length?"":F`<span class="group-edit-hint"
                      >Add lights in the Lighting section first.</span
                    >`}
              </div>

              <div class="group-edit-section-title">Scenes</div>
              ${(t.scenes??[]).map((i,s)=>F`
                  <div class="setup-row">
                    ${this._entitySelect(["scene"],i,i=>{const o=[...t.scenes??[]];o[s]=i,this._updatePSItem("groups",e,"scenes",o)})}
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
    `}_entityOptions(t){return this.hass?.states?Object.entries(this.hass.states).filter(([e])=>t.some(t=>e.startsWith(t+"."))).map(([t,e])=>({eid:t,label:e.attributes?.friendly_name??t.split(".").pop()})).sort((t,e)=>t.label.localeCompare(e.label)):[]}_entitySelect(t,e,i){const s=this._entityOptions(t).map(({eid:t,label:e})=>({value:t,label:e}));return F`
      <smartvanio-select
        class="setup-entity-select"
        .value=${e??""}
        .options=${s}
        placeholder="— choose —"
        @smartvanio-change=${t=>i(t.detail.value||null)}
      >
      </smartvanio-select>
    `}_renderSetupClimate(){const t=this._pendingSlots;return F`
      <div class="setup-panel">
        <div class="setup-row">
          <span class="setup-label">Temperature</span>
          ${this._entitySelect(["sensor"],t.temperature,t=>this._setPS("temperature",t))}
        </div>
        <div class="setup-section-title">Fans</div>
        ${(t.fans??[]).map((t,e)=>F`
            <div class="setup-row">
              <input
                class="setup-name-input"
                .value=${t.name??""}
                placeholder="Name"
                @change=${t=>this._updatePSItem("fans",e,"name",t.target.value)}
              />
              ${this._entitySelect(["fan"],t.entity,t=>this._updatePSItem("fans",e,"entity",t))}
              <button
                class="setup-del"
                @click=${()=>this._removePSItem("fans",e)}
              >
                ✕
              </button>
            </div>
          `)}
        <button
          class="setup-add"
          @click=${()=>this._addPSItem("fans",{entity:"",name:""})}
        >
          + Add fan
        </button>
      </div>
    `}_renderSetupLevel(){const t=this._pendingSlots;return F`
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
    `}_renderSetupStatus(){const t=this._pendingSlots;return F`
      <div class="setup-panel">
        ${(t.status_sensors??[]).map((e,i)=>F`
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
    `}_renderSetupLighting(){const t=this._pendingSlots;return F`
      <div class="setup-list">
        ${(t.lights??[]).map((t,e)=>F`
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
    `}_renderSetupSwitches(){const t=this._pendingSlots;return F`
      <div class="setup-list">
        ${(t.switches??[]).map((t,e)=>F`
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
    `}_renderSetupButtons(){const t=this._pendingSlots;return F`
      <div class="setup-list">
        ${(t.buttons??[]).map((t,e)=>F`
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
    `}_renderButtonTile({eid:t,state:e,_slotName:i=null}){const s="on"===e?.state,o=this._label(t,i);return F`
      <div class="btile ${s?"active":""} ${this._setupMode?"editable":""}"
        @click=${()=>this._setupMode?this._openEditModal(t):void 0}>
        <ha-icon class="btile-icon"
          icon="${s?"mdi:circle-slice-8":"mdi:gesture-tap-button"}"></ha-icon>
        <span class="btile-name">${o}</span>
        <span class="btile-state">${this._setupMode?"Edit automations":s?"Pressed":"—"}</span>
      </div>
    `}_renderSetupResources(){const t=this._pendingSlots,e=["#5cacff","#f0b72f","#ff9492","#2bd853","#d3abff"];return F`
      ${(t.resources??[]).map((t,i)=>F`
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
    `}_isPinned(t){return(this._cardConfig.pinnedActions??[]).some(e=>e.id===t)}_addPinnedAction(t,e){if(this._isPinned(t))return;const i=[...this._cardConfig.pinnedActions??[],{id:t,label:e}];this._cardConfig={...this._cardConfig,pinnedActions:i},this._saveMqttConfig()}_removePinnedAction(t){const e=(this._cardConfig.pinnedActions??[]).filter(e=>e.id!==t);this._cardConfig={...this._cardConfig,pinnedActions:e},this._saveMqttConfig()}_triggerScene(t){const e=this.hass.states[t]?.attributes?.lights??[];if(!e.length)return this.hass.callService("scene","turn_on",{entity_id:t});const i=e.every(({entity_id:t,state:e="ON",brightness:i,rgb_color:s})=>{const o=this.hass.states[t];if(!o)return!1;if(o.state.toUpperCase()!==e.toUpperCase())return!1;if("OFF"===e.toUpperCase())return!0;if(void 0!==i&&Math.abs((o.attributes.brightness??0)-i)>6)return!1;if(s){const[t,e,i]=s,[r,n,a]=o.attributes.rgb_color??[0,0,0];if(Math.abs(r-t)>8||Math.abs(n-e)>8||Math.abs(a-i)>8)return!1}return!0});if(i){const t=e.map(t=>t.entity_id).filter(Boolean);return this.hass.callService("light","turn_off",{entity_id:t})}return this.hass.callService("scene","turn_on",{entity_id:t})}_runAction(t){const e=t.split(".")[0];if("scene"===e)return this._triggerScene(t);if("script"===e)return this.hass.callService("script","turn_on",{entity_id:t});if("switch"===e){const e="on"===this.hass.states[t]?.state;return this.hass.callService("switch",e?"turn_off":"turn_on",{entity_id:t})}return"light"===e?this.hass.callService("light","toggle",{entity_id:t}):void 0}_haDevice(){return this._selectedId&&this.hass?Object.values(this.hass.devices??{}).find(t=>t.identifiers?.some(([t,e])=>"smartvanio"===t&&e===this._selectedId))??null:null}_entities(){const t=this._haDevice();if(!t)return null;const e={lights:[],switches:[],sensors:[],binary_sensors:[],numbers:[],selects:[]};for(const[i,s]of Object.entries(this.hass.entities??{})){if(s.device_id!==t.id)continue;const o=this.hass.states[i];if(!o)continue;const r=i.split(".")[0];"light"!==r||o.attributes?.smartvanio_parent_entity_id?"switch"===r?e.switches.push({eid:i,state:o}):"sensor"===r?e.sensors.push({eid:i,state:o}):"binary_sensor"===r?e.binary_sensors.push({eid:i,state:o}):"number"===r?e.numbers.push({eid:i,state:o}):"select"===r&&e.selects.push({eid:i,state:o}):e.lights.push({eid:i,state:o})}return e}_levelEntities(t=null){if(!this.hass)return null;if(t){const e=t.pitch?this.hass.states[t.pitch]:null,i=t.roll?this.hass.states[t.roll]:null;return e||i?{pitch:e,roll:i}:null}const e=Object.values(this.hass.states),i=t=>"°"===t.attributes?.unit_of_measurement,s=e.find(t=>i(t)&&/adjusted.*pitch|pitch.*adjusted/i.test(t.entity_id))??e.find(t=>i(t)&&/pitch/i.test(t.entity_id)),o=e.find(t=>i(t)&&/adjusted.*roll|roll.*adjusted/i.test(t.entity_id))??e.find(t=>i(t)&&/roll/i.test(t.entity_id));return s||o?{pitch:s,roll:o}:null}_deviceScenes(){const t=this._haDevice();return t?Object.entries(this.hass.entities??{}).filter(([e,i])=>e.startsWith("scene.")&&i.device_id===t.id).map(([t])=>({eid:t,state:this.hass.states[t]})).filter(({state:t})=>t).sort((t,e)=>t.eid.localeCompare(e.eid)):[]}_allActions(){const t=[];for(const[e,i]of Object.entries(this.hass.states??{})){const s=e.split(".")[0];if("scene"===s||"script"===s){const o=i.attributes?.friendly_name??e.split(".").pop();t.push({id:e,label:o,domain:s})}}return t.sort((t,e)=>t.label.localeCompare(e.label))}_label(t,e=null){if(e)return e;const i=this.hass.entities?.[t]?.name;if(i)return i;const s=this.hass.states[t]?.attributes?.friendly_name??"",o=this._haDevice()?.name_by_user??this._haDevice()?.name??"";return o&&s.startsWith(o+" ")?s.slice(o.length+1):s||t.split(".").pop()}_smartvanioDeviceId(t){const e=this.hass?.entities?.[t]?.device_id;if(!e)return null;const i=this.hass?.devices?.[e],s=i?.identifiers?.find(([t])=>"smartvanio"===t);return s?.[1]??null}_powerSwitches(t){return t.filter(({eid:t})=>!/heater|water_pump|inclinometer/i.test(t))}_buttonEntities(t){return t.filter(({eid:t,state:e})=>"door"!==e?.attributes?.device_class&&!/door/i.test(t))}_channelFromEntity(t){const e=this._haDevice(),i=e?e.name.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/,""):this._selectedId;return t.split(".")[1].replace(i+"_","")}_automationId(t,e){const i=this._channelFromEntity(t);return`smartvanio_${this._selectedId}_${i}_${e}`}_getTargetEntities(){const t=this._resolveSlots();if(!t)return[];const e=[],i=(t.lights??[]).map(({entity:t,name:e})=>({entity_id:t,label:e||this._label(t),domain:"light"}));i.length&&e.push({label:"Lights",entities:i});const s=(t.switches??[]).filter(({entity:t})=>!/fan/i.test(t)).map(({entity:t,name:e})=>({entity_id:t,label:e||this._label(t),domain:"switch"}));s.length&&e.push({label:"Relays",entities:s});const o=(t.switches??[]).find(({entity:t})=>/fan/i.test(t));o&&e.push({label:"Climate",entities:[{entity_id:o.entity,label:o.name||this._label(o.entity),domain:"switch"}]});const r=this._haDevice(),n=Object.entries(this.hass.states??{}).filter(([t])=>t.startsWith("scene.")).filter(([t,e])=>!r||e.attributes?.device_id===r.id||Object.values(this.hass.entities??{}).find(e=>e.entity_id===t&&e.device_id===r.id)).map(([t,e])=>({entity_id:t,label:this.hass.entities?.[t]?.name||e.attributes?.friendly_name||t.split(".")[1],domain:"scene"})),a=Object.entries(this.hass.states??{}).filter(([t])=>t.startsWith("scene.")).map(([t,e])=>({entity_id:t,label:this.hass.entities?.[t]?.name||e.attributes?.friendly_name||t.split(".")[1],domain:"scene"})),l=n.length?n:a;return l.length&&e.push({label:"Scenes",entities:l}),e}_buildAutomationConfig(t,e,i,s){const o={action:`${i.split(".")[0]}.${s}`,target:{entity_id:i}},r={alias:`[VanCtl] ${this._label(t)} — ${{press:"Press",double_press:"Double Press",hold:"Hold"}[e]??e}`,description:JSON.stringify({smartvanio:!0,entity_id:t,gesture:e,target_entity_id:i,action:s}),initial_state:!0,conditions:[],mode:"single"};return"press"===e?{...r,triggers:[{trigger:"state",entity_id:t,to:"on"}],actions:[o]}:"hold"===e?{...r,triggers:[{trigger:"state",entity_id:t,to:"on",for:"0:00:02"}],actions:[o]}:"double_press"===e?{...r,triggers:[{trigger:"state",entity_id:t,to:"on"}],actions:[{wait_for_trigger:[{trigger:"state",entity_id:t,to:"on"}],timeout:"0:00:00.500",continue_on_timeout:!1},o]}:{...r,triggers:[],actions:[o]}}_getSourceEntities(){const t=this._resolveSlots(),e=this._entities(),i=[],s=t?.buttons?.length?t.buttons.map(({entity:t,name:e})=>({entity_id:t,label:e||this._label(t)})):this._buttonEntities(e?.binary_sensors??[]).map(({eid:t,_slotName:e})=>({entity_id:t,label:e||this._label(t)}));s.length&&i.push({label:"Buttons",entities:s});const o=(t?.switches?.length?t.switches:(e?.switches??[]).map(({eid:t,_slotName:e})=>({entity:t,name:e}))).map(({entity:t,name:e,eid:i})=>({entity_id:t??i,label:e||this._label(t??i)}));return o.length&&i.push({label:"Switches",entities:o}),i}_eventsForSource(t){const e=t?.split(".")?.[0];return"binary_sensor"===e?[{value:"press",label:"Press"},{value:"double_press",label:"Double Press"},{value:"hold",label:"Press & Hold"}]:"switch"===e?[{value:"off_to_on",label:"Off → On"},{value:"on_to_off",label:"On → Off"}]:[]}_actionsForTarget(t){const e=t?.split(".")?.[0];return"scene"===e?[{value:"turn_on",label:"Activate"}]:"light"===e||"switch"===e?[{value:"toggle",label:"Toggle"},{value:"turn_on",label:"Turn On"},{value:"turn_off",label:"Turn Off"}]:[{value:"toggle",label:"Toggle"}]}_eventLabel(t){return{press:"Press",double_press:"Double Press",hold:"Press & Hold",off_to_on:"Off → On",on_to_off:"On → Off"}[t]??t}_buildAutoFromModal(t,e,i,s){const o=`smartvanio_${this._selectedId}_${this._channelFromEntity(t)}_${e}`,r=this._label(t),n=this._eventLabel(e),a=this._label(i),l={action:`${i.split(".")[0]}.${s}`,target:{entity_id:i}},c={alias:`[VanCtl] ${r} — ${n} — ${a}`,description:JSON.stringify({smartvanio:!0,configKey:o,entity_id:t,event:e,target_entity_id:i,action:s}),initial_state:!0,conditions:[],mode:"single"};return"press"===e?{...c,configKey:o,triggers:[{trigger:"state",entity_id:t,to:"on"}],actions:[l]}:"hold"===e?{...c,configKey:o,triggers:[{trigger:"state",entity_id:t,to:"on",for:"0:00:02"}],actions:[l]}:"double_press"===e?{...c,configKey:o,triggers:[{trigger:"state",entity_id:t,to:"on"}],actions:[{wait_for_trigger:[{trigger:"state",entity_id:t,to:"on"}],timeout:"0:00:00.500",continue_on_timeout:!1},l]}:"off_to_on"===e?{...c,configKey:o,triggers:[{trigger:"state",entity_id:t,from:"off",to:"on"}],actions:[l]}:"on_to_off"===e?{...c,configKey:o,triggers:[{trigger:"state",entity_id:t,from:"on",to:"off"}],actions:[l]}:{...c,configKey:o,triggers:[],actions:[l]}}_listVanctlAutomations(){return Object.entries(this.hass?.states??{}).filter(([t,e])=>t.startsWith("automation.")&&e.attributes?.friendly_name?.startsWith("[VanCtl]")).map(([t,e])=>({eid:t,alias:e.attributes.friendly_name})).sort((t,e)=>t.alias.localeCompare(e.alias))}async _deleteAuto(t){const e=this.hass.entities?.[t.eid]?.unique_id;if(e)try{await this.hass.callApi("DELETE",`config/automation/config/${e}`),await this.hass.callService("automation","reload",{})}catch(t){console.error("[VanCtl] delete automation failed",t)}else console.error("[VanCtl] cannot delete: no unique_id for",t.eid)}_openAutoModal(){this._autoModal={source:"",event:"",target:"",action:"",saving:!1,error:null}}_updateAutoModal(t){this._autoModal={...this._autoModal,...t}}async _saveAutoModal(){const{source:t,event:e,target:i,action:s}=this._autoModal;if(t&&e&&i&&s){this._updateAutoModal({saving:!0,error:null});try{const o=this._buildAutoFromModal(t,e,i,s),{configKey:r,...n}=o;await this.hass.callApi("POST",`config/automation/config/${r}`,n),await this.hass.callService("automation","reload",{}),this._autoModal=null}catch(t){this._updateAutoModal({saving:!1,error:"Save failed: "+(t.message||JSON.stringify(t))})}}else this._updateAutoModal({error:"Please fill in all fields."})}_renderAutoModal(){if(!this._autoModal)return F``;const t=this._autoModal,e=this._getSourceEntities().map(t=>({groupLabel:t.label,options:t.entities.map(t=>({value:t.entity_id,label:t.label}))})),i=t.source?this._eventsForSource(t.source).map(t=>({value:t.value,label:t.label})):[],s=this._getTargetEntities().map(t=>({groupLabel:t.label,options:t.entities.map(t=>({value:t.entity_id,label:t.label}))})),o=t.target?this._actionsForTarget(t.target).map(t=>({value:t.value,label:t.label})):[];return F`
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
                .options=${o}
                placeholder="— Select action —"
                ?disabled=${!t.target}
                @smartvanio-change=${t=>this._updateAutoModal({action:t.detail.value})}
              ></smartvanio-select>
            </div>
            ${t.error?F`<div class="auto-modal-error">${t.error}</div>`:""}
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
    `}async _openEditModal(t){this._editingEntity=t,this._editName=this._label(t),this._editRows=[],this._editOriginalIds={},this._editLoading=!0,this._editSaving=!1,this._saveError=null;try{const e=[];for(const i of["press","double_press","hold"]){const s=this._automationId(t,i);try{const t=await this.hass.callApi("GET",`config/automation/config/${s}`),o=JSON.parse(t.description??"{}");o.smartvanio&&e.push({id:s,gesture:o.gesture??i,target_entity_id:o.target_entity_id??"",action:o.action??""})}catch{}}this._editRows=e,this._editOriginalIds=Object.fromEntries(e.map(t=>[t.gesture,t.id]))}catch(t){console.error("VanCtl: failed to load automations",t)}finally{this._editLoading=!1}}async _saveEdit({entity_id:t,name:e,rows:i}){this._editSaving=!0,this._saveError=null;try{const s=this.hass.entities?.[t]?.name,o=e?.trim();(o||null)!==(s||null)&&await this.hass.callWS({type:"config/entity_registry/update",entity_id:t,name:o||null});const r=new Set;for(const e of i){if(!e.gesture||!e.target_entity_id||!e.action)continue;const i=this._automationId(t,e.gesture),s=this._buildAutomationConfig(t,e.gesture,e.target_entity_id,e.action);await this.hass.callApi("POST",`config/automation/config/${i}`,s),r.add(e.gesture)}for(const e of Object.keys(this._editOriginalIds))r.has(e)||await this.hass.callApi("DELETE",`config/automation/config/${this._automationId(t,e)}`);await this.hass.callService("automation","reload",{}),this._editingEntity=null}catch(t){this._saveError="Save failed: "+(t.message||t.error||JSON.stringify(t))}finally{this._editSaving=!1}}_toggleSection(t){this._openSections={...this._openSections,[t]:!this._openSections[t]}}_bri(t){const e=this._dragState.get(t);if(e?.active)return e.brightness;const i=parseFloat(localStorage.getItem(`smartvanio_bri_${t}`));if(!isNaN(i))return i;const s=this.hass.states[t];return s?.attributes?.brightness??s?.attributes?.last_brightness??255}_toggleLight(t){this.hass.callService("light","toggle",{entity_id:t})}_setBri(t,e){this.hass.callService("light","turn_on",{entity_id:t,brightness:Math.round(e)})}_toggleSwitch(t){const e="on"===this.hass.states[t]?.state;this.hass.callService("switch",e?"turn_off":"turn_on",{entity_id:t})}_onClimatePointerDown(t,e){const i=this.shadowRoot.querySelector(".climate-svg");if(!i)return;const s=i.getBoundingClientRect(),o=200/s.width,r=(t.clientX-s.left)*o,n=(t.clientY-s.top)*o,a=r-kt,l=n-St;Math.abs(Math.sqrt(a*a+l*l)-62)>20||(t.preventDefault(),this._climateDragging=!0,this._climateTargetEid=e,this._climateSvgRect=s,window.addEventListener("pointermove",this._cmMove),window.addEventListener("pointerup",this._cmUp))}_onClimatePointerMove(t){if(!this._climateDragging)return;const e=this._climateSvgRect,i=200/e.width,s=(t.clientX-e.left)*i,o=(t.clientY-e.top)*i,r=s-kt,n=o-St;let a=180*Math.atan2(n,r)/Math.PI;a<0&&(a+=360);let l=a-Mt;l<0&&(l+=360),l>Et&&(l=l>315?0:Et);const c=16+l/Et*12;this._pendingTargetTemp=Math.round(2*c)/2}_onClimatePointerUp(){this._climateDragging&&(this._climateDragging=!1,null!==this._pendingTargetTemp&&this._climateTargetEid&&this.hass.callService("number","set_value",{entity_id:this._climateTargetEid,value:this._pendingTargetTemp}),this._pendingTargetTemp=null,window.removeEventListener("pointermove",this._cmMove),window.removeEventListener("pointerup",this._cmUp))}_renderTabBar(){return F`
      <div class="tab-bar">
        ${$t.map(t=>F`
            <div
              class="tab-btn ${this._activeTab===t.id?"active":""}"
              @click=${()=>{this._activeTab=t.id}}
            >
              <ha-icon class="tab-icon" .icon=${t.icon}></ha-icon>
              <span class="tab-label">${t.label}</span>
            </div>
          `)}
      </div>
    `}_renderLeftPanel(t,e,i=null){if(this._setupMode)switch(this._activeTab){case"climate":return this._renderSetupClimate();case"scenes":return this._renderScenesPanel();case"actions":return this._renderActionsPanel();case"level":return this._renderSetupLevel();case"status":return this._renderSetupStatus();default:return F`<div class="panel-empty">No settings for this tab.</div>`}switch(this._activeTab){case"climate":return this._renderClimatePanel(t,i);case"scenes":return this._renderScenesPanel();case"actions":return this._renderActionsPanel();case"level":return this._renderLevelPanel(e);case"status":return this._renderStatusPanel(t,i);default:return F``}}_renderClimatePanel(t,e=null){const i=e?.water_temp??t.sensors.find(({eid:t})=>/heater_water_temp/.test(t))?.eid,s=e?.temperature??t.sensors.find(({eid:t})=>/temperature/.test(t)&&!/heater/.test(t))?.eid,o=e?.target_temp??t.numbers.find(({eid:t})=>/target_temp/.test(t))?.eid,r=e?.fan_speed??t.selects.find(({eid:t})=>/fan_speed/.test(t))?.eid,n=e?.climate_mode??t.selects.find(({eid:t})=>/climate_mode/.test(t))?.eid,a=e?.heater??t.switches.find(({eid:t})=>/\bheater\b/.test(t)&&!/water/.test(t))?.eid,l=e?.water_pump??t.switches.find(({eid:t})=>/water_pump/.test(t))?.eid,c=i&&parseFloat(this.hass.states[i]?.state)||0,d=s&&parseFloat(this.hass.states[s]?.state)||null,p=this._pendingTargetTemp??(o&&parseFloat(this.hass.states[o]?.state)||20),h=r?this.hass.states[r]?.state??"Off":"Off",u=n?this.hass.states[n]?.state??"Off":"Off",g=!!a&&"on"===this.hass.states[a]?.state,b=!!l&&"on"===this.hass.states[l]?.state,f=Math.max(0,Math.min(85,c))/85,m=Math.max(0,Math.min(12,p-16))/12,v=Ct*f,_=At*m,x=Mt+m*Et,[y,w]=zt(kt,St,62,x),$=function(t){return t<35?"#5cacff":t<60?"#f0b72f":"#ff9492"}(c),k={Off:"○","Fan Only":"⊙",Cooling:"❄",Heating:"🔥"};return F`
      <div class="panel-climate">
        <svg
          class="climate-svg"
          viewBox="0 0 200 200"
          @pointerdown=${t=>this._onClimatePointerDown(t,o)}
          style="touch-action:none"
        >
          <!-- tracks -->
          <path
            d="${Pt(82)}"
            fill="none"
            stroke="#151b23"
            stroke-width="14"
            stroke-linecap="butt"
          />
          <path
            d="${Pt(62)}"
            fill="none"
            stroke="#151b23"
            stroke-width="14"
            stroke-linecap="butt"
          />

          <!-- water temp fill (outer) -->
          <path
            d="${Pt(82)}"
            fill="none"
            stroke="${$}"
            stroke-width="14"
            stroke-linecap="round"
            stroke-dasharray="${v.toFixed(1)} ${(Ct+20).toFixed(1)}"
            style="transition:stroke-dasharray 1s ease,stroke 0.6s ease"
          />

          <!-- target temp fill (inner) -->
          <path
            d="${Pt(62)}"
            fill="none"
            stroke="#5cacff"
            stroke-width="14"
            stroke-linecap="round"
            stroke-dasharray="${_.toFixed(1)} ${(At+20).toFixed(1)}"
            style="transition:stroke-dasharray 0.15s ease"
          />

          <!-- arc labels -->
          <text x="24" y="155" text-anchor="middle" class="c-arc-tag">
            WATER
          </text>
          <text
            x="24"
            y="170"
            text-anchor="middle"
            class="c-arc-val"
            style="fill:${$}"
          >
            ${Math.round(c)}°
          </text>
          <text x="176" y="155" text-anchor="middle" class="c-arc-tag">
            SET
          </text>
          <text
            x="176"
            y="170"
            text-anchor="middle"
            class="c-arc-val"
            style="fill:#5cacff"
          >
            ${p.toFixed(1)}°
          </text>

          <!-- drag thumb -->
          <circle
            cx="${y.toFixed(1)}"
            cy="${w.toFixed(1)}"
            r="11"
            fill="#409eff"
            stroke="#010409"
            stroke-width="2.5"
            style="cursor:grab;filter:drop-shadow(0 0 7px rgba(92,172,255,0.7))"
          />
          <circle
            cx="${y.toFixed(1)}"
            cy="${w.toFixed(1)}"
            r="4"
            fill="#71b7ff"
            pointer-events="none"
          />

          <!-- cabin temp centre -->
          <text
            x="${kt}"
            y="${86}"
            text-anchor="middle"
            class="c-main-val"
          >
            ${null!==d?d.toFixed(1):"--"}
          </text>
          <text
            x="${kt}"
            y="${106}"
            text-anchor="middle"
            class="c-main-unit"
          >
            °C CABIN
          </text>

          <!-- heater toggle -->
          <g
            style="cursor:pointer"
            @click=${()=>a&&this._toggleSwitch(a)}
          >
            <circle
              cx="${82}"
              cy="${128}"
              r="13"
              fill="${g?"#7a2a00":"#151b23"}"
              stroke="${g?"#f0b72f":"#212830"}"
              stroke-width="1.5"
              style="transition:fill 0.3s,stroke 0.3s;filter:${g?"drop-shadow(0 0 5px #f0b72f88)":"none"}"
            />
            <text
              x="${82}"
              y="${133}"
              text-anchor="middle"
              style="font-size:13px;pointer-events:none"
            >
              🔥
            </text>
          </g>
          <text
            x="${82}"
            y="${150}"
            text-anchor="middle"
            class="c-btn-label"
          >
            ${g?"ON":"OFF"}
          </text>

          <!-- pump toggle -->
          <g
            style="cursor:pointer"
            @click=${()=>l&&this._toggleSwitch(l)}
          >
            <circle
              cx="${118}"
              cy="${128}"
              r="13"
              fill="${b?"#1e1b4b":"#151b23"}"
              stroke="${b?"#5cacff":"#212830"}"
              stroke-width="1.5"
              style="transition:fill 0.3s,stroke 0.3s;filter:${b?"drop-shadow(0 0 5px #5cacff88)":"none"}"
            />
            <text
              x="${118}"
              y="${133}"
              text-anchor="middle"
              style="font-size:13px;pointer-events:none"
            >
              💧
            </text>
          </g>
          <text
            x="${118}"
            y="${150}"
            text-anchor="middle"
            class="c-btn-label"
          >
            ${b?"ON":"OFF"}
          </text>
        </svg>

        <!-- fan speed -->
        <div class="fan-row">
          ${["Off","Low","Medium","High"].map(t=>F`
              <div
                class="fan-btn ${h===t?"active":""}"
                @click=${()=>r&&this.hass.callService("select","select_option",{entity_id:r,option:t})}
              >
                ${t}
              </div>
            `)}
        </div>

        <!-- climate mode -->
        <div class="mode-row">
          ${["Off","Fan Only","Cooling","Heating"].map(t=>F`
              <div
                class="mode-btn ${u===t?"active":""}"
                @click=${()=>n&&this.hass.callService("select","select_option",{entity_id:n,option:t})}
              >
                <span class="mode-icon">${k[t]}</span>
                <span class="mode-lbl">${t}</span>
              </div>
            `)}
        </div>
      </div>
    `}_getSceneLightOptions(){if(!this._selectedId||!this.hass)return[];const t=this._haDevice();if(!t)return[];const e=[],i={};for(const[s,o]of Object.entries(this.hass.entities??{})){if(!s.startsWith("light."))continue;if(o.device_id!==t.id)continue;const r=this.hass.states[s];if(!r)continue;const n=r.attributes?.smartvanio_parent_entity_id;n?(i[n]??=[]).push(s):e.push(s)}for(const t of Object.values(i))t.sort((t,e)=>(this.hass.states[t]?.attributes?.segment_start??0)-(this.hass.states[e]?.attributes?.segment_start??0));return e.map(t=>{const e=i[t]??[],s=this._label(t);return e.length?{groupLabel:s,options:[{value:t,label:`${s} (all LEDs)`},...e.map(t=>({value:t,label:this._label(t)}))]}:{groupLabel:null,options:[{value:t,label:s}]}})}_openSceneModal(t){const e=this.hass.states[t];this._editingScene=t,this._sceneEditName=this._label(t),this._sceneEditSaving=!1,this._sceneEditLights=(e?.attributes?.lights??[]).map(t=>({...t}))}_openNewSceneModal(){this._editingScene="new",this._sceneEditName="",this._sceneEditSaving=!1,this._sceneEditLights=[]}_addSceneLight(t){if(!t||this._sceneEditLights.find(e=>e.entity_id===t))return;const e=this.hass.states[t],i="on"===e?.state;this._sceneEditLights=[...this._sceneEditLights,{entity_id:t,state:i?"ON":"OFF",brightness:e?.attributes?.brightness??255,rgb_color:e?.attributes?.rgb_color??null}]}_removeSceneLight(t){this._sceneEditLights=this._sceneEditLights.filter(e=>e.entity_id!==t)}_updateSceneLight(t,e,i){this._sceneEditLights=this._sceneEditLights.map(s=>s.entity_id===t?{...s,[e]:i}:s)}_captureSceneState(){this._sceneEditLights=this._sceneEditLights.map(t=>{const e=this.hass.states[t.entity_id];return{...t,state:e?.state?.toUpperCase()??t.state,brightness:e?.attributes?.brightness??t.brightness,rgb_color:e?.attributes?.rgb_color??t.rgb_color}})}async _saveScene(){this._sceneEditSaving=!0;try{const t=this._deviceScenes().map(({eid:t,state:e})=>({id:e.attributes.scene_id,name:this._label(t),lights:e.attributes.lights??[]})),e="new"===this._editingScene?`scene_${Date.now()}`:this.hass.states[this._editingScene]?.attributes?.scene_id,i=this._sceneEditLights.map(t=>{const e={entity_id:t.entity_id,state:t.state??"ON"};return null!=t.brightness&&(e.brightness=t.brightness),null!=t.rgb_color&&(e.rgb_color=t.rgb_color),e}),s={id:e,name:this._sceneEditName.trim()||"Unnamed Scene",lights:i},o=t.findIndex(t=>t.id===e);o>=0?t[o]=s:t.push(s),await this.hass.callService("mqtt","publish",{topic:`smartvanio/${this._selectedId}/scenes`,payload:JSON.stringify(t),retain:!0}),this._editingScene=null}catch(t){console.error("VanCtl: save scene failed:",t)}finally{this._sceneEditSaving=!1}}async _deleteScene(){const t=this.hass.states[this._editingScene]?.attributes?.scene_id,e=this._deviceScenes().map(({eid:t,state:e})=>({id:e.attributes.scene_id,name:this._label(t),lights:e.attributes.lights??[]})).filter(e=>e.id!==t);await this.hass.callService("mqtt","publish",{topic:`smartvanio/${this._selectedId}/scenes`,payload:JSON.stringify(e),retain:!0}),this._editingScene=null}_renderScenesPanel(){const t=this._deviceScenes(),e=Object.entries(this.hass.states??{}).filter(([t])=>t.startsWith("script.")).map(([t,e])=>({eid:t,label:e.attributes?.friendly_name??t.split(".").pop()})).sort((t,e)=>t.label.localeCompare(e.label));return t.length||e.length?this._setupMode?F`
        <div class="panel-actions">
          ${t.map(({eid:t})=>F`
            <div class="auto-row">
              <ha-icon class="auto-row-icon" icon="mdi:palette"></ha-icon>
              <span class="auto-row-label">${this._label(t)}</span>
              <button class="auto-row-edit" title="Edit" @click=${()=>this._openSceneModal(t)}>
                <ha-icon icon="mdi:pencil-outline"></ha-icon>
              </button>
            </div>
          `)}
          ${e.map(({eid:t,label:e})=>F`
            <div class="auto-row">
              <ha-icon class="auto-row-icon" icon="mdi:play-circle-outline" style="color:#5cacff"></ha-icon>
              <span class="auto-row-label">${e}</span>
            </div>
          `)}
          <button class="add-action-btn-full" @click=${()=>this._openNewSceneModal()}>
            + New Scene
          </button>
        </div>
      `:F`
      <div class="panel-scenes">
        ${t.map(({eid:t})=>F`
          <div class="scene-tile" @click=${()=>this._triggerScene(t)}>
            <ha-icon class="scene-icon" icon="mdi:palette"></ha-icon>
            <span class="scene-name">${this._label(t)}</span>
          </div>
        `)}
        ${e.map(({eid:t,label:e})=>F`
          <div class="scene-tile scene-tile--script" @click=${()=>this._runAction(t)}>
            <ha-icon class="scene-icon" icon="mdi:play-circle-outline"></ha-icon>
            <span class="scene-name">${e}</span>
          </div>
        `)}
      </div>
    `:F`<div class="panel-empty">No scenes or scripts configured.</div>`}_renderActionsPanel(){const t=this._listVanctlAutomations();return F`
      <div class="panel-actions">
        ${t.length?t.map(t=>F`
                <div class="auto-row">
                  <ha-icon
                    class="auto-row-icon"
                    icon="mdi:lightning-bolt"
                  ></ha-icon>
                  <span class="auto-row-label"
                    >${t.alias.replace(/^\[VanCtl\]\s*/,"").replace(/\s*—\s*/g," · ")}</span
                  >
                  ${this._setupMode?F`
                        <button
                          class="auto-row-delete"
                          title="Delete"
                          @click=${()=>this._deleteAuto(t)}
                        >
                          <ha-icon icon="mdi:delete-outline"></ha-icon>
                        </button>
                      `:""}
                </div>
              `):F`<div class="panel-empty">No automations configured .</div>`}
        ${this._setupMode?F`
              <button
                class="add-action-btn-full"
                @click=${()=>this._openAutoModal()}
              >
                <ha-icon icon="mdi:plus"></ha-icon> Add Action
              </button>
            `:""}
      </div>
    `}_renderLevelPanel(t){const e=parseFloat(t?.pitch?.state)||0,i=parseFloat(t?.roll?.state)||0,s=70,o=t=>Math.max(-1,Math.min(1,t)),r=52*o(i/15),n=52*o(-e/15),a=Math.sqrt(e**2+i**2),l=a<1.5?"#2bd853":a<5?"#f0b72f":"#ff9492",c=a<1.5;return F`
      <div class="panel-level">
        <svg class="bubble-lg" viewBox="${"-84 -84 168 168"}">
          <circle
            r="${s}"
            fill="#010409"
            stroke="${l}"
            stroke-width="2"
            style="transition:stroke 0.4s ease"
          />
          <circle
            r="${42}"
            fill="none"
            stroke="#212830"
            stroke-width="1"
          />
          <circle
            r="${21}"
            fill="none"
            stroke="#212830"
            stroke-width="0.8"
          />
          <line
            x1="${-70}"
            y1="0"
            x2="${s}"
            y2="0"
            stroke="#212830"
            stroke-width="1"
          />
          <line
            x1="0"
            y1="${-70}"
            x2="0"
            y2="${s}"
            stroke="#212830"
            stroke-width="1"
          />
          <circle
            r="${14}"
            fill="${l}"
            opacity="0.9"
            style="transform:translate(${r.toFixed(1)}px,${n.toFixed(1)}px);
                   transition:transform 0.55s ease,fill 0.4s ease;
                   filter:drop-shadow(0 0 7px ${l}88)"
          />
          <circle r="3" fill="none" stroke="#212830" stroke-width="1" />
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
            <span class="lstat-val ${c?"ok":"warn"}"
              >${c?"Level":"Tilted"}</span
            >
          </div>
        </div>
      </div>
    `}_renderStatusPanel(t,e=null){const i=e?.status_sensors??[],s={sensor:"Sensors",binary_sensor:"Binary Sensors",number:"Numbers",select:"Settings",input_boolean:"Toggles"},o=Object.entries(this._knownDevices),r=o.length?F`
          <div class="sstat-group-label">Boards</div>
          ${o.map(([t,e])=>{const i=this._deviceStatuses[t],s="online"===i,o="offline"===i;return F`
              <div class="sstat-row">
                <span class="sstat-row-name">${e.name??t}</span>
                <span
                  class="board-dot ${s?"online":o?"offline":"unknown"}"
                  title="${s?"Online":o?"Offline":"Unknown"}"
                >
                </span>
              </div>
            `})}
        `:"";if(!i.length)return F` <div class="panel-status">
        ${r}
        ${o.length?F`
              <div class="sstat-group-label" style="margin-top:10px">
                Sensors
              </div>
              <div class="sstat-hint">Tap ⚙ → Status to add sensors.</div>
            `:F`
              <div class="panel-empty">
                No status sensors configured.<br />Tap ⚙ → Status to add some.
              </div>
            `}
      </div>`;const n=new Map;for(const t of i){const e=t.split(".")[0];n.has(e)||n.set(e,[]),n.get(e).push(t)}return F`
      <div class="panel-status">
        ${r}
        ${[...n.entries()].map(([t,e])=>F`
            ${n.size>1||o.length?F`
                  <div class="sstat-group-label">
                    ${s[t]??t}
                  </div>
                `:""}
            ${e.map(t=>{const e=this.hass.states[t],i=e?.state??null,s=e?.attributes?.unit_of_measurement??"",o=this._smartvanioDeviceId(t),r=o&&"offline"===this._deviceStatuses[o];return F`
                <div class="sstat-row">
                  <span class="sstat-row-name">
                    ${r?F`<span
                          class="board-dot offline"
                          title="Board offline"
                        ></span>`:""}
                    ${this._label(t)}
                  </span>
                  <span class="sstat-row-val ${r?"val-offline":""}">
                    ${null!==i?i+(s?" "+s:""):"—"}
                  </span>
                </div>
              `})}
          `)}
      </div>
    `}_renderPinnedActions(){const t=this._cardConfig?.pinnedActions??[];return t.length||this._setupMode?F`
      <div class="pinned-strip">
        ${t.map(t=>F`
            <div
              class="pinned-btn"
              @click=${()=>this._setupMode?this._removePinnedAction(t.id):this._runAction(t.id)}
            >
              <span class="pinned-lbl">${t.label}</span>
              ${this._setupMode?F`<span class="pinned-x">✕</span>`:""}
            </div>
          `)}
        ${this._setupMode?F`
              <div
                class="pinned-add"
                @click=${()=>{this._activeTab="actions"}}
              >
                + Add
              </div>
            `:""}
      </div>
    `:F``}_lightIcon(t){return/strip/i.test(t)?"mdi:led-strip-variant":/spot/i.test(t)?"mdi:spotlight-beam":/main/i.test(t)?"mdi:lightbulb":"mdi:lightbulb-outline"}_onTilePointerDown(t,e){this._dndMode||0!==t.button&&"touch"!==t.pointerType||(this._tileLpOrigin={x:t.clientX,y:t.clientY},this._tileLpTimer=setTimeout(()=>{this._tileLpTimer=null,this._tileLpOrigin=null;const i=t.currentTarget.getBoundingClientRect();this._tilePopover={eid:e,x:i.left+i.width/2,y:i.top}},400))}_onTilePointerMove(t){if(this._dndMode)return;if(!this._tileLpTimer||!this._tileLpOrigin)return;const e=t.clientX-this._tileLpOrigin.x,i=t.clientY-this._tileLpOrigin.y;Math.sqrt(e*e+i*i)>8&&(clearTimeout(this._tileLpTimer),this._tileLpTimer=null,this._tileLpOrigin=null)}_onTilePointerUp(t,e){this._dndMode||this._tileLpTimer&&(clearTimeout(this._tileLpTimer),this._tileLpTimer=null,this._tileLpOrigin=null,this._toggleLight(e))}_renderTilePopover(){const t=this._tilePopover;if(!t)return F``;const e=t.eid,i=this.hass.states[e],s="on"===i?.state,o=this._bri(e),r=Math.round(o/255*100),n=i?.attributes?.rgb_color??[255,200,80],[a,l,c]=n,d=(i?.attributes?.supported_color_modes??[]).some(t=>["rgb","rgbw","rgbww","hs","xy"].includes(t)),p="#"+n.map(t=>t.toString(16).padStart(2,"0")).join(""),h=s?`rgb(${a},${l},${c})`:"#48484a",u=`linear-gradient(to right, ${h} 0%, ${h} ${r}%, rgba(255,255,255,0.08) ${r}%, rgba(255,255,255,0.08) 100%)`;return F`
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
              <ha-icon icon="mdi:brightness-6" style="--mdc-icon-size:16px; color:#9198a1"></ha-icon>
              <input
                type="range" min="1" max="255"
                .value=${o}
                class="popover-slider"
                style="background:${u}"
                @input=${t=>{this._dragState=new Map(this._dragState).set(e,{active:!0,brightness:+t.target.value})}}
                @change=${t=>{const i=+t.target.value;this._setBri(e,i),localStorage.setItem(`smartvanio_bri_${e}`,i),this._dragState=new Map(this._dragState).set(e,{active:!1,brightness:i})}}
              />
              <span class="popover-pct">${r}%</span>
            </div>
            ${d?F`
              <div class="popover-row">
                <ha-icon icon="mdi:palette" style="--mdc-icon-size:16px; color:#9198a1"></ha-icon>
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
          </div>
        </div>
      </div>
    `}_renderLightTile({eid:t,state:e,_slotName:i=null}){const s="on"===e?.state,o=this._bri(t),r=Math.round(o/255*100),n=e?.attributes?.rgb_color??[255,200,80],[a,l,c]=n,d=s?`background: rgba(${a},${l},${c},${.12+o/255*.22})`:"background: rgba(28,28,30,0.65)",p=s?`rgb(${a},${l},${c})`:"#48484a",h=this._lightIcon(t),u=this._label(t,i);return F`
      <div
        class="ltile ${s?"on":""}"
        style="${d}"
        data-tile-id=${t}
        @pointerdown=${e=>this._onTilePointerDown(e,t)}
        @pointermove=${t=>this._onTilePointerMove(t)}
        @pointerup=${e=>this._onTilePointerUp(e,t)}
        @contextmenu=${t=>t.preventDefault()}
      >
        <ha-icon
          class="ltile-icon"
          icon=${h}
          style="color:${p}"
        ></ha-icon>
        <span class="ltile-name">${u}</span>
        ${s?F`<span class="ltile-bri">${r}%</span>`:""}
      </div>
    `}_renderUnifiedGrid(t,e,i){const s=t?.groups??[],o=t?.tileOrder??null,r=this._orderedTiles(s,e,i,o);this._currentLayout||(this._cardConfig?.slots?.layouts?.[this._gridKey]?this._currentLayout=this._mergeNewItems(structuredClone(this._cardConfig.slots.layouts[this._gridKey]),r):this._currentLayout=o?.length?vt(o,r,this._gridCols,t=>this._tileSizeFor(t)):ut(r,this._gridCols,t=>this._tileSizeFor(t)));const n=new Set(r.filter(t=>"spacer"!==t.type).map(t=>t.id));if(this._currentLayout)for(const t of Object.keys(this._currentLayout))n.has(t)||delete this._currentLayout[t];const a=this._currentLayout??{},l=this._dragController;return F`
      <div class="unified-grid-wrap">
        <div class="unified-grid-hdr">
          <span class="section-label">Controls</span>
          ${this._dndMode?F`
                <span class="dnd-hint">Hold &amp; drag to reorder</span>
                <button class="dnd-done-btn" @click=${()=>this._exitDndMode()}>Done</button>
              `:F`
                <button class="dnd-toggle-btn" @click=${()=>{this._enterDndMode()}}
                  title="Reorder tiles">
                  <ha-icon icon="mdi:drag"></ha-icon>
                </button>
              `}
        </div>
        <div class="unified-grid ${this._dndMode?"dnd-mode":""}"
             @pointerdown=${this._dndMode?t=>this._dragController.start(t):null}>
          ${r.filter(t=>"spacer"!==t.type).map(t=>{const e=a[t.id];if(!e)return"";const i=this._mergeTargetId===t.id,s=`grid-column: ${e.col+1} / span ${e.w}; grid-row: ${e.row+1} / span ${e.h};`;return F`
              <div class="grid-tile ${i?"merge-target":""}" data-tile-id=${t.id}
                   data-tile-w=${e.w} data-tile-h=${e.h}
                   data-tile-col=${e.col} data-tile-row=${e.row}
                   style=${s}>
                ${this._dndMode&&this._allowedSizes(t).length>1?F`
                  <button class="resize-btn" @click=${e=>{e.stopPropagation(),this._cycleTileSize(t.id,t)}}
                    title="Resize tile">
                    <ha-icon icon="mdi:resize"></ha-icon>
                  </button>
                `:""}
                ${"group"===t.type?this._renderGroupTile(t.data,e):"light"===t.type?this._renderLightTile(t.data):"switch"===t.type?this._renderSwitchTile(t.data):""}
              </div>
            `})}
          ${this._dndMode?this._renderEmptyCells(a):""}
          ${l.dragging&&!this._mergeTargetId?F`
            <div class="drop-preview"
                 style="grid-column: ${l.previewCol+1} / span ${l.w}; grid-row: ${l.previewRow+1} / span ${l.h};">
            </div>
          `:""}
        </div>
      </div>
    `}_renderEmptyCells(t){const e=ct(t,this._gridCols);let i=0;for(const e of Object.values(t))i=Math.max(i,e.row+e.h);const s=Math.max(i,this._gridRows||4),o=[];for(let t=0;t<s;t++)for(let i=0;i<this._gridCols;i++)e[t]?.[i]||o.push(F`
            <div class="empty-cell"
                 style="grid-column: ${i+1}; grid-row: ${t+1};">
            </div>
          `);return o}_renderLightRow({eid:t,state:e,_slotName:i=null}){const s="on"===e?.state,o=this._bri(t),r=Math.round(o/255*100),n=e?.attributes?.rgb_color??[255,255,255],a=s?`rgb(${n[0]},${n[1]},${n[2]})`:"#212830",l=s?`0 0 9px rgb(${n[0]},${n[1]},${n[2]})`:"none",c=s?r:0,d=`linear-gradient(to right, #5cacff ${c}%, #151b23 ${c}%)`,p=(e?.attributes?.supported_color_modes??[]).some(t=>["rgb","rgbw","rgbww","hs","xy"].includes(t)),h="#"+n.map(t=>t.toString(16).padStart(2,"0")).join("");return F`
      <div
        class="lrow ${s?"on":""}"
        @click=${()=>this._toggleLight(t)}
      >
        <div
          class="ldot"
          style="background:${a};box-shadow:${l}"
        ></div>
        <span class="lname">${this._label(t,i)}</span>
        <div class="lright" @click=${t=>t.stopPropagation()}>
          ${p?F`
                <label
                  class="color-swatch"
                  style="background:${s?h:"#212830"}"
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
            .value=${o}
            class="lslider"
            style="background:${d}"
            @input=${e=>{const i=+e.target.value;this._dragState=new Map(this._dragState).set(t,{active:!0,brightness:i})}}
            @change=${e=>{const i=+e.target.value;this._setBri(t,i),localStorage.setItem(`smartvanio_bri_${t}`,i),this._dragState=new Map(this._dragState).set(t,{active:!1,brightness:i})}}
          />
          <span class="lpct">${s?r+"%":"—"}</span>
        </div>
      </div>
    `}_renderSwitchTile({eid:t,state:e,_slotName:i=null}){const s="on"===e?.state,o=t.includes("fan");return F`
      <div
        class="stile ${s?"on":""}"
        data-tile-id=${t}
        @click=${()=>{this._dndMode||this.hass.callService(t.split(".")[0],"toggle",{},{entity_id:t})}}
      >
        <ha-icon class="stile-icon" icon=${o?"mdi:fan":"mdi:power-plug"}></ha-icon>
        <span class="stile-name">${this._label(t,i)}</span>
        <span class="stile-badge">${s?"ON":"OFF"}</span>
      </div>
    `}_renderResources(t,e=null){const{sensors:i}=t,s=t=>i.find(({eid:e})=>t.test(e))?.eid,o=new Set((e?.resources??[]).map(t=>t.entity)),r=[{eid:s(/water_tank$/),label:"Water",color:"#5cacff"},{eid:s(/gas_tank$/),label:"Gas",color:"#f0b72f"},{eid:s(/waste_tank$/),label:"Waste",color:"#ff9492"},{eid:s(/fuel_level/),label:"Fuel",color:"#2bd853"}].filter(({eid:t})=>t&&!o.has(t)),n=[...(e?.resources??[]).map(({entity:t,name:e,color:i})=>({eid:t,label:e??t.split(".").pop(),color:i??"#5cacff"})),...r],a=e?.resources?.find(t=>/battery|soc/i.test(t.entity)),l=a?null:s(/battery/),c=l?parseFloat(this.hass.states[l]?.state):null,d=null!==c?Math.max(0,Math.min(100,(c-11.5)/1.7*100)):0,p=null===c?"#9198a1":d>50?"#2bd853":d>20?"#f0b72f":"#ff9492";return n.length||l?F`
      ${n.map(({eid:t,label:e,color:i})=>{const s=t&&parseFloat(this.hass.states[t]?.state)||0,o=Math.max(0,Math.min(100,s));return F`
          <div class="res-item">
            <span class="res-label">${e}</span>
            <div class="res-bar-wrap">
              <div
                class="res-bar-fill"
                style="width:${o.toFixed(1)}%;background:${i}"
              ></div>
            </div>
            <span class="res-val" style="color:${i}"
              >${Math.round(s)}%</span
            >
          </div>
        `})}
      ${l?F`
            <div class="res-item">
              <span class="res-label">Battery</span>
              <div class="res-bar-wrap">
                <div
                  class="res-bar-fill"
                  style="width:${d.toFixed(1)}%;background:${p}"
                ></div>
              </div>
              <span class="res-val" style="color:${p}">
                ${null!==c?c.toFixed(1)+"V":"—"}
              </span>
            </div>
          `:""}
    `:F``}_renderPicker(){const t=Object.values(this.hass.devices??{}).filter(t=>t.identifiers?.some(([t])=>"smartvanio"===t)).map(t=>({id:t.identifiers.find(([t])=>"smartvanio"===t)[1],name:t.name_by_user??t.name})).sort((t,e)=>t.name.localeCompare(e.name));return F`
      <div class="picker">
        <div class="picker-title">VanCtl HMI</div>
        <div class="picker-sub">Select a device</div>
        ${t.map(t=>F`
            <div
              class="picker-row"
              @click=${()=>{this._selectedId=t.id}}
            >
              <span class="picker-name">${t.name}</span>
              <span class="picker-id">${t.id}</span>
            </div>
          `)}
        ${t.length?"":F`<div class="picker-empty">No VanCtl devices found.</div>`}
      </div>
    `}render(){if(!this.hass)return F``;const t=this._resolveSlots(),e=this._entities();if(!(t||this._selectedId&&e))return this._renderPicker();const i=e??{lights:[],switches:[],sensors:[],binary_sensors:[],numbers:[],selects:[]},s=this._levelEntities(t),o=(t,e)=>{const i=(t??[]).map(({entity:t,name:e})=>({eid:t,state:this.hass.states[t],_slotName:e})),s=new Set(i.map(t=>t.eid));return[...i,...e.filter(t=>!s.has(t.eid))]},r=o(t?.lights,i.lights),n=o(t?.switches,this._powerSwitches(i.switches));return F`
      <div class="hmi">
        <div class="main-row">
          <!-- Left: tabbed cluster panel -->
          <div class="cluster">
            ${this._renderTabBar()}
            <div class="tab-content">
              ${this._renderLeftPanel(i,s,t)}
            </div>
          </div>

          <!-- Right: controls / setup -->
          <div class="list">
            <div class="list-topbar">
              ${this._setupMode?F`
                    <span class="list-title setup-title">Setup</span>
                    <div class="setup-actions">
                      <button
                        class="setup-cancel-btn"
                        @click=${()=>this._cancelSetupMode()}
                      >
                        Cancel
                      </button>
                      <button
                        class="setup-save-btn"
                        @click=${()=>this._saveSetupMode()}
                      >
                        Save
                      </button>
                    </div>
                  `:F`
                    <span class="list-title">Controls</span>
                    <div class="cfg-btn" @click=${()=>this._enterSetupMode()}>
                      ⚙
                    </div>
                  `}
            </div>

            ${this._setupMode?"":this._renderPinnedActions()}

            ${this._setupMode?F`
                  <div class="acc-scroll">
                    <div class="acc-section">
                      <div
                        class="acc-hdr"
                        @click=${()=>this._toggleSection("groups")}
                      >
                        <span class="acc-title">Groups</span>
                        <span class="acc-chevron ${this._openSections.groups?"open":""}">›</span>
                      </div>
                      ${this._openSections.groups?this._renderSetupGroups():""}
                    </div>
                    <div class="acc-section">
                      <div class="acc-hdr" style="cursor:default">
                        <span class="acc-title">Lighting</span>
                      </div>
                      <div class="lights">${this._renderSetupLighting()}</div>
                    </div>
                    <div class="acc-section">
                      <div class="acc-hdr" style="cursor:default">
                        <span class="acc-title">Switches</span>
                      </div>
                      <div class="switch-grid">${this._renderSetupSwitches()}</div>
                    </div>
                  </div>
                `:this._renderUnifiedGrid(t,r,n)}
          </div>
        </div>

        ${this._renderAutoModal()}
        ${this._renderTilePopover()}
        ${this._editingScene?F`
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
        ${this._editingEntity?F`
              <smartvanio-modal-edit
                .hass=${this.hass}
                entity-id=${this._editingEntity}
                edit-name=${this._editName}
                .editRows=${this._editRows}
                ?edit-saving=${this._editSaving}
                ?edit-loading=${this._editLoading}
                ?is-button=${!0}
                .targetEntities=${this._getTargetEntities()}
                save-error=${this._saveError??""}
                @smartvanio-modal-close=${()=>{this._editingEntity=null,this._saveError=null}}
                @smartvanio-update-edit-name=${t=>{this._editName=t.detail.value}}
                @smartvanio-add-edit-row=${()=>{this._editRows=[...this._editRows,{id:null,gesture:"",target_entity_id:"",action:""}]}}
                @smartvanio-remove-edit-row=${t=>{this._editRows=this._editRows.filter((e,i)=>i!==t.detail.id)}}
                @smartvanio-update-edit-row=${t=>{const{id:e,field:i,value:s}=t.detail;this._editRows=this._editRows.map((t,o)=>{if(o!==e)return t;const r={...t,[i]:s};return"target_entity_id"===i&&(r.action=""),r})}}
                @smartvanio-save-edit=${t=>this._saveEdit(t.detail)}
              ></smartvanio-modal-edit>
            `:""}

        <!-- Bottom: resources bar — always pinned -->
        <div class="resources ${this._setupMode?"resources-setup":""}">
          ${this._setupMode?this._renderSetupResources():this._renderResources(i,t)}
          <div
            class="res-item"
            style="flex:0 0 auto;align-items:center;justify-content:center;border-right:none;padding:0 0 0 16px;"
          >
            <button
              class="kiosk-toggle-btn"
              title="Toggle kiosk mode"
              @click=${()=>{const t=new URL(window.location.href);t.searchParams.has("disable_km")?t.searchParams.delete("disable_km"):t.searchParams.set("disable_km",""),window.location.href=t.toString()}}
            >
              <ha-icon icon="mdi:home-assistant"></ha-icon>
            </button>
          </div>
        </div>
      </div>
    `}static get styles(){return r`
      :host {
        display: block;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
        -webkit-font-smoothing: antialiased;
        /* height is set dynamically to parentElement.clientHeight via ResizeObserver */
        background:
          radial-gradient(ellipse at 15% 20%, rgba(124,131,255,0.18) 0%, transparent 50%),
          radial-gradient(ellipse at 85% 15%, rgba(34,211,238,0.10) 0%, transparent 40%),
          radial-gradient(ellipse at 70% 75%, rgba(244,114,182,0.08) 0%, transparent 45%),
          radial-gradient(ellipse at 30% 65%, rgba(99,102,241,0.14) 0%, transparent 38%),
          radial-gradient(ellipse at 50% 50%, rgba(52,211,153,0.05) 0%, transparent 55%),
          #0A0E1A;
        /* Dark theme CSS vars — cascade into nested shadow roots (smartvanio-modal-edit etc.) */
        --primary-color: #5cacff;
        --primary-text-color: #f0f6fc;
        --secondary-text-color: #9198a1;
        --secondary-background-color: #151b23;
        --card-background-color: #151b23;
        --divider-color: #30363d;
        --error-color: #ff9492;
        --warning-color: #f0b72f;
      }

      /* ── Layout ─────────────────────────────────────────── */

      .hmi {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 500px;
        background: transparent;
        border-radius: 14px;
        overflow: hidden;
        color: #f0f6fc;
      }

      /* main-row fills all space above the resources footer */
      .main-row {
        flex: 1;
        min-height: 0;
        display: flex;
        overflow: hidden;
      }

      .cluster {
        flex: 0 0 clamp(240px, 28%, 340px);
        border-right: 1px solid #30363d;
        display: flex;
        flex-direction: column;
        background: rgba(10,14,26,0.65);
        overflow: hidden;
        min-height: 0;
      }

      .list {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .resources {
        flex-shrink: 0;
        height: 56px;
        border-top: 1px solid #30363d;
        display: flex;
        align-items: center;
        padding: 0 16px;
        background: rgba(10,14,26,0.7);
        overflow: hidden;
        position: relative;
      }

      /* ── Tab bar ────────────────────────────────────────── */

      .tab-bar {
        display: flex;
        border-bottom: 1px solid #30363d;
        flex-shrink: 0;
        background: rgba(10,14,26,0.5);
      }

      .tab-btn {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        padding: 8px 4px;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        margin-bottom: -1px;
        transition:
          border-color 0.2s,
          background 0.2s;
        user-select: none;
      }

      .tab-btn:hover {
        background: rgba(92, 172, 255, 0.08);
      }

      .tab-btn.active {
        border-bottom-color: #5cacff;
        background: rgba(92, 172, 255, 0.15);
      }

      .tab-icon {
        --mdc-icon-size: 18px;
        color: #9198a1;
        transition: color 0.2s;
      }

      .tab-btn.active .tab-icon {
        color: #5cacff;
      }

      .tab-label {
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 0.1em;
        color: #9198a1;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .tab-btn.active .tab-label {
        color: #5cacff;
      }

      /* ── Tab content ────────────────────────────────────── */

      .tab-content {
        flex: 1;
        overflow-y: auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
      }

      /* ── Panel: empty state ─────────────────────────────── */

      .panel-empty {
        padding: 40px 20px;
        text-align: center;
        font-size: 14px;
        color: #9198a1;
      }

      /* ── Panel: climate ─────────────────────────────────── */

      .panel-climate {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 8px 14px 12px;
        box-sizing: border-box;
      }

      .climate-svg {
        display: block;
        width: 100%;
        max-width: min(260px, 100%);
        height: auto;
        overflow: visible;
      }

      .c-main-val {
        fill: #f0f6fc;
        font-size: 34px;
        font-weight: 200;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.03em;
      }

      .c-main-unit {
        fill: #9198a1;
        font-size: 9px;
        font-weight: 700;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
        letter-spacing: 0.18em;
      }

      .c-arc-tag {
        fill: #9198a1;
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
        fill: #9198a1;
        font-size: 9px;
        font-weight: 700;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
        letter-spacing: 0.12em;
      }

      .fan-row,
      .mode-row {
        display: flex;
        gap: 5px;
        width: 100%;
        max-width: min(260px, 100%);
      }

      .fan-btn {
        flex: 1;
        text-align: center;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.04em;
        color: #9198a1;
        padding: 7px 0;
        border: 1px solid #30363d;
        border-radius: 6px;
        background: #151b23;
        cursor: pointer;
        transition:
          border-color 0.2s,
          color 0.2s,
          background 0.2s;
        user-select: none;
      }

      .fan-btn.active {
        border-color: #5cacff;
        color: #5cacff;
        background: rgba(92, 172, 255, 0.15);
      }
      .fan-btn:hover:not(.active) {
        border-color: #b7bdc8;
        color: #d1d7e0;
      }

      .mode-btn {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        padding: 7px 4px;
        border: 1px solid #30363d;
        border-radius: 8px;
        background: #151b23;
        cursor: pointer;
        transition:
          border-color 0.2s,
          background 0.2s;
        user-select: none;
      }

      .mode-btn.active {
        border-color: #5cacff;
        background: rgba(92, 172, 255, 0.15);
      }
      .mode-btn:hover:not(.active) {
        border-color: #b7bdc8;
      }

      .mode-icon {
        font-size: 15px;
        line-height: 1;
      }

      .mode-lbl {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.04em;
        color: #9198a1;
        white-space: nowrap;
      }

      .mode-btn.active .mode-lbl {
        color: #71b7ff;
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
        gap: 6px;
        padding: 14px 8px;
        background: #151b23;
        border: 1px solid #30363d;
        border-radius: 10px;
        cursor: pointer;
        text-align: center;
        transition:
          border-color 0.2s,
          background 0.2s,
          box-shadow 0.2s;
        user-select: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      .scene-tile:hover {
        border-color: #5cacff;
        background: rgba(92, 172, 255, 0.12);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
      }
      .scene-tile:active {
        transform: scale(0.97);
      }
      .scene-tile--script .scene-icon {
        color: #5cacff;
      }

      .scene-icon {
        --mdc-icon-size: 22px;
        color: #9198a1;
      }

      .scene-name {
        font-size: 12px;
        font-weight: 600;
        color: #d1d7e0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
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
        color: #9198a1;
      }

      .hint-link {
        color: #5cacff;
        cursor: pointer;
        text-decoration: underline;
      }

      .action-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        border-bottom: 1px solid #151b23;
        cursor: pointer;
        transition: background 0.15s;
        user-select: none;
      }

      .action-row:hover {
        background: rgba(92, 172, 255, 0.08);
      }
      .action-row.pinned {
        background: rgba(92, 172, 255, 0.15);
      }

      .action-domain {
        --mdc-icon-size: 16px;
        color: #9198a1;
        flex-shrink: 0;
      }

      .action-label {
        flex: 1;
        font-size: 14px;
        font-weight: 400;
        color: #d1d7e0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .action-run {
        font-size: 12px;
        color: #656c76;
        flex-shrink: 0;
      }

      .action-pin {
        font-size: 18px;
        color: #656c76;
        flex-shrink: 0;
        transition: color 0.2s;
      }

      .action-pin.pinned {
        color: #5cacff;
      }

      /* ── Actions sub-sections ───────────────────────────── */

      .actions-sub-hdr {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px 6px;
        border-bottom: 1px solid #21262d;
      }

      .actions-sub-title {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #9198a1;
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
        border: 1px dashed #30363d;
        border-radius: 8px;
        color: #9198a1;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition:
          border-color 0.15s,
          color 0.15s;
        --mdc-icon-size: 14px;
      }
      .add-action-btn-full:hover {
        border-color: #5cacff;
        color: #5cacff;
      }
      .add-action-btn-full ha-icon {
        --mdc-icon-size: 14px;
      }

      .actions-empty-hint {
        padding: 10px 14px;
        font-size: 12px;
        color: #656c76;
        font-style: italic;
      }

      .auto-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-bottom: 1px solid #151b23;
      }

      .auto-row-icon {
        --mdc-icon-size: 15px;
        color: #5cacff;
        flex-shrink: 0;
      }

      .auto-row-label {
        flex: 1;
        font-size: 13px;
        color: #d1d7e0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .auto-row-delete {
        background: none;
        border: none;
        cursor: pointer;
        color: #656c76;
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
        color: #656c76;
        padding: 0;
        line-height: 1;
        transition: color 0.15s;
      }
      .auto-row-edit:hover { color: #5cacff; }
      .auto-row-edit ha-icon { --mdc-icon-size: 16px; }

      .scene-name-input {
        width: 100%;
        background: #0d1117;
        border: 1px solid #30363d;
        border-radius: 8px;
        color: #f0f6fc;
        font-size: 14px;
        padding: 9px 12px;
        outline: none;
        transition: border-color 0.15s;
        box-sizing: border-box;
      }
      .scene-name-input:focus { border-color: #5cacff; }

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
        border: 1px solid #30363d;
        border-radius: 14px;
        width: 100%;
        max-width: 400px;
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
        border-bottom: 1px solid #21262d;
      }

      .auto-modal-title {
        font-size: 15px;
        font-weight: 600;
        color: #f0f6fc;
      }

      .auto-modal-close {
        background: none;
        border: none;
        cursor: pointer;
        color: #9198a1;
        padding: 0;
        line-height: 1;
        --mdc-icon-size: 18px;
      }
      .auto-modal-close:hover {
        color: #f0f6fc;
      }

      .auto-modal-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;
        overflow-y: auto;
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
        color: #9198a1;
      }

      .auto-field-sep {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #656c76;
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
        border-top: 1px solid #21262d;
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
        background: #21262d;
        border-color: #30363d;
        color: #9198a1;
      }
      .auto-btn.cancel:hover {
        background: #2d333b;
      }
      .auto-btn.save {
        background: #5cacff;
        color: #010409;
        font-weight: 600;
      }
      .auto-btn.save:hover {
        background: #79bdff;
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
        justify-content: center;
        gap: 16px;
        padding: 16px 12px;
        flex: 1;
      }

      .bubble-lg {
        display: block;
        width: 100%;
        max-width: min(220px, 100%);
        height: auto;
        overflow: visible;
      }

      .level-stats {
        display: flex;
        gap: 24px;
        justify-content: center;
      }

      .lstat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .lstat-label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.2em;
        color: #9198a1;
        text-transform: uppercase;
      }

      .lstat-val {
        font-size: 22px;
        font-weight: 200;
        color: #d1d7e0;
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.02em;
        transition: color 0.4s;
      }

      .lstat-val.warn {
        color: #f0b72f;
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
        color: #9198a1;
        padding: 10px 0 4px;
      }

      .sstat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #151b23;
      }

      .sstat-row:last-child {
        border-bottom: none;
      }

      .sstat-row-name {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: #d1d7e0;
      }

      .sstat-row-val {
        font-size: 13px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: #f0f6fc;
      }

      .val-offline {
        color: #656c76;
      }

      .sstat-hint {
        font-size: 11px;
        color: #9198a1;
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
        background: #262c36;
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
        color: #9198a1;
        text-transform: uppercase;
        padding: 0 2px;
      }

      .dstat {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        background: #151b23;
        border: 1px solid #30363d;
        border-radius: 8px;
        font-size: 14px;
        color: #d1d7e0;
        transition: border-color 0.2s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      .dstat.open {
        border-color: #f0b72f;
      }

      .dstat-name {
        flex: 1;
        font-size: 13px;
        color: #d1d7e0;
      }

      .dstat-state {
        font-size: 12px;
        font-weight: 600;
        color: #9198a1;
      }

      .dstat.open .dstat-state {
        color: #f0b72f;
      }

      /* ── Right panel top bar ────────────────────────────── */

      .list-topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 22px;
        height: 48px;
        border-bottom: 1px solid #30363d;
        flex-shrink: 0;
        background: #010409;
      }

      .list-title {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.2em;
        color: #9198a1;
        text-transform: uppercase;
      }

      .cfg-btn {
        font-size: 18px;
        color: #9198a1;
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
        color: #f0f6fc;
        background: rgba(92, 172, 255, 0.12);
      }
      .cfg-btn.active {
        color: #5cacff;
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
        border-bottom: 1px solid #30363d;
        background: #151b23;
        flex-shrink: 0;
      }

      .pinned-btn {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 6px 12px;
        border: 1px solid #b7bdc8;
        border-radius: 20px;
        background: #212830;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        color: #d1d7e0;
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
        border-color: #5cacff;
        color: #f0f6fc;
        background: rgba(92, 172, 255, 0.15);
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
        border: 1px dashed #30363d;
        border-radius: 20px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        color: #9198a1;
        transition:
          border-color 0.2s,
          color 0.2s;
        user-select: none;
      }

      .pinned-add:hover {
        border-color: #5cacff;
        color: #5cacff;
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
        background: #262c36;
        border-radius: 2px;
      }
      .acc-scroll::-webkit-scrollbar-track {
        background: transparent;
      }

      /* ── Accordion ──────────────────────────────────────── */

      .acc-section {
        border-bottom: 1px solid #30363d;
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
        background: rgba(92, 172, 255, 0.08);
      }

      .acc-title {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.2em;
        color: #5cacff;
        text-transform: uppercase;
      }

      .acc-chevron {
        font-size: 22px;
        color: #656c76;
        line-height: 1;
        transform: rotate(90deg);
        transition:
          transform 0.2s ease,
          color 0.2s;
        display: inline-block;
      }

      .acc-chevron.open {
        transform: rotate(-90deg);
        color: #5cacff;
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
        border-bottom: 1px solid #151b23;
        cursor: pointer;
        user-select: none;
        transition: background 0.15s;
      }

      .lrow:hover {
        background: rgba(92, 172, 255, 0.08);
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
        color: #9198a1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 0.2s;
        min-width: 0;
      }

      .lrow.on .lname {
        color: #f0f6fc;
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
        border: 2px solid #b7bdc8;
        cursor: pointer;
        flex-shrink: 0;
        overflow: hidden;
        transition: border-color 0.2s;
      }

      .color-swatch:hover {
        border-color: #f0f6fc;
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
        background: #5cacff;
        cursor: pointer;
        border: none;
        box-shadow: 0 0 7px rgba(92, 172, 255, 0.5);
      }

      .lslider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #5cacff;
        cursor: pointer;
        border: none;
      }

      .lpct {
        font-size: 13px;
        color: #9198a1;
        width: 32px;
        text-align: right;
        font-variant-numeric: tabular-nums;
        flex-shrink: 0;
      }

      .lrow.on .lpct {
        color: #5cacff;
      }

      /* ── CarPlay tile shared ────────────────────────────── */

      .section-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #5cacff;
      }

      .dnd-hint {
        font-size: 10px;
        color: #5cacff;
        opacity: 0.7;
        font-style: italic;
      }

      .dnd-toggle-btn {
        background: none;
        border: none;
        color: #9198a1;
        cursor: pointer;
        padding: 2px;
        display: flex;
        align-items: center;
        border-radius: 6px;
        transition: color 0.15s, background 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .dnd-toggle-btn:hover { color: #f0f6fc; background: rgba(255,255,255,0.06); }
      .dnd-toggle-btn ha-icon { --mdc-icon-size: 18px; }

      .dnd-done-btn {
        background: #5cacff;
        border: none;
        color: #010409;
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
      .unified-grid::-webkit-scrollbar-thumb { background: #262c36; border-radius: 2px; }
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
        color: #48484a;
        flex-shrink: 0;
        transition: color 0.2s;
      }

      .gtile-icon.on {
        color: #5cacff;
        filter: drop-shadow(0 0 4px rgba(92,172,255,0.5));
      }

      .gtile.expanded .gtile-icon {
        --mdc-icon-size: 16px;
      }

      .gtile-name {
        font-size: 10px;
        font-weight: 500;
        color: #9198a1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        transition: color 0.2s;
      }

      .gtile.on .gtile-name { color: #f0f6fc; }

      .gtile.expanded .gtile-name {
        font-size: 13px;
        font-weight: 600;
        color: #f0f6fc;
        text-align: left;
        flex: 1;
      }

      .gtile-name-input {
        flex: 1;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(92,172,255,0.25);
        border-radius: 6px;
        color: #f0f6fc;
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
        background: #30363d;
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
        background: #f0f6fc;
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
        background: #30363d;
        border-radius: 2px;
        outline: none;
        cursor: pointer;
      }
      .gtile-bri-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #f0f6fc;
        box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        cursor: pointer;
      }
      .gtile-bri-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #f0f6fc;
        border: none;
        box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        cursor: pointer;
      }

      .gtile-collapse-btn {
        flex-shrink: 0;
        margin-left: auto;
        background: none;
        border: none;
        color: #9198a1;
        cursor: pointer;
        padding: 2px;
        display: flex;
        align-items: center;
        border-radius: 4px;
        transition: color 0.2s;
      }
      .gtile-collapse-btn:hover { color: #d1d7e0; }
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
        color: #9198a1;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        padding: 0 4px;
        box-sizing: border-box;
        transition: color 0.2s;
      }

      .ltile.on .ltile-name { color: #f0f6fc; }

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
        border: 1px solid #30363d;
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
        color: #f0f6fc;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .popover-toggle {
        padding: 3px 10px;
        border-radius: 10px;
        border: 1px solid #30363d;
        background: rgba(255,255,255,0.06);
        color: #9198a1;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s, color 0.15s, border-color 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .popover-toggle.on {
        background: rgba(92,172,255,0.15);
        border-color: #5cacff;
        color: #5cacff;
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
        background: #f0f6fc;
        box-shadow: 0 1px 4px rgba(0,0,0,0.5);
        cursor: pointer;
      }
      .popover-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #f0f6fc;
        border: none;
        box-shadow: 0 1px 4px rgba(0,0,0,0.5);
        cursor: pointer;
      }

      .popover-pct {
        font-size: 12px;
        font-weight: 600;
        color: #9198a1;
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
        color: #48484a;
        transition: color 0.2s;
      }

      .stile.on .stile-icon {
        color: #1C1C1E;
      }

      .stile-name {
        font-size: 10px;
        font-weight: 500;
        color: #9198a1;
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
        color: #48484a;
      }

      /* ── Button tiles ───────────────────────────────────── */

      .btile {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        background: #010409;
        min-height: 52px;
        cursor: default;
        user-select: none;
        transition:
          background 0.15s,
          border-color 0.15s;
        -webkit-tap-highlight-color: transparent;
      }

      .btile:hover {
        background: #151b23;
      }

      .btile.active {
        background: #151b23;
      }

      .btile.editable {
        cursor: pointer;
      }
      .btile.editable:hover {
        background: rgba(92, 172, 255, 0.08);
      }

      .btile-icon {
        --mdc-icon-size: 20px;
        color: #9198a1;
        flex-shrink: 0;
        transition: color 0.15s;
      }

      .btile.active .btile-icon {
        color: #5cacff;
      }
      .btile.editable .btile-icon {
        color: #5cacff;
      }

      .btile-name {
        font-size: 13px;
        font-weight: 500;
        color: #9198a1;
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: color 0.2s;
      }

      .btile.active .btile-name {
        color: #f0f6fc;
      }

      .btile-state {
        font-size: 11px;
        color: #656c76;
        flex-shrink: 0;
        white-space: nowrap;
      }

      .btile.active .btile-state {
        color: #5cacff;
      }
      .btile.editable .btile-state {
        color: #5cacff;
        font-size: 11px;
      }

      /* ── Resources bar ──────────────────────────────────── */

      .res-item {
        display: flex;
        flex-direction: column;
        gap: 3px;
        flex: 1;
        padding: 0 10px;
        border-right: 1px solid #30363d;
      }

      .res-item:last-child {
        border-right: none;
      }

      .res-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.12em;
        color: #9198a1;
        text-transform: uppercase;
      }

      .res-bar-wrap {
        height: 5px;
        background: #212830;
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
        color: #9198a1;
        cursor: pointer;
        padding: 0;
        transition: color 0.2s;
      }
      .kiosk-toggle-btn:hover {
        color: #d1d7e0;
      }
      .kiosk-toggle-btn ha-icon {
        --mdc-icon-size: 22px;
      }

      /* ── Device picker ──────────────────────────────────── */

      .picker {
        padding: 40px 28px;
        background: #010409;
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
        color: #d1d7e0;
        letter-spacing: 0.06em;
      }
      .picker-sub {
        font-size: 12px;
        color: #9198a1;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      .picker-row {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 16px 32px;
        border: 1px solid #b7bdc8;
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
        border-color: #5cacff;
        background: #151b23;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
      }

      .picker-name {
        font-size: 16px;
        color: #d1d7e0;
      }
      .picker-id {
        font-size: 12px;
        color: #9198a1;
      }
      .picker-empty {
        font-size: 14px;
        color: #9198a1;
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
        background: #010409;
        border: 1px solid #30363d;
        border-radius: 5px;
        color: #d1d7e0;
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
        border-color: #5cacff;
        color: #5cacff;
      }

      .group-no-scenes {
        font-size: 11px;
        color: #9198a1;
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
        color: #9198a1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: color 0.2s;
      }
      .grp-light-row.on .grp-light-name {
        color: #f0f6fc;
      }

      .grp-light-grip {
        flex-shrink: 0;
        --mdc-icon-size: 16px;
        color: rgba(92,172,255,0.5);
        cursor: grab;
      }

      .grp-light-bar-wrap {
        height: 3px;
        background: #010409;
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
        background: #151b23;
        border: 1px solid #30363d;
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
        color: #9198a1;
        margin-top: 4px;
      }

      .group-lights-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .group-light-chip {
        background: #010409;
        border: 1px solid #30363d;
        border-radius: 6px;
        color: #9198a1;
        font-size: 12px;
        padding: 5px 10px;
        cursor: pointer;
        user-select: none;
        transition: all 0.15s;
      }

      .group-light-chip.on {
        border-color: #5cacff;
        color: #5cacff;
        background: rgba(92, 172, 255, 0.15);
      }

      .group-edit-hint {
        font-size: 11px;
        color: #9198a1;
        font-style: italic;
      }

      /* ── Setup mode ─────────────────────────────────────── */

      .setup-title {
        color: #5cacff;
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
        background: #5cacff;
        color: #f0f6fc;
      }

      .setup-save-btn:hover {
        background: #409eff;
      }

      .setup-cancel-btn {
        background: #212830;
        color: #d1d7e0;
      }

      .setup-cancel-btn:hover {
        background: #262c36;
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
        color: #9198a1;
        margin-top: 4px;
      }

      .setup-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .setup-label {
        font-size: 12px;
        color: #d1d7e0;
        flex: 0 0 64px;
        white-space: nowrap;
      }

      /* Theme smartvanio-select to match the HMI dark palette */
      .setup-entity-select {
        flex: 1;
        min-width: 0;
        --primary-text-color: #f0f6fc;
        --secondary-background-color: #151b23;
        --divider-color: #30363d;
        --primary-color: #5cacff;
        --card-background-color: #151b23;
      }

      .setup-name-input {
        flex: 0 0 90px;
        background: #151b23;
        border: 1px solid #30363d;
        border-radius: 6px;
        color: #f0f6fc;
        font-size: 13px;
        padding: 6px 8px;
        font-family: inherit;
        outline: none;
      }

      .setup-name-input:focus {
        border-color: #5cacff;
      }

      .setup-del {
        flex-shrink: 0;
        background: none;
        border: none;
        color: #9198a1;
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
        border: 1px dashed #30363d;
        border-radius: 6px;
        color: #9198a1;
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
        border-color: #5cacff;
        color: #5cacff;
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
        border: 1px solid #30363d;
        border-radius: 6px;
        background: #151b23;
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
        background: #262c36;
        border-radius: 2px;
      }

      .tab-content::-webkit-scrollbar-track,
      .lights::-webkit-scrollbar-track,
      .list::-webkit-scrollbar-track {
        background: transparent;
      }
    `}}),window.customCards=window.customCards||[],window.customCards.push({type:"smartvanio-hmi-card",name:"VanCtl HMI",description:"Instrument-cluster dashboard — tabbed cluster, climate arc, pinned quick actions",preview:!0});
//# sourceMappingURL=index.js.map
