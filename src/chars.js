/* ======================= 角色：河馬主角＋NPC ======================= */
// ---- 河馬 ----
function buildHippo(){const g=new THREE.Group(),body=new THREE.Group();g.add(body);
  const skin=wM(0xa9a4d6,{roughness:.6}),belly=wM(0xd4cff0,{roughness:.6}),pink=wM(0xf6b6cf,{roughness:.55}),dark=wM(0x2b2540);
  wSp(body,1,skin,0,1.0,0,{s:[1.0,.88,1.35]});wSp(body,1,belly,0,.7,.1,{s:[.8,.55,1.1]});
  const head=new THREE.Group();head.position.set(0,1.35,1.0);body.add(head);
  wSp(head,.75,skin,0,0,0,{s:[.8,.7,.8]});
  wSp(head,.75,pink,0,-.22,.62,{s:[.78,.46,.62]});wSp(head,.75,skin,0,-.1,.58,{s:[.8,.5,.62]}).scale.set(.8,.42,.6);
  head.children[head.children.length-1].material=skin;head.children[head.children.length-2].position.set(0,-.2,.64);
  for(const s of [-1,1]){wSp(head,.07,dark,s*.28,.1,1.05,{s:[.09,.06,.07]});
    wSp(head,.2,0xffffff,s*.34,.62,.28);wSp(head,.1,dark,s*.34,.63,.46);wSp(head,.035,0xffffff,s*.37,.67,.52,{cast:false});
    const ear=wSp(head,.2,skin,s*.58,.72,-.1,{s:[.2,.26,.12]});wSp(head,.12,pink,s*.58,.72,-.04,{s:[.12,.17,.06]});
    wSp(head,.12,wM(0xff8fb1,{roughness:.9}),s*.45,-.02,.62,{s:[.14,.09,.05],cast:false});}
  // 笑口
  const sm=new THREE.Mesh(new THREE.TorusGeometry(.2,.025,6,16,Math.PI),dark);sm.position.set(0,-.38,1.06);sm.rotation.z=Math.PI;sm.scale.set(1,.7,1);head.add(sm);
  // 腳
  const legs=[];for(const [x,z] of [[-.55,.65],[.55,.65],[-.55,-.6],[.55,-.6]]){const l=new THREE.Group();l.position.set(x,.55,z);g.add(l);wCy(l,.3,.55,skin,0,-.55,0);wCy(l,.31,.14,belly,0,-.55,0);legs.push(l);}
  // 尾
  const tail=wSp(body,.12,skin,0,1.05,-1.35,{s:[.1,.1,.2]});
  // 紅背包＋旅行帽
  wBx(body,.8,.75,.42,0xe53935,0,1.15,-.45);wBx(body,.84,.14,.46,0xffd23f,0,1.55,-.45);wBx(body,.1,.5,.06,0xffd23f,-.3,1.5,-.15,{r:[.5,0,0]});wBx(body,.1,.5,.06,0xffd23f,.3,1.5,-.15,{r:[.5,0,0]});
  wCy(head,.4,.2,0x3b8fe8,0,.58,-.05);wCy(head,.62,.05,0x3b8fe8,0,.58,.05);wSp(head,.12,0xffd23f,0,.9,-.05);
  g.userData={legs,body,head,tail};return g;}

