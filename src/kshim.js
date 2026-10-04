import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* ======================= 小工具＋聲音（Kidsgame 題庫要用嘅最少環境） ======================= */
// 題庫（questions_v1.js）同立體圖示（icons.js／icons2.js）原封不動複製自 Kidsgame；
// 佢哋靠呢度提供：$ $$ IC rand randi pick shuffle sleep clamp、G、dlog、say／stopSpeech、音效。
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const IC=(n,c='')=>`<svg class="ic${c?' '+c:''}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const rand=(a,b)=>a+Math.random()*(b-a);
const randi=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const dlog=()=>{};
const G={state:'title',card:false,muted:false,gen:0};
const URLP=new URLSearchParams(location.search);

/* ---------- 音效（即時合成） ---------- */
let AC=null,SFXB=null;
function initAudio(){try{if(navigator.audioSession&&navigator.audioSession.type!=='ambient')navigator.audioSession.type='ambient';}catch(e){}
  if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;AC=new C();SFXB=AC.createGain();SFXB.gain.value=.9;SFXB.connect(AC.destination);}
  try{if(AC.state!=='running')AC.resume();}catch(e){}}
for(const ev of ['touchend','pointerup','keydown'])document.addEventListener(ev,()=>{try{if(AC&&AC.state!=='running')AC.resume();}catch(e){}},{capture:true,passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){try{if(AC&&AC.state!=='running')AC.resume();}catch(e){}}});
const mf=m=>440*Math.pow(2,(m-69)/12);
function bell(f,t,dur,vol){if(!AC||G.muted)return;for(const [m,a] of [[1,1],[2,0.45],[3.01,0.22],[4.17,0.12],[5.43,0.06]]){const o=AC.createOscillator();o.frequency.value=f*m;const g=AC.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol*a,t+0.012);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g).connect(SFXB);o.start(t);o.stop(t+dur+0.05);}}
function correctSfx(){if(!AC)return;const t=AC.currentTime+0.01;[72,76,79,84,88].forEach((m,i)=>bell(mf(m),t+i*0.08,0.8,0.14));}
function wrongSfx(){if(!AC||G.muted)return;const t=AC.currentTime+0.01,o=AC.createOscillator();o.type='triangle';o.frequency.setValueAtTime(330,t);o.frequency.exponentialRampToValueAtTime(220,t+0.28);const g=AC.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.14,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+0.34);o.connect(g).connect(SFXB);o.start(t);o.stop(t+0.4);}
function blip(){if(AC)bell(mf(84),AC.currentTime+0.01,0.4,0.12);}
function popSfx(){if(!AC||G.muted)return;const t=AC.currentTime+0.005,o=AC.createOscillator();o.frequency.setValueAtTime(420,t);o.frequency.exponentialRampToValueAtTime(900,t+0.09);const g=AC.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.16,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+0.14);o.connect(g).connect(SFXB);o.start(t);o.stop(t+0.2);}
// 河馬叫：低音「噗～」
function hippoSfx(){if(!AC||G.muted)return;const t=AC.currentTime+0.005;for(const [f,tt,d] of [[150,0,.22],[190,.2,.3]]){const o=AC.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(f,t+tt);o.frequency.exponentialRampToValueAtTime(f*0.72,t+tt+d);const fl=AC.createBiquadFilter();fl.type='lowpass';fl.frequency.value=520;const g=AC.createGain();g.gain.setValueAtTime(0.0001,t+tt);g.gain.exponentialRampToValueAtTime(0.22,t+tt+0.03);g.gain.exponentialRampToValueAtTime(0.0001,t+tt+d);o.connect(fl).connect(g).connect(SFXB);o.start(t+tt);o.stop(t+tt+d+0.05);}}
function stepSfx(){if(!AC||G.muted)return;const t=AC.currentTime+0.003,o=AC.createOscillator();o.type='sine';o.frequency.setValueAtTime(95,t);o.frequency.exponentialRampToValueAtTime(52,t+0.09);const g=AC.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.07,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+0.12);o.connect(g).connect(SFXB);o.start(t);o.stop(t+0.15);}
function fanfare(){if(!AC||G.muted)return;const t=AC.currentTime+0.05;[[72,0],[76,.22],[79,.44],[84,.66],[79,.98],[84,1.2],[88,1.5]].forEach(([m,d],i,a)=>{bell(mf(m),t+d,i===a.length-1?2:0.9,0.14);bell(mf(m-12),t+d,0.8,0.05);});}

/* ---------- 語音：廣東話讀題、英文讀英文（揀聲邏輯同 Kidsgame 一樣） ---------- */
const TTS='speechSynthesis' in window?window.speechSynthesis:null;let VOICES=[];const VCACHE={};
function loadVoices(){if(TTS){VOICES=TTS.getVoices();for(const k in VCACHE)delete VCACHE[k];}}loadVoices();if(TTS)TTS.onvoiceschanged=loadVoices;
const BAD_V=/^(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|junior|organ|pipe organ|superstar|trinoids|whisper|wobble|zarvox|fred|ralph|kathy|eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley)\b/i;
const PREF_V={en:['samantha','ava','allison','susan','zoe','nicky','joelle','google us english','aria','jenny','zira','karen','moira','tessa','serena','daniel','google uk english female'],'zh-hk':['sinji','sin-ji','善怡','hiugaai','hiumaan','google 粵語','粵語','cantonese']};
function voiceFor(lang){const Lg=lang.toLowerCase(),pre=Lg.split('-')[0];if(VCACHE[Lg]!==undefined&&VOICES.length)return VCACHE[Lg];const norm=v=>v.lang.toLowerCase().replace('_','-'),ok=v=>!BAD_V.test(v.name);
  let c=VOICES.filter(v=>norm(v)===Lg&&ok(v));if(!c.length&&Lg==='zh-hk')c=VOICES.filter(v=>/^(yue|zh-hk)/.test(norm(v))&&ok(v));
  if(!c.length&&pre!=='zh')c=VOICES.filter(v=>norm(v).startsWith(pre)&&ok(v));if(!c.length)return null;const PL=PREF_V[Lg]||PREF_V[pre]||[];
  const rank=v=>{const n=v.name.toLowerCase(),i=PL.findIndex(p=>n.includes(p));return (/premium|enhanced|高音質|優化|增強|高品質/.test(n)?-100:0)+(i<0?60:i)*2+(norm(v)===Lg?0:1);};
  const best=c.slice().sort((a,b)=>rank(a)-rank(b))[0];if(VOICES.length)VCACHE[Lg]=best;return best;}
let lastCancel=0;
// ann 參數為兼容題庫；呢個遊戲對白同讀題都用語音
function say(text,lang='zh-HK',ann=true){return new Promise(res=>{if(!TTS||G.muted||!text){setTimeout(res,G.muted?400:0);return;}
  const u=new SpeechSynthesisUtterance(text);u.lang=lang;const v=voiceFor(lang);if(v)u.voice=v;u.volume=1;u.rate=lang.startsWith('en')?0.9:0.92;u.pitch=1.08;
  let done=false,to=0;const fin=()=>{if(!done){done=true;clearTimeout(to);res();}};u.onend=fin;u.onerror=fin;
  const go=()=>{if(done)return;try{if(TTS.paused)TTS.resume();}catch(e){}TTS.speak(u);to=setTimeout(fin,2500+text.length*(lang.startsWith('en')?95:300));};
  const w=lastCancel+220-performance.now();if(w>0)setTimeout(go,w);else go();});}
function stopSpeech(){if(TTS&&(TTS.speaking||TTS.pending)){TTS.cancel();lastCancel=performance.now();}}

/* ---------- 貼圖／幾何小工具（複製自 Kidsgame core.js，立體圖示要用） ---------- */
function cv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')];}
function T(c,rep,srgb=true){const t=new THREE.CanvasTexture(c);if(srgb)t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;}return t;}
function speck(x,w,h,n,cols,r0,r1){for(let i=0;i<n;i++){x.globalAlpha=0.45+Math.random()*0.55;x.fillStyle=cols[i%cols.length];const r=r0+Math.random()*(r1-r0);x.beginPath();x.arc(Math.random()*w,Math.random()*h,r,0,6.2832);x.fill();}x.globalAlpha=1;}
function rr(x,X,Y,w,h,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath();}
const JPF='"Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP","PingFang HK",sans-serif';
// 由灰階高度圖生成法線貼圖（令碎石、枕木有立體感）
function normalFromHeight(hc,str=2){const w=hc.width,h=hc.height,src=hc.getContext('2d').getImageData(0,0,w,h).data;const [c,x]=cv(w,h);const img=x.createImageData(w,h),d=img.data;
  const H=(i,j)=>src[((((j%h)+h)%h)*w+(((i%w)+w)%w))*4]/255;
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const nx=-(H(i+1,j)-H(i-1,j))*str,ny=(H(i,j+1)-H(i,j-1))*str,l=Math.hypot(nx,ny,1),k=(j*w+i)*4;d[k]=(nx/l*0.5+0.5)*255;d[k+1]=(ny/l*0.5+0.5)*255;d[k+2]=(1/l*0.5+0.5)*255;d[k+3]=255;}
  x.putImageData(img,0,0);return T(c,1,false);}
class Merger{constructor(vc=false){this.list=[];this.vc=vc;}
  add(geo,x=0,y=0,z=0,rx=0,ry=0,rz=0,s=1,col){const S=Array.isArray(s)?s:[s,s,s];return this.addM(geo,new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(rx,ry,rz)),new THREE.Vector3(S[0],S[1],S[2])),col);}
  addM(geo,m,col){const g=geo.index?geo.toNonIndexed():geo.clone(),keep=col==='keep'&&!!g.attributes.color;for(const k of Object.keys(g.attributes))if(k!=='position'&&k!=='normal'&&k!=='uv'&&!(keep&&k==='color'))g.deleteAttribute(k);const n=g.attributes.position.count;
    if(!g.attributes.uv)g.setAttribute('uv',new THREE.BufferAttribute(new Float32Array(n*2),2));
    if(this.vc&&!keep){const c=new THREE.Color(col??0xffffff),a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=c.r;a[i*3+1]=c.g;a[i*3+2]=c.b;}g.setAttribute('color',new THREE.BufferAttribute(a,3));}
    g.clearGroups();g.applyMatrix4(m);this.list.push(g);return this;}
  mesh(mat,cast=true,recv=true){if(!this.list.length)return null;const o=new THREE.Mesh(mergeGeometries(this.list,false),mat);o.castShadow=cast;o.receiveShadow=recv;return o;}}
function mesh(g,m,cast=false,recv=true,parent=scene){const o=new THREE.Mesh(g,m);o.castShadow=cast;o.receiveShadow=recv;parent.add(o);return o;}
function cyl(mg,a,b,r,seg=6,col){const d=new THREE.Vector3().subVectors(b,a),len=d.length();const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());mg.addM(new THREE.CylinderGeometry(r,r,len,seg),new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5),q,new THREE.Vector3(1,1,1)),col);}
function std(o){return new THREE.MeshStandardMaterial(o);}
