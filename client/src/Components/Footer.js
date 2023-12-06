import React from 'react'
import "./Footer.css"
import { RxInstagramLogo, RxLinkedinLogo, RxGithubLogo } from 'react-icons/rx'

const Footer = () => {
  return (
    <div className='footerContainer'>
      <p className='footerText'>Built by Bryan Fraschetti. Idea by Danny Kelly. Music theory by Lukas Fletcher.</p>
      <div className='socials'>
        <a href="https://www.linkedin.com/in/bryan-fraschetti/" target='_blank' rel="noreferrer">
          <RxLinkedinLogo size={32} color="black"></RxLinkedinLogo>
        </a>
        <a href="https://github.com/bryanfraschetti" target='_blank' rel="noreferrer">
          <RxGithubLogo size={32} color="black"></RxGithubLogo>
        </a>
        <a href="https://instagram.com/bryanfraschetti" target='_blank' rel="noreferrer">
          <RxInstagramLogo size={32} color="black"></RxInstagramLogo>
        </a>
      </div>
    </div>
  )
}

export default Footer
