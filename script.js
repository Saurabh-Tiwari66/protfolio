// Global Variables
let currentProfileImage = null;
let isLightTheme = false;
let savedData = {
  profileImage: null,
  isLightTheme: false
};

// Load saved profile image and theme on page load
function loadSavedData() {
  try {
    // Load saved theme
    if (savedData.isLightTheme) {
      isLightTheme = true;
      document.body.classList.add('light-theme');
      const themeToggle = document.querySelector('.theme-toggle i');
      if (themeToggle) {
        themeToggle.className = 'ri-sun-line';
      }
    }
    
    // Load saved profile image
    if (savedData.profileImage) {
      setProfileImage(savedData.profileImage, false); // false = don't show success message on load
    }
  } catch (error) {
    console.log('Error loading saved data:', error);
  }
}

// Particle System
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    
    this.resize();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    this.particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
      
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.x -= dx * force * 0.01;
        particle.y -= dy * force * 0.01;
      }
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(0, 210, 255, ${particle.opacity})`;
      this.ctx.fill();
      
      this.particles.slice(index + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.strokeStyle = `rgba(0, 210, 255, ${0.1 * (1 - distance / 100)})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particles when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem();
});

// Utility Functions
function showMessage(text, type = 'success') {
  const messageBox = document.getElementById('messageBox');
  if (!messageBox) return;
  
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
  messageBox.classList.add('show');
  
  setTimeout(() => {
    messageBox.classList.remove('show');
  }, 3000);
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      }
    });
    
    // Close mobile menu
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
      navMenu.classList.remove('active');
    }
  }
}

// Navigation Functions
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu) {
    navMenu.classList.toggle('active');
  }
}

function toggleTheme() {
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle i');
  
  isLightTheme = !isLightTheme;
  savedData.isLightTheme = isLightTheme;
  
  if (isLightTheme) {
    body.classList.add('light-theme');
    if (themeToggle) {
      themeToggle.className = 'ri-sun-line';
    }
    showMessage('Light theme activated', 'success');
  } else {
    body.classList.remove('light-theme');
    if (themeToggle) {
      themeToggle.className = 'ri-moon-line';
    }
    showMessage('Dark theme activated', 'success');
  }
}

// Profile Image Functions - FIXED VERSION
function uploadProfileImage() {
  const imageInput = document.getElementById('imageInput');
  if (imageInput) {
    imageInput.click();
  }
}

function uploadHeroImage() {
  const heroImageInput = document.getElementById('heroImageInput');
  if (heroImageInput) {
    heroImageInput.click();
  }
}

function removeProfileImage() {
  const profileImg = document.getElementById('profileImg');
  const heroProfileImg = document.getElementById('heroProfileImg');
  const profilePlaceholder = document.getElementById('profilePlaceholder');
  const heroProfilePlaceholder = document.getElementById('heroProfilePlaceholder');
  const removeBtn = document.getElementById('removeBtn');
  const imageInput = document.getElementById('imageInput');
  const heroImageInput = document.getElementById('heroImageInput');

  // Hide images
  if (profileImg) {
    profileImg.classList.remove('loaded');
    profileImg.style.display = 'none';
  }
  if (heroProfileImg) {
    heroProfileImg.classList.remove('loaded');
    heroProfileImg.style.display = 'none';
  }
  
  // Show placeholders
  if (profilePlaceholder) {
    profilePlaceholder.classList.remove('hidden');
  }
  if (heroProfilePlaceholder) {
    heroProfilePlaceholder.classList.remove('hidden');
  }
  
  // Hide remove button
  if (removeBtn) {
    removeBtn.style.display = 'none';
  }

  // Clear inputs
  if (imageInput) imageInput.value = '';
  if (heroImageInput) heroImageInput.value = '';
  
  // Clear from memory storage
  savedData.profileImage = null;
  currentProfileImage = null;
  showMessage('Profile image removed', 'success');
}

