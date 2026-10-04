
/* ======================= 題目圖示：three.js 立體模型（全部取代 emoji） ======================= */
// 每個圖示用獨立細 WebGL 畫布渲染一次 → PNG，之後快取；題目用 ico('apple') 攞 <img>
const ICO={r:null,sc:null,cam:null,cache:new Map(),S:320};
const IMC=new Map();
function IM(kind,col,o={}){const k=kind+'|'+col+'|'+JSON.stringify(o);if(IMC.has(k))return IMC.get(k);const c=new THREE.Color(col);let m;
  if(kind==='fur')m=new THREE.MeshPhysicalMaterial({color:c,roughness:.7,sheen:.7,sheenRoughness:.5,sheenColor:new THREE.Color(0xffffff),...o});
  else if(kind==='gloss')m=new THREE.MeshPhysicalMaterial({color:c,roughness:.22,clearcoat:1,clearcoatRoughness:.08,...o});
  else if(kind==='toy')m=new THREE.MeshPhysicalMaterial({color:c,roughness:.4,clearcoat:.5,clearcoatRoughness:.3,...o});
  else if(kind==='metal')m=new THREE.MeshStandardMaterial({color:c,roughness:.26,metalness:.92,...o});
  else if(kind==='glass')m=new THREE.MeshPhysicalMaterial({color:c,roughness:.05,metalness:0,transparent:true,opacity:.35,clearcoat:1,depthWrite:false,...o});
  else if(kind==='emit')m=new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.8,roughness:.5,...o});
  else m=new THREE.MeshStandardMaterial({color:c,roughness:.85,...o});
  IMC.set(k,m);return m;}
function Mh(geo,mat,p,r,s,par){const m=new THREE.Mesh(geo,mat);if(p)m.position.set(p[0],p[1],p[2]);if(r)m.rotation.set(r[0],r[1],r[2]);if(s!=null){if(typeof s==='number')m.scale.setScalar(s);else m.scale.set(s[0],s[1],s[2]);}if(par)par.add(m);return m;}
const G0=()=>new THREE.Group();
const gSph=(r=1,w=48,h=32)=>new THREE.SphereGeometry(r,w,h);
const gHemi=(r=1,w=48,h=24)=>new THREE.SphereGeometry(r,w,h,0,Math.PI*2,0,Math.PI/2);
const gCap=(r,l,c=10,s=24)=>new THREE.CapsuleGeometry(r,l,c,s);
const gCyl=(a,b,h,s=40,open=false)=>new THREE.CylinderGeometry(a,b,h,s,1,open);
const gCone=(r,h,s=32)=>new THREE.ConeGeometry(r,h,s);
const gTor=(R,t,arc=Math.PI*2,rs=16,ts=64)=>new THREE.TorusGeometry(R,t,rs,ts,arc);
const gBox=(w,h,d,r=0.08,s=3)=>new RoundedBoxGeometry(w,h,d,s,Math.max(0.001,Math.min(r,w/2-1e-3,h/2-1e-3,d/2-1e-3)));
function gLathe(ctrl,n=40,seg=64){const c=new THREE.SplineCurve(ctrl.map(p=>new THREE.Vector2(p[0],p[1])));const pts=c.getPoints(n);pts.forEach(p=>{p.x=Math.max(0,p.x);});return new THREE.LatheGeometry(pts,seg);}
function gExt(shape,depth,bev=0.05,center=true,cs=32){const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:bev>0,bevelThickness:bev,bevelSize:bev*0.9,bevelSegments:5,curveSegments:cs});if(center)g.center();return g;}
function gTube(pts,r,seg=48,rs=10){return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],p[1],p[2]))),seg,r,rs,false);}
// 沿曲線掃出、半徑隨位置變（香蕉、鯨魚、蝸牛殼、雪糕螺旋）
function gSweep(pts,rf,seg=64,rs=18,sq=[1,1]){const cur=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],p[1],p[2])));const fr=cur.computeFrenetFrames(seg,false);const pos=[],idx=[];
  for(let i=0;i<=seg;i++){const t=i/seg,P=cur.getPointAt(t),N=fr.normals[i],B=fr.binormals[i],R=rf(t);for(let j=0;j<=rs;j++){const a=j/rs*Math.PI*2,c=Math.cos(a)*R*sq[0],s=Math.sin(a)*R*sq[1];pos.push(P.x+c*N.x+s*B.x,P.y+c*N.y+s*B.y,P.z+c*N.z+s*B.z);}}
  for(let i=0;i<seg;i++)for(let j=0;j<rs;j++){const a=i*(rs+1)+j,b=a+rs+1;idx.push(a,a+1,b,b,a+1,b+1);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;}
function shp(pts){const s=new THREE.Shape();pts.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));s.closePath();return s;}
function shpFn(n,f){const pts=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2,r=f(a);pts.push([Math.cos(a)*r,Math.sin(a)*r]);}return shp(pts);}
const leafShape=(L=1,W=0.42)=>{const s=new THREE.Shape();s.moveTo(0,0);s.quadraticCurveTo(L*0.45,W,L,0);s.quadraticCurveTo(L*0.45,-W,0,0);return s;};
function starShape(n=5,R=1,r=0.46){const pts=[];for(let i=0;i<n*2;i++){const a=Math.PI/2+i*Math.PI/n,rr=i%2?r:R;pts.push([Math.cos(a)*rr,Math.sin(a)*rr]);}return shp(pts);}
function vcol(geo,f){const p=geo.attributes.position,c=[];const v=new THREE.Vector3();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const k=f(v);c.push(k.r,k.g,k.b);}geo.setAttribute('color',new THREE.Float32BufferAttribute(c,3));return geo;}
function disp(geo,f){const p=geo.attributes.position,v=new THREE.Vector3();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);f(v);p.setXYZ(i,v.x,v.y,v.z);}geo.computeVertexNormals();return geo;}
const C3=h=>new THREE.Color(h);
// 可愛眼睛（黑亮＋白高光）：c＝球心、R＝半徑、sc＝橢球比例
function iEyes(par,c,R,{sep=.34,y=.08,sz=.13,sc=[1,1,1],hl=true}={}){for(const sg of [-1,1]){const ux=sg*sep,uy=y,uz=Math.sqrt(Math.max(0.05,1-ux*ux-uy*uy));
  const p=new THREE.Vector3(c[0]+ux*R*sc[0],c[1]+uy*R*sc[1],c[2]+uz*R*sc[2]*0.975);const e=Mh(gSph(sz*R,24,18),IM('gloss',0x1b1512,{roughness:.1}),[p.x,p.y,p.z],null,[1,1.16,0.62],par);
  e.lookAt(p.x+ux*R*sc[0],p.y+uy*R*sc[1],p.z+uz*R*sc[2]);if(hl)Mh(gSph(sz*R*0.3,12,10),IM('emit',0xffffff,{emissiveIntensity:1}),[p.x-sz*R*0.28,p.y+sz*R*0.42,p.z+sz*R*0.5],null,null,par);}}
function iSmile(par,p,w=0.2,t=0.035,col=0x3a2418,rx=0){const m=Mh(gTor(w,t,Math.PI,8,24),IM('toy',col),p,[rx,0,Math.PI],null,par);return m;}
function iBlush(par,c,R,{sep=.55,y=-.2,sz=.15,sc=[1,1,1],col=0xff8fa3}={}){for(const sg of [-1,1]){const ux=sg*sep,uy=y,uz=Math.sqrt(Math.max(0.05,1-ux*ux-uy*uy));const p=[c[0]+ux*R*sc[0],c[1]+uy*R*sc[1],c[2]+uz*R*sc[2]*0.985];
  const b=Mh(gSph(sz*R,20,14),IM('matte',col,{transparent:true,opacity:.7}),p,null,[1,0.62,0.2],par);b.lookAt(p[0]+ux,p[1]+uy,p[2]+uz);}}
