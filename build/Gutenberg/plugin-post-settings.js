(()=>{var e={2694:(e,t,r)=>{"use strict";var n=r(6925);function o(){}function s(){}s.resetWarningCache=o,e.exports=function(){function e(e,t,r,o,s,i){if(i!==n){var a=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw a.name="Invariant Violation",a}}function t(){return e}e.isRequired=e;var r={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:s,resetWarningCache:o};return r.PropTypes=r,r}},5556:(e,t,r)=>{e.exports=r(2694)()},6925:e=>{"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},2833:e=>{e.exports=function(e,t,r,n){var o=r?r.call(n,e,t):void 0;if(void 0!==o)return!!o;if(e===t)return!0;if("object"!=typeof e||!e||"object"!=typeof t||!t)return!1;var s=Object.keys(e),i=Object.keys(t);if(s.length!==i.length)return!1;for(var a=Object.prototype.hasOwnProperty.bind(t),c=0;c<s.length;c++){var u=s[c];if(!a(u))return!1;var l=e[u],p=t[u];if(!1===(o=r?r.call(n,l,p,u):void 0)||void 0===o&&l!==p)return!1}return!0}}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var s=t[n]={exports:{}};return e[n](s,s.exports,r),s.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.nc=void 0,(()=>{"use strict";const e=window.React;var t=r.n(e);const n=window.wp.plugins,o=window.wp.editPost,s=window.wp.data,i=window.wp.editor,a=window.wp.components,c=window.wp.i18n,u=window.wp.url,l=window.wp.apiFetch;var p=r.n(l);const f={counts:{followers:null,subscribers:null},isEmailRequired:null},h={setCounts:e=>({type:"SET_COUNTS",payload:{data:e}}),fetchFromAPI:e=>({type:"FETCH_FROM_API",payload:{path:e}})},d=(0,s.createReduxStore)("ccvtr/post-settings",{reducer(e=f,t){if("SET_COUNTS"===t.type){const{is_email_required:r,subscribers:n,followers:o}=t.payload.data;return{...e,counts:{subscribers:n,followers:o},isEmailRequired:r}}return e},actions:h,selectors:{getCounts:e=>e},controls:{FETCH_FROM_API:e=>p()({path:e.payload.path})},resolvers:{*getCounts(e){const t="/ccvtr/v1/post-settings/"+e,r=yield h.fetchFromAPI(t);return h.setCounts(r)}}});(0,s.register)(d);const{internalAdminBaseUrl:m,adminBaseUrl:g,assetsUrl:y=""}=window.ccData,v=`${m}?page=comment-converter-followers`,b=`${g}options-discussion.php`;window.wp.element;var w=r(5556),S=r.n(w);const O=(e,t)=>{const r={};return e&&(r["aria-hidden"]="true"),""!==t&&(r["aria-label"]=t),r};function C(t){const{ariaHidden:r=!0,ariaLabel:n="",height:o=30,width:s=30,...i}=t;return(0,e.createElement)("svg",{height:o,version:"1.1",width:s,xmlns:"http://www.w3.org/2000/svg",...O(r,n),...i})}C.propTypes={ariaHidden:S().bool,ariaLabel:S().string,children:S().node.isRequired,height:S().oneOfType([S().string,S().number]),viewBox:S().string.isRequired,width:S().oneOfType([S().string,S().number])};const _=C;function R(t){const{fill:r="transparent",stroke:n="currentColor",...o}=t;return(0,e.createElement)(_,{...o,viewBox:"0 0 12 13"},(0,e.createElement)("path",{d:"M0.5 10.1473C0.5 9.18832 1.2682 8.37209 2.47419 7.76396C3.65557 7.16825 5.07863 6.87109 6 6.87109C6.92137 6.87109 8.34443 7.16825 9.52581 7.76396C10.7318 8.37209 11.5 9.18832 11.5 10.1473V11.0914C11.5 11.2453 11.4495 11.37 11.3882 11.4471C11.3273 11.5238 11.2745 11.5354 11.25 11.5354H0.75C0.725522 11.5354 0.672736 11.5238 0.611806 11.4471C0.55053 11.37 0.5 11.2453 0.5 11.0914V10.1473Z",fill:r,stroke:n}),(0,e.createElement)("path",{d:"M6 7.22266C7.6575 7.22266 9 5.88016 9 4.22266C9 2.56516 7.6575 1.22266 6 1.22266C4.3425 1.22266 3 2.56516 3 4.22266C3 5.88016 4.3425 7.22266 6 7.22266Z",fill:r,stroke:n}))}S().bool,S().string,S().string,S().string,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]),S().bool,S().string,S().string,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]),S().bool,S().string,S().string,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]),S().bool,S().string,S().string,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]),S().bool,S().string,S().string,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]),S().bool,S().string,S().string,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]),S().bool,S().string,S().string,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]),S().bool,S().string,S().string,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]),S().bool,S().string,S().string,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]),S().bool,S().string,S().string,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]),S().bool,S().string,S().string,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]),S().bool,S().string,S().oneOf(["white","orange"]).isRequired,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]),S().bool,S().string,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]),R.propTypes={ariaHidden:S().bool,ariaLabel:S().string,fill:S().string,height:S().oneOfType([S().string,S().number]),width:S().oneOfType([S().string,S().number])},S().bool,S().string,S().string,S().string,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]),S().bool,S().string,S().string,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]),S().bool,S().string,S().string,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]),S().bool,S().string,S().string,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]),S().bool,S().string,S().string,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]),S().bool,S().string,S().string,S().oneOfType([S().string,S().number]),S().oneOfType([S().string,S().number]);var T=function(){return T=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},T.apply(this,arguments)};function E(e,t,r){if(r||2===arguments.length)for(var n,o=0,s=t.length;o<s;o++)!n&&o in t||(n||(n=Array.prototype.slice.call(t,0,o)),n[o]=t[o]);return e.concat(n||Array.prototype.slice.call(t))}Object.create,Object.create,"function"==typeof SuppressedError&&SuppressedError;var A=r(2833),I=r.n(A),P="-ms-",x="-moz-",N="-webkit-",k="comm",L="rule",D="decl",$="@import",M="@keyframes",j="@layer",G=Math.abs,F=String.fromCharCode,W=Object.assign;function B(e){return e.trim()}function U(e,t){return(e=t.exec(e))?e[0]:e}function z(e,t,r){return e.replace(t,r)}function V(e,t){return e.indexOf(t)}function Y(e,t){return 0|e.charCodeAt(t)}function H(e,t,r){return e.slice(t,r)}function q(e){return e.length}function K(e){return e.length}function Z(e,t){return t.push(e),e}function Q(e,t){return e.filter((function(e){return!U(e,t)}))}var J=1,X=1,ee=0,te=0,re=0,ne="";function oe(e,t,r,n,o,s,i,a){return{value:e,root:t,parent:r,type:n,props:o,children:s,line:J,column:X,length:i,return:"",siblings:a}}function se(e,t){return W(oe("",null,null,"",null,null,0,e.siblings),e,{length:-e.length},t)}function ie(e){for(;e.root;)e=se(e.root,{children:[e]});Z(e,e.siblings)}function ae(){return re=te>0?Y(ne,--te):0,X--,10===re&&(X=1,J--),re}function ce(){return re=te<ee?Y(ne,te++):0,X++,10===re&&(X=1,J++),re}function ue(){return Y(ne,te)}function le(){return te}function pe(e,t){return H(ne,e,t)}function fe(e){switch(e){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function he(e){return B(pe(te-1,ge(91===e?e+2:40===e?e+1:e)))}function de(e){for(;(re=ue())&&re<33;)ce();return fe(e)>2||fe(re)>3?"":" "}function me(e,t){for(;--t&&ce()&&!(re<48||re>102||re>57&&re<65||re>70&&re<97););return pe(e,le()+(t<6&&32==ue()&&32==ce()))}function ge(e){for(;ce();)switch(re){case e:return te;case 34:case 39:34!==e&&39!==e&&ge(re);break;case 40:41===e&&ge(e);break;case 92:ce()}return te}function ye(e,t){for(;ce()&&e+re!==57&&(e+re!==84||47!==ue()););return"/*"+pe(t,te-1)+"*"+F(47===e?e:ce())}function ve(e){for(;!fe(ue());)ce();return pe(e,te)}function be(e,t){for(var r="",n=0;n<e.length;n++)r+=t(e[n],n,e,t)||"";return r}function we(e,t,r,n){switch(e.type){case j:if(e.children.length)break;case $:case D:return e.return=e.return||e.value;case k:return"";case M:return e.return=e.value+"{"+be(e.children,n)+"}";case L:if(!q(e.value=e.props.join(",")))return""}return q(r=be(e.children,n))?e.return=e.value+"{"+r+"}":""}function Se(e,t,r){switch(function(e,t){return 45^Y(e,0)?(((t<<2^Y(e,0))<<2^Y(e,1))<<2^Y(e,2))<<2^Y(e,3):0}(e,t)){case 5103:return N+"print-"+e+e;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 6391:case 5879:case 5623:case 6135:case 4599:case 4855:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:return N+e+e;case 4789:return x+e+e;case 5349:case 4246:case 4810:case 6968:case 2756:return N+e+x+e+P+e+e;case 5936:switch(Y(e,t+11)){case 114:return N+e+P+z(e,/[svh]\w+-[tblr]{2}/,"tb")+e;case 108:return N+e+P+z(e,/[svh]\w+-[tblr]{2}/,"tb-rl")+e;case 45:return N+e+P+z(e,/[svh]\w+-[tblr]{2}/,"lr")+e}case 6828:case 4268:case 2903:return N+e+P+e+e;case 6165:return N+e+P+"flex-"+e+e;case 5187:return N+e+z(e,/(\w+).+(:[^]+)/,N+"box-$1$2"+P+"flex-$1$2")+e;case 5443:return N+e+P+"flex-item-"+z(e,/flex-|-self/g,"")+(U(e,/flex-|baseline/)?"":P+"grid-row-"+z(e,/flex-|-self/g,""))+e;case 4675:return N+e+P+"flex-line-pack"+z(e,/align-content|flex-|-self/g,"")+e;case 5548:return N+e+P+z(e,"shrink","negative")+e;case 5292:return N+e+P+z(e,"basis","preferred-size")+e;case 6060:return N+"box-"+z(e,"-grow","")+N+e+P+z(e,"grow","positive")+e;case 4554:return N+z(e,/([^-])(transform)/g,"$1"+N+"$2")+e;case 6187:return z(z(z(e,/(zoom-|grab)/,N+"$1"),/(image-set)/,N+"$1"),e,"")+e;case 5495:case 3959:return z(e,/(image-set\([^]*)/,N+"$1$`$1");case 4968:return z(z(e,/(.+:)(flex-)?(.*)/,N+"box-pack:$3"+P+"flex-pack:$3"),/s.+-b[^;]+/,"justify")+N+e+e;case 4200:if(!U(e,/flex-|baseline/))return P+"grid-column-align"+H(e,t)+e;break;case 2592:case 3360:return P+z(e,"template-","")+e;case 4384:case 3616:return r&&r.some((function(e,r){return t=r,U(e.props,/grid-\w+-end/)}))?~V(e+(r=r[t].value),"span")?e:P+z(e,"-start","")+e+P+"grid-row-span:"+(~V(r,"span")?U(r,/\d+/):+U(r,/\d+/)-+U(e,/\d+/))+";":P+z(e,"-start","")+e;case 4896:case 4128:return r&&r.some((function(e){return U(e.props,/grid-\w+-start/)}))?e:P+z(z(e,"-end","-span"),"span ","")+e;case 4095:case 3583:case 4068:case 2532:return z(e,/(.+)-inline(.+)/,N+"$1$2")+e;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(q(e)-1-t>6)switch(Y(e,t+1)){case 109:if(45!==Y(e,t+4))break;case 102:return z(e,/(.+:)(.+)-([^]+)/,"$1"+N+"$2-$3$1"+x+(108==Y(e,t+3)?"$3":"$2-$3"))+e;case 115:return~V(e,"stretch")?Se(z(e,"stretch","fill-available"),t,r)+e:e}break;case 5152:case 5920:return z(e,/(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/,(function(t,r,n,o,s,i,a){return P+r+":"+n+a+(o?P+r+"-span:"+(s?i:+i-+n)+a:"")+e}));case 4949:if(121===Y(e,t+6))return z(e,":",":"+N)+e;break;case 6444:switch(Y(e,45===Y(e,14)?18:11)){case 120:return z(e,/(.+:)([^;\s!]+)(;|(\s+)?!.+)?/,"$1"+N+(45===Y(e,14)?"inline-":"")+"box$3$1"+N+"$2$3$1"+P+"$2box$3")+e;case 100:return z(e,":",":"+P)+e}break;case 5719:case 2647:case 2135:case 3927:case 2391:return z(e,"scroll-","scroll-snap-")+e}return e}function Oe(e,t,r,n){if(e.length>-1&&!e.return)switch(e.type){case D:return void(e.return=Se(e.value,e.length,r));case M:return be([se(e,{value:z(e.value,"@","@"+N)})],n);case L:if(e.length)return function(e,t){return e.map(t).join("")}(r=e.props,(function(t){switch(U(t,n=/(::plac\w+|:read-\w+)/)){case":read-only":case":read-write":ie(se(e,{props:[z(t,/:(read-\w+)/,":"+x+"$1")]})),ie(se(e,{props:[t]})),W(e,{props:Q(r,n)});break;case"::placeholder":ie(se(e,{props:[z(t,/:(plac\w+)/,":"+N+"input-$1")]})),ie(se(e,{props:[z(t,/:(plac\w+)/,":"+x+"$1")]})),ie(se(e,{props:[z(t,/:(plac\w+)/,P+"input-$1")]})),ie(se(e,{props:[t]})),W(e,{props:Q(r,n)})}return""}))}}function Ce(e){return function(e){return ne="",e}(_e("",null,null,null,[""],e=function(e){return J=X=1,ee=q(ne=e),te=0,[]}(e),0,[0],e))}function _e(e,t,r,n,o,s,i,a,c){for(var u=0,l=0,p=i,f=0,h=0,d=0,m=1,g=1,y=1,v=0,b="",w=o,S=s,O=n,C=b;g;)switch(d=v,v=ce()){case 40:if(108!=d&&58==Y(C,p-1)){-1!=V(C+=z(he(v),"&","&\f"),"&\f")&&(y=-1);break}case 34:case 39:case 91:C+=he(v);break;case 9:case 10:case 13:case 32:C+=de(d);break;case 92:C+=me(le()-1,7);continue;case 47:switch(ue()){case 42:case 47:Z(Te(ye(ce(),le()),t,r,c),c);break;default:C+="/"}break;case 123*m:a[u++]=q(C)*y;case 125*m:case 59:case 0:switch(v){case 0:case 125:g=0;case 59+l:-1==y&&(C=z(C,/\f/g,"")),h>0&&q(C)-p&&Z(h>32?Ee(C+";",n,r,p-1,c):Ee(z(C," ","")+";",n,r,p-2,c),c);break;case 59:C+=";";default:if(Z(O=Re(C,t,r,u,l,o,a,b,w=[],S=[],p,s),s),123===v)if(0===l)_e(C,t,O,O,w,s,p,a,S);else switch(99===f&&110===Y(C,3)?100:f){case 100:case 108:case 109:case 115:_e(e,O,O,n&&Z(Re(e,O,O,0,0,o,a,b,o,w=[],p,S),S),o,S,p,a,n?w:S);break;default:_e(C,O,O,O,[""],S,0,a,S)}}u=l=h=0,m=y=1,b=C="",p=i;break;case 58:p=1+q(C),h=d;default:if(m<1)if(123==v)--m;else if(125==v&&0==m++&&125==ae())continue;switch(C+=F(v),v*m){case 38:y=l>0?1:(C+="\f",-1);break;case 44:a[u++]=(q(C)-1)*y,y=1;break;case 64:45===ue()&&(C+=he(ce())),f=ue(),l=p=q(b=C+=ve(le())),v++;break;case 45:45===d&&2==q(C)&&(m=0)}}return s}function Re(e,t,r,n,o,s,i,a,c,u,l,p){for(var f=o-1,h=0===o?s:[""],d=K(h),m=0,g=0,y=0;m<n;++m)for(var v=0,b=H(e,f+1,f=G(g=i[m])),w=e;v<d;++v)(w=B(g>0?h[v]+" "+b:z(b,/&\f/g,h[v])))&&(c[y++]=w);return oe(e,t,r,0===o?L:a,c,u,l,p)}function Te(e,t,r,n){return oe(e,t,r,k,F(re),H(e,2,-2),0,n)}function Ee(e,t,r,n,o){return oe(e,t,r,D,H(e,0,n),H(e,n+1,-1),n,o)}var Ae={animationIterationCount:1,aspectRatio:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1},Ie=void 0!=={LOCAL_WORDPRESS_DOMAIN:"https://comment-converter-plugin.test",CCVTR_MARKETING_URL:"https://commentconverter.com"}&&({LOCAL_WORDPRESS_DOMAIN:"https://comment-converter-plugin.test",CCVTR_MARKETING_URL:"https://commentconverter.com"}.REACT_APP_SC_ATTR||{LOCAL_WORDPRESS_DOMAIN:"https://comment-converter-plugin.test",CCVTR_MARKETING_URL:"https://commentconverter.com"}.SC_ATTR)||"data-styled",Pe="undefined"!=typeof window&&"HTMLElement"in window,xe=Boolean("boolean"==typeof SC_DISABLE_SPEEDY?SC_DISABLE_SPEEDY:void 0!=={LOCAL_WORDPRESS_DOMAIN:"https://comment-converter-plugin.test",CCVTR_MARKETING_URL:"https://commentconverter.com"}&&void 0!=={LOCAL_WORDPRESS_DOMAIN:"https://comment-converter-plugin.test",CCVTR_MARKETING_URL:"https://commentconverter.com"}.REACT_APP_SC_DISABLE_SPEEDY&&""!=={LOCAL_WORDPRESS_DOMAIN:"https://comment-converter-plugin.test",CCVTR_MARKETING_URL:"https://commentconverter.com"}.REACT_APP_SC_DISABLE_SPEEDY?"false"!=={LOCAL_WORDPRESS_DOMAIN:"https://comment-converter-plugin.test",CCVTR_MARKETING_URL:"https://commentconverter.com"}.REACT_APP_SC_DISABLE_SPEEDY&&{LOCAL_WORDPRESS_DOMAIN:"https://comment-converter-plugin.test",CCVTR_MARKETING_URL:"https://commentconverter.com"}.REACT_APP_SC_DISABLE_SPEEDY:void 0!=={LOCAL_WORDPRESS_DOMAIN:"https://comment-converter-plugin.test",CCVTR_MARKETING_URL:"https://commentconverter.com"}&&void 0!=={LOCAL_WORDPRESS_DOMAIN:"https://comment-converter-plugin.test",CCVTR_MARKETING_URL:"https://commentconverter.com"}.SC_DISABLE_SPEEDY&&""!=={LOCAL_WORDPRESS_DOMAIN:"https://comment-converter-plugin.test",CCVTR_MARKETING_URL:"https://commentconverter.com"}.SC_DISABLE_SPEEDY&&"false"!=={LOCAL_WORDPRESS_DOMAIN:"https://comment-converter-plugin.test",CCVTR_MARKETING_URL:"https://commentconverter.com"}.SC_DISABLE_SPEEDY&&{LOCAL_WORDPRESS_DOMAIN:"https://comment-converter-plugin.test",CCVTR_MARKETING_URL:"https://commentconverter.com"}.SC_DISABLE_SPEEDY),Ne=(new Set,Object.freeze([])),ke=Object.freeze({});var Le=new Set(["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","track","u","ul","use","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","marker","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","tspan"]),De=/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,$e=/(^-|-$)/g;function Me(e){return e.replace(De,"-").replace($e,"")}var je=/(a)(d)/gi,Ge=function(e){return String.fromCharCode(e+(e>25?39:97))};function Fe(e){var t,r="";for(t=Math.abs(e);t>52;t=t/52|0)r=Ge(t%52)+r;return(Ge(t%52)+r).replace(je,"$1-$2")}var We,Be=function(e,t){for(var r=t.length;r;)e=33*e^t.charCodeAt(--r);return e},Ue=function(e){return Be(5381,e)};function ze(e){return"string"==typeof e&&!0}var Ve="function"==typeof Symbol&&Symbol.for,Ye=Ve?Symbol.for("react.memo"):60115,He=Ve?Symbol.for("react.forward_ref"):60112,qe={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},Ke={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},Ze={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},Qe=((We={})[He]={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},We[Ye]=Ze,We);function Je(e){return("type"in(t=e)&&t.type.$$typeof)===Ye?Ze:"$$typeof"in e?Qe[e.$$typeof]:qe;var t}var Xe=Object.defineProperty,et=Object.getOwnPropertyNames,tt=Object.getOwnPropertySymbols,rt=Object.getOwnPropertyDescriptor,nt=Object.getPrototypeOf,ot=Object.prototype;function st(e,t,r){if("string"!=typeof t){if(ot){var n=nt(t);n&&n!==ot&&st(e,n,r)}var o=et(t);tt&&(o=o.concat(tt(t)));for(var s=Je(e),i=Je(t),a=0;a<o.length;++a){var c=o[a];if(!(c in Ke||r&&r[c]||i&&c in i||s&&c in s)){var u=rt(t,c);try{Xe(e,c,u)}catch(e){}}}}return e}function it(e){return"function"==typeof e}function at(e){return"object"==typeof e&&"styledComponentId"in e}function ct(e,t){return e&&t?"".concat(e," ").concat(t):e||t||""}function ut(e,t){if(0===e.length)return"";for(var r=e[0],n=1;n<e.length;n++)r+=t?t+e[n]:e[n];return r}function lt(e){return null!==e&&"object"==typeof e&&e.constructor.name===Object.name&&!("props"in e&&e.$$typeof)}function pt(e,t,r){if(void 0===r&&(r=!1),!r&&!lt(e)&&!Array.isArray(e))return t;if(Array.isArray(t))for(var n=0;n<t.length;n++)e[n]=pt(e[n],t[n]);else if(lt(t))for(var n in t)e[n]=pt(e[n],t[n]);return e}function ft(e,t){Object.defineProperty(e,"toString",{value:t})}function ht(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];return new Error("An error occurred. See https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/errors.md#".concat(e," for more information.").concat(t.length>0?" Args: ".concat(t.join(", ")):""))}var dt=function(){function e(e){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=e}return e.prototype.indexOfGroup=function(e){for(var t=0,r=0;r<e;r++)t+=this.groupSizes[r];return t},e.prototype.insertRules=function(e,t){if(e>=this.groupSizes.length){for(var r=this.groupSizes,n=r.length,o=n;e>=o;)if((o<<=1)<0)throw ht(16,"".concat(e));this.groupSizes=new Uint32Array(o),this.groupSizes.set(r),this.length=o;for(var s=n;s<o;s++)this.groupSizes[s]=0}for(var i=this.indexOfGroup(e+1),a=(s=0,t.length);s<a;s++)this.tag.insertRule(i,t[s])&&(this.groupSizes[e]++,i++)},e.prototype.clearGroup=function(e){if(e<this.length){var t=this.groupSizes[e],r=this.indexOfGroup(e),n=r+t;this.groupSizes[e]=0;for(var o=r;o<n;o++)this.tag.deleteRule(r)}},e.prototype.getGroup=function(e){var t="";if(e>=this.length||0===this.groupSizes[e])return t;for(var r=this.groupSizes[e],n=this.indexOfGroup(e),o=n+r,s=n;s<o;s++)t+="".concat(this.tag.getRule(s)).concat("/*!sc*/\n");return t},e}(),mt=new Map,gt=new Map,yt=1,vt=function(e){if(mt.has(e))return mt.get(e);for(;gt.has(yt);)yt++;var t=yt++;return mt.set(e,t),gt.set(t,e),t},bt=function(e,t){mt.set(e,t),gt.set(t,e)},wt="style[".concat(Ie,"][").concat("data-styled-version",'="').concat("6.0.7",'"]'),St=new RegExp("^".concat(Ie,'\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)')),Ot=function(e,t,r){for(var n,o=r.split(","),s=0,i=o.length;s<i;s++)(n=o[s])&&e.registerName(t,n)},Ct=function(e,t){for(var r,n=(null!==(r=t.textContent)&&void 0!==r?r:"").split("/*!sc*/\n"),o=[],s=0,i=n.length;s<i;s++){var a=n[s].trim();if(a){var c=a.match(St);if(c){var u=0|parseInt(c[1],10),l=c[2];0!==u&&(bt(l,u),Ot(e,l,c[3]),e.getTag().insertRules(u,o)),o.length=0}else o.push(a)}}};function _t(){return r.nc}var Rt=function(e){var t=document.head,r=e||t,n=document.createElement("style"),o=function(e){var t=Array.from(e.querySelectorAll("style[".concat(Ie,"]")));return t[t.length-1]}(r),s=void 0!==o?o.nextSibling:null;n.setAttribute(Ie,"active"),n.setAttribute("data-styled-version","6.0.7");var i=_t();return i&&n.setAttribute("nonce",i),r.insertBefore(n,s),n},Tt=function(){function e(e){this.element=Rt(e),this.element.appendChild(document.createTextNode("")),this.sheet=function(e){if(e.sheet)return e.sheet;for(var t=document.styleSheets,r=0,n=t.length;r<n;r++){var o=t[r];if(o.ownerNode===e)return o}throw ht(17)}(this.element),this.length=0}return e.prototype.insertRule=function(e,t){try{return this.sheet.insertRule(t,e),this.length++,!0}catch(e){return!1}},e.prototype.deleteRule=function(e){this.sheet.deleteRule(e),this.length--},e.prototype.getRule=function(e){var t=this.sheet.cssRules[e];return t&&t.cssText?t.cssText:""},e}(),Et=function(){function e(e){this.element=Rt(e),this.nodes=this.element.childNodes,this.length=0}return e.prototype.insertRule=function(e,t){if(e<=this.length&&e>=0){var r=document.createTextNode(t);return this.element.insertBefore(r,this.nodes[e]||null),this.length++,!0}return!1},e.prototype.deleteRule=function(e){this.element.removeChild(this.nodes[e]),this.length--},e.prototype.getRule=function(e){return e<this.length?this.nodes[e].textContent:""},e}(),At=function(){function e(e){this.rules=[],this.length=0}return e.prototype.insertRule=function(e,t){return e<=this.length&&(this.rules.splice(e,0,t),this.length++,!0)},e.prototype.deleteRule=function(e){this.rules.splice(e,1),this.length--},e.prototype.getRule=function(e){return e<this.length?this.rules[e]:""},e}(),It=Pe,Pt={isServer:!Pe,useCSSOMInjection:!xe},xt=function(){function e(e,t,r){void 0===e&&(e=ke),void 0===t&&(t={});var n=this;this.options=T(T({},Pt),e),this.gs=t,this.names=new Map(r),this.server=!!e.isServer,!this.server&&Pe&&It&&(It=!1,function(e){for(var t=document.querySelectorAll(wt),r=0,n=t.length;r<n;r++){var o=t[r];o&&"active"!==o.getAttribute(Ie)&&(Ct(e,o),o.parentNode&&o.parentNode.removeChild(o))}}(this)),ft(this,(function(){return function(e){for(var t=e.getTag(),r=t.length,n="",o=function(r){var o=function(e){return gt.get(e)}(r);if(void 0===o)return"continue";var s=e.names.get(o),i=t.getGroup(r);if(void 0===s||0===i.length)return"continue";var a="".concat(Ie,".g").concat(r,'[id="').concat(o,'"]'),c="";void 0!==s&&s.forEach((function(e){e.length>0&&(c+="".concat(e,","))})),n+="".concat(i).concat(a,'{content:"').concat(c,'"}').concat("/*!sc*/\n")},s=0;s<r;s++)o(s);return n}(n)}))}return e.registerId=function(e){return vt(e)},e.prototype.reconstructWithOptions=function(t,r){return void 0===r&&(r=!0),new e(T(T({},this.options),t),this.gs,r&&this.names||void 0)},e.prototype.allocateGSInstance=function(e){return this.gs[e]=(this.gs[e]||0)+1},e.prototype.getTag=function(){return this.tag||(this.tag=(e=function(e){var t=e.useCSSOMInjection,r=e.target;return e.isServer?new At(r):t?new Tt(r):new Et(r)}(this.options),new dt(e)));var e},e.prototype.hasNameForId=function(e,t){return this.names.has(e)&&this.names.get(e).has(t)},e.prototype.registerName=function(e,t){if(vt(e),this.names.has(e))this.names.get(e).add(t);else{var r=new Set;r.add(t),this.names.set(e,r)}},e.prototype.insertRules=function(e,t,r){this.registerName(e,t),this.getTag().insertRules(vt(e),r)},e.prototype.clearNames=function(e){this.names.has(e)&&this.names.get(e).clear()},e.prototype.clearRules=function(e){this.getTag().clearGroup(vt(e)),this.clearNames(e)},e.prototype.clearTag=function(){this.tag=void 0},e}(),Nt=/&/g,kt=/^\s*\/\/.*$/gm;function Lt(e,t){return e.map((function(e){return"rule"===e.type&&(e.value="".concat(t," ").concat(e.value),e.value=e.value.replaceAll(",",",".concat(t," ")),e.props=e.props.map((function(e){return"".concat(t," ").concat(e)}))),Array.isArray(e.children)&&"@keyframes"!==e.type&&(e.children=Lt(e.children,t)),e}))}function Dt(e){var t,r,n,o=void 0===e?ke:e,s=o.options,i=void 0===s?ke:s,a=o.plugins,c=void 0===a?Ne:a,u=function(e,n,o){return o===r||o.startsWith(r)&&o.endsWith(r)&&o.replaceAll(r,"").length>0?".".concat(t):e},l=c.slice();l.push((function(e){e.type===L&&e.value.includes("&")&&(e.props[0]=e.props[0].replace(Nt,r).replace(n,u))})),i.prefix&&l.push(Oe),l.push(we);var p=function(e,o,s,a){void 0===o&&(o=""),void 0===s&&(s=""),void 0===a&&(a="&"),t=a,r=o,n=new RegExp("\\".concat(r,"\\b"),"g");var c=e.replace(kt,""),u=Ce(s||o?"".concat(s," ").concat(o," { ").concat(c," }"):c);i.namespace&&(u=Lt(u,i.namespace));var p,f,h,d=[];return be(u,(p=l.concat((h=function(e){return d.push(e)},function(e){e.root||(e=e.return)&&h(e)})),f=K(p),function(e,t,r,n){for(var o="",s=0;s<f;s++)o+=p[s](e,t,r,n)||"";return o})),d};return p.hash=c.length?c.reduce((function(e,t){return t.name||ht(15),Be(e,t.name)}),5381).toString():"",p}var $t=new xt,Mt=Dt(),jt=t().createContext({shouldForwardProp:void 0,styleSheet:$t,stylis:Mt}),Gt=(jt.Consumer,t().createContext(void 0));function Ft(){return(0,e.useContext)(jt)}function Wt(r){var n=(0,e.useState)(r.stylisPlugins),o=n[0],s=n[1],i=Ft().styleSheet,a=(0,e.useMemo)((function(){var e=i;return r.sheet?e=r.sheet:r.target&&(e=e.reconstructWithOptions({target:r.target},!1)),r.disableCSSOMInjection&&(e=e.reconstructWithOptions({useCSSOMInjection:!1})),e}),[r.disableCSSOMInjection,r.sheet,r.target,i]),c=(0,e.useMemo)((function(){return Dt({options:{namespace:r.namespace,prefix:r.enableVendorPrefixes},plugins:o})}),[r.enableVendorPrefixes,r.namespace,o]);return(0,e.useEffect)((function(){I()(o,r.stylisPlugins)||s(r.stylisPlugins)}),[r.stylisPlugins]),t().createElement(jt.Provider,{value:{shouldForwardProp:r.shouldForwardProp,styleSheet:a,stylis:c}},t().createElement(Gt.Provider,{value:c},r.children))}var Bt=function(){function e(e,t){var r=this;this.inject=function(e,t){void 0===t&&(t=Mt);var n=r.name+t.hash;e.hasNameForId(r.id,n)||e.insertRules(r.id,n,t(r.rules,n,"@keyframes"))},this.name=e,this.id="sc-keyframes-".concat(e),this.rules=t,ft(this,(function(){throw ht(12,String(r.name))}))}return e.prototype.getName=function(e){return void 0===e&&(e=Mt),this.name+e.hash},e}(),Ut=function(e){return e>="A"&&e<="Z"};function zt(e){for(var t="",r=0;r<e.length;r++){var n=e[r];if(1===r&&"-"===n&&"-"===e[0])return e;Ut(n)?t+="-"+n.toLowerCase():t+=n}return t.startsWith("ms-")?"-"+t:t}var Vt=function(e){return null==e||!1===e||""===e},Yt=function(e){var t,r,n=[];for(var o in e){var s=e[o];e.hasOwnProperty(o)&&!Vt(s)&&(Array.isArray(s)&&s.isCss||it(s)?n.push("".concat(zt(o),":"),s,";"):lt(s)?n.push.apply(n,E(E(["".concat(o," {")],Yt(s),!1),["}"],!1)):n.push("".concat(zt(o),": ").concat((t=o,null==(r=s)||"boolean"==typeof r||""===r?"":"number"!=typeof r||0===r||t in Ae||t.startsWith("--")?String(r).trim():"".concat(r,"px")),";")))}return n};function Ht(e,t,r,n){return Vt(e)?[]:at(e)?[".".concat(e.styledComponentId)]:it(e)?!it(o=e)||o.prototype&&o.prototype.isReactComponent||!t?[e]:Ht(e(t),t,r,n):e instanceof Bt?r?(e.inject(r,n),[e.getName(n)]):[e]:lt(e)?Yt(e):Array.isArray(e)?Array.prototype.concat.apply(Ne,e.map((function(e){return Ht(e,t,r,n)}))):[e.toString()];var o}function qt(e){for(var t=0;t<e.length;t+=1){var r=e[t];if(it(r)&&!at(r))return!1}return!0}var Kt=Ue("6.0.7"),Zt=function(){function e(e,t,r){this.rules=e,this.staticRulesId="",this.isStatic=(void 0===r||r.isStatic)&&qt(e),this.componentId=t,this.baseHash=Be(Kt,t),this.baseStyle=r,xt.registerId(t)}return e.prototype.generateAndInjectStyles=function(e,t,r){var n=this.baseStyle?this.baseStyle.generateAndInjectStyles(e,t,r):"";if(this.isStatic&&!r.hash)if(this.staticRulesId&&t.hasNameForId(this.componentId,this.staticRulesId))n=ct(n,this.staticRulesId);else{var o=ut(Ht(this.rules,e,t,r)),s=Fe(Be(this.baseHash,o)>>>0);if(!t.hasNameForId(this.componentId,s)){var i=r(o,".".concat(s),void 0,this.componentId);t.insertRules(this.componentId,s,i)}n=ct(n,s),this.staticRulesId=s}else{for(var a=Be(this.baseHash,r.hash),c="",u=0;u<this.rules.length;u++){var l=this.rules[u];if("string"==typeof l)c+=l;else if(l){var p=ut(Ht(l,e,t,r));a=Be(a,p),c+=p}}if(c){var f=Fe(a>>>0);t.hasNameForId(this.componentId,f)||t.insertRules(this.componentId,f,r(c,".".concat(f),void 0,this.componentId)),n=ct(n,f)}}return n},e}(),Qt=t().createContext(void 0);function Jt(r){var n=t().useContext(Qt),o=(0,e.useMemo)((function(){return function(e,t){if(!e)throw ht(14);if(it(e))return e(t);if(Array.isArray(e)||"object"!=typeof e)throw ht(8);return t?T(T({},t),e):e}(r.theme,n)}),[r.theme,n]);return r.children?t().createElement(Qt.Provider,{value:o},r.children):null}Qt.Consumer;var Xt={};function er(r,n,o){var s=at(r),i=r,a=!ze(r),c=n.attrs,u=void 0===c?Ne:c,l=n.componentId,p=void 0===l?function(e,t){var r="string"!=typeof e?"sc":Me(e);Xt[r]=(Xt[r]||0)+1;var n="".concat(r,"-").concat(function(e){return Fe(Ue(e)>>>0)}("6.0.7"+r+Xt[r]));return t?"".concat(t,"-").concat(n):n}(n.displayName,n.parentComponentId):l,f=(void 0===n.displayName&&function(e){ze(e)?"styled.".concat(e):"Styled(".concat(function(e){return e.displayName||e.name||"Component"}(e),")")}(r),n.displayName&&n.componentId?"".concat(Me(n.displayName),"-").concat(n.componentId):n.componentId||p),h=s&&i.attrs?i.attrs.concat(u).filter(Boolean):u,d=n.shouldForwardProp;if(s&&i.shouldForwardProp){var m=i.shouldForwardProp;if(n.shouldForwardProp){var g=n.shouldForwardProp;d=function(e,t){return m(e,t)&&g(e,t)}}else d=m}var y=new Zt(o,f,s?i.componentStyle:void 0),v=t().forwardRef((function(r,n){return function(r,n,o){var s=r.attrs,i=r.componentStyle,a=r.defaultProps,c=r.foldedComponentIds,u=r.styledComponentId,l=r.target,p=t().useContext(Qt),f=Ft(),h=r.shouldForwardProp||f.shouldForwardProp,d=function(e,t,r){for(var n,o=T(T({},t),{className:void 0,theme:r}),s=0;s<e.length;s+=1){var i=it(n=e[s])?n(o):n;for(var a in i)o[a]="className"===a?ct(o[a],i[a]):"style"===a?T(T({},o[a]),i[a]):i[a]}return t.className&&(o.className=ct(o.className,t.className)),o}(s,n,function(e,t,r){return void 0===r&&(r=ke),e.theme!==r.theme&&e.theme||t||r.theme}(n,p,a)||ke),m=d.as||l,g={};for(var y in d)void 0===d[y]||"$"===y[0]||"as"===y||"theme"===y||("forwardedAs"===y?g.as=d.forwardedAs:h&&!h(y,m)||(g[y]=d[y]));var v=function(e,t){var r=Ft();return e.generateAndInjectStyles(t,r.styleSheet,r.stylis)}(i,d),b=ct(c,u);return v&&(b+=" "+v),d.className&&(b+=" "+d.className),g[ze(m)&&!Le.has(m)?"class":"className"]=b,g.ref=o,(0,e.createElement)(m,g)}(v,r,n)}));return v.attrs=h,v.componentStyle=y,v.shouldForwardProp=d,v.foldedComponentIds=s?ct(i.foldedComponentIds,i.styledComponentId):"",v.styledComponentId=f,v.target=s?i.target:r,Object.defineProperty(v,"defaultProps",{get:function(){return this._foldedDefaultProps},set:function(e){this._foldedDefaultProps=s?function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];for(var n=0,o=t;n<o.length;n++)pt(e,o[n],!0);return e}({},i.defaultProps,e):e}}),ft(v,(function(){return".".concat(v.styledComponentId)})),a&&st(v,r,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,shouldForwardProp:!0,styledComponentId:!0,target:!0}),v}function tr(e,t){for(var r=[e[0]],n=0,o=t.length;n<o;n+=1)r.push(t[n],e[n+1]);return r}new Set;var rr=function(e){return Object.assign(e,{isCss:!0})};function nr(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];if(it(e)||lt(e))return rr(Ht(tr(Ne,E([e],t,!0))));var n=e;return 0===t.length&&1===n.length&&"string"==typeof n[0]?Ht(n):rr(Ht(tr(n,t)))}function or(e,t,r){if(void 0===r&&(r=ke),!t)throw ht(1,t);var n=function(n){for(var o=[],s=1;s<arguments.length;s++)o[s-1]=arguments[s];return e(t,r,nr.apply(void 0,E([n],o,!1)))};return n.attrs=function(n){return or(e,t,T(T({},r),{attrs:Array.prototype.concat(r.attrs,n).filter(Boolean)}))},n.withConfig=function(n){return or(e,t,T(T({},r),n))},n}var sr=function(e){return or(er,e)},ir=sr;Le.forEach((function(e){ir[e]=sr(e)})),function(){function e(e,t){this.rules=e,this.componentId=t,this.isStatic=qt(e),xt.registerId(this.componentId+1)}e.prototype.createStyles=function(e,t,r,n){var o=n(ut(Ht(this.rules,t,r,n)),""),s=this.componentId+e;r.insertRules(s,s,o)},e.prototype.removeStyles=function(e,t){t.clearRules(this.componentId+e)},e.prototype.renderStyles=function(e,t,r,n){e>2&&xt.registerId(this.componentId+e),this.removeStyles(e,r),this.createStyles(e,t,r,n)}}(),function(){function e(){var e=this;this._emitSheetCSS=function(){var t=e.instance.toString(),r=_t(),n=ut([r&&'nonce="'.concat(r,'"'),"".concat(Ie,'="true"'),"".concat("data-styled-version",'="').concat("6.0.7",'"')].filter(Boolean)," ");return"<style ".concat(n,">").concat(t,"</style>")},this.getStyleTags=function(){if(e.sealed)throw ht(2);return e._emitSheetCSS()},this.getStyleElement=function(){var r;if(e.sealed)throw ht(2);var n=((r={})[Ie]="",r["data-styled-version"]="6.0.7",r.dangerouslySetInnerHTML={__html:e.instance.toString()},r),o=_t();return o&&(n.nonce=o),[t().createElement("style",T({},n,{key:"sc-0-0"}))]},this.seal=function(){e.sealed=!0},this.instance=new xt({isServer:!0}),this.sealed=!1}e.prototype.collectStyles=function(e){if(this.sealed)throw ht(2);return t().createElement(Wt,{sheet:this.instance},e)},e.prototype.interleaveWithNodeStream=function(e){throw ht(3)}}(),"__sc-".concat(Ie,"__");const ar=ir.div`
	display: flex;
	align-items: center;
	padding: 3px;
	border-radius: 2px;
	background-color: ${e=>e.theme.neutral30};
	color: ${e=>e.theme.primaryText};
	font-weight: 700;
	line-height: 1;
	font-size: 12px;

	svg {
		width: 12px;
		height: 12px;
		margin-right: 3px;
	}
`;function cr(t){const{children:r}=t;return(0,e.createElement)(ar,null,(0,e.createElement)(R,null),r)}const ur={primaryYellow:"#fcb63e",primaryText:"#1f2858",primaryGreen:"#00aca3",primaryRed:"#e8142e",primaryOrange:"#f05f34",primaryBlue:"#067ce1",darkGray:"#1f2858",gray:"#7d829e",lightishGray:"#d1d5db",lightGray:"#e2e3e9",extraLightGray:"#fdfdfd",white:"#ffffff",primaryYellow50:"#fff8ec",primaryYellow75:"#fee1b0",primaryYellow100:"#fed58f",primaryYellow200:"#fdc25f",primaryYellow300:"#fcb63e",primaryYellow400:"#b17f2b",primaryYellow500:"#9a6f26",primaryText50:"#e9eaee",primaryText75:"#a3a7bb",primaryText100:"#7d829e",primaryText200:"#454d74",primaryText300:"#1f2858",primaryText400:"#161c3e",primaryText500:"#131836",green50:"#e6f7f6",green75:"#97ddd9",green100:"#6ccfca",green200:"#2dbab3",green300:"#00aca3",green400:"#017872",green500:"#016963",red50:"#fde8ea",red75:"#f69fa9",red100:"#f27786",red200:"#ec3c52",red300:"#e8142e",red400:"#a20e20",red500:"#8e0c1c",orange50:"#feefeb",orange75:"#f9bdac",orange100:"#f6a289",orange200:"#f37957",orange300:"#f05f34",orange400:"#a84224",orange500:"#923920",blue50:"#e6f2fc",blue75:"#99c9f3",blue100:"#6fb3ee",blue200:"#3092e6",blue300:"#067ce1",blue400:"#04579e",blue500:"#044c89",neutral0:"#ffffff",neutral10:"#fbfbfc",neutral20:"#f6f6f8",neutral30:"#edeef2",neutral40:"#e2e3e9",neutral50:"#c7c9d5",neutral60:"#babccb",neutral70:"#aeb2c3",neutral80:"#a1a5b9",neutral90:"#9398af",neutral100:"#868ba5",neutral200:"#797e9b",neutral300:"#6b7191",neutral400:"#606688",neutral500:"#53597e",neutral600:"#474f76",neutral700:"#38406a",neutral800:"#2a3360",neutral900:"#1f2858"},lr=ir.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 15px 0;
`,pr=ir(a.Notice)`
	margin: 20px 0 0;

	.components-notice__action.components-button.is-link {
		margin-left: 0;
	}
`;(0,n.registerPlugin)("comment-converter-post-settings",{render(){const t=(0,s.useSelect)((e=>e(i.store).getCurrentPostId()),[]),{counts:r,isEmailRequired:n}=(0,s.useSelect)((e=>e(d).getCounts(t)),[]),l=(0,s.useSelect)((e=>e(i.store).getEditedPostAttribute("meta")||{}),[]),{editPost:p}=(0,s.useDispatch)(i.store),f={label:(0,c.__)("Review settings","subscribe-to-comment-notifications-comment-converter"),url:b,variant:"link"};return(0,e.createElement)(o.PluginDocumentSettingPanel,{name:"comment-converter-panel",title:"Comment Converter"},(0,e.createElement)(Jt,{theme:ur},(0,e.createElement)(a.CheckboxControl,{label:(0,c.__)("Allow comment following","subscribe-to-comment-notifications-comment-converter"),checked:!!l.ccvtr_enable_comment_following,onChange:()=>{var e,t;e="ccvtr_enable_comment_following",t=!l.ccvtr_enable_comment_following,p({meta:{[e]:t}})}}),(0,e.createElement)(lr,null,(0,c.__)("Total followers from this post","subscribe-to-comment-notifications-comment-converter"),r&&null!==r.followers?(0,e.createElement)(cr,null,r.followers):(0,e.createElement)("em",null,"...")),(0,e.createElement)(a.Button,{href:(0,u.addQueryArgs)(v,{post_id:t}),target:"_blank",rel:"noopener noreferrer",isLink:!0},(0,c.__)("View Followers","subscribe-to-comment-notifications-comment-converter")),null===n||n?null:(0,e.createElement)(pr,{status:"warning",isDismissible:!1,actions:[f]},(0,e.createElement)("p",{dangerouslySetInnerHTML:{
// translators: Comment Converter is the name of the plugin.
__html:(0,c.__)("Currently your <strong>WordPress discussion settings</strong> do not require an email when commenting. We recommend changing this so that Comment Converter can perform correctly. ","subscribe-to-comment-notifications-comment-converter")}}))))},icon:!1})})()})();