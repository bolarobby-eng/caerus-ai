// ===== Mobile Menu Toggle =====
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
    mobileMenuBtn.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
});

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all other FAQs
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
            item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        
        // Toggle current FAQ
        if (!isActive) {
            faqItem.classList.add('active');
            button.setAttribute('aria-expanded', 'true');
        }
    });
});

// ===== Unified Scroll Handler (rAF-throttled) =====
const navbar = document.querySelector('.navbar');

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Contact Form Handling =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            submitBtn.textContent = 'Message Sent! ✓';
            submitBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
            contactForm.reset();
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        // Fallback: open mailto
        const data = Object.fromEntries(formData);
        const subject = encodeURIComponent(`CaerusAI Enquiry — ${data.service || 'General'}`);
        const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nService: ${data.service}\n\n${data.message}`);
        window.location.href = `mailto:hello@caerusai.co?subject=${subject}&body=${body}`;
        
        submitBtn.textContent = 'Opening email client...';
        submitBtn.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    }
    
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
    }, 3000);
});

// ===== Pricing Toggle (Collapsible) =====
document.querySelectorAll('.pricing-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const collapsible = btn.nextElementSibling;
        const isOpen = btn.classList.contains('active');
        btn.classList.toggle('active');
        btn.setAttribute('aria-expanded', !isOpen);
        btn.querySelector('.pricing-toggle-text').textContent = isOpen ? 'View Pricing' : 'Hide Pricing';
        collapsible.classList.toggle('open');

        // Trigger animation on cards inside when opening
        if (!isOpen) {
            collapsible.querySelectorAll('.pricing-card, .addons-block').forEach((el, i) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 100 + i * 80);
            });
        }
    });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all animatable elements (excluding pricing cards/addons inside collapsibles — those animate on toggle)
document.querySelectorAll('.section-header, .about-card, .faq-item').forEach(el => {
    el.classList.add('will-animate');
    observer.observe(el);
});

// For pricing cards/addons NOT inside a collapsible (shouldn't exist now, but just in case)
document.querySelectorAll('.pricing-card, .addons-block').forEach(el => {
    if (!el.closest('.pricing-collapsible')) {
        el.classList.add('will-animate');
        observer.observe(el);
    } else {
        // Inside collapsible — transition only, no initial opacity (handled by toggle)
        el.classList.add('will-animate-collapsible');
    }
});


// ===== Active Nav Link Highlighting =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

// ===== Back to Top Button =====
const backToTop = document.getElementById('backToTop');

let scrollTicking = false;

function onScroll() {
    const scrollY = window.scrollY;

    // Navbar background
    navbar.style.background = scrollY > 50
        ? 'rgba(10, 10, 11, 0.95)'
        : 'rgba(10, 10, 11, 0.8)';

    // Active nav link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (scrollY >= sectionTop && scrollY < sectionTop + section.offsetHeight) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Back to top visibility
    if (scrollY > 600) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    scrollTicking = false;
}

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(onScroll);
        scrollTicking = true;
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Console Easter Egg =====
console.log('%c◈ Caerus AI', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cAccelerating business growth with AI 🚀', 'font-size: 14px; color: #8b5cf6;');
console.log('%cInterested in working with us? Visit: #contact', 'font-size: 12px; color: #888;');
