const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

const s3Client = new S3Client({
	region: "us-east-2",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

const streamToString = (stream) => new Promise((resolve, reject) => {
	const chunks = [];
	stream.on('data', (chunk) => chunks.push(chunk));
	stream.on('error', reject);
	stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
});

const readFile = async (bucket, key) => {
	const params = {
		Bucket: bucket,
		Key: key,
	};
	const command = new GetObjectCommand(params);
	const response = await s3Client.send(command);
	const { Body } = response; 
	return streamToString(Body);
};

const getPDFUrl = async (bucket, key) => {
	const params = {
		Bucket: bucket,
		Key: key
	};
	const command = new GetObjectCommand(params);
	try {
		await s3Client.send(command);
	} catch (e) {
		throw new Error(`AWS S3 Error: ${e.Code}.\nKey '${e.Key}' not found in bucket '${command.input.Bucket}'.`);
	}
	const url = await getSignedUrl(s3Client, command, {
		expiresIn: 600
	});
	return url;
}

module.exports = {
	s3Client,
	readFile,
	getPDFUrl
}