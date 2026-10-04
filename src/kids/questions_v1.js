/* ======================= 題庫 ======================= */
// 四科：中文、英文、數學、推理（每個站各 2 題）
const CATS={chi:{n:'中文',c:'#e0453a',i:'brush'},eng:{n:'英文',c:'#8b5cf6',i:'abc'},math:{n:'數學',c:'#2f7fe0',i:'math'},logic:{n:'推理',c:'#f08a24',i:'puzzle'}};
// 題目圖片全部係 three.js 立體圖示（icons.js / icons2.js），唔用 emoji
const IT={apple:['蘋果','APPLE'],banana:['香蕉','BANANA'],grapes:['提子','GRAPES'],orange:['橙','ORANGE'],watermelon:['西瓜','WATERMELON'],strawberry:['士多啤梨','STRAWBERRY'],pear:['梨','PEAR'],peach:['桃','PEACH'],cherry:['車厘子','CHERRY'],lemon:['檸檬','LEMON'],pineapple:['菠蘿','PINEAPPLE'],kiwi:['奇異果','KIWI'],
  cat:['貓','CAT'],dog:['狗','DOG'],pig:['豬','PIG'],cow:['牛','COW'],fox:['狐狸','FOX'],bee:['蜜蜂','BEE'],duck:['鴨仔','DUCK'],bear:['熊','BEAR'],frog:['青蛙','FROG'],fish:['魚','FISH'],mouse:['老鼠','MOUSE'],tiger:['老虎','TIGER'],panda:['熊貓','PANDA'],rabbit:['兔子','RABBIT'],monkey:['馬騮','MONKEY'],lion:['獅子','LION'],elephant:['大象','ELEPHANT'],giraffe:['長頸鹿','GIRAFFE'],penguin:['企鵝','PENGUIN'],butterfly:['蝴蝶','BUTTERFLY'],turtle:['烏龜','TURTLE'],snail:['蝸牛','SNAIL'],chick:['小雞','CHICK'],whale:['鯨魚','WHALE'],
  bus:['巴士','BUS'],car:['汽車','CAR'],train:['火車','TRAIN'],ship:['輪船','SHIP'],plane:['飛機','PLANE'],bike:['單車','BIKE'],rocket:['火箭','ROCKET'],taxi:['的士','TAXI'],
  sun:['太陽','SUN'],moon:['月亮','MOON'],star:['星星','STAR'],rainbow:['彩虹','RAINBOW'],tree:['大樹','TREE'],flower:['花','FLOWER'],umbrella:['雨傘','UMBRELLA'],
  egg:['雞蛋','EGG'],cake:['蛋糕','CAKE'],milk:['牛奶','MILK'],icecream:['雪糕','ICE CREAM'],book:['書','BOOK'],ball:['足球','BALL'],hat:['帽','HAT'],key:['鎖匙','KEY'],box:['箱','BOX'],pen:['筆','PEN'],clock:['鬧鐘','CLOCK'],house:['屋','HOUSE'],door:['門','DOOR'],glasses:['眼鏡','GLASSES'],bag:['書包','BAG'],cup:['杯','CUP'],balloon:['氣球','BALLOON']};
const EN=['cat dog pig cow fox bee bus car sun egg hat key box pen cup'.split(' '),'duck bear frog fish ship bike moon star tree cake milk book ball door apple train mouse tiger panda lemon peach house clock taxi whale'.split(' '),'banana orange rabbit monkey rocket flower penguin elephant giraffe umbrella turtle balloon'.split(' ')];
const ZHK1=['apple','banana','watermelon','train','car','bus','plane','sun','moon','star','tree','umbrella','egg','cake','milk','icecream','tiger','panda','rabbit','elephant','chick','fish','cat','dog','ball','bag'];
const ZHK2=ZHK1.concat(['lemon','pineapple','ship','bike','rocket','rainbow','clock','glasses','lion','penguin','butterfly','turtle','snail','frog','mouse','bee','fox','giraffe','monkey','key','whale','balloon']);
const ZHD=[...'星國山水木人口日天中手上下白田石目米羊馬花草門風雲刀耳鳥土女子力心光雨瓜果車'];
const PAX=['pax_man','pax_woman','pax_boy','pax_girl','pax_grandpa','pax_grandma'];
const COUNTS=[['train','架','火車卡'],['bus','架','巴士'],['chick','隻','小雞'],['apple','個','蘋果'],['sakura','朵','花'],['star','粒','星星'],['fish','條','魚'],['balloon','個','氣球'],['duck','隻','鴨仔']];
const RIDDLES=[
  {q:'紅紅圓圓，甜甜脆脆，係咩水果？',a:'apple',d:['banana','grapes'],n:'蘋果'},
  {q:'彎彎黃黃好似月亮，剝咗皮就食得，係咩水果？',a:'banana',d:['apple','watermelon'],n:'香蕉'},
  {q:'外面綠色，入面紅色，夏天食好解渴，係咩？',a:'watermelon',d:['orange','strawberry'],n:'西瓜'},
  {q:'長長鼻，大耳仔，身體大大隻，係咩動物？',a:'elephant',d:['mouse','rabbit'],n:'大象'},
  {q:'頸好長好長，食樹頂啲葉，係咩動物？',a:'giraffe',d:['elephant','pig'],n:'長頸鹿'},
  {q:'成日喵喵叫，最鍾意食魚，係咩動物？',a:'cat',d:['dog','cow'],n:'貓仔'},
  {q:'長耳仔，跳跳跳，鍾意食紅蘿蔔，係咩動物？',a:'rabbit',d:['bear','fish'],n:'兔仔'},
  {q:'背住間屋慢慢行，係咩動物？',a:'snail',d:['dog','chick'],n:'蝸牛'},
  {q:'黑白色，好鍾意食竹，係咩動物？',a:'panda',d:['tiger','monkey'],n:'熊貓'},
  {q:'晚上喺天空一閃一閃，係咩？',a:'star',d:['sun','rainbow'],n:'星星'},
  {q:'落雨嗰陣撐開佢，就唔會濕身，係咩？',a:'umbrella',d:['glasses','bag'],n:'雨傘'},
  {q:'喺路軌上面行，會停好多個站，係咩？',a:'train',d:['plane','ship'],n:'火車'},
  {q:'有翼識飛，但唔係雀仔，可以載好多人，係咩？',a:'plane',d:['bus','bike'],n:'飛機'},
  {q:'凍冰冰，甜絲絲，放耐咗會溶，係咩？',a:'icecream',d:['cake','egg'],n:'雪糕'},
  {q:'有兩個轆，要用腳踩先會行，係咩？',a:'bike',d:['car','rocket'],n:'單車'}];
