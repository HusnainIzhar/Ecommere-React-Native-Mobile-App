import React from "react";
import { View, StatusBar } from "react-native";
import Login from "../components/ui/login";
import Main from "../components/home/Main";
import { Protected } from "hooks/protected";

const Home = () => {
  return (
    <>
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />
      <Protected children={<Main />} />
    </>
  );
};

export default Home;
