let user = "";
export const ProtectedRoute = () => {
  if (user !
    == "") {
    return true;
  } else {
    return false;
  }
};
