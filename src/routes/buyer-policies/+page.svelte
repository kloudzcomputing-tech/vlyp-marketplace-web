<script>
  let activeTab = "registration";

  const tabs = [
    { id: "registration", label: "User Registration & Account Policy" },
    { id: "order", label: "Order, Cancellation & Refund Policy" },
    { id: "return", label: "Return & Replacement Policy" },
    { id: "review", label: "Review & Feedback Policy" }
  ];
</script>

<div class="p-6">
  <h1 class="text-4xl font-bold text-gray-900 mb-6">Buyer Policies</h1>

  <!-- Tabs -->
  <div class="flex space-x-4 border-b mb-6">
    {#each tabs as tab}
      <button
        class="py-2 px-4 border-b-2 font-medium transition-all duration-200
        {activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}"
        on:click={() => activeTab = tab.id}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  <!-- Content -->
  <div class="bg-white shadow-md rounded-lg p-6 text-gray-700">
    {#if activeTab === "registration"}
      <h2 class="text-2xl font-semibold mb-4">User Registration & Account Policy</h2>
      <div class="space-y-4">
        <div>
          <strong>a. Real Name, Email & Phone Verification:</strong>
          <ul class="list-disc ml-6">
            <li>Users must register using their <strong>authentic full name</strong> as per legal ID.</li>
            <li>A valid <strong>email</strong> is required for activation and notifications.</li>
            <li><strong>Phone verification via OTP</strong> is mandatory to ensure authenticity.</li>
            <li>Unverified accounts may face restricted access.</li>
            <li>Additional documents may be requested during disputes or security checks.</li>
          </ul>
        </div>

        <div>
          <strong>b. One-Account-Per-User Rule:</strong>
          <ul class="list-disc ml-6">
            <li>Only <strong>one active account</strong> per user is allowed.</li>
            <li>Multiple accounts for unfair advantage are strictly prohibited.</li>
            <li>Additional accounts allowed only under approved circumstances.</li>
            <li>Duplicate accounts may face consolidation, suspension, or termination.</li>
            <li>Report mistaken accounts immediately to support.</li>
          </ul>
        </div>

        <div>
          <strong>c. Account Suspension for Misuse or Fraud:</strong>
          <ul class="list-disc ml-6">
            <li>Fraudulent or impersonation attempts may lead to <strong>immediate suspension</strong>.</li>
            <li>Includes harmful interactions, misleading info, unauthorized access.</li>
            <li>Severe cases may result in <strong>permanent termination</strong>.</li>
            <li>Users get notified with appeal instructions if applicable.</li>
            <li>Access may be restored post verification and corrective actions.</li>
          </ul>
        </div>
      </div>

    {:else if activeTab === "order"}
      <h2 class="text-2xl font-semibold mb-4">Order, Cancellation & Refund Policy</h2>
      <div class="space-y-4">
        <div>
          <strong>a. Allowed Time Frame for Cancellations:</strong>
          <ul class="list-disc ml-6">
            <li>Orders can be canceled <strong>before shipment</strong>.</li>
            <li>Post-shipment cancellations may require return processing.</li>
            <li>Confirmation will be sent upon successful cancellation.</li>
            <li>Pre-order/custom items may follow vendor-specific terms.</li>
            <li>Repeated cancellations may lead to account review.</li>
          </ul>
        </div>

        <div>
          <strong>b. Refund Initiation Rules:</strong>
          <ul class="list-disc ml-6">
            <li>Refunds issued within <strong>3–7 working days</strong> post cancellation.</li>
            <li>Credited to the <strong>original payment method</strong>.</li>
            <li>Delay notifications provided if applicable.</li>
            <li>Refund after quality inspection (if returned).</li>
            <li>Non-refundable items clearly indicated during checkout.</li>
          </ul>
        </div>

        <div>
          <strong>c. Special Cases:</strong>
          <ul class="list-disc ml-6">
            <li><strong>Partial refunds</strong> for damaged/missing products.</li>
            <li><strong>COD refunds</strong> via bank transfer or wallet.</li>
            <li>If <strong>out of stock</strong>, customer may choose refund or replacement.</li>
            <li>Refunds based on net paid amount.</li>
            <li>Refund misuse may lead to account restrictions.</li>
          </ul>
        </div>
      </div>

    {:else if activeTab === "return"}
      <h2 class="text-2xl font-semibold mb-4">Return & Replacement Policy</h2>
      <div class="space-y-4">
        <div>
          <strong>a. Product Eligibility:</strong>
          <ul class="list-disc ml-6">
            <li>Product must be in <strong>unused, undamaged condition</strong>.</li>
            <li>Original packaging, tags, invoice required.</li>
            <li>Damaged or tampered items may be rejected.</li>
            <li>Certain categories are <strong>non-returnable</strong> unless defective.</li>
            <li>Brand/manufacturer policies may apply.</li>
          </ul>
        </div>

        <div>
          <strong>b. Time Window:</strong>
          <ul class="list-disc ml-6">
            <li>Request within <strong>7–10 days of delivery</strong>.</li>
            <li>Late requests may be invalid unless under warranty.</li>
            <li>Report defective items immediately.</li>
            <li>Time extensions allowed in exceptional cases.</li>
          </ul>
        </div>

        <div>
          <strong>c. Steps for Return:</strong>
          <ul class="list-disc ml-6">
            <li>Request via <strong>My Orders</strong> or customer support.</li>
            <li><strong>Pickup scheduled</strong> upon approval.</li>
            <li>Item undergoes <strong>quality inspection</strong>.</li>
            <li>Refund/replacement within <strong>3–7 working days</strong> if approved.</li>
            <li>Failed inspections may result in return without refund.</li>
          </ul>
        </div>
      </div>

    {:else if activeTab === "review"}
      <h2 class="text-2xl font-semibold mb-4">Review & Feedback Policy</h2>
      <div class="space-y-4">
        <div>
          <strong>a. Guidelines for Writing Reviews:</strong>
          <ul class="list-disc ml-6">
            <li>Must be respectful and based on genuine experience.</li>
            <li><strong>No hate speech, defamation, abusive content.</strong></li>
            <li>No misleading or incentivized reviews.</li>
            <li>Focus on product/service, not personal bias.</li>
            <li>No personal data or advertisement links.</li>
          </ul>
        </div>

        <div>
          <strong>b. Flagging & Moderation:</strong>
          <ul class="list-disc ml-6">
            <li>Users can flag inappropriate reviews.</li>
            <li>Reviewed manually based on guidelines.</li>
            <li>Violating reviews may be edited or removed.</li>
            <li>Repeated violators may face restrictions.</li>
            <li>Moderation ensures safety & authenticity.</li>
          </ul>
        </div>

        <div>
          <strong>c. Verified Purchase:</strong>
          <ul class="list-disc ml-6">
            <li>Display <strong>"Verified Purchase"</strong> for actual order-based reviews.</li>
            <li>Boosts authenticity and trust.</li>
            <li>Only considered after order is completed.</li>
            <li>Non-purchase reviews allowed without badge.</li>
            <li>Periodic audits for review quality.</li>
          </ul>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .buyer-policies button {
    outline: none;
  }
</style>
