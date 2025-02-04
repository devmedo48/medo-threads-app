import { Flex, HStack, IconButton, useColorMode } from "@chakra-ui/react";
import { LuMoon, LuSun } from "react-icons/lu";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";
import { BsFillChatDotsFill } from "react-icons/bs";

export default function Header() {
  let { colorMode, toggleColorMode } = useColorMode();
  let navigate = useNavigate();
  let user = useRecoilValue(userAtom);
  return (
    <Flex justifyContent={"space-between"} mt={6} mb={9}>
      {user && (
        <IconButton onClick={() => navigate("/")} variant="outline" size="md">
          <AiFillHome />
        </IconButton>
      )}
      <IconButton onClick={toggleColorMode} variant="outline" size="md">
        {colorMode === "light" ? <LuSun /> : <LuMoon />}
      </IconButton>
      <HStack>
        {user && (
          <>
            <IconButton
              onClick={() => navigate("/" + user.username)}
              variant="outline"
              size="md"
            >
              <RxAvatar />
            </IconButton>
            <IconButton
              onClick={() => navigate("/chat")}
              variant="outline"
              size="md"
            >
              <BsFillChatDotsFill />
            </IconButton>
          </>
        )}
        <LogoutBtn />
      </HStack>
    </Flex>
  );
}