const REBUS=[
  {p:['fire','car'],a:'loco',d:['plane','bike'],s:'火，加車，會變成咩呀？',n:'火車'},
  {p:['snowflake','pax_man'],a:'snowman',d:['teddy','penguin'],s:'雪，加人，會變成咩呀？',n:'雪人'},
  {p:['snowflake','cake'],a:'icecream',d:['milk','egg'],s:'雪，加糕，係咩嘢呀？',n:'雪糕'},
  {p:['moon','cake'],a:'mooncake',d:['icecream','honey'],s:'月亮，加餅，中秋節食咩呀？',n:'月餅'},
  {p:['sun','rain'],a:'rainbow',d:['snowman','moon'],s:'又出太陽又落雨，天空會出現咩呀？',n:'彩虹'},
  {p:['bee','sakura'],a:'honey',d:['cake','milk'],s:'蜜蜂採花，會整出咩呀？',n:'蜜糖'},
  {p:['egg','fire'],a:'friedegg',d:['cake','icecream'],s:'雞蛋，加火，會變成咩呀？',n:'煎蛋'},
  {p:['cow','cup'],a:'milk',d:['honey','egg'],s:'牛，加一杯，係咩嘢飲品呀？',n:'牛奶'}];
const SIL=[['elephant','大象'],['giraffe','長頸鹿'],['rabbit','兔子'],['turtle','烏龜'],['butterfly','蝴蝶'],['fish','魚'],['bike','單車'],['plane','飛機'],['banana','香蕉'],['pear','梨'],['loco','火車'],['snail','蝸牛'],['penguin','企鵝'],['mushroom','蘑菇'],['star','星星'],['umbrella','雨傘'],['cat','貓'],['duck','鴨仔'],['key','鎖匙'],['moon','月亮'],['apple','蘋果'],['car','汽車'],['house','屋'],['whale','鯨魚'],['rocket','火箭'],['teddy','公仔熊'],['cherry','車厘子'],['bee','蜜蜂']];
const GROUPS=[{n:'水果',e:['apple','banana','grapes','orange','strawberry','watermelon','pear','peach','cherry','pineapple']},{n:'動物',e:['dog','cat','rabbit','bear','panda','tiger','cow','pig','frog','monkey','lion']},{n:'交通工具',e:['train','bus','car','plane','ship','bike','rocket','taxi']},{n:'天空',e:['sun','moon','star','rainbow','rain']},{n:'食物',e:['cake','icecream','egg','friedegg','milk','mooncake']}];
const SHP=[['circle','圓形'],['triangle','三角形'],['square','正方形'],['star','星形'],['heart','心形'],['rect','長方形'],['oval','橢圓形']];
const PATI=['apple','banana','ball_red','ball_blue','star','moon','dog','cat','train','bus','ball_yellow','ball_green','sakura','chick'];
const FINDF=['apple','banana','grapes','orange','strawberry','pear','peach','cherry','lemon','pineapple','kiwi','watermelon'];
const SIZEI=['elephant','apple','train','dog','star','balloon','fish','teddy'];
const MAX=[5,10,20];
const O=(html,ok)=>({html,ok});
const E=k=>`<span class="emo">${ico(k)}</span>`;
function numOpts(ans,lo,hi){const s=new Set([ans]);for(const n of shuffle([ans-1,ans+1,ans-2,ans+2,ans+3,ans-3].filter(n=>n>=lo&&n<=hi))){if(s.size>=3)break;s.add(n);}let k=hi+1;while(s.size<3)s.add(k++);return shuffle([...s]).map(n=>O(`<span class="num">${n}</span>`,n===ans));}
function paxGroup(n,gone=0){const sz=n<=5?64:n<=10?46:34;let h='';for(let i=0;i<n;i++)h+=`<span class="${i>=n-gone?'gone':''}">${ico(PAX[(i*5+n)%PAX.length])}</span>`;return `<div class="grp" style="--es:${sz}px;max-width:${5*(sz*1.2+4)+40}px">${h}</div>`;}
function shapeSVG(k,col){const s={circle:'<circle cx="50" cy="50" r="40"/>',triangle:'<polygon points="50,8 92,88 8,88"/>',square:'<rect x="12" y="12" width="76" height="76" rx="4"/>',star:'<polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38"/>',heart:'<path d="M50 88 C20 66 6 48 6 32 C6 18 17 8 30 8 C39 8 46 13 50 20 C54 13 61 8 70 8 C83 8 94 18 94 32 C94 48 80 66 50 88Z"/>',rect:'<rect x="4" y="26" width="92" height="48" rx="4"/>',oval:'<ellipse cx="50" cy="50" rx="45" ry="28"/>'}[k];return `<svg viewBox="0 0 100 100" width="100%" style="max-height:14vh" fill="${col}" stroke="rgba(0,0,0,.18)" stroke-width="3">${s}</svg>`;}

// 數線（10-02 用戶）：0 至 10（20 以內題就到 20），起點圈綠色；加＝箭咀由起點向右指，減＝向左指（只指方向、唔畫到答案）；
// 答啱先一步一步跳去答案（每跳一格），答案個數字變橙色
function nlSVG(a,b,sign){const N=Math.max(10,a+(sign>0?b:0)),W=1000,x0=46,dx=(W-2*x0)/N,X=n=>x0+n*dx,Y=92;let h='';
  h+=`<line x1="${x0-20}" y1="${Y}" x2="${W-x0+20}" y2="${Y}" stroke="#5b6b7c" stroke-width="5" stroke-linecap="round"/>`;
  for(let n=0;n<=N;n++)h+=`<line x1="${X(n).toFixed(1)}" y1="${Y-11}" x2="${X(n).toFixed(1)}" y2="${Y+11}" stroke="#5b6b7c" stroke-width="4"/><text class="nlt" data-n="${n}" x="${X(n).toFixed(1)}" y="${Y+46}" text-anchor="middle" font-size="${N>10?30:36}" font-weight="800" fill="${n===a?'#2e9d3a':'#33414f'}">${n}</text>`;
  const ax=X(a),dir=sign>0?1:-1,len=Math.min(dx*0.6,40)+8,c=sign>0?'#1e88e5':'#e53935',ty=Y-30,tx=clamp(ax+dir*(len+11)/2,170,830);
  h+=`<circle cx="${ax.toFixed(1)}" cy="${Y}" r="15" fill="#2e9d3a" stroke="#fff" stroke-width="4"/>`;
  h+=`<g class="nlarrow"><line x1="${ax.toFixed(1)}" y1="${ty}" x2="${(ax+dir*len).toFixed(1)}" y2="${ty}" stroke="${c}" stroke-width="9" stroke-linecap="round"/><polygon points="${(ax+dir*(len+22)).toFixed(1)},${ty} ${(ax+dir*len).toFixed(1)},${ty-15} ${(ax+dir*len).toFixed(1)},${ty+15}" fill="${c}"/>`+
    `<text x="${tx.toFixed(1)}" y="${ty-26}" text-anchor="middle" font-size="30" font-weight="900" fill="${c}">由 ${a} 開始　${dir>0?'＋':'－'}${b}　向${dir>0?'右':'左'}行 ${b} 步</text></g>`;
  h+=`<g class="nlhops"></g>`;
  return `<svg class="numline" viewBox="0 0 ${W} 150" data-n="${N}" data-a="${a}" data-b="${b}" data-s="${sign}">${h}</svg>`;}
