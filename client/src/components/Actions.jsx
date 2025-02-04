/* eslint-disable react/prop-types */
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaShare } from "react-icons/fa";
import { LuMessageCircle } from "react-icons/lu";
import { TfiReload } from "react-icons/tfi";
import { myAxios } from "../Api/myAxios";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { toast } from "react-toastify";

export default function Actions({ post, poster, comment }) {
  let navigate = useNavigate();
  let user = useRecoilValue(userAtom);

  let [liked, setLiked] = useState(false);
  let [likes, setLikes] = useState(post.likes);

  async function likeUnlike(e) {
    if (post && user) {
      try {
        let { data } = await myAxios.put("/post/like/" + post.id);
        if (data.post.likes.includes(user.id)) setLiked(true);
        else setLiked(false);
        setLikes(data.post.likes);
      } catch ({ response }) {
        toast.error(response.data.message);
      }
    } else {
      e.preventDefault();
      toast.error("you must login to do actions");
    }
  }

  useEffect(() => {
    if (likes.includes(user.id)) setLiked(true);
  }, [post]);

  return (
    <VStack align={"start"} gap={0}>
      <Flex cursor={"pointer"} gap={3} my={2}>
        {liked ? (
          <FaHeart onClick={likeUnlike} size={22} color="red" />
        ) : (
          <FaRegHeart onClick={likeUnlike} size={22} />
        )}
        <Link
          to={{ pathname: `/${poster.id}/post/${post.id}`, hash: "#comment" }}
          onClick={(e) => {
            if (user) {
              if (comment && comment.current)
                comment.current.scrollIntoView({ behavior: "smooth" });
              comment.current.focus();
            } else {
              e.preventDefault();
              toast.error("you must login to do actions");
            }
          }}
        >
          <LuMessageCircle size={22} />
        </Link>
        <TfiReload size={22} />
        <FaShare size={22} />
      </Flex>
      <Flex
        onClick={() => navigate(`/${poster.username}/post/` + post.id)}
        cursor={"pointer"}
        gap={2}
        alignItems={"center"}
      >
        <Text color={"gray.light"} fontSize={"sm"}>
          {post.replies.length} replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {likes.length} likes
        </Text>
      </Flex>
    </VStack>
  );
}
