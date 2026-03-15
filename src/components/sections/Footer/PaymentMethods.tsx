// next
import Image from 'next/image';

// data
import paymentMethods from '@/data/payment-methods.json';

const PaymentMethods = () => {
  return (
    <div className="flex items-center gap-3">
      {paymentMethods.map((paymentMethod, i) => (
        <Image
          src={paymentMethod.image}
          alt={paymentMethod.title}
          width="44"
          height="30"
          key={i}
          className="opacity-50 grayscale"
        />
      ))}
    </div>
  );
};

export default PaymentMethods;
