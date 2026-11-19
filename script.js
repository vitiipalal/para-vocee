/* ==========================================================
   Site para minha namorada: lógica, cena 3D e interações
   Depende do three.js (carregado no index.html)
   ========================================================== */

try{var q=new URLSearchParams(location.search).get("nome");if(q)document.getElementById("nm").textContent=q}catch(e){}
document.querySelectorAll(".fade").forEach(function(el){new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)el.classList.add("in")})},{threshold:.3}).observe(el)});
function vib(n){try{if(navigator.vibrate)navigator.vibrate(n)}catch(e){}}

/* ---- música gerada no navegador ---- */
var ac,mg,mt,step=0,playing=false;
var CH=[[220,261.63,329.63],[174.61,220,261.63],[196,261.63,329.63],[196,246.94,293.66]];
function tone(f,t,d,v,type){var o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.04);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(mg);o.start(t);o.stop(t+d+.1)}
function tick(){var c=CH[Math.floor(step/8)%4],i=[0,1,2,3,2,1,2,1][step%8],t=ac.currentTime+.05;
 tone(c[i%3]*(i>2?2:1),t,1.6,.13,"triangle");
 if(step%8===0){tone(c[0]/2,t,3.6,.16,"sine");tone(c[1],t,3.6,.05,"sine")}
 step++}
function startMusic(){if(!ac){ac=new(window.AudioContext||window.webkitAudioContext)();mg=ac.createGain();mg.gain.value=.7;
 var d=ac.createDelay(),fb=ac.createGain();d.delayTime.value=.45;fb.gain.value=.4;d.connect(fb);fb.connect(d);mg.connect(ac.destination);mg.connect(d);d.connect(ac.destination)}
 if(ac.resume)ac.resume();clearInterval(mt);mt=setInterval(tick,480);playing=true;mus.textContent="♪ Pausar"}
function stopMusic(){clearInterval(mt);playing=false;mus.textContent="♪ Tocar"}
var mus=document.getElementById("mus");
mus.onclick=function(){playing?stopMusic():startMusic()};
document.getElementById("go").onclick=function(){
 try{startMusic()}catch(e){}
 document.getElementById("intro").classList.add("out");document.body.classList.remove("lock");mus.style.display="block";vib(30)};

/* ---- cursor com brilhos ---- */
addEventListener("pointermove",function(e){if(e.pointerType!=="mouse")return;
 var s=document.createElement("span");s.className="sp";s.textContent=Math.random()<.5?"✦":"♥";
 s.style.left=e.clientX+"px";s.style.top=e.clientY+"px";s.style.fontSize=(8+Math.random()*12)+"px";
 s.style.setProperty("--dx",(Math.random()-.5)*50+"px");s.style.setProperty("--dy",(10+Math.random()*40)+"px");
 document.body.appendChild(s);setTimeout(function(){s.remove()},900)});

/* ---- céu de estrelas ---- */
var R=["Porque o seu sorriso conserta qualquer dia ruim.","Porque com você até o silêncio é bom.","Porque o seu abraço é o meu lugar seguro.","Porque a sua risada é a minha música favorita.","Porque você me faz querer ser alguém melhor.","Porque o seu olhar diz o que as palavras não alcançam.","Porque com você o simples vira especial.","Porque cada detalhe seu é lindo, até os que você acha defeito.","Porque eu escolheria você em todas as vidas."];
var P=[[12,20],[30,60],[48,15],[66,50],[85,22],[20,85],[50,80],[78,82],[92,60]],found=0;
P.forEach(function(p,i){var b=document.createElement("button");b.className="st";b.textContent="✦";b.style.left=p[0]+"%";b.style.top=p[1]+"%";b.style.animationDelay=(i*.3)+"s";
 b.onclick=function(){var w=document.getElementById("why");w.textContent=R[i];vib(40);
  if(!b.classList.contains("on")){b.classList.add("on");found++;document.getElementById("cnt").textContent=found+" / 9 estrelas descobertas";burst(6);
   if(found===9)w.innerHTML=R[i]+"<br><br>♥ Você acendeu o céu inteiro. São nove motivos, mas na verdade eu tenho infinitos. ♥"}};
 document.getElementById("sky").appendChild(b)});

/* ---- cena 3D ---- */
var canvas=document.getElementById("c");
var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.autoClear=false;
var scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(60,1,.1,200);camera.position.z=14;
scene.add(new THREE.AmbientLight(0xffe2b0,.6));
var l1=new THREE.PointLight(0xffc857,2.2,60);l1.position.set(6,6,8);scene.add(l1);
var l2=new THREE.PointLight(0x7a5cff,1.6,60);l2.position.set(-8,-4,6);scene.add(l2);
var fade=new THREE.Scene(),fcam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
fade.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.MeshBasicMaterial({color:0x07051a,transparent:true,opacity:.16,depthTest:false})));
function hs(){var s=new THREE.Shape();s.moveTo(0,0);s.bezierCurveTo(0,-.3,-.5,-.9,-1,-.9);s.bezierCurveTo(-2.2,-.9,-2.2,.5,-2.2,.5);s.bezierCurveTo(-2.2,1.3,-1.4,2.1,0,3);s.bezierCurveTo(1.4,2.1,2.2,1.3,2.2,.5);s.bezierCurveTo(2.2,.5,2.2,-.9,1,-.9);s.bezierCurveTo(.5,-.9,0,-.3,0,0);return s}
var hg=new THREE.ExtrudeGeometry(hs(),{depth:.7,bevelEnabled:true,bevelThickness:.25,bevelSize:.25,bevelSegments:4,curveSegments:16});hg.center();
var core=new THREE.Mesh(hg,new THREE.MeshStandardMaterial({color:0xffb81f,emissive:0x6b3d00,roughness:.25,metalness:.35}));core.scale.setScalar(1.5);scene.add(core);
var minis=[],cols=[0xffc857,0xf2b134,0xffe3a0,0x9b7bff,0xffd978];
for(var i=0;i<70;i++){var m=new THREE.Mesh(hg,new THREE.MeshStandardMaterial({color:cols[i%5],emissive:cols[i%5],emissiveIntensity:.25,roughness:.35,metalness:.2}));
 m.scale.setScalar(.08+Math.random()*.2);m.userData={r:5+Math.random()*10,a:Math.random()*6.28,y:(Math.random()-.5)*16,sp:.1+Math.random()*.35,rs:Math.random()*2};scene.add(m);minis.push(m)}
