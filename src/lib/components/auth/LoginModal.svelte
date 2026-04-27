<script>
  import {
    MailIcon,
    User2Icon,
    XIcon,
    PhoneIcon,
    ShieldCheckIcon,
    SparklesIcon,
  } from "@lucide/svelte";
  import loginImage from "$lib/assets/login-shopping.png";
  let { open, onClose, onLoggedIn } = $props();
  let phone = $state("");
  let country_code = $state("91");
  let isLoading = $state(false);
  let otp = $state("");
  let step = $state(0);
  let error = $state("");
  let is_new = $state(false);
  let name = $state("");
  let email = $state("");
  let otpDigits = $state(Array(4).fill(""));
  const updateOtp = () => {
    otp = otpDigits.join("");
  };
  const handleGetOtp = async (e) => {
    e.preventDefault();
    if (!phone) {
      alert("Please enter your phone number");
      return;
    }
    if (phone.length !== 10) {
      alert("Please enter a valid phone number");
      return;
    }
    isLoading = true;
    const response = await fetch("/api/auth/get-otp", {
      method: "POST",
      body: JSON.stringify({
        country_code: country_code.replace("+", ""),
        phone,
      }),
    });
    const data = await response.json();
    if (data.status) {
      isLoading = false;
      step = 1;
      is_new = data.data.is_new;
    } else {
      isLoading = false;
      error = data.message;
    }
  };
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 4) {
      alert("Please enter the OTP");
      return;
    }

    // 🟢 NEW USER → NO API CALL HERE
    if (is_new) {
      step = 2;
      return;
    }

    // 🔵 EXISTING USER → VERIFY OTP
    isLoading = true;

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        otp,
        country_code: country_code.replace("+", ""),
        phone,
      }),
    });

    const data = await res.json();
    isLoading = false;

    if (!data.status) {
      error = data.message;
      return;
    }

    onLoggedIn();
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      alert("Please fill all the fields");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email");
      return;
    }

    isLoading = true;

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        otp,
        country_code: country_code.replace("+", ""),
        phone,
        is_new: true,
        name,
        email,
      }),
    });

    const data = await res.json();
    isLoading = false;

    if (!data.status) {
      error = data.message;
      return;
    }

    onLoggedIn();
  };

  const closeModal = () => {
    step = 0;
    phone = "";
    otp = "";
    otpDigits = Array(4).fill("");
    name = "";
    email = "";
    error = "";
    is_new = false;
    isLoading = false;
    onClose();
  };
</script>

