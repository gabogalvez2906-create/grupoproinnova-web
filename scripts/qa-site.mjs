import { chromium } from 'playwright'

// Full-site QA. node scripts/qa-site.mjs [origin]
// Every sitemap page at desktop and phone width: console/network errors, SEO head,
// headings, JSON-LD, broken images, dead links and anchors, overflow, contact data.
const origin = (process.argv[2] || 'https://grupoproinnova.com').replace(/\/$/, '')
const issues = []
const note = (page, msg) => issues.push(`${page.replace(origin, '') || '/'}  →  ${msg}`)

const sm = await (await fetch(origin + '/sitemap.xml')).text()
const pages = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace('https://grupoproinnova.com', origin))
pages.push(origin + '/pagina-que-no-existe/')

const browser = await chromium.launch({ args: ['--use-angle=d3d11', '--use-gl=angle', '--ignore-gpu-blocklist'] })
const links = new Map() // url -> first page that links to it
const heads = []
const facts = []

for (const vp of [{ w: 1440, h: 900, name: 'escritorio' }, { w: 390, h: 844, name: 'móvil' }]) {
  for (const url of pages) {
    const is404 = url.includes('no-existe')
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } })
    const errs = []
    page.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 160)))
    page.on('pageerror', (e) => errs.push('JS: ' + e.message.slice(0, 160)))
    page.on('response', (r) => { if (r.status() >= 400 && !(is404 && r.url() === url)) errs.push(`HTTP ${r.status()} ${r.url().replace(origin, '')}`) })
    const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 })
    if (!is404 && res.status() !== 200) note(url, `[${vp.name}] responde ${res.status()}`)
    if (is404 && res.status() !== 404) note(url, `la página inexistente responde ${res.status()} (debería ser 404)`)
    await page.waitForTimeout(1500)

    // Walk the page so lazy images and scroll-driven sections actually load.
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < height; y += vp.h * 0.8) {
      await page.evaluate((v) => { if (window.__lenis) window.__lenis.scrollTo(v, { immediate: true }); else window.scrollTo({ top: v, behavior: 'instant' }) }, y)
      await page.waitForTimeout(140)
    }
    await page.waitForTimeout(900)

    const d = await page.evaluate(() => {
      const q = (s) => document.querySelector(s)
      const meta = (n) => q(`meta[name="${n}"]`)?.content ?? q(`meta[property="${n}"]`)?.content ?? null
      let ld = []
      let ldError = null
      for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
        try { ld.push(JSON.parse(s.textContent)) } catch (e) { ldError = e.message }
      }
      const vw = document.documentElement.clientWidth
      const wide = [...document.querySelectorAll('body *')].filter((e) => {
        const r = e.getBoundingClientRect()
        return r.width > 0 && r.right > vw + 2 && getComputedStyle(e).position !== 'fixed'
      }).slice(0, 3).map((e) => e.className?.toString().slice(0, 40) || e.tagName)
      return {
        title: document.title,
        desc: meta('description'),
        canonical: q('link[rel="canonical"]')?.href ?? null,
        robots: meta('robots'),
        ogImage: meta('og:image'),
        ogTitle: meta('og:title'),
        lang: document.documentElement.lang,
        h1: [...document.querySelectorAll('h1')].map((h) => h.innerText.replace(/\s+/g, ' ').trim()),
        emptyHeadings: [...document.querySelectorAll('h1,h2,h3')].filter((h) => !h.innerText.trim()).length,
        ld, ldError,
        overflow: document.documentElement.scrollWidth > vw + 1,
        wide,
        brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
        noAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
        anchors: [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.getAttribute('href'), abs: a.href, text: a.innerText.trim().slice(0, 30), blank: a.target === '_blank', rel: a.rel })),
        ids: [...document.querySelectorAll('[id]')].map((e) => e.id),
        text: document.body.innerText,
        invisibleText: [...document.querySelectorAll('h1,h2,h3,p,li')].filter((e) => {
          const s = getComputedStyle(e); const r = e.getBoundingClientRect()
          return e.innerText.trim() && r.width > 0 && (s.opacity === '0' || s.visibility === 'hidden') && !e.closest('[aria-hidden="true"]')
        }).slice(0, 4).map((e) => e.innerText.trim().slice(0, 40)),
      }
    })

    const tag = `[${vp.name}]`
    if (errs.length) note(url, `${tag} errores: ${[...new Set(errs)].slice(0, 4).join(' | ')}`)
    if (d.overflow) note(url, `${tag} desborde horizontal (${d.wide.join(', ')})`)
    if (d.brokenImgs.length) note(url, `${tag} imágenes rotas: ${d.brokenImgs.slice(0, 3).join(', ')}`)
    if (d.invisibleText.length) note(url, `${tag} texto que quedó invisible: ${d.invisibleText.join(' / ')}`)

    if (vp.name === 'escritorio') {
      if (d.h1.length !== 1) note(url, `tiene ${d.h1.length} H1`)
      if (d.emptyHeadings) note(url, `${d.emptyHeadings} encabezados vacíos`)
      if (d.noAlt) note(url, `${d.noAlt} imágenes sin atributo alt`)
      if (d.lang !== 'es') note(url, `lang="${d.lang}"`)
      if (d.ldError) note(url, `JSON-LD inválido: ${d.ldError}`)
      if (!is404) {
        if (!d.title || d.title.length > 62) note(url, `título de ${d.title?.length} caracteres: "${d.title}"`)
        if (!d.desc || d.desc.length < 110 || d.desc.length > 162) note(url, `descripción de ${d.desc?.length} caracteres`)
        if (d.canonical !== url.replace(origin, 'https://grupoproinnova.com')) note(url, `canonical apunta a ${d.canonical}`)
        if (!d.ogImage) note(url, 'sin og:image'); else links.set(d.ogImage, url)
        if (/noindex/i.test(d.robots || '')) note(url, 'marcada noindex')
        heads.push({ url, title: d.title, desc: d.desc, h1: d.h1[0] })
      } else if (!/noindex/i.test(d.robots || '')) note(url, 'el 404 no está marcado noindex')

      for (const a of d.anchors) {
        if (!a.href || a.href.startsWith('mailto:') || a.href.startsWith('tel:')) continue
        if (a.href.startsWith('#')) { if (a.href.length > 1 && !d.ids.includes(a.href.slice(1))) note(url, `ancla rota ${a.href} ("${a.text}")`); continue }
        if (a.abs.startsWith(origin)) { if (!links.has(a.abs)) links.set(a.abs, url) }
        else if (!a.blank || !/noopener/.test(a.rel)) note(url, `enlace externo sin target/rel seguro: ${a.abs.slice(0, 60)}`)
      }
      facts.push({ url, text: d.text, anchors: d.anchors, ld: d.ld })
    }
    await page.close()
  }
}

