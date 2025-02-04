/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import {
  Avatar,
  AvatarBadge,
  Flex,
  HStack,
  Image,
  Spinner,
  Text,
  useColorModeValue,
  WrapItem,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import conversationAtom from "../atoms/conversationsAtom";
import chatAtom from "../atoms/chatAtom";
import userAtom from "../atoms/userAtom";
import { toast } from "react-toastify";

export default function UserItem({ user, setInput, setSearch, isOnline }) {
  let setChat = useSetRecoilState(chatAtom);
  let [conversations, setConversations] = useRecoilState(conversationAtom);
  let currentUser = useRecoilValue(userAtom);
  function handleConversations() {
    if (user.id === currentUser.id) {
      setInput("");
      setSearch(false);
      return toast.warn("you can't chat your self");
    }
    if (conversations) {
      let convers = conversations.find((conver) => {
        return conver.participants.includes(user.id);
      });
      if (convers) {
        setChat({ messenger: user, conversation: convers });
      } else {
        let mockConversation = {
          lastMessage: {
            text: "",
            sender: "",
          },
          participants: [currentUser.id, user.id],
        };
        setChat({
          messenger: user,
          conversation: mockConversation,
        });
        setConversations([...conversations, mockConversation]);
      }
      setInput("");
      setSearch(false);
    }
  }
  let bg = useColorModeValue("gray.500", "gray.dark");
  return user ? (
    <HStack
      w={"full"}
      p={2}
      transition={"all .3s"}
      cursor={"pointer"}
      rounded={"md"}
      _hover={{
        bg,
        color: "white",
      }}
      gap={2}
      onClick={handleConversations}
    >
      <WrapItem>
        <Avatar
          size={{ base: "sm", md: "md" }}
          name={user.name}
          src={user.profilePic}
        >
          {isOnline && <AvatarBadge boxSize={".85em"} bg={"green.500"} />}
        </Avatar>
      </WrapItem>
      <Flex flexDir={"column"}>
        <Text fontWeight={700} display={"flex"} alignItems={"center"} gap={1}>
          {user.name}
          <Image src="/verifyed.png" w={4} h={4} objectFit={"cover"} />
        </Text>
      </Flex>
    </HStack>
  ) : (
    <Spinner />
  );
}