{#if open}
  <div class="login-overlay" role="dialog" aria-modal="true">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="login-backdrop" onclick={closeModal}></div>

    <div class="login-modal">
      <!-- Close Button -->
      <button
        type="button"
        onclick={closeModal}
        aria-label="Close"
        class="login-close-btn"
      >
        <XIcon size={18} />
      </button>

      <!-- Left: Image Panel (hidden on mobile) -->
      <div class="login-image-panel">
        <div class="login-image-content">
          <img src={loginImage} alt="Shopping" class="login-hero-img" />
          <div class="login-image-text">
            <h3>Shop Smarter</h3>
            <p>Discover amazing deals on thousands of products</p>
          </div>
        </div>
      </div>

      <!-- Right: Form Panel -->
      <div class="login-form-panel">
        <div class="login-form-inner">
          <!-- Brand -->
          <div class="login-brand">
            <span class="login-brand-name"
              >Cart<span class="login-brand-accent">ly</span></span
            >
          </div>

          {#if step === 0}
            <!-- Step 0: Phone Number -->
            <div class="login-step-header">
              <h2 class="login-title">Welcome back!</h2>
              <p class="login-subtitle">Enter your mobile number to continue</p>
            </div>

            <form onsubmit={handleGetOtp} class="login-form">
              <div class="login-field">
                <label for="phone" class="login-label">Phone Number</label>
                <div class="login-phone-row">
                  <div class="login-country-code">
                    <span class="login-flag">🇮🇳</span>
                    <input
                      type="text"
                      id="country_code"
                      disabled
                      class="login-cc-input"
                      bind:value={country_code}
                    />
                  </div>
                  <input
                    type="text"
                    id="phone"
                    placeholder="Enter 10-digit number"
                    inputmode="numeric"
                    maxlength="10"
                    oninput={(e) => {
                      error = "";
                    }}
                    class="login-phone-input"
                    bind:value={phone}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                class="login-submit-btn"
              >
                {#if isLoading}
                  <span class="login-spinner"></span>
                  Sending OTP...
                {:else}
                  Get OTP
                {/if}
              </button>

              <div class="login-divider">
                <span>or</span>
              </div>

              <button type="button" onclick={closeModal} class="login-back-btn">
                Continue as Guest
              </button>

              <div class="login-secure-note">
                <ShieldCheckIcon size={13} />
                <span>Your data is encrypted & never shared</span>
              </div>
            </form>
          {:else if step === 1}
            <!-- Step 1: OTP Verification -->
            <div class="login-step-header">
              <h2 class="login-title">Verify OTP</h2>
              <p class="login-subtitle">
                We sent a 4-digit code to <strong
                  >+{country_code} {phone}</strong
                >
              </p>
            </div>

            <form onsubmit={handleVerifyOTP} class="login-form">
              <div class="login-otp-row">
                {#each Array(4) as _, i}
                  <input
                    type="text"
                    maxlength="1"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    class="login-otp-input"
                    bind:value={otpDigits[i]}
                    oninput={(e) => {
                      error = "";
                      otpDigits[i] = e.target.value.replace(/[^0-9]/g, "");
                      if (otpDigits[i] && i < 3) {
                        document.getElementById(`otp-input-${i + 1}`)?.focus();
                      }
                      updateOtp();
                    }}
                    onkeydown={(e) => {
                      if (e.key === "Backspace" && !otpDigits[i] && i > 0) {
                        document.getElementById(`otp-input-${i - 1}`)?.focus();
                      }
                    }}
                    id={"otp-input-" + i}
                  />
                {/each}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                class="login-submit-btn"
              >
                {#if isLoading}
                  <span class="login-spinner"></span>
                  Verifying...
                {:else}
                  Verify & Continue
                {/if}
              </button>

              <button
                type="button"
                onclick={() => {
                  step = 0;
                  otp = "";
                  otpDigits = Array(4).fill("");
                  error = "";
                }}
                class="login-back-btn"
              >
                ← Change Number
              </button>
            </form>
          {:else if step === 2}
            <!-- Step 2: Create Account -->
            <div class="login-step-header">
              <div class="login-new-badge">
                <SparklesIcon size={14} />
                <span>New Account</span>
              </div>
              <h2 class="login-title">Almost there!</h2>
              <p class="login-subtitle">Complete your profile to get started</p>
            </div>

            <form onsubmit={handleCreateAccount} class="login-form">
              <div class="login-field">
                <label for="name" class="login-label">Full Name</label>
                <div class="login-input-wrap">
                  <User2Icon size={18} class="login-input-icon" />
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your full name"
                    oninput={(e) => {
                      error = "";
                    }}
                    class="login-text-input"
                    bind:value={name}
                  />
                </div>
              </div>

              <div class="login-field">
                <label for="email" class="login-label">Email Address</label>
                <div class="login-input-wrap">
                  <MailIcon size={18} class="login-input-icon" />
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    oninput={(e) => {
                      error = "";
                    }}
                    class="login-text-input"
                    bind:value={email}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                class="login-submit-btn"
              >
                {#if isLoading}
                  <span class="login-spinner"></span>
                  Creating Account...
                {:else}
                  Create Account
                {/if}
              </button>

              <button
                type="button"
                onclick={() => {
                  step = 0;
                  otp = "";
                  otpDigits = Array(4).fill("");
                  error = "";
                }}
                class="login-back-btn"
              >
                ← Start Over
              </button>
            </form>
          {/if}

          {#if error !== ""}
            <div class="login-error">
              {error}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* ============================================
     OVERLAY & BACKDROP
     ============================================ */
  .login-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 1rem;
    animation: fadeIn 0.25s ease;
  }

  .login-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }

  /* ============================================
     MODAL CONTAINER
     ============================================ */
  .login-modal {
    position: relative;
    display: flex;
    width: 100%;
    max-width: 720px;
    max-height: 520px;
    background: #ffffff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow:
      0 25px 60px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(0, 0, 0, 0.04);
    animation: modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* ============================================
     CLOSE BUTTON
     ============================================ */
  .login-close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.06);
    color: #555;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .login-close-btn:hover {
    background: rgba(0, 0, 0, 0.12);
    color: #111;
    transform: rotate(90deg);
  }

  /* ============================================
     LEFT IMAGE PANEL
     ============================================ */
  .login-image-panel {
    flex: 0 0 280px;
    background: linear-gradient(160deg, #f0faf9 0%, #e6f7f5 50%, #fef9e7 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
    position: relative;
    overflow: hidden;
  }

  .login-image-panel::before {
    content: "";
    position: absolute;
    top: -40px;
    right: -40px;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: rgba(14, 138, 138, 0.08);
  }

  .login-image-panel::after {
    content: "";
    position: absolute;
    bottom: -30px;
    left: -30px;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: rgba(248, 201, 20, 0.12);
  }

  .login-image-content {
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .login-hero-img {
    max-width: 100%;
    width: 100%;
    height: 200px;
    object-fit: contain;
    margin-bottom: 1.25rem;
    filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.08));
  }

  .login-image-text h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--primary-color, #112721);
    margin: 0 0 0.375rem;
  }

  .login-image-text p {
    font-size: 0.8125rem;
    color: #5a7a72;
    line-height: 1.5;
    margin: 0;
  }

  /* ============================================
     RIGHT FORM PANEL
     ============================================ */
  .login-form-panel {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 2rem 2rem 2rem 1.75rem;
    min-width: 0;
  }

  .login-form-inner {
    width: 100%;
  }

  /* Brand */
  .login-brand {
    margin-bottom: 1.25rem;
  }

  .login-brand-name {
    font-size: 1.375rem;
    font-weight: 800;
    color: var(--primary-color, #112721);
    letter-spacing: -0.02em;
  }

  .login-brand-accent {
    color: #f8c914;
    font-style: italic;
  }

  /* Step Header */
  .login-step-header {
    margin-bottom: 1.25rem;
  }

  .login-title {
    font-size: 1.375rem;
    font-weight: 700;
    color: #111;
    margin: 0 0 0.25rem;
    line-height: 1.2;
  }

  .login-subtitle {
    font-size: 0.8125rem;
    color: #777;
    margin: 0;
    line-height: 1.5;
  }

  .login-subtitle strong {
    color: #333;
  }

  /* New Badge */
  .login-new-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.75rem;
    background: linear-gradient(135deg, #fef9e7, #fff3cd);
    border: 1px solid #f8c914;
    border-radius: 999px;
    font-size: 0.6875rem;
    font-weight: 600;
    color: #92710a;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  /* ============================================
     FORM ELEMENTS
     ============================================ */
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  .login-field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .login-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  /* Phone Row */
  .login-phone-row {
    display: flex;
    gap: 0.5rem;
  }

  .login-country-code {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0 0.75rem;
    background: #f7f8fa;
    border: 1.5px solid #e8eaed;
    border-radius: 12px;
    flex-shrink: 0;
  }

  .login-flag {
    font-size: 1.125rem;
  }

  .login-cc-input {
    width: 32px;
    border: none;
    background: transparent;
    font-size: 0.875rem;
    font-weight: 600;
    color: #333;
    text-align: center;
    outline: none;
  }

  .login-phone-input {
    flex: 1;
    height: 46px;
    padding: 0 1rem;
    background: #f7f8fa;
    border: 1.5px solid #e8eaed;
    border-radius: 12px;
    font-size: 0.9375rem;
    color: #111;
    outline: none;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .login-phone-input:focus {
    border-color: var(--new-brand-color, #0e8a8a);
    box-shadow: 0 0 0 3px rgba(14, 138, 138, 0.1);
    background: #fff;
  }

  .login-phone-input::placeholder {
    color: #b0b5bc;
  }

  /* Text Input with Icon */
  .login-input-wrap {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0 1rem;
    background: #f7f8fa;
    border: 1.5px solid #e8eaed;
    border-radius: 12px;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .login-input-wrap:focus-within {
    border-color: var(--new-brand-color, #0e8a8a);
    box-shadow: 0 0 0 3px rgba(14, 138, 138, 0.1);
    background: #fff;
  }

  :global(.login-input-icon) {
    color: #999;
    flex-shrink: 0;
  }

  .login-text-input {
    flex: 1;
    height: 44px;
    border: none;
    background: transparent;
    font-size: 0.875rem;
    color: #111;
    outline: none;
  }

  .login-text-input::placeholder {
    color: #b0b5bc;
  }

  /* OTP */
  .login-otp-row {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    margin: 0.5rem 0;
  }

  .login-otp-input {
    width: 52px;
    height: 56px;
    text-align: center;
    font-size: 1.375rem;
    font-weight: 700;
    color: #111;
    background: #f7f8fa;
    border: 1.5px solid #e8eaed;
    border-radius: 14px;
    outline: none;
    transition: all 0.2s ease;
    caret-color: var(--new-brand-color, #0e8a8a);
  }

  .login-otp-input:focus {
    border-color: var(--new-brand-color, #0e8a8a);
    box-shadow: 0 0 0 3px rgba(14, 138, 138, 0.12);
    background: #fff;
    transform: translateY(-1px);
  }

  /* ============================================
     BUTTONS
     ============================================ */
  .login-submit-btn {
    width: 100%;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: var(--primary-color, #112721);
    color: #f8c914;
    font-size: 0.875rem;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.25s ease;
    letter-spacing: 0.01em;
  }

  .login-submit-btn:hover:not(:disabled) {
    background: var(--primary-color-light, #1f3e37);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(17, 39, 33, 0.25);
  }

  .login-submit-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .login-submit-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .login-back-btn {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: #777;
    font-size: 0.8125rem;
    font-weight: 500;
    border: 1.5px solid #e8eaed;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .login-back-btn:hover {
    background: #f7f8fa;
    color: #333;
    border-color: #d1d5db;
  }

  /* Divider */
  .login-divider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .login-divider::before,
  .login-divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e8eaed;
  }

  .login-divider span {
    font-size: 0.75rem;
    color: #aaa;
    white-space: nowrap;
  }

  /* Secure Note */
  .login-secure-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    font-size: 0.6875rem;
    color: #aaa;
    margin-top: 0.25rem;
  }

  /* Spinner */
  .login-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(248, 201, 20, 0.3);
    border-top-color: #f8c914;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  /* Error */
  .login-error {
    margin-top: 0.75rem;
    padding: 0.625rem 0.875rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 10px;
    font-size: 0.8125rem;
    color: #dc2626;
    text-align: center;
  }

  /* ============================================
     ANIMATIONS
     ============================================ */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes modalSlideUp {
    from {
      opacity: 0;
      transform: translateY(24px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes floatImage {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* ============================================
     RESPONSIVE
     ============================================ */
  @media (max-width: 640px) {
    .login-modal {
      flex-direction: column;
      max-height: 90vh;
      max-width: 400px;
      overflow-y: auto;
    }

    .login-image-panel {
      flex: none;
      padding: 1.5rem 1.25rem 1rem;
    }

    .login-hero-img {
      width: 120px;
      height: 120px;
      margin-bottom: 0.75rem;
    }

    .login-image-text h3 {
      font-size: 1rem;
    }

    .login-image-text p {
      font-size: 0.75rem;
    }

    .login-form-panel {
      padding: 1.25rem 1.5rem 1.5rem;
    }

    .login-brand {
      display: none;
    }

    .login-close-btn {
      background: rgba(255, 255, 255, 0.85);
    }
  }
</style>
