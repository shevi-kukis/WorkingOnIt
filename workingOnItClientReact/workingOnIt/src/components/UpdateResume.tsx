import { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import axiosInstance from "../utils/axiosInstance";

const UpdateResume = () => {
    const { state } = useAuth(); // הבאת ה-token מה-context
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file.");
            return;
        }

        if (!state.token) {
            setMessage("You must be logged in to upload a resume.");
            return;
        }

        setUploading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axiosInstance.post(
                "/resume/update",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${state.token}`, // שימוש בטוקן מה-context
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setMessage("File updated successfully!");
        } catch (error) {
            console.error("File update failed:", error);
            setMessage("Error updating file.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h2>Update Resume</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Update Resume"}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UpdateResume;
