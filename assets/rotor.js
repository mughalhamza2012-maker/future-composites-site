/* Interactive 3D helical rotor (illustrative). */
import * as THREE from '../demo/vendor/three.module.min.js';
const canvas=document.getElementById('rotor');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);let dist=7.5;
scene.add(new THREE.HemisphereLight(0xcfefff,0x0f1b21,1.1));
const key=new THREE.DirectionalLight(0xffffff,2.2);key.position.set(4,6,5);scene.add(key);
const rim=new THREE.DirectionalLight(0x21bdd6,2.5);rim.position.set(-5,2,-4);scene.add(rim);
const warm=new THREE.PointLight(0xf7941e,18,12);warm.position.set(3,-2,3);scene.add(warm);
const rotor=new THREE.Group();scene.add(rotor);
const H=3.6,r=.62,off=.5,tw=Math.PI;
const mat=new THREE.MeshPhysicalMaterial({color:0x1f7fe0,roughness:.22,metalness:.05,clearcoat:1,clearcoatRoughness:.1,side:THREE.DoubleSide});
function blade(s){const U=48,V=80,p=[],idx=[];for(let j=0;j<=V;j++){const v=j/V,y=(v-.5)*H,a0=v*tw;for(let i=0;i<=U;i++){const a=Math.PI*i/U;const px=s*off+r*Math.cos(a)*s,pz=r*Math.sin(a)*s;p.push(px*Math.cos(a0)-pz*Math.sin(a0),y,px*Math.sin(a0)+pz*Math.cos(a0));}}
for(let j=0;j<V;j++)for(let i=0;i<U;i++){const a=j*(U+1)+i,b=a+U+1;idx.push(a,b,a+1,b,b+1,a+1);}
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();return new THREE.Mesh(g,mat);}
rotor.add(blade(1),blade(-1));
const pm=new THREE.MeshPhysicalMaterial({color:0x22313a,roughness:.35,metalness:.6,clearcoat:.6});
for(const y of [-H/2,H/2]){const p=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.25,.05,72),pm);p.position.y=y;rotor.add(p);}
rotor.add(new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,H+1.4,24),new THREE.MeshStandardMaterial({color:0xb8c4ca,metalness:.9,roughness:.25})));
let drag=false,lx=0,ly=0,vy=.006,rx=.18;rotor.rotation.x=.18;
canvas.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;ly=e.clientY;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;rotor.rotation.y+=dx*.01;vy=dx*.0015;rx=Math.max(-.8,Math.min(.8,rx+dy*.005))});
canvas.addEventListener('pointerup',()=>drag=false);
canvas.addEventListener('wheel',e=>{e.preventDefault();dist=Math.max(4.5,Math.min(12,dist+e.deltaY*.004))},{passive:false});
let pinch=0;canvas.addEventListener('touchmove',e=>{if(e.touches.length===2){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(pinch)dist=Math.max(4.5,Math.min(12,dist-(d-pinch)*.02));pinch=d;e.preventDefault()}},{passive:false});
canvas.addEventListener('touchend',()=>pinch=0);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function resize(){const w=canvas.clientWidth,h=canvas.clientHeight,pr=renderer.getPixelRatio();if(canvas.width!==Math.floor(w*pr)||canvas.height!==Math.floor(h*pr)){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}}
(function loop(){resize();if(!drag){rotor.rotation.y+=reduce?0:vy;vy+=(.006-vy)*.02}rotor.rotation.x+=(rx-rotor.rotation.x)*.1;camera.position.set(0,.6,dist);camera.lookAt(0,0,0);renderer.render(scene,camera);requestAnimationFrame(loop)})();