async function nlShow(){const s=$('#qvis .numline');if(!s)return;const N=+s.dataset.n,a=+s.dataset.a,b=+s.dataset.b,dir=+s.dataset.s,W=1000,x0=46,dx=(W-2*x0)/N,X=n=>x0+n*dx,Y=92,g=s.querySelector('.nlhops'),c=dir>0?'#1e88e5':'#e53935';
  const ar=s.querySelector('.nlarrow');if(ar)ar.style.opacity='0.2';
  for(let i=0;i<b;i++){const p=a+dir*i,q=p+dir,xa=X(p),xb=X(q),xm=(xa+xb)/2;g.insertAdjacentHTML('beforeend',`<path d="M${xa.toFixed(1)} ${Y-8} Q${xm.toFixed(1)} ${Y-62} ${xb.toFixed(1)} ${Y-8}" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/><polygon points="${xb.toFixed(1)},${Y-6} ${(xb-dir*14).toFixed(1)},${Y-22} ${(xb+dir*2).toFixed(1)},${Y-24}" fill="${c}"/>`);await sleep(b>6?160:260);}
  const e=a+dir*b,t=s.querySelector(`.nlt[data-n="${e}"]`);if(t){t.setAttribute('fill','#e65100');t.setAttribute('font-size','46');}g.insertAdjacentHTML('beforeend',`<circle cx="${X(e).toFixed(1)}" cy="${Y}" r="15" fill="#ff9800" stroke="#fff" stroke-width="4"/>`);}
function genAdd(l){const mx=MAX[l-1]||20,a=randi(1,mx-1),b=randi(1,mx-a),ans=a+b;
  return {prompt:`${a} 加 ${b} 等於幾多？`,speech:[`有${a}位乘客，再有${b}位乘客上車，一共有幾多位呀？`],vis:`<div class="eq">${paxGroup(a)}<div class="op">＋</div>${paxGroup(b)}</div><div class="eqtxt">${a} + ${b} = ?</div>${nlSVG(a,b,1)}`,opts:numOpts(ans,0,mx),after:[`${a}加${b}，等於${ans}！`],nl:1};}
function genSub(l){const mx=MAX[l-1]||20,a=randi(2,mx),b=randi(1,a-1),ans=a-b;
  return {prompt:`${a} 減 ${b} 等於幾多？`,speech:[`車廂有${a}位乘客，有${b}位落咗車，仲有幾多位呀？`],vis:`<div class="eq">${paxGroup(a,b)}<div class="op">${IC('door-open')}</div></div><div class="eqtxt">${a} − ${b} = ?</div>${nlSVG(a,b,-1)}`,opts:numOpts(ans,0,mx),after:[`${a}減${b}，等於${ans}！`],nl:1};}
function genCount(l){const [e,m,n]=pick(COUNTS),k=randi(2,[5,10,15][l-1]||15);let h='';for(let i=0;i<k;i++)h+=`<span style="transform:rotate(${randi(-12,12)}deg)">${ico(e)}</span>`;
  return {prompt:`數下有幾多${m}${n}？`,speech:[`數下有幾多${m}${n}呀？`],vis:`<div class="grp" style="--es:${k<=6?64:k<=10?50:40}px;max-width:640px">${h}</div>`,opts:numOpts(k,1,(MAX[l-1]||20)+2),after:[`一共有${k}${m}！`]};}
function genMore(l){const [e]=pick(COUNTS),mx=[6,9,12][l-1]||12,gap=l===1?2:1;let a,b;do{a=randi(1,mx);b=randi(1,mx);}while(Math.abs(a-b)<gap);
  const grp=n=>`<div class="optgrp">${`<span>${ico(e)}</span>`.repeat(n)}</div>`;
  return {prompt:'邊一邊多啲？',speech:['邊一邊多啲呀？撳多啲嗰邊！'],vis:`<div class="hint">${IC('left')} 邊邊多啲？ ${IC('right')}</div>`,opts:[O(grp(a),a>b),O(grp(b),b>a)]};}
function genEnWord(l){const pool=l<=1?EN[0]:l===2?EN[0].concat(EN[1]):EN[1].concat(EN[2]);const [t,d1,d2]=shuffle(pool).slice(0,3),w=k=>IT[k][1];
  return {prompt:'呢個英文係咩？',speech:[{t:'What is this?',lang:'en-US'}],vis:`<div class="pic">${ico(t)}</div>`,opts:shuffle([t,d1,d2]).map(k=>O(`<span class="word">${w(k)}</span>`,k===t)),spell:w(t),ansSay:[{t:w(t).toLowerCase(),lang:'en-US'}]};}
function genEnSpell(l){const pool=(l<=1?EN[0]:l===2?EN[1].filter(w=>w.length<=5):EN[1].concat(EN[2])).filter(k=>!IT[k][1].includes(' '));const k=pick(pool),W=IT[k][1];const i=randi(0,W.length-1),c=W[i];
  const ds=shuffle([...'ABCDEFGHIJKLMNOPRSTUVWY'].filter(x=>x!==c)).slice(0,2);
  const tiles=[...W].map((ch,j)=>j===i?'<span class="tile blank">?</span>':`<span class="tile">${ch}</span>`).join('');
  return {prompt:'漏咗邊個字母？',speech:[{t:'Which letter is missing?',lang:'en-US'},{t:W.toLowerCase(),lang:'en-US'}],vis:`<div class="pic sm">${ico(k)}</div><div class="tiles" style="--n:${W.length}">${tiles}</div>`,opts:shuffle([c,...ds]).map(x=>O(`<span class="word">${x}</span>`,x===c)),spell:W,fill:c,ansSay:[{t:c.toLowerCase(),lang:'en-US'},{t:W.toLowerCase(),lang:'en-US'}]};}
function genZhWord(l){const pool=l<=1?ZHK1:ZHK2;const [t,d1,d2]=shuffle(pool).slice(0,3),z=k=>IT[k][0];
  return {prompt:'呢個係咩？',speech:['呢個係咩呀？揀啱個中文字！'],vis:`<div class="pic">${ico(t)}</div>`,opts:shuffle([t,d1,d2]).map(k=>O(`<span class="zh">${z(k)}</span>`,k===t)),after:[z(t)]};}
