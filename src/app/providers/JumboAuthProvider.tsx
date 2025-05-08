'use client'

import axios from '@/lib/services/config';
import React, { createContext, useContext, useEffect, useReducer, useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getToken } from 'firebase/messaging';
import { messaging } from '@/app/helpers/init-firebase';
import authServices from '@/services/auth-services';
import { AuthOrganization } from '@/types/auth-types';

interface AuthUser {
  user:{
    id: string;
    name: string;
    email: string;
  }
  permissions?: string[];
  organization_roles?: Array<{ name: string }>;
  [key: string]: any;
}

interface AuthState {
  authToken: string | null;
  authUser: AuthUser | null;
  authOrganization: AuthOrganization | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  onlyAuthAccessData: {
    routes: string[];
    fallbackPath: string;
  };
  onlyNotAuthAccessData: {
    routes: string[];
    fallbackPath: string | null;
  };
}

interface TokenMetadata {
  latitude?: number;
  longitude?: number;
  geolocation_accuracy?: number;
  fcm_token?: string;
}

interface AuthConfig {
  token?: string | null;
  OrganizationId?: string | null;
  currentUser?: AuthUser | null;
  currentOrganization?: AuthOrganization | null;
  refresh?: boolean;
}

interface AuthResponse {
  token?: string;
  authUser?: {
    user: AuthUser;
    permissions?: string[];
    organization_roles?: Array<{ name: string }>;
  };
  authOrganization?: AuthOrganization;
  [key: string]: any;
}

interface AuthContextType extends AuthState {
  authData: AuthState;
  setAuthValues: (values: Partial<AuthState>, options?: { persist?: boolean }) => void;
  startAuthLoading: () => void;
  stopAuthLoading: () => void;
  setOnlyAuthAccessData: (data: Partial<AuthState['onlyAuthAccessData']>) => void;
  setOnlyNotAuthAccessData: (data: Partial<AuthState['onlyNotAuthAccessData']>) => void;
  checkPermission: (permissions: string | string[], mustHaveAll?: boolean) => boolean;
  checkOrganizationPermission: (permissions: string | string[], mustHaveAll?: boolean) => boolean;
  organizationHasSubscribed: (modules: string | string[], mustHaveAll?: boolean) => boolean;
  moduleSetting: (setting: { module_id: string; id: string }) => any;
  hasOrganizationRole: (roles: string | string[], mustHaveAll?: boolean) => boolean;
  refreshAuth: () => Promise<AuthResponse | null>;
  configAuth: (config: AuthConfig) => Promise<void>;
  resetAuth: () => void;
  loadOrganization: (
    organization_id: string,
    successCallback: (data: any) => void,
    errorCallback: (error: any) => void
  ) => Promise<void>;
}

// Context
const AuthContext = createContext<AuthContextType | null>(null);

// Initial state function
const init = (restProps: any): AuthState => {
  const storedData = typeof window !== 'undefined' ? localStorage.getItem('authData') : null;
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const parsedData = storedData ? JSON.parse(storedData) : null;

  return {
    authToken: token,
    authUser: parsedData?.authUser || null,
    authOrganization: parsedData?.authOrganization || null,
    isLoading: true,
    isAuthenticated: false,
    onlyAuthAccessData: {
      routes: restProps?.onlyAuthAccessData?.routes ?? [],
      fallbackPath: restProps?.onlyAuthAccessData?.fallbackPath ?? "/"
    },
    onlyNotAuthAccessData: {
      routes: restProps?.onlyNotAuthAccessData?.routes ?? [],
      fallbackPath: restProps?.onlyNotAuthAccessData?.fallbackPath ?? null
    },
  };
};

// Reducer
const authReducer = (state: AuthState, action: any): AuthState => {
  switch (action.type) {
    case "set-auth-values":
      const { authToken = null, authUser = state.authUser, authOrganization = null, ...restValues } = action.payload;

      if (!authUser && !authToken) {
        return {
          ...state,
          authToken: null,
          authUser: null,
          authOrganization: null,
          isLoading: false,
          isAuthenticated: false,
        };
      }
      return {
        ...state,
        authUser,
        authToken,
        authOrganization,
        isLoading: false,
        isAuthenticated: !!authUser && !!authToken,
        ...restValues
      };

    case "set-only-auth-access-data":
      return {
        ...state,
        onlyAuthAccessData: {
          ...state.onlyAuthAccessData,
          ...action.payload?.onlyAuthAccessData
        },
      };

    case "set-only-not-auth-access-data":
      return {
        ...state,
        onlyNotAuthAccessData: {
          ...state.onlyNotAuthAccessData,
          ...action.payload?.onlyNotAuthAccessData
        }
      };

    case "start-loading":
      return {
        ...state,
        isLoading: true,
      };

    case "stop-loading":
      return {
        ...state,
        isLoading: false,
      };

    default:
      console.error(`Invalid action type: ${action.type}`);
      return state;
  }
};

