import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Image,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import { myAxios } from "../Api/myAxios";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { formatDistanceToNow } from "date-fns";

export default function PostPage() {
  let user = useRecoilValue(userAtom);
  let [post, setPost] = useState(null);
  let [loading, setLoading] = useState(false);
  let [poster, setPoster] = useState(null);
  let [input, setInput] = useState("");
  let [replies, setReplies] = useState(null);
  let { pid } = useParams();
  let navigate = useNavigate();
  useEffect(() => {
    myAxios
      .get("post/" + pid)
      .then(({ data }) => {
        setPost(data.post);
        setReplies(data.post.replies);
      })
      .catch(({ response }) => {
        toast.error(response.data.message);
        navigate("/");
      });
  }, [pid]);

  useEffect(() => {
    if (post) {
      myAxios
        .get("profile/" + post.postedBy)
        .then(({ data }) => setPoster(data.user))
        .catch(({ response }) => toast.error(response.data.message));
    }
  }, [post]);
  async function handleReply() {
    if (input !== "") {
      setLoading(true);
      try {
        let { data } = await myAxios.put("post/reply/" + post.id, {
          text: input,
        });
        setPost(data.post);
        setReplies(data.post.replies);
        setInput("");
      } catch ({ response }) {
        toast.error(response.data.message);
      } finally {
        setLoading(false);
      }
    }
  }
  let handleRef = useRef(null);
  let maxChar = 200;
  useEffect(() => {
    if (window.location.hash === "#comment") {
      if (handleRef.current !== null) {
        handleRef?.current.scrollIntoView({ behavior: "smooth" });
        handleRef?.current.focus();
      }
    }
  }, [handleRef.current]);
  return post && poster ? (
    <>
      <Flex
        border={"1px solid"}
        borderColor={"gray.light"}
        borderRadius={"xl"}
        p={3}
        flex={1}
        flexDirection={"column"}
        gap={2}
      >
        <Flex justifyContent={"space-between"} w={"full"}>
          <Flex alignItems={"center"}>
            <Avatar
              mr={3}
              size={"md"}
              name={poster.name}
              src={poster.profilePic}
              onClick={() => navigate("/" + poster.username)}
              cursor={"pointer"}
            />
            <VStack
              alignItems={"start"}
              cursor={"pointer"}
              gap={0}
              onClick={() => navigate("/" + poster.username)}
            >
              <Flex alignItems={"center"}>
                <Text fontSize={"sm"} fontWeight={"bold"}>
                  {poster?.name}
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
                @{poster?.username}
              </Text>
            </VStack>
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <Text fontStyle={"sm"} color={"gray.light"}>
              {formatDistanceToNow(new Date(post.createdAt))}
            </Text>
            <BsThreeDots />
          </Flex>
        </Flex>
        {post.text && <Text fontSize={"sm"}>{post.text}</Text>}
        {post.imgs.length !== 0 && (
          <SimpleGrid
            mt={post.text ? 0 : 2}
            spacing={"10px"}
            minChildWidth={"200px"}
          >
            {post.imgs.map((img, index) => (
              <Box
                key={index}
                onClick={() => navigate(`/${poster.username}/post/` + post.id)}
                cursor={"pointer"}
                borderRadius={6}
                w={"full"}
                overflow={"hidden"}
                display={"grid"}
                placeContent={"center"}
              >
                <Image src={img} w={"full"} />
              </Box>
            ))}
          </SimpleGrid>
        )}
        <Actions comment={handleRef} post={post} poster={poster} />
        <Divider />
        {!user && (
          <>
            <Flex justifyContent={"space-between"}>
              <Flex gap={2} alignItems={"center"}>
                <Text fontSize={"2xl"}>👋</Text>
                <Text color={"gray.light"}>
                  Get the app to like, reply and post.
                </Text>
              </Flex>
              <Button onClick={() => navigate("/auth")}>Get</Button>
            </Flex>
            <Divider />
          </>
        )}
        {user && (
          <>
            <FormControl>
              <Textarea
                maxLength={maxChar}
                ref={handleRef}
                placeholder="Comment here..."
                resize={"none"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Flex justify={"space-between"}>
                <Text color={"gray.light"} fontSize={"xs"} mt={1}>
                  {input.length}/{maxChar}
                </Text>
                <Button
                  onClick={handleReply}
                  colorScheme="blue"
                  size={"sm"}
                  mt={2}
                  isLoading={loading}
                >
                  Reply
                </Button>
              </Flex>
              <Divider mt={2} />
            </FormControl>
          </>
        )}
        {replies ? (
          replies.map((item, index) => (
            <Comment
              key={index}
              comment={item.text}
              name={item.name}
              createdAt={formatDistanceToNow(new Date(item.createdAt))}
              username={item.username}
              likes={item.likes}
              userAvatar={item.userProfilePic}
            />
          ))
        ) : (
          <Text>No comment Yet</Text>
        )}
      </Flex>
    </>
  ) : (
    <Loading />
  );
}