// ---- NPC 人形 ----
const SKINS=[0xffe0c2,0xf6c9a0,0xe8b48a,0xd49a6a];
function buildPerson(o){const g=new THREE.Group(),sk=wM(o.skin||SKINS[0],{roughness:.7}),cl=wM(o.top,{roughness:.7}),pl=wM(o.bottom||0x3d4a6b,{roughness:.7}),hr=wM(o.hair||0x3b2a20,{roughness:.7});
  const f=o.female;const legs=[];
  for(const s of [-1,1]){const l=new THREE.Group();l.position.set(s*.2,.62,0);g.add(l);if(f&&o.skirt){}else wCy(l,.15,.62,pl,0,-.62,0);wCy(l,.16,.14,wM(0x3a2a22),0,-.62,.03);legs.push(l);}
  const body=new THREE.Group();g.add(body);
  wCy(body,.36,.8,cl,0,.6,0);wSp(body,.36,cl,0,1.4,0,{s:[.36,.12,.34]});
  if(f&&o.skirt){wCone(body,.62,.7,o.skirtCol||pl.color.getHex(),0,.0,0).position.y=.4;body.children[body.children.length-1].scale.set(.62,.62,.62);}
  const arms=[];for(const s of [-1,1]){const a=new THREE.Group();a.position.set(s*.46,1.25,0);body.add(a);wCy(a,.11,.6,cl,0,-.55,0);wSp(a,.12,sk,0,-.62,0);arms.push(a);}
  const head=new THREE.Group();head.position.set(0,1.78,0);body.add(head);wSp(head,.4,sk,0,0,0);
  for(const s of [-1,1]){wSp(head,.06,0x2a2a35,s*.15,.02,.37,{cast:false,s:[.06,.08,.04]});wSp(head,.07,0xff9aa8,s*.25,-.1,.33,{s:[.07,.05,.03],cast:false});if(f)wBx(head,.14,.025,.02,0x2a2a35,s*.15,.12,.38);}
  const sm=new THREE.Mesh(new THREE.TorusGeometry(.07,.015,6,10,Math.PI),wM(0xb5453a));sm.rotation.z=Math.PI;sm.position.set(0,-.12,.38);head.add(sm);
  // 髮
  const cap=wSp(head,.43,hr,0,.06,-.03,{s:[.44,.36,.44]});
  if(f){wSp(head,.4,hr,0,-.15,-.22,{s:[.42,.55,.26]});if(o.pony){wSp(head,.14,hr,-.42,-.05,-.1);wSp(head,.14,hr,.42,-.05,-.1);}wBx(head,.5,.1,.1,hr,0,.22,.33);}
  else{wBx(head,.7,.12,.12,hr,0,.24,.27);wSp(head,.12,hr,.14,.4,.2,{s:[.12,.16,.1]});}
  if(o.hat==='chef'){wCy(head,.36,.28,0xffffff,0,.34,0);for(const [x,z] of [[-.2,0],[.2,0],[0,.2],[0,-.2]])wSp(head,.26,0xffffff,x,.78,z);wSp(head,.3,0xffffff,0,.88,0);}
  if(o.hat==='straw'){wCy(head,.62,.05,0xe8c36a,0,.36,0);wCy(head,.34,.28,0xe8c36a,0,.38,0);wBx(head,.7,.06,.06,0xd9534f,0,.4,.3).visible=false;}
  if(o.hat==='cap'){wCy(head,.4,.2,o.hatCol||0x1f3a7a,0,.35,0);wBx(head,.5,.05,.3,o.hatCol||0x1f3a7a,0,.36,.4);wSp(head,.07,0xffd23f,0,.5,.4,{cast:false});}
  if(o.hat==='bucket'){wCy(head,.45,.3,o.hatCol||0xffd23f,0,.3,0);wCy(head,.62,.05,o.hatCol||0xffd23f,0,.32,0);}
  if(o.hat==='hard'){wSp(head,.44,o.hatCol||0xff9f43,0,.2,0,{s:[.46,.34,.46]});wBx(head,.6,.06,.4,o.hatCol||0xff9f43,0,.2,.3);}
  if(o.glasses){for(const s of [-1,1]){const t=new THREE.Mesh(new THREE.TorusGeometry(.11,.02,6,16),wM(0x333333));t.position.set(s*.16,.04,.39);head.add(t);}wBx(head,.08,.02,.02,0x333333,0,.04,.4);}
  if(o.bow)wBx(head,.2,.12,.06,o.bow,0,-.05,.0).position.set(.3,.25,.24);
  g.userData={legs,arms,body,head,person:true};return g;}
// 外星人
function buildAlien(){const g=new THREE.Group(),sk=wM(0x7ed957,{roughness:.55}),legs=[];
  const body=new THREE.Group();g.add(body);wSp(body,.5,sk,0,.75,0,{s:[.55,.65,.5]});wSp(body,.5,wM(0xc6f5a8),0,.7,.2,{s:[.38,.45,.3]});
  const head=new THREE.Group();head.position.set(0,1.75,0);body.add(head);wSp(head,.5,sk,0,0,0,{s:[.65,.6,.6]});
  for(const s of [-1,1]){wSp(head,.2,0x1b1b2e,s*.25,.0,.45,{s:[.2,.26,.12]});wSp(head,.06,0xffffff,s*.28,.07,.55,{cast:false});wCy(head,.025,.5,0x7ed957,s*.2,.5,0,{r:[0,0,-s*.25]});wSp(head,.1,wM(0xff5ac8,{emissive:0xff5ac8,emissiveIntensity:.8}),s*.33,1.05,0,{cast:false});}
  const sm=new THREE.Mesh(new THREE.TorusGeometry(.1,.018,6,10,Math.PI),wM(0x1b1b2e));sm.rotation.z=Math.PI;sm.position.set(0,-.25,.52);head.add(sm);
  const arms=[];for(const s of [-1,1]){const a=new THREE.Group();a.position.set(s*.5,1.1,0);body.add(a);wCy(a,.08,.6,sk,0,-.55,0);arms.push(a);}
  for(const s of [-1,1]){const l=new THREE.Group();l.position.set(s*.2,.45,0);g.add(l);wCy(l,.1,.45,sk,0,-.45,0);wSp(l,.16,sk,0,-.45,.06,{s:[.16,.07,.2]});legs.push(l);}
  g.userData={legs,arms,body,head,person:true};return g;}

