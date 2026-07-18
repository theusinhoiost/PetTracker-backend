import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.S3_AWS_REGION!,
      credentials: {
        accessKeyId: process.env.S3_AWS_ACCESS_KEY!,
        secretAccessKey: process.env.S3_AWS_SECRET_KEY!,
      },
      endpoint: process.env.S3_AWS_ENDPOINT_URL,
      forcePathStyle: true, 
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_AWS_BUCKET_NAME!,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return fileName;
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_AWS_BUCKET_NAME!,
      Key: key,
    });

    return getSignedUrl(this.s3, command, { expiresIn });
  }

  async deleteFile(key: string): Promise<void> {
    if (!key) return;

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_AWS_BUCKET_NAME!,
        Key: key,
      }),
    );
  }
}