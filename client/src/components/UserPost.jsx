/* eslint-disable react/prop-types */
import { Avatar, Box, Flex, Image, Text, VStack } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
// import Actions from "./Actions";
// import { useState } from "react";

export default function UserPost({ likes, replies, postTitle, postImg }) {
  // let [liked, setLiked] = useState(false);
  return (
    <Link to="/medo/post/1">
      <Flex cursor={"pointer"} gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size={"md"} name="Medo Dev" src="/profile_martin.png" />
          <Box w={"1px"} h={"full"} bg={"gray.light"}></Box>
          <Box position={"relative"} w={"full"}>
            <Avatar
              position={"absolute"}
              top={"0"}
              left={"50%"}
              transform={"auto"}
              translateX={"-50%"}
              padding={"2px"}
              size={"xs"}
              name="Medo Dev"
              src="/profile_enrique.png"
            />
            <Avatar
              position={"absolute"}
              bottom={"0"}
              right={"-3px"}
              padding={"2px"}
              size={"xs"}
              name="Medo Dev"
              src="/profile_richard.png"
            />
            <Avatar
              position={"absolute"}
              bottom={"0"}
              left={"-3px"}
              padding={"2px"}
              size={"xs"}
              name="Medo Dev"
              src="/profile_marco.png"
            />
          </Box>
        </Flex>

        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <VStack alignItems={"start"} gap={0}>
              <Flex alignItems={"center"}>
                <Text fontSize={"sm"} fontWeight={"bold"}>
                  medo dev
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
                @medo
              </Text>
            </VStack>
            <Flex gap={4} alignItems={"center"}>
              <Text fontStyle={"sm"} color={"gray.light"}>
                1d
              </Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          {postTitle && <Text fontSize={"sm"}>{postTitle}</Text>}
          {postImg && (
            <Box
              mt={postTitle ? 0 : 2}
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={postImg} w={"full"} />
            </Box>
          )}
          {/* <Actions liked={liked} setLiked={setLiked} /> */}
          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"} fontSize={"sm"}>
              {replies} replies
            </Text>
            <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
            <Text color={"gray.light"} fontSize={"sm"}>
              {likes} likes
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
}
