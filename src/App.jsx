import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiChevronUp, FiPhone, FiMail, FiMessageCircle } from 'react-icons/fi'
import biodata from './data'

// Navigation removed per request — single-page biodata layout only

function ScrollTop(){
  const [show, setShow] = useState(false)
  useEffect(()=>{
    function onScroll(){ setShow(window.scrollY>300) }
    window.addEventListener('scroll', onScroll)
    return ()=>window.removeEventListener('scroll', onScroll)
  },[])
  return show ? (
    <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} className="fixed right-6 bottom-6 bg-maroon text-white p-3 rounded-full shadow-soft">
      <FiChevronUp />
    </button>
  ) : null
}

function Hero({data, onOpen}){
  const name = (data.name || '').replace(/\t|Email:.*/gi,'').trim()
  const email = data.contact?.email || ''
  const phone = data.contact?.phone || ''
  const location = (data.location || '').replace(/Address[:\s]*/i, '').trim()
  
  return (
    <header className="pt-6 pb-8 text-center">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
        <div className="mx-auto w-48 h-48 rounded-full overflow-hidden border-8 border-yellow-600 shadow-lg mb-6">
          <img src={data.photo} alt={name} className="w-full h-full object-cover object-center" style={{objectPosition: 'center 15%'}} />
        </div>
        <h1 className="text-4xl font-bold text-amber-900 mb-1">{name}</h1>
        <p className="text-sm text-gray-600 mb-3">{email} • {phone}</p>
        <p className="text-sm text-gray-700 mb-4">{location}</p>
      </motion.div>
    </header>
  )
}

