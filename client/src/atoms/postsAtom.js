import { atom } from "recoil";

const postsAtom = atom({
  key: "postAtom",
  default: 0,
});

export default postsAtom;
