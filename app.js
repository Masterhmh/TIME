
const $=id=>document.getElementById(id);
const DEF={prep:5,hold:10,rest:3,ex:3,nSets:3,first:5,dec:2,setRest:15,switchRest:30,swap:1,sideRest:10,goal:5,vol:100,voice:'',autolock:1,snd:'beep',theme:'auto',names:['Curl-Up','Side Plank','Bird-Dog']};
let cfg={...DEF};
try{Object.assign(cfg,JSON.parse(localStorage.getItem('cfg')||'{}'))}catch(e){}
const getSets=(c=cfg)=>Array.from({length:c.nSets},(_,i)=>Math.max(1,c.first-c.dec*i));
const save=()=>{try{localStorage.setItem('cfg',JSON.stringify(cfg))}catch(e){}};
const put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const get=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return[]}};
const fmt=s=>{s=Math.max(0,Math.ceil(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const p2=n=>String(n).padStart(2,'0');
const dk=d=>{const x=new Date(d);return x.getFullYear()+'-'+p2(x.getMonth()+1)+'-'+p2(x.getDate())};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const BIG3=['Curl-Up','Side Plank','Bird-Dog'];
const nameOf=e=>((cfg.names||[])[e-1]||'').trim()||BIG3[e-1]||'Bài tập '+e;
const SAYNAME={'curl-up':'gập bụng','curl up':'gập bụng','side plank':'chống nghiêng','side-plank':'chống nghiêng','bird-dog':'chó săn','bird dog':'chó săn',plank:'plank',squat:'squat','push-up':'chống đẩy','push up':'chống đẩy','pull-up':'kéo xà đơn','pull up':'kéo xà đơn',lunge:'chùng chân',crunch:'gập bụng','sit-up':'gập bụng','sit up':'gập bụng',deadlift:'deadlift',burpee:'burpee','mountain climber':'leo núi','jumping jack':'nhảy dang tay','high knees':'nâng cao gối','glute bridge':'nâng hông','leg raise':'nâng chân',superman:'siêu nhân'};
const speakNameOf=e=>{const c=(cfg.snames||[])[e-1];if(c&&c.trim())return c.trim();const k=nameOf(e).toLowerCase().trim();return SAYNAME[k]||nameOf(e)};
const ICONS={
play:'<svg class="ic" viewBox="0 0 32 32"><rect width="32" height="32" rx="10" fill="currentColor"/><path class="g" d="M12.5 9.5v13l10.5-6.5z"/></svg>',
pause:'<svg class="ic" viewBox="0 0 32 32"><rect width="32" height="32" rx="10" fill="currentColor"/><rect class="g" x="10.5" y="9.5" width="4" height="13" rx="1.4"/><rect class="g" x="17.5" y="9.5" width="4" height="13" rx="1.4"/></svg>',
bolt:'<svg class="ic" viewBox="0 0 32 32"><rect width="32" height="32" rx="10" fill="currentColor"/><path class="g" d="M17.8 6.5L10 17.6h5.2L13.8 25.5 22 14.2h-5.3z"/></svg>',
loop:'<svg class="ic" viewBox="0 0 32 32"><rect width="32" height="32" rx="10" fill="currentColor"/><path class="s" d="M22.2 16a6.2 6.2 0 1 1-1.9-4.4"/><path class="s" d="M22.6 8.4v4.6H18"/></svg>',
clock:'<svg class="ic" viewBox="0 0 32 32"><rect width="32" height="32" rx="10" fill="currentColor"/><circle class="s" cx="16" cy="16" r="7.6"/><path class="s" d="M16 11.8V16l3 1.8"/></svg>',
spk:'<svg class="ic" viewBox="0 0 32 32"><rect width="32" height="32" rx="10" fill="currentColor"/><path class="g" d="M9.5 13v6h4l5 4.5v-15L13.5 13z"/><path class="s" d="M21.5 12.5a5 5 0 0 1 0 7"/></svg>',
target:'<svg class="ic" viewBox="0 0 32 32"><rect width="32" height="32" rx="10" fill="currentColor"/><circle class="s" cx="16" cy="16" r="7.4"/><circle class="g" cx="16" cy="16" r="2.6"/></svg>',
lockr:'<svg class="ic" viewBox="0 0 32 32"><rect width="32" height="32" rx="10" fill="currentColor"/><rect class="g" x="9.5" y="14" width="13" height="9.5" rx="2.4"/><path class="s" d="M12.5 14v-2.4a3.5 3.5 0 0 1 7 0V14"/></svg>'
};
const FI={"sound": "<path d=\"M4 9.5v5h3.5l4.5 4v-13l-4.5 4z\"/><path d=\"M15.2 9.2a4 4 0 0 1 0 5.6M17.8 6.6a7.6 7.6 0 0 1 0 10.8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "mic": "<rect x=\"9\" y=\"3\" width=\"6\" height=\"11\" rx=\"3\"/><path d=\"M5.8 11.5a6.2 6.2 0 0 0 12.4 0M12 17.8V21\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "theme": "<path d=\"M12 3a9 9 0 0 0 0 18z\"/><circle cx=\"12\" cy=\"12\" r=\"8.2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "edit": "<path d=\"M4 17.3V20h2.7L18 8.7 15.3 6z\"/><path d=\"M19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0L16 5.3 18.7 8z\"/>", "lock": "<rect x=\"5\" y=\"10.5\" width=\"14\" height=\"10\" rx=\"2.6\"/><path d=\"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", "menu": "<rect x=\"4\" y=\"6\" width=\"16\" height=\"2.4\" rx=\"1.2\"/><rect x=\"4\" y=\"10.8\" width=\"16\" height=\"2.4\" rx=\"1.2\"/><rect x=\"4\" y=\"15.6\" width=\"16\" height=\"2.4\" rx=\"1.2\"/>", "trash": "<path d=\"M8.2 3.8h7.6l.7 1.7H20V8H4V5.5h3.5z\"/><path d=\"M6 9.5h12l-.8 9.8a1.6 1.6 0 0 1-1.6 1.5H8.4a1.6 1.6 0 0 1-1.6-1.5z\"/>", "down": "<path d=\"M10.8 3.5h2.4v8l2.8-2.8 1.7 1.7L12 15.9 6.3 10.4 8 8.7l2.8 2.8z\"/><rect x=\"5\" y=\"18\" width=\"14\" height=\"2.4\" rx=\"1.2\"/>", "up": "<path d=\"M10.8 16h2.4V8l2.8 2.8 1.7-1.7L12 3.6 6.3 9.1 8 10.8 10.8 8z\"/><rect x=\"5\" y=\"18\" width=\"14\" height=\"2.4\" rx=\"1.2\"/>", "bulb": "<path d=\"M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.1 1 1.9V17h5v-1.2c0-.8.4-1.4 1-1.9A6 6 0 0 0 12 3z\"/><rect x=\"9.5\" y=\"18.3\" width=\"5\" height=\"2.3\" rx=\"1.15\"/>", "check": "<path fill-rule=\"evenodd\" d=\"M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm4.3 6.7-5.1 5.6-2.6-2.5 1.2-1.3 1.3 1.2 3.9-4.2z\"/>", "pausei": "<path fill-rule=\"evenodd\" d=\"M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9.5 8.5h2v7h-2zm3 0h2v7h-2z\"/>"};
const I=n=>`<svg class="fi" viewBox="0 0 24 24" aria-hidden="true">${FI[n]}</svg>`;
const ROWS=[
{k:'prep',cls:'r6',ic:'clock',name:'Chuẩn bị',sub:'Giây trước khi bắt đầu (0 = tắt)',step:1,min:0,fmt:fmt},
{k:'hold',cls:'r1',ic:'play',name:'Tập luyện',sub:'Giữ mỗi cái (giây)',step:1,min:1,fmt:fmt},
{k:'rest',cls:'r2',ic:'pause',name:'Nghỉ ngơi',sub:'Nghỉ giữa các cái (giây)',step:1,min:0,fmt:fmt},
{k:'ex',cls:'r3',ic:'bolt',name:'Bài tập',sub:'Số bài',step:1,min:1,fmt:v=>v},
{k:'swap',cls:'r5',ic:'loop',name:'Đổi chân / đổi bên',sub:'Bật: mỗi hiệp làm bên trái rồi bên phải',step:1,min:0,max:1,fmt:v=>v?'Bật':'Tắt'},
{k:'autolock',cls:'r6',ic:'lockr',name:'Khóa cảm ứng',sub:'Tự khóa màn hình khi bấm bắt đầu',step:1,min:0,max:1,fmt:v=>v?'Bật':'Tắt'},
{k:'sideRest',cls:'r5',ic:'clock',name:'Nghỉ đổi bên',sub:'Giây (giữa trái và phải)',step:1,min:0,fmt:fmt,need:'swap'},
{k:'nSets',cls:'r4',ic:'loop',name:'Số hiệp',sub:'Số hiệp mỗi bài',step:1,min:1,fmt:v=>v},
{k:'first',cls:'r4',ic:'loop',name:'Số cái ở hiệp đầu',sub:'Hiệp đầu tiên có bao nhiêu cái',step:1,min:1,fmt:v=>v},
{k:'dec',cls:'r4',ic:'loop',name:'Giảm mỗi hiệp',sub:'0 = giữ nguyên các hiệp',step:1,min:0,fmt:v=>v},
{k:'setRest',cls:'r5',ic:'clock',name:'Nghỉ giữa hiệp',sub:'Giây',step:1,min:0,fmt:fmt},
{k:'switchRest',cls:'r6',ic:'clock',name:'Nghỉ chuyển bài',sub:'Giây',step:1,min:0,fmt:fmt},
{k:'goal',cls:'r3',ic:'target',name:'Mục tiêu tuần',sub:'Số buổi hoàn thành mỗi tuần (0 = tắt)',step:1,min:0,max:21,fmt:v=>v?v+' buổi':'Tắt'},
{k:'vol',cls:'r1',ic:'spk',name:'Âm lượng',sub:'Âm báo và giọng nói',step:10,min:0,max:100,fmt:v=>v+'%'}
];
const SND=[['beep','Âm báo'],['voice','Giọng nói'],['both','Âm báo + giọng nói'],['off','Tắt']];
const SNDS={beep:'Âm báo',voice:'Giọng nói',both:'Báo + nói',off:'Tắt'};
const THM=[['auto','Tự động'],['light','Sáng'],['dark','Tối']];
function applyTheme(){const d=cfg.theme==='dark'||(cfg.theme==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light'}
function render(){
$('rows').innerHTML=ROWS.filter(r=>!r.need||cfg[r.need]).map(r=>{
const v=cfg[r.k];
return `<div class="row ${r.cls}">${ICONS[r.ic]}<div class="n" data-k="${r.k}">${r.name}<small>${r.sub}</small></div>`+
(r.max===1?`<button class="sw${v?' on':''}" role="switch" aria-checked="${v?'true':'false'}" aria-label="${r.name}" data-k="${r.k}"></button></div>`:
`<button data-k="${r.k}" data-d="-1">−</button><div class="v" data-k="${r.k}">${r.fmt(v)}</div><button data-k="${r.k}" data-d="1">+</button></div>`);
}).join('');
$('voice').innerHTML='<span>'+I('sound')+' Âm thanh</span><small>'+SNDS[cfg.snd]+'</small>';
$('vsel').innerHTML='<span>'+I('mic')+' Giọng đọc</span><small>'+vname()+'</small>';
$('theme').innerHTML='<span>'+I('theme')+' Giao diện</span><small>'+THM.find(x=>x[0]===cfg.theme)[1]+'</small>';
applyTheme();
if(!running&&!started)showTotal();
}
$('rows').addEventListener('click',e=>{
if(started)return;
const k=e.target.dataset.k;if(!k)return;
const r=ROWS.find(x=>x.k===k);
if(r.max===1&&!e.target.dataset.d){cfg[k]=cfg[k]?0:1;save();render();return}
if(e.target.dataset.d){
cfg[k]=Math.min(r.max||1e4,Math.max(r.min,cfg[k]+r.step*e.target.dataset.d));
save();render();return;
}
const s=prompt(r.name+' ('+r.sub+')',cfg[k]);
if(s!==null&&!isNaN(+s)){
cfg[k]=Math.min(r.max||1e4,Math.max(r.min,Math.round(+s)));
save();render();
}
});
$('voice').onclick=()=>{const i=SND.findIndex(x=>x[0]===cfg.snd);cfg.snd=SND[(i+1)%SND.length][0];if('speechSynthesis' in window)speechSynthesis.cancel();save();render()};
$('theme').onclick=()=>{const i=THM.findIndex(x=>x[0]===cfg.theme);cfg.theme=THM[(i+1)%3][0];save();render()};
$('names').onclick=()=>{const n=[...(cfg.names||[])],sn=[...(cfg.snames||[])];for(let i=1;i<=cfg.ex;i++){const s=prompt('Tên bài '+i+' (để trống = tên mặc định)',n[i-1]||nameOf(i));if(s===null)break;n[i-1]=s.trim();const sug=sn[i-1]||SAYNAME[n[i-1].toLowerCase()]||'';const t=prompt('Tên đọc của bài '+i+' (giọng đọc sẽ đọc tên này, để trống = tự đoán)',sug);if(t===null)break;sn[i-1]=t.trim()}cfg.names=n;cfg.snames=sn;save();render()};
/* Timeline */
function build(){
const st=[],S=getSets(),sides=cfg.swap?2:1;
if(cfg.prep>0)st.push({t:'prep',d:cfg.prep,e:1,s:1,label:'Chuẩn bị'});
for(let e=1;e<=cfg.ex;e++){
S.forEach((n,si)=>{
for(let sd=1;sd<=sides;sd++){
for(let r=1;r<=n;r++){
st.push({t:'hold',d:cfg.hold,e,s:si+1,r,n,sd,label:'Giữ'});
if(r<n&&cfg.rest>0)st.push({t:'rest',d:cfg.rest,e,s:si+1,r,n,sd,label:'Nghỉ'});
}
if(sd<sides&&cfg.sideRest>0)st.push({t:'side',d:cfg.sideRest,e,s:si+1,sd,label:'Đổi bên',say:`Xong bên trái. Nghỉ, đổi sang bên phải`});
}
if(si<S.length-1&&cfg.setRest>0)st.push({t:'setrest',d:cfg.setRest,e,s:si+1,label:'Nghỉ giữa hiệp',say:`Xong hiệp ${si+1}. Nghỉ ${cfg.setRest} giây. Hiệp tiếp theo ${S[si+1]} cái${cfg.swap?' mỗi bên, bắt đầu bên trái':''}`});
});
if(e<cfg.ex&&cfg.switchRest>0)st.push({t:'switch',d:cfg.switchRest,e,label:'Chuyển bài',say:`Xong ${speakNameOf(e)}. Nghỉ ${cfg.switchRest} giây, chuyển sang ${speakNameOf(e+1)}`});
}
return st;
}
let sessStart=0,steps=[],idx=0,rem=0,running=false,started=false,last=0,lastSec=-1,totalAll=0,doneTime=0,halfSaid=false,wl=null;
const COL={prep:['#a78bfa','#7c3aed'],hold:['#5de3a1','#4ecb8f'],rest:['#ff6b57','#ee1650'],setrest:['#8b8bf5','#5b6cf0'],switch:['#fbbf24','#f97316'],side:['#fbbf24','#f97316']};
const TITLE={prep:'Chuẩn bị',hold:'Tập luyện',rest:'Nghỉ ngơi',setrest:'Nghỉ giữa hiệp',switch:'Chuyển bài',side:'Đổi bên'};
const SIDE=['','Bên trái','Bên phải'];
function showTotal(){
const tot=build().reduce((a,s)=>a+s.d,0);
$('time').textContent=fmt(tot);$('label').textContent='Tổng thời gian';
$('top').className='top';$('info').textContent=cfg.ex+' bài × '+cfg.nSets+' hiệp ('+getSets().join('·')+')'+(cfg.swap?' · 2 bên':'');
week();sugRender();
}
function week(){const d=new Date(),ws=new Date(d.getFullYear(),d.getMonth(),d.getDate()-(d.getDay()+6)%7).getTime(),n=get('hist').filter(x=>x.ok&&x.t>=ws).length,g=cfg.goal;
$('wk').textContent=g?`Tuần này: ${n}/${g} buổi${n>=g?' · Đạt mục tiêu':''}`:'';$('prog').style.width=g?Math.min(100,n/g*100)+'%':'0'}
const wk0=d=>{const x=new Date(d);x.setDate(x.getDate()-(x.getDay()+6)%7);return dk(x)};
const addD=(k,n)=>{const d=new Date(k+'T00:00');d.setDate(d.getDate()+n);return dk(d)};
const fd=d=>p2(d.getDate())+'/'+p2(d.getMonth()+1);
const vname=()=>{try{return (speechSynthesis.getVoices().find(v=>v.voiceURI===cfg.voice)||{}).name||'Tự động'}catch(e){return 'Tự động'}};
function suggest(){
if(cfg.hold>=30)return null;
let until=0;try{until=+localStorage.getItem('sugOff')||0}catch(e){}
if(Date.now()<until)return null;
const need=Math.max(1,Math.min(cfg.goal||3,3)),cnt={};
get('hist').filter(x=>x.ok&&x.hd>=cfg.hold).forEach(x=>{const k=wk0(new Date(x.t));cnt[k]=(cnt[k]||0)+1});
const cur=wk0(new Date());let k=(cnt[cur]||0)>=need?cur:addD(cur,-7);
for(let i=0;i<3;i++,k=addD(k,-7))if((cnt[k]||0)<need)return null;
return{to:Math.min(30,cfg.hold+2),need};
}
function backupCard(){
const h=get('hist');if(!h.length)return '';
let lb=0;try{lb=+localStorage.getItem('lastBackup')||0}catch(e){}
const dn=Math.floor((Date.now()-lb)/864e5);
if(lb&&dn<7)return '';
return `<div class="sug"><b>${I('down')} Nhắc sao lưu</b>${lb?('Đã '+dn+' ngày chưa sao lưu lịch sử tập.'):'Bạn chưa sao lưu lịch sử tập lần nào.'} Dữ liệu chỉ lưu trên máy này.<div><button class="btn p" data-s="backup">Xuất sao lưu ngay</button></div></div>`;
}
function sugRender(){
const e=$('sug'),g=suggest();
if(started){e.innerHTML='';return}
e.innerHTML=backupCard()+(!g?'':`<div class="sug"><b>${I('bulb')} Gợi ý tăng dần</b>Bạn đã tập đều 3 tuần liên tiếp (từ ${g.need} buổi/tuần) ở mức giữ ${cfg.hold} giây. Có thể thử tăng lên ${g.to} giây. Nếu thấy đau hoặc mỏi bất thường thì giữ nguyên và hỏi chuyên gia.<div><button class="btn p" data-s="ok">Tăng lên ${g.to} giây</button><button class="btn" data-s="later">Để sau 1 tuần</button></div></div>`);
}
/* Âm thanh */
let ac=null;
function initAudio(){
try{if(navigator.audioSession)navigator.audioSession.type='ambient'}catch(e){}
try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state!=='running')ac.resume()}catch(e){}
}
function beep(f=880,d=.15,v=.35){
v*=cfg.vol/100;if(!ac||!(cfg.snd==='beep'||cfg.snd==='both'))return;
const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;
o.frequency.value=f;o.connect(g);g.connect(ac.destination);
g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.001,t+d);
o.start(t);o.stop(t+d+.02);
}
function say(t,force,uri){
if(!(force||cfg.snd==='voice'||cfg.snd==='both')||!t||!('speechSynthesis' in window))return;
const u=new SpeechSynthesisUtterance(t);u.lang='vi-VN';u.rate=1.05;u.volume=cfg.vol/100;
const vs=speechSynthesis.getVoices(),want=uri!==undefined?uri:cfg.voice,v=(want&&vs.find(x=>x.voiceURI===want))||vs.find(x=>x.lang&&x.lang.toLowerCase().startsWith('vi'));if(v){u.voice=v;u.lang=v.lang}
speechSynthesis.cancel();speechSynthesis.speak(u);
}
function cueStart(s){
if(s.t==='hold'){beep(1000,.35);const fe=s.r===1&&s.s===1&&s.sd===1;say((fe?speakNameOf(s.e)+'. ':'')+(cfg.swap&&s.sd&&s.r===1?SIDE[s.sd]+', bắt đầu':'Bắt đầu'))}
else if(s.t==='prep'){beep(600,.15);say('Chuẩn bị')}
else if(s.t==='rest'){beep(500,.25);say('Nghỉ')}
else{beep(500,.25);say(s.say)}
}
const saveSess=()=>{try{localStorage.setItem('sess',JSON.stringify({idx,rem,doneTime,sessStart,t:Date.now()}))}catch(e){}};
const clearSess=()=>{try{localStorage.removeItem('sess')}catch(e){}};
function resume(){
let d=null;try{d=JSON.parse(localStorage.getItem('sess')||'null')}catch(e){}
if(!d||Date.now()-d.t>6*36e5){clearSess();return false}
steps=build();
if(!steps.length||d.idx>=steps.length||!confirm('Có buổi tập đang dở. Tiếp tục không?')){clearSess();return false}
totalAll=steps.reduce((a,x)=>a+x.d,0);doneTime=d.doneTime;sessStart=d.sessStart;started=true;running=false;
$('run').style.display='flex';enter(d.idx,true);rem=d.rem;upd();setIcon();saveSess();return true}
const dots=(el,n,c)=>{el.innerHTML=Array.from({length:n},(_,i)=>`<i class="${i+1===c?'on':''}">${i+1}</i>`).join('')};
function enter(i,q){
idx=i;const s=steps[i];rem=s.d;lastSec=-1;halfSaid=false;
const c=COL[s.t];
$('run').style.background=`linear-gradient(135deg,${c[0]},${c[1]})`;$('rPlay').style.color=c[1];
$('rPhase').textContent=TITLE[s.t];
const ex=s.t==='switch'?s.e+1:s.e,st=s.t==='switch'?1:s.t==='setrest'?s.s+1:s.s,sl=cfg.swap&&s.sd?' · '+SIDE[s.sd]:'';
const S=getSets();
$('rTitle').textContent=`Bài ${ex}/${cfg.ex} · Hiệp ${st}/${S.length}`;
dots($('rEx'),cfg.ex,ex);dots($('rSet'),S.length,st);$('rName').textContent=nameOf(ex);
$('rSub').textContent=s.t==='prep'?'Sẵn sàng nào':s.t==='hold'?`Cái ${s.r}/${s.n}${sl}`:s.t==='rest'?`Cái tiếp theo: ${s.r+1}/${s.n}${sl}`:s.t==='side'?`Tiếp theo: ${SIDE[2].toLowerCase()}`:`Hiệp ${st}: ${S[st-1]} cái${s.t==='setrest'&&cfg.swap?' mỗi bên · '+SIDE[1]:sl}`;
upd();
if(!q)cueStart(s);
saveSess();
}
function upd(){
const s=steps[idx],r=Math.max(rem,0);
$('rTime').textContent=fmt(r);
$('ring').style.strokeDashoffset=578.05*(1-r/s.d);$('rLeft').textContent=fmt(totalAll-doneTime-(s.d-r));
}
function tick(now){
if(!running)return;
rem-=(now-last)/1000;last=now;
const s=steps[idx],sec=Math.ceil(rem);
if(s.t==='hold'){
if(!halfSaid&&rem<=s.d/2){halfSaid=true;if(s.d>=4){beep(800,.1);say('Một nửa')}}
}else if(s.t!=='hold'&&sec!==lastSec&&sec>=1&&sec<=3){
const firstN=Math.min(3,s.d),letLabelSpeak=(s.t==='rest'||s.t==='prep')&&s.d<=4&&sec===firstN;
if(!letLabelSpeak){beep(700,.1);say(String(sec))}}
if(sec!==lastSec)saveSess();
lastSec=sec;
if(rem<=0){
while(rem<=0){const c=steps[idx];doneTime+=c.d;if(idx+1>=steps.length){finish();return}const ov=-rem;enter(idx+1,ov>=steps[idx+1].d);rem-=ov}
}else upd();
requestAnimationFrame(tick);
}
function setIcon(){$('rpi').innerHTML=running?'<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>':'<path d="M7 4l14 8-14 8z"/>'}
async function wake(on){try{if(on){if(!wl||wl.released)wl=await navigator.wakeLock.request('screen')}else if(wl){wl.release();wl=null}}catch(e){}}
function close(){clearSess();lock(false);running=false;started=false;wake(false);$('run').style.display='none';showTotal()}
/* Ghi lịch sử */
function logSess(ok){
const n=ok?steps.length:idx,dn=steps.slice(0,n).filter(s=>s.t==='hold'),h=dn.length;
const cur=steps[idx],el=ok?totalAll:doneTime+(cur.d-Math.max(rem,0));
if(!h)return;
const nl=Array.from({length:cfg.ex},(_,i)=>nameOf(i+1));
put('hist',[...get('hist'),{t:Date.now(),s0:sessStart,wt:Math.round((Date.now()-sessStart)/1000),el:Math.round(el),h,hd:cfg.hold,ex:cfg.ex,ns:cfg.nSets,ok:ok?1:0,nm:nl.join(', '),nl,ss:getSets(),sw:cfg.swap?1:0,h1:dn.filter(x=>x.sd===1).length,h2:dn.filter(x=>x.sd===2).length,pe:nl.map((_,i)=>dn.filter(x=>x.e===i+1).length),rt:{pr:cfg.prep,rs:cfg.rest,sr:cfg.setRest,sd:cfg.sideRest,sw:cfg.switchRest},sp:ok?null:{e:cur.e,s:cur.s,r:cur.r,sd:cur.sd}}]);
}
let cfRaf=0;
function confetti(){
cancelAnimationFrame(cfRaf);
const cv=$('cf'),x=cv.getContext('2d'),dpr=window.devicePixelRatio||1,W=innerWidth,H=innerHeight;
cv.width=W*dpr;cv.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);
if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const cols=['#ff6b57','#fbbf24','#ffffff','#a78bfa','#f472b6','#facc15'],P=[],R=(a,b)=>a+Math.random()*(b-a);
const mk=(px,py,vx,vy,i)=>P.push({x:px,y:py,vx,vy,w:R(6,11),h:R(8,16),r:R(0,6.28),vr:R(-.3,.3),c:cols[i%cols.length]});
const shoot=(px,dir,n)=>{for(let i=0;i<n;i++)mk(px,H,dir*R(2,9),-R(12,20),i)};
const t0=performance.now();let fired=false;
shoot(0,1,70);shoot(W,-1,70);
(function f(t){
const el=t-t0;
if(el>900&&!fired){fired=true;shoot(0,1,50);shoot(W,-1,50)}
if(el<2500&&Math.random()<.5)mk(R(0,W),-10,R(-1.5,1.5),R(2,5),P.length);
x.clearRect(0,0,W,H);
for(let i=P.length-1;i>=0;i--){
const p=P[i];p.vy+=.35;p.vx*=.985;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;
if(p.y>H+30){P.splice(i,1);continue}
x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.w/2,-p.h/2,p.w,p.h);x.restore();
}
if(P.length||el<2500)cfRaf=requestAnimationFrame(f);else x.clearRect(0,0,W,H);
})(t0);
}
let bkpT=0;
function finish(){
running=false;logSess(true);clearSess();lock(false);wake(false);
[523,659,784].forEach((f,i)=>setTimeout(()=>beep(f,.18),i*180));setTimeout(()=>beep(1047,.6),540);
say('Chúc mừng bạn đã hoàn thành buổi tập');
try{navigator.vibrate&&navigator.vibrate([200,100,200,100,400])}catch(e){}
const S=getSets();
$('dStats').innerHTML=`<div><b>${fmt(totalAll)}</b><span>Thời gian</span></div><div><b>${cfg.ex}</b><span>Bài tập</span></div><div><b>${S.length}</b><span>Hiệp mỗi bài</span></div>`;
$('done').style.display='flex';confetti();
clearTimeout(bkpT);bkpT=setTimeout(()=>{$('bkp').style.display='flex'},3000);
}
$('dDone').onclick=()=>{cancelAnimationFrame(cfRaf);clearTimeout(bkpT);$('bkp').style.display='none';$('done').style.display='none';close()};
$('bkpYes').onclick=()=>{$('bkp').style.display='none';shareBackup()};$('bkpNo').onclick=()=>{$('bkp').style.display='none'};
$('play').onclick=()=>{
initAudio();
steps=build();if(!steps.length)return;
totalAll=steps.reduce((a,s)=>a+s.d,0);doneTime=0;started=true;running=true;sessStart=Date.now();
$('run').style.display='flex';last=performance.now();enter(0);setIcon();wake(true);if(cfg.autolock)lock(true);
requestAnimationFrame(tick);
};
$('rPlay').onclick=()=>{
initAudio();
running=!running;setIcon();saveSess();
if(running){last=performance.now();requestAnimationFrame(tick)}else if('speechSynthesis' in window)speechSynthesis.cancel();
};
$('rCancel').onclick=()=>{if(!confirm('Dừng buổi tập?')){last=performance.now();return}if('speechSynthesis' in window)speechSynthesis.cancel();logSess(false);close()};$('rSkip').onclick=()=>{
doneTime+=steps[idx].d;
if(idx+1>=steps.length)finish();else enter(idx+1);
};
$('rPrev').onclick=()=>{const s=steps[idx];last=performance.now();if(idx===0||s.d-rem>2)enter(idx);else{doneTime-=steps[idx-1].d;enter(idx-1)}};
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&started&&running)wake(true)});
function lock(on){const l=$('lk'),h=$('lkHint');l.style.display=on?'block':'none';h.classList.remove('show');if(on){void h.offsetWidth;h.classList.add('show')}}
$('lockBtn').onclick=()=>lock(true);
$('lkHold').addEventListener('click',()=>{lock(false);try{navigator.vibrate&&navigator.vibrate(30)}catch(x){}});
$('lk').addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
$('sug').onclick=e=>{const a=e.target.dataset.s;if(!a)return;if(a==='backup'){shareBackup();return}const g=suggest();if(!g)return;
if(a==='ok'){cfg.hold=g.to;save();render()}else{try{localStorage.setItem('sugOff',String(Date.now()+7*864e5))}catch(x){}sugRender()}};
/* Popup & menu */
const mk=(first,dec,nSets,swap=1)=>({prep:5,hold:10,rest:3,ex:3,nSets,first,dec,setRest:15,switchRest:30,swap,sideRest:10,names:[...BIG3]});
const PR=[
{n:'McGill 5-3-1',c:mk(5,2,3)},
{n:'McGill 6-4-2',c:mk(6,2,3)},
{n:'McGill 5-4-3-2-1 (giảm 1 cái/hiệp)',c:mk(5,1,5)},
{n:'McGill 4-3-2-1 (giảm 1 cái/hiệp)',c:mk(4,1,4)},
{n:'McGill 3-2-1 (nhẹ)',c:mk(3,1,3)},
{n:'McGill 5-3-1 (không đổi bên)',c:mk(5,2,3,0)}
];
const PK=['prep','hold','rest','ex','nSets','first','dec','setRest','switchRest','swap','sideRest'];
const allP=()=>[...PR.map(p=>({...p,b:1})),...get('pre')];
let mt='about',hv='day',hdk=dk(Date.now()),hy=0,hm=0,hwk=wk0(new Date());
let dEv=null;const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent),isSA=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();dEv=e;try{if(mt==='about')mrender()}catch(x){}});
addEventListener('appinstalled',()=>{dEv=null;try{if(mt==='about')mrender()}catch(x){}});
const vInstall=()=>{if(isSA)return '';if(dEv)return `<div class="it"><b>Cài đặt ứng dụng</b><small>Thêm vào màn hình chính để mở nhanh và dùng khi không có mạng</small><button class="btn p" data-a="install">Cài đặt ngay</button></div>`;if(isIOS)return `<div class="it"><b>Cài đặt ứng dụng</b><small>iPhone: bấm nút Chia sẻ ở thanh Safari rồi chọn “Thêm vào MH chính”</small></div>`;return ''};
let isWel=false;
const openOv=()=>{$('ov').style.display='flex';document.documentElement.classList.add('lock')};
const closeOv=()=>{
if(isWel){const c=$('nw');if(c&&c.checked)try{localStorage.setItem('hideWel',String(Date.now()))}catch(e){}isWel=false}
$('ov').style.display='none';document.documentElement.classList.remove('lock');if(!started)showTotal();
};
$('ov').addEventListener('touchmove',e=>{if(!e.target.closest('#mb'))e.preventDefault()},{passive:false});
function welcome(){
isWel=true;$('ov').firstElementChild.classList.add('sm');
$('mtl').textContent='Bấm giờ McGill Big 3';$('mt').style.display='none';
$('mb').innerHTML=`<p>Đây là <b>ứng dụng bấm giờ tập luyện McGill Big 3</b>: Bộ 3 bài ổn định cột sống do giáo sư Stuart McGill phát triển gồm <b>Curl-Up, Side Plank và Bird-Dog</b>, thường dùng để tăng sức bền cơ lõi và hỗ trợ phòng ngừa đau lưng dưới.</p><ul><li>Bấm giờ giữ, nghỉ, số hiệp; có âm báo và giọng nói tiếng Việt</li><li>Mẫu tập McGill có sẵn (5-3-1, 6-4-2…) và hướng dẫn từng bài</li><li>Tự ghi lịch sử tập theo ngày, tháng, năm</li></ul><p>Bấm nút ba gạch ở góc trên để xem lịch sử, mẫu tập và hướng dẫn.</p><p>Tác giả: <b>Hoàng Hùng</b></p><label style="display:flex;align-items:center;gap:8px;margin:12px 0 6px;font-size:14px;cursor:pointer"><input type="checkbox" id="nw" style="width:20px;height:20px"> Không hiển thị lại lần sau</label><button class="btn p" data-a="close" style="width:100%;margin:6px 0 0">Bắt đầu</button>`;
openOv();
}
function openMenu(){isWel=false;$('ov').firstElementChild.classList.remove('sm');$('mt').style.display='flex';mrender();openOv()}
const MT={about:'Về ứng dụng',hist:'Lịch sử tập luyện',pre:'Mẫu tập',ex:'Hướng dẫn từng bài',guide:'Cách dùng và nguyên tắc'};
function mrender(){
$('mtl').textContent=MT[mt];
$('mt').innerHTML=[['about','Giới thiệu'],['hist','Lịch sử'],['pre','Mẫu tập'],['ex','Bài tập'],['guide','Hướng dẫn']].map(([k,n])=>`<button class="tb${k===mt?' on':''}" data-a="tab" data-t="${k}">${n}</button>`).join('');
$('mb').innerHTML=({about:vAbout,hist:vHist,pre:vPre,ex:vEx,guide:vGuide})[mt]();
if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)$('mb').querySelectorAll('animate,animateTransform').forEach(a=>{const v=a.getAttribute('values').split(';')[2],p=a.parentNode,n=a.getAttribute('attributeName');p.setAttribute(n,n==='transform'?a.getAttribute('type')+'('+v+')':v);a.remove()});
const on=$('mt').querySelector('.on');if(on)$('mt').scrollLeft=on.offsetLeft-($('mt').clientWidth-on.offsetWidth)/2;
$('mb').scrollTop=0;
}
const vAbout=()=>`<p><b>Đồng hồ bấm giờ</b> (phiên bản 2.0) là ứng dụng bấm giờ tập luyện <b>McGill Big 3</b> (Curl-Up, Side Plank, Bird-Dog): chỉnh thời gian giữ, nghỉ, số bài, số hiệp và theo dõi quá trình tập mỗi ngày.</p><div class="it"><small>Tác giả</small><b>Hoàng Hùng</b></div><div class="it"><small>Số điện thoại liên hệ</small><a href="tel:0964843943">0964843943</a></div><div class="it"><small>Facebook</small><a href="https://fb.com/masterhmh" target="_blank" rel="noopener">fb.com/masterhmh</a></div>${vInstall()}`;
const KT='0;.12;.3;.72;.88;1',KS=Array(5).fill('.4 0 .2 1').join(';');
const anv=(a,v,t)=>`<animate${t?'Transform':''} attributeName="${a}"${t?` type="${t}"`:''} dur="5s" repeatCount="indefinite" calcMode="spline" keyTimes="${KT}" keySplines="${KS}" values="${v.join(';')}"/>`;
const an=(a,r,h,t)=>anv(a,[r,r,h,h,r,r],t);
const C={sk:'#d9a273',skd:'#bd8553',hr:'#2a1d1a',top:'#f9c4dc',so:'#1c1c21',shoe:'#9a9aa3',sole:'#f4f4f6',mat:'#f6a98b',ac:'#f2284f',or:'#f4772c'};
const PT=(d,w,c,x='')=>`<path d="${d}" stroke="${c}" stroke-width="${w}">${x}</path>`;
const EL=(x,y,rx,ry,f,x2='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" stroke="none">${x2}</ellipse>`;
const SHD=(x,rx)=>`<ellipse cx="${x}" cy="152" rx="${rx}" ry="5" fill="#d9825f" opacity=".45" stroke="none"/>`;
const SH2=(x,y,x2='')=>`<g>${x2}${EL(x,y,12,5,C.shoe)}${EL(x,y+3.2,12,2.2,C.sole)}</g>`;
const HD=(x,y,dx,dy)=>`<circle cx="${x}" cy="${y}" r="14" fill="${C.hr}" stroke="none"/><circle cx="${x+dx}" cy="${y+dy}" r="12" fill="${C.sk}" stroke="none"/>`;
const AR=d=>`<path d="${d}" stroke="${C.or}" stroke-width="3.2" opacity="0">${an('opacity',0,1)}</path>`;
const TX=(x,y,t,show)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.ac}" stroke="none" opacity="${show?0:1}">${t}${show?an('opacity',0,1):''}</text>`;
const GLOW=(x,y,rx,ry,rot='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${C.ac}" stroke="none" opacity="0"${rot}>${an('opacity',0,.55)}</ellipse>`;
const BD=(n,s)=>`<g${s?'':' opacity="0"'}>${s?an('opacity',1,0):an('opacity',0,1)}<circle cx="24" cy="52" r="10" fill="#111" stroke="none"/><text x="24" y="56.5" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" stroke="none">${n}</text></g>`;
const SV=(t,l,b)=>`<svg class="ill" viewBox="0 0 320 190" role="img" aria-label="${l}" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect width="320" height="190" rx="14" fill="#fafafb" stroke="none"/><path d="M0 14Q0 0 14 0H306Q320 0 320 14V104H0Z" fill="#e5e5e9" stroke="none"/><path d="M46 126H282L308 174H18Z" fill="${C.mat}" stroke="none"/><text x="14" y="24" font-size="12" font-weight="800" fill="#2b2b30" stroke="none">${t}</text>${BD(1,1)}${BD(2,0)}${b}<text x="306" y="24" text-anchor="end" font-size="13" font-weight="800" fill="${C.ac}" stroke="none" opacity="0">Giữ${an('opacity',0,1)}</text><rect x="262" y="31" width="44" height="4" rx="2" fill="#2b2b30" opacity=".15" stroke="none"/><rect x="262" y="31" width="0" height="4" rx="2" fill="${C.ac}" stroke="none">${anv('width',[0,0,0,44,0,0])}</rect></svg>`;
const IMG={
curl:SV('CURL-UP','Minh họa Curl-Up: nằm ngửa, một chân co, hai tay đỡ dưới lưng, nâng nhẹ đầu và vai rồi giữ',
SHD(150,122)+
PT('M172 141L196 142',20,C.so)+PT('M196 142L222 144',13,C.skd)+PT('M222 144L254 146',11,C.skd)+EL(263,141,6,11,C.shoe)+
PT('M170 138L197 117',21,C.so)+PT('M197 117L214 99',14,C.sk)+PT('M214 99L234 146',11,C.sk)+EL(241,147,14,5,C.shoe)+EL(241,150,14,2.2,C.sole)+
PT('M126 139Q148 118 172 139',24,C.top)+PT('M156 131L178 141',24,C.so)+
PT('M90 141L112 148L152 147',9,C.sk,an('d','M90 141L112 148L152 147','M90 132L112 148L152 147'))+
`<g>${an('transform','0 126 139','12 126 139','rotate')}`+PT('M84 139H126',24,C.top)+PT('M70 137L86 138',9,C.sk)+PT('M42 143L28 149',7,C.hr)+HD(52,137,2,-2.5)+GLOW(108,131,19,8)+`</g>`+
AR('M36 112Q32 96 44 86M38 90L44 86L47 94')+
TX(150,184,'↑ Hai tay đỡ lưng dưới',0)+TX(96,76,'Nâng nhẹ vài cm',1)),
side:SV('SIDE PLANK','Minh họa Side Plank: nằm nghiêng, chống khuỷu tay, nâng hông để thân thẳng một đường',
SHD(170,125)+
PT('M165 129L125 135',20,C.so,an('d','M165 129L125 135','M165 115L125 125'))+PT('M125 135L91 139',11,C.skd,an('d','M125 135L91 139','M125 125L91 137'))+EL(84,140,12,5,C.shoe)+
PT('M246 104V143L214 148',11,C.sk)+
PT('M170 136L130 142',22,C.so,an('d','M170 136L130 142','M170 122L130 132'))+PT('M130 142L96 146',12,C.sk,an('d','M130 142L96 146','M130 132L96 144'))+EL(88,148,12,5,C.shoe)+EL(88,151,12,2.2,C.sole)+
PT('M246 102L170 136',24,C.top,an('d','M246 102L170 136','M246 102L170 122'))+
GLOW(208,112,18,6,' transform="rotate(-15 208 112)"')+
PT('M246 100L262 94',10,C.sk)+PT('M266 82Q252 76 246 88',7,C.hr)+HD(274,90,2.5,1)+
PT('M242 98L226 74L198 112',10,C.sk,an('d','M242 98L226 74L198 112','M242 98L226 74L198 103'))+
AR('M170 98V76M163 83L170 76L177 83')+
TX(112,84,'Hông nâng cao',1)+TX(150,62,'Thân thẳng một đường',1)),
bird:SV('BIRD-DOG','Minh họa Bird-Dog: quỳ bốn điểm, duỗi tay và chân đối diện, đầu giữ thẳng hàng với lưng',
SHD(160,128)+
PT('M168 102L170 140',20,C.so)+PT('M170 142L214 147',11,C.skd)+EL(221,147,12,5,C.shoe)+
PT('M100 96L102 122L101 146',11,C.skd,an('d','M100 96L102 122L101 146','M100 90L64 88L28 86'))+
PT('M100 92L152 93',24,C.top)+PT('M150 93L178 96',24,C.so)+
PT('M100 90L84 86',10,C.sk)+PT('M80 72Q96 62 104 70',7,C.hr)+HD(72,84,-2,2.5)+
PT('M100 98L99 142',12,C.sk)+EL(100,147,11,4,C.sk)+
PT('M172 100L178 138',19,C.so,an('d','M172 100L178 138','M172 97L213 92'))+PT('M178 140L222 146',11,C.sk,an('d','M178 140L222 146','M213 92L254 88'))+
SH2(225,146,an('transform','0 0','32 -58','translate'))+
`<path d="M60 58H190" stroke="${C.ac}" stroke-width="2" stroke-dasharray="5 5" opacity="0">${an('opacity',0,.9)}</path>`+
AR('M30 112Q24 100 28 94M24 99L28 94L33 99')+AR('M268 112Q274 100 270 94M264 99L270 94L275 99')+
TX(125,50,'Lưng và đầu thẳng hàng',1))
};
const vEx=()=>`<p>McGill Big 3 gồm 3 bài, tương ứng Bài 1, 2, 3 trong ứng dụng. Mỗi lần giữ khoảng 10 giây, làm theo kiểu giảm dần số lần (ví dụ 5-3-1 hoặc 6-4-2), nghỉ ngắn giữa các lần và thường tập hằng ngày.</p>
<div class="it"><b>1. Curl-Up (gập bụng cải tiến)</b><img class="ill" src="${IMG_CURLUP}" alt="Hình minh họa Curl-Up" loading="lazy" onerror="this.outerHTML=IMG.curl"><ul><li>Nằm ngửa, một chân co, chân kia duỗi thẳng. Hai tay đặt dưới thắt lưng để giữ độ cong tự nhiên của lưng.</li><li>Nâng nhẹ đầu và vai lên chỉ vài xăng-ti-mét, giữ cổ và ngực thành một khối, mắt nhìn lên trần.</li><li>Giữ, thở đều rồi hạ xuống. Đổi chân co ở hiệp khác.</li><li>Lỗi hay gặp: cuộn lưng, kéo cổ bằng tay, nín thở, ép lưng xuống sàn.</li></ul></div>
<div class="it"><b>2. Side Plank (chống nghiêng)</b><img class="ill" src="${IMG_SIDEPLANK}" alt="Hình minh họa Side Plank" loading="lazy" onerror="this.outerHTML=IMG.side"><ul><li>Nằm nghiêng, khuỷu tay ngay dưới vai, cẳng tay vuông góc với thân.</li><li>Dễ hơn: đầu gối chạm sàn. Khó hơn: duỗi thẳng chân, hai chân chồng lên nhau.</li><li>Nâng hông khỏi sàn để thân thẳng một đường. Tay còn lại đặt trước ngực.</li><li>Làm cả hai bên. Lỗi hay gặp: hông võng, xoay người ra trước hoặc ra sau, nhún vai.</li></ul></div>
<div class="it"><b>3. Bird-Dog (chó săn chim)</b><img class="ill" src="${IMG_BIRDDOG}" alt="Hình minh họa Bird-Dog" loading="lazy" onerror="this.outerHTML=IMG.bird"><ul><li>Quỳ bốn điểm, tay dưới vai, gối dưới hông, lưng giữ trung tính.</li><li>Duỗi một chân ra sau ngang hông và tay đối diện ra trước ngang vai, cố giữ hông và vai không xoay.</li><li>Giữ, hạ về rồi đổi bên. Lỗi hay gặp: ưỡn lưng, nâng chân tay quá cao, xoay hông.</li></ul></div>
<p style="color:var(--mu);font-size:13px">Hình động minh họa từng bài: nâng lên, giữ, hạ xuống. Vùng đỏ là nhóm cơ đang làm việc, chữ đỏ là điểm cần chú ý. Mỗi vòng gồm nâng lên, giữ (thanh tiến độ ở góc phải), hạ xuống.</p><p>Mẹo trong ứng dụng: cả 3 bài đều nên làm hai bên (Curl-Up thì đổi chân co). Bật “Đổi chân / đổi bên” để ứng dụng tự chạy bên trái rồi bên phải trong từng hiệp. Đặt tên bài tại nút “Tên bài”.</p>
<p style="color:var(--mu);font-size:13px">Thông tin chỉ mang tính tham khảo, không thay thế tư vấn y tế. Nếu đang đau lưng nặng, tê hoặc yếu chân, hãy hỏi bác sĩ hoặc chuyên gia vật lý trị liệu trước khi tập.</p>`;
const vGuide=()=>`<p><b>Cách dùng ứng dụng</b></p><ul><li>Bấm + / − để đổi thông số, bấm vào số để nhập trực tiếp.</li><li>Bấm nút tròn lớn để bắt đầu; trong lúc tập có thể tạm dừng hoặc bỏ qua bước.</li><li>“Tên bài” để đặt tên từng bài; “Mẫu tập” để lưu và dùng lại cấu hình giờ.</li><li>“Đổi chân / đổi bên”: bật thì mỗi hiệp chạy bên trái, nghỉ đổi bên rồi chạy bên phải, sau đó mới nghỉ giữa hiệp; tắt thì chỉ chạy một bên.</li><li>Nếu bật “Khóa cảm ứng”, khi bấm bắt đầu màn hình sẽ tự khóa để khỏi bấm nhầm; muốn mở thì chạm vào nút hình ổ khóa ở góc phải. Có thể khóa lại bằng nút ổ khóa đó.</li><li>“Giọng đọc”: chọn giọng tiếng Việt có sẵn trên máy và nghe thử.</li><li>Buổi tập tự ghi vào Lịch sử khi hoàn thành (hoặc khi hủy giữa chừng nếu đã giữ ít nhất 1 cái).</li></ul><p><b>Nguyên tắc tập luyện</b></p><ul><li>Khởi động 3–5 phút trước khi tập.</li><li>Giữ đúng tư thế, thở đều, không nín thở.</li><li>Tăng dần: thêm vài giây giữ hoặc thêm hiệp mỗi tuần, không tăng đột ngột.</li><li>Nghỉ đủ giữa các hiệp; ngủ đủ để cơ hồi phục.</li><li>Tập đều đặn quan trọng hơn tập quá sức; dùng chuỗi ngày liên tiếp để giữ nhịp.</li><li>Đau nhói, chóng mặt hoặc khó thở: dừng ngay. Nếu có bệnh lý, hỏi bác sĩ trước khi tập.</li></ul>`;
function vPre(){
return allP().map((p,i)=>`<div class="it"><b>${esc(p.n)}</b><small>${p.c.ex} bài × ${p.c.nSets} hiệp · ${p.c.first} cái, giảm ${p.c.dec}/hiệp · giữ ${p.c.hold} giây · nghỉ ${p.c.rest} giây · ${p.c.swap?'đổi bên':'một bên'}</small><button class="btn p" data-a="pre" data-i="${i}">Dùng</button>${p.b?'':`<button class="btn" data-a="pdel" data-i="${i-PR.length}">Xóa</button>`}</div>`).join('')+`<button class="btn p" data-a="psave">＋ Lưu cấu hình hiện tại</button>`;
}
const hhmm=t=>{const d=new Date(t);return p2(d.getHours())+':'+p2(d.getMinutes())};
const card=x=>{
const r=x.rt,sp=x.sp,nl=x.nl;
return `<div class="it"><b>${x.s0?hhmm(x.s0)+'–':''}${hhmm(x.t)}</b> ${x.ok?'<span style="color:#16a34a">'+I('check')+'</span> Hoàn thành':'<span style="color:#d97706">'+I('pausei')+'</span> Bỏ dở'}`+
`<small>${x.h} cái × ${x.hd} giây · tập ${fmt(x.el)}</small>`+
`<small>${x.ex} bài × ${x.ns} hiệp${x.ss?' ('+x.ss.join('·')+' cái)':''}${x.sw===undefined?'':x.sw?' · đổi bên (trái '+x.h1+', phải '+x.h2+')':' · một bên'}</small>`+
`<small>${nl&&x.pe?nl.map((n,i)=>esc(n)+' '+x.pe[i]).join(' · '):esc(x.nm||'')}</small>`+
(r?`<small>Nghỉ: cái ${r.rs} giây · hiệp ${r.sr} giây · đổi bên ${r.sd} giây · chuyển bài ${r.sw} giây · chuẩn bị ${r.pr} giây</small>`:'')+
(!x.ok&&sp&&sp.e?`<small>Dừng ở: ${nl?esc(nl[sp.e-1]||''):'bài '+sp.e}${sp.s?', hiệp '+sp.s:''}${sp.r?', cái '+sp.r:''}${x.sw&&sp.sd?(sp.sd===1?', bên trái':', bên phải'):''}</small>`:'')+`<button class="btn" data-a="sdel" data-t="${x.t}">${I('trash')} Xóa buổi này</button></div>`};
function vHist(){
const h=get('hist'),days={};h.forEach(x=>{const k=dk(x.t);days[k]=(days[k]||0)+x.el});
const dd={};h.forEach(x=>{if(x.ok)dd[dk(x.t)]=1});
let s=0,d=new Date();if(!dd[dk(d)])d.setDate(d.getDate()-1);
while(dd[dk(d)]){s++;d.setDate(d.getDate()-1)}
const keys=Object.keys(dd).sort();let lg=0,run=0,pv=null;
keys.forEach(k=>{const q=k.split('-'),n=Date.UTC(+q[0],+q[1]-1,+q[2])/864e5;run=pv!==null&&n-pv===1?run+1:1;pv=n;lg=Math.max(lg,run)});
const inM=(x,p)=>dk(x.t).startsWith(p),sum=l=>l.reduce((a,x)=>a+x.el,0);
const best=h.reduce((a,x)=>Math.max(a,x.h?x.hd:0),0);
let o=`<div class="st"><div><b>${s}</b>ngày liên tiếp</div><div><b>${Math.max(lg,s)}</b>chuỗi dài nhất</div><div><b>${keys.length}</b>ngày đã tập</div><div><b>${fmt(sum(h.filter(x=>inM(x,dk(Date.now()).slice(0,7)))))}</b>tổng tháng này</div><div><b>${best} giây</b>giữ lâu nhất</div><div><b>${h.length}</b>buổi tập</div></div>`;
o+=[['day','Ngày'],['week','Tuần'],['month','Tháng'],['year','Năm']].map(([k,n])=>`<button class="tb${k===hv?' on':''}" data-a="hv" data-v="${k}" style="margin-right:6px">${n}</button>`).join('');
const nav=t=>`<div class="nav"><button class="btn" data-a="nav" data-n="-1">◀</button>${t}<button class="btn" data-a="nav" data-n="1">▶</button></div>`;
if(hv==='day'){
const l=h.filter(x=>dk(x.t)===hdk).sort((a,b)=>a.t-b.t),[y,m,dd]=hdk.split('-');
o+=nav(`${dd}/${m}/${y}`);
o+=l.length?l.map(card).join('')+`<p>Tổng: ${l.length} buổi · ${fmt(sum(l))}</p>`:'<p>Chưa có buổi tập nào trong ngày này.</p>';
}else if(hv==='week'){
const ds=Array.from({length:7},(_,i)=>new Date(addD(hwk,i)+'T00:00')),ms=ds.map(d=>(days[dk(d)]||0)/60),mx=Math.max(...ms,1),l=h.filter(x=>{const k=dk(x.t);return k>=hwk&&k<=addD(hwk,6)}),nm=['T2','T3','T4','T5','T6','T7','CN'];
o+=nav(`${fd(ds[0])} – ${fd(ds[6])}`)+`<div class="yr">`+ds.map((d,i)=>`<div data-a="day" data-d="${dk(d)}">${ms[i]?Math.round(ms[i]):''}<span style="height:${ms[i]/mx*80}%"></span>${nm[i]}</div>`).join('')+`</div><p>${l.length} buổi · ${new Set(l.map(x=>dk(x.t))).size} ngày tập · ${fmt(sum(l))} (phút mỗi ngày).${cfg.goal?` Mục tiêu: ${l.filter(x=>x.ok).length}/${cfg.goal} buổi hoàn thành.`:''} Bấm cột để xem ngày.</p>`;
}else if(hv==='month'){
const pre=hy+'-'+p2(hm+1),dim=new Date(hy,hm+1,0).getDate(),off=(new Date(hy,hm,1).getDay()+6)%7,td=dk(Date.now());
let c=['T2','T3','T4','T5','T6','T7','CN'].map(x=>`<i>${x}</i>`).join('')+'<b class="n"></b>'.repeat(off);
for(let i=1;i<=dim;i++){const k=pre+'-'+p2(i),mn=(days[k]||0)/60,a=Math.min(.95,.25+mn/40);
c+=`<b data-a="day" data-d="${k}" class="${k===td?'t':''}"${mn?` style="background:rgba(244,54,79,${a});color:${a>.55?'#fff':'inherit'}"`:''}>${i}</b>`}
const l=h.filter(x=>inM(x,pre));
o+=nav(`Tháng ${hm+1}/${hy}`)+`<div class="cal">${c}</div><p>${l.length} buổi · ${new Set(l.map(x=>dk(x.t))).size} ngày tập · ${fmt(sum(l))}. Bấm vào ngày để xem chi tiết.</p>`;
}else{
const ms=Array.from({length:12},(_,i)=>h.filter(x=>inM(x,hy+'-'+p2(i+1))).reduce((a,x)=>a+x.el,0)/60),mx=Math.max(...ms,1);
o+=nav(`Năm ${hy}`)+`<div class="yr">`+ms.map((v,i)=>`<div data-a="mon" data-m="${i}">${v?Math.round(v):''}<span style="height:${v/mx*80}%"></span>${i+1}</div>`).join('')+`</div><p>Tổng: ${h.filter(x=>inM(x,hy+'-')).length} buổi · ${fmt(ms.reduce((a,v)=>a+v,0)*60)} (phút mỗi tháng). Bấm cột để xem tháng.</p>`;
}
const lab=hv==='day'?'ngày '+hdk.split('-').reverse().join('/'):hv==='week'?'tuần '+fd(new Date(hwk+'T00:00'))+'–'+fd(new Date(addD(hwk,6)+'T00:00')):hv==='month'?`tháng ${hm+1}/${hy}`:`năm ${hy}`;
const del=`<button class="btn" data-a="clr" data-s="${hv}">${I('trash')} Xóa ${lab}</button><button class="btn" data-a="clr" data-s="all">${I('trash')} Xóa tất cả</button>`;
return o+`<hr style="border:0;border-top:1px solid var(--bd)"><button class="btn" data-a="exp">${I('down')} Xuất sao lưu</button><button class="btn" data-a="imp">${I('up')} Nhập sao lưu</button><button class="btn" data-a="csv">${I('down')} Xuất CSV</button><br>${del}<p style="color:var(--mu);font-size:13px">Dữ liệu lưu trên thiết bị này. Hãy xuất tệp sao lưu định kỳ để không mất khi xóa dữ liệu trình duyệt.</p>`;
}
const syncYM=()=>{hy=+hdk.slice(0,4);hm=+hdk.slice(5,7)-1};
const backupName=()=>{const d=new Date();return d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear()+'.json'};
function shareBackup(){const blob=new Blob([JSON.stringify({v:1,cfg,hist:get('hist'),pre:get('pre')})],{type:'application/json'});
const f=new File([blob],backupName(),{type:'application/json'});
const done=()=>{try{localStorage.setItem('lastBackup',String(Date.now()))}catch(e){}sugRender()};
if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:'Sao lưu buổi tập'}).then(done).catch(()=>{})}
else doExport()}
function doExport(){const u=URL.createObjectURL(new Blob([JSON.stringify({v:1,cfg,hist:get('hist'),pre:get('pre')})],{type:'application/json'})),l=document.createElement('a');l.href=u;l.download=backupName();document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);try{localStorage.setItem('lastBackup',String(Date.now()))}catch(e){}sugRender()}
$('ov').addEventListener('click',e=>{
if(e.target===$('ov')){closeOv();return}
const b=e.target.closest('[data-a]');if(!b)return;
const a=b.dataset.a,D=b.dataset;
if(a==='close')closeOv();
else if(a==='tab'){mt=D.t;if(mt==='hist'){hdk=dk(Date.now());hwk=wk0(new Date());syncYM()}mrender()}
else if(a==='install'){if(dEv){dEv.prompt();dEv=null;mrender()}}
else if(a==='hv'){hv=D.v;syncYM();if(hv==='week')hwk=wk0(new Date(hdk+'T00:00'));mrender()}
else if(a==='nav'){const n=+D.n;
if(hv==='day'){const d=new Date(hdk+'T00:00');d.setDate(d.getDate()+n);hdk=dk(d);syncYM()}
else if(hv==='week'){hwk=addD(hwk,7*n)}
else if(hv==='month'){hm+=n;if(hm<0){hm=11;hy--}if(hm>11){hm=0;hy++}}
else hy+=n;
mrender()}
else if(a==='day'){hdk=D.d;hv='day';mrender()}
else if(a==='mon'){hm=+D.m;hv='month';mrender()}
else if(a==='pre'){const p=allP()[+D.i];Object.assign(cfg,p.c);cfg.names=p.c.names?[...p.c.names]:[];save();render();closeOv()}
else if(a==='pdel'){const l=get('pre');l.splice(+D.i,1);put('pre',l);mrender()}
else if(a==='psave'){const n=prompt('Tên mẫu tập');if(n&&n.trim()){const c={};PK.forEach(k=>c[k]=cfg[k]);c.names=[...(cfg.names||[])];put('pre',[...get('pre'),{n:n.trim(),c}]);mrender()}}
else if(a==='vc'){cfg.voice=D.u;save();render();openVoices()}
else if(a==='vt')say('Xin chào, đây là giọng đọc thử',1,D.u)
else if(a==='sdel'){if(confirm('Xóa buổi tập này? Không thể hoàn tác.')){put('hist',get('hist').filter(x=>x.t!==+D.t));mrender()}}
else if(a==='csv'){const q=v=>'"'+String(v).replace(/"/g,'""')+'"',h=get('hist');
const R=[['Ngày','Bắt đầu','Kết thúc','Trạng thái','Số cái','Giây/cái','Thời gian tập (s)','Bài','Hiệp','Đổi bên','Chi tiết bài'],...h.map(x=>[dk(x.t),x.s0?hhmm(x.s0):'',hhmm(x.t),x.ok?'Hoàn thành':'Bỏ dở',x.h,x.hd,x.el,x.ex,x.ns,x.sw?'Có':'Không',x.nl&&x.pe?x.nl.map((n,i)=>n+' '+x.pe[i]).join('; '):(x.nm||'')])];
const u=URL.createObjectURL(new Blob(['\ufeff'+R.map(r=>r.map(q).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'})),l=document.createElement('a');l.href=u;l.download='lich-su-'+dk(Date.now())+'.csv';document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),2000)}
else if(a==='exp')doExport();
else if(a==='imp')$('file').click();
else if(a==='clr'){
const sc=D.s,h=get('hist');
let f=()=>true,lab='toàn bộ lịch sử tập luyện';
if(sc==='day'){f=x=>dk(x.t)===hdk;lab='lịch sử ngày '+hdk.split('-').reverse().join('/')}
else if(sc==='week'){const e=addD(hwk,6);f=x=>{const k=dk(x.t);return k>=hwk&&k<=e};lab='lịch sử tuần '+fd(new Date(hwk+'T00:00'))+'–'+fd(new Date(e+'T00:00'))}
else if(sc==='month'){const pre=hy+'-'+p2(hm+1);f=x=>dk(x.t).startsWith(pre);lab=`lịch sử tháng ${hm+1}/${hy}`}
else if(sc==='year'){const pre=hy+'-';f=x=>dk(x.t).startsWith(pre);lab='lịch sử năm '+hy}
const n=h.filter(f).length;
if(!n){alert('Không có buổi tập nào để xóa.');return}
if(confirm(`Xóa ${lab} (${n} buổi tập)? Không thể hoàn tác.`)){put('hist',h.filter(x=>!f(x)));mrender()}
}
});
$('file').onchange=e=>{
const f=e.target.files[0];e.target.value='';if(!f)return;
const r=new FileReader();
r.onload=()=>{try{
const d=JSON.parse(r.result);if(!d||typeof d!=='object')throw 0;
if(Array.isArray(d.hist)){const m=new Map(get('hist').map(x=>[x.t,x]));d.hist.forEach(x=>{if(x&&x.t)m.set(x.t,x)});put('hist',[...m.values()].sort((a,b)=>a.t-b.t))}
if(Array.isArray(d.pre))put('pre',d.pre);
if(d.cfg&&typeof d.cfg==='object'){Object.assign(cfg,d.cfg);save()}
try{localStorage.setItem('lastBackup',String(Date.now()))}catch(e){}render();mrender();alert('Đã nhập dữ liệu sao lưu.');
}catch(x){alert('Tệp sao lưu không hợp lệ.')}};
r.readAsText(f);
};
function openVoices(){
isWel=false;$('ov').firstElementChild.classList.remove('sm');$('mtl').textContent='Giọng đọc';$('mt').style.display='none';
const vs=speechSynthesis.getVoices(),vi=vs.filter(v=>/^vi/i.test(v.lang)),list=vi.length?vi:vs;
const row=(n,l,u)=>`<div class="it"><b>${esc(n)}</b><small>${esc(l)}</small><button class="btn${cfg.voice===u?' p':''}" data-a="vc" data-u="${esc(u)}">Chọn</button><button class="btn" data-a="vt" data-u="${esc(u)}">Nghe thử</button></div>`;
$('mb').innerHTML=`<p>${vi.length?'Các giọng tiếng Việt trên máy:':'Máy không có giọng tiếng Việt, hiển thị tất cả giọng có sẵn:'}</p>`+row('Tự động','Giọng tiếng Việt đầu tiên tìm thấy','')+list.map(v=>row(v.name,v.lang,v.voiceURI)).join('')+'<p style="color:var(--mu);font-size:13px">Muốn thêm giọng: vào Cài đặt của máy, mục giọng nói/trợ năng để tải giọng tiếng Việt chất lượng cao.</p>';
openOv()}
$('vsel').onclick=()=>{if(!('speechSynthesis' in window)){alert('Thiết bị không hỗ trợ giọng đọc.');return}openVoices()};
$('menu').onclick=openMenu;
['gesturestart','gesturechange','gestureend'].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false}));
document.addEventListener('touchmove',e=>{if(e.touches.length>1)e.preventDefault()},{passive:false});
document.addEventListener('wheel',e=>{if(e.ctrlKey)e.preventDefault()},{passive:false});
if('speechSynthesis' in window){speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=()=>{if(!started)render()}}
render();
let hw=0;try{hw=+localStorage.getItem('hideWel')||0}catch(e){}
const hwD=new Date(hw),nwD=new Date();
if(!resume()&&(!hw||nwD.getFullYear()*12+nwD.getMonth()>hwD.getFullYear()*12+hwD.getMonth()))welcome();
if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{});
