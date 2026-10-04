// 唔俾 iPad 手勢放大縮小（雙指、雙擊、長按選字）
for(const ev of ['gesturestart','gesturechange','gestureend'])document.addEventListener(ev,e=>e.preventDefault(),{passive:false});
document.addEventListener('touchmove',e=>{if(e.touches.length>1||(e.scale&&e.scale!==1))e.preventDefault();},{passive:false});
let lastTE=0;document.addEventListener('touchend',e=>{const n=Date.now();if(n-lastTE<350)e.preventDefault();lastTE=n;},{passive:false});
document.addEventListener('dblclick',e=>e.preventDefault());document.addEventListener('contextmenu',e=>e.preventDefault());
/* ======================= 遊戲：河馬自由行走＋同 NPC 問答 ======================= */
// 答題畫面、題目、讀題、答對答錯效果全部沿用 Kidsgame（renderQ／makeQ），同火車遊戲每站答題一樣。
const QN=4;                       // 每位 NPC 問 4 題
const SAVE_KEY='hippo-planet-v1';
let SV={stars:0,correct:0,done:{},muted:false,en:5};
try{Object.assign(SV,JSON.parse(localStorage.getItem(SAVE_KEY)||'{}'));}catch(e){}
const saveSV=()=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify(SV));}catch(e){}};
G.muted=!!SV.muted;const EMAX=5;if(typeof SV.en!=='number')SV.en=EMAX;
const level=()=>SV.correct>=45?3:SV.correct>=15?2:1;

// ---- 河馬 ----
const hippo=buildHippo();scene.add(hippo);
const HP={x:-1.5,z:7.5,face:Math.PI,vx:0,vz:0,ph:0,jump:0,step:0,splash:0};
hippo.position.set(HP.x,0,HP.z);
// 水花
const rings=[];function splashAt(x,z){const m=new THREE.Mesh(new THREE.RingGeometry(.3,.45,24),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,.25,z);scene.add(m);rings.push({m,t:0});}

// 指向池塘嘅箭嘴（冇能量時出現）
const arrow=new THREE.Group();{const ar=wCone(arrow,.6,1.4,0x3ec1d3,0,0,1.4,{r:[Math.PI/2,0,0]});wBx(arrow,.5,.3,1.2,0x3ec1d3,0,0,.3);scene.add(arrow);arrow.visible=false;}
// ---- 輸入 ----
const KEYS={};addEventListener('keydown',e=>{KEYS[e.key.toLowerCase()]=true;});addEventListener('keyup',e=>{KEYS[e.key.toLowerCase()]=false;});
const JOY={on:false,id:-1,x0:0,y0:0,dx:0,dy:0,t0:0,moved:false};
let walkTo=null;   // 點地面自動行過去
const joyEl=$('#joy'),joyKnob=$('#joyk');
function uiBlocked(){return G.mode!=='play';}
wCanvas.addEventListener('pointerdown',e=>{if(uiBlocked()||JOY.on)return;JOY.on=true;JOY.id=e.pointerId;JOY.x0=e.clientX;JOY.y0=e.clientY;JOY.dx=JOY.dy=0;JOY.t0=performance.now();JOY.moved=false;walkTo=null;
  joyEl.style.left=e.clientX+'px';joyEl.style.top=e.clientY+'px';joyKnob.style.transform='translate(-50%,-50%)';try{wCanvas.setPointerCapture(e.pointerId);}catch(_){}});
wCanvas.addEventListener('pointermove',e=>{if(!JOY.on||e.pointerId!==JOY.id)return;let dx=e.clientX-JOY.x0,dy=e.clientY-JOY.y0;const m=Math.hypot(dx,dy),R=62;if(m>12){JOY.moved=true;joyEl.classList.add('on');}if(m>R){dx*=R/m;dy*=R/m;}JOY.dx=dx/R;JOY.dy=dy/R;joyKnob.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;});
const joyEnd=e=>{if(!JOY.on||e.pointerId!==JOY.id)return;JOY.on=false;joyEl.classList.remove('on');
  if(!JOY.moved&&performance.now()-JOY.t0<400&&G.mode==='play')tapWorld(e.clientX,e.clientY);JOY.dx=JOY.dy=0;};
