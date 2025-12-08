import { ProductDisplayContext } from '../utils/productDisplayStrategy';

const displayContext = new ProductDisplayContext();

export default function ProductCard({ product, onAddToCart }) {
    const displayData = displayContext.renderProduct(product);

    return (
        <div className="product-card" style={displayData.style}>
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            
            <div className="product-info">
                <span className="price">{displayData.priceText}</span>
                <span className={`status-tag status-${displayData.statusTag.toLowerCase().replace(' ', '-')}`}>
                    {displayData.statusTag}
                </span>
            </div>

            <button 
                onClick={() => onAddToCart(product)} 
                disabled={displayData.buttonDisabled}
            >
                {displayData.buttonDisabled ? 'Ver Indisponível' : 'Adicionar'}
            </button>
        </div>
    );
}