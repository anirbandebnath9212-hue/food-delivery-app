import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (food, restaurant) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.food._id === food._id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.food._id === food._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          food,
          restaurant,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (foodId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.food._id === foodId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (foodId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.food._id === foodId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (foodId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.food._id !== foodId
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + item.food.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}