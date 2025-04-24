import { BasicAuthContextType } from "@/types/auth-types";
import { createContext } from "react";

export const BasicAuthContext = createContext<BasicAuthContextType>({} as BasicAuthContextType);