// 貼圖小工具
function texC(w,h,f,srgb=true,rep){const [c,x]=cv(w,h);f(x,w,h);const t=T(c,rep,srgb);return t;}
function dimpleNormal(n=900,rep=[3,2]){const [c,x]=cv(256,256);x.fillStyle='#888';x.fillRect(0,0,256,256);for(let i=0;i<n;i++){x.fillStyle=`rgba(40,40,40,${0.25+Math.random()*0.35})`;x.beginPath();x.arc(Math.random()*256,Math.random()*256,1+Math.random()*1.6,0,6.2832);x.fill();}
  const t=normalFromHeight(c,2.2);t.repeat.set(rep[0],rep[1]);return t;}

/* ---------- 渲染 ---------- */
function icoInit(){if(ICO.r)return;const r=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});r.setPixelRatio(1);r.setSize(ICO.S,ICO.S,false);
  r.outputColorSpace=THREE.SRGBColorSpace;r.toneMapping=THREE.NeutralToneMapping;r.toneMappingExposure=1.0;r.setClearColor(0x000000,0);
  const sc=new THREE.Scene();const pm=new THREE.PMREMGenerator(r);sc.environment=pm.fromScene(new RoomEnvironment(),0.04).texture;sc.environmentIntensity=0.75;pm.dispose();
  const key=new THREE.DirectionalLight(0xfff3e6,2.3);key.position.set(-3,5,6);sc.add(key);const fill=new THREE.DirectionalLight(0xe2ecff,0.8);fill.position.set(5,1,4);sc.add(fill);
  const rim=new THREE.DirectionalLight(0xffffff,1.1);rim.position.set(2,4,-6);sc.add(rim);sc.add(new THREE.HemisphereLight(0xffffff,0xc8b8a0,0.45));
  ICO.r=r;ICO.sc=sc;ICO.cam=new THREE.PerspectiveCamera(24,1,0.1,100);}
function icoRender(key){const [name,arg]=key.split(':');const b=IB[name];if(!b){console.warn('冇呢個圖示',key);return '';}icoInit();
  const g=b(arg);const hold=new THREE.Group();hold.add(g);const rot=g.userData.rot||[0.16,-0.42,0];hold.rotation.set(rot[0],rot[1],rot[2]);ICO.sc.add(hold);hold.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(hold),c=box.getCenter(new THREE.Vector3()),sz=box.getSize(new THREE.Vector3());hold.position.sub(c);
  const f=Math.tan(ICO.cam.fov*Math.PI/360),half=Math.max(sz.x,sz.y)/2*(g.userData.pad||1.07),d=half/f+sz.z/2;ICO.cam.position.set(0,0,d);ICO.cam.near=d*0.2;ICO.cam.far=d*4;ICO.cam.lookAt(0,0,0);ICO.cam.updateProjectionMatrix();
  ICO.r.render(ICO.sc,ICO.cam);const url=ICO.r.domElement.toDataURL('image/png');ICO.sc.remove(hold);
  hold.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&o.material.userData&&o.material.userData.tmp){o.material.map&&o.material.map.dispose();o.material.normalMap&&o.material.normalMap.dispose();o.material.dispose();}});return url;}
function icon(key){if(!ICO.cache.has(key))ICO.cache.set(key,icoRender(key));return ICO.cache.get(key);}
function ico(key,cls=''){return `<img class="ico${cls?' '+cls:''}" src="${icon(key)}" alt="" draggable="false">`;}
const ITM=(o)=>{const m=o.kind==='std'?new THREE.MeshStandardMaterial(o.p):new THREE.MeshPhysicalMaterial(o.p||o);m.userData.tmp=true;return m;};
// 開機後喺主頁空閒時慢慢預先渲染，之後出題唔會卡
// 預先畫題目圖：每張要砌模型、編譯 shader、轉 PNG，iPad 每張幾十毫秒 → 只喺主頁同答題卡出咗嘅時候做（10-01：之前月台上車時都做，令畫面一頓一頓）
function icoWarm(){const keys=Object.keys(IB).filter(k=>!ICO.cache.has(k));let i=0;const step=()=>{if(i>=keys.length)return;const ok=G.state==='title'||G.card;if(ok&&!ICO.cache.has(keys[i]))icon(keys[i]);if(ok)i++;setTimeout(step,G.state==='title'?30:ok?300:500);};setTimeout(step,600);}

/* ======================= 模型 ======================= */
const IB={};
/* ---- 水果 ---- */
IB.apple=()=>{const g=G0();const geo=gLathe([[0,-0.84],[0.42,-0.94],[0.84,-0.6],[1.0,-0.04],[0.9,0.52],[0.56,0.86],[0.22,0.78],[0.02,0.6]],40,72);
  const tex=texC(256,128,(x,w,h)=>{x.fillStyle='#d8202b';x.fillRect(0,0,w,h);for(let i=0;i<120;i++){x.fillStyle=`rgba(${Math.random()<.5?'255,210,120':'120,0,20'},${0.06+Math.random()*0.08})`;x.fillRect(Math.random()*w,0,1+Math.random()*2,h);}
    const r=x.createRadialGradient(40,70,4,40,70,60);r.addColorStop(0,'rgba(255,190,90,.55)');r.addColorStop(1,'rgba(255,190,90,0)');x.fillStyle=r;x.fillRect(0,0,w,h);});
  Mh(geo,ITM({map:tex,roughness:.24,clearcoat:1,clearcoatRoughness:.08}),null,null,null,g);
  Mh(gTube([[0,0.58,0],[0.03,0.86,0],[0.12,1.08,0.02]],0.05),IM('toy',0x6b4423),null,null,null,g);
  Mh(gExt(leafShape(0.62,0.26),0.03,0.012,false),IM('toy',0x4caf50),[0.1,0.93,0.02],[0.2,0.3,0.45],null,g);g.userData.rot=[0.12,-0.3,0];return g;};
IB.banana=()=>{const g=G0();const pts=[];for(let i=0;i<=10;i++){const a=-1.0+i/10*2.0;pts.push([Math.sin(a)*1.25,-Math.cos(a)*1.25+1.1,0]);}
  const rf=t=>0.06+0.21*Math.pow(Math.sin(Math.PI*t),0.55);Mh(gSweep(pts,rf,80,5),ITM({color:0xf6d13a,roughness:.42,clearcoat:.35}),null,null,null,g);
  Mh(gCyl(0.05,0.07,0.28,12),IM('toy',0x6d7b2a),[pts[0][0]-0.08,pts[0][1]+0.1,0],[0,0,0.75],null,g);Mh(gSph(0.06,12,10),IM('toy',0x3e2c1a),[pts[10][0]+0.02,pts[10][1]+0.02,0],null,null,g);
  g.userData.rot=[0.35,-0.25,-0.25];return g;};
IB.grapes=()=>{const g=G0();const m=IM('gloss',0x7a3e9d);const rows=[[5,0.52],[5,0.48],[4,0.4],[4,0.32],[3,0.22],[1,0]];let y=0.72;
  rows.forEach(([n,R],i)=>{for(let k=0;k<n;k++){const a=k/n*Math.PI*2+i*0.62;Mh(gSph(0.235,32,24),m,[Math.cos(a)*R,y,Math.sin(a)*R],null,null,g);}if(i<5)Mh(gSph(0.235,32,24),m,[0,y,R*0.35],null,null,g);y-=0.28;});
  Mh(gTube([[0,0.8,0],[0.02,1.08,0],[0.14,1.26,0]],0.055),IM('toy',0x6b4d2a),null,null,null,g);Mh(gExt(leafShape(0.8,0.36),0.03,0.012,false),IM('toy',0x5aa846),[0.1,1.08,0],[0.4,0.3,0.25],null,g);g.userData.rot=[0.2,-0.3,0];return g;};
