/**
 * Bike Builder - Storefront JavaScript
 * Loads the bike builder interface with accordion sections and variant selection
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const container = document.getElementById('bike-builder-app');
    if (!container) {
      console.error('Bike Builder: Container not found');
      return;
    }

    const shop = container.dataset.shop;
    const apiUrl = container.dataset.apiUrl || '/apps/bike-builder/api';

    // Load parts from API
    loadParts(apiUrl)
      .then(data => {
        renderBikeBuilder(container, data);
      })
      .catch(error => {
        console.error('Failed to load bike parts:', error);
        container.innerHTML = '<div class="bb-error">Failed to load bike builder. Please refresh the page.</div>';
      });
  }

  async function loadParts(apiUrl) {
    const response = await fetch(`${apiUrl}/parts`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  function renderBikeBuilder(container, data) {
    const parts = data.parts || data; // Handle both old and new API format
    const buildFeeConfig = data.buildFee || { enabled: false };
    let selectedParts = {};

    const html = `
      <div class="bb-header">
        <h1>🚲 Build Your Dream Bike</h1>
        <p class="bb-tagline">Select your parts and create the perfect ride</p>
      </div>

      <div class="bb-container">
        <div class="bb-parts-selector" id="bb-parts-selector">
          <h2>Select Your Parts</h2>
          <div class="bb-accordion" id="bb-accordion">
            <!-- Accordion categories will be rendered here -->
          </div>
        </div>

        <div class="bb-build-list">
          <h2>Your Build</h2>
          <div class="bb-list-paper" id="bb-list">
            <div class="bb-list-header">
              <span>Part</span>
              <span>Price</span>
            </div>
            <div class="bb-list-empty">Select parts to build your bike</div>
            <div class="bb-list-total">
              <span>TOTAL:</span>
              <span id="bb-total">$0.00</span>
            </div>
          </div>
          <button class="bb-btn-primary" id="bb-add-to-cart" disabled>
            🛒 Add to Cart
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Render parts with accordions
    renderAccordion(parts, selectedParts, buildFeeConfig);

    // Set up event listeners
    document.getElementById('bb-add-to-cart').addEventListener('click', () => {
      handleAddToCart(selectedParts, buildFeeConfig);
    });
  }

  function renderAccordion(parts, selectedParts, buildFeeConfig) {
    const accordion = document.getElementById('bb-accordion');

    const categoryLabels = {
      frames: 'Frames', forks: 'Forks', stems: 'Stems', handlebars: 'Handlebars',
      grips: 'Grips', brakes: 'Brakes', cranks: 'Cranks', 'bottom-brackets': 'Bottom Brackets',
      pedals: 'Pedals', seats: 'Seats', seatposts: 'Seatposts', 'seatpost-clamps': 'Seatpost Clamps',
      wheels: 'Wheels', tires: 'Tires'
    };

    let html = '';
    let categoryIndex = 0;

    Object.entries(parts).forEach(([category, items]) => {
      if (items.length === 0) return;

      const categoryId = `category-${categoryIndex}`;
      const isFirst = categoryIndex === 0;

      html += `
        <div class="bb-accordion-item ${isFirst ? 'active' : ''}">
          <button class="bb-accordion-header" data-category="${categoryId}">
            <span class="bb-accordion-title">${categoryLabels[category] || category}</span>
            <span class="bb-accordion-count">${items.length} options</span>
            <span class="bb-accordion-icon">${isFirst ? '−' : '+'}</span>
          </button>
          <div class="bb-accordion-content" id="${categoryId}" style="display: ${isFirst ? 'block' : 'none'}">
            <div class="bb-parts-grid">
              ${items.map(part => renderPartCard(part, category)).join('')}
            </div>
          </div>
        </div>
      `;
      categoryIndex++;
    });

    accordion.innerHTML = html;

    // Set up accordion click handlers
    document.querySelectorAll('.bb-accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const categoryId = header.dataset.category;
        const content = document.getElementById(categoryId);
        const item = header.parentElement;
        const icon = header.querySelector('.bb-accordion-icon');
        const isActive = item.classList.contains('active');

        // Toggle this accordion
        if (isActive) {
          item.classList.remove('active');
          content.style.display = 'none';
          icon.textContent = '+';
        } else {
          item.classList.add('active');
          content.style.display = 'block';
          icon.textContent = '−';
        }
      });
    });

    // Make selectPart and selectVariant available globally
    window.selectPart = function(category, productId) {
      const product = Object.values(parts).flat().find(p => p.id === productId);
      if (!product) return;

      // Select with default variant
      selectedParts[category] = {
        productId: product.id,
        title: product.title,
        variantId: product.defaultVariantId,
        variantTitle: product.variants[0]?.title || 'Default',
        price: product.defaultPrice,
        image: product.image
      };

      updateUI(selectedParts, category, productId, buildFeeConfig);
    };

    window.selectVariant = function(category, productId, variantId) {
      const product = Object.values(parts).flat().find(p => p.id === productId);
      if (!product) return;

      const variant = product.variants.find(v => v.id === variantId);
      if (!variant) return;

      // Update selected part with new variant
      selectedParts[category] = {
        productId: product.id,
        title: product.title,
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        image: product.image
      };

      updateUI(selectedParts, category, productId, buildFeeConfig);
    };
  }

  function renderPartCard(part, category) {
    const hasVariants = part.variants && part.variants.length > 1;

    return `
      <div class="bb-part-card" data-category="${category}" data-part-id="${part.id}">
        <div class="bb-part-card-inner" onclick="window.selectPart('${category}', '${part.id}')">
          ${part.image ? `<img src="${part.image}" alt="${part.title}">` : '<div class="bb-part-no-image">No Image</div>'}
          <div class="bb-part-info">
            <div class="bb-part-name">${part.title}</div>
            <div class="bb-part-price" data-product-id="${part.id}">$${part.defaultPrice.toFixed(2)}</div>
          </div>
        </div>
        ${hasVariants ? `
          <div class="bb-variant-selector" onclick="event.stopPropagation()">
            <select
              class="bb-variant-dropdown"
              data-category="${category}"
              data-product-id="${part.id}"
              onchange="window.selectVariant('${category}', '${part.id}', this.value)"
            >
              ${part.variants.map((variant, index) => `
                <option value="${variant.id}" ${index === 0 ? 'selected' : ''}>
                  ${variant.title} - $${variant.price.toFixed(2)}
                </option>
              `).join('')}
            </select>
          </div>
        ` : ''}
      </div>
    `;
  }

  function updateUI(selectedParts, changedCategory, changedProductId, buildFeeConfig) {
    // Update selected states
    document.querySelectorAll('.bb-part-card').forEach(card => {
      card.classList.remove('selected');
    });

    Object.entries(selectedParts).forEach(([category, part]) => {
      const card = document.querySelector(`[data-category="${category}"][data-part-id="${part.productId}"]`);
      if (card) {
        card.classList.add('selected');
      }
    });

    // Update price display if variant changed for this product
    if (changedCategory && changedProductId) {
      const selectedPart = selectedParts[changedCategory];
      const priceElement = document.querySelector(`[data-product-id="${changedProductId}"]`);
      if (priceElement && selectedPart) {
        priceElement.textContent = `$${selectedPart.price.toFixed(2)}`;
      }
    }

    // Calculate totals
    const partsTotal = Object.values(selectedParts).reduce((sum, part) => sum + part.price, 0);
    let buildFee = 0;
    let buildFeeHtml = '';
    let showFreeAssemblyMessage = false;

    // Determine if build fee applies
    if (buildFeeConfig && buildFeeConfig.enabled && Object.keys(selectedParts).length > 0) {
      if (buildFeeConfig.freeThresholdEnabled && partsTotal >= buildFeeConfig.freeThresholdAmount) {
        // Free assembly!
        showFreeAssemblyMessage = true;
        buildFeeHtml = `
          <div class="bb-list-item bb-build-fee-free">
            <span class="bb-item-name">🎁 Professional Assembly</span>
            <span class="bb-item-price" style="color: #10b981;">FREE</span>
          </div>
        `;
      } else {
        // Charge build fee
        buildFee = buildFeeConfig.amount;
        buildFeeHtml = `
          <div class="bb-list-item bb-build-fee">
            <span class="bb-item-name">🔧 Professional Assembly</span>
            <span class="bb-item-price">$${buildFee.toFixed(2)}</span>
          </div>
        `;
      }
    }

    const grandTotal = partsTotal + buildFee;

    // Update build list
    const listHtml = Object.entries(selectedParts).map(([category, part]) => {
      const variantText = part.variantTitle !== 'Default Title' ? ` (${part.variantTitle})` : '';
      return `
        <div class="bb-list-item">
          <span class="bb-item-name">${part.title}${variantText}</span>
          <span class="bb-item-price">$${part.price.toFixed(2)}</span>
        </div>
      `;
    }).join('');

    const list = document.getElementById('bb-list');
    list.innerHTML = `
      <div class="bb-list-header">
        <span>Part</span>
        <span>Price</span>
      </div>
      ${listHtml || '<div class="bb-list-empty">Select parts to build your bike</div>'}
      ${buildFeeHtml}
      ${showFreeAssemblyMessage ? '<div class="bb-free-assembly-note" style="font-size: 0.85rem; color: #10b981; font-style: italic; padding: 8px 0; text-align: center;">Order qualifies for free professional assembly!</div>' : ''}
      <div class="bb-list-total">
        <span>TOTAL:</span>
        <span>$${grandTotal.toFixed(2)}</span>
      </div>
    `;

    // Enable/disable add to cart button
    const btn = document.getElementById('bb-add-to-cart');
    btn.disabled = Object.keys(selectedParts).length === 0;
  }

  async function handleAddToCart(selectedParts, buildFeeConfig) {
    const items = Object.values(selectedParts);

    if (items.length === 0) {
      alert('Please select at least one part');
      return;
    }

    // Disable button and show loading state
    const btn = document.getElementById('bb-add-to-cart');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.classList.add('loading');
    btn.textContent = 'Adding to cart...';

    try {
      // Calculate build total
      const buildTotal = items.reduce((sum, item) => sum + item.price, 0);

      // Determine if build fee should be applied
      let shouldAddBuildFee = false;
      let buildFeeMessage = '';

      if (buildFeeConfig && buildFeeConfig.enabled && buildFeeConfig.productId) {
        if (buildFeeConfig.freeThresholdEnabled && buildTotal >= buildFeeConfig.freeThresholdAmount) {
          // Total exceeds threshold, assembly is free!
          shouldAddBuildFee = false;
          buildFeeMessage = `\n\n🎁 FREE Professional Assembly included! (Orders $${buildFeeConfig.freeThresholdAmount}+)`;
        } else {
          // Add build fee
          shouldAddBuildFee = true;
          buildFeeMessage = `\n\n🔧 Professional Assembly: +$${buildFeeConfig.amount.toFixed(2)}`;
        }
      }

      // Prepare items for Shopify Ajax Cart API
      // Ajax Cart API expects variant IDs without the "gid://shopify/ProductVariant/" prefix
      const cartItems = items.map(item => {
        // Extract numeric ID from GraphQL ID (gid://shopify/ProductVariant/123456)
        const numericId = item.variantId.split('/').pop();
        return {
          id: numericId,
          quantity: 1
        };
      });

      // Add build fee product if applicable
      if (shouldAddBuildFee) {
        const buildFeeId = buildFeeConfig.productId.split('/').pop(); // Extract numeric ID
        cartItems.push({
          id: buildFeeId,
          quantity: 1
        });
      }

      // Use Shopify's Ajax Cart API to add all items
      // This works directly on the merchant's store without needing app proxy
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cartItems })
      });

      if (!response.ok) {
        throw new Error('Failed to add items to cart');
      }

      const result = await response.json();
      console.log('Added to cart:', result);

      // Show success notification
      const itemsList = items.map(i => {
        const variantInfo = i.variantTitle !== 'Default Title' ? ` (${i.variantTitle})` : '';
        return `<div class="bb-success-item">✓ ${i.title}${variantInfo}</div>`;
      }).join('');

      showSuccessModal(items.length, itemsList, buildFeeMessage);

    } catch (error) {
      console.error('Error adding to cart:', error);
      showErrorToast('Sorry, there was an error adding items to cart. Please try again.');

      // Re-enable button
      btn.disabled = false;
      btn.classList.remove('loading');
      btn.textContent = originalText;
    }
  }

  function showSuccessModal(itemCount, itemsList, buildFeeMessage) {
    const modal = document.createElement('div');
    modal.className = 'bb-modal-overlay';
    modal.innerHTML = `
      <div class="bb-modal">
        <div class="bb-modal-header">
          <div class="bb-modal-icon">🎉</div>
          <h3>Added to Cart!</h3>
        </div>
        <div class="bb-modal-body">
          <p class="bb-modal-message">Successfully added ${itemCount} part${itemCount > 1 ? 's' : ''} to your cart</p>
          <div class="bb-modal-items">
            ${itemsList}
          </div>
          ${buildFeeMessage ? `<div class="bb-modal-fee">${buildFeeMessage.replace(/\n/g, '').trim()}</div>` : ''}
        </div>
        <div class="bb-modal-actions">
          <button class="bb-modal-btn bb-modal-btn-secondary" onclick="this.closest('.bb-modal-overlay').remove()">
            Continue Shopping
          </button>
          <button class="bb-modal-btn bb-modal-btn-primary" onclick="window.location.href='/cart'">
            View Cart →
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  function showErrorToast(message) {
    const toast = document.createElement('div');
    toast.className = 'bb-toast bb-toast-error';
    toast.innerHTML = `
      <div class="bb-toast-icon">⚠️</div>
      <div class="bb-toast-message">${message}</div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('bb-toast-show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('bb-toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
})();
