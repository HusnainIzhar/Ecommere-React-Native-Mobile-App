import React from "react";
import { AddProductAdmin } from "components/admin";
import { useRoute } from "@react-navigation/native";
import {
  AdminScreensRouteProps,
  AdminScreens,
} from "navigation/adminNavigator";

const EditProduct = () => {
  const id = useRoute<AdminScreensRouteProps<AdminScreens.StackEditProduct>>();
  return <AddProductAdmin id={id.params.param} />;
};

export default EditProduct;
