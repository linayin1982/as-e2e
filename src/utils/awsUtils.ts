import { _Object, DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

function getS3Client(): S3Client {
  let client = new S3Client();

  if (process.env.CCIT_LOCALLY !== 'false') {
    client = new S3Client({
      region: process.env.REGION,
      profile: process.env.AWS_PROFILE,
    });
  }
  return client;
}

async function getS3Files(bucket: string, prefix: string): Promise<_Object[]> {
  const client = getS3Client();

  const response = await client.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix }));

  return response.Contents!;
}

async function deleteS3Files(bucket: string, keys: string[]): Promise<void> {
  const client = getS3Client();

  try {
    const result = await client.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: keys.map((key) => {
            return { Key: key };
          }),
        },
      })
    );

    if (result.Errors && result.Errors.length > 0) {
      console.error('Failed to delete some S3 files, are you missing permissions?');
    }
  } catch (error) {
    console.error('Error deleting S3 files:', error);
  }
}

async function getS3File(bucket: string, key: string): Promise<string> {
  const client = getS3Client();
  const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));

  return await streamToString(response.Body as Readable);
}

async function streamToString(stream: Readable): Promise<string> {
  return await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(chunks.join('')));
  });
}

async function getSecretValue(secretId: string, region: string, awsProfile: string): Promise<Record<string, string>> {
  let client = new SecretsManagerClient();

  if (process.env.CCIT_LOCALLY !== 'false') {
    client = new SecretsManagerClient({
      region: region,
      profile: awsProfile,
    });
  }

  return await client
    .send(
      new GetSecretValueCommand({
        SecretId: secretId,
        VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
      })
    )
    .then(async (data) => {
      return JSON.parse(data.SecretString!);
    })
    .catch((error) => {
      console.error('Error fetching secret:', error);
      throw error;
    });
}

export { getSecretValue, deleteS3Files, getS3File, getS3Files };
