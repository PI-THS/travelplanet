
/* ======================= 題目圖示（二）：動物、交通工具、乘客 ======================= */
const onH=(x,y,hs)=>hs[2]*Math.sqrt(Math.max(0,1-(x/hs[0])**2-(y/hs[1])**2));
// 以方向放眼：c＝球心、f＝面向方向
function iEyesDir(par,c,R,f,{sep=.36,y=.12,sz=.13}={}){const F=new THREE.Vector3(...f).normalize(),U=new THREE.Vector3(0,1,0),S=new THREE.Vector3().crossVectors(U,F).normalize();
  for(const sg of [-1,1]){const d=F.clone().addScaledVector(S,sg*sep).addScaledVector(U,y).normalize(),p=new THREE.Vector3(...c).addScaledVector(d,R*0.975);
    const e=Mh(gSph(sz*R,24,18),IM('gloss',0x1b1512,{roughness:.1}),[p.x,p.y,p.z],null,[1,1.16,0.62],par);e.lookAt(p.clone().add(d));
    const h=p.clone().addScaledVector(d,sz*R*0.5).addScaledVector(U,sz*R*0.42).addScaledVector(S,-sz*R*0.28);Mh(gSph(sz*R*0.3,12,10),IM('emit',0xffffff,{emissiveIntensity:1}),[h.x,h.y,h.z],null,null,par);}}
/* ---- 動物頭（貓、狗、豬、牛、熊、熊貓、老虎、兔、老鼠、馬騮、獅子、狐狸、青蛙） ---- */
function aHead(o){const g=G0();const hs=o.hs||[1,0.9,0.92];const fur=o.furMat||IM('fur',o.col);Mh(gSph(1,64,48),fur,null,null,hs,g);const inner=IM('fur',o.inner||0xf7b6c2);const E=o.ear;
  if(E==='tri'||E==='fox'){for(const sg of [-1,1]){const e=G0();e.position.set(sg*0.56,0.66,-0.08);e.rotation.set(0.05,sg*0.2,-sg*0.38);g.add(e);
    Mh(gCone(0.34,0.66,32),IM('fur',o.earCol||o.col),[0,0.24,0],null,[1,1,0.5],e);Mh(gCone(0.2,0.42,24),inner,[0,0.18,0.08],null,[1,1,0.3],e);if(E==='fox')Mh(gCone(0.15,0.24,24),IM('fur',0x2b2320),[0,0.5,0],null,[1,1,0.52],e);}}
  if(E==='round'||E==='mouse'){const R=E==='mouse'?0.5:0.3;for(const sg of [-1,1]){const e=G0();e.position.set(sg*(E==='mouse'?0.76:0.68),E==='mouse'?0.62:0.66,-0.12);e.rotation.set(0,-sg*0.25,0);g.add(e);
    Mh(gSph(R,32,24),IM('fur',o.earCol||o.col),null,null,[1,1,0.5],e);Mh(gSph(R*0.6,24,16),inner,[0,-0.02,0.07],null,[1,1,0.35],e);}}
  if(E==='long'){for(const sg of [-1,1]){const e=G0();e.position.set(sg*0.34,0.82,-0.12);e.rotation.set(-0.12,0,-sg*0.16);g.add(e);
    Mh(gCap(0.2,0.95,12,24),fur,[0,0.52,0],null,[1,1,0.55],e);Mh(gCap(0.11,0.72,12,24),inner,[0,0.52,0.07],null,[1,1,0.32],e);}}
  if(E==='flop'){for(const sg of [-1,1])Mh(gSph(0.44,32,24),IM('fur',o.earCol),[sg*0.9,0.06,-0.02],[0,sg*0.25,sg*0.3],[0.5,1.05,0.42],g);}
  if(E==='pig'){for(const sg of [-1,1]){const e=G0();e.position.set(sg*0.55,0.7,-0.02);e.rotation.set(0.6,0,-sg*0.55);g.add(e);Mh(gCone(0.25,0.42,24),fur,[0,0.14,0],null,[1,1,0.42],e);}}
  if(E==='cow'){for(const sg of [-1,1]){Mh(gSph(0.34,32,24),fur,[sg*1.02,0.34,-0.05],[0,0,-sg*0.45],[1.1,0.55,0.42],g);Mh(gSph(0.2,24,16),inner,[sg*1.05,0.32,0.05],[0,0,-sg*0.45],[1.1,0.5,0.3],g);
    Mh(gCone(0.1,0.34,20),IM('toy',0xf2e3c6),[sg*0.42,0.92,-0.12],[0,0,-sg*0.4],null,g);}}
  iEyes(g,[0,0,0],1,{sep:o.eyeSep??0.34,y:o.eyeY??0.1,sz:o.eyeSz??0.13,sc:hs});if(o.blush!==false)iBlush(g,[0,0,0],1,{sep:.56,y:-.2,sc:hs,col:o.blushCol||0xff8fa3});
  return g;}
function nose(g,x,y,hs,col,s=[1.3,0.85,0.8],r=0.12,out=0.06){return Mh(gSph(r,24,18),IM('gloss',col),[x,y,onH(x,y,hs)+out],null,s,g);}
IB.cat=()=>{const hs=[1,0.9,0.92];const g=aHead({col:0xf2a441,ear:'tri',inner:0xf7a8b8,hs,eyeY:.12});
  for(const sg of [-1,1])Mh(gSph(0.22,24,18),IM('fur',0xfff4e2),[sg*0.14,-0.26,onH(0,-0.26,hs)-0.1],null,[1,0.78,0.7],g);nose(g,0,-0.12,hs,0xf06292,[1.2,0.8,0.8],0.075,0.02);
  for(const sg of [-1,1])for(const k of [-1,0,1])Mh(gCyl(0.008,0.008,0.5,6),IM('toy',0x6d4c41),[sg*0.52,-0.2+k*0.08,0.8],[0,0,Math.PI/2+sg*k*0.15],null,g);
  for(const k of [-1,0,1]){const x=k*0.13,y=0.62;Mh(gCap(0.035,0.14,6,10),IM('fur',0xd97a22),[x,y,onH(x,y,hs)-0.01],[0.9,0,-k*0.2],null,g);}g.userData.rot=[0.06,-0.3,0];return g;};
IB.dog=()=>{const hs=[1,0.92,0.92];const g=aHead({col:0xe2ad6a,ear:'flop',earCol:0x8b5a2b,hs});Mh(gSph(0.44,40,30),IM('fur',0xfff1dc),[0,-0.3,onH(0,-0.3,hs)-0.2],null,[1.12,0.76,0.8],g);
  nose(g,0,-0.13,hs,0x1b1512,[1.35,0.9,0.85],0.13,0.13);Mh(gSph(0.1,20,14),IM('gloss',0xf06292),[0.02,-0.55,0.72],null,[1,0.55,0.8],g);Mh(gSph(0.3,24,18),IM('fur',0xb97a3c),[0.36,0.3,onH(0.36,0.3,hs)-0.18],null,[1,1,0.5],g);g.userData.rot=[0.06,-0.3,0];return g;};
