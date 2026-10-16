/* Site switch: keeps the switch as the header's LAST child (far right), even if
   other scripts append items later; current-page link is inert. */
(function(){
  var sw=document.querySelector('.site-switch');if(!sw)return;
  var host=sw.parentElement;
  function last(){if(host.lastElementChild!==sw)host.appendChild(sw)}
  last();new MutationObserver(last).observe(host,{childList:true});
  sw.querySelectorAll('a[aria-current="page"]').forEach(function(a){
    a.addEventListener('click',function(e){e.preventDefault()})});
})();
