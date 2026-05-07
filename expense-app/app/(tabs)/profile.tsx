import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

type UserProfile = {
    userId: number;
    username: string;
    email: string;
    displayName: string | null;
    profilePictureUrl: string | null;
    role: string;
    isActive: boolean;
};

const API_BASE_URL = 'http://localhost:9090';

export default function ProfileScreen() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/me`, {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`Profile request failed: ${response.status}`);
                }

                const data: UserProfile = await response.json();
                setUser(data);
            } catch (error) {
                console.warn('Profile fetch failed:', error);

                setUser({
                    userId: 0,
                    username: 'demo.user',
                    email: 'demo@example.com',
                    displayName: 'Demo User',
                    profilePictureUrl: null,
                    role: 'USER',
                    isActive: true,
                });
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const displayName = user?.displayName || user?.username || 'Demo User';
    const email = user?.email || 'demo@example.com';
    const username = user?.username || 'demo.user';
    const role = user?.role || 'USER';
    const isActive = user?.isActive ?? true;

    const handleLogout = () => {
        window.location.href = 'http://localhost:9090/logout';
    };

    return (
        <View style={styles.page}>
            <View style={styles.topBar}>
                <Pressable style={styles.backButton} onPress={() => router.push('/dashboard')}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </Pressable>

                <Text style={styles.brand}>Rocket Currency</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <View style={styles.profileHeader}>
                        {user?.profilePictureUrl ? (
                            <Image source={{ uri: user.profilePictureUrl }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarFallback}>
                                <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
                            </View>
                        )}

                        <View style={styles.profileInfo}>
                            <Text style={styles.pageLabel}>PROFILE</Text>
                            <Text style={styles.name}>{loading ? 'Loading...' : displayName}</Text>
                            <Text style={styles.email}>{email}</Text>
                        </View>
                    </View>

                    <View style={styles.infoGrid}>
                        <View style={styles.infoBox}>
                            <Text style={styles.label}>Username</Text>
                            <Text style={styles.value}>{username}</Text>
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={styles.label}>Email</Text>
                            <Text style={styles.value}>{email}</Text>
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={styles.label}>Role</Text>
                            <Text style={styles.value}>{role}</Text>
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={styles.label}>Account Status</Text>
                            <Text style={styles.value}>{isActive ? 'Active' : 'Inactive'}</Text>
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={styles.label}>Authentication</Text>
                            <Text style={styles.value}>Google / GitHub OAuth</Text>
                        </View>
                    </View>

                    <Pressable style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#f7f7f8',
    },
    topBar: {
        height: 72,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        backgroundColor: '#0056a8',
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 10,
        marginRight: 12,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
    brand: {
        fontSize: 20,
        fontWeight: '700',
        color: '#003f7f',
    },
    content: {
        flex: 1,
        padding: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '100%',
        maxWidth: 680,
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 24,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 28,
    },
    avatar: {
        width: 84,
        height: 84,
        borderRadius: 42,
        marginRight: 18,
    },
    avatarFallback: {
        width: 84,
        height: 84,
        borderRadius: 42,
        marginRight: 18,
        backgroundColor: '#0056a8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '800',
    },
    profileInfo: {
        flex: 1,
    },
    pageLabel: {
        fontSize: 12,
        color: '#6b7280',
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    name: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
    },
    email: {
        fontSize: 15,
        color: '#6b7280',
        marginTop: 4,
    },
    infoGrid: {
        marginBottom: 8,
    },
    infoBox: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 14,
    },
    label: {
        fontSize: 13,
        color: '#6b7280',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    logoutButton: {
        backgroundColor: '#0056a8',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 18,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
