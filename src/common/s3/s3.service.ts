import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private s3 = new S3Client({
    region: process.env.S3_AWS_REGION,
    credentials: {
      accessKeyId: process.env.S3_AWS_ACCESS_KEY!,
      secretAccessKey: process.env.S3_AWS_SECRET_KEY!,
    },
  });

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `https://${process.env.S3_AWS_BUCKET_NAME}.s3.${process.env.S3_AWS_REGION}.amazonaws.com/${fileName}`;
  }

  async deleteFile(imageUrl: string) {
    if (!imageUrl) return;

    const key = new URL(imageUrl).pathname.slice(1);

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_AWS_BUCKET_NAME,
        Key: key,
      }),
    );
  }
}
