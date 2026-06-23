import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiChevronUp, FiMail, FiMessageCircle, FiPhone, FiX } from 'react-icons/fi'
import biodata from './data'

const easeOutExpo = [0.22, 1, 0.36, 1]
const sectionViewport = { once: true, amount: 0.18 }

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easeOutExpo } }
}

const staggerContainer = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: easeOutExpo,
      staggerChildren: 0.08,
      delayChildren: 0.08
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.82, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.9, ease: easeOutExpo } }
}

const cardHover = {
  y: -6,
  scale: 1.01,
  transition: { duration: 0.3, ease: easeOutExpo }
}

const timelineItem = {
  hidden: ({ direction }) => ({ opacity: 0, x: direction === 'left' ? -36 : 36 }),
  show: ({ delay }) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.62, ease: easeOutExpo, delay }
  })
}

const familyNode = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: easeOutExpo, delay: index * 0.08 }
  })
}

const treePathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (index) => ({
    pathLength: 1,
    opacity: 0.72,
    transition: { duration: 0.85, ease: 'easeInOut', delay: 0.15 + index * 0.1 }
  })
}

const particles = [
  { left: '8%', top: '18%', size: 7, delay: '0s', duration: '15s' },
  { left: '18%', top: '72%', size: 5, delay: '1.5s', duration: '18s' },
  { left: '34%', top: '24%', size: 4, delay: '0.8s', duration: '16s' },
  { left: '52%', top: '82%', size: 6, delay: '2.4s', duration: '20s' },
  { left: '68%', top: '16%', size: 5, delay: '1.1s', duration: '17s' },
  { left: '82%', top: '62%', size: 8, delay: '3s', duration: '19s' },
  { left: '94%', top: '30%', size: 4, delay: '2s', duration: '16s' }
]

const petals = [
  { left: '6%', delay: '0s', duration: '18s', rotate: '-12deg' },
  { left: '21%', delay: '3s', duration: '22s', rotate: '18deg' },
  { left: '43%', delay: '1.5s', duration: '20s', rotate: '-24deg' },
  { left: '67%', delay: '5s', duration: '24s', rotate: '16deg' },
  { left: '88%', delay: '2.2s', duration: '19s', rotate: '-8deg' }
]

function ScrollProgress(){
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

  return <motion.div className="scroll-progress" style={{ scaleX }} />
}

function BackgroundEffects(){
  return (
    <div className="background-effects" aria-hidden="true">
      <div className="royal-pattern" />
      <div className="mandala mandala-left" />
      <div className="mandala mandala-right" />
      {particles.map((particle, index) => (
        <span
          key={index}
          className="gold-particle"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration
          }}
        />
      ))}
      {petals.map((petal, index) => (
        <span
          key={`petal-${index}`}
          className="floating-petal"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            transform: `rotate(${petal.rotate})`
          }}
        />
      ))}
    </div>
  )
}

function PageLoader(){
  return (
    <motion.div
      className="page-loader no-print"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: easeOutExpo }}
    >
      <motion.div
        className="loader-card"
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: easeOutExpo }}
      >
        <span className="loader-mandala" />
        <p>Preparing Biodata</p>
        <small>Loading profile beautifully…</small>
      </motion.div>
    </motion.div>
  )
}

function AnimatedSection({ id, className = '', children }){
  return (
    <motion.section
      id={id}
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={sectionViewport}
    >
      {children}
    </motion.section>
  )
}

function SectionHeading({ eyebrow, title, center = false }){
  return (
    <motion.div variants={fadeUp} className={`section-heading ${center ? 'section-heading-center' : ''}`}>
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <h3 className="section-title">{title}</h3>
      <span className="gold-divider" />
    </motion.div>
  )
}

