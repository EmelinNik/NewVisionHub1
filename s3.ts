import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: "https://s3-nl.hostkey.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: "oHfzR1lVsCJj9FhCs3nur2XdYLxyPZoNjAXCxGIA",
    secretAccessKey: "oHfzR1lVsCJj9FhCs3nur2XdYLxyPZoNjAXCxGIA",
  },
  forcePathStyle: true,
});

export const uploadFileToS3 = async (file: File): Promise<string> => {
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const bucketName = "bdb3adc68-emelin";

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: file,
      ContentType: file.type,
      ACL: "public-read",
    });

    await s3Client.send(command);
    return `https://s3-nl.hostkey.com/${bucketName}/${filename}`;
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error("Ошибка при загрузке файла в хранилище");
  }
};