/* Designer mockup: replace book-sheet pp.0–10 with continuous web sections. Header/nav untouched. */
(function(){const C=document.getElementById('content');
if(C.dataset.dz!=='1'){[...C.children].forEach(el=>{if(el.matches('section'))el.remove()});
C.insertAdjacentHTML('afterbegin',window.DESIGNER_HTML);}const NE=window.NAV_EN||{};document.querySelectorAll('#nav a[data-i],#mtop a[data-i],#mdrop a[data-i]').forEach(a=>{const i=a.dataset.i,en=NE[i];if(!en)return;const l=a.querySelector('.lbl')||a;if(l.querySelector('.zh'))return;const z=l.textContent;l.innerHTML='<span class="zh">'+z+'</span><span class="en">'+en+'</span>'});})();
/* sticky offset: header + (mobile) mbar; used by CSS scroll-margin and JS jumps */
(function(){const r=document.documentElement;
function stick(){let b=0;document.querySelectorAll('.site-header,.mbar').forEach(e=>{const cs=getComputedStyle(e);if(cs.display!=='none'&&(cs.position==='sticky'||cs.position==='fixed'))b=Math.max(b,e.getBoundingClientRect().bottom)});const v=Math.round(b)+12;r.style.setProperty('--stick',v+'px');return v}
function jump(id,smooth){const el=document.getElementById(id);if(!el)return;const y=el.getBoundingClientRect().top+scrollY-stick();scrollTo({top:Math.max(0,y),behavior:smooth?'smooth':'instant'});settle(id)}
/* msfix 2026-10-21: lazy images above the target load during a long smooth scroll and push it down (landed up to ~3000px short).
   Once scrolling is idle, re-align the target under the sticky header until the layout is stable; any user scroll/key cancels. */
let stok=0;['wheel','touchstart','keydown','mousedown'].forEach(t=>addEventListener(t,()=>{stok++},{passive:true}));
function settle(id){const tok=++stok,t0=performance.now();let last=-1,ok=0;(function tick(){if(tok!==stok)return;const el=document.getElementById(id);if(!el)return;const y=scrollY;if(Math.abs(y-last)<1){const d=el.getBoundingClientRect().top-stick();const max=document.documentElement.scrollHeight-innerHeight;if(Math.abs(d)>2&&!(d>0&&y>=max-1)){ok=0;scrollTo({top:Math.max(0,y+d),behavior:'instant'})}else if(++ok>4)return}else ok=0;last=scrollY;if(performance.now()-t0<8000)setTimeout(tick,150)})()}
window.designerJump=jump;stick();addEventListener('resize',stick);
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.getAttribute('href').slice(1);if(document.getElementById(id)){e.preventDefault();history.replaceState(null,'','#'+id);jump(id,true)}},true);
addEventListener('hashchange',()=>setTimeout(()=>jump(location.hash.slice(1)),0));
(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>setTimeout(()=>{stick();if(location.hash)jump(location.hash.slice(1))},50));})();
const FLAGS='<svg class="lt-flag lt-roc" viewBox="0 0 240 160" preserveAspectRatio="xMinYMid slice"><rect width="240" height="160" fill="#fe0000"/><rect width="120" height="80" fill="#000095"/><polygon fill="#fff" points="60.00,10.00 64.04,24.93 75.00,14.02 71.03,28.97 85.98,25.00 75.07,35.96 90.00,40.00 75.07,44.04 85.98,55.00 71.03,51.03 75.00,65.98 64.04,55.07 60.00,70.00 55.96,55.07 45.00,65.98 48.97,51.03 34.02,55.00 44.93,44.04 30.00,40.00 44.93,35.96 34.02,25.00 48.97,28.97 45.00,14.02 55.96,24.93"/><circle cx="60" cy="40" r="17" fill="#000095"/><circle cx="60" cy="40" r="15" fill="#fff"/></svg><svg class="lt-flag lt-us" viewBox="0 0 190 100" preserveAspectRatio="xMinYMid slice"><rect width="190" height="100" fill="#b22234"/><rect y="7.692" width="190" height="7.692" fill="#fff"/><rect y="23.077" width="190" height="7.692" fill="#fff"/><rect y="38.462" width="190" height="7.692" fill="#fff"/><rect y="53.846" width="190" height="7.692" fill="#fff"/><rect y="69.231" width="190" height="7.692" fill="#fff"/><rect y="84.615" width="190" height="7.692" fill="#fff"/><rect width="76" height="53.85" fill="#3c3b6e"/><g fill="#fff"><polygon points="6.33,2.30 7.02,4.43 9.26,4.43 7.45,5.75 8.14,7.88 6.33,6.56 4.52,7.88 5.21,5.75 3.40,4.43 5.64,4.43"/><polygon points="18.99,2.30 19.68,4.43 21.92,4.43 20.11,5.75 20.80,7.88 18.99,6.56 17.18,7.88 17.87,5.75 16.06,4.43 18.30,4.43"/><polygon points="31.65,2.30 32.34,4.43 34.58,4.43 32.77,5.75 33.46,7.88 31.65,6.56 29.84,7.88 30.53,5.75 28.72,4.43 30.96,4.43"/><polygon points="44.31,2.30 45.00,4.43 47.24,4.43 45.43,5.75 46.12,7.88 44.31,6.56 42.50,7.88 43.19,5.75 41.38,4.43 43.62,4.43"/><polygon points="56.97,2.30 57.66,4.43 59.90,4.43 58.09,5.75 58.78,7.88 56.97,6.56 55.16,7.88 55.85,5.75 54.04,4.43 56.28,4.43"/><polygon points="69.63,2.30 70.32,4.43 72.56,4.43 70.75,5.75 71.44,7.88 69.63,6.56 67.82,7.88 68.51,5.75 66.70,4.43 68.94,4.43"/><polygon points="12.66,7.69 13.35,9.82 15.59,9.82 13.78,11.13 14.47,13.26 12.66,11.95 10.85,13.26 11.54,11.13 9.73,9.82 11.97,9.82"/><polygon points="25.32,7.69 26.01,9.82 28.25,9.82 26.44,11.13 27.13,13.26 25.32,11.95 23.51,13.26 24.20,11.13 22.39,9.82 24.63,9.82"/><polygon points="37.98,7.69 38.67,9.82 40.91,9.82 39.10,11.13 39.79,13.26 37.98,11.95 36.17,13.26 36.86,11.13 35.05,9.82 37.29,9.82"/><polygon points="50.64,7.69 51.33,9.82 53.57,9.82 51.76,11.13 52.45,13.26 50.64,11.95 48.83,13.26 49.52,11.13 47.71,9.82 49.95,9.82"/><polygon points="63.30,7.69 63.99,9.82 66.23,9.82 64.42,11.13 65.11,13.26 63.30,11.95 61.49,13.26 62.18,11.13 60.37,9.82 62.61,9.82"/><polygon points="6.33,13.08 7.02,15.20 9.26,15.20 7.45,16.52 8.14,18.65 6.33,17.34 4.52,18.65 5.21,16.52 3.40,15.20 5.64,15.20"/><polygon points="18.99,13.08 19.68,15.20 21.92,15.20 20.11,16.52 20.80,18.65 18.99,17.34 17.18,18.65 17.87,16.52 16.06,15.20 18.30,15.20"/><polygon points="31.65,13.08 32.34,15.20 34.58,15.20 32.77,16.52 33.46,18.65 31.65,17.34 29.84,18.65 30.53,16.52 28.72,15.20 30.96,15.20"/><polygon points="44.31,13.08 45.00,15.20 47.24,15.20 45.43,16.52 46.12,18.65 44.31,17.34 42.50,18.65 43.19,16.52 41.38,15.20 43.62,15.20"/><polygon points="56.97,13.08 57.66,15.20 59.90,15.20 58.09,16.52 58.78,18.65 56.97,17.34 55.16,18.65 55.85,16.52 54.04,15.20 56.28,15.20"/><polygon points="69.63,13.08 70.32,15.20 72.56,15.20 70.75,16.52 71.44,18.65 69.63,17.34 67.82,18.65 68.51,16.52 66.70,15.20 68.94,15.20"/><polygon points="12.66,18.46 13.35,20.59 15.59,20.59 13.78,21.90 14.47,24.03 12.66,22.72 10.85,24.03 11.54,21.90 9.73,20.59 11.97,20.59"/><polygon points="25.32,18.46 26.01,20.59 28.25,20.59 26.44,21.90 27.13,24.03 25.32,22.72 23.51,24.03 24.20,21.90 22.39,20.59 24.63,20.59"/><polygon points="37.98,18.46 38.67,20.59 40.91,20.59 39.10,21.90 39.79,24.03 37.98,22.72 36.17,24.03 36.86,21.90 35.05,20.59 37.29,20.59"/><polygon points="50.64,18.46 51.33,20.59 53.57,20.59 51.76,21.90 52.45,24.03 50.64,22.72 48.83,24.03 49.52,21.90 47.71,20.59 49.95,20.59"/><polygon points="63.30,18.46 63.99,20.59 66.23,20.59 64.42,21.90 65.11,24.03 63.30,22.72 61.49,24.03 62.18,21.90 60.37,20.59 62.61,20.59"/><polygon points="6.33,23.84 7.02,25.97 9.26,25.97 7.45,27.29 8.14,29.42 6.33,28.10 4.52,29.42 5.21,27.29 3.40,25.97 5.64,25.97"/><polygon points="18.99,23.84 19.68,25.97 21.92,25.97 20.11,27.29 20.80,29.42 18.99,28.10 17.18,29.42 17.87,27.29 16.06,25.97 18.30,25.97"/><polygon points="31.65,23.84 32.34,25.97 34.58,25.97 32.77,27.29 33.46,29.42 31.65,28.10 29.84,29.42 30.53,27.29 28.72,25.97 30.96,25.97"/><polygon points="44.31,23.84 45.00,25.97 47.24,25.97 45.43,27.29 46.12,29.42 44.31,28.10 42.50,29.42 43.19,27.29 41.38,25.97 43.62,25.97"/><polygon points="56.97,23.84 57.66,25.97 59.90,25.97 58.09,27.29 58.78,29.42 56.97,28.10 55.16,29.42 55.85,27.29 54.04,25.97 56.28,25.97"/><polygon points="69.63,23.84 70.32,25.97 72.56,25.97 70.75,27.29 71.44,29.42 69.63,28.10 67.82,29.42 68.51,27.29 66.70,25.97 68.94,25.97"/><polygon points="12.66,29.23 13.35,31.36 15.59,31.36 13.78,32.67 14.47,34.80 12.66,33.49 10.85,34.80 11.54,32.67 9.73,31.36 11.97,31.36"/><polygon points="25.32,29.23 26.01,31.36 28.25,31.36 26.44,32.67 27.13,34.80 25.32,33.49 23.51,34.80 24.20,32.67 22.39,31.36 24.63,31.36"/><polygon points="37.98,29.23 38.67,31.36 40.91,31.36 39.10,32.67 39.79,34.80 37.98,33.49 36.17,34.80 36.86,32.67 35.05,31.36 37.29,31.36"/><polygon points="50.64,29.23 51.33,31.36 53.57,31.36 51.76,32.67 52.45,34.80 50.64,33.49 48.83,34.80 49.52,32.67 47.71,31.36 49.95,31.36"/><polygon points="63.30,29.23 63.99,31.36 66.23,31.36 64.42,32.67 65.11,34.80 63.30,33.49 61.49,34.80 62.18,32.67 60.37,31.36 62.61,31.36"/><polygon points="6.33,34.62 7.02,36.74 9.26,36.74 7.45,38.06 8.14,40.19 6.33,38.88 4.52,40.19 5.21,38.06 3.40,36.74 5.64,36.74"/><polygon points="18.99,34.62 19.68,36.74 21.92,36.74 20.11,38.06 20.80,40.19 18.99,38.88 17.18,40.19 17.87,38.06 16.06,36.74 18.30,36.74"/><polygon points="31.65,34.62 32.34,36.74 34.58,36.74 32.77,38.06 33.46,40.19 31.65,38.88 29.84,40.19 30.53,38.06 28.72,36.74 30.96,36.74"/><polygon points="44.31,34.62 45.00,36.74 47.24,36.74 45.43,38.06 46.12,40.19 44.31,38.88 42.50,40.19 43.19,38.06 41.38,36.74 43.62,36.74"/><polygon points="56.97,34.62 57.66,36.74 59.90,36.74 58.09,38.06 58.78,40.19 56.97,38.88 55.16,40.19 55.85,38.06 54.04,36.74 56.28,36.74"/><polygon points="69.63,34.62 70.32,36.74 72.56,36.74 70.75,38.06 71.44,40.19 69.63,38.88 67.82,40.19 68.51,38.06 66.70,36.74 68.94,36.74"/><polygon points="12.66,40.00 13.35,42.13 15.59,42.13 13.78,43.44 14.47,45.57 12.66,44.26 10.85,45.57 11.54,43.44 9.73,42.13 11.97,42.13"/><polygon points="25.32,40.00 26.01,42.13 28.25,42.13 26.44,43.44 27.13,45.57 25.32,44.26 23.51,45.57 24.20,43.44 22.39,42.13 24.63,42.13"/><polygon points="37.98,40.00 38.67,42.13 40.91,42.13 39.10,43.44 39.79,45.57 37.98,44.26 36.17,45.57 36.86,43.44 35.05,42.13 37.29,42.13"/><polygon points="50.64,40.00 51.33,42.13 53.57,42.13 51.76,43.44 52.45,45.57 50.64,44.26 48.83,45.57 49.52,43.44 47.71,42.13 49.95,42.13"/><polygon points="63.30,40.00 63.99,42.13 66.23,42.13 64.42,43.44 65.11,45.57 63.30,44.26 61.49,45.57 62.18,43.44 60.37,42.13 62.61,42.13"/><polygon points="6.33,45.38 7.02,47.51 9.26,47.51 7.45,48.83 8.14,50.96 6.33,49.64 4.52,50.96 5.21,48.83 3.40,47.51 5.64,47.51"/><polygon points="18.99,45.38 19.68,47.51 21.92,47.51 20.11,48.83 20.80,50.96 18.99,49.64 17.18,50.96 17.87,48.83 16.06,47.51 18.30,47.51"/><polygon points="31.65,45.38 32.34,47.51 34.58,47.51 32.77,48.83 33.46,50.96 31.65,49.64 29.84,50.96 30.53,48.83 28.72,47.51 30.96,47.51"/><polygon points="44.31,45.38 45.00,47.51 47.24,47.51 45.43,48.83 46.12,50.96 44.31,49.64 42.50,50.96 43.19,48.83 41.38,47.51 43.62,47.51"/><polygon points="56.97,45.38 57.66,47.51 59.90,47.51 58.09,48.83 58.78,50.96 56.97,49.64 55.16,50.96 55.85,48.83 54.04,47.51 56.28,47.51"/><polygon points="69.63,45.38 70.32,47.51 72.56,47.51 70.75,48.83 71.44,50.96 69.63,49.64 67.82,50.96 68.51,48.83 66.70,47.51 68.94,47.51"/></g></svg>';
/* sliding pill language switch: insert track between labels (behavior unchanged: inline script toggles data-lang/aria-checked) */
(function(){const b=document.getElementById('langtg');if(!b||b.querySelector('.lt-track'))return;const t=document.createElement('span');t.className='lt-track';t.setAttribute('aria-hidden','true');t.innerHTML=FLAGS+'<span class="lt-knob"></span>';b.insertBefore(t,b.querySelector('.le'));b.setAttribute('aria-label','中文 / English');})();
/* nav v3: group spacing + 渡臺開基 divider before 第十四世 (no label changes) */
(function(){const n=document.getElementById('nav');if(!n)return;const a=[...n.querySelectorAll('a')];const t=x=>x.textContent.trim();
const starts=['第一世','祖地尋親記','圓山墓園重建情形','爲添系列部份'];a.forEach(x=>{if(starts.some(s=>t(x).startsWith(s)&&t(x).length<=s.length+1))x.classList.add('grp')});
const g14=a.find(x=>t(x)==='第十四世');if(g14&&!n.querySelector('.ndv')){const d=document.createElement('div');d.className='ndv';d.setAttribute('aria-hidden','true');d.textContent='渡臺開基';g14.before(d)}})();

