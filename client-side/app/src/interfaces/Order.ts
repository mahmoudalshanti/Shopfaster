import { UserProperty } from "./User";
import { ProductProperty } from "./Product";
export interface OrderProperty {
  _id: string;
  user: UserProperty;
  track: string;
  status: string;
  totalAmount: number;
  products: ProductProperty[];
}
