import AuthGate from "../context/AuthGate";
import { View, Text } from "react-native";

export default function Index() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Checking authentication...</Text>
            <AuthGate />
        </View>
    );
}