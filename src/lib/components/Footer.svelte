<script>
  import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "@lucide/svelte";
  import MobileNav from "./mobienav/MobileNav.svelte";

  // Social media links with brand colors
  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook", color: "hover:text-blue-500 hover:border-blue-500" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter", color: "hover:text-sky-400 hover:border-sky-400" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram", color: "hover:text-pink-500 hover:border-pink-500" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube", color: "hover:text-red-500 hover:border-red-500" },
  ];
</script>

<footer class="bg-[#262626] text-gray-200">
  <!-- Main Footer Content -->
  <div class="px-3 py-8 sm:px-4 sm:py-12 lg:px-6 lg:py-16">
    <div class="mx-auto grid max-w-7xl grid-cols-2 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-10 xl:grid-cols-[1fr_1fr_1fr_1fr_2fr_2fr]">
      
      <!-- Column 1: About -->
      <div class="sm:col-span-1">
        <h6 class="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 sm:mb-5">
          About
        </h6>
        <ul class="space-y-2.5 sm:space-y-3">
          <li>
            <a href="/contact" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block">
              Contact Us
            </a>
          </li>
          <li>
            <a href="/about" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block">
              About Vlyp
            </a>
          </li>
          <li>
            <a href="/careers" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block">
              Careers
            </a>
          </li>
          <li>
            <a href="/stories" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block">
              Vlyp Stories
            </a>
          </li>
          <li>
            <a href="/press" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block">
              Press
            </a>
          </li>
          <li>
            <a href="/corporate" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block">
              Corporate Information
            </a>
          </li>
        </ul>
      </div>

      <!-- Column 2: Our Group -->
      <div class="sm:col-span-1">
        <h6 class="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 sm:mb-5">
          Our Group
        </h6>
        <ul class="space-y-2.5 sm:space-y-3">
          <li>
            <a href="/mart" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block">
              Vlyp Mart
            </a>
          </li>
          <li>
            <a href="/deals" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block">
              Vlyp Deals
            </a>
          </li>
          <li>
            <a href="/express" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block">
              Vlyp Express
            </a>
          </li>
        </ul>
      </div>

      <!-- Column 3: Help -->
      <div class="sm:col-span-1">
        <h6 class="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 sm:mb-5">
          Help
        </h6>
        <ul class="space-y-2.5 sm:space-y-3">
          <li>
            <a href="/payments" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block">
              Payments
            </a>
          </li>
          <li>
            <a href="/shipping" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block">
              Shipping
            </a>
          </li>
          <li>
            <a href="/returns" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block">
              Cancellations & Returns
            </a>
          </li>
          <li>
            <a href="/faq" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block">
              FAQs
            </a>
          </li>
        </ul>
      </div>

      <!-- Column 4: Policies -->
      <div class="sm:col-span-1">
        <h6 class="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 sm:mb-5">
          Policies
        </h6>
        <ul class="space-y-2.5 sm:space-y-3">
          <li>
            <a href="/seller-policies" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block">
              Seller Policies
            </a>
          </li>
          <li>
            <a href="/buyer-policies" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block">
              Buyer Policies
            </a>
          </li>
          <li>
            <a href="/platform-policies" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block">
              Platform (Admin) Policies
            </a>
          </li>
          <li>
            <a href="/legal" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block">
              Legal & Compliance Policies
            </a>
          </li>
          <li>
            <a href="/optional-policies" class="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block">
              Optional Policies
            </a>
          </li>
        </ul>
      </div>

      <!-- Column 5 & 6: Contact Information (spans 2 columns on large screens) -->
      <div class="sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-2">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          
          <!-- Mail Us -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 mb-4">
              <Mail class="w-4 h-4 text-gray-400" />
              <h6 class="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Mail Us
              </h6>
            </div>
            <address class="text-xs sm:text-sm leading-relaxed text-gray-400 not-italic space-y-1">
              <p>Vlyp Internet Private Limited,</p>
              <p>Harmony Tower, 2nd Floor,</p>
              <p>Greenfield Tech Park, Sector V,</p>
              <p>Kolkata, 700091,</p>
              <p>West Bengal, India</p>
            </address>

            <!-- Social Media -->
            <div class="pt-4 border-t border-gray-700">
              <p class="text-xs text-gray-500 mb-3 uppercase tracking-wide">Follow Us</p>
              <div class="flex items-center gap-2.5 sm:gap-3">
                {#each socialLinks as social}
                  <a 
                    href={social.href} 
                    aria-label={social.label}
                    class="group p-2.5 sm:p-3 border border-gray-600 rounded-full hover:border-transparent transition-all duration-300 {social.color} hover:scale-110 active:scale-95"
                  >
                    <social.icon class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-current transition-colors duration-300" />
                  </a>
                {/each}
              </div>
            </div>
          </div>

          <!-- Registered Office -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 mb-4">
              <MapPin class="w-4 h-4 text-gray-400" />
              <h6 class="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Registered Office
              </h6>
            </div>
            <address class="text-xs sm:text-sm leading-relaxed text-gray-400 not-italic space-y-1">
              <p>Vlyp Internet Private Limited,</p>
              <p>Harmony Tower, 2nd Floor,</p>
              <p>Greenfield Tech Park, Sector V,</p>
              <p>Kolkata, 700091,</p>
              <p>West Bengal, India</p>
            </address>

            <div class="pt-4 border-t border-gray-700 space-y-2">
              <p class="text-xs sm:text-sm text-gray-400">
                <span class="font-medium">CIN:</span> U1TY84757757336
              </p>
              <div class="flex items-center gap-2 flex-wrap">
                <Phone class="w-3.5 h-3.5 text-gray-500" />
                <span class="text-xs sm:text-sm text-gray-400">Telephone:</span>
                <a href="tel:+918747747357" class="text-xs sm:text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200">
                  +91-8747-7473-57
                </a>
                <span class="text-gray-500">/</span>
                <a href="tel:+918747747357" class="text-xs sm:text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200">
                  +91-8747-7473-57
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Bar -->
  <div class="border-t border-gray-700/50">
    <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <p class="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
          © 2025 Vlyp.com — All Rights Reserved
        </p>
        <div class="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
          <a href="/privacy" class="hover:text-gray-300 transition-colors duration-200">
            Privacy Policy
          </a>
          <span class="hidden sm:inline">•</span>
          <a href="/terms" class="hover:text-gray-300 transition-colors duration-200">
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>
<MobileNav/>
<style>
  /* Smooth transitions for all interactive elements */
  footer a {
    transition: all 0.2s ease-in-out;
  }

  /* Improve touch targets on mobile */
  @media (max-width: 640px) {
    footer a {
      min-height: 44px;
      display: flex;
      align-items: center;
    }
  }

  /* Better focus states for accessibility */
  footer a:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
    border-radius: 4px;
  }
</style>
