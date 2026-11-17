/* Document section rail. Labels come from the existing menu:
   Chinese from each nav item's title (第八世, 序章, …);
   English from window.NAV_EN, the English menu's own titles. */
(function(){
  const nav=document.getElementById('nav');
  if(!nav)return;
  const EASE='cubic-bezier(0.16, 1, 0.3, 1)';
  const MIN_GAP=8;
  const PROX=70;
  const LABEL_MIN=18;
  const REDUCE=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  const lang=()=>document.documentElement.dataset.lang==='en'?'en':'zh';
  const NE=()=>window.NAV_EN||{};

  function collect(){
    const en=NE();
    const out=[];
    const cover=document.getElementById('cover');
    if(cover) out.push({i:0,id:'cover',zh:'封面',en:en[0]||'Cover'});
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
  root.innerHTML='<div class="dr-veil" aria-hidden="true"></div><div class="dr-hit"></div><div class="dr-line" aria-hidden="true"><div class="dr-progress"></div></div>';
  const hit=root.querySelector('.dr-hit');
  const line=root.querySelector('.dr-line');
  const progress=root.querySelector('.dr-progress');

  const ticks=items.map(it=>{
    const b=document.createElement('button');
    b.type='button';
    b.className='dr-tick';
    b.dataset.i=String(it.i);
    b.dataset.id=it.id;
    b.tabIndex=-1;
    b.innerHTML='<span class="dr-mark" aria-hidden="true"></span><span class="dr-lbl"><span class="zh">'+esc(it.zh)+'</span><span class="en">'+esc(it.en)+'</span></span>';
    b.setAttribute('aria-label', lang()==='en'?it.en:it.zh);
    b.title=lang()==='en'?it.en:it.zh;
    hit.appendChild(b);
    return {it,el:b,lbl:b.querySelector('.dr-lbl'),y:0,top:0,height:1,offset:0};
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

  let railH=0, dragging=false, dragMoved=false, dragStartY=0, hot=false, focusOn=null;
  let lastY=null, lastX=null;

  function measure(){
    const list=items.map(it=>{
      const el=document.getElementById(it.id);
      if(!el)return null;
      const top=el.getBoundingClientRect().top+window.scrollY;
      return {it,el,top};
    }).filter(Boolean);
    if(!list.length)return;
    const end=Math.max(document.documentElement.scrollHeight, list[list.length-1].top+1);
    railH=hit.clientHeight||root.clientHeight;
    if(railH<1)return;
    const first=list[0].top;
    const span=Math.max(1, end-first);
    list.forEach((row,i)=>{
      const next=i+1<list.length?list[i+1].top:end;
      const t=ticks.find(x=>x.it.i===row.it.i&&x.it.id===row.it.id);
      if(!t)return;
      t.top=row.top;
      t.height=Math.max(1,next-row.top);
      t.offset=(row.top-first)/span;
    });
    // Place ticks by document position, then separate any that collide.
    const maxY=railH-4;
    const ys=ticks.map(t=>4+t.offset*Math.max(1,maxY-4));
    for(let i=1;i<ys.length;i++) if(ys[i]<ys[i-1]+MIN_GAP) ys[i]=ys[i-1]+MIN_GAP;
    if(ys[ys.length-1]>maxY){
      const s=(maxY-ys[0])/Math.max(1,ys[ys.length-1]-ys[0]);
      for(let i=0;i<ys.length;i++) ys[i]=ys[0]+(ys[i]-ys[0])*s;
    }
    ticks.forEach((t,i)=>{
      t.y=ys[i];
      t.el.style.top=t.y+'px';
    });
    spy();
  }

  function readingOffset(){
    const cs=getComputedStyle(document.documentElement);
    const stick=parseFloat(cs.getPropertyValue('--stick'))||0;
    const hh=parseFloat(cs.getPropertyValue('--hh'))||60;
    return Math.max(stick, hh+8, 64);
  }

  function scrollToId(id){
    if(typeof window.designerJump==='function'){
      window.designerJump(id, !REDUCE);
      return;
    }
    const el=document.getElementById(id);
    if(!el)return;
    const y=el.getBoundingClientRect().top+window.scrollY-readingOffset();
    window.scrollTo({top:Math.max(0,y),behavior:REDUCE?'auto':'smooth'});
  }

  function yToScroll(clientY){
    const r=hit.getBoundingClientRect();
    const ratio=Math.max(0,Math.min(1,(clientY-r.top)/Math.max(1,r.height)));
    if(!ticks.length)return 0;
    const first=ticks[0].top;
    const last=ticks[ticks.length-1];
    const span=Math.max(1,(last.top+last.height)-first);
    return Math.max(0, first+ratio*span-readingOffset());
  }

  let cur=-1;
  function spy(){
    const off=readingOffset();
    const y=window.scrollY+off;
    let idx=0;
    for(let i=0;i<ticks.length;i++) if(y>=ticks[i].top-1) idx=i;
    const max=document.documentElement.scrollHeight-window.innerHeight;
    if(window.scrollY>=max-2) idx=ticks.length-1;
    if(idx!==cur){
      cur=idx;
      ticks.forEach((t,i)=>{
        const on=i===idx;
        t.el.classList.toggle('is-current',on);
        if(on) t.el.setAttribute('aria-current','true');
        else t.el.removeAttribute('aria-current');
      });
    }
    const first=ticks[0].top;
    const last=ticks[ticks.length-1];
    const span=Math.max(1,(last.top+last.height)-first);
    const p=Math.max(0,Math.min(1,(y-first)/span));
    progress.style.height=(p*100).toFixed(3)+'%';
  }

  function setHot(on){
    hot=on;
    root.classList.toggle('is-hot', on||dragging||!!focusOn);
    if(!on&&!dragging&&!focusOn) clearLabels();
  }

  function clearLabels(){
    ticks.forEach(t=>{
      t.lbl.style.opacity='0';
      t.lbl.style.transform='translate(6px,-50%)';
    });
  }

  function paintLabels(clientY){
    // Dock-like falloff from the pointer; drop overlapping weaker labels.
    const raw=ticks.map((t,i)=>{
      const cy=t.el.getBoundingClientRect().top+t.el.getBoundingClientRect().height/2;
      const d=Math.abs(clientY-cy);
      let a=Math.max(0,1-d/PROX);
      a=a*a;
      if(focusOn===t) a=Math.max(a,1);
      return {t,i,a,y:t.y};
    });
    raw.sort((a,b)=>b.a-a.a);
    const kept=[];
    raw.forEach(row=>{
      if(row.a<0.22){row.a=0;return}
      if(kept.some(k=>Math.abs(k.y-row.y)<LABEL_MIN && k.a>=row.a)){row.a=0;return}
      kept.push(row);
    });
    raw.forEach(row=>{
      const vis=row.a>=0.5;
      row.t.lbl.style.opacity=vis?'1':'0';
      row.t.lbl.style.transform=vis?'translate(0,-50%)':'translate(6px,-50%)';
    });
  }

  function pointerInRail(e){
    const r=root.getBoundingClientRect();
    return e.clientX>=r.left && e.clientX<=r.right+8 && e.clientY>=r.top-8 && e.clientY<=r.bottom+8;
  }

  hit.addEventListener('pointerdown',e=>{
    if(!e.isPrimary)return;
    e.preventDefault();
    hit.setPointerCapture(e.pointerId);
    dragging=true;dragMoved=false;dragStartY=e.clientY;
    root.classList.add('is-drag');
    setHot(true);
    lastY=e.clientY;lastX=e.clientX;
    paintLabels(e.clientY);
  });
  hit.addEventListener('pointermove',e=>{
    if(!e.isPrimary)return;
    lastY=e.clientY;lastX=e.clientX;
    if(dragging){
      if(!dragMoved && Math.abs(e.clientY-dragStartY)>4){
        dragMoved=true;
      }
      if(dragMoved){
        window.scrollTo({top:yToScroll(e.clientY),behavior:'auto'});
      }
      paintLabels(e.clientY);
      return;
    }
  });
  function endDrag(e){
    if(!dragging)return;
    dragging=false;
    root.classList.remove('is-drag');
    try{if(hit.hasPointerCapture(e.pointerId)) hit.releasePointerCapture(e.pointerId)}catch(_){}
    if(!dragMoved){
      // Tap: jump to the nearest tick (or the button that received the press).
      const btn=e.target.closest('.dr-tick');
      const t=btn?ticks.find(x=>x.el===btn):nearest(e.clientY);
      if(t) scrollToId(t.it.id);
    }
    dragMoved=false;
    const stay=e.type!=='pointercancel' && pointerInRail(e) && matchMedia('(hover:hover) and (pointer:fine)').matches;
    setHot(stay);
    if(stay) paintLabels(e.clientY);
    else clearLabels();
  }
  hit.addEventListener('pointerup',endDrag);
  hit.addEventListener('pointercancel',endDrag);

  hit.addEventListener('pointerenter',e=>{
    lastY=e.clientY;lastX=e.clientX;
    setHot(true);
    paintLabels(e.clientY);
  });
  hit.addEventListener('pointerleave',e=>{
    if(dragging)return;
    setHot(false);
  });

  // Track pointer along the wider label area (root is pointer-events:none except hit).
  // The hit strip is enough; labels sit to the left and are not themselves targets.

  ticks.forEach(t=>{
    t.el.addEventListener('focus',()=>{
      focusOn=t;
      setHot(true);
      paintLabels(t.el.getBoundingClientRect().top+9);
    });
    t.el.addEventListener('blur',()=>{
      if(focusOn===t) focusOn=null;
      if(!hot&&!dragging){setHot(false);clearLabels()}
    });
  });

  function nearest(clientY){
    let best=ticks[0], bd=Infinity;
    ticks.forEach(t=>{
      const cy=t.el.getBoundingClientRect().top+t.el.getBoundingClientRect().height/2;
      const d=Math.abs(clientY-cy);
      if(d<bd){bd=d;best=t}
    });
    return best;
  }

  document.addEventListener('click',e=>{
    // language toggle already sets data-lang and fires resize; update names too
    if(e.target.closest('#langtg')) setTimeout(relabel,0);
  },true);

  const mo=new MutationObserver(relabel);
  mo.observe(document.documentElement,{attributes:true,attributeFilter:['data-lang']});

  let tk=0;
  addEventListener('scroll',()=>{
    if(tk)return;
    tk=1;
    requestAnimationFrame(()=>{tk=0;spy();if((hot||dragging)&&lastY!=null)paintLabels(lastY)});
  },{passive:true});

  addEventListener('resize',()=>{measure();relabel()});
  const ro=new ResizeObserver(()=>measure());
  ro.observe(document.documentElement);
  const main=document.getElementById('content');
  if(main) ro.observe(main);

  (document.fonts?document.fonts.ready:Promise.resolve()).then(()=>measure());
  requestAnimationFrame(()=>{measure();spy()});
  setTimeout(measure,400);
})();
