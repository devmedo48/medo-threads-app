import {
  Button,
  ButtonGroup,
  IconButton,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useRecoilState, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { myAxios } from "../Api/myAxios";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import authScreenAtom from "../atoms/authAtom";

export default function LogoutBtn() {
  let navigate = useNavigate();
  let [loading, setLoading] = useState(false);
  const [isLargerThan30] = useMediaQuery("(min-width: 30em)");
  let [user, setUser] = useRecoilState(userAtom);
  let setAuthScreen = useSetRecoilState(authScreenAtom);
  async function handleLogout() {
    if (loading) return;
    setLoading(true);
    try {
      let { data } = await myAxios.post("logout");
      toast.info(data.message);
      localStorage.removeItem("user");
      setUser(false);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }
  return user ? (
    isLargerThan30 ? (
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
    ) : (
      <IconButton colorScheme="blue" onClick={handleLogout}>
        <FiLogOut />
      </IconButton>
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