// ---- 頭頂標記＋名牌（Sprite） ----
function wSpriteTex(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
function wMark(kind){ // q＝問號泡泡，star＝完成
  const t=wSpriteTex(128,128,(x,w,h)=>{x.fillStyle=kind==='star'?'#ffd23f':'#ffffff';x.strokeStyle=kind==='star'?'#f29d00':'#4f8ef7';x.lineWidth=7;x.beginPath();x.arc(64,56,44,0,7);x.fill();x.stroke();
    x.beginPath();x.moveTo(44,92);x.lineTo(36,118);x.lineTo(70,98);x.fill();x.stroke();x.fillStyle=kind==='star'?'#ffd23f':'#ffffff';x.beginPath();x.arc(64,56,41,0,7);x.fill();
    x.fillStyle=kind==='star'?'#fff':'#4f8ef7';x.font='900 66px "PingFang HK",sans-serif';x.textAlign='center';x.textBaseline='middle';
    if(kind==='star'){x.beginPath();for(let i=0;i<10;i++){const r=i%2?15:34,a=-Math.PI/2+i*Math.PI/5;x.lineTo(64+Math.cos(a)*r,57+Math.sin(a)*r);}x.closePath();x.fill();}else x.fillText('?',64,60);});
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));s.scale.set(1.3,1.3,1);s.renderOrder=10;return s;}
function wName(txt){const t=wSpriteTex(256,72,(x,w,h)=>{x.fillStyle='rgba(255,255,255,.92)';x.beginPath();x.roundRect(8,8,w-16,h-16,26);x.fill();x.fillStyle='#2b3550';x.font='800 38px "PingFang HK","Hiragino Maru Gothic ProN",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(txt,w/2,h/2+2);});
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));s.scale.set(2.5,.7,1);s.renderOrder=10;return s;}

// ---- NPC＝Kidsgame 畫過嘅動物（名字就係動物名；模型取自 icons2.js 嘅 IB.<動物>） ----
// 圓頭動物：用佢哋嘅頭＋可愛身體；全身動物（大象、長頸鹿、企鵝…）直接放大用原模型
const FURC={cat:[0xf2a441,0xfff4e2],dog:[0xe2ad6a,0xfff1dc],pig:[0xf9b3c1,0xfdd5de],cow:[0xfbfbf8,0xf6b7c4],fox:[0xf07f2a,0xfffaf2],bear:[0x9a6034,0xe8c496],frog:[0x6cc24a,0xd8f5a8],mouse:[0xb9bcc6,0xf0f0f4],tiger:[0xf5a13a,0xfff4e2],panda:[0xf8f8f6,0x1f1f22],rabbit:[0xfafafa,0xf7b0c0],monkey:[0x8b5a2b,0xf3cfa6],lion:[0xf2b84b,0xfff0d2],chick:[0xf6d44a,0xfff3b0]};
const WHOLE={elephant:2.5,giraffe:3.8,penguin:2.2,duck:1.7,turtle:1.4,snail:1.4,bee:1.3,whale:3,fish:1.7,butterfly:1.9};
function buildAnimal(k){const g=new THREE.Group();
  if(FURC[k]){const [fc,bc]=FURC[k],fur=wM(fc,{roughness:.85}),bel=wM(bc,{roughness:.85}),legs=[];
    for(const s of [-1,1]){const l=new THREE.Group();l.position.set(s*.22,.58,0);g.add(l);wCy(l,.16,.58,fur,0,-.58,0);wSp(l,.2,bel,0,-.58,.06,{s:[.2,.1,.26]});legs.push(l);}
    const body=new THREE.Group();g.add(body);wSp(body,.5,fur,0,.98,0,{s:[.5,.52,.44]});wSp(body,.4,bel,0,.92,.2,{s:[.34,.4,.26]});
    const arms=[];for(const s of [-1,1]){const a=new THREE.Group();a.position.set(s*.46,1.2,0);body.add(a);wCy(a,.12,.55,fur,0,-.5,0);wSp(a,.13,bel,0,-.56,0);arms.push(a);}
    wSp(body,.16,fur,0,.65,-.42);
    const head=IB[k]();head.scale.setScalar(.66);head.position.set(0,1.78,0);body.add(head);
    head.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
    g.userData={legs,arms,body,head,whole:false};return g;}
  const m=IB[k]();const root=new THREE.Group();root.add(m);m.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(m),sz=bb.getSize(new THREE.Vector3());const sc=WHOLE[k]/Math.max(sz.x,sz.y,sz.z);m.scale.setScalar(sc);m.updateMatrixWorld(true);
  const b2=new THREE.Box3().setFromObject(m);m.position.set(-(b2.min.x+b2.max.x)/2,-b2.min.y,-(b2.min.z+b2.max.z)/2);
  m.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  g.add(root);g.userData={legs:[],arms:null,body:root,head:root,whole:true};return g;}

