import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import UserItem from "../components/UserItem";
import { useEffect, useState } from "react";
import { myAxios } from "../Api/myAxios";
import { useRecoilState, useRecoilValue } from "recoil";
import conversationAtom from "../atoms/conversationsAtom";
import { useSocket } from "../context/SocketContext";
import userAtom from "../atoms/userAtom";
import { Helmet } from "react-helmet";

export default function ChatPage() {
  let [conversations, setConversations] = useRecoilState(conversationAtom);
  let [loadingConversations, setLoadingConversations] = useState(true);
  let [search, setSearch] = useState(false);
  let [searchingUsers, setSearchingUsers] = useState(false);
  let [loading, setLoading] = useState(false);
  let [input, setInput] = useState("");
  let { onlineUsers } = useSocket();
  let user = useRecoilValue(userAtom);
  let { socket } = useSocket();
  useEffect(() => {
    myAxios
      .get("message")
      .then(({ data }) => {
        setConversations(data.conversations);
      })
      .catch(() => {
        setConversations(false);
      })
      .finally(() => setLoadingConversations(false));
  }, []);

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversations((prevConvers) => {
        let updatedConversations = prevConvers?.map((conver) => {
          if (conver._id === conversationId) {
            return {
              ...conver,
              lastMessage: {
                ...conver.lastMessage,
                seen: true,
              },
            };
          }
          return conver;
        });
        return updatedConversations;
      });
    });
  }, [socket]);

  async function searchConversations(e) {
    let value = e.target.value;
    if (value === "") {
      setLoading(false);
      setSearch(false);
      return setSearchingUsers(false);
    }
    setSearch(true);
    setLoading(true);
    try {
      let {
        data: { users },
      } = await myAxios.get("search/" + value);
      setSearchingUsers(users);
    } catch (error) {
      setSearchingUsers(false);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Container
      pos={"absolute"}
      left={"50%"}
      transform={"translateX(-50%)"}
      maxW={"750px"}
      pb={5}
    >
      <Helmet>
        <title>Chat Page</title>
      </Helmet>
      <Flex gap={4} flexDir={{ base: "column", md: "row" }}>
        <VStack
          flex={30}
          p={2}
          borderRadius={"xl"}
          border={"1px solid"}
          borderColor={"gray.light"}
          shadow={"sm"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your Conversations
          </Text>

          <InputGroup>
            <Input
              placeholder="search here..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                searchConversations(e);
              }}
            />
            <InputLeftElement>
              <SearchIcon />
            </InputLeftElement>
          </InputGroup>

          {loadingConversations || loading
            ? Array(4)
                .fill(0)
                .map((_, index) => (
                  <HStack w={"full"} key={index} p={1} borderRadius={"md"}>
                    <Box>
                      <SkeletonCircle size={10} />
                    </Box>
                    <VStack align={"start"} flex={1}>
                      <Skeleton h={"10px"} w={"80px"} />
                      <Skeleton h={"8px"} w={"90%"} />
                    </VStack>
                  </HStack>
                ))
            : null}

          {!loadingConversations && !search ? (
            conversations ? (
              conversations.map((item, index) => (
                <Conversation
                  key={index}
                  conversation={item}
                  isOnline={onlineUsers.includes(
                    String(
                      item.participants.filter((i) => {
                        return i != user.id;
                      })[0]
                    )
                  )}
                />
              ))
            ) : (
              <Text>No Conversations yet</Text>
            )
          ) : null}

          {!loading && search ? (
            searchingUsers ? (
              searchingUsers.map((item, index) => (
                <UserItem
                  key={index}
                  user={item}
                  setInput={setInput}
                  setSearch={setSearch}
                  isOnline={onlineUsers.includes(String(item.id))}
                />
              ))
            ) : (
              <Text>No search user</Text>
            )
          ) : null}
        </VStack>
        <MessageContainer />
      </Flex>
    </Container>
  );
}