IB.pig=()=>{const hs=[1,0.9,0.92];const g=aHead({col:0xf9b3c1,ear:'pig',hs,blushCol:0xff7f9a});const sz=onH(0,-0.18,hs);Mh(gCyl(0.32,0.34,0.24,40),IM('toy',0xf48aa2),[0,-0.18,sz+0.02],[Math.PI/2,0,0],null,g);
  for(const sg of [-1,1])Mh(gSph(0.06,14,10),IM('gloss',0x8a3a4a),[sg*0.11,-0.18,sz+0.14],null,[0.8,1.2,0.5],g);g.userData.rot=[0.06,-0.3,0];return g;};
IB.cow=()=>{const hs=[1,0.92,0.92];const tex=texC(256,128,(x)=>{x.fillStyle='#fbfbf8';x.fillRect(0,0,256,128);x.fillStyle='#262322';for(const [a,b,r] of [[150,40,26],[200,70,20],[20,50,22],[110,20,14],[235,30,16]]){x.beginPath();x.ellipse(a,b,r*1.3,r,0.4,0,6.2832);x.fill();}});
  const g=aHead({furMat:ITM({map:tex,roughness:.7,sheen:.5,sheenColor:new THREE.Color(0xffffff)}),col:0xfbfbf8,ear:'cow',hs,eyeY:.2});const mz=onH(0,-0.38,hs);Mh(gSph(0.5,40,30),IM('fur',0xf6b7c4),[0,-0.4,mz-0.18],null,[1.2,0.72,0.72],g);
  for(const sg of [-1,1])Mh(gSph(0.07,14,10),IM('gloss',0x7a3040),[sg*0.18,-0.34,mz+0.17],null,[0.8,1.1,0.5],g);g.userData.rot=[0.06,-0.3,0];return g;};
IB.bear=()=>{const hs=[1,0.92,0.92];const g=aHead({col:0x9a6034,ear:'round',inner:0xe0b884,hs});Mh(gSph(0.4,40,30),IM('fur',0xe8c496),[0,-0.3,onH(0,-0.3,hs)-0.16],null,[1.15,0.8,0.8],g);
  nose(g,0,-0.16,hs,0x2a1a12,[1.35,0.9,0.85],0.12,0.1);iSmile(g,[0,-0.36,onH(0,-0.36,hs)+0.08],0.09,0.022,0x2a1a12);g.userData.rot=[0.06,-0.3,0];return g;};
IB.panda=()=>{const hs=[1,0.92,0.92];const g=aHead({col:0xf8f8f6,ear:'round',earCol:0x1f1f22,inner:0x1f1f22,hs,eyeSz:.11,blush:false});
  for(const sg of [-1,1]){const x=sg*0.34,y=0.08;const p=Mh(gSph(0.22,24,18),IM('fur',0x1f1f22),[x,y,onH(x,y,hs)-0.06],[0,0,-sg*0.5],[1,1.3,0.5],g);}
  iEyes(g,[0,0,0],1,{sep:.34,y:.1,sz:.1,sc:hs});nose(g,0,-0.2,hs,0x1f1f22,[1.3,0.85,0.8],0.1,0.02);iSmile(g,[0,-0.36,onH(0,-0.36,hs)+0.01],0.08,0.02,0x1f1f22);iBlush(g,[0,0,0],1,{sep:.6,y:-.28,sc:hs});g.userData.rot=[0.06,-0.3,0];return g;};
IB.tiger=()=>{const hs=[1.02,0.9,0.92];const tex=texC(256,128,(x)=>{x.fillStyle='#f5a13a';x.fillRect(0,0,256,128);x.fillStyle='#2a1a12';
    const wedge=(cx,cy,len,th,a)=>{x.save();x.translate(cx,cy);x.rotate(a);x.beginPath();x.moveTo(0,-th/2);x.quadraticCurveTo(len*0.6,-th*0.4,len,0);x.quadraticCurveTo(len*0.6,th*0.4,0,th/2);x.closePath();x.fill();x.restore();};
    for(const [dy,l] of [[22,14],[30,18],[38,14]]){wedge(64,dy,l,5,0);wedge(64,dy,l,5,Math.PI);}
    for(const sg of [-1,1]){for(const [dx,dy,l] of [[30,56,22],[33,66,24],[30,76,20]])wedge(64+sg*dx,dy,l,6,sg<0?0:Math.PI);for(const [dx,dy] of [[52,34],[58,52],[56,70]])wedge(64+sg*dx,dy,18,7,Math.PI/2+sg*0.25);}
    for(const u of [150,178,206,234])wedge(u,40,26,8,Math.PI/2);});
  const g=aHead({furMat:ITM({map:tex,roughness:.7,sheen:.6,sheenColor:new THREE.Color(0xffffff)}),col:0xf5a13a,ear:'round',earCol:0xf5a13a,inner:0xfff4e2,hs,eyeY:.14});
  for(const sg of [-1,1])Mh(gSph(0.28,24,18),IM('fur',0xfff4e2),[sg*0.17,-0.3,onH(0,-0.3,hs)-0.12],null,[1,0.8,0.7],g);nose(g,0,-0.13,hs,0xf06292,[1.3,0.85,0.8],0.085,0.04);g.userData.rot=[0.06,-0.3,0];return g;};
IB.rabbit=()=>{const hs=[1,0.92,0.92];const g=aHead({col:0xfafafa,ear:'long',inner:0xf7b0c0,hs,eyeY:.1});nose(g,0,-0.16,hs,0xf06292,[1.2,0.8,0.8],0.07,0.02);
  for(const sg of [-1,1])Mh(gSph(0.18,24,18),IM('fur',0xffffff),[sg*0.12,-0.3,onH(0,-0.3,hs)-0.06],null,[1,0.8,0.6],g);Mh(gBox(0.1,0.1,0.04,0.02),IM('toy',0xffffff),[0,-0.43,onH(0,-0.43,hs)+0.02],null,null,g);g.userData.rot=[0.06,-0.3,0];return g;};
IB.mouse=()=>{const hs=[1,0.9,0.92];const g=aHead({col:0xb9bcc6,ear:'mouse',inner:0xf7b0c0,hs});nose(g,0,-0.2,hs,0xf06292,[1.2,0.85,0.8],0.09,0.04);
  for(const sg of [-1,1])for(const k of [-1,1])Mh(gCyl(0.007,0.007,0.5,6),IM('toy',0x555555),[sg*0.46,-0.22+k*0.05,0.82],[0,0,Math.PI/2+sg*k*0.12],null,g);g.userData.rot=[0.06,-0.3,0];return g;};
IB.monkey=()=>{const hs=[1,0.94,0.9];const g=aHead({col:0x8b5a2b,ear:'round',earCol:0x8b5a2b,inner:0xf1c9a0,hs,eyeY:.12,eyeSep:.28});const fm=IM('fur',0xf3cfa6);
  for(const sg of [-1,1])Mh(gSph(0.34,32,24),fm,[sg*0.2,0.1,onH(sg*0.2,0.1,hs)-0.24],null,[1,1.05,0.6],g);Mh(gSph(0.44,32,24),fm,[0,-0.3,onH(0,-0.3,hs)-0.26],null,[1.1,0.72,0.7],g);
  iEyes(g,[0,0,0],1,{sep:.28,y:.12,sz:.12,sc:hs});for(const sg of [-1,1])Mh(gSph(0.03,10,8),IM('toy',0x5d3b22),[sg*0.05,-0.2,onH(0,-0.2,hs)+0.05],null,null,g);iSmile(g,[0,-0.38,onH(0,-0.38,hs)+0.04],0.12,0.022,0x5d3b22);g.userData.rot=[0.06,-0.3,0];return g;};
