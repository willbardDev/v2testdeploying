'use client';

import React, { useContext, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getToken } from 'firebase/messaging';
import axios from '@/lib/services/config';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import authServices from '@/services/auth-services';
// import { messaging } from '@/app/helpers/init-firebase';
import { AuthConfig, AuthResponse, BasicAuthContextType, TokenMetadata } from '@/types/auth-types';
import { BasicAuthContext } from './BasicAuthContext';

export const useBasicAuth = (): BasicAuthContextType => {
    return useContext(BasicAuthContext);
};

const BasicAuth = ({ children }: { children: React.ReactNode }) => {
    const { setAuthValues, startAuthLoading } = useJumboAuth();
    const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>(null);
    const queryClient = useQueryClient();

    const refreshAuth = async (token = localStorage.getItem("auth-token")) => {
        try {
            const response: AuthResponse = await authServices.getCurrentUser();
            if (response?.authUser?.user?.email) {
                setAuthValues({
                    authToken: token,
                    authUser: response.authUser,
                    authOrganization: response.authOrganization
                });
                return response;
            } else {
                resetAuth();
                return null;
            }
        } catch (error) {
            resetAuth();
            return null;
        }
    };

    const configAuth = async ({
        token = localStorage.getItem("auth-token"),
        OrganizationId = localStorage.getItem("OrganizationId"),
        currentUser = null,
        currentOrganization = null,
        refresh = false
    }: AuthConfig) => {
        if (!token) {
            resetAuth();
            return;
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem("auth-token", token);

        if (OrganizationId && OrganizationId !== localStorage.getItem("OrganizationId")) {
            localStorage.setItem("OrganizationId", OrganizationId);
            axios.defaults.headers.common['X-OrganizationId'] = OrganizationId;
        } else if (currentOrganization?.organization?.id && currentUser) {
            localStorage.setItem("OrganizationId", currentOrganization.organization.id);
            axios.defaults.headers.common['X-OrganizationId'] = currentOrganization.organization.id;
            setAuthValues({
                authToken: token,
                authUser: currentUser,
                authOrganization: currentOrganization
            });
        }

        if ((token && !currentUser) || refresh) {
            await refreshAuth(token);
        }

        if (token) {
            const getLocation = async () => {
                if ('geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            setTokenMetadata((prev: TokenMetadata | null) => ({
                                ...prev,
                                geolocation_accuracy: position.coords.accuracy,
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            }));
                        },
                        (error) => console.error('Error getting location:', error)
                    );
                } else {
                    console.error('Geolocation not available.');
                }
            };

            // const getFCMToken = async () => {
            //     try {
            //         const permission = await Notification.requestPermission();
            //         if (permission === "granted") {
            //             const currentToken = await getToken(messaging, {
            //                 vapidKey: "BE0EDrXQ7XCFZnkE3LpiSS3sag1jXpF3Vzb2c83R8HrRoKTknbDRcKHdCvC4dWjbZRA1zybLep2ozXiIO0oZniw"
            //             });
            //             if (currentToken) {
            //                 setTokenMetadata((prev: TokenMetadata | null) => ({ 
            //                     ...prev, 
            //                     fcm_token: currentToken 
            //                 }));
            //             }
            //         }
            //     } catch (err) {
            //         console.log('Error requesting token:', err);
            //     }
            //     await getLocation();
            // };

            // await getFCMToken();
        }
    };

    const resetAuth = () => {
        queryClient.clear();
        localStorage.removeItem('auth-token');
        localStorage.removeItem('OrganizationId');
        setAuthValues({
            authToken: null,
            authUser: null,
            authOrganization: null
        });
    };

    React.useEffect(() => {
        if (tokenMetadata) {
            authServices.updateAuthTokenMetaData(tokenMetadata);
        }
    }, [tokenMetadata]);

    React.useEffect(() => {
        const token = localStorage.getItem("auth-token");
        axios.defaults.headers.common['X-OrganizationId'] = localStorage.getItem("OrganizationId");
        startAuthLoading();
        token ? configAuth({ token }) : resetAuth();
    }, [setAuthValues, startAuthLoading]);

    const signIn = React.useCallback(async (
        email: string, 
        password: string, 
        successCallback: (data: any) => void, 
        errorCallback: (error: any) => void
    ) => {
        try {
            const response = await authServices.signIn({ email, password });
            if (response?.data?.token) {
                queryClient.clear();
                await configAuth({
                    token: response.data.token,
                    currentUser: response.data.authUser,
                    currentOrganization: response.data?.authOrganization
                });
                setAuthValues({
                    authToken: response.data.token,
                    authUser: response.data.authUser,
                    authOrganization: response.data?.authOrganization
                });
                successCallback(response?.data);
            }
        } catch (error) {
            errorCallback(error);
        }
    }, [setAuthValues, queryClient]);

    const loadOrganization = React.useCallback(async (
        organization_id: string, 
        successCallback: (data: any) => void, 
        errorCallback: (error: any) => void
    ) => {
        try {
            const response = await authServices.loadOrganization({ organization_id });
            if (response?.data?.authOrganization?.organization && response?.data?.authUser?.user) {
                await configAuth({
                    token: response?.data?.token,
                    currentUser: response.data.authUser,
                    currentOrganization: response.data?.authOrganization
                });
            }
            successCallback(response?.data);
        } catch (error) {
            errorCallback(error);
        }
    }, [setAuthValues]);

    const signUp = React.useCallback(async (
        userData: any, 
        successCallback: (data: any) => void, 
        errorCallback: (error: any) => void
    ) => {
        try {
            const res = await authServices.signUp(userData);
            if (res.status === 201) {
                await configAuth({
                    token: res.data.token,
                    currentUser: res.data.authUser
                });
                setAuthValues({
                    authToken: res?.data?.token,
                    authUser: res.data.authUser
                });
                successCallback(res?.data);
            }
        } catch (err) {
            errorCallback(err);
        }
    }, [setAuthValues]);

    const logout = React.useCallback(async () => {
        startAuthLoading();
        await authServices.signOut();
        resetAuth();
    }, [setAuthValues, startAuthLoading]);

    const contextValue = React.useMemo<BasicAuthContextType>(() => ({
        signUp,
        signIn,
        logout,
        configAuth,
        loadOrganization
    }), [signUp, signIn, logout, loadOrganization]);

    return (
        <BasicAuthContext.Provider value={contextValue}>
            {children}
        </BasicAuthContext.Provider>
    );
};

export default BasicAuth;