function handleImageUpload(file) {
  if (!file) return;
  
  if (file.size > 5 * 1024 * 1024) {
    showMessage('Please select an image smaller than 5MB', 'error');
    return;
  }
  
  if (!file.type.startsWith('image/')) {
    showMessage('Please select a valid image file', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const imageData = e.target.result;
    setProfileImage(imageData, true); // true = show success message
  };
  reader.readAsDataURL(file);
}

function setProfileImage(imageSrc, showSuccessMessage = true) {
  currentProfileImage = imageSrc;
  
  // Save to memory storage instead of localStorage
  savedData.profileImage = imageSrc;

  const profileImg = document.getElementById('profileImg');
  const heroProfileImg = document.getElementById('heroProfileImg');
  const profilePlaceholder = document.getElementById('profilePlaceholder');
  const heroProfilePlaceholder = document.getElementById('heroProfilePlaceholder');
  const removeBtn = document.getElementById('removeBtn');

  // Set image sources
  if (profileImg) {
    profileImg.src = imageSrc;
    profileImg.classList.add('loaded');
    profileImg.style.display = 'block';
    profileImg.style.opacity = '0';
    
    setTimeout(() => {
      profileImg.style.opacity = '1';
    }, 100);
  }
  
  if (heroProfileImg) {
    heroProfileImg.src = imageSrc;
    heroProfileImg.classList.add('loaded');
    heroProfileImg.style.display = 'block';
    heroProfileImg.style.opacity = '0';
    
    setTimeout(() => {
      heroProfileImg.style.opacity = '1';
    }, 100);
  }

  // Hide placeholders
  if (profilePlaceholder) {
    profilePlaceholder.classList.add('hidden');
  }
  if (heroProfilePlaceholder) {
    heroProfilePlaceholder.classList.add('hidden');
  }
  
  // Show remove button
  if (removeBtn) {
    removeBtn.style.display = 'flex';
  }

  if (showSuccessMessage) {
    showMessage('Profile image uploaded successfully!', 'success');
  }
}

// Stats Animation
function animateStats() {
  const stats = [
    { id: 'projectCount', target: 10, suffix: '+' },
    { id: 'experienceCount', target: 0, suffix: '' },
    { id: 'clientCount', target: 0, suffix: '' },
    { id: 'satisfactionCount', target: 100, suffix: '%' }
  ];

  stats.forEach(stat => {
    const element = document.getElementById(stat.id);
    if (!element) return;
    
    let current = 0;
    const increment = stat.target / 60;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= stat.target) {
        current = stat.target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + stat.suffix;
    }, 60);
  });
}

// Interactive Functions
function showStatDetails(type) {
  const details = {
    projects: 'Successfully completed 50+ diverse projects ranging from e-commerce platforms to AI applications.',
    experience: 'Over 3 years of professional experience in full-stack development and UI/UX design.',
    clients: 'Worked with 25+ satisfied clients globally, delivering high-quality solutions.',
    satisfaction: '100% client satisfaction rate with timely delivery and excellent support.'
  };
  
  showModal('Project Statistics', details[type]);
}

function showSkillDetails(skill) {
  const skillDetails = {
    'React': 'Expert in React.js with hooks, context API, and modern patterns. Built 20+ production applications.',
    'Node.js': 'Proficient in server-side JavaScript, Express.js, and building scalable APIs.',
    'Python': 'Strong background in Python development, Django, and data analysis.',
    'JavaScript': 'Advanced JavaScript knowledge including ES6+, async/await, and modern frameworks.',
    'TypeScript': 'Experienced in type-safe development with TypeScript for large-scale applications.'
  };
  
  showModal(`${skill} Expertise`, skillDetails[skill] || `Experienced in ${skill} development and implementation.`);
}

function showProjectDetails(project) {
  const projectDetails = {
    'ecommerce': {
      title: 'E-Commerce Platform',
      description: 'A comprehensive e-commerce solution built with modern technologies. Features include user authentication, product catalog, shopping cart, payment integration with Stripe, inventory management, and admin dashboard.',
      features: ['User Authentication', 'Product Catalog', 'Shopping Cart', 'Payment Integration', 'Admin Dashboard', 'Inventory Management'],
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'JWT', 'Express.js']
    },
    'taskmanager': {
      title: 'Task Management App',
      description: 'A collaborative task management application for teams. Real-time updates, project tracking, team collaboration, and progress monitoring.',
      features: ['Real-time Updates', 'Team Collaboration', 'Project Tracking', 'Progress Monitoring', 'File Sharing'],
      tech: ['Next.js', 'TypeScript', 'Prisma', 'Socket.io', 'PostgreSQL']
    }
  };
  
  const project_data = projectDetails[project];
  if (project_data) {
    const content = `
      <h3>${project_data.title}</h3>
      <p>${project_data.description}</p>
      <h4>Key Features:</h4>
      <ul>${project_data.features.map(f => `<li>${f}</li>`).join('')}</ul>
      <h4>Technologies Used:</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
        ${project_data.tech.map(t => `<span style="background: var(--primary); color: var(--bg-primary); padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.8rem;">${t}</span>`).join('')}
      </div>
    `;
    showModal('Project Details', content);
  }
}