/* segmented toggle: replaces flag track; inline script still toggles data-lang + aria-checked */
(function(){const b=document.getElementById('langtg');if(!b)return;const tr=b.querySelector('.lt-track');if(tr)tr.remove();
const lz=b.querySelector('.lz'),le=b.querySelector('.le');const seg=document.createElement('span');seg.className='lg-seg';seg.innerHTML='<span class="lg-ind" aria-hidden="true"></span>';seg.append(lz,le);
b.append(seg);const ic=document.createElement('span');ic.className='lg-icon';ic.setAttribute('aria-hidden','true');ic.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 5h10M7.5 3v2"/><path d="M10.5 5c-.9 4-3.6 7.3-7.5 9"/><path d="M5 8.5c1.2 2.4 3.2 4.4 5.6 5.5"/><path d="M12.5 21l4.25-10L21 21"/><path d="M14 17.6h5.5"/></svg>';b.prepend(ic);b.classList.add('lseg');b.setAttribute('aria-label','English');
document.addEventListener('click',e=>{const s=e.target.closest('#langtg .lz,#langtg .le');if(!s)return;const en=document.documentElement.dataset.lang==='en';if((s.classList.contains('le')&&en)||(s.classList.contains('lz')&&!en)){e.stopPropagation();e.preventDefault()}},true);})();

