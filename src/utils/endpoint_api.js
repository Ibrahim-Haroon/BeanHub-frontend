

export const fetchProcessedAudio = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/audio_endpoint');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError("Oops, we haven't got JSON!");
        }
        const data = await response.json();
        if (data.floating_point_number !== undefined) {
            console.log('File Path:', data.file);
        }
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return "error"
    }
};
