// Menu data
const menuItems = [
  {
    id: 'burger-classic',
    name: 'Classic Burger',
    category: 'burgers',
    price: 7.5,
    image: 'assets/classic burger.jpeg',
    description: 'Beef patty, cheddar, lettuce, tomato, special sauce.',
    badge: 'Popular',
  },
  {
    id: 'burger-double',
    name: 'Double Cheese Burger',
    category: 'burgers',
    price: 9.9,
    image: 'assets/double cheeseburger.png',
    description: 'Two beef patties, double cheese, caramelized onions.',
    badge: 'Chef\'s pick',
  },
  {
    id: 'burger-veggie',
    name: 'Veggie Burger',
    category: 'burgers',
    price: 7.0,
    image: 'assets/veggie burger.jpg',
    description: 'Crispy veggie patty, avocado, greens, herb mayo.',
    badge: 'Vegetarian',
  },
  {
    id: 'pizza-margherita',
    name: 'Pizza Margherita',
    category: 'pizza',
    price: 10.5,
    image: 'assets/Pizza Margherita.jpg',
    description: 'Tomato, mozzarella, fresh basil, olive oil.',
    badge: 'Classic',
  },
  {
    id: 'pizza-pepperoni',
    name: 'Pepperoni Pizza',
    category: 'pizza',
    price: 12.0,
    image: 'assets/Pepperoni Pizza.jpg',
    description: 'Loaded pepperoni, mozzarella, spicy tomato sauce.',
    badge: 'Spicy',
  },
  {
    id: 'pizza-bbq',
    name: 'BBQ Chicken Pizza',
    category: 'pizza',
    price: 12.5,
    image: 'assets/BBQ Chicken Pizza.jpg',
    description: 'Grilled chicken, BBQ sauce, red onions, cilantro.',
    badge: 'New',
  },
  {
    id: 'drink-cola',
    name: 'Cola',
    category: 'drinks',
    price: 2.5,
    image: 'assets/Cola.jpg',
    description: 'Chilled sparkling cola.',
    badge: 'Cold',
  },
  {
    id: 'drink-lemonade',
    name: 'Fresh Lemonade',
    category: 'drinks',
    price: 3.0,
    image: 'assets/Fresh Lemonade.jpg',
    description: 'Homemade lemonade with mint.',
    badge: 'Fresh',
  },
  {
    id: 'drink-coffee',
    name: 'Iced Coffee',
    category: 'drinks',
    price: 3.8,
    image: 'assets/Iced Coffee.jpg',
    description: 'Cold brew with milk and ice.',
    badge: 'Energy',
  },
  {
    id: 'dessert-cheesecake',
    name: 'Cheesecake',
    category: 'desserts',
    price: 5.5,
    image: 'assets/Cheesecake.jpg',
    description: 'Creamy cheesecake with berry coulis.',
    badge: 'Sweet',
  },
  {
    id: 'dessert-brownie',
    name: 'Chocolate Brownie',
    category: 'desserts',
    price: 4.8,
    image: 'assets/Chocolate Brownie.jpg',
    description: 'Warm brownie with dark chocolate chunks.',
    badge: 'Rich',
  },
];

// State
let activeCategory = 'all';
const order = new Map(); // key: item id, value: { item, quantity }

// Helpers
const formatPrice = (value) => `$${value.toFixed(2)}`;

function getFilteredItems() {
  if (activeCategory === 'all') {
    return menuItems;
  }
  return menuItems.filter((item) => item.category === activeCategory);
}

