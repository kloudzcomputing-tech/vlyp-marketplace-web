<script>
  let activeTab = 'commission'; // Default tab

  const tabs = [
    { id: 'commission', label: 'Commission & Payment' },
    { id: 'listing', label: 'Listing & Pricing' },
    { id: 'order', label: 'Order Fulfillment' },
    { id: 'return', label: 'Return & Refund' },
    { id: 'onboarding', label: 'Vendor Onboarding' }
  ];
</script>

<div class="min-h-screen bg-gray-50 py-12 px-6 md:px-20">
  <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 md:p-10">

    <!-- Title -->
    <h1 class="text-4xl font-bold text-gray-900 mb-8 text-center">
      Seller Policies
    </h1>

    <!-- Tabs -->
    <div class="flex flex-wrap border-b mb-6">
      {#each tabs as tab}
        <button
          class={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 ${
            activeTab === tab.id
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
          on:click={() => (activeTab = tab.id)}
        >
          {tab.label}
        </button>
      {/each}
    </div>

    <div>
      {#if activeTab === 'commission'}
        <!-- Commission & Payment Policy -->
        <div class="p-6 text-gray-600 space-y-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">Commission & Payment Policy</h2>
          <div class="space-y-4">
            <!-- a. Platform Commission -->
            <div>
              <strong>a. Platform Commission:</strong>
              <ul class="list-disc ml-6">
                <li>Standard platform commission ranges from <strong>10% to 15%</strong> per confirmed order.</li>
                <li>A tier-based structure may be applied based on monthly sales volume, vendor rating, or exclusive partnership agreements.</li>
                <li>Commission includes platform services such as order processing, marketing visibility, and customer support.</li>
                <li>Any promotional or cashback campaigns jointly funded by the platform and seller may impact commission calculations.</li>
                <li>Commission is automatically deducted prior to fund settlement.</li>
              </ul>
            </div>
            <!-- b. Settlement Cycles -->
            <div>
              <strong>b. Settlement Cycles:</strong>
              <ul class="list-disc ml-6">
                <li>Payments are processed on a <strong>T+7 business days</strong> basis from successful delivery confirmation.</li>
                <li>In case of high-volume sellers, custom settlement timelines (e.g., T+3 or T+10) may be mutually agreed upon.</li>
                <li>Weekend and bank holidays are excluded from settlement calculation.</li>
                <li>Payments may be withheld if account verification, KYC, compliance, or tax submissions are pending.</li>
                <li>Quarterly transaction reports are provided for financial reconciliation purposes.</li>
              </ul>
            </div>
            <!-- c. Refunds & Chargebacks -->
            <div>
              <strong>c. Refunds & Chargebacks:</strong>
              <ul class="list-disc ml-6">
                <li>Refund amounts are deducted from the seller’s future settlements.</li>
                <li>Chargebacks due to fraudulent orders or payment disputes are assessed case-by-case in accordance with banking regulations.</li>
                <li>If the chargeback is proven valid, the seller bears the financial responsibility.</li>
                <li>In certain cases, a holding period of <strong>up to 30 days</strong> may apply until dispute is resolved.</li>
                <li>Excessive refund or dispute ratios may lead to increased commission or account re-evaluation.</li>
              </ul>
            </div>
            <!-- d. Payment Gateway & Bank Charges -->
            <div>
              <strong>d. Payment Gateway & Bank Charges:</strong>
              <ul class="list-disc ml-6">
                <li>Standard payment gateway transaction fees range between <strong>2% and 3%</strong>, deducted per transaction.</li>
                <li>Any applicable bank transfer fees will be adjusted during settlement payouts.</li>
                <li>For cross-border payments, additional charges may include currency conversion fees and international transfer taxes.</li>
                <li>The platform does not cover fees related to incorrect bank details or payment failures due to vendor-side issues.</li>
                <li>All charges comply with RBI guidelines and applicable financial regulations.</li>
              </ul>
            </div>
          </div>
        </div>
      {/if}

      {#if activeTab === 'listing'}
        <!-- Listing & Pricing Policy -->
        <div class="p-6 text-gray-600 space-y-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">Listing & Pricing Policy</h2>
          <!-- Original content preserved exactly -->
          <div>
            <strong>a. Product Title, Description, Image & Tag Guidelines:</strong>
            <ul class="list-disc ml-6">
              <li>Product title should be clear, relevant, and avoid use of misleading keywords or excessive capitalization.</li>
              <li>Description must include precise product specifications, usage instructions, and compliance details where necessary.</li>
              <li>Images must be high-resolution, professionally shot, and reflect the actual product without distortion or watermarks.</li>
              <li>Tags should be relevant for optimized search results and must not include prohibited or irrelevant terms.</li>
              <li>All listings must adhere to formatting guidelines (dimensions, naming conventions, image quality).</li>
            </ul>
          </div>
          <div>
            <strong>b. Pricing Rules & Discount Compliance:</strong>
            <ul class="list-disc ml-6">
              <li>Pricing must be competitive and consistent with current market trends.</li>
              <li>Artificial inflation of MRP to display higher discounts is strictly prohibited.</li>
              <li>Discounts must reflect genuine price reductions from actual MRP or current selling price.</li>
              <li>All pricing must comply with local consumer laws, taxation rules, and regulatory pricing policies.</li>
              <li>Unreasonable or frequent price fluctuations may result in listing review or suspension.</li>
            </ul>
          </div>
          <div>
            <strong>c. Duplicate & Misleading Listing Policy:</strong>
            <ul class="list-disc ml-6">
              <li>Multiple listings of the same product under different titles or categories are not allowed.</li>
              <li>Listings must not contain misleading claims, exaggerated benefits, or unverifiable certifications.</li>
              <li>Manipulation of visibility through fake reviews, false attributes, or using competitor brand names is prohibited.</li>
              <li>Unauthorized brand usage or counterfeit product listings will result in immediate action.</li>
              <li>Non-compliance may lead to listing removal, account warnings, temporary suspension, or permanent platform ban.</li>
            </ul>
          </div>
        </div>
      {/if}

      {#if activeTab === 'order'}
        <!-- Order Fulfillment Policy -->
        <div class="p-6 text-gray-600 space-y-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">Order Fulfillment Policy</h2>
          <!-- Original content preserved -->
          <div class="space-y-4">
            <div>
              <strong>a. Shipping Timelines:</strong>
              <ul class="list-disc ml-6">
                <li>Orders must be dispatched within <strong>24–48 hours</strong> of order confirmation unless otherwise specified.</li>
                <li>Express or priority orders must meet the predefined expedited delivery window.</li>
                <li>Tracking information must be updated within <strong>12 hours</strong> post dispatch.</li>
                <li>Delayed order processing may result in reduced seller visibility, SLA breach notifications, or cancellation.</li>
              </ul>
            </div>
            <div>
              <strong>b. Packaging & Labeling Standards:</strong>
              <ul class="list-disc ml-6">
                <li>All products must be packed securely to prevent damage during transit.</li>
                <li>Packages must include correct labeling (order number, customer name, delivery address, return address).</li>
                <li>Use of eco-friendly and platform-branded packaging materials is encouraged where applicable.</li>
                <li>Fragile, liquid, or hazardous items must display appropriate handling and safety notices.</li>
              </ul>
            </div>
            <div>
              <strong>c. Integration with Approved Logistics Partners:</strong>
              <ul class="list-disc ml-6">
                <li>Sellers must use platform-approved logistics providers unless self-ship is authorized.</li>
                <li>Real-time tracking integration is mandatory for transparency and customer experience.</li>
                <li>For self-shipped orders, sellers must adhere to delivery SLAs and provide valid proof of shipment.</li>
                <li>Pickup and handover coordination with logistic partners must be ensured by the seller.</li>
              </ul>
            </div>
            <div>
              <strong>d. Penalties for Delays or Non-Shipment:</strong>
              <ul class="list-disc ml-6">
                <li>Failure to dispatch within defined timelines may lead to order cancellation or penalties.</li>
                <li>Repeated SLA breaches may trigger reduction in listing visibility or temporary selling restrictions.</li>
                <li>Non-shipment without valid justification may result in compensation deductions or seller account review.</li>
                <li>Severe violations may lead to temporary account suspension or permanent seller deactivation.</li>
              </ul>
            </div>
          </div>
        </div>
      {/if}

      {#if activeTab === 'return'}
        <!-- Return & Refund Policy -->
        <div class="p-6 text-gray-600 space-y-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">Return & Refund Policy</h2>
          <ul class="space-y-4 leading-relaxed">
            <!-- a -->
            <li>
              <span class="font-semibold text-gray-800">a. Responsibility for Product Quality & Authenticity</span>
              <ul class="list-disc ml-6 mt-2 space-y-1">
                <li>Sellers must ensure all products are original, defect-free, and match listed specifications.</li>
                <li>Any disputes regarding product quality must be addressed within 48 hours.</li>
                <li>Products found to be counterfeit or damaged may lead to suspension and penalties.</li>
              </ul>
            </li>
            <!-- b -->
            <li>
              <span class="font-semibold text-gray-800">b. Seller Obligations for Return Pickup & Replacement</span>
              <ul class="list-disc ml-6 mt-2 space-y-1">
                <li>Sellers must arrange pickup within 72 hours of return request approval.</li>
                <li>Replacement products should be dispatched within 48 hours after pickup.</li>
                <li>Failure may incur deductions from payouts.</li>
              </ul>
            </li>
            <!-- c -->
            <li>
              <span class="font-semibold text-gray-800">c. Refund Timelines</span>
              <ul class="list-disc ml-6 mt-2 space-y-1">
                <li>Refunds must be initiated within <span class="font-medium">5 business days</span> of return approval.</li>
                <li>If replacement not possible, refund after pickup confirmation.</li>
                <li>Delays beyond 7 business days may lead to platform intervention.</li>
              </ul>
            </li>
            <!-- d -->
            <li>
              <span class="font-semibold text-gray-800">d. Categories Exempt from Return</span>
              <ul class="list-disc ml-6 mt-2 space-y-1">
                <li>Perishable goods (food, plants, flowers).</li>
                <li>Intimate or personal hygiene items.</li>
                <li>Digital downloads once accessed.</li>
                <li>Customized or made-to-order items unless damaged.</li>
              </ul>
            </li>
          </ul>
        </div>
      {/if}

      {#if activeTab === 'onboarding'}
        <!-- Vendor Onboarding Policy -->
        <div class="p-6">
          <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">Vendor Onboarding Policy</h2>

          <p class="text-gray-700 text-lg text-justify mb-8">
            This Onboarding Policy outlines the mandatory requirements for businesses registering on our platform...
          </p>

          <h3 class="text-2xl font-semibold text-gray-900 mt-10 mb-4">1. Business Registration Requirements</h3>
          <ul class="list-disc pl-6 text-gray-700 space-y-2 text-justify">
            <li>Businesses must be legally registered...</li>
            <li>Valid documents required...</li>
            <li>Ensure documents are accurate and up-to-date.</li>
            <li>Registration details must match bank and tax records.</li>
          </ul>

          <h3 class="text-2xl font-semibold text-gray-900 mt-10 mb-4">2. Tax (GST/VAT) Compliance</h3>
          <ul class="list-disc pl-6 text-gray-700 space-y-2 text-justify">
            <li>Merchants must provide a valid GST/VAT registration number...</li>
            <li>Tax details must match legal business name...</li>
            <li>Invoices must follow statutory tax guidelines.</li>
            <li>Non-registered businesses may operate...</li>
          </ul>

          <h3 class="text-2xl font-semibold text-gray-900 mt-10 mb-4">
            3. KYC (Know Your Customer) Verification
          </h3>

          <p class="text-gray-700 text-justify mb-4">
            KYC verification is mandatory for identity authentication and prevention of fraudulent activities.
          </p>

          <ul class="list-disc pl-6 text-gray-700 space-y-2 text-justify">
            <li>Government-issued ID proof...</li>
            <li>Registered business address proof...</li>
            <li>Authorized signatory details...</li>
            <li>Bank account verification...</li>
          </ul>

          <h3 class="text-2xl font-semibold text-gray-900 mt-10 mb-4">4. Compliance & Enforcement</h3>
          <ul class="list-disc pl-6 text-gray-700 space-y-2 text-justify">
            <li>Accounts may be suspended...</li>
            <li>Platform reserves the right to re-verify...</li>
            <li>Payouts may be withheld...</li>
          </ul>

          <p class="text-gray-600 mt-10 text-sm italic text-center">
            By registering on the platform, businesses agree to adhere to the above compliance standards.
          </p>
        </div>
      {/if}
    </div>
  </div>
</div>
