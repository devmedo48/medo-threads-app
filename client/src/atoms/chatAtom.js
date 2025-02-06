import { atom } from "recoil";

const chatAtom = atom({
  key: "chat",
  default: false,
});

export default chatAtom;
