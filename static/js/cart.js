document.addEventListener('DOMContentLoaded', () => {
  let cartItems = [];

  const floatingCart = document.getElementById('floating-cart');
  const cartCountEl = document.getElementById('cart-count');
  const cartTotalEl = document.getElementById('cart-total');

  const cartModal = document.getElementById('cart-modal');
  const closeCartBtn = document.getElementById('close-cart');
  const cartItemsContainer = document.getElementById('cart-items');
  const modalCartTotal = document.getElementById('modal-cart-total');
  const placeOrderBtn = document.getElementById('place-order');

  const updateFloatingCart = () => {
    let totalQty = 0;
    let totalPrice = 0;
    cartItems.forEach(item => {
      totalQty += item.quantity;
      totalPrice += item.total_price * item.quantity;
    });
    cartCountEl.textContent = totalQty;
    cartTotalEl.textContent = totalPrice.toFixed(2);
  };

  const renderCartItems = () => {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    cartItems.forEach((item, idx) => {
      const itemTotal = item.total_price * item.quantity;
      total += itemTotal;

      const div = document.createElement('div');
      div.className = 'border-b py-2 flex justify-between items-center';

      div.innerHTML = `
        <div>
          <div class="font-semibold">${item.name} (${item.size || 'std'}) x${item.quantity}</div>
          <div class="text-sm text-gray-600">${item.options.length ? item.options.join(', ') : 'No options'}</div>
        </div>
        <div class="font-semibold">R${itemTotal.toFixed(2)}</div>
        <button aria-label="Remove item" data-index="${idx}" class="text-red-500 hover:text-red-700 ml-4 remove-item">✕</button>
      `;
      cartItemsContainer.appendChild(div);
    });
    modalCartTotal.textContent = total.toFixed(2);

    cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', e => {
        const index = parseInt(e.target.getAttribute('data-index'));
        if (!isNaN(index)) {
          cartItems.splice(index, 1);
          updateFloatingCart();
          renderCartItems();
        }
      });
    });
  };

  document.querySelectorAll('form').forEach(form => {
    const totalDisplay = form.querySelector('.item-total');
    const baseInput = form.querySelector('input[name="base_price"]');
    const sizeSelect = form.querySelector('.size-select');

    const updatePrice = () => {
      let basePrice = parseFloat(sizeSelect ? sizeSelect.selectedOptions[0].dataset.price : baseInput.value);
      baseInput.value = basePrice;
      form.querySelectorAll('.option-checkbox:checked').forEach(opt => {
        basePrice += parseFloat(opt.dataset.price);
      });
      const qty = parseInt(form.querySelector('.quantity-input').value) || 1;
      totalDisplay.textContent = (basePrice * qty).toFixed(2);
    };

    if (sizeSelect) {
      sizeSelect.addEventListener('change', updatePrice);
    }

    form.querySelectorAll('.option-checkbox, .quantity-input').forEach(input => {
      input.addEventListener('change', updatePrice);
    });

    updatePrice();

    form.addEventListener('submit', event => {
      event.preventDefault();

      const itemName = form.item_name.value;
      const quantity = parseInt(form.quantity.value);
      const selectedOptions = [];
      form.querySelectorAll('.option-checkbox:checked').forEach(opt => {
        selectedOptions.push(opt.value);
      });
      const totalPrice = parseFloat(totalDisplay.textContent);
      const selectedSize = sizeSelect ? sizeSelect.value : 'std';

      cartItems.push({
        name: itemName,
        options: selectedOptions,
        quantity: quantity,
        size: selectedSize,
        total_price: totalPrice / quantity
      });

      updateFloatingCart();

      fetch("/add_to_cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: itemName,
          options: selectedOptions,
          quantity: quantity,
          size: selectedSize,
          total_price: totalPrice.toFixed(2)
        })
      }).then(res => res.json())
        .then(data => {
          alert(`${quantity} x ${itemName} added to cart!`);
        });

      form.reset();
      updatePrice();
    });
  });

  floatingCart.addEventListener('click', () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    renderCartItems();
    cartModal.classList.remove('hidden');
  });

  closeCartBtn.addEventListener('click', () => {
    cartModal.classList.add('hidden');
  });

  placeOrderBtn.addEventListener('click', () => {
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    fetch('/submit_order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart: cartItems })
    })
    .then(res => res.json())
    .then(data => {
      alert('Order placed successfully! Thank you.');
      cartItems = [];
      updateFloatingCart();
      cartModal.classList.add('hidden');
    })
    .catch(err => {
      alert('Failed to place order. Please try again.');
      console.error(err);
    });
  });

  updateFloatingCart();

  document.querySelectorAll('.category-header').forEach(header => {
    header.addEventListener('click', () => {
      const items = header.nextElementSibling;
      if (!items) return;

      const svg = header.querySelector('svg');
      const isCollapsed = items.classList.toggle('hidden');

      svg.classList.toggle('rotate-180', isCollapsed);
    });
  });
});
