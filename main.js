function showErr(m){var e=document.getElementById("err");e.style.display="block";e.textContent=m}
window.addEventListener("error",function(ev){showErr("3D scene error: "+ev.message)});
window.startStory=function(){if(window.__started)return;if(!window.THREE){return}window.__started=1;document.documentElement.classList.add("js");
try{
const T=THREE,$=s=>document.querySelector(s),cl=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),ease=t=>t*t*(3-2*t),lerp=(a,b,t)=>a+(b-a)*t;
const R=new T.WebGLRenderer({canvas:$('#gl'),antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
const S=new T.Scene();
const cam=new T.PerspectiveCamera(42,1,.1,3000);
S.add(new T.AmbientLight(0x8899bb,.55));
const sun=new T.DirectionalLight(0xffffff,2.1);sun.position.set(30,40,30);S.add(sun);
const rim=new T.DirectionalLight(0x5f9bff,.9);rim.position.set(-30,5,-30);S.add(rim);
const mk=(c,o={})=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.5,metalness:.2},o));
const tex=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.anisotropy=4;return t};
/* Particle globe */
const blob=(g,x,y,r,col)=>{const q=g.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,col);q.addColorStop(1,col.replace(/[\d.]+\)$/,'0)'));g.fillStyle=q;g.fillRect(x-r,y-r,r*2,r*2)};
const earth=new T.Group();earth.position.y=-100;S.add(earth);
earth.add(new T.Mesh(new T.SphereGeometry(99.4,64,48),new T.MeshBasicMaterial({color:0x061a3d})));
const mc=document.createElement('canvas');mc.width=512;mc.height=256;const mg=mc.getContext('2d');mg.fillStyle='#000';mg.fillRect(0,0,512,256);
for(let i=0;i<150;i++)blob(mg,Math.random()*512,40+Math.random()*176,8+Math.random()*34,'rgba(255,255,255,.95)');
const md=mg.getImageData(0,0,512,256).data,pp=[],pc=[],ps=[],pf=[];
for(let i=0;i<36000;i++){const y=1-2*(i+.5)/36000,rr=Math.sqrt(1-y*y),th=i*2.399963,lon=Math.atan2(Math.sin(th),Math.cos(th)),lat=Math.asin(y);
 const px=Math.floor((lon/6.2832+.5)*511),py=Math.floor((.5-lat/3.1416)*255),land=md[(py*512+px)*4]>110;
 if(!land&&Math.random()<.55)continue;
 pp.push(Math.cos(th)*rr*100,y*100,Math.sin(th)*rr*100);
 if(land){pc.push(0,.98,.6);ps.push(1.5)}else{pc.push(.2,.5,1);ps.push(.95)}pf.push(Math.random())}
const gg=new T.BufferGeometry();gg.setAttribute('position',new T.Float32BufferAttribute(pp,3));gg.setAttribute('col',new T.Float32BufferAttribute(pc,3));gg.setAttribute('sz',new T.Float32BufferAttribute(ps,1));gg.setAttribute('ph',new T.Float32BufferAttribute(pf,1));
const globe=new T.Points(gg,new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{t:{value:0},k:{value:Math.min(devicePixelRatio,2)}},
 vertexShader:'attribute vec3 col;attribute float sz;attribute float ph;uniform float t;uniform float k;varying vec3 c;varying float a;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);c=col;a=.7+.3*sin(t*1.6+ph*50.);gl_PointSize=clamp(sz*240./-mv.z,1.2,6.)*k;gl_Position=projectionMatrix*mv;}',
 fragmentShader:'varying vec3 c;varying float a;void main(){float d=smoothstep(.5,.1,length(gl_PointCoord-.5));gl_FragColor=vec4(c,d*a);}'}));
