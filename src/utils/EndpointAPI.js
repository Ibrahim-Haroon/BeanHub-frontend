

export async function postAudioEndpoint(file_path) {
    try {
        const requestData = { file_path: file_path };
        const endpoint = process.env.REACT_APP_BACKEND_ENDPOINT + '/audio_endpoint/';
        console.log(endpoint);
        const response = await fetch(endpoint, {
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


export async function patchAudioEndpoint(file_path, unique_id) {
    try {
        const requestData = { file_path: file_path, unique_id: unique_id};
        const endpoint = process.env.REACT_APP_BACKEND_ENDPOINT + '/audio_endpoint/';
        console.log(endpoint);
        const response = await fetch(endpoint, {
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
