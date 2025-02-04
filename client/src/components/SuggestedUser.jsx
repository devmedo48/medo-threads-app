/* eslint-disable react/prop-types */
import { Avatar, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { toast } from "react-toastify";
import { myAxios } from "../Api/myAxios";
import { useNavigate } from "react-router-dom";

export default function SuggestedUser({ user }) {
  let navigate = useNavigate();
  let [follow, setFollow] = useState(false);
  let [loading, setLoading] = useState(false);
  let [currentUser, setCurrentUser] = useRecoilState(userAtom);
  async function handleFollow() {
    if (loading) return;
    setLoading(true);
    try {
      let { data } = await myAxios.put("follow/" + user.id);
      toast.success(data.message);
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
    <Flex w={"full"} p={2} alignItems={"center"} gap={3}>
      <Avatar
        src={user.profilePic}
        name={user.name}
        cursor={"pointer"}
        onClick={() => navigate("/" + user.username)}
      />
      <VStack
        alignItems={"flex-start"}
        flex={1}
        cursor={"pointer"}
        gap={0}
        onClick={() => navigate("/" + user.username)}
      >
        <Text fontWeight={700} fontSize={"sm"}>
          {user.name}
        </Text>
        <Text fontSize={"12px"} color={"gray.light"} fontWeight={500}>
          @{user.username}
        </Text>
      </VStack>
      <Button
        colorScheme={follow ? "red" : "blue"}
        size={"sm"}
        onClick={handleFollow}
        isLoading={loading}
      >
        {follow ? "unfollow" : "follow"}
      </Button>
    </Flex>
  );
}
