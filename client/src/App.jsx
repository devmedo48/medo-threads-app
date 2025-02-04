import { Box, Container, useColorMode } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./Pages/UserPage";
import PostPage from "./Pages/PostPage";
import Header from "./components/Header";
import HomePage from "./Pages/HomePage";
import AuthPage from "./Pages/AuthPage";
import { ToastContainer } from "react-toastify";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./Pages/UpdateProfilePage";
import { useRecoilValue } from "recoil";
import ChatPage from "./Pages/ChatPage";

function App() {
  let { colorMode } = useColorMode();
  let user = useRecoilValue(userAtom);
  let { pathname } = useLocation();
  return (
    <Box pos={"relative"} w={"full"}>
      <ToastContainer
        autoClose={3000}
        pauseOnFocusLoss={false}
        closeOnClick
        theme={colorMode}
      />
      <Container maxW={pathname === "/" ? "900px" : "620px"} pb={6}>
        <Header />
        <Routes>
          <Route
            index
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/update"
            element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />
          <Route path="/:username" element={<UserPage />} />
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to="/" />}
          />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
