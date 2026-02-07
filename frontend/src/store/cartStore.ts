import { create } from 'zustand';

export interface CartItem {
    product: string;
    name: string;
    image: string;
    price: number;
    countInStock: number;
    qty: number;
}

interface CartState {
    cartItems: CartItem[];
    shippingAddress: any;
    paymentMethod: string;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    saveShippingAddress: (address: any) => void;
    savePaymentMethod: (method: string) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
    cartItems: [],
    shippingAddress: {},
    paymentMethod: 'PayPal',
    addToCart: (item) => {
        const { cartItems } = get();
        const existItem = cartItems.find((x) => x.product === item.product);

        if (existItem) {
            set({
                cartItems: cartItems.map((x) =>
                    x.product === existItem.product ? item : x
                ),
            });
        } else {
            set({ cartItems: [...cartItems, item] });
        }
    },
    removeFromCart: (id) => {
        set({ cartItems: get().cartItems.filter((x) => x.product !== id) });
    },
    saveShippingAddress: (address) => set({ shippingAddress: address }),
    savePaymentMethod: (method) => set({ paymentMethod: method }),
    clearCart: () => set({ cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' }),
}));
