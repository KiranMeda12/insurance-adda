/**
 * INSURANCE ADDA - Enquiry Form Logic & Validation
 * Handles validation, submission states, reference ID generation, and WhatsApp fallback
 */

document.addEventListener('DOMContentLoaded', () => {
  initEnquiryForms();
});

function initEnquiryForms() {
  const forms = document.querySelectorAll('.insurance-enquiry-form');

  forms.forEach(form => {
    // Radio pills active styling sync
    const radioInputs = form.querySelectorAll('input[type="radio"][name="contactMethod"]');
    radioInputs.forEach(radio => {
      radio.addEventListener('change', () => {
        form.querySelectorAll('.radio-pill-label').forEach(lbl => lbl.classList.remove('checked'));
        if (radio.checked) {
          radio.closest('.radio-pill-label')?.classList.add('checked');
        }
      });
    });

    // Form Submission Event - directly routes through WhatsApp
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      sendFormToWhatsApp(form);
    });

    // Direct WhatsApp Button click within form
    const directWaBtn = form.querySelector('.btn-submit-via-whatsapp');
    if (directWaBtn) {
      directWaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sendFormToWhatsApp(form);
      });
    }
  });
}

/**
 * Validate form fields
 */
function validateForm(form) {
  let isValid = true;

  // Name validation
  const nameInput = form.querySelector('[name="fullName"]');
  const nameError = form.querySelector('#name-error') || nameInput?.parentElement.querySelector('.form-error-msg');
  if (nameInput) {
    const val = nameInput.value.trim();
    if (!val || val.length < 2) {
      showError(nameInput, nameError, 'Please enter your full name (at least 2 characters).');
      isValid = false;
    } else {
      clearError(nameInput, nameError);
    }
  }

  // Mobile number validation (10-digit Indian mobile)
  const phoneInput = form.querySelector('[name="mobileNumber"]');
  const phoneError = form.querySelector('#phone-error') || phoneInput?.parentElement.querySelector('.form-error-msg');
  if (phoneInput) {
    const cleanPhone = phoneInput.value.trim().replace(/\s+/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!cleanPhone) {
      showError(phoneInput, phoneError, 'Mobile number is required.');
      isValid = false;
    } else if (!phoneRegex.test(cleanPhone)) {
      showError(phoneInput, phoneError, 'Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).');
      isValid = false;
    } else {
      clearError(phoneInput, phoneError);
    }
  }

  // Insurance Service selection
  const serviceSelect = form.querySelector('[name="insuranceService"]');
  const serviceError = form.querySelector('#service-error') || serviceSelect?.parentElement.querySelector('.form-error-msg');
  if (serviceSelect) {
    if (!serviceSelect.value) {
      showError(serviceSelect, serviceError, 'Please select the insurance service you require.');
      isValid = false;
    } else {
      clearError(serviceSelect, serviceError);
    }
  }

  return isValid;
}

function showError(inputEl, errorEl, message) {
  inputEl.classList.add('error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

function clearError(inputEl, errorEl) {
  inputEl.classList.remove('error');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}

/**
 * Handle form submission
 */
async function handleFormSubmit(form) {
  if (!validateForm(form)) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit Enquiry';
  const alertContainer = form.querySelector('.form-alert-container');

  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" viewBox="0 0 50 50" style="width:20px;height:20px;animation:spin 1s linear infinite;">
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="80" stroke-dashoffset="60"></circle>
        </svg>
        Processing Enquiry...
      `;
    }

    const formData = {
      fullName: form.querySelector('[name="fullName"]')?.value.trim(),
      mobileNumber: form.querySelector('[name="mobileNumber"]')?.value.trim(),
      insuranceService: form.querySelector('[name="insuranceService"]')?.value,
      contactMethod: form.querySelector('input[name="contactMethod"]:checked')?.value || 'WhatsApp',
      message: form.querySelector('[name="message"]')?.value.trim() || 'No additional note provided',
      timestamp: new Date().toISOString(),
      refId: 'IA-' + Math.floor(100000 + Math.random() * 900000)
    };

    // Simulate backend response latency
    await new Promise(resolve => setTimeout(resolve, 800));

    // Save to local persistence
    try {
      const stored = JSON.parse(localStorage.getItem('insurance_adda_enquiries') || '[]');
      stored.push(formData);
      localStorage.setItem('insurance_adda_enquiries', JSON.stringify(stored));
    } catch (err) {
      // LocalStorage fallback
    }

    // Display Success Feedback
    if (alertContainer) {
      alertContainer.innerHTML = `
        <div class="form-alert success">
          <svg style="width:24px;height:24px;fill:currentColor;flex-shrink:0;" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <div>
            <strong>Enquiry Received Successfully! (Ref: ${formData.refId})</strong>
            <p style="font-size:0.88rem;margin-top:4px;color:#047857;">Thank you, ${formData.fullName}. Ravi Kumar G.R. will review your request and connect with you shortly via ${formData.contactMethod}.</p>
            <div style="margin-top:10px;">
              <a href="https://wa.me/919844411511?text=${encodeURIComponent(`Hello Ravi Kumar G.R., I just submitted enquiry Ref: ${formData.refId} for ${formData.insuranceService}. My name is ${formData.fullName}.`)}" 
                 target="_blank" 
                 rel="noopener"
                 class="btn btn-whatsapp btn-sm" 
                 style="font-size:0.82rem;padding:6px 14px;">
                Confirm instantly on WhatsApp &rarr;
              </a>
            </div>
          </div>
        </div>
      `;
    }

    form.reset();
    form.querySelectorAll('.radio-pill-label').forEach(lbl => lbl.classList.remove('checked'));
    form.querySelector('.radio-pill-label:first-child')?.classList.add('checked');

  } catch (error) {
    if (alertContainer) {
      alertContainer.innerHTML = `
        <div class="form-alert error">
          <div>
            <strong>Submission Error</strong>
            <p style="font-size:0.88rem;margin-top:4px;">Unable to submit form at this moment. Please reach out to Ravi Kumar G.R. directly via WhatsApp or phone call.</p>
          </div>
        </div>
      `;
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  }
}

/**
 * Direct WhatsApp Fallback Action
 */
function sendFormToWhatsApp(form) {
  if (!validateForm(form)) return;

  const fullName = form.querySelector('[name="fullName"]')?.value.trim();
  const mobileNumber = form.querySelector('[name="mobileNumber"]')?.value.trim();
  const insuranceService = form.querySelector('[name="insuranceService"]')?.value;
  const contactMethod = form.querySelector('input[name="contactMethod"]:checked')?.value || 'WhatsApp';
  const notes = form.querySelector('[name="message"]')?.value.trim() || 'Please guide me with policy options.';

  const message = `Hello Ravi Kumar G.R. (INSURANCE ADDA),
I would like assistance with an insurance enquiry:
- Name: ${fullName}
- Mobile: ${mobileNumber}
- Service Required: ${insuranceService}
- Preferred Contact: ${contactMethod}
- Note: ${notes}`;

  const targetPhone = '919844411511';
  const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
