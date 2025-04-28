// Product data from both student and office pages
const studentProducts = [
    {
        id: 1,
        name: "Premium Notebook",
        description: "Spiral-bound notebook with 100 college-ruled pages and durable cover.",
        price: 199,
        image: "../photos/notebooks.jpeg",
        type: "student"
    },
    {
        id: 2,
        name: "Pen Set",
        description: "Pack of 5 pens with smooth writing and comfortable grip.",
        price: 99,
        image: "../photos/pen.jpeg",
        type: "student"
    },
    {
        id: 3,
        name: "Scientific Calculator",
        description: "Advanced calculator with 240 functions for math and science classes.",
        price: 399,
        image: "../photos/calci.jpeg",
        type: "student"
    },
    {
        id: 4,
        name: "Highlighter Pack",
        description: "Set of 6 vibrant highlighters with chisel tip for precise highlighting.",
        price: 149,
        image: "../photos/marker.jpeg",
        type: "student"
    },
    {
        id: 5,
        name: "Sticky Notes",
        description: "Colorful sticky notes for quick reminders and notes.",
        price: 49,
        image: "../photos/sticky.jpeg",
        type: "student"
    },
    {
        id: 6,
        name: "Paper Glue",
        description: "Quick-drying paper glue for all your craft needs.",
        price: 29,
        image: "../photos/paper glue.jpeg",
        type: "student"
    },
    {
        id: 7,
        name: "Scissors",
        description: "Sharp scissors for precise cutting.",
        price: 79,
        image: "../photos/sissor.jpeg",
        type: "student"
    },
    {
        id: 8,
        name: "Rubber",
        description: "High-quality eraser for clean erasing.",
        price: 19,
        image: "../photos/rubber.jpeg",
        type: "student"
    }
];

const officeProducts = [
    {
        id: 1,
        name: "Diary",
        price: 24.99,
        image: "../photos/diary.jpeg",
        type: "office"
    },
    {
        id: 2,
        name: "Scissors",
        price: 12.99,
        image: "../photos/sissor.jpeg",
        type: "office"
    },
    {
        id: 3,
        name: "Sticky Notes",
        price: 8.99,
        image: "../photos/sticky.jpeg",
        type: "office"
    },
    {
        id: 4,
        name: "Paper Glue",
        price: 5.99,
        image: "../photos/paper glue.jpeg",
        type: "office"
    },
    {
        id: 5,
        name: "Rubber",
        price: 3.99,
        image: "../photos/rubber.jpeg",
        type: "office"
    },
    {
        id: 6,
        name: "Notebooks",
        price: 19.99,
        image: "../photos/notebooks.jpeg",
        type: "office"
    },
    {
        id: 7,
        name: "Register",
        price: 29.99,
        image: "../photos/register.jpeg",
        type: "office"
    },
    {
        id: 8,
        name: "Duster",
        price: 9.99,
        image: "../photos/duster.jpeg",
        type: "office"
    },
    {
        id: 9,
        name: "Marker",
        price: 7.99,
        image: "../photos/marker.jpeg",
        type: "office"
    }
];

// Combine all products
const allProducts = [...studentProducts, ...officeProducts];

// Search functionality
function performSearch(searchTerm) {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const searchResults = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    return searchResults;
}

// Create and show search suggestions
function showSearchSuggestions(results) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) return;
    
    suggestionsContainer.innerHTML = '';
    
    if (results.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    results.forEach(product => {
        const suggestion = document.createElement('div');
        suggestion.className = 'search-suggestion';
        suggestion.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='../photos/default-product.jpg'">
            <div class="suggestion-info">
                <div class="suggestion-name">${product.name}</div>
                <div class="suggestion-price">₹${product.price.toFixed(2)}</div>
            </div>
        `;
        
        suggestion.addEventListener('click', () => {
            // Redirect to the appropriate page based on product type
            if (product.type === 'student') {
                window.location.href = `product2/students_p.html#product-${product.id}`;
            } else {
                window.location.href = `product and add to cart/office_p.html#product-${product.id}`;
            }
        });
        
        suggestionsContainer.appendChild(suggestion);
    });
    
    suggestionsContainer.style.display = 'block';
}

// Initialize search functionality
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    // Handle search input
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        const results = performSearch(searchTerm);
        showSearchSuggestions(results);
    });

    // Handle Enter key press
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value.trim();
            const results = performSearch(searchTerm);
            if (results.length > 0) {
                const firstResult = results[0];
                if (firstResult.type === 'student') {
                    window.location.href = `product2/students_p.html#product-${firstResult.id}`;
                } else {
                    window.location.href = `product and add to cart/office_p.html#product-${firstResult.id}`;
                }
            }
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (suggestionsContainer && !e.target.closest('.search-container')) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initSearch); 