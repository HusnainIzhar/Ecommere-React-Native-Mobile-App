import React, { FC } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

type Props = {
    tags: string[];
}

const CategoryHeading: FC<Props> = ({ tags }) => {
    return (
        <View className="mt-5">
            <View className="flex flex-row items-center justify-between">
                <Text className="text-lg font-semibold">Categories</Text>
                <Text className="font-semibold">See all</Text>
            </View>
            <View className="mt-2">
                <FlatList
                    data={tags}
                    horizontal
                    renderItem={({ item }) => (
                        <TouchableOpacity className="bg-gray-200 px-2 py-1 rounded-md">
                            <Text className="capitalize">{item}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ columnGap: 8 }}
                />
            </View>
        </View>
    );
}

export default CategoryHeading;
