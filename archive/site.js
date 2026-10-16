/* chen-pages-v2 (v3 content): the 1988 陳氏家譜, page by page in book order */
(function(){
const PG=window.PAGES,C=document.getElementById('content'),nav=document.getElementById('nav');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const fmt=s=>esc(s).replace(/⟦\?⟧/g,'<span class="q">[?]</span>');
const L=(z,e)=>`<span class="zh">${z}</span><span class="en">${e}</span>`;
// sections (menu) — labels are the book's own headings
const SEC=[['封面',0,'cover'],['序章',1],['陳氏家廟',3],['開基時期及開基祖公媽',9],['祖先渡台略圖',10],['來台定居後發展情形圖',12],['陳氏家譜',13],
 ['第一世',15,'第一世開基祖'],['第二世',15,'第二世祖公仲賢'],['第三世',18,'第三世祖公'],['第四世',18,'第四世祖公金弟'],['第五世',19,'第五世公'],['第六世',21,'第六世祖公興璋'],['第七世',22,'第七世祖公邦泰'],
 ['第八世',23,'第八世祖公'],['第九世',23,'第九世祖公'],['第十世',24,'第十世祖公'],['第十一世',26,'第十一世祖公'],['第十二世',26,'第十二世祖公'],['第十三世',27,'第十三世祖公'],['第十四世',29,'第十四世祖公'],['第十五世',30,'第十五世祖公'],['第十六世',37,'第十六世祖公文秀'],['第十七世',40,'第十七世祖公'],['第十八世',43],['第十九世',50,'第十九世　爲添'],
 ['祖地尋親記',76,'祖地尋親記'],['台灣開基後系統圖',83],['琢英產業股份有限公司之由來與將來之指南',85],['圓山墓園重建情形',99],['橫山墓園新建情形',100],['第十七世公窓容',101,'第十七世公窓容'],['第十八世公尙鄉',102,'第十八世公尙鄉'],['第十九世公萬恩',104,'第十九世公萬恩'],['第十八世公尙魁',117,'第十八世公尙魁'],['新扶祖系列表',122],['窓註公系列表',125],['第十七世公窓註',126,'第十七世公窓註'],['爲添系列部份',140,'爲添系列部份'],['爲政系列部份',148,'爲政系列部份'],['爲勅系列部份',153,'爲勅系列部份'],['爲築系列部份',155,'爲築系列部份'],['爲捷系列部份',163,'爲捷系列部份'],['爲材系列部份',167,'爲材系列部份'],['第三房直系圖',169],['第十七世祖窓抱',170,'第十七世祖'],['結束辭',189,'結束辭'],['綜合感言',190,'綜合感言']];
const EN={cover:'Cover',s1:'Preface',s2:'Ancestral Temple'};
const HEADRE=/^(第[一二三四五六七八九十廿]{1,3}世|祖地尋親記|台灣開基後系統圖|琢英產業股份有限公司之由來|圓山墓園重建情形|橫山墓園新建情形|開基時期及開基祖公媽|祖先渡台略圖|來台定居後發展情形圖|陳氏家譜$|陳氏衍派字輩|序　章|感　言|「加添感想」|遷台前之故居|渡台情形及渡台後|祖地參考資料|台灣定居七十年|健康三字訣|結束辭|綜合感言|爲[添政勅築捷材]系列部份)/;
// English for pp.1–4
const ENX={1:FRONT_EN(0),2:FRONT_EN(1)};
function FRONT_EN(k){const d=document.createElement('div');d.innerHTML=window.FRONT;const ps=[...d.querySelectorAll('.bken p')];return k===0?'<h2 class="enh">Preface <small>序　章</small></h2>'+ps.slice(0,1).map(p=>p.outerHTML).join(''):ps.slice(1).map(p=>p.outerHTML).join('')}
const ENCAP={3:[['The Chen family ancestral temple'],['Location: Aizai (隘仔), Xiulu Village (秀蘆村), Luxi Township (蘆溪鄉), Pinghe County (平和縣)'],['Photo taken: February 20, 1988']],
 4:[['Comparing the genealogies (at the home of clansman Chen Dazhi (陳大枝), Xiulu Village)'],['Generations 1 through 7 match exactly'],['The clan comes in crowds to pay respects at the ancestral temple']]};

const vh=ml=>(ml*1.04+1.2).toFixed(2);
function pTxt(p,mark){return (p.paras||[]).map((par,pi)=>`<p>${par.map((l,li)=>{const s=l.trim();const ind=l.startsWith('　')?' ind':'';const m=mark&&pi===0&&li===0?`<span class="pm" aria-label="頁${p.lab}">〔頁${p.lab}〕</span>`:'';return `<span class="ln${HEADRE.test(s)?' hd':''}${ind}${m?' pmh':''}">${m}${fmt(l)}</span>`}).join('')}</p>`).join('')}
// consolidation: groups of consecutive text-only pages in the same section (precomputed at 1280px web, 15.5px)
const SECSTART=new Set(SEC.map(x=>x[1]));
const textOnly=p=>p&&p.n>4&&!p.todo&&!(p.imgs||[]).length&&!p.table&&!p.chartnote&&(p.paras||[]).length;
const BUILD=/[?&]build/.test(location.search);
let GROUPS=window.CONS||null;
let h=`<section class="sec bkcover" id="cover" data-n="0"><div class="rule"></div><h1 class="t">陳氏家譜</h1><p class="d">一九八八年八月八日重整</p><p class="en-sub en">Chen Family Genealogy · Reorganized August 8, 1988</p></section>`;
const GMAP={};if(GROUPS&&!BUILD)for(const g of GROUPS)if(g.length>1)g.forEach((n,i)=>GMAP[n]=i?null:g);
for(const p of PG){if(p.n===0)continue;
 if(GMAP[p.n]===null)continue;
 if(GMAP[p.n]){h+=mergedSheet(GMAP[p.n].map(n=>PG.find(q=>q.n===n)));continue}
 let body='';
 if(p.todo){body=`<div class="todo">（待補）</div>`}
 else{
  const txt=pTxt(p,false);
  const _unused=(p.paras||[]).map(par=>`<p>${par.map(l=>{const s=l.trim();const ind=l.startsWith('　')?' ind':'';return `<span class="ln${HEADRE.test(s)?' hd':''}${ind}">${fmt(l.replace(/^　+/,m=>m))}</span>`}).join('')}</p>`).join('');
  const tb=p.table?`<div class="tbw"><table><thead><tr>${(p.table.hdr||[]).map(c=>`<th>${fmt(c)}</th>`).join('')}</tr></thead><tbody>${p.table.rows.map(r=>`<tr>${r.map(c=>`<td>${fmt(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'';
  const figs=(p.imgs||[]).map(s=>`<figure class="bf"><img src="${s}" alt=""></figure>`).join('');
  const en=ENCAP[p.n];
  const caps=(p.caps||[]).map((c,i)=>`<p class="cap">${en&&en[i]?L(fmt(c),en[i][0]):fmt(c)}</p>`).join('');
  const RC0=(window.CHARTS||{})[p.n];const RC=RC0&&(RC0.svg||RC0);const chart=RC?'':p.chartnote?`<p class="cnote">${L('（系統圖照原頁影像）','(chart shown as page image)')}</p>`:'';
  const ml=Math.max(4,...(p.paras||[]).flat().map(l=>l.replace(/⟦\?⟧/g,'').length));const vt=txt?`<div class="vt${ENX[p.n]?' zh':''}" style="height:calc(var(--f) * ${vh(ml)})">${txt}</div>`+(ENX[p.n]?`<div class="en bken">${ENX[p.n]}</div>`:''):'';
  if(p.n===4)body=`<p class="cap hdc">${L('對照家譜（於秀蘆村族親陳大枝宅）','Comparing the Genealogies (at the home of clansman Chen Dazhi (陳大枝), Xiulu Village)')}</p>`;
  body+=(p.n===3||p.n===4)?(p.n===3?`<p class="cap hdc">${L('陳氏家廟','The Chen Family Ancestral Temple')}</p>`:'')+`<figure class="bf"><img src="${p.imgs[0]}" alt=""></figure>`+(p.n===3?`<p class="cap">${L(fmt(p.caps[1]),ENCAP[3][1][0])}</p><p class="cap">${L(fmt(p.caps[2]),ENCAP[3][2][0])}</p>`:`<p class="cap">${L(fmt(p.caps[1]),ENCAP[4][1][0])}</p><p class="cap">${L(fmt(p.caps[2]),ENCAP[4][2][0])}</p>`)+`<figure class="bf"><img src="${p.imgs[1]}" alt=""></figure>`
   :RC?`<div class="bcw">${RC}</div>`+(RC0.after||''):vt+tb+figs+caps+chart;
 }
 h+=`<section class="sec bp k-${p.kind}${p.todo?' todo-p':''}" id="pg-${p.n}" data-n="${p.n}"><div class="sheet">${body}<span class="folio">${p.lab}</span></div></section>`;
}
function mergedSheet(ps){const ml=Math.max(4,...ps.flatMap(p=>p.paras.flat()).map(l=>l.replace(/⟦\?⟧/g,'').length));
 const txt=ps.map((p,i)=>`<div class="pg"${i?` id="pg-${p.n}"`:''} data-n="${p.n}">${pTxt(p,true)}</div>`).join('');
 return `<section class="sec bp k-text cons" id="pg-${ps[0].n}" data-n="${ps[0].n}" data-pages="${ps.map(p=>p.n).join(',')}"><div class="sheet"><div class="vt" style="height:calc(var(--f) * ${vh(ml)})">${txt}</div><span class="folio">${ps[0].lab}–${ps[ps.length-1].lab}</span></div></section>`}
C.innerHTML=h;
const fixH=root=>{if(innerWidth<=900)return;root.querySelectorAll('.bp .vt').forEach(v=>{const d=v.scrollHeight-v.clientHeight;if(d>0)v.style.height=(parseFloat(getComputedStyle(v).height)+d+2)+'px'})};fixH(C);
if(BUILD){ // greedy grouping measured in the live layout
 const fits=ps=>{const t=document.createElement('div');t.innerHTML=mergedSheet(ps);const sec=t.firstElementChild;C.appendChild(sec);fixH(sec);const v=sec.querySelector('.vt');const ok=v.scrollWidth<=v.clientWidth+1;sec.remove();return ok};
 const G=[];let cur=null;
 for(const p of PG){if(p.n===0)continue;
  if(cur&&textOnly(p)&&!SECSTART.has(p.n)&&textOnly(PG.find(q=>q.n===cur[cur.length-1]))&&fits([...cur,p.n].map(n=>PG.find(q=>q.n===n))))cur.push(p.n);
  else{cur=[p.n];G.push(cur)}}
 window.__GROUPS=G;}
// anchors
const items=SEC.map(([l,n,m],i)=>{let id=n===0?'cover':'pg-'+n;if(m&&n){const sec=document.getElementById('pg-'+n);const ln=[...sec.querySelectorAll('.ln')].find(x=>x.textContent.trim().startsWith(m));if(ln){ln.id='s'+i;id='s'+i}}return {l,n,id,i}});
const lbl=it=>it.i===0?L('封面','Cover'):it.i===1?L('序章','Preface'):it.i===2?L('陳氏家廟','Temple'):it.l;
nav.innerHTML=items.map(it=>`<a href="#${it.id}" data-i="${it.i}" title="${it.l}"><span class="lbl">${lbl(it)}</span></a>`).join('');
const MT=[0,1,"*",26],mtop=document.getElementById('mtop'),mdrop=document.getElementById('mdrop');
mtop.innerHTML=MT.map(k=>k==='*'?`<button class="mt" id="mtgen" aria-expanded="false">世系<i class="car"></i></button>`:`<a class="mt" href="#${items[k].id}" data-i="${k}">${lbl(items[k])}</a>`).join('');
mdrop.innerHTML=items.filter(it=>!MT.includes(it.i)).map(it=>`<a href="#${it.id}" data-i="${it.i}">${it.l}</a>`).join('');
const mtg=document.getElementById('mtgen');const setDrop=o=>{mdrop.hidden=!o;mtg.setAttribute('aria-expanded',o);mtg.classList.toggle('open',o)};
mtg.onclick=e=>{e.stopPropagation();setDrop(mdrop.hidden)};document.addEventListener('click',e=>{if(!mdrop.hidden&&!e.target.closest('#mbar'))setDrop(false)});
mdrop.addEventListener('click',e=>{if(e.target.closest('a'))setDrop(false)});
function spy(){const off=(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hh'))||60)+60;let cur=0;for(const it of items){const el=document.getElementById(it.id);if(el&&el.getBoundingClientRect().top<=off)cur=it.i}
 [nav,mtop,mdrop].forEach(c=>c.querySelectorAll('a').forEach(a=>a.classList.toggle('on',+a.dataset.i===cur)));mtg.classList.toggle('on',!MT.includes(cur));
 const on=nav.querySelector('a.on');if(on&&getComputedStyle(nav).display!=='none'){const r=on.getBoundingClientRect(),n=nav.getBoundingClientRect();if(r.top<n.top||r.bottom>n.bottom)on.scrollIntoView({block:'nearest'})}}
window.spy=spy;let tk=0;addEventListener('scroll',()=>{if(!tk){tk=1;requestAnimationFrame(()=>{tk=0;spy()})}},{passive:true});
function hh(){document.documentElement.style.setProperty('--hh',Math.round(document.querySelector('.site-header').getBoundingClientRect().height)+'px')}
addEventListener('resize',()=>{hh();spy()});hh();
addEventListener('hashchange',()=>{const el=document.getElementById(location.hash.slice(1));if(el)el.scrollIntoView();spy()});
(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{fixH(C);hh();if(location.hash){const el=document.getElementById(location.hash.slice(1));if(el)el.scrollIntoView()}spy()});
requestAnimationFrame(()=>document.body.classList.add('open'));spy();
})();
