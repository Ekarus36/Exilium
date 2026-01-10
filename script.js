/* ========================================
   EXILIUM WIKI - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initSearch();
    initCollapsibles();
    initMobileMenu();
    initActiveNav();
    initSmoothScroll();
});

/* ========================================
   SEARCH FUNCTIONALITY
   ======================================== */

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    // Keyboard shortcut (Ctrl+K or Cmd+K)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === 'Escape') {
            searchInput.blur();
            clearSearch();
        }
    });
    
    // Search on input
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        if (query.length < 2) {
            clearSearch();
            return;
        }
        performSearch(query);
    });
}

function performSearch(query) {
    const navLinks = document.querySelectorAll('.nav-menu a');
    let hasResults = false;
    
    navLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        const parent = link.parentElement;
        
        if (text.includes(query)) {
            parent.style.display = '';
            link.style.background = 'rgba(212, 168, 83, 0.1)';
            hasResults = true;
        } else {
            parent.style.display = 'none';
            link.style.background = '';
        }
    });
    
    // Hide section headers if no results in that section
    document.querySelectorAll('.nav-section').forEach(section => {
        let nextEl = section.nextElementSibling;
        let hasVisible = false;
        
        while (nextEl && !nextEl.classList.contains('nav-section')) {
            if (nextEl.style.display !== 'none' && nextEl.querySelector('a')) {
                hasVisible = true;
            }
            nextEl = nextEl.nextElementSibling;
        }
        
        section.style.display = hasVisible ? '' : 'none';
    });
}

function clearSearch() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.parentElement.style.display = '';
        link.style.background = '';
    });
    document.querySelectorAll('.nav-section').forEach(section => {
        section.style.display = '';
    });
}

/* ========================================
   COLLAPSIBLE SECTIONS
   ======================================== */

function initCollapsibles() {
    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', function() {
            const collapsible = this.parentElement;
            collapsible.classList.toggle('open');
        });
    });
}

/* ========================================
   MOBILE MENU
   ======================================== */

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (!menuToggle || !sidebar) return;
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
        this.innerHTML = sidebar.classList.contains('open') ? '✕' : '☰';
    });
    
    // Close menu when clicking a link
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 900) {
                sidebar.classList.remove('open');
                menuToggle.innerHTML = '☰';
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 900 && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target) &&
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            menuToggle.innerHTML = '☰';
        }
    });
}

/* ========================================
   ACTIVE NAVIGATION
   ======================================== */

function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ========================================
   TABLE OF CONTENTS (Auto-generate)
   ======================================== */

function generateTOC() {
    const content = document.querySelector('.content');
    const tocContainer = document.querySelector('.toc');
    
    if (!content || !tocContainer) return;
    
    const headings = content.querySelectorAll('h2, h3');
    if (headings.length < 3) {
        tocContainer.style.display = 'none';
        return;
    }
    
    const toc = document.createElement('ul');
    toc.className = 'toc-list';
    
    headings.forEach((heading, index) => {
        const id = heading.id || `section-${index}`;
        heading.id = id;
        
        const li = document.createElement('li');
        li.className = heading.tagName === 'H3' ? 'toc-sub' : '';
        
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = heading.textContent;
        
        li.appendChild(a);
        toc.appendChild(li);
    });
    
    tocContainer.appendChild(toc);
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