// Helper function to get stored auth data
const getStoredAuthData = () => {
  const storedData = localStorage.getItem('authData')

  return storedData ? JSON.parse(storedData) : null;
};

export const JumboAuthProvider = ({ 
  children,
  providerComponent: ProviderComponent = React.Fragment,
  providerProps = {},
  ...restProps
}: {
  children: React.ReactNode;
  providerComponent?: React.ComponentType<any>;
  providerProps?: any;
  [key: string]: any;
}) => {
  const [authData, dispatch] = useReducer(authReducer, {
    ...init(restProps),
    isLoading: true
  });
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>(null);
  const queryClient = useQueryClient();

  // Helper functions
  const setAuthValues = useCallback((values: Partial<AuthState>, options: { persist?: boolean } = { persist: true }) => {
    dispatch({
      type: "set-auth-values",
      payload: values
    });

    if (options.persist && values.authToken) {
      const authDataToStore = {
        authToken: values.authToken,
        authUser: values.authUser,
        authOrganization: values.authOrganization
      };

      localStorage.setItem('authData', JSON.stringify(authDataToStore));
      localStorage.setItem('auth_token', values.authToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${values.authToken}`;
    } else if (!values.authToken) {
      localStorage.removeItem('authData');
      localStorage.removeItem('auth_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [authData.authUser, authData.authOrganization]);

  const startAuthLoading = useCallback(() => {
    dispatch({ type: "start-loading" });
  }, []);

  const stopAuthLoading = useCallback(() => {
    dispatch({ type: "stop-loading" });
  }, []);

  const setOnlyAuthAccessData = useCallback((data: Partial<AuthState['onlyAuthAccessData']>) => {
    dispatch({
      type: "set-only-auth-access-data",
      payload: { onlyAuthAccessData: data }
    });
  }, []);

  const setOnlyNotAuthAccessData = useCallback((data: Partial<AuthState['onlyNotAuthAccessData']>) => {
    dispatch({
      type: "set-only-not-auth-access-data",
      payload: { onlyNotAuthAccessData: data }
    });
  }, []);

  // Auth functions
  const refreshAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response: AuthResponse = await authServices.getCurrentUser();

      if (response?.authUser?.user?.email) {
        const authUser: AuthUser = {
          ...response.authUser,
          user: {
            id: response.authUser.user.id,
            name: response.authUser.user.name,
            email: response.authUser.user.email
          },
          permissions: response.authUser.permissions || [],
        };

        setAuthValues({
          authToken: token,
          authUser: authUser,
          authOrganization: response.authOrganization
        }, { persist: true });
        return response;
      }
      resetAuth();
      return null;
    } catch (error) {
      resetAuth();
      return null;
    }
  };

  const configAuth = useCallback(async ({ 
    token = localStorage.getItem('auth_token'), 
    OrganizationId = localStorage.getItem("OrganizationId"), 
    currentUser = null, 
    currentOrganization = null, 
    refresh = false 
  }: AuthConfig) => {

    if (token) {
      localStorage.setItem('auth_token', token);
    }
    
    if (!token) {
      resetAuth();
      return;
    }
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

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
      }, { persist: true });
    }

    console.log(token, currentUser, refresh,'vhjnkgfdsdfcgvhbjnkm,jbhvgcf')

    if ((token && !currentUser) || refresh) {
      await refreshAuth();
    }

    if (token) {
      const getLocation = async () => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setTokenMetadata((prev) => ({
                ...prev,
                geolocation_accuracy: position.coords.accuracy,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }));
            },
            (error) => console.error('Error getting location:', error)
          );
        }
      };

      const getFCMToken = async () => {
        Notification.requestPermission().then(async(permission) => {
          if (permission === "granted") {
            return getToken(messaging, {vapidKey: "BE0EDrXQ7XCFZnkE3LpiSS3sag1jXpF3Vzb2c83R8HrRoKTknbDRcKHdCvC4dWjbZRA1zybLep2ozXiIO0oZniw"})
              .then((currentToken) => {
                if (currentToken) {
                  setTokenMetadata(metadata => ({...metadata, fcm_token: currentToken}));
                }
              })
              .catch((err) => {
                console.log('An error occurred when requesting to receive the token.', err);
              });
          }
        });
        await getLocation();  
      };

      await getFCMToken();
    }
  }, [refreshAuth, setAuthValues]);

  const resetAuth = useCallback(() => {
    queryClient.clear();
    localStorage.removeItem('authData');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('OrganizationId');

    setAuthValues({
      authToken: null,
      authUser: null,
      authOrganization: null
    }, { persist: false });
    
    delete axios.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['X-OrganizationId'];
  }, [queryClient, setAuthValues]);

  React.useEffect(() => {
    const token = localStorage.getItem('auth_token');
    axios.defaults.headers.common['X-OrganizationId'] = localStorage.getItem("OrganizationId");
    startAuthLoading();
    if(token) {
        configAuth({token});
    } else {
        resetAuth()
    }
  }, [startAuthLoading]);

  const loadOrganization = useCallback(async (
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
          currentOrganization: response.data.authOrganization
        });
      }
      successCallback(response?.data);
    } catch (error) {
      errorCallback(error);
    }
  }, [configAuth]);

  // Permission checkers (keep existing implementations)
  const checkPermission = useCallback((permissions: string | string[], mustHaveAll = false) => {
    const authPermissions = authData.authUser?.permissions;
    if (!authPermissions) return false;

    const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
    const check = (permission: string) => 
      authPermissions.some(authPermission => 
        authPermission.toLowerCase() === permission.toLowerCase()
      );

    return mustHaveAll 
      ? permissionsArray.every(check)
      : permissionsArray.some(check);
  }, [authData.authUser]);

  const hasOrganizationRole = useCallback((roles: string | string[], mustHaveAll = false) => {
    const authRoles = authData.authUser?.organization_roles;
    if (!authRoles) return false;

    const rolesArray = Array.isArray(roles) ? roles : [roles];
    const check = (role: string) => 
      authRoles.some(authRole => 
        authRole?.name.toLowerCase() === role.toLowerCase()
      );

    return mustHaveAll 
      ? rolesArray.every(check)
      : rolesArray.some(check);
  }, [authData.authUser]);

  const checkOrganizationPermission = useCallback((permissions: string | string[], mustHaveAll = false) => {
    const authPermissions = authData.authOrganization?.permissions;
    if (!authPermissions) return false;

    const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
    const check = (permission: string) => 
      authPermissions.some(authPermission => 
        authPermission.toLowerCase() === permission.toLowerCase()
      );

    return mustHaveAll 
      ? permissionsArray.every(check)
      : permissionsArray.some(check);
  }, [authData.authOrganization]);

  const organizationHasSubscribed = useCallback((modules: string | string[], mustHaveAll = false) => {
    const activeSubscriptions = authData.authOrganization?.organization?.active_subscriptions;
    if (!activeSubscriptions) return false;

    const subscribedModules = activeSubscriptions.flatMap(
      sub => sub.modules.map(module => module.name.toLowerCase())
    );
    const modulesArray = Array.isArray(modules) ? modules : [modules];

    return mustHaveAll
      ? modulesArray.every(module => 
        subscribedModules.includes(module.toLowerCase()))
      : modulesArray.some(module => 
        subscribedModules.includes(module.toLowerCase()));
  }, [authData.authOrganization]);

  const moduleSetting = useCallback((setting: { module_id: string; id: string }) => {
    const activeSubscriptions = authData.authOrganization?.organization?.active_subscriptions;
    if (!activeSubscriptions) return undefined;

    for (const subscription of activeSubscriptions) {
      const module = subscription.modules.find(m => m.id === setting.module_id);
      if (module) {
        const settingValue = module.settings?.find(s => s.id === setting.id)?.value;
        if (settingValue !== undefined) return settingValue;
      }
    }
    return undefined;
  }, [authData.authOrganization]);

  useEffect(() => {
    if (tokenMetadata) {
      authServices.updateAuthTokenMetaData(tokenMetadata);
    }
  }, [tokenMetadata?.longitude, tokenMetadata?.latitude, tokenMetadata?.fcm_token, tokenMetadata?.geolocation_accuracy]);

  useEffect(() => {
    const initializeAuth = async () => {
      startAuthLoading();
      const storedData = getStoredAuthData();
      const token = localStorage.getItem('auth_token');
      const organizationId = localStorage.getItem("OrganizationId") || '';

      console.log('yguyyduydyduusud')
      
      axios.defaults.headers.common['X-OrganizationId'] = organizationId;
      
      if (token) {
        await configAuth({ 
          token: token, 
          OrganizationId: storedData?.authOrganization?.organization?.id,
          currentUser: storedData?.authUser,
          currentOrganization: storedData?.authOrganization?.organization
        });
      } else {
        resetAuth();
      }
    };

    initializeAuth();
  }, []);

  const contextValue = useMemo(() => ({
    ...authData,
    authData,
    setAuthValues,
    startAuthLoading,
    stopAuthLoading,
    setOnlyAuthAccessData,
    setOnlyNotAuthAccessData,
    checkPermission,
    checkOrganizationPermission,
    organizationHasSubscribed,
    moduleSetting,
    hasOrganizationRole,
    refreshAuth,
    configAuth,
    resetAuth,
    loadOrganization
  }), [
    authData,
    setAuthValues,
    startAuthLoading,
    stopAuthLoading,
    setOnlyAuthAccessData,
    setOnlyNotAuthAccessData,
    checkPermission,
    checkOrganizationPermission,
    organizationHasSubscribed,
    moduleSetting,
    hasOrganizationRole,
    refreshAuth,
    configAuth,
    resetAuth,
    loadOrganization
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      <ProviderComponent {...providerProps}>
        {children}
      </ProviderComponent>
    </AuthContext.Provider>
  );
};

export const useJumboAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useJumboAuth must be used within a JumboAuthProvider');
  }
  return context;
};