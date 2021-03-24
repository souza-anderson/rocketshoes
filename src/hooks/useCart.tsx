import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {  
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });
  
 
  const addProduct = async (productId: number) => {
    try {
      
      const productCart = cart.find(product => productId === product.id);

      if (productCart) {
        const stockResponse = await api.get<Stock>(`http://localhost:3333/stock/${productId}`);
        const productStock = stockResponse.data;
          if (productCart.amount < productStock.amount) {  
            const product = {
              ...productCart,
              amount: productCart.amount += 1,
            }

            const updatedCart = cart.filter(productCart => productCart.id !== productId);

            localStorage.setItem('@RocketShoes:cart',JSON.stringify([...updatedCart, product]));
            setCart([...updatedCart, product]);
          } else {
            toast.error('Quantidade solicitada fora de estoque');
          }
      } else {
        const productResponse = await api.get<Product>(`http://localhost:3333/products/${productId}`);
        const product = {
          ...productResponse.data,
          amount: 1
        }

        localStorage.setItem('@RocketShoes:cart',JSON.stringify([...cart, product]));
        setCart([...cart, product]);
      }  
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
