import { atom } from "recoil";

let conversationAtom = atom({
  key: "conversation",
  default: false,
});

export default conversationAtom;
