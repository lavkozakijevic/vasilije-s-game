// Contact-sheet helper: animates any [data-strip] element from a horizontal sprite strip.
(function(){
function init(el){const src=el.dataset.strip,n=+el.dataset.frames||1,fw=+el.dataset.w||32,fh=+el.dataset.h||32,s=+el.dataset.scale||3,fps=+el.dataset.fps||10;
el.style.cssText+=`;width:${fw*s}px;height:${fh*s}px;background:url(${src}) no-repeat;background-size:${fw*n*s}px ${fh*s}px;image-rendering:pixelated;flex-shrink:0`+(el.dataset.flip?';transform:scaleX(-1)':'');
if(el.dataset.frame!=null){el.style.backgroundPosition=`${-(+el.dataset.frame)*fw*s}px 0`;return;}
let f=0;setInterval(()=>{f=(f+1)%n;el.style.backgroundPosition=`${-f*fw*s}px 0`;},1000/fps);}
function run(){document.querySelectorAll('[data-strip]').forEach(init);}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run):run();
})();
