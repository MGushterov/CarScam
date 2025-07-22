export const handleTypes = async () => {
    try {
        const response = await fetch('/api/types', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`)
        }
        const obj = await response.json();
        const data = obj.data;

        return data;
    }
    catch (e){
        console.error(e.message)
    }
} 

export const handleGearboxes = async () => {
    try {
        const response = await fetch('/api/gearboxes', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`)
        }
        const data = await response.json();

        return data;
    }
    catch (e){
        console.error(e.message)
    }
}