IB.lion=()=>{const hs=[0.92,0.88,0.86];const g=G0();const mm=IM('fur',0xcf7026),mm2=IM('fur',0xb85a1c);for(let k=0;k<18;k++){const a=k/18*Math.PI*2;Mh(gSph(0.34,24,18),k%2?mm:mm2,[Math.cos(a)*1.02,Math.sin(a)*0.98,-0.28],null,[1,1,0.7],g);}
  const h=aHead({col:0xf2b84b,ear:'round',earCol:0xf2b84b,inner:0xe39a3a,hs});g.add(h);Mh(gSph(0.36,32,24),IM('fur',0xfff0d2),[0,-0.3,onH(0,-0.3,hs)-0.16],null,[1.2,0.78,0.8],g);nose(g,0,-0.16,hs,0x6d3b22,[1.3,0.85,0.8],0.1,0.1);g.userData.rot=[0.06,-0.3,0];return g;};
IB.fox=()=>{const hs=[1,0.88,0.9];const g=aHead({col:0xf07f2a,ear:'fox',inner:0xfff1e4,hs,eyeY:.14});for(const sg of [-1,1])Mh(gSph(0.4,32,24),IM('fur',0xfffaf2),[sg*0.34,-0.32,onH(sg*0.34,-0.32,hs)-0.26],null,[1,0.8,0.7],g);
  const mz=Mh(gCone(0.26,0.5,32),IM('fur',0xfffaf2),[0,-0.22,onH(0,-0.22,hs)+0.1],[Math.PI/2,0,0],[1,1,0.75],g);Mh(gSph(0.075,16,12),IM('gloss',0x1b1512),[0,-0.2,onH(0,-0.22,hs)+0.36],null,[1.2,0.9,0.9],g);g.userData.rot=[0.06,-0.3,0];return g;};
IB.frog=()=>{const hs=[1.18,0.8,0.9];const g=aHead({col:0x6cc24a,hs,blush:false,eyeSz:0});g.children.slice(1).forEach(c=>g.remove(c));const gm=IM('fur',0x6cc24a);
  for(const sg of [-1,1]){Mh(gSph(0.34,32,24),gm,[sg*0.48,0.62,0.18],null,null,g);Mh(gSph(0.22,24,18),IM('toy',0xffffff),[sg*0.48,0.66,0.38],null,[1,1,0.6],g);Mh(gSph(0.12,20,14),IM('gloss',0x1b1512),[sg*0.46,0.66,0.5],null,[1,1.1,0.6],g);Mh(gSph(0.035,10,8),IM('emit',0xffffff),[sg*0.46-0.04,0.71,0.56],null,null,g);}
  Mh(gTor(0.42,0.03,Math.PI,8,32),IM('toy',0x2f6b22),[0,-0.02,0.84],[0.35,0,Math.PI],null,g);iBlush(g,[0,0,0],1,{sep:.62,y:-.1,sc:hs});g.userData.rot=[0.12,-0.3,0];return g;};
IB.teddy=()=>{const g=G0();const tm=IM('fur',0xc68a4e);Mh(gSph(0.62,40,30),tm,[0,-0.62,0],null,[1,1.08,0.9],g);Mh(gSph(0.38,32,24),IM('fur',0xe8c496),[0,-0.62,0.32],null,[1,1.1,0.5],g);
  for(const sg of [-1,1]){Mh(gSph(0.24,24,18),tm,[sg*0.62,-0.5,0.12],null,[0.9,1.2,0.9],g);Mh(gSph(0.27,24,18),tm,[sg*0.38,-1.15,0.22],null,[1,0.85,1.1],g);Mh(gSph(0.15,20,14),IM('fur',0xe8c496),[sg*0.38,-1.16,0.46],null,[1,1,0.35],g);}
  const h=IB.bear();h.scale.setScalar(0.62);h.position.set(0,0.28,0.04);h.userData={};g.add(h);Mh(gSph(0.1,16,12),IM('toy',0xe53935),[0,-0.1,0.42],null,[1.6,0.8,0.7],g);g.userData.rot=[0.08,-0.3,0];return g;};
/* ---- 動物（全身） ---- */
IB.elephant=()=>{const g=G0();const gm=IM('fur',0x9fb1c4,{sheen:.4});Mh(gSph(1,48,36),gm,[-0.25,-0.1,0],null,[1.05,0.85,0.82],g);Mh(gSph(0.7,48,36),gm,[0.72,0.35,0],null,null,g);
  for(const sg of [-1,1]){Mh(gSph(0.56,32,24),gm,[0.45,0.45,sg*0.62],[0,-sg*0.5,0],[0.24,1.0,0.85],g);Mh(gSph(0.4,32,24),IM('fur',0xf2b8c6),[0.5,0.45,sg*0.62],[0,-sg*0.5,0],[0.18,0.8,0.7],g);}
  Mh(gSweep([[1.25,0.3,0],[1.5,0.05,0],[1.58,-0.35,0],[1.5,-0.62,0],[1.68,-0.78,0]],t=>0.22-0.12*t,48,16),gm,null,null,null,g);
  for(const [x,z] of [[-0.8,0.4],[-0.8,-0.4],[0.25,0.4],[0.25,-0.4]]){Mh(gCyl(0.24,0.27,0.62,24),gm,[x,-0.82,z],null,null,g);for(let k=-1;k<=1;k++)Mh(gSph(0.05,10,8),IM('toy',0xf1ece0),[x+0.2,-1.08,z+k*0.1],null,null,g);}
  Mh(gTube([[-1.3,0.0,0],[-1.45,-0.2,0],[-1.42,-0.45,0]],0.04),gm,null,null,null,g);iEyesDir(g,[0.72,0.35,0],0.7,[1,0.35,0],{sep:.55,y:.1,sz:.14});g.userData.rot=[0.12,-0.75,0];return g;};
IB.giraffe=()=>{const g=G0();const tex=texC(256,256,(x)=>{x.fillStyle='#f6c65a';x.fillRect(0,0,256,256);x.fillStyle='#b8692a';for(let i=0;i<6;i++)for(let j=0;j<6;j++){const cx=i*44+(j%2)*22+Math.random()*8,cy=j*44+Math.random()*8;x.beginPath();for(let k=0;k<7;k++){const a=k/7*6.2832,r=15+Math.random()*5;x.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);}x.closePath();x.fill();}},true,true);tex.repeat.set(1.5,1.5);
  const sm=ITM({map:tex,roughness:.7,sheen:.5,sheenColor:new THREE.Color(0xffffff)});Mh(gSph(0.8,40,30),sm,[-0.2,0,0],null,[1.2,0.72,0.62],g);
  for(const [x,z] of [[-0.75,0.28],[-0.75,-0.28],[0.3,0.28],[0.3,-0.28]]){Mh(gCyl(0.08,0.09,1.1,16),sm,[x,-0.75,z],null,null,g);Mh(gCyl(0.1,0.1,0.1,16),IM('toy',0x4e342e),[x,-1.32,z],null,null,g);}
  Mh(gSweep([[0.5,0.25,0],[0.8,0.9,0],[0.98,1.55,0]],t=>0.21-0.07*t,40,16),sm,null,null,null,g);Mh(gSph(0.34,32,24),sm,[1.1,1.75,0],null,[1.25,0.85,0.8],g);Mh(gSph(0.24,24,18),IM('fur',0xf2d09a),[1.42,1.68,0],null,[1,0.8,0.85],g);
  for(const sg of [-1,1]){Mh(gCyl(0.03,0.03,0.24,8),IM('toy',0xb8692a),[1.0,2.02,sg*0.12],null,null,g);Mh(gSph(0.06,12,10),IM('toy',0x6d3b22),[1.0,2.15,sg*0.12],null,null,g);Mh(gSph(0.12,16,12),sm,[0.9,1.9,sg*0.3],[0,0,0],[0.5,0.3,1],g);}
  iEyesDir(g,[1.12,1.8,0],0.3,[0.9,0.35,0],{sep:.62,y:.15,sz:.2});Mh(gTube([[-1.1,0.15,0],[-1.25,-0.2,0],[-1.25,-0.5,0]],0.025),sm,null,null,null,g);g.userData.rot=[0.08,-0.65,0];return g;};
