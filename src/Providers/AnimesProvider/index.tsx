import { createContext, ReactNode, useContext, useState } from "react";
import { api } from "../../services/api";
import { useUser } from "../UserProvider";

interface Children {
  children: ReactNode;
}
interface AnimesData {
  id: number;
  title: string;
  category: Array<string>;
  rate?: Array<string>;
  banner_url: string;
  image_url: string;
  original: string;
  status: string;
  launch_date: string;
  studio: string;
  synopsis: string;
  userId?: number;
  data?: object;
}
interface AnimeProviderData {
  animes: AnimesData[];
  myList: AnimesData[] | object;
  shounenAnimes: AnimesData[];
  selectedAnime: AnimesData;

  getAnimeById: (id: number) => void;
  getAnimes: () => void;
  getMyList: (userId: number) => void;
  deleteMyList: (userId: number) => void;
  addAnimeList: (data: AnimesData) => void;
}

const AnimeContext = createContext<AnimeProviderData>({} as AnimeProviderData);

const AnimeProvider = ({ children }: Children) => {
  const { user, accessToken } = useUser();

  const [animes, setAnimes] = useState<AnimesData[]>([]);
  const [shounenAnimes, setShounenAnimes] = useState<AnimesData[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<AnimesData>(
    {} as AnimesData
  );
  const [myList, setMyList] = useState<AnimesData[]>([]);

  const getAnimes = async () => {
    const response = await api.get("/animes");

    const data = response.data;
    const shounen = data.filter(({ category }: AnimesData) => {
      return category?.includes("Shounen");
    });

    setShounenAnimes(
      shounen.sort((current: AnimesData, next: AnimesData) => {
        return current.title.localeCompare(next.title);
      })
    );
    setAnimes(data);
  };

  const getAnimeById = async (id: number) => {
    const response = await api.get(`/animes?id=${id}`);

    const data = response.data;
    console.log(data);
    setSelectedAnime(data[0]);
  };

  const addAnimeList = async (data: AnimesData) => {
    const postData = { ...data, userId: user.id };

    console.log(postData);
    const response = await api.post("/mylist", postData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response.data);
  };

  const getMyList = async (userId: number) => {
    const response = await api.get(`/users/${userId}/mylist`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response.data);
    setMyList(response.data);
  };

  const deleteMyList = async (userId: number) => {
    const response = await api.delete(`/mylist/${userId} `, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    setMyList(response.data);
  };

  return (
    <AnimeContext.Provider
      value={{
        getAnimes,
        getAnimeById,
        addAnimeList,
        getMyList,
        deleteMyList,
        animes,
        shounenAnimes,
        selectedAnime,
        myList,
      }}
    >
      {children}
    </AnimeContext.Provider>
  );
};

const useAnime = () => useContext(AnimeContext);

export { AnimeProvider, useAnime };
