import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="Home" />
            <Tabs.Screen name="AddPost" />
            <Tabs.Screen name="AllPost" />
            <Tabs.Screen name="Profile" />

            {/* Hide these from tab bar */}
            <Tabs.Screen
                name="UpdatePost"
                options={{ href: null }} // disables tab visibility
            />
            <Tabs.Screen
                name="UserProfile"
                options={{ href: null }} // disables tab visibility
            />
        </Tabs>
    );
}