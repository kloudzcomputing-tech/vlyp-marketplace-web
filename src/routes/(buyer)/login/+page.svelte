<script>
    import { goto } from "$app/navigation";

    let email = $state("");
    let password = $state("");
    let rememberMe = $state(false);
    let showPassword = $state(false);
    let isLoading = $state(false);
    async function handleLogin(e) {
        e.preventDefault();
        if(!email || !password){
            alert("Please fill all the fields");
            return;
        }
        if(!email.includes('@') && !email.includes('.')){
            alert("Please enter a valid email");
            return;
        }
        // Handle login logic
        isLoading = true;
        console.log("hgfdzsa");
        
        const response = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.status) {
            location.href = "/";
        } else {
            alert(data.message);
        }
        isLoading = false;
    }
</script>

<div
    class="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
>
    <div class=" w-[400px] mx-auto space-y-8">
        <!-- Header -->
        <div class="text-center space-y-2">
            <h1 class="text-3xl font-light text-gray-900">Welcome back</h1>
            <p class="text-sm text-gray-600">Sign in to your account</p>
        </div>

        <!-- Login Form -->
        <form onsubmit={handleLogin} class="space-y-6">
            <!-- Email/Phone -->
            <div>
                <label
                    for="email"
                    class="block text-sm font-medium text-gray-700 mb-2"
                >
                    Email or Phone
                </label>
                <input
                    id="email"
                    type="text"
                    bind:value={email}
                    disabled={isLoading}
                    placeholder="Enter your email or phone"
                    required
                    class="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all"
                />
            </div>

            <!-- Password -->
            <div>
                <label
                    for="password"
                    class="block text-sm font-medium text-gray-700 mb-2"
                >
                    Password
                </label>
                <div class="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        bind:value={password}
                        disabled={isLoading}
                        placeholder="Enter your password"
                        required
                        class="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all pr-12"
                    />
                    <button
                        type="button"
                        onclick={() => (showPassword = !showPassword)}
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={showPassword
                            ? "Hide password"
                            : "Show password"}
                    >
                        {#if showPassword}
                            <svg
                                class="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                />
                            </svg>
                        {:else}
                            <svg
                                class="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        {/if}
                    </button>
                </div>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        bind:checked={rememberMe}
                        class="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span class="text-sm text-gray-700">Remember me</span>
                </label>
                <a
                    href="/auth/forgot-password"
                    class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                    Forgot password?
                </a>
            </div>

            <!-- Login Button -->
            <button
                type="submit"
                disabled={isLoading}
                class="w-full bg-gray-900 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
                {#if isLoading}
                <svg class="animate-spin mr-2 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                </svg>
                Signing in...
                {:else}
                Sign in
                {/if}
            </button>
        </form>

        <!-- Divider -->
        <div class="relative">
            <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-500">Or continue with</span
                >
            </div>
        </div>

        <!-- Social Login -->
        <div class="grid grid-cols-2 gap-3">
            <button
                type="button"
                class="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                <span class="text-sm text-gray-700">Google</span>
            </button>
            <button
                type="button"
                class="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M22.675 0h-21.35C.596 0 0 .592 0 1.326v21.348C0 23.406.592 24 1.325 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.408 24 22.674V1.326C24 .594 23.408 0 22.675 0"
                    />
                </svg>
                <span class="text-sm text-gray-700">Facebook</span>
            </button>
        </div>

        <!-- Sign Up Link -->
        <div class="text-center">
            <p class="text-sm text-gray-600">
                Don't have an account?
                <a
                    href="/auth/register"
                    class="text-gray-900 font-medium hover:underline"
                >
                    Sign up
                </a>
            </p>
        </div>
    </div>
</div>
