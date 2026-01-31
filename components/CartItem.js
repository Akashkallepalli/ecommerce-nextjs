import { useState } from 'react';

export default function CartItem({ item, onRemove, onUpdateQuantity }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    await onUpdateQuantity(item.productId, newQuantity);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    await onRemove(item.productId);
    setIsUpdating(false);
  };

  return (
    <div data-testid={`cart-item-${item.productId}`} className="p-6 flex gap-6">
      {/* Product Image */}
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
        <p className="text-gray-600 text-sm mt-1">${item.product.price.toFixed(2)} each</p>
      </div>

      {/* Quantity & Remove */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
            className="px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
          >
            -
          </button>
          <input
            data-testid={`quantity-input-${item.productId}`}
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
            disabled={isUpdating}
            className="w-12 text-center border border-gray-300 rounded px-2 py-1"
          />
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isUpdating}
            className="px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
          >
            +
          </button>
        </div>

        <button
          data-testid={`remove-item-button-${item.productId}`}
          onClick={handleRemove}
          disabled={isUpdating}
          className="text-red-600 hover:text-red-800 font-semibold disabled:opacity-50"
        >
          Remove
        </button>

        <span className="font-bold text-gray-900 w-24 text-right">
          ${(item.product.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
