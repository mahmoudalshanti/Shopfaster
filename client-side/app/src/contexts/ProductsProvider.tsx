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
  type: "SET_PRODUCT" | "SET_IS_FEATURED" | "DELETE_PRODUCT" | "CREATE_PRODUCT";
  payload: ProductProperty;
  paylaod2: ProductProperty[];
};

type ProductsContextType = {
  products: ProductProperty[];
  dispatch: Dispatch<Action>;
};

const ProductsContext = createContext<ProductsContextType>({
  products: InitialState,
  dispatch: () => {},
});

function productsReducer(
  state: ProductProperty[],
  action: Action
): ProductProperty[] {
  switch (action.type) {
    case "SET_PRODUCT":
      return [...action.paylaod2];

    case "SET_IS_FEATURED": {
      const setFeatured = state.map((product) =>
        product._id === action.payload._id
          ? { ...product, isFeatured: !product.isFeatured }
          : product
      );
      return setFeatured;
    }

    case "DELETE_PRODUCT": {
      const deleteProduct = state.filter(
        (product) => product._id !== action.payload._id
      );
      return deleteProduct;
    }
    case "CREATE_PRODUCT": {
      const createProduct = [...state, action.payload];
      return createProduct;
    }
    default:
      return state;
  }
}

const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, dispatch] = useReducer(productsReducer, InitialState);

  return (
    <ProductsContext.Provider value={{ products, dispatch }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  return useContext(ProductsContext);
};

export default ProductsProvider;
