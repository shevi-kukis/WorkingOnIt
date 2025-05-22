import React, { createContext, useContext, useReducer } from "react";
import axiosInstance from "./axiosInstance";

// 🔹 סוג הסטייט
interface AuthState {
  user: User | null;
  token: string | null;
  resume: Resume | null;
}

interface Resume {
  id: number;
  fileName: string;
  filePath: string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;

  roleId: number;       // מזהה התפקיד (מספר)
  roleName: string;   
}

type AuthAction =
  | { type: "LOGIN"; payload: { user: User; token: string; resume: Resume } }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "REGISTER"; payload: { user: User; token: string; resume: Resume | null } }
  | { type: "UPDATE_RESUME"; payload:Partial<Resume> };

const initialState: AuthState = {
  user: null,
  token: null,
  resume: null,
};

// ... imports ...


const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  
    switch (action.type) {
      case "LOGIN":
        return {
          user: { ...action.payload.user },
          resume: { ...action.payload.resume },
          token: action.payload.token,
        };
      case "LOGOUT":
        return { user: null, token: null, resume: null };
      case "UPDATE_USER":
        return {
          ...state,
          user: state.user ? { ...state.user, ...action.payload } : null,
        };
      case "REGISTER":
        return {
          user: { ...action.payload.user },
          resume: action.payload.resume ? { ...action.payload.resume } : null,
          token: action.payload.token,
        };
      case "UPDATE_RESUME":
        return { 
          ...state, 
          resume: state.resume 
            ? { ...state.resume, ...action.payload } 
            : { id: 0, fileName: "", filePath: "", ...action.payload } 
        };
      default:
        return state;
    }
  };
  
  const AuthContext = createContext<
    { state: AuthState; dispatch: React.Dispatch<AuthAction> } | undefined
  >(undefined);
  
  export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
  // בקובץ AuthContext.tsx







  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

    
  
  
  
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context; // ← כולל refreshUserData עכשיו
  };
  