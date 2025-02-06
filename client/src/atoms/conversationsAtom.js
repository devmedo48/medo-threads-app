import { atom } from "recoil";

const conversationAtom = atom({
  key: "conversation",
  default: false,
});

export default conversationAtom;