/* Option 2a flag toggle (ROC / US, brick underline). Inline script still sets data-lang + aria-checked. */
(function(){const b=document.getElementById('langtg');if(!b)return;
b.className='langtg lflag';b.innerHTML='<span class="fl roc" title="中文"><svg viewBox="0 0 240 160" preserveAspectRatio="xMinYMin slice"><rect width="240" height="160" fill="#fe0000"/><rect width="120" height="80" fill="#000095"/><polygon fill="#fff" points="60.00,10.00 64.04,24.93 75.00,14.02 71.03,28.97 85.98,25.00 75.07,35.96 90.00,40.00 75.07,44.04 85.98,55.00 71.03,51.03 75.00,65.98 64.04,55.07 60.00,70.00 55.96,55.07 45.00,65.98 48.97,51.03 34.02,55.00 44.93,44.04 30.00,40.00 44.93,35.96 34.02,25.00 48.97,28.97 45.00,14.02 55.96,24.93"/><circle cx="60" cy="40" r="17" fill="#000095"/><circle cx="60" cy="40" r="15" fill="#fff"/></svg></span><span class="sep" aria-hidden="true">/</span><span class="fl us" title="English"><svg viewBox="0 0 150 100" preserveAspectRatio="xMinYMin slice"><rect width="190" height="100" fill="#b22234"/><rect y="7.692" width="190" height="7.692" fill="#fff"/><rect y="23.077" width="190" height="7.692" fill="#fff"/><rect y="38.462" width="190" height="7.692" fill="#fff"/><rect y="53.846" width="190" height="7.692" fill="#fff"/><rect y="69.231" width="190" height="7.692" fill="#fff"/><rect y="84.615" width="190" height="7.692" fill="#fff"/><rect width="76" height="53.85" fill="#3c3b6e"/><g fill="#fff"><polygon points="6.33,2.30 7.02,4.43 9.26,4.43 7.45,5.75 8.14,7.88 6.33,6.56 4.52,7.88 5.21,5.75 3.40,4.43 5.64,4.43"/><polygon points="18.99,2.30 19.68,4.43 21.92,4.43 20.11,5.75 20.80,7.88 18.99,6.56 17.18,7.88 17.87,5.75 16.06,4.43 18.30,4.43"/><polygon points="31.65,2.30 32.34,4.43 34.58,4.43 32.77,5.75 33.46,7.88 31.65,6.56 29.84,7.88 30.53,5.75 28.72,4.43 30.96,4.43"/><polygon points="44.31,2.30 45.00,4.43 47.24,4.43 45.43,5.75 46.12,7.88 44.31,6.56 42.50,7.88 43.19,5.75 41.38,4.43 43.62,4.43"/><polygon points="56.97,2.30 57.66,4.43 59.90,4.43 58.09,5.75 58.78,7.88 56.97,6.56 55.16,7.88 55.85,5.75 54.04,4.43 56.28,4.43"/><polygon points="69.63,2.30 70.32,4.43 72.56,4.43 70.75,5.75 71.44,7.88 69.63,6.56 67.82,7.88 68.51,5.75 66.70,4.43 68.94,4.43"/><polygon points="12.66,7.69 13.35,9.82 15.59,9.82 13.78,11.13 14.47,13.26 12.66,11.95 10.85,13.26 11.54,11.13 9.73,9.82 11.97,9.82"/><polygon points="25.32,7.69 26.01,9.82 28.25,9.82 26.44,11.13 27.13,13.26 25.32,11.95 23.51,13.26 24.20,11.13 22.39,9.82 24.63,9.82"/><polygon points="37.98,7.69 38.67,9.82 40.91,9.82 39.10,11.13 39.79,13.26 37.98,11.95 36.17,13.26 36.86,11.13 35.05,9.82 37.29,9.82"/><polygon points="50.64,7.69 51.33,9.82 53.57,9.82 51.76,11.13 52.45,13.26 50.64,11.95 48.83,13.26 49.52,11.13 47.71,9.82 49.95,9.82"/><polygon points="63.30,7.69 63.99,9.82 66.23,9.82 64.42,11.13 65.11,13.26 63.30,11.95 61.49,13.26 62.18,11.13 60.37,9.82 62.61,9.82"/><polygon points="6.33,13.08 7.02,15.20 9.26,15.20 7.45,16.52 8.14,18.65 6.33,17.34 4.52,18.65 5.21,16.52 3.40,15.20 5.64,15.20"/><polygon points="18.99,13.08 19.68,15.20 21.92,15.20 20.11,16.52 20.80,18.65 18.99,17.34 17.18,18.65 17.87,16.52 16.06,15.20 18.30,15.20"/><polygon points="31.65,13.08 32.34,15.20 34.58,15.20 32.77,16.52 33.46,18.65 31.65,17.34 29.84,18.65 30.53,16.52 28.72,15.20 30.96,15.20"/><polygon points="44.31,13.08 45.00,15.20 47.24,15.20 45.43,16.52 46.12,18.65 44.31,17.34 42.50,18.65 43.19,16.52 41.38,15.20 43.62,15.20"/><polygon points="56.97,13.08 57.66,15.20 59.90,15.20 58.09,16.52 58.78,18.65 56.97,17.34 55.16,18.65 55.85,16.52 54.04,15.20 56.28,15.20"/><polygon points="69.63,13.08 70.32,15.20 72.56,15.20 70.75,16.52 71.44,18.65 69.63,17.34 67.82,18.65 68.51,16.52 66.70,15.20 68.94,15.20"/><polygon points="12.66,18.46 13.35,20.59 15.59,20.59 13.78,21.90 14.47,24.03 12.66,22.72 10.85,24.03 11.54,21.90 9.73,20.59 11.97,20.59"/><polygon points="25.32,18.46 26.01,20.59 28.25,20.59 26.44,21.90 27.13,24.03 25.32,22.72 23.51,24.03 24.20,21.90 22.39,20.59 24.63,20.59"/><polygon points="37.98,18.46 38.67,20.59 40.91,20.59 39.10,21.90 39.79,24.03 37.98,22.72 36.17,24.03 36.86,21.90 35.05,20.59 37.29,20.59"/><polygon points="50.64,18.46 51.33,20.59 53.57,20.59 51.76,21.90 52.45,24.03 50.64,22.72 48.83,24.03 49.52,21.90 47.71,20.59 49.95,20.59"/><polygon points="63.30,18.46 63.99,20.59 66.23,20.59 64.42,21.90 65.11,24.03 63.30,22.72 61.49,24.03 62.18,21.90 60.37,20.59 62.61,20.59"/><polygon points="6.33,23.84 7.02,25.97 9.26,25.97 7.45,27.29 8.14,29.42 6.33,28.10 4.52,29.42 5.21,27.29 3.40,25.97 5.64,25.97"/><polygon points="18.99,23.84 19.68,25.97 21.92,25.97 20.11,27.29 20.80,29.42 18.99,28.10 17.18,29.42 17.87,27.29 16.06,25.97 18.30,25.97"/><polygon points="31.65,23.84 32.34,25.97 34.58,25.97 32.77,27.29 33.46,29.42 31.65,28.10 29.84,29.42 30.53,27.29 28.72,25.97 30.96,25.97"/><polygon points="44.31,23.84 45.00,25.97 47.24,25.97 45.43,27.29 46.12,29.42 44.31,28.10 42.50,29.42 43.19,27.29 41.38,25.97 43.62,25.97"/><polygon points="56.97,23.84 57.66,25.97 59.90,25.97 58.09,27.29 58.78,29.42 56.97,28.10 55.16,29.42 55.85,27.29 54.04,25.97 56.28,25.97"/><polygon points="69.63,23.84 70.32,25.97 72.56,25.97 70.75,27.29 71.44,29.42 69.63,28.10 67.82,29.42 68.51,27.29 66.70,25.97 68.94,25.97"/><polygon points="12.66,29.23 13.35,31.36 15.59,31.36 13.78,32.67 14.47,34.80 12.66,33.49 10.85,34.80 11.54,32.67 9.73,31.36 11.97,31.36"/><polygon points="25.32,29.23 26.01,31.36 28.25,31.36 26.44,32.67 27.13,34.80 25.32,33.49 23.51,34.80 24.20,32.67 22.39,31.36 24.63,31.36"/><polygon points="37.98,29.23 38.67,31.36 40.91,31.36 39.10,32.67 39.79,34.80 37.98,33.49 36.17,34.80 36.86,32.67 35.05,31.36 37.29,31.36"/><polygon points="50.64,29.23 51.33,31.36 53.57,31.36 51.76,32.67 52.45,34.80 50.64,33.49 48.83,34.80 49.52,32.67 47.71,31.36 49.95,31.36"/><polygon points="63.30,29.23 63.99,31.36 66.23,31.36 64.42,32.67 65.11,34.80 63.30,33.49 61.49,34.80 62.18,32.67 60.37,31.36 62.61,31.36"/><polygon points="6.33,34.62 7.02,36.74 9.26,36.74 7.45,38.06 8.14,40.19 6.33,38.88 4.52,40.19 5.21,38.06 3.40,36.74 5.64,36.74"/><polygon points="18.99,34.62 19.68,36.74 21.92,36.74 20.11,38.06 20.80,40.19 18.99,38.88 17.18,40.19 17.87,38.06 16.06,36.74 18.30,36.74"/><polygon points="31.65,34.62 32.34,36.74 34.58,36.74 32.77,38.06 33.46,40.19 31.65,38.88 29.84,40.19 30.53,38.06 28.72,36.74 30.96,36.74"/><polygon points="44.31,34.62 45.00,36.74 47.24,36.74 45.43,38.06 46.12,40.19 44.31,38.88 42.50,40.19 43.19,38.06 41.38,36.74 43.62,36.74"/><polygon points="56.97,34.62 57.66,36.74 59.90,36.74 58.09,38.06 58.78,40.19 56.97,38.88 55.16,40.19 55.85,38.06 54.04,36.74 56.28,36.74"/><polygon points="69.63,34.62 70.32,36.74 72.56,36.74 70.75,38.06 71.44,40.19 69.63,38.88 67.82,40.19 68.51,38.06 66.70,36.74 68.94,36.74"/><polygon points="12.66,40.00 13.35,42.13 15.59,42.13 13.78,43.44 14.47,45.57 12.66,44.26 10.85,45.57 11.54,43.44 9.73,42.13 11.97,42.13"/><polygon points="25.32,40.00 26.01,42.13 28.25,42.13 26.44,43.44 27.13,45.57 25.32,44.26 23.51,45.57 24.20,43.44 22.39,42.13 24.63,42.13"/><polygon points="37.98,40.00 38.67,42.13 40.91,42.13 39.10,43.44 39.79,45.57 37.98,44.26 36.17,45.57 36.86,43.44 35.05,42.13 37.29,42.13"/><polygon points="50.64,40.00 51.33,42.13 53.57,42.13 51.76,43.44 52.45,45.57 50.64,44.26 48.83,45.57 49.52,43.44 47.71,42.13 49.95,42.13"/><polygon points="63.30,40.00 63.99,42.13 66.23,42.13 64.42,43.44 65.11,45.57 63.30,44.26 61.49,45.57 62.18,43.44 60.37,42.13 62.61,42.13"/><polygon points="6.33,45.38 7.02,47.51 9.26,47.51 7.45,48.83 8.14,50.96 6.33,49.64 4.52,50.96 5.21,48.83 3.40,47.51 5.64,47.51"/><polygon points="18.99,45.38 19.68,47.51 21.92,47.51 20.11,48.83 20.80,50.96 18.99,49.64 17.18,50.96 17.87,48.83 16.06,47.51 18.30,47.51"/><polygon points="31.65,45.38 32.34,47.51 34.58,47.51 32.77,48.83 33.46,50.96 31.65,49.64 29.84,50.96 30.53,48.83 28.72,47.51 30.96,47.51"/><polygon points="44.31,45.38 45.00,47.51 47.24,47.51 45.43,48.83 46.12,50.96 44.31,49.64 42.50,50.96 43.19,48.83 41.38,47.51 43.62,47.51"/><polygon points="56.97,45.38 57.66,47.51 59.90,47.51 58.09,48.83 58.78,50.96 56.97,49.64 55.16,50.96 55.85,48.83 54.04,47.51 56.28,47.51"/><polygon points="69.63,45.38 70.32,47.51 72.56,47.51 70.75,48.83 71.44,50.96 69.63,49.64 67.82,50.96 68.51,48.83 66.70,47.51 68.94,47.51"/></g></svg></span><span class="vh lz">中文</span><span class="vh le">English</span>';
b.setAttribute('aria-label','English');
document.addEventListener('click',e=>{const s=e.target.closest('#langtg .fl');if(!s)return;const en=document.documentElement.dataset.lang==='en';if((s.classList.contains('us')&&en)||(s.classList.contains('roc')&&!en)){e.stopPropagation();e.preventDefault()}},true);})();

