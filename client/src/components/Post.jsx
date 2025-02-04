/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  SimpleGrid,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import { myAxios } from "../Api/myAxios";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import Loading from "./Loading";
import { FaEdit } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

export default function Post({ post, posterId }) {
  let [posts, setPosts] = useRecoilState(postsAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [loading, setLoading] = useState(false);

  let navigate = useNavigate();
  let user = useRecoilValue(userAtom);
  let [poster, setPoster] = useState({});
  let IDs = [];
  let replies = post.replies.filter((item) => {
    if (!IDs.includes(item.userId) && item.userId !== posterId) {
      IDs.push(item.userId);
      return item;
    }
  });
  useEffect(() => {
    myAxios
      .get("profile/" + posterId)
      .then(({ data }) => {
        setPoster(data.user);
      })
      .catch(({ response }) => {
        toast.error(response.data.message);
      });
  }, [posterId]);
  async function handleDelete() {
    if (loading) return;
    setLoading(true);
    try {
      let { data } = await myAxios.delete("post/" + post.id);
      toast.success(data.message);
      onClose();
      setPosts(posts + 1);
    } catch ({ response }) {
      toast.error(response.data.message);
    } finally {
      setLoading(false);
    }
  }
  return poster ? (
    <Flex gap={3} mb={4} py={5}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody pt={6}>
            <Text>Are you sure. you want to delete this post</Text>
          </ModalBody>

          <ModalFooter>
            <HStack>
              <Button colorScheme="blue" w={100} onClick={onClose}>
                Close
              </Button>
              <Button
                colorScheme="red"
                isLoading={loading}
                w={100}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex flexDirection={"column"} alignItems={"center"}>
        <Avatar
          onClick={() => navigate("/" + poster.username)}
          cursor={"pointer"}
          size={"md"}
          name={poster.name}
          src={poster.profilePic}
          border={"1px solid #616161"}
        />
        <Box w={"1px"} my={2} h={"full"} bg={"gray.light"}></Box>
        <Box position={"relative"} w={"full"}>
          <Box
            bg={useColorModeValue("gray.100", "#161616")}
            pos={"absolute"}
            left={"50%"}
            top={"50%"}
            transform={"translate(-50%, -50%)"}
            w={4}
            h={4}
            rounded={"full"}
            border={"2px solid"}
            borderColor={"gray.light"}
            onClick={() => navigate(`/${poster.username}/post/` + post.id)}
            cursor={"pointer"}
          ></Box>
          {replies.length !== 0 && (
            <>
              {replies[0] && (
                <Avatar
                  position={"absolute"}
                  top={replies[2] ? 1 : replies[1] ? 1 : "50%"}
                  left={"50%"}
                  transform={"auto"}
                  translateX={"-50%"}
                  translateY={replies[2] ? 0 : replies[1] ? 0 : "-50%"}
                  padding={"2px"}
                  size={"xs"}
                  name={replies[0].name}
                  src={replies[0].userProfilePic}
                />
              )}
              {replies[1] && (
                <Avatar
                  position={"absolute"}
                  bottom={replies[2] ? -1 : 1}
                  left={replies[2] ? "25%" : "50%"}
                  transform={"auto"}
                  translateX={"-50%"}
                  padding={"2px"}
                  size={"xs"}
                  name={replies[1].name}
                  src={replies[1].userProfilePic}
                />
              )}
              {replies[2] && (
                <Avatar
                  position={"absolute"}
                  bottom={-1}
                  right={"25%"}
                  transform={"auto"}
                  translateX={"50%"}
                  padding={"2px"}
                  size={"xs"}
                  name={replies[2].name}
                  src={replies[2].userProfilePic}
                />
              )}
            </>
          )}
        </Box>
      </Flex>

      <Flex flex={1} flexDirection={"column"} gap={2}>
        <Flex justifyContent={"space-between"} alignItems={"start"} w={"full"}>
          <VStack
            alignItems={"start"}
            cursor={"pointer"}
            gap={0}
            onClick={() => navigate("/" + poster.username)}
          >
            <Flex alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {poster.name}
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
              @{poster.username}
            </Text>
          </VStack>

          <Flex gap={4} alignItems={"center"}>
            <Text fontStyle={"sm"} color={"gray.light"}>
              {formatDistanceToNow(new Date(post.createdAt))}
            </Text>
            {poster.id === user.id && (
              <Menu>
                <MenuButton>
                  <BsThreeDots />
                </MenuButton>
                <MenuList bg={"gray.dark"}>
                  <MenuItem
                    onClick={onOpen}
                    bg={"gray.dark"}
                    color={"red"}
                    justifyContent={"space-between"}
                    fontWeight={"bold"}
                    fontSize={"15px"}
                    transition={"all .3s"}
                    _hover={{ bg: "gray.700" }}
                  >
                    Delete Post
                    <MdDeleteForever size={22} />
                  </MenuItem>
                  <MenuItem
                    onClick={handleDelete}
                    bg={"gray.dark"}
                    color={"blue"}
                    justifyContent={"space-between"}
                    fontWeight={"bold"}
                    fontSize={"15px"}
                    transition={"all .3s"}
                    _hover={{ bg: "gray.700" }}
                  >
                    Edit Post
                    <FaEdit size={22} />
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>

        {post.text && (
          <Text
            onClick={() => navigate(`/${poster.username}/post/` + post.id)}
            cursor={"pointer"}
            fontSize={"sm"}
          >
            {post.text}
          </Text>
        )}
        {post.imgs.length !== 0 && (
          <SimpleGrid
            mt={post.text ? 0 : 2}
            spacing={"10px"}
            minChildWidth={"150px"}
            w={"full"}
          >
            {post.imgs.map((img, index) => (
              <Box
                key={index}
                onClick={() => navigate(`/${poster.username}/post/` + post.id)}
                cursor={"pointer"}
                borderRadius={6}
                w={"full"}
                overflow={"hidden"}
                border={"1px solid"}
              >
                <Image src={img} w={"full"} />
              </Box>
            ))}
          </SimpleGrid>
        )}

        <Actions post={post} poster={poster} />
      </Flex>
    </Flex>
  ) : (
    <Loading />
  );
}
