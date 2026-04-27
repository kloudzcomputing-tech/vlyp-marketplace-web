<script>
  import { onMount } from "svelte";

  let slider;
  let images;
  let currentIndex = 0;

  function changeImage() {
    images[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.add("active");
  }

  onMount(() => {
    images = slider.getElementsByTagName("img");
    const interval = setInterval(changeImage, 2900);

    return () => clearInterval(interval);
  });
</script>

<main>
  <div class="container">
    <div class="vertical-brand">Vlyp.</div>

    <div class="text-panel">
      <div class="logo-section">
        <h1>Vlyp<span class="dot">.</span></h1>
        <p>Fashion and Lifestyle Platform Exclusively For Men & Women</p>
      </div>

      <div class="headline-section">
        <h2>Coming Soon</h2>
        <p>We're working on our new website, Stay tuned!</p>
      </div>

      <div class="form-section-wrapper">
        <div class="form-section">
          <input type="email" placeholder="jane.doe@email.com" required />
          <button type="submit">Notify Me</button>
        </div>
        <p class="footer-text">
          Be the first to know about the latest updates and get exclusive offers
          on our grand opening.
        </p>
      </div>
    </div>

    <div class="image-panel" bind:this={slider}>
      <img
        src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        class="active"
        alt="Style 1"
      />
      <img src="https://plus.unsplash.com/premium_photo-1675186049419-d48f4b28fe7c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Style 2" />
      <img src="https://images.unsplash.com/photo-1601762603339-fd61e28b698a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Style 3" />
    </div>

    <div class="creator-credit">Designed by Vlyp</div>
  </div>
</main>

<style>
  /* --- Core Page Layout --- */
  :root {
    --bg-page: #e9eef2;
    --bg-panel: #ffffff;
    --text-dark: #000000;
    --text-muted: #8c8c8c;
    --accent: #2c974b;
  }

  :global(body),
  :global(html) {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;
    background-color: var(--bg-page);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .container {
    display: flex;
    width: 90vw;
    max-width: 1100px;
    height: 70vh;
    max-height: 700px;
    background-color: var(--bg-panel);
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }

  .text-panel {
    flex: 1;
    padding: 8% 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  .logo-section h1 {
    font-size: 24px;
    margin: 0 0 8px 0;
    color: var(--text-dark);
  }

  .dot {
    color: var(--accent);
  }

  .logo-section p {
    font-size: 13px;
    color: var(--text-muted);
    margin: 0;
    letter-spacing: 0.5px;
  }

  .headline-section h2 {
    font-size: 42px;
    font-weight: 700;
    margin: 0 0 15px 0;
    color: var(--text-dark);
    letter-spacing: -0.5px;
  }

  .headline-section p {
    font-size: 14px;
    color: var(--text-muted);
    margin: 0;
    line-height: 1.6;
  }

  .form-section {
    display: flex;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 20px;
  }

  .form-section input {
    flex: 1;
    padding: 12px 20px;
    border: 1px solid #e0e0e0;
    border-right: none;
    border-radius: 25px 0 0 25px;
    font-size: 13px;
    background-color: #fafafa;
    color: var(--text-dark);
  }

  .form-section input:focus {
    outline: none;
    border-color: #cccccc;
  }

  .form-section button {
    background-color: var(--text-dark);
    color: #ffffff;
    border: none;
    padding: 12px 25px;
    border-radius: 0 25px 25px 0;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .form-section button:hover {
    background-color: #333333;
  }

  .footer-text {
    font-size: 11px;
    color: var(--text-muted);
    margin: 0;
    line-height: 1.6;
  }

  .vertical-brand {
    position: absolute;
    left: -40px;
    top: 50%;
    transform: translateY(-50%) rotate(-90deg);
    color: rgba(0, 0, 0, 0.1);
    font-size: 13px;
    white-space: nowrap;
  }

  .image-panel {
    width: 45%;
    position: relative;
  }

  .image-panel img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 1.5s ease-in-out;
    z-index: 1;
  }

  .image-panel img.active {
    opacity: 1;
    z-index: 2;
  }



  .creator-credit {
    position: absolute;
    right: -130px;
    top: 50%;
    transform: translateY(-50%) rotate(-90deg);
    color: var(--text-muted);
    font-size: 11px;
    white-space: nowrap;
    letter-spacing: 0.5px;
  }
  main {
    margin: 0;
    padding: 0;
    background-color: #e9eef2;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
  }
</style>
