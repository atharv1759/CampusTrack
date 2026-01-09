import React from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { Hero } from '../components/landing-page/Hero'
import { Features } from '../components/landing-page/Features'
import FAQ from '../components/landing-page/FAQ'
import AISupportButton from '../components/common/ChatBot/AISupportButton'

function LandingPage() {
  return (
    <>
    <Navbar />
    <Hero />
    <Features />
    <FAQ />
    <Footer />
    <AISupportButton />
    </>
  )
}

export default LandingPage