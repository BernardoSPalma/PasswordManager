import { MAIN_DARK_BLUE, MAIN_LIGHT_BLUE, MAIN_WHITE } from '@/constants/Colors';
import { API_URL } from "@/constants/api";
import axios from "axios";
import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    const [showPassword, setShowPassword] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [error, setError] = useState('');
    const { id } = useLocalSearchParams();
    const [isVisible, setIsVisible] = useState(true);
    //editing mode
    const [isEditing, setIsEditing] = useState(false);
    const [serviceName, setServiceName] = useState('')
    const [label, setLabel] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [url, setUrl] = useState('')
    const [notes, setNotes] = useState('')

    useEffect(() => {
        if (id) {
            fetchEntryDetail(Number(id));
        }
    }, [id]);

    async function fetchEntryDetail(id: number) {
        setLoadingDetail(true)
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
            setLoadingDetail(false)
        }
    }

    function handleDismiss() {
        setIsVisible(false);
        setTimeout(() => {
            router.dismiss();
        }, 300)
    }

    //TODO: Nao é necessario alterar o nome, deixar nome como está. Editar apenas outro campos
    function startEditing(){
        if(selectedEntry){
            
        }
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
                        {loadingDetail ? (
                            <ScrollView contentContainerStyle={styles.scrollViewIndicator}>
                                <ActivityIndicator size="large" color={MAIN_LIGHT_BLUE} />
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
                                    <Text style={styles.buttonText}>Edit Entry</Text>
                                </TouchableOpacity>

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
    buttonText: {
        color: MAIN_LIGHT_BLUE,
        fontWeight: 'bold'
    }
})