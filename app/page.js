"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "When should we book our Kerala wedding planner?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For top Kerala venues and vendor availability, we recommend booking 8-12 months in advance.",
      },
    },
    {
      "@type": "Question",
      name: "Do you plan weddings for Hindu, Christian, and Muslim traditions in Kerala?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We plan across Kerala traditions and coordinate rituals, family timelines, decor, food, and hospitality end-to-end.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer fixed packages in INR?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we provide Essentials, Signature, and Complete packages with transparent INR-based starting pricing.",
      },
    },
  ],
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Eventora",
  image: "https://eventora.example/hero.jpg",
  email: "hello@eventora.com",
  telephone: "+91-90720-18204",
  areaServed: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kerala"],
  priceRange: "₹₹",
  url: "https://eventora.example",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kochi",
    addressRegion: "Kerala",
    addressCountry: "IN",
  },
};

const trackEvent = (eventName, payload = {}) => {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
  }
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...payload });
  }
};

export default function Home() {
  const [inquirySent, setInquirySent] = useState(false);
  const [isNavbarSolid, setIsNavbarSolid] = useState(false);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen || isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen, isModalOpen]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const heroImages = isMobile 
    ? ["/hero1mobile.png", "/hero2mobile.png", "/hero3mobile.png"] 
    : ["/hero1.png", "/hero2.png", "/hero3.png"];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000); // Increased interval for better appreciation of smooth transition
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    const onScroll = () => setIsNavbarSolid(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let gsapRef;
    let ctx;
    let lenis;
    let tickerFn;
    let heroCopySplit;
    let isHeroCopyHidden = false;
    let disposed = false;

    (async () => {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { SplitText } = await import("gsap/SplitText");
      const lenisModule = await import("lenis");

      if (disposed) return;

      const gsap = gsapModule.default || gsapModule.gsap || gsapModule;
      gsapRef = gsap;
      const Lenis = lenisModule.default;

      gsap.registerPlugin(ScrollTrigger, SplitText);

      lenis = new Lenis();
      lenis.on("scroll", ScrollTrigger.update);

      tickerFn = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);

      ctx = gsap.context(() => {
        heroCopySplit = SplitText.create(".hero-copy h3", {
          type: "words",
          wordsClass: "word",
        });

        ScrollTrigger.create({
          trigger: ".hero",
          start: "top top",
          end: `+${window.innerHeight * 3.5}px`,
          pin: true,
          pinSpacing: false,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;

            const heroHeaderProgress = Math.min(progress / 0.2, 1);
            gsap.set(".hero-header", { yPercent: -heroHeaderProgress * 100 });

            const heroWordsProgress = Math.max(
              0,
              Math.min((progress - 0.12) / 0.18, 1),
            );
            const totalWords = heroCopySplit.words.length;

            heroCopySplit.words.forEach((word, i) => {
              const wordStart = i / totalWords;
              const wordEnd = (i + 1) / totalWords;
              const wordOpacity = Math.max(
                0,
                Math.min((heroWordsProgress - wordStart) / (wordEnd - wordStart), 1),
              );
              gsap.set(word, { opacity: wordOpacity });
            });

            const actionsOpacity = Math.max(
              0,
              Math.min((heroWordsProgress - 0.4) / 0.4, 1)
            );
            gsap.set(".hero-actions", { 
              opacity: actionsOpacity,
              y: (1 - actionsOpacity) * 20 
            });

            if (progress > 0.64 && !isHeroCopyHidden) {
              isHeroCopyHidden = true;
              gsap.to(".hero-copy-wrap", { opacity: 0, duration: 0.2 });
            } else if (progress <= 0.64 && isHeroCopyHidden) {
              isHeroCopyHidden = false;
              gsap.to(".hero-copy-wrap", { opacity: 1, duration: 0.2 });
            }

            const heroImgProgress = Math.max(
              0,
              Math.min((progress - 0.71) / 0.29, 1),
            );

            const heroImgWidth = gsap.utils.interpolate(
              window.innerWidth,
              150,
              heroImgProgress,
            );
            const heroImgHeight = gsap.utils.interpolate(
              window.innerHeight,
              150,
              heroImgProgress,
            );
            const heroImgBorderRadius = gsap.utils.interpolate(
              0,
              10,
              heroImgProgress,
            );

            gsap.set(".hero-img", {
              width: heroImgWidth,
              height: heroImgHeight,
              borderRadius: heroImgBorderRadius,
            });
          },
        });

        const aboutImgCols = [
          { id: "#about-imgs-col-1", y: -500 },
          { id: "#about-imgs-col-2", y: -250 },
          { id: "#about-imgs-col-3", y: -250 },
          { id: "#about-imgs-col-4", y: -500 },
        ];

        aboutImgCols.forEach(({ id, y }) => {
          gsap.to(id, {
            y,
            scrollTrigger: {
              trigger: ".about",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        gsap.utils.toArray(".reveal-up").forEach((el) => {
          gsap.from(el, {
            y: 60,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 84%",
            },
          });
        });

        gsap.from(".service-item", {
          y: 50,
          opacity: 0,
          duration: 0.95,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-list",
            start: "top 82%",
          },
        });


        gsap.from(".trust-item", {
          y: 55,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".trust",
            start: "top 82%",
          },
        });

      });
    })();

    return () => {
      disposed = true;
      heroCopySplit?.revert();
      if (tickerFn && gsapRef?.ticker) gsapRef.ticker.remove(tickerFn);
      lenis?.destroy();
      ctx?.revert();
    };
  }, []);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const details = {
      name: formData.get("name") || "",
      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      date: formData.get("date") || "",
      city: formData.get("city") || "",
      guests: formData.get("guests") || "",
      budget: formData.get("budget") || "",
      service: formData.get("service") || "",
      notes: formData.get("notes") || "",
    };

    trackEvent("inquiry_form_submitted", {
      service: details.service,
      budget: details.budget,
      city: details.city,
    });

    const subject = encodeURIComponent(
      `Eventora Kerala Inquiry - ${details.service || "Wedding Planning"}`,
    );
    const body = encodeURIComponent(
      `Name: ${details.name}\nEmail: ${details.email}\nPhone: ${details.phone}\nEvent Date: ${details.date}\nCity: ${details.city}\nGuest Count: ${details.guests}\nBudget: ${details.budget}\nService: ${details.service}\nNotes: ${details.notes}`,
    );

    window.location.href = `mailto:hello@eventora.com?subject=${subject}&body=${body}`;
    setInquirySent(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setInquirySent(false);
    }, 2000);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setInquirySent(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setInquirySent(false);
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <nav className={`navbar ${isNavbarSolid ? "is-scrolled" : ""} ${isMenuOpen ? "menu-active" : ""}`}>
        <a className="brand" href="#home" onClick={() => setIsMenuOpen(false)}>
          Eventora
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="/portfolio">Portfolio</a>
          <a href="#showcase">Events</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-actions">
          <a
            className="nav-cta"
            onClick={(e) => {
              e.preventDefault();
              openModal();
              trackEvent("cta_click", { location: "navbar" });
            }}
          >
            Check Date Availability
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
                <a href="#home" onClick={() => setIsMenuOpen(false)}><span>01</span> Home</a>
              </div>
              <div className="menu-nav-item">
                <a href="#about" onClick={() => setIsMenuOpen(false)}><span>02</span> About</a>
              </div>
              <div className="menu-nav-item">
                <a href="#services" onClick={() => setIsMenuOpen(false)}><span>03</span> Services</a>
              </div>
              <div className="menu-nav-item">
                <a href="/portfolio" onClick={() => setIsMenuOpen(false)}><span>04</span> Portfolio</a>
              </div>
              <div className="menu-nav-item">
                <a href="#showcase" onClick={() => setIsMenuOpen(false)}><span>05</span> Stories</a>
              </div>
              <div className="menu-nav-item">
                <a href="#contact" onClick={() => setIsMenuOpen(false)}><span>06</span> Contact</a>
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

      <section className="hero" id="home">
        <div className="hero-img">
          {heroImages.map((src, index) => (
            <Image 
              key={src}
              src={src} 
              alt="Experience authentic Kerala weddings" 
              className={index === activeHeroIndex ? "active" : ""}
              fill
              priority={index === 0}
              sizes="100vw"
              style={{ 
                objectFit: "cover",
                objectPosition: isMobile && src.includes("hero2mobile") ? "80% center" : "center" 
              }} 
            />
          ))}
        </div>
        <div className="hero-header">
          <div className="hero-header-wrap">
            <p className="hero-eyebrow">Kerala Wedding Planning Studio</p>
            <h1>Authentic Kerala weddings, beautifully planned with modern precision</h1>
          </div>
        </div>
        <div className="hero-copy">
          <div className="hero-copy-wrap">
            <h3>
              From muhurtham timing to sadya service and reception flow, we plan
              Kerala weddings with cultural depth, clear budgets, and stress-free
              execution.
            </h3>
            <div className="hero-actions">
              <a
                className="hero-btn hero-btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  openModal();
                  trackEvent("cta_click", { location: "hero_primary" });
                }}
              >
                Check Date Availability
              </a>
              <a
                href="#showcase"
                className="hero-btn"
                onClick={() =>
                  trackEvent("cta_click", { location: "hero_secondary" })
                }
              >
                View Kerala Weddings
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-images">
          <div className="about-imgs-col" id="about-imgs-col-1">
            <div className="img">
              <Image src="/malabar.png" alt="Kerala wedding floral details" width={150} height={150} />
            </div>
            <div className="img">
              <Image src="/port4.png" alt="Kerala wedding reception table setup" width={150} height={150} />
            </div>
            <div className="img">
              <Image src="/malab1.png" alt="Kerala wedding decor styling" width={150} height={150} />
            </div>
            <div className="img">
              <Image src="/bride.png" alt="Bride portrait in Kerala wedding attire" width={150} height={150} />
            </div>
          </div>
          <div className="about-imgs-col" id="about-imgs-col-2">
            <div className="img">
              <Image src="/malab2.png" alt="Planner coordinating event timeline" width={150} height={150} />
            </div>
            <div className="img">
              <Image src="/port3.png" alt="Kerala wedding head table styling" width={150} height={150} />
            </div>
            <div className="img">
              <Image src="/port2.png" alt="Kerala wedding venue atmosphere" width={150} height={150} />
            </div>
            <div className="img">
              <Image src="/malab1.png" alt="Bouquet details" width={150} height={150} />
            </div>
          </div>
          <div className="about-imgs-col" id="about-imgs-col-3">
            <div className="img">
              <Image src="/malab3.png" alt="Wedding rings detail for Kerala ceremony" width={150} height={150} />
            </div>
            <div className="img">
              <Image src="/port5.png" alt="Kerala wedding reception lighting setup" width={150} height={150} />
            </div>
            <div className="img">
              <Image src="/port1.png" alt="Wedding dessert and cake display" width={150} height={150} />
            </div>
            <div className="img">
              <Image src="/malab4.png" alt="Guests celebrating at Kerala wedding" width={150} height={150} />
            </div>
          </div>
          <div className="about-imgs-col" id="about-imgs-col-4">
            <div className="img">
              <Image src="/stage.png" alt="Traditional Kerala ceremony stage design" width={150} height={150} />
            </div>
            <div className="img">
              <Image src="/malab4.png" alt="Event planning team at work" width={150} height={150} />
            </div>
            <div className="img">
              <Image src="/port4.png" alt="Kerala wedding invitation and stationery" width={150} height={150} />
            </div>
            <div className="img">
              <Image src="/hero1.png" alt="Kerala wedding couple celebration moment" width={150} height={150} />
            </div>
          </div>
        </div>
        <div className="about-header">
          <p className="about-eyebrow">About Eventora</p>
          <h3>
            We blend Kerala wedding traditions with contemporary production so your
            celebration feels rooted, elegant, and effortless.
          </h3>
          <p className="about-meta">
            Full Planning / Temple Weddings / Destination Kerala
          </p>
        </div>
      </section>

      <section className="content-section services" id="services">
        <div className="section-head reveal-up">
          <div>
            <p className="section-kicker">Services</p>
            <h2>Rituals, design &amp; flawless execution — all in one team.</h2>
          </div>
          <p className="services-intro-tag">Kerala weddings planned with cultural depth and calm precision</p>
        </div>

        <div className="services-list">
          <div className="service-item">
            <span className="service-num">01</span>
            <div className="service-body">
              <p className="service-phase">Plan</p>
              <h4>Planning, Budget &amp; Family Alignment</h4>
              <p>We map rituals, family expectations, and budget priorities into one clear planning structure from day one — no surprises, no overruns.</p>
            </div>
            <div className="service-arrow">↗</div>
          </div>

          <div className="service-item">
            <span className="service-num">02</span>
            <div className="service-body">
              <p className="service-phase">Design</p>
              <h4>Kerala Styling &amp; Cultural Design</h4>
              <p>From kasavu-inspired palettes to floral mandapam styling and reception lighting, every detail follows one cohesive visual story.</p>
            </div>
            <div className="service-arrow">↗</div>
          </div>

          <div className="service-item">
            <span className="service-num">03</span>
            <div className="service-body">
              <p className="service-phase">Coordinate</p>
              <h4>Vendor, Venue &amp; Hospitality Coordination</h4>
              <p>We coordinate caterers, decorators, photo/video teams, and guest hospitality with a single tightly managed run-of-show document.</p>
            </div>
            <div className="service-arrow">↗</div>
          </div>

          <div className="service-item">
            <span className="service-num">04</span>
            <div className="service-body">
              <p className="service-phase">Execute</p>
              <h4>Ceremony &amp; Reception Production</h4>
              <p>On wedding day we manage rituals, muhurtham windows, stage flow, and reception transitions so your family can stay fully present.</p>
            </div>
            <div className="service-arrow">↗</div>
          </div>
        </div>

        <div className="services-banner reveal-up">
          <Image src="/port4.png" alt="Kerala wedding ceremony in golden light" fill sizes="(max-width: 1400px) 100vw, 1400px" style={{ objectFit: "cover", objectPosition: "center 30%" }} />
          <div className="services-banner-copy">
            <h3>Every wedding is designed around your family customs and Kerala aesthetics.</h3>
            <a
              className="hero-btn hero-btn-primary"
              onClick={(e) => {
                e.preventDefault();
                openModal();
                trackEvent("cta_click", { location: "services_banner" });
              }}
            >
              Start Planning
            </a>
          </div>
        </div>
      </section>

      <section className="content-section trust" id="trust">
        <div className="section-head reveal-up">
          <p className="section-kicker">Trusted Partners</p>
          <h2>Preferred Kerala venues and wedding creative partners.</h2>
        </div>
        <div className="trust-marquee-wrap">
          <div className="trust-marquee-track">
            {/* Group 1 */}
            <div className="trust-marquee-item">
              <span className="trust-partner-name">KUMARAKOM LAKE RESORT</span>
              <div className="trust-marquee-divider"></div>
              <span className="trust-partner-name">LEELA KOVALAM</span>
              <div className="trust-marquee-divider"></div>
              <span className="trust-partner-name">MALABAR FLORAL ATELIER</span>
              <div className="trust-marquee-divider"></div>
              <span className="trust-partner-name">SADYA CRAFT CATERING</span>
              <div className="trust-marquee-divider"></div>
              <span className="trust-partner-name">COCHIN WEDDING FILMS</span>
              <div className="trust-marquee-divider"></div>
              <span className="trust-partner-name">THIRUVANANTHAPURAM BRIDAL TEAM</span>
              <div className="trust-marquee-divider"></div>
            </div>
            {/* Group 2 for infinite scroll */}
            <div className="trust-marquee-item" aria-hidden="true">
              <span className="trust-partner-name">KUMARAKOM LAKE RESORT</span>
              <div className="trust-marquee-divider"></div>
              <span className="trust-partner-name">LEELA KOVALAM</span>
              <div className="trust-marquee-divider"></div>
              <span className="trust-partner-name">MALABAR FLORAL ATELIER</span>
              <div className="trust-marquee-divider"></div>
              <span className="trust-partner-name">SADYA CRAFT CATERING</span>
              <div className="trust-marquee-divider"></div>
              <span className="trust-partner-name">COCHIN WEDDING FILMS</span>
              <div className="trust-marquee-divider"></div>
              <span className="trust-partner-name">THIRUVANANTHAPURAM BRIDAL TEAM</span>
              <div className="trust-marquee-divider"></div>
            </div>
          </div>
        </div>
        <div className="trust-tagline reveal-up">
          <p>Handpicked for excellence</p>
          <div className="trust-stat">
            <div className="trust-stat-item">
              <strong>40+</strong>
              <span>Venues</span>
            </div>
            <div className="trust-stat-item">
              <strong>120+</strong>
              <span>Vendors</span>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section showcase" id="showcase">

        {/* ── Section Header ── */}
        <div className="showcase-header reveal-up">
          <div className="showcase-header-meta">
            <p className="section-kicker">Featured Weddings</p>
            <h2>Stories crafted with intention,<br />executed with precision.</h2>
          </div>
          <div className="showcase-count" aria-hidden="true">
            <strong>03</strong>
            <p>Curated Stories</p>
          </div>
        </div>

        <div className="showcase-primary reveal-up">
          <div className="showcase-primary-img">
            <Image 
              src="/port1.png" 
              alt="The Nair–Menon wedding at Kumarakom Lake Resort" 
              fill 
              sizes="(max-width: 768px) 100vw, 60vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="showcase-primary-info">
            <span className="showcase-wedding-num" aria-hidden="true">01</span>
            <h3 className="showcase-couple">The Nair–Menon<br />Wedding</h3>
            <div className="showcase-meta-grid">
              <div className="showcase-meta-item">
                <span>Location</span>
                <p>Kumarakom Lake Resort</p>
              </div>
              <div className="showcase-meta-item">
                <span>Guests</span>
                <p>240 Attended</p>
              </div>
              <div className="showcase-meta-item">
                <span>Style</span>
                <p>Traditional Kerala</p>
              </div>
            </div>
            <p className="showcase-story">
              Muhurtham ceremony at sunrise, sadya for 240 guests, and a reception under backwater
              reflections — planned across three days of ceremony without a single schedule slip.
            </p>
            <a className="showcase-cta" onClick={(e) => {
              e.preventDefault();
              openModal();
              trackEvent("cta_click", { location: "showcase_primary" });
            }}>
              Plan Your Wedding <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* ── Secondary Pair ── */}
        <div className="showcase-secondary">
          <div className="showcase-secondary-item reveal-up">
            <div className="showcase-secondary-img">
              <Image 
                src="/port4.png" 
                alt="Destination beach ceremony at Kovalam" 
                fill 
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="showcase-secondary-info">
              <span className="showcase-wedding-num" aria-hidden="true">02</span>
              <h3 className="showcase-couple">Destination<br />Beach Ceremony</h3>
              <div className="showcase-meta-grid">
                <div className="showcase-meta-item">
                  <span>Location</span>
                  <p>Kovalam Beach</p>
                </div>
                <div className="showcase-meta-item">
                  <span>Guests</span>
                  <p>130 Attended</p>
                </div>
              </div>
            </div>
          </div>
          <div className="showcase-secondary-item reveal-up">
            <div className="showcase-secondary-img">
              <Image 
                src="/malab1.png" 
                alt="Heritage hall reception in Kochi" 
                fill 
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ objectFit: "cover", objectPosition: "center 20%" }} 
              />
            </div>
            <div className="showcase-secondary-info">
              <span className="showcase-wedding-num" aria-hidden="true">03</span>
              <h3 className="showcase-couple">Heritage Hall<br />Reception</h3>
              <div className="showcase-meta-grid">
                <div className="showcase-meta-item">
                  <span>Location</span>
                  <p>Kochi</p>
                </div>
                <div className="showcase-meta-item">
                  <span>Guests</span>
                  <p>180 Attended</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      <section className="content-section testimonials" id="testimonials">
        <div className="testimonials-header reveal-up">
          <div className="testimonials-header-content">
            <p className="section-kicker">Client Reviews</p>
            <h2>Words from the couples<br />who trusted us.</h2>
          </div>
          <div className="testimonials-stats">
            <div className="testimonial-stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Weddings Planned</span>
            </div>
            <div className="testimonial-stat">
              <span className="stat-number">4.9</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
        </div>
        
        <div className="testimonial-grid">
          <blockquote className="testimonial-card reveal-up">
            <div className="testimonial-quote-mark">"</div>
            <p className="testimonial-text">
              We wanted a traditional Kerala wedding with modern styling. Eventora
              handled both sides beautifully and within budget.
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">A&N</div>
              <div className="testimonial-author-info">
                <cite>Athira & Nikhil</cite>
                <span>Kochi · Traditional Ceremony</span>
              </div>
            </div>
          </blockquote>
          
          <blockquote className="testimonial-card testimonial-card--featured reveal-up">
            <div className="testimonial-quote-mark">"</div>
            <p className="testimonial-text">
              Our families had multiple customs and timings. Their team managed
              every ritual and transition seamlessly. We could truly be present
              for every moment.
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">K&A</div>
              <div className="testimonial-author-info">
                <cite>Keerthana & Arjun</cite>
                <span>Thrissur · Multi-tradition Wedding</span>
              </div>
            </div>
            <div className="testimonial-badge">Featured Story</div>
          </blockquote>
          
          <blockquote className="testimonial-card reveal-up">
            <div className="testimonial-quote-mark">"</div>
            <p className="testimonial-text">
              The team coordination and hospitality flow were excellent. We truly
              enjoyed our own wedding day.
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">F&S</div>
              <div className="testimonial-author-info">
                <cite>Fathima & Shan</cite>
                <span>Kozhikode · Nikah & Reception</span>
              </div>
            </div>
          </blockquote>
        </div>
        
        <div className="testimonials-footer reveal-up">
          <p>Every love story deserves thoughtful planning.</p>
          <a className="testimonials-cta" onClick={(e) => {
            e.preventDefault();
            openModal();
            trackEvent("cta_click", { location: "testimonials" });
          }}>
            Start Your Story <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className="work-with-us" id="work-with-us">
        <div className="work-with-us-content reveal-up">
          <p className="section-kicker">Work With Us</p>
          <h2>Let&apos;s create something extraordinary together.</h2>
          <p className="work-with-us-text">
            Whether you&apos;re planning a grand wedding celebration or an intimate ceremony,
            our team brings expertise, creativity, and dedication to every detail.
            We partner with you to transform your vision into an unforgettable experience.
          </p>
          <a className="hero-btn hero-btn-primary" onClick={(e) => {
            e.preventDefault();
            openModal();
          }}>
            Start Your Journey
          </a>
        </div>
      </section>

      <section className="content-section faq" id="faq">
        <div className="faq-header reveal-up">
          <div className="faq-header-content">
            <p className="section-kicker">FAQ</p>
            <h2>Common planning questions.</h2>
          </div>
        </div>
        
        <div className="faq-grid">
          <div className="faq-category reveal-up">
            <div className="faq-category-header">
              <span className="faq-category-icon">I.</span>
              <h3>Timing</h3>
            </div>
            <div className="faq-list">
              <details className="faq-item reveal-up" open>
                <summary>When should we start planning?</summary>
                <div className="faq-content">
                  <p>
                    Ideal lead time is 8-12 months for premium venues, though we support shorter planning windows.
                  </p>
                </div>
              </details>
              <details className="faq-item reveal-up">
                <summary>How long does planning take?</summary>
                <div className="faq-content">
                  <p>
                    Complete planning typically takes 6-8 months from concept to execution.
                  </p>
                </div>
              </details>
            </div>
          </div>
          
          <div className="faq-category reveal-up">
            <div className="faq-category-header">
              <span className="faq-category-icon">II.</span>
              <h3>Traditions</h3>
            </div>
            <div className="faq-list">
              <details className="faq-item reveal-up">
                <summary>Do you handle different wedding formats?</summary>
                <div className="faq-content">
                  <p>
                    Yes. We plan for Hindu, Christian, and Muslim wedding formats with custom schedules.
                  </p>
                </div>
              </details>
              <details className="faq-item reveal-up">
                <summary>Can you incorporate modern elements?</summary>
                <div className="faq-content">
                  <p>
                    Absolutely. We blend Kerala traditions with modern elements for unique celebrations.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <p className="section-kicker">Check Kerala Date Availability</p>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <h2>Tell us your date, venue city, and expected INR budget.</h2>
              <p>
                We reply within one business day with availability, next steps, and
                the best Kerala package fit for your celebration.
              </p>

              <form className="inquiry-form" onSubmit={handleInquirySubmit}>
                <input
                  name="name"
                  placeholder="Your name"
                  required
                  onFocus={() => trackEvent("inquiry_form_started")}
                />
                <input name="email" type="email" placeholder="Email address" required />
                <input name="phone" placeholder="Phone number (WhatsApp preferred)" required />
                <div className="form-row">
                  <input name="date" type="date" required />
                  <input name="city" placeholder="Wedding city (Kochi, Thrissur...)" required />
                </div>
                <div className="form-row">
                  <input name="guests" type="number" min="20" placeholder="Guest count" />
                  <select name="budget" required defaultValue="">
                    <option value="" disabled>
                      Budget range (INR)
                    </option>
                    <option>₹8L - ₹15L</option>
                    <option>₹15L - ₹30L</option>
                    <option>₹30L - ₹50L</option>
                    <option>₹50L+</option>
                  </select>
                </div>
                <select name="service" required defaultValue="">
                  <option value="" disabled>
                    Service needed
                  </option>
                  <option>Ceremony Coordination</option>
                  <option>Partial Planning</option>
                  <option>Full Wedding Planning</option>
                  <option>Destination Kerala Wedding Planning</option>
                </select>
                <textarea name="notes" placeholder="Tell us your wedding format, rituals, and priorities" />
                <button className="hero-btn hero-btn-primary" type="submit">
                  Send Inquiry
                </button>
              </form>

              {inquirySent && (
                <p className="confirmation-note">
                  Thanks! Your email app should open with your inquiry details.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="site-footer" id="footer">
        <div className="footer-headline">
          <h3>
            Let&apos;s design your Kerala wedding with tradition, elegance, and calm
            execution.
          </h3>
        </div>
        <div className="footer-meta">
          <p>Eventora</p>
          <p>hello@eventora.com</p>
          <p>+91 90720 18204</p>
          <p>Kochi, Kerala</p>
        </div>
      </footer>
    </>
  );
}
