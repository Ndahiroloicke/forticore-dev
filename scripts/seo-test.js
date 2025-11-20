/**
 * FortiCore SEO Quick Test Script
 * Run this to verify basic SEO elements are in place
 * 
 * Usage: node scripts/seo-test.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 FortiCore SEO Quick Test\n');
console.log('='.repeat(50));

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Helper function to test conditions
function test(description, condition, errorMsg = '') {
  totalTests++;
  if (condition) {
    console.log(`✅ ${description}`);
    passedTests++;
  } else {
    console.log(`❌ ${description}`);
    if (errorMsg) console.log(`   → ${errorMsg}`);
    failedTests++;
  }
}

// Test 1: Check if index.html exists
console.log('\n📄 Testing index.html...');
const indexPath = path.join(__dirname, '../index.html');
const indexExists = fs.existsSync(indexPath);
test('index.html file exists', indexExists, 'File not found');

if (indexExists) {
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  
  // Test meta tags
  test('Has <title> tag', indexContent.includes('<title>'), 'Title tag not found');
  test('Has meta description', indexContent.includes('name="description"'), 'Meta description not found');
  test('Has meta keywords', indexContent.includes('name="keywords"'), 'Meta keywords not found');
  test('Has canonical URL', indexContent.includes('rel="canonical"'), 'Canonical URL not found');
  test('Has viewport meta', indexContent.includes('name="viewport"'), 'Viewport meta not found');
  
  // Test Open Graph
  test('Has Open Graph title', indexContent.includes('property="og:title"'), 'OG title not found');
  test('Has Open Graph description', indexContent.includes('property="og:description"'), 'OG description not found');
  test('Has Open Graph image', indexContent.includes('property="og:image"'), 'OG image not found');
  
  // Test Twitter Cards
  test('Has Twitter Card', indexContent.includes('name="twitter:card"'), 'Twitter card not found');
  test('Has Twitter title', indexContent.includes('name="twitter:title"') || indexContent.includes('property="twitter:title"'), 'Twitter title not found');
  
  // Test Structured Data
  test('Has JSON-LD structured data', indexContent.includes('application/ld+json'), 'JSON-LD not found');
  test('Has SoftwareApplication schema', indexContent.includes('"@type": "SoftwareApplication"'), 'SoftwareApplication schema not found');
}

// Test 2: Check sitemap.xml
console.log('\n🗺️  Testing sitemap.xml...');
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
const sitemapExists = fs.existsSync(sitemapPath);
test('sitemap.xml exists', sitemapExists, 'File not found in /public');

if (sitemapExists) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  test('Sitemap has XML declaration', sitemapContent.startsWith('<?xml'), 'Not valid XML');
  test('Sitemap has urlset', sitemapContent.includes('<urlset'), 'Missing urlset tag');
  test('Sitemap has homepage URL', sitemapContent.includes('<loc>https://forticoredev.innov.rw/</loc>'), 'Homepage URL not found');
}

// Test 3: Check robots.txt
console.log('\n🤖 Testing robots.txt...');
const robotsPath = path.join(__dirname, '../public/robots.txt');
const robotsExists = fs.existsSync(robotsPath);
test('robots.txt exists', robotsExists, 'File not found in /public');

if (robotsExists) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
  test('robots.txt allows all', robotsContent.includes('User-agent: *'), 'User-agent not defined');
  test('robots.txt has sitemap', robotsContent.includes('Sitemap:'), 'Sitemap URL not specified');
  test('robots.txt allows crawling', robotsContent.includes('Allow: /'), 'Not allowing crawling');
}

// Test 4: Check manifest.json
console.log('\n📱 Testing manifest.json...');
const manifestPath = path.join(__dirname, '../public/manifest.json');
const manifestExists = fs.existsSync(manifestPath);
test('manifest.json exists', manifestExists, 'File not found in /public');

if (manifestExists) {
  try {
    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    test('Manifest has name', !!manifestContent.name, 'Name property missing');
    test('Manifest has description', !!manifestContent.description, 'Description property missing');
    test('Manifest has icons', manifestContent.icons && manifestContent.icons.length > 0, 'No icons defined');
    test('Manifest has start_url', !!manifestContent.start_url, 'start_url missing');
    test('Manifest has theme_color', !!manifestContent.theme_color, 'theme_color missing');
  } catch (e) {
    test('Manifest is valid JSON', false, 'Invalid JSON format');
  }
}

// Test 5: Check package.json
console.log('\n📦 Testing package.json...');
const packagePath = path.join(__dirname, '../package.json');
const packageExists = fs.existsSync(packagePath);
test('package.json exists', packageExists, 'File not found');

if (packageExists) {
  try {
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    test('Package has name', packageContent.name === 'forticore', 'Name should be "forticore"');
    test('Package has description', !!packageContent.description, 'Description missing');
    test('Package has keywords', packageContent.keywords && packageContent.keywords.length > 0, 'No keywords defined');
    test('Package has homepage', !!packageContent.homepage, 'Homepage URL missing');
  } catch (e) {
    test('Package.json is valid JSON', false, 'Invalid JSON format');
  }
}

// Test 6: Check SEO component
console.log('\n⚛️  Testing SEO Component...');
const seoComponentPath = path.join(__dirname, '../src/components/SEO.tsx');
const seoComponentExists = fs.existsSync(seoComponentPath);
test('SEO.tsx component exists', seoComponentExists, 'File not found in /src/components');

// Test 7: Check SEO utils
console.log('\n🛠️  Testing SEO Utils...');
const seoUtilsPath = path.join(__dirname, '../src/lib/seo-utils.ts');
const seoUtilsExists = fs.existsSync(seoUtilsPath);
test('seo-utils.ts exists', seoUtilsExists, 'File not found in /src/lib');

// Test 8: Check additional files
console.log('\n📋 Testing Additional Files...');
test('humans.txt exists', fs.existsSync(path.join(__dirname, '../public/humans.txt')), 'File not found');
test('browserconfig.xml exists', fs.existsSync(path.join(__dirname, '../public/browserconfig.xml')), 'File not found');
test('.htaccess exists', fs.existsSync(path.join(__dirname, '../public/.htaccess')), 'File not found');

// Test 9: Check vercel.json
console.log('\n⚡ Testing Vercel Configuration...');
const vercelPath = path.join(__dirname, '../vercel.json');
const vercelExists = fs.existsSync(vercelPath);
test('vercel.json exists', vercelExists, 'File not found');

if (vercelExists) {
  try {
    const vercelContent = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
    test('Vercel has headers config', !!vercelContent.headers, 'Headers not configured');
    test('Vercel has cleanUrls', vercelContent.cleanUrls === true, 'cleanUrls not enabled');
    test('Vercel has trailingSlash', vercelContent.trailingSlash === false, 'trailingSlash should be false');
  } catch (e) {
    test('vercel.json is valid JSON', false, 'Invalid JSON format');
  }
}

// Test 10: Check vite.config.ts
console.log('\n⚡ Testing Vite Configuration...');
const viteConfigPath = path.join(__dirname, '../vite.config.ts');
const viteConfigExists = fs.existsSync(viteConfigPath);
test('vite.config.ts exists', viteConfigExists, 'File not found');

if (viteConfigExists) {
  const viteContent = fs.readFileSync(viteConfigPath, 'utf-8');
  test('Vite has build config', viteContent.includes('build:'), 'Build configuration not found');
  test('Vite has optimizeDeps', viteContent.includes('optimizeDeps'), 'optimizeDeps not configured');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(50));
console.log(`Total Tests: ${totalTests}`);
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);

const successRate = ((passedTests / totalTests) * 100).toFixed(1);
console.log(`\n🎯 Success Rate: ${successRate}%`);

if (successRate >= 95) {
  console.log('\n🏆 EXCELLENT! Your SEO setup is nearly perfect!');
} else if (successRate >= 85) {
  console.log('\n✅ GOOD! Minor improvements needed.');
} else if (successRate >= 70) {
  console.log('\n⚠️  FAIR! Some issues need attention.');
} else {
  console.log('\n❌ NEEDS WORK! Please review failed tests.');
}

console.log('\n📚 Next Steps:');
console.log('1. Run: npm run build');
console.log('2. Run: npm run preview');
console.log('3. Open Chrome DevTools → Lighthouse');
console.log('4. Run SEO audit and aim for 100/100');
console.log('\nFor detailed testing, see: SEO_TESTING_GUIDE.md');
console.log('='.repeat(50) + '\n');

// Exit with error code if tests failed
process.exit(failedTests > 0 ? 1 : 0);

