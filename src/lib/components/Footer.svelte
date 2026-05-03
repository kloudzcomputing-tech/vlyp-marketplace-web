<script>
  import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ChevronDown, Send, Heart } from "@lucide/svelte";
  import MobileNav from "./mobienav/MobileNav.svelte";

  let { customer = null } = $props();

  // Track which accordion sections are open on mobile
  let openSections = $state({});

  function toggleSection(id) {
    openSections = { ...openSections, [id]: !openSections[id] };
  }

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  ];

  const linkColumns = [
    {
      id: "about",
      title: "About",
      links: [
        { href: "/contact", label: "Contact Us" },
        { href: "/about", label: "About Vlyp" },
        { href: "/careers", label: "Careers" },
        { href: "/stories", label: "Vlyp Stories" },
        { href: "/press", label: "Press" },
        { href: "/corporate", label: "Corporate Information" },
      ],
    },
    {
      id: "group",
      title: "Our Group",
      links: [
        { href: "/mart", label: "Vlyp Mart" },
        { href: "/deals", label: "Vlyp Deals" },
        { href: "/express", label: "Vlyp Express" },
      ],
    },
    {
      id: "help",
      title: "Help",
      links: [
        { href: "/payments", label: "Payments" },
        { href: "/shipping", label: "Shipping" },
        { href: "/returns", label: "Cancellations & Returns" },
        { href: "/faq", label: "FAQs" },
      ],
    },
    {
      id: "policies",
      title: "Policies",
      links: [
        { href: "/seller-policies", label: "Seller Policies" },
        { href: "/buyer-policies", label: "Buyer Policies" },
        { href: "/platform-policies", label: "Platform Policies" },
        { href: "/legal", label: "Legal & Compliance" },
        { href: "/optional-policies", label: "Optional Policies" },
      ],
    },
  ];
</script>

