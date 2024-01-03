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
        console.log('File uploaded successfully');
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

    try {
        const tempFilePath = path.join(os.tmpdir(), `tempfile_${Date.now()}.wav`);

        const params = {
            Bucket: process.env.REACT_APP_S3_BUCKET,
            Key: fileKey,
        };
        const data = await s3.getObject(params).promise();

        await fs.promises.writeFile(tempFilePath, data.Body);

        return tempFilePath;
    } catch (error) {
        console.error('Error handling the .wav file:', error);
    }
};


export const deleteTempFile = async (filePath) => {
    try {
        await fs.promises.unlink(filePath);
        console.log('Temporary file deleted successfully');
    } catch (error) {
        console.error('Error deleting the temporary file:', error);
    }
};