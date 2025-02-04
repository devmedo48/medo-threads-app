import {
  Avatar,
  Button,
  Flex,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import { myAxios } from "../Api/myAxios";
import { toast } from "react-toastify";

export default function SuggestedUsers() {
  let [loading, setLoading] = useState(true);
  let [suggestedUsers, setSuggestedUsers] = useState([]);
  useEffect(() => {
    myAxios
      .get("suggested")
      .then(({ data }) => {
        setSuggestedUsers(data.users);
        setLoading(false);
      })
      .catch(({ response }) => {
        toast.error(response.data.message);
      });
  }, []);
  return (
    <>
      <Text mb={4} fontWeight={"bold"} textAlign={"center"}>
        Suggested Users
      </Text>
      <VStack>
        {loading &&
          Array(4)
            .fill(0)
            .map((_, index) => (
              <Flex key={index} w={"full"} p={2} alignItems={"center"} gap={3}>
                <SkeletonCircle size={10} />
                <VStack alignItems={"flex-start"} flex={1}>
                  <Skeleton w={"min(80%, 70px)"} h={"8px"} />
                  <Skeleton w={"min(90%, 80px)"} h={"8px"} />
                </VStack>
                <Skeleton h={"20px"} w={"50px"} />
              </Flex>
            ))}
        {!loading &&
          (suggestedUsers.length ? (
            suggestedUsers.map((item, index) => (
              <SuggestedUser key={index} user={item} />
            ))
          ) : (
            <h1>No Suggested Users</h1>
          ))}
      </VStack>
    </>
  );
}
