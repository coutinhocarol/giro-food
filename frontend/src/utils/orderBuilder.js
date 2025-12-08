export class OrderBuilder {
    constructor(restaurantId) {
        if (!restaurantId) throw new Error("O Pedido deve estar associado a um Restaurante.");
        this.order = {
            restaurantId: restaurantId,
            items: [],
            deliveryAddress: null,
            paymentMethod: null,
            totalAmount: 0 
        };
    }

    addItem(productId, quantity, price) {
        if (quantity > 0) {
            this.order.items.push({ productId, quantity, price });
            this.order.totalAmount += price * quantity;
        }
        return this; 
    }

    setAddress(address) {
        if (typeof address !== 'string' || address.trim() === '') throw new Error("Endereço de entrega é obrigatório.");
        this.order.deliveryAddress = address;
        return this;
    }

    setPayment(method) {
        if (!['Cartão de Crédito', 'Pix', 'Dinheiro'].includes(method)) throw new Error("Método de pagamento inválido.");
        this.order.paymentMethod = method;
        return this;
    }

    build() {
        if (this.order.items.length === 0 || !this.order.deliveryAddress || !this.order.paymentMethod) {
            throw new Error("O pedido está incompleto. Faltam itens, endereço ou pagamento.");
        }
        return this.order;
    }
}