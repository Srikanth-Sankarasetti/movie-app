import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'

import './index.css'

const Footer = () => (
  <>
    <div className="follow-icons">
      <FaGoogle size={18} color="#ffffff" />
      <FaTwitter size={18} color="#ffffff" />
      <FaInstagram size={18} color="#ffffff" />
      <FaYoutube size={18} color="#ffffff" />
    </div>
    <p className="contactus-name">Contact us</p>
  </>
)

export default Footer
