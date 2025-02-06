import { atom } from "recoil";

const passAtom = atom({
  key: "passAtom",
  default: "email",
});

export default passAtom;
