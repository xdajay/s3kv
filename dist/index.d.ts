/**
 * S3KV class for interacting with AWS S3 and CloudFront.
 * This class provides a key-value store interface backed by S3 and CloudFront.
 */
declare class S3KV {
    private s3;
    private cloudfront;
    private bucket;
    private folder;
    private cloudfrontUrl;
    private distributionId;
    /**
     * Creates an instance of S3KV.
     * @param {string} region - The AWS region to use.
     * @param {string} bucket - The name of the S3 bucket.
     * @param {string} cloudfrontUrl - The URL of the CloudFront distribution.
     * @param {string} distributionId - The ID of the CloudFront distribution.
     */
    constructor(region: string, bucket: string, cloudfrontUrl: string, distributionId: string);
    /**
     * Sets a value in the S3 bucket and invalidates the CloudFront cache.
     * @param {string} key - The key to set.
     * @param {string | object} data - The data to store. Can be a JSON string or an object.
     * @returns {Promise<void>}
     * @throws {Error} If uploading the file or invalidating the cache fails.
     */
    set(key: string, data: string | object): Promise<void>;
    /**
     * Retrieves a value from the CloudFront distribution.
     * @param {string} key - The key to retrieve.
     * @returns {Promise<object | null>} The retrieved data as an object, or null if not found.
     */
    get(key: string): Promise<object | null>;
    /**
     * Invalidates the CloudFront cache for a specific key.
     * @private
     * @param {string} key - The key to invalidate in the cache.
     * @returns {Promise<void>}
     * @throws {Error} If the cache invalidation fails.
     */
    private invalidateCache;
}
export { S3KV };
export default S3KV;
