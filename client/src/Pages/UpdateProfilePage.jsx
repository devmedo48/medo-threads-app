import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  Text,
  Link,
  Textarea,
  AvatarBadge,
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { myAxios } from "../Api/myAxios";
import usePreviewImg from "../hooks/usePreviewImg";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { Helmet } from "react-helmet";

export default function UpdateProfilePage() {
  let navigate = useNavigate();
  let [user, setUser] = useRecoilState(userAtom);
  let [loading, setLoading] = useState(false);
  let fileRef = useRef();
  let { handleImageChange, imgUrls, setImageUrls } = usePreviewImg();
  let [close, setClose] = useState(false);
  useEffect(() => {
    if (!user.profilePic) setClose(true);
  }, []);
  let [form, setForm] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    profilePic: user.profilePic,
  });
  async function handleUpdate() {
    if (loading) return;
    setLoading(true);
    try {
      form.profilePic = imgUrls[0] || form.profilePic;
      let { data } = await myAxios.put("update", form);
      toast.success(data.message);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/" + data.user.username);
      setUser(data.user);
    } catch (error) {
      toast.error(error.response.data.message || error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Flex align={"center"} justify={"center"}>
      <Helmet>
        <title>Update Profile</title>
      </Helmet>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.dark")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar
                bg={"gray.300"}
                size="xl"
                src={!close ? imgUrls[0] || user.profilePic : ""}
              >
                {!close ? (
                  <AvatarBadge
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="-10px"
                    colorScheme="red"
                    aria-label="remove Image"
                    icon={<SmallCloseIcon />}
                    onClick={() => {
                      setImageUrls("");
                      setForm({ ...form, profilePic: "" });
                      setClose(true);
                    }}
                  />
                ) : null}
              </Avatar>
            </Center>
            <Center w="full">
              <Button w="full" onClick={() => fileRef.current.click()}>
                Change Avatar
              </Button>
              <Input
                type="file"
                hidden
                ref={fileRef}
                accept=".png,.jpg,.webp"
                onChange={(e) => {
                  handleImageChange(e);
                  setClose(false);
                }}
              />
            </Center>
          </Stack>
        </FormControl>
        <FormControl>
          <FormLabel>Full name</FormLabel>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
            placeholder="Full name"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
            placeholder="Username"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            type="email"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Bio</FormLabel>
          <Textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Your bio..."
            _placeholder={{ color: "gray.500" }}
            resize={"none"}
          />
        </FormControl>
        <Text>
          To change password <Link color={"blue.400"}>Click here</Link>
        </Text>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            bg={"blue.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "blue.500",
            }}
            onClick={handleUpdate}
            isLoading={loading}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
