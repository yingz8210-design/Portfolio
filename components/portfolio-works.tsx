'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { categories, getCategory, type Work } from '@/lib/works';
import { importedWorks } from '@/lib/work-images';
import { workCovers, type CoverSet } from '@/lib/work-covers';
import { compareWorks } from '@/lib/work-order';

const order = new Intl.Collator('en', { numeric:true, sensitivity:'base' });
function groupProjects(items:Work[]) {
  const groups = new Map<string, Work[]>();
  for (const item of items) groups.set(item.title, [...(groups.get(item.title) ?? []), item]);
  return [...groups].sort(([a],[b]) => order.compare(a,b)).map(([title,works]) => ({title,works}));
}

function Cover({ cover, square, mobileSwipe = false }: { cover:CoverSet; square:boolean; mobileSwipe?:boolean }) {
  const [frame, setFrame] = useState(0);
  const swipeRef = useRef<HTMLDivElement>(null);
  const updateSwipeFrame = () => {
    const track = swipeRef.current;
    if (!track || !track.clientWidth) return;
    setFrame(Math.min(cover.images.length - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth))));
  };
  return <article className="cover-card">
    <div ref={swipeRef} className={`cover-swap ${square ? 'square' : ''} ${mobileSwipe ? 'mobile-swipe' : ''}`} onScroll={mobileSwipe ? updateSwipeFrame : undefined} onPointerEnter={event => {if(!mobileSwipe && event.pointerType === 'mouse' && cover.images.length > 1) setFrame(1);}} onPointerLeave={event => {if(!mobileSwipe && event.pointerType === 'mouse') setFrame(0);}} aria-label={mobileSwipe ? `${cover.title}封面图，左右滑动切换` : undefined}>
      {cover.images.map((src,index) => <img key={src} className={`cover-frame ${frame === index ? 'is-active' : ''}`} src={src} alt={`${cover.title} — ${index+1}`} aria-hidden={frame !== index} loading="lazy" decoding="async" />)}
      {cover.images.length > 1 && (mobileSwipe ? <span className="cover-swipe-status" aria-hidden="true">SWIPE&nbsp;&nbsp;{String(frame+1).padStart(2,'0')} / {String(cover.images.length).padStart(2,'0')}</span> : <button className="cover-switch" type="button" onClick={() => setFrame((frame+1)%cover.images.length)} aria-label={`切换${cover.title}封面，当前第${frame+1}张，共${cover.images.length}张`}>{String(frame+1).padStart(2,'0')} / {String(cover.images.length).padStart(2,'0')}</button>)}
    </div>
    <div className="work-meta"><h3>{cover.title}</h3><span>{getCategory(cover.category)?.en}</span></div>
  </article>;
}

