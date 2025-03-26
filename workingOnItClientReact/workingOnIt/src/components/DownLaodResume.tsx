import { useEffect, useState } from "react";

import { useAuth } from "./AuthContext";
import axiosInstance from "../utils/axiosInstance";


const DownLoadResume = () => {
    const { state } = useAuth(); // הבאת ה-token מה-context
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResume = async () => {
            setLoading(true);
            setError("");

            if (!state.token) {
                setError("You must be logged in to download your resume.");
                setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get("/resume/download-url", {
                    headers: {
                        Authorization: `Bearer ${state.token}`, // שימוש בטוקן מה-context
                    },
                });

                setFileUrl(response.data.fileUrl);
            } catch (error) {
                console.error("Error fetching resume:", error);
                setError("Failed to fetch resume.");
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [state.token]);

    return (
        <div>
    
            <h2>Download Resume</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {fileUrl && (
                <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
                    <button>Download Resume</button>
                </a>
            )}
        </div>
    );
};

export default DownLoadResume;
