/**
 * Dynamic Sitemap Generator for FortiCore
 * Run this script to automatically generate/update sitemap.xml
 * 
 * Usage: node scripts/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://forticoredev.innov.rw';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

// Define your routes here
const routes = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: 1.0,
  },
  {
    path: '/documentation',
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    path: '/features',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    path: '/installation',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    path: '/quick-start',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    path: '/configuration',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: '/customization',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: '/integration',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: '/trends',
    changefreq: 'weekly',
    priority: 0.6,
  },
  {
    path: '/faq',
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    path: '/login',
    changefreq: 'monthly',
    priority: 0.5,
  },
  {
    path: '/signup',
    changefreq: 'monthly',
    priority: 0.5,
  },
];

// Get current date in ISO format
const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Generate XML for a single URL
const generateUrlXml = (route) => {
  const lastmod = getCurrentDate();
  return `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
};

// Generate complete sitemap
const generateSitemap = () => {
  const urlsXml = routes.map(generateUrlXml).join('\n  \n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
${urlsXml}
  
</urlset>`;
};

// Write sitemap to file
const writeSitemap = () => {
  try {
    const sitemap = generateSitemap();
    fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf-8');
    console.log('✅ Sitemap generated successfully!');
    console.log(`📍 Location: ${OUTPUT_PATH}`);
    console.log(`📊 Total URLs: ${routes.length}`);
    console.log(`🌐 Base URL: ${SITE_URL}`);
    console.log(`📅 Last updated: ${getCurrentDate()}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  }
};

// Run the script
writeSitemap();

