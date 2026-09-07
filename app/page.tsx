'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Download, Menu, X, Moon, Sun } from 'lucide-react';
import PortfolioWorks from '@/components/portfolio-works';

const capabilities = ['ART DIRECTION','GAME VISUAL','CAMPAIGN DESIGN','STORE VISUAL','WEB DESIGN','AIGC'];
const stats = ['7+ YEARS EXPERIENCE','GLOBAL GAME MARKET','FULL-PROCESS VISUAL DESIGN','AI-ASSISTED WORKFLOW'];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    try { setDark(localStorage.getItem('portfolio-theme') === 'dark'); } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    try { localStorage.setItem('portfolio-theme', next ? 'dark' : 'light'); } catch {}
  };
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onMove = (event: PointerEvent) => {
      hero.style.setProperty('--mx', ((event.clientX / window.innerWidth - .5) * 2).toFixed(3));
      hero.style.setProperty('--my', ((event.clientY / window.innerHeight - .5) * 2).toFixed(3));
    };
    const onLeave = () => { hero.style.setProperty('--mx','0'); hero.style.setProperty('--my','0'); };
    window.addEventListener('pointermove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => { window.removeEventListener('pointermove', onMove); document.removeEventListener('mouseleave', onLeave); };
  }, []);

  useEffect(() => {
    const about = aboutRef.current;
    if (!about || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onMove = (event: PointerEvent) => {
      const rect = about.getBoundingClientRect();
      about.style.setProperty('--ax', (((event.clientX - rect.left) / rect.width - .5) * 2).toFixed(3));
      about.style.setProperty('--ay', (((event.clientY - rect.top) / rect.height - .5) * 2).toFixed(3));
    };
    const onLeave = () => {
      about.style.setProperty('--ax', '0');
      about.style.setProperty('--ay', '0');
    };
    about.addEventListener('pointermove', onMove);
    about.addEventListener('pointerleave', onLeave);
    return () => {
      about.removeEventListener('pointermove', onMove);
      about.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible'));
    }, { threshold:.12 });
    document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="周颖作品集首页" onClick={closeMenu}><span>ZY</span><small>PORTFOLIO / 26</small></a>
        <nav className={menuOpen ? 'nav-open' : ''} aria-label="主导航">
          <a href="#about" onClick={closeMenu}>ABOUT</a><a href="#works" onClick={closeMenu}>WORKS</a><a href="#contact" onClick={closeMenu}>CONTACT</a>
        </nav>
        <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={dark ? '切换浅色模式' : '切换深色模式'} aria-pressed={dark}>{dark ? <Sun size={20} /> : <Moon size={20} />}</button>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? '关闭菜单' : '打开菜单'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero" id="top" ref={heroRef}>
        <div className="hero-meta hero-layer layer-1"><span>GAME VISUAL DESIGNER</span><span>PORTFOLIO 2019—2026</span></div>
        <h1 className="hero-title hero-layer layer-2" aria-label="Zhou Ying Portfolio"><span>ZHOU</span><span className="title-ying">YING</span><span className="title-portfolio">PORTFOLIO</span></h1>
        <div className="collage hero-layer layer-3" aria-hidden="true"><div className="shape paper-blue"><span>ZY / 07+</span></div><div className="shape grid-paper" /><div className="shape glass-circle" /><div className="shape black-bar" /><div className="shape torn-paper">DESIGN<br />DIRECTION</div><div className="shape line-mark">↘</div></div>
        <div className="cn-name hero-layer layer-4"><span>周颖</span><small>游戏视觉设计师</small></div>
        <div className="side-note">BASED IN GUANGZHOU · FOCUS ON GAME VISUAL & AIGC</div>
        <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><i><ArrowDown size={15} /></i></a>
        <div className="hero-index">NO. 01 / 03</div>
      </section>

      <section className="about section-shell" id="about" ref={aboutRef}>
        <div className="section-kicker reveal">01 — ABOUT ME</div>
        <div className="about-grid">
          <div className="about-portrait reveal" aria-label="周颖个人视觉图形">
            <span className="portrait-label about-symbol-layer symbol-layer-1">ZHOU YING / PERSONAL MARK</span>
            <div className="zy-symbol about-symbol-layer symbol-layer-2" aria-hidden="true"><span>Z</span><span>Y</span></div>
            <div className="symbol-paper about-symbol-layer symbol-layer-3"><span>07+</span><small>GAME VISUAL<br />DIRECTION</small></div>
            <div className="portrait-disc about-symbol-layer symbol-layer-4" />
            <div className="portrait-line about-symbol-layer symbol-layer-5" />
            <div className="symbol-note about-symbol-layer symbol-layer-6">GUANGZHOU<br />2019—2026<br />ZY / 01</div>
          </div>
          <div className="about-copy reveal">
            <p className="eyebrow">GAME VISUAL DESIGNER · GUANGZHOU</p>
            <h2>Key visual design.<br />Campaign rollout.<br />Store asset production.</h2>
            <p className="intro">我是一名拥有七年以上经验的游戏视觉设计师，长期参与日本、韩国、港澳台、东南亚及欧美市场的游戏发行项目。擅长从视觉概念、风格设定到多场景素材落地，并持续探索 AIGC 在游戏视觉工作流程中的实际应用。</p>
            <div className="capability-list">{capabilities.map((item, index) => <span key={item}><b>{String(index + 1).padStart(2,'0')}</b>{item}</span>)}</div>
          </div>
        </div>
        <div className="stats reveal">{stats.map((stat, index) => <div key={stat}><strong>{index === 0 ? '7+' : String(index + 1).padStart(2,'0')}</strong><span>{stat}</span></div>)}</div>
      </section>

      <PortfolioWorks />

      <section className="contact" id="contact">
        <div className="contact-top reveal"><span>03 — CONTACT</span><span>BASED IN GUANGZHOU, CHINA</span></div>
        <h2 className="reveal">THANKS FOR<br /><em>WATCHING</em></h2>
        <p className="contact-lead reveal">LET’S CREATE SOMETHING<br />MEMORABLE TOGETHER.</p>
        <p className="contact-cn reveal">感谢浏览我的作品。如果你对我的设计或合作感兴趣，欢迎与我联系。</p>
        <div className="contact-grid reveal">
          <div className="contact-item"><small>EMAIL</small><span>13075298210@163.com</span></div>
          <div className="contact-item"><small>PHONE</small><span>+86 13075298210</span></div>
        </div>
        <div className="downloads reveal">
          <a href="/zhou-ying-resume.pdf" download><Download size={15} /> DOWNLOAD RESUME PDF / 下载简历</a>
        </div>
        <div className="contact-footer"><span>© 2026 ZHOU YING</span><a href="#top">BACK TO TOP <ArrowDown size={15} /></a></div>
      </section>
    </main>
  );
}
