import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
const BG_IMAGE_1 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85';
const BG_IMAGE_2 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85';
const SPOTLIGHT_R = 260;
function RevealLayer({image,cursorX,cursorY}:{image:string;cursorX:number;cursorY:number}) {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const revealRef=useRef<HTMLDivElement>(null);
  const [size,setSize]=useState({width:window.innerWidth,height:window.innerHeight});
  useEffect(()=>{const resize=()=>setSize({width:window.innerWidth,height:window.innerHeight});window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize)},[]);
  useLayoutEffect(()=>{
    const canvas=canvasRef.current,div=revealRef.current;
    if(!canvas||!div)return;
    const ctx=canvas.getContext('2d');if(!ctx)return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const gradient=ctx.createRadialGradient(cursorX,cursorY,0,cursorX,cursorY,SPOTLIGHT_R);
    [[0,1],[.4,1],[.6,.75],[.75,.4],[.88,.12],[1,0]].forEach(([stop,alpha])=>gradient.addColorStop(stop,`rgba(255,255,255,${alpha})`));
    ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(cursorX,cursorY,SPOTLIGHT_R,0,Math.PI*2);ctx.fill();
    const mask=`url("${canvas.toDataURL()}")`;div.style.maskImage=mask;div.style.webkitMaskImage=mask;
  });
  return <><canvas ref={canvasRef} width={size.width} height={size.height} className="absolute inset-0 pointer-events-none" style={{display:'none'}} aria-hidden="true"/><div ref={revealRef} className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none" style={{backgroundImage:`url("${image}")`,maskSize:'100% 100%',WebkitMaskSize:'100% 100%',maskImage:'linear-gradient(transparent,transparent)'}} aria-hidden="true"/></>;
}
const links=['Course','Field Guides','Geology','Plans','Live Tour'];
export default function App(){
  const mouse=useRef({x:-999,y:-999}),smooth=useRef({x:-999,y:-999}),rafRef=useRef(0);
  const [cursorPos,setCursorPos]=useState({x:-999,y:-999});
  const [menuOpen,setMenuOpen]=useState(false);
  const [active,setActive]=useState('Course');
  const dialogRef=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    const onMove=(e:MouseEvent)=>{mouse.current={x:e.clientX,y:e.clientY}};
    const onTouch=(e:TouchEvent)=>{if(e.touches[0])mouse.current={x:e.touches[0].clientX,y:e.touches[0].clientY}};
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const animate=()=>{const factor=reduced.matches?1:.1;smooth.current.x+=(mouse.current.x-smooth.current.x)*factor;smooth.current.y+=(mouse.current.y-smooth.current.y)*factor;setCursorPos({...smooth.current});rafRef.current=requestAnimationFrame(animate)};
    window.addEventListener('mousemove',onMove);window.addEventListener('touchstart',onTouch,{passive:true});window.addEventListener('touchmove',onTouch,{passive:true});rafRef.current=requestAnimationFrame(animate);
    return()=>{window.removeEventListener('mousemove',onMove);window.removeEventListener('touchstart',onTouch);window.removeEventListener('touchmove',onTouch);cancelAnimationFrame(rafRef.current)};
  },[]);
  const dig=()=>{mouse.current={x:window.innerWidth*.5,y:window.innerHeight*.6};setMenuOpen(false)};
  const choose=(link:string)=>{setActive(link);setMenuOpen(false);if(link==='Live Tour')dig();else if(link!=='Course')dialogRef.current?.showModal()};
  return <div className="min-h-screen bg-white tracking-[-0.02em]" style={{fontFamily:"'Inter', sans-serif"}}>
    <section className="relative w-full overflow-hidden h-screen bg-black" style={{height:'100dvh'}} aria-label="Lithos geological layers">
      <div className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom" style={{backgroundImage:`url("${BG_IMAGE_1}")`}} aria-hidden="true"/>
      <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y}/>
      <div className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50"><h1 className="text-white leading-[0.95]"><span className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal" style={{letterSpacing:'-0.05em',animationDelay:'0.25s'}}>Layers hold</span><span className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal" style={{letterSpacing:'-0.08em',animationDelay:'0.42s'}}>tales of time</span></h1></div>
      <div className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade" style={{animationDelay:'0.7s'}}><p className="text-sm text-white/80 leading-relaxed">Every layer of sediment records a chapter of our planet, from ancient seabeds to drifting ash, layered across millions of years beneath us.</p></div>
      <div className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade" style={{animationDelay:'0.85s'}}><p className="text-xs sm:text-sm text-white/80 leading-relaxed">Our interactive maps let you peel back the crust to trace how stones, fossils, and deep time combine to shape the ground beneath your feet.</p><button onClick={dig} className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30">Start Digging</button></div>
    </section>
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5" aria-label="Main navigation">
      <a href="/" className="flex items-center gap-2.5" aria-label="Lithos home"><svg width="26" height="26" viewBox="0 0 256 256" fill="#ffffff" aria-hidden="true"><path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z"/></svg><span className="text-white text-2xl font-playfair italic">Lithos</span></a>
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">{links.map(link=><button key={link} onClick={()=>choose(link)} aria-current={active===link?'page':undefined} className={`px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 hover:text-white transition-colors ${active===link?'text-white':'text-white/80'}`}>{link}</button>)}</div>
      <button className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100" onClick={()=>{setActive('Sign Up');dialogRef.current?.showModal()}}>Sign Up</button>
      <button className="md:hidden text-white p-2 rounded-full hover:bg-white/20" onClick={()=>setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen?'Close menu':'Open menu'}>{menuOpen?<X size={24}/>:<Menu size={24}/>}</button>
      {menuOpen&&<div id="mobile-menu" className="md:hidden absolute top-20 left-4 right-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/20 p-3 flex flex-col">{links.map(link=><button key={link} className="text-left text-white px-4 py-3 rounded-lg hover:bg-white/10" onClick={()=>choose(link)}>{link}</button>)}<button className="bg-white text-gray-900 rounded-full px-4 py-3 mt-2" onClick={()=>{setMenuOpen(false);setActive('Sign Up');dialogRef.current?.showModal()}}>Sign Up</button></div>}
    </nav>
    <dialog ref={dialogRef} className="bg-[#141414] text-white border border-white/20 rounded-2xl p-8 max-w-sm w-[calc(100%-40px)] backdrop:bg-black/60" onClick={e=>{if(e.target===e.currentTarget)dialogRef.current?.close()}}><button autoFocus className="absolute right-3 top-3 p-2 rounded-full hover:bg-white/10" aria-label="Close" onClick={()=>dialogRef.current?.close()}><X size={20}/></button><h2 className="font-playfair italic text-3xl mb-4">{active}</h2><p className="text-white/80 text-sm leading-relaxed">{active==='Sign Up'?'Registration is not open yet. Explore the layers of Lithos while we prepare what comes next.':`${active} is coming soon. For now, move your cursor or drag across the landscape to uncover another layer.`}</p><button className="mt-6 bg-[#e8702a] rounded-full px-5 py-2.5 text-sm" onClick={()=>{dialogRef.current?.close();dig()}}>Explore the layers</button></dialog>
  </div>
}
