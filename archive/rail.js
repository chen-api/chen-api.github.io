/* Section rail modelled on the x.ai article navigator.
   Chinese titles from the existing menu; English from window.NAV_EN. */
(function(){
  const nav=document.getElementById('nav');
  if(!nav)return;
  const EASE='cubic-bezier(0.16, 1, 0.3, 1)';
  const GAP=3;
  const IDLE_MS=900;
  const LEAVE_MS=200;
  const REDUCE=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  const lang=()=>document.documentElement.dataset.lang==='en'?'en':'zh';
  const NE=()=>window.NAV_EN||{};

  function collect(){
    const en=NE();
    const out=[];
    if(document.getElementById('cover')) out.push({i:0,id:'cover',zh:'封面',en:en[0]||'Cover'});
    nav.querySelectorAll('a[data-i]').forEach(a=>{
      const i=+a.dataset.i;
      const id=(a.getAttribute('href')||'').replace(/^#/,'');
      if(!id||!document.getElementById(id))return;
      if(out.some(x=>x.id===id&&x.i===i))return;
      let zh=(a.getAttribute('title')||'').trim();
      if(!zh){
        const z=a.querySelector('.zh');
        zh=(z?z.textContent:a.textContent).replace(/\s+/g,' ').trim();
      }
      out.push({i,id,zh,en:en[i]||zh});
    });
    return out;
  }

  const items=collect();
  if(items.length<2)return;

  const root=document.createElement('nav');
  root.className='doc-rail';
  root.setAttribute('aria-label', lang()==='en'?'Section guide':'章節導覽');
  root.innerHTML='<div class="dr-veil" aria-hidden="true"></div>'
    +'<div class="dr-zone"></div>'
    +'<div class="dr-labels"></div>'
    +'<div class="dr-hit"><div class="dr-bar"></div></div>';
  const zone=root.querySelector('.dr-zone');
  const labelsBox=root.querySelector('.dr-labels');
  const hit=root.querySelector('.dr-hit');
  const bar=root.querySelector('.dr-bar');

  const ticks=items.map(it=>{
    const seg=document.createElement('div');
    seg.className='dr-seg';
    seg.setAttribute('aria-hidden','true');
    const fill=document.createElement('div');
    fill.className='dr-fill';
    fill.setAttribute('aria-hidden','true');
    bar.appendChild(seg);
    bar.appendChild(fill);
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='dr-lbl';
    btn.dataset.i=String(it.i);
    btn.dataset.id=it.id;
    btn.tabIndex=-1;
    btn.innerHTML='<span class="zh">'+esc(it.zh)+'</span><span class="en">'+esc(it.en)+'</span>';
    btn.setAttribute('aria-label', lang()==='en'?it.en:it.zh);
    btn.title=lang()==='en'?it.en:it.zh;
    labelsBox.appendChild(btn);
    return {it,seg,fill,el:btn,top:0,height:1,offset:0,size:0};
  });
  document.body.appendChild(root);

  function relabel(){
    const L=lang();
    root.setAttribute('aria-label', L==='en'?'Section guide':'章節導覽');
    ticks.forEach(t=>{
      const name=L==='en'?t.it.en:t.it.zh;
      t.el.setAttribute('aria-label',name);
      t.el.title=name;
    });
  }

  let railH=0, scrolling=false, hovering=false, dragging=false, dragMoved=false, dragStartY=0, jumping=false;
  let scrollTimer=null, leaveTimer=null, lastScrollY=window.scrollY, lastPtr=null;

  function setFlags(){
    const on=scrolling||hovering||dragging||jumping;
    const hot=hovering||dragging;
    root.classList.toggle('is-on', on);
    root.classList.toggle('is-hot', hot);
    if(!hot) clearLabels();
  }

  function clearLabels(){
    ticks.forEach(t=>{
      t.el.style.opacity='0';
      t.el.style.transform='translate(4px,-50%)';
      t.el.style.pointerEvents='none';
      t.el.classList.remove('is-near');
    });
  }

  function nearestIndex(clientY){
    const r=bar.getBoundingClientRect();
    let best=0, bestD=Infinity;
    ticks.forEach((t,i)=>{
      const a=r.top+(t.segY||0), b=a+(t.segH||0), mid=(a+b)/2;
      const d=clientY<a?a-clientY:clientY>b?clientY-b:0;
      const midD=Math.abs(clientY-mid);
      if(d<bestD || (d===bestD && midD<Math.abs(clientY-(r.top+(ticks[best].segY||0)+(ticks[best].segH||0)/2)))){
        bestD=d; best=i;
      }
    });
    return best;
  }

  function paintLabels(clientY, pointerType){
    if(!hovering && !dragging){clearLabels();return}
    if(clientY==null)return;
    const touch=pointerType==='touch' || pointerType==='pen' || innerWidth<=900;
    const n=nearestIndex(clientY);
    const minGap=22;
    const lo=touch?n:Math.max(0,n-3);
    const hi=touch?n:Math.min(ticks.length-1,n+3);
    const vis=[];
    for(let i=lo;i<=hi;i++){
      const d=Math.abs(i-n);
      const a=touch||d===0?1:d===1?0.7:d===2?0.4:0.2;
      vis.push({i,a,y:(ticks[i].segY||0)+(ticks[i].segH||0)/2});
    }
    const mid=vis.find(v=>v.i===n);
    mid.y=Math.max(12, Math.min((railH||bar.clientHeight)-12, mid.y));
    let y=mid.y;
    vis.filter(v=>v.i<n).sort((a,b)=>b.i-a.i).forEach(v=>{
      y=Math.min(v.y, y-minGap);
      v.y=y;
    });
    y=mid.y;
    vis.filter(v=>v.i>n).sort((a,b)=>a.i-b.i).forEach(v=>{
      y=Math.max(v.y, y+minGap);
      v.y=y;
    });
    const minY=Math.min(...vis.map(v=>v.y)), maxY=Math.max(...vis.map(v=>v.y));
    const loB=12, hiB=(railH||bar.clientHeight)-12;
    let shift=0;
    if(minY<loB) shift=loB-minY;
    if(maxY+shift>hiB) shift=hiB-maxY;
    vis.forEach(v=>v.y+=shift);
    const shown=new Set(vis.map(v=>v.i));
    ticks.forEach((t,i)=>{
      const v=vis.find(x=>x.i===i);
      if(!v){
        t.el.style.opacity='0';
        t.el.style.transform='translate(4px,-50%)';
        t.el.style.pointerEvents='none';
        t.el.classList.remove('is-near');
        return;
      }
      t.el.style.top=v.y+'px';
      t.el.style.opacity=String(v.a);
      t.el.style.transform='translate(0,-50%)';
      t.el.style.pointerEvents=v.a>0.5?'auto':'none';
      t.el.classList.toggle('is-near', i===n);
    });
  }

  function onPtr(e){
    if(!e.isPrimary && e.type!=='pointerenter')return;
    lastPtr={y:e.clientY,type:e.pointerType};
    paintLabels(e.clientY, e.pointerType);
  }

  function readingOffset(){
    const cs=getComputedStyle(document.documentElement);
    const stick=parseFloat(cs.getPropertyValue('--stick'))||0;
    const hh=parseFloat(cs.getPropertyValue('--hh'))||60;
    return Math.max(stick, hh+8, 64);
  }

  function measure(){
    const list=items.map(it=>{
      const el=document.getElementById(it.id);
      if(!el)return null;
      return {it,top:el.getBoundingClientRect().top+window.scrollY};
    }).filter(Boolean);
    if(!list.length)return;
    const end=Math.max(document.documentElement.scrollHeight, list[list.length-1].top+1);
    const first=list[0].top;
    const span=Math.max(1,end-first);
    railH=bar.clientHeight||root.clientHeight;
    list.forEach((row,i)=>{
      const next=i+1<list.length?list[i+1].top:end;
      const t=ticks.find(x=>x.it.i===row.it.i&&x.it.id===row.it.id);
      if(!t)return;
      t.top=row.top;
      t.height=Math.max(1,next-row.top);
      t.offset=(row.top-first)/span;
      t.size=t.height/span;
    });
    // Pixel layout: every section is a rounded pill with a 3px gap, length
    // proportional to the section, with a 2px minimum so short ones stay visible.
    if(railH>0){
      const n=ticks.length, minH=2;
      const reserved=(n-1)*GAP + n*minH;
      const leftover=Math.max(0, railH-reserved);
      const weight=ticks.reduce((s,t)=>s+t.size,0)||1;
      let y=0;
      ticks.forEach(t=>{
        const h=minH + leftover*(t.size/weight);
        t.segY=y; t.segH=h;
        t.seg.style.top=y+'px';
        t.seg.style.height=h+'px';
        t.fill.style.top=y+'px';
        y+=h+GAP;
      });
      ticks.forEach(t=>{t.el.style.top=(t.segY+t.segH/2)+'px'});
    }
    spy();
    if(lastPtr) paintLabels(lastPtr.y, lastPtr.type);
  }

  let cur=-1, progress=0;
  function spy(){
    if(!ticks.length)return;
    const off=readingOffset();
    const y=window.scrollY+off;
    let idx=0;
    for(let i=0;i<ticks.length;i++) if(y>=ticks[i].top-1) idx=i;
    const max=document.documentElement.scrollHeight-window.innerHeight;
    if(window.scrollY>=max-2) idx=ticks.length-1;
    const first=ticks[0].top;
    const last=ticks[ticks.length-1];
    const span=Math.max(1,(last.top+last.height)-first);
    const p=Math.max(0,Math.min(1,(y-first)/span));
    progress=p;
    if(idx!==cur){
      cur=idx;
      ticks.forEach((t,i)=>{
        const read=i<=idx;
        t.el.classList.toggle('is-read',read);
        if(i===idx) t.el.setAttribute('aria-current','true');
        else t.el.removeAttribute('aria-current');
      });
    }
    ticks.forEach((t,i)=>{
      let r=0;
      if(p>=t.offset+t.size) r=1;
      else if(p>t.offset) r=(p-t.offset)/t.size;
      const h=(t.segH||0)*r;
      t.fill.style.height=(h>0?h:0)+'px';
      t.fill.style.opacity=r>0?'1':'0';
    });
  }

  function scrollToId(id){
    jumping=true;setFlags();
    if(typeof window.designerJump==='function') window.designerJump(id,!REDUCE);
    else{
      const el=document.getElementById(id);
      if(!el)return;
      const y=el.getBoundingClientRect().top+window.scrollY-readingOffset();
      window.scrollTo({top:Math.max(0,y),behavior:REDUCE?'auto':'smooth'});
    }
    setTimeout(()=>{jumping=false;setFlags()},REDUCE?200:800);
  }

  function yToScroll(clientY){
    const r=hit.getBoundingClientRect();
    const ratio=Math.max(0,Math.min(1,(clientY-r.top)/Math.max(1,r.height)));
    const first=ticks[0].top;
    const last=ticks[ticks.length-1];
    const span=Math.max(1,(last.top+last.height)-first);
    return Math.max(0, first+ratio*span-readingOffset());
  }

  function onScroll(){
    const y=window.scrollY;
    if(y!==lastScrollY){
      lastScrollY=y;
      scrolling=true;
      setFlags();
      if(scrollTimer) clearTimeout(scrollTimer);
      scrollTimer=setTimeout(()=>{scrolling=false;setFlags()},IDLE_MS);
    }
    spy();
  }

  addEventListener('scroll',()=>{requestAnimationFrame(onScroll)},{passive:true});

  function enter(e){
    if(leaveTimer){clearTimeout(leaveTimer);leaveTimer=null}
    hovering=true;setFlags();
    if(e) onPtr(e);
  }
  function leave(){
    if(dragging)return;
    if(leaveTimer) clearTimeout(leaveTimer);
    leaveTimer=setTimeout(()=>{hovering=false;lastPtr=null;leaveTimer=null;setFlags()},LEAVE_MS);
  }
  zone.addEventListener('pointerenter',enter);
  zone.addEventListener('pointerleave',leave);
  zone.addEventListener('pointermove',onPtr);
  hit.addEventListener('pointerenter',enter);
  hit.addEventListener('pointerleave',leave);
  hit.addEventListener('pointermove',onPtr);
  labelsBox.addEventListener('pointerenter',enter);
  labelsBox.addEventListener('pointerleave',leave);
  labelsBox.addEventListener('pointermove',onPtr);

  hit.addEventListener('pointerdown',e=>{
    if(!e.isPrimary)return;
    e.preventDefault();
    hit.setPointerCapture(e.pointerId);
    dragging=true;dragMoved=false;dragStartY=e.clientY;
    setFlags();
    onPtr(e);
  });
  hit.addEventListener('pointermove',e=>{
    if(!e.isPrimary)return;
    if(dragging){
      if(!dragMoved && Math.abs(e.clientY-dragStartY)>4) dragMoved=true;
      if(dragMoved) window.scrollTo({top:yToScroll(e.clientY),behavior:'auto'});
    }
    if(dragging||hovering) onPtr(e);
  });
  function endDrag(e){
    if(!dragging)return;
    dragging=false;
    try{if(hit.hasPointerCapture(e.pointerId)) hit.releasePointerCapture(e.pointerId)}catch(_){}
    if(!dragMoved){
      const y=yToScroll(e.clientY);
      // Snap to the section under the pointer.
      let t=ticks[0];
      const abs=y+readingOffset();
      ticks.forEach(x=>{if(abs>=x.top) t=x});
      scrollToId(t.it.id);
    }
    dragMoved=false;
    const stay=e.type!=='pointercancel' && matchMedia('(hover:hover) and (pointer:fine)').matches
      && e.clientX>=root.getBoundingClientRect().left;
    hovering=!!stay;
    setFlags();
    if(!stay) leave();
  }
  hit.addEventListener('pointerup',endDrag);
  hit.addEventListener('pointercancel',endDrag);

  ticks.forEach(t=>{
    t.el.addEventListener('click',e=>{
      e.preventDefault();
      scrollToId(t.it.id);
    });
  });

  const mo=new MutationObserver(relabel);
  mo.observe(document.documentElement,{attributes:true,attributeFilter:['data-lang']});
  addEventListener('resize',()=>{measure();relabel()});
  const ro=new ResizeObserver(()=>measure());
  ro.observe(document.documentElement);
  const main=document.getElementById('content');
  if(main) ro.observe(main);
  (document.fonts?document.fonts.ready:Promise.resolve()).then(()=>measure());
  requestAnimationFrame(()=>{measure();spy()});
  setTimeout(measure,400);
})();
