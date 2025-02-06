/* eslint-disable react-hooks/rules-of-hooks */
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
  Input,
  FormLabel,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { myAxios } from "../Api/myAxios";
import { toast } from "react-toastify";
import userAtom from "../atoms/userAtom";
import { Helmet } from "react-helmet-async";
import otpAtom from "../atoms/otpAtom";
import passAtom from "../atoms/passAtom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import authScreenAtom from "../atoms/authAtom";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const user = useRecoilValue(userAtom);
  let [loading, setLoading] = useState(false);
  let [email, setEmail] = useState(user.email);
  let [password, setPassword] = useState("");
  let [showPassword, setShowPassword] = useState("");
  let [otpCounter, setOtpCounter] = useRecoilState(otpAtom);
  let [passScreen, setPassScreen] = useRecoilState(passAtom);
  let setAuthScreen = useSetRecoilState(authScreenAtom);
  let navigate = useNavigate();
  let [otp, setOtp] = useState("");
  async function handleResetPassword(e, resend = false) {
    if (!resend) setLoading(true);
    try {
      let data;
      if (passScreen === "email" || resend) {
        if (email) {
          setOtpCounter(60);
          let res = await myAxios.get("sendresetotp", {
            params: {
              email,
            },
          });
          data = res.data;
          setPassScreen("otp");
        } else {
          return;
        }
      } else if (passScreen === "otp" && !resend) {
        if (email && otp.length === 6) {
          let res = await myAxios.post("checkresetotp", {
            email,
            otp,
          });
          data = res.data;
          setPassScreen("newPass");
        } else {
          return;
        }
      } else if (passScreen === "newPass") {
        if (email && password && otp.length === 6) {
          let res = await myAxios.post("resetpassword", {
            email,
            otp,
            password,
          });
          data = res.data;
          setAuthScreen("login");
          if (user) navigate("/" + user.username);
        }
      }
      toast.success(data.message);
    } catch ({ response }) {
      toast.error(response.data.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Flex w={"full"} align={"center"} justify={"center"}>
        <Helmet>
          <title>Change Password Page</title>
        </Helmet>
        <Stack w={"full"} spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              {passScreen === "email" && "Reset Password"}
              {passScreen === "otp" && "Reset Otp"}
              {passScreen === "newPass" && "New Password"}
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.dark")}
            boxShadow={"lg"}
            p={8}
            pos={"relative"}
          >
            {passScreen !== "email" &&
              ((user && passScreen !== "otp") || !user ? (
                <Box
                  pos={"absolute"}
                  top={5}
                  right={5}
                  transform={"scale(1)"}
                  transition={".3s"}
                  cursor={"pointer"}
                  _hover={{ transform: "scale(1.2)" }}
                  onClick={() => {
                    if (passScreen === "otp") setPassScreen("email");
                    if (passScreen === "newPass") setPassScreen("otp");
                  }}
                >
                  <FaArrowAltCircleRight size={22} />
                </Box>
              ) : null)}
            <Stack spacing={2}>
              {passScreen === "email" && (
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleResetPassword()
                    }
                  />
                </FormControl>
              )}

              {passScreen === "otp" && (
                <>
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
                </>
              )}
              {passScreen === "newPass" && (
                <FormControl isRequired>
                  <FormLabel>New Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleResetPassword()
                      }
                    />
                    <InputRightElement h={"full"}>
                      <Button
                        variant={"ghost"}
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              )}
              <Stack spacing={10} pt={2}>
                <Button
                  onClick={handleResetPassword}
                  loadingText="Submitting"
                  size="lg"
                  bg={useColorModeValue("gray.600", "gray.700")}
                  color={"white"}
                  _hover={{
                    bg: useColorModeValue("gray.700", "gray.800"),
                  }}
                  isLoading={loading}
                >
                  {passScreen === "email" && "Send Email"}
                  {passScreen === "otp" && "Verify Otp"}
                  {passScreen === "newPass" && "Submit"}
                </Button>
              </Stack>
              {passScreen === "otp" && (
                <Stack spacing={10} pt={2}>
                  <Text align={"center"}>
                    Don&apos;t recrive code?{" "}
                    {otpCounter ? (
                      `Resend after ${otpCounter}s`
                    ) : (
                      <Link
                        color={"blue.400"}
                        onClick={(e) => handleResetPassword(e, true)}
                      >
                        Resend
                      </Link>
                    )}
                  </Text>
                </Stack>
              )}
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
