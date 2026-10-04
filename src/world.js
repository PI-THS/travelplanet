/* ======================= 旅遊星球：島嶼地圖 ======================= */
// 地圖材料來自「真．旅遊星球」（THS/game/index.html 嘅 LAYOUTS 圓形島）：
// 餐廳、服務中心、市場、農場、池塘、飛碟站、碼頭、酒店、摩天輪（樂園）、展覽廳（博物館）、燈塔、中央廣場。
// 座標＝原版圓形島 ×WS；建築大細按小朋友比例重畫（全部 three.js 即時砌，冇圖片）。
const WS=2.2;
const WP=(x,z)=>[x*WS,z*WS];
const ISL_R=45;
const islR=a=>ISL_R*(1+0.035*Math.sin(3*a+1)+0.025*Math.sin(5*a+2)+0.015*Math.sin(9*a));
const islPoly=(extra,n=160)=>{const pts=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2,r=islR(a)+extra;pts.push([Math.cos(a)*r,Math.sin(a)*r]);}return pts;};

// ---- 場景 ----
const wCanvas=$('#c');
const wRenderer=new THREE.WebGLRenderer({canvas:wCanvas,antialias:true,powerPreference:'high-performance'});
const wIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
let wPR=Math.min(window.devicePixelRatio||1,wIOS?1.5:2);
wRenderer.setPixelRatio(wPR);wRenderer.setSize(innerWidth,innerHeight,false);
wRenderer.shadowMap.enabled=true;wRenderer.shadowMap.type=THREE.PCFSoftShadowMap;
wRenderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();
scene.background=new THREE.Color(0xbfe7f6);
scene.fog=new THREE.Fog(0xcdeaf6,70,190);
const camera=new THREE.PerspectiveCamera(46,innerWidth/innerHeight,0.5,400);
const hemi=new THREE.HemisphereLight(0xffffff,0x9bc08a,1.55);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff0d6,2.3);sun.position.set(30,48,22);sun.castShadow=true;
sun.shadow.mapSize.set(wIOS?1024:2048,wIOS?1024:2048);
Object.assign(sun.shadow.camera,{left:-38,right:38,top:38,bottom:-38,near:1,far:130});sun.shadow.bias=-0.0006;sun.shadow.normalBias=0.04;
scene.add(sun);scene.add(sun.target);
function wResize(){wRenderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}
addEventListener('resize',wResize);

// ---- 材質／造型小工具 ----
const wMC=new Map();
function wM(col,o={}){const k=col+JSON.stringify(o);if(wMC.has(k))return wMC.get(k);const m=new THREE.MeshStandardMaterial({color:col,roughness:.78,metalness:0,...o});wMC.set(k,m);return m;}
function wAdd(par,geo,mat,x=0,y=0,z=0,o={}){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o.r)m.rotation.set(o.r[0],o.r[1],o.r[2]);if(o.s){if(typeof o.s==='number')m.scale.setScalar(o.s);else m.scale.set(o.s[0],o.s[1],o.s[2]);}
  m.castShadow=o.cast!==false;m.receiveShadow=o.recv!==false;par.add(m);return m;}
const wBoxG=new THREE.BoxGeometry(1,1,1),wSphG=new THREE.SphereGeometry(1,28,18),wCylG=new THREE.CylinderGeometry(1,1,1,28),wConeG=new THREE.ConeGeometry(1,1,28);
// 長方體：底部喺 y0
const wBx=(par,w,h,d,col,x,y0,z,o={})=>wAdd(par,wBoxG,typeof col==='object'?col:wM(col),x,y0+h/2,z,{...o,s:[w,h,d]});
const wCy=(par,r,h,col,x,y0,z,o={})=>wAdd(par,wCylG,typeof col==='object'?col:wM(col),x,y0+h/2,z,{...o,s:[r,h,r]});
const wSp=(par,r,col,x,y,z,o={})=>wAdd(par,wSphG,typeof col==='object'?col:wM(col),x,y,z,{...o,s:o.s||r});
const wCone=(par,r,h,col,x,y0,z,o={})=>wAdd(par,wConeG,typeof col==='object'?col:wM(col),x,y0+h/2,z,{...o,s:[r,h,r]});
// 人字屋頂（沿 x 方向，寬 w、深 d、高 h）
function wRoof(par,w,d,h,col,y0,over=0.5){const g=new THREE.Group();const half=w/2+over,len=Math.hypot(half,h),ang=Math.atan2(h,half);
  for(const s of [-1,1]){wBx(g,len,0.28,d+over*1.2,col,s*half/2,0,0,{r:[0,0,-s*ang]}).position.y=h/2+0.1;}
  // 山牆
  const sh=new THREE.Shape();sh.moveTo(-w/2,0);sh.lineTo(w/2,0);sh.lineTo(0,h);sh.closePath();
  for(const s of [-1,1]){const gm=new THREE.Mesh(new THREE.ShapeGeometry(sh),wM(0xfff2dc,{side:THREE.DoubleSide}));gm.position.set(0,0.05,s*d/2);gm.castShadow=true;g.add(gm);}
  g.position.y=y0;par.add(g);return g;}
// 窗
function wWin(par,x,y,z,w=1.1,h=1.2,ry=0,lit=false){const g=new THREE.Group();wBx(g,w+.24,h+.24,.12,0xffffff,0,0,0);wBx(g,w,h,.16,lit?0xffe9a0:0x9fd8f2,0,.0,0.02).position.y=h/2+.0;g.children[0].position.y=h/2;g.position.set(x,y,z);g.rotation.y=ry;par.add(g);return g;}
function wDoor(par,x,z,col=0x8a5a3b,w=1.5,h=2.3){wBx(par,w+.3,h+.15,.16,0xffffff,x,0,z);wBx(par,w,h,.2,col,x,0,z+.03);wSp(par,.09,0xffd23f,x+w*.3,h*.45,z+.17);return par;}
// 條紋雨篷
function wAwning(par,w,d,x,y,z,c1=0xe53935,c2=0xffffff,n=7,tilt=.38){const g=new THREE.Group();const sw=w/n;
  for(let i=0;i<n;i++){wBx(g,sw,.1,d,i%2?c2:c1,-w/2+sw*(i+.5),0,0);}g.rotation.x=tilt;g.position.set(x,y,z);
  for(let i=0;i<n;i++){const t=wBx(g,sw,.28,.06,i%2?c2:c1,-w/2+sw*(i+.5),-.2,d/2);}par.add(g);return g;}