/* msfix 2026-10-21: on touch screens drop focus after a tap so no hover/focus look sticks (language flags, mobile menu, site switch) */
(function(){const fine=matchMedia('(hover:hover) and (pointer:fine)');document.addEventListener('click',e=>{if(fine.matches)return;const t=e.target.closest('#langtg,.mtop a,.mtop button,.mdrop a,.site-switch a');if(t)setTimeout(()=>t.blur(),0)});})();

/* v6bk2: click-to-zoom lightbox for photos, HTML charts, and land tables */
(function(){
  const L=(zh,en)=>document.documentElement.dataset.lang==='en'?en:zh;
  const box=document.createElement('div');
  box.className='zview';
  box.hidden=true;
  box.setAttribute('role','dialog');
  box.setAttribute('aria-modal','true');
  box.innerHTML='<button type="button" class="zview-x" aria-label="">×</button><div class="zview-stage"><div class="zview-world"></div></div>';
  document.body.appendChild(box);
  const btn=box.querySelector('.zview-x');
  const stage=box.querySelector('.zview-stage');
  const world=box.querySelector('.zview-world');
  let s=1,tx=0,ty=0,fit=1,prevFocus=null,kind='img';

  /* Photos that were printed sideways in the book and are still stored that way
     in the webp (other book-sideways photos were already straightened in the asset).
     270 = clockwise (90 counter-clockwise), which brings 大興祖居's sky to the top. */
  var ROT = { 'p008-0.webp': 270 };
  function fileOf(src){ return String(src||'').split('?')[0].split('/').pop(); }
  function rotOfPh(ph){
    if(!ph) return 0;
    if(ph.classList.contains('rot-90')) return 90;
    if(ph.classList.contains('rot-270')) return 270;
    return 0;
  }
  document.querySelectorAll('.dsec .ph img').forEach(function(img){
    var r = ROT[fileOf(img.getAttribute('src'))];
    if(r) img.closest('.ph').classList.add('rot-'+r);
  });

  function lab(){
    box.setAttribute('aria-label',L('放大檢視','Zoom view'));
    btn.setAttribute('aria-label',L('關閉','Close'));
  }
  function apply(){world.style.transform='translate('+tx+'px,'+ty+'px) scale('+s+')'}
  function close(){
    if(box.hidden)return;
    box.hidden=true;
    world.replaceChildren();
    document.body.style.overflow='';
    document.removeEventListener('keydown',onKey);
    if(prevFocus&&prevFocus.focus){try{prevFocus.focus()}catch(e){}}
  }
  function onKey(e){if(e.key==='Escape'){e.preventDefault();close()}}
  function fitNow(){
    s=1;tx=0;ty=0;apply();
    const st=stage.getBoundingClientRect(),r=world.getBoundingClientRect(),pad=48;
    const sx=(st.width-pad)/Math.max(r.width,1),sy=(st.height-pad)/Math.max(r.height,1);
    fit=Math.min(sx,sy);
    if(kind==='img')fit=Math.min(Math.max(fit,0.2),8);
    else fit=Math.min(Math.max(fit,0.2),6);
    s=fit;
    tx=(st.width-r.width*s)/2;
    ty=(st.height-r.height*s)/2;
    apply();
  }
  function open(el){
    lab();
    prevFocus=document.activeElement;
    kind=el.matches('figure')?'img':el.matches('.bcw')?'chart':'table';
    world.replaceChildren();
    world.style.transform='';
    if(kind==='img'){
      const srcEl=el.querySelector('img');
      const src=srcEl&&(srcEl.currentSrc||srcEl.src);
      if(!src)return;
      const rot=rotOfPh(el.querySelector('.ph'));
      const img=document.createElement('img');
      img.src=src;
      const cap=el.querySelector('figcaption');
      img.alt=cap?cap.innerText.trim():'';
      img.draggable=false;
      if(rot){
        const wrap=document.createElement('div');
        wrap.className='z-rot';
        wrap.dataset.rot=String(rot);
        function sizeRot(){
          const w=img.naturalWidth,h=img.naturalHeight;
          if(!w||!h)return;
          wrap.style.width=h+'px';
          wrap.style.height=w+'px';
          img.style.width=w+'px';
          img.style.height=h+'px';
          img.style.left=((h-w)/2)+'px';
          img.style.top=((w-h)/2)+'px';
          img.style.transform='rotate('+rot+'deg)';
        }
        if(img.complete&&img.naturalWidth)sizeRot();
        else img.addEventListener('load',sizeRot);
        wrap.appendChild(img);
        world.append(wrap);
      }else{
        world.append(img);
      }
    }else{
      const clone=el.cloneNode(true);
      clone.style.overflow='visible';
      clone.style.cursor='default';
      if(kind==='chart'){
        const svg=clone.querySelector('svg');
        if(svg){
          const vb=svg.viewBox&&svg.viewBox.baseVal;
          let vw=parseFloat(svg.style.getPropertyValue('--vw'));
          if(!vw&&vb&&vb.width)vw=vb.width;
          const vh=vb&&vb.height?vb.height:(vw||800);
          if(!vw)vw=800;
          svg.style.display='block';
          svg.style.width=vw+'px';
          svg.style.height=vh+'px';
          svg.style.maxWidth='none';
        }
      }else{
        const table=clone.querySelector('table');
        if(table){table.style.width='max-content';table.style.fontSize='18px'}
      }
      world.append(clone);
    }
    box.hidden=false;
    document.body.style.overflow='hidden';
    document.addEventListener('keydown',onKey);
    box.tabIndex=-1;box.focus();
    const img=world.querySelector(':scope > img, :scope > .z-rot > img');
    if(img&&!img.complete)img.onload=function(){fitNow()};
    else requestAnimationFrame(()=>requestAnimationFrame(fitNow));
  }
  function zoomAt(cx,cy,factor){
    const ns=Math.min(8,Math.max(fit*0.8,s*factor));
    const wx=(cx-tx)/s,wy=(cy-ty)/s;
    s=ns;tx=cx-wx*s;ty=cy-wy*s;apply();
  }

  btn.addEventListener('click',e=>{e.stopPropagation();close()});
  box.addEventListener('click',e=>{if(e.target===box||e.target===stage)close()});

  const pts=new Map();
  let drag=false,moved=false,lx=0,ly=0,pinching=false,pDist=0,pScale=1,pMidX=0,pMidY=0;
  function stagePt(e){const r=stage.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
  function dist(a,b){const dx=a.clientX-b.clientX,dy=a.clientY-b.clientY;return Math.hypot(dx,dy)}
  function mid(a,b){const r=stage.getBoundingClientRect();return{x:(a.clientX+b.clientX)/2-r.left,y:(a.clientY+b.clientY)/2-r.top}}

  stage.addEventListener('pointerdown',e=>{
    if(box.hidden)return;
    if(e.target.closest&&e.target.closest('.zview-x'))return;
    stage.setPointerCapture(e.pointerId);
    pts.set(e.pointerId,e);
    if(pts.size===2){
      const [a,b]=[...pts.values()];
      pinching=true;drag=false;pDist=dist(a,b)||1;pScale=s;
      const m=mid(a,b);pMidX=m.x;pMidY=m.y;
    }else if(pts.size===1){
      drag=true;moved=false;lx=e.clientX;ly=e.clientY;
      stage.classList.add('is-drag');
    }
    e.preventDefault();
  });
  stage.addEventListener('pointermove',e=>{
    if(!pts.has(e.pointerId))return;
    pts.set(e.pointerId,e);
    if(pinching&&pts.size>=2){
      const [a,b]=[...pts.values()];
      const d=dist(a,b)||1,m=mid(a,b);
      const ns=Math.min(8,Math.max(fit*0.8,pScale*(d/pDist)));
      const wx=(pMidX-tx)/s,wy=(pMidY-ty)/s;
      s=ns;tx=m.x-wx*s;ty=m.y-wy*s;apply();
      pMidX=m.x;pMidY=m.y;
    }else if(drag&&!pinching){
      const dx=e.clientX-lx,dy=e.clientY-ly;
      if(Math.hypot(dx,dy)>3)moved=true;
      tx+=dx;ty+=dy;lx=e.clientX;ly=e.clientY;apply();
    }
  });
  function endPtr(e){
    pts.delete(e.pointerId);
    if(pts.size<2)pinching=false;
    if(pts.size===0){
      const was=moved;drag=false;moved=false;pinching=false;
      stage.classList.remove('is-drag');
      if(!was&&(e.target===stage))close();
    }
  }
  stage.addEventListener('pointerup',endPtr);
  stage.addEventListener('pointercancel',endPtr);
  stage.addEventListener('wheel',e=>{
    if(box.hidden)return;
    e.preventDefault();
    const p=stagePt(e);
    zoomAt(p.x,p.y,e.deltaY<0?1.12:1/1.12);
  },{passive:false});

  let down=null;
  document.addEventListener('pointerdown',e=>{
    const t=e.target.closest('.dsec figure, .dsec .bcw, .dsec .tbw');
    down=t?{t,x:e.clientX,y:e.clientY}:null;
  },true);
  document.addEventListener('click',e=>{
    if(!down)return;
    const t=e.target.closest('.dsec figure, .dsec .bcw, .dsec .tbw');
    const ok=t&&t===down.t&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<8;
    down=null;
    if(!ok||!t||!box.hidden)return;
    e.preventDefault();
    open(t);
  },true);

  addEventListener('resize',()=>{if(!box.hidden)fitNow()});
})();
