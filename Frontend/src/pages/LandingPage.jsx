import React from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { Hero } from '../components/landing-page/Hero'
import { Features } from '../components/landing-page/Features'
import FAQ from '../components/landing-page/FAQ'
import ChatWidget from '../components/common/ChatBot/ChatWidget'

function LandingPage() {
  return (
    <>
    <Navbar />
    <Hero />
    <Features />
    <FAQ />
    <Footer />
    <ChatWidget />
    </>
  )
}

export default LandingPage