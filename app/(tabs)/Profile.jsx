import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebase.config";

export default function Profile() {
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
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

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchMyPosts();
        setRefreshing(false);
    };

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
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    await auth.signOut();
                    router.replace("/Login");
                },
            },
        ]);
    };

    const renderItem = ({ item }) => (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                <View style={styles.posterInfo}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {auth.currentUser.email[0].toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.onlineIndicator} />
                    </View>
                    <View>
                        <Text style={styles.username}>{auth.currentUser.email.split('@')[0]}</Text>
                        <Text style={styles.timestamp}>
                            {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}

            <View style={styles.postContent}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postText}>{item.content}</Text>
            </View>

            <View style={styles.postActions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="heart-outline" size={24} color="#666" />
                    <Text style={styles.actionText}>Like</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="chatbubble-outline" size={22} color="#666" />
                    <Text style={styles.actionText}>Comment</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => router.push(`/UpdatePost/${item.id}`)}>
                    <Ionicons name="create-outline" size={24} color="#666" />
                    <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                    <Text style={[styles.actionText, { color: "#FF3B30" }]}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListHeaderComponent={() => (
                    <View style={styles.profileSection}>
                        <View style={styles.profileHeader}>
                            <View style={styles.profileAvatarContainer}>
                                <View style={styles.profileAvatar}>
                                    <Text style={styles.profileAvatarText}>
                                        {auth.currentUser.email[0].toUpperCase()}
                                    </Text>
                                </View>
                                <View style={styles.onlineIndicatorLarge} />
                            </View>
                            <View style={styles.statsContainer}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>{posts.length}</Text>
                                    <Text style={styles.statLabel}>Posts</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>1.2k</Text>
                                    <Text style={styles.statLabel}>Followers</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>348</Text>
                                    <Text style={styles.statLabel}>Following</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.userName}>{auth.currentUser.email.split('@')[0]}</Text>
                            <Text style={styles.userBio}>Digital creator sharing thoughts and experiences</Text>
                            <TouchableOpacity style={styles.editButton}>
                                <Text style={styles.editButtonText}>Edit Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    logoutButton: {
        padding: 8,
    },
    listContainer: {
        paddingBottom: 20,
    },
    profileSection: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginBottom: 12,
        borderRadius: 16,
        margin: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileAvatarContainer: {
        position: 'relative',
        marginRight: 20,
    },
    profileAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#0095F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileAvatarText: {
        fontSize: 40,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    onlineIndicatorLarge: {
        position: 'absolute',
        right: 4,
        bottom: 4,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#4CAF50',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    statsContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    statLabel: {
        color: '#666',
        fontSize: 13,
        marginTop: 2,
    },
    profileInfo: {
        alignItems: 'flex-start',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    userBio: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        lineHeight: 20,
    },
    editButton: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DBDBDB',
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    editButtonText: {
        fontWeight: '600',
        color: '#1A1A1A',
    },
    postCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        margin: 12,
        marginTop: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    postHeader: {
        padding: 16,
    },
    posterInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#0095F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    onlineIndicator: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    avatarText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 18,
    },
    username: {
        fontWeight: '700',
        fontSize: 15,
        color: '#1A1A1A',
    },
    timestamp: {
        color: '#666',
        fontSize: 13,
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 16,
        marginBottom: 0,
    },
    postContent: {
        padding: 16,
        paddingTop: 0,
    },
    postTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    postText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#4A4A4A',
    },
    postActions: {
        flexDirection: 'row',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F2F5',
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    actionText: {
        marginLeft: 6,
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
    },
    moreButton: {
        padding: 8,
    },
});