// ---- 頭頂星星＋名牌（Sprite） ----
// 24 位動物 NPC：cats＝出邊幾科題（chi 中文／eng 英文／math 數學／logic 推理）；at＝住喺邊
const NPCS=[
 {k:'bear',n:'熊',at:'rest',cats:['math','chi'],hello:'你好呀！我係熊，我煮咗好多好食嘅嘢，你幫我數一數啦！'},
 {k:'pig',n:'豬',at:'rest',cats:['chi','logic'],hello:'歡迎光臨！我係豬，肚肚餓喇，同我玩個小遊戲啦！'},
 {k:'cat',n:'貓',at:'svc',cats:['logic','eng'],hello:'喵！我係貓，我哋一齊估下謎語啦！'},
 {k:'monkey',n:'馬騮',at:'mkt',cats:['math','eng'],hello:'嘿嘿！我係馬騮，嚟幫我睇下啲生果啦！'},
 {k:'cow',n:'牛',at:'farm',cats:['chi','math'],hello:'哞～我係牛，農場好多動物同蔬菜呀！'},
 {k:'chick',n:'小雞',at:'farm',cats:['math','logic'],hello:'吱吱！我係小雞，嚟答我條題啦！'},
 {k:'frog',n:'青蛙',at:'pond',cats:['eng','logic'],hello:'呱呱！我係青蛙，你識唔識呢啲嘢呀？'},
 {k:'fish',n:'魚',at:'pond2',cats:['eng','chi'],hello:'噗噗！我係魚，我喺水入面游嚟游去呀！'},
 {k:'turtle',n:'烏龜',at:'pond2',cats:['math','logic'],hello:'你好……我係烏龜，慢慢嚟，唔好急呀！'},
 {k:'butterfly',n:'蝴蝶',at:'ufo',cats:['logic','chi'],hello:'你好呀！我係蝴蝶，我飛嚟飛去，你捉到我嘅題目嗎？'},
 {k:'whale',n:'鯨魚',at:'sea',cats:['eng','math'],hello:'噗～我係鯨魚，我喺大海噴水呀！'},
 {k:'duck',n:'鴨仔',at:'pier',cats:['eng','chi'],hello:'嘎嘎！我係鴨仔，碼頭好多船呀！'},
 {k:'penguin',n:'企鵝',at:'hotel',cats:['chi','eng'],hello:'歡迎嚟到酒店！我係企鵝，仲有幾條題想問你呀！'},
 {k:'lion',n:'獅子',at:'wheel',cats:['math','logic'],hello:'嘩！係河馬呀！我係獅子，一齊玩遊戲啦！'},
 {k:'elephant',n:'大象',at:'dome',cats:['logic','chi'],hello:'你好！我係大象，我記性好好，估下呢啲係咩啦！'},
 {k:'giraffe',n:'長頸鹿',at:'light',cats:['eng','math'],hello:'你好呀！我頸好長，我係長頸鹿，睇到好遠呀！'},
 {k:'panda',n:'熊貓',at:'plazaA',cats:['chi','math'],hello:'你好呀！我係熊貓，我最鍾意食竹，你識唔識呢啲嘢？'},
 {k:'tiger',n:'老虎',at:'plazaB',cats:['chi','eng','math','logic'],hello:'嗷！我係老虎，唔使驚㗎，我哋玩問答啦！'},
 {k:'fox',n:'狐狸',at:'free',cats:['logic','eng'],hello:'你好呀！我係狐狸，我好聰明㗎，你都試下啦！'},
 {k:'mouse',n:'老鼠',at:'free',cats:['math','chi'],hello:'吱吱！我係老鼠，我偷偷同你玩問答呀！'},
 {k:'snail',n:'蝸牛',at:'free',cats:['chi','logic'],hello:'你好……我係蝸牛，我行得慢，但係識好多嘢！'},
 {k:'rabbit',n:'兔子',at:'free',cats:['math','eng'],hello:'你好呀！我係兔子，跳跳跳，嚟玩問答啦！'},
 {k:'dog',n:'狗',at:'free',cats:['eng','chi'],hello:'嘩嘩！我係狗，我好開心見到你呀！'},
 {k:'bee',n:'蜜蜂',at:'free',cats:['logic','math'],hello:'嗡嗡！我係蜜蜂，我採咗好多蜜糖呀！'}];
