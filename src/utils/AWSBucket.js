import AWS from 'aws-sdk';


export const uploadToS3 = async (file) => {
    AWS.config.update({
        region: process.env.REACT_APP_AWS_REGION,
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    });

    const s3 = new AWS.S3();
    const fileName = `customer_order_${Date.now()}.wav`;
    const params = {
        Bucket: process.env.REACT_APP_S3_BUCKET,
        Key: fileName, // a unique file name
        Body: file,
        ContentType: 'audio/wav',
    };

    try {
        await s3.upload(params).promise();
        return fileName
    } catch (error) {
        console.error(error);
    }
};


export const deleteFromS3 = async (fileKey) => {
    AWS.config.update({
        region: process.env.REACT_APP_AWS_REGION,
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    });

    const s3 = new AWS.S3();

    const params = {
        Bucket: process.env.REACT_APP_S3_BUCKET,
        Key: fileKey,
    };

    try {
        await s3.deleteObject(params).promise();
        console.log('File deleted successfully');
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};


export const saveFromS3 = async (fileKey) => {
    AWS.config.update({
        region: process.env.REACT_APP_AWS_REGION,
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    });

    const s3 = new AWS.S3();

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const time_delay = 1;
    let total_time_delay = 0;

    for (let attempt = 0; attempt < 1_000_000; ++attempt) {
        try {
            const params = {
                Bucket: process.env.REACT_APP_S3_BUCKET,
                Key: fileKey,
            };
            const data = await s3.getObject(params).promise();

            // Create a Blob from the data
            const blob = new Blob([data.Body], { type: 'audio/wav' });

            console.log("Total time delay: ", total_time_delay);
            // Create a URL for the Blob
            return URL.createObjectURL(blob);
        } catch (error) {
            // Wait for 1 ms before next attempt
            total_time_delay += time_delay;
            await delay(time_delay);
        }
    }

    throw new Error('Failed to retrieve .wav file from S3');
};


export const deleteTempFile = async (filePath) => {
    try {
        URL.revokeObjectURL(filePath);
        console.log('Temporary file deleted successfully');
    } catch (error) {
        console.error('Error deleting the temporary file:', error);
    }
};
