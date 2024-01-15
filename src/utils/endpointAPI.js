

export async function initialFetchProcessedAudio(file_path) {
    try {
        const requestData = { file_path: file_path };
        const response = await fetch('http://127.0.0.1:8000/audio_endpoint/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error(`POST request failed with status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError("Oops, we haven't got JSON!");
        }

        return await response.json()

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return "error"
    }
}


export async function fetchProcessedAudio(file_path, unique_id) {
    try {
        const requestData = { file_path: file_path, unique_id: unique_id};
        const response = await fetch('http://127.0.0.1:8000/audio_endpoint/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error(`PATCH request failed with status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError("Oops, we haven't got JSON!");
        }

        return await response.json();

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return "error"
    }
}
