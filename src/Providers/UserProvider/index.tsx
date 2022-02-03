import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";
import { StringMappingType } from "typescript";

import { api } from "../../services/api";

interface UserProviderProps {
  children: ReactNode;
}

interface User {
  email: string;
  id: number;
  name: string;
  userImg: string;
}

interface SighInCredentials {
  email: string;
  password: string;
}

interface SigNupCredentials {
  email: string;
  password: string;
  name: string;
  userImg: string;
}

interface EditUserCredentials {
  name: string;
}

interface UserContextData {
  user: User;
  accessToken: string;
  signOut: () => void;
  signIn: (credentials: SighInCredentials) => Promise<void>;
  sigNup: (credentials: SigNupCredentials) => Promise<void>;
  EditUser: (credentials: EditUserCredentials) => Promise<void>;
}

interface UserState {
  accessToken: string;
  user: User;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

const useUser = () => useContext(UserContext);

const UserProvider = ({ children }: UserProviderProps) => {
  const [data, setData] = useState<UserState>(() => {
    const accessToken = localStorage.getItem("@re:viewers:acessToken");
    const user = localStorage.getItem("@re:viewers:user");

    if (accessToken && user) {
      return { accessToken, user: JSON.parse(user) };
    }
    return {} as UserState;
  });

  const signIn = useCallback(async ({ email, password }: SighInCredentials) => {
    const response = await api.post("/login", { email, password });

    const { accessToken, user } = response.data;

    localStorage.setItem("@re:viewers:acessToken", accessToken);
    localStorage.setItem("@re:viewers:user", JSON.stringify(user));

    setData({ accessToken, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.clear();

    setData({} as UserState);
  }, []);

  const sigNup = useCallback(
    async ({ name, email, password, userImg }: SigNupCredentials) => {
      await api
        .post("/register", {
          name,
          email,
          password,
          userImg,
        })
        .catch((err) => console.log(err));
    },
    []
  );

  const EditUser = useCallback(async ({ name }: EditUserCredentials) => {
    const userId = data.user.id;
    const accessToken = data.accessToken;
    await api.patch(
      `/users/${userId}`,
      { name },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  }, []);
  return (
    <UserContext.Provider
      value={{
        accessToken: data.accessToken,
        user: data.user,
        sigNup,
        signIn,
        signOut,
        EditUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, useUser };