function genZhFill(l){const pool=(l<=1?ZHK1:ZHK2).filter(k=>[...IT[k][0]].length===2);const k=pick(pool),w=[...IT[k][0]],i=l<=1?1:randi(0,1),c=w[i];
  const ds=shuffle(ZHD.filter(x=>!w.includes(x))).slice(0,2);
  const tiles=w.map((ch,j)=>j===i?'<span class="tile zh blank">?</span>':`<span class="tile zh">${ch}</span>`).join('');
  return {prompt:`「${w.map((ch,j)=>j===i?'＿':ch).join('')}」漏咗邊個字？`,speech:[`呢個係${IT[k][0]}，漏咗邊個字呀？`],vis:`<div class="pic sm">${ico(k)}</div><div class="tiles" style="--n:${w.length}">${tiles}</div>`,opts:shuffle([c,...ds]).map(x=>O(`<span class="zh">${x}</span>`,x===c)),after:[IT[k][0]],fill:c};}
function genRiddle(){const r=pick(RIDDLES);return {prompt:'估下係咩？',speech:[r.q],vis:`<div class="riddle"><div class="rq"><span class="qbub">?</span></div><div class="rt">${r.q}</div></div>`,opts:shuffle([r.a,...r.d]).map(e=>O(E(e),e===r.a)),after:[`係${r.n}呀！`]};}
function genRebus(){const r=pick(REBUS);return {prompt:'睇圖估一估',speech:[r.s],vis:`<div class="rebus">${r.p.map(e=>`<span>${ico(e)}</span>`).join('<b>＋</b>')}<b>＝</b><span class="qm">?</span></div>`,opts:shuffle([r.a,...r.d]).map(e=>O(E(e),e===r.a)),after:[`係${r.n}！`]};}
function genShadow(){const [t,d1,d2]=shuffle(SIL).slice(0,3);return {prompt:'呢個黑影係咩？',speech:['估下呢個黑影係咩呀？'],vis:`<div class="pic shadow">${ico(t[0])}</div>`,opts:shuffle([t,d1,d2]).map(x=>O(E(x[0]),x===t)),after:[`係${t[1]}！`]};}
function genZoom(l){const [t,d1,d2]=shuffle(SIL).slice(0,3),z=[1.9,2.5,3.2][l-1]||3.2,m=(1-1/z)*25,dx=rand(-m,m).toFixed(1),dy=rand(-m,m).toFixed(1);
  return {prompt:'放大鏡睇到咩？',speech:['放大鏡睇到啲咩呀？估下係邊樣嘢？'],vis:`<div class="zoomwrap"><div class="zoomwin"><span style="font-size:calc(min(29vh,250px) * ${z} / 1.15);transform:translate(calc(-50% + ${dx}%),calc(-50% + ${dy}%))">${ico(t[0])}</span></div></div>`,opts:shuffle([t,d1,d2]).map(x=>O(E(x[0]),x===t)),after:[`係${t[1]}！`]};}
function genPattern(l){const [A,B,C,D]=shuffle(PATI);let unit;if(l<=1)unit=[A,B];else if(l===2)unit=pick([[A,B,C],[A,A,B],[A,B,B]]);else unit=pick([[A,B,C,D],[A,A,B,B],[A,B,B,C]]);
  const len=unit.length===4?8:6,seq=[];for(let i=0;i<len;i++)seq.push(unit[i%unit.length]);const ans=seq[len-1];
  const opts=new Set([ans]);for(const u of shuffle([...new Set(unit)]))if(opts.size<3)opts.add(u);for(const u of shuffle(PATI))if(opts.size<3)opts.add(u);
  return {prompt:'下一個係咩？',speech:['睇下個規律，下一個應該係邊個呀？'],vis:`<div class="seq">${seq.slice(0,-1).map(e=>`<span>${ico(e)}</span>`).join('')}<span class="q">?</span></div>`,opts:shuffle([...opts]).map(e=>O(E(e),e===ans))};}
function genOdd(){const [g1,g2]=shuffle(GROUPS);const same=shuffle(g1.e).slice(0,3),odd=pick(g2.e);
  return {prompt:'邊個唔同類？',speech:['邊一個同其他唔同類呀？'],vis:`<div class="hint">邊個唔同類？</div>`,opts:shuffle([...same.map(e=>O(E(e),false)),O(E(odd),true)]),after:[`其他都係${g1.n}，佢係${g2.n}！`]};}
function genShape(l){const pool=SHP.slice(0,l<=1?3:l===2?5:7);const [t,d1,d2]=shuffle(pool).slice(0,3),cols=shuffle(['#ff6b6b','#4dabf7','#ffd43b','#69db7c','#b197fc','#ffa94d']);
  return {prompt:`邊個係${t[1]}？`,speech:[`邊個係${t[1]}呀？`],vis:`<div class="bigword">${t[1]}</div>`,opts:shuffle([t,d1,d2]).map((s,i)=>O(shapeSVG(s[0],cols[i]),s===t)),after:[`係${t[1]}！`]};}
function genSize(l){const e=pick(SIZEI),big=l<=1?true:Math.random()<.5,tgt=big?1.1:0.45;
  return {prompt:big?'邊個最大？':'邊個最細？',speech:[big?'邊個最大呀？':'邊個最細呀？'],vis:`<div class="bigword">${IC('search')} ${big?'最大':'最細'}</div>`,opts:shuffle([0.45,0.75,1.1]).map(s=>O(`<span style="font-size:${s*1.3}em;line-height:1">${ico(e)}</span>`,s===tgt))};}
function genFind(l){const tk=l<=1?'apple':pick(FINDF),tn=Math.min(3,l),n=[12,16,24][l-1]||24,cols=l<=2?4:6;
  const others=FINDF.filter(k=>k!==tk&&!(tk==='apple'&&k==='cherry')&&!(tk==='cherry'&&k==='apple'));const cells=[];for(let i=0;i<tn;i++)cells.push([tk,1]);while(cells.length<n)cells.push([pick(others),0]);
  const html=shuffle(cells).map(([e,ok])=>`<button class="fcell" data-ok="${ok}" style="transform:rotate(${randi(-18,18)}deg)">${ico(e)}</button>`).join('');const nm=IT[tk][0];
  return {find:tn,prompt:tn===1?`搵出${nm}！`:`搵出 ${tn} 個${nm}！`,speech:[tn===1?`幫我搵出${nm}！`:`幫我搵出${tn}個${nm}！`],vis:`<div class="findgrid" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">${html}</div>`,opts:[],after:[]};}

/* ======================= 10-02 新題型（中、英、數、推理各加幾款） ======================= */
// ---- 中文 ----
// 睇字揀圖
function genZhPic(l){const pool=l<=1?ZHK1:ZHK2;const [t,d1,d2]=shuffle(pool).slice(0,3);
  return {prompt:'呢個字係邊個圖？',speech:['睇下呢個字，揀啱個圖！'],vis:`<div class="bigword zhbig">${IT[t][0]}</div>`,opts:shuffle([t,d1,d2]).map(k=>O(E(k),k===t)),after:[IT[t][0]]};}