IB.penguin=()=>{const g=G0();Mh(gSph(1,48,36),IM('fur',0x2b3140,{sheen:.4}),null,null,[0.78,1.02,0.7],g);Mh(gSph(0.84,48,36),IM('fur',0xfbfbf8,{sheen:.3}),[0,-0.14,0.2],null,[0.66,0.84,0.6],g);
  for(const sg of [-1,1])Mh(gSph(0.3,32,24),IM('fur',0xfbfbf8,{sheen:.3}),[sg*0.2,0.42,0.42],null,[1,1.1,0.55],g);iEyes(g,[0,0.42,0],0.7,{sep:.3,y:.02,sz:.14});
  Mh(gCone(0.12,0.24,24),IM('gloss',0xff9f1a),[0,0.24,0.72],[Math.PI/2,0,0],[1.2,1,0.7],g);iBlush(g,[0,0.3,0],0.72,{sep:.55,y:-.1});
  for(const sg of [-1,1]){Mh(gSph(0.4,24,18),IM('fur',0x2b3140),[sg*0.74,-0.05,0],[0,0,sg*0.35],[0.22,0.7,0.4],g);Mh(gSph(0.22,20,14),IM('gloss',0xff9f1a),[sg*0.28,-1.0,0.25],null,[1,0.4,1.3],g);}g.userData.rot=[0.06,-0.3,0];return g;};
IB.fish=()=>{const g=G0();const geo=disp(gSph(1,64,48),v=>{if(v.x<0){const k=1+v.x*0.62;v.y*=k;v.z*=k;}});vcol(geo,v=>C3(0x2f8fe0).lerp(C3(0xcfeaff),clamp(-v.y*0.9+0.2,0,1)));
  Mh(geo,ITM({vertexColors:true,roughness:.3,clearcoat:.8}),null,null,[1.2,0.74,0.42],g);const fin=IM('gloss',0xff9f1a);
  const tl=new THREE.Shape();tl.moveTo(0,0);tl.lineTo(-0.7,0.55);tl.quadraticCurveTo(-0.5,0,-0.7,-0.55);tl.closePath();Mh(gExt(tl,0.06,0.04,false),fin,[-1.1,0,-0.05],null,null,g);
  const df=shp([[0,0],[0.5,0.02],[-0.3,0.42]]);Mh(gExt(df,0.05,0.03,false),fin,[-0.1,0.62,-0.04],null,null,g);Mh(gExt(shp([[0,0],[0.3,-0.02],[-0.18,-0.28]]),0.05,0.03,false),fin,[0.1,-0.6,-0.04],null,null,g);
  Mh(gExt(leafShape(0.45,0.18),0.03,0.02,false),fin,[0.25,-0.15,0.36],[0,0.3,-2.6],null,g);for(const sg of [-1,1]){const z=sg*0.36;Mh(gSph(0.13,20,14),IM('toy',0xffffff),[0.72,0.16,z],null,[1,1,0.5],g);Mh(gSph(0.08,16,12),IM('gloss',0x1b1512),[0.75,0.16,z+sg*0.04],null,[1,1,0.5],g);}
  Mh(gTor(0.08,0.02,Math.PI,6,16),IM('toy',0x1f4f8f),[1.12,-0.12,0.1],[0,0.6,Math.PI*1.1],null,g);g.userData.rot=[0.12,-0.25,0];return g;};
IB.chick=()=>{const g=G0();const ym=IM('fur',0xffd83a,{sheen:.8,sheenColor:new THREE.Color(0xfff6c0)});Mh(gSph(1,48,36),ym,null,null,[1,0.95,0.95],g);
  for(let k=-1;k<=1;k++)Mh(gSph(0.12,16,12),ym,[k*0.1,0.98,0.05],[0,0,k*0.5],[0.6,1.3,0.6],g);iEyes(g,[0,0,0],1,{sep:.3,y:.18,sz:.12,sc:[1,0.95,0.95]});
  Mh(gCone(0.16,0.26,24),IM('gloss',0xff9f1a),[0,-0.02,0.98],[Math.PI/2,0,0],[1.2,1,0.7],g);iBlush(g,[0,0,0],1,{sep:.52,y:-.08,sc:[1,0.95,0.95]});
  for(const sg of [-1,1]){Mh(gSph(0.34,24,18),ym,[sg*0.92,-0.08,0.05],[0,0,sg*0.5],[0.3,0.7,0.6],g);Mh(gSph(0.18,20,14),IM('gloss',0xff9f1a),[sg*0.3,-0.95,0.3],null,[1,0.35,1.3],g);}g.userData.rot=[0.06,-0.3,0];return g;};
IB.duck=()=>{const g=G0();const wm=IM('fur',0xfbfbf8,{sheen:.5});Mh(gSph(1,48,36),wm,[-0.1,-0.3,0],null,[1.1,0.72,0.78],g);Mh(gSph(0.55,40,30),wm,[0.55,0.55,0],null,null,g);Mh(gCone(0.2,0.45,20),wm,[-1.1,-0.05,0],[0,0,Math.PI*0.62],[1,1,0.6],g);
  Mh(gSph(0.3,32,24),IM('gloss',0xff9f1a),[1.05,0.42,0],null,[0.9,0.32,0.62],g);iEyesDir(g,[0.55,0.55,0],0.55,[0.7,0.3,0],{sep:.6,y:.15,sz:.16});
  for(const sg of [-1,1]){Mh(gSph(0.5,32,24),wm,[-0.2,-0.2,sg*0.66],[0,0,0.2],[1,0.55,0.25],g);Mh(gSph(0.18,20,14),IM('gloss',0xff9f1a),[0.1,-0.98,sg*0.28],null,[1.3,0.32,1],g);}g.userData.rot=[0.1,-0.7,0];return g;};
