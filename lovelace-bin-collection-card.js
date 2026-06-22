/* lovelace-bin-collection-card v5.1.0 — https://github.com/andrejkurlovic/lovelace-bin-collection-card */
var Tt=Object.defineProperty;var Bt=Object.getOwnPropertyDescriptor;var C=(o,e,t,i)=>{for(var s=i>1?void 0:i?Bt(e,t):e,r=o.length-1,n;r>=0;r--)(n=o[r])&&(s=(i?n(e,t,s):n(s))||s);return i&&s&&Tt(e,t,s),s};var U="bin-collection-card",kt={title:"Bin Collection",mode:"smart-summary",days_ahead:14,show_header:!0,show_next_summary:!0,popup:!0,sort:!0,show_all_bins:!1,show_future_bins:!0,fade_future_bins:!1,highlight_today:"subtle",secondary_info:"days",display_density:"balanced",today_text:"Today",tomorrow_text:"Tomorrow"};function ie(o){if(!o.bins||!o.bins.length)throw new Error("bin-collection-card: at least one bin is required");return{type:o.type??`custom:${U}`,...kt,...o,bins:o.bins}}function Ne(){return{name:"New Bin",entity:"",color:"grey",icon:"mdi:delete"}}function Me(){return{title:"Bin Collection",mode:"smart-summary",days_ahead:14,bins:[{name:"General",entity:"sensor.general_bin_days",image:"/local/images/bin_general.png",color:"grey",icon:"mdi:delete"},{name:"Garden",entity:"sensor.garden_bin_days",image:"/local/images/bin_garden.png",color:"green",icon:"mdi:leaf"},{name:"Plastic",entity:"sensor.plastic_bin_days",image:"/local/images/bin_plastic.png",color:"burgundy",icon:"mdi:recycle"},{name:"Paper",entity:"sensor.paper_bin_days",image:"/local/images/bin_paper.png",color:"beige",icon:"mdi:newspaper-variant"}]}}var se=globalThis,re=se.ShadowRoot&&(se.ShadyCSS===void 0||se.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,$e=Symbol(),Oe=new WeakMap,Y=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==$e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(re&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=Oe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Oe.set(t,e))}return e}toString(){return this.cssText}},Le=o=>new Y(typeof o=="string"?o:o+"",void 0,$e),k=(o,...e)=>{let t=o.length===1?o[0]:e.reduce((i,s,r)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+o[r+1],o[0]);return new Y(t,o,$e)},ze=(o,e)=>{if(re)o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=se.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,o.appendChild(i)}},we=re?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return Le(t)})(o):o;var{is:Pt,defineProperty:Dt,getOwnPropertyDescriptor:Ht,getOwnPropertyNames:Nt,getOwnPropertySymbols:Mt,getPrototypeOf:Ot}=Object,ne=globalThis,Ue=ne.trustedTypes,Lt=Ue?Ue.emptyScript:"",zt=ne.reactiveElementPolyfillSupport,W=(o,e)=>o,K={toAttribute(o,e){switch(e){case Boolean:o=o?Lt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},ae=(o,e)=>!Pt(o,e),Ie={attribute:!0,type:String,converter:K,reflect:!1,useDefault:!1,hasChanged:ae};Symbol.metadata??=Symbol("metadata"),ne.litPropertyMetadata??=new WeakMap;var A=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Ie){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&Dt(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:r}=Ht(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:s,set(n){let a=s?.call(this);r?.call(this,n),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ie}static _$Ei(){if(this.hasOwnProperty(W("elementProperties")))return;let e=Ot(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(W("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(W("properties"))){let t=this.properties,i=[...Nt(t),...Mt(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(we(s))}else e!==void 0&&t.push(we(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ze(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:K).toAttribute(t,i.type);this._$Em=e,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let r=i.getPropertyOptions(s),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:K;this._$Em=s;let a=n.fromAttribute(t,r.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(e,t,i,s=!1,r){if(e!==void 0){let n=this.constructor;if(s===!1&&(r=this[e]),i??=n.getPropertyOptions(e),!((i.hasChanged??ae)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),r!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,r]of i){let{wrapped:n}=r,a=this[s];n!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,r,a)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[W("elementProperties")]=new Map,A[W("finalized")]=new Map,zt?.({ReactiveElement:A}),(ne.reactiveElementVersions??=[]).push("2.1.2");var Ae=globalThis,je=o=>o,le=Ae.trustedTypes,qe=le?le.createPolicy("lit-html",{createHTML:o=>o}):void 0,Re="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,Se="?"+R,Ut=`<${Se}>`,H=document,Z=()=>H.createComment(""),Q=o=>o===null||typeof o!="object"&&typeof o!="function",Ee=Array.isArray,Ke=o=>Ee(o)||typeof o?.[Symbol.iterator]=="function",Ce=`[ 	
\f\r]`,J=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Fe=/-->/g,Ge=/>/g,P=RegExp(`>|${Ce}(?:([^\\s"'>=/]+)(${Ce}*=${Ce}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ve=/'/g,Ye=/"/g,Je=/^(?:script|style|textarea|title)$/i,Te=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),p=Te(1),fo=Te(2),go=Te(3),S=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),We=new WeakMap,D=H.createTreeWalker(H,129);function Ze(o,e){if(!Ee(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return qe!==void 0?qe.createHTML(e):e}var Qe=(o,e)=>{let t=o.length-1,i=[],s,r=e===2?"<svg>":e===3?"<math>":"",n=J;for(let a=0;a<t;a++){let l=o[a],d,u,c=-1,m=0;for(;m<l.length&&(n.lastIndex=m,u=n.exec(l),u!==null);)m=n.lastIndex,n===J?u[1]==="!--"?n=Fe:u[1]!==void 0?n=Ge:u[2]!==void 0?(Je.test(u[2])&&(s=RegExp("</"+u[2],"g")),n=P):u[3]!==void 0&&(n=P):n===P?u[0]===">"?(n=s??J,c=-1):u[1]===void 0?c=-2:(c=n.lastIndex-u[2].length,d=u[1],n=u[3]===void 0?P:u[3]==='"'?Ye:Ve):n===Ye||n===Ve?n=P:n===Fe||n===Ge?n=J:(n=P,s=void 0);let h=n===P&&o[a+1].startsWith("/>")?" ":"";r+=n===J?l+Ut:c>=0?(i.push(d),l.slice(0,c)+Re+l.slice(c)+R+h):l+R+(c===-2?a:h)}return[Ze(o,r+(o[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},X=class o{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,n=0,a=e.length-1,l=this.parts,[d,u]=Qe(e,t);if(this.el=o.createElement(d,i),D.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=D.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let c of s.getAttributeNames())if(c.endsWith(Re)){let m=u[n++],h=s.getAttribute(c).split(R),g=/([.?@])?(.*)/.exec(m);l.push({type:1,index:r,name:g[2],strings:h,ctor:g[1]==="."?de:g[1]==="?"?ce:g[1]==="@"?ue:M}),s.removeAttribute(c)}else c.startsWith(R)&&(l.push({type:6,index:r}),s.removeAttribute(c));if(Je.test(s.tagName)){let c=s.textContent.split(R),m=c.length-1;if(m>0){s.textContent=le?le.emptyScript:"";for(let h=0;h<m;h++)s.append(c[h],Z()),D.nextNode(),l.push({type:2,index:++r});s.append(c[m],Z())}}}else if(s.nodeType===8)if(s.data===Se)l.push({type:2,index:r});else{let c=-1;for(;(c=s.data.indexOf(R,c+1))!==-1;)l.push({type:7,index:r}),c+=R.length-1}r++}}static createElement(e,t){let i=H.createElement("template");return i.innerHTML=e,i}};function N(o,e,t=o,i){if(e===S)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,r=Q(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(o),s._$AT(o,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=N(o,s._$AS(o,e.values),s,i)),e}var pe=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??H).importNode(t,!0);D.currentNode=s;let r=D.nextNode(),n=0,a=0,l=i[0];for(;l!==void 0;){if(n===l.index){let d;l.type===2?d=new I(r,r.nextSibling,this,e):l.type===1?d=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(d=new he(r,this,e)),this._$AV.push(d),l=i[++a]}n!==l?.index&&(r=D.nextNode(),n++)}return D.currentNode=H,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},I=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=N(this,e,t),Q(e)?e===f||e==null||e===""?(this._$AH!==f&&this._$AR(),this._$AH=f):e!==this._$AH&&e!==S&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ke(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==f&&Q(this._$AH)?this._$AA.nextSibling.data=e:this.T(H.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=X.createElement(Ze(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let r=new pe(s,this),n=r.u(this.options);r.p(t),this.T(n),this._$AH=r}}_$AC(e){let t=We.get(e.strings);return t===void 0&&We.set(e.strings,t=new X(e)),t}k(e){Ee(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let r of e)s===t.length?t.push(i=new o(this.O(Z()),this.O(Z()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=je(e).nextSibling;je(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=f,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=f}_$AI(e,t=this,i,s){let r=this.strings,n=!1;if(r===void 0)e=N(this,e,t,0),n=!Q(e)||e!==this._$AH&&e!==S,n&&(this._$AH=e);else{let a=e,l,d;for(e=r[0],l=0;l<r.length-1;l++)d=N(this,a[i+l],t,l),d===S&&(d=this._$AH[l]),n||=!Q(d)||d!==this._$AH[l],d===f?e=f:e!==f&&(e+=(d??"")+r[l+1]),this._$AH[l]=d}n&&!s&&this.j(e)}j(e){e===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},de=class extends M{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===f?void 0:e}},ce=class extends M{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==f)}},ue=class extends M{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=N(this,e,t,0)??f)===S)return;let i=this._$AH,s=e===f&&i!==f||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==f&&(i===f||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},he=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){N(this,e)}},Xe={M:Re,P:R,A:Se,C:1,L:Qe,R:pe,D:Ke,V:N,I,H:M,N:ce,U:ue,B:de,F:he},It=Ae.litHtmlPolyfillSupport;It?.(X,I),(Ae.litHtmlVersions??=[]).push("3.3.3");var et=(o,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let r=t?.renderBefore??null;i._$litPart$=s=new I(e.insertBefore(Z(),r),r,void 0,t??{})}return s._$AI(o),s};var Be=globalThis,_=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=et(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};_._$litElement$=!0,_.finalized=!0,Be.litElementHydrateSupport?.({LitElement:_});var jt=Be.litElementPolyfillSupport;jt?.({LitElement:_});(Be.litElementVersions??=[]).push("4.2.2");var j=o=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(o,e)}):customElements.define(o,e)};var qt={attribute:!0,type:String,converter:K,reflect:!1,hasChanged:ae},Ft=(o=qt,e,t)=>{let{kind:i,metadata:s}=t,r=globalThis.litPropertyMetadata.get(s);if(r===void 0&&globalThis.litPropertyMetadata.set(s,r=new Map),i==="setter"&&((o=Object.create(o)).wrapped=!0),r.set(t.name,o),i==="accessor"){let{name:n}=t;return{set(a){let l=e.get.call(this);e.set.call(this,a),this.requestUpdate(n,l,o,!0,a)},init(a){return a!==void 0&&this.C(n,void 0,o,a),a}}}if(i==="setter"){let{name:n}=t;return function(a){let l=this[n];e.call(this,a),this.requestUpdate(n,l,o,!0,a)}}throw Error("Unsupported decorator location: "+i)};function ee(o){return(e,t)=>typeof t=="object"?Ft(o,e,t):((i,s,r)=>{let n=s.hasOwnProperty(r);return s.constructor.createProperty(r,i),n?Object.getOwnPropertyDescriptor(s,r):void 0})(o,e,t)}function me(o){return ee({...o,state:!0,attribute:!1})}function tt(o){return[...o].sort((e,t)=>e.days==null?1:t.days==null?-1:e.days-t.days)}function te(o,e){return e.show_all_bins?o:o.filter(t=>t.days==null||t.days<=e.days_ahead)}function ge(o){let e=new Map;for(let t of o){let i=e.get(t.days);i?i.push(t):e.set(t.days,[t])}return[...e.entries()].map(([t,i])=>({days:t,bins:i})).sort((t,i)=>Number(t.days)-Number(i.days))}function Gt(o,e){let t=e&&o.entity?e.states[o.entity]:void 0,i=t?parseInt(t.state,10):NaN,s=t&&!isNaN(i)?i:null,r=t?.attributes??{};return{...o,days:s,nextDate:r.next_collection||null,missing:!t,delayed:r.delayed===!0,changed:r.changed===!0,collectionType:r.collection_type||null,message:r.message||null,delayNote:r.delay_note||null}}function ot(o,e){let t=e.bins.map(i=>Gt(i,o));return e.sort?tt(t):t}function it(o,e){return o?e.map(t=>{let i=t.entity?o.states[t.entity]:void 0;if(!i)return"x";let s=i.attributes??{};return[i.state,s.next_collection||"",s.delayed?"1":"0",s.changed?"1":"0",s.collection_type||"",s.message||"",s.delay_note||""].join("|")}).join(","):""}async function st(o,e,t=4){if(!o||!e||typeof o.callApi!="function")return[];let i=new Date,s=new Date;s.setDate(s.getDate()-180);try{let r=`history/period/${s.toISOString()}?filter_entity_id=${encodeURIComponent(e)}&end_time=${encodeURIComponent(i.toISOString())}&no_attributes`,n=await o.callApi("GET",r),a=Array.isArray(n)&&n[0]?n[0]:[],l=[],d=!1;for(let u of a){let c=u.state==="0";c&&!d&&l.push(u.last_changed),d=c}return l.slice(-t).reverse()}catch{return[]}}function rt(o){return o.days===0?"today":o.days===1?"tomorrow":o.days!=null&&o.days>1&&o.days<=3?"soon":""}var Vt=7;function ke(o){return Vt}function O(o,e){return e.fade_future_bins&&o.days!=null&&o.days>ke(e)}function nt(o){let e=new Date;return e.setDate(e.getDate()+o),e.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}function ye(o){if(o===0)return"Today";if(o===1)return"Tomorrow";let e=new Date;return e.setDate(e.getDate()+o),e.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"short"})}function at(o){if(!o)return null;let e=/^(\d{4})-(\d{2})-(\d{2})/.exec(o);if(!e)return null;let t=new Date(Number(e[1]),Number(e[2])-1,Number(e[3]));return isNaN(t.getTime())?null:t}function be(o){return o.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}function L(o,e){return o==null||isNaN(o)?"\u2014":o===0?e.today_text:o===1?e.tomorrow_text:o<0?"Missed collection":`in ${o} days`}function Yt(o,e){return o==null||isNaN(o)?"\u2014":o===0?e.today_text:o===1?e.tomorrow_text:o<0?"Missed":`${o} days`}function E(o,e,t){let i=Yt(o.days,t),s=at(o.nextDate),r=s?be(s):o.days!=null?nt(o.days):"";return e==="date"?r||i:e==="both"&&r?`${i} \u2022 ${r}`:i}function $(o){if(!o.length)return"";if(o.length===1)return o[0].name;if(o.length===2)return`${o[0].name} & ${o[1].name}`;let e=o[o.length-1].name;return`${o.slice(0,-1).map(i=>i.name).join(", ")} & ${e}`}function oe(o){return o.find(e=>e.action_text)?.action_text??null}function lt(o){return o==="calm"?0:o==="rich"?2:1}function pt(o,e){let t=o.filter(y=>y.days===0),i=o.filter(y=>y.days!=null&&y.days<0),s=o.filter(y=>y.days===1),r=o.filter(y=>y.days!=null&&y.days>1),n=r[0]??null,a=n?r.filter(y=>y.days===n.days):[],l=n?r.filter(y=>y.days!==n.days):[],d,u,c,m,h;t.length?(d="today",u="Collection Day",c=`${$(t)} ${t.length>1?"are":"is"} being collected today`,m=oe(t),h=t):i.length?(d="missed",u="Missed Collection",c=`${$(i)} ${i.length>1?"were":"was"} not collected \u2014 check with your council`,m=oe(i),h=i):s.length?(d="tomorrow",u="Prepare Tonight",c=`${$(s)} ${s.length>1?"are":"is"} collected tomorrow`,m=oe(s)||"Put out tonight",h=s):n&&n.days<7?(d="upcoming",u="Next Collection",c=`${$(a)} ${a.length>1?"are":"is"} due ${L(n.days,e)}`,m=oe(a),h=a):n?(d="quiet",u="No Collections This Week",c=`Next known: ${$(a)} ${a.length>1?"are":"is"} due ${L(n.days,e)}`,m=null,h=a):(d="unknown",u="No Data",c="Check your bin sensors",m=null,h=[]);let g=null;(d==="today"||d==="missed"||d==="tomorrow")&&n&&e.show_future_bins&&(g=`Next: ${$(a)} ${L(n.days,e)}`);let v=[];return d==="upcoming"&&e.show_future_bins&&(v=l.slice(0,lt(e.display_density))),{state:d,headerTitle:u,headerSub:c,actionHint:m,mainBins:h,nextLine:g,extraBins:v}}var dt={grey:{bg:"rgba(42,45,49,0.92)",accent:"#9e9e9e",glow:"rgba(158,158,158,0.15)"},gray:{bg:"rgba(42,45,49,0.92)",accent:"#9e9e9e",glow:"rgba(158,158,158,0.15)"},green:{bg:"rgba(30,50,33,0.92)",accent:"#72e906",glow:"rgba(114,233,6,0.12)"},garden:{bg:"rgba(30,50,33,0.92)",accent:"#72e906",glow:"rgba(114,233,6,0.12)"},burgundy:{bg:"rgba(54,28,40,0.92)",accent:"#c04070",glow:"rgba(192,64,112,0.14)"},plastic:{bg:"rgba(54,28,40,0.92)",accent:"#c04070",glow:"rgba(192,64,112,0.14)"},beige:{bg:"rgba(52,48,35,0.92)",accent:"#d4a843",glow:"rgba(212,168,67,0.13)"},paper:{bg:"rgba(52,48,35,0.92)",accent:"#d4a843",glow:"rgba(212,168,67,0.13)"},recycling:{bg:"rgba(52,48,35,0.92)",accent:"#d4a843",glow:"rgba(212,168,67,0.13)"},blue:{bg:"rgba(25,40,65,0.92)",accent:"#4fc3f7",glow:"rgba(79,195,247,0.13)"},brown:{bg:"rgba(50,33,20,0.92)",accent:"#a1887f",glow:"rgba(161,136,127,0.13)"},black:{bg:"rgba(20,20,20,0.92)",accent:"#616161",glow:"rgba(97,97,97,0.13)"},red:{bg:"rgba(60,20,20,0.92)",accent:"#ef5350",glow:"rgba(239,83,80,0.13)"},yellow:{bg:"rgba(55,50,15,0.92)",accent:"#ffee58",glow:"rgba(255,238,88,0.12)"},purple:{bg:"rgba(40,20,55,0.92)",accent:"#ab47bc",glow:"rgba(171,71,188,0.13)"},orange:{bg:"rgba(55,38,15,0.92)",accent:"#ffa726",glow:"rgba(255,167,38,0.13)"},pink:{bg:"rgba(60,25,45,0.92)",accent:"#f48fb1",glow:"rgba(244,143,177,0.12)"},silver:{bg:"rgba(50,52,55,0.92)",accent:"#b0bec5",glow:"rgba(176,190,197,0.12)"},amber:{bg:"rgba(55,44,10,0.92)",accent:"#ffca28",glow:"rgba(255,202,40,0.13)"},teal:{bg:"rgba(15,45,42,0.92)",accent:"#26a69a",glow:"rgba(38,166,154,0.13)"},navy:{bg:"rgba(10,20,50,0.92)",accent:"#3949ab",glow:"rgba(57,73,171,0.14)"},lime:{bg:"rgba(35,50,10,0.92)",accent:"#d4e157",glow:"rgba(212,225,87,0.12)"},white:{bg:"rgba(55,58,62,0.92)",accent:"#eceff1",glow:"rgba(236,239,241,0.10)"},default:{bg:"rgba(38,40,44,0.92)",accent:"#90caf9",glow:"rgba(144,202,249,0.12)"}},ct=["grey","green","burgundy","beige","blue","brown","black","red","yellow","purple","orange","pink","silver","amber","teal","navy","lime","white"];function b(o){return dt[(o??"").toLowerCase()]??dt.default}function w(o,e,t,i=""){let s=`width:${e}px;height:${t}px;object-fit:contain;`,r=`--mdc-icon-size:${Math.round(t*.65)}px;color:rgba(255,255,255,0.8)`;return o.image?p`
    <img
      class=${i}
      src=${o.image}
      alt=${o.name}
      loading="lazy"
      style=${s}
      @error=${n=>{let a=n.target;a.style.display="none";let l=a.nextElementSibling;l&&(l.style.display="flex")}}
    />
    <div class="icon-fallback" style="display:none;width:${e}px;height:${t}px;align-items:center;justify-content:center">
      <ha-icon icon=${o.icon||"mdi:delete"} style=${r}></ha-icon>
    </div>`:p`
      <div class="icon-fallback" style="width:${e}px;height:${t}px;display:flex;align-items:center;justify-content:center">
        <ha-icon icon=${o.icon||"mdi:delete"} style=${r}></ha-icon>
      </div>`}function T(o){return p`
    ${o.delayed?p`<span class="badge badge-delayed">Delayed</span>`:""}
    ${o.changed?p`<span class="badge badge-changed">Changed</span>`:""}
  `}function Wt(o,e){let t=e.highlight_today;if(t==="off"||o.days!==0&&o.days!==1)return"";let i=o.days===0?e.today_text:e.tomorrow_text,s=o.days===0?"today":"tomorrow";return t==="strong"?p`<div class="hl-pill hl-pill-${s}">${i}</div>`:p`<div class="hl-dot hl-dot-${s}"></div>`}function Kt(o,e,t){let i=b(o.color);return p`
    <div class="ss-bin" @click=${()=>t.onBinTap(o)}>
      <div class="ss-bin-inner" style="background:${i.bg}">
        ${w(o,48,66,"ss-img")}
        ${Wt(o,e)}
      </div>
      <div class="ss-bin-name">${o.name}</div>
      <div class="ss-bin-badges">${T(o)}</div>
    </div>`}function Jt(o,e,t){let i=O(o,e),s=E(o,e.secondary_info,e);return p`
    <div class="ss-chip ${i?"faded":""}" @click=${()=>t.onBinTap(o)}>
      ${w(o,18,24,"chip-img")}
      <span class="chip-name">${o.name}</span>
      <span class="chip-label">${s}</span>
    </div>`}function ut(o,e,t){let i=pt(o,e),s=i.mainBins.length?b(i.mainBins[0].color).glow:"transparent",r=i.mainBins.length?p`
      <div class="ss-main" style="background:linear-gradient(160deg,${s} 0%,transparent 60%)">
        <div class="ss-bin-row">${i.mainBins.map(n=>Kt(n,e,t))}</div>
        ${i.actionHint?p`<div class="ss-action-hint">${i.actionHint}</div>`:""}
      </div>`:p`
      <div class="ss-empty">
        <div class="ss-empty-icon"><ha-icon icon="mdi:check-circle-outline"></ha-icon></div>
        <div class="ss-empty-text">${i.headerSub}</div>
      </div>`;return p`
    ${e.show_header?p`
        <div class="ss-header" @click=${t.onHeaderTap}>
          <div>
            <div class="ss-title">${i.headerTitle}</div>
            <div class="ss-subtitle">${i.mainBins.length?i.headerSub:""}</div>
          </div>
          ${e.popup?p`<div class="tap-hint">▸</div>`:""}
        </div>`:""}
    ${r}
    ${i.nextLine?p`<div class="ss-next-line">${i.nextLine}</div>`:""}
    ${i.extraBins.length?p`<div class="ss-strip">${i.extraBins.map(n=>Jt(n,e,t))}</div>`:""}
  `}var ht={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},mt=o=>(...e)=>({_$litDirective$:o,values:e}),xe=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var{I:Zt}=Xe,ft=o=>o;var gt=()=>document.createComment(""),q=(o,e,t)=>{let i=o._$AA.parentNode,s=e===void 0?o._$AB:e._$AA;if(t===void 0){let r=i.insertBefore(gt(),s),n=i.insertBefore(gt(),s);t=new Zt(r,n,o,o.options)}else{let r=t._$AB.nextSibling,n=t._$AM,a=n!==o;if(a){let l;t._$AQ?.(o),t._$AM=o,t._$AP!==void 0&&(l=o._$AU)!==n._$AU&&t._$AP(l)}if(r!==s||a){let l=t._$AA;for(;l!==r;){let d=ft(l).nextSibling;ft(i).insertBefore(l,s),l=d}}}return t},B=(o,e,t=o)=>(o._$AI(e,t),o),Qt={},yt=(o,e=Qt)=>o._$AH=e,bt=o=>o._$AH,ve=o=>{o._$AR(),o._$AA.remove()};var xt=(o,e,t)=>{let i=new Map;for(let s=e;s<=t;s++)i.set(o[s],s);return i},x=mt(class extends xe{constructor(o){if(super(o),o.type!==ht.CHILD)throw Error("repeat() can only be used in text expressions")}dt(o,e,t){let i;t===void 0?t=e:e!==void 0&&(i=e);let s=[],r=[],n=0;for(let a of o)s[n]=i?i(a,n):n,r[n]=t(a,n),n++;return{values:r,keys:s}}render(o,e,t){return this.dt(o,e,t).values}update(o,[e,t,i]){let s=bt(o),{values:r,keys:n}=this.dt(e,t,i);if(!Array.isArray(s))return this.ut=n,r;let a=this.ut??=[],l=[],d,u,c=0,m=s.length-1,h=0,g=r.length-1;for(;c<=m&&h<=g;)if(s[c]===null)c++;else if(s[m]===null)m--;else if(a[c]===n[h])l[h]=B(s[c],r[h]),c++,h++;else if(a[m]===n[g])l[g]=B(s[m],r[g]),m--,g--;else if(a[c]===n[g])l[g]=B(s[c],r[g]),q(o,l[g+1],s[c]),c++,g--;else if(a[m]===n[h])l[h]=B(s[m],r[h]),q(o,s[c],s[m]),m--,h++;else if(d===void 0&&(d=xt(n,h,g),u=xt(a,c,m)),d.has(a[c]))if(d.has(a[m])){let v=u.get(n[h]),y=v!==void 0?s[v]:null;if(y===null){let He=q(o,s[c]);B(He,r[h]),l[h]=He}else l[h]=B(y,r[h]),q(o,s[c],y),s[v]=null;h++}else ve(s[m]),m--;else ve(s[c]),c++;for(;h<=g;){let v=q(o,l[g+1]);B(v,r[h]),l[h++]=v}for(;c<=m;){let v=s[c++];v!==null&&ve(v)}return this.ut=n,yt(o,l),S}});function _e(o,e,t){if(!e.show_header)return"";let i=o.find(r=>r.days!=null)??null,s="";if(e.show_next_summary&&i){let r=o.filter(l=>l.days===i.days),n=E(i,e.secondary_info,e),a=i.days===0?"hl-today":i.days===1?"hl-tomorrow":"";s=p`<div class="header-sub">Next: ${$(r)} — <span class=${a}>${n}</span></div>`}return p`
    <div class="header" @click=${t.onHeaderTap}>
      <div class="header-left">
        <div class="header-title">${e.title}</div>
        ${s}
      </div>
      ${e.popup?p`<div class="tap-hint">▸</div>`:""}
    </div>`}function Xt(o,e,t){let i=b(o.color),s=rt(o),r=O(o,e),n=o.missing?"\u2014":E(o,e.secondary_info,e),a=(s==="today"||s==="tomorrow")&&e.highlight_today!=="off";return p`
    <div class="bin-tile ${r?"faded":""}" style="background:${i.bg}" @click=${()=>t.onBinTap(o)}>
      ${a?p`<div class="urg-dot ${s==="today"?"today-dot":"tomorrow-dot"}"></div>`:""}
      <div class="tile-img-wrap">${w(o,38,52,"tile-img")}</div>
      <div class="tile-name">${o.name}</div>
      <div class="tile-label ${s}">${n}</div>
      ${o.missing?p`<div class="tile-warn">no entity</div>`:""}
      <div class="tile-badges">${T(o)}</div>
      <div class="tile-accent" style="background:${i.accent}"></div>
    </div>`}function vt(o,e,t,i,s){let r=_e(o,e,t);return o.length?p`
    ${r}
    <div class=${i} style=${s??""}>
      ${x(o,n=>n.entity,n=>Xt(n,e,t))}
    </div>`:p`${r}<div class="empty-state">No collections due within ${e.days_ahead} days</div>`}function _t(o,e,t){return vt(o,e,t,"grid")}function $t(o,e,t){return vt(o,e,t,"row",o.length?`grid-template-columns: repeat(${o.length}, 1fr)`:void 0)}function eo(o,e){let t=b(o.color);return p`
    <div class="tl-chip" style="background:${t.bg}" @click=${()=>e.onBinTap(o)}>
      ${w(o,20,28,"tl-img")}
      <span class="tl-chip-name">${o.name}</span>
      <span class="tl-badges">${T(o)}</span>
    </div>`}function wt(o,e,t){let i=_e(o,e,t),s=ge(o);if(e.show_future_bins||(s=s.filter(n=>n.days!=null&&n.days<=1)),!s.length)return p`${i}<div class="empty-state">No collections due soon</div>`;let r=ke(e);return p`
    ${i}
    <div class="timeline">
      ${x(s,n=>n.days??"null",n=>{let a=n.days,l=a!=null?ye(a):"Unknown",d=a===0?"tl-today":a===1?"tl-tomorrow":"",u=e.fade_future_bins&&a!=null&&a>r;return p`
            <div class="tl-row ${u?"faded":""}">
              <div class="tl-date ${d}">${l}</div>
              <div class="tl-bins">${x(n.bins,c=>c.entity,c=>eo(c,t))}</div>
            </div>`})}
    </div>`}function to(o,e){let t=o.filter(s=>s.days===0),i=o.find(s=>s.days!=null)??null;if(t.length)return`${$(t)} today`;if(i){let s=o.filter(r=>r.days===i.days);return`${$(s)} ${L(i.days,e)}`}return"No collections due"}function Ct(o,e,t){let i=to(o,e);return p`
    <div class="compact" @click=${t.onHeaderTap}>
      <div class="compact-dots">
        ${x(o,s=>s.entity,s=>p`
            <div
              class="compact-dot ${s.days===0?"today":""} ${O(s,e)?"future":""}"
              style="background:${b(s.color).accent}"
              title="${s.name}: ${L(s.days,e)}"
              @click=${r=>{r.stopPropagation(),t.onBinTap(s)}}
            ></div>`)}
      </div>
      <div class="compact-text">
        <div class="compact-title">${e.title}</div>
        <div class="compact-summary">${i}</div>
      </div>
      ${x(o.slice(0,3),s=>s.entity,s=>p`
          <div
            class="compact-img-wrap ${O(s,e)?"faded":""}"
            @click=${r=>{r.stopPropagation(),t.onBinTap(s)}}
          >${w(s,22,30,"compact-img")}</div>`)}
    </div>`}function Pe(o,e){let t=b(o.color);return p`
    <div class="popup-bin-card" style="background:${t.bg}">
      ${w(o,32,44,"popup-img")}
      <div class="popup-bin-info">
        <div class="popup-bin-name">${o.name} ${T(o)}</div>
        <div class="popup-bin-date">${e}</div>
        ${o.message?p`<div class="popup-bin-message">${o.message}</div>`:""}
        ${o.delayNote?p`<div class="popup-bin-message">⚠ ${o.delayNote}</div>`:""}
        ${o.collectionType?p`<div class="popup-bin-message">${o.collectionType}</div>`:""}
        ${o.notes?p`<div class="popup-bin-notes">${o.notes}</div>`:""}
        ${o.action_text?p`<div class="popup-bin-action">↗ ${o.action_text}</div>`:""}
      </div>
    </div>`}function At(o,e){let t=o.filter(d=>d.days===0),i=o.filter(d=>d.days!=null&&d.days<0),s=o.filter(d=>d.days!=null&&d.days>0),r=ge(s),n=e.secondary_info!=="days"?e.secondary_info:"both",a=t.length||i.length,l=a||r.length;return p`
    ${a?p`
        <div class="popup-section">
          <div class="popup-label">Today</div>
          <div class="popup-today-row">
            ${x(t,d=>d.entity,d=>Pe(d,E(d,n,e)))}
            ${x(i,d=>d.entity,d=>Pe(d,"Missed collection"))}
          </div>
        </div>
        ${r.length?p`<div class="popup-divider"></div>`:""}`:""}
    ${r.length?p`
        <div class="popup-section">
          <div class="popup-label">Upcoming</div>
          ${x(r,d=>d.days??"null",d=>p`
              <div class="popup-tl-row">
                <div class="popup-tl-date">${d.days!=null?ye(d.days):"Unknown"}</div>
                <div class="popup-tl-col">
                  ${x(d.bins,u=>u.entity,u=>p`
                      <div class="popup-tl-chip" style="background:${b(u.color).bg}">
                        ${w(u,16,22,"popup-chip-img")}
                        <div class="popup-tl-chip-info">
                          <span class="popup-tl-chip-name">${u.name} ${T(u)}</span>
                          ${u.notes?p`<span class="popup-tl-chip-notes">${u.notes}</span>`:""}
                          ${u.message?p`<span class="popup-tl-chip-notes">${u.message}</span>`:""}
                        </div>
                      </div>`)}
                </div>
              </div>`)}
        </div>`:""}
    ${l?"":p`<div class="popup-empty">No upcoming collections</div>`}
  `}function De(o,e,t){let i=o.days!=null?E(o,"both",e):"Unknown";return p`
    <div class="popup-section">
      <div class="popup-label">Next collection</div>
      ${Pe(o,i)}
    </div>
    <div class="popup-divider"></div>
    <div class="popup-section">
      <div class="popup-label">Past collections</div>
      ${t===null?p`<div class="popup-empty">Checking history…</div>`:t.length===0?p`<div class="popup-empty">No collection history available yet</div>`:p`
            <div class="popup-tl-col">
              ${x(t,s=>s,s=>p`<div class="popup-tl-chip" style="background:${b(o.color).bg}">${be(new Date(s))}</div>`)}
            </div>`}
    </div>`}var Rt=k`
  :host {
    display: block;
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  ha-card {
    overflow: hidden;
    font-family: var(--primary-font-family, sans-serif);
    color: var(--primary-text-color, #fff);
  }

  /* ── BADGES (shared) ── */
  .badge {
    font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
    padding: 2px 6px; border-radius: 5px; margin-right: 4px; display: inline-block;
  }
  .badge-delayed { background: rgba(255,167,38,0.18); color: #ffa726; }
  .badge-changed { background: rgba(79,195,247,0.18); color: #4fc3f7; }
  .faded { opacity: 0.45; transition: opacity .2s; }

  /* ── HEADER (image-grid / row / timeline / compact) ── */
  .header {
    padding: 14px 16px 10px; display: flex; align-items: center; justify-content: space-between;
    cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent;
  }
  .header-left { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .header-title { font-size: 15px; font-weight: 700; letter-spacing: .01em; }
  .header-sub { font-size: 11px; color: var(--secondary-text-color, rgba(255,255,255,0.55)); }
  .hl-today { color: #ff8a65; font-weight: 600; }
  .hl-tomorrow { color: #ffa726; font-weight: 600; }
  .tap-hint { font-size: 12px; color: var(--secondary-text-color, rgba(255,255,255,0.25)); padding-left: 8px; flex-shrink: 0; }

  /* ── SMART SUMMARY ── */
  .ss-header {
    padding: 16px 18px 10px; display: flex; align-items: flex-start; justify-content: space-between;
    cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent;
  }
  .ss-title { font-size: 18px; font-weight: 700; letter-spacing: -.01em; line-height: 1.2; }
  .ss-subtitle { font-size: 12px; color: var(--secondary-text-color, rgba(255,255,255,0.55)); margin-top: 3px; line-height: 1.35; min-height: 15px; }
  .ss-main { padding: 8px 16px 14px; }
  .ss-bin-row { display: flex; gap: 10px; align-items: flex-end; }
  .ss-bin { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .ss-bin-inner {
    position: relative; border-radius: 14px; padding: 12px 14px 10px; display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .ss-bin-name { font-size: 12px; font-weight: 600; color: var(--primary-text-color, #fff); text-align: center; }
  .ss-bin-badges { display: flex; gap: 3px; justify-content: center; min-height: 13px; }
  .ss-action-hint { margin-top: 10px; font-size: 11px; color: rgba(255,255,255,0.45); letter-spacing: .02em; font-style: italic; }
  .ss-empty { padding: 20px 18px 24px; display: flex; align-items: center; gap: 12px; }
  .ss-empty-icon ha-icon { --mdc-icon-size: 28px; color: rgba(255,255,255,0.2); }
  .ss-empty-text { font-size: 13px; color: var(--secondary-text-color, rgba(255,255,255,0.4)); }
  .ss-next-line { padding: 0 18px 12px; font-size: 11px; color: var(--secondary-text-color, rgba(255,255,255,0.45)); }
  .ss-strip { display: flex; gap: 6px; flex-wrap: wrap; padding: 8px 16px 12px; border-top: 1px solid rgba(255,255,255,0.05); }
  .ss-chip {
    display: flex; align-items: center; gap: 5px; padding: 4px 8px 4px 5px; border-radius: 8px;
    background: rgba(255,255,255,0.05); cursor: pointer; -webkit-tap-highlight-color: transparent;
  }
  .chip-name { font-size: 11px; font-weight: 600; color: var(--primary-text-color, #fff); }
  .chip-label { font-size: 10px; color: var(--secondary-text-color, rgba(255,255,255,0.5)); margin-left: 2px; }

  /* highlight_today badges */
  .hl-dot { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; border-radius: 50%; }
  .hl-dot-today { background: #ff8a65; }
  .hl-dot-tomorrow { background: #ffa726; }
  .hl-pill {
    position: absolute; top: 4px; right: 4px; font-size: 9px; font-weight: 800; text-transform: uppercase;
    letter-spacing: .04em; padding: 3px 7px; border-radius: 6px; color: #1c1c1e;
  }
  .hl-pill-today { background: #ff8a65; }
  .hl-pill-tomorrow { background: #ffa726; }

  /* ── IMAGE GRID / ROW (shared tile) ── */
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; padding: 0 10px 12px; }
  .row { display: grid; gap: 6px; padding: 0 10px 12px; }
  .row .bin-tile { padding: 8px 4px 8px; }
  .row .tile-name { font-size: 11px; }
  .row .tile-label { font-size: 10px; }
  .bin-tile {
    border-radius: 13px; padding: 12px 8px 10px; display: flex; flex-direction: column; align-items: center; gap: 5px;
    cursor: pointer; position: relative; overflow: hidden;
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 1px 5px rgba(0,0,0,0.25);
    -webkit-tap-highlight-color: transparent;
  }
  .tile-img-wrap { position: relative; }
  .tile-name { font-size: 12px; font-weight: 700; color: #fff; text-align: center; line-height: 1.2; }
  .tile-label { font-size: 11px; color: rgba(255,255,255,0.65); text-align: center; }
  .tile-label.today { color: #ff8a65; font-weight: 600; }
  .tile-label.tomorrow { color: #ffa726; font-weight: 600; }
  .tile-label.soon { color: #fff176; }
  .tile-warn { font-size: 9px; color: #ef5350; }
  .tile-badges { display: flex; gap: 3px; flex-wrap: wrap; justify-content: center; min-height: 13px; }
  .tile-accent { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; opacity: 0.6; }
  .urg-dot { position: absolute; top: 8px; right: 8px; width: 7px; height: 7px; border-radius: 50%; }
  .today-dot { background: #ff8a65; }
  .tomorrow-dot { background: #ffa726; }

  /* ── TIMELINE ── */
  .timeline { padding: 0 14px 14px; }
  .tl-row { display: flex; align-items: flex-start; gap: 12px; padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .tl-row:last-child { border-bottom: none; }
  .tl-date {
    font-size: 12px; font-weight: 600; color: var(--secondary-text-color, rgba(255,255,255,0.5));
    min-width: 110px; flex-shrink: 0; padding-top: 5px;
  }
  .tl-today { color: #ff8a65; }
  .tl-tomorrow { color: #ffa726; }
  .tl-bins { display: flex; gap: 6px; flex-wrap: wrap; }
  .tl-chip {
    display: flex; align-items: center; gap: 6px; border-radius: 9px; padding: 5px 10px 5px 6px;
    cursor: pointer; -webkit-tap-highlight-color: transparent;
  }
  .tl-chip-name { font-size: 12px; font-weight: 600; color: #fff; }
  .tl-badges { display: inline-flex; gap: 3px; margin-left: 2px; }

  /* ── COMPACT ── */
  .compact { display: flex; align-items: center; gap: 10px; padding: 12px 16px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .compact-dots { display: flex; gap: 4px; flex-shrink: 0; }
  .compact-dot { width: 9px; height: 9px; border-radius: 50%; opacity: 1; transition: transform .15s, opacity .2s, width .15s, height .15s; cursor: pointer; }
  .compact-dot.future { opacity: 0.35; width: 7px; height: 7px; }
  .compact-dot.today { transform: scale(1.4); box-shadow: 0 0 5px currentColor; }
  .compact-text { flex: 1; min-width: 0; }
  .compact-title { font-size: 13px; font-weight: 700; }
  .compact-summary { font-size: 11px; color: var(--secondary-text-color, rgba(255,255,255,0.55)); }
  .compact-img { flex-shrink: 0; }
  .compact-img-wrap { display: inline-flex; flex-shrink: 0; cursor: pointer; }

  /* ── EMPTY ── */
  .empty-state { padding: 22px 16px; text-align: center; font-size: 13px; color: var(--secondary-text-color, rgba(255,255,255,0.35)); }
`;var St=k`
  :host {
    position: fixed;
    inset: 0;
    z-index: 9998;
  }
  * { box-sizing: border-box; }
  .popup-bg {
    position: fixed; inset: 0; background: rgba(0,0,0,0.55);
    backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    display: flex; align-items: flex-end; justify-content: center;
    animation: fade-in .16s ease;
  }
  @media (min-width: 600px) { .popup-bg { align-items: center; } }
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
  .popup-sheet {
    background: var(--ha-card-background, #1c1c1e); border-radius: 22px 22px 0 0; width: 100%; max-width: 500px;
    max-height: 82vh; overflow-y: auto; overflow-x: hidden; box-shadow: 0 -6px 40px rgba(0,0,0,0.55);
    animation: slide-up .22s cubic-bezier(.3,.7,.3,1); color: var(--primary-text-color, #fff);
    font-family: var(--primary-font-family, sans-serif);
  }
  @media (min-width: 600px) { .popup-sheet { border-radius: 20px; max-height: 72vh; } }
  @keyframes slide-up { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .popup-drag { width: 36px; height: 4px; background: rgba(255,255,255,0.15); border-radius: 2px; margin: 10px auto 0; }
  .popup-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px 10px; }
  .popup-title { font-size: 17px; font-weight: 700; }
  .popup-close {
    width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.07); border: none; cursor: pointer;
    color: var(--secondary-text-color, rgba(255,255,255,0.6)); font-size: 14px; display: flex; align-items: center; justify-content: center; padding: 0;
  }
  .popup-section { padding: 0 20px 14px; }
  .popup-label {
    font-size: 10px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase;
    color: var(--secondary-text-color, rgba(255,255,255,0.45)); margin-bottom: 10px;
  }
  .popup-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 0 20px 14px; }
  .popup-today-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .popup-bin-card {
    flex: 1; min-width: 140px; border-radius: 14px; padding: 12px 14px 12px 10px; display: flex; align-items: center; gap: 10px;
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 1px 6px rgba(0,0,0,0.25);
  }
  .popup-bin-info { flex: 1; min-width: 0; }
  .popup-bin-name { font-size: 13px; font-weight: 700; }
  .popup-bin-date { font-size: 11px; color: rgba(255,255,255,0.55); margin-top: 1px; }
  .popup-bin-message { font-size: 10px; color: #4fc3f7; margin-top: 3px; }
  .popup-bin-notes { font-size: 10px; color: rgba(255,255,255,0.38); margin-top: 4px; font-style: italic; }
  .popup-bin-action { font-size: 10px; color: #ffa726; margin-top: 3px; font-weight: 600; }
  .popup-tl-row { display: flex; align-items: flex-start; gap: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .popup-tl-row:last-child { border-bottom: none; }
  .popup-tl-date {
    font-size: 11px; font-weight: 600; color: var(--secondary-text-color, rgba(255,255,255,0.5));
    min-width: 90px; flex-shrink: 0; padding-top: 5px;
  }
  .popup-tl-col { display: flex; flex-direction: column; gap: 5px; flex: 1; }
  .popup-tl-chip { display: flex; align-items: flex-start; gap: 6px; border-radius: 9px; padding: 6px 10px 6px 6px; }
  .popup-tl-chip-info { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
  .popup-tl-chip-name { font-size: 11px; font-weight: 600; color: #fff; }
  .popup-tl-chip-notes { font-size: 9px; color: rgba(255,255,255,0.4); font-style: italic; }
  .popup-empty { padding: 20px; text-align: center; color: rgba(255,255,255,0.35); font-size: 13px; }
`;var z=class extends _{constructor(){super(...arguments);this.heading="";this.body=p``;this._onKeydown=t=>{t.key==="Escape"&&this.close()}}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKeydown)}disconnectedCallback(){document.removeEventListener("keydown",this._onKeydown),super.disconnectedCallback()}close(){this.dispatchEvent(new CustomEvent("popup-closed")),this.remove()}_onBgClick(t){t.target===t.currentTarget&&this.close()}render(){return p`
      <div class="popup-bg" @click=${this._onBgClick}>
        <div class="popup-sheet">
          <div class="popup-drag"></div>
          <div class="popup-head">
            <div class="popup-title">${this.heading}</div>
            <button class="popup-close" @click=${()=>this.close()}>✕</button>
          </div>
          ${this.body}
        </div>
      </div>`}};z.styles=St,C([ee({attribute:!1})],z.prototype,"heading",2),C([ee({attribute:!1})],z.prototype,"body",2),z=C([j("bin-collection-popup")],z);function F(o,e){o.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}var Et=k`
  :host {
    display: block;
    padding: 8px 2px;
    font-family: var(--primary-font-family, sans-serif);
    color: var(--primary-text-color);
  }
  .sect {
    font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em;
    color: var(--secondary-text-color); margin: 18px 0 8px; padding-bottom: 4px;
    border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.08));
  }
  .bins-head { display: flex; align-items: center; justify-content: space-between; margin: 4px 0 8px; }
  .bins-head span { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--secondary-text-color); }
  .add-btn {
    background: var(--primary-color); color: white; border: none; border-radius: 6px;
    padding: 5px 12px; font-size: 12px; cursor: pointer;
  }
  .bin-item {
    background: var(--input-fill-color, rgba(255,255,255,0.03));
    border: 1px solid var(--divider-color, rgba(255,255,255,0.07));
    border-radius: 10px; padding: 12px; margin-bottom: 8px;
  }
  .bin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 4px; }
  .bin-field label { font-size: 11px; color: var(--secondary-text-color); display: block; margin-bottom: 2px; }
  .bin-field input[type=text] {
    width: 100%; background: var(--input-fill-color, rgba(255,255,255,0.05));
    border: 1px solid var(--divider-color, rgba(255,255,255,0.10)); border-radius: 5px;
    color: var(--primary-text-color); padding: 5px 7px; font-size: 11px; box-sizing: border-box;
  }
  .bin-foot { display: flex; justify-content: flex-end; gap: 6px; margin-top: 8px; }
  .del-btn {
    background: rgba(239,83,80,0.15); color: #ef5350;
    border: 1px solid rgba(239,83,80,0.25); border-radius: 5px;
    padding: 4px 12px; font-size: 11px; cursor: pointer;
  }
  .move-btn {
    background: var(--input-fill-color, rgba(255,255,255,0.05));
    border: 1px solid var(--divider-color, rgba(255,255,255,0.10)); border-radius: 5px;
    color: var(--primary-text-color); width: 26px; height: 24px; font-size: 11px; cursor: pointer;
  }
  .move-btn:disabled { opacity: 0.3; cursor: default; }
  .bin-name-row { margin-bottom: 6px; }
  .bin-name-row label { font-size: 11px; color: var(--secondary-text-color); display: block; margin-bottom: 2px; }
  .bin-name-row input {
    width: 100%; background: var(--input-fill-color, rgba(255,255,255,0.05));
    border: 1px solid var(--divider-color, rgba(255,255,255,0.10)); border-radius: 5px;
    color: var(--primary-text-color); padding: 5px 7px; font-size: 11px; box-sizing: border-box;
  }
  .swatch-row { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 2px; }
  .swatch {
    width: 20px; height: 20px; border-radius: 50%; border: 2px solid transparent;
    cursor: pointer; padding: 0;
  }
  .swatch.selected { border-color: var(--primary-text-color, #fff); box-shadow: 0 0 0 1px rgba(255,255,255,0.3); }
`;var oo=[{value:"smart-summary",label:"Smart summary"},{value:"image-grid",label:"Image grid"},{value:"row",label:"Row (single line)"},{value:"timeline",label:"Timeline"},{value:"compact",label:"Compact"}],io=[{value:"off",label:"Off"},{value:"subtle",label:"Subtle (dot)"},{value:"strong",label:"Strong (pill)"}],so=[{value:"days",label:'Days ("in 7 days")'},{value:"date",label:'Date ("Tue 30 Jun")'},{value:"both",label:"Both"}],ro=[{value:"calm",label:"Calm"},{value:"balanced",label:"Balanced"},{value:"rich",label:"Rich"}],no=[{name:"title",selector:{text:{}}},{name:"mode",selector:{select:{mode:"dropdown",options:oo}}},{name:"days_ahead",selector:{number:{min:1,max:60,mode:"box"}}},{name:"show_header",selector:{boolean:{}}},{name:"show_next_summary",selector:{boolean:{}}},{name:"popup",selector:{boolean:{}}},{name:"sort",selector:{boolean:{}}},{name:"show_all_bins",selector:{boolean:{}}},{name:"show_future_bins",selector:{boolean:{}}},{name:"fade_future_bins",selector:{boolean:{}}},{name:"highlight_today",selector:{select:{mode:"dropdown",options:io}}},{name:"secondary_info",selector:{select:{mode:"dropdown",options:so}}},{name:"display_density",selector:{select:{mode:"dropdown",options:ro}}},{name:"today_text",selector:{text:{}}},{name:"tomorrow_text",selector:{text:{}}}],ao={title:"Title",mode:"Mode",days_ahead:"Days ahead",show_header:"Show header",show_next_summary:'Show "Next: \u2026" line',popup:"Tap header to open popup",sort:"Sort bins by soonest",show_all_bins:"Show all bins (ignore days ahead)",show_future_bins:"Show future bins",fade_future_bins:"Fade future bins",highlight_today:"Highlight today/tomorrow",secondary_info:"Secondary info",display_density:"Density",today_text:"Today label",tomorrow_text:"Tomorrow label"},G=class extends _{constructor(){super(...arguments);this._computeLabel=t=>ao[t.name]??t.name}set hass(t){this._hass=t,this.requestUpdate()}get hass(){return this._hass}setConfig(t){this._config=ie(t)}_formChanged(t){t.stopPropagation(),this._config&&(this._config={...this._config,...t.detail.value},F(this,this._config))}_updateBin(t,i,s){if(!this._config)return;let r=[...this._config.bins];r[t]={...r[t],[i]:s},this._config={...this._config,bins:r},F(this,this._config)}_moveBin(t,i){if(!this._config)return;let s=t+i;if(s<0||s>=this._config.bins.length)return;let r=[...this._config.bins];[r[t],r[s]]=[r[s],r[t]],this._config={...this._config,bins:r},F(this,this._config)}_deleteBin(t){if(!this._config)return;let i=[...this._config.bins];i.splice(t,1),this._config={...this._config,bins:i},F(this,this._config)}_addBin(){this._config&&(this._config={...this._config,bins:[...this._config.bins,Ne()]},F(this,this._config))}_renderBin(t,i,s){return p`
      <div class="bin-item">
        <div class="bin-name-row">
          <label>Name</label>
          <input type="text" .value=${t.name||""} @change=${r=>this._updateBin(i,"name",r.target.value)} />
        </div>
        <div class="bin-name-row">
          <label>Entity (sensor)</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${t.entity||""}
            .includeDomains=${["sensor"]}
            @value-changed=${r=>{r.stopPropagation(),this._updateBin(i,"entity",r.detail.value??"")}}
          ></ha-entity-picker>
        </div>
        <div class="bin-grid">
          <div class="bin-field">
            <label>Image</label>
            <ha-selector
              .hass=${this.hass}
              .selector=${{image:{}}}
              .value=${t.image||""}
              @value-changed=${r=>{r.stopPropagation(),this._updateBin(i,"image",r.detail.value??"")}}
            ></ha-selector>
          </div>
          <div class="bin-field">
            <label>Fallback icon</label>
            <ha-icon-picker
              .hass=${this.hass}
              .value=${t.icon||"mdi:delete"}
              @value-changed=${r=>{r.stopPropagation(),this._updateBin(i,"icon",r.detail.value??"mdi:delete")}}
            ></ha-icon-picker>
          </div>
        </div>
        <div class="bin-field" style="margin-top:6px">
          <label>Colour</label>
          <div class="swatch-row">
            ${ct.map(r=>p`
                <button
                  type="button"
                  class="swatch ${(t.color||"").toLowerCase()===r?"selected":""}"
                  style="background:${b(r).accent}"
                  title=${r}
                  @click=${()=>this._updateBin(i,"color",r)}
                ></button>`)}
          </div>
        </div>
        <div class="bin-name-row" style="margin-top:8px">
          <label>Action hint (e.g. "Put out after 7pm")</label>
          <input type="text" .value=${t.action_text||""} @change=${r=>this._updateBin(i,"action_text",r.target.value)} />
        </div>
        <div class="bin-name-row" style="margin-top:4px">
          <label>Notes / instructions</label>
          <input type="text" .value=${t.notes||""} placeholder="e.g. Kerb by 7am" @change=${r=>this._updateBin(i,"notes",r.target.value)} />
        </div>
        <div class="bin-foot">
          <button class="move-btn" ?disabled=${i===0} @click=${()=>this._moveBin(i,-1)}>▲</button>
          <button class="move-btn" ?disabled=${i===s-1} @click=${()=>this._moveBin(i,1)}>▼</button>
          <button class="del-btn" @click=${()=>this._deleteBin(i)}>Remove</button>
        </div>
      </div>`}render(){return this._config?p`
      <div class="sect">Display</div>
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${no}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._formChanged}
      ></ha-form>

      <div class="bins-head">
        <span>Bins</span>
        <button class="add-btn" @click=${()=>this._addBin()}>+ Add bin</button>
      </div>
      ${this._config.bins.map((t,i)=>this._renderBin(t,i,this._config.bins.length))}
    `:f}};G.styles=Et,C([me()],G.prototype,"_config",2),G=C([j("bin-collection-card-editor")],G);var V=class extends _{constructor(){super(...arguments);this._stateHash=null;this._popupEl=null}static getConfigElement(){return document.createElement("bin-collection-card-editor")}static getStubConfig(){return Me()}set hass(t){if(this._hass=t,!this._config)return;let i=it(t,this._config.bins);i!==this._stateHash&&(this._stateHash=i,this.requestUpdate())}get hass(){return this._hass}setConfig(t){this._config=ie(t),this._stateHash=null}getCardSize(){switch(this._config?.mode){case"compact":return 1;case"row":return 2;case void 0:case"smart-summary":return 4;default:return 3}}_resolved(){return this._config?ot(this._hass,this._config):[]}render(){if(!this._config)return f;let t=this._resolved(),i={onBinTap:r=>this._openBinDetail(r),onHeaderTap:()=>this._openPlanner(t)},s;switch(this._config.mode){case"image-grid":s=_t(te(t,this._config),this._config,i);break;case"row":s=$t(te(t,this._config),this._config,i);break;case"timeline":s=wt(te(t,this._config),this._config,i);break;case"compact":s=Ct(te(t,this._config),this._config,i);break;default:s=ut(t,this._config,i)}return p`<ha-card>${s}</ha-card>`}_openPopup(t,i){this._closePopup();let s=document.createElement("bin-collection-popup");return s.heading=t,s.body=i,s.addEventListener("popup-closed",()=>{this._popupEl===s&&(this._popupEl=null)}),document.body.appendChild(s),this._popupEl=s,s}_closePopup(){this._popupEl?.close(),this._popupEl=null}_openPlanner(t){this._config?.popup&&this._openPopup(this._config.title,At(t,this._config))}_openBinDetail(t){if(!this._config)return;let i=this._openPopup(t.name,De(t,this._config,null));st(this._hass,t.entity,4).then(s=>{this._popupEl!==i||!this._config||(i.body=De(t,this._config,s))})}disconnectedCallback(){this._closePopup(),super.disconnectedCallback()}};V.styles=Rt,C([me()],V.prototype,"_config",2),V=C([j(U)],V);window.customCards=window.customCards??[];window.customCards.find(o=>o.type===U)||window.customCards.push({type:U,name:"Bin Collection Card",description:"UK bin/waste collection schedule \u2014 smart-summary, image-grid, row, timeline, compact modes",preview:!0,documentationURL:"https://github.com/andrejkurlovic/lovelace-bin-collection-card"});
