"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Variant = "ticker" | "hero" | "markets" | "kpi" | "features" | "how" | "wallets" | "cta";

const VERTEX = `attribute vec2 aPosition;
void main(){ gl_Position = vec4(aPosition, 0.0, 1.0); }`;

const FRAGMENT = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uActive;
uniform float uVariant;

float hash21(vec2 p){p=fract(p*vec2(.1031,.1030));p+=dot(p,p.yx+19.19);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash21(i),hash21(i+vec2(1.,0.)),f.x),mix(hash21(i+vec2(0.,1.)),hash21(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.02+13.17;a*=.5;}return v;}
float glow(float d,float r){return exp(-d*d/max(.0001,r*r));}
void main(){

 vec2 p=(gl_FragCoord.xy-.5*uResolution.xy)/min(uResolution.x,uResolution.y);
 vec2 m=(uPointer-.5)*uResolution/min(uResolution.x,uResolution.y);
 vec2 delta=p-m;
 float dist=length(delta);
 float near=exp(-dist*dist*3.5)*uActive;
 float t=uTime;
 float field=0.;
 float accent=0.;
 if(uVariant<.5){
   // Live ticker: bent horizontal information streams
   vec2 q=p; q.y-=delta.y*near*.42;
      q.y+=near*.035*sin(q.x*9.+t*2.);
   float line=abs(sin(q.y*26.+sin(q.x*4.+t)*.8));
   field=pow(1.-line,20.)*(.22+.35*noise(vec2(q.x*4.-t*.5,q.y*7.)));
   accent=near*.15;
 } else if(uVariant<1.5){
   // Hero: swirling plasma and pointer gravitational lens
   vec2 q=p+delta*near*.13;
   float n=fbm(q*2.0+vec2(t*.08,-t*.05));
   field=glow(abs(q.y-.25*sin(q.x*2.3+t*.22)-n*.35),.28)*.55;
   field+=glow(length(q-vec2(.4*sin(t*.17),.1*cos(t*.23))),.53)*.42;
   float ripple=glow(sin(dist*28.-t*3.),.22)*exp(-dist*4.)*uActive;
      accent=near*.28+ripple*.32+glow(dist,.06)*uActive*.22;
 } else if(uVariant<2.5){
   // Trending markets: topographic probability contours
   float n=fbm(p*2.6+vec2(t*.055,0.));
   float contour=abs(fract((n+p.y*.23)*13.)-.5);
   field=(1.-smoothstep(.025,.075,contour))*(.16+near*.62);
   accent=near*.23;
 } else if(uVariant<3.5){
   // KPI: technical grid with radial signal
   vec2 q=p*16.;
   vec2 g=abs(fract(q)-.5);
   float grid=1.-smoothstep(.018,.045,min(g.x,g.y));
      float energy=glow(sin(p.x*3.-t*1.3),.16);
      field=grid*(.11+energy*.18);
   float ring=abs(fract(dist*4.-t*.55)-.5);
   accent=(1.-smoothstep(.02,.08,ring))*near*.42;
 } else if(uVariant<4.5){
   // Features: iridescent holographic interference
   vec2 q=p+delta*near*.22;
   float a=sin(q.x*6.+q.y*3.+t*.3+fbm(q*3.)*4.);
   float b=sin(q.y*7.-q.x*2.-t*.25);
   field=pow(max(0.,a*b),3.)*.30;
   accent=near*(.3+.2*sin(dist*24.-t*2.));
 } else if(uVariant<5.5){
   // How it works: connected illuminated nodes
   float wave=sin(dist*18.-t*3.)*exp(-dist*1.8)*uActive;
   vec2 q=p*9.+delta*wave*.3;
   vec2 id=floor(q);vec2 f=fract(q)-.5;
   float d=length(f);
   float pulse=.5+.5*sin(t*1.4+hash21(id)*6.28);
   field=glow(d,.075)*(.22+.32*pulse+max(0.,wave)*.65);
   float connection=1.-smoothstep(.01,.035,min(abs(f.x),abs(f.y)));
   field+=connection*(.065+max(0.,wave)*.2);
   accent=max(0.,wave)*.2;
 } else if(uVariant<6.5){
   // Wallets: floating orbital energy bands
   vec2 center=vec2(.17*sin(t*.14),.09*cos(t*.18));
   vec2 q=p-center+delta*near*.06;
   float angle=atan(q.y,q.x);
   float r=length(q);
   float ring=abs(r-(.45+.055*sin(angle*5.+t*.45)));
   field=glow(ring,.026)*.55+glow(abs(r-.7),.05)*.17;
   accent=near*.27;
 } else {
   // CTA: cinematic vortex, with pointer-steered focal point
   vec2 q=p-m*.22*uActive;
   float r=length(q)+.001;
   float angle=atan(q.y,q.x);
   float spiral=sin(angle*5.-r*13.+t*.7+fbm(q*2.)*2.);
   field=glow(r,.65)*(.28+.26*spiral);
   accent=near*.35+glow(r,.24)*.22;
 }
 vec3 violet=vec3(.48,.22,.92);
 vec3 blue=vec3(.23,.36,.99);
 vec3 pink=vec3(.95,.33,.86);
 float blend=.5+.5*sin(p.x*2.8+p.y*1.7+t*.13);
 vec3 base=mix(violet,blue,blend);
  if(uVariant>3.5 && uVariant<4.5) base=mix(base,vec3(.28,.95,.85),.5+.5*sin(dist*12.-t*.5));
  vec3 color=base*field+pink*accent;
 float alpha=clamp(field*.60+accent*.60,0.,.53);
 gl_FragColor=vec4(color,alpha);
}`;

function shader(gl: WebGLRenderingContext, type: number, source: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("Predictify shader compilation failed:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

const VARIANTS: Variant[] = ["ticker", "hero", "markets", "kpi", "features", "how", "wallets", "cta"];

export function SectionWebGL({ variant, className = "" }: { variant: Variant; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    if (!canvas || !section) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: "low-power" });
    if (!gl) return;
    const vs = shader(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = shader(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      return;
    }
    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vs); gl.deleteShader(fs);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("Predictify shader link failed:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs);
      return;
    }
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const res = gl.getUniformLocation(program, "uResolution");
    const pointer = gl.getUniformLocation(program, "uPointer");
    const time = gl.getUniformLocation(program, "uTime");
    const active = gl.getUniformLocation(program, "uActive");
    const mode = gl.getUniformLocation(program, "uVariant");
    gl.uniform1f(mode, VARIANTS.indexOf(variant));
    let visible = false;
    let frame = 0;
    const start = performance.now();
    let elapsed = 0;
    let last = start;
    let lastDraw = 0;
    let contextLost = false;
    let pointerX = .5, pointerY = .5, targetX = .5, targetY = .5;
    let intensity = 0, targetIntensity = 0;
    const resize = () => {
      const rect = section.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const scale = window.innerWidth < 768 ? .65 : .85;
      canvas.width = Math.max(1, Math.floor(rect.width*dpr*scale));
      canvas.height = Math.max(1, Math.floor(rect.height*dpr*scale));
      gl.viewport(0,0,canvas.width,canvas.height);
      startLoop();
    };
    const draw = (now: number) => {
      if (!visible || document.hidden || contextLost) { frame = 0; return; }
      if (!reduceMotion && now - lastDraw < 1000 / 30) {
        frame = requestAnimationFrame(draw);
        return;
      }
      lastDraw = now;
      elapsed += Math.min((now-last)/1000,.05);
      last = now;
      pointerX += (targetX-pointerX)*.07;
      pointerY += (targetY-pointerY)*.07;
      intensity += (targetIntensity-intensity)*.06;
      gl.uniform2f(res,canvas.width,canvas.height);
      gl.uniform2f(pointer,pointerX,pointerY);
      gl.uniform1f(time,reduceMotion ? 0 : elapsed);
      gl.uniform1f(active,reduceMotion ? 0 : intensity);
      gl.clearColor(0,0,0,0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES,0,6);
      if (!reduceMotion) frame=requestAnimationFrame(draw);
      else frame=0;
    };
    const startLoop = () => { if (!visible || document.hidden || contextLost || frame) return; last=performance.now(); frame=requestAnimationFrame(draw); };
    const move = (event: PointerEvent) => {
      if (reduceMotion || event.pointerType === "touch") return;
      const r=section.getBoundingClientRect();
      targetX=(event.clientX-r.left)/r.width;
      targetY=1-(event.clientY-r.top)/r.height;
      targetIntensity=1;

    };
    const leave = () => { targetIntensity=0; };
    const observer = new IntersectionObserver(([entry]) => {
      visible=entry.isIntersecting;
      if (visible) startLoop();
      else { cancelAnimationFrame(frame); frame=0; }
    }, { rootMargin: "80px" });
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const ro = new ResizeObserver(resize);
    resize();
    observer.observe(section);
    ro.observe(section);
    canvas.addEventListener("webglcontextlost", handleContextLost);
    section.addEventListener("pointermove",move,{passive:true});
    section.addEventListener("pointerleave",leave);
    document.addEventListener("visibilitychange",startLoop);
    return () => {
      cancelAnimationFrame(frame);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      observer.disconnect();ro.disconnect();
      section.removeEventListener("pointermove",move);
      section.removeEventListener("pointerleave",leave);
      document.removeEventListener("visibilitychange",startLoop);
      gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
    };
  },[variant, prefersReducedMotion]);
  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 z-0 h-full w-full opacity-80 ${className}`} style={{ width: "100%", height: "100%" }} />;
}
