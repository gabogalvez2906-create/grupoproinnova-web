import { chromium } from 'playwright'
const [url] = process.argv.slice(2)
const b = await chromium.launch({ args:['--use-angle=d3d11','--use-gl=angle','--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport:{width:1440,height:900} })
await p.goto(url,{waitUntil:'networkidle',timeout:120000}); await p.waitForTimeout(4000)
for (const y of [0, 1200, 2600]) {
  await p.evaluate(v => { if(window.__lenis) window.__lenis.scrollTo(v,{immediate:true}); else window.scrollTo({top:v,behavior:'instant'}) }, y)
  await p.waitForTimeout(800)
  const fps = await p.evaluate(() => new Promise(res => {
    let n = 0; const t0 = performance.now()
    const tick = () => { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(tick); else res(Math.round(n / ((performance.now()-t0)/1000))) }
    requestAnimationFrame(tick)
  }))
  console.log('scroll', y, '-> ~' + fps, 'fps')
}
await b.close()
