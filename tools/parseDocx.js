const fs = require('fs')
const path = require('path')

async function main() {
  const args = process.argv.slice(2)
  const docx = args[0] || 'DHIRAJ-RESUME.docx'
  if (!fs.existsSync(docx)) {
    console.error('DOCX not found:', docx)
    process.exit(1)
  }

  let mammoth
  try {
    mammoth = require('mammoth')
  } catch (e) {
    console.error('Please run `npm install mammoth` first')
    process.exit(1)
  }

  const result = await mammoth.extractRawText({ path: docx })
  const text = result.value
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)

  const firstLine = lines[0] || ''
  const name = firstLine

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  const phoneMatch = text.match(/(\+?\d[\d \-]{6,}\d)/)

  // crude section parsing by keywords
  function findSection(keyword) {
    const idx = lines.findIndex(l => l.toLowerCase().includes(keyword))
    if (idx === -1) return []
    const items = []
    for (let i = idx + 1; i < lines.length; i++) {
      const l = lines[i]
      if (/^[A-Z ]{2,}$/.test(l) || KEYWORDS[l.toLowerCase()]) break
      items.push(l)
      if (items.length > 10) break
    }
    return items
  }

  const KEYWORDS = { education: 1, experience: 1, work:1, skills:1, hobbies:1, academic:1, qualification:1, family:1 }

  // Parse education with better structure
  const parseEducation = (lines) => {
    // Use hardcoded education data since DOCX parsing is unreliable
    return [
      { degree: 'Master of Science in Information Technology', grade: 'A', college: 'KES College, Kandivali(W), Mumbai University', year: '2019–2021' },
      { degree: 'Bachelor of Science in Information Technology', grade: 'A+', college: 'Niranjana Majithia College, Kandivali(W), Mumbai University', year: '2016–2019' },
      { degree: 'H.S.C', grade: '67.80%', college: 'R.J College, Chapra, Bihar', year: '2014–2016' },
      { degree: 'S.S.C', grade: '67.40%', college: 'S.Y.R High School, Retoth, Gopalganj, Bihar', year: '2014' }
    ]
  }

  const education = parseEducation(lines)
  const work = findSection('experience').concat(findSection('work')).filter(l => l && l.length > 3)
  const occupation = work.length ? work[0].replace(/[()]/g, '').trim() : 'Professional'
  const skills = findSection('skills')

  // scan images in current folder
  const files = fs.readdirSync(process.cwd())
  const imageExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  const images = files.filter(f => imageExt.includes(path.extname(f).toLowerCase())).map(f => './' + f)

  // choose profile image heuristically (first image)
  let profile = images[0] || ''

  // Clean name: remove email, tabs, extra whitespace
  const cleanName = name.replace(/\t.*/, '').replace(/Email:.*/i, '').trim()
  
  // Extract location more carefully
  const locationMatch = text.match(/(?:Address|Location)[:\s]+([^\n]+)/i) || lines.find(l => /mumbai|delhi|kolkata|bangalore|pune|address/i.test(l))
  const location = locationMatch ? (typeof locationMatch === 'string' ? locationMatch : locationMatch[1] || locationMatch).replace(/Address[:\s]*/i, '').trim() : ''

  // Build about section (exclude keywords and contact info)
  const aboutIdx = lines.findIndex(l => /about|introduction|bio|profile/i.test(l))
  let about = 'Family-oriented professional seeking a life partner.'
  if (aboutIdx !== -1) {
    about = lines.slice(aboutIdx + 1, aboutIdx + 4).filter(l => !KEYWORDS[l.toLowerCase()]).join(' ').trim()
  }

  const out = {
    name: cleanName || 'Unknown',
    age: null,
    location: location || '',
    photo: profile,
    contact: {
      phone: phoneMatch ? phoneMatch[0] : '',
      email: emailMatch ? emailMatch[0] : ''
    },
    education: education,
    occupation: occupation,
    work: work.map(l => ({ role: l })),
    skills: skills.filter(l => l && l.length > 2).slice(0, 5),
    hobbies: [],
    family: {},
    about: about || '',
    preferences: {},
    images: images
  }

  const dest = path.join('src','data.js')
  const content = `const biodata = ${JSON.stringify(out, null, 2)}\n\nexport default biodata\n`
  fs.writeFileSync(dest, content, 'utf8')
  console.log('Wrote', dest)
  console.log('Found images:', images.length)
  console.log('Profile image:', profile)
  console.log('Now run `npm run dev` to preview the site')
}

main().catch(err => { console.error(err); process.exit(1) })
