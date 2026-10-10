# INSURANCE ADDA — Insurance Services & Customer Support

Official responsive, luxury website for **INSURANCE ADDA** based in India, led by senior insurance advisor **Ravi Kumar G.R.** (15+ Years of Experience, 500+ Families Secured).

## 🌟 Overview & Key Features

- **Brand Aesthetic**: Deep Midnight Navy (`#0B1730`), Royal Blue (`#183B69`), Premium Gold (`#C8A45D`), and Soft Ivory (`#F7F5F0`).
- **Typography**: Google Fonts pairing of **Playfair Display / Cinzel** (editorial serif headlines) and **Plus Jakarta Sans** (modern clean sans-serif body).
- **Advisor Profile**: Ravi Kumar G.R. (15 Years Experience, 500+ Families Secured) with verified direct phone and WhatsApp contact.
- **6 Insurance Solutions**:
  1. Life Insurance (Family Financial Security)
  2. Term Insurance (Pure Protection Cover)
  3. Health Insurance (Hospitalisation & Wellness)
  4. Vehicle Insurance (Car & Bike Coverage & Renewals)
  5. Travel Insurance (Domestic & International Trips)
  6. Shop & Business Insurance (Commercial Shops & Business Assets)
- **Dedicated Customer Testimonials Page**: Filterable authentic reviews and WhatsApp feedback integration.
- **Dedicated Contact Page**: Direct calling (`9844411511`, `9845676455`), WhatsApp, Email, Instagram (`@insurance._adda`).
- **Functional Insurance Enquiry Form**: Full validation, reference generation (`IA-XXXXXX`), and instant WhatsApp forwarding fallback.
- **Floating WhatsApp Widget**: Instant dual-channel connection to advisor Ravi Kumar G.R. or Customer Support.
- **Regulatory Disclosures**: Complete insurance disclaimer and privacy policy pages adhering to consumer guidance and Indian compliance standards.

## 📁 Project Structure

```
INSURANCE ADDA/
├── index.html                   # Homepage (Hero, About, Advisor, Services, Why Choose Us, Form)
├── testimonials.html            # Dedicated Customer Testimonials page
├── contact.html                 # Dedicated Contact page
├── privacy.html                 # Privacy Policy
├── disclaimer.html              # Regulatory & Insurance Disclaimer
├── css/
│   ├── style.css                # Design tokens, typography, CSS resets
│   ├── components.css           # Header, cards, buttons, modals, WhatsApp widget
│   └── responsive.css           # Mobile, tablet, and desktop breakpoints
├── js/
│   ├── main.js                  # Sticky nav, mobile drawer, modal handlers
│   ├── enquiry.js               # Form validation & instant WhatsApp forwarding
│   └── whatsapp.js              # Dual-number routing & pre-filled messages
└── assets/
    ├── images/                  # Real assets (logo, Ravi Kumar G.R. portrait, service photography)
    └── icons/                   # Custom SVG vector icons
```

## 🚀 Local Setup & Deployment

Simply serve the files using any static server:
```bash
# Using Python
python -m http.server 3000

# Using Node.js
npx serve .
```

Open `http://localhost:3000` in your browser.