IB.turtle=()=>{const g=G0();const tex=texC(256,128,(x)=>{x.fillStyle='#3f9a4a';x.fillRect(0,0,256,128);x.strokeStyle='#8fd18a';x.lineWidth=5;for(let i=0;i<8;i++)for(let j=0;j<4;j++){const cx=i*32+(j%2)*16,cy=j*32+16;x.beginPath();for(let k=0;k<6;k++){const a=k/6*6.2832;x.lineTo(cx+Math.cos(a)*14,cy+Math.sin(a)*14);}x.closePath();x.stroke();}});
  Mh(gHemi(1,48,24),ITM({map:tex,roughness:.35,clearcoat:.7}),[0,-0.25,0],null,[1,0.68,0.88],g);Mh(gCyl(1.02,1.02,0.1,48),IM('toy',0x2e7d32),[0,-0.28,0],null,[1,1,0.88],g);const sk=IM('fur',0xa5d66b);
  Mh(gSph(0.36,32,24),sk,[1.2,-0.05,0],null,null,g);iEyesDir(g,[1.2,-0.05,0],0.36,[1,0.2,0],{sep:.6,y:.2,sz:.2});for(const [x,z] of [[0.62,0.62],[0.62,-0.62],[-0.62,0.62],[-0.62,-0.62]])Mh(gSph(0.22,20,14),sk,[x,-0.42,z],null,[1.2,0.6,1],g);
  Mh(gCone(0.1,0.3,16),sk,[-1.1,-0.35,0],[0,0,Math.PI/2],null,g);g.userData.rot=[0.3,-0.6,0];return g;};
IB.snail=()=>{const g=G0();const pts=[];const N=60;for(let i=0;i<=N;i++){const t=i/N,a=t*Math.PI*3.4,r=0.78*Math.exp(-0.22*a);pts.push([Math.cos(a)*r,0.35+Math.sin(a)*r,0]);}
  Mh(gSweep(pts,t=>0.36*(1-t*0.88)+0.02,160,20),IM('gloss',0xd88a3a,{roughness:.3}),null,null,null,g);const bm=IM('fur',0xf1cf8a,{sheen:.4});
  Mh(gSweep([[-1.05,-0.55,0],[0,-0.6,0],[0.8,-0.5,0],[1.05,-0.1,0]],t=>0.26-0.02*t,48,18),bm,null,null,null,g);Mh(gSph(0.3,24,18),bm,[1.06,-0.05,0],null,null,g);
  for(const sg of [-1,1]){Mh(gTube([[1.05,0.15,sg*0.1],[1.12,0.45,sg*0.16],[1.2,0.62,sg*0.2]],0.03),bm,null,null,null,g);Mh(gSph(0.08,16,12),IM('gloss',0x1b1512),[1.21,0.65,sg*0.2],null,null,g);}
  iSmile(g,[1.3,-0.1,0.12],0.08,0.018,0x6d4c33,-0.3);g.userData.rot=[0.1,-0.35,0];return g;};
IB.butterfly=()=>{const g=G0();Mh(gCap(0.08,0.9,8,16),IM('fur',0x3e2723),null,null,null,g);const up=new THREE.Shape();up.moveTo(0,0);up.bezierCurveTo(0.2,0.7,1.1,1.1,1.2,0.5);up.bezierCurveTo(1.25,0.1,0.6,-0.1,0,0);
  const lo=new THREE.Shape();lo.moveTo(0,0);lo.bezierCurveTo(0.6,-0.1,1.0,-0.4,0.8,-0.85);lo.bezierCurveTo(0.6,-1.1,0.15,-0.7,0,0);
  const wt=texC(256,256,(x)=>{const r=x.createRadialGradient(40,140,10,40,140,230);r.addColorStop(0,'#ffe082');r.addColorStop(0.55,'#ff9800');r.addColorStop(0.85,'#e65100');r.addColorStop(0.9,'#2b1b12');x.fillStyle=r;x.fillRect(0,0,256,256);x.fillStyle='#fff';for(const [a,b] of [[200,60],[220,110],[180,200]]){x.beginPath();x.arc(a,b,9,0,6.2832);x.fill();}});
  const wm=ITM({map:wt,roughness:.45,clearcoat:.4,side:THREE.DoubleSide});for(const sg of [-1,1]){const w=G0();w.scale.x=sg;w.rotation.y=sg*0.55;g.add(w);for(const sh of [up,lo]){const geo=new THREE.ShapeGeometry(sh,32);const uv=geo.attributes.uv,p=geo.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,p.getX(i)/1.3,(p.getY(i)+1.1)/2.3);Mh(geo,wm,[0.06,0.05,0],null,null,w);}}
  for(const sg of [-1,1]){Mh(gTube([[0,0.5,0],[sg*0.15,0.85,0.05],[sg*0.3,1.05,0.1]],0.015),IM('toy',0x3e2723),null,null,null,g);Mh(gSph(0.05,10,8),IM('toy',0x3e2723),[sg*0.3,1.05,0.1],null,null,g);}g.userData.rot=[0.45,0,0.1];return g;};
IB.bee=()=>{const g=G0();Mh(gSph(1,48,36),IM('fur',0xffcc1a,{sheen:.6}),[-0.15,0,0],null,[0.95,0.72,0.72],g);const bk=IM('fur',0x2b2320);
  for(const x of [-0.5,-0.05]){const k=Math.sqrt(Math.max(0,1-((x+0.15)/0.95)**2));Mh(gTor(0.7*k,0.07,Math.PI*2,10,48),bk,[x,0,0],[0,Math.PI/2,0],[1,1,1],g);}
  Mh(gCone(0.1,0.25,16),bk,[-1.15,0,0],[0,0,Math.PI/2],null,g);Mh(gSph(0.5,32,24),IM('fur',0xffcc1a,{sheen:.6}),[0.72,0.12,0],null,null,g);iEyesDir(g,[0.72,0.12,0],0.5,[1,0.1,0.25],{sep:.5,y:.1,sz:.18});
  for(const sg of [-1,1]){Mh(gSph(0.42,24,18),IM('glass',0xffffff,{opacity:.55}),[-0.15,0.72,sg*0.35],[sg*0.6,0,0.2],[0.8,0.18,0.5],g);Mh(gTube([[0.9,0.5,sg*0.1],[1.0,0.8,sg*0.2]],0.02),bk,null,null,null,g);Mh(gSph(0.05,10,8),bk,[1.0,0.82,sg*0.2],null,null,g);}g.userData.rot=[0.15,-0.55,0];return g;};
IB.whale=()=>{const g=G0();const geo=disp(gSph(1,64,48),v=>{if(v.x<0){const k=1+v.x*0.68;v.y*=k;v.z*=k;v.y+=v.x*v.x*0.25;}});vcol(geo,v=>C3(0x3f7fd9).lerp(C3(0xeaf4ff),clamp(-v.y*1.4-0.15,0,1)));
  Mh(geo,ITM({vertexColors:true,roughness:.35,clearcoat:.6}),null,null,[1.3,0.78,0.78],g);for(const sg of [-1,1])Mh(gSph(0.42,32,20),IM('toy',0x3f7fd9),[-1.5,0.3,sg*0.26],[0,sg*0.55,sg*0.12],[1,0.14,0.5],g);Mh(gSph(0.2,20,14),IM('toy',0x3f7fd9),[-1.3,0.24,0],null,[1,0.7,0.8],g);iEyesDir(g,[0,0,0],0.78,[1,0.1,0],{sep:.6,y:.1,sz:.1});
  Mh(gTor(0.34,0.025,Math.PI*0.7,8,24),IM('toy',0x1f3f7f),[0.95,-0.12,0],[Math.PI/2,0,Math.PI*1.15],null,g);for(const [x,y,s] of [[0.2,0.95,1],[0.05,1.15,0.8],[0.38,1.12,0.8]])Mh(gSph(0.1*s,16,12),IM('gloss',0x8fd3ff),[x,y,0],null,null,g);g.userData.rot=[0.1,-0.55,0];return g;};