function ScrollTop(){
  const [show, setShow] = useState(false)

  useEffect(() => {
    function onScroll(){
      setShow(window.scrollY > 360)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          className="back-to-top"
          initial={{ opacity: 0, y: 18, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.92 }}
          whileHover={{ y: -4, scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.28 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <FiChevronUp />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

function Hero({ data, onOpen }){
  const name = (data.name || '').replace(/\t|Email:.*/gi, '').trim()
  const email = data.contact?.email || ''
  const phone = data.contact?.phone || ''
  const location = (data.location || '').replace(/Address[:\s]*/i, '').trim()

  const contactItems = useMemo(() => [
    email && { label: 'Email', href: `mailto:${email}` },
    phone && { label: 'Call', href: `tel:${phone}` },
    location && { label: location }
  ].filter(Boolean), [email, phone, location])

  return (
    <header className="hero-section">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="hero-inner">
        <motion.p variants={fadeUp} className="hero-kicker">Wedding Biodata</motion.p>
        <motion.button
          type="button"
          aria-label="Open profile photo"
          className="profile-glow"
          variants={scaleIn}
          whileHover={cardHover}
          whileTap={{ scale: 0.98 }}
          onClick={() => onOpen?.(0)}
        >
          <img src={data.photo} alt={name} className="profile-photo" loading="lazy" decoding="async" />
        </motion.button>

        <motion.h1 variants={fadeUp} className="hero-name">{name}</motion.h1>
        <motion.div variants={staggerContainer} className="hero-contact-list">
          {contactItems.map((item, index) => item.href ? (
            <motion.a key={item.label} variants={fadeUp} href={item.href} className="hero-contact-pill">
              {item.label}
            </motion.a>
          ) : (
            <motion.p key={`${item.label}-${index}`} variants={fadeUp} className="hero-location">
              {item.label}
            </motion.p>
          ))}
        </motion.div>
      </motion.div>
    </header>
  )
}

function EducationTimeline({ education = [] }){
  if(!education.length){
    return <motion.p variants={fadeUp} className="text-gray-600">Education details available in resume.</motion.p>
  }

  return (
    <motion.div variants={fadeUp} className="education-timeline">
      <motion.div
        className="timeline-line"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={sectionViewport}
        transition={{ duration: 1.05, ease: easeOutExpo }}
      />

      {education.map((edu, index) => {
        const side = index % 2 === 0 ? 'left' : 'right'
        return (
          <motion.div
            key={`${edu.degree}-${index}`}
            className={`timeline-item timeline-${side} interactive-card`}
            custom={{ direction: side, delay: index * 0.1 }}
            variants={timelineItem}
            whileHover={cardHover}
          >
            <span className="timeline-dot" />
            <div className="timeline-content">
              <div className="flex justify-between items-start gap-3 mb-1">
                <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                {edu.year && <span className="timeline-year">{edu.year}</span>}
              </div>
              {edu.grade && <p className="text-sm text-gray-700"><strong>Grade/Percentage:</strong> {edu.grade}</p>}
              {edu.college && <p className="text-sm text-gray-700"><strong>Institution:</strong> {edu.college}</p>}
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

function MarqueeGallery({ images, onOpen }){
  if(!images || images.length === 0) return null
  const doubled = [...images, ...images]

  return (
    <motion.div variants={fadeUp} className="marquee-wrap" aria-label="Photo gallery">
      <div className="marquee-track">
        {doubled.map((src, index) => (
          <motion.div
            key={`${src}-${index}`}
            className="gallery-frame"
            role="button"
            tabIndex={0}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpen(index % images.length)}
            onKeyDown={(event) => {
              if(event.key === 'Enter') onOpen(index % images.length)
            }}
          >
            <img src={src} alt={`Gallery ${index + 1}`} className="gallery-image" loading="lazy" decoding="async" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function Lightbox({ images, index, onClose, onNext, onPrev }){
  const currentImage = images[index]

  return (
    <motion.div
      className="lightbox-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.26 }}
      onClick={onClose}
    >
      <motion.button
        type="button"
        aria-label="Close gallery"
        className="lightbox-close"
        whileHover={{ scale: 1.08, rotate: 4 }}
        whileTap={{ scale: 0.92 }}
        onClick={(event) => {
          event.stopPropagation()
          onClose()
        }}
      >
        <FiX />
      </motion.button>

      {images.length > 1 && (
        <>
          <motion.button
            type="button"
            aria-label="Previous photo"
            className="lightbox-nav lightbox-prev"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={(event) => {
              event.stopPropagation()
              onPrev()
            }}
          >
            <FiChevronLeft />
          </motion.button>

          <motion.button
            type="button"
            aria-label="Next photo"
            className="lightbox-nav lightbox-next"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={(event) => {
              event.stopPropagation()
              onNext()
            }}
          >
            <FiChevronRight />
          </motion.button>
        </>
      )}

      <AnimatePresence mode="wait">
        <motion.img
          key={currentImage}
          src={currentImage}
          alt="Selected gallery"
          className="lightbox-image"
          loading="lazy"
          decoding="async"
          variants={scaleIn}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, scale: 0.94, y: -12 }}
          transition={{ duration: 0.34, ease: easeOutExpo }}
          onClick={(event) => event.stopPropagation()}
        />
      </AnimatePresence>
    </motion.div>
  )
}

function PersonalDetails({ details = [] }){
  if(!details.length) return null

  return (
    <motion.div variants={staggerContainer} className="personal-grid">
      {details.map((detail) => (
        <motion.div key={detail.label} variants={fadeUp} className="personal-detail-card interactive-card" whileHover={cardHover}>
          <span>{detail.label}</span>
          <strong>{detail.value}</strong>
        </motion.div>
      ))}
    </motion.div>
  )
}

function FamilyTreeNode({
  className = '',
  badge,
  title,
  lines = [],
  index,
  branchId,
  isActive = false,
  isInActivePath = false,
  onActivate
}){
  function handleActivate(){
    onActivate?.(branchId)
  }

  function handleKeyDown(event){
    if(event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleActivate()
    }
  }

  return (
    <motion.div
      className={`family-tree-node interactive-card ${className} ${isActive ? 'is-active-branch' : ''} ${isInActivePath ? 'is-root-path-node' : ''}`}
      custom={index}
      variants={familyNode}
      whileHover={cardHover}
      whileTap={{ scale: 0.98 }}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
    >
      <span className="relationship-badge">{badge}</span>
      <strong>{title}</strong>
      {lines.map((line) => (
        <small key={line}>{line}</small>
      ))}
    </motion.div>
  )
}

function FamilyTree({ family, person }){
  const [activeBranch, setActiveBranch] = useState(null)
  if(!family) return null

  const getByLabel = (items, label) => items?.find((item) => item.label === label) || {}
  const grandfather = getByLabel(family.ancestors, 'Grand Father')
  const grandmother = getByLabel(family.ancestors, 'Grandmother')
  const father = getByLabel(family.parents, 'Father')
  const mother = getByLabel(family.parents, 'Mother')
  const uncle = getByLabel(family.uncleAunty, 'Uncle')
  const aunty = getByLabel(family.uncleAunty, 'Aunty')
  const siblings = family.siblings || []
  const uncleBranchNames = ['Abhishek Kumar Sinha', 'Anupriya Sinha']
  const parentBranch = siblings.filter((sibling) => !uncleBranchNames.includes(sibling.name))
  const uncleBranch = uncleBranchNames
    .map((name) => siblings.find((sibling) => sibling.name === name))
    .filter(Boolean)
  const personName = person?.name || 'Dhiraj Kumar'
  const parentChildIds = ['self', ...parentBranch.map((_, index) => `parent-child-${index + 1}`)]
  const uncleChildIds = uncleBranch.map((_, index) => `uncle-child-${index + 1}`)
  const activePathIds = activeBranch?.startsWith('uncle-child')
    ? ['lineage', 'uncle', activeBranch]
    : activeBranch?.startsWith('parent-child')
      ? ['lineage', 'parents', activeBranch]
      : activeBranch === 'self'
        ? ['lineage', 'parents', 'self']
        : activeBranch === 'parents'
          ? ['lineage', 'parents', ...parentChildIds]
          : activeBranch === 'uncle'
            ? ['lineage', 'uncle', ...uncleChildIds]
            : activeBranch === 'lineage'
              ? ['lineage', 'parents', 'uncle']
              : []
  const isParentMobileBranchActive = activeBranch === 'lineage'
    || activeBranch === 'parents'
    || activeBranch === 'self'
    || activeBranch?.startsWith('parent-child')
  const isUncleMobileBranchActive = activeBranch === 'lineage'
    || activeBranch === 'uncle'
    || activeBranch?.startsWith('uncle-child')
  function handleBranchActivate(branchId){
    setActiveBranch((currentBranch) => currentBranch === branchId ? null : branchId)
  }

  function getNodeState(branchId){
    return {
      branchId,
      isActive: activeBranch === branchId,
      isInActivePath: activePathIds.includes(branchId),
      onActivate: handleBranchActivate
    }
  }

  const treePaths = [
    'M450 110 C450 145 225 135 180 178',
    'M450 110 C450 145 675 135 720 178',
    'M180 275 C205 325 375 315 450 350',
    'M180 275 C160 385 105 420 92 515',
    'M180 275 C210 380 242 420 248 515',
    'M180 275 C265 390 405 420 450 515',
    'M720 275 C705 382 640 420 642 515',
    'M720 275 C760 382 800 420 808 515'
  ]

  return (
    <>
      <motion.div
        className={`family-tree-stage desktop-family-tree-stage ${activeBranch ? 'has-active-branch' : ''}`}
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={sectionViewport}
      >
        <motion.svg className="family-tree-lines" viewBox="0 0 900 660" preserveAspectRatio="none" aria-hidden="true">
          {treePaths.map((path, index) => (
            <motion.path key={path} d={path} custom={index} variants={treePathVariants} />
          ))}
        </motion.svg>

        <FamilyTreeNode
          className="tree-lineage"
          index={0}
          badge="Lineage"
          title={grandfather.value}
          lines={[grandmother.value]}
          {...getNodeState('lineage')}
        />
        <FamilyTreeNode
          className="tree-parents"
          index={1}
          badge="Parents"
          title={`${father.name} — ${father.detail}`}
          lines={[`${mother.name} — ${mother.detail}`]}
          {...getNodeState('parents')}
        />
        <FamilyTreeNode
          className="tree-uncle"
          index={2}
          badge="Uncle & Aunty"
          title={`${uncle.name} — ${uncle.detail}`}
          lines={[`${aunty.name} — ${aunty.detail}`]}
          {...getNodeState('uncle')}
        />
        <FamilyTreeNode
          className="tree-self"
          index={3}
          badge="Profile"
          title={personName}
          lines={[person?.occupation || 'SEBI Project Head Office']}
          {...getNodeState('self')}
        />

        {parentBranch.map((sibling, index) => (
          <FamilyTreeNode
            key={sibling.name}
            className={`tree-sibling tree-parent-child-${index + 1}`}
            index={4 + index}
            badge={sibling.relation}
            title={sibling.name}
            lines={[sibling.detail].filter(Boolean)}
            {...getNodeState(`parent-child-${index + 1}`)}
          />
        ))}

        {uncleBranch.map((sibling, index) => (
          <FamilyTreeNode
            key={sibling.name}
            className={`tree-sibling tree-uncle-child-${index + 1}`}
            index={7 + index}
            badge={sibling.relation}
            title={sibling.name}
            lines={[sibling.detail].filter(Boolean)}
            {...getNodeState(`uncle-child-${index + 1}`)}
          />
        ))}
      </motion.div>

      <motion.div
        className={`mobile-family-tree-stage ${activeBranch ? 'has-active-branch' : ''}`}
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={sectionViewport}
      >
        <p className="mobile-tree-hint">
          Tap any card to highlight its family connection.
        </p>

        <div className="mobile-tree-root mobile-tree-item">
          <FamilyTreeNode
            className="tree-lineage"
            index={0}
            badge="Lineage"
            title={grandfather.value}
            lines={[grandmother.value]}
            {...getNodeState('lineage')}
          />
        </div>

        <div className={`mobile-tree-branch-group mobile-parent-group ${isParentMobileBranchActive ? 'is-active-mobile-branch' : ''}`}>
          <div className="mobile-tree-item mobile-branch-head">
            <FamilyTreeNode
              className="tree-parents"
              index={1}
              badge="Parents"
              title={`${father.name} — ${father.detail}`}
              lines={[`${mother.name} — ${mother.detail}`]}
              {...getNodeState('parents')}
            />
          </div>

          <div className="mobile-tree-children">
            <div className="mobile-tree-item">
              <FamilyTreeNode
                className="tree-self"
                index={3}
                badge="Profile"
                title={personName}
                lines={[person?.occupation || 'SEBI Project Head Office']}
                {...getNodeState('self')}
              />
            </div>

            {parentBranch.map((sibling, index) => (
              <div className="mobile-tree-item" key={`mobile-parent-${sibling.name}`}>
                <FamilyTreeNode
                  className={`tree-sibling tree-parent-child-${index + 1}`}
                  index={4 + index}
                  badge={sibling.relation}
                  title={sibling.name}
                  lines={[sibling.detail].filter(Boolean)}
                  {...getNodeState(`parent-child-${index + 1}`)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={`mobile-tree-branch-group mobile-uncle-group ${isUncleMobileBranchActive ? 'is-active-mobile-branch' : ''}`}>
          <div className="mobile-tree-item mobile-branch-head">
            <FamilyTreeNode
              className="tree-uncle"
              index={2}
              badge="Uncle & Aunty"
              title={`${uncle.name} — ${uncle.detail}`}
              lines={[`${aunty.name} — ${aunty.detail}`]}
              {...getNodeState('uncle')}
            />
          </div>

          <div className="mobile-tree-children">
            {uncleBranch.map((sibling, index) => (
              <div className="mobile-tree-item" key={`mobile-uncle-${sibling.name}`}>
                <FamilyTreeNode
                  className={`tree-sibling tree-uncle-child-${index + 1}`}
                  index={7 + index}
                  badge={sibling.relation}
                  title={sibling.name}
                  lines={[sibling.detail].filter(Boolean)}
                  {...getNodeState(`uncle-child-${index + 1}`)}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  )
}

function FamilyCard({ title, children, className = '' }){
  return (
    <motion.div className={`family-card interactive-card ${className}`} variants={fadeUp} whileHover={cardHover}>
      <h4 className="family-card-title">{title}</h4>
      {children}
    </motion.div>
  )
}

function DetailLine({ label, value }){
  if(!value) return null
  return (
    <p className="family-line">
      <span>{label}:</span> {value}
    </p>
  )
}

function PersonLine({ label, name, detail }){
  if(!name) return null
  return (
    <p className="family-line">
      <span>{label}:</span> {name}{detail ? ` — ${detail}` : ''}
    </p>
  )
}

function SiblingCard({ sibling }){
  return (
    <motion.div className="sibling-card interactive-card" variants={fadeUp} whileHover={cardHover}>
      <div className="sibling-header">
        <span className="relationship-badge">{sibling.relation}</span>
        <h5 className="sibling-name">{sibling.name}</h5>
      </div>
      {sibling.detail && <p className="sibling-detail">{sibling.detail}</p>}
      {sibling.companyUrl && (
        <a className="sibling-link" href={sibling.companyUrl} target="_blank" rel="noopener noreferrer">
          USYS Technology
        </a>
      )}
      {sibling.husband && <DetailLine label="Husband" value={sibling.husband} />}
      {sibling.wife && <DetailLine label="Wife" value={sibling.wife} />}
      {sibling.children && sibling.children.length > 0 && (
        <div className="children-row">
          <span className="children-label">Children</span>
          <div className="children-chips">
            {sibling.children.map((child) => (
              <span key={child} className="child-chip">{child}</span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

function ContactButton({ href, icon: Icon, children, external = false, className = '' }){
  return (
    <motion.a
      className={`contact-btn ripple-button ${className}`}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      variants={fadeUp}
      whileHover={cardHover}
      whileTap={{ scale: 0.96 }}
    >
      <span className="contact-icon"><Icon /></span>
      <span>{children}</span>
    </motion.a>
  )
}

export default function App(){
  const data = biodata || {}
  const [pageLoading, setPageLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [lightIndex, setLightIndex] = useState(null)
  const images = data.images || []

  useEffect(() => {
    const timer = window.setTimeout(() => setPageLoading(false), 950)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    let loaded = 0
    if(images.length === 0) {
      setLoading(false)
      return
    }

    images.forEach((src) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        loaded += 1
        if(loaded === images.length) setLoading(false)
      }
      img.onerror = () => {
        loaded += 1
        if(loaded === images.length) setLoading(false)
      }
    })
  }, [images])

  useEffect(() => {
    if(lightIndex == null) return undefined

    function onKeyDown(event){
      if(event.key === 'Escape') closeLight()
      if(event.key === 'ArrowRight') showNext()
      if(event.key === 'ArrowLeft') showPrev()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightIndex])

  function openLight(index){
    if(images.length === 0) return
    setLightIndex(index)
  }

  function closeLight(){
    setLightIndex(null)
  }

  function showNext(){
    if(images.length === 0) return
    setLightIndex((current) => current == null ? 0 : (current + 1) % images.length)
  }

  function showPrev(){
    if(images.length === 0) return
    setLightIndex((current) => current == null ? 0 : (current - 1 + images.length) % images.length)
  }

  return (
    <div className="app-shell min-h-screen">
      <AnimatePresence>
        {pageLoading && <PageLoader />}
      </AnimatePresence>
      <ScrollProgress />
      <BackgroundEffects />

      <main className="relative z-10 w-full max-w-[1180px] mx-auto overflow-x-hidden px-4 sm:px-5 md:px-8 lg:px-10 xl:px-12 pb-14 sm:pb-16 md:pb-20">
        <Hero data={data} onOpen={openLight} />

        {data.about && (
          <AnimatedSection id="about" className="mt-8 sm:mt-10 md:mt-12 premium-card interactive-card section-card p-4 sm:p-5 md:p-6 lg:p-8">
            <SectionHeading eyebrow="About" title="About Me" />
            <motion.p variants={fadeUp} className="about-copy">{data.about}</motion.p>
          </AnimatedSection>
        )}

        <AnimatedSection id="personal" className="mt-6 sm:mt-8 premium-card interactive-card section-card p-4 sm:p-5 md:p-7 lg:p-8">
          <SectionHeading eyebrow="Biodata" title="Personal Details" />
          <PersonalDetails details={data.personalDetails} />
        </AnimatedSection>

        <AnimatedSection id="education" className="mt-6 sm:mt-8 premium-card interactive-card section-card p-4 sm:p-5 md:p-7 lg:p-8">
          <SectionHeading eyebrow="Education & Career" title="Academic Qualification & Career" />
          <EducationTimeline education={data.education} />

          <motion.div variants={fadeUp} className="career-card interactive-card">
            <h4 className="font-semibold text-gray-800 mb-2">Current Occupation</h4>
            <p className="text-gray-700">{data.occupation || 'Professional'}</p>
            {data.company && <p className="career-company">{data.company}</p>}
          </motion.div>
        </AnimatedSection>

        <AnimatedSection id="family" className="mt-6 sm:mt-8 premium-card interactive-card section-card p-4 sm:p-5 md:p-7 lg:p-8">
          <SectionHeading eyebrow="Parivar" title="Family Details" />
          <motion.div variants={fadeUp} className="family-structure-grid">
            {data.family?.ancestors && data.family.ancestors.length > 0 && (
              <FamilyCard title="Family Lineage" className="family-lineage-card">
                {data.family.ancestors.map((ancestor, index) => (
                  <DetailLine key={index} label={ancestor.label} value={ancestor.value} />
                ))}
              </FamilyCard>
            )}

            {data.family?.parents && data.family.parents.length > 0 && (
              <FamilyCard title="Parents" className="family-parents-card">
                {data.family.parents.map((parent, index) => (
                  <PersonLine key={index} label={parent.label} name={parent.name} detail={parent.detail} />
                ))}
              </FamilyCard>
            )}

            {data.family?.uncleAunty && data.family.uncleAunty.length > 0 && (
              <FamilyCard title="Uncle & Aunty" className="family-extended-card">
                {data.family.uncleAunty.map((relative, index) => (
                  <PersonLine key={index} label={relative.label} name={relative.name} detail={relative.detail} />
                ))}
              </FamilyCard>
            )}

            {data.family?.siblings && data.family.siblings.length > 0 && (
              <FamilyCard title="Siblings" className="family-siblings-card">
                <div className="sibling-grid">
                  {data.family.siblings.map((sibling, index) => (
                    <SiblingCard key={`${sibling.name}-${index}`} sibling={sibling} />
                  ))}
                </div>
              </FamilyCard>
            )}
          </motion.div>
        </AnimatedSection>

        <AnimatedSection id="family-tree" className="mt-6 sm:mt-8 premium-card interactive-card section-card p-4 sm:p-5 md:p-7 lg:p-8">
          <SectionHeading eyebrow="Hierarchy" title="Family Tree" center />
          <FamilyTree family={data.family} person={data} />
        </AnimatedSection>

        {data.family?.address && (
          <AnimatedSection id="address" className="mt-6 sm:mt-8 premium-card interactive-card section-card address-section p-4 sm:p-5 md:p-7 lg:p-8">
            <SectionHeading eyebrow="Residence" title="Home Address" center />
            <motion.p variants={fadeUp} className="address-copy">{data.family.address}</motion.p>
            {data.family?.mapLink && (
              <motion.a
                href={data.family.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="map-button ripple-button shine-button"
                variants={fadeUp}
                whileHover={cardHover}
                whileTap={{ scale: 0.96 }}
              >
                View Location on Map
              </motion.a>
            )}
          </AnimatedSection>
        )}

        <AnimatedSection id="gallery" className="mt-6 sm:mt-8 premium-card interactive-card gallery-card">
          <SectionHeading eyebrow="Memories" title="Photo Gallery" center />
          {loading ? (
            <motion.div variants={fadeUp} className="text-center py-8 text-gray-600">Loading images...</motion.div>
          ) : (
            <MarqueeGallery images={images} onOpen={openLight} />
          )}
        </AnimatedSection>

        <AnimatedSection id="contact" className="mt-8 sm:mt-10 premium-card interactive-card contact-section p-4 sm:p-5 md:p-6 lg:p-8">
          <SectionHeading eyebrow="Connect" title="Contact" center />
          <motion.div variants={fadeUp} className="contact-actions">
            {data.contact?.phone && (
              <ContactButton icon={FiMessageCircle} href={`https://wa.me/${data.contact.phone.replace(/[^0-9]/g, '')}`} external className="whatsapp-btn">
                WhatsApp
              </ContactButton>
            )}
            {data.contact?.phone && (
              <ContactButton icon={FiPhone} href={`tel:${data.contact.phone}`}>
                Call
              </ContactButton>
            )}
            {data.contact?.email && (
              <ContactButton icon={FiMail} href={`mailto:${data.contact.email}`}>
                Email
              </ContactButton>
            )}
          </motion.div>
        </AnimatedSection>
      </main>

      <ScrollTop />
      <AnimatePresence>
        {lightIndex != null && (
          <Lightbox
            images={images}
            index={lightIndex}
            onClose={closeLight}
            onNext={showNext}
            onPrev={showPrev}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
