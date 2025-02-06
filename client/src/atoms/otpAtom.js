import { atom } from "recoil";

const otpAtom = atom({
  key: "otp",
  default: localStorage.otpCounter || 0,
});

export default otpAtom;