// 量詞（ok＝所有講得通嘅量詞，干擾項唔可以喺入面）
const QUANT=[['train','架',['架','列']],['bus','架',['架','部','輛']],['car','架',['架','部','輛']],['plane','架',['架']],['bike','架',['架','部','輛']],['taxi','架',['架','部','輛']],
  ['chick','隻',['隻']],['cat','隻',['隻']],['duck','隻',['隻']],['pig','隻',['隻','頭']],['snail','隻',['隻']],['fish','條',['條','尾']],['apple','個',['個']],['orange','個',['個']],['balloon','個',['個']],
  ['clock','個',['個']],['star','粒',['粒','顆']],['flower','朵',['朵','枝']],['tree','棵',['棵','樖']],['book','本',['本']],['umbrella','把',['把']],['pen','枝',['枝','支']],['hat','頂',['頂']],
  ['house','間',['間','座']],['grapes','串',['串']],['cup','隻',['隻','個']],['egg','隻',['隻','個']]];
const QW=['架','隻','條','個','本','朵','棵','枝','把','頂','間','粒','串'];
function genZhQuant(l){const pool=l<=1?QUANT.filter(q=>['train','bus','car','cat','duck','fish','apple','book','flower','ball'].includes(q[0])):QUANT;const [k,w,okw]=pick(pool);
  const ds=shuffle(QW.filter(x=>!okw.includes(x))).slice(0,2);
  return {prompt:`一 ＿ ${IT[k][0]}？`,speech:[`一乜嘢${IT[k][0]}呀？`],vis:`<div class="pic sm">${ico(k)}</div><div class="tiles"><span class="tile zh">一</span><span class="tile zh blank">?</span><span class="tile zh qw">${IT[k][0]}</span></div>`,
    opts:shuffle([w,...ds]).map(x=>O(`<span class="zh">${x}</span>`,x===w)),after:[`一${w}${IT[k][0]}`],fill:w};}
// 相反詞
const OPP=[['大','細'],['上','下'],['多','少'],['高','矮'],['長','短'],['快','慢'],['開','關'],['冷','熱'],['左','右'],['前','後'],['出','入'],['黑','白'],['早','晚'],['肥','瘦'],['哭','笑'],['來','去'],['新','舊'],['輕','重']];
function genZhOpp(l){const pool=l<=1?OPP.slice(0,8):OPP,pr=pick(pool),f=Math.random()<.5,[a,b]=f?pr:[pr[1],pr[0]];
  const ds=shuffle(pool.filter(p=>p!==pr).flat()).slice(0,2);
  return {prompt:`「${a}」嘅相反係？`,speech:[`${a}，嘅相反係乜嘢字呀？`],vis:`<div class="opp"><span class="tile zh">${a}</span><b>↔</b><span class="tile zh blank">?</span></div>`,
    opts:shuffle([b,...ds]).map(x=>O(`<span class="zh">${x}</span>`,x===b)),after:[`${a}同${b}`],fill:b};}
// 中文數字
const ZNUM=['一','二','三','四','五','六','七','八','九','十'];
function genZhNum(l){const mx=[5,8,10][l-1]||10,n=randi(1,mx),s=new Set([n]);for(const m of shuffle([n-1,n+1,n-2,n+2,n+3].filter(m=>m>=1&&m<=10)))if(s.size<3)s.add(m);
  return {prompt:'呢個中文數字係幾多？',speech:['呢個中文字係邊個數字呀？'],vis:`<div class="bigword zhbig">${ZNUM[n-1]}</div>`,opts:shuffle([...s]).map(m=>O(`<span class="num">${m}</span>`,m===n)),after:[`${ZNUM[n-1]}，係${n}`]};}
// 方位：箱嘅上面／下面／左邊／右邊（左右以畫面為準）
const POSN={top:'上面',bottom:'下面',left:'左邊',right:'右邊'},POSI=['cat','dog','rabbit','duck','chick','ball','apple','panda','frog'];
function genZhPos(l){const items=shuffle(POSI).slice(0,3),slots=shuffle(l<=1?['top','bottom','left']:['top','bottom','left','right']).slice(0,3),ask=l<=1?pick(slots.filter(x=>x==='top'||x==='bottom')):pick(slots),ti=slots.indexOf(ask),cell=p=>items[slots.indexOf(p)];
  const box=p=>slots.includes(p)?`<span class="pp ${p}">${ico(cell(p))}</span>`:'';
  return {prompt:`邊個喺箱嘅${POSN[ask]}？`,speech:[`邊個喺箱嘅${POSN[ask]}呀？`],vis:`<div class="posgrid">${box('top')}${box('left')}<span class="pp mid">${ico('box')}</span>${box('right')}${box('bottom')}</div>`,
    opts:shuffle(items).map(k=>O(E(k),k===items[ti])),after:[`係${IT[items[ti]][0]}！`]};}
// ---- 英文 ----
// 聽英文揀圖
function genEnPic(l){const pool=l<=1?EN[0]:l===2?EN[0].concat(EN[1]):EN[1].concat(EN[2]);const [t,d1,d2]=shuffle(pool).slice(0,3),w=IT[t][1];
  return {prompt:'聽下係邊個？',speech:[{t:`Where is the ${w.toLowerCase()}?`,lang:'en-US'}],vis:`<div class="bigword enbig">${w}</div>`,opts:shuffle([t,d1,d2]).map(k=>O(E(k),k===t)),spell:w,ansSay:[{t:w.toLowerCase(),lang:'en-US'}]};}
// 英文數數
const ENUM=['ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE','TEN'];
function genEnCount(l){const [e]=pick(COUNTS),mx=[5,7,10][l-1]||10,k=randi(1,mx),s=new Set([k]);for(const m of shuffle([k-1,k+1,k-2,k+2].filter(m=>m>=1&&m<=10)))if(s.size<3)s.add(m);
  let h='';for(let i=0;i<k;i++)h+=`<span>${ico(e)}</span>`;
  return {prompt:'有幾多個？（英文）',speech:[{t:'How many can you count?',lang:'en-US'}],vis:`<div class="grp" style="--es:${k<=5?62:48}px;max-width:640px">${h}</div>`,
    opts:shuffle([...s]).map(m=>O(`<span class="word">${ENUM[m-1]}</span>`,m===k)),enCount:k,ansSay:[{t:ENUM[k-1].toLowerCase(),lang:'en-US'}]};}
