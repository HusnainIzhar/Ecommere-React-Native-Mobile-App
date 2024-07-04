import { Colors } from "constants/index";
import { ActivityIndicator, View } from "react-native";

type Props = {};

const Loader = () => {
  return (
    <>
      <View className="flex-1 bg-white">
        <View className="flex-1 flex items-center justify-center">
          <ActivityIndicator size={"large"} color={Colors.primary}/>
        </View>
      </View>
    </>
  );
};

export default Loader;
