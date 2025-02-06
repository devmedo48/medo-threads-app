import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useRecoilState, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { myAxios } from "../Api/myAxios";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import authScreenAtom from "../atoms/authAtom";
import { MdOutlineVerified } from "react-icons/md";
import otpAtom from "../atoms/otpAtom";

export default function LogoutBtn() {
  let navigate = useNavigate();
  let [loading, setLoading] = useState(false);
  const [isLargerThan30] = useMediaQuery("(min-width: 30em)");
  let [user, setUser] = useRecoilState(userAtom);
  let setAuthScreen = useSetRecoilState(authScreenAtom);
  let [otpCounter, setOtpCounter] = useRecoilState(otpAtom);
  async function handleLogout() {
    if (loading) return;
    setLoading(true);
    try {
      let { data } = await myAxios.post("logout");
      toast.info(data.message);
      localStorage.removeItem("user");
      setUser(false);
      setAuthScreen("login");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }
  async function sendVerifyOtp() {
    setOtpCounter(60);
    navigate("/auth");
    setAuthScreen("verify");
    try {
      let { data } = await myAxios.get("sendverifyotp");
      toast.success(data.message);
    } catch ({ response }) {
      toast.error(response.data.message);
    }
  }
  useEffect(() => {
    let interval;

    if (otpCounter > 0) {
      interval = setInterval(() => {
        setOtpCounter((prev) => prev - 1);
      }, 1000);
      localStorage.otpCounter = otpCounter;
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [setOtpCounter, otpCounter]);
  return user ? (
    isLargerThan30 ? (
      <>
        {!user.isVerifyed && (
          <ButtonGroup onClick={sendVerifyOtp} isDisabled={otpCounter > 0}>
            <Button
              colorScheme="green"
              gap={2}
              isLoading={loading}
              transition={"all .5s"}
              pl={0}
              pr={2}
              _groupHover={{ px: 2 }}
              alignItems={"center"}
            >
              <Text
                width={"0px"}
                fontSize={"15px"}
                overflow={"hidden"}
                transition={"all 0.5s"}
                _groupHover={{ w: "100px" }}
              >
                verify account
              </Text>
              {otpCounter ? <Box>{otpCounter}s</Box> : <MdOutlineVerified />}
            </Button>
          </ButtonGroup>
        )}
        <ButtonGroup onClick={handleLogout}>
          <Button
            colorScheme="blue"
            gap={2}
            isLoading={loading}
            transition={"all .5s"}
            pl={0}
            pr={2}
            _groupHover={{ px: 2 }}
            alignItems={"center"}
          >
            <Text
              width={"0px"}
              fontSize={"15px"}
              overflow={"hidden"}
              transition={"all 0.5s"}
              _groupHover={{ w: "46px" }}
            >
              logout
            </Text>
            <FiLogOut />
          </Button>
        </ButtonGroup>
      </>
    ) : (
      <>
        {!user.isVerifyed && (
          <IconButton
            onClick={sendVerifyOtp}
            colorScheme="green"
            isDisabled={otpCounter > 0}
          >
            {otpCounter ? <Box>{otpCounter}s</Box> : <MdOutlineVerified />}
          </IconButton>
        )}
        <IconButton colorScheme="blue" onClick={handleLogout}>
          <FiLogOut />
        </IconButton>
      </>
    )
  ) : isLargerThan30 ? (
    <ButtonGroup
      onClick={() => {
        navigate("/auth");
        setAuthScreen("login");
      }}
    >
      <Button
        colorScheme="blue"
        gap={2}
        pl={0}
        pr={2}
        transition={"all .5s"}
        _groupHover={{ px: 2 }}
        alignItems={"center"}
      >
        <Text
          width={"0px"}
          fontSize={"15px"}
          overflow={"hidden"}
          transition={"all 0.5s"}
          _groupHover={{ w: "35px" }}
        >
          login
        </Text>
        <FiLogIn />
      </Button>
    </ButtonGroup>
  ) : (
    <IconButton colorScheme="blue">
      <FiLogIn />
    </IconButton>
  );
}
