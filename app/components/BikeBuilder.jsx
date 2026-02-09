import { useState } from 'react';
import '../styles/bike-builder.css';

export default function BikeBuilder({ parts, settings }) {
  const [selectedParts, setSelectedParts] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const categoryNames = {
    frames: 'Frame',
    forks: 'Forks',
    handlebars: 'Handlebars',
    grips: 'Grips',
    pedals: 'Pedals',
    wheels: 'Wheels',
    seat: 'Seat'
  };

  const handlePartSelect = (category, part) => {
    setSelectedParts(prev => ({
      ...prev,
      [category]: part
    }));
  };

  const calculateTotal = () => {
    return Object.values(selectedParts).reduce((sum, part) => sum + (part?.price || 0), 0);
  };

  const handleAddToCart = async () => {
    const items = Object.values(selectedParts).filter(Boolean);

    if (items.length === 0) {
      alert('Please select at least one part before adding to cart.');
      return;
    }

    setIsAddingToCart(true);

    try {
      // TODO: Implement Shopify Storefront API cart integration
      const variantIds = items.map(item => item.variantId);

      console.log('Adding to cart:', variantIds);

      // For now, show a success message
      alert(`Added ${items.length} parts to cart! (Cart integration coming soon)`);

    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add items to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const header = settings?.theme?.headerText || '🚲 Build Your Dream Bike';
  const tagline = settings?.theme?.tagline || 'Select your parts and create the perfect ride';

  return (
    <div className="bike-builder" style={{
      '--color-primary': settings?.theme?.primaryColor || '#4F46E5'
    }}>
      <header className="bb-header">
        <h1>{header}</h1>
        <p className="bb-tagline">{tagline}</p>
      </header>

      <div className="bb-container">
        <div className="bb-parts-selector">
          <h2>Select Your Parts</h2>

          {Object.entries(parts).map(([category, items]) => (
            <div key={category} className="bb-category">
              <h3>{categoryNames[category]}</h3>
              <div className="bb-parts-grid">
                {items.map(part => (
                  <div
                    key={part.id}
                    className={`bb-part-card ${selectedParts[category]?.id === part.id ? 'selected' : ''}`}
                    onClick={() => handlePartSelect(category, part)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handlePartSelect(category, part);
                      }
                    }}
                  >
                    {part.image && (
                      <img src={part.image} alt={part.title} />
                    )}
                    <div className="bb-part-info">
                      <div className="bb-part-name">{part.title}</div>
                      <div className="bb-part-price">${part.price.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bb-build-list">
          <h2>Your Build</h2>
          <div className="bb-list-paper">
            <div className="bb-list-header">
              <span>Part</span>
              <span>Price</span>
            </div>

            {Object.entries(selectedParts).map(([category, part]) => (
              part && (
                <div key={category} className="bb-list-item">
                  <span className="bb-item-name">{part.title}</span>
                  <span className="bb-item-price">${part.price.toFixed(2)}</span>
                </div>
              )
            ))}

            {Object.keys(selectedParts).length === 0 && (
              <div className="bb-list-empty">
                Select parts above to build your bike
              </div>
            )}

            <div className="bb-list-total">
              <span>TOTAL:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="bb-btn-primary"
            disabled={Object.keys(selectedParts).length === 0 || isAddingToCart}
          >
            {isAddingToCart ? '⏳ Adding to Cart...' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
