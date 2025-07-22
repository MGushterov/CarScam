const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const getImageUrl = (relPath) => {
    console.log(relPath)
    return `${API_BASE}/static/uploads/${relPath}`;
}