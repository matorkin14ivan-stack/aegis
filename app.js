(() => {
  'use strict';

  const form = document.getElementById('demo-form');
  if (!form) return;

  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('form-status');
  const defaultButtonText = button.textContent;
  let submitting = false;

  function showStatus(message, state) {
    status.textContent = message;
    status.className = `form-status form-status--${state}`;
    status.hidden = false;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting) return;

    form.elements.namedItem('name').value = form.elements.namedItem('name').value.trim();
    form.elements.namedItem('phone').value = form.elements.namedItem('phone').value.trim();
    if (!form.reportValidity()) return;

    submitting = true;
    button.disabled = true;
    button.textContent = 'Sending...';
    form.setAttribute('aria-busy', 'true');
    status.hidden = true;
    status.textContent = '';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      const payload = Object.fromEntries(new FormData(form));
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      const result = await response.json();
      if (!response.ok || result?.success !== true) {
        throw new Error('Submission failed');
      }

      form.reset();
      showStatus('Thank you! Your message has been sent successfully.', 'success');
    } catch (error) {
      const message = error.name === 'AbortError'
        ? 'Your request timed out. Please try again.'
        : 'Sorry, your message could not be sent. Please try again.';
      showStatus(message, 'error');
    } finally {
      clearTimeout(timeout);
      submitting = false;
      button.disabled = false;
      button.textContent = defaultButtonText;
      form.removeAttribute('aria-busy');
    }
  });
})();
