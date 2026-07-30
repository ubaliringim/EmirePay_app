// Sticky Header Navigation Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (!header) return;
    if (window.scrollY > 30) {
        header.classList.add('glass-effect', 'shadow-sm', 'border-slate-100');
        header.classList.remove('border-transparent');
        header.style.padding = '12px 0';
    } else {
        header.classList.remove('glass-effect', 'shadow-sm', 'border-slate-100');
        header.classList.add('border-transparent');
        header.style.padding = '18px 0';
    }
});

// FAQ Accordion Functionality
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const btn = item.querySelector('.faq-btn');
    const panel = item.querySelector('.faq-panel');
    const icon = item.querySelector('.fa-chevron-down');
    
    if (btn && panel) {
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all other open accordion panels
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-panel').style.maxHeight = '0px';
                    if (otherItem.querySelector('.fa-chevron-down')) {
                        otherItem.querySelector('.fa-chevron-down').style.transform = 'rotate(0deg)';
                    }
                }
            });
            
            // Toggle the clicked accordion panel
            if (isOpen) {
                item.classList.remove('active');
                panel.style.maxHeight = '0px';
                if (icon) icon.style.transform = 'rotate(0deg)';
            } else {
                item.classList.add('active');
                panel.style.maxHeight = panel.scrollHeight + 'px';
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    }
});

// Scroll Reveal Observer (Framer-Motion like transitions)
const revealItems = document.querySelectorAll('.reveal-item');
if (revealItems.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once active, no need to watch again
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    revealItems.forEach(item => observer.observe(item));
}

// Animate Stats Count Up
function animateCountUp(el, target, duration = 1500) {
    let start = 0;
    const increment = Math.ceil(target / (duration / 30));
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            el.innerText = target.toLocaleString() + '+';
            clearInterval(timer);
        } else {
            el.innerText = start.toLocaleString() + '+';
        }
    }, 30);
}

const statsSection = document.getElementById('stat-users');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCountUp(entry.target, 10000);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
}

// Form Submission Handling
const contactForm = document.getElementById('contact-form-el');
const formSubmitBtn = document.getElementById('form-submit');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        
        // Temporary feedback UX
        formSubmitBtn.innerText = 'Sending...';
        formSubmitBtn.disabled = true;
        
        setTimeout(() => {
            alert(`Thank you, ${name}! Your message has been sent to our support team. We will respond back at ${email} shortly.`);
            contactForm.reset();
            formSubmitBtn.innerText = 'Send Message';
            formSubmitBtn.disabled = false;
        }, 1500);
    });
}