IB.orange=()=>{const g=G0();Mh(gSph(1,64,48),ITM({color:0xff8f1a,roughness:.42,clearcoat:.45,clearcoatRoughness:.3,normalMap:dimpleNormal(),normalScale:new THREE.Vector2(0.7,0.7)}),null,null,[1,0.93,1],g);
Mh(gCyl(0.05,0.07,0.1,12),IM('toy',0x6b5a23),[0,0.95,0],null,null,g);
  Mh(gExt(leafShape(0.72,0.3),0.03,0.012,false),IM('toy',0x3f9b3a),[0.04,0.97,0],[0.35,0.5,0.28],null,g);g.userData.rot=[0.3,-0.3,0];return g;};
IB.watermelon=()=>{const g=G0();const half=(R0,R1)=>{const s=new THREE.Shape();s.moveTo(-R1,0);s.absarc(0,0,R1,Math.PI,2*Math.PI,false);s.lineTo(R0,0);if(R0>0)s.absarc(0,0,R0,0,-Math.PI,true);s.closePath();return s;};
  const fl=new THREE.ExtrudeGeometry(half(0,0.9),{depth:0.36,bevelEnabled:true,bevelThickness:0.03,bevelSize:0.02,bevelSegments:3,curveSegments:48});
  const uv=fl.attributes.uv,pos=fl.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,(pos.getX(i)+1)/2,(pos.getY(i)+1)/2);
  const tex=texC(256,256,(x)=>{x.fillStyle='#f2413a';x.fillRect(0,0,256,256);const g2=x.createRadialGradient(128,128,40,128,128,118);g2.addColorStop(0,'rgba(255,120,120,.35)');g2.addColorStop(1,'rgba(180,0,20,.25)');x.fillStyle=g2;x.fillRect(0,0,256,256);
    x.fillStyle='#231a1a';for(const [r,a0,a1,n] of [[62,0.25,2.9,6],[88,0.45,2.7,5],[36,0.9,2.2,2]])for(let k=0;k<n;k++){const a=a0+(a1-a0)*k/(n-1);const px=128+Math.cos(a)*r,py=128+Math.sin(a)*r;x.save();x.translate(px,py);x.rotate(a+Math.PI/2);x.beginPath();x.ellipse(0,0,5,9,0,0,6.2832);x.fill();x.restore();}});
  Mh(fl,[ITM({map:tex,roughness:.35,clearcoat:.6}),ITM({color:0xf2413a,roughness:.4})],[0,0,-0.18],null,null,g);
  const rd=new THREE.ExtrudeGeometry(half(0.9,1.02),{depth:0.36,bevelEnabled:true,bevelThickness:0.03,bevelSize:0.02,bevelSegments:3,curveSegments:48});
  Mh(rd,[IM('toy',0xeaf5d0),IM('toy',0x2e7d32)],[0,0,-0.18],null,null,g);g.userData.rot=[0.18,-0.55,0];return g;};
IB.strawberry=()=>{const g=G0();const ctrl=[[0,-1.0],[0.28,-0.86],[0.62,-0.38],[0.76,0.12],[0.66,0.52],[0.32,0.7],[0,0.72]];Mh(gLathe(ctrl,40,64),IM('gloss',0xe3233a),null,null,null,g);
  const sp=new THREE.SplineCurve(ctrl.map(p=>new THREE.Vector2(p[0],p[1])));const sm=IM('toy',0xffe28a);
  for(let i=0;i<60;i++){const t=0.08+Math.random()*0.74,a=Math.random()*Math.PI*2,P=sp.getPoint(t),p=new THREE.Vector3(Math.cos(a)*P.x*1.0,P.y,Math.sin(a)*P.x*1.0);const s=Mh(gSph(0.035,10,8),sm,[p.x,p.y,p.z],null,[1,1.5,0.6],g);s.lookAt(p.x*2,p.y,p.z*2);}
  for(let k=0;k<7;k++){const a=k/7*Math.PI*2;const l=Mh(gExt(leafShape(0.5,0.2),0.02,0.01,false),IM('toy',0x2e9d3e),[Math.cos(a)*0.1,0.7,Math.sin(a)*0.1],null,null,g);l.rotation.set(0,-a,-0.45);}
  Mh(gCyl(0.04,0.05,0.25,10),IM('toy',0x3c8d2f),[0,0.84,0],[0,0,0.2],null,g);g.userData.rot=[0.25,-0.2,0.18];return g;};
IB.pear=()=>{const g=G0();Mh(gLathe([[0,-0.95],[0.56,-0.9],[0.82,-0.5],[0.74,0],[0.48,0.4],[0.36,0.72],[0.2,0.94],[0,0.98]],40,64),ITM({color:0xc9d64a,roughness:.35,clearcoat:.6,normalMap:dimpleNormal(500,[3,2]),normalScale:new THREE.Vector2(0.25,0.25)}),null,null,null,g);
  Mh(gTube([[0,0.9,0],[0.04,1.12,0],[0.12,1.25,0]],0.045),IM('toy',0x6b4423),null,null,null,g);Mh(gExt(leafShape(0.55,0.24),0.03,0.012,false),IM('toy',0x4caf50),[0.06,1.1,0],[0.3,0.2,0.5],null,g);g.userData.rot=[0.12,-0.3,0.12];return g;};
IB.peach=()=>{const g=G0();const geo=disp(gSph(1,64,48),v=>{const cr=Math.exp(-(v.x*v.x)/0.01)*Math.max(0,v.z)*0.1;v.z-=cr;if(v.y>0)v.y+=0.1*Math.pow(v.y,3)*Math.exp(-(v.x*v.x+v.z*v.z)*3);});
  const a=C3(0xffc08f),b=C3(0xff5f6d),c=C3(0xffe0b0);vcol(geo,v=>{const k=clamp((v.x*0.7+v.y*0.5+0.25),0,1);return c.clone().lerp(a,0.6).lerp(b,k*0.75);});
  Mh(geo,ITM({vertexColors:true,roughness:.55,sheen:1,sheenColor:new THREE.Color(0xffe6d8),sheenRoughness:.55}),null,null,null,g);
  Mh(gCyl(0.04,0.05,0.16,10),IM('toy',0x6b4423),[0,1.05,0],null,null,g);Mh(gExt(leafShape(0.7,0.28),0.03,0.012,false),IM('toy',0x43a047),[0.02,1.08,0],[0.3,0.2,0.4],null,g);Mh(gExt(leafShape(0.55,0.22),0.03,0.012,false),IM('toy',0x388e3c),[-0.02,1.06,0],[0.2,2.9,0.5],null,g);g.userData.rot=[0.18,-0.2,0];return g;};
IB.cherry=()=>{const g=G0();const m=IM('gloss',0xd7152c);Mh(gSph(0.42,40,30),m,[-0.46,-0.55,0.08],null,null,g);Mh(gSph(0.42,40,30),m,[0.42,-0.62,-0.06],null,null,g);
  const st=IM('toy',0x5f7a2a);Mh(gTube([[-0.46,-0.18,0.08],[-0.35,0.3,0.05],[0.05,0.92,0]],0.035),st,null,null,null,g);Mh(gTube([[0.42,-0.25,-0.06],[0.35,0.3,0],[0.05,0.92,0]],0.035),st,null,null,null,g);
  Mh(gExt(leafShape(0.62,0.26),0.03,0.012,false),IM('toy',0x43a047),[0.05,0.92,0],[0.2,0.2,0.35],null,g);g.userData.rot=[0.1,-0.25,0];return g;};
IB.lemon=()=>{const g=G0();const geo=gLathe([[0,-1.1],[0.12,-0.98],[0.55,-0.72],[0.7,0],[0.55,0.72],[0.12,0.98],[0,1.1]],40,64);geo.rotateZ(Math.PI/2);
  Mh(geo,ITM({color:0xffe03a,roughness:.38,clearcoat:.5,normalMap:dimpleNormal(1000,[3,2]),normalScale:new THREE.Vector2(0.6,0.6)}),null,null,null,g);
  Mh(gExt(leafShape(0.62,0.26),0.03,0.012,false),IM('toy',0x43a047),[0.9,0.25,0],[0.3,0.1,0.7],null,g);g.userData.rot=[0.25,-0.35,0.2];return g;};
