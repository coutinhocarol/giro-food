class DefaultDisplayStrategy {
    render(product) {
        return {
            priceText: `R$ ${product.price.toFixed(2)}`,
            statusTag: product.isAvailable ? 'Disponível' : 'Indisponível',
            style: product.isAvailable ? { opacity: 1 } : { opacity: 0.5, textDecoration: 'line-through' },
            buttonDisabled: !product.isAvailable
        };
    }
}

class NotAvailableStrategy {
    render(product) {
        return {
            priceText: `R$ ${product.price.toFixed(2)}`,
            statusTag: 'ESGOTADO',
            style: { opacity: 0.4, textDecoration: 'line-through', cursor: 'not-allowed' },
            buttonDisabled: true
        };
    }
}

export class ProductDisplayContext {
    constructor() {
        this.defaultStrategy = new DefaultDisplayStrategy();
        this.notAvailableStrategy = new NotAvailableStrategy();
    }

    getStrategy(product) {
        if (product.isAvailable === false) {
            return this.notAvailableStrategy;
        }
        
        return this.defaultStrategy;
    }

    renderProduct(product) {
        const strategy = this.getStrategy(product);
        return strategy.render(product);
    }
}