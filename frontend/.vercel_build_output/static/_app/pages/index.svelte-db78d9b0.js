import{D as S,L as Z,S as j,i as J,s as Y,e as C,t as k,k as P,l as V,c as E,a as I,h as v,d as u,m as W,b as N,g as h,J as b,K as U,M as K,v as z,N as D,j as R,O as M}from"../chunks/vendor-1b4702e0.js";const g={domain:"rocktver.eu.auth0.com",clientId:"V6ClDZbmeVIGhPlYH1buW9U9G6uZmL4I"},O=S(!1),A=S({}),q=S(!1);async function F(){return await Z({domain:g.domain,client_id:g.clientId})}async function Q(s,t){q.set(!0);try{await s.loginWithPopup(t),A.set(await s.getUser()),O.set(!0)}catch(o){console.error(o)}finally{q.set(!1)}}function X(s){return s.logout()}const G={createClient:F,loginWithPopup:Q,logout:X};function $(s){let t,o,l,i;return{c(){t=C("button"),o=k("Login")},l(n){t=E(n,"BUTTON",{});var f=I(t);o=v(f,"Login"),f.forEach(u)},m(n,f){h(n,t,f),b(t,o),l||(i=D(t,"click",s[3]),l=!0)},p:U,d(n){n&&u(t),l=!1,i()}}}function x(s){let t,o,l,i=s[0].name+"",n,f,y,d,c,w,L,H,a=s[0].name=="\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440 \u0420\u0443\u0434\u0438\u043D"&&B(s);function r(e,_){return e[0].picture?et:tt}let p=r(s),m=p(s);return{c(){a&&a.c(),t=P(),o=C("h2"),l=k("Hey "),n=k(i),f=k(" !"),y=P(),m.c(),d=P(),c=C("button"),w=k("Logout")},l(e){a&&a.l(e),t=W(e),o=E(e,"H2",{});var _=I(o);l=v(_,"Hey "),n=v(_,i),f=v(_," !"),_.forEach(u),y=W(e),m.l(e),d=W(e),c=E(e,"BUTTON",{});var T=I(c);w=v(T,"Logout"),T.forEach(u)},m(e,_){a&&a.m(e,_),h(e,t,_),h(e,o,_),b(o,l),b(o,n),b(o,f),h(e,y,_),m.m(e,_),h(e,d,_),h(e,c,_),b(c,w),L||(H=D(c,"click",s[4]),L=!0)},p(e,_){e[0].name=="\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440 \u0420\u0443\u0434\u0438\u043D"?a?a.p(e,_):(a=B(e),a.c(),a.m(t.parentNode,t)):a&&(a.d(1),a=null),_&1&&i!==(i=e[0].name+"")&&R(n,i),p===(p=r(e))&&m?m.p(e,_):(m.d(1),m=p(e),m&&(m.c(),m.m(d.parentNode,d)))},d(e){a&&a.d(e),e&&u(t),e&&u(o),e&&u(y),m.d(e),e&&u(d),e&&u(c),L=!1,H()}}}function B(s){let t,o,l;return{c(){t=C("h2"),o=k("dd "),l=k(s[2])},l(i){t=E(i,"H2",{});var n=I(t);o=v(n,"dd "),l=v(n,s[2]),n.forEach(u)},m(i,n){h(i,t,n),b(t,o),b(t,l)},p(i,n){n&4&&R(l,i[2])},d(i){i&&u(t)}}}function tt(s){let t,o;return{c(){t=C("img"),this.h()},l(l){t=E(l,"IMG",{src:!0,alt:!0}),this.h()},h(){M(t.src,o="https://source.unsplash.com/random/400x300")||N(t,"src",o),N(t,"alt","Random Photo")},m(l,i){h(l,t,i)},p:U,d(l){l&&u(t)}}}function et(s){let t,o;return{c(){t=C("img"),this.h()},l(l){t=E(l,"IMG",{src:!0,alt:!0}),this.h()},h(){M(t.src,o=s[0].picture)||N(t,"src",o),N(t,"alt",A.name)},m(l,i){h(l,t,i)},p(l,i){i&1&&!M(t.src,o=l[0].picture)&&N(t,"src",o)},d(l){l&&u(t)}}}function lt(s){let t,o,l,i,n,f,y,d,c,w;function L(r,p){return r[1]?x:$}let H=L(s),a=H(s);return{c(){t=C("h1"),o=k("Welcome to SvelteKit"),l=P(),i=C("p"),n=k("Visit "),f=C("a"),y=k("kit.svelte.dev"),d=k(` to read the
  documentation`),c=P(),a.c(),w=V(),this.h()},l(r){t=E(r,"H1",{});var p=I(t);o=v(p,"Welcome to SvelteKit"),p.forEach(u),l=W(r),i=E(r,"P",{});var m=I(i);n=v(m,"Visit "),f=E(m,"A",{href:!0});var e=I(f);y=v(e,"kit.svelte.dev"),e.forEach(u),d=v(m,` to read the
  documentation`),m.forEach(u),c=W(r),a.l(r),w=V(),this.h()},h(){N(f,"href","https://kit.svelte.dev")},m(r,p){h(r,t,p),b(t,o),h(r,l,p),h(r,i,p),b(i,n),b(i,f),b(f,y),b(i,d),h(r,c,p),a.m(r,p),h(r,w,p)},p(r,[p]){H===(H=L(r))&&a?a.p(r,p):(a.d(1),a=H(r),a&&(a.c(),a.m(w.parentNode,w)))},i:U,o:U,d(r){r&&u(t),r&&u(l),r&&u(i),r&&u(c),a.d(r),r&&u(w)}}}let it="http://localhost:1880/apites";function ot(s,t,o){let l,i;K(s,A,c=>o(0,l=c)),K(s,O,c=>o(1,i=c));let n,f;z(async()=>{n=await G.createClient(),O.set(await n.isAuthenticated()),A.set(await n.getUser()),await fetch(it).then(c=>c.text()).then(c=>o(2,f=c))});function y(){G.loginWithPopup(n)}function d(){G.logout(n)}return s.$$.update=()=>{s.$$.dirty&3&&i&&console.log(l)},[l,i,f,y,d]}class nt extends j{constructor(t){super();J(this,t,ot,lt,Y,{})}}export{nt as default};