IB.pineapple=()=>{const g=G0();const tex=texC(256,256,(x)=>{x.fillStyle='#eaa23a';x.fillRect(0,0,256,256);x.strokeStyle='#8a5a1d';x.lineWidth=5;for(let i=-8;i<16;i++){x.beginPath();x.moveTo(i*32,0);x.lineTo(i*32+256,256);x.stroke();x.beginPath();x.moveTo(i*32+256,0);x.lineTo(i*32,256);x.stroke();}
    x.fillStyle='rgba(120,70,10,.5)';for(let i=0;i<16;i++)for(let j=0;j<16;j++){x.beginPath();x.arc(i*32+16,j*32,4,0,6.2832);x.fill();}},true,true);tex.repeat.set(2,1.6);
  Mh(gLathe([[0,-0.95],[0.55,-0.86],[0.72,-0.25],[0.68,0.35],[0.46,0.72],[0,0.8]],40,64),ITM({map:tex,roughness:.5,clearcoat:.3}),null,null,null,g);
  const lm=IM('toy',0x3e9b3e),lm2=IM('toy',0x2e7d32);for(let k=0;k<14;k++){const a=k/14*Math.PI*2,big=k%2===0;const l=Mh(gExt(leafShape(big?1.0:0.75,0.14),0.03,0.012,false),big?lm:lm2,[0,0.72,0],null,null,g);l.rotation.set(0,-a,Math.PI/2-(big?0.35:0.6));}
  g.userData.rot=[0.12,-0.3,0];return g;};
IB.kiwi=()=>{const g=G0();const tex=texC(256,256,(x)=>{const r=x.createRadialGradient(128,128,20,128,128,128);r.addColorStop(0,'#e9f3b8');r.addColorStop(0.28,'#a8d64d');r.addColorStop(0.9,'#6fae2e');r.addColorStop(1,'#5e8f25');x.fillStyle=r;x.fillRect(0,0,256,256);
    x.strokeStyle='rgba(255,255,230,.35)';x.lineWidth=2;for(let i=0;i<40;i++){const a=i/40*6.2832;x.beginPath();x.moveTo(128+Math.cos(a)*34,128+Math.sin(a)*34);x.lineTo(128+Math.cos(a)*110,128+Math.sin(a)*110);x.stroke();}
    x.fillStyle='#f4f7d6';x.beginPath();x.ellipse(128,128,30,22,0,0,6.2832);x.fill();x.fillStyle='#1b1411';for(let i=0;i<34;i++){const a=i/34*6.2832+Math.random()*0.1,r2=44+Math.random()*16;x.save();x.translate(128+Math.cos(a)*r2,128+Math.sin(a)*r2);x.rotate(a);x.beginPath();x.ellipse(0,0,6,3,0,0,6.2832);x.fill();x.restore();}});
  const brown=IM('fur',0x7a5a2c);Mh(gCyl(0.95,0.95,0.3,64),[brown,ITM({map:tex,roughness:.3,clearcoat:.8}),brown],null,[1.05,0,0],null,g);g.userData.rot=[0.05,-0.3,0.05];return g;};
/* ---- 天空、大自然 ---- */
IB.sun=()=>{const g=G0();Mh(gSph(0.7,64,48),IM('gloss',0xffb300,{emissive:new THREE.Color(0xff8f00),emissiveIntensity:.25}),null,null,null,g);const rm=IM('gloss',0xff8a00,{emissive:new THREE.Color(0xff6d00),emissiveIntensity:.25});
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;Mh(gCone(0.13,0.34,24),rm,[Math.cos(a)*0.98,Math.sin(a)*0.98,0],[0,0,a-Math.PI/2],[1,1,0.55],g);}g.userData.rot=[0,0,0];return g;};
IB.moon=()=>{const g=G0();const d=0.46,r=0.82,xi=(d*d+1-r*r)/(2*d),yi=Math.sqrt(1-xi*xi),t1=Math.atan2(yi,xi),t2=Math.atan2(yi,xi-d);const s=new THREE.Shape();s.absarc(0,0,1,t1,2*Math.PI-t1,false);s.absarc(d,0,r,2*Math.PI-t2,t2,true);
  Mh(gExt(s,0.28,0.12),IM('gloss',0xffd34d,{emissive:new THREE.Color(0x553300),emissiveIntensity:.25}),null,[0,0,-0.35],null,g);g.userData.rot=[0.15,-0.35,0];return g;};
IB.star=()=>{const g=G0();Mh(gExt(starShape(5,1,0.47),0.22,0.16),IM('gloss',0xffc72c,{emissive:new THREE.Color(0x4a2a00),emissiveIntensity:.25}),null,null,null,g);g.userData.rot=[0.18,-0.4,0.05];return g;};
IB.rainbow=()=>{const g=G0();[0xef4444,0xf97316,0xfacc15,0x22c55e,0x3b82f6,0x8b5cf6].forEach((c,i)=>Mh(gTor(1.0-i*0.12,0.064,Math.PI,14,72),IM('toy',c),null,null,null,g));
  const cl=IM('fur',0xffffff,{sheen:.3});for(const sg of [-1,1])for(const [dx,dy,r] of [[0,0,0.26],[0.2,0.05,0.2],[-0.2,0.02,0.2],[0.05,0.2,0.18]])Mh(gSph(r,24,18),cl,[sg*0.7+dx,dy,0.12],null,null,g);g.userData.rot=[0.1,-0.3,0];return g;};
IB.tree=()=>{const g=G0();Mh(gCyl(0.16,0.24,1.0,24),IM('toy',0x8d5a34),[0,-0.55,0],null,null,g);const cs=[0x4caf50,0x43a047,0x66bb6a,0x388e3c];
  [[0,0.35,0,0.62],[-0.48,0.15,0.08,0.45],[0.48,0.17,0,0.46],[0,0.82,0,0.46],[0.22,0.45,0.38,0.4],[-0.25,0.52,0.3,0.38]].forEach(([x,y,z,r],i)=>Mh(gSph(r,32,24),IM('fur',cs[i%4],{sheen:.2}),[x,y,z],null,null,g));return g;};
IB.flower=()=>{const g=G0();const cup=disp(gLathe([[0.02,-0.42],[0.3,-0.38],[0.48,-0.1],[0.5,0.25],[0.42,0.52]],30,72),v=>{const h=clamp((v.y+0.42)/0.94,0,1),a=Math.atan2(v.z,v.x);v.y+=0.16*Math.pow(h,3)*Math.cos(a*3);});
  Mh(cup,IM('toy',0xe53935,{side:THREE.DoubleSide}),[0,0.62,0],null,null,g);Mh(gSph(0.34,24,18),IM('toy',0xc62828),[0,0.5,0],null,[1,0.8,1],g);
  Mh(gTube([[0,0.2,0],[0.04,-0.4,0],[0,-1.05,0]],0.05),IM('toy',0x3f9b3a),null,null,null,g);
  Mh(gExt(leafShape(0.9,0.2),0.02,0.01,false),IM('toy',0x4caf50),[0,-0.85,0],[0,0,1.05],null,g);Mh(gExt(leafShape(0.8,0.2),0.02,0.01,false),IM('toy',0x43a047),[0,-0.75,0],[0,Math.PI,1.15],null,g);g.userData.rot=[0.1,-0.3,0];return g;};
