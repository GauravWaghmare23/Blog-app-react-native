import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from "react-native";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase.config";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

export default function AllPost() {
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const fetchPosts = async () => {
        try {
            const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);
            const postsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(postsData);
        } catch (error) {
            alert("Error loading posts: " + error.message);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPosts();
        setRefreshing(false);
    };

    const renderPost = ({ item }) => (
        <View style={styles.postCard}>
            <TouchableOpacity
                style={styles.postHeader}
                onPress={() => router.push(`/(tabs)/UserProfile?id=${item.userId}`)}
            >
                <View style={styles.posterInfo}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {item.userId?.[0]?.toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.onlineIndicator} />
                    </View>
                    <View>
                        <Text style={styles.username}>@{item.userId?.slice(0, 6)}</Text>
                        <Text style={styles.timestamp}>
                            {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
                </TouchableOpacity>
            </TouchableOpacity>

            <View style={styles.postContent}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postText}>{item.content}</Text>
            </View>

            <View style={styles.postStats}>
                <Text style={styles.statsText}>2.4k likes</Text>
                <Text style={styles.statsText}>•</Text>
                <Text style={styles.statsText}>482 comments</Text>
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

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="share-social-outline" size={24} color="#666" />
                    <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>NewsFeed</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="search-outline" size={24} color="#0095F6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => router.push("/(tabs)/AddPost")}
                    >
                        <Ionicons name="create-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={item => item.id}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        padding: 8,
        marginRight: 8,
    },
    createButton: {
        backgroundColor: '#0095F6',
        padding: 8,
        borderRadius: 12,
    },
    listContainer: {
        padding: 12,
    },
    postCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
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
    moreButton: {
        padding: 4,
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
    postStats: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingBottom: 12,
    },
    statsText: {
        fontSize: 14,
        color: '#666',
        marginRight: 8,
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
});