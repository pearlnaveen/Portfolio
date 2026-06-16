// Mobile Navigation Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinksContainer = document.querySelector('.nav-links');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });
}

// Close menu when clicking nav links on mobile
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (navLinksContainer) navLinksContainer.classList.remove('active');
    });
});

// Sticky Navbar Scrolled State
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Reveal & Active Nav Link Highlighting & Skill Bars Filler
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

// Setup Scroll Reveal Intersection Observer
const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // If the entry is the skills section, animate skill bars
            if (entry.target.id === 'skills') {
                animateSkillBars();
            }
        }
    });
};

const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
});

sections.forEach(section => {
    section.classList.add('reveal');
    revealObserver.observe(section);
});

// Animate Skill Bars when visible
function animateSkillBars() {
    const fills = document.querySelectorAll('.skill-bar-fill');
    fills.forEach(fill => {
        const targetWidth = fill.getAttribute('data-percentage');
        fill.style.width = targetWidth;
    });
}

// Active Nav Link Tracker on Scroll
window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').includes(current)) {
            a.classList.add('active');
        }
    });
});

// Rotating Typewriter Effect
const words = ["Software Engineer", "AI/ML Enthusiast", "Problem Solver"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterSpan = document.getElementById('typewriter-text');
const typeSpeed = 100;
const backspaceSpeed = 50;
const pauseBetweenWords = 2000;

function typeEffect() {
    if (!typewriterSpan) return;

    const currentWord = words[wordIndex];

    if (isDeleting) {
        // Remove character
        charIndex--;
        typewriterSpan.textContent = currentWord.substring(0, charIndex);
    } else {
        // Add character
        charIndex++;
        typewriterSpan.textContent = currentWord.substring(0, charIndex);
    }

    let currentDelay = isDeleting ? backspaceSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
        // Finished typing the word, pause
        isDeleting = true;
        currentDelay = pauseBetweenWords;
    } else if (isDeleting && charIndex === 0) {
        // Finished deleting, move to next word
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        currentDelay = 500; // brief pause before next word starts typing
    }

    setTimeout(typeEffect, currentDelay);
}

// Start Typewriter
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeEffect, 1000);
});

// Interactive Card Spotlights Glow Effect
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Contact Form Handler (Web3Forms API Integration)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Show loading state with a spinner
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let jsonRes = await response.json();
            if (response.status === 200) {
                showSuccessToast();
                contactForm.reset();
            } else {
                console.log(response);
                alert(jsonRes.message || "Something went wrong. Please try again.");
            }
        })
        .catch(error => {
            console.log(error);
            alert("Form submission failed. Please check your internet connection.");
        })
        .then(() => {
            // Restore button state
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        });
    });
}

// Custom Success Toast Notification
function showSuccessToast() {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast card
    const toast = document.createElement('div');
    toast.className = 'toast success-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-check-circle toast-icon"></i>
            <div class="toast-message">
                <h4>Success!</h4>
                <p>Your message has been sent successfully.</p>
            </div>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="toast-progress"></div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Close button click listener
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 400);
    });
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 400);
        }
    }, 4000);
}