IB.sakura=()=>{const g=G0();const ps=new THREE.Shape();ps.moveTo(0,0);ps.bezierCurveTo(-0.42,0.28,-0.36,0.86,-0.1,0.95);ps.lineTo(0,0.84);ps.lineTo(0.1,0.95);ps.bezierCurveTo(0.36,0.86,0.42,0.28,0,0);
  const a=C3(0xffe3ec),b=C3(0xf48fb1);for(let k=0;k<5;k++){const geo=gExt(ps,0.04,0.03,false);vcol(geo,v=>a.clone().lerp(b,clamp(1-Math.hypot(v.x,v.y)*1.2,0,1)*0.8));const p=G0();p.rotation.z=k/5*Math.PI*2;g.add(p);Mh(geo,ITM({vertexColors:true,roughness:.5,sheen:.6,sheenColor:new THREE.Color(0xffffff)}),[0,0.02,0],[0.28,0,0],null,p);}
  Mh(gSph(0.16,24,18),IM('toy',0xf06292),[0,0,0.1],null,[1,1,0.5],g);for(let k=0;k<8;k++){const a2=k/8*Math.PI*2;Mh(gSph(0.045,10,8),IM('toy',0xffd54f),[Math.cos(a2)*0.2,Math.sin(a2)*0.2,0.2],null,null,g);}g.userData.rot=[0.3,-0.2,0];return g;};
IB.snowflake=()=>{const g=G0();const m=IM('gloss',0x9fd8ff,{emissive:new THREE.Color(0x1a4a70),emissiveIntensity:.25});for(let k=0;k<6;k++){const p=G0();p.rotation.z=k/6*Math.PI*2;g.add(p);Mh(gBox(0.13,1.0,0.1,0.04),m,[0,0.5,0],null,null,p);
  for(const [y,l] of [[0.45,0.34],[0.72,0.24]])for(const sg of [-1,1])Mh(gBox(0.09,l,0.08,0.03),m,[sg*Math.sin(0.9)*l/2,y+Math.cos(0.9)*l/2,0],[0,0,-sg*0.9],null,p);}
  Mh(gCyl(0.2,0.2,0.12,6),m,null,[Math.PI/2,0,0],null,g);g.userData.rot=[0.25,-0.35,0];return g;};
IB.fire=()=>{const g=G0();const fs=new THREE.Shape();fs.moveTo(0,-1);fs.bezierCurveTo(0.55,-1,0.82,-0.62,0.78,-0.15);fs.bezierCurveTo(0.76,0.2,0.62,0.42,0.56,0.7);fs.bezierCurveTo(0.44,0.52,0.36,0.42,0.3,0.36);
  fs.bezierCurveTo(0.3,0.75,0.18,1.05,0.02,1.3);fs.bezierCurveTo(-0.1,1.0,-0.28,0.72,-0.34,0.5);fs.bezierCurveTo(-0.42,0.62,-0.5,0.72,-0.62,0.82);fs.bezierCurveTo(-0.66,0.5,-0.82,0.2,-0.8,-0.2);fs.bezierCurveTo(-0.8,-0.66,-0.5,-1,0,-1);
  const lay=(sc,col,dy,z)=>{const geo=new THREE.ExtrudeGeometry(fs,{depth:0.22,bevelEnabled:true,bevelThickness:0.14,bevelSize:0.1,bevelSegments:6,curveSegments:32});geo.translate(0,0,-0.11);
    const top=C3(col[0]),bot=C3(col[1]);vcol(geo,v=>bot.clone().lerp(top,clamp((v.y+1)/2.3,0,1)));Mh(geo,new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false}),[0,dy,z],null,[sc,sc,sc],g);};
  lay(1,[0xe53935,0xff7043],0,0);lay(0.7,[0xff9800,0xffb74d],-0.28,0.2);lay(0.42,[0xffeb3b,0xfff59d],-0.5,0.4);g.userData.rot=[0,-0.25,0];return g;};
IB.mushroom=()=>{const g=G0();const cap=[[0,0.95],[0.55,0.88],[0.95,0.5],[1.02,0.22],[0.85,0.16],[0.3,0.24],[0,0.28]];Mh(gLathe(cap,40,64),IM('gloss',0xe53935),null,null,null,g);
  const sp=new THREE.SplineCurve(cap.slice(0,4).map(p=>new THREE.Vector2(p[0],p[1])));const wm=IM('toy',0xfff8ee);[[0.2,0.3],[0.5,1.7],[0.55,3.4],[0.7,4.6],[0.75,0.6],[0.35,5.6],[0.85,2.5]].forEach(([t,a])=>{const P=sp.getPoint(t),p=new THREE.Vector3(Math.cos(a)*P.x,P.y,Math.sin(a)*P.x);const s=Mh(gSph(0.13,20,14),wm,[p.x,p.y,p.z],null,[1,1,0.4],g);s.lookAt(p.x*2,p.y*2-0.3,p.z*2);});
  Mh(gLathe([[0,-0.9],[0.38,-0.88],[0.34,-0.4],[0.3,0.1],[0.26,0.3],[0,0.3]],24,48),IM('toy',0xf6ead3),null,null,null,g);g.userData.rot=[0.3,-0.3,0];return g;};
IB.rain=()=>{const g=G0();const cl=IM('fur',0xf4f7fb,{sheen:.4});[[-0.58,0.1,0,0.46],[0,0.32,0,0.62],[0.58,0.1,0,0.46],[0.28,0.02,0.25,0.42],[-0.28,0.0,0.25,0.42]].forEach(([x,y,z,r])=>Mh(gSph(r,32,24),cl,[x,y,z],null,null,g));
  const dm=IM('gloss',0x3fa0f2);[[-0.5,-0.72],[0.1,-0.95],[0.62,-0.7]].forEach(([x,y])=>Mh(gLathe([[0,-0.2],[0.13,-0.14],[0.16,0],[0.08,0.14],[0,0.24]],20,32),dm,[x,y,0.2],null,1,g));return g;};
/* ---- 日用品、食物 ---- */
IB.umbrella=()=>{const g=G0();const geo=disp(gLathe([[0,0.95],[0.36,0.9],[0.72,0.7],[0.96,0.42],[1.06,0.2]],24,96),v=>{const a=Math.atan2(v.z,v.x),r=Math.hypot(v.x,v.z),k=Math.abs(Math.cos(a*4));const f=0.93+0.07*k;v.x*=f;v.z*=f;if(r>0.9)v.y+=0.1*(1-k)*((r-0.9)/0.16);});
  const r1=C3(0xe53935),w1=C3(0xfafafa);vcol(geo,v=>{const a=(Math.atan2(v.z,v.x)+Math.PI*2+Math.PI/8)%(Math.PI*2);return Math.floor(a/(Math.PI/4))%2?w1:r1;});
  Mh(geo,ITM({vertexColors:true,roughness:.4,clearcoat:.5,side:THREE.DoubleSide}),null,null,null,g);Mh(gSph(0.05,12,10),IM('toy',0x333333),[0,0.99,0],null,null,g);
  Mh(gCyl(0.03,0.03,1.9,12),IM('toy',0x444444),[0,0.02,0],null,null,g);Mh(gTube([[0,-0.9,0],[0,-1.05,0],[0.12,-1.18,0],[0.26,-1.05,0],[0.26,-0.95,0]],0.05),IM('toy',0x6d4c33),null,null,null,g);g.userData.rot=[0.3,-0.3,0.1];return g;};
IB.egg=()=>{const g=G0();const pts=[];for(let i=0;i<=48;i++){const t=i/48*Math.PI,y=-Math.cos(t),r=0.74*Math.sin(t)*(1-0.13*y);pts.push(new THREE.Vector2(r,y));}
  Mh(new THREE.LatheGeometry(pts,64),IM('gloss',0xfbefdc,{roughness:.38,clearcoat:.35}),null,null,null,g);g.userData.rot=[0.1,0,0.22];return g;};
IB.friedegg=()=>{const g=G0();const w=gExt(shpFn(96,a=>1+0.07*Math.sin(5*a)+0.04*Math.sin(3*a+1)),0.06,0.06);w.rotateX(-Math.PI/2);Mh(w,IM('gloss',0xfdfdfb,{roughness:.3}),null,null,null,g);
  Mh(gSph(0.4,40,30),IM('gloss',0xffa81a),[0.08,0.08,0.06],null,[1,0.55,1],g);g.userData.rot=[0.62,-0.2,0];return g;};
