import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";

import { UserProperty } from "../interfaces/User";

const InitialState: UserProperty = {
  name: "",
  email: "",
  _id: "",
  role: "",
};

type Action = {
  type: "SET_USER";
  payload: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
};

type userContextType = {
  user: UserProperty;
  dispatch: Dispatch<Action>;
};
const userContext = createContext<userContextType>({
  user: InitialState,
  dispatch: () => {},
});

function userReducer(user: UserProperty, action: Action): UserProperty {
  switch (action.type) {
    case "SET_USER": {
      return { ...action.payload };
    }

    default:
      return user;
  }
}

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, dispatch] = useReducer(userReducer, InitialState);

  return (
    <userContext.Provider value={{ user, dispatch }}>
      {children}
    </userContext.Provider>
  );
};

export const useUser = () => {
  return useContext(userContext);
};
export default UserProvider;
