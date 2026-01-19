// Exilium Wiki JavaScript

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const content = document.querySelector('.content');
            
            if (searchTerm.length > 2) {
                highlightSearchResults(content, searchTerm);
            } else {
                removeHighlights(content);
            }
        });
    }
    
    // Set active nav link based on current page
    setActiveNavLink();
    
    // Add smooth scrolling
    addSmoothScrolling();
    
    // Add collapsible sections
    addCollapsibleSections();
});

// Highlight search results
function highlightSearchResults(container, searchTerm) {
    removeHighlights(container);
    
    const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    while (walker.nextNode()) {
        if (walker.currentNode.parentElement.tagName !== 'SCRIPT' &&
            walker.currentNode.parentElement.tagName !== 'STYLE') {
            textNodes.push(walker.currentNode);
        }
    }
    
    textNodes.forEach(node => {
        const text = node.textContent;
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes(searchTerm)) {
            const span = document.createElement('span');
            span.innerHTML = text.replace(
                new RegExp(searchTerm, 'gi'),
                match => `<mark style="background: #d4af37; color: #0a0e1a; padding: 2px 4px; border-radius: 2px;">${match}</mark>`
            );
            node.parentNode.replaceChild(span, node);
        }
    });
}

// Remove search highlights
function removeHighlights(container) {
    const marks = container.querySelectorAll('mark');
    marks.forEach(mark => {
        const parent = mark.parentNode;
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize();
    });
}

// Set active navigation link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling for anchor links
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

// Add collapsible functionality to sections
function addCollapsibleSections() {
    // Find all h3 headers that should be collapsible
    const headers = document.querySelectorAll('section h3');
    
    headers.forEach(header => {
        header.style.cursor = 'pointer';
        header.style.userSelect = 'none';
        
        // Add collapse indicator
        const indicator = document.createElement('span');
        indicator.textContent = ' ▼';
        indicator.style.fontSize = '0.8em';
        indicator.style.color = 'var(--accent-blue)';
        indicator.style.transition = 'transform 0.3s';
        header.appendChild(indicator);
        
        header.addEventListener('click', function() {
            let nextElement = this.nextElementSibling;
            const isCollapsed = this.classList.contains('collapsed');
            
            // Toggle collapsed class
            this.classList.toggle('collapsed');
            indicator.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(-90deg)';
            
            // Toggle visibility of following elements until next h3
            while (nextElement && nextElement.tagName !== 'H3' && nextElement.tagName !== 'H2') {
                if (isCollapsed) {
                    nextElement.style.display = '';
                } else {
                    nextElement.style.display = 'none';
                }
                nextElement = nextElement.nextElementSibling;
            }
        });
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// Add copy button to code blocks (if any)
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.textContent = 'Copy';
        button.className = 'copy-button';
        button.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            padding: 4px 8px;
            background: var(--accent-blue);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
        `;
        
        const pre = block.parentElement;
        pre.style.position = 'relative';
        pre.appendChild(button);
        
        button.addEventListener('click', function() {
            navigator.clipboard.writeText(block.textContent);
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        });
    });
}

// Initialize tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: var(--bg-card);
                color: var(--text-primary);
                padding: 8px 12px;
                border-radius: 4px;
                border: 1px solid var(--border-color);
                font-size: 0.9rem;
                z-index: 1000;
                pointer-events: none;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.bottom + 5) + 'px';
            
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });
}