// ---- 碰撞 ----
const wColl=[];   // {x,z,r}
function wCircle(x,z,r){wColl.push({x,z,r});}
function wBoxColl(cx,cz,w,d,rot){const n=Math.max(1,Math.round(Math.max(w,d)/Math.min(w,d))),r=Math.min(w,d)/2;
  for(let i=0;i<n;i++){const t=n===1?0:((i/(n-1))-.5)*(Math.max(w,d)-2*r);const lx=w>=d?t:0,lz=w>=d?0:t;wCircle(cx+lx*Math.cos(rot)+lz*Math.sin(rot),cz-lx*Math.sin(rot)+lz*Math.cos(rot),r*0.96);}}

// ---- 地面 ----
function wShapeMesh(pts,mat,y,recv=true){const sh=new THREE.Shape();pts.forEach((p,i)=>i?sh.lineTo(p[0],-p[1]):sh.moveTo(p[0],-p[1]));sh.closePath();
  const m=new THREE.Mesh(new THREE.ShapeGeometry(sh,1),mat);m.rotation.x=-Math.PI/2;m.position.y=y;m.receiveShadow=recv;scene.add(m);return m;}
function wTex(w,h,fn,rep=1){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');fn(x,w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;if(rep!==1)t.repeat.set(rep,rep);return t;}
const wRng=(()=>{let s=20261002;return ()=>{s=(s*16807)%2147483647;return (s-1)/2147483646;};})();

// 水
const waterTex=wTex(256,256,(x,w,h)=>{x.fillStyle='#4fc3e8';x.fillRect(0,0,w,h);x.strokeStyle='rgba(255,255,255,.38)';x.lineWidth=3;x.lineCap='round';for(let i=0;i<26;i++){const px=Math.random()*w,py=Math.random()*h;x.beginPath();x.moveTo(px-18,py);x.quadraticCurveTo(px,py-7,px+18,py);x.stroke();}},1);
waterTex.repeat.set(26,26);
const wWater=new THREE.Mesh(new THREE.PlaneGeometry(520,520),new THREE.MeshStandardMaterial({map:waterTex,roughness:.35,metalness:0}));wWater.rotation.x=-Math.PI/2;wWater.position.y=-.35;wWater.receiveShadow=true;scene.add(wWater);
const wShallow=[[9,.45,0x7fe3ef],[5,.55,0xa8f0f0]].map(([e,op,col],i)=>{const m=wShapeMesh(islPoly(e),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:op,depthWrite:false}),-.3+i*.05,false);return m;});
// 島身（泥邊）、沙灘、草地
{const sh=new THREE.Shape();islPoly(3.4).forEach((p,i)=>i?sh.lineTo(p[0],-p[1]):sh.moveTo(p[0],-p[1]));sh.closePath();
  const g=new THREE.ExtrudeGeometry(sh,{depth:2.2,bevelEnabled:false,curveSegments:1});const m=new THREE.Mesh(g,wM(0xd9b27a));m.rotation.x=-Math.PI/2;m.position.y=-2.25;m.receiveShadow=true;scene.add(m);}
wShapeMesh(islPoly(3.4),wM(0xf7e4b0),-.04);
const grassTex=wTex(512,512,(x,w,h)=>{x.fillStyle='#8fd36a';x.fillRect(0,0,w,h);for(let i=0;i<420;i++){x.fillStyle=Math.random()<.5?'rgba(120,190,80,.35)':'rgba(180,235,120,.35)';x.beginPath();x.arc(Math.random()*w,Math.random()*h,6+Math.random()*26,0,7);x.fill();}
  for(let i=0;i<900;i++){x.strokeStyle='rgba(70,150,60,.35)';x.lineWidth=2;const px=Math.random()*w,py=Math.random()*h;x.beginPath();x.moveTo(px,py);x.lineTo(px+2,py-7);x.stroke();}},1);
grassTex.repeat.set(1/14,1/14);
wShapeMesh(islPoly(0),new THREE.MeshStandardMaterial({map:grassTex,roughness:.95}),0.0);

// ---- 布局 ----
const SPOTS={rest:WP(8,-6),svc:WP(-7,-6),mkt:WP(9,6),farm:WP(-12.5,1.5),pond:WP(5,13),ufo:WP(-4,14),pier:[islR(0)-1.2,0],hotel:[-18,-28],wheel:[21,-28],dome:[0,-29],pond2:[-26,17],light:WP(15,-9)};
const wFaceO=(x,z)=>Math.atan2(-x,-z);   // 面向廣場（原點）
const PLAZA_R=6.4;
const wPaths=[];   // 路線段，種樹唔好壓住
const wClear=[];   // 建築範圍，種樹唔好壓住 {x,z,r}
function wPlace(name,build,x,z,rot,clearR){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;scene.add(g);const info=build(g)||{};g.userData.name=name;wClear.push({x,z,r:clearR||6});return {g,...info};}
const wLocal=(b,lx,lz)=>[b.g.position.x+lx*Math.cos(b.g.rotation.y)+lz*Math.sin(b.g.rotation.y),b.g.position.z-lx*Math.sin(b.g.rotation.y)+lz*Math.cos(b.g.rotation.y)];
const wAnim=[];   // 每格執行嘅動畫 (t,dt)=>