wCanvas.addEventListener('pointerup',joyEnd);wCanvas.addEventListener('pointercancel',joyEnd);
const RAY=new THREE.Raycaster(),V2=new THREE.Vector2(),GP=new THREE.Plane(new THREE.Vector3(0,1,0),0),V3=new THREE.Vector3();
function tapWorld(cx,cy){V2.set(cx/innerWidth*2-1,-(cy/innerHeight)*2+1);RAY.setFromCamera(V2,camera);
  // 撳河馬：叫一聲＋跳
  const hp=new THREE.Vector3(HP.x,1.2,HP.z).project(camera);if(Math.hypot((hp.x*.5+.5)*innerWidth-cx,(-hp.y*.5+.5)*innerHeight-cy)<70){HP.jump=1;hippoSfx();return;}
  // 撳 NPC：行過去
  let best=null,bd=80;for(const n of NPCI){const p=new THREE.Vector3(n.pos.x,1.6,n.pos.z).project(camera);const d=Math.hypot((p.x*.5+.5)*innerWidth-cx,(-p.y*.5+.5)*innerHeight-cy);if(d<bd){bd=d;best=n;}}
  if(best){if(Math.hypot(best.pos.x-HP.x,best.pos.z-HP.z)<TALKR){startTalk(best);}else walkTo={x:best.pos.x,z:best.pos.z,npc:best};return;}
  if(RAY.ray.intersectPlane(GP,V3)&&wWalkable(V3.x,V3.z))walkTo={x:V3.x,z:V3.z};}

// ---- NPC 行來行去 ----
const TALKR=3.3;
function updNPC(n,dt,t){const d=n.pos;n.wait-=dt;
  if(G.mode==='talk'&&G.npc===n){const a=Math.atan2(HP.x-d.x,HP.z-d.z);n.root.rotation.y=lerpA(n.root.rotation.y,a,.15);n.tgt=null;}
  else{ if(n.tgt){const dx=n.tgt[0]-d.x,dz=n.tgt[1]-d.z,m=Math.hypot(dx,dz);if(m<.15){n.tgt=null;n.wait=2+Math.random()*3;}else{const s=1.1*dt;d.x+=dx/m*s;d.z+=dz/m*s;n.root.rotation.y=lerpA(n.root.rotation.y,Math.atan2(dx,dz),.12);n.walk=true;}}
    else{n.walk=false;if(n.wait<=0){const a=Math.random()*6.28,r=Math.random()*n.rad;n.tgt=[n.home[0]+Math.cos(a)*r,n.home[1]+Math.sin(a)*r];}
      const near=Math.hypot(HP.x-d.x,HP.z-d.z);if(near<7&&G.mode==='play'){n.root.rotation.y=lerpA(n.root.rotation.y,Math.atan2(HP.x-d.x,HP.z-d.z),.06);}}
    // 唔好企入建築／河馬
    wPush(d,.5);}
  const u=n.mdl.userData,w=n.walk?Math.sin(t*8+n.ph):0;u.legs.forEach((l,i)=>l.rotation.x=w*(i?1:-1)*.7);if(u.arms)u.arms.forEach((a,i)=>a.rotation.x=n.walk?-w*(i?1:-1)*.6:Math.sin(t*1.8+n.ph+i)*.06);
  const talking=G.mode==='talk'&&G.npc===n;if(talking&&u.arms)u.arms[1].rotation.x=-1.0+Math.sin(t*6)*.25;
  if(n.whole)n.mdl.rotation.z=n.walk?Math.sin(t*8+n.ph)*.09:Math.sin(t*1.6+n.ph)*.02;
  u.body.position.y=Math.abs(w)*.06+Math.sin(t*2+n.ph)*.012;
  const near=Math.hypot(HP.x-d.x,HP.z-d.z)<TALKR;n.root.scale.setScalar(1+(near&&G.mode==='play'?Math.sin(t*6)*.025:0));
  n.mk.position.y=n.top+1.1+Math.sin(t*3+n.ph)*.14;n.mk.visible=n.star&&(G.mode==='play'||G.mode==='cover');n.nm.visible=G.mode==='play'&&Math.hypot(HP.x-d.x,HP.z-d.z)<14;}
function lerpA(a,b,t){let d=b-a;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return a+d*t;}

