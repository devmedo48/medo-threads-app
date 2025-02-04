/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  HStack,
  Image,
  Spinner,
  Text,
  useColorModeValue,
  WrapItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { myAxios } from "../Api/myAxios";
import { BsCheck2All } from "react-icons/bs";
import chatAtom from "../atoms/chatAtom";
import { useSocket } from "../context/SocketContext";

export default function Conversation({ conversation, isOnline }) {
  let user = useRecoilValue(userAtom);
  let [chat, setChat] = useRecoilState(chatAtom);
  let [messenger, setMessenger] = useState("");
  let [typing, setTyping] = useState(false);
  let { socket } = useSocket();
  useEffect(() => {
    if (conversation) {
      let participant = conversation.participants.filter(
        (item) => item !== user.id
      );
      myAxios
        .get("profile/" + participant[0])
        .then(({ data }) => setMessenger(data.user));
    }
  }, [conversation]);
  useEffect(() => {
    socket?.on("hideTyping", ({ conversationId }) => {
      if (conversationId === conversation?._id) {
        setTyping(false);
      }
    });

    socket?.on("showTyping", ({ conversationId }) => {
      if (conversationId === conversation?._id) {
        setTyping(true);
      } else setTyping(false);
    });
  }, [socket, conversation, typing]);
  let bg = useColorModeValue("gray.500", "gray.dark");
  return messenger ? (
    <HStack
      w={"full"}
      p={2}
      transition={"all .3s"}
      cursor={"pointer"}
      rounded={"md"}
      bg={messenger?.id === chat.messenger?.id ? bg : ""}
      color={messenger?.id === chat.messenger?.id ? "white" : ""}
      _hover={{
        bg,
        color: "white",
      }}
      gap={2}
      onClick={() => setChat({ messenger, conversation })}
    >
      <WrapItem>
        <Avatar
          size={{ base: "sm", md: "md" }}
          name={messenger.name}
          src={messenger.profilePic}
        >
          {isOnline && <AvatarBadge boxSize={"1em"} bg={"green.500"} />}
        </Avatar>
      </WrapItem>
      <Flex flexDir={"column"}>
        <Text fontWeight={700} display={"flex"} alignItems={"center"} gap={1}>
          {messenger.name}
          <Image src="/verifyed.png" w={4} h={4} objectFit={"cover"} />
        </Text>
        {typing ? (
          <Text color={"green.400"} fontSize={"xs"} fontWeight={"bold"}>
            Typing...
          </Text>
        ) : (
          <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
            {conversation.lastMessage.sender === user.id && (
              <Box color={conversation.lastMessage.seen ? "blue.500" : ""}>
                <BsCheck2All />
              </Box>
            )}
            {conversation.lastMessage.text.length > 18
              ? conversation.lastMessage.text.substring(0, 18) + "..."
              : conversation.lastMessage.text}
          </Text>
        )}
      </Flex>
    </HStack>
  ) : (
    <Spinner />
  );
}
