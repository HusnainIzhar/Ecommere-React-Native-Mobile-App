import { View, Text } from "react-native";
import React from "react";
import { ManageOrder } from "components/admin/index";
import {
  AdminScreensRouteProps,
  AdminScreens,
} from "navigation/adminNavigator";
import { useRoute } from "@react-navigation/native";
import Loader from "components/ui/loader";

const ManageOrders = () => {
  const id = useRoute<AdminScreensRouteProps<AdminScreens.StackEditProduct>>();
  console.log(id)
  return <>{id ? <ManageOrder id={id.params.param} /> : <Loader />}</>;
};

export default ManageOrders;
