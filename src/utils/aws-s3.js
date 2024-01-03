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