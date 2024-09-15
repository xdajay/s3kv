# S3KV

S3KV is a lightweight TypeScript package that provides a JSON key-value store built on top of AWS S3 and CloudFront. It offers a simple interface for storing and retrieving JSON data with low-latency performance, leveraging the global distribution capabilities of CloudFront.

## Introduction

S3KV simplifies the process of using AWS S3 as a key-value store for JSON data, with CloudFront integration for improved read performance. It's designed for scenarios where you need a distributed, scalable storage solution for JSON objects with fast read access.

Key features:
- Simple key-value interface for storing and retrieving JSON data
- Utilizes AWS S3 for reliable, scalable storage
- Integrates with CloudFront for low-latency global access
- Automatic cache invalidation on data updates

**Note:** S3KV is not intended as a replacement for in-memory stores. It is specifically designed for storing and retrieving plain JSON data against keys, optimized for scenarios where global distribution and scalability are required.

## Installation

```bash
npm install s3kv
```

or

```bash
yarn add s3kv
```

## Usage

### Initialization

To start using S3KV, you need to initialize it with your AWS configuration:

```typescript
import S3KV from 's3kv';

const s3kv = new S3KV(
  'eu-north-1',                      // AWS region
  's3bucketname',                    // S3 bucket name
  'https://exampleurl.cloudfront.net', // CloudFront URL
  'EXAMPLEDIR3'                      // CloudFront Distribution ID
);
```

### Retrieving Data

To retrieve data for a specific key:

```typescript
const cachedData = await s3kv.get('myKey');
```

### Setting Data

To set data for a specific key:

```typescript
const newData = { example: 'data' };
await s3kv.set('myKey', JSON.stringify(newData));
```

## Environment Variables

S3KV requires the following environment variables to be set:

- `S3_KEY`: Your AWS access key ID
- `S3_SECRET`: Your AWS secret access key

**Important:** Ensure that the IAM user associated with these credentials has permissions for both S3 operations and CloudFront cache invalidation.

## AWS Permissions

The IAM user or role associated with the provided credentials must have the following permissions:

1. S3 permissions:
   - `s3:PutObject`
   - `s3:GetObject`

2. CloudFront permissions:
   - `cloudfront:CreateInvalidation`

## Best Practices

1. **Security:** Always use IAM roles with the principle of least privilege when deploying to AWS environments.
2. **Performance:** While S3KV uses CloudFront for improved read performance, consider your access patterns and data size to ensure optimal use.
3. **Costs:** Be aware of the AWS costs associated with S3 storage, CloudFront distributions, and cache invalidations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.