<footer class="vlyp-footer">
  <!-- ════════════ TOP BRAND STRIP ════════════ -->
  <div class="footer-brand-strip">
    <div class="footer-container">
      <div class="brand-strip-inner">
        <div class="brand-strip-left">
          <span class="brand-logo-text">VLYP</span>
          <span class="brand-tagline">Your Style, Your Story</span>
        </div>
        <div class="brand-strip-right">
          <div class="newsletter-form">
            <div class="newsletter-input-wrap">
              <Mail class="newsletter-icon" size={16} />
              <input type="email" placeholder="Enter your email for updates" class="newsletter-input" />
            </div>
            <button class="newsletter-btn" aria-label="Subscribe">
              <Send size={16} />
              <span class="newsletter-btn-text">Subscribe</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ════════════ MAIN FOOTER CONTENT ════════════ -->
  <div class="footer-main">
    <div class="footer-container">
      <div class="footer-grid">

        <!-- Link Columns (Accordion on mobile) -->
        <div class="footer-links-area">
          {#each linkColumns as column}
            <div class="footer-link-column">
              <!-- Desktop heading -->
              <h6 class="column-heading desktop-only">{column.title}</h6>

              <!-- Mobile accordion trigger -->
              <button 
                class="accordion-trigger mobile-only"
                onclick={() => toggleSection(column.id)}
                aria-expanded={openSections[column.id] || false}
              >
                <span>{column.title}</span>
                <ChevronDown 
                  size={16} 
                  class="accordion-chevron {openSections[column.id] ? 'rotated' : ''}" 
                />
              </button>

              <!-- Links list -->
              <ul class="column-links {openSections[column.id] ? 'expanded' : ''}">
                {#each column.links as link}
                  <li>
                    <a href={link.href} class="footer-link">
                      {link.label}
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>

        <!-- Contact Area -->
        <div class="footer-contact-area">
          <!-- Mail Us Card -->
          <div class="contact-card">
            <div class="contact-card-header">
              <div class="contact-icon-wrap">
                <Mail size={16} />
              </div>
              <h6 class="contact-title">Mail Us</h6>
            </div>
            <address class="contact-address">
              <p>Vlyp Internet Private Limited,</p>
              <p>Harmony Tower, 2nd Floor,</p>
              <p>Greenfield Tech Park, Sector V,</p>
              <p>Kolkata, 700091,</p>
              <p>West Bengal, India</p>
            </address>
          </div>

          <!-- Registered Office Card -->
          <div class="contact-card">
            <div class="contact-card-header">
              <div class="contact-icon-wrap">
                <MapPin size={16} />
              </div>
              <h6 class="contact-title">Registered Office</h6>
            </div>
            <address class="contact-address">
              <p>Vlyp Internet Private Limited,</p>
              <p>Harmony Tower, 2nd Floor,</p>
              <p>Greenfield Tech Park, Sector V,</p>
              <p>Kolkata, 700091,</p>
              <p>West Bengal, India</p>
            </address>
            <div class="contact-meta">
              <p><strong>CIN:</strong> U1TY84757757336</p>
              <div class="contact-phone">
                <Phone size={14} />
                <span>Telephone:</span>
                <a href="tel:+918747747357">+91-8747-7473-57</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- ════════════ SOCIAL + BOTTOM BAR ════════════ -->
  <div class="footer-bottom">
    <div class="footer-container">
      <div class="footer-bottom-inner">
        <div class="footer-social">
          {#each socialLinks as social}
            <a 
              href={social.href} 
              aria-label={social.label}
              class="social-link"
            >
              <social.icon size={18} />
            </a>
          {/each}
        </div>

        <p class="footer-copyright">
          © 2025 Vlyp.com — Made with <Heart size={12} class="heart-icon" /> in India
        </p>

        <div class="footer-legal">
          <a href="/privacy">Privacy Policy</a>
          <span class="legal-dot">•</span>
          <a href="/terms">Terms of Service</a>
        </div>
      </div>
    </div>
  </div>
</footer>
<MobileNav {customer}/>

<style>
  /* ─────────────── BASE TOKENS ─────────────── */
  .vlyp-footer {
    --ft-bg: #1a1a2e;
    --ft-surface: #16213e;
    --ft-border: rgba(255, 255, 255, 0.06);
    --ft-text: #94a3b8;
    --ft-text-muted: #64748b;
    --ft-text-heading: #e2e8f0;
    --ft-accent: #FF3F6C;
    --ft-accent-glow: rgba(255, 63, 108, 0.15);
    --ft-radius: 12px;

    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
    color: var(--ft-text);
    line-height: 1.6;
  }

  /* ─────────────── CONTAINER ─────────────── */
  .footer-container {
    max-width: 1280px;
    margin: 0 auto;
    padding-left: 16px;
    padding-right: 16px;
  }
  @media (min-width: 640px) {
    .footer-container { padding-left: 24px; padding-right: 24px; }
  }
  @media (min-width: 1024px) {
    .footer-container { padding-left: 32px; padding-right: 32px; }
  }

  /* ─────────────── BRAND STRIP ─────────────── */
  .footer-brand-strip {
    background: linear-gradient(135deg, #FF3F6C 0%, #e62255 40%, #c91845 100%);
    padding: 20px 0;
    position: relative;
    overflow: hidden;
  }
  .footer-brand-strip::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }
  .brand-strip-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    position: relative;
    z-index: 1;
  }
  @media (min-width: 768px) {
    .brand-strip-inner {
      flex-direction: row;
      justify-content: space-between;
    }
  }
  .brand-strip-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .brand-logo-text {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 3px;
    color: #fff;
    text-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  .brand-tagline {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 400;
    letter-spacing: 0.5px;
    display: none;
  }
  @media (min-width: 480px) {
    .brand-tagline { display: inline; }
  }

  /* Newsletter */
  .brand-strip-right { width: 100%; max-width: 420px; }
  @media (min-width: 768px) {
    .brand-strip-right { width: auto; }
  }
  .newsletter-form {
    display: flex;
    gap: 0;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 50px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    overflow: hidden;
    transition: background 0.3s, border-color 0.3s;
  }
  .newsletter-form:focus-within {
    background: rgba(255, 255, 255, 0.22);
    border-color: rgba(255, 255, 255, 0.35);
  }
  .newsletter-input-wrap {
    display: flex;
    align-items: center;
    flex: 1;
    padding-left: 16px;
    gap: 8px;
    color: rgba(255, 255, 255, 0.6);
  }
  .newsletter-icon {
    flex-shrink: 0;
  }
  .newsletter-input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: #fff;
    font-size: 13px;
    padding: 12px 8px;
    min-width: 0;
  }
  .newsletter-input::placeholder {
    color: rgba(255, 255, 255, 0.55);
    font-size: 12px;
  }
  .newsletter-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 12px 20px;
    background: #fff;
    color: var(--ft-accent);
    font-weight: 600;
    font-size: 13px;
    border: none;
    border-radius: 50px;
    margin: 4px;
    cursor: pointer;
    transition: all 0.25s ease;
    white-space: nowrap;
  }
  .newsletter-btn:hover {
    background: #fff;
    transform: scale(1.03);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
  .newsletter-btn:active {
    transform: scale(0.97);
  }
  .newsletter-btn-text {
    display: none;
  }
  @media (min-width: 480px) {
    .newsletter-btn-text { display: inline; }
  }

  /* ─────────────── MAIN FOOTER ─────────────── */
  .footer-main {
    background: var(--ft-bg);
    padding: 32px 0;
  }
  @media (min-width: 768px) {
    .footer-main { padding: 48px 0; }
  }

  .footer-grid {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  @media (min-width: 1024px) {
    .footer-grid {
      flex-direction: row;
      gap: 48px;
    }
  }

  /* ── Link columns area ── */
  .footer-links-area {
    display: flex;
    flex-direction: column;
    gap: 0;
    flex: 1;
  }
  @media (min-width: 640px) {
    .footer-links-area {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px 32px;
    }
  }
  @media (min-width: 1024px) {
    .footer-links-area {
      grid-template-columns: repeat(4, 1fr);
      gap: 32px;
    }
  }

  .footer-link-column {
    border-bottom: 1px solid var(--ft-border);
  }
  @media (min-width: 640px) {
    .footer-link-column {
      border-bottom: none;
    }
  }

  /* Headings */
  .column-heading {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--ft-text-heading);
    margin: 0 0 16px 0;
    padding-bottom: 10px;
    position: relative;
  }
  .column-heading::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 24px;
    height: 2px;
    background: var(--ft-accent);
    border-radius: 2px;
  }

  /* Responsive display helpers */
  .desktop-only { display: none; }
  .mobile-only { display: flex; }
  @media (min-width: 640px) {
    .desktop-only { display: block; }
    .mobile-only { display: none !important; }
  }

  /* Accordion */
  .accordion-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    background: none;
    border: none;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--ft-text-heading);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  :global(.accordion-chevron) {
    transition: transform 0.3s ease !important;
    color: var(--ft-text-muted);
  }
  :global(.accordion-chevron.rotated) {
    transform: rotate(180deg);
  }

  /* Links list */
  .column-links {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  /* Mobile: collapsed by default */
  @media (max-width: 639px) {
    .column-links {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.35s ease, padding 0.35s ease;
      padding-bottom: 0;
    }
    .column-links.expanded {
      max-height: 300px;
      padding-bottom: 14px;
    }
  }
  @media (min-width: 640px) {
    .column-links { gap: 10px; }
  }

  .footer-link {
    font-size: 13px;
    color: var(--ft-text);
    text-decoration: none;
    transition: color 0.2s, padding-left 0.2s;
    display: inline-block;
    padding: 2px 0;
  }
  .footer-link:hover {
    color: #fff;
    padding-left: 4px;
  }

  /* ── Contact area ── */
  .footer-contact-area {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    flex-shrink: 0;
  }
  @media (min-width: 640px) {
    .footer-contact-area {
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
  }
  @media (min-width: 1024px) {
    .footer-contact-area {
      grid-template-columns: 1fr;
      width: 280px;
      gap: 16px;
    }
  }

  .contact-card {
    background: var(--ft-surface);
    border: 1px solid var(--ft-border);
    border-radius: var(--ft-radius);
    padding: 20px;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .contact-card:hover {
    border-color: rgba(255, 63, 108, 0.15);
    box-shadow: 0 4px 24px rgba(255, 63, 108, 0.06);
  }

  .contact-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }
  .contact-icon-wrap {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--ft-accent-glow);
    color: var(--ft-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .contact-title {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--ft-text-heading);
    margin: 0;
  }

  .contact-address {
    font-style: normal;
    font-size: 13px;
    line-height: 1.7;
    color: var(--ft-text);
  }
  .contact-address p {
    margin: 0;
  }

  .contact-meta {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid var(--ft-border);
    font-size: 13px;
  }
  .contact-meta strong {
    color: var(--ft-text-heading);
    font-weight: 600;
  }
  .contact-phone {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    flex-wrap: wrap;
    color: var(--ft-text);
  }
  .contact-phone a {
    color: #60a5fa;
    text-decoration: none;
    transition: color 0.2s;
  }
  .contact-phone a:hover {
    color: #93bbfd;
    text-decoration: underline;
  }

  /* ─────────────── BOTTOM BAR ─────────────── */
  .footer-bottom {
    background: var(--ft-surface);
    border-top: 1px solid var(--ft-border);
    padding: 20px 0;
  }
  .footer-bottom-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  @media (min-width: 768px) {
    .footer-bottom-inner {
      flex-direction: row;
      justify-content: space-between;
    }
  }

  /* Social links */
  .footer-social {
    display: flex;
    align-items: center;
    gap: 8px;
    order: 1;
  }
  @media (min-width: 768px) {
    .footer-social { order: 0; }
  }
  .social-link {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ft-text);
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--ft-border);
    transition: all 0.3s ease;
    text-decoration: none;
  }
  .social-link:hover {
    color: #fff;
    background: var(--ft-accent);
    border-color: var(--ft-accent);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 63, 108, 0.25);
  }
  .social-link:active {
    transform: translateY(0) scale(0.95);
  }

  /* Copyright */
  .footer-copyright {
    font-size: 12px;
    color: var(--ft-text-muted);
    display: flex;
    align-items: center;
    gap: 4px;
    order: 2;
  }
  @media (min-width: 768px) {
    .footer-copyright { order: 0; }
  }
  :global(.heart-icon) {
    color: var(--ft-accent);
    animation: heartbeat 2s infinite;
  }
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    15% { transform: scale(1.2); }
    30% { transform: scale(1); }
  }

  /* Legal links */
  .footer-legal {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    order: 3;
  }
  @media (min-width: 768px) {
    .footer-legal { order: 0; }
  }
  .footer-legal a {
    color: var(--ft-text-muted);
    text-decoration: none;
    transition: color 0.2s;
  }
  .footer-legal a:hover {
    color: #fff;
  }
  .legal-dot {
    color: var(--ft-text-muted);
  }

  /* ─────────────── TOUCH TARGET (MOBILE A11Y) ─────────────── */
  @media (max-width: 640px) {
    .footer-link {
      min-height: 36px;
      display: flex;
      align-items: center;
    }
  }

  /* ─────────────── FOCUS STATES ─────────────── */
  .vlyp-footer a:focus-visible,
  .vlyp-footer button:focus-visible {
    outline: 2px solid rgba(255, 63, 108, 0.5);
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* ─────────────── BOTTOM PADDING FOR MOBILE NAV ─────────────── */
  @media (max-width: 639px) {
    .footer-bottom {
      padding-bottom: 90px;
    }
  }
</style>
