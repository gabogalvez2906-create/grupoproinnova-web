import { chromium } from 'playwright'
import path from 'path'
const [url, out, prefix='sec', w='1440', h='900'] = process.argv.slice(2)
const ids = (process.env.IDS || 'quienes-somos,valores,servicios,metodologia,casos,contacto').split(',')
const browser = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width:+w, height:+h } })
const errors = []
page.on('console', m => m.type()==='error' && errors.push(m.text()))
page.on('pageerror', e => errors.push('PAGEERROR: '+e.message))
await page.goto(url, { waitUntil:'networkidle', timeout:120000 })
await page.waitForTimeout(3000)
for (const spec of ids) {
  const [id, off] = spec.split("+")
  const y = await page.evaluate(i => { const el=document.getElementById(i); return el ? el.getBoundingClientRect().top + window.scrollY : null }, id)
  if (y == null) { console.log('MISSING id', id); continue }
  const target = y + (+off || 0)
  await page.evaluate(yy => { if (window.__lenis) window.__lenis.scrollTo(yy,{immediate:true}); else window.scrollTo({top:yy,behavior:'instant'}) }, target)
  await page.waitForTimeout(1200)
  await page.screenshot({ path: path.join(out, `${prefix}_${id}${off?"_"+off:""}.png`), animations: 'disabled', timeout: 60000 })
}
const docH = await page.evaluate(() => document.documentElement.scrollHeight)
console.log('page height:', docH, '| overflow:', await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth))
console.log('ERRORS:', errors.length ? JSON.stringify(errors.slice(0,5)) : 'none')
await browser.close()