IB.cake=()=>{const g=G0();Mh(gCyl(1,1,0.8,72),IM('fur',0xfff1e0,{sheen:.3}),[0,-0.2,0],null,null,g);Mh(gTor(1.0,0.06,Math.PI*2,10,72),IM('toy',0xf8a5c2),[0,-0.6,0],[Math.PI/2,0,0],null,g);
  Mh(gCyl(1.04,1.04,0.14,72),IM('gloss',0xf48fb1),[0,0.26,0],null,null,g);for(let k=0;k<18;k++){const a=k/18*Math.PI*2,l=0.1+((k*7)%5)*0.05;Mh(gCap(0.075,l,6,12),IM('gloss',0xf48fb1),[Math.cos(a)*1.02,0.2-l/2,Math.sin(a)*1.02],null,null,g);}
  for(let k=0;k<6;k++){const a=k/6*Math.PI*2+0.3;const b=Mh(gLathe([[0,-0.14],[0.1,-0.1],[0.12,0.03],[0.07,0.12],[0,0.14]],16,24),IM('gloss',0xe3233a),[Math.cos(a)*0.72,0.46,Math.sin(a)*0.72],[Math.PI,0,0],null,g);Mh(gCone(0.08,0.06,12),IM('toy',0x2e9d3e),[Math.cos(a)*0.72,0.36,Math.sin(a)*0.72],[Math.PI,0,0],null,g);}
  for(const [x,z] of [[-0.3,0],[0.3,0.05],[0,-0.3]]){Mh(gCyl(0.045,0.045,0.5,12),IM('toy',0x7ec8ff),[x,0.58,z],null,null,g);Mh(gLathe([[0,-0.06],[0.05,-0.02],[0.03,0.06],[0,0.1]],12,16),IM('emit',0xffc629,{emissiveIntensity:1}),[x,0.9,z],null,null,g);}g.userData.rot=[0.42,-0.2,0];return g;};
IB.icecream=()=>{const g=G0();const wt=texC(128,128,(x)=>{x.fillStyle='#e0a458';x.fillRect(0,0,128,128);x.strokeStyle='#b97a34';x.lineWidth=4;for(let i=-4;i<8;i++){x.beginPath();x.moveTo(i*24,0);x.lineTo(i*24+128,128);x.stroke();x.beginPath();x.moveTo(i*24+128,0);x.lineTo(i*24,128);x.stroke();}},true,true);wt.repeat.set(3,2);
  Mh(gLathe([[0,-1.2],[0.08,-1.1],[0.46,0.08],[0.5,0.18],[0,0.18]],16,48),ITM({map:wt,roughness:.6}),null,null,null,g);
  const hp=[];const N=90;for(let i=0;i<=N;i++){const t=i/N,a=t*Math.PI*2*2.6,R=0.4*(1-t*0.82);hp.push([Math.cos(a)*R,0.28+t*0.8,Math.sin(a)*R]);}
  Mh(gSweep(hp,t=>0.2*(1-t*0.55),180,16),IM('gloss',0xfff7ea,{roughness:.3}),null,null,null,g);Mh(gCone(0.1,0.22,16),IM('gloss',0xfff7ea,{roughness:.3}),[0,1.18,0],null,null,g);g.userData.rot=[0.15,-0.3,0];return g;};
