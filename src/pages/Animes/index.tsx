import { Text, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { Box, Flex, Img, VStack } from "@chakra-ui/react";
import { useAnime } from "../../Providers/AnimesProvider";
import { Button } from "../../components/Button";
import { Comments } from "../../components/Comments";
import { Header } from "../../components/Header";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { api } from "../../services/api";
import { useUser } from "../../Providers/UserProvider";
import { ModalScore } from "../../components/Modals/ModalScore";
import { categories } from "../../Utils";
import { ModalMyListStatus } from "../../components/Modals/ModalStatus";

export const AnimePage = () => {
  const [scoreResult, setScoreResult] = useState<number>(0);

  const { selectedAnime, getAnimeById, setSearched, searchAnime, getAnimes } =
    useAnime();

  const history = useHistory();

  const { id } = useParams<{ id: string }>();

  const { user, accessToken } = useUser();

  const tokenBearer = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const addToMyList = async (query: string) => {
    let animeData = {
      animeId: selectedAnime.id,
      title: selectedAnime.title,
      category: selectedAnime.category,
      banner_url: selectedAnime.category,
      image_url: selectedAnime.image_url,
      launch_date: selectedAnime.launch_date,
      original: selectedAnime.original,
      rate: selectedAnime.rate,
      status: selectedAnime.status,
      studio: selectedAnime.status,
      synopsis: selectedAnime.synopsis,
      userId: user.id,
      myListStatus: query,
    };

    await api.post("mylist", animeData, tokenBearer);
  };

  const patchMyList = async (AnimeId: Number, query: string) => {
    await api.patch(`mylist/${AnimeId}`, { myListStatus: query }, tokenBearer);
  };

  const handlePatchMyList = async (query: string) => {
    const response = await api.get(`/users/${user.id}/myList`, tokenBearer);
    const data = response.data;

    const isInMyList = data.some(
      (item: { animeId: Number }) => item.animeId === selectedAnime.id
    );

    if (!isInMyList) {
      addToMyList(query);
    } else {
      const animeInMyList = data.filter(
        (item: { animeId: Number }) => item.animeId === selectedAnime.id
      );
      const IdInFiltered = animeInMyList[0].id;
      patchMyList(IdInFiltered, query);
    }
    OnOpenModalInfo();
  };

  const calcScore = async () => {
    const res = await api.get(`/animes?id=${id}`, tokenBearer);

    const currentAnime = res.data[0];

    if (!!currentAnime.rate[0]) {
      const output =
        currentAnime.rate.reduce(
          (acc: number, curr: { value: number }) => acc + curr.value,
          0
        ) / currentAnime.rate.length;

      setScoreResult(output);
    } else {
      setScoreResult(1);
    }
  };

  const searchCategories = (search: string) => {
    setSearched(search);
    searchAnime(search);
    history.push(`/search/${search}`);
  };

  useEffect(() => {
    getAnimeById(Number(id));
    calcScore();
    setSearched("");
    getAnimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const {
    isOpen: isOpenModalScore,
    onOpen: OnOpenModalScore,
    onClose: onCloseModalScore,
  } = useDisclosure();

  const {
    isOpen: isOpenModalInfo,
    onOpen: OnOpenModalInfo,
    onClose: onCloseModalInfo,
  } = useDisclosure();

  return (
    <Box width="100%" minH="100vh">
      <Header />

      {selectedAnime.category && (
        <>
          <ModalScore
            calcScore={calcScore}
            isOpen={isOpenModalScore}
            onClose={onCloseModalScore}
            selectedAnime={selectedAnime}
          />
          <ModalMyListStatus
            isOpen={isOpenModalInfo}
            onClose={onCloseModalInfo}
          />
          <Box
            background={`linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)),url(${selectedAnime.banner_url})`}
            backgroundSize="cover"
            backgroundPosition="center"
            height="330px"
            width="100%"
          />
          <Flex
            flexDirection="column"
            alignItems={["center", "center", "center", "start"]}
            marginTop={["-150px", "-150px", "-150px", "0px"]}
            marginLeft={["0px", "0px", "0px", "280px"]}
          >
            <VStack
              direction="column"
              top="120px"
              left="20px"
              position={["static", "static", "static", "fixed"]}
            >
              <Img
                h="300px"
                w="230px"
                borderRadius="3px"
                src={selectedAnime.image_url}
              />

              {isWideVersion && (
                <VStack w="230px">
                  <Button
                    w="inherit"
                    model="1"
                    onClick={() => handlePatchMyList("Assistindo")}
                  >
                    Assitindo
                  </Button>
                  <Button
                    w="inherit"
                    model="2"
                    onClick={() => handlePatchMyList("Quero assitir")}
                  >
                    Quero Assistir
                  </Button>
                  <Button
                    w="inherit"
                    model="3"
                    onClick={() => handlePatchMyList("Terminei")}
                  >
                    Terminei...):
                  </Button>
                  <Button
                    w="inherit"
                    model="4"
                    onClick={() => OnOpenModalScore()}
                  >
                    Avaliar
                  </Button>
                </VStack>
              )}
            </VStack>
            <Text
              fontWeight="600"
              fontSize="30px"
              marginY="10px"
              textAlign="center"
            >
              {selectedAnime.title}
            </Text>
            <Flex
              flexFlow={["row wrap", "row wrap", "row wrap", "row-reverse"]}
              justifyContent="space-around"
              alignItems="baseline"
              width={["80%", "80%", "80%", "auto"]}
            >
              <Box
                p="1"
                width={["100%", "100%", "100%", "180px"]}
                display="inline-flex"
                justifyContent="center"
                alignItems="end"
              >
                <Text
                  border="solid 2px"
                  borderRadius="10px"
                  borderColor="secondary"
                  bgColor="#F6ECE1"
                  color="#8A5018"
                  fontSize="20px"
                  fontWeight="bold"
                  textAlign="center"
                  lineHeight="40px"
                  width="120px"
                  mb="10px"
                  textShadow="1px 1px #d6883f"
                >
                  Score: {scoreResult.toFixed(2)}
                </Text>
              </Box>

              <Box
                width="100%"
                display="inline-flex"
                justifyContent="space-around"
                flexWrap="wrap"
                fontWeight="semibold"
                textShadow="0.5px 0.5px grey"
              >
                {selectedAnime.category.map((category, key) => {
                  return (
                    <Box
                      key={key}
                      border="solid 2px"
                      borderColor="secondary"
                      color="secondary"
                      borderRadius="10px"
                      bgColor="#F6ECE1"
                      width="120px"
                      textAlign="center"
                      marginTop="10px"
                      paddingY="3px"
                      boxShadow="base"
                      onClick={() => searchCategories(category)}
                    >
                      <p>{category}</p>
                    </Box>
                  );
                })}
              </Box>
            </Flex>
          </Flex>
          <Flex flexDirection={["column", "column", "column", "row"]}>
            <Text
              marginTop="10px"
              textAlign="justify"
              paddingX="20px"
              marginLeft={["0px", "0px", "0px", "260px"]}
            >
              Sobre Anime: {selectedAnime.synopsis}
            </Text>
            <VStack
              border="2px solid"
              borderColor="secondary"
              alignItems="center"
              paddingY="20px"
              borderRadius="10px"
              bgColor="gold.light50"
              maxWidth={["100%", "100%", "100%", "280px"]}
              minW="280px"
              alignSelf="end"
              marginX="20px"
              marginTop="20px"
            >
              <Text
                textAlign="center"
                fontWeight="bold"
                fontSize="25px"
                color="primary"
                textShadow="0.5px 0.5px black"
              >
                Categorias
              </Text>
              <Flex
                flexFlow="row wrap"
                justifyContent={[
                  "center",
                  "space-around",
                  "space-around",
                  "center",
                ]}
                alignItems={["center", "center", "center", "center"]}
                gap="20px"
                mt="30px"
                paddingInline="10px"
              >
                {categories.map((categories, key) => (
                  <Box
                    key={key}
                    border="2px solid"
                    borderColor="secondary"
                    bgColor="#F6ECE1"
                    color="#8A5018"
                    textAlign="center"
                    borderRadius="10px"
                    padding="5px"
                    _hover={{ cursor: "pointer" }}
                    minW="100px"
                    onClick={() => searchCategories(categories)}
                  >
                    {categories}
                  </Box>
                ))}
              </Flex>
            </VStack>
            <Flex
              w="100%"
              display={["flex", "flex", "flex", "none"]}
              alignSelf="center"
              alignItems="center"
              justifyContent="space-around"
              flexFlow="row wrap"
              marginY="20px"
              paddingX="10px"
              gap="20px"
            >
              <Button
                minW="150px"
                h="40px"
                model="1"
                onClick={() => handlePatchMyList("Assistindo")}
              >
                Assitindo
              </Button>
              <Button
                minW="150px"
                h="40px"
                model="2"
                onClick={() => handlePatchMyList("Quero assitir")}
              >
                Quero Assistir
              </Button>
              <Button
                minW="150px"
                h="40px"
                model="3"
                onClick={() => handlePatchMyList("Terminei")}
              >
                Terminei...):
              </Button>
              <Button
                minW="150px"
                h="40px"
                model="4"
                onClick={() => OnOpenModalScore()}
              >
                Avaliar
              </Button>
            </Flex>
          </Flex>
        </>
      )}
      <Comments />
    </Box>
  );
};
