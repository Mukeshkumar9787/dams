import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded
dotenv.config({ path: path.join(__dirname, '../.env') });

import prisma from './client.js';
import { uploadFileToR2, isR2Configured } from '../utils/r2.js';

const imageMappings = [
  // Category Images
  { id: 101, feature: 'CATEGORY', featureId: 101, localPath: '../../web_client/public/images/categories/categories-01.png', filename: 'category-mens-apparel.png' },
  { id: 102, feature: 'CATEGORY', featureId: 102, localPath: '../../web_client/public/images/categories/categories-02.png', filename: 'category-womens-apparel.png' },
  { id: 103, feature: 'CATEGORY', featureId: 103, localPath: '../../web_client/public/images/categories/categories-03.png', filename: 'category-footwear.png' },
  { id: 104, feature: 'CATEGORY', featureId: 104, localPath: '../../web_client/public/images/categories/categories-04.png', filename: 'category-bags.png' },
  { id: 105, feature: 'CATEGORY', featureId: 105, localPath: '../../web_client/public/images/categories/categories-05.png', filename: 'category-watches.png' },
  { id: 106, feature: 'CATEGORY', featureId: 106, localPath: '../../web_client/public/images/categories/categories-06.png', filename: 'category-eyewear.png' },
  { id: 107, feature: 'CATEGORY', featureId: 107, localPath: '../../web_client/public/images/categories/categories-07.png', filename: 'category-activewear.png' },
  { id: 108, feature: 'CATEGORY', featureId: 108, remoteUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', filename: 'category-winter-outerwear.jpg' },

  // Product Images
  { id: 110, feature: 'PRODUCT', featureId: 101, localPath: '../../web_client/public/images/products/product-1-bg-1.png', filename: 'product-101-1.png' },
  { id: 111, feature: 'PRODUCT', featureId: 101, localPath: '../../web_client/public/images/products/product-1-bg-2.png', filename: 'product-101-2.png' },
  { id: 112, feature: 'PRODUCT', featureId: 102, localPath: '../../web_client/public/images/products/product-2-bg-1.png', filename: 'product-102-1.png' },
  { id: 113, feature: 'PRODUCT', featureId: 102, localPath: '../../web_client/public/images/products/product-2-bg-2.png', filename: 'product-102-2.png' },
  { id: 114, feature: 'PRODUCT', featureId: 103, localPath: '../../web_client/public/images/products/product-3-bg-1.png', filename: 'product-103-1.png' },
  { id: 115, feature: 'PRODUCT', featureId: 103, localPath: '../../web_client/public/images/products/product-3-bg-2.png', filename: 'product-103-2.png' },
  { id: 116, feature: 'PRODUCT', featureId: 104, localPath: '../../web_client/public/images/products/product-4-bg-1.png', filename: 'product-104-1.png' },
  { id: 117, feature: 'PRODUCT', featureId: 104, localPath: '../../web_client/public/images/products/product-4-bg-2.png', filename: 'product-104-2.png' },
  { id: 118, feature: 'PRODUCT', featureId: 105, localPath: '../../web_client/public/images/products/product-5-bg-1.png', filename: 'product-105-1.png' },
  { id: 119, feature: 'PRODUCT', featureId: 105, localPath: '../../web_client/public/images/products/product-5-bg-2.png', filename: 'product-105-2.png' },
  { id: 120, feature: 'PRODUCT', featureId: 106, localPath: '../../web_client/public/images/products/product-6-bg-1.png', filename: 'product-106-1.png' },
  { id: 121, feature: 'PRODUCT', featureId: 106, localPath: '../../web_client/public/images/products/product-6-bg-2.png', filename: 'product-106-2.png' },
  { id: 122, feature: 'PRODUCT', featureId: 107, localPath: '../../web_client/public/images/products/product-7-bg-1.png', filename: 'product-107-1.png' },
  { id: 123, feature: 'PRODUCT', featureId: 107, localPath: '../../web_client/public/images/products/product-7-bg-2.png', filename: 'product-107-2.png' },
  { id: 124, feature: 'PRODUCT', featureId: 108, localPath: '../../web_client/public/images/products/product-8-bg-1.png', filename: 'product-108-1.png' },
  { id: 125, feature: 'PRODUCT', featureId: 109, remoteUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', filename: 'product-109-watch.jpg' },
  { id: 126, feature: 'PRODUCT', featureId: 110, remoteUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', filename: 'product-110-sunglasses.jpg' },
  { id: 127, feature: 'PRODUCT', featureId: 111, remoteUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80', filename: 'product-111-leggings.jpg' },
  { id: 128, feature: 'PRODUCT', featureId: 112, remoteUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80', filename: 'product-112-puffer.jpg' },
];

async function getFileBuffer(item) {
  if (item.localPath) {
    const fullLocalPath = path.resolve(__dirname, item.localPath);
    if (fs.existsSync(fullLocalPath)) {
      return fs.readFileSync(fullLocalPath);
    }
  }
  if (item.remoteUrl) {
    const response = await fetch(item.remoteUrl);
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
  }
  return null;
}

async function seed() {
  console.log('🌱 Starting database seeding...');
  try {
    const sqlPath = path.join(__dirname, 'seed.sql');
    let fullSql = fs.readFileSync(sqlPath, 'utf-8');

    // Remove block comments /* ... */
    fullSql = fullSql.replace(/\/\*[\s\S]*?\*\//g, '');

    // Split SQL into individual statements by semicolon
    const statements = fullSql
      .split(';')
      .map(s => s.trim())
      .filter(s => {
        if (!s) return false;
        const lines = s.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith('--'));
        return lines.length > 0;
      });

    for (const statement of statements) {
      const cleanStatement = statement
        .split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n')
        .trim();

      if (!cleanStatement || cleanStatement.toUpperCase() === 'BEGIN' || cleanStatement.toUpperCase() === 'COMMIT') {
        continue;
      }
      await prisma.$executeRawUnsafe(cleanStatement);
    }

    console.log('📦 Core SQL seed data inserted successfully!');

    // Upload images to Cloudflare R2 bucket
    if (isR2Configured()) {
      console.log('☁️ Uploading category and product images to Cloudflare R2 bucket...');
      const baseUrl = (process.env.R2_PUBLIC_BASE_URL || process.env.R2_ENDPOINT || '').replace(/\/+$/, '');
      const bucketPath = (process.env.R2_BUCKET_PATH || 'uploads').replace(/^\/+|\/+$/g, '');

      for (const item of imageMappings) {
        try {
          const buffer = await getFileBuffer(item);
          if (!buffer) {
            console.warn(`⚠️ Could not read buffer for ${item.filename}`);
            continue;
          }

          const mimetype = item.filename.endsWith('.jpg') || item.filename.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
          const uploadRes = await uploadFileToR2({
            originalname: item.filename,
            buffer,
            mimetype,
          });

          if (uploadRes?.path) {
            const r2FullUrl = `${baseUrl}/${bucketPath}/${uploadRes.path}`;

            await prisma.file.upsert({
              where: { id: item.id },
              update: {
                feature: item.feature,
                featureId: item.featureId,
                path: r2FullUrl,
                updatedAt: new Date(),
              },
              create: {
                id: item.id,
                feature: item.feature,
                featureId: item.featureId,
                path: r2FullUrl,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });

            console.log(`  ✓ Uploaded & saved R2 URL: [${item.feature}] ${item.filename} -> ${r2FullUrl}`);
          }
        } catch (err) {
          console.error(`  ❌ Failed to upload image ${item.filename} to R2:`, err.message);
        }
      }

      // Reset File sequence
      await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"File"', 'id'), COALESCE((SELECT MAX(id) FROM "File"), 1));`);
    }

    console.log('🎉 Database seeding complete with real Cloudflare R2 image URLs!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