function MarqueeGallery({images, onOpen}){
  if(!images || images.length===0) return null
  const doubled = [...images, ...images]
  return (
    <div className="marquee-wrap overflow-hidden rounded-xl">
      <div className="marquee-track marquee">
        {doubled.map((src,i)=> (
          <motion.div key={i} className="flex-shrink-0 cursor-pointer" whileHover={{scale:1.05}} onClick={()=>onOpen(i%images.length)}>
            <img src={src} alt={`g-${i}`} className="gallery-image rounded-2xl shadow-md hover:shadow-lg transition-shadow" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function Lightbox({images, index, onClose}){
  if(index==null) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center lightbox-backdrop" onClick={onClose}>
      <motion.img initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} src={images[index]} className="max-w-4xl max-h-[90vh] rounded-lg"/>
    </div>
  )
}

export default function App(){
  const data = biodata || {}
  const [loading, setLoading] = useState(true)
  const [lightIndex, setLightIndex] = useState(null)

  useEffect(()=>{
    // preload images
    const imgs = data.images || []
    let loaded=0
    if(imgs.length===0) { setLoading(false); return }
    imgs.forEach(src=>{
      const img = new Image()
      img.src = src
      img.onload = ()=>{ loaded++; if(loaded===imgs.length) setLoading(false) }
      img.onerror = ()=>{ loaded++; if(loaded===imgs.length) setLoading(false) }
    })
  },[data.images])

  function openLight(i){ setLightIndex(i) }
  function closeLight(){ setLightIndex(null) }

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-6 pb-20">
        <Hero data={data} onOpen={openLight} />

        {data.about && (
          <motion.section id="about" className="mt-12 bg-white rounded-lg p-6 shadow-md" initial={{opacity:0, y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.2}} transition={{duration:0.6}}>
            <h2 className="text-2xl font-bold text-amber-900 mb-3">About Me</h2>
            <p className="text-gray-700 leading-relaxed">{data.about}</p>
          </motion.section>
        )}

        <motion.section id="education" className="mt-8 bg-white rounded-lg p-6 shadow-md" initial={{opacity:0, y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.15}} transition={{duration:0.6}}>
          <h3 className="font-bold text-amber-900 text-lg mb-4">Academic Qualification & Career</h3>
          
          {/* Education Timeline */}
          <div className="space-y-5 mb-6">
            {data.education && data.education.length ? (
              data.education.map((edu, i) => (
                <div key={i} className="border-l-4 border-yellow-600 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                    {edu.year && <span className="text-xs bg-yellow-100 text-amber-900 px-2 py-1 rounded">{edu.year}</span>}
                  </div>
                  {edu.grade && <p className="text-sm text-gray-700"><strong>Grade/Percentage:</strong> {edu.grade}</p>}
                  {edu.college && <p className="text-sm text-gray-700"><strong>Institution:</strong> {edu.college}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-600">Education details available in resume.</p>
            )}
          </div>

          {/* Career */}
          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Current Occupation</h4>
            <p className="text-gray-700">{data.occupation || 'Professional'}</p>
          </div>
        </motion.section>

        <motion.section id="family" className="mt-8 bg-white rounded-lg p-6 shadow-md" initial={{opacity:0, y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.15}} transition={{duration:0.6}}>
          <h3 className="font-bold text-amber-900 text-lg mb-5">Family Details</h3>
          
          {/* Ancestors */}
          {data.family?.ancestors && data.family.ancestors.length > 0 && (
            <div className="mb-4 pb-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Ancestors</h4>
              <div className="space-y-1 text-sm text-gray-700">
                {data.family.ancestors.map((a, i) => (
                  <p key={i}><strong>{a.relation}:</strong> {a.name}</p>
                ))}
              </div>
            </div>
          )}
          
          {/* Parents */}
          {data.family?.parents && data.family.parents.length > 0 && (
            <div className="mb-4 pb-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Parents</h4>
              <div className="space-y-1 text-sm text-gray-700">
                {data.family.parents.map((p, i) => (
                  <p key={i}><strong>{p.relation}:</strong> {p.name} — {p.occupation}</p>
                ))}
              </div>
            </div>
          )}
          
          {/* Uncle & Aunty */}
          {data.family?.uncleAunty && data.family.uncleAunty.length > 0 && (
            <div className="mb-4 pb-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Uncle & Aunty</h4>
              <div className="space-y-1 text-sm text-gray-700">
                {data.family.uncleAunty.map((u, i) => (
                  <p key={i}><strong>{u.relation}:</strong> {u.name}</p>
                ))}
              </div>
            </div>
          )}
          
          {/* Siblings */}
          {data.family?.siblings && data.family.siblings.length > 0 && (
            <div className="mb-4 pb-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Siblings</h4>
              <div className="space-y-2 text-sm text-gray-700">
                {data.family.siblings.map((s, i) => (
                  <div key={i} className="bg-gray-50 p-2 rounded">
                    <p><strong>{s.name}</strong> — {s.relation} — {s.occupation}</p>
                    {s.spouse && <p className="text-xs text-gray-600">Spouse: {s.spouse}</p>}
                    {s.children && s.children.length > 0 && <p className="text-xs text-gray-600">Children: {s.children.join(', ')}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Home Address */}
          {data.family?.address && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Home Address</h4>
              <p className="text-sm text-gray-700 mb-3">{data.family.address}</p>
              {data.family?.mapLink && (
                <a href={data.family.mapLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors">
                  📍 View Location on Map
                </a>
              )}
            </div>
          )}
        </motion.section>

        <motion.section id="lifestyle" className="mt-8 bg-white rounded-lg p-6 shadow-md" initial={{opacity:0, y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.15}} transition={{duration:0.6}}>
          <h3 className="font-bold text-amber-900 text-lg mb-3">Lifestyle & Interests</h3>
          <p className="mt-2 text-gray-700">{(data.hobbies && data.hobbies.join(', ')) || 'Not specified'}</p>
        </motion.section>



        <motion.section id="gallery" className="mt-8 bg-white rounded-lg p-6 shadow-md" initial={{opacity:0, y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.15}} transition={{duration:0.6}}>
          <h3 className="font-bold text-amber-900 text-lg mb-4 text-center">Photo Gallery</h3>
          {loading ? (
            <div className="text-center py-8 text-gray-600">Loading images...</div>
          ) : (
            <MarqueeGallery images={data.images} onOpen={openLight} />
          )}
        </motion.section>

        <motion.section id="contact" className="mt-10 bg-white rounded-lg p-6 shadow-md" initial={{opacity:0, y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.15}} transition={{duration:0.6}}>
          <h3 className="font-bold text-amber-900 text-lg mb-3">Contact</h3>
          <div className="mt-3 flex gap-3">
            {data.contact?.phone && (
              <a className="btn flex items-center gap-2" href={`https://wa.me/${data.contact.phone.replace(/[^0-9]/g,'')}`} target="_blank"> <FiMessageCircle /> WhatsApp</a>
            )}
            {data.contact?.phone && (
              <a className="btn flex items-center gap-2" href={`tel:${data.contact.phone}`}> <FiPhone /> Call</a>
            )}
            {data.contact?.email && (
              <a className="btn flex items-center gap-2" href={`mailto:${data.contact.email}`}> <FiMail /> Email</a>
            )}
          </div>
        </motion.section>
      </main>

      <ScrollTop />
      <Lightbox images={data.images||[]} index={lightIndex} onClose={closeLight} />
    </div>
  )
}