IB.milk=()=>{const g=G0();const prof=[[0,-1],[0.5,-1],[0.56,-0.9],[0.56,0.2],[0.4,0.55],[0.31,0.78],[0.32,0.95],[0,0.95]];Mh(gLathe(prof,40,64),IM('glass',0xeaf6ff,{opacity:.28,side:THREE.DoubleSide}),null,null,null,g);
  Mh(gLathe([[0,-0.95],[0.5,-0.95],[0.52,-0.85],[0.52,0.2],[0.37,0.52],[0,0.52]],30,64),IM('toy',0xffffff,{roughness:.35}),null,null,null,g);
  Mh(gCyl(0.34,0.34,0.08,40),IM('toy',0x1e88e5),[0,0.99,0],null,null,g);
  const lt=texC(512,128,(x)=>{x.fillStyle='#ffffff';x.fillRect(0,0,512,128);x.fillStyle='#1e6fd9';x.fillRect(0,0,512,16);x.fillRect(0,112,512,16);x.font='bold 64px Helvetica,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('MILK',256,66);});
  Mh(gCyl(0.565,0.565,0.5,64,true),ITM({map:lt,roughness:.5,transparent:true}),[0,-0.4,0],[0,Math.PI-0.15,0],null,g);g.userData.rot=[0.12,-0.2,0];return g;};
IB.honey=()=>{const g=G0();Mh(gLathe([[0,-0.9],[0.72,-0.9],[0.82,-0.7],[0.82,0.5],[0.64,0.72],[0.62,0.82],[0,0.82]],30,64),IM('glass',0xffffff,{opacity:.14,side:THREE.DoubleSide}),null,null,null,g);
  Mh(gLathe([[0,-0.86],[0.7,-0.86],[0.78,-0.68],[0.78,0.4],[0,0.4]],24,64),IM('gloss',0xd97706,{roughness:.1,emissive:new THREE.Color(0x5a2a00),emissiveIntensity:.3}),null,null,null,g);
  const ck=texC(128,128,(x)=>{x.fillStyle='#fff';x.fillRect(0,0,128,128);x.fillStyle='rgba(220,40,40,.8)';for(let i=0;i<8;i+=2){x.fillRect(i*16,0,16,128);x.fillRect(0,i*16,128,16);}},true,true);ck.repeat.set(3,1);
  Mh(gCyl(0.7,0.66,0.22,48),ITM({map:ck,roughness:.8}),[0,0.9,0],null,null,g);Mh(gTor(0.64,0.03,Math.PI*2,8,48),IM('toy',0x8d5a34),[0,0.84,0],[Math.PI/2,0,0],null,g);
  const lb=texC(256,128,(x)=>{x.fillStyle='#fff8e1';x.beginPath();x.ellipse(128,64,120,56,0,0,6.2832);x.fill();x.strokeStyle='#8d5a34';x.lineWidth=6;x.stroke();x.fillStyle='#8d5a34';x.font='bold 54px Helvetica,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('HONEY',128,68);});
  Mh(new THREE.CylinderGeometry(0.83,0.83,0.52,32,1,true,-0.75,1.5),ITM({map:lb,transparent:true,roughness:.5}),[0,-0.15,0],[0,-0.1,0],null,g);g.userData.rot=[0.15,-0.2,0];return g;};
IB.mooncake=()=>{const g=G0();const side=disp(gLathe([[0,-0.3],[0.86,-0.3],[1.0,-0.2],[1.02,0.18],[0.9,0.3],[0,0.3]],30,120),v=>{const a=Math.atan2(v.z,v.x),r=Math.hypot(v.x,v.z);if(r>0.5){const f=1+0.045*Math.cos(a*12);v.x*=f;v.z*=f;}});
  Mh(side,IM('gloss',0xc9832f,{roughness:.4,clearcoat:.5}),null,null,null,g);
  const ph=document.createElement('canvas');ph.width=ph.height=256;const x=ph.getContext('2d');x.fillStyle='#808080';x.fillRect(0,0,256,256);x.strokeStyle='#c8c8c8';x.lineWidth=10;x.beginPath();x.arc(128,128,100,0,6.2832);x.stroke();
  for(let k=0;k<12;k++){const a=k/12*6.2832;x.fillStyle='#c0c0c0';x.beginPath();x.ellipse(128+Math.cos(a)*72,128+Math.sin(a)*72,16,9,a,0,6.2832);x.fill();}x.fillStyle='#d0d0d0';x.fillRect(96,96,64,64);x.fillStyle='#707070';x.font='bold 50px "Hiragino Mincho ProN","Songti TC",serif';x.textAlign='center';x.textBaseline='middle';x.fillText('月',128,132);
  const nm=normalFromHeight(ph,3);const tt=texC(256,256,(y)=>{y.drawImage(ph,0,0);y.globalCompositeOperation='multiply';y.fillStyle='#d9964a';y.fillRect(0,0,256,256);});
  Mh(new THREE.CircleGeometry(0.86,64),ITM({map:tt,normalMap:nm,roughness:.4,clearcoat:.5}),[0,0.301,0],[-Math.PI/2,0,0],null,g);g.userData.rot=[0.55,-0.1,0];return g;};
IB.balloon=()=>{const g=G0();Mh(gLathe([[0,-1],[0.14,-0.95],[0.6,-0.55],[0.8,0.05],[0.7,0.6],[0.4,0.92],[0,1.0]],40,64),IM('gloss',0xef3b3b,{clearcoatRoughness:.03}),null,null,null,g);
  Mh(gCone(0.1,0.14,16),IM('gloss',0xd32f2f),[0,-1.04,0],[Math.PI,0,0],null,g);Mh(gTube([[0,-1.1,0],[0.08,-1.4,0.02],[-0.06,-1.7,0],[0.05,-2.0,0]],0.012,40,6),IM('toy',0x777777),null,null,null,g);g.userData.rot=[0.1,-0.2,0.12];return g;};
IB.ball=()=>{const g=G0();Mh(gSph(1,64,48),IM('gloss',0xfafafa,{roughness:.3}),null,null,null,g);const P=(1+Math.sqrt(5))/2,bm=IM('gloss',0x1d1d1f,{roughness:.3});
  for(const v of [[0,1,P],[0,1,-P],[0,-1,P],[0,-1,-P],[1,P,0],[1,-P,0],[-1,P,0],[-1,-P,0],[P,0,1],[P,0,-1],[-P,0,1],[-P,0,-1]]){const d=new THREE.Vector3(...v).normalize();const m=Mh(gCyl(0.34,0.34,0.08,5),bm,[d.x*0.975,d.y*0.975,d.z*0.975],null,null,g);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d);}g.userData.rot=[0.3,-0.4,0];return g;};
IB.book=()=>{const g=G0();const cm=IM('toy',0x2f6fd6);Mh(gBox(1.5,2.0,0.06,0.03),cm,[0,0,-0.16],null,null,g);Mh(gBox(1.5,2.0,0.06,0.03),cm,[0,0,0.16],null,null,g);Mh(gBox(0.1,2.0,0.38,0.05),cm,[-0.72,0,0],null,null,g);
  const pt=texC(64,64,(x)=>{x.fillStyle='#fdf6e3';x.fillRect(0,0,64,64);x.fillStyle='rgba(150,120,80,.35)';for(let i=0;i<64;i+=4)x.fillRect(0,i,64,1);},true,true);
  Mh(gBox(1.42,1.9,0.27,0.02),ITM({map:pt,roughness:.8}),[0.03,0,0],null,null,g);Mh(gBox(0.5,0.18,0.02,0.01),IM('metal',0xd4a73a),[0.1,0.45,0.195],null,null,g);Mh(gBox(0.8,0.06,0.02,0.01),IM('metal',0xd4a73a),[0.1,0.2,0.195],null,null,g);
  Mh(gBox(0.12,0.5,0.02,0.01),IM('toy',0xe53935),[0.35,-1.15,0.02],null,null,g);g.userData.rot=[0.2,-0.55,0];return g;};
IB.key=()=>{const g=G0();const m=IM('metal',0xe0b43c);Mh(gTor(0.36,0.12,Math.PI*2,20,48),m,[-0.8,0,0],null,null,g);Mh(gCyl(0.2,0.2,0.14,32),m,[-0.8,0,0],[Math.PI/2,0,0],[0.4,0.4,1],g);
  Mh(gBox(1.35,0.16,0.1,0.04),m,[0.18,0,0],null,null,g);Mh(gBox(0.1,0.3,0.12,0.03),m,[-0.36,0,0],null,null,g);for(const [x,h] of [[0.55,0.28],[0.72,0.2],[0.84,0.3]])Mh(gBox(0.12,h,0.1,0.03),m,[x,-h/2-0.04,0],null,null,g);g.userData.rot=[0.35,-0.3,-0.45];return g;};
IB.box=()=>{const g=G0();Mh(gBox(1.6,1.1,1.25,0.05),IM('matte',0xc9955b,{roughness:.8}),null,null,null,g);Mh(gBox(0.36,0.02,1.27,0.005),IM('toy',0xe2c28a,{roughness:.5}),[0,0.555,0],null,null,g);Mh(gBox(0.36,0.4,0.02,0.005),IM('toy',0xe2c28a,{roughness:.5}),[0,0.37,0.63],null,null,g);
  Mh(gBox(1.61,0.02,0.02,0.005),IM('matte',0xa87a45),[0,0.555,0],null,null,g);g.userData.rot=[0.38,-0.6,0];return g;};
IB.pen=()=>{const g=G0();const b=G0();g.add(b);Mh(gCyl(0.1,0.1,1.5,32),IM('toy',0x2f6de0),[0,0.1,0],null,null,b);Mh(gCyl(0.105,0.105,0.4,32),IM('toy',0x222222,{roughness:.7}),[0,-0.75,0],null,null,b);
  Mh(gCone(0.1,0.25,32),IM('metal',0xd0d4d8),[0,-1.07,0],[Math.PI,0,0],null,b);Mh(gSph(0.025,10,8),IM('metal',0x888888),[0,-1.2,0],null,null,b);Mh(gCyl(0.07,0.08,0.18,20),IM('toy',0x1f4fb0),[0,0.94,0],null,null,b);
  Mh(gBox(0.05,0.62,0.05,0.02),IM('metal',0xd8dde2),[0,0.55,0.12],null,null,b);b.rotation.z=-0.7;g.userData.rot=[0.2,-0.3,0];return g;};
IB.clock=()=>{const g=G0();Mh(gCyl(0.85,0.85,0.42,64),IM('toy',0xe53935),null,[Math.PI/2,0,0],null,g);Mh(gTor(0.8,0.07,Math.PI*2,14,64),IM('metal',0xdfe3e6),[0,0,0.21],null,null,g);
  const ft=texC(256,256,(x)=>{x.fillStyle='#fffdf6';x.beginPath();x.arc(128,128,128,0,6.2832);x.fill();x.fillStyle='#333';x.font='bold 40px Helvetica,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';[['12',128,34],['3',222,128],['6',128,222],['9',34,128]].forEach(([t,a,b])=>x.fillText(t,a,b));
    x.strokeStyle='#333';x.lineCap='round';x.lineWidth=12;x.beginPath();x.moveTo(128,128);x.lineTo(128,64);x.stroke();x.lineWidth=8;x.beginPath();x.moveTo(128,128);x.lineTo(186,150);x.stroke();x.fillStyle='#e53935';x.beginPath();x.arc(128,128,10,0,6.2832);x.fill();});
  Mh(new THREE.CircleGeometry(0.76,64),ITM({map:ft,roughness:.3,clearcoat:.8}),[0,0,0.215],null,null,g);
  for(const sg of [-1,1]){Mh(gHemi(0.32,32,16),IM('metal',0xdfe3e6),[sg*0.52,0.78,-0.02],[0,0,sg*0.55],null,g);Mh(gCyl(0.03,0.03,0.2,8),IM('metal',0xaaaaaa),[sg*0.42,0.72,0],[0,0,sg*0.55],null,g);Mh(gCyl(0.06,0.06,0.16,12),IM('toy',0x333333),[sg*0.5,-0.86,0],[0,0,sg*0.4],null,g);}
  Mh(gSph(0.07,12,10),IM('metal',0xdfe3e6),[0,0.98,0],null,null,g);g.userData.rot=[0.1,-0.35,0];return g;};
IB.house=()=>{const g=G0();Mh(gBox(1.6,1.1,1.3,0.04),IM('toy',0xfff1d6),[0,-0.35,0],null,null,g);const rs=shp([[-1.0,0],[1.0,0],[0,0.8]]);const rf=gExt(rs,1.55,0.04);Mh(rf,IM('toy',0xd9443a),[0,0.58,0],null,null,g);
  Mh(gBox(0.38,0.66,0.06,0.03),IM('toy',0x8d5a34),[-0.35,-0.57,0.66],null,null,g);Mh(gSph(0.035,10,8),IM('metal',0xd4a73a),[-0.23,-0.55,0.7],null,null,g);
  Mh(gBox(0.46,0.4,0.06,0.03),IM('toy',0xffffff),[0.38,-0.3,0.66],null,null,g);Mh(gBox(0.36,0.3,0.03,0.02),IM('gloss',0x81d4fa),[0.38,-0.3,0.69],null,null,g);
  Mh(gBox(0.24,0.5,0.24,0.03),IM('toy',0xa1453a),[0.5,0.8,-0.2],null,null,g);g.userData.rot=[0.12,-0.55,0];return g;};
IB.door=()=>{const g=G0();Mh(gBox(1.12,2.1,0.14,0.03),IM('toy',0xe9dcc8),[0,0,-0.04],null,null,g);Mh(gBox(0.92,1.92,0.14,0.04),IM('toy',0xa0643a),[0,-0.04,0.03],null,null,g);
  for(const [y,h] of [[0.42,0.72],[-0.5,0.72]])Mh(gBox(0.62,h,0.06,0.04),IM('toy',0x8a5230),[0,y,0.1],null,null,g);Mh(gSph(0.07,16,12),IM('metal',0xe0b43c),[0.32,-0.08,0.15],null,null,g);g.userData.rot=[0.08,-0.45,0];return g;};
IB.glasses=()=>{const g=G0();const fm=IM('toy',0x2b2b2b);for(const sg of [-1,1]){Mh(gTor(0.4,0.06,Math.PI*2,14,48),fm,[sg*0.52,0,0],null,null,g);Mh(new THREE.CircleGeometry(0.4,48),IM('glass',0xbfe6ff,{opacity:.35}),[sg*0.52,0,0],null,null,g);
  Mh(gBox(0.06,0.06,1.2,0.02),fm,[sg*0.94,0.05,-0.6],null,null,g);}Mh(gTor(0.13,0.045,Math.PI,8,20),fm,[0,0.08,0],null,null,g);g.userData.rot=[0.18,-0.45,0];return g;};
IB.bag=()=>{const g=G0();const rm=IM('toy',0xcc2b2b);Mh(gBox(1.2,1.35,0.62,0.22),rm,null,null,null,g);Mh(gBox(1.24,0.9,0.1,0.08),IM('toy',0xb71c1c),[0,0.18,0.34],null,null,g);Mh(gBox(1.24,0.1,0.64,0.05),IM('toy',0xb71c1c),[0,0.66,0.01],null,null,g);
  Mh(gBox(0.22,0.16,0.06,0.03),IM('metal',0xe0b43c),[0,-0.3,0.4],null,null,g);Mh(gBox(0.18,0.1,0.1,0.03),IM('metal',0xc0c4c8),[0.62,-0.2,0.1],null,null,g);g.userData.rot=[0.1,-0.45,0];return g;};
IB.cup=()=>{const g=G0();const wm=IM('gloss',0xfafafa,{roughness:.25});Mh(gCyl(0.66,0.6,1.25,64,true),wm,null,null,null,g);Mh(gCyl(0.6,0.55,1.2,64,true),IM('gloss',0xfafafa,{roughness:.25,side:THREE.BackSide}),[0,0.02,0],null,null,g);
  Mh(gTor(0.63,0.035,Math.PI*2,10,64),wm,[0,0.625,0],[Math.PI/2,0,0],null,g);Mh(new THREE.CircleGeometry(0.6,48),IM('gloss',0x6d3b1f,{roughness:.15}),[0,0.4,0],[-Math.PI/2,0,0],null,g);Mh(gCyl(0.6,0.6,0.03,48),wm,[0,-0.62,0],null,null,g);
  Mh(gTor(0.3,0.08,Math.PI*1.25,12,40),wm,[0.68,0.02,0],[0,0,-Math.PI*0.62],null,g);g.userData.rot=[0.28,-0.35,0];return g;};
IB.hat=()=>{const g=G0();const st=texC(128,128,(x)=>{x.fillStyle='#e9c46a';x.fillRect(0,0,128,128);x.strokeStyle='rgba(150,110,40,.45)';x.lineWidth=2;for(let i=0;i<128;i+=6){x.beginPath();x.moveTo(0,i);x.lineTo(128,i);x.stroke();}for(let i=0;i<128;i+=10){x.beginPath();x.moveTo(i,0);x.lineTo(i,128);x.stroke();}},true,true);st.repeat.set(6,3);
  Mh(gLathe([[1.45,0.0],[1.3,0.05],[0.7,0.1],[0.62,0.14],[0.6,0.55],[0.48,0.74],[0,0.78]],40,72),ITM({map:st,roughness:.8,side:THREE.DoubleSide}),null,null,null,g);Mh(gCyl(0.615,0.6,0.16,64,true),IM('toy',0xe53935),[0,0.24,0],null,null,g);Mh(gSph(0.12,16,12),IM('toy',0xe53935),[0.5,0.26,0.4],null,[1.4,0.8,0.6],g);g.userData.rot=[0.72,-0.2,0];return g;};
IB.snowman=()=>{const g=G0();const w=IM('fur',0xfbfdff,{sheen:.4});Mh(gSph(0.75,48,36),w,[0,-0.55,0],null,null,g);Mh(gSph(0.5,48,36),w,[0,0.52,0],null,null,g);
  Mh(gCyl(0.45,0.45,0.05,40),IM('toy',0x222222),[0,0.94,0],[0,0,0.12],null,g);Mh(gCyl(0.3,0.3,0.42,40),IM('toy',0x222222),[0.03,1.14,0],[0,0,0.12],null,g);Mh(gCyl(0.305,0.305,0.08,40),IM('toy',0xe53935),[0.02,1.0,0],[0,0,0.12],null,g);
  Mh(gCone(0.07,0.36,20),IM('toy',0xff8a1f),[0,0.5,0.62],[Math.PI/2,0,0],null,g);iEyes(g,[0,0.52,0],0.5,{sep:.3,y:.25,sz:.12});for(let k=0;k<5;k++){const a=-0.6+k*0.3;Mh(gSph(0.035,10,8),IM('toy',0x222222),[Math.sin(a)*0.3,0.34-Math.cos(a)*0.06,0.42],null,null,g);}
  Mh(gTor(0.44,0.1,Math.PI*2,14,48),IM('fur',0xe53935),[0,0.12,0],[Math.PI/2,0,0],null,g);Mh(gBox(0.2,0.5,0.08,0.04),IM('fur',0xe53935),[0.28,-0.12,0.38],[0,0,0.2],null,g);
  for(const sg of [-1,1])Mh(gSph(0.06,12,10),IM('toy',0x222222),[0,-0.35-sg*0.2+0.1,0.72],null,null,g);g.userData.rot=[0.1,-0.3,0];return g;};
IB.ball_red=()=>{const g=G0();Mh(gSph(1,64,48),IM('gloss',0xe53935),null,null,null,g);return g;};
IB.ball_blue=()=>{const g=G0();Mh(gSph(1,64,48),IM('gloss',0x1e88e5),null,null,null,g);return g;};
IB.ball_yellow=()=>{const g=G0();Mh(gSph(1,64,48),IM('gloss',0xfdd835),null,null,null,g);return g;};
IB.ball_green=()=>{const g=G0();Mh(gSph(1,64,48),IM('gloss',0x43a047),null,null,null,g);return g;};
