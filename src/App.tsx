import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { FillingsMarquee } from './components/FillingsMarquee'
import { Catalog } from './components/Catalog'
import { Gallery } from './components/Gallery'
import { Order } from './components/Order'
import { Conditions } from './components/Conditions'
import { Faq } from './components/Faq'
import { Reviews } from './components/Reviews'
import { Footer } from './components/Footer'
import { StickyCta } from './components/StickyCta'
import { SeoJsonLd } from './components/SeoJsonLd'

export default function App() {
  return (
    <>
      <SeoJsonLd />
      <Header />
      <main>
        <Hero />
        <FillingsMarquee />
        <Catalog />
        <Order />
        <Gallery />
        <Conditions />
        <Faq />
        <Reviews />
      </main>
      <Footer />
      <StickyCta />
    </>
  )
}
