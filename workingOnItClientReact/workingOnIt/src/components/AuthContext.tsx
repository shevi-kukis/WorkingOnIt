import React, { createContext, useContext, useReducer } from "react";
import axiosInstance from "./axiosInstance"; // או כל קובץ שבו יש לך את axiosInstance

// 🔹 סוג הסטייט של ה-AuthContext
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
  role: number;
}

// 🔹 פעולות אפשריות (LOGIN, LOGOUT)
type AuthAction =
  | { type: "LOGIN"; payload: { user: User; token: string; resume: Resume } }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "REGISTER"; payload: { user: User; token: string; resume: Resume | null } }
  | { type: "UPDATE_RESUME"; payload: Resume };

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
        resume: { ...action.payload.resume }, // הוספת resume
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
      return { ...state, resume: action.payload };

    default:
      return state;
  }
};

// 🔹 יצירת context
const AuthContext = createContext<
  { state: AuthState; dispatch: React.Dispatch<AuthAction>; uploadResume: (file: File) => Promise<{ success: boolean; data?: Resume }> } | undefined
>(undefined);

// 🔹 פונקציה להעלאת קובץ
const uploadResume = async (file: File): Promise<{ success: boolean; data?: Resume }> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstance.post("/resume/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const resumeData = response.data as Resume;
const{dispatch}=useAuth()
    // עדכון ה-Resume ב-Redux או context
    dispatch({ type: "UPDATE_RESUME", payload: resumeData });

    return { success: true, data: resumeData };
  } catch (error) {
    console.error("Upload resume failed:", error);
    return { success: false };
  }
};

// 🔹 יצירת ה-AuthProvider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch, uploadResume }}>
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

