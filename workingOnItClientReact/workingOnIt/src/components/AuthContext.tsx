import React, { createContext, useContext, useReducer } from "react";



// 🔹 סוג הסטייט של ה-AuthContext
interface AuthState {
  user: User | null;
  token: string | null;
  resume:Resume|null;
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
  // resume?: Resume | null; // נוסיף את ה-Resume
}

// 🔹 פעולות אפשריות (LOGIN, LOGOUT)
type AuthAction =
  | { type: "LOGIN"; payload: { user: User; token: string; resume: Resume  } }
  | { type: "REGISTER"; payload: { user: User; token: string; resume: Resume  } }

  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> };

// 🔹 סטייט ראשוני
const initialState: AuthState = {
  user: null,
  token: null,
  resume: null
};

// 🔹 Reducer לניהול הסטייט
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: { ...action.payload.user },
        resume:{...action.payload.resume} ,// הוספת resume
        token: action.payload.token,
      };
      case "REGISTER":
        return {
          user: { ...action.payload.user },
          resume:{...action.payload.resume} ,// הוספת resume
          token: action.payload.token,
        };
    case "LOGOUT":
      return { user: null, token: null,resume:null };

    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    default:
      return state;
  }
};


// 🔹 יצירת context
const AuthContext = createContext<
  { state: AuthState; dispatch: React.Dispatch<AuthAction> } | undefined
>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔹 שימוש ב-context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
