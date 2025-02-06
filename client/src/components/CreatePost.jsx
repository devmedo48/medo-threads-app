/* eslint-disable react/prop-types */
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  CloseButton,
  FormControl,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { myAxios } from "../Api/myAxios";
import { toast } from "react-toastify";
import postsAtom from "../atoms/postsAtom";
import { useRecoilState } from "recoil";
const maxChars = 500;
export default function CreatePost({
  mode = "create",
  post,
  setPost = false,
  isOpen,
  onOpen,
  onClose,
}) {
  let [postc, setPostc] = useRecoilState(postsAtom);
  let [loading, setLoading] = useState(false);

  let [text, setText] = useState("");
  let fileRef = useRef(null);
  let { handleImageChange, imgUrls, setImageUrls } = usePreviewImg();
  async function handleCreatePost() {
    if (loading) return;
    setLoading(true);
    if (text > maxChars) {
      setText(text.slice(0, maxChars));
    }
    try {
      let data;
      if (mode === "edit") {
        let res = await myAxios.put(`post/${post.id}`, {
          text,
          imgs: imgUrls,
        });
        data = res.data;
      } else {
        let res = await myAxios.post("post/create", {
          text,
          imgs: imgUrls,
        });
        data = res.data;
      }
      toast.success(data.message);
      setPostc(postc + 1);
      if (setPost) setPost(data.post);
      onClose();
      setText("");
      setImageUrls("");
    } catch ({ response }) {
      toast.error(response.data.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (mode === "edit") {
      setText(post.text);
      setImageUrls(post.imgs);
    }
  }, [mode, post]);
  return (
    <>
      {mode === "create" && (
        <Button
          position={"fixed"}
          bottom={10}
          right={10}
          leftIcon={<AddIcon />}
          colorScheme="purple"
          boxShadow={"2xl"}
          onClick={onOpen}
        >
          Post
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {mode === "create" ? "Create" : "Edit"} Post
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                maxLength={maxChars}
                placeholder="Post content goes here..."
                resize={"none"}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Text fontSize={"xs"} fontWeight={"md"} textAlign={"right"} m={1}>
                {text.length}/{maxChars}
              </Text>
            </FormControl>
            <FormControl>
              <input
                type="file"
                accept=".png,.jpg,.webp"
                ref={fileRef}
                onChange={(e) => handleImageChange(e, imgUrls)}
                multiple
                hidden
              />
              <IconButton
                icon={<BsFillImageFill size={20} />}
                onClick={() => fileRef.current.click()}
              />
            </FormControl>
            {imgUrls && (
              <SimpleGrid spacing={"10px"} minChildWidth={"100px"}>
                {imgUrls.map((img, index) => (
                  <Box key={index} mt={5} position={"relative"}>
                    <Image src={img} />
                    <CloseButton
                      onClick={() => {
                        let images = [...imgUrls];
                        if (images.length === 1) {
                          setImageUrls("");
                        } else {
                          let index = images.indexOf(img);
                          images.splice(index, 1);
                          setImageUrls(images);
                        }
                      }}
                      position={"absolute"}
                      top={1}
                      color={"white"}
                      bg={"gray.800"}
                      _hover={{ bg: "gray.700" }}
                      right={1}
                    />
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={loading}
              colorScheme="blue"
              w={100}
              onClick={handleCreatePost}
            >
              {mode === "create" ? "Create" : "Save Changes"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
