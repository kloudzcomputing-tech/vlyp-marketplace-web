<script>
  let activeTab = "data-privacy";

  const tabs = [
    { id: "data-privacy", label: "Data Privacy & Security Policy" },
    { id: "ip-policy", label: "Intellectual Property (IP) Policy" },
    { id: "dispute-policy", label: "Dispute Resolution Policy" },
    { id: "prohibited-use", label: "Prohibited Use Policy" },
    { id: "advertising-policy", label: "Advertising & Promotion Policy" }
  ];
</script>

<div class="p-6">
  <h1 class="text-4xl font-bold text-gray-900 mb-6">Platform(Admin) Policies</h1>

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
  <div class="bg-white shadow-md rounded-lg p-6 text-gray-700 space-y-4">
    <!-- Data Privacy & Security Policy -->
    {#if activeTab === "data-privacy"}
      <h2 class="text-2xl font-semibold mb-4">Data Privacy & Security Policy</h2>
      <section>
        <strong>a. Handling of Personal & Payment Data</strong>
        <ul class="list-disc ml-6 space-y-1">
          <li>Only required personal data is collected (name, email, phone, etc.).</li>
          <li>Data processed lawfully and transparently (GDPR, IT Act compliance).</li>
          <li>Payment data tokenized; no raw card data stored.</li>
          <li>Data sharing only with trusted, contract-bound service providers.</li>
        </ul>
      </section>

      <section>
        <strong>b. Encryption, Secure Payments & Data Retention</strong>
        <ul class="list-disc ml-6 space-y-1">
          <li>HTTPS/TLS encryption for all data transmissions.</li>
          <li>Encryption at rest for sensitive information.</li>
          <li>Strict admin access control and activity logging.</li>
          <li>Data retained only as required (legal or operational purposes).</li>
        </ul>
      </section>

      <section>
        <strong>c. User Rights & Control</strong>
        <ul class="list-disc ml-6 space-y-1">
          <li>Right to data access, correction, erasure, and portability.</li>
          <li>Users may request processing restriction or objection.</li>
          <li>Easy access to submit privacy-related requests.</li>
        </ul>
      </section>

    <!-- Intellectual Property Policy -->
    {:else if activeTab === "ip-policy"}
      <h2 class="text-2xl font-semibold mb-4">Intellectual Property (IP) Policy</h2>
      <section>
        <strong>a. Copyright & Trademark Protection</strong>
        <ul class="list-disc ml-6 space-y-1">
          <li>Platform content is protected under applicable IP laws.</li>
          <li>Only authorized content usage is allowed.</li>
          <li>Unauthorized replication or distribution is prohibited.</li>
          <li>Technical and legal safeguards used to prevent misuse.</li>
        </ul>
      </section>

      <section>
        <strong>b. Takedown Requests & Complaints</strong>
        <ul class="list-disc ml-6 space-y-1">
          <li>Submit written complaint with proof of ownership.</li>
          <li>Disputed content may be restricted during review.</li>
          <li>Counter-notice possible if content owner disputes.</li>
          <li>Repeated violations may lead to suspension.</li>
        </ul>
      </section>

    <!-- Dispute Resolution Policy -->
    {:else if activeTab === "dispute-policy"}
      <h2 class="text-2xl font-semibold mb-4">Dispute Resolution Policy</h2>
      <section>
        <strong>a. Escalation Matrix</strong>
        <ul class="list-disc ml-6 space-y-1">
          <li>Step 1 – Buyer & Seller Resolution.</li>
          <li>Step 2 – Admin support escalation (if unresolved).</li>
          <li>Step 3 – Admin mediation based on documentation.</li>
          <li>Step 4 – Final platform decision.</li>
        </ul>
      </section>

      <section>
        <strong>b. Time-Bound Resolution</strong>
        <ul class="list-disc ml-6 space-y-1">
          <li>Issue raised within 48–72 hours.</li>
          <li>Seller response within 24–48 hours.</li>
          <li>Admin review within 48–72 hours.</li>
          <li>Complex issues: 7–10 business days.</li>
        </ul>
      </section>

      <section>
        <strong>c. Arbitration/Mediation Clause</strong>
        <ul class="list-disc ml-6 space-y-1">
          <li>Unresolved disputes may go to third-party arbitration.</li>
          <li>Ruling is binding unless legally restricted.</li>
          <li>Legal jurisdiction based on platform terms.</li>
        </ul>
      </section>

    <!-- Prohibited Use Policy -->
    {:else if activeTab === "prohibited-use"}
      <h2 class="text-2xl font-semibold mb-4">Prohibited Use Policy</h2>
      <section>
        <strong>a. Fraud, Phishing & Data Scraping</strong>
        <ul class="list-disc ml-6 space-y-1">
          <li>No fake transactions or identity theft.</li>
          <li>Phishing or data harvesting is strictly banned.</li>
          <li>No impersonation or submission of false documents.</li>
        </ul>
      </section>

      <section>
        <strong>b. Spam, Malware & Unauthorized Marketing</strong>
        <ul class="list-disc ml-6 space-y-1">
          <li>No unsolicited mass messaging.</li>
          <li>No malware or harmful scripts allowed.</li>
          <li>No external promotion or illegal services.</li>
        </ul>
      </section>

    <!-- Advertising & Promotion Policy -->
    {:else if activeTab === "advertising-policy"}
      <h2 class="text-2xl font-semibold mb-4">Advertising & Promotion Policy</h2>
      <section>
        <strong>a. Featured Listings & Flash Sales</strong>
        <ul class="list-disc ml-6 space-y-1">
          <li>Only verified sellers may run promotions.</li>
          <li>Offers must be genuine and legally compliant.</li>
          <li>No aggressive or misleading tactics.</li>
        </ul>
      </section>

      <section>
        <strong>b. Approval & Payment Structure</strong>
        <ul class="list-disc ml-6 space-y-1">
          <li>All ad content must be approved (24–48 hours typical).</li>
          <li>Payment models: CPC, CPM, or fixed.</li>
          <li>Non-compliant ads may be removed without refund.</li>
          <li>Reporting includes impressions and conversions.</li>
        </ul>
      </section>
    {/if}
  </div>
</div>

<style>
  button {
    outline: none;
  }
</style>
