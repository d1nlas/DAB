(function(){
  'use strict';
  function qs(s,c=document){return c.querySelector(s)}
  function qsa(s,c=document){return Array.from(c.querySelectorAll(s))}
  function activate(target){
    const el=document.getElementById(target);
    if(!el){
      const fallback = (target.startsWith('awm') || target.startsWith('kwm')) ? document.getElementById(target+'ocks') : null;
      if(fallback){ fallback.scrollIntoView({behavior:'smooth',block:'start'}); return; }
      return;
    }
    // Every destination is a real DOM node, including each individual mock paper.
    el.scrollIntoView({behavior:'smooth',block:'start'});
    qsa('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===target));
    if(target.startsWith('awm') || target.startsWith('kwm')){
      el.classList.add('mock-focus');
      window.setTimeout(()=>el.classList.remove('mock-focus'),1200);
    }
  }
  function buildNav(){
    const nav=qs('#nav'); if(!nav) return;
    // Preserve the carefully built original navigation but make every link resilient.
    qsa('button[data-page]',nav).forEach(b=>{
      if(b.dataset.enhanced) return;
      b.dataset.enhanced='1';
      const target=b.dataset.page;
      b.addEventListener('click',()=>activate(target));
    });
  }
  function search(){
    const input=qs('#search'); if(!input) return;
    input.addEventListener('input',()=>{
      const term=input.value.trim().toLowerCase();
      qsa('.qcard').forEach(card=>{
        const hit=!term || card.innerText.toLowerCase().includes(term);
        card.style.outline=term&&hit?'2px solid #b5cdbd':'';
        card.style.outlineOffset=term&&hit?'3px':'';
      });
    });
  }
  function progress(){
    const key='dab_student_units_v8';
    const units=qsa('.unit');
    const home=qs('#completionText'),bar=qs('#progress');
    function render(){
      let state={}; try{state=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){}
      const done=units.filter(u=>state[u.id]).length;
      if(home) home.textContent=done+' / '+units.length+' units completed';
      if(bar) bar.style.width=(done/Math.max(units.length,1)*100)+'%';
    }
    units.forEach(u=>{
      if(qs('.unit-complete',u)) return;
      const label=document.createElement('label'); label.className='unit-complete'; label.style.cssText='display:inline-flex;gap:8px;align-items:center;margin:14px 0;font-weight:800;color:#3d624e;cursor:pointer';
      const cb=document.createElement('input'); cb.type='checkbox'; cb.checked=false;
      try{cb.checked=!!JSON.parse(localStorage.getItem(key)||'{}')[u.id]}catch(e){}
      cb.addEventListener('change',()=>{let s={};try{s=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){};s[u.id]=cb.checked;localStorage.setItem(key,JSON.stringify(s));render()});
      label.append(cb,document.createTextNode('Mark this unit complete')); u.querySelector('.unit-content')?.prepend(label);
    }); render();
  }
  function solutionEnhancement(){
    // Native <details> is intentionally used: it works without JavaScript and survives offline/local-file use.
    qsa('details.solution').forEach(d=>{
      const s=d.querySelector('summary');
      if(!s || s.dataset.enhanced) return;
      s.dataset.enhanced='1';
      d.addEventListener('toggle',()=>{s.textContent=d.open?'HIDE THE STEP-BY-STEP SOLUTION ↙':'REVEAL THE STEP-BY-STEP SOLUTION ↗'});
    });
  }
  document.addEventListener('DOMContentLoaded',()=>{buildNav();search();progress();solutionEnhancement();});
})();