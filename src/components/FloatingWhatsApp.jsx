import { motion } from 'framer-motion'
import './floating-whatsapp.css'

export default function FloatingWhatsApp() {
  return (
    <motion.div
      className="floating-actions"
      initial={{ opacity: 0, scale: 0.86, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.a
        className="floating-action floating-action--instagram"
        href="https://www.instagram.com/graphician_studios/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow Graphician Studios on Instagram"
        whileHover={{ y: -4, scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
      >
        <span className="floating-action__glow" aria-hidden="true" />
        <svg
          className="floating-action__icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 551.034 551.034"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="floating-instagram-gradient-main" gradientUnits="userSpaceOnUse" x1="275.517" y1="549.4286" x2="275.517" y2="4.2798">
              <stop offset="0" stopColor="#7024C4" />
              <stop offset="0.4" stopColor="#C21975" />
              <stop offset="0.7" stopColor="#C74C4D" />
              <stop offset="1" stopColor="#E09B3D" />
            </linearGradient>
            <linearGradient id="floating-instagram-gradient-dot" gradientUnits="userSpaceOnUse" x1="418.306" y1="549.4286" x2="418.306" y2="4.2798">
              <stop offset="0" stopColor="#7024C4" />
              <stop offset="0.4" stopColor="#C21975" />
              <stop offset="0.7" stopColor="#C74C4D" />
              <stop offset="1" stopColor="#E09B3D" />
            </linearGradient>
          </defs>
          <title>Instagram</title>
          <path fill="url(#floating-instagram-gradient-main)" d="M386.878,0H164.156C73.64,0,0,73.64,0,164.156v222.722c0,90.516,73.64,164.156,164.156,164.156h222.722c90.516,0,164.156-73.64,164.156-164.156V164.156C551.033,73.64,477.393,0,386.878,0z M495.6,386.878c0,60.045-48.677,108.722-108.722,108.722H164.156c-60.045,0-108.722-48.677-108.722-108.722V164.156c0-60.046,48.677-108.722,108.722-108.722h222.722c60.045,0,108.722,48.676,108.722,108.722L495.6,386.878L495.6,386.878z" />
          <path fill="url(#floating-instagram-gradient-main)" d="M275.517,133C196.933,133,133,196.933,133,275.516s63.933,142.517,142.517,142.517S418.034,354.1,418.034,275.516S354.101,133,275.517,133z M275.517,362.6c-48.095,0-87.083-38.988-87.083-87.083s38.989-87.083,87.083-87.083c48.095,0,87.083,38.988,87.083,87.083C362.6,323.611,323.611,362.6,275.517,362.6z" />
          <circle fill="url(#floating-instagram-gradient-dot)" cx="418.306" cy="134.072" r="34.149" />
        </svg>
      </motion.a>

      <motion.a
        className="floating-action floating-action--linkedin"
        href="https://in.linkedin.com/company/graphician-studios"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow Graphician Studios on LinkedIn"
        whileHover={{ y: -4, scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
      >
        <span className="floating-action__glow" aria-hidden="true" />
        <svg
          className="floating-action__icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 382 382"
          aria-hidden="true"
          focusable="false"
        >
          <title>LinkedIn</title>
          <path fill="#0077B7" d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472L341.91,330.654L341.91,330.654z" />
        </svg>
      </motion.a>

      <motion.a
        className="floating-action floating-action--whatsapp floating-whatsapp"
        href="https://wa.me/919600996880"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Graphician Studios on WhatsApp"
        whileHover={{ y: -4, scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
      >
        <span className="floating-action__glow" aria-hidden="true" />
        <svg
          className="floating-action__icon"
          id="Layer_1"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
          viewBox="0 0 512 512"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="floating-whatsapp-gradient" x1="256" y1="512" x2="256" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#61fd7d" />
              <stop offset="1" stopColor="#2bb826" />
            </linearGradient>
          </defs>
          <title>WhatsApp</title>
          <path fill="url(#floating-whatsapp-gradient)" d="M512,382.07c0,2.8-.09,8.88-.26,13.58-.41,11.49-1.32,26.32-2.7,33.07a109.76,109.76,0,0,1-9.27,27.71,98.45,98.45,0,0,1-43.43,43.39,110.21,110.21,0,0,1-27.87,9.28c-6.69,1.35-21.41,2.24-32.82,2.65-4.71.17-10.79.25-13.58.25l-252.1,0c-2.8,0-8.88-.09-13.58-.26-11.49-.41-26.32-1.32-33.07-2.69a110.37,110.37,0,0,1-27.72-9.28A98.5,98.5,0,0,1,12.18,456.3,110.21,110.21,0,0,1,2.9,428.43C1.55,421.74.66,407,.25,395.61.08,390.91,0,384.82,0,382l0-252.1c0-2.8.09-8.88.25-13.58C.71,104.86,1.62,90,3,83.28a110.37,110.37,0,0,1,9.27-27.72A98.59,98.59,0,0,1,55.7,12.18,110.21,110.21,0,0,1,83.57,2.9C90.26,1.55,105,.66,116.39.25,121.09.08,127.18,0,130,0l252.1,0c2.8,0,8.88.09,13.58.25C407.14.71,422,1.62,428.72,3a110.37,110.37,0,0,1,27.72,9.27A98.59,98.59,0,0,1,499.82,55.7a110.21,110.21,0,0,1,9.28,27.87c1.35,6.69,2.24,21.41,2.65,32.82.17,4.7.25,10.79.25,13.58Z" />
          <path fill="#fff" d="M379.56,131.67A172.4,172.4,0,0,0,256.67,80.73C161,80.73,83.05,158.64,83.05,254.42a173.47,173.47,0,0,0,23.2,86.82l-24.65,90,92.08-24.17a173.55,173.55,0,0,0,83,21.17h.07c95.73,0,173.69-77.91,173.69-173.69A172.73,172.73,0,0,0,379.53,131.7l0,0ZM256.72,399a144.17,144.17,0,0,1-73.52-20.14l-5.29-3.15L123.27,390l14.59-53.27-3.42-5.47a143.29,143.29,0,0,1-22.11-76.81C112.33,174.81,177.1,110,256.8,110A144.34,144.34,0,0,1,401.12,254.48c-.07,79.67-64.83,144.46-144.41,144.46v0ZM335.87,290.8c-4.32-2.2-25.68-12.67-29.65-14.12s-6.85-2.19-9.8,2.2-11.22,14.11-13.76,17-5.06,3.29-9.37,1.09-18.35-6.77-34.92-21.56c-12.88-11.5-21.61-25.74-24.15-30s-.29-6.71,1.92-8.83c2-1.93,4.32-5.06,6.51-7.6s2.88-4.32,4.32-7.26.74-5.42-.35-7.6-9.8-23.55-13.34-32.25c-3.49-8.51-7.12-7.32-9.79-7.47s-5.42-.13-8.29-.13a16,16,0,0,0-11.57,5.41c-4,4.32-15.2,14.86-15.2,36.22s15.54,42,17.72,44.91,30.61,46.76,74.14,65.54c10.34,4.44,18.42,7.11,24.72,9.18a60,60,0,0,0,27.32,1.71c8.35-1.23,25.68-10.49,29.31-20.62s3.63-18.83,2.55-20.62-3.91-3-8.29-5.22l0,0Z" />
        </svg>
      </motion.a>
    </motion.div>
  )
}
