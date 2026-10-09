// Validates docs/google-ads/campana.json against Google Ads limits and writes the
// CSVs to import with Google Ads Editor. Usage: node scripts/build-google-ads.mjs
import fs from 'fs'
import path from 'path'

const dir = path.resolve('docs/google-ads')
const c = JSON.parse(fs.readFileSync(path.join(dir, 'campana.json'), 'utf8'))
const camp = c.campaign.name
const problems = []
const check = (what, text, max) => { if ([...text].length > max) problems.push(`${what}: "${text}" tiene ${[...text].length} (máx. ${max})`) }

for (const g of c.adGroups) {
  if (g.headlines.length < 3 || g.headlines.length > 15) problems.push(`${g.name}: ${g.headlines.length} títulos (3-15)`)
  if (g.descriptions.length < 2 || g.descriptions.length > 4) problems.push(`${g.name}: ${g.descriptions.length} descripciones (2-4)`)
  if (new Set(g.headlines).size !== g.headlines.length) problems.push(`${g.name}: títulos repetidos`)
  g.headlines.forEach((h) => check(`${g.name} título`, h, 30))
  g.descriptions.forEach((d) => check(`${g.name} descripción`, d, 90))
  g.path.forEach((p) => check(`${g.name} ruta`, p, 15))
}
c.sitelinks.forEach((s) => { check('sitelink', s.text, 25); check('sitelink d1', s.d1, 35); check('sitelink d2', s.d2, 35) })
c.callouts.forEach((t) => check('texto destacado', t, 25))
c.structuredSnippet.values.forEach((t) => check('fragmento', t, 25))

if (problems.length) { console.error('NO CUMPLE LÍMITES:\n- ' + problems.join('\n- ')); process.exit(1) }

const csv = (rows) => rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n') + '\r\n'
const matchOf = (k) => (k.startsWith('[') ? 'Exact' : k.startsWith('"') ? 'Phrase' : 'Broad')
const bare = (k) => k.replace(/^[\["]|[\]"]$/g, '')

const kw = [['Campaign', 'Ad Group', 'Keyword', 'Criterion Type', 'Final URL']]
for (const g of c.adGroups) for (const k of g.keywords) kw.push([camp, g.name, bare(k), matchOf(k), g.finalUrl])

const H = Array.from({ length: 15 }, (_, i) => `Headline ${i + 1}`)
const D = Array.from({ length: 4 }, (_, i) => `Description ${i + 1}`)
const ads = [['Campaign', 'Ad Group', 'Ad type', ...H, ...D, 'Path 1', 'Path 2', 'Final URL']]
for (const g of c.adGroups) {
  ads.push([camp, g.name, 'Responsive search ad', ...H.map((_, i) => g.headlines[i] ?? ''), ...D.map((_, i) => g.descriptions[i] ?? ''), g.path[0], g.path[1] ?? '', g.finalUrl])
}

const neg = [['Campaign', 'Keyword', 'Criterion Type']]
for (const n of c.negativeKeywords) neg.push([camp, n, 'Campaign Negative Phrase'])

// BOM so Excel and Google Ads Editor read the accents correctly.
const write = (name, rows) => fs.writeFileSync(path.join(dir, name), '﻿' + csv(rows))
write('palabras-clave.csv', kw)
write('anuncios.csv', ads)
write('negativas.csv', neg)

console.log(`OK — ${c.adGroups.length} grupos, ${kw.length - 1} palabras clave, ${ads.length - 1} anuncios, ${neg.length - 1} negativas. Todos los textos dentro de los límites.`)
