import { MAIN_CANCEL_RED, MAIN_DARK_BLUE, MAIN_LIGHT_BLUE, MAIN_SAVE_GREEN, MAIN_WHITE } from '@/constants/Colors';
import { API_URL } from "@/constants/api";
import axios from "axios";
import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

type EntryDetail = {
    id: number,
    name: string,
    username: string,
    password: string,
    url: string,
    notes: string,
}

export default function CreateDetailsScreen() {
    const [selectedEntry, setSelectedEntry] = useState<EntryDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { id } = useLocalSearchParams();
    const [isVisible, setIsVisible] = useState(true);
    //editing mode
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [url, setUrl] = useState('')
    const [notes, setNotes] = useState('')
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        if (id) {
            fetchEntryDetail(Number(id));
        }
    }, [id]);

    async function fetchEntryDetail(id: number) {
        setLoading(true)
        const token = await SecureStore.getItemAsync('token')
        const masterPassword = await SecureStore.getItemAsync('masterPassword')
        try {
            const response = await axios.get(`${API_URL}/api/entries/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-Master-Password': masterPassword
                }
            });
            setSelectedEntry(response.data)
        } catch (error) {
            setError('Error trying to get the details')
        }
        finally {
            setLoading(false)
        }
    }

    function handleDismiss() {
        setIsVisible(false);
        setTimeout(() => {
            router.dismiss();
        }, 300)
    }

    function startEditing() {
        if (selectedEntry) {
            setUsername(selectedEntry.username)
            setPassword(selectedEntry.password)
            setUrl(selectedEntry.url || '')
            setNotes(selectedEntry.notes || '')
            setIsEditing(true)
        }
    }

    async function editEntry() {
        setSubmitted(true)
        if (!username || !password) {
            setError('Please fill all the required fields')
            return;
        }
        setError('')
        setLoading(true)
        const token = await SecureStore.getItemAsync('token')
        const masterPassword = await SecureStore.getItemAsync('masterPassword')

        try {
            await axios.put(`${API_URL}/api/entries/${id}`, {
                username: username,
                password: password,
                url: url,
                notes: notes
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-Master-Password': masterPassword
                }
            });
            fetchEntryDetail(Number(id))
        }
        catch {
            setError('An error ocurred while trying to update password entry')
            setSubmitted(false)
        }
        finally {
            setIsEditing(false)
            setLoading(false)
            setError('')
        }
    }

    function cancelEdit(){
        setError('')
        setSubmitted(false)
        setIsEditing(false)
    }

    return (
        <View style={styles.transparentContainer}>

            <BlurView
                intensity={30}
                tint="dark"
                style={StyleSheet.absoluteFill}
                experimentalBlurMethod="dimezisBlurView"
            />

            <TouchableOpacity
                style={StyleSheet.absoluteFill}
                onPress={handleDismiss}
                activeOpacity={1}
            />

            {isVisible && (
                <Animated.View
                    entering={SlideInDown.springify().damping(85)}
                    exiting={SlideOutDown.springify().damping(85)}
                    style={styles.card}>
                    <KeyboardAvoidingView
                        style={styles.container}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        {loading ? (
                            <ScrollView contentContainerStyle={styles.scrollViewIndicator}>
                                <ActivityIndicator size="large" color={MAIN_LIGHT_BLUE} />
                            </ScrollView>
                        ) : isEditing ? (
                            <ScrollView contentContainerStyle={styles.scrollView}>
                                <Text style={styles.title}>Details</Text>
                                <Text style={styles.smallerTitle}>{selectedEntry?.name}</Text>


                                <Text style={[styles.detailName]}>Username <Text style={styles.required}>*</Text></Text>
                                <TextInput
                                    style={[styles.input, submitted && !username && styles.inputError]}
                                    value={username}
                                    onChangeText={setUsername}
                                    placeholder="Email/Username" />


                                <Text style={styles.detailName}>Password <Text style={styles.required}>*</Text></Text>
                                <TextInput
                                    style={[styles.input, submitted && !password && styles.inputError]}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Password" />


                                <Text style={styles.detailName}>URL</Text>
                                <TextInput
                                    style={styles.input}
                                    value={url}
                                    onChangeText={setUrl}
                                    placeholder="Url" />


                                <Text style={styles.detailName}>Notes</Text>
                                <TextInput
                                    style={styles.input}
                                    value={notes}
                                    onChangeText={setNotes}
                                    placeholder="Notes" />

                                {error ? <Text
                                    style={styles.error}>{error}
                                </Text> : null}

                                <View style={styles.buttonsView}>
                                    <TouchableOpacity
                                        style={styles.buttonSave}
                                        onPress={editEntry}>
                                        <Text style={styles.buttonSaveText}>Save</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.buttonCancel}
                                        onPress={cancelEdit}>
                                        <Text style={styles.buttonCancelText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>

                            </ScrollView>

                        ) : (
                            <ScrollView contentContainerStyle={styles.scrollView}>
                                <Text style={styles.title}>Details</Text>
                                <Text style={styles.smallerTitle}>{selectedEntry?.name}</Text>

                                <Text style={styles.detailName}>Username</Text>
                                <Text style={styles.text}>{selectedEntry?.username}</Text>

                                <Text style={styles.detailName}>Password</Text>
                                <Text style={styles.text}>{selectedEntry?.password}</Text>

                                {selectedEntry?.url && (
                                    <View>
                                        <Text style={styles.detailName}>URL</Text>
                                        <Text style={styles.text}>{selectedEntry?.url}</Text>
                                    </View>
                                )}

                                {selectedEntry?.notes && (
                                    <View>
                                        <Text style={styles.detailName}>Notes</Text>
                                        <Text style={styles.text}>{selectedEntry?.notes}</Text>
                                    </View>
                                )}

                                <TouchableOpacity style={styles.editButton}>
                                    <Text
                                        style={styles.buttonText}
                                        onPress={startEditing}>
                                        Edit Entry</Text>
                                </TouchableOpacity>

                                <Text style={styles.deleteText}>Delete Entry</Text>

                            </ScrollView>
                        )}

                    </KeyboardAvoidingView>
                </Animated.View>

            )}
        </View>
    )
}

const styles = StyleSheet.create({
    transparentContainer: {
        justifyContent: 'flex-end',
        flex: 1,
        alignItems: 'center',
    },
    card: {
        height: '60%',
        width: '95%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    container: {
        flex: 1,
        borderRadius: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8
    },
    scrollView: {
        paddingTop: 10,
        paddingHorizontal: 30,
        flexGrow: 1,
        backgroundColor: MAIN_WHITE,
        borderRadius: 15,
    },
    scrollViewIndicator: {
        paddingTop: 10,
        paddingHorizontal: 30,
        flexGrow: 1,
        backgroundColor: MAIN_WHITE,
        borderRadius: 15,
        justifyContent: 'center'
    },
    title: {
        color: MAIN_LIGHT_BLUE,
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center'
    },
    smallerTitle: {
        color: MAIN_DARK_BLUE,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 25
    },
    text: {
        color: '#000',
        fontSize: 14,
        paddingBottom: 15
    },
    detailName: {
        fontWeight: 'bold',
        color: MAIN_LIGHT_BLUE,
        fontSize: 16
    },
    editButton: {
        alignSelf: 'center',
        width: '40%',
        marginTop: 25,
        backgroundColor: MAIN_WHITE,
        borderWidth: 2,
        borderColor: MAIN_LIGHT_BLUE,
        padding: 10,
        alignItems: 'center',
        borderRadius: 8,
        elevation: 4,
        shadowColor: MAIN_LIGHT_BLUE,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6
    },
    buttonSave: {
        alignSelf: 'center',
        width: '40%',
        marginTop: 10,
        marginBottom: 25,
        marginHorizontal: 7,
        backgroundColor: MAIN_WHITE,
        borderWidth: 2,
        borderColor: MAIN_SAVE_GREEN,
        padding: 10,
        alignItems: 'center',
        borderRadius: 8,
        elevation: 4,
        shadowColor: MAIN_SAVE_GREEN,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6
    },
    buttonCancel: {
        alignSelf: 'center',
        width: '40%',
        marginTop: 10,
        marginBottom: 25,
        marginHorizontal: 7,
        backgroundColor: MAIN_WHITE,
        borderWidth: 2,
        borderColor: MAIN_CANCEL_RED,
        padding: 10,
        alignItems: 'center',
        borderRadius: 8,
        elevation: 4,
        shadowColor: MAIN_CANCEL_RED,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6
    },
    buttonText: {
        color: MAIN_LIGHT_BLUE,
        fontWeight: 'bold'
    },
    buttonSaveText: {
        color: MAIN_SAVE_GREEN,
        fontWeight: 'bold'
    },
    buttonCancelText: {
        color: MAIN_CANCEL_RED,
        fontWeight: 'bold'
    },
    input: {
        width: '80%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15
    },
    buttonsView: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    deleteText: {
        color: MAIN_CANCEL_RED,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: 25,
        textDecorationLine: 'underline'
    },
    required: {
        color: 'red',
        fontWeight: 'normal'
    },
    error: {
        color: 'red',
        marginBottom: 10,
        alignSelf: 'center'
    },
    inputError: {
        borderColor: 'red',
    },
})