/* ---- 交通工具 ---- */
IB.train=(hex)=>{const g=G0();const col=hex?parseInt(hex,16):0xe3e8ec;const bm=IM('toy',col,{metalness:hex?0:0.25,roughness:.35});Mh(gBox(2.5,1.0,1.0,0.16),bm,[-0.15,0,0],null,null,g);
  Mh(gBox(0.36,1.0,1.02,0.2),IM('gloss',0x16181c),[1.12,0,0],null,null,g);if(!hex)Mh(gBox(0.04,0.14,0.86,0.03),IM('toy',0x80c241),[1.305,-0.26,0],null,null,g);
  Mh(gBox(2.5,0.09,1.02,0.03),IM('toy',hex?0xffffff:0x80c241),[-0.15,-0.22,0],null,null,g);const gl=IM('gloss',0x1d2a36,{roughness:.1});
  for(const sg of [-1,1]){for(const x of [-1.0,-0.5,0.25])Mh(gBox(0.34,0.3,0.02,0.02),gl,[x,0.16,sg*0.51],null,null,g);Mh(gBox(0.3,0.66,0.02,0.02),IM('toy',0x9aa3ab),[-0.12,-0.05,sg*0.51],null,null,g);Mh(gBox(0.2,0.3,0.03,0.02),gl,[-0.12,0.1,sg*0.52],null,null,g);}
  Mh(gBox(0.3,0.1,0.5,0.02),IM('emit',0xffa726,{emissiveIntensity:.9}),[1.25,0.36,0],null,null,g);for(const sg of [-1,1])Mh(gSph(0.07,16,12),IM('emit',0xfffbe6,{emissiveIntensity:1.2}),[1.3,-0.35,sg*0.32],null,null,g);
  Mh(gBox(2.3,0.08,0.8,0.03),IM('toy',0xb8c0c7),[-0.2,0.53,0],null,null,g);Mh(gBox(0.5,0.12,0.55,0.04),IM('toy',0xc9d0d6),[-0.6,0.62,0],null,null,g);
  for(const x of [-1.05,0.6])for(const sg of [-1,1])Mh(gCyl(0.16,0.16,0.1,24),IM('toy',0x2b2b2b),[x,-0.52,sg*0.4],[Math.PI/2,0,0],null,g);
  Mh(gTube([[0.1,0.58,0],[0.3,0.85,0],[0.5,0.58,0]],0.018),IM('toy',0x555555),null,null,null,g);Mh(gBox(0.4,0.03,0.4,0.01),IM('toy',0x555555),[0.3,0.86,0],null,null,g);g.userData.rot=[0.2,-0.72,0];return g;};
IB.bus=()=>{const g=G0();Mh(gBox(2.6,1.35,1.15,0.2),IM('toy',0xffb300),null,null,null,g);const gl=IM('gloss',0x1d2a36,{roughness:.1});
  for(const sg of [-1,1])Mh(gBox(2.0,0.5,0.02,0.04),gl,[-0.15,0.2,sg*0.58],null,null,g);Mh(gBox(0.02,0.6,0.98,0.04),gl,[1.3,0.18,0],null,null,g);Mh(gBox(0.02,0.14,0.6,0.02),IM('emit',0xffa726),[1.305,0.56,0],null,null,g);
  Mh(gBox(2.62,0.08,1.17,0.02),IM('toy',0xffffff),[0,-0.18,0],null,null,g);Mh(gBox(0.36,0.8,0.02,0.03),gl,[0.72,-0.1,0.585],null,null,g);
  for(const sg of [-1,1])Mh(gSph(0.08,16,12),IM('emit',0xfffbe6,{emissiveIntensity:1.2}),[1.31,-0.42,sg*0.4],null,[0.5,1,1],g);
  for(const x of [-0.8,0.8])for(const sg of [-1,1]){Mh(gCyl(0.24,0.24,0.18,32),IM('toy',0x222222,{roughness:.8}),[x,-0.66,sg*0.5],[Math.PI/2,0,0],null,g);Mh(gCyl(0.12,0.12,0.19,24),IM('metal',0xc0c4c8),[x,-0.66,sg*0.5],[Math.PI/2,0,0],null,g);}g.userData.rot=[0.15,-0.65,0];return g;};
function carBody(g,col,roof){Mh(gBox(2.1,0.55,1.05,0.24),IM('toy',col),[0,-0.1,0],null,null,g);Mh(gBox(1.2,0.52,0.96,0.22),IM('toy',col),[-0.1,0.38,0],null,null,g);const gl=IM('gloss',0x1d2a36,{roughness:.08});
  for(const sg of [-1,1]){Mh(gBox(0.48,0.34,0.02,0.04),gl,[-0.36,0.4,sg*0.485],null,null,g);Mh(gBox(0.42,0.34,0.02,0.04),gl,[0.18,0.4,sg*0.485],null,null,g);}Mh(gBox(0.02,0.36,0.82,0.04),gl,[0.505,0.4,0],[0,0,-0.25],null,g);
  for(const sg of [-1,1]){Mh(gSph(0.09,16,12),IM('emit',0xfffbe6,{emissiveIntensity:1.2}),[1.05,-0.05,sg*0.36],null,[0.5,0.8,1],g);Mh(gSph(0.08,16,12),IM('emit',0xff3b30),[-1.05,-0.02,sg*0.38],null,[0.5,0.7,1],g);}
  Mh(gBox(0.12,0.14,1.0,0.05),IM('metal',0xc8ccd0),[1.08,-0.3,0],null,null,g);for(const x of [-0.65,0.65])for(const sg of [-1,1]){Mh(gCyl(0.24,0.24,0.2,32),IM('toy',0x222222,{roughness:.8}),[x,-0.38,sg*0.48],[Math.PI/2,0,0],null,g);Mh(gCyl(0.12,0.12,0.21,24),IM('metal',0xc8ccd0),[x,-0.38,sg*0.48],[Math.PI/2,0,0],null,g);}}
