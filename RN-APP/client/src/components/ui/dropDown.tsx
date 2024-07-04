import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, FlatList } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { IForm } from "types/data";
import { Colors } from "constants/index";

type Props = {
  data: string[];
  setData: React.Dispatch<React.SetStateAction<string>>;
  errors: Partial<IForm>;
  value?: string;
};

export const DropDown: React.FC<Props> = ({ data, setData, errors, value }) => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>("Personal Care .....");

  useEffect(() => {
    if (value) {
      setSelected(value);
    }
  }, [value]);

  return (
    <TouchableOpacity
      onPress={() => setOpen(!open)}
      className={`z-30 relative rounded-md bg-[#E9F6FF] h-10 flex flex-row items-center justify-between  px-2 ${
        errors.category && " border-red-500"
      }`}
    >
      <Text
        style={{
          color: selected === "Personal Care ....." ? Colors.gray2 : "black",
        }}
      >
        {selected}
      </Text>
      {selected !== "Personal Care ....." && (
        <Entypo
          onPress={() => {
            setSelected("Personal Care .....");
            setData("");
          }}
          name="cross"
          size={24}
          color="black"
        />
      )}
      {open && (
        <View className="absolute top-[42px] bg-white w-full rounded-md border border-gray-200">
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelected(item);
                  setData(item);
                  setOpen(false);
                }}
                className="px-5 py-2"
              >
                <Text className="">{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};
