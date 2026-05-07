import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SignupScreen() {
    const handleGoogleSignup = () => {
        Linking.openURL('http://localhost:9090/oauth2/authorization/google');
    };

    const handleGithubSignup = () => {
        Linking.openURL('http://localhost:9090/oauth2/authorization/github');
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Create your account</Text>
                <Text style={styles.subtitle}>Start tracking your expenses with a secure account.</Text>

                <TextInput style={styles.input} placeholder="Username" autoCapitalize="none" />
                <TextInput style={styles.input} placeholder="Password" secureTextEntry />

                <Pressable style={[styles.button, styles.disabledButton]} disabled>
                    <Text style={styles.buttonText}>Create Account</Text>
                </Pressable>

                <Text style={styles.dividerText}>Or continue with</Text>

                <Pressable style={styles.oauthButton} onPress={handleGoogleSignup}>
                    <View style={styles.oauthButtonContent}>
                        <Image source={require('../assets/images/google.png')} style={styles.logo} />
                        <Text style={styles.oauthButtonText}>Sign up with Google</Text>
                    </View>
                </Pressable>

                <Pressable style={[styles.oauthButton, styles.secondaryButton]} onPress={handleGithubSignup}>
                    <View style={styles.oauthButtonContent}>
                        <Image
                            source={require('../assets/images/GitHub_Invertocat_Black.png')}
                            style={styles.logo}
                        />
                        <Text style={styles.oauthButtonText}>Sign up with GitHub</Text>
                    </View>
                </Pressable>

                <Pressable style={styles.linkButton} onPress={() => router.push('/')}>
                    <Text style={styles.linkText}>Already have an account? Log in</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    card: {
        width: '100%',
        maxWidth: 420,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#111827',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#9ca3af',
        marginTop: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    dividerText: {
        textAlign: 'center',
        color: '#666',
        marginVertical: 18,
        fontSize: 14,
    },
    oauthButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    secondaryButton: {
        marginTop: 12,
    },
    oauthButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
        marginRight: 10,
    },
    oauthButtonText: {
        color: '#111827',
        fontSize: 16,
        fontWeight: '600',
    },
    linkButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#2563eb',
        fontSize: 15,
        fontWeight: '500',
    },
});