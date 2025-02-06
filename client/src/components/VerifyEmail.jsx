/* eslint-disable react/prop-types */
import {
  Flex,
  Box,
  FormControl,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Center,
  PinInput,
  PinInputField,
  Grid,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { myAxios } from "../Api/myAxios";
import { toast } from "react-toastify";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import otpAtom from "../atoms/otpAtom";

export default function VerifyEmail({ email }) {
  const [user, setUser] = useRecoilState(userAtom);
  let [loading, setLoading] = useState(false);
  let [otpCounter, setOtpCounter] = useRecoilState(otpAtom);
  let [otp, setOtp] = useState("");
  let navigate = useNavigate();
  async function handleVerifyEmail(e) {
    if (loading) return;
    setLoading(true);
    try {
      if (otp && otp.length === 6) {
        let { data } = await myAxios.post("verifyemail", { otp });
        toast.success(data.message);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, isVerifyed: true })
        );
        navigate("/" + user.username);
        setUser({ ...user, isVerifyed: true });
      } else e.preventDefault();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }
  async function sendVerifyOtp() {
    setOtpCounter(60);
    try {
      let { data } = await myAxios.get("sendverifyotp");
      toast.success(data.message);
    } catch ({ response }) {
      toast.error(response.data.message);
    }
  }
  return (
    <Flex w={"full"} align={"center"} justify={"center"}>
      <Helmet>
        <title>Verify Email Page</title>
      </Helmet>
      <Stack w={"full"} spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Verify Account
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={2}>
            <Text textAlign={"center"}>
              Enter the 6-digit code sent to your email
            </Text>
            <Center
              fontSize="md"
              mb={5}
              mt={-2}
              fontWeight="bold"
              color={useColorModeValue("gray.800", "gray.400")}
            >
              {email}
            </Center>
            <FormControl>
              <Center>
                <Grid
                  gridTemplateColumns={"repeat(6, 1fr)"}
                  w={"full"}
                  gap={{ base: 1, sm: 3 }}
                >
                  <PinInput value={otp} onChange={setOtp}>
                    <PinInputField w={"full"} h={"50px"} />
                    <PinInputField w={"full"} h={"50px"} />
                    <PinInputField w={"full"} h={"50px"} />
                    <PinInputField w={"full"} h={"50px"} />
                    <PinInputField w={"full"} h={"50px"} />
                    <PinInputField w={"full"} h={"50px"} />
                  </PinInput>
                </Grid>
              </Center>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                onClick={handleVerifyEmail}
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                isLoading={loading}
              >
                Verify Account
              </Button>
            </Stack>
            <Stack spacing={10} pt={2}>
              <Text align={"center"}>
                Don&apos;t recrive code?{" "}
                {otpCounter ? (
                  `Resend after ${otpCounter}s`
                ) : (
                  <Link color={"blue.400"} onClick={sendVerifyOtp}>
                    Resend
                  </Link>
                )}
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