// 廣場＋噴水池
function wPlaza(){const tex=wTex(512,512,(x,w,h)=>{x.fillStyle='#efe0bd';x.fillRect(0,0,w,h);const c=w/2;
    for(let r=256;r>0;r-=32){for(let a=0;a<Math.PI*2;a+=Math.PI*2/Math.max(8,Math.round(r/6))){x.fillStyle=((r/32|0)+(a*10|0))%2?'#e6d3a6':'#f4e7c8';x.beginPath();x.arc(c,c,r,a,a+Math.PI*2/Math.max(8,Math.round(r/6)));x.arc(c,c,Math.max(0,r-32),a+Math.PI*2/Math.max(8,Math.round(r/6)),a,true);x.fill();}}
    x.lineWidth=14;x.strokeStyle='#ffb3c7';x.beginPath();x.arc(c,c,226,0,7);x.stroke();x.strokeStyle='#ffd23f';x.beginPath();x.arc(c,c,200,0,7);x.stroke();x.strokeStyle='#7ed6df';x.beginPath();x.arc(c,c,174,0,7);x.stroke();});
  const m=new THREE.Mesh(new THREE.CircleGeometry(PLAZA_R,64),new THREE.MeshStandardMaterial({map:tex,roughness:.9}));m.rotation.x=-Math.PI/2;m.position.y=.04;m.receiveShadow=true;scene.add(m);
  const f=new THREE.Group();scene.add(f);
  wCy(f,2.1,.7,0xbfc7d6,0,0,0);wCy(f,1.82,.12,0x6fd0f0,0,.64,0,{recv:true});wCy(f,.5,1.5,0xd7dde8,0,.3,0);wCy(f,1.0,.22,0xbfc7d6,0,1.6,0);wCy(f,.78,.1,0x6fd0f0,0,1.78,0);wSp(f,.32,0xffe27a,0,2.55,0,{cast:false});
  const jets=[];for(let i=0;i<14;i++){jets.push(wSp(f,.12,wM(0xbff3ff,{emissive:0x6fd0f0,emissiveIntensity:.5}),0,2,0,{cast:false}));}
  const ring=[];for(let i=0;i<10;i++){ring.push(wSp(f,.1,wM(0xbff3ff,{emissive:0x6fd0f0,emissiveIntensity:.5}),0,1,0,{cast:false}));}
  wAnim.push((t)=>{jets.forEach((j,i)=>{const p=((t*.9+i/jets.length)%1);j.position.set(Math.cos(i*2.4)*p*.5,1.9+Math.sin(p*Math.PI)*1.1,Math.sin(i*2.4)*p*.5);const s=.12*(1-p*.5);j.scale.setScalar(s);});
    ring.forEach((j,i)=>{const p=((t*.8+i/ring.length)%1),a=i/ring.length*Math.PI*2;j.position.set(Math.cos(a)*(.6+p*1.1),1.85+Math.sin(p*Math.PI)*.7-p*.5,Math.sin(a)*(.6+p*1.1));j.scale.setScalar(.1);});});
  wCircle(0,0,2.25);
  // 長椅、街燈、花槽
  for(const a of [Math.PI*.25,Math.PI*.75,Math.PI*1.25,Math.PI*1.75]){const bx=Math.cos(a)*(PLAZA_R-.9),bz=Math.sin(a)*(PLAZA_R-.9);const b=new THREE.Group();b.position.set(bx,0,bz);b.rotation.y=Math.atan2(-bx,-bz);scene.add(b);
    wBx(b,2,.18,.7,0xa8683b,0,.5,0);wBx(b,2,.7,.14,0xa8683b,0,.62,-.3);wBx(b,.14,.5,.6,0x6a6f7a,-.85,0,0);wBx(b,.14,.5,.6,0x6a6f7a,.85,0,0);wCircle(bx,bz,.9);}
  for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){const lx=Math.cos(a+.0)*(PLAZA_R+.2),lz=Math.sin(a)*(PLAZA_R+.2);const l=new THREE.Group();l.position.set(lx,0,lz);scene.add(l);
    wCy(l,.12,3.2,0x4a5568,0,0,0);wSp(l,.38,wM(0xfff2b0,{emissive:0xffe27a,emissiveIntensity:.6}),0,3.35,0,{cast:false});wCircle(lx,lz,.3);}}
wPlaza();

// ---- 餐廳 ----
const BLD={};
BLD.rest=wPlace('rest',g=>{wBx(g,7.4,3.6,5.6,0xfff1d6,0,0,0);wRoof(g,7.4,5.6,2.2,0xe0524a,3.6,.5);wDoor(g,-1.6,2.8);wWin(g,1.5,1.2,2.82,1.5,1.3);wWin(g,2.9,1.2,2.82,1.1,1.3,0,true);
  wAwning(g,3.6,1.5,-1.6,3.1,3.3,0xe53935,0xffffff,8,.5);
  // 廚師帽招牌
  const s=new THREE.Group();s.position.set(2.4,5.6,0);g.add(s);wCy(s,.55,.5,0xffffff,0,0,0);for(const [x,z] of [[-.35,0],[.35,0],[0,.35],[0,-.35]])wSp(s,.42,0xffffff,x,.85,z);wSp(s,.5,0xffffff,0,1.1,0);
  // 室外枱
  for(const x of [3.6,-4.8]){const t=new THREE.Group();t.position.set(x,0,4.6);g.add(t);wCy(t,.9,.12,0xfff7e6,0,.95,0);wCy(t,.1,.95,0x8a5a3b,0,0,0);for(const sx of [-1.3,1.3])wCy(t,.38,.5,0xff8a65,sx,0,0);wCy(t,.05,2.3,0xffffff,0,0,0).visible=false;
    wCone(t,1.5,.8,x>0?0xff7043:0x42a5f5,0,2.0,0);wCy(t,.05,1.3,0xdddddd,0,.95,0);wCircle(g.position.x+Math.cos(g.rotation.y)*x+Math.sin(g.rotation.y)*4.6,g.position.z-Math.sin(g.rotation.y)*x+Math.cos(g.rotation.y)*4.6,.9);}
  wBoxColl(g.position.x,g.position.z,7.4,5.6,g.rotation.y);return {door:[0,4.8]};},SPOTS.rest[0],SPOTS.rest[1],wFaceO(...SPOTS.rest),6.5);
// ---- 服務中心 ----
BLD.svc=wPlace('svc',g=>{wBx(g,7,3.4,5,0xdcefff,0,0,0);wBx(g,7.6,.4,5.6,0x5b9bd5,0,3.4,0);wBx(g,7.2,.3,5.2,0xffffff,0,3.8,0);wDoor(g,0,2.5,0x2f78c4,1.8,2.4);wWin(g,-2.4,1.1,2.52,1.6,1.3,0,true);wWin(g,2.4,1.1,2.52,1.6,1.3,0,true);
  // 大「i」招牌
  const s=new THREE.Group();s.position.set(0,5.7,1.2);g.add(s);wCy(s,1.25,.4,0x2f78c4,0,0,0,{r:[Math.PI/2,0,0]}).position.y=0;s.children[0].position.y=0;
  wSp(s,.2,0xffffff,0,.62,.28,{s:[.2,.2,.1]});wBx(s,.34,.9,.1,0xffffff,0,-.62,.27);
  wCy(g,.07,2.2,0xffffff,3.7,3.8,1.6);wBx(g,1.1,.65,.05,0xffd23f,4.25,5.2,1.6);
  wBoxColl(g.position.x,g.position.z,7,5,g.rotation.y);return {door:[0,4.3]};},SPOTS.svc[0],SPOTS.svc[1],wFaceO(...SPOTS.svc),6);
