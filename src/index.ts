import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";
import axios from 'axios';

/**
 * S3KV class for interacting with AWS S3 and CloudFront.
 * This class provides a key-value store interface backed by S3 and CloudFront.
 */
class S3KV {
  private s3: S3Client;
  private cloudfront: CloudFrontClient;
  private bucket: string;
  private folder: string;
  private cloudfrontUrl: string;
  private distributionId: string;

  /**
   * Creates an instance of S3KV.
   * @param {string} region - The AWS region to use.
   * @param {string} bucket - The name of the S3 bucket.
   * @param {string} cloudfrontUrl - The URL of the CloudFront distribution.
   * @param {string} distributionId - The ID of the CloudFront distribution.
   */
  constructor(region: string, bucket: string, cloudfrontUrl: string, distributionId: string) {
    // Make sure aws accessKeyId has access to both cloudfront and s3

    const config = {
      region,
      credentials: {
        accessKeyId: process.env.S3_KEY!,
        secretAccessKey: process.env.S3_SECRET!,
      },
    };

    this.s3 = new S3Client(config);
    this.cloudfront = new CloudFrontClient(config);
    this.bucket = bucket;
    this.folder = 'corejson';
    this.cloudfrontUrl = cloudfrontUrl;
    this.distributionId = distributionId;
  }

  /**
   * Sets a value in the S3 bucket and invalidates the CloudFront cache.
   * @param {string} key - The key to set.
   * @param {string | object} data - The data to store. Can be a JSON string or an object.
   * @returns {Promise<void>}
   * @throws {Error} If uploading the file or invalidating the cache fails.
   */
  async set(key: string, data: string | object): Promise<void> {
    let bodyContent: string;

    if (typeof data === 'string') {
      try {
        JSON.parse(data);
        bodyContent = data;
      } catch (error) {
        bodyContent = JSON.stringify(data);
      }
    } else {
      bodyContent = JSON.stringify(data);
    }

    const params: PutObjectCommand['input'] = {
      Bucket: this.bucket,
      Key: `${this.folder}/${key}.json`,
      Body: bodyContent,
      ContentType: 'application/json',
      ACL: 'public-read',
      Metadata: {
        'cache-control': 'max-age=31536000'  // Cache for one year
      }
    };

    try {
      await this.s3.send(new PutObjectCommand(params));
      await this.invalidateCache(key);
    } catch (error) {
      console.error(`Failed to upload file or invalidate cache: ${error}`);
      throw new Error(`Failed to upload file or invalidate cache: ${error}`);
    }
  }

  /**
   * Retrieves a value from the CloudFront distribution.
   * @param {string} key - The key to retrieve.
   * @returns {Promise<object | null>} The retrieved data as an object, or null if not found.
   */
  async get(key: string): Promise<object | null> {
    const url = `${this.cloudfrontUrl}/${this.folder}/${key}.json`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log(`File not found: ${key}`);
        return null;
      }
      console.error(`Error fetching file: ${error}`);
      return null;
    }
  }

  /**
   * Invalidates the CloudFront cache for a specific key.
   * @private
   * @param {string} key - The key to invalidate in the cache.
   * @returns {Promise<void>}
   * @throws {Error} If the cache invalidation fails.
   */
  private async invalidateCache(key: string): Promise<void> {
    const params = {
      DistributionId: this.distributionId,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: 1,
          Items: [`/${this.folder}/${key}.json`]
        }
      }
    };

    try {
      await this.cloudfront.send(new CreateInvalidationCommand(params));
      console.log(`Cache invalidated for ${key}`);
    } catch (error) {
      console.error(`Failed to invalidate cache: ${error}`);
      throw error;
    }
  }
}

export { S3KV };
export default S3KV;