// Every internal link and social image must resolve; same-page anchors must exist on the target.
for (const [link, from] of links) {
  const [base, hash] = link.split('#')
  const r = await fetch(base, { redirect: 'manual' })
  if (r.status !== 200) { note(from, `enlace a ${link.replace(origin, '')} responde ${r.status}`); continue }
  if (hash) { const html = await r.text(); if (!new RegExp(`id="${hash}"`).test(html)) note(from, `enlace a ancla inexistente ${link.replace(origin, '')}`) }
}

// Uniqueness
for (const key of ['title', 'desc', 'h1']) {
  const seen = new Map()
  for (const h of heads) { if (seen.has(h[key])) note(h.url, `${key} duplicado con ${seen.get(h[key]).replace(origin, '')}`); else seen.set(h[key], h.url) }
}

// Contact data must be identical everywhere.
const PHONES = ['+502 4142 0285', '+502 4214 1321']
for (const f of facts) {
  const tels = [...new Set(f.anchors.filter((a) => a.href?.startsWith('tel:')).map((a) => a.href))]
  for (const t of tels) if (!['tel:+50241420285', 'tel:+50242141321'].includes(t)) note(f.url, `teléfono inesperado ${t}`)
  const mails = [...new Set(f.anchors.filter((a) => a.href?.startsWith('mailto:')).map((a) => a.href.split('?')[0]))]
  for (const m of mails) if (m !== 'mailto:contacto@grupoproinnova.com') note(f.url, `correo inesperado ${m}`)
  const was = [...new Set(f.anchors.filter((a) => a.abs.includes('wa.me')).map((a) => a.abs.split('?')[0]))]
  for (const w of was) if (w !== 'https://wa.me/50242141321') note(f.url, `WhatsApp inesperado ${w}`)
  const found = (f.text.match(/\+502[\s\d]{9,}/g) || []).map((s) => s.trim().replace(/\s+/g, ' '))
  for (const p of new Set(found)) if (!PHONES.includes(p)) note(f.url, `teléfono escrito distinto: "${p}"`)
  if (!f.url.includes('no-existe') && !/7:00 a\. m\. a 7:00 p\. m\./.test(f.text)) note(f.url, 'no muestra el horario')
}

await browser.close()
console.log(`Páginas revisadas: ${pages.length} × 2 tamaños | enlaces internos e imágenes sociales comprobados: ${links.size}`)
console.log(issues.length ? `\n${issues.length} HALLAZGOS:\n- ` + [...new Set(issues)].join('\n- ') : '\nSin hallazgos.')
console.log('\nTítulos:'); for (const h of heads) console.log(`  ${String(h.title.length).padStart(2)}  ${h.title}`)
