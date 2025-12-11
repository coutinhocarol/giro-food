import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function OrderCreation() {
  const { cart, restaurantId, total, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cartão de Crédito');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [orderSuccessId, setOrderSuccessId] = useState(null);
  const navigate = useNavigate();

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!restaurantId || cart.length === 0) {
      setMessage('❌ Seu carrinho está vazio.');
      return;
    }

    setIsProcessing(true);
    setMessage('Processando pedido e pagamento...');

    try {
      const builder = new OrderBuilder(restaurantId);
      cart.forEach(item => {
        builder.addItem(item.id, item.quantity, item.price);
      });

      const orderPayload = builder
        .setAddress(address)
        .setPayment(paymentMethod)
        .build();

      const result = await createOrder(orderPayload);
      setOrderSuccessId(result.id);
      setMessage('✅ Pedido criado com sucesso!');
      clearCart();
      // se quiser, redireciona pro tracking
      // navigate(`/tracking/${result.id}`);
    } catch (error) {
      console.error(error);
      setMessage('❌ Não foi possível criar o pedido. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };
}