IB.car=()=>{const g=G0();carBody(g,0xe53935);g.userData.rot=[0.2,-0.65,0];return g;};
IB.taxi=()=>{const g=G0();carBody(g,0xffc629);const lt=texC(128,64,(x)=>{x.fillStyle='#fff';x.fillRect(0,0,128,64);x.fillStyle='#222';x.font='bold 34px Helvetica,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('TAXI',64,34);});
  Mh(gBox(0.5,0.18,0.24,0.05),[IM('toy',0xffffff),IM('toy',0xffffff),IM('toy',0xffffff),IM('toy',0xffffff),ITM({map:lt,roughness:.4}),ITM({map:lt,roughness:.4})],[-0.1,0.72,0],[0,Math.PI/2,0],null,g);
  for(const sg of [-1,1])Mh(gBox(1.6,0.08,0.02,0.01),IM('toy',0x222222),[0,0.0,sg*0.53],null,null,g);g.userData.rot=[0.2,-0.65,0];return g;};
IB.ship=()=>{const g=G0();const hs=new THREE.Shape();hs.moveTo(-1.3,0.3);hs.lineTo(1.55,0.3);hs.quadraticCurveTo(1.2,-0.1,0.9,-0.4);hs.lineTo(-1.15,-0.4);hs.quadraticCurveTo(-1.3,-0.2,-1.3,0.3);
  const hull=gExt(hs,0.9,0.05,false);hull.translate(0,0,-0.45);Mh(hull,IM('toy',0x1f3f8f),null,null,null,g);Mh(gBox(2.6,0.14,0.94,0.03),IM('toy',0xe53935),[0.1,-0.34,0],null,null,g);
  Mh(gBox(1.8,0.4,0.76,0.06),IM('toy',0xffffff),[-0.1,0.55,0],null,null,g);Mh(gBox(1.1,0.34,0.66,0.06),IM('toy',0xffffff),[-0.2,0.9,0],null,null,g);const gl=IM('gloss',0x1d2a36);
  for(const sg of [-1,1]){for(let k=0;k<6;k++)Mh(gCyl(0.06,0.06,0.02,16),gl,[-0.85+k*0.3,0.55,sg*0.385],[Math.PI/2,0,0],null,g);for(let k=0;k<3;k++)Mh(gBox(0.22,0.14,0.02,0.02),gl,[-0.55+k*0.33,0.92,sg*0.335],null,null,g);for(let k=0;k<7;k++)Mh(gCyl(0.05,0.05,0.02,16),IM('toy',0xffffff),[-0.9+k*0.35,0.05,sg*0.46],[Math.PI/2,0,0],null,g);}
  Mh(gCyl(0.16,0.2,0.5,24),IM('toy',0xe53935),[-0.45,1.3,0],[0,0,0.12],null,g);Mh(gCyl(0.165,0.165,0.1,24),IM('toy',0x222222),[-0.48,1.55,0],[0,0,0.12],null,g);g.userData.rot=[0.18,-0.6,0];return g;};
IB.plane=()=>{const g=G0();const wm=IM('toy',0xfafafa,{roughness:.3});const f=gCap(0.3,2.2,12,32);f.rotateZ(Math.PI/2);Mh(f,wm,null,null,[1,1,1],g);const gl=IM('gloss',0x1d2a36);
  Mh(gBox(0.2,0.12,0.4,0.05),gl,[1.28,0.1,0],[0,0,-0.4],null,g);for(const sg of [-1,1])for(let k=0;k<8;k++)Mh(gSph(0.04,10,8),gl,[-0.8+k*0.24,0.08,sg*0.29],null,[1,1.3,0.4],g);
  const ws=shp([[0.35,0],[-0.25,0],[-0.85,1.5],[-0.6,1.5]]);for(const sg of [-1,1]){const w=gExt(ws,0.06,0.03,false);w.rotateX(Math.PI/2);if(sg<0)w.scale(1,1,-1);Mh(w,IM('toy',0x2f7fe0),[0.1,-0.05,0],null,null,g);
    Mh(gCyl(0.12,0.12,0.4,24),IM('toy',0xb0bec5),[0.1,-0.22,sg*0.7],[0,0,Math.PI/2],null,g);const hw=gExt(shp([[0.1,0],[-0.2,0],[-0.4,0.55],[-0.25,0.55]]),0.04,0.02,false);hw.rotateX(Math.PI/2);if(sg<0)hw.scale(1,1,-1);Mh(hw,IM('toy',0x2f7fe0),[-1.1,0.05,0],null,null,g);}
  Mh(gExt(shp([[0.1,0],[-0.35,0],[-0.5,0.7],[-0.3,0.7]]),0.05,0.03,false),IM('toy',0x2f7fe0),[-1.05,0.2,-0.025],null,null,g);g.userData.rot=[0.3,-0.6,0.1];return g;};
IB.bike=()=>{const g=G0();const tire=IM('toy',0x222222,{roughness:.8}),rim=IM('metal',0xcfd4d8),fr=IM('gloss',0xe53935);
  for(const x of [-0.78,0.78]){Mh(gTor(0.5,0.06,Math.PI*2,12,48),tire,[x,-0.3,0],null,null,g);Mh(gTor(0.44,0.02,Math.PI*2,8,48),rim,[x,-0.3,0],null,null,g);for(let k=0;k<8;k++){const a=k/8*Math.PI;Mh(gCyl(0.008,0.008,0.88,6),rim,[x,-0.3,0],[0,0,a],null,g);}Mh(gCyl(0.05,0.05,0.1,12),rim,[x,-0.3,0],[Math.PI/2,0,0],null,g);}
  const P={r:[-0.78,-0.3,0],c:[-0.05,-0.3,0],s:[-0.22,0.35,0],h:[0.5,0.38,0],f:[0.78,-0.3,0]};const bar=(a,b,r=0.045)=>{const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),d=B.clone().sub(A);const m=Mh(gCyl(r,r,d.length(),12),fr,[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2],null,null,g);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());};
  bar(P.r,P.c);bar(P.r,P.s);bar(P.c,P.s);bar(P.s,P.h);bar(P.c,P.h);bar(P.h,P.f);bar([-0.22,0.35,0],[-0.26,0.52,0],0.03);Mh(gSph(0.18,20,14),IM('toy',0x222222),[-0.27,0.56,0],null,[1.3,0.35,0.7],g);
  bar([0.5,0.38,0],[0.46,0.62,0],0.03);Mh(gCyl(0.03,0.03,0.55,12),IM('toy',0x333333),[0.46,0.64,0],[Math.PI/2,0,0],null,g);Mh(gCyl(0.14,0.14,0.04,24),rim,[-0.05,-0.3,0.06],[Math.PI/2,0,0],null,g);g.userData.rot=[0.12,-0.35,0];return g;};
IB.rocket=()=>{const g=G0();Mh(gLathe([[0,-0.9],[0.42,-0.9],[0.5,-0.4],[0.48,0.35],[0.36,0.7],[0,0.72]],30,64),IM('gloss',0xfafafa,{roughness:.25}),null,null,null,g);Mh(gLathe([[0,0.64],[0.4,0.64],[0.3,0.95],[0.12,1.18],[0,1.24]],30,64),IM('gloss',0xe53935),null,null,null,g);
  Mh(gCyl(0.2,0.2,0.06,32),IM('gloss',0x42a5f5,{roughness:.05}),[0,0.18,0.47],[Math.PI/2,0,0],null,g);Mh(gTor(0.2,0.04,Math.PI*2,10,32),IM('metal',0xc0c4c8),[0,0.18,0.49],null,null,g);
  for(let k=0;k<3;k++){const a=k/3*Math.PI*2+Math.PI/2;const fin=gExt(shp([[0,0],[0.45,-0.35],[0.45,-0.7],[0,-0.45]]),0.06,0.03,false);const m=Mh(fin,IM('gloss',0xe53935),[Math.cos(a)*0.45,-0.45,Math.sin(a)*0.45],null,null,g);m.rotation.y=-a;}
  Mh(gCyl(0.25,0.32,0.18,32),IM('metal',0x9aa1a8),[0,-0.98,0],null,null,g);Mh(gLathe([[0,-1.9],[0.2,-1.5],[0.28,-1.15],[0,-1.05]],20,32),IM('emit',0xff7a1a),null,null,null,g);Mh(gLathe([[0,-1.6],[0.12,-1.35],[0.16,-1.12],[0,-1.06]],16,24),IM('emit',0xffe066,{emissiveIntensity:1}),null,null,null,g);
  g.userData.rot=[0.1,-0.35,-0.45];return g;};