// 動物叫聲
const ASOUND=[['cow','moo'],['dog','woof woof'],['cat','meow'],['duck','quack quack'],['pig','oink oink'],['lion','roar'],['mouse','squeak'],['frog','ribbit'],['bee','buzz'],['chick','cheep cheep']];
function genEnSound(){const [t,d1,d2]=shuffle(ASOUND).slice(0,3),nm=IT[t[0]][1].toLowerCase();
  return {prompt:'邊隻動物會咁叫？',speech:[{t:`Which animal says ${t[1]}?`,lang:'en-US'}],vis:`<div class="bigword enbig">“${t[1].toUpperCase()}”</div>`,opts:shuffle([t,d1,d2]).map(a=>O(E(a[0]),a===t)),
    afterEn:[{t:`The ${nm} says ${t[1]}!`,lang:'en-US'}],ansSay:[{t:`The ${nm} says ${t[1]}!`,lang:'en-US'}]};}
// big／small
function genEnSize(l){const e=pick(SIZEI),big=l<=1?true:Math.random()<.5,tgt=big?1.1:0.45,word=big?'big':'small';
  return {prompt:big?'邊個係 BIG？':'邊個係 SMALL？',speech:[{t:`Which one is ${word}?`,lang:'en-US'}],vis:`<div class="bigword enbig">${word.toUpperCase()}</div>`,
    opts:shuffle([0.45,0.75,1.1]).map(s=>O(`<span style="font-size:${s*1.3}em;line-height:1">${ico(e)}</span>`,s===tgt)),afterEn:[{t:`This one is ${word}!`,lang:'en-US'}],ansSay:[{t:`This one is ${word}!`,lang:'en-US'}]};}
// ---- 數學 ----
// 數字配數量
function genNumMatch(l){const [e]=pick(COUNTS),mx=[5,8,10][l-1]||10,n=randi(1,mx),s=new Set([n]);for(const m of shuffle([n-1,n+1,n-2,n+2].filter(m=>m>=1&&m<=10)))if(s.size<3)s.add(m);
  const grp=m=>`<div class="optgrp small">${`<span>${ico(e)}</span>`.repeat(m)}</div>`;
  return {prompt:`邊組有 ${n} 個？`,speech:[`邊一組有${n}個呀？`],vis:`<div class="bigword numbig">${n}</div>`,opts:shuffle([...s]).map(m=>O(grp(m),m===n)),after:[`係${n}個！`]};}
// 數字火車（漏咗邊個數）
function genNumTrain(l){let a,step=1;if(l<=1)a=1;else if(l===2)a=randi(1,6);else{step=pick([1,2,-1]);a=step<0?randi(6,10):randi(1,step>1?2:6);}
  const seq=[0,1,2,3,4].map(i=>a+i*step),gap=l<=1?randi(1,4):randi(0,4),ans=seq[gap],s=new Set([ans]);for(const m of shuffle([ans-1,ans+1,ans+2,ans-2].filter(m=>m>=0)))if(s.size<3)s.add(m);
  const cars=seq.map((n,i)=>`<span class="tcar${i===gap?' blank':''}">${i===gap?'?':n}</span>`).join('');
  return {prompt:'火車卡漏咗邊個數字？',speech:['火車卡上面嘅數字，漏咗邊個呀？'],vis:`<div class="ntrain"><span class="tloco">${ico('loco')}</span>${cars}</div>`,opts:shuffle([...s]).map(m=>O(`<span class="num">${m}</span>`,m===ans)),after:[`係${ans}！`],ntFill:{gap,ans}};}
// 第幾個（由左邊數起）
const ORDZ=['一','二','三','四','五'],ORDI=['car','bus','train','bike','taxi','plane','ship','rocket','dog','cat','duck','rabbit'];
function genOrdinal(l){const row=shuffle(ORDI).slice(0,5),mx=l<=1?3:5,i=randi(0,mx-1),t=row[i],ds=shuffle(row.filter(k=>k!==t)).slice(0,2);
  return {prompt:`由左邊數起，第${ORDZ[i]}個係咩？`,speech:[`由左邊數起，第${ORDZ[i]}個係咩呀？`],vis:`<div class="ordrow"><span class="ordarrow">由左邊數起 ➜</span>${row.map(k=>`<span>${ico(k)}</span>`).join('')}</div>`,
    opts:shuffle([t,...ds]).map(k=>O(E(k),k===t)),after:[`第${ORDZ[i]}個係${IT[t][0]}！`]};}
// 邊個數字最大／最細
function genNumCompare(l){const mx=[9,15,20][l-1]||20,n=l<=1?2:3,s=new Set();while(s.size<n)s.add(randi(1,mx));const arr=[...s],big=Math.random()<.5,ans=big?Math.max(...arr):Math.min(...arr);
  return {prompt:big?'邊個數字最大？':'邊個數字最細？',speech:[big?'邊個數字最大呀？':'邊個數字最細呀？'],vis:`<div class="bigword">${IC('search')} ${big?'最大':'最細'}</div>`,opts:shuffle(arr).map(m=>O(`<span class="num">${m}</span>`,m===ans)),after:[`係${ans}！`]};}
// ---- 推理 ----
// 生活常識配對
const PAIRS=[{a:'rain',b:'umbrella',q:'落雨要用咩呀？'},{a:'key',b:'door',q:'鎖匙用嚟開咩呀？'},{a:'bee',b:'flower',q:'蜜蜂最鍾意去邊度採蜜呀？'},{a:'monkey',b:'banana',q:'馬騮最鍾意食咩呀？'},
  {a:'cat',b:'fish',q:'貓仔最鍾意食咩呀？'},{a:'snowflake',b:'snowman',q:'落雪可以砌咩呀？'},{a:'egg',b:'chick',q:'雞蛋孵出嚟係咩呀？'},{a:'cow',b:'milk',q:'牛可以俾我哋咩飲呀？'},
  {a:'book',b:'bag',q:'返學啲書要放入咩度呀？'},{a:'moon',b:'star',q:'夜晚天空除咗月亮，仲有咩呀？'},{a:'bee',b:'honey',q:'蜜蜂會整咩嘢俾我哋食呀？'},{a:'pen',b:'book',q:'枝筆可以喺邊度寫字呀？'},
  {a:'clock',b:'sun',q:'朝早起身，天空會見到咩呀？'},{a:'cake',b:'balloon',q:'生日會除咗蛋糕，仲有咩呀？'}];
const PAIRD=['ball','car','hat','cup','apple','train','tree','duck','teddy','glasses','house','fish','umbrella','book','star'];
function genPairs(){const p=pick(PAIRS),ds=shuffle(PAIRD.filter(k=>k!==p.b&&k!==p.a)).slice(0,2);
  return {prompt:'佢哋係好朋友！',speech:[p.q],vis:`<div class="rebus"><span>${ico(p.a)}</span><b>＋</b><span class="qm">?</span></div><div class="hint">${p.q}</div>`,opts:shuffle([p.b,...ds]).map(k=>O(E(k),k===p.b)),after:[`係${IT[p.b]?IT[p.b][0]:''}！`]};}