// ---- 市場 ----
BLD.mkt=wPlace('mkt',g=>{const cols=[[0xe53935,'apple',0xff4d4d],[0xff9800,'orange',0xffa726],[0x43a047,'veg',0x7bd250]];
  cols.forEach(([c,k,fc],i)=>{const x=(i-1)*3.4;const s=new THREE.Group();s.position.set(x,0,0);g.add(s);
    for(const px of [-1.4,1.4])for(const pz of [-1,1])wCy(s,.08,2.6,0xb98a5e,px,0,pz);
    wBx(s,3.1,.9,1.2,0xc9965f,0,0,0.4);wBx(s,3.3,.1,1.4,0xe0b27c,0,.9,0.4);
    wAwning(s,3.4,2.4,0,2.7,.1,c,0xffffff,6,.22);
    for(let j=0;j<9;j++){const px=-1.2+(j%5)*.6+(j>4?.3:0),pz=.4+(j>4?.28:-.12);const f=k==='veg'?wSp(s,.2,j%2?0x7bd250:0xff7043,px,1.16+(j>4?.1:0),pz):wSp(s,.2,fc,px,1.16+(j>4?.1:0),pz);}
    wBx(s,.9,.55,.7,0xb98a5e,1.9,0,1.2);wSp(s,.2,fc,1.8,.7,1.2);wSp(s,.2,fc,2.0,.7,1.25);});
  wBoxColl(g.position.x,g.position.z,10.2,2.4,g.rotation.y);return {door:[0,3.2]};},SPOTS.mkt[0],SPOTS.mkt[1],wFaceO(...SPOTS.mkt),6.5);
// ---- 農場（紅穀倉＋田＋稻草人＋風車） ----
BLD.farm=wPlace('farm',g=>{const b=new THREE.Group();b.position.set(-3.6,0,-2);g.add(b);wBx(b,4.6,3.2,4,0xd8453a,0,0,0);wRoof(b,4.6,4,1.8,0x8d3a2f,3.2,.4);wBx(b,2,2.4,.14,0xffffff,0,0,2.02);wBx(b,1.8,2.2,.16,0xc23a30,0,.05,2.03);
  const x1=new THREE.Mesh(new THREE.BoxGeometry(2.3,.14,.1),wM(0xffffff));x1.position.set(0,1.2,2.12);x1.rotation.z=.8;b.add(x1);const x2=x1.clone();x2.rotation.z=-.8;b.add(x2);
  wCy(b,.9,3.4,0xcfd8dc,-3.2,0,-.5);wCone(b,1.1,.9,0xd8453a,-3.2,3.4,-.5);
  // 田
  const f=new THREE.Group();f.position.set(1.6,0,3.2);g.add(f);wBx(f,7.4,.25,5.4,0x7a5236,0,0,0);
  for(let r=0;r<4;r++)for(let c=0;c<7;c++){const px=-3+c*1,pz=-2+r*1.3;const kind=r%2;if(kind){wSp(f,.3,0x58b947,px,.5,pz,{s:[.32,.3,.32]});wCone(f,.1,.4,0xff8a1f,px,.2,pz+.15,{r:[Math.PI,0,0]});}else{wSp(f,.26,0x6fcf5a,px,.5,pz);wSp(f,.12,0xff5252,px+.12,.65,pz+.1);}}
  for(let i=0;i<9;i++){wBx(f,.14,.9,.14,0xb98a5e,-3.9+i*.98,0,2.85);wBx(f,.14,.9,.14,0xb98a5e,-3.9+i*.98,0,-2.85);}wBx(f,7.8,.12,.1,0xb98a5e,0,.5,2.85);wBx(f,7.8,.12,.1,0xb98a5e,0,.5,-2.85);
  // 稻草人
  const sc=new THREE.Group();sc.position.set(4.6,0,.6);f.add(sc);wCy(sc,.07,1.8,0x8a5a3b,0,0,0);wBx(sc,1.3,.1,.1,0x8a5a3b,0,1.3,0);wCy(sc,.28,.45,0xff9f43,0,.9,0);wSp(sc,.3,0xffe0b8,0,1.9,0);wCy(sc,.42,.06,0xe0b050,0,2.1,0);wCone(sc,.3,.34,0xe0b050,0,2.12,0);
  // 風車
  const w=new THREE.Group();w.position.set(-6.5,0,3.5);g.add(w);wCone(w,1.25,4.2,0xf5ece0,0,0,0).scale.set(1.25,4.2,1.25);wCone(w,1.3,1.1,0xc65d4a,0,4.2,0);
  const bl=new THREE.Group();bl.position.set(0,4.0,1.0);w.add(bl);for(let i=0;i<4;i++){const a=i*Math.PI/2;const arm=wBx(bl,.25,3.4,.1,0x8a5a3b,0,0,0);arm.position.set(-Math.sin(a)*1.7,Math.cos(a)*1.7,0);arm.rotation.z=a;wBx(bl,.9,1.9,.06,0xffffff,0,0,0).position.set(-Math.sin(a)*2.0-Math.cos(a)*.5,Math.cos(a)*2.0-Math.sin(a)*.5,.06);bl.children[bl.children.length-1].rotation.z=a;}
  wSp(bl,.3,0xd8453a,0,0,.1);wAnim.push((t)=>{bl.rotation.z=-t*.6;});
  wBoxColl(g.position.x,g.position.z,0,0,0);
  for(const [lx,lz,r] of [[-3.6,-2,2.6],[-6.5,3.5,1.4]]){const p=wLocal({g},lx,lz);wCircle(p[0],p[1],r);}
  return {door:[-3.6,1.2]};},SPOTS.farm[0],SPOTS.farm[1],wFaceO(...SPOTS.farm),9);
// ---- 池塘 ----
const pondBuild=g=>{const rim=wCy(g,5.5,.16,0xe9d9a8,0,0,0);rim.position.y=.07;const w=wCy(g,4.8,.12,0x57c8f0,0,.02,0,{recv:true});w.material=new THREE.MeshStandardMaterial({color:0x57c8f0,roughness:.18,metalness:.1,transparent:true,opacity:.9});w.position.y=.16;
  for(let i=0;i<7;i++){const a=i*2.3+.4,r=1+((i*37)%30)/10;const lp=wCy(g,.55,.05,0x4caf50,Math.cos(a)*r,.18,Math.sin(a)*r);if(i%3===0){wSp(lp,.2,0xff8ab5,0,.5,0,{s:[.2,.14,.2]});}}
  const ducks=[];for(let i=0;i<3;i++){const d=new THREE.Group();wSp(d,.4,0xfff3a0,0,.3,0,{s:[.42,.3,.5]});wSp(d,.22,0xfff3a0,0,.62,.3);wCone(d,.1,.3,0xff9a1f,0,.55,.52,{r:[Math.PI/2,0,0]});wSp(d,.04,0x222222,.1,.68,.42);wSp(d,.04,0x222222,-.1,.68,.42);g.add(d);ducks.push(d);}
  wAnim.push((t)=>{ducks.forEach((d,i)=>{const a=t*.25*(i%2?-1:1)+i*2.1,r=2.2+i*.5;d.position.set(Math.cos(a)*r,.22+Math.sin(t*2+i)*.03,Math.sin(a)*r);d.rotation.y=-a+(i%2?-1:1)*Math.PI/2+Math.PI;});});
  for(let i=0;i<9;i++){const a=i*.7+3.3,r=5.1+(i%2)*.4;const px=Math.cos(a)*r,pz=Math.sin(a)*r;if(Math.abs(Math.atan2(pz,px)-Math.PI/2)<.7)continue;wCy(g,.05,1.5,0x6aa84f,px,0,pz);wCy(g,.11,.45,0x8d5a3a,px,1.2,pz);}
  wCy(g,.15,.7,0xb98a5e,3.5,0,-4.2);wBx(g,1.6,.14,1.1,0xb98a5e,3.5,.8,-4.2);
  return {door:[0,-6],water:{x:g.position.x,z:g.position.z,r:5.0}};};
