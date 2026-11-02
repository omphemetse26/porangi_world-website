document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('siteSearch');
  const searchableItems = document.querySelectorAll('.searchable');
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const term = this.value.trim().toLowerCase();

      searchableItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        const matches = !term || text.includes(term);
        item.style.display = matches ? '' : 'none';
      });
    });
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const triggerButtons = document.querySelectorAll('.lightbox-trigger');

  if (lightbox && lightboxImage && lightboxCaption) {
    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
    };

    triggerButtons.forEach((button) => {
      button.addEventListener('click', function () {
        const source = this.dataset.lightbox;
        const title = this.dataset.title || 'Porangi World gallery image';
        lightboxImage.src = source;
        lightboxCaption.textContent = title;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
      });
    });

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox || event.target.closest('.lightbox-close')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }

  const enquiryForm = document.getElementById('enquiryForm');
  const subtotalValue = document.getElementById('subtotalValue');
  const deliveryValue = document.getElementById('deliveryValue');
  const totalValue = document.getElementById('totalValue');
  const estimateResponse = document.getElementById('estimateResponse');

  const formatCurrency = (amount) => `R${Number(amount).toFixed(2)}`;

  const calculateEstimate = () => {
    const priceInputs = document.querySelectorAll('[data-price]');
    let subtotal = 0;
    let selectedItems = [];

    priceInputs.forEach((input) => {
      const qty = Number(input.value) || 0;
      const price = Number(input.dataset.price) || 0;
      const itemName = input.dataset.name || 'Item';

      if (qty > 0) {
        subtotal += qty * price;
        selectedItems.push({ name: itemName, qty, total: qty * price });
      }
    });

    const deliveryFee = subtotal > 0 ? 40 : 0;
    const total = subtotal + deliveryFee;

    if (subtotalValue) subtotalValue.textContent = formatCurrency(subtotal);
    if (deliveryValue) deliveryValue.textContent = formatCurrency(deliveryFee);
    if (totalValue) totalValue.textContent = formatCurrency(total);

    return { subtotal, deliveryFee, total, selectedItems };
  };

  if (enquiryForm) {
    enquiryForm.addEventListener('input', calculateEstimate);

    enquiryForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const nameInput = document.getElementById('customerName');
      const emailInput = document.getElementById('customerEmail');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';

      if (!name || !email) {
        estimateResponse.innerHTML = '<p>Please provide both your name and email before calculating your estimate.</p>';
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        estimateResponse.innerHTML = '<p>Please enter a valid email format such as name@example.com.</p>';
        return;
      }

      const estimate = calculateEstimate();

      if (estimate.selectedItems.length === 0) {
        estimateResponse.innerHTML = '<p>Please choose at least one menu item to build an estimate.</p>';
        return;
      }

      const itemList = estimate.selectedItems
        .map((item) => `• ${item.name}: ${item.qty} x R${Number(item.qty * (Number(item.name === 'Hot Mess Express' ? 120 : item.name === 'Astrofries' ? 100 : item.name === 'Breakfast Vibes' ? 80 : 100))).toFixed(2)}`)
        .join('<br>');

      estimateResponse.innerHTML = `
        <pre>Dear ${name},
Thank you for your enquiry. Here is your estimated order summary:

${estimate.selectedItems.map((item) => `- ${item.name}: ${item.qty} item(s) = ${formatCurrency(item.total)}`).join('\n')}
Delivery: ${formatCurrency(estimate.deliveryFee)}
Total estimate: ${formatCurrency(estimate.total)}

We will send the final booking confirmation to ${email}.</pre>
      `;
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const message = document.getElementById('contactMessage');
      const result = document.getElementById('contactResponse');

      const cleanName = name.value.trim();
      const cleanEmail = email.value.trim();
      const cleanMessage = message.value.trim();

      if (!cleanName || !cleanEmail || !cleanMessage) {
        result.innerHTML = '<p>Please complete all fields before sending your message.</p>';
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(cleanEmail)) {
        result.innerHTML = '<p>Please enter a valid email address.</p>';
        return;
      }

      const emailBody = [
        'New contact form submission',
        '',
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        '',
        'Message:',
        cleanMessage
      ].join('\n');

      result.innerHTML = `
        <p><strong>Message ready to send</strong></p>
        <pre>${emailBody}</pre>
      `;

      contactForm.reset();
    });
  }

  calculateEstimate();
});
