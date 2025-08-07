import React, { useState } from 'react';
import axios from 'axios';

const CouponForm = () => {
    const [modelPrice,setModelPrice]=useState(499)
  const [coupon, setCoupon] = useState('');
  const [finalPrice, setFinalPrice] = useState(modelPrice);
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState('');

  const applyCoupon = async () => {
    try {
      const response = await axios.post('https://api.moviemads.com/api/apply-coupon', {
        code: coupon,
        originalPrice: modelPrice,
      });

      if (response.data.valid) {
        setDiscount(response.data.discount);
        setFinalPrice(response.data.finalPrice);
        setMessage(`Coupon applied! ₹${response.data.discount} off`);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Invalid coupon');
      setDiscount(0);
      setFinalPrice(modelPrice);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      <h3 className="text-lg font-semibold mb-2">Apply Coupon</h3>
      <input
        type="text"
        className="border p-2 rounded w-full mb-2"
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
        placeholder="Enter coupon code"
      />
      <button onClick={applyCoupon} className="bg-blue-500 text-white px-4 py-2 rounded">
        Apply
      </button>
      {message && <p className="mt-2 text-sm text-green-700">{message}</p>}
      <p className="mt-2 text-lg">Final Price: ₹{finalPrice}</p>
    </div>
  );
};

export default CouponForm;
