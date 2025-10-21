import { useEffect, useState } from "react";
import { View, TextInput, Button, StyleSheet, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db, storage } from "../../firebase.config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "react-native-uuid";

export default function UpdatePost() {
    const { id } = useLocalSearchParams();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null); // local URI
    const [existingImageUrl, setExistingImageUrl] = useState(""); // from Firestore
    const router = useRouter();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const docRef = doc(db, "posts", id);
                const docSnap = await getDoc(docRef);
                const data = docSnap.data();
                setTitle(data.title);
                setContent(data.content);
                setExistingImageUrl(data.imageUrl || "");
            } catch (error) {
                alert("Error loading post: " + error.message);
            }
        };
        fetchPost();
    }, [id]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleUpdate = async () => {
        let imageUrl = existingImageUrl;

        if (image) {
            const response = await fetch(image);
            const blob = await response.blob();
            const imageRef = ref(storage, `images/${uuid.v4()}`);
            await uploadBytes(imageRef, blob);
            imageUrl = await getDownloadURL(imageRef);
        }

        try {
            await updateDoc(doc(db, "posts", id), {
                title,
                content,
                imageUrl,
            });
            router.replace("/(tabs)/AllPost");
        } catch (error) {
            alert("Error updating post: " + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />
            <TextInput
                placeholder="Content"
                value={content}
                onChangeText={setContent}
                style={[styles.input, styles.textArea]}
                multiline
            />
            <Button title="Change Image" onPress={pickImage} />
            {(image || existingImageUrl) && (
                <Image
                    source={{ uri: image || existingImageUrl }}
                    style={styles.image}
                />
            )}
            <Button title="Update Post" onPress={handleUpdate} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, backgroundColor: "#fff" },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    image: {
        width: "100%",
        height: 200,
        marginVertical: 15,
        borderRadius: 10,
    },
});