// ---- 河馬移動 ----
let nearNPC=null,drinking=false,drinkT=0;
function updHippo(dt,t){let ix=0,iz=0;
  if(G.mode==='play'){ix=(KEYS.arrowright||KEYS.d?1:0)-(KEYS.arrowleft||KEYS.a?1:0);iz=(KEYS.arrowdown||KEYS.s?1:0)-(KEYS.arrowup||KEYS.w?1:0);
    if(JOY.on&&JOY.moved){ix=JOY.dx;iz=JOY.dy;}
    if(!ix&&!iz&&walkTo){const dx=walkTo.x-HP.x,dz=walkTo.z-HP.z,m=Math.hypot(dx,dz);const stop=walkTo.npc?TALKR-1.1:.4;if(m<stop){const w=walkTo;walkTo=null;if(w.npc)startTalk(w.npc);}else{ix=dx/m;iz=dz/m;}}
    else if(ix||iz)walkTo=null;}
  const m=Math.min(1,Math.hypot(ix,iz));const sp=8.6*m;let tx=0,tz=0;if(m>0.001){tx=ix/Math.hypot(ix,iz)*sp;tz=iz/Math.hypot(ix,iz)*sp;}
  HP.vx+=(tx-HP.vx)*Math.min(1,dt*9);HP.vz+=(tz-HP.vz)*Math.min(1,dt*9);
  const px=HP.x,pz=HP.z;HP.x+=HP.vx*dt;HP.z+=HP.vz*dt;
  const pos={x:HP.x,z:HP.z};wPush(pos,.95,NPCI.map(n=>({x:n.pos.x,z:n.pos.z,r:.55})));
  if(!wWalkable(pos.x,pos.z)){if(wWalkable(pos.x,pz))pos.z=pz;else if(wWalkable(px,pos.z))pos.x=px;else{pos.x=px;pos.z=pz;}}
  HP.x=pos.x;HP.z=pos.z;
  const spd=Math.hypot(HP.vx,HP.vz);if(spd>.4)HP.face=lerpA(HP.face,Math.atan2(HP.vx,HP.vz),Math.min(1,dt*10));
  else if(G.mode==='talk'&&G.npc)HP.face=lerpA(HP.face,Math.atan2(G.npc.pos.x-HP.x,G.npc.pos.z-HP.z),Math.min(1,dt*6));
  HP.ph+=spd*dt*1.9;const sw=Math.sin(HP.ph)*Math.min(1,spd/3)*.7;const u=hippo.userData;
  u.legs.forEach((l,i)=>{l.rotation.x=(i===0||i===3?sw:-sw);});
  if(spd>2&&Math.sin(HP.ph)*Math.sin(HP.ph-spd*dt*1.9)<=0){HP.step++;if(HP.step%1===0)stepSfx();}
  if(HP.jump>0){HP.jump=Math.max(0,HP.jump-dt*1.6);}
  const jy=Math.sin((1-HP.jump)*Math.PI)*(HP.jump>0?1.1:0);
  u.body.position.y=Math.abs(Math.sin(HP.ph))*.1*Math.min(1,spd/3)+Math.sin(t*2)*.012+jy;u.body.rotation.z=Math.sin(HP.ph)*.05*Math.min(1,spd/3);u.tail.rotation.y=Math.sin(t*9)*.6;u.head.rotation.x=Math.sin(HP.ph*2)*.04;
  hippo.position.set(HP.x,0,HP.z);hippo.rotation.y=HP.face;
  // 池塘水花
  const pd=PONDS.find(p=>Math.hypot(HP.x-p.x,HP.z-p.z)<p.r);drinking=!!pd&&G.mode==='play';
  if(pd&&spd>1.5){HP.splash-=dt;if(HP.splash<=0){HP.splash=.28;splashAt(HP.x,HP.z);}}
  if(drinking&&SV.en<EMAX){drinkT+=dt;HP.splash-=dt;if(HP.splash<=0){HP.splash=.35;splashAt(HP.x+Math.sin(HP.face)*1.3,HP.z+Math.cos(HP.face)*1.3);}
    if(drinkT>=.9){drinkT=0;SV.en++;saveSV();updEn(true);blip();if(SV.en>=EMAX){hint('飲飽水喇！河馬有晒能量，繼續去搵朋友啦！');say('飲飽水喇！','zh-HK');}}}
  else if(!drinking)drinkT=0;
  u.head.rotation.x=(drinking&&SV.en<EMAX&&spd<2)?.55+Math.sin(t*7)*.08:u.head.rotation.x;}

// ---- 鏡頭 ----
const CAM={x:0,z:0,ang:0};
function updCam(dt,t){let tx,tz,dist,h,ox=0;
  if(G.mode==='cover'){CAM.ang+=dt*.12;const a=CAM.ang;tx=0;tz=2;dist=40;h=30;camera.position.set(tx+Math.sin(a)*dist,h,tz+Math.cos(a)*dist);camera.lookAt(tx,0,tz);return;}
  tx=HP.x;tz=HP.z;const asp=innerWidth/innerHeight;dist=asp<1?27:20;h=asp<1?25:18;
  if(G.mode==='talk'&&G.npc){tx=(HP.x+G.npc.pos.x)/2;tz=(HP.z+G.npc.pos.z)/2;dist*=.62;h*=.55;}
  CAM.x+=(tx-CAM.x)*Math.min(1,dt*(G.mode==='talk'?3:5));CAM.z+=(tz-CAM.z)*Math.min(1,dt*(G.mode==='talk'?3:5));
  camera.position.set(CAM.x,h,CAM.z+dist);camera.lookAt(CAM.x,1,CAM.z-1);
  sun.position.set(CAM.x+30,48,CAM.z+22);sun.target.position.set(CAM.x,0,CAM.z);}