// 海陸空
const HAB=[{n:'天上飛',q:'邊個喺天上飛？',e:['plane','rocket','butterfly','bee']},{n:'海度',q:'邊個喺海度？',e:['fish','whale','ship']},{n:'地上',q:'邊個喺地上面行？',e:['car','bus','train','bike','taxi','elephant','tiger','dog']}];
function genHabitat(){const [g,...o]=shuffle(HAB),t=pick(g.e),ds=o.map(x=>pick(x.e));
  return {prompt:g.q,speech:[g.q],vis:`<div class="bigword">${g.q.replace('？','')}</div>`,opts:shuffle([t,...ds]).map(k=>O(E(k),k===t)),after:[`${IT[t][0]}喺${g.n}！`]};}
// 記憶遊戲：先記住幾樣嘢，蓋住之後少咗一樣，邊樣唔見咗？
const MEMI=['apple','banana','cat','dog','car','bus','ball','star','duck','fish','teddy','cake','hat','flower','rabbit','train'];
function genMemory(l){const n=l<=1?3:4,items=shuffle(MEMI).slice(0,n),gone=randi(0,n-1),t=items[gone];
  const ds=l<=1?shuffle(items.filter(k=>k!==t)).slice(0,2):shuffle(MEMI.filter(k=>!items.includes(k))).slice(0,2);
  return {prompt:'記住佢哋！',speech:['記住呢幾樣嘢！'],vis:`<div class="memrow">${items.map((k,i)=>`<span data-i="${i}">${ico(k)}</span>`).join('')}</div><div class="memtimer"><i></i></div>`,
    opts:shuffle([t,...ds]).map(k=>O(E(k),k===t)),memo:{gone,ms:l<=1?3500:3000},after:[`唔見咗${IT[t]?IT[t][0]:''}！`]};}
const QT={add:['math','加法',genAdd],sub:['math','減法',genSub],count:['math','數數',genCount],more:['math','比多少',genMore],
  enWord:['eng','英文認字',genEnWord],enSpell:['eng','英文串字',genEnSpell],zhWord:['chi','中文認字',genZhWord],zhFill:['chi','中文填字',genZhFill],
  riddle:['logic','謎語',genRiddle],rebus:['logic','睇圖估估',genRebus],shadow:['logic','黑影估估',genShadow],zoom:['logic','放大鏡',genZoom],pattern:['logic','找規律',genPattern],odd:['logic','邊個唔同類',genOdd],
  find:['logic','搵水果',genFind],shape:['math','認形狀',genShape],size:['math','比大細',genSize],
  zhPic:['chi','睇字揀圖',genZhPic],zhQuant:['chi','量詞',genZhQuant],zhOpp:['chi','相反詞',genZhOpp],zhNum:['chi','中文數字',genZhNum],zhPos:['chi','上下左右',genZhPos],
  enPic:['eng','聽英文揀圖',genEnPic],enCount:['eng','英文數數',genEnCount],enSound:['eng','動物叫聲',genEnSound],enSize:['eng','big／small',genEnSize],
  numMatch:['math','數字配數量',genNumMatch],numTrain:['math','數字火車',genNumTrain],ordinal:['math','第幾個',genOrdinal],numCompare:['math','比較數字',genNumCompare],
  pairs:['logic','好朋友',genPairs],habitat:['logic','海陸空',genHabitat],memory:['logic','記憶遊戲',genMemory]};
function makeQ(type,l){const [cat,name,gen]=QT[type];const q=gen(l);q.type=type;q.cat=cat;q.name=name;return q;}
const typesOf=cat=>Object.keys(QT).filter(k=>QT[k][0]===cat);

/* ======================= 問題卡 UI ======================= */
const PRAISE=['答啱喇！好叻呀！','好犀利呀！','完全正確！叻叻！','好嘢！你真係好叻！','啱晒！拍拍手！'];
const WRONG=['唔緊要，我哋試下另一題！','差少少啫，再嚟過！','唔啱呀，試下下一題！'];
let QS=null;
function showCard(test){G.card=true;$('#qwrap').classList.remove('hidden');$('#qclose').classList.toggle('hidden',!test);}
function hideCard(){G.card=false;$('#qwrap').classList.add('hidden');QS=null;}
function renderQ(q,onDone){QS={q,onDone,locked:false,found:0};const cat=CATS[q.cat];
  const card=$('#qcard');card.classList.remove('swap');void card.offsetWidth;card.classList.add('swap');card.classList.toggle('retry',!!q.retry);
  $('#qcat').innerHTML=`${IC(cat.i)}${cat.n}`;$('#qcat').style.background=cat.c;$('#qprompt').textContent=q.prompt;$('#qsay').classList.toggle('hidden',!q.speech.length);
  $('#qvis').innerHTML=q.vis;const box=$('#qopts');box.innerHTML='';box.className=q.opts.length?'n'+q.opts.length:'';
  q.opts.forEach(o=>{const b=document.createElement('button');b.className='opt';b.innerHTML=o.html;b.addEventListener('click',()=>answer(b,o.ok));box.appendChild(b);});
  if(q.find)$$('#qvis .fcell').forEach(c=>c.addEventListener('click',()=>{if(!QS||QS.locked||c.classList.contains('found'))return;if(c.dataset.ok==='1'){c.classList.add('found');blip();if(++QS.found>=q.find)answer(c,true);}else answer(c,false);}));
  if(q.memo)memoRun(q);else speakQ(q);}
// 記憶遊戲：先睇幾秒，之後蓋住、拎走一樣，先畀撳答案
async function memoRun(q){const my=QS,box=$('#qopts');box.classList.add('wait');speakQ(q);const bar=$('#qvis .memtimer i');if(bar){bar.style.transition=`width ${q.memo.ms}ms linear`;requestAnimationFrame(()=>requestAnimationFrame(()=>bar.style.width='0%'));}
  await sleep(q.memo.ms);if(QS!==my)return;$$('#qvis .memrow span').forEach(e=>e.classList.add('cover'));await sleep(650);if(QS!==my)return;
  const g=$(`#qvis .memrow span[data-i="${q.memo.gone}"]`);if(g)g.classList.add('gone');$$('#qvis .memrow span').forEach(e=>e.classList.remove('cover'));const t=$('#qvis .memtimer');if(t)t.remove();
  $('#qprompt').textContent='邊樣唔見咗？';box.classList.remove('wait');await say('邊樣唔見咗呀？','zh-HK',true);}
