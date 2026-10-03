import { Platform } from "react-native";

const DEV_HOST = Platform.OS === "android" ? "192.168.0.175" : "localhost";

export const BASE_URL = `http://${DEV_HOST}:5000`;