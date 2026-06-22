/* lovelace-bin-collection-card v5.1.1 — https://github.com/andrejkurlovic/lovelace-bin-collection-card */
var Bt=Object.defineProperty;var kt=Object.getOwnPropertyDescriptor;var C=(t,e,o,i)=>{for(var s=i>1?void 0:i?kt(e,o):e,r=t.length-1,n;r>=0;r--)(n=t[r])&&(s=(i?n(e,o,s):n(s))||s);return i&&s&&Bt(e,o,s),s};var U="bin-collection-card",Pt={title:"Bin Collection",mode:"smart-summary",days_ahead:14,show_header:!0,show_next_summary:!0,popup:!0,sort:!0,show_all_bins:!1,show_future_bins:!0,fade_future_bins:!1,highlight_today:"subtle",secondary_info:"days",display_density:"balanced",today_text:"Today",tomorrow_text:"Tomorrow"};function se(t){if(!t.bins||!t.bins.length)throw new Error("bin-collection-card: at least one bin is required");return{type:t.type??`custom:${U}`,...Pt,...t,bins:t.bins}}function Me(){return{name:"New Bin",entity:"",color:"grey",icon:"mdi:delete"}}function Oe(){return{title:"Bin Collection",mode:"smart-summary",days_ahead:14,bins:[{name:"General",entity:"sensor.general_bin_days",image:"/local/images/bin_general.png",color:"grey",icon:"mdi:delete"},{name:"Garden",entity:"sensor.garden_bin_days",image:"/local/images/bin_garden.png",color:"green",icon:"mdi:leaf"},{name:"Plastic",entity:"sensor.plastic_bin_days",image:"/local/images/bin_plastic.png",color:"burgundy",icon:"mdi:recycle"},{name:"Paper",entity:"sensor.paper_bin_days",image:"/local/images/bin_paper.png",color:"beige",icon:"mdi:newspaper-variant"}]}}var re=globalThis,ne=re.ShadowRoot&&(re.ShadyCSS===void 0||re.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,we=Symbol(),Le=new WeakMap,W=class{constructor(e,o,i){if(this._$cssResult$=!0,i!==we)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=o}get styleSheet(){let e=this.o,o=this.t;if(ne&&e===void 0){let i=o!==void 0&&o.length===1;i&&(e=Le.get(o)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Le.set(o,e))}return e}toString(){return this.cssText}},ze=t=>new W(typeof t=="string"?t:t+"",void 0,we),k=(t,...e)=>{let o=t.length===1?t[0]:e.reduce((i,s,r)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[r+1],t[0]);return new W(o,t,we)},Ue=(t,e)=>{if(ne)t.adoptedStyleSheets=e.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(let o of e){let i=document.createElement("style"),s=re.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=o.cssText,t.appendChild(i)}},Ce=ne?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let o="";for(let i of e.cssRules)o+=i.cssText;return ze(o)})(t):t;var{is:Dt,defineProperty:Ht,getOwnPropertyDescriptor:Nt,getOwnPropertyNames:Mt,getOwnPropertySymbols:Ot,getPrototypeOf:Lt}=Object,ae=globalThis,Ie=ae.trustedTypes,zt=Ie?Ie.emptyScript:"",Ut=ae.reactiveElementPolyfillSupport,K=(t,e)=>t,J={toAttribute(t,e){switch(e){case Boolean:t=t?zt:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=t!==null;break;case Number:o=t===null?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch{o=null}}return o}},le=(t,e)=>!Dt(t,e),je={attribute:!0,type:String,converter:J,reflect:!1,useDefault:!1,hasChanged:le};Symbol.metadata??=Symbol("metadata"),ae.litPropertyMetadata??=new WeakMap;var A=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,o=je){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(e,o),!o.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,o);s!==void 0&&Ht(this.prototype,e,s)}}static getPropertyDescriptor(e,o,i){let{get:s,set:r}=Nt(this.prototype,e)??{get(){return this[o]},set(n){this[o]=n}};return{get:s,set(n){let a=s?.call(this);r?.call(this,n),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??je}static _$Ei(){if(this.hasOwnProperty(K("elementProperties")))return;let e=Lt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(K("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(K("properties"))){let o=this.properties,i=[...Mt(o),...Ot(o)];for(let s of i)this.createProperty(s,o[s])}let e=this[Symbol.metadata];if(e!==null){let o=litPropertyMetadata.get(e);if(o!==void 0)for(let[i,s]of o)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[o,i]of this.elementProperties){let s=this._$Eu(o,i);s!==void 0&&this._$Eh.set(s,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let o=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)o.unshift(Ce(s))}else e!==void 0&&o.push(Ce(e));return o}static _$Eu(e,o){let i=o.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,o=this.constructor.elementProperties;for(let i of o.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ue(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,o,i){this._$AK(e,i)}_$ET(e,o){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:J).toAttribute(o,i.type);this._$Em=e,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,o){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let r=i.getPropertyOptions(s),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:J;this._$Em=s;let a=n.fromAttribute(o,r.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(e,o,i,s=!1,r){if(e!==void 0){let n=this.constructor;if(s===!1&&(r=this[e]),i??=n.getPropertyOptions(e),!((i.hasChanged??le)(r,o)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,i))))return;this.C(e,o,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,o,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??o??this[e]),r!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(o=void 0),this._$AL.set(e,o)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,r]of i){let{wrapped:n}=r,a=this[s];n!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,r,a)}}let e=!1,o=this._$AL;try{e=this.shouldUpdate(o),e?(this.willUpdate(o),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(o)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(o)}willUpdate(e){}_$AE(e){this._$EO?.forEach(o=>o.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(o=>this._$ET(o,this[o])),this._$EM()}updated(e){}firstUpdated(e){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[K("elementProperties")]=new Map,A[K("finalized")]=new Map,Ut?.({ReactiveElement:A}),(ae.reactiveElementVersions??=[]).push("2.1.2");var Re=globalThis,qe=t=>t,pe=Re.trustedTypes,Fe=pe?pe.createPolicy("lit-html",{createHTML:t=>t}):void 0,Se="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,Ee="?"+R,It=`<${Ee}>`,H=document,Q=()=>H.createComment(""),X=t=>t===null||typeof t!="object"&&typeof t!="function",Te=Array.isArray,Je=t=>Te(t)||typeof t?.[Symbol.iterator]=="function",Ae=`[ 	
\f\r]`,Z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ge=/-->/g,Ve=/>/g,P=RegExp(`>|${Ae}(?:([^\\s"'>=/]+)(${Ae}*=${Ae}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ye=/'/g,We=/"/g,Ze=/^(?:script|style|textarea|title)$/i,Be=t=>(e,...o)=>({_$litType$:t,strings:e,values:o}),p=Be(1),go=Be(2),yo=Be(3),S=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),Ke=new WeakMap,D=H.createTreeWalker(H,129);function Qe(t,e){if(!Te(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Fe!==void 0?Fe.createHTML(e):e}var Xe=(t,e)=>{let o=t.length-1,i=[],s,r=e===2?"<svg>":e===3?"<math>":"",n=Z;for(let a=0;a<o;a++){let l=t[a],d,u,c=-1,m=0;for(;m<l.length&&(n.lastIndex=m,u=n.exec(l),u!==null);)m=n.lastIndex,n===Z?u[1]==="!--"?n=Ge:u[1]!==void 0?n=Ve:u[2]!==void 0?(Ze.test(u[2])&&(s=RegExp("</"+u[2],"g")),n=P):u[3]!==void 0&&(n=P):n===P?u[0]===">"?(n=s??Z,c=-1):u[1]===void 0?c=-2:(c=n.lastIndex-u[2].length,d=u[1],n=u[3]===void 0?P:u[3]==='"'?We:Ye):n===We||n===Ye?n=P:n===Ge||n===Ve?n=Z:(n=P,s=void 0);let h=n===P&&t[a+1].startsWith("/>")?" ":"";r+=n===Z?l+It:c>=0?(i.push(d),l.slice(0,c)+Se+l.slice(c)+R+h):l+R+(c===-2?a:h)}return[Qe(t,r+(t[o]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},ee=class t{constructor({strings:e,_$litType$:o},i){let s;this.parts=[];let r=0,n=0,a=e.length-1,l=this.parts,[d,u]=Xe(e,o);if(this.el=t.createElement(d,i),D.currentNode=this.el.content,o===2||o===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=D.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let c of s.getAttributeNames())if(c.endsWith(Se)){let m=u[n++],h=s.getAttribute(c).split(R),g=/([.?@])?(.*)/.exec(m);l.push({type:1,index:r,name:g[2],strings:h,ctor:g[1]==="."?ce:g[1]==="?"?ue:g[1]==="@"?he:M}),s.removeAttribute(c)}else c.startsWith(R)&&(l.push({type:6,index:r}),s.removeAttribute(c));if(Ze.test(s.tagName)){let c=s.textContent.split(R),m=c.length-1;if(m>0){s.textContent=pe?pe.emptyScript:"";for(let h=0;h<m;h++)s.append(c[h],Q()),D.nextNode(),l.push({type:2,index:++r});s.append(c[m],Q())}}}else if(s.nodeType===8)if(s.data===Ee)l.push({type:2,index:r});else{let c=-1;for(;(c=s.data.indexOf(R,c+1))!==-1;)l.push({type:7,index:r}),c+=R.length-1}r++}}static createElement(e,o){let i=H.createElement("template");return i.innerHTML=e,i}};function N(t,e,o=t,i){if(e===S)return e;let s=i!==void 0?o._$Co?.[i]:o._$Cl,r=X(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(t),s._$AT(t,o,i)),i!==void 0?(o._$Co??=[])[i]=s:o._$Cl=s),s!==void 0&&(e=N(t,s._$AS(t,e.values),s,i)),e}var de=class{constructor(e,o){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:o},parts:i}=this._$AD,s=(e?.creationScope??H).importNode(o,!0);D.currentNode=s;let r=D.nextNode(),n=0,a=0,l=i[0];for(;l!==void 0;){if(n===l.index){let d;l.type===2?d=new I(r,r.nextSibling,this,e):l.type===1?d=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(d=new me(r,this,e)),this._$AV.push(d),l=i[++a]}n!==l?.index&&(r=D.nextNode(),n++)}return D.currentNode=H,s}p(e){let o=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,o),o+=i.strings.length-2):i._$AI(e[o])),o++}},I=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,o,i,s){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=e,this._$AB=o,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,o=this._$AM;return o!==void 0&&e?.nodeType===11&&(e=o.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,o=this){e=N(this,e,o),X(e)?e===f||e==null||e===""?(this._$AH!==f&&this._$AR(),this._$AH=f):e!==this._$AH&&e!==S&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Je(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==f&&X(this._$AH)?this._$AA.nextSibling.data=e:this.T(H.createTextNode(e)),this._$AH=e}$(e){let{values:o,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=ee.createElement(Qe(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(o);else{let r=new de(s,this),n=r.u(this.options);r.p(o),this.T(n),this._$AH=r}}_$AC(e){let o=Ke.get(e.strings);return o===void 0&&Ke.set(e.strings,o=new ee(e)),o}k(e){Te(this._$AH)||(this._$AH=[],this._$AR());let o=this._$AH,i,s=0;for(let r of e)s===o.length?o.push(i=new t(this.O(Q()),this.O(Q()),this,this.options)):i=o[s],i._$AI(r),s++;s<o.length&&(this._$AR(i&&i._$AB.nextSibling,s),o.length=s)}_$AR(e=this._$AA.nextSibling,o){for(this._$AP?.(!1,!0,o);e!==this._$AB;){let i=qe(e).nextSibling;qe(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,o,i,s,r){this.type=1,this._$AH=f,this._$AN=void 0,this.element=e,this.name=o,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=f}_$AI(e,o=this,i,s){let r=this.strings,n=!1;if(r===void 0)e=N(this,e,o,0),n=!X(e)||e!==this._$AH&&e!==S,n&&(this._$AH=e);else{let a=e,l,d;for(e=r[0],l=0;l<r.length-1;l++)d=N(this,a[i+l],o,l),d===S&&(d=this._$AH[l]),n||=!X(d)||d!==this._$AH[l],d===f?e=f:e!==f&&(e+=(d??"")+r[l+1]),this._$AH[l]=d}n&&!s&&this.j(e)}j(e){e===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ce=class extends M{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===f?void 0:e}},ue=class extends M{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==f)}},he=class extends M{constructor(e,o,i,s,r){super(e,o,i,s,r),this.type=5}_$AI(e,o=this){if((e=N(this,e,o,0)??f)===S)return;let i=this._$AH,s=e===f&&i!==f||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==f&&(i===f||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},me=class{constructor(e,o,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=o,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){N(this,e)}},et={M:Se,P:R,A:Ee,C:1,L:Xe,R:de,D:Je,V:N,I,H:M,N:ue,U:he,B:ce,F:me},jt=Re.litHtmlPolyfillSupport;jt?.(ee,I),(Re.litHtmlVersions??=[]).push("3.3.3");var tt=(t,e,o)=>{let i=o?.renderBefore??e,s=i._$litPart$;if(s===void 0){let r=o?.renderBefore??null;i._$litPart$=s=new I(e.insertBefore(Q(),r),r,void 0,o??{})}return s._$AI(t),s};var ke=globalThis,_=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=tt(o,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};_._$litElement$=!0,_.finalized=!0,ke.litElementHydrateSupport?.({LitElement:_});var qt=ke.litElementPolyfillSupport;qt?.({LitElement:_});(ke.litElementVersions??=[]).push("4.2.2");var j=t=>(e,o)=>{o!==void 0?o.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};var Ft={attribute:!0,type:String,converter:J,reflect:!1,hasChanged:le},Gt=(t=Ft,e,o)=>{let{kind:i,metadata:s}=o,r=globalThis.litPropertyMetadata.get(s);if(r===void 0&&globalThis.litPropertyMetadata.set(s,r=new Map),i==="setter"&&((t=Object.create(t)).wrapped=!0),r.set(o.name,t),i==="accessor"){let{name:n}=o;return{set(a){let l=e.get.call(this);e.set.call(this,a),this.requestUpdate(n,l,t,!0,a)},init(a){return a!==void 0&&this.C(n,void 0,t,a),a}}}if(i==="setter"){let{name:n}=o;return function(a){let l=this[n];e.call(this,a),this.requestUpdate(n,l,t,!0,a)}}throw Error("Unsupported decorator location: "+i)};function te(t){return(e,o)=>typeof o=="object"?Gt(t,e,o):((i,s,r)=>{let n=s.hasOwnProperty(r);return s.constructor.createProperty(r,i),n?Object.getOwnPropertyDescriptor(s,r):void 0})(t,e,o)}function fe(t){return te({...t,state:!0,attribute:!1})}function ot(t){return[...t].sort((e,o)=>e.days==null?1:o.days==null?-1:e.days-o.days)}function oe(t,e){return e.show_all_bins?t:t.filter(o=>o.days==null||o.days<=e.days_ahead)}function ye(t){let e=new Map;for(let o of t){let i=e.get(o.days);i?i.push(o):e.set(o.days,[o])}return[...e.entries()].map(([o,i])=>({days:o,bins:i})).sort((o,i)=>Number(o.days)-Number(i.days))}function Vt(t,e){let o=e&&t.entity?e.states[t.entity]:void 0,i=o?parseInt(o.state,10):NaN,s=o&&!isNaN(i)?i:null,r=o?.attributes??{};return{...t,days:s,nextDate:r.next_collection||null,missing:!o,delayed:r.delayed===!0,changed:r.changed===!0,collectionType:r.collection_type||null,message:r.message||null,delayNote:r.delay_note||null}}function it(t,e){let o=e.bins.map(i=>Vt(i,t));return e.sort?ot(o):o}function st(t,e){return t?e.map(o=>{let i=o.entity?t.states[o.entity]:void 0;if(!i)return"x";let s=i.attributes??{};return[i.state,s.next_collection||"",s.delayed?"1":"0",s.changed?"1":"0",s.collection_type||"",s.message||"",s.delay_note||""].join("|")}).join(","):""}async function rt(t,e,o=4){if(!t||!e||typeof t.callApi!="function")return[];let i=new Date,s=new Date;s.setDate(s.getDate()-180);try{let r=`history/period/${s.toISOString()}?filter_entity_id=${encodeURIComponent(e)}&end_time=${encodeURIComponent(i.toISOString())}&no_attributes`,n=await t.callApi("GET",r),a=Array.isArray(n)&&n[0]?n[0]:[],l=[],d=!1;for(let u of a){let c=u.state==="0";c&&!d&&l.push(u.last_changed),d=c}return l.slice(-o).reverse()}catch{return[]}}function nt(t){return t.days===0?"today":t.days===1?"tomorrow":t.days!=null&&t.days>1&&t.days<=3?"soon":""}var Yt=7;function Pe(t){return Yt}function O(t,e){return e.fade_future_bins&&t.days!=null&&t.days>Pe(e)}function q(t){return t.delayed||t.changed}function at(t){let e=new Date;return e.setDate(e.getDate()+t),e.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}function be(t){if(t===0)return"Today";if(t===1)return"Tomorrow";let e=new Date;return e.setDate(e.getDate()+t),e.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"short"})}function lt(t){if(!t)return null;let e=/^(\d{4})-(\d{2})-(\d{2})/.exec(t);if(!e)return null;let o=new Date(Number(e[1]),Number(e[2])-1,Number(e[3]));return isNaN(o.getTime())?null:o}function xe(t){return t.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}function L(t,e){return t==null||isNaN(t)?"\u2014":t===0?e.today_text:t===1?e.tomorrow_text:t<0?"Missed collection":`in ${t} days`}function Wt(t,e){return t==null||isNaN(t)?"\u2014":t===0?e.today_text:t===1?e.tomorrow_text:t<0?"Missed":`${t} days`}function E(t,e,o){let i=Wt(t.days,o),s=lt(t.nextDate),r=s?xe(s):t.days!=null?at(t.days):"";return e==="date"?r||i:e==="both"&&r?`${i} \u2022 ${r}`:i}function $(t){if(!t.length)return"";if(t.length===1)return t[0].name;if(t.length===2)return`${t[0].name} & ${t[1].name}`;let e=t[t.length-1].name;return`${t.slice(0,-1).map(i=>i.name).join(", ")} & ${e}`}function ie(t){return t.find(e=>e.action_text)?.action_text??null}function pt(t){return t==="calm"?0:t==="rich"?2:1}function dt(t,e){let o=t.filter(y=>y.days===0),i=t.filter(y=>y.days!=null&&y.days<0),s=t.filter(y=>y.days===1),r=t.filter(y=>y.days!=null&&y.days>1),n=r[0]??null,a=n?r.filter(y=>y.days===n.days):[],l=n?r.filter(y=>y.days!==n.days):[],d,u,c,m,h;o.length?(d="today",u="Collection Day",c=`${$(o)} ${o.length>1?"are":"is"} being collected today`,m=ie(o),h=o):i.length?(d="missed",u="Missed Collection",c=`${$(i)} ${i.length>1?"were":"was"} not collected \u2014 check with your council`,m=ie(i),h=i):s.length?(d="tomorrow",u="Prepare Tonight",c=`${$(s)} ${s.length>1?"are":"is"} collected tomorrow`,m=ie(s)||"Put out tonight",h=s):n&&n.days<7?(d="upcoming",u="Next Collection",c=`${$(a)} ${a.length>1?"are":"is"} due ${L(n.days,e)}`,m=ie(a),h=a):n?(d="quiet",u="No Collections This Week",c=`Next known: ${$(a)} ${a.length>1?"are":"is"} due ${L(n.days,e)}`,m=null,h=a):(d="unknown",u="No Data",c="Check your bin sensors",m=null,h=[]);let g=null;(d==="today"||d==="missed"||d==="tomorrow")&&n&&e.show_future_bins&&(g=`Next: ${$(a)} ${L(n.days,e)}`);let v=[];return d==="upcoming"&&e.show_future_bins&&(v=l.slice(0,pt(e.display_density))),{state:d,headerTitle:u,headerSub:c,actionHint:m,mainBins:h,nextLine:g,extraBins:v}}var ct={grey:{bg:"rgba(42,45,49,0.92)",accent:"#9e9e9e",glow:"rgba(158,158,158,0.15)"},gray:{bg:"rgba(42,45,49,0.92)",accent:"#9e9e9e",glow:"rgba(158,158,158,0.15)"},green:{bg:"rgba(30,50,33,0.92)",accent:"#72e906",glow:"rgba(114,233,6,0.12)"},garden:{bg:"rgba(30,50,33,0.92)",accent:"#72e906",glow:"rgba(114,233,6,0.12)"},burgundy:{bg:"rgba(54,28,40,0.92)",accent:"#c04070",glow:"rgba(192,64,112,0.14)"},plastic:{bg:"rgba(54,28,40,0.92)",accent:"#c04070",glow:"rgba(192,64,112,0.14)"},beige:{bg:"rgba(52,48,35,0.92)",accent:"#d4a843",glow:"rgba(212,168,67,0.13)"},paper:{bg:"rgba(52,48,35,0.92)",accent:"#d4a843",glow:"rgba(212,168,67,0.13)"},recycling:{bg:"rgba(52,48,35,0.92)",accent:"#d4a843",glow:"rgba(212,168,67,0.13)"},blue:{bg:"rgba(25,40,65,0.92)",accent:"#4fc3f7",glow:"rgba(79,195,247,0.13)"},brown:{bg:"rgba(50,33,20,0.92)",accent:"#a1887f",glow:"rgba(161,136,127,0.13)"},black:{bg:"rgba(20,20,20,0.92)",accent:"#616161",glow:"rgba(97,97,97,0.13)"},red:{bg:"rgba(60,20,20,0.92)",accent:"#ef5350",glow:"rgba(239,83,80,0.13)"},yellow:{bg:"rgba(55,50,15,0.92)",accent:"#ffee58",glow:"rgba(255,238,88,0.12)"},purple:{bg:"rgba(40,20,55,0.92)",accent:"#ab47bc",glow:"rgba(171,71,188,0.13)"},orange:{bg:"rgba(55,38,15,0.92)",accent:"#ffa726",glow:"rgba(255,167,38,0.13)"},pink:{bg:"rgba(60,25,45,0.92)",accent:"#f48fb1",glow:"rgba(244,143,177,0.12)"},silver:{bg:"rgba(50,52,55,0.92)",accent:"#b0bec5",glow:"rgba(176,190,197,0.12)"},amber:{bg:"rgba(55,44,10,0.92)",accent:"#ffca28",glow:"rgba(255,202,40,0.13)"},teal:{bg:"rgba(15,45,42,0.92)",accent:"#26a69a",glow:"rgba(38,166,154,0.13)"},navy:{bg:"rgba(10,20,50,0.92)",accent:"#3949ab",glow:"rgba(57,73,171,0.14)"},lime:{bg:"rgba(35,50,10,0.92)",accent:"#d4e157",glow:"rgba(212,225,87,0.12)"},white:{bg:"rgba(55,58,62,0.92)",accent:"#eceff1",glow:"rgba(236,239,241,0.10)"},default:{bg:"rgba(38,40,44,0.92)",accent:"#90caf9",glow:"rgba(144,202,249,0.12)"}},ut=["grey","green","burgundy","beige","blue","brown","black","red","yellow","purple","orange","pink","silver","amber","teal","navy","lime","white"];function b(t){return ct[(t??"").toLowerCase()]??ct.default}function w(t,e,o,i=""){let s=`width:${e}px;height:${o}px;object-fit:contain;`,r=`--mdc-icon-size:${Math.round(o*.65)}px;color:rgba(255,255,255,0.8)`;return t.image?p`
    <img
      class=${i}
      src=${t.image}
      alt=${t.name}
      loading="lazy"
      style=${s}
      @error=${n=>{let a=n.target;a.style.display="none";let l=a.nextElementSibling;l&&(l.style.display="flex")}}
    />
    <div class="icon-fallback" style="display:none;width:${e}px;height:${o}px;align-items:center;justify-content:center">
      <ha-icon icon=${t.icon||"mdi:delete"} style=${r}></ha-icon>
    </div>`:p`
      <div class="icon-fallback" style="width:${e}px;height:${o}px;display:flex;align-items:center;justify-content:center">
        <ha-icon icon=${t.icon||"mdi:delete"} style=${r}></ha-icon>
      </div>`}function T(t){return p`
    ${t.delayed?p`<span class="badge badge-delayed">Delayed</span>`:""}
    ${t.changed?p`<span class="badge badge-changed">Changed</span>`:""}
  `}function Kt(t,e){let o=e.highlight_today;if(o==="off"||t.days!==0&&t.days!==1)return"";let i=t.days===0?e.today_text:e.tomorrow_text,s=t.days===0?"today":"tomorrow";return o==="strong"?p`<div class="hl-pill hl-pill-${s}">${i}</div>`:p`<div class="hl-dot hl-dot-${s}"></div>`}function Jt(t,e,o){let i=b(t.color);return p`
    <div class="ss-bin" @click=${()=>o.onBinTap(t)}>
      <div class="ss-bin-inner" style="background:${i.bg}">
        ${w(t,48,66,"ss-img")}
        ${Kt(t,e)}
      </div>
      <div class="ss-bin-name">${t.name}</div>
      ${q(t)?p`<div class="ss-bin-badges">${T(t)}</div>`:""}
    </div>`}function Zt(t,e,o){let i=O(t,e),s=E(t,e.secondary_info,e);return p`
    <div class="ss-chip ${i?"faded":""}" @click=${()=>o.onBinTap(t)}>
      ${w(t,18,24,"chip-img")}
      <span class="chip-name">${t.name}</span>
      <span class="chip-label">${s}</span>
    </div>`}function ht(t,e,o){let i=dt(t,e),s=i.mainBins.length?b(i.mainBins[0].color).glow:"transparent",r=i.mainBins.length?p`
      <div class="ss-main" style="background:linear-gradient(160deg,${s} 0%,transparent 60%)">
        <div class="ss-bin-row">${i.mainBins.map(n=>Jt(n,e,o))}</div>
        ${i.actionHint?p`<div class="ss-action-hint">${i.actionHint}</div>`:""}
      </div>`:p`
      <div class="ss-empty">
        <div class="ss-empty-icon"><ha-icon icon="mdi:check-circle-outline"></ha-icon></div>
        <div class="ss-empty-text">${i.headerSub}</div>
      </div>`;return p`
    ${e.show_header?p`
        <div class="ss-header" @click=${o.onHeaderTap}>
          <div>
            <div class="ss-title">${i.headerTitle}</div>
            <div class="ss-subtitle">${i.mainBins.length?i.headerSub:""}</div>
          </div>
          ${e.popup?p`<div class="tap-hint">▸</div>`:""}
        </div>`:""}
    ${r}
    ${i.nextLine?p`<div class="ss-next-line">${i.nextLine}</div>`:""}
    ${i.extraBins.length?p`<div class="ss-strip">${i.extraBins.map(n=>Zt(n,e,o))}</div>`:""}
  `}var mt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ft=t=>(...e)=>({_$litDirective$:t,values:e}),ve=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,o,i){this._$Ct=e,this._$AM=o,this._$Ci=i}_$AS(e,o){return this.update(e,o)}update(e,o){return this.render(...o)}};var{I:Qt}=et,gt=t=>t;var yt=()=>document.createComment(""),F=(t,e,o)=>{let i=t._$AA.parentNode,s=e===void 0?t._$AB:e._$AA;if(o===void 0){let r=i.insertBefore(yt(),s),n=i.insertBefore(yt(),s);o=new Qt(r,n,t,t.options)}else{let r=o._$AB.nextSibling,n=o._$AM,a=n!==t;if(a){let l;o._$AQ?.(t),o._$AM=t,o._$AP!==void 0&&(l=t._$AU)!==n._$AU&&o._$AP(l)}if(r!==s||a){let l=o._$AA;for(;l!==r;){let d=gt(l).nextSibling;gt(i).insertBefore(l,s),l=d}}}return o},B=(t,e,o=t)=>(t._$AI(e,o),t),Xt={},bt=(t,e=Xt)=>t._$AH=e,xt=t=>t._$AH,_e=t=>{t._$AR(),t._$AA.remove()};var vt=(t,e,o)=>{let i=new Map;for(let s=e;s<=o;s++)i.set(t[s],s);return i},x=ft(class extends ve{constructor(t){if(super(t),t.type!==mt.CHILD)throw Error("repeat() can only be used in text expressions")}dt(t,e,o){let i;o===void 0?o=e:e!==void 0&&(i=e);let s=[],r=[],n=0;for(let a of t)s[n]=i?i(a,n):n,r[n]=o(a,n),n++;return{values:r,keys:s}}render(t,e,o){return this.dt(t,e,o).values}update(t,[e,o,i]){let s=xt(t),{values:r,keys:n}=this.dt(e,o,i);if(!Array.isArray(s))return this.ut=n,r;let a=this.ut??=[],l=[],d,u,c=0,m=s.length-1,h=0,g=r.length-1;for(;c<=m&&h<=g;)if(s[c]===null)c++;else if(s[m]===null)m--;else if(a[c]===n[h])l[h]=B(s[c],r[h]),c++,h++;else if(a[m]===n[g])l[g]=B(s[m],r[g]),m--,g--;else if(a[c]===n[g])l[g]=B(s[c],r[g]),F(t,l[g+1],s[c]),c++,g--;else if(a[m]===n[h])l[h]=B(s[m],r[h]),F(t,s[c],s[m]),m--,h++;else if(d===void 0&&(d=vt(n,h,g),u=vt(a,c,m)),d.has(a[c]))if(d.has(a[m])){let v=u.get(n[h]),y=v!==void 0?s[v]:null;if(y===null){let Ne=F(t,s[c]);B(Ne,r[h]),l[h]=Ne}else l[h]=B(y,r[h]),F(t,s[c],y),s[v]=null;h++}else _e(s[m]),m--;else _e(s[c]),c++;for(;h<=g;){let v=F(t,l[g+1]);B(v,r[h]),l[h++]=v}for(;c<=m;){let v=s[c++];v!==null&&_e(v)}return this.ut=n,bt(t,l),S}});function $e(t,e,o){if(!e.show_header)return"";let i=t.find(r=>r.days!=null)??null,s="";if(e.show_next_summary&&i){let r=t.filter(l=>l.days===i.days),n=E(i,e.secondary_info,e),a=i.days===0?"hl-today":i.days===1?"hl-tomorrow":"";s=p`<div class="header-sub">Next: ${$(r)} — <span class=${a}>${n}</span></div>`}return p`
    <div class="header" @click=${o.onHeaderTap}>
      <div class="header-left">
        <div class="header-title">${e.title}</div>
        ${s}
      </div>
      ${e.popup?p`<div class="tap-hint">▸</div>`:""}
    </div>`}function eo(t,e,o){let i=b(t.color),s=nt(t),r=O(t,e),n=t.missing?"\u2014":E(t,e.secondary_info,e),a=(s==="today"||s==="tomorrow")&&e.highlight_today!=="off";return p`
    <div class="bin-tile ${r?"faded":""}" style="background:${i.bg}" @click=${()=>o.onBinTap(t)}>
      ${a?p`<div class="urg-dot ${s==="today"?"today-dot":"tomorrow-dot"}"></div>`:""}
      <div class="tile-img-wrap">${w(t,38,52,"tile-img")}</div>
      <div class="tile-name">${t.name}</div>
      <div class="tile-label ${s}">${n}</div>
      ${t.missing?p`<div class="tile-warn">no entity</div>`:""}
      ${q(t)?p`<div class="tile-badges">${T(t)}</div>`:""}
      <div class="tile-accent" style="background:${i.accent}"></div>
    </div>`}function _t(t,e,o,i,s){let r=$e(t,e,o);return t.length?p`
    ${r}
    <div class=${i} style=${s??""}>
      ${x(t,n=>n.entity,n=>eo(n,e,o))}
    </div>`:p`${r}<div class="empty-state">No collections due within ${e.days_ahead} days</div>`}function $t(t,e,o){return _t(t,e,o,"grid")}function wt(t,e,o){return _t(t,e,o,"row",t.length?`grid-template-columns: repeat(${t.length}, 1fr)`:void 0)}function to(t,e){let o=b(t.color);return p`
    <div class="tl-chip" style="background:${o.bg}" @click=${()=>e.onBinTap(t)}>
      ${w(t,20,28,"tl-img")}
      <span class="tl-chip-name">${t.name}</span>
      ${q(t)?p`<span class="tl-badges">${T(t)}</span>`:""}
    </div>`}function Ct(t,e,o){let i=$e(t,e,o),s=ye(t);if(e.show_future_bins||(s=s.filter(n=>n.days!=null&&n.days<=1)),!s.length)return p`${i}<div class="empty-state">No collections due soon</div>`;let r=Pe(e);return p`
    ${i}
    <div class="timeline">
      ${x(s,n=>n.days??"null",n=>{let a=n.days,l=a!=null?be(a):"Unknown",d=a===0?"tl-today":a===1?"tl-tomorrow":"",u=e.fade_future_bins&&a!=null&&a>r;return p`
            <div class="tl-row ${u?"faded":""}">
              <div class="tl-date ${d}">${l}</div>
              <div class="tl-bins">${x(n.bins,c=>c.entity,c=>to(c,o))}</div>
            </div>`})}
    </div>`}function oo(t,e){let o=t.filter(s=>s.days===0),i=t.find(s=>s.days!=null)??null;if(o.length)return`${$(o)} today`;if(i){let s=t.filter(r=>r.days===i.days);return`${$(s)} ${L(i.days,e)}`}return"No collections due"}function At(t,e,o){let i=oo(t,e);return p`
    <div class="compact" @click=${o.onHeaderTap}>
      <div class="compact-dots">
        ${x(t,s=>s.entity,s=>p`
            <div
              class="compact-dot ${s.days===0?"today":""} ${O(s,e)?"future":""}"
              style="background:${b(s.color).accent}"
              title="${s.name}: ${L(s.days,e)}"
              @click=${r=>{r.stopPropagation(),o.onBinTap(s)}}
            ></div>`)}
      </div>
      <div class="compact-text">
        <div class="compact-title">${e.title}</div>
        <div class="compact-summary">${i}</div>
      </div>
      ${x(t.slice(0,3),s=>s.entity,s=>p`
          <div
            class="compact-img-wrap ${O(s,e)?"faded":""}"
            @click=${r=>{r.stopPropagation(),o.onBinTap(s)}}
          >${w(s,22,30,"compact-img")}</div>`)}
    </div>`}function De(t,e){let o=b(t.color);return p`
    <div class="popup-bin-card" style="background:${o.bg}">
      ${w(t,32,44,"popup-img")}
      <div class="popup-bin-info">
        <div class="popup-bin-name">${t.name} ${T(t)}</div>
        <div class="popup-bin-date">${e}</div>
        ${t.message?p`<div class="popup-bin-message">${t.message}</div>`:""}
        ${t.delayNote?p`<div class="popup-bin-message">⚠ ${t.delayNote}</div>`:""}
        ${t.collectionType?p`<div class="popup-bin-message">${t.collectionType}</div>`:""}
        ${t.notes?p`<div class="popup-bin-notes">${t.notes}</div>`:""}
        ${t.action_text?p`<div class="popup-bin-action">↗ ${t.action_text}</div>`:""}
      </div>
    </div>`}function Rt(t,e){let o=t.filter(d=>d.days===0),i=t.filter(d=>d.days!=null&&d.days<0),s=t.filter(d=>d.days!=null&&d.days>0),r=ye(s),n=e.secondary_info!=="days"?e.secondary_info:"both",a=o.length||i.length,l=a||r.length;return p`
    ${a?p`
        <div class="popup-section">
          <div class="popup-label">Today</div>
          <div class="popup-today-row">
            ${x(o,d=>d.entity,d=>De(d,E(d,n,e)))}
            ${x(i,d=>d.entity,d=>De(d,"Missed collection"))}
          </div>
        </div>
        ${r.length?p`<div class="popup-divider"></div>`:""}`:""}
    ${r.length?p`
        <div class="popup-section">
          <div class="popup-label">Upcoming</div>
          ${x(r,d=>d.days??"null",d=>p`
              <div class="popup-tl-row">
                <div class="popup-tl-date">${d.days!=null?be(d.days):"Unknown"}</div>
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
  `}function He(t,e,o){let i=t.days!=null?E(t,"both",e):"Unknown";return p`
    <div class="popup-section">
      <div class="popup-label">Next collection</div>
      ${De(t,i)}
    </div>
    <div class="popup-divider"></div>
    <div class="popup-section">
      <div class="popup-label">Past collections</div>
      ${o===null?p`<div class="popup-empty">Checking history…</div>`:o.length===0?p`<div class="popup-empty">No collection history available yet</div>`:p`
            <div class="popup-tl-col">
              ${x(o,s=>s,s=>p`<div class="popup-tl-chip" style="background:${b(t.color).bg}">${xe(new Date(s))}</div>`)}
            </div>`}
    </div>`}var St=k`
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
  .ss-bin { display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .ss-bin-inner {
    position: relative; border-radius: 14px; padding: 12px 14px 10px; display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .ss-bin-name { font-size: 12px; font-weight: 600; color: var(--primary-text-color, #fff); text-align: center; line-height: 1.15; }
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
  .row .bin-tile { padding: 8px 4px 7px; gap: 3px; }
  .row .tile-name { font-size: 11px; }
  .row .tile-label { font-size: 10px; }
  .bin-tile {
    border-radius: 13px; padding: 12px 8px 9px; display: flex; flex-direction: column; align-items: center; gap: 4px;
    cursor: pointer; position: relative; overflow: hidden;
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 1px 5px rgba(0,0,0,0.25);
    -webkit-tap-highlight-color: transparent;
  }
  .tile-img-wrap { position: relative; }
  .tile-name { font-size: 12px; font-weight: 700; color: #fff; text-align: center; line-height: 1.15; }
  .tile-label { font-size: 11px; color: rgba(255,255,255,0.65); text-align: center; line-height: 1.15; }
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
`;var Et=k`
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
`;var z=class extends _{constructor(){super(...arguments);this.heading="";this.body=p``;this._onKeydown=o=>{o.key==="Escape"&&this.close()}}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKeydown)}disconnectedCallback(){document.removeEventListener("keydown",this._onKeydown),super.disconnectedCallback()}close(){this.dispatchEvent(new CustomEvent("popup-closed")),this.remove()}_onBgClick(o){o.target===o.currentTarget&&this.close()}render(){return p`
      <div class="popup-bg" @click=${this._onBgClick}>
        <div class="popup-sheet">
          <div class="popup-drag"></div>
          <div class="popup-head">
            <div class="popup-title">${this.heading}</div>
            <button class="popup-close" @click=${()=>this.close()}>✕</button>
          </div>
          ${this.body}
        </div>
      </div>`}};z.styles=Et,C([te({attribute:!1})],z.prototype,"heading",2),C([te({attribute:!1})],z.prototype,"body",2),z=C([j("bin-collection-popup")],z);function G(t,e){t.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}var Tt=k`
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
`;var io=[{value:"smart-summary",label:"Smart summary"},{value:"image-grid",label:"Image grid"},{value:"row",label:"Row (single line)"},{value:"timeline",label:"Timeline"},{value:"compact",label:"Compact"}],so=[{value:"off",label:"Off"},{value:"subtle",label:"Subtle (dot)"},{value:"strong",label:"Strong (pill)"}],ro=[{value:"days",label:'Days ("in 7 days")'},{value:"date",label:'Date ("Tue 30 Jun")'},{value:"both",label:"Both"}],no=[{value:"calm",label:"Calm"},{value:"balanced",label:"Balanced"},{value:"rich",label:"Rich"}],ao=[{name:"title",selector:{text:{}}},{name:"mode",selector:{select:{mode:"dropdown",options:io}}},{name:"days_ahead",selector:{number:{min:1,max:60,mode:"box"}}},{name:"show_header",selector:{boolean:{}}},{name:"show_next_summary",selector:{boolean:{}}},{name:"popup",selector:{boolean:{}}},{name:"sort",selector:{boolean:{}}},{name:"show_all_bins",selector:{boolean:{}}},{name:"show_future_bins",selector:{boolean:{}}},{name:"fade_future_bins",selector:{boolean:{}}},{name:"highlight_today",selector:{select:{mode:"dropdown",options:so}}},{name:"secondary_info",selector:{select:{mode:"dropdown",options:ro}}},{name:"display_density",selector:{select:{mode:"dropdown",options:no}}},{name:"today_text",selector:{text:{}}},{name:"tomorrow_text",selector:{text:{}}}],lo={title:"Title",mode:"Mode",days_ahead:"Days ahead",show_header:"Show header",show_next_summary:'Show "Next: \u2026" line',popup:"Tap header to open popup",sort:"Sort bins by soonest",show_all_bins:"Show all bins (ignore days ahead)",show_future_bins:"Show future bins",fade_future_bins:"Fade future bins",highlight_today:"Highlight today/tomorrow",secondary_info:"Secondary info",display_density:"Density",today_text:"Today label",tomorrow_text:"Tomorrow label"},V=class extends _{constructor(){super(...arguments);this._computeLabel=o=>lo[o.name]??o.name}set hass(o){this._hass=o,this.requestUpdate()}get hass(){return this._hass}setConfig(o){this._config=se(o)}_formChanged(o){o.stopPropagation(),this._config&&(this._config={...this._config,...o.detail.value},G(this,this._config))}_updateBin(o,i,s){if(!this._config)return;let r=[...this._config.bins];r[o]={...r[o],[i]:s},this._config={...this._config,bins:r},G(this,this._config)}_moveBin(o,i){if(!this._config)return;let s=o+i;if(s<0||s>=this._config.bins.length)return;let r=[...this._config.bins];[r[o],r[s]]=[r[s],r[o]],this._config={...this._config,bins:r},G(this,this._config)}_deleteBin(o){if(!this._config)return;let i=[...this._config.bins];i.splice(o,1),this._config={...this._config,bins:i},G(this,this._config)}_addBin(){this._config&&(this._config={...this._config,bins:[...this._config.bins,Me()]},G(this,this._config))}_renderBin(o,i,s){return p`
      <div class="bin-item">
        <div class="bin-name-row">
          <label>Name</label>
          <input type="text" .value=${o.name||""} @change=${r=>this._updateBin(i,"name",r.target.value)} />
        </div>
        <div class="bin-name-row">
          <label>Entity (sensor)</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${o.entity||""}
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
              .value=${o.image||""}
              @value-changed=${r=>{r.stopPropagation(),this._updateBin(i,"image",r.detail.value??"")}}
            ></ha-selector>
          </div>
          <div class="bin-field">
            <label>Fallback icon</label>
            <ha-icon-picker
              .hass=${this.hass}
              .value=${o.icon||"mdi:delete"}
              @value-changed=${r=>{r.stopPropagation(),this._updateBin(i,"icon",r.detail.value??"mdi:delete")}}
            ></ha-icon-picker>
          </div>
        </div>
        <div class="bin-field" style="margin-top:6px">
          <label>Colour</label>
          <div class="swatch-row">
            ${ut.map(r=>p`
                <button
                  type="button"
                  class="swatch ${(o.color||"").toLowerCase()===r?"selected":""}"
                  style="background:${b(r).accent}"
                  title=${r}
                  @click=${()=>this._updateBin(i,"color",r)}
                ></button>`)}
          </div>
        </div>
        <div class="bin-name-row" style="margin-top:8px">
          <label>Action hint (e.g. "Put out after 7pm")</label>
          <input type="text" .value=${o.action_text||""} @change=${r=>this._updateBin(i,"action_text",r.target.value)} />
        </div>
        <div class="bin-name-row" style="margin-top:4px">
          <label>Notes / instructions</label>
          <input type="text" .value=${o.notes||""} placeholder="e.g. Kerb by 7am" @change=${r=>this._updateBin(i,"notes",r.target.value)} />
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
        .schema=${ao}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._formChanged}
      ></ha-form>

      <div class="bins-head">
        <span>Bins</span>
        <button class="add-btn" @click=${()=>this._addBin()}>+ Add bin</button>
      </div>
      ${this._config.bins.map((o,i)=>this._renderBin(o,i,this._config.bins.length))}
    `:f}};V.styles=Tt,C([fe()],V.prototype,"_config",2),V=C([j("bin-collection-card-editor")],V);var Y=class extends _{constructor(){super(...arguments);this._stateHash=null;this._popupEl=null}static getConfigElement(){return document.createElement("bin-collection-card-editor")}static getStubConfig(){return Oe()}set hass(o){if(this._hass=o,!this._config)return;let i=st(o,this._config.bins);i!==this._stateHash&&(this._stateHash=i,this.requestUpdate())}get hass(){return this._hass}setConfig(o){this._config=se(o),this._stateHash=null}getCardSize(){switch(this._config?.mode){case"compact":return 1;case"row":return 2;case void 0:case"smart-summary":return 4;default:return 3}}_resolved(){return this._config?it(this._hass,this._config):[]}render(){if(!this._config)return f;let o=this._resolved(),i={onBinTap:r=>this._openBinDetail(r),onHeaderTap:()=>this._openPlanner(o)},s;switch(this._config.mode){case"image-grid":s=$t(oe(o,this._config),this._config,i);break;case"row":s=wt(oe(o,this._config),this._config,i);break;case"timeline":s=Ct(oe(o,this._config),this._config,i);break;case"compact":s=At(oe(o,this._config),this._config,i);break;default:s=ht(o,this._config,i)}return p`<ha-card>${s}</ha-card>`}_openPopup(o,i){this._closePopup();let s=document.createElement("bin-collection-popup");return s.heading=o,s.body=i,s.addEventListener("popup-closed",()=>{this._popupEl===s&&(this._popupEl=null)}),document.body.appendChild(s),this._popupEl=s,s}_closePopup(){this._popupEl?.close(),this._popupEl=null}_openPlanner(o){this._config?.popup&&this._openPopup(this._config.title,Rt(o,this._config))}_openBinDetail(o){if(!this._config)return;let i=this._openPopup(o.name,He(o,this._config,null));rt(this._hass,o.entity,4).then(s=>{this._popupEl!==i||!this._config||(i.body=He(o,this._config,s))})}disconnectedCallback(){this._closePopup(),super.disconnectedCallback()}};Y.styles=St,C([fe()],Y.prototype,"_config",2),Y=C([j(U)],Y);window.customCards=window.customCards??[];window.customCards.find(t=>t.type===U)||window.customCards.push({type:U,name:"Bin Collection Card",description:"UK bin/waste collection schedule \u2014 smart-summary, image-grid, row, timeline, compact modes",preview:!0,documentationURL:"https://github.com/andrejkurlovic/lovelace-bin-collection-card"});
