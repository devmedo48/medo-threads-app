/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useNavigate, useParams } from "react-router-dom";
import { myAxios } from "../Api/myAxios";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import CreatePost from "../components/CreatePost";
import Loading from "../components/Loading";
import { Grid, Spinner, Text } from "@chakra-ui/react";
import Post from "../components/Post";
import postsAtom from "../atoms/postsAtom";
import { Helmet } from "react-helmet";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  let post = useRecoilValue(postsAtom);
  let { username } = useParams();
  let currentUser = useRecoilValue(userAtom);
  let navigate = useNavigate();
  useEffect(() => {
    myAxios
      .get("profile/" + username)
      .then(({ data }) => {
        setUser(data.user);
      })
      .catch(({ response }) => {
        navigate("/");
        toast.warn(response.data.message);
      });
  }, [username]);
  useEffect(() => {
    if (user) {
      myAxios
        .get("post/profile/" + user.id)
        .then(({ data }) => {
          setPosts(data.posts);
        })
        .catch(() => {
          setPosts(false);
        });
    }
  }, [user, post]);
  return user ? (
    <>
      <Helmet>
        <title>{user.name.split(" ")[0]}&apos;s Profile</title>
      </Helmet>
      {currentUser.id === user.id && <CreatePost />}
      <UserHeader user={user} />
      {posts ? (
        posts.map((post, index) => (
          <Post post={post} posterId={post.postedBy} key={index} />
        ))
      ) : posts === null ? (
        <Grid placeContent={"center"} py={10}>
          <Spinner size={"xl"} />
        </Grid>
      ) : (
        <Text mt={10} textAlign={"center"}>
          No Posts yet.
        </Text>
      )}
    </>
  ) : (
    <Loading />
  );
}