for(const d of NPCS){d.ic=d.k;d.id=d.k;d.role='';}
NPC_SLOT.plazaA=[-4.2,5.2];NPC_SLOT.plazaB=[5,-5];
{const p=BLD.pier.g.position;NPC_SLOT.sea=[SPOTS.pier[0]+9,6.5];}
const NPCI=[];const freeSpots=[];
function pickFree(){for(let t=0;t<6000;t++){const a=wRng()*Math.PI*2,r=PLAZA_R+6+wRng()*(ISL_R-PLAZA_R-10);const x=Math.cos(a)*r,z=Math.sin(a)*r;if(!wFree(x,z,1.2))continue;if(wColl.some(q=>Math.hypot(x-q.x,z-q.z)<q.r+1.5))continue;if([...freeSpots,...Object.values(NPC_SLOT)].some(p=>Math.hypot(x-p[0],z-p[1])<9))continue;return [x,z];}return [0,-9];}
const pondEdge=(b,sgn)=>{const p=b.g.position,a=Math.atan2(-p.z,-p.x);return [p.x+Math.cos(a+sgn*.5)*6.8,p.z+Math.sin(a+sgn*.5)*6.8];};
for(const d of NPCS){let slot;
  if(d.at==='free'){slot=pickFree();freeSpots.push(slot);}
  else if(d.at==='pond')slot=pondEdge(BLD.pond,1);
  else if(d.at==='pond2'){slot=d.k==='fish'?[BLD.pond2.g.position.x+1.2,BLD.pond2.g.position.z-.8]:pondEdge(BLD.pond2,-1);}
  else{slot=NPC_SLOT[d.at];}
  let [sx,sz]=slot;
  const dup=NPCS.filter(x=>x.at===d.at&&x.at!=='pond2'&&x.at!=='free');if(dup.length>1&&BLD[d.at]){const i=dup.indexOf(d),ry=BLD[d.at].g.rotation.y;sx+=(i?1:-1)*1.7*Math.cos(ry);sz+=(i?1:-1)*1.7*-Math.sin(ry);}
  if(d.at==='pier'){sx=SPOTS.pier[0]+7;sz=0;}
  const mdl=buildAnimal(d.k),whole=mdl.userData.whole;const root=new THREE.Group();root.add(mdl);scene.add(root);root.position.set(sx,0,sz);
  const hov=d.k==='butterfly'?2.0:d.k==='fish'?.25:d.k==='whale'?-.1:0;mdl.position.y=hov;
  const top=(whole?WHOLE[d.k]:2.75)+hov;
  const mk=wMark('star'),nm=wName(d.n);mk.position.set(0,top+1.1,0);nm.position.set(0,top+.35,0);mk.visible=false;root.add(mk);root.add(nm);
  const rad=d.k==='fish'?2.4:d.k==='whale'?1.8:d.k==='snail'?.8:d.k==='turtle'?1.2:1.9;
  NPCI.push({d,root,mdl,mk,nm,home:[sx,sz],pos:root.position,ph:Math.random()*6,tgt:null,wait:Math.random()*3,done:false,star:false,whole,hov,top,rad,fixedY:true});}