// Rendering
function renderMenu() {
  const menuList = document.getElementById('menu-list');
  if (!menuList) return;

  const items = getFilteredItems();

  if (!items.length) {
    menuList.innerHTML =
      '<p class="order-empty" style="grid-column: 1 / -1;">No items in this category yet.</p>';
    return;
  }

  const markup = items
    .map((item) => {
      const safeDescription = item.description ?? '';
      return `
        <article class="menu-card" data-item-id="${item.id}">
          <div class="menu-card-media">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
          </div>
          <div class="menu-card-body">
            <div class="menu-card-top">
              <h3 class="menu-card-title">${item.name}</h3>
              <span class="menu-card-price">${formatPrice(item.price)}</span>
            </div>
            <p class="menu-card-meta">${safeDescription}</p>
            <div class="menu-card-footer">
              <span class="badge">${item.badge}</span>
              <button class="btn btn-primary menu-add-btn" type="button">
                <span>+ Add</span>
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  menuList.innerHTML = markup;
}

function renderOrder() {
  const orderContainer = document.getElementById('order-items');
  const totalEl = document.getElementById('order-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!orderContainer || !totalEl || !checkoutBtn) return;

  if (order.size === 0) {
    orderContainer.innerHTML =
      '<p class="order-empty">Your order is empty. Add something tasty from the menu.</p>';
    totalEl.textContent = formatPrice(0);
    checkoutBtn.disabled = true;
    return;
  }

  let total = 0;
  const rows = [];

  order.forEach((entry) => {
    const { item, quantity } = entry;
    const lineTotal = item.price * quantity;
    total += lineTotal;

    rows.push(`
      <div class="order-item" data-item-id="${item.id}">
        <div class="order-item-controls">
          <button
            class="order-qty-btn"
            type="button"
            data-action="decrease"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span class="order-qty-value">${quantity}</span>
          <button
            class="order-qty-btn"
            type="button"
            data-action="increase"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <div class="order-item-name">
          ${item.name}
        </div>
        <div class="order-item-price">
          ${formatPrice(lineTotal)}
          <button
            class="btn-ghost order-remove-btn"
            type="button"
            data-action="remove"
          >
            Remove
          </button>
        </div>
      </div>
    `);
  });

  orderContainer.innerHTML = rows.join('');
  totalEl.textContent = formatPrice(total);
  checkoutBtn.disabled = false;
}

// Category handling
function handleCategoryClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.dataset.category) return;

  const newCategory = target.dataset.category;
  if (!newCategory || newCategory === activeCategory) return;

  activeCategory = newCategory;

  // Update chip selection
  const container = target.parentElement;
  if (container) {
    const buttons = container.querySelectorAll('.chip');
    buttons.forEach((btn) => btn.classList.remove('is-selected'));
  }
  target.classList.add('is-selected');

  renderMenu();
}

// Order handling
function addItemToOrder(itemId) {
  const item = menuItems.find((m) => m.id === itemId);
  if (!item) return;

  const existing = order.get(itemId);
  if (existing) {
    existing.quantity += 1;
  } else {
    order.set(itemId, { item, quantity: 1 });
  }

  renderOrder();
  showOrderStatus(`${item.name} added to your order.`);
}

function updateItemQuantity(itemId, delta) {
  const entry = order.get(itemId);
  if (!entry) return;

  const newQty = entry.quantity + delta;
  if (newQty <= 0) {
    order.delete(itemId);
  } else {
    entry.quantity = newQty;
  }

  renderOrder();
}

function removeItemFromOrder(itemId) {
  const entry = order.get(itemId);
  if (!entry) return;

  order.delete(itemId);
  renderOrder();
  showOrderStatus(`${entry.item.name} removed from your order.`);
}

function handleMenuClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const addButton = target.closest('.menu-add-btn');
  if (!addButton) return;

  const card = addButton.closest('.menu-card');
  if (!card) return;

  const itemId = card.getAttribute('data-item-id');
  if (!itemId) return;

  addItemToOrder(itemId);
}

function handleOrderClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const itemRow = target.closest('.order-item');
  if (!itemRow) return;

  const itemId = itemRow.getAttribute('data-item-id');
  if (!itemId) return;

  const action = target.dataset.action;

  if (action === 'increase') {
    updateItemQuantity(itemId, 1);
  } else if (action === 'decrease') {
    updateItemQuantity(itemId, -1);
  } else if (action === 'remove') {
    removeItemFromOrder(itemId);
  }
}

// UX helpers
let statusTimeoutId;

function showOrderStatus(message) {
  const statusEl = document.getElementById('order-status');
  if (!statusEl) return;

  statusEl.textContent = message;

  if (statusTimeoutId) {
    window.clearTimeout(statusTimeoutId);
  }

  statusTimeoutId = window.setTimeout(() => {
    statusEl.textContent = '';
  }, 2200);
}

function smoothScrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleNavClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const button = target.closest('button[data-scroll-target]');
  if (!button) return;

  const sectionId = button.getAttribute('data-scroll-target');
  if (!sectionId) return;

  // Update active state
  const nav = button.parentElement;
  if (nav) {
    const buttons = nav.querySelectorAll('.nav-link');
    buttons.forEach((b) => b.classList.remove('is-active'));
  }
  button.classList.add('is-active');

  // Close mobile menu if open
  closeMobileMenu();

  smoothScrollToSection(sectionId);
}

function handleCheckoutClick() {
  if (order.size === 0) return;

  // Open checkout modal instead of alert
  openCheckoutModal();
}

// Mobile menu toggle
function toggleMobileMenu() {
  const nav = document.querySelector('.main-nav');
  const overlay = document.getElementById('mobile-menu-overlay');
  
  if (nav && overlay) {
    const isOpen = nav.classList.contains('is-open');
    
    if (isOpen) {
      nav.classList.remove('is-open');
      overlay.classList.remove('is-open');
    } else {
      nav.classList.add('is-open');
      overlay.classList.add('is-open');
    }
  }
}

function closeMobileMenu() {
  const nav = document.querySelector('.main-nav');
  const overlay = document.getElementById('mobile-menu-overlay');
  
  if (nav && overlay) {
    nav.classList.remove('is-open');
    overlay.classList.remove('is-open');
  }
}

// Theme toggle
function applyTheme(theme) {
  const body = document.body;
  body.classList.remove('theme-light', 'theme-dark');
  if (theme === 'light') {
    body.classList.add('theme-light');
  } else {
    body.classList.add('theme-dark');
  }
}

function initTheme() {
  const stored = window.localStorage.getItem('theme');
  const prefersDark = window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'dark');
  applyTheme(initial);
}

function handleThemeToggle() {
  const isCurrentlyDark = document.body.classList.contains('theme-dark');
  const next = isCurrentlyDark ? 'light' : 'dark';
  applyTheme(next);
  window.localStorage.setItem('theme', next);
}

// Initialization
function init() {
  renderMenu();
  renderOrder();
  initTheme();

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const categoryFilters = document.getElementById('category-filters');
  if (categoryFilters) {
    categoryFilters.addEventListener('click', handleCategoryClick);
  }

  const menuList = document.getElementById('menu-list');
  if (menuList) {
    menuList.addEventListener('click', handleMenuClick);
  }

  const orderContainer = document.getElementById('order-items');
  if (orderContainer) {
    orderContainer.addEventListener('click', handleOrderClick);
  }

  const nav = document.querySelector('.main-nav');
  if (nav) {
    nav.addEventListener('click', handleNavClick);
  }

  const heroCta = document.querySelector('.hero-cta');
  if (heroCta instanceof HTMLElement) {
    heroCta.addEventListener('click', () => smoothScrollToSection('menu'));
  }

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckoutClick);
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', handleThemeToggle);
  }

  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }

  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMobileMenu();
      closeCheckoutModal();
    }
  });

  // Checkout modal event listeners
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (order.size > 0) {
        openCheckoutModal();
      }
    });
  }

  const modalClose = document.getElementById('modal-close');
  if (modalClose) {
    modalClose.addEventListener('click', closeCheckoutModal);
  }

  const cancelOrder = document.getElementById('cancel-order');
  if (cancelOrder) {
    cancelOrder.addEventListener('click', closeCheckoutModal);
  }

  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }

  // Close modal on overlay click
  const modalOverlay = document.getElementById('checkout-modal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (event) => {
      if (event.target === modalOverlay) {
        closeCheckoutModal();
      }
    });
  }
}

// Modal Functions
function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const modalOrderItems = document.getElementById('modal-order-items');
  const modalOrderTotal = document.getElementById('modal-order-total');
  
  if (!modal) return;
  
  // Update order summary in modal
  updateModalOrderSummary();
  
  // Show modal
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  
  if (!modal) return;
  
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  
  // Reset form
  const form = document.getElementById('checkout-form');
  if (form) {
    form.reset();
  }
}

function updateModalOrderSummary() {
  const modalOrderItems = document.getElementById('modal-order-items');
  const modalOrderTotal = document.getElementById('modal-order-total');
  
  if (!modalOrderItems || !modalOrderTotal) return;
  
  let itemsHTML = '';
  let total = 0;
  
  order.forEach((orderData, id) => {
    // Extract item data correctly
    const item = orderData.item || orderData;
    const quantity = orderData.quantity || 1;
    
    const price = item.price || 0;
    const name = item.name || 'Unknown Item';
    
    const itemTotal = price * quantity;
    total += itemTotal;
    
    itemsHTML += `
      <div class="modal-order-item">
        <div class="modal-item-info">
          <div class="modal-item-details">
            <span class="modal-item-name">${name}</span>
            <span class="modal-item-quantity">${quantity} × $${price.toFixed(2)}</span>
          </div>
          <span class="modal-item-total">$${itemTotal.toFixed(2)}</span>
        </div>
      </div>
    `;
  });
  
  modalOrderItems.innerHTML = itemsHTML || '<p class="modal-empty-order">No items in order</p>';
  modalOrderTotal.textContent = `$${total.toFixed(2)}`;
}

function handleCheckoutSubmit(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const orderData = {
    customer: {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      address: formData.get('address')
    },
    payment: formData.get('payment'),
    items: Array.from(order.entries()).map(([id, orderData]) => {
      const item = orderData.item || orderData;
      return {
        id,
        name: item.name,
        price: item.price,
        quantity: orderData.quantity
      };
    }),
    total: calculateOrderTotal(),
    timestamp: new Date().toISOString()
  };
  
  // Send data to Google Sheet
  sendToGoogleSheet(orderData)
    .then(() => {
      // Log order data (in real app, this would be sent to server)
      console.log('Order submitted:', orderData);
      
      // Clear order and close modal
      order.clear();
      renderOrder();
      closeCheckoutModal();
    })
    .catch(error => {
      console.error('Error sending to Google Sheet:', error);
      alert('Error submitting order. Please try again.');
    });
}

// Function to send data to Google Sheet
async function sendToGoogleSheet(orderData) {
  const webAppUrl = 'https://script.google.com/macros/s/AKfycbxZuCt2lHY4Gg4ziBMoOSvwmJiuhkJHN09kxGG0MDl3frrtzsiyJMKhXxHfNmtnkHH4/exec';
  
  // Prepare data for Google Sheet
  const sheetData = {
    Name: orderData.customer.name,
    Email: orderData.customer.email,
    Phone: orderData.customer.phone,
    Address: orderData.customer.address,
    orderItems: orderData.items.map(item => `${item.name} (${item.quantity}x $${item.price})`).join(', '),
    totalPrice: orderData.total,
  };
  
  try {
    console.log('Sending data to Google Sheet:', sheetData);
    console.log('Web App URL:', webAppUrl);
    
    // Create URL-encoded form data instead of JSON
    const formData = new URLSearchParams();
    Object.keys(sheetData).forEach(key => {
      formData.append(key, sheetData[key]);
    });
    
    const response = await fetch(webAppUrl, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script Web App
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });
    
    console.log('Data sent to Google Sheet successfully');
    console.log('Response:', response);
    
  } catch (error) {
    console.error('Error sending data to Google Sheet:', error);
    console.error('Error details:', error.message);
    throw error;
  }
}

function calculateOrderTotal() {
  let total = 0;
  order.forEach((orderData) => {
    const item = orderData.item || orderData;
    const price = item.price || 0;
    const quantity = orderData.quantity || 1;
    total += price * quantity;
  });
  return total;
}

document.addEventListener('DOMContentLoaded', init);

