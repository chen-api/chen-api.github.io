const R=document.documentElement,b=document.getElementById('lang');
function set(l){R.dataset.lang=l;R.lang=l==='en'?'en':'zh-Hant';localStorage.setItem('chenLang',l);document.title=l==='en'?'Chen Family Genealogy':'陳氏家譜';b.setAttribute('aria-checked',l==='en')}
set(R.dataset.lang);b.onclick=()=>set(R.dataset.lang==='en'?'zh':'en');
const S=[...document.querySelectorAll('.sheet')];
function spy(){let v=S[0].id;for(const s of S)if(s.getBoundingClientRect().top<230)v=s.id;document.querySelectorAll('[data-for]').forEach(a=>a.classList.toggle('on',a.dataset.for===v))}
addEventListener('scroll',spy,{passive:true});addEventListener('hashchange',()=>setTimeout(spy,50));spy();
function fitVT(){document.querySelectorAll('.vt').forEach(v=>{if(getComputedStyle(v).writingMode!=='vertical-rl'||!v.offsetParent){v.style.height='';return}let h=560;v.style.height=h+'px';while(v.scrollWidth>v.clientWidth+1&&h<3000){h+=30;v.style.height=h+'px'}})}
addEventListener('resize',fitVT);document.fonts.ready.then(fitVT);fitVT();
document.querySelector('.zh-l').onclick=()=>set('zh');document.querySelector('.en-l').onclick=()=>set('en');
