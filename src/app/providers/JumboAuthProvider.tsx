'use client'
import React, { createContext, useContext, useEffect, useReducer, useCallback, useMemo } from 'react';

// Types
interface AuthUser {
  id: string;
  name: string;
  email: string;
  permissions?: string[];
  organization_roles?: Array<{ name: string }>;
  [key: string]: any;
}

interface AuthOrganization {
  organization?: {
    active_subscriptions?: Array<{
      modules: Array<{
        id: string;
        name: string;
        settings?: Array<{
          id: string;
          value: any;
        }>;
      }>;
    }>;
  };
  permissions?: string[];
  [key: string]: any;
}

interface AuthState {
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

interface AuthContextType extends AuthState {
  setAuthValues: (values: Partial<AuthState>, options?: { delay?: number }) => void;
  startAuthLoading: () => void;
  stopAuthLoading: () => void;
  authData: any,
  setOnlyAuthAccessData: (data: Partial<AuthState['onlyAuthAccessData']>) => void;
  setOnlyNotAuthAccessData: (data: Partial<AuthState['onlyNotAuthAccessData']>) => void;
  checkPermission: (permissions: string | string[], mustHaveAll?: boolean) => boolean;
  checkOrganizationPermission: (permissions: string | string[], mustHaveAll?: boolean) => boolean;
  organizationHasSubscribed: (modules: string | string[], mustHaveAll?: boolean) => boolean;
  moduleSetting: (setting: { module_id: string; id: string }) => any;
  hasOrganizationRole: (roles: string | string[], mustHaveAll?: boolean) => boolean;
}

// Context
const AuthContext = createContext<AuthContextType | null>(null);

// Initial state function
const init = (restProps: any): AuthState => ({
  authUser: null,
  authOrganization: null,
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
});

// Reducer
const authReducer = (state: AuthState, action: any): AuthState => {
  switch (action.type) {
    case "set-auth-values":
      const { authToken = null, authUser = state.authUser, authOrganization = null, ...restValues } = action.payload;

      if (!authUser && !authToken) {
        return {
          ...state,
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

  // Load from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('authData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (parsedData?.authUser) {
            dispatch({
              type: "set-auth-values",
              payload: {
                authUser: parsedData.authUser,
                authOrganization: parsedData.authOrganization || null,
                isLoading: false
              }
            });
          } else {
            localStorage.removeItem('authData');
            dispatch({ type: "stop-loading" });
          }
        } catch (e) {
          localStorage.removeItem('authData');
          dispatch({ type: "stop-loading" });
        }
      } else {
        dispatch({ type: "stop-loading" });
      }
    }
  }, []);

  // Single effect to persist changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !authData.isLoading) {
      if (authData.authUser) {
        localStorage.setItem('authData', JSON.stringify({
          authUser: authData.authUser,
          authOrganization: authData.authOrganization
        }));
      } else {
        localStorage.removeItem('authData');
      }
    }
  }, [authData.authUser, authData.authOrganization, authData.isLoading]);

  const setAuthValues = useCallback((authValues: Partial<AuthState>, options?: { delay?: number }) => {
    const { authUser, isLoading, isAuthenticated, onlyAuthAccessData, onlyNotAuthAccessData, ...restValues } = authValues;

    const action = {
      type: "set-auth-values",
      payload: {
        authUser,
        ...restValues
      }
    };

    if (options?.delay) {
      setTimeout(() => dispatch(action), options.delay);
    } else {
      dispatch(action);
    }
  }, []);

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

  const checkPermission = useCallback((permissions: string | string[], mustHaveAll = false) => {
    const { authUser } = authData;
    const authPermissions = authUser?.permissions;
    
    if (!authPermissions) return false;

    const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];

    if (mustHaveAll) {
      return permissionsArray.every(permission => 
        authPermissions.some(authPermission => 
          authPermission.toLowerCase() === permission.toLowerCase()
        )
      );
    } else {
      return permissionsArray.some(permission => 
        authPermissions.some(authPermission => 
          authPermission.toLowerCase() === permission.toLowerCase()
        )
      );
    }
  }, [authData.authUser]);

  const hasOrganizationRole = useCallback((roles: string | string[], mustHaveAll = false) => {
    const { authUser } = authData;
    const authRoles = authUser?.organization_roles;

    if (!authRoles) return false;

    const rolesArray = Array.isArray(roles) ? roles : [roles];

    if (mustHaveAll) {
      return rolesArray.every(role => 
        authRoles.some(authRole => 
          authRole?.name.toLowerCase() === role.toLowerCase()
        )
      );
    } else {
      return rolesArray.some(role => 
        authRoles.some(authRole => 
          authRole?.name.toLowerCase() === role.toLowerCase()
        )
      );
    }
  }, [authData.authUser]);

  const checkOrganizationPermission = useCallback((permissions: string | string[], mustHaveAll = false) => {
    const { authOrganization } = authData;
    const authPermissions = authOrganization?.permissions;

    if (!authPermissions) return false;

    const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];

    if (mustHaveAll) {
      return permissionsArray.every(permission => 
        authPermissions.some(authPermission => 
          authPermission.toLowerCase() === permission.toLowerCase()
        )
      );
    } else {
      return permissionsArray.some(permission => 
        authPermissions.some(authPermission => 
          authPermission.toLowerCase() === permission.toLowerCase()
        )
      );
    }
  }, [authData.authOrganization]);

  const organizationHasSubscribed = useCallback((modules: string | string[], mustHaveAll = false) => {
    const { authOrganization } = authData;
    const activeSubscriptions = authOrganization?.organization?.active_subscriptions;
    
    if (!activeSubscriptions) return false;

    const subscribedModules = activeSubscriptions.flatMap(
      subscription => subscription.modules.flatMap(module => module.name)
    );

    const modulesArray = Array.isArray(modules) ? modules : [modules];

    if (mustHaveAll) {
      return modulesArray.every(module => 
        subscribedModules.some(subscribedModule => 
          subscribedModule.toLowerCase() === module.toLowerCase()
        )
      );
    } else {
      return modulesArray.some(module => 
        subscribedModules.some(subscribedModule => 
          subscribedModule.toLowerCase() === module.toLowerCase()
        )
      );
    }
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

  const contextValue = useMemo(() => {
    return {
      ...authData,
      setAuthValues,
      setOnlyAuthAccessData,
      setOnlyNotAuthAccessData,
      startAuthLoading,
      stopAuthLoading,
      checkPermission,
      checkOrganizationPermission,
      organizationHasSubscribed,
      moduleSetting,
      hasOrganizationRole,
      authData 
    };
  }, [
    authData.authUser,
    authData.authOrganization,
    authData.isLoading,
    authData.isAuthenticated,
    setAuthValues,
    setOnlyAuthAccessData,
    setOnlyNotAuthAccessData,
    startAuthLoading,
    stopAuthLoading,
    checkPermission,
    checkOrganizationPermission,
    organizationHasSubscribed,
    moduleSetting,
    hasOrganizationRole
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