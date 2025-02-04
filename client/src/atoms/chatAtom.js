import { atom } from "recoil";

let chatAtom = atom({
  key: "chat",
  default: false,
});

export default chatAtom;
