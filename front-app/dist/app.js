(function(e){function t(t){for(var i,a,o=t[0],u=t[1],l=t[2],d=0,p=[];d<o.length;d++)a=o[d],s[a]&&p.push(s[a][0]),s[a]=0;for(i in u)Object.prototype.hasOwnProperty.call(u,i)&&(e[i]=u[i]);c&&c(t);while(p.length)p.shift()();return r.push.apply(r,l||[]),n()}function n(){for(var e,t=0;t<r.length;t++){for(var n=r[t],i=!0,o=1;o<n.length;o++){var u=n[o];0!==s[u]&&(i=!1)}i&&(r.splice(t--,1),e=a(a.s=n[0]))}return e}var i={},s={app:0},r=[];function a(t){if(i[t])return i[t].exports;var n=i[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=e,a.c=i,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)a.d(n,i,function(t){return e[t]}.bind(null,i));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="/wp-content/plugins/finance-questionnaire/front-app/dist/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],u=o.push.bind(o);o.push=t,o=o.slice();for(var l=0;l<o.length;l++)t(o[l]);var c=u;r.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"56d7":function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("097d");var i=n("a026"),s=n("bb71"),r=(n("78a7"),n("7514"),n("f499")),a=n.n(r),o=n("e814"),u=n.n(o),l=n("7618"),c=(n("55dd"),n("5d73")),d=n.n(c),p=n("2f62");i["a"].use(p["a"]);var f={loading:!0,questionnaries:[],products:[],productsCopy:[],activeQuestionnaireId:null,activeProductTypeId:null,questionnariesRequested:!1,productsRequested:!1};function v(e){return{GET_QUESTIONNARIES:function(t){var n=t.commit,i=t.state,s=t.dispatch;i.questionnariesRequested||(n("SET_QUESTIONNAIRES_REQUESTED",!0),n("SET_LOADING",!0),e.get("/questionnairies").then(function(e){n("SET_QUESTIONNARIES",e.data),e.data&&e.data[0]&&s("SET_ACTIVE_QUESTIONNAIRE",e.data[0].id),s("GET_PRODUCTS"),n("SET_QUESTIONNAIRES_REQUESTED",!1),n("SET_LOADING",!1)}))},GET_QUESTIONNAIRE:function(t,n){var i=t.commit;i("SET_LOADING",!0),e.get("/questionnairies/".concat(n)).then(function(e){i("SET_QUESTIONNAIRE",e.data),i("SET_LOADING",!1)})},GET_PRODUCTS:function(t){var n=t.commit;f.productsRequested||(n("SET_PRODUCTS_REQUESTED",!0),n("SET_LOADING",!0),e.get("/finproducts").then(function(e){e.data&&n("SET_PRODUCTS",e.data),n("SET_PRODUCTS_REQUESTED",!1),n("SET_LOADING",!1)}))},SET_ACTIVE_QUESTIONNAIRE:function(e,t){var n=e.commit,i=e.state;n("SET_ACTIVE_QUESTIONNAIRE",t);var s=!0,r=!1,a=void 0;try{for(var o,u=d()(i.questionnaries);!(s=(o=u.next()).done);s=!0){var l=o.value;l.id===t&&l.products_type&&n("SET_ACTIVE_PRODUCT_TYPE",l.products_type)}}catch(c){r=!0,a=c}finally{try{s||null==u.return||u.return()}finally{if(r)throw a}}},SET_ACTIVE_PRODUCT_TYPE:function(e,t){var n=e.commit;n("SET_ACTIVE_PRODUCT_TYPE",t)}}}var h={SET_LOADING:function(e,t){e.loading=t},SET_QUESTIONNARIES:function(e,t){t.sort(function(e,t){return+e.order>+t.order?1:+e.order<+t.order?-1:0}),e.questionnaries=t},SET_QUESTIONNAIRE:function(e,t){e.questionnaries.push(t)},SET_PRODUCTS:function(e,t){e.products={},e.productsCopy={};var n=!0,i=!1,s=void 0;try{for(var r,o=d()(t);!(n=(r=o.next()).done);n=!0){var c=r.value,p=[];if(void 0!==c.product){for(var f in c.product){var v=c.product[f],h={id:f,rank:v.rank,description:v.description,fields:{}};for(var b in v)if(void 0===h[b]){var _=v[b],T=void 0;switch(Object(l["a"])(_)){case"object":T="multiple";break;case"boolean":T="boolean";break;case"string":T=u()(_)?"number":"single";break}if(h.fields[b]={type:T,value:_},"multiple"===T){var y=[],m=!0,E=!1,S=void 0;try{for(var I,w=d()(h.fields[b].value);!(m=(I=w.next()).done);m=!0){var q=I.value;y.push(q)}}catch(g){E=!0,S=g}finally{try{m||null==w.return||w.return()}finally{if(E)throw S}}h.fields[b].value=y}}p.push(h)}p.sort(function(e,t){return+e.rank>+t.rank?1:+e.rank<+t.rank?-1:0}),e.products[c.id]=p,e.productsCopy[c.id]=JSON.parse(a()(p))}}}catch(g){i=!0,s=g}finally{try{n||null==o.return||o.return()}finally{if(i)throw s}}},SET_ACTIVE_QUESTIONNAIRE:function(e,t){e.activeQuestionnaireId=t},SET_ACTIVE_PRODUCT_TYPE:function(e,t){e.activeProductTypeId=t},SET_QUESTIONNAIRES_REQUESTED:function(e,t){e.questionnariesRequested=t},SET_PRODUCTS_REQUESTED:function(e,t){e.productsRequested=t}},b={loading:function(e){return e.loading},getQuestionnaries:function(e){return e.questionnaries.filter(function(e){return e.show_on_home_page})},getQuestionnare:function(e){return function(t){return e.questionnaries.find(function(e){return+e.id===+t})}},getProducts:function(e){return e.activeProductTypeId&&e.products[e.activeProductTypeId]?e.products[e.activeProductTypeId]:[]},getActiveProductTypeId:function(e){return e.activeProductTypeId}};function _(e){return new p["a"].Store({state:f,actions:v(e),mutations:h,getters:b})}var T=n("a4bb"),y=n.n(T),m=(n("ac6a"),n("bc3a")),E=n.n(m),S=n("a7fe"),I=n.n(S),w=n("cebc"),q={computed:Object(w["a"])({},Object(p["b"])(["getQuestionnaries","getQuestionnare","getProducts"])),beforeCreate:function(){var e=this.$options;e.apiService?this.$apiService=e.apiService:e.parent&&e.parent.$apiService&&(this.$apiService=e.parent.$apiService)},methods:{getObjectSize:function(e){var t,n=0;for(t in e)e.hasOwnProperty(t)&&n++;return n},sortByRank:function(e,t){return+e.rank>+t.rank?1:+e.rank<+t.rank?-1:0}},mounted:function(){this.$store.state.questionnaries.length||this.$store.dispatch("GET_QUESTIONNARIES",this.id)}};i["a"].use(I.a,E.a);var g=window.location.protocol+"//"+window.location.host;i["a"].axios.defaults.baseURL="".concat(g,"/wp-json/wp/v2"),i["a"].mixin(q);var P={updateOptions:function(e){y()(e).forEach(function(t){"headers"==t&&y()(e[t]).forEach(function(n){i["a"].axios.defaults.headers[n]=e[t][n]})})},get:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=t?"/":"";return i["a"].axios.get("".concat(e).concat(n).concat(t)).catch(function(e){console.error(e)})},post:function(e,t){return i["a"].axios.post("".concat(e),t).catch(function(e){console.error(e)})},put:function(e,t){return i["a"].axios.put("".concat(e),t).catch(function(e){console.error(e)})},patch:function(e,t){return i["a"].axios.put("".concat(e),t).catch(function(e){console.error(e)})}},x=P,Q=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"questionnaire"},[n("v-app",[e.questionnaire&&e.questionnaire.question?n("v-stepper",{model:{value:e.questionIndex,callback:function(t){e.questionIndex=t},expression:"questionIndex"}},[n("v-stepper-items",[e._l(e.questionnaire.question,function(t,i){return n("v-stepper-content",{key:i,staticClass:"pl-0 pr-0",attrs:{step:i+1}},[n("v-card",{staticClass:"ml-0 mr-0 mt-0 pl-4 pr-4 elevation-0 question",attrs:{color:"white lighten-1"}},[n("v-toolbar",{staticClass:"mb-4",attrs:{color:"blue darken-2",dark:""}},[n("v-toolbar-title",[e._v(e._s(t.title))])],1),n("v-card-text",[e.isQuestionType("single",t.type)?n("v-radio-group",{model:{value:e.answers[i+1].val,callback:function(t){e.$set(e.answers[i+1],"val",t)},expression:"answers[index+1].val"}},e._l(t.single_choise,function(e,t){return n("v-radio",{key:t,attrs:{label:e.option,value:e.option}})}),1):e._e(),e.isQuestionType("multiple",t.type)?e._l(t.multiple_choice,function(t,s){return n("div",{key:s},[n("v-checkbox",{staticClass:"mt-0",attrs:{label:t.option},model:{value:e.answers[i+1].val[t.option],callback:function(n){e.$set(e.answers[i+1].val,t.option,n)},expression:"answers[index+1].val[option.option]"}})],1)}):e._e(),e.isQuestionType("boolean",t.type)?n("v-switch",{attrs:{label:t.question},model:{value:e.answers[i+1].val,callback:function(t){e.$set(e.answers[i+1],"val",t)},expression:"answers[index+1].val"}}):e._e(),e.isQuestionType("scale",t.type)?[t.scale.scale_min_label?n("div",{staticClass:"label scale min"},[e._v(e._s(t.scale.scale_min_label))]):e._e(),n("v-slider",{staticClass:"mt-5 mr-3 ml-3",attrs:{label:"",max:t.scale.max,min:t.scale.min,step:t.scale.step,"thumb-label":!!t.scale.scale_visibility&&"always"},model:{value:e.answers[i+1].val,callback:function(t){e.$set(e.answers[i+1],"val",t)},expression:"answers[index+1].val"}}),t.scale.scale_max_label?n("div",{staticClass:"label scale max"},[e._v(e._s(t.scale.scale_max_label))]):e._e()]:e._e()],2),n("v-btn",{staticClass:"ml-0",attrs:{color:"primary",disabled:e.isDisabled},on:{click:function(t){e.questionIndex++}}},[e._v("\n                            Continue\n                        ")])],1)],1)}),n("v-stepper-content",{staticClass:"pl-0 pr-0",attrs:{step:e.questionnaire.question.length+1}},[e.resultProduct?n("v-card",{staticClass:"ml-0 mr-0 mt-0 pl-4 pr-4 elevation-0 result",attrs:{color:"white lighten-1"}},[n("v-toolbar",{staticClass:"mb-4",attrs:{color:"blue darken-2",dark:""}},[n("v-toolbar-title",[e._v("Result")])],1),n("v-card-text",[n("p",{staticClass:"text-xs-left",domProps:{innerHTML:e._s(e.resultProduct.description)}})]),n("v-btn",{staticClass:"ma-0",attrs:{color:"primary"},on:{click:e.finishQuestionnaire}},[e._v("Restart")])],1):e._e()],1)],2),n("v-stepper-header",[e._l(e.questionnaire.question,function(t,i){return[n("v-stepper-step",{key:"step"+i,attrs:{editable:!e.isDisabled||e.questionIndex>i+1,complete:e.questionIndex>i+1,step:i+1}}),i<e.questionnaire.question.length-1?n("v-divider",{key:"divider"+i}):e._e()]})],2)],1):e._e()],1)],1)},O=[],C=(n("6762"),n("2fdb"),n("28a5"),n("c5f6"),{name:"Questionnaire",data:function(){return{questionIndex:0,answers:{},defaultAnswersInitiated:!1,isDisabled:!1,filteredProducts:[],filteredProductsPreviousStep:[],productsCopy:[]}},props:{id:Number,nested:Boolean},watch:{questionnaire:function(e){e.question&&!this.defaultAnswersInitiated&&this.setDefaultAnswers(e)},answers:{handler:function(e){this.filterProducts(),this.isNextButtonDisabled(this.questionIndex,e)},deep:!0},questionIndex:function(e){this.filterProducts(),this.isNextButtonDisabled(e,this.answers)},"$store.state.activeQuestionnaireId":function(e){e&&(this.setDefaultAnswers(this.questionnaire),this.questionIndex=1)},products:function(){this.$store.state.productsCopy[this.activeProductTypeId]&&(this.productsCopy=JSON.parse(a()(this.$store.state.productsCopy[this.activeProductTypeId])))}},computed:{questionnaire:function(){return this.getQuestionnare(this.id)},resultProduct:function(){return this.filteredProducts.length?this.filteredProducts[0]:this.filteredProductsPreviousStep[0]},products:function(){return this.getProducts},activeProductTypeId:function(){return this.$store.getters.getActiveProductTypeId}},methods:{isQuestionType:function(e,t){var n={multiple:"multiple: multiple choice",single:"single: single choice",boolean:"boolean: yes/no",scale:"scale: min and max labels can be configured"};return n[e]===t},finishQuestionnaire:function(){this.setDefaultAnswers(this.questionnaire),this.questionIndex=1},setDefaultAnswers:function(e){if(e.question){this.answers={};var t=1,n=!0,i=!1,s=void 0;try{for(var r,a=d()(e.question);!(n=(r=a.next()).done);n=!0){var o=r.value,u=o.field.toLowerCase().split(" ").join("_");if(this.isQuestionType("multiple",o.type)){var l={},c=!0,p=!1,f=void 0;try{for(var v,h=d()(o.multiple_choice);!(c=(v=h.next()).done);c=!0){var b=v.value;l[b.option]=0}}catch(_){p=!0,f=_}finally{try{c||null==h.return||h.return()}finally{if(p)throw f}}this.$set(this.answers,t,{field:u,val:l,type:"multiple"})}else this.isQuestionType("single",o.type)?this.$set(this.answers,t,{field:u,val:"",type:"single"}):this.isQuestionType("boolean",o.type)?this.$set(this.answers,t,{field:u,val:!1,type:"boolean"}):this.isQuestionType("scale",o.type)&&this.$set(this.answers,t,{field:u,val:o.scale.min,type:"scale"});t++}}catch(_){i=!0,s=_}finally{try{n||null==a.return||a.return()}finally{if(i)throw s}}this.defaultAnswersInitiated=!0}},isNextButtonDisabled:function(e,t){if(0!==e){var n=e-1>=0?e-1:0,i=this.questionnaire.question[n];if(i)if(this.isQuestionType("multiple",i.type)&&e){var s=0;for(var r in t[e].val)s=t[e].val[r]?s+1:s;this.isDisabled=!s}else this.isQuestionType("single",i.type)&&!t[e].val?this.isDisabled=!0:this.isDisabled=!1;else this.isDisabled=!1}},productFilter:function(e){var t=this,n=0;for(var i in this.answers){var s=this.answers[i].field,r=this.answers[i].val;if(i>this.questionIndex)break;if(!e.fields[s])return!1;if("object"===Object(l["a"])(r)&&null!==r){var a=0,o=0;for(var u in r)r[u]&&(o=e.fields[s].value.includes(u)?o+1:o,a++);var c=a===o;c&&n++}else{var p=void 0;if("number"===e.fields[s].type&&"scale"===this.answers[i].type){p=!0;var f=!0,v=!1,h=void 0;try{for(var b,_=function(){var e=b.value,n=t.productsCopy.filter(function(t){return t.id==e.id})[0];if(n){var i=n.rank,s=0;for(var r in t.answers){var a=t.answers[r];"scale"===a.type&&e.fields[a.field]&&(s+=a.val*e.fields[a.field].value)}e.rank=i-s}},T=d()(this.products);!(f=(b=T.next()).done);f=!0)_()}catch(m){v=!0,h=m}finally{try{f||null==T.return||T.return()}finally{if(v)throw h}}}else p="multiple"===e.fields[s].type?void 0!==e.fields[s].value&&e.fields[s].value.includes(r):void 0!==e.fields[s].value&&e.fields[s].value==r;p&&n++}}var y=this.questionIndex<=this.getObjectSize(this.answers)?this.questionIndex:this.questionIndex-1;return n===y},filterProducts:function(){this.filteredProductsPreviousStep=this.filteredProducts.length?this.filteredProducts:this.filteredProductsPreviousStep,this.filteredProductsPreviousStep=this.filteredProductsPreviousStep.length?this.filteredProductsPreviousStep:this.getProducts,this.filteredProducts=this.getProducts.filter(this.productFilter),this.filteredProducts.sort(this.sortByRank),this.filteredProductsPreviousStep.sort(this.sortByRank)}},created:function(){var e=this;this.$parent.$parent.$on("restart",function(){return e.finishQuestionnaire()})}}),N=C,k=n("2877"),R=n("6544"),A=n.n(R),D=n("7496"),U=n("8336"),V=n("b0af"),$=n("99d9"),j=n("ac7c"),G=n("ce7e6"),B=n("67b6"),L=n("43a6"),M=n("ba0d"),J=n("7e85"),Y=n("e516"),z=n("9c54"),F=n("56a4"),H=n("b73d"),W=n("71d9"),K=n("2a7f"),X=Object(k["a"])(N,Q,O,!1,null,null,null),Z=X.exports;A()(X,{VApp:D["a"],VBtn:U["a"],VCard:V["a"],VCardText:$["a"],VCheckbox:j["a"],VDivider:G["a"],VRadio:B["a"],VRadioGroup:L["a"],VSlider:M["a"],VStepper:J["a"],VStepperContent:Y["a"],VStepperHeader:z["a"],VStepperItems:z["b"],VStepperStep:F["a"],VSwitch:H["a"],VToolbar:W["a"],VToolbarTitle:K["a"]});var ee=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",[n("div",{staticClass:"questionnaireWidget"},[n("v-toolbar",[e._l(e.questionnairies,function(t,i){return[i<e.buttonsNumber?n("v-btn",{key:i,staticClass:"ml-1 elevation-0",attrs:{color:"primary",dark:""},on:{click:function(n){e.selectQuestionnaire(t.id)}}},[e._v(e._s(e._f("button_label")(t))+"\n                ")]):e._e()]}),e.questionnairies.length>e.buttonsNumber?n("v-overflow-btn",{staticClass:"ml-1 dropdown",attrs:{dark:"",label:"More",items:e.dropdownQuestionnairies,"item-text":"text","item-value":"value","return-object":""},on:{change:e.selectQuestionnaireDropdown},model:{value:e.selectedQuestionnaire,callback:function(t){e.selectedQuestionnaire=t},expression:"selectedQuestionnaire"}}):e._e()],2),n("questionnaire",{attrs:{id:e.$store.state.activeQuestionnaireId,nested:!0}})],1)])},te=[],ne={name:"QuestionnaireWidget",data:function(){return{selectedQuestionnaire:{text:"More",value:""}}},computed:{questionnairies:function(){return this.getQuestionnaries},buttonsNumber:function(){return this.questionnairies&&this.questionnairies[0]?this.questionnairies[0]["buttons_number"]:0},activeQuestionnaire:function(){return this.getQuestionnare(this.$store.activeQuestionnaireId)},dropdownQuestionnairies:function(){var e=this;return this.questionnairies.slice(this.buttonsNumber).map(function(t){return{text:e.$options.filters.button_label(t),value:t.id,callback:function(){return e.selectQuestionnaireDropdown({value:t.id})}}})}},filters:{button_label:function(e){return e?e.button_label?e.button_label:e.title.rendered:"More"}},methods:{selectQuestionnaire:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];this.$emit("restart"),this.$store.dispatch("SET_ACTIVE_QUESTIONNAIRE",e),t&&(this.selectedQuestionnaire={text:"More",value:""})},selectQuestionnaireDropdown:function(e){this.selectQuestionnaire(e.value,!1)}}},ie=ne,se=n("de8e"),re=Object(k["a"])(ie,ee,te,!1,null,null,null),ae=re.exports;A()(re,{VApp:D["a"],VBtn:U["a"],VOverflowBtn:se["a"],VToolbar:W["a"]}),i["a"].component("questionnaire",Z),i["a"].component("questionnaire-widget",ae),i["a"].config.productionTip=!1,i["a"].use(s["a"],{iconfont:"md",theme:{accent:"#1976d2"}});var oe=_(x);document.getElementById("qfp-app")&&new i["a"]({el:"#qfp-app",store:oe,apiService:x})},"78a7":function(e,t,n){}});
//# sourceMappingURL=app.js.map