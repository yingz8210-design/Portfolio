export type WorkCategory = {
  id: string;
  en: string;
  cn: string;
};

export type Work = {
  id: string;
  code: string;
  title: string;
  category: string;
  market: string;
  year: string;
  ratio: '16-9' | '1-1' | '300-157';
  tone: number;
  src?: string;
  width?: number;
  height?: number;
  sourceName?: string;
  transparent?: boolean;
  section?: string;
  merchandiseType?: string;
};

export const categories: WorkCategory[] = [
  { id:'campaign-design', en:'CAMPAIGN DESIGN', cn:'联动活动设计' },
  { id:'store-visuals', en:'STORE VISUALS', cn:'商店图设计' },
  { id:'advertising-banners', en:'ADVERTISING BANNERS', cn:'广告 BANNER' },
  { id:'social-campaign', en:'SOCIAL CAMPAIGN', cn:'社群活动图' },
];

export const works: Work[] = [
  { id:'store-01', code:'S01', title:'Storefront Key Art', category:'store-visuals', market:'JAPAN', year:'2025', ratio:'1-1', tone:0 },
  { id:'store-02', code:'S02', title:'Seasonal Store Visuals', category:'store-visuals', market:'KOREA', year:'2025', ratio:'16-9', tone:1 },
  { id:'store-03', code:'S03', title:'Feature Graphic System', category:'store-visuals', market:'HK / TW', year:'2024', ratio:'1-1', tone:2 },
  { id:'store-04', code:'S04', title:'Launch Store Package', category:'store-visuals', market:'SEA', year:'2024', ratio:'300-157', tone:3 },
  { id:'store-05', code:'S05', title:'Version Update Visual', category:'store-visuals', market:'GLOBAL', year:'2023', ratio:'1-1', tone:4 },
  { id:'store-06', code:'S06', title:'Store Asset Collection', category:'store-visuals', market:'JAPAN', year:'2023', ratio:'1-1', tone:5 },

  { id:'campaign-01', code:'C01', title:'Collaboration Campaign', category:'campaign-design', market:'HK / TW', year:'2025', ratio:'16-9', tone:2 },
  { id:'campaign-02', code:'C02', title:'Launch Campaign Toolkit', category:'campaign-design', market:'SEA', year:'2025', ratio:'1-1', tone:3 },
  { id:'campaign-03', code:'C03', title:'Seasonal Event Visual', category:'campaign-design', market:'JAPAN', year:'2024', ratio:'1-1', tone:0 },
  { id:'campaign-04', code:'C04', title:'Anniversary Campaign', category:'campaign-design', market:'KOREA', year:'2024', ratio:'300-157', tone:1 },
  { id:'campaign-05', code:'C05', title:'IP Collaboration Key Art', category:'campaign-design', market:'GLOBAL', year:'2023', ratio:'1-1', tone:4 },
  { id:'campaign-06', code:'C06', title:'Campaign Extension Set', category:'campaign-design', market:'HK / TW', year:'2023', ratio:'16-9', tone:5 },

  { id:'social-01', code:'SC01', title:'Community Event Series', category:'social-campaign', market:'GLOBAL', year:'2025', ratio:'1-1', tone:4 },
  { id:'social-02', code:'SC02', title:'Live Update Social Kit', category:'social-campaign', market:'JAPAN', year:'2025', ratio:'1-1', tone:5 },
  { id:'social-03', code:'SC03', title:'Festival Social Visual', category:'social-campaign', market:'SEA', year:'2024', ratio:'300-157', tone:2 },
  { id:'social-04', code:'SC04', title:'Community Challenge', category:'social-campaign', market:'KOREA', year:'2024', ratio:'16-9', tone:0 },
  { id:'social-05', code:'SC05', title:'Content Calendar Set', category:'social-campaign', market:'HK / TW', year:'2023', ratio:'1-1', tone:3 },
  { id:'social-06', code:'SC06', title:'Player Engagement Kit', category:'social-campaign', market:'GLOBAL', year:'2023', ratio:'1-1', tone:1 },

  { id:'ads-01', code:'AD01', title:'Performance Creative Set', category:'advertising-banners', market:'US / EU', year:'2025', ratio:'300-157', tone:1 },
  { id:'ads-02', code:'AD02', title:'Localized Banner System', category:'advertising-banners', market:'SEA', year:'2025', ratio:'1-1', tone:0 },
  { id:'ads-03', code:'AD03', title:'Acquisition Banner Kit', category:'advertising-banners', market:'JAPAN', year:'2024', ratio:'16-9', tone:3 },
  { id:'ads-04', code:'AD04', title:'Media Placement Set', category:'advertising-banners', market:'KOREA', year:'2024', ratio:'1-1', tone:2 },
  { id:'ads-05', code:'AD05', title:'Launch Advertising Set', category:'advertising-banners', market:'GLOBAL', year:'2023', ratio:'1-1', tone:5 },
  { id:'ads-06', code:'AD06', title:'A/B Creative Study', category:'advertising-banners', market:'US / EU', year:'2023', ratio:'300-157', tone:4 },

];

export function getCategory(id: string) {
  return categories.find((category) => category.id === id);
}
