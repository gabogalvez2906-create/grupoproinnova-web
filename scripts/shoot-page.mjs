import { chromium } from 'playwright'
import path from 'path'
// Usage: node scripts/shoot-page.mjs <url> <outDir> <prefix> [scrollYs comma] [w] [h]
const [url, out, prefix, ys = '0', w = '1440', h = '900'] = process.argv.slice(2)
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--use-gl=angle', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: +w, height: +h } })
const errs = []
p.on('console', m => m.type() === 'error' && errs.push(m.text()))
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message))
await p.goto(url, { waitUntil: 'networkidle', timeout: 120000 }); await p.waitForTimeout(2500)
for (const y of ys.split(',').map(Number)) {
  await p.evaluate(v => { if (window.__lenis) window.__lenis.scrollTo(v, { immediate: true }); else window.scrollTo({ top: v, behavior: 'instant' }) }, y)
  await p.waitForTimeout(1500)
  await p.screenshot({ path: path.join(out, `${prefix}_${y}.png`), animations: 'disabled', timeout: 60000 })
}
console.log('h1:', await p.evaluate(() => document.querySelector('h1')?.innerText.replace(/\s+/g, ' ')), '| alto:', await p.evaluate(() => document.documentElement.scrollHeight), '| overflow:', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), '| errores:', errs.length ? JSON.stringify(errs.slice(0, 3)) : 'ninguno')
await b.close()