earth.add(globe);
const atm=new T.Mesh(new T.SphereGeometry(106,64,48),new T.ShaderMaterial({transparent:true,side:T.BackSide,blending:T.AdditiveBlending,depthWrite:false,uniforms:{k:{value:0}},
 vertexShader:'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'varying vec3 n;uniform float k;void main(){float i=pow(max(.0,.68-dot(n,vec3(0,0,1.))),3.);gl_FragColor=vec4(.35,.62,1.,1.)*i*3.*k;}'}));
atm.position.y=-100;S.add(atm);
/* stars */
const sp=new Float32Array(4500);for(let i=0;i<1500;i++){const a=Math.random()*6.283,b=Math.acos(2*Math.random()-1),r=1200;sp.set([r*Math.sin(b)*Math.cos(a),r*Math.cos(b),r*Math.sin(b)*Math.sin(a)],i*3)}
const sg=new T.BufferGeometry();sg.setAttribute('position',new T.BufferAttribute(sp,3));
const ph=new Float32Array(1500),sz=new Float32Array(1500),dpr=Math.min(devicePixelRatio,2);for(let i=0;i<1500;i++){ph[i]=Math.random();sz[i]=(.7+Math.pow(Math.random(),3)*1.8)*dpr}
sg.setAttribute('ph',new T.BufferAttribute(ph,1));sg.setAttribute('sz',new T.BufferAttribute(sz,1));
const stars=new T.Points(sg,new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{t:{value:0},o:{value:0}},
 vertexShader:'attribute float ph;attribute float sz;uniform float t;varying float a;void main(){float s=.5+.5*sin(t*(1.2+ph*3.5)+ph*60.);a=.25+.75*s*s;gl_PointSize=sz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'varying float a;uniform float o;void main(){float d=smoothstep(.5,.05,length(gl_PointCoord-.5));gl_FragColor=vec4(.85,.92,1.,d*a*o);}'}));S.add(stars);
/* rocket */
const white=mk(0xf2f4f7,{roughness:.4}),dark=mk(0x17191d,{roughness:.6}),steel=mk(0x888d96,{metalness:.7,roughness:.35});
const rocket=new T.Group(),booster=new T.Group(),upper=new T.Group();rocket.add(booster,upper);S.add(rocket);
const cyl=(r,h,y,m,p=booster)=>{const o=new T.Mesh(new T.CylinderGeometry(r,r,h,40),m);o.position.y=y;p.add(o);return o};
cyl(.5,4.2,2.1,white);cyl(.505,.7,3.7,dark);cyl(.52,.3,.15,dark);
const red=mk(0xd92b2b,{roughness:.4,side:T.DoubleSide});
[0,Math.PI].forEach(o=>{const m=new T.Mesh(new T.CylinderGeometry(.508,.508,2.6,24,1,true,o+.75,.9),red);m.position.y=1.9;booster.add(m)});
cyl(.512,.22,.95,red);
for(let i=0;i<9;i++){const a=i?(i-1)/8*6.283:0,d=i?.3:0,b=new T.Mesh(new T.ConeGeometry(.09,.22,12,1,true),steel);b.position.set(Math.cos(a)*d,-.05,Math.sin(a)*d);b.rotation.x=Math.PI;b.material.side=T.DoubleSide;booster.add(b)}
for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4,f=new T.Mesh(new T.BoxGeometry(.5,.05,.28),dark);f.position.set(Math.cos(a)*.7,3.95,Math.sin(a)*.7);f.rotation.y=-a;booster.add(f);
 const l=new T.Mesh(new T.BoxGeometry(.05,1.1,.05),steel);l.position.set(Math.cos(a)*.62,.5,Math.sin(a)*.62);l.rotation.set(Math.sin(a)*.35,0,-Math.cos(a)*.35);booster.add(l)}
cyl(.51,.3,4.35,dark,upper);cyl(.5,1.55,5.2,white,upper);
[0,Math.PI].forEach(o=>{const m=new T.Mesh(new T.CylinderGeometry(.505,.505,1.2,24,1,true,o+.75,.9),red);m.position.y=5.2;upper.add(m)});
const flameTex=tex(4,128,(g,w,h)=>{const q=g.createLinearGradient(0,0,0,h);q.addColorStop(0,'rgba(255,30,0,0)');q.addColorStop(.25,'rgba(255,45,10,.9)');q.addColorStop(.6,'rgba(255,165,20,1)');q.addColorStop(1,'rgba(255,238,110,1)');g.fillStyle=q;g.fillRect(0,0,w,h)});
const flame=new T.Mesh(new T.ConeGeometry(.45,3.2,24,1,true),new T.MeshBasicMaterial({map:flameTex,transparent:true,blending:T.AdditiveBlending,side:T.DoubleSide,depthWrite:false}));
const core=new T.Mesh(new T.ConeGeometry(.2,2,16,1,true),new T.MeshBasicMaterial({color:0xffe98a,transparent:true,opacity:.8,blending:T.AdditiveBlending,side:T.DoubleSide,depthWrite:false}));core.position.y=-.6;flame.add(core);
flame.position.y=-1.7;flame.rotation.x=Math.PI;booster.add(flame);
const fl=new T.PointLight(0xff5a2a,3,14);fl.position.y=-1;booster.add(fl);
const fm=mk(0xf6f7f9,{side:T.DoubleSide}),halves=[0,Math.PI].map(s=>{const g=new T.Group(),a=new T.Mesh(new T.CylinderGeometry(.52,.52,.9,32,1,true,s,Math.PI),fm),b=new T.Mesh(new T.ConeGeometry(.52,1.5,32,1,true,s,Math.PI),fm);
 a.position.y=.45;b.position.y=1.65;g.add(a,b);g.position.y=6;upper.add(g);return g});
/* satellite */
const panelTex=tex(256,128,(g,w,h)=>{g.fillStyle='#0b2756';g.fillRect(0,0,w,h);g.strokeStyle='#5d8de0';g.lineWidth=2;for(let x=0;x<=w;x+=32){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke()}for(let y=0;y<=h;y+=32){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}});
const sat=new T.Group();S.add(sat);
const gold=mk(0xf4f6f8,{metalness:.25,roughness:.4,emissive:0x222428});
sat.add(new T.Mesh(new T.BoxGeometry(.5,.7,.5),gold));
const collar=new T.Mesh(new T.BoxGeometry(.52,.06,.52),steel);collar.position.y=.3;sat.add(collar);
const panels=[-1,1].map(s=>{const g=new T.Group();g.position.x=s*.26;const m=new T.Mesh(new T.BoxGeometry(1.6,.03,.62),new T.MeshStandardMaterial({map:panelTex,metalness:.6,roughness:.3,emissive:0x0a1a3a}));m.position.x=s*.8;g.add(m);const a=new T.Mesh(new T.BoxGeometry(1.6,.035,.02),steel);a.position.x=s*.8;g.add(a);sat.add(g);return g});
const dishPivot=new T.Group();dishPivot.position.set(0,.1,.27);const dish=new T.Mesh(new T.SphereGeometry(.2,28,10,0,6.283,0,1.2),mk(0xe8ebef,{side:T.DoubleSide}));dish.rotation.x=Math.PI/2;dishPivot.add(dish);
const feed=new T.Mesh(new T.CylinderGeometry(.01,.01,.2,8),steel);feed.rotation.x=Math.PI/2;feed.position.z=.1;dishPivot.add(feed);sat.add(dishPivot);
const lens=new T.Mesh(new T.CylinderGeometry(.13,.15,.24,24),dark);lens.position.y=-.45;sat.add(lens);
const glass=new T.Mesh(new T.CircleGeometry(.11,24),mk(0x3a7bff,{emissive:0x1a3a99,metalness:.9,roughness:.1}));glass.rotation.x=Math.PI/2;glass.position.y=-.575;sat.add(glass);
const mast=new T.Mesh(new T.CylinderGeometry(.012,.012,.4,8),steel);mast.position.y=.55;sat.add(mast);
const tip=new T.Mesh(new T.SphereGeometry(.03,12,12),mk(0xff7a2f,{emissive:0xff4400}));tip.position.y=.75;sat.add(tip);
/* interaction */
let tp=0,spx=0,down=0,ux=0,vx=0;
addEventListener('pointerdown',e=>{down=1;ux=e.clientX});addEventListener('pointerup',()=>down=0);
addEventListener('pointermove',e=>{if(down){vx+=(e.clientX-ux)*.01;ux=e.clientX}});
const secs=[...document.querySelectorAll('section')],ts=secs.map(s=>s.firstElementChild);
const phases=['Pre-launch','Ascent','Stage separation','Fairing deploy','Payload view','Array deploy','In orbit','Mission ready'];
function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);cam.aspect=w/h;if(w>800)cam.setViewOffset(w,h,-w*.2,0,w,h);else cam.clearViewOffset();cam.updateProjectionMatrix()}
size();addEventListener('resize',size);
function onScroll(){const m=document.documentElement.scrollHeight-innerHeight;tp=m>0?cl(scrollY/m):0;$('#bar').style.width=tp*100+'%';
 const mid=innerHeight/2;let cur=0;secs.forEach((s,i)=>{const r=s.getBoundingClientRect(),d=Math.abs(r.top+r.height/2-mid)/r.height;ts[i].classList.toggle('on',d<.38);if(d<.5)cur=i});$('#phase').textContent=phases[cur]}
addEventListener('scroll',onScroll,{passive:true});onScroll();
const v3=new T.Vector3(),tgt=new T.Vector3(),hs=[1,2,3].map(i=>$('#h'+i)),hp=[[-1.2,0,0],[0,.1,.5],[0,-.6,0]];
let clock=0;
function frame(t){clock=t*.001;spx+=(tp-spx)*.07;vx*=.95;const p=spx,narrow=innerWidth<=800;
 const asc=ease(cl(p/.33)),sep=ease(cl((p-.30)/.1)),fa=ease(cl((p-.40)/.1)),rel=ease(cl((p-.47)/.1)),dep=ease(cl((p-.56)/.14)),pull=ease(cl((p-.78)/.22)),ph=ease(cl((p-.4)/.15));
 rocket.position.y=asc*70;booster.position.set(-sep*3,-sep*9,0);booster.rotation.z=sep*1.4;upper.position.y=sep*4;
 const burning=p<.34;flame.visible=fl.visible=burning;flame.scale.set(1+Math.sin(clock*40)*.08,1+Math.sin(clock*55)*.15,1);fl.intensity=2.5+Math.sin(clock*60);
 halves[0].position.x=fa*2.6;halves[0].rotation.z=-fa*.8;halves[1].position.x=-fa*2.6;halves[1].rotation.z=fa*.8;
 const sy=asc*70+sep*4+6.1+rel*3.5+pull*70;sat.position.set(0,sy,0);sat.scale.setScalar(1+rel*1.7);
 sat.rotation.y=p*2.5+vx+clock*.15*rel;
 panels[0].scale.x=panels[1].scale.x=.05+dep*.95;dishPivot.rotation.x=-dep*.5;
 earth.rotation.y=clock*.012;globe.material.uniforms.t.value=clock;
 /* camera */
 tgt.set(0,lerp(rocket.position.y+3.6+sep*2,sy,ph),0);
 const a=.45+p*3.4,r=lerp(lerp(16,13,asc),lerp(13,6.5,rel),rel)*(1-pull)+pull*34,yo=lerp(.4,1.4,ph)+pull*9;
 const k=narrow?1.7:1;
 cam.position.set(tgt.x+Math.sin(a)*r*k,tgt.y+yo,tgt.z+Math.cos(a)*r*k);cam.lookAt(tgt);
 /* sky */
 const alt=cl(cam.position.y/60);document.documentElement.style.setProperty('--alt',alt.toFixed(3));stars.material.uniforms.o.value=cl((alt-.05)/.35);stars.material.uniforms.t.value=clock;atm.material.uniforms.k.value=cl((cam.position.y-8)/30);
 const e2=ease(cl(p/.5));$('#alt').textContent=Math.round(550*e2);$('#vel').textContent=(7.6*e2).toFixed(1);
 /* hotspots */
 const vis=cl((p-.52)/.04)*(1-cl((p-.8)/.04));sat.updateMatrixWorld();
 hs.forEach((h,i)=>{v3.set(...hp[i]).applyMatrix4(sat.matrixWorld).project(cam);const x=(v3.x*.5+.5)*innerWidth,y=(-v3.y*.5+.5)*innerHeight;h.style.transform=`translate(${x}px,${y}px)`;h.style.opacity=(v3.z<1?vis:0)*(i==0?dep:1)});
 R.render(S,cam);requestAnimationFrame(frame)}
requestAnimationFrame(frame);

}catch(e){document.documentElement.classList.remove("js");showErr("Your browser could not start the 3D scene ("+e.message+"). The story text is still readable below.")}};
window.addEventListener("load",function(){if(window.THREE)window.startStory();else setTimeout(function(){if(!window.THREE)showErr("The 3D library could not be loaded. Check your connection or ad-blocker, then reload.")},3000)});

