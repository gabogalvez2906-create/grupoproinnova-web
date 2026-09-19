import { chromium } from 'playwright'
import path from 'path'

// Same page, but on the machine's real GPU (ANGLE/D3D) in a headed window,
// which is what the user actually sees. SwiftShader hides driver-specific
// shader failures.
const [url, out, prefix = 'gpu'] = process.argv.slice(2)

const browser = await chromium.launch({
  args: ['--use-angle=d3d11', '--use-gl=angle', '--ignore-gpu-blocklist'],
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const logs = []
page.on('console', (m) => logs.push(m.type().toUpperCase() + ': ' + m.text()))
page.on('pageerror', (e) => logs.push('PAGEERROR: ' + (e.stack || e.message)))
page.on('weberror', (e) => logs.push('WEBERROR: ' + e.error()))

await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 })
await page.waitForTimeout(4000)

const gl = await page.evaluate(() => {
  const c = document.querySelector('canvas')
  if (!c) return { canvas: false }
  const ctx = c.getContext('webgl2') || c.getContext('webgl')
  const dbg = ctx && ctx.getExtension('WEBGL_debug_renderer_info')
  return {
    canvas: true,
    size: [c.width, c.height],
    lost: ctx ? ctx.isContextLost() : 'no-ctx',
    renderer: dbg ? ctx.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'n/a',
  }
})
console.log('GL:', JSON.stringify(gl))

const pin = await page.evaluate(() => {
  const sp = document.querySelector('.hero-build')?.parentElement
  if (!sp?.classList.contains('pin-spacer')) return null
  const top = sp.getBoundingClientRect().top + window.scrollY
  return { start: top, end: top + sp.offsetHeight - window.innerHeight }
})
console.log('PIN:', JSON.stringify(pin))

for (const f of (process.env.FRACS || '0,0.3,0.6,1').split(',').map(Number)) {
  await page.evaluate((y) => {
    if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true })
    else window.scrollTo({ top: y, behavior: 'instant' })
  }, pin ? pin.start + (pin.end - pin.start) * f : 0)
  await page.waitForTimeout(1800)
  await page.screenshot({ path: path.join(out, `${prefix}_${Math.round(f * 100)}.png`), timeout: 60000 })
}

console.log('LOGS:')
for (const l of logs.slice(0, 40)) console.log('  ' + l.slice(0, 400))
await browser.close()
