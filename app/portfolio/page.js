"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Head from "next/head";

const ITEMS_PER_PAGE = 6;

export default function Portfolio() {
  const [isNavbarSolid, setIsNavbarSolid] = useState(false);
  const [activeFolder, setActiveFolder] = useState("all");
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const galleryRef = useRef(null);

  useEffect(() => {
    if (isMenuOpen || selectedImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen, selectedImageIndex]);

  useEffect(() => {
    const onScroll = () => setIsNavbarSolid(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let gsapRef;
    let lenis;
    let tickerFn;
    let disposed = false;

    (async () => {
      const gsapModule = await import("gsap");
      const lenisModule = await import("lenis");

      if (disposed) return;

      const gsap = gsapModule.default || gsapModule.gsap || gsapModule;
      gsapRef = gsap;
      const Lenis = lenisModule.default;

      lenis = new Lenis({
        smooth: true,
        lerp: 0.05,
      });

      tickerFn = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
      
      gsap.fromTo(
        ".portfolio-hero-content",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
    })();

    return () => {
      disposed = true;
      if (tickerFn && gsapRef?.ticker) gsapRef.ticker.remove(tickerFn);
      lenis?.destroy();
    };
  }, []);

  const allImages = [
    { src: "/malab4.png", folder: "malab", title: "Ritual Preparations", desc: "Capturing the quiet, sacred moments before the celebration begins." },
    { src: "/port5.png", folder: "port", title: "Grand Ballroom Styling", desc: "A study in contemporary elegance and traditional motifs." },
    { src: "/malab3.png", folder: "malab", title: "The Sacred Rings", desc: "Detailing the intricate symbols of a lifelong commitment." },
    { src: "/port4.png", folder: "port", title: "Riverside Reception", desc: "Where the backwaters meet modern luxury production." },
    { src: "/malab2.png", folder: "malab", title: "Cultural Coordination", desc: "Flawless execution of century-old Kerala traditions." },
    { src: "/port3.png", folder: "port", title: "Cochin Heritage Nights", desc: "An evening of celebration in the heart of historic Kochi." },
    { src: "/malab1.png", folder: "malab", title: "Floral Architecture", desc: "Bespoke mandap designs inspired by Kerala's botanical wealth." },
    { src: "/port2.png", folder: "port", title: "The Golden Hour", desc: "Capturing the warmth of a sunset ceremony on the coast." },
    { src: "/port1.png", folder: "port", title: "Confectionary Arts", desc: "Modern dessert styling with a touch of local flavor." },
  ];

  const filteredImages = activeFolder === "all" 
    ? allImages 
    : allImages.filter(img => img.folder === activeFolder);

  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
  const paginatedImages = filteredImages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const collectionInfo = {
    all: { title: "The Complete Archives", desc: "A comprehensive look at our most significant Kerala celebrations." },
    malab: { title: "The Heritage Malabar Archives", desc: "Rooted in tradition, these weddings focus on cultural depth, temple rituals, and the timeless Kasavu aesthetic." },
    port: { title: "The Coastal Port Collections", desc: "A blend of destination luxury and seaside elegance, featuring grand backwater resorts and colonial heritage settings." }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFolder]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (galleryRef.current) {
      window.scrollTo({
        top: galleryRef.current.offsetTop - 120,
        behavior: "smooth"
      });
    }
  };

  const openLightbox = (index) => {
    // We want to open based on the paginated index but navigate within the full filtered list
    const actualIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
    setSelectedImageIndex(actualIndex);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = "auto";
  };

  const nextImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
  }, [filteredImages.length]);

  const prevImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
  }, [filteredImages.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, nextImage, prevImage]);

  return (
    <>
      <Head>
        <title>Portfolio Folders | Eventora</title>
      </Head>
      <div className="portfolio-page">
        <nav className={`navbar ${isNavbarSolid ? "is-scrolled portfolio-nav" : "portfolio-nav"} ${isMenuOpen ? "menu-active" : ""}`}>
          <a className="brand" href="/" onClick={() => setIsMenuOpen(false)}>
            Eventora
          </a>
          <div className="nav-links">
            <a href="/#about">About</a>
            <a href="/#services">Services</a>
            <a href="/portfolio">Portfolio</a>
            <a href="/#showcase">Events</a>
            <a href="/#contact">Contact</a>
          </div>
          <div className="nav-actions">
            <a className="nav-cta" href="/">
              Back to Home
            </a>
            <button 
              className={`menu-toggle ${isMenuOpen ? "is-active" : ""}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              <span></span>
              <small>{isMenuOpen ? "CLOSE" : "MENU"}</small>
            </button>
          </div>
        </nav>

        {/* ── Menu Overlay ── */}
        <div className={`menu-overlay ${isMenuOpen ? "is-open" : ""}`}>
          <div className="menu-container">
            <div className="menu-content">
              <div className="menu-nav">
                <div className="menu-nav-item">
                  <a href="/" onClick={() => setIsMenuOpen(false)}><span>01</span> Home</a>
                </div>
                <div className="menu-nav-item">
                  <a href="/#about" onClick={() => setIsMenuOpen(false)}><span>02</span> About</a>
                </div>
                <div className="menu-nav-item">
                  <a href="/#services" onClick={() => setIsMenuOpen(false)}><span>03</span> Services</a>
                </div>
                <div className="menu-nav-item">
                  <a href="/portfolio" onClick={() => setIsMenuOpen(false)}><span>04</span> Portfolio</a>
                </div>
                <div className="menu-nav-item">
                  <a href="/#showcase" onClick={() => setIsMenuOpen(false)}><span>05</span> Stories</a>
                </div>
                <div className="menu-nav-item">
                  <a href="/#contact" onClick={() => setIsMenuOpen(false)}><span>06</span> Contact</a>
                </div>
              </div>
              
              <div className="menu-footer">
                <div className="menu-footer-col">
                  <p className="menu-footer-label">Social</p>
                  <div className="menu-footer-links">
                    <a href="#" target="_blank">Instagram</a>
                    <a href="#" target="_blank">WhatsApp</a>
                  </div>
                </div>
                <div className="menu-footer-col">
                  <p className="menu-footer-label">Connect</p>
                  <div className="menu-footer-links">
                    <a href="mailto:hello@eventora.com">hello@eventora.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="menu-bg"></div>
        </div>

        <section className="portfolio-hero">
          <div className="portfolio-hero-content">
            <span className="hero-kicker">Curated Stories</span>
            <h1>{collectionInfo[activeFolder].title}</h1>
            <p className="collection-desc">{collectionInfo[activeFolder].desc}</p>
            <div className="folder-tabs">
              <button 
                className={`folder-tab ${activeFolder === "all" ? "active" : ""}`}
                onClick={() => setActiveFolder("all")}
              >
                All Stories
              </button>
              <button 
                className={`folder-tab ${activeFolder === "malab" ? "active" : ""}`}
                onClick={() => setActiveFolder("malab")}
              >
                Malabar Archives
              </button>
              <button 
                className={`folder-tab ${activeFolder === "port" ? "active" : ""}`}
                onClick={() => setActiveFolder("port")}
              >
                Coastal Port
              </button>
            </div>
          </div>
        </section>

        <section className="portfolio-gallery" ref={galleryRef}>
          <div className="masonry-grid">
            {paginatedImages.map((img, i) => (
              <div 
                className="masonry-item" 
                key={`${img.src}-${activeFolder}-${currentPage}`}
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => openLightbox(i)}
              >
                <Image 
                  src={img.src} 
                  alt={img.title} 
                  width={600} 
                  height={800} 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ width: "100%", height: "auto" }}
                />
                <div className="masonry-overlay">
                  <span>{img.title}</span>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination-wrap">
              <button 
                className="pagination-btn arrow" 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Prev
              </button>
              <div className="pagination-numbers">
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                className="pagination-btn arrow" 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>

      {selectedImageIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>×</button>
          <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>←</button>
          <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>→</button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ position: "relative", width: "100%", height: "70vh" }}>
              <Image 
                src={filteredImages[selectedImageIndex].src} 
                alt={filteredImages[selectedImageIndex].title} 
                fill
                sizes="85vw"
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <div className="lightbox-meta">
              <h3>{filteredImages[selectedImageIndex].title}</h3>
              <p>{filteredImages[selectedImageIndex].desc}</p>
              <div className="lightbox-counter">
                {selectedImageIndex + 1} / {filteredImages.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