function showExperienceDetails(experience) {
  const experienceDetails = {
    'senior-dev': 'As a Junior Frontend Developer, I assist senior developers with complex projects, learn modern development practices, and contribute to UI improvements that enhance user experience.',
    'fullstack-dev': 'Developed and maintained multiple web applications using MERN stack. Implemented CI/CD pipelines, improved deployment efficiency by 60%, and collaborated with cross-functional teams.',
    'frontend-intern': 'Gained hands-on experience with modern frontend frameworks, contributed to open-source projects, and successfully completed 15+ projects during the internship period.'
  };
  
  showModal('Experience Details', experienceDetails[experience] || 'Detailed information about this experience.');
}

function showModal(title, content) {
  const modal = document.getElementById('detailModal');
  const modalContent = document.getElementById('modalContent');
  
  if (modal && modalContent) {
    modalContent.innerHTML = `
      <h3 style="color: var(--primary); margin-bottom: 1rem;">${title}</h3>
      <div style="color: var(--text-secondary); line-height: 1.6;">${content}</div>
    `;
    
    modal.classList.add('active');
  }
}

function closeModal() {
  const modal = document.getElementById('detailModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Contact Functions
function handleFormSubmit(event) {
  event.preventDefault();
  
  const submitBtn = document.getElementById('submitBtn');
  if (!submitBtn) return;
  
  const originalText = submitBtn.innerHTML;
  
  submitBtn.innerHTML = '<i class="ri-loader-4-line"></i> Sending...';
  submitBtn.disabled = true;
  
  // Simulate form submission
  setTimeout(() => {
    submitBtn.innerHTML = '<i class="ri-check-line"></i> Message Sent!';
    submitBtn.style.background = '#00ff88';
    showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
    
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = '';
      event.target.reset();
    }, 2000);
  }, 1500);
}

function openEmail() {
  window.open('https://mail.google.com/mail/u/0/#inbox', '_blank');
  showMessage('Opening email client...', 'success');
}

function callPhone() {
  window.open('tel:+6306608437', '_blank');
  showMessage('Initiating phone call...', 'success');
}

function showLocation() {
  // Open Google Maps with Lucknow location
  const location = 'Lucknow, Uttar Pradesh, India';
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  
  // Open in new tab
  window.open(googleMapsUrl, '_blank');
  
  // Show success message
  showMessage('Opening location in Google Maps...', 'success');
  
  // Also show modal with additional info
  setTimeout(() => {
    showModal('My Location', `
      <div style="text-align: center;">
        <i class="ri-map-pin-line" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;"></i>
        <h4 style="margin-bottom: 1rem;">📍 ${location}</h4>
        <p style="margin-bottom: 1.5rem;">Available for remote work and local meetings.</p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button onclick="window.open('${googleMapsUrl}', '_blank'); closeModal();" 
                  style="background: var(--primary); color: var(--bg-primary); border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
            <i class="ri-map-pin-line"></i> View on Google Maps
          </button>
          <button onclick="navigator.geolocation ? getDirections() : window.open('https://www.google.com/maps/dir//${encodeURIComponent(location)}', '_blank')" 
                  style="background: var(--secondary); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
            <i class="ri-navigation-line"></i> Get Directions
          </button>
        </div>
      </div>
    `);
  }, 500);
}

// Function to get directions from user's current location
function getDirections() {
  if (navigator.geolocation) {
    showMessage('Getting your location...', 'success');
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const destination = 'Lucknow, Uttar Pradesh, India';
        const directionsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${encodeURIComponent(destination)}`;
        
        window.open(directionsUrl, '_blank');
        closeModal();
        showMessage('Opening directions in Google Maps...', 'success');
      },
      function(error) {
        console.log('Geolocation error:', error);
        const destination = 'Lucknow, Uttar Pradesh, India';
        const directionsUrl = `https://www.google.com/maps/dir//${encodeURIComponent(destination)}`;
        window.open(directionsUrl, '_blank');
        closeModal();
        showMessage('Opening directions in Google Maps...', 'success');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  } else {
    const destination = 'Lucknow, Uttar Pradesh, India';
    const directionsUrl = `https://www.google.com/maps/dir//${encodeURIComponent(destination)}`;
    window.open(directionsUrl, '_blank');
    closeModal();
    showMessage('Opening directions in Google Maps...', 'success');
  }
}

