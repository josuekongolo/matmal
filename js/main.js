/**
 * MATMAL MATEUSZ FISCHBACH - Main JavaScript
 * Gulvlegger og Tapetserer i Ostfold
 */

(function() {
    'use strict';

    // ===========================================
    // DOM Elements
    // ===========================================
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.getElementById('nav-list');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    // ===========================================
    // Header Scroll Effect
    // ===========================================
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ===========================================
    // Mobile Menu Toggle
    // ===========================================
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navList.classList.toggle('active');

            // Toggle aria-expanded for accessibility
            const isExpanded = navList.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking a link
        navList.querySelectorAll('.nav__link').forEach(function(link) {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navList.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navList.contains(event.target) && !menuToggle.contains(event.target)) {
                menuToggle.classList.remove('active');
                navList.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ===========================================
    // Smooth Scroll for Anchor Links
    // ===========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===========================================
    // Contact Form Handling
    // ===========================================
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                address: document.getElementById('address').value.trim(),
                area: document.getElementById('area').value.trim(),
                projectType: document.getElementById('projectType').value,
                description: document.getElementById('description').value.trim(),
                siteVisit: document.getElementById('siteVisit').checked ? 'Ja' : 'Nei'
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.phone || !formData.projectType || !formData.description) {
                alert('Vennligst fyll ut alle obligatoriske felt.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Vennligst oppgi en gyldig e-postadresse.');
                return;
            }

            // Disable submit button and show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sender...';

            try {
                // Prepare email content
                const emailBody = `
Ny henvendelse fra MATMAL nettside

Kontaktinformasjon:
- Navn: ${formData.name}
- E-post: ${formData.email}
- Telefon: ${formData.phone}
- Adresse/Sted: ${formData.address || 'Ikke oppgitt'}

Prosjektdetaljer:
- Type prosjekt: ${formData.projectType}
- Omtrentlig areal: ${formData.area || 'Ikke oppgitt'}
- Onsker befaring: ${formData.siteVisit}

Beskrivelse:
${formData.description}

---
Sendt fra kontaktskjema pa matmal.no
                `.trim();

                // Send via Resend API
                // Note: In production, this should go through a backend endpoint
                // For now, we'll use a fallback method

                // Option 1: Use Resend API directly (requires API key - not recommended for frontend)
                // const response = await fetch('https://api.resend.com/emails', {
                //     method: 'POST',
                //     headers: {
                //         'Authorization': 'Bearer YOUR_RESEND_API_KEY',
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify({
                //         from: 'noreply@matmal.no',
                //         to: 'post@matmal.no',
                //         subject: `Ny henvendelse: ${formData.projectType} - ${formData.name}`,
                //         text: emailBody
                //     })
                // });

                // Option 2: Use mailto fallback for demo
                // This creates a mailto link that opens the user's email client
                const mailtoSubject = encodeURIComponent(`Ny henvendelse: ${formData.projectType} - ${formData.name}`);
                const mailtoBody = encodeURIComponent(emailBody);

                // For demo purposes, simulate a successful submission
                // In production, replace this with actual API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Show success message
                contactForm.style.display = 'none';
                formSuccess.classList.remove('hidden');

                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Store form data in localStorage as backup
                try {
                    const submissions = JSON.parse(localStorage.getItem('matmal_submissions') || '[]');
                    submissions.push({
                        ...formData,
                        timestamp: new Date().toISOString()
                    });
                    localStorage.setItem('matmal_submissions', JSON.stringify(submissions));
                } catch (storageError) {
                    console.log('Could not save to localStorage');
                }

                // Log for demo purposes
                console.log('Form submitted:', formData);
                console.log('Email content:', emailBody);

            } catch (error) {
                console.error('Form submission error:', error);
                alert('Beklager, noe gikk galt. Vennligst prøv igjen eller ring oss direkte.');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    // ===========================================
    // Form Input Validation Feedback
    // ===========================================
    document.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(function(input) {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = 'var(--color-error)';
            } else {
                this.style.borderColor = '';
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '';
            }
        });
    });

    // ===========================================
    // Lazy Loading Images
    // ===========================================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px'
        });

        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // ===========================================
    // Gallery Lightbox (Simple Implementation)
    // ===========================================
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                // Simple lightbox - open image in new tab
                // For a more sophisticated lightbox, consider a library like lightbox2 or GLightbox
                window.open(img.src, '_blank');
            }
        });
    });

    // ===========================================
    // Animate on Scroll (Simple Implementation)
    // ===========================================
    if ('IntersectionObserver' in window) {
        const animatedElements = document.querySelectorAll('.service-card, .feature, .approach-card, .testimonial, .gallery-item');

        const animationObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            animationObserver.observe(el);
        });
    }

    // ===========================================
    // Click-to-Call Tracking
    // ===========================================
    document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
        link.addEventListener('click', function() {
            // Track phone call clicks (for analytics)
            if (typeof gtag === 'function') {
                gtag('event', 'click', {
                    'event_category': 'Contact',
                    'event_label': 'Phone Call',
                    'value': 1
                });
            }
            console.log('Phone call initiated');
        });
    });

    // ===========================================
    // Email Link Tracking
    // ===========================================
    document.querySelectorAll('a[href^="mailto:"]').forEach(function(link) {
        link.addEventListener('click', function() {
            // Track email clicks (for analytics)
            if (typeof gtag === 'function') {
                gtag('event', 'click', {
                    'event_category': 'Contact',
                    'event_label': 'Email',
                    'value': 1
                });
            }
            console.log('Email link clicked');
        });
    });

    // ===========================================
    // Service Links - Smooth Scroll on Same Page
    // ===========================================
    // Handle service links that might come from other pages
    if (window.location.hash) {
        setTimeout(function() {
            const target = document.querySelector(window.location.hash);
            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    // ===========================================
    // Console Welcome Message
    // ===========================================
    console.log('%cMATMAL MATEUSZ FISCHBACH', 'font-size: 20px; font-weight: bold; color: #1B4332;');
    console.log('%cGulvlegger og Tapetserer i Ostfold', 'font-size: 14px; color: #C9A86C;');
    console.log('Kontakt: post@matmal.no | Telefon: 400 XX XXX');

})();
