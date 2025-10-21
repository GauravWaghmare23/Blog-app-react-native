// context/AuthGate.js
import { useAuth } from "./authContext";
import { Redirect } from "expo-router";

export default function AuthGate() {
    const { user } = useAuth();

    if (user === undefined) return null; // still loading
    return user ? <Redirect href="/(tabs)/Home" /> : <Redirect href="/Login" />;
}