// ---- 傾偈／答題 ----
G.mode='cover';G.npc=null;
function qProg(k,res=[]){$('#qprog').innerHTML=k<0?'':Array.from({length:QN},(_,i)=>`<i class="${i<k?(res[i]===false?'miss':'done'):i===k?'cur':''}"></i>`).join('');}
function npcLine(n,html){$('#tkIc').innerHTML=ico(n.d.ic);$('#tkName').textContent=n.d.n;$('#tkRole').style.display=n.d.role?'':'none';$('#tkRole').textContent=n.d.role;$('#tkText').innerHTML=html;}
let TKID=0;
async function startTalk(n){if(G.mode!=='play')return;
  if(SV.en<=0){hint('河馬冇能量喇！去池塘飲水先啦！');say('河馬冇能量喇，去池塘飲啖水啦！','zh-HK');return;}G.mode='talk';G.npc=n;walkTo=null;JOY.on=false;joyEl.classList.remove('on');const my=++TKID;
  $('#bTalk').classList.add('hidden');$('#talk').classList.remove('hidden');npcLine(n,n.d.hello);$('#tkBtns').innerHTML=`<button class="bigbtn" id="tkGo">${IC('play')}<span>好呀</span></button><button class="bigbtn alt" id="tkNo">${IC('close')}<span>遲啲先</span></button>`;
  popSfx();say(n.d.hello,'zh-HK');
  $('#tkNo').onclick=()=>{stopSpeech();++TKID;endTalk();};
  $('#tkGo').onclick=()=>{stopSpeech();SV.en=Math.max(0,SV.en-1);saveSV();updEn();runQuiz(n,my);};}
function endTalk(){$('#talk').classList.add('hidden');hideCard();G.mode='play';G.npc=null;}
async function runQuiz(n,my){$('#talk').classList.add('hidden');const res=[],used=new Set(),cats=n.d.cats,lv=level();let right=0;
  for(let i=0;i<QN;i++){const cat=cats[i%cats.length];const all=typesOf(cat);let pool=all.filter(k=>!used.has(k));if(!pool.length)pool=all;let q=null;
    for(let k=0;k<6&&!q;k++){const type=pick(pool);try{q=makeQ(type,lv);used.add(type);}catch(e){console.warn('題目出錯',type,e);}}
    if(!q)continue;qProg(i,res);
    const ok=await new Promise(rs=>{showCard(false);renderQ(q,rs);});if(TKID!==my)return;hideCard();res.push(ok);if(ok){right++;SV.correct++;SV.stars++;updStars(true);}saveSV();}
  qProg(-1);G.card=false;
  const first=!SV.done[n.d.id];SV.done[n.d.id]=Math.max(SV.done[n.d.id]||0,right);saveSV();updStars();updDone();
  const msg=right===QN?'全部答啱！你好叻呀！多謝你！':right>=2?'好叻呀！多謝你幫我！':'多謝你陪我玩！下次一定更叻！';
  $('#talk').classList.remove('hidden');npcLine(n,msg+`<div class="rstars">${Array.from({length:QN},(_,i)=>`<span class="${res[i]?'on':''}">${IC('star')}</span>`).join('')}</div>`);
  $('#tkBtns').innerHTML=`<button class="bigbtn" id="tkOk">${IC('play')}<span>繼續行</span></button>`;
  correctSfx();confetti(right*14+10);say(msg,'zh-HK');if(right===QN)HP.jump=1;
  $('#tkOk').onclick=()=>{stopSpeech();endTalk();checkAll();};}
