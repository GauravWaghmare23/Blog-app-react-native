import { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Image, StyleSheet, Alert } from "react-native";
import { auth, db } from "../../firebase.config";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function Profile() {
    const [posts, setPosts] = useState([]);
    const router = useRouter();

    const fetchMyPosts = async () => {
        const q = query(collection(db, "posts"), where("userId", "==", auth.currentUser.uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data(),
        }));
        setPosts(data);
    };

    useEffect(() => {
        fetchMyPosts();
    }, []);

    const handleDelete = async (id) => {
        Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    await deleteDoc(doc(db, "posts", id));
                    fetchMyPosts(); // refresh
                },
            },
        ]);
    };

    const handleLogout = async () => {
        await auth.signOut();
        router.replace("/Login");
    };

    const renderItem = ({ item }) => (
        <View style={styles.postCard}>
            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.content}</Text>
            <View style={styles.actions}>
                <Button title="Edit" onPress={() => router.push(`/UpdatePost/${item.id}`)} />
                <Button title="Delete" onPress={() => handleDelete(item.id)} color="red" />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>My Profile</Text>
            <Text>Email: {auth.currentUser.email}</Text>
            <Text>User ID: {auth.currentUser.uid}</Text>
            <Button title="Logout" onPress={handleLogout} color="#444" />
            <Text style={styles.subheading}>My Posts</Text>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, backgroundColor: "#fff" },
    heading: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
    subheading: { fontSize: 20, marginVertical: 15 },
    list: { paddingBottom: 100 },
    postCard: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
    },
    image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 10 },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
    actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
});