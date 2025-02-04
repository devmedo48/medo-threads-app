import {
  Avatar,
  AvatarBadge,
  Flex,
  Grid,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { GiConversation } from "react-icons/gi";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect, useRef, useState } from "react";
import { myAxios } from "../Api/myAxios";
import userAtom from "../atoms/userAtom";
import chatAtom from "../atoms/chatAtom";
import { useSocket } from "../context/SocketContext";
import conversationAtom from "../atoms/conversationsAtom";
import { PulseLoader } from "react-spinners";
import messageSound from "../assets/sound.wav";

export default function MessageContainer() {
  let setConversations = useSetRecoilState(conversationAtom);
  let user = useRecoilValue(userAtom);
  let chat = useRecoilValue(chatAtom),
    { conversation } = useRecoilValue(chatAtom);
  let [messages, setMessages] = useState("");
  let [loadingMessages, setLoadingMessages] = useState(true);
  let { onlineUsers } = useSocket();
  let { socket } = useSocket();
  let typingRef = useRef("");
  let [typing, setTyping] = useState(false);

  useEffect(() => {
    socket?.on("newMessage", (message) => {
      let sound = new Audio(messageSound);
      sound.play();
      if (conversation && conversation._id === message.conversationId) {
        setMessages((prevMessages) => [message, ...prevMessages]);
      }
      setConversations((prevConvers) => {
        let updatedConversations = prevConvers.map((conver) => {
          if (conver._id === message.conversationId) {
            return {
              ...conver,
              lastMessage: {
                text: message.text || "image...",
                sender: message.sender,
              },
            };
          }
          return conver;
        });
        return updatedConversations;
      });
    });
    return () => socket?.off("newMessage");
  }, [socket, conversation, setConversations]);

  useEffect(() => {
    setLoadingMessages(true);
    if (chat) {
      myAxios
        .get("message/" + chat.messenger.id)
        .then(({ data }) => {
          setMessages(data.messages);
        })
        .catch(() => {
          setMessages(false);
        })
        .finally(() => setLoadingMessages(false));
    }
  }, [chat]);

  useEffect(() => {
    socket?.on("hideTyping", ({ conversationId }) => {
      if (conversationId === conversation?._id) {
        setTyping(false);
      }
    });

    socket?.on("showTyping", ({ conversationId }) => {
      if (conversationId === conversation?._id) {
        setTyping(true);
        if (typingRef.current)
          typingRef.current?.scrollIntoView({ behavior: "smooth" });
      } else setTyping(false);
    });
  }, [socket, conversation, typing]);

  useEffect(() => {
    const isLastMessageFromOtherUser =
      messages.length && messages[0].sender !== user.id;
    if (isLastMessageFromOtherUser) {
      socket?.emit("markLastMessageAsSeen", {
        conversationId: conversation._id,
        userId: chat.messenger.id,
      });
    }
    socket?.on("messagesSeen", ({ conversationId }) => {
      if (conversation?._id === conversationId) {
        if (messages) {
          setMessages((prevMessages) => {
            let updatedMessages = prevMessages.map((message) => {
              if (!message.seen) {
                return {
                  ...message,
                  seen: true,
                };
              }
              return message;
            });
            return updatedMessages;
          });
        }
      }
    });
  }, [chat, conversation, messages, socket, user]);

  let bg = useColorModeValue("gray.100", "gray.dark");
  return !chat ? (
    <Grid h={"400px"} placeContent={"center"} flex={70}>
      <VStack>
        <GiConversation size={100} />
        <Text>Select a conversation to start messaging </Text>
      </VStack>
    </Grid>
  ) : (
    <Flex
      flex={70}
      bg={bg}
      border={"1px solid"}
      borderColor={"gray.light"}
      borderRadius={"md"}
      flexDir={"column"}
      p={2}
    >
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar
          src={chat.messenger.profilePic}
          name={chat.messenger.name}
          size={"sm"}
        >
          {onlineUsers.includes(String(chat.messenger.id)) && (
            <AvatarBadge boxSize={".85em"} bg={"green.500"} />
          )}
        </Avatar>
        <VStack alignItems={"start"} gap={0}>
          <Flex alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {chat.messenger.name}
            </Text>
            <Image
              src={"/verifyed.png"}
              w={4}
              h={4}
              ml={1}
              objectFit={"cover"}
            />
          </Flex>
          <Text fontSize={12} mt={-1} fontWeight={600} color={"gray.light"}>
            @{chat.messenger.username}
          </Text>
        </VStack>
      </Flex>
      <Flex
        flexDir={"column-reverse"}
        gap={4}
        my={4}
        pb={6}
        h={"400px"}
        overflowY={"auto"}
        className="msg-container"
        w={"full"}
      >
        {loadingMessages &&
          Array(5)
            .fill(0)
            .map((_, i) => (
              <Flex
                key={i}
                gap={2}
                alignItems={"center"}
                p={1}
                borderRadius={"md"}
                alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
              >
                {i % 2 === 0 && <SkeletonCircle size={7} />}
                <Flex flexDir={"column"} gap={2}>
                  <Skeleton h={"7px"} w={"250px"} />
                  <Skeleton h={"7px"} w={"250px"} />
                  <Skeleton h={"7px"} w={"250px"} />
                  <Skeleton h={"7px"} w={"250px"} />
                </Flex>
                {i % 2 !== 0 && <SkeletonCircle size={7} />}
              </Flex>
            ))}

        {typing && (
          <Flex
            ref={typingRef}
            color={"white"}
            gap={2}
            alignItems={"flex-end"}
            w={"full"}
          >
            <Avatar
              w={7}
              h={7}
              size={"xs"}
              objectFit={"cover"}
              name={chat.messenger.name}
              src={chat.messenger.profilePic}
            />

            <Flex
              flexDir={"column"}
              gap={1}
              bg={"gray.600"}
              px={4}
              py={3}
              borderRadius={"md"}
              color={"white"}
              maxW={{ base: "210px", sm: "350px" }}
            >
              <PulseLoader color="white" size={8} />
            </Flex>
          </Flex>
        )}
        {!loadingMessages &&
          (messages.length ? (
            messages.map((message, index) => (
              <Flex key={index}>
                <Message
                  ownmessage={message.sender === user.id ? true : false}
                  sender={message.sender === user.id ? user : chat.messenger}
                  message={message}
                  setMessages={setMessages}
                />
              </Flex>
            ))
          ) : (
            <Text align={"center"}>No messages yet</Text>
          ))}
      </Flex>
      <MessageInput setMessages={setMessages} />
    </Flex>
  );
}