var N=2500,pos=new Float32Array(N*3);
for(var i=0;i<N;i++){var t=Math.random()*6.283,r=Math.sqrt(Math.random());
 pos[i*3]=16*Math.pow(Math.sin(t),3)*.53*r;pos[i*3+1]=(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*.53*r;pos[i*3+2]=(Math.random()-.5)*5}
var pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.BufferAttribute(pos,3));
var pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0xffe3a0,size:.06,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(pts);
var sp=new Float32Array(2700);for(var i=0;i<2700;i++)sp[i]=(Math.random()-.5)*80;
var sg=new THREE.BufferGeometry();sg.setAttribute("position",new THREE.BufferAttribute(sp,3));
var stars=new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:.08,transparent:true,opacity:.7}));scene.add(stars);

var bursts=[];
function burst(n){for(var i=0;i<n;i++){var m=new THREE.Mesh(hg,new THREE.MeshStandardMaterial({color:0xffc857,emissive:0xffb81f,emissiveIntensity:.6}));
 m.scale.setScalar(.15+Math.random()*.25);m.position.set(0,0,2);var a=Math.random()*6.283,s=.1+Math.random()*.25;
 m.userData={v:new THREE.Vector3(Math.cos(a)*s,Math.sin(a)*s,(Math.random()-.5)*.3),life:1};scene.add(m);bursts.push(m)}}
var kit=document.getElementById("kit");
function closeKit(){kit.classList.remove("on")}
document.getElementById("b").onclick=function(){burst(30);vib([60,40,60,40,120]);kit.classList.add("on")};
document.getElementById("kitx").onclick=closeKit;
kit.addEventListener("click",function(e){if(e.target===kit)closeKit()});

/* clique no coração central (easter egg) */
var ray=new THREE.Raycaster(),clicks=0,egg=document.getElementById("egg");
addEventListener("pointerdown",function(e){if(document.body.classList.contains("lock"))return;
 ray.setFromCamera({x:e.clientX/innerWidth*2-1,y:-(e.clientY/innerHeight)*2+1},camera);
 if(ray.intersectObject(core).length){clicks++;vib(25);burst(4);core.scale.multiplyScalar(1.15);
  if(clicks>=5){clicks=0;vib([80,50,80,50,200]);burst(30);egg.classList.add("show")}}});
document.getElementById("eggx").onclick=function(){egg.classList.remove("show")};

var mx=0,my=0,sc=0,scs=0;
addEventListener("pointermove",function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
addEventListener("scroll",function(){var h=document.documentElement.scrollHeight-innerHeight;sc=h>0?scrollY/h:0});
function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setClearColor(0x07051a,1);renderer.clear()}
addEventListener("resize",resize);resize();
var clock=new THREE.Clock();
function loop(){requestAnimationFrame(loop);
 var t=clock.getElapsedTime();scs+=(sc-scs)*.05;
 var beat=1+Math.pow(Math.sin(t*2.4),8)*.14,base=1.5*(1-scs*.3);
 core.scale.x+=(base*beat-core.scale.x)*.12;core.scale.y=core.scale.z=core.scale.x;
 core.rotation.y=t*.6+scs*6;core.rotation.x=Math.sin(t*.5)*.25;core.position.y=Math.sin(t)*.4;
 pts.rotation.y=t*.15;pts.rotation.z=Math.sin(t*.3)*.1;stars.rotation.y=t*.02;
 minis.forEach(function(m){var d=m.userData;d.a+=d.sp*.01*(1+scs*4);
  m.position.set(Math.cos(d.a)*d.r,d.y+Math.sin(t*d.rs+d.a)*.8,Math.sin(d.a)*d.r*.6-2);m.rotation.y+=.03*d.rs;m.rotation.z=Math.sin(t+d.a)*.4});
 for(var i=bursts.length-1;i>=0;i--){var b=bursts[i];b.position.add(b.userData.v);b.rotation.y+=.1;b.userData.life-=.012;b.scale.multiplyScalar(.995);
  if(b.userData.life<=0){scene.remove(b);bursts.splice(i,1)}}
 camera.position.x+=((mx*5+Math.sin(scs*6.28)*4)-camera.position.x)*.04;
 camera.position.y+=((-my*3-scs*3)-camera.position.y)*.04;
 camera.position.z=14-scs*4+Math.sin(t*.4)*.6;camera.lookAt(0,0,0);l1.position.x=Math.sin(t*.7)*8;
 renderer.render(fade,fcam);renderer.clearDepth();renderer.render(scene,camera)}
loop();