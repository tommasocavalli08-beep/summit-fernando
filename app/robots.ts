import {siteOrigin} from './site-origin';
export default function robots(){return {rules:{userAgent:'*',allow:'/',disallow:'/api/'},sitemap:siteOrigin+'/sitemap.xml'}}