BLD.pond=wPlace('pond',pondBuild,SPOTS.pond[0],SPOTS.pond[1],wFaceO(...SPOTS.pond),8);
BLD.pond2=wPlace('pond2',pondBuild,SPOTS.pond2[0],SPOTS.pond2[1],wFaceO(...SPOTS.pond2),8);
const PONDS=[BLD.pond.water,BLD.pond2.water];
// ---- 飛碟站 ----
BLD.ufo=wPlace('ufo',g=>{wCy(g,5,.18,0x4b5563,0,0,0);const rg=new THREE.Mesh(new THREE.TorusGeometry(4.2,.12,8,48),wM(0xffd23f));rg.rotation.x=Math.PI/2;rg.position.y=.2;g.add(rg);
  const s=new THREE.Group();s.position.set(0,2.4,0);g.add(s);
  wSp(s,1,wM(0xc9d3e0,{metalness:.65,roughness:.28}),0,0,0,{s:[3.1,.8,3.1]});const dome=wSp(s,1.3,new THREE.MeshStandardMaterial({color:0x8fe3ff,roughness:.05,metalness:.1,transparent:true,opacity:.62}),0,.5,0,{s:[1.4,1.2,1.4]});
  wSp(s,.4,0x7ed957,0,.55,0);wSp(s,.12,0x222222,-.12,.7,.28);wSp(s,.12,0x222222,.12,.7,.28);
  const lights=[];for(let i=0;i<10;i++){const a=i/10*Math.PI*2;lights.push(wSp(s,.17,wM(0xffffff,{emissive:0xffffff,emissiveIntensity:1}),Math.cos(a)*3.0,-.1,Math.sin(a)*3.0,{cast:false}));}
  for(const a of [0,2.1,4.2])wCy(g,.12,1.7,0x9aa5b4,Math.cos(a)*1.8,.1,Math.sin(a)*1.8,{r:[Math.sin(a)*.3,0,-Math.cos(a)*.3]});
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(1.6,2.6,2.3,24,1,true),new THREE.MeshBasicMaterial({color:0xfff2a0,transparent:true,opacity:.22,side:THREE.DoubleSide,depthWrite:false}));beam.position.set(0,1.3,0);g.add(beam);
  wAnim.push((t)=>{s.position.y=2.6+Math.sin(t*1.6)*.18;s.rotation.y=t*.3;lights.forEach((l,i)=>{const on=(Math.floor(t*4)+i)%3===0;l.material=on?wM(0xffe27a,{emissive:0xffd23f,emissiveIntensity:1.3}):wM(0xff7ad9,{emissive:0xff5ac8,emissiveIntensity:.8});});beam.material.opacity=.16+Math.sin(t*3)*.06;});
  wCircle(g.position.x,g.position.z,2.9);return {door:[0,4.2]};},SPOTS.ufo[0],SPOTS.ufo[1],wFaceO(...SPOTS.ufo),6.5);
// ---- 酒店 ----
BLD.hotel=wPlace('hotel',g=>{wBx(g,9,9,6.4,0xffd9e3,0,0,0);wBx(g,9.6,.5,7,0xffffff,0,9,0);wBx(g,9.6,.7,.3,0xff8fb1,0,9.5,3.3);
  for(let f=0;f<3;f++)for(let i=0;i<4;i++){if(f===0&&(i===1||i===2))continue;wWin(g,-3.3+i*2.2,1.3+f*2.8,3.22,1.1,1.5,0,(i+f)%2===0);}
  wDoor(g,0,3.2,0x7a4b8c,2.2,2.5);wBx(g,5.2,.25,2.2,0xffd23f,0,3.2,4.2);for(const x of [-2.4,2.4]){wCy(g,.14,3.2,0xffffff,x,0,5.1);wSp(g,.3,wM(0xfff2b0,{emissive:0xffe27a,emissiveIntensity:.7}),x,3.5,5.1,{cast:false});}
  wBx(g,2.2,.04,3,0xd9363e,0,.04,5.4);
  wBx(g,4.4,1.2,.3,0x6a3d7c,0,10,3.0);wCy(g,.07,2,0xffffff,-4.2,9.2,-2.8);wBx(g,1.2,.7,.05,0xff5a7a,-3.6,10.4,-2.8);
  wBoxColl(g.position.x,g.position.z,9,6.4,g.rotation.y);return {door:[0,6]};},SPOTS.hotel[0],SPOTS.hotel[1],wFaceO(...SPOTS.hotel),8);
