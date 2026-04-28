const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
 
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
 
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
 
class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 255, 136, ${this.opacity})`;
    ctx.fill();
  }
}
 
for (let i = 0; i < 60; i++) {
  particles.push(new Particle());
}
 
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
 
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 255, 136, ${0.05 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
 
animateParticles();
 
// ===== HEADER SCROLL =====
const header = document.getElementById('header');
const backToTop = document.getElementById('backToTop');
 
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  header.classList.toggle('scrolled', scrollY > 50);
  backToTop.classList.toggle('show', scrollY > 500);
});
 
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
 
// ===== MOBILE MENU =====
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
 
menuToggle.addEventListener('click', () => {
  menu.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
});
 
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    document.body.style.overflow = '';
  });
});
 
// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 200;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.menu a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
});
 
// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
 
revealElements.forEach(el => revealObserver.observe(el));
 
// ===== NUMBER COUNTER =====
const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const count = parseInt(target.getAttribute('data-count'));
      let current = 0;
      const increment = count / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= count) {
          target.textContent = count;
          clearInterval(timer);
        } else {
          target.textContent = Math.floor(current);
        }
      }, 25);
      counterObserver.unobserve(target);
    }
  });
}, { threshold: 0.5 });
 
statNums.forEach(el => counterObserver.observe(el));
 
// ===== PRODUCT FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.card');
 
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
 
    cards.forEach(card => {
      const brand = card.getAttribute('data-brand');
      if (filter === 'all' || brand === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInUp 0.5s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});
 
// ===== SHOPPING CART =====
let cart = [];
 
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartFooter = document.getElementById('cartFooter');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
 
function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
 
function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}
 
cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
 
function showToast(msg) {
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
 
function updateCart() {
  cartCount.textContent = cart.length;
  cartCount.classList.toggle('show', cart.length > 0);
  cartFooter.style.display = cart.length > 0 ? 'block' : 'none';
 
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-bag"></i>
        <p>Seu carrinho esta vazio</p>
        <a href="#ofertas" class="btn btn-outline btn-sm" onclick="closeCart()">Ver Produtos</a>
      </div>`;
    return;
  }
 
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
 
  cartItems.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-img" style="background: var(--surface-2); display:flex; align-items:center; justify-content:center;">
        <i class="fas fa-shoe-prints" style="color: var(--primary); font-size:1.2rem;"></i>
      </div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${i})">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `).join('');
}
 
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
  showToast('Produto removido do carrinho');
}
 
// Make removeFromCart globally accessible
window.removeFromCart = removeFromCart;
 
document.querySelectorAll('.add-cart-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.getAttribute('data-name');
    const price = parseFloat(btn.getAttribute('data-price'));
    cart.push({ name, price });
    updateCart();
    showToast(`${name} adicionado ao carrinho!`);
 
    // Button animation
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => btn.style.transform = '', 200);
  });
});
 
// ===== QUICK VIEW MODAL =====
const modalOverlay = document.getElementById('modalOverlay');
const productModal = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');
const modalImg = document.getElementById('modalImg');
const modalBrand = document.getElementById('modalBrand');
const modalName = document.getElementById('modalName');
const modalPrice = document.getElementById('modalPrice');
 
function openModal(card) {
  const img = card.querySelector('.card-img-wrap img');
  const brand = card.querySelector('.card-brand').textContent;
  const name = card.querySelector('.card-body h3').textContent;
  const price = card.querySelector('.price-new').textContent;
 
  modalImg.src = img.src;
  modalBrand.textContent = brand;
  modalName.textContent = name;
  modalPrice.textContent = price;
 
  modalOverlay.classList.add('open');
  productModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
 
function closeModal() {
  modalOverlay.classList.remove('open');
  productModal.classList.remove('open');
  document.body.style.overflow = '';
}
 
document.querySelectorAll('.quick-view-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.card');
    openModal(card);
  });
});
 
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
 
// Size selector
document.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
 
// Modal add to cart
document.querySelector('.modal-add-btn').addEventListener('click', () => {
  const name = modalName.textContent;
  const priceText = modalPrice.textContent;
  const price = parseFloat(priceText.replace('R$ ', '').replace('.', '').replace(',', '.'));
  cart.push({ name, price });
  updateCart();
  closeModal();
  showToast(`${name} adicionado ao carrinho!`);
});
 
// ===== WISHLIST TOGGLE =====
document.querySelectorAll('.wishlist-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const icon = btn.querySelector('i');
    icon.classList.toggle('far');
    icon.classList.toggle('fas');
    if (icon.classList.contains('fas')) {
      btn.style.background = 'rgba(255, 68, 68, 0.3)';
      btn.style.color = '#ff4444';
      showToast('Adicionado aos favoritos!');
    } else {
      btn.style.background = '';
      btn.style.color = '';
      showToast('Removido dos favoritos');
    }
  });
});
 
// ===== COUNTDOWN TIMER =====
function updateTimer() {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setDate(endOfDay.getDate() + 3);
  endOfDay.setHours(23, 59, 59, 999);
 
  const diff = endOfDay - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
 
  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}
 
updateTimer();
setInterval(updateTimer, 1000);
 
// ===== NEWSLETTER =====
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = e.target.querySelector('input');
  showToast(`Email ${input.value} cadastrado com sucesso!`);
  input.value = '';
});
 
// ===== SEARCH =====
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    cards.forEach(card => {
      const name = card.querySelector('h3').textContent.toLowerCase();
      const brand = card.getAttribute('data-brand');
      if (name.includes(query) || brand.includes(query)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
}
 
// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
 
// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCart();
    closeModal();
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }
});
 
// ===== CSS ANIMATION KEYFRAMES INJECTION =====
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);