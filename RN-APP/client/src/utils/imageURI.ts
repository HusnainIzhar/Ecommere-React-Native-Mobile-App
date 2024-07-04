import * as FileSystem from "expo-file-system";

export const convertImageToDataUri = async (imageUri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    const { uri } = fileInfo;
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const dataUri = `data:image/jpeg;base64,${base64}`;
    return dataUri;
  } catch (error) {
    console.error("Error converting image to data URI:", error);
    throw error;
  }
};
