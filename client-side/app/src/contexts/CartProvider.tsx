import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";
import { ProductProperty } from "../interfaces/Product";

const InitialState: ProductProperty[] = [];

type Action = {
  type:
    | "SET_PRODUCT_CART"
    | "DELETE_PRODUCT_CART"
    | "ADD_TO_CART"
    | "INC_QU"
    | "DEC_QU"
    | "CLEAN_CART";
  payload: ProductProperty;
  paylaod2: ProductProperty[];
};

type CartContextType = {
  cart: ProductProperty[];
  dispatch: Dispatch<Action>;
  calculateTotals: (discount: number) => { total: number; subTotal: number };
};

const CartContext = createContext<CartContextType>({
  cart: InitialState,
  dispatch: () => {},
  calculateTotals: (discount) => ({ total: 0, subTotal: 0 }),
});

function CartReducer(
  state: ProductProperty[],
  action: Action
): ProductProperty[] {
  switch (action.type) {
    case "SET_PRODUCT_CART":
      return [...action.paylaod2];

    case "ADD_TO_CART": {
      const productIndex = state.findIndex(
        (product) => product._id === action.payload._id
      );

      if (productIndex === -1) {
        return [...state, { ...action.payload, quantity: 1 }];
      }
      return state.map((product, index) =>
        index === productIndex
          ? { ...product, quantity: product.quantity + 1 }
          : product
      );
    }

    case "DELETE_PRODUCT_CART": {
      const deleteProduct = state.filter(
        (product) => product._id !== action.payload._id
      );
      return deleteProduct;
    }
    case "INC_QU": {
      return state.map((product) =>
        product._id === action.payload._id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      );
    }

    case "DEC_QU": {
      return state.map((product) =>
        product._id === action.payload._id
          ? { ...product, quantity: product.quantity - 1 }
          : product
      );
    }
    case "CLEAN_CART": {
      return [];
    }
    default:
      return state;
  }
}

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, dispatch] = useReducer(CartReducer, InitialState);

  const calculateTotals = (
    discount: number
  ): {
    total: number;
    subTotal: number;
  } => {
    const subTotal: number = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    let total: number = subTotal;
    let discountAmount = 0;

    if (discount) {
      discountAmount = total * (discount / 100);
      total = total - discountAmount;
    }

    return { total, subTotal };
  };

  return (
    <CartContext.Provider value={{ cart, dispatch, calculateTotals }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};

export default CartProvider;
