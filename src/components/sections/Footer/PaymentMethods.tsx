// next
import Image from 'next/image';

// data
import paymentMethods from '@/data/payment-methods.json';

const PaymentMethods = () => {
  return (
    <div className="flex flex-col items-start gap-2">
      <p className="font-cairo text-[15px] font-semibold text-veryDarkPurple">الدفع عند الاستلام</p>
      <div className="flex items-center gap-2">
        {paymentMethods.map((paymentMethod, i) => (
          <Image
            src={paymentMethod.image}
            alt={paymentMethod.title}
            width="66"
            height="49"
            key={i}
          />
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
