// api.js
export const fetchProcessedAudio = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log('Price:', data.floating_point_number);
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
};