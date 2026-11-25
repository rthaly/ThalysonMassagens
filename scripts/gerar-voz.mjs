// Uso (na raiz do projeto): npm i --no-save msedge-tts && node scripts/gerar-voz.mjs [pt|en|es]
// Rode de novo sempre que mudar o texto de uma sessão. Os mp3 ficam em public/voz/<idioma>/<sessão>.mp3.
// Gera um mp3 por sessão e por idioma com vozes masculinas neurais já existentes (Microsoft Edge Read Aloud).
// Lê o texto direto do projeto (pt: lib/content.ts; en/es: PACKAGES em legacy-experience.tsx) para não haver segunda cópia.
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts'

const ROOT = process.cwd()
const require = createRequire(ROOT + '/package.json')
const ts = require('typescript')
const run = (code) => ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.None, target: ts.ScriptTarget.ES2020 } }).outputText

// pt: fonte única
const content = run(fs.readFileSync(ROOT + '/lib/content.ts', 'utf8').replace(/export /g, ''))
const sessions = new Function(content + '; return sessions;')()

// en/es: bloco PACKAGES da Home
const src = fs.readFileSync(ROOT + '/components/legacy-experience.tsx', 'utf8')
const a = src.indexOf('const PT = (id: string)')
const b = src.indexOf('\n];', a) + 3
const block = run(src.slice(a, b).replace(/const PACKAGES: [^=]*= \[/, 'const PACKAGES = ['))
const PACKAGES = new Function('sessions', block + '; return PACKAGES;')(sessions)

const FLOW = { pt: 'O que acontece', en: 'What happens', es: 'Qué pasa' }
const VOICE = { pt: 'pt-BR-AntonioNeural', en: 'en-US-GuyNeural', es: 'es-MX-JorgeNeural' }
const esc = (t) => t.replace(/&/g, ' e ').replace(/</g, ' ').replace(/>/g, ' ').replace(/"/g, '')

const only = process.argv[2] // opcional: pt | en | es
let ok = 0, fail = 0
for (const lang of ['pt', 'en', 'es']) {
  if (only && only !== lang) continue
  const tts = new MsEdgeTTS()
  await tts.setMetadata(VOICE[lang], OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3)
  const dir = path.join(ROOT, 'public', 'voz', lang)
  fs.mkdirSync(dir, { recursive: true })
  for (const p of PACKAGES) {
    const L = p.L[lang]
    const text = `${L.title}. ${L.subtitle} ${FLOW[lang]}: ${L.flow.join('. ')}. ${L.desc || ''}`.replace(/\s+/g, ' ').trim()
    try {
      const { audioStream } = tts.toStream(esc(text), { rate: '-4%' })
      const chunks = []
      await new Promise((res, rej) => { audioStream.on('data', (d) => chunks.push(d)); audioStream.on('close', res); audioStream.on('error', rej) })
      const buf = Buffer.concat(chunks)
      if (buf.length < 5000) throw new Error('áudio vazio (' + buf.length + ' bytes)')
      fs.writeFileSync(path.join(dir, p.id + '.mp3'), buf)
      console.log(lang, p.id, Math.round(buf.length / 1024) + ' KB', VOICE[lang])
      ok++
    } catch (e) { console.log(lang, p.id, 'FALHOU:', e.message); fail++ }
  }
}
console.log('prontos:', ok, 'falhas:', fail)