const allDone=()=>NPCI.every(n=>SV.done[n.d.id]!==undefined);
function checkAll(){if(allDone()&&!SV.won){SV.won=1;saveSV();G.mode='win';$('#win').classList.remove('hidden');fanfare();say('你同晒所有朋友玩咗問答，真係好叻呀！你係旅遊星球小博士！','zh-HK');for(let i=0;i<5;i++)setTimeout(()=>confetti(60),i*500);}}
let hintT=0;function hint(t){const h=$('#hint');h.textContent=t;h.classList.remove('hidden');clearTimeout(hintT);hintT=setTimeout(()=>h.classList.add('hidden'),4200);}
function updEn(pop){$('#energy').innerHTML=Array.from({length:EMAX},(_,i)=>`<span class="${i<SV.en?'on':''}">${IC('bolt')}</span>`).join('');if(pop){const e=$('#energy');e.classList.remove('pop');void e.offsetWidth;e.classList.add('pop');}}
function updStars(pop){$('#starN').textContent=SV.stars;if(pop){const s=$('#stars');s.classList.remove('pop');void s.offsetWidth;s.classList.add('pop');}$('#doneN').textContent=NPCI.filter(n=>SV.done[n.d.id]!==undefined).length+'/'+NPCI.length;}
function updDone(){for(const n of NPCI){const was=n.star,is=SV.done[n.d.id]!==undefined;if(was!==is)n.star=is;}}

// ---- 迴圈 ----
const clock=new THREE.Clock();let TT=0;
function loop(){requestAnimationFrame(loop);const dt=Math.min(.05,clock.getDelta());TT+=dt;
  if(G.mode==='play'||G.mode==='talk'||G.mode==='cover'||G.mode==='win'){updHippo(dt,TT);}
  for(const n of NPCI)updNPC(n,dt,TT);
  for(const f of wAnim)f(TT,dt);
  wWater.material.map.offset.set(TT*.01,TT*.007);wShallow.forEach((m,i)=>m.material.opacity=(i?.55:.45)+Math.sin(TT*1.4+i)*.08);
  for(let i=rings.length-1;i>=0;i--){const r=rings[i];r.t+=dt;const s=1+r.t*3.2;r.m.scale.set(s,s,s);r.m.material.opacity=.8*(1-r.t/.9);if(r.t>.9){scene.remove(r.m);rings.splice(i,1);}}
  // 附近有 NPC → 出「傾偈」掣
  if(G.mode==='play'){let b=null,bd=TALKR;for(const n of NPCI){const d=Math.hypot(HP.x-n.pos.x,HP.z-n.pos.z);if(d<bd){bd=d;b=n;}}nearNPC=b;const bt=$('#bTalk');if(b){if(bt.classList.contains('hidden')){bt.classList.remove('hidden');}$('#bTalkIc').innerHTML=ico(b.d.ic);}else bt.classList.add('hidden');}
  if(SV.en<=0&&G.mode==='play'){const p=PONDS.slice().sort((a,b)=>Math.hypot(HP.x-a.x,HP.z-a.z)-Math.hypot(HP.x-b.x,HP.z-b.z))[0];arrow.visible=true;arrow.position.set(HP.x,3.6+Math.sin(TT*5)*.25,HP.z);arrow.rotation.y=Math.atan2(p.x-HP.x,p.z-HP.z);}else arrow.visible=false;
  updCam(dt,TT);wRenderer.render(scene,camera);}

// ---- 介面 ----
$('#bTalk').onclick=()=>{if(nearNPC)startTalk(nearNPC);};
$('#qsay').onclick=()=>{if(QS&&!QS.locked)speakQ(QS.q);};
$('#bMute').onclick=()=>{G.muted=!G.muted;SV.muted=G.muted;saveSV();$('#bMute').innerHTML=IC(G.muted?'mute':'sound');if(G.muted)stopSpeech();};
$('#bMute').innerHTML=IC(G.muted?'mute':'sound');
$('#winOk').onclick=()=>{$('#win').classList.add('hidden');G.mode='play';};
$('#bHome').onclick=()=>{if(G.mode==='play'){walkTo={x:0,z:9};}};
$('#startBtn').onclick=()=>{initAudio();popSfx();$('#cover').classList.add('hidden');$('#resetBtn').classList.add('hidden');G.mode='play';G.state='play';hippoSfx();say('你好呀！我係河馬。我哋一齊去河馬星球探險，同朋友玩問答啦！','zh-HK');if(SV.en<=0)hint('河馬冇能量喇！去池塘飲水先啦！');setTimeout(()=>{try{icoWarm();}catch(e){}},50);};
$('#resetBtn').onclick=()=>{if(confirm('清除所有星星同進度？')){SV={stars:0,correct:0,done:{},muted:SV.muted,en:5};saveSV();location.reload();}};
updStars();updDone();updEn();
// 預先畫第一批圖示，避免第一題卡頓
setTimeout(()=>{try{icoWarm();}catch(e){}},400);
for(const n of NPCI)n.root.rotation.y=Math.atan2(-n.pos.x,-n.pos.z);
window.__dbg={HP,G,NPCI,startTalk,SV,camera,scene,ico,IB,makeQ,QT,PONDS,hint,updEn};
loop();
