!function(e){var t={};function n(i){if(t[i])return t[i].exports;var a=t[i]={i:i,l:!1,exports:{}};return e[i].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(i,a,function(t){return e[t]}.bind(null,a));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=13)}({1:function(e,t,n){"use strict";n.d(t,"e",(function(){return i})),n.d(t,"d",(function(){return r})),n.d(t,"b",(function(){return o})),n.d(t,"a",(function(){return s})),n.d(t,"c",(function(){return c}));const i=e=>parent.postMessage({pluginMessage:e},"*"),a=({r:e,g:t,b:n})=>({r:e/255,g:t/255,b:n/255}),r=({r:e,g:t,b:n})=>`rgb(${255*e}, ${255*t}, ${255*n})`,o={DRAFT:"draft",IN_PROGRESS:"in-progress",IN_REVIEW:"in-review",REJECTED:"rejected",ACCEPTED:"accepted"},s={[o.DRAFT]:a({r:130,g:130,b:130}),[o.IN_PROGRESS]:a({r:242,g:201,b:76}),[o.IN_REVIEW]:a({r:24,g:144,b:255}),[o.REJECTED]:a({r:235,g:87,b:87}),[o.ACCEPTED]:a({r:111,g:207,b:151})},c={[o.DRAFT]:"Draft",[o.IN_PROGRESS]:"In progress",[o.IN_REVIEW]:"In review",[o.REJECTED]:"Rejected",[o.ACCEPTED]:"Accepted"}},13:function(e,t,n){"use strict";n.r(t);var i=n(1),a=function(e,t,n,i){return new(n||(n=Promise))((function(a,r){function o(e){try{c(i.next(e))}catch(e){r(e)}}function s(e){try{c(i.throw(e))}catch(e){r(e)}}function c(e){var t;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,s)}c((i=i.apply(e,t||[])).next())}))};figma.showUI(__html__,{height:560,width:320});let r=[];function o(){let e=figma.currentPage.getPluginData("details");const t=e?JSON.parse(e):{};return Object.entries(t).forEach(([e,n])=>{t[e]=Object.assign(Object.assign({},t[e]),{name:figma.currentPage.findOne(e=>e.id===n.id).name})}),t}function s(e){if(1!==e.length)return 0;let t=figma.currentPage.getPluginData(`stories.${e[0].id}`)||[];return"string"==typeof t?JSON.parse(t):[]}function c(){if(r.map(e=>e.id).join(",")===figma.currentPage.selection.map(e=>e.id).join(","))return;const e=o(),t=figma.currentPage.selection.map(t=>Object.assign({id:t.id},e[t.id]));figma.ui.postMessage({type:"selection-change",payload:{selectedFrames:t,details:o(),stories:s(figma.currentPage.selection)}}),r=figma.currentPage.selection}setInterval(()=>{c()},50),figma.ui.onmessage=e=>{switch(e.type){case"ready":return function(){const e=o(),t=figma.currentPage.selection.map(t=>Object.assign({id:t.id},e[t.id]));figma.ui.postMessage({type:"selection-change",payload:{selectedFrames:t,details:o(),stories:s(figma.currentPage.selection)}}),r=figma.currentPage.selection}();case"update-frame-details":return function(e){return a(this,void 0,void 0,(function*(){yield figma.loadFontAsync({family:"Roboto",style:"Black"});const t=o(),n=function(){const e=figma.currentPage.getPluginData("statusFrameId");let t=figma.currentPage.findOne(t=>t.id===e);t||((t=figma.createFrame()).name="# Statuses",t.clipsContent=!1,t.x=0,t.y=0,t.resizeWithoutConstraints(1,1),figma.currentPage.appendChild(t),figma.currentPage.setPluginData("statusFrameId",t.id));return t}();r.forEach(a=>{if(""===e.payload.status&&t[a.id]){const e=figma.currentPage.findOne(e=>e.id===t[a.id].frameId);return e&&e.remove(),void delete t[a.id]}let r;t[a.id]?r=figma.currentPage.findOne(e=>e.id===t[a.id].frameId):t[a.id]={id:a.id},(r=r||figma.createFrame()).name=" ",r.x=a.x+a.width-40,r.y=a.y-40-10,r.backgrounds=[{type:"SOLID",color:{r:0,g:0,b:0},visible:!1}],r.resizeWithoutConstraints(40,40),r.children.map(e=>e.remove());const o=figma.createEllipse();o.resizeWithoutConstraints(40,40),o.fills=[{type:"SOLID",color:i.a[e.payload.status]}],r.appendChild(o),t[a.id].frameId=r.id,t[a.id].status=e.payload.status,t[a.id].rejectionReason=e.payload.rejectionReason,n.appendChild(r)}),figma.currentPage.setPluginData("details",JSON.stringify(t)),figma.ui.postMessage({type:"update-details",payload:o()})}))}(e);case"update-frame-rejection-reason":return function(e){return a(this,void 0,void 0,(function*(){const t=o();t[r[0].id].rejectionReason=e.payload.rejectionReason,figma.currentPage.setPluginData("details",JSON.stringify(t))}))}(e);case"add-story":return function(e){const t=s(r).concat({id:Math.random().toString(32),content:e.payload.content,isDone:!1});figma.currentPage.setPluginData(`stories.${e.payload.frameId}`,JSON.stringify(t)),figma.ui.postMessage({type:"update-stories",payload:t})}(e);case"toggle-story":return function(e){const t=s(r).map(t=>t.id===e.payload.id?Object.assign(Object.assign({},t),{isDone:!t.isDone}):t);figma.currentPage.setPluginData(`stories.${e.payload.frameId}`,JSON.stringify(t)),figma.ui.postMessage({type:"update-stories",payload:t})}(e);case"remove-story":return function(e){const t=s(r),n=t.findIndex(t=>t.id===e.payload.id);n>=0&&(t.splice(n,1),figma.currentPage.setPluginData(`stories.${e.payload.frameId}`,JSON.stringify(t)),figma.ui.postMessage({type:"update-stories",payload:t}))}(e);case"focus-frame":return function(e){const t=figma.currentPage.findOne(t=>t.id===e.payload.id);e.payload.add?figma.currentPage.selection.some(e=>e.id===t.id)?figma.currentPage.selection=figma.currentPage.selection.filter(e=>e.id!==t.id):figma.currentPage.selection=[...figma.currentPage.selection,t]:figma.currentPage.selection=[t];figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection),c()}(e);case"fetch-details":return void figma.ui.postMessage({type:"update-details",payload:o()})}}}});