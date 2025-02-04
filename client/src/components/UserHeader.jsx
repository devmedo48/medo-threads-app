/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { myAxios } from "../Api/myAxios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function UserHeader({ user }) {
  let toasty = useToast();
  let navigate = useNavigate();
  let [follow, setFollow] = useState(false);
  let [loading, setLoading] = useState(false);
  function copyURL() {
    let currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toasty({
        title: "Profile link copied",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    });
  }
  let [currentUser, setCurrentUser] = useRecoilState(userAtom);
  async function handleFollow() {
    if (loading) return;
    setLoading(true);
    try {
      let { data } = await myAxios.put("follow/" + user.id);
      toast.success(data.message);
      if (data.user.following.includes(user.id)) {
        user.followers.length += 1;
      } else {
        user.followers.length -= 1;
      }
      setCurrentUser(data.user);
      localStorage.user = JSON.stringify(data.user);
    } catch ({ response }) {
      toast.error(response.data.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (currentUser) {
      if (currentUser.following.includes(user.id)) {
        setFollow(true);
      } else {
        setFollow(false);
      }
    }
  }, [currentUser, user]);
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex
        flexDir={{ base: "column-reverse", sm: "row" }}
        justifyContent={"space-between"}
        w="full"
      >
        <Box>
          <Text
            my={{ base: 2, sm: 0 }}
            fontSize={"25px"}
            textAlign={{ base: "center", sm: "left" }}
          >
            {user.name}
          </Text>
          <Flex
            gap={2}
            alignItems={"center"}
            justifyContent={{ base: "center", sm: "start" }}
          >
            <Text fontSize={"sm"}>@{user.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              medodev.com
            </Text>
          </Flex>
          <Text mt={5} textAlign={{ base: "center", sm: "left" }}>
            {user.bio}
          </Text>
        </Box>
        <VStack>
          <Box
            w={{ base: "50vw", sm: "fit-content" }}
            mx={{ base: "auto", sm: "0" }}
            border={"2px solid"}
            borderColor={"gray.light"}
            borderRadius={"full"}
            padding={1}
          >
            <Avatar
              name={user.name}
              src={user.profilePic ? user.profilePic : ""}
              size={{ base: "full", sm: "2xl" }}
              aspectRatio={"1/1"}
              fontSize={"120px"}
            />
          </Box>
          {currentUser ? (
            currentUser.id === user.id ? (
              <Button
                onClick={() => navigate("/update")}
                bg={useColorModeValue("gray.300", "gray.dark")}
                size={"xs"}
              >
                update profile
              </Button>
            ) : (
              <Button
                onClick={handleFollow}
                bg={"blue.300"}
                _hover={{
                  bg: "blue.400",
                }}
                size={"xs"}
                isLoading={loading}
              >
                {follow ? "unfollow" : "follow"}
              </Button>
            )
          ) : null}
        </VStack>
      </Flex>
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instgram.com</Link>
        </Flex>
        <Flex>
          <Box
            className="icon-container"
            _hover={{
              bg: useColorModeValue("gray.light", "gray.dark"),
              color: "#fff",
            }}
            cursor={"pointer"}
          >
            <BsInstagram size={24} />
          </Box>
          <Box
            className="icon-container"
            _hover={{
              bg: useColorModeValue("gray.light", "gray.dark"),
              color: "#fff",
            }}
            cursor={"pointer"}
          >
            <Menu>
              <MenuButton>
                <CgMoreO size={24} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem
                    transition={"all .2s"}
                    _hover={{ bg: "gray.700" }}
                    onClick={copyURL}
                    bg={"gray.dark"}
                    color={"white"}
                  >
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> Threads</Text>
        </Flex>

        <Flex
          flex={1}
          borderBottom={"1.5px solid gray"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
          color={"gray.light"}
        >
          <Text fontWeight={"bold"}> Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
}
