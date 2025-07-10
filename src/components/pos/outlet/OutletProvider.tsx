import React, { useContext, useState, ReactNode } from 'react';

export interface OutletType {
  id: number;
  name: string;
}

interface OutletContextType {
  activeOutlet: OutletType | null;
  setActiveOutlet: (outlet: OutletType | null) => void;
}

const OutletContext = React.createContext<OutletContextType | undefined>(undefined);

export const useSalesOutlet = (): OutletContextType => {
  const context = useContext(OutletContext);
  if (context === undefined) {
    throw new Error('useSalesOutlet must be used within a OutletProvider');
  }
  return context;
};

interface OutletProviderProps {
  children: ReactNode;
}

function OutletProvider({ children }: OutletProviderProps) {
  const [activeOutlet, setActiveOutlet] = useState<OutletType | null>(null);
  
  return (
    <OutletContext.Provider
      value={{ 
        activeOutlet,
        setActiveOutlet
      }}
    >
      {children}
    </OutletContext.Provider>
  );
}

export default OutletProvider;