IB.loco=()=>{const g=G0();const bk=IM('gloss',0x24262b,{roughness:.3}),rd=IM('gloss',0xd32f2f);Mh(gCyl(0.45,0.45,1.5,40),bk,[0.25,0.2,0],[0,0,Math.PI/2],null,g);Mh(gCyl(0.48,0.48,0.12,40),IM('toy',0x555555),[1.0,0.2,0],[0,0,Math.PI/2],null,g);
  Mh(gCyl(0.14,0.2,0.45,24),bk,[0.75,0.82,0],null,null,g);Mh(gCyl(0.22,0.22,0.08,24),rd,[0.75,1.06,0],null,null,g);Mh(gHemi(0.2,24,12),IM('metal',0xe0b43c),[0.15,0.62,0],null,null,g);
  Mh(gBox(0.75,1.05,1.0,0.08),rd,[-0.8,0.45,0],null,null,g);Mh(gBox(0.9,0.1,1.12,0.04),bk,[-0.8,1.02,0],null,null,g);for(const sg of [-1,1])Mh(gBox(0.4,0.34,0.02,0.04),IM('gloss',0x1d2a36),[-0.78,0.6,sg*0.505],null,null,g);
  Mh(gBox(2.4,0.14,1.0,0.04),rd,[-0.05,-0.3,0],null,null,g);for(const sg of [-1,1]){for(const x of [-0.75,-0.1,0.55])Mh(gCyl(0.28,0.28,0.1,32),rd,[x,-0.5,sg*0.46],[Math.PI/2,0,0],null,g);Mh(gBox(1.4,0.05,0.03,0.01),IM('metal',0xc0c4c8),[-0.1,-0.5,sg*0.53],null,null,g);}
  const cc=gExt(shp([[0,0],[0.4,-0.35],[0,-0.35]]),0.9,0.02,false);cc.translate(0,0,-0.45);Mh(cc,rd,[1.05,-0.25,0],null,null,g);Mh(gSph(0.12,16,12),IM('emit',0xfffbe6,{emissiveIntensity:1.2}),[1.08,0.55,0],null,null,g);
  for(const [x,y,r] of [[0.8,1.35,0.18],[0.65,1.6,0.24],[0.35,1.8,0.3]])Mh(gSph(r,20,16),IM('fur',0xf3f5f8),[x,y,0],null,null,g);g.userData.rot=[0.15,-0.6,0];return g;};
/* ---- 乘客（數學題用） ---- */
function pax(o){const g=G0();const skin=IM('fur',0xffd8b8,{sheen:.3});const sc=o.kid?0.82:1;const b=G0();b.scale.setScalar(sc);g.add(b);
  Mh(gLathe([[0,-1.05],[0.5,-1.02],[0.58,-0.7],[0.5,-0.2],[0.34,0.06],[0,0.12]],24,48),IM('fur',o.body),null,null,null,b);
  for(const sg of [-1,1]){Mh(gCap(0.12,0.42,8,16),IM('fur',o.body),[sg*0.56,-0.46,0.04],[0,0,sg*0.28],null,b);Mh(gSph(0.12,16,12),skin,[sg*0.66,-0.74,0.08],null,null,b);Mh(gCap(0.13,0.16,8,16),IM('toy',o.shoe||0x3b3b3b),[sg*0.22,-1.12,0.06],[Math.PI/2,0,0],null,b);}
  if(o.tie){Mh(gExt(shp([[-0.16,0.1],[0.16,0.1],[0,-0.32]]),0.02,0.01,false),IM('toy',0xffffff),[0,-0.08,0.36],[-0.15,0,0],null,b);Mh(gBox(0.08,0.36,0.03,0.02),IM('toy',0xd32f2f),[0,-0.2,0.4],[-0.15,0,0],null,b);}
  const hy=0.62;Mh(gSph(0.52,48,36),skin,[0,hy,0],null,null,b);const hm=IM('fur',o.hair);
  const shell=(r,th,gap)=>new THREE.SphereGeometry(r,40,24,Math.PI/2+gap,Math.PI*2-gap*2,0,th),fringe=(r,w,th)=>new THREE.SphereGeometry(r,32,12,Math.PI/2-w,w*2,0,th);const hm2=IM('fur',o.hair,{side:THREE.DoubleSide});
  if(o.style==='short'){Mh(shell(0.555,Math.PI*0.5,1.0),hm2,[0,hy,0],null,null,b);Mh(fringe(0.56,1.05,Math.PI*0.3),hm2,[0,hy,0],null,null,b);}
  if(o.style==='bob'){Mh(shell(0.585,Math.PI*0.66,0.92),hm2,[0,hy,-0.01],null,null,b);Mh(fringe(0.59,1.0,Math.PI*0.33),hm2,[0,hy,0],null,null,b);}
  if(o.style==='pig'){Mh(shell(0.56,Math.PI*0.52,1.0),hm2,[0,hy,0],null,null,b);Mh(fringe(0.565,1.05,Math.PI*0.32),hm2,[0,hy,0],null,null,b);for(const sg of [-1,1]){Mh(gSph(0.2,24,18),hm,[sg*0.58,hy-0.05,-0.05],null,[0.9,1.3,0.9],b);Mh(gSph(0.07,12,10),IM('toy',0xe91e63),[sg*0.5,hy+0.16,-0.02],null,null,b);}}
  if(o.style==='bun'){Mh(shell(0.555,Math.PI*0.45,1.0),hm2,[0,hy,0],null,null,b);Mh(fringe(0.56,1.0,Math.PI*0.26),hm2,[0,hy,0],null,null,b);Mh(gSph(0.24,24,18),hm,[0,hy+0.6,-0.12],null,null,b);}
  if(o.style==='bald'){for(const sg of [-1,1])Mh(gSph(0.24,24,18),hm,[sg*0.42,hy+0.02,-0.12],null,[0.7,1,1.1],b);Mh(gSph(0.3,24,18),hm,[0,hy+0.02,-0.36],null,[1.2,0.9,0.5],b);}
  if(o.hat){Mh(gHemi(0.58,40,20),IM('toy',0xffd000),[0,hy+0.1,0],null,[1,1.05,1],b);Mh(gCyl(0.72,0.72,0.04,40),IM('toy',0xffd000),[0,hy+0.1,0.06],[0.18,0,0],[1,1,1],b);}
  iEyes(b,[0,hy,0],0.52,{sep:.32,y:-.02,sz:.12});iBlush(b,[0,hy,0],0.52,{sep:.52,y:-.28,sz:.16});iSmile(b,[0,hy-0.22,0.47],0.07,0.016,0x6d3b22,-0.2);
  if(o.glasses)for(const sg of [-1,1]){Mh(gTor(0.12,0.018,Math.PI*2,8,24),IM('toy',0x5d4037),[sg*0.17,hy-0.01,0.5],null,null,b);}
  g.userData.rot=[0.06,-0.25,0];return g;}
IB.pax_man=()=>pax({body:0x2c3e66,hair:0x2b2320,style:'short',tie:true});
IB.pax_woman=()=>pax({body:0xf48fb1,hair:0x6a3f28,style:'bob',shoe:0x8d3b50});
IB.pax_boy=()=>pax({body:0x42a5f5,hair:0x2b2320,style:'short',hat:true,kid:true});
IB.pax_girl=()=>pax({body:0xe53935,hair:0x2b2320,style:'pig',kid:true,shoe:0xc62828});
IB.pax_grandpa=()=>pax({body:0xb89f78,hair:0xd8d8d8,style:'bald',glasses:true});
IB.pax_grandma=()=>pax({body:0x9c6ade,hair:0xdcdcdc,style:'bun'});
