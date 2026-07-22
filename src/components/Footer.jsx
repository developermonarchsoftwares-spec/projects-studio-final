import { NavLink } from 'react-router-dom'
import './footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  const scrollToPageTop = () => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    })
  }

  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <h3>
            Let's Create Something <span className="grad-text">Worth Remembering!</span>
          </h3>
          <NavLink to="/contact" className="btn solid" onClick={scrollToPageTop}>
            Let's Create!
          </NavLink>
        </div>

        <div className="footer__cols">
          <div className="footer__col">
            <p className="section-label">Explore!</p>
            <NavLink to="/" className="footer__nav-bold" onClick={scrollToPageTop}>Studio</NavLink>
            <NavLink to="/service" className="footer__nav-bold" onClick={scrollToPageTop}>Solutions</NavLink>
            <NavLink to="/portfolio" className="footer__nav-bold" onClick={scrollToPageTop}>Our Creations</NavLink>
            <NavLink to="/about" className="footer__nav-bold" onClick={scrollToPageTop}>Story</NavLink>
            <NavLink to="/contact" className="footer__nav-bold" onClick={scrollToPageTop}>Let’s Create</NavLink>
          </div>
          <div className="footer__col">
            <p className="section-label">Studio!</p>
            <a href="mailto:Graphicianstudios@gmail.com">Graphicianstudios@gmail.com</a>
            <a href="tel:+919600996880">+91 96009 96880, +91 74181 99983</a>
            <span>Trichy Main Road, Gugai, Salem - 636006</span>
          </div>
          <div className="footer__col">
            <p className="section-label">Connect!</p>
            <a href="https://www.instagram.com/graphician_studios/" target="_blank" rel="noopener noreferrer">Instagram!</a>
            <a href="https://in.linkedin.com/company/graphician-studios" target="_blank" rel="noopener noreferrer">LinkedIn!</a>
            <a href="https://www.youtube.com/@GraphicianStudio" target="_blank" rel="noopener noreferrer">YouTube!</a>
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>Copyright © Graphician Studios. All Rights Reserved.</span>
        <span>
          Powered by{' '}
          <a href="https://www.monarchsoftwares.com/" target="_blank" rel="noopener noreferrer">
            Monarch Softwares
          </a>
        </span>
      </div>
    </footer>
  )
}
