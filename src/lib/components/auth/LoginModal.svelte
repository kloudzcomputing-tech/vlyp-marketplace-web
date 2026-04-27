<script>
  import { MailIcon, User2Icon, XIcon } from "@lucide/svelte";
  import loginImage from "$lib/assets/Gemini_Generated_Image_5a4uy95a4uy95a4u.png";
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
  <div
    class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-3 "
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="absolute inset-0 bg-black opacity-50 w-full h-full"
      onclick={onClose}
    ></div>

<div class="p-3 relative w-full h-full">
    <div
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex md:flex-row flex-col h-full lg:max-w-[900px] w-full bg-[#16191f] border border-[#e8b84b2e] rounded-[24px] shadow-[0_40px_120px_rgba(0,0,0,0.7),0_0_0_1px_rgba(232,184,75,0.06)] overflow-hidden max-h-[90vh]"
    >
      <div class="flex-[0_0_52%]">
        <img src={loginImage} alt="Login" class="w-full h-full object-cover" />
      </div>
      <div
        class="relative flex-1 md:p-6 p-4 bg-[#16191f] -mt-8 md:mt-0 rounded-t-3xl md:rounded-t-none flex items-center"
      >
        <button
          type="button"
          onclick={closeModal}
          aria-label="Close"
          class="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full
               hover:bg-gray-100 transition-colors"
        >
          <XIcon size={20} class="text-gray-600" />
        </button>

        <div class="w-full">
          <span
            class="text-[#f8c914] block text-[11px] tracking-[2.4px] font-semibold uppercase mb-[10px]"
            >Welcome Back</span
          >
          <h2 class="text-[34px] text-white mb-[6px] leading-[1.2]">Sign In</h2>
          <p class="text-[rgba(255,255,255,0.4)] text-[14px] mb-[36px]">
            Enter your mobile number to get started
          </p>

          {#if step === 0}
            <form onsubmit={handleGetOtp}>
              <div class="mb-4 space-y-2">
                <label
                  for="phone"
                  class="text-[12px] font-semibold tracking-[1.6px] uppercase text-[rgba(255,255,255,0.45)] mb-[8px] block"
                  >Phone Number</label
                >
                <div class="flex items-center gap-2">
                  <input
                    type="text"
                    id="country_code"
                    disabled
                    oninput={(e) => {
                      error = "";
                    }}
                    class="w-1/5 h-12 block shadow-sm sm:text-sm bg-[#1e2229] border border-[rgba(255,255,255,0.08)] rounded-[12px] text-white text-[16px] px-[18px] py-[14px] outline-none"
                    bind:value={country_code}
                  />
                  <input
                    type="text"
                    id="phone"
                    oninput={(e) => {
                      error = "";
                    }}
                    class="flex-1 block h-12 bg-[#1e2229] border border-[rgba(255,255,255,0.08)] rounded-[12px] text-white text-[16px] px-[18px] py-[14px] outline-none"
                    bind:value={phone}
                  />
                </div>
              </div>
              <div class="space-y-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  class="w-full text-sm hover:scale-102 transition-all duration-300 font-medium bg-[var(--primary-color-accent)] text-[var(--primary-color)] h-12 rounded-sm"
                >
                  {isLoading ? "Requesting OTP..." : "Request OTP"}
                </button>

                <div
                  class="flex items-center gap-[14px] my-[22px] justify-center before:content-[''] after:content-[''] before:flex-1 after:flex-1 before:h-[1px] after:h-[1px] before:bg-[rgba(255,255,255,0.07)] after:bg-[rgba(255,255,255,0.07)]"
                >
                  <span
                    class="text-[rgba(255,255,255,0.25)] text-[12px] whitespace-nowrap"
                    >or continue with</span
                  >
                </div>

                <button
                  type="button"
                  onclick={closeModal}
                  class="w-full text-sm duration-300 font-medium bg-transparent h-12 rounded-sm border border-[#ffffff1a] text-white"
                >
                  ← Back
                </button>

                <div
                  class="flex items-center gap-[8px] mt-[24px] text-[rgba(255,255,255,0.25)] text-[12px]"
                >
                  <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
                    <path
                      d="M6.5 1L1 3.5V7C1 10.2 3.42 13.2 6.5 14C9.58 13.2 12 10.2 12 7V3.5L6.5 1Z"
                      stroke="currentColor"
                      stroke-width="1.3"
                      fill="none"
                    ></path>
                    <path
                      d="M4 7L5.8 9L9 5.5"
                      stroke="currentColor"
                      stroke-width="1.3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                  Your number is encrypted and never shared with third parties.
                </div>
              </div>
            </form>
          {:else if step === 1}
            <form onsubmit={handleVerifyOTP}>
              <div class="space-y-6 mb-6">
                <div class="">
                  <p class="text-md font-medium text-gray-500">
                    OTP sent to your phone number
                  </p>
                  <p class="text-sm text-gray-500">Please enter the OTP</p>
                </div>

                <div class="mb-4 flex items-center gap-2">
                  <div class="flex gap-4 w-full">
                    {#each Array(4) as _, i}
                      <input
                        type="text"
                        maxlength="1"
                        pattern="[0-9]*"
                        inputmode="numeric"
                        class="w-10 h-12 border text-center rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm text-white"
                        bind:value={otpDigits[i]}
                        oninput={(e) => {
                          error = "";
                          otpDigits[i] = e.target.value.replace(/[^0-9]/g, "");
                          // move focus to next input automatically
                          if (otpDigits[i] && i < 5) {
                            document
                              .getElementById(`otp-input-${i + 1}`)
                              ?.focus();
                          }
                          updateOtp();
                        }}
                        onkeydown={(e) => {
                          if (e.key === "Backspace" && !otpDigits[i] && i > 0) {
                            document
                              .getElementById(`otp-input-${i - 1}`)
                              ?.focus();
                          }
                        }}
                        id={"otp-input-" + i}
                      />
                    {/each}
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                class="w-full text-sm mb-4 hover:scale-102 transition-all duration-300 font-medium bg-[var(--primary-color-accent)] text-[var(--primary-color)] h-12 rounded-sm"
              >
                {isLoading ? "Verifying OTP..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onclick={() => {
                  step = 0;
                  otp = "";
                  otpDigits = Array(4).fill("");
                  error = "";
                }}
                class="w-full text-sm hover:scale-102 transition-all duration-300 font-medium bg-gray-100 text-[var(--primary-color)] h-12 rounded-sm"
              >
                Back
              </button>
            </form>
          {:else if step === 2}
            <form onsubmit={handleCreateAccount}>
              <div class="space-y-6 mb-6">
                {#if is_new}
                  <div class=" text-sm text-gray-500">
                    <p>
                      You are a new user. Please fill the form to create your
                      account.
                    </p>
                  </div>
                  <div class="mb-6 space-y-4">
                    <div
                      class="w-full items-center gap-2 flex border border-gray-300 gray-200 rounded-xl px-4"
                    >
                      <User2Icon
                        size={20}
                        class="text-[var(--primary-color)]"
                      />
                      <input
                        type="text"
                        id="name"
                        oninput={(e) => {
                          error = "";
                        }}
                        class="w-full border h-12 block outline-none border-none focus:border-none focus:ring-0 sm:text-sm"
                        bind:value={name}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div
                      class="w-full items-center gap-2 flex border border-gray-300 gray-200 rounded-xl px-4"
                    >
                      <MailIcon size={20} class="text-[var(--primary-color)]" />
                      <input
                        type="text"
                        id="email"
                        oninput={(e) => {
                          error = "";
                        }}
                        class="w-full h-12 border block outline-none border-none focus:border-none focus:ring-0 sm:text-sm"
                        bind:value={email}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                {/if}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                class="w-full text-sm mb-4 hover:scale-102 transition-all duration-300 font-medium bg-[var(--primary-color-accent)] text-[var(--primary-color)] h-12 rounded-sm"
              >
                {isLoading ? "Verifying OTP..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onclick={() => {
                  step = 0;
                  otp = "";
                  otpDigits = Array(4).fill("");
                  error = "";
                }}
                class="w-full text-sm hover:scale-102 transition-all duration-300 font-medium bg-gray-100 text-[var(--primary-color)] h-12 rounded-sm"
              >
                Back
              </button>
            </form>
          {/if}
          {#if error != ""}
            <div class="text-red-500 text-sm text-center py-6">
              {error}
            </div>
          {/if}
        </div>
      </div>
    </div>
</div>


  </div>
{/if}
