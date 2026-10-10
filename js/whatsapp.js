/**
 * INSURANCE ADDA - WhatsApp Integration
 * Handles dual-number routing, floating widget interactions, and pre-filled message encoding
 */

const WHATSAPP_CONFIG = {
  primaryNumber: '919844411511', // Ravi Kumar G.R.
  supportNumber: '919845676455', // Support line
  defaultMessage: 'Hello INSURANCE ADDA, I would like assistance with your insurance services. Please contact me.',
  feedbackMessage: 'Hello INSURANCE ADDA, I would like to share my feedback about your service.'
};

/**
 * Generate standard WhatsApp Web / Mobile deep link
 */
function getWhatsAppUrl(phone, message) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Directly open WhatsApp in new tab
 */
function openWhatsApp(phone, message) {
  const url = getWhatsAppUrl(phone || WHATSAPP_CONFIG.primaryNumber, message || WHATSAPP_CONFIG.defaultMessage);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Initialize Floating WhatsApp Widget & Click-outside detection
 */
document.addEventListener('DOMContentLoaded', () => {
  const floatTrigger = document.querySelector('.whatsapp-float-trigger');
  const popover = document.querySelector('.whatsapp-popover');

  if (floatTrigger && popover) {
    floatTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      popover.classList.toggle('open');
    });

    // Close when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!popover.contains(e.target) && !floatTrigger.contains(e.target)) {
        popover.classList.remove('open');
      }
    });

    // Prevent closing when clicking inside popover
    popover.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Bind service-specific enquiry buttons with data-whatsapp-service attribute
  const serviceEnquiryButtons = document.querySelectorAll('[data-whatsapp-service]');
  serviceEnquiryButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-whatsapp-service');
      const targetPhone = btn.getAttribute('data-whatsapp-phone') || WHATSAPP_CONFIG.primaryNumber;
      
      const customMessage = `Hello INSURANCE ADDA, I would like to enquire about ${serviceName} options. Please assist me with relevant coverage details.`;
      openWhatsApp(targetPhone, customMessage);
    });
  });

  // Feedback WhatsApp button
  const feedbackButtons = document.querySelectorAll('[data-whatsapp-feedback]');
  feedbackButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPhone = btn.getAttribute('data-whatsapp-phone') || WHATSAPP_CONFIG.primaryNumber;
      openWhatsApp(targetPhone, WHATSAPP_CONFIG.feedbackMessage);
    });
  });
});
