/* eslint-disable react/prop-types */
import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsCheck2All } from "react-icons/bs";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { myAxios } from "../Api/myAxios";
import { useSocket } from "../context/SocketContext";

export default function Message({ ownmessage, message, sender, setMessages }) {
  let [liked, setLiked] = useState(false);
  let { socket } = useSocket();
  function handleLike() {
    setMessages((prevMessages) => {
      let updatedMessages = prevMessages.map((msg) => {
        if (message._id === msg._id) {
          return { ...msg, isLiked: !liked };
        }
        return msg;
      });
      return updatedMessages;
    });
    myAxios.put("message", { messageId: message._id }).then(() => {
      socket.emit("likeMessage", {
        messageId: message._id,
        userId: sender.id,
      });
    });
  }

  useEffect(() => {
    setLiked(message.isLiked);
  }, [message]);

  useEffect(() => {
    socket?.on("setLiked", ({ messageId }) => {
      if (messageId === message._id) {
        setMessages((prevMessages) => {
          let updatedMessages = prevMessages.map((message) => {
            if (message._id === messageId) {
              return { ...message, isLiked: !liked };
            }
            return message;
          });
          return updatedMessages;
        });
        // setLiked(!liked);
      }
    });
  }, [socket, message, liked, setMessages]);
  return ownmessage ? (
    <Flex gap={2} alignItems={"flex-end"} ml={"auto"}>
      <Flex
        bg={"green.800"}
        p={2}
        borderRadius={"md"}
        alignItems={"flex-end"}
        gap={2}
        color={"white"}
        maxW={{ base: "220px", sm: "360px" }}
        pos={"relative"}
      >
        <Flex flexDir={"column"} gap={1}>
          {message.img && (
            <Box
              maxW={{ base: "200px", sm: "310px" }}
              rounded={"md"}
              overflow={"hidden"}
            >
              <Image w={"full"} src={message.img} />
            </Box>
          )}
          {message.text && (
            <Text maxW={{ base: "180px", sm: "310px" }}>{message.text}</Text>
          )}
          {liked && (
            <Box
              pos={"absolute"}
              bottom={0}
              left={0}
              bg={"gray.900"}
              p={1}
              borderRadius={"full"}
              transform={"translate(-50%, 50%)"}
            >
              <FaHeart color="red" />
            </Box>
          )}
        </Flex>
        <Box color={message.seen ? "blue.500" : ""}>
          <BsCheck2All size={18} />
        </Box>
      </Flex>
      <Avatar
        w={7}
        h={7}
        objectFit={"cover"}
        name={sender.name}
        src={sender.profilePic}
        size={"xs"}
      />
    </Flex>
  ) : (
    <Flex color={"white"} gap={2} alignItems={"flex-end"} w={"full"}>
      <Avatar
        w={7}
        h={7}
        size={"xs"}
        objectFit={"cover"}
        name={sender.name}
        src={sender.profilePic}
      />

      <Flex
        flexDir={"column"}
        gap={1}
        bg={"gray.600"}
        p={2}
        borderRadius={"md"}
        color={"white"}
        maxW={{ base: "210px", sm: "350px" }}
        pos={"relative"}
        role={"group"}
      >
        {message.img && (
          <Box
            maxW={{ base: "200px", sm: "330px" }}
            rounded={"md"}
            overflow={"hidden"}
          >
            <Image w={"full"} src={message.img} />
          </Box>
        )}
        {message.text && (
          <Text maxW={{ base: "200px", sm: "330px" }}>{message.text}</Text>
        )}
        <Box
          pos={"absolute"}
          bottom={0}
          right={0}
          bg={"gray.900"}
          p={1}
          borderRadius={"full"}
          transform={"translate(50%, 50%)"}
          opacity={liked ? 1 : 0}
          visibility={liked ? "" : "hidden"}
          transition={"0.3s"}
          _groupHover={{ visibility: "visible", opacity: 1 }}
          cursor={"pointer"}
          onClick={handleLike}
        >
          {liked ? <FaHeart color="red" /> : <FaRegHeart />}
        </Box>
      </Flex>
    </Flex>
  );
}
