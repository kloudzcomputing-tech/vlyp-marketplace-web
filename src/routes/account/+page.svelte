<script>
    let { data } = $props();
    // svelte-ignore state_referenced_locally
        let user = data?.customer;
    let first_name = $state(user?.first_name);
    let last_name = $state(user?.last_name);
    let email = $state(user?.email);
    let phone = $state(user?.phone);
    let country_code = $state(user?.country_code || "+91");
    let gender = $state(user?.gender);
    let date_of_birth = $state(user?.dob);
    let profile_picture = $state(user?.profile_image);
    let profile_editable = $state(false);
    let email_editable = $state(false);
    let phone_editable = $state(false);

    const handleProfilePictureChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Image size must be under 2MB");
            return;
        }

        // Preview instantly
        profile_picture = URL.createObjectURL(file);

        // Prepare form data
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/profile/image", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok || !data?.status) {
                throw new Error(data?.message || "Upload failed");
            }

            // Optional: replace preview with final URL from backend
            if (data?.image_url) {
                profile_picture = data.image_url;
            }
        } catch (err) {
            console.log(err);
            
            console.error(err);
            alert("Failed to upload profile picture");
        }
    };

    const handleSave = async (fields, values) => {
    try {
        // build payload dynamically
        const payload = {};
        fields.forEach((field, index) => {
            payload[field] = values[index];
        });

        const res = await fetch("/api/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error("Failed to update profile");
        }

        const data = await res.json();

        // optional: sync updated user data locally
        user = { ...user, ...payload };

        alert("Profile updated successfully");
    } catch (error) {
        console.error("Profile update error:", error);
    }
};

</script>

<div class="p-4 sm:p-6">
    <!-- Header -->
    <div class="w-full max-w-3xl space-y-4 sm:space-y-6">
        <div>
            <h1 class="text-xl sm:text-2xl font-light text-gray-900">Profile</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Manage your account information</p>
        </div>
    
        <!-- Profile Picture -->
        <div class="border border-gray-200 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
            <h2 class="text-sm font-medium text-gray-900">Profile Picture</h2>
            <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <label class="cursor-pointer self-start sm:self-auto">
                    <input
                        hidden
                        type="file"
                        accept="image/*"
                        onchange={handleProfilePictureChange}
                    />
                    <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200 hover:border-gray-300 transition-colors">
                        {#if profile_picture}
                            <img
                                src={profile_picture}
                                alt="Profile"
                                class="w-full h-full object-cover"
                            />
                        {:else}
                            <svg
                                class="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        {/if}
                    </div>
                </label>
                <div>
                    <p class="text-xs sm:text-sm text-gray-600 mb-1">Upload a new profile picture</p>
                    <p class="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB</p>
                </div>
            </div>
        </div>
    
        <!-- Personal Information -->
        <div class="border border-gray-200 rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 class="text-sm font-medium text-gray-900">Personal Information</h2>
                {#if !profile_editable}
                    <button
                        onclick={() => (profile_editable = true)}
                        class="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors self-start sm:self-auto"
                    >
                        Edit
                    </button>
                {:else}
                    <div class="flex flex-col-reverse sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <button
                            onclick={() => {
                                first_name = user?.first_name;
                                last_name = user?.last_name;
                                gender = user?.gender;
                                date_of_birth = user?.date_of_birth;
                                profile_editable = false;
                            }}
                            class="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onclick={() => {
                                handleSave(['first_name','last_name', 'gender', 'date_of_birth'], [first_name,last_name, gender, date_of_birth]);
                                profile_editable = false;
                            }}
                            class="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                {/if}
            </div>
    
            <div class="space-y-3 sm:space-y-4">
                <!-- Full Name -->
                <div>
                    <label for="full-name" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        First Name
                    </label>
                    <input
                        id="first-name"
                        type="text"
                        bind:value={first_name}
                        disabled={!profile_editable}
                        class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                    />
                    <label for="full-name" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        last Name
                    </label>
                    <input
                        id="last-name"
                        type="text"
                        bind:value={last_name}
                        disabled={!profile_editable}
                        class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                    />
                </div>
    
                <!-- Gender -->
                <div>
                    <p class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Gender
                    </p>
                    <div class="flex flex-wrap items-center gap-4 sm:gap-6">
                        <label class="flex items-center gap-2 cursor-pointer {!profile_editable ? 'cursor-not-allowed' : ''}">
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                bind:group={gender}
                                disabled={!profile_editable}
                                class="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900 disabled:cursor-not-allowed"
                            />
                            <span class="text-xs sm:text-sm text-gray-700">Male</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer {!profile_editable ? 'cursor-not-allowed' : ''}">
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                bind:group={gender}
                                disabled={!profile_editable}
                                class="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900 disabled:cursor-not-allowed"
                            />
                            <span class="text-xs sm:text-sm text-gray-700">Female</span>
                        </label>
                    </div>
                </div>
    
                <!-- Date of Birth -->
                <div>
                    <label for="date-of-birth" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Date of Birth
                    </label>
                    <input
                        id="date-of-birth"
                        type="date"
                        bind:value={date_of_birth}
                        disabled={!profile_editable}
                        class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                    />
                </div>
            </div>
        </div>
    
        <!-- Email -->
        <div class="border border-gray-200 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 class="text-sm font-medium text-gray-900">Email</h2>
                {#if !email_editable}
                    <!-- <button
                        onclick={() => (email_editable = true)}
                        class="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors self-start sm:self-auto"
                    >
                        Edit
                    </button> -->
                {:else}
                    <div class="flex flex-col-reverse sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <button
                            onclick={() => {
                                email = user?.email;
                                email_editable = false;
                            }}
                            class="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onclick={() => {
                                handleSave(['email'], [email]);
                                email_editable = false;
                            }}
                            class="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                {/if}
            </div>
            <div>
                <label for="email" class="sr-only">Email</label>
                <input
                    id="email"
                    type="email"
                    bind:value={email}
                    disabled={!email_editable}
                    class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                />
            </div>
        </div>
    
        <!-- Phone -->
        <div class="border border-gray-200 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 class="text-sm font-medium text-gray-900">Phone</h2>
                {#if !phone_editable}
                    <!-- <button
                        onclick={() => (phone_editable = true)}
                        class="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors self-start sm:self-auto"
                    >
                        Edit
                    </button> -->
                {:else}
                    <div class="flex flex-col-reverse sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <button
                            onclick={() => {
                                country_code = user?.country_code;
                                phone = user?.phone;
                                phone_editable = false;
                            }}
                            class="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onclick={() => {
                                handleSave(['country_code', 'phone'], [country_code, phone]);
                                phone_editable = false;
                            }}
                            class="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                {/if}
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                <input
                    type="text"
                    bind:value={country_code}
                    disabled={!phone_editable}
                    placeholder="+91"
                    class="w-full sm:w-20 px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                />
                <input
                    type="tel"
                    bind:value={phone}
                    disabled={!phone_editable}
                    placeholder="Phone number"
                    class="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                />
            </div>
        </div>
    </div>
</div>