// 讀題：中文、數學、推理題用廣東話讀一次（用戶 10-01 要求；其他廣東話旁白照舊唔讀），英文題用英文讀
async function speakQ(q){stopSpeech();await sleep(140);const my=QS;for(const p of q.speech){if(QS!==my||!my||my.locked)return;await say(p.t||p,p.lang||'zh-HK',true);}}
// 英文答啱：逐個字母讀，讀完最後一個字母停一停，先讀成個字
// 逐個字母讀：要用細楷（大楷單字母 iPad 會讀成「capital A」；細楷 a 單獨讀係字母音 /eɪ/，Mac Samantha 實測）
async function spellOut(w){const my=QS;for(const ch of [...w.toLowerCase()].filter(c=>/[a-z]/.test(c))){if(QS!==my)return;await say(ch,'en-US');await sleep(140);}if(QS!==my)return;await sleep(750);await say(w.toLowerCase(),'en-US');}
async function answer(el,ok){if(!QS||QS.locked)return;QS.locked=true;const {q,onDone}=QS;
  el.classList.add(ok?(q.find?'found':'good'):'bad');stopSpeech();$$('#qopts .opt').forEach(b=>b.disabled=true);
  // 填字題答啱：個「?」換返做答啱嘅字／字母，成個字完整顯示（10-02 用戶）；加減數：數線跳步去答案
  if(ok&&q.fill){const t=$('#qvis .tile.blank');if(t){t.textContent=q.fill;t.classList.remove('blank');t.classList.add('fillin');}}
  if(ok&&q.ntFill){const t=$('#qvis .tcar.blank');if(t){t.textContent=q.ntFill.ans;t.classList.remove('blank');t.classList.add('fillin');}}
  if(ok&&q.memo){const t=$('#qvis .memrow span.gone');if(t)t.classList.replace('gone','back');}
  if(ok&&q.nl)nlShow(q.nl);
  if(ok){correctSfx();confetti();await sleep(300);if(q.spell)await spellOut(q.spell);
    if(q.enCount)for(let i=1;i<=q.enCount;i++){if(QS&&QS.q!==q)break;await say(ENUM[i-1].toLowerCase(),'en-US');}
    for(const a of (q.afterEn||[]))await say(a.t,a.lang);for(const a of (q.after||[]))await say(a.t||a,a.lang||'zh-HK');await say(pick(PRAISE));}
  else{
    // 答錯（10-02 用戶）：揀錯嗰個打交叉，再喺正確答案打圈；英文題打圈之後讀出正確答案。呢題會喺下一個站重問
    wrongSfx();el.classList.add('xmark');await sleep(650);markRight(q);
    for(const a of (q.ansSay||[]))await say(a.t,a.lang);await sleep(q.ansSay?900:1700);}
  await sleep(ok?1000:600);onDone(ok);}
function markRight(q){if(q.find){$$('#qvis .fcell[data-ok="1"]:not(.found)').forEach(c=>c.classList.add('ring'));return;}
  const k=q.opts.findIndex(o=>o.ok),b=$$('#qopts .opt')[k];if(b)b.classList.add('ring');}
// 每個站答 QN 題：上個站答錯嘅題目排先重問（同一題、答案位置重新洗過），之後先出新題目；答錯唔會即刻再出另一題
// planQs：每條重問佔返佢嗰科一個位，令每站總數不變
function planQs(retry){const need=catOrder();for(const q of retry){const i=need.indexOf(q.cat);if(i>=0)need.splice(i,1);else need.pop();}
  return retry.slice(0,QN).map(q=>({retry:q})).concat(need.slice(0,Math.max(0,QN-retry.length)).map(c=>({cat:c})));}
function askOne(it,level,used){return new Promise(res=>{const gen=G.gen;let q;
  if(it.retry){q={...it.retry,opts:shuffle(it.retry.opts),retry:true};}
  else{const all=typesOf(it.cat);let pool=all.filter(k=>!used.has(k));if(!pool.length)pool=all;const type=pick(pool);used.add(type);q=makeQ(type,level);}
  showCard(false);renderQ(q,ok=>{if(gen!==G.gen)return;hideCard();res({ok,q});});});}
function confetti(n=70){const fx=$('#fx'),cols=['#ff5d5d','#ffd23f','#3ec1d3','#7bd389','#b388ff','#ff9f1c','#ff7eb6'];for(let i=0;i<n;i++){const p=document.createElement('i');p.className='cf';p.style.left=Math.random()*100+'%';p.style.background=pick(cols);p.style.setProperty('--dx',(Math.random()-.5)*30+'vw');p.style.setProperty('--r',(Math.random()*900-450)+'deg');p.style.animationDuration=(1.6+Math.random()*1.4)+'s';p.style.animationDelay=Math.random()*.35+'s';if(Math.random()<.4){p.style.borderRadius='50%';p.style.width=p.style.height='12px';}fx.appendChild(p);setTimeout(()=>p.remove(),3600);}}
function stampHTML(st,cls){return `<div class="stamp ${cls}"><div class="s1">${LINE.tx.stamp}</div><div class="s2">${st.ja}</div><div class="s3">${IC('train')}</div><div class="s4">${st.en.toUpperCase()}</div></div>`;}
async function stampFx(st){const el=$('#stampFx');el.innerHTML=stampHTML(st,'big');el.classList.remove('hidden');stampSfx();await sleep(1800);el.classList.add('hidden');}
function showBanner(st){const b=$('#banner');b.innerHTML=`<div class="bn-top"><div class="bn-num">${LINE.code}<b>${LINE.id==='jy'?st.code.slice(2):st.code}</b></div><div class="bn-name">${st.kana?`<div class="bn-kana">${st.kana}</div>`:''}<div class="bn-ja">${st.ja}</div><div class="bn-en">${st.en}</div></div></div><div class="bn-band"><span>${st.prev?IC('left')+st.prev.ja:''}</span><span>${st.next?st.next.ja+IC('right'):''}</span></div>`;
  b.classList.remove('hidden');b.style.animation='none';void b.offsetWidth;b.style.animation='';clearTimeout(b._t);b._t=setTimeout(()=>b.classList.add('hidden'),4200);}
function toast(t,ms=2600){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),ms);}
function popStar(){const s=$('#stars');s.classList.remove('pop');void s.offsetWidth;s.classList.add('pop');}
function initHUD(){delete HUDC['.lbst'];delete HUDC['#lbFill'];const tr=$('#lbTrack');tr.querySelectorAll('.lbst').forEach(e=>e.remove());ST.forEach((st,i)=>{const d=document.createElement('div');d.className='lbst';d.style.left=(i/(ST.length-1)*100)+'%';d.innerHTML=`<div class="dot"></div><div class="nm">${st.ja}</div>`;tr.appendChild(d);});}
function updHUD(){let f=0;for(let i=0;i<ST.length-1;i++){if(G.s>=ST[i+1].stop){f=i+1;continue;}if(G.s>=ST[i].stop)f=i+(G.s-ST[i].stop)/(ST[i+1].stop-ST[i].stop);break;}
  hudW('#lbFill',(f/(ST.length-1)*100).toFixed(1)+'%',(e,v)=>{e.style.width=v;$('#lbTrain').style.left=v;});hudW('.lbst',G.reached,(e0,v)=>$$('.lbst').forEach((e,i)=>e.classList.toggle('done',i<=v)));}

