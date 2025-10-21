import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { db, auth } from '../../firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const AddPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Calculate character count color based on length
    const getCharCountColor = () => {
        const length = content.length;
        if (length > 800) return '#DC3545';
        if (length > 500) return '#FFC107';
        return '#6C757D';
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            if (!title.trim() || !content.trim()) {
                Alert.alert('Error', 'Please fill all fields');
                return;
            }

            if (!auth.currentUser) {
                Alert.alert('Error', 'You must be logged in to create a post');
                return;
            }

            const postData = {
                title: title.trim(),
                content: content.trim(),
                userId: auth.currentUser.uid,
                timestamp: serverTimestamp(),
                createdAt: new Date().toISOString(),
            };

            await addDoc(collection(db, 'posts'), postData);
            Alert.alert('Success', 'Post created successfully!');
            router.replace('/(tabs)/AllPost');
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to create post');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Post</Text>
                <TouchableOpacity
                    style={[styles.sendButton, (!title.trim() || !content.trim()) && styles.sendButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={!title.trim() || !content.trim() || isSubmitting}
                >
                    <Ionicons
                        name="send"
                        size={20}
                        color={(!title.trim() || !content.trim()) ? "#CCCCCC" : "#FFFFFF"}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {auth.currentUser?.email?.[0].toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.onlineIndicator} />
                    </View>
                    <View>
                        <Text style={styles.username}>
                            {auth.currentUser?.email?.split('@')[0]}
                        </Text>
                        <Text style={styles.postType}>Public post</Text>
                    </View>
                </View>

                <TextInput
                    placeholder="What's the title of your post?"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.titleInput}
                    maxLength={100}
                    editable={!isSubmitting}
                    placeholderTextColor="#999"
                />

                <TextInput
                    placeholder="Share your thoughts..."
                    value={content}
                    onChangeText={setContent}
                    style={styles.contentInput}
                    multiline
                    maxLength={1000}
                    editable={!isSubmitting}
                    placeholderTextColor="#999"
                />

                <View style={styles.footer}>
                    <View style={styles.footerActions}>
                        <TouchableOpacity style={styles.footerButton}>
                            <Ionicons name="image-outline" size={24} color="#666" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.footerButton}>
                            <Ionicons name="location-outline" size={24} color="#666" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.footerButton}>
                            <Ionicons name="happy-outline" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.charCount, { color: getCharCountColor() }]}>
                        {content.length}/1000
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 56,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    sendButton: {
        backgroundColor: '#0095F6',
        padding: 8,
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#F0F0F0',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    postType: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    titleInput: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        color: '#1A1A1A',
    },
    contentInput: {
        fontSize: 16,
        lineHeight: 24,
        flex: 1,
        textAlignVertical: 'top',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        marginBottom: 16,
        color: '#1A1A1A',
        minHeight: 120,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    footerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerButton: {
        padding: 8,
        marginRight: 16,
    },
    charCount: {
        fontSize: 14,
        fontWeight: '500',
    }
});

export default AddPost;