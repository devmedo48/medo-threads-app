/* eslint-disable react/prop-types */
import {
  Box,
  CloseButton,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { myAxios } from "../Api/myAxios";
import { toast } from "react-toastify";
import { useRecoilValue, useSetRecoilState } from "recoil";
import chatAtom from "../atoms/chatAtom";
import conversationAtom from "../atoms/conversationsAtom";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../hooks/usePreviewImg";
import { useSocket } from "../context/SocketContext";

export default function MessageInput({ setMessages }) {
  let { messenger, conversation } = useRecoilValue(chatAtom);
  let setConversations = useSetRecoilState(conversationAtom);
  let [text, setText] = useState("");
  let fileRef = useRef();
  let { handleImageChange, imgUrls, setImageUrls } = usePreviewImg();
  let { socket } = useSocket();
  async function sendMessage(e) {
    e.preventDefault();
    if (!text && !imgUrls.length) return;
    try {
      let { data } = await myAxios.post("message", {
        recipientId: messenger.id,
        text,
        img: imgUrls[0],
      });
      setText("");
      setImageUrls("");
      setMessages((messages = []) => [data.newMessage, ...messages]);
      setConversations((prevConvers) => {
        let updatedConversations = prevConvers.map((conver) => {
          if (conver._id === conversation._id) {
            return {
              ...conver,
              lastMessage: {
                text: text || "image...",
                sender: data.newMessage.sender,
              },
            };
          }
          return conver;
        });
        return updatedConversations;
      });
    } catch ({ response }) {
      toast.error(response.data.message);
    }
  }

  return (
    <VStack w={"full"}>
      {imgUrls &&
        imgUrls.map((img, index) => (
          <Box key={index} maxW={"150px"} position={"relative"}>
            <Image src={img} />
            <CloseButton
              onClick={() => setImageUrls("")}
              position={"absolute"}
              top={1}
              color={"white"}
              bg={"gray.800"}
              _hover={{ bg: "gray.700" }}
              right={1}
            />
          </Box>
        ))}
      <HStack w={"full"}>
        <InputGroup>
          <Input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage(e);
              socket.emit("typing", {
                conversationId: conversation._id,
                userId: messenger.id,
              });
            }}
            onKeyUp={() => {
              socket.emit("notTyping", {
                conversationId: conversation._id,
                userId: messenger.id,
              });
            }}
          />
          <InputRightElement onClick={sendMessage} cursor={"pointer"}>
            <IoSendSharp />
          </InputRightElement>
        </InputGroup>
        <Input type="file" ref={fileRef} onChange={handleImageChange} hidden />
        <IconButton
          icon={<BsFillImageFill size={20} />}
          onClick={() => fileRef.current.click()}
        />
      </HStack>
    </VStack>
  );
}
