import { useRecoilState, useRecoilValue } from "recoil";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import authScreenAtom from "../atoms/authAtom";
import VerifyEmail from "../components/VerifyEmail";
import userAtom from "../atoms/userAtom";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ResetPassword from "../components/ResetPassword";

export default function AuthPage() {
  let [authScreenState, setAuthScreen] = useRecoilState(authScreenAtom);
  let user = useRecoilValue(userAtom);
  let navigate = useNavigate();
  useEffect(() => {
    if (user && user.isVerifyed && !authScreenState === "resetPass")
      navigate("/");
    if (user && !user.isVerifyed) setAuthScreen("verify");
    if (!user) setAuthScreen("login");
    if (authScreenState === "resetPass") setAuthScreen("resetPass");
  }, [user]);
  return (
    <>
      {!user && authScreenState === "login" && <LoginCard />}
      {!user && authScreenState === "signup" && <SignupCard />}
      {user && !user.isVerifyed && authScreenState === "verify" && (
        <VerifyEmail email={user.email} />
      )}
      {authScreenState === "resetPass" && <ResetPassword />}
      {user && user.isVerifyed && authScreenState !== "resetPass" && (
        <Navigate to={"/"} />
      )}
    </>
  );
}