export default function PortfolioWorks() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [expanded, setExpanded] = useState(false);
  const [campaignPage, setCampaignPage] = useState(0);
  const [mobileCovers, setMobileCovers] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 720px)');
    const update = () => setMobileCovers(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const category = getCategory(activeCategory)!;
  const items = importedWorks.filter(work => work.category === activeCategory).sort(compareWorks);
  const groups = groupProjects(items);
  const campaign = groups[Math.min(campaignPage, Math.max(0, groups.length-1))];
  const covers = workCovers.filter(cover => cover.category === activeCategory);
  const scrollToStage = () => window.setTimeout(() => stageRef.current?.scrollIntoView({ behavior:'smooth', block:'start' }),0);
  const changeCategory = (id:string) => { setActiveCategory(id); setCampaignPage(0); if(expanded) scrollToStage(); };
  const renderCard = (work:Work, metadata = true) => <article className="work-card" key={work.id}>
    <div className={`work-art gallery-image ratio-${work.ratio} ${work.transparent ? 'transparent-art' : ''}`} style={{ aspectRatio:`${work.width ?? 16} / ${work.height ?? 9}` }}>
      <img src={work.src} width={work.width} height={work.height} alt={work.title} loading="lazy" decoding="async" />
    </div>
    {metadata && <div className="work-meta"><h3>{work.title}</h3><span>{category.en}</span><p>{work.market} · {work.year}</p></div>}
  </article>;
  const campaignSections = campaign ? [
    {id:'key-visual',title:'活动主视觉 / KEY VISUAL'},
    {id:'social',title:'社群图 / SOCIAL VISUALS'},
    {id:'merchandise',title:'周边延展 / MERCHANDISE'},
    {id:'other',title:'活动延展 / CAMPAIGN EXTENSIONS'},
  ] : [];

  return <section className="works section-shell" id="works">
    <div className="section-kicker">02 — PROJECTS</div>
    <div className="works-heading"><h2>WORKS</h2><p>2019—2026<br />Visual design across global game markets.</p></div>
    <div className="category-strip" aria-label="作品分类">{categories.map((item,index) => <button key={item.id} className={activeCategory === item.id ? 'active' : ''} type="button" aria-pressed={activeCategory === item.id} onClick={() => changeCategory(item.id)}><span>{String(index+1).padStart(2,'0')}</span>{item.en}<small>{item.cn}</small></button>)}</div>
    <div className="works-stage" ref={stageRef}>
      {!expanded ? <div className="works-cover-view" key={activeCategory}>
        {activeCategory === 'advertising-banners' ? <div className="cover-grid ads-cover-grid">{covers.map(cover => <Cover key={cover.id} cover={cover} square mobileSwipe={mobileCovers} />)}</div> : mobileCovers ? <div className="cover-mobile-list">{covers.map(cover => <Cover key={cover.id} cover={cover} square={false} mobileSwipe />)}</div> : <Carousel opts={{align:'start',slidesToScroll:1}} className="cover-carousel" aria-label={`${category.en}封面轮播`}><CarouselContent>{covers.map(cover => <CarouselItem className="cover-slide" key={cover.id}><Cover cover={cover} square={false} /></CarouselItem>)}</CarouselContent><div className="cover-carousel-controls"><CarouselPrevious aria-label="上一组封面"/><CarouselNext aria-label="下一组封面"/></div></Carousel>}
        <button className="works-view-more" type="button" onClick={() => {setExpanded(true);scrollToStage();}}><span><small>{category.cn}</small>查看更多 / VIEW MORE</span><ArrowUpRight /></button>
      </div> : <div className="works-sublevel" key={activeCategory}>
        <div className="works-subhead"><div><span>SELECTED CATEGORY</span><h3>{category.en}</h3><p>{category.cn} · {items.length} IMAGES</p></div><button className="works-back" type="button" onClick={() => {setExpanded(false);scrollToStage();}}>← 返回分类封面 / BACK</button></div>
        {activeCategory === 'campaign-design' && campaign ? <div className="campaign-detail" key={campaign.title}>
          <div className="campaign-title"><span>{String(campaignPage+1).padStart(2,'0')} / {String(groups.length).padStart(2,'0')}</span><h3>{campaign.title}</h3><p>{[...new Set(campaign.works.map(work => `${work.market} · ${work.year}`))].join(' / ')}</p></div>
          {campaignSections.map(section => {
            const sectionItems = campaign.works.filter(work => (work.section ?? 'other') === section.id);
            if (!sectionItems.length) return null;
            const merchandiseGroups = new Map<string,Work[]>();
            if(section.id === 'merchandise') for(const work of sectionItems) { const type=work.merchandiseType || '周边'; merchandiseGroups.set(type,[...(merchandiseGroups.get(type)??[]),work]); }
            return <section className={`campaign-section section-${section.id}`} key={section.id}><h4>{section.title}</h4>
              {section.id === 'merchandise' ? [...merchandiseGroups].map(([type,works]) => <div className="merchandise-board" key={type}><h5>{type}</h5><div className="project-work-grid">{works.map(work => renderCard(work,false))}</div></div>) : <div className={section.id === 'key-visual' ? 'campaign-key-visuals' : 'project-work-grid'}>{sectionItems.map(work => renderCard(work,false))}</div>}
            </section>;
          })}
          <div className="campaign-footer"><div className="other-campaigns">{Array.from({length:Math.min(3,groups.length-1)},(_,i) => {
            const index=(campaignPage+i+1)%groups.length;
            const project=groups[index];
            const preview=project.works.find(work=>work.section === 'key-visual')??project.works[0];
            return <button key={project.title} type="button" onClick={()=>{setCampaignPage(index);scrollToStage();}}><img src={preview.src} alt={project.title} loading="lazy" /><span>{project.title}</span></button>;
          })}</div><nav className="campaign-pages" aria-label="Campaign项目页码">{groups.map((group,index)=><button key={group.title} type="button" aria-label={`项目 ${index+1}: ${group.title}`} aria-current={campaignPage===index?'page':undefined} onClick={()=>{setCampaignPage(index);scrollToStage();}}>{String(index+1).padStart(2,'0')}</button>)}</nav></div>
        </div> : activeCategory === 'store-visuals' ? <div className="project-groups">{groups.map((group,index)=><section className="project-group" key={group.title}><div className="project-group-head"><span>{String(index+1).padStart(2,'0')}</span><h4>{group.title}</h4><p>{group.works.length} IMAGES</p></div><div className="project-work-grid">{group.works.map(work=>renderCard(work))}</div></section>)}</div> : <div className="project-work-grid ungrouped-gallery">{items.map(work=>renderCard(work))}</div>}
      </div>}
    </div>
    <p className="works-note">ART DIRECTION · VISUAL SYSTEM DEVELOPMENT · LOCALIZATION ADAPTATION · MULTI-FORMAT PRODUCTION</p>
  </section>;
}
