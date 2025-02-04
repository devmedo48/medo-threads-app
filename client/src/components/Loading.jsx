import { Grid, useColorMode } from "@chakra-ui/react";
import { ClimbingBoxLoader } from "react-spinners";

export default function Loading() {
  let { colorMode } = useColorMode();
  return (
    <>
      <Grid
        position={"fixed"}
        top={0}
        left={0}
        placeContent={"center"}
        minH={"100vh"}
        w={"full"}
        className="loading"
        zIndex={1000}
      >
        <ClimbingBoxLoader color={colorMode === "dark" ? "white" : "#1e1e1e"} />
      </Grid>
    </>
  );
}
