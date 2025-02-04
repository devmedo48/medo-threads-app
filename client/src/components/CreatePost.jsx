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
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { myAxios } from "../Api/myAxios";
import { toast } from "react-toastify";
import postsAtom from "../atoms/postsAtom";
import { useRecoilState } from "recoil";
const maxChars = 500;
export default function CreatePost() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [post, setPost] = useRecoilState(postsAtom);
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
      let { data } = await myAxios.post("post/create", {
        text,
        imgs: imgUrls,
      });
      toast.success(data.message);
      setPost(post + 1);
      onClose();
      setText("");
      setImageUrls("");
    } catch ({ response }) {
      toast.error(response.data.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
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
                onChange={handleImageChange}
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
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
