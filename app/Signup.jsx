import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useAuth } from "../context/authContext";
import { useRouter } from "expo-router";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { register } = useAuth();
    const router = useRouter();

    const handleSignup = async () => {
        try {
            await register(email, password);
            router.replace("/(tabs)/Home");
        } catch (error) {
            alert("Signup failed: " + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Signup</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
            <Button title="Sign Up" onPress={handleSignup} />
            <Text onPress={() => router.push("/Login")} style={styles.link}>Already have an account? Log in</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, justifyContent: "center" },
    title: { fontSize: 24, marginBottom: 20 },
    input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
    link: { marginTop: 10, color: "blue" }
});