// ---- 樂園（摩天輪＋氣球＋馬戲帳篷） ----
BLD.wheel=wPlace('wheel',g=>{const W=new THREE.Group();W.position.set(0,0,-1);g.add(W);
  const R=6,hub=7.6;for(const s of [-1,1]){wBx(W,.3,hub+.4,.3,0xe8edf5,s*1.1,0,s*1.4,{r:[0,0,s*.25]});wBx(W,.3,hub+.4,.3,0xe8edf5,s*1.1+.0,0,-s*1.4,{r:[0,0,s*.25]});}
  const wheel=new THREE.Group();wheel.position.set(0,hub,0);W.add(wheel);
  const rim=new THREE.Mesh(new THREE.TorusGeometry(R,.2,10,64),wM(0xff6f91));rim.castShadow=true;wheel.add(rim);const rim2=new THREE.Mesh(new THREE.TorusGeometry(R*.5,.14,10,48),wM(0xffd23f));wheel.add(rim2);
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const sp=wBx(wheel,.12,R,.12,0xe8edf5,0,0,0);sp.position.set(Math.sin(a)*R/2,Math.cos(a)*R/2,0);sp.rotation.z=-a;}
  wSp(wheel,.5,0xffd23f,0,0,0);
  const gond=[];const gc=[0xff5252,0xffd23f,0x4dabf7,0x7bd250,0xff8ad8,0xff9f43,0x9b8cff,0x3ec1d3];
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2;const gg=new THREE.Group();gg.position.set(Math.sin(a)*R,Math.cos(a)*R,0);wheel.add(gg);wBx(gg,1.5,1.1,1.4,gc[i],0,-1.45,0);wBx(gg,1.6,.15,1.5,0xffffff,0,-.4,0);wCy(gg,.04,1,0xdddddd,-.6,-.5,0);wCy(gg,.04,1,0xdddddd,.6,-.5,0);gond.push(gg);}
  wAnim.push((t)=>{wheel.rotation.z=-t*.12;gond.forEach(gg=>{gg.rotation.z=t*.12;});});
  // 底座
  wBx(g,6.5,.4,3.4,0xcfd8dc,0,0,-1);
  // 馬戲帳篷
  const tt=new THREE.Group();tt.position.set(-8.4,0,1.2);g.add(tt);wCy(tt,2.6,2,0xff6f91,0,0,0);for(let i=0;i<8;i++)wBx(tt,.5,2,.04,0xffffff,0,0,0).visible=false;
  const cone=wCone(tt,2.9,2.4,0xffffff,0,2,0);const st=new THREE.Mesh(new THREE.ConeGeometry(2.9,2.4,24,1),new THREE.MeshStandardMaterial({color:0xffffff,map:wTex(128,128,(x,w,h)=>{for(let i=0;i<8;i++){x.fillStyle=i%2?'#ffffff':'#ff5252';x.fillRect(i*w/8,0,w/8,h);}}),roughness:.8}));st.position.set(0,3.2,0);st.castShadow=true;tt.add(st);cone.visible=false;
  wSp(tt,.3,0xffd23f,0,4.55,0);wCy(tt,.04,.9,0x8a5a3b,0,4.4,0);wBx(tt,.7,.45,.05,0xffd23f,.4,5.1,0);
  wBx(tt,1.3,1.8,.1,0x3c2a5c,0,0,2.6).visible=false;
  // 氣球
  const bg=new THREE.Group();bg.position.set(8.2,0,1.4);g.add(bg);wCy(bg,.06,1.4,0x8a5a3b,0,0,0);const bc=[0xff5252,0xffd23f,0x4dabf7,0x7bd250,0xff8ad8,0xff9f43];
  const balls=bc.map((c,i)=>{const b=wSp(bg,.62,wM(c,{roughness:.3}),Math.cos(i*1.05)*.9,3.2+(i%3)*.6,Math.sin(i*1.05)*.9);wCy(bg,.015,1.8,0xffffff,b.position.x*.5,1.4,b.position.z*.5,{r:[0,0,0]}).visible=false;return b;});
  wAnim.push((t)=>{balls.forEach((b,i)=>{b.position.y=3.2+(i%3)*.6+Math.sin(t*1.5+i)*.15;});});
  const p1=wLocal({g},-8.4,1.2),p2=wLocal({g},0,-1),p3=wLocal({g},8.2,1.4);wCircle(p1[0],p1[1],2.7);wCircle(p2[0],p2[1],2.3);wCircle(p3[0],p3[1],.7);
  return {door:[0,5.2]};},SPOTS.wheel[0],SPOTS.wheel[1],wFaceO(...SPOTS.wheel),12);
// ---- 展覽廳（博物館） ----
BLD.dome=wPlace('dome',g=>{wBx(g,11,.5,7.4,0xe0d6c0,0,0,0);wBx(g,10,.5,6.4,0xece3cf,0,.5,0);wBx(g,9,5,5.6,0xfaf3e3,0,1,-.2);
  for(let i=0;i<6;i++){wCy(g,.34,4.6,0xffffff,-3.75+i*1.5,1,3.0);wBx(g,.9,.3,.9,0xece3cf,-3.75+i*1.5,5.6,3.0);}
  wBx(g,9.6,.6,1.2,0xece3cf,0,5.9,3);
  const ps=new THREE.Shape();ps.moveTo(-5,0);ps.lineTo(5,0);ps.lineTo(0,1.7);ps.closePath();const pm=new THREE.Mesh(new THREE.ExtrudeGeometry(ps,{depth:1,bevelEnabled:false}),wM(0xfaf3e3));pm.position.set(0,6.5,2.6);pm.castShadow=true;g.add(pm);
  wSp(g,1,wM(0x2fb9a8,{roughness:.4,metalness:.2}),0,6.3,-.2,{s:[3,2.2,3]});wCy(g,3.1,.4,0xece3cf,0,6.1,-.2);wCone(g,.2,.9,0xffd23f,0,8.5,-.2);wSp(g,.22,0xffd23f,0,9.5,-.2);
  wDoor(g,0,2.9,0x6d4c41,2,3);wBx(g,3,.7,.06,0xffd23f,0,5.0,3.52);
  for(const x of [-3.4,3.4]){wBx(g,.8,2.2,.06,[0xff6f91,0x4dabf7][x>0?1:0],x,1.6,2.9);}
  for(let s=0;s<3;s++)wBx(g,4.6-s*.4,.22,1.4-s*.15,0xece3cf,0,s*.2,4.2+s*.45).visible=false;
  wBoxColl(g.position.x,g.position.z,10,6,g.rotation.y);return {door:[0,5.6]};},SPOTS.dome[0],SPOTS.dome[1],wFaceO(...SPOTS.dome),8);
// ---- 燈塔 ----
BLD.light=wPlace('light',g=>{for(let i=0;i<7;i++){const a=i*.9;wSp(g,.9,0xaab4c0,Math.cos(a)*2.4,.3,Math.sin(a)*2.4,{s:[1+(i%3)*.25,.6,1]});}
  const seg=[0xe53935,0xffffff,0xe53935,0xffffff];const geoT=h=>new THREE.CylinderGeometry(1,1,h,28);let y=.2;
  seg.forEach((c,i)=>{const r0=1.7-i*.2,r1=1.7-(i+1)*.2;const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r0,2.4,28),wM(c));m.position.y=y+1.2;m.castShadow=true;m.receiveShadow=true;g.add(m);y+=2.4;});
  wCy(g,1.5,.3,0x333a45,0,y,0);wCy(g,.9,1.6,wM(0xfff2a0,{emissive:0xffe27a,emissiveIntensity:.9}),0,y+.3,0);wCone(g,1.3,1.1,0xe53935,0,y+1.9,0);wSp(g,.2,0xffd23f,0,y+3.1,0);
  const beam=new THREE.Group();beam.position.set(0,y+1.1,0);g.add(beam);for(const s of [1,-1]){const b=new THREE.Mesh(new THREE.ConeGeometry(1.1,10,16,1,true),new THREE.MeshBasicMaterial({color:0xfff2a0,transparent:true,opacity:.2,side:THREE.DoubleSide,depthWrite:false}));b.rotation.z=-s*Math.PI/2;b.position.x=s*5.4;beam.add(b);}
  wAnim.push((t)=>{beam.rotation.y=t*.9;});wCircle(g.position.x,g.position.z,2.1);return {door:[2,4]};},SPOTS.light[0],SPOTS.light[1],wFaceO(...SPOTS.light),5);
// ---- 碼頭＋郵輪 ----
BLD.pier=wPlace('pier',g=>{g.rotation.y=0;const L=15,W=3.6;for(let i=0;i<L;i++)wBx(g,1.02,.18,W,i%2?0xc08850:0xb07a45,i+.3,.45,0);
  for(let i=0;i<=L;i+=3)for(const s of [-1,1]){wCy(g,.17,2.4,0x6d4c2e,i+.3,-1,s*(W/2-.05));if(i%3===0)wSp(g,.2,0xffffff,i+.3,1.5,s*(W/2-.05),{cast:false}).visible=false;}
  for(const s of [-1,1])wBx(g,L,.1,.1,0xffffff,L/2,1.05,s*(W/2-.05)).visible=false;
  // 船
  const b=new THREE.Group();b.position.set(L+3,0,6.2);g.add(b);
  const hull=wSp(b,1,0x2f6fd6,0,.3,0,{s:[5.5,1.4,2]});wBx(b,6,.14,2.4,0xffffff,0,1.0,0);wBx(b,3.4,1.5,2.0,0xffffff,-.4,1.1,0);wBx(b,3.2,.5,2.1,0x4dabf7,-.4,1.7,0);wBx(b,1.8,1.1,1.6,0xffffff,-.2,2.6,0);wCy(b,.45,1.4,0xe53935,.2,3.4,0);wCy(b,.5,.2,0x222222,.2,4.7,0);
  wCone(b,.35,.7,0xffd23f,5,.9,0,{r:[0,0,-Math.PI/2]}).visible=false;
  wAnim.push((t)=>{b.position.y=Math.sin(t*1.3)*.12-.2;b.rotation.z=Math.sin(t*1.1)*.03;b.rotation.x=Math.sin(t*.9)*.02;});
  return {door:[4,0],rect:{x0:0,x1:L+.5,hz:W/2}};},SPOTS.pier[0],SPOTS.pier[1],0,6);
BLD.pier.rect={x0:SPOTS.pier[0]+.1,x1:SPOTS.pier[0]+15.2,hz:1.8};
{const bp=wLocal(BLD.pier,18,6.2);wCircle(bp[0],bp[1],3);}

// ---- 路（廣場 → 各門口） ----
function wPath(x0,z0,x1,z1,w=2.4){const dx=x1-x0,dz=z1-z0,len=Math.hypot(dx,dz);const m=new THREE.Mesh(new THREE.PlaneGeometry(w,len),new THREE.MeshStandardMaterial({color:0xf2dcab,roughness:.95}));m.rotation.x=-Math.PI/2;m.rotation.z=Math.atan2(dx,dz)*0;
  m.rotation.set(-Math.PI/2,0,0);const holder=new THREE.Group();holder.position.set((x0+x1)/2,.03,(z0+z1)/2);holder.rotation.y=Math.atan2(dx,dz);holder.add(m);scene.add(holder);m.receiveShadow=true;
  const c=new THREE.Mesh(new THREE.CircleGeometry(w/2,20),m.material);c.rotation.x=-Math.PI/2;c.position.set(x1,.031,z1);scene.add(c);wPaths.push([x0,z0,x1,z1,w]);}
const NPC_SLOT={};   // 各建築門口前面嘅站位，之後 NPC 用
for(const k of ['rest','svc','mkt','farm','pond','pond2','ufo','hotel','wheel','dome','light']){const b=BLD[k];const d=b.door;const [dx,dz]=wLocal(b,d[0],d[1]);NPC_SLOT[k]=[dx,dz];
  const ang=Math.atan2(dz,dx),sx=Math.cos(ang)*(PLAZA_R-.6),sz=Math.sin(ang)*(PLAZA_R-.6);wPath(sx,sz,dx,dz);}
// 碼頭路
{const px=SPOTS.pier[0];wPath(Math.cos(0)*(PLAZA_R-.6),0,px+1,0,2.6);wPaths.push([PLAZA_R,0,px+1,0,2.6]);NPC_SLOT.pier=[px+8,0];}