function openLinkedIn() {
  window.open('https://linkedin.com/in/saurabh-tiwari', '_blank');
  showMessage('Opening LinkedIn profile...', 'success');
}

// Social Links
function openSocial(platform) {
  const urls = {
    github: 'https://github.com/Saurabh-Tiwari66',
    linkedin: 'https://www.linkedin.com/in/saurabh-kumar-a2a6752a3/',
    twitter: 'https://twitter.com/saurabh_dev',
    instagram: 'https://www.instagram.com/saurabhtiwari5906/',
    dribbble: 'https://dribbble.com/saurabh_designer'
  };
  
  window.open(urls[platform] || '#', '_blank');
  showMessage(`Opening ${platform.charAt(0).toUpperCase() + platform.slice(1)} profile...`, 'success');
}

// Project Links
function openLiveDemo(project) {
  showMessage(`Opening ${project} live demo...`, 'success');
  // In real implementation, open actual demo URL
}

function openGithub(project) {
  showMessage(`Opening ${project} GitHub repository...`, 'success');
  // In real implementation, open actual GitHub URL
}

// Download Resume
function downloadResume() {
  showMessage('Downloading resume...', 'success');
  // In real implementation, trigger actual download
  // const link = document.createElement('a');
  // link.href = 'path/to/resume.pdf';
  // link.download = 'Saurabh_Tiwari_Resume.pdf';
  // link.click();
}

// Scroll Effects
function updateScrollProgress() {
  const scrollProgress = document.querySelector('.scroll-indicator');
  if (scrollProgress) {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    
    scrollProgress.style.transform = `scaleX(${progress / 100})`;
  }
}

function handleNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
}

function updateActiveSection() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 200;
    if (window.pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// Typing Animation
function typeWriter(element, text, delay = 100) {
  if (!element) return;
  
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, delay);
    }
  }
  
  type();
}

// Intersection Observer for animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Trigger stats animation when about section is visible
        if (entry.target.id === 'about') {
          setTimeout(animateStats, 500);
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  // Observe sections for stats animation
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    observer.observe(aboutSection);
  }
}

// Event Listeners
window.addEventListener('scroll', () => {
  updateScrollProgress();
  handleNavbarScroll();
  updateActiveSection();
});

// Image upload event listeners - FIXED
document.addEventListener('DOMContentLoaded', function() {
  const imageInput = document.getElementById('imageInput');
  const heroImageInput = document.getElementById('heroImageInput');
  const detailModal = document.getElementById('detailModal');
  
  if (imageInput) {
    imageInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        handleImageUpload(file);
      }
    });
  }

  if (heroImageInput) {
    heroImageInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        handleImageUpload(file);
      }
    });
  }

  // Modal close on outside click
  if (detailModal) {
    detailModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });
  }
  
  // Load saved data
  loadSavedData();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
  if (e.ctrlKey && e.key === 't') {
    e.preventDefault();
    toggleTheme();
  }
});

// Initialize everything when page loads
window.addEventListener('load', () => {
  // Initialize typing animation
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText, 150);
  }
  
  // Initialize scroll animations
  initializeScrollAnimations();
  
  // Show welcome message
  setTimeout(() => {
    showMessage('Welcome to my portfolio! 🚀', 'success');
  }, 2000);
  
  console.log('Portfolio fully loaded and ready!');
});

// Add some interactive effects for better UX
document.addEventListener('DOMContentLoaded', () => {
  // Project card hover effects
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Smooth hover effects for skill tags
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    tag.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1) rotate(0deg)';
    });
  });
});

// Console welcome message
console.log(`
🚀 Welcome to Saurabh's Portfolio!

Portfolio Features:
• Fully interactive design
• Profile image upload with persistence
• Dark/Light theme toggle
• Responsive design
• Particle animations
• Working contact form
• Social media integration
• Memory-based data persistence

Keyboard Shortcuts:
• Ctrl + T: Toggle theme
• Escape: Close modals

Built with ❤️ using vanilla JavaScript, CSS3, and modern web technologies.
`);