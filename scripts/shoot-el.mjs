import { chromium } from 'playwright'
// Scrolls an element into view and screenshots the viewport. node scripts/shoot-el.mjs <url> <out.png> <selector> [offset] [w] [h]
const [url, out, sel, off = '0', w = '1440', h = '900'] = process.argv.slice(2)
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--use-gl=angle', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: +w, height: +h } })
await p.goto(url, { waitUntil: 'networkidle', timeout: 120000 }); await p.waitForTimeout(3000)
const y = await p.evaluate(s => { const e = document.querySelector(s); return e ? e.getBoundingClientRect().top + scrollY : -1 }, sel)
await p.evaluate(v => { if (window.__lenis) window.__lenis.scrollTo(v, { immediate: true }); else window.scrollTo({ top: v, behavior: 'instant' }) }, y + +off)
await p.waitForTimeout(1800)
await p.screenshot({ path: out, animations: 'disabled', timeout: 60000 })
console.log('y', y, '| filas:', await p.evaluate(() => document.querySelectorAll('.services__row').length), '| overflow:', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth))
await b.close()