// ---- 樹、花、石 ----
function wNearPath(x,z,m=1.8){for(const [x0,z0,x1,z1,w] of wPaths){const dx=x1-x0,dz=z1-z0,l2=dx*dx+dz*dz;let t=l2?((x-x0)*dx+(z-z0)*dz)/l2:0;t=Math.max(0,Math.min(1,t));const px=x0+dx*t,pz=z0+dz*t;if(Math.hypot(x-px,z-pz)<w/2+m)return true;}return false;}
function wFree(x,z,m=0){const a=Math.atan2(z,x),r=Math.hypot(x,z);if(r>islR(a)-1.8||r<PLAZA_R+1.8)return false;for(const c of wClear)if(Math.hypot(x-c.x,z-c.z)<c.r+m)return false;if(wNearPath(x,z,m+.4))return false;return true;}
{ // 樹
  const N=36,trunkG=new THREE.CylinderGeometry(.22,.32,1.6,8),balG=new THREE.IcosahedronGeometry(1,2),coneG=new THREE.ConeGeometry(1,1,9);
  const trunks=new THREE.InstancedMesh(trunkG,wM(0x8a5a3b),N),balls=new THREE.InstancedMesh(balG,new THREE.MeshStandardMaterial({color:0xffffff,roughness:.85}),N*2),cones=new THREE.InstancedMesh(coneG,new THREE.MeshStandardMaterial({color:0xffffff,roughness:.85}),N*2);
  const D=new THREE.Object3D();let nt=0,nb=0,nc=0;const greens=[0x5fbf55,0x6fcf5a,0x4fae4f,0x7bd250],pinks=[0xffb3d1,0xff9ec4],yel=[0xffd966];
  for(let tries=0;tries<2000&&nt<N;tries++){const a=wRng()*Math.PI*2,r=PLAZA_R+8+wRng()*(ISL_R-PLAZA_R-10);const x=Math.cos(a)*r,z=Math.sin(a)*r;if(!wFree(x,z,2.5))continue;if(wColl.some(c=>Math.hypot(x-c.x,z-c.z)<c.r+1.2))continue;
    let ok=true;for(let i=0;i<nt;i++){}const s=.8+wRng()*.7,kind=wRng();
    D.position.set(x,.8*s,z);D.rotation.set(0,wRng()*6,0);D.scale.set(s,s,s);D.updateMatrix();trunks.setMatrixAt(nt,D.matrix);
    if(kind<.55){const col=new THREE.Color(kind<.12?pinks[nt%2]:kind<.2?yel[0]:greens[nt%4]);D.position.set(x,2.2*s+.5,z);D.scale.set(1.5*s,1.35*s,1.5*s);D.updateMatrix();balls.setMatrixAt(nb,D.matrix);balls.setColorAt(nb,col);nb++;D.position.set(x+.5*s,3.1*s+.6,z+.2*s);D.scale.set(.9*s,.85*s,.9*s);D.updateMatrix();balls.setMatrixAt(nb,D.matrix);balls.setColorAt(nb,col);nb++;}
    else{const col=new THREE.Color(greens[(nt+1)%4]).multiplyScalar(.82);for(let k=0;k<2;k++){D.position.set(x,(1.9+k*1.1)*s+.4,z);D.scale.set((1.5-k*.5)*s,(1.9-k*.2)*s,(1.5-k*.5)*s);D.updateMatrix();cones.setMatrixAt(nc,D.matrix);cones.setColorAt(nc,col);nc++;}}
    wCircle(x,z,.45);wClear.push({x,z,r:1.2});nt++;}
  trunks.count=nt;balls.count=nb;cones.count=nc;for(const m of [trunks,balls,cones]){m.castShadow=true;m.receiveShadow=true;m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;scene.add(m);}
  // 花
  const fl=new THREE.InstancedMesh(new THREE.SphereGeometry(.18,8,6),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.7}),420);let nf=0;const fc=[0xff6f91,0xffd23f,0xffffff,0xb388ff,0xff9f43,0x4dabf7];
  for(let tries=0;tries<2500&&nf<420;tries++){const a=wRng()*Math.PI*2,r=PLAZA_R+1.6+wRng()*(ISL_R-PLAZA_R-3);const x=Math.cos(a)*r,z=Math.sin(a)*r;if(!wFree(x,z,.2))continue;D.position.set(x,.22,z);D.scale.setScalar(.8+wRng()*.5);D.rotation.set(0,0,0);D.updateMatrix();fl.setMatrixAt(nf,D.matrix);fl.setColorAt(nf,new THREE.Color(fc[nf%6]));nf++;}
  fl.count=nf;fl.instanceMatrix.needsUpdate=true;fl.instanceColor.needsUpdate=true;scene.add(fl);
  // 石頭／灌木
  for(let i=0,n=0;i<400&&n<12;i++){const a=wRng()*Math.PI*2,r=PLAZA_R+2+wRng()*(ISL_R-PLAZA_R-3);const x=Math.cos(a)*r,z=Math.sin(a)*r;if(!wFree(x,z,.4))continue;if(wColl.some(c=>Math.hypot(x-c.x,z-c.z)<c.r+1))continue;if(n%2){wSp(scene,.5,0xb7bec9,x,.2,z,{s:[.55+wRng()*.4,.35,.5+wRng()*.4]});wCircle(x,z,.5);}else{wSp(scene,.7,0x4fae4f,x,.5,z,{s:[.9,.6,.9]});wSp(scene,.45,0x6fcf5a,x+.5,.38,z+.2);}n++;}}

// ---- 雲 ----
const wClouds=[];for(let i=0;i<9;i++){const c=new THREE.Group();const n=3+Math.floor(wRng()*3);for(let j=0;j<n;j++)wSp(c,1,wM(0xffffff,{roughness:1,emissive:0xffffff,emissiveIntensity:.35}),(j-n/2)*1.5,Math.sin(j*1.7)*.4,Math.cos(j)*.4,{s:[2+wRng(),1.2+wRng()*.5,1.4],cast:false,recv:false});
  const a=wRng()*Math.PI*2,r=50+wRng()*50;c.position.set(Math.cos(a)*r,24+wRng()*8,Math.sin(a)*r);c.userData.sp=.5+wRng()*.8;scene.add(c);wClouds.push(c);}
wAnim.push((t,dt)=>{for(const c of wClouds){c.position.x+=c.userData.sp*dt;if(c.position.x>110)c.position.x=-110;}});
// 海鷗
const wGulls=[];for(let i=0;i<4;i++){const g=new THREE.Group();const wl=wBx(g,.9,.05,.28,0xffffff,-.45,0,0),wr=wBx(g,.9,.05,.28,0xffffff,.45,0,0);wSp(g,.17,0xffffff,0,0,0,{s:[.17,.14,.34]});g.userData={a:i*1.6,r:52+i*5,h:11+i*1.5,wl,wr};scene.add(g);wGulls.push(g);}
wAnim.push((t)=>{for(const g of wGulls){const u=g.userData,a=u.a+t*.12*(1+g.userData.r*.004);g.position.set(Math.cos(a)*u.r,u.h+Math.sin(t*.7+u.a)*.7,Math.sin(a)*u.r);g.rotation.y=-a;const f=Math.sin(t*7+u.a)*.5;u.wl.rotation.z=f;u.wr.rotation.z=-f;u.wl.position.y=Math.sin(f)*.2;u.wr.position.y=Math.sin(f)*.2;}});

// ---- 可行走範圍 ----
function wWalkable(x,z){const a=Math.atan2(z,x),r=Math.hypot(x,z);if(r<islR(a)+1.5)return true;const p=BLD.pier.rect;if(x>=p.x0&&x<=p.x1&&Math.abs(z)<=p.hz)return true;return false;}
// 推開圓形障礙
function wPush(pos,rad,extra){for(const c of wColl){const dx=pos.x-c.x,dz=pos.z-c.z,d=Math.hypot(dx,dz),m=c.r+rad;if(d<m&&d>1e-4){pos.x=c.x+dx/d*m;pos.z=c.z+dz/d*m;}}
  if(extra)for(const c of extra){const dx=pos.x-c.x,dz=pos.z-c.z,d=Math.hypot(dx,dz),m=c.r+rad;if(d<m&&d>1e-4){pos.x=c.x+dx/d*m;pos.z=c.z+dz/d*m;}}}
