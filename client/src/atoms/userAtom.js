import { atom } from "recoil";

let userAtom = atom({
  key: "userAtom",
  default: JSON.parse(localStorage.user || false),
});

export default userAtom;
