-- ==============================================================================
-- DAMS Ecommerce Application SQL Seed Script (PostgreSQL)
-- Schema: User, Hsn, Size, Color, Category, Product, Stock, File, ProductReview, Config
-- ==============================================================================

-- Optional: Uncomment the following block if you want to clean up existing tables before seeding:
/*
TRUNCATE TABLE 
  "ProductReview", 
  "CartItem", 
  "WishlistItem", 
  "ProductNotification", 
  "OrderProducts", 
  "OrderStatusHistory", 
  "Order", 
  "Stock", 
  "File", 
  "Product", 
  "Category", 
  "Hsn", 
  "Size", 
  "Color", 
  "AuditLog", 
  "Address", 
  "Otp", 
  "Config", 
  "User" 
RESTART IDENTITY CASCADE;
*/

-- ------------------------------------------------------------------------------
-- 1. USERS (Admin & Customer accounts)
-- Default Password for all seeded user accounts: Admin@123
-- Accounts: admin@dams.com (ADMIN), john@example.com (USER), sarah@example.com (USER)
-- ------------------------------------------------------------------------------
INSERT INTO "User" ("id", "name", "email", "password", "mobile", "role", "status", "createdAt", "updatedAt")
VALUES 
  (101, 'System Admin', 'admin@dams.com', '$2b$10$bC6CpZeSzWcEd5cx3mhLMeGgoCTYIAF07HgDTp5t23FnAwbm59Dwa', '9876543210', 'ADMIN', 'ACTIVE', NOW(), NOW()),
  (102, 'John Doe', 'john@example.com', '$2b$10$bC6CpZeSzWcEd5cx3mhLMeGgoCTYIAF07HgDTp5t23FnAwbm59Dwa', '9876543211', 'USER', 'ACTIVE', NOW(), NOW()),
  (103, 'Sarah Connor', 'sarah@example.com', '$2b$10$bC6CpZeSzWcEd5cx3mhLMeGgoCTYIAF07HgDTp5t23FnAwbm59Dwa', '9876543212', 'USER', 'ACTIVE', NOW(), NOW())
ON CONFLICT ("email") DO UPDATE SET "role" = EXCLUDED."role", "password" = EXCLUDED."password", "updatedAt" = NOW();

-- ------------------------------------------------------------------------------
-- 2. HSN TAX CODES
-- ------------------------------------------------------------------------------
INSERT INTO "Hsn" ("id", "code", "tax", "status", "createdAt", "updatedAt")
VALUES
  (101, '6109', 5, 'ACTIVE', NOW(), NOW()),   -- T-shirts & Knitwear (5%)
  (102, '6204', 12, 'ACTIVE', NOW(), NOW()),  -- Woven Jackets & Dresses (12%)
  (103, '6403', 18, 'ACTIVE', NOW(), NOW()),  -- Footwear & Shoes (18%)
  (104, '7117', 18, 'ACTIVE', NOW(), NOW()),  -- Accessories & Jewelry (18%)
  (105, '9004', 12, 'ACTIVE', NOW(), NOW())   -- Eyewear & Sunglasses (12%)
ON CONFLICT ("code") DO UPDATE SET "tax" = EXCLUDED."tax";

-- ------------------------------------------------------------------------------
-- 3. SIZES
-- ------------------------------------------------------------------------------
INSERT INTO "Size" ("id", "title", "status", "createdAt", "updatedAt")
VALUES
  (101, 'XS', 'ACTIVE', NOW(), NOW()),
  (102, 'S', 'ACTIVE', NOW(), NOW()),
  (103, 'M', 'ACTIVE', NOW(), NOW()),
  (104, 'L', 'ACTIVE', NOW(), NOW()),
  (105, 'XL', 'ACTIVE', NOW(), NOW()),
  (106, 'XXL', 'ACTIVE', NOW(), NOW()),
  (107, 'Free Size', 'ACTIVE', NOW(), NOW())
ON CONFLICT ("title") DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. COLORS
-- ------------------------------------------------------------------------------
INSERT INTO "Color" ("id", "title", "code", "status", "createdAt", "updatedAt")
VALUES
  (101, 'Midnight Black', '#18181B', 'ACTIVE', NOW(), NOW()),
  (102, 'Pure White', '#FFFFFF', 'ACTIVE', NOW(), NOW()),
  (103, 'Navy Blue', '#1E3A8A', 'ACTIVE', NOW(), NOW()),
  (104, 'Olive Green', '#3F6212', 'ACTIVE', NOW(), NOW()),
  (105, 'Crimson Red', '#991B1B', 'ACTIVE', NOW(), NOW()),
  (106, 'Heather Grey', '#6B7280', 'ACTIVE', NOW(), NOW()),
  (107, 'Rose Gold', '#B76E79', 'ACTIVE', NOW(), NOW()),
  (108, 'Camel Brown', '#C19A6B', 'ACTIVE', NOW(), NOW())
ON CONFLICT ("title") DO NOTHING;

-- ------------------------------------------------------------------------------
-- 5. CATEGORIES
-- ------------------------------------------------------------------------------
INSERT INTO "Category" ("id", "title", "slug", "status", "createdAt", "updatedAt")
VALUES
  (101, 'Men''s Apparel', 'mens-apparel', 'ACTIVE', NOW(), NOW()),
  (102, 'Women''s Apparel', 'womens-apparel', 'ACTIVE', NOW(), NOW()),
  (103, 'Footwear & Sneakers', 'footwear-sneakers', 'ACTIVE', NOW(), NOW()),
  (104, 'Bags & Accessories', 'bags-accessories', 'ACTIVE', NOW(), NOW()),
  (105, 'Watches & Jewelry', 'watches-jewelry', 'ACTIVE', NOW(), NOW()),
  (106, 'Eyewear & Sunglasses', 'eyewear-sunglasses', 'ACTIVE', NOW(), NOW()),
  (107, 'Activewear & Sportswear', 'activewear-sportswear', 'ACTIVE', NOW(), NOW()),
  (108, 'Winter Outerwear', 'winter-outerwear', 'ACTIVE', NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title";

-- Category Banner Images
INSERT INTO "File" ("id", "feature", "featureId", "path", "createdAt", "updatedAt")
VALUES
  (101, 'CATEGORY', 101, '/images/categories/categories-01.png', NOW(), NOW()),
  (102, 'CATEGORY', 102, '/images/categories/categories-02.png', NOW(), NOW()),
  (103, 'CATEGORY', 103, '/images/categories/categories-03.png', NOW(), NOW()),
  (104, 'CATEGORY', 104, '/images/categories/categories-04.png', NOW(), NOW()),
  (105, 'CATEGORY', 105, '/images/categories/categories-05.png', NOW(), NOW()),
  (106, 'CATEGORY', 106, '/images/categories/categories-06.png', NOW(), NOW()),
  (107, 'CATEGORY', 107, '/images/categories/categories-07.png', NOW(), NOW()),
  (108, 'CATEGORY', 108, 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET "path" = EXCLUDED."path";

-- ------------------------------------------------------------------------------
-- 6. PRODUCTS
-- ------------------------------------------------------------------------------
INSERT INTO "Product" ("id", "title", "slug", "description", "categoryId", "mrp", "price", "hsnId", "sizeId", "colorId", "variant", "status", "createdAt", "updatedAt")
VALUES
  (
    101,
    'Classic Heavyweight Organic Cotton T-Shirt',
    'classic-heavyweight-organic-cotton-t-shirt',
    'Crafted from 100% premium combed organic cotton. Features a relaxed cut, ribbed crewneck collar, and durable double-stitched hems designed for maximum daily comfort.',
    101, 49.99, 29.99, 101, 103, 101, 'Regular Fit', 'ACTIVE', NOW(), NOW()
  ),
  (
    102,
    'Urban Oversized Streetwear Fleece Hoodie',
    'urban-oversized-streetwear-fleece-hoodie',
    'Ultra-soft brushed fleece interior paired with a heavy drop-shoulder silhouette. Features kangaroo front pocket and double-lined hood for cold weather style.',
    101, 99.99, 69.99, 101, 104, 106, 'Oversized', 'ACTIVE', NOW(), NOW()
  ),
  (
    103,
    'Floral Print Pure Silk Wrap Summer Dress',
    'floral-print-pure-silk-wrap-summer-dress',
    'Elegantly crafted wrap dress made from lightweight breathable silk chiffon. Features an adjustable waist tie and graceful asymmetric hemline.',
    102, 129.99, 89.99, 102, 102, 105, 'Slim Fit', 'ACTIVE', NOW(), NOW()
  ),
  (
    104,
    'Tailored High-Waisted Linen Blend Trousers',
    'tailored-high-waisted-linen-blend-trousers',
    'Sophisticated high-rise trousers tailored from breathable flax linen and viscose blend. Built with subtle front pleats and side slip pockets.',
    102, 89.99, 59.99, 102, 103, 108, 'Tailored Fit', 'ACTIVE', NOW(), NOW()
  ),
  (
    105,
    'Pro Runner Air Cushion Sports Sneakers',
    'pro-runner-air-cushion-sports-sneakers',
    'Engineered mesh upper with high-responsiveness air cushioning mid-sole. Built for superior grip, shock absorption, and long-distance training comfort.',
    103, 159.99, 119.99, 103, 104, 102, 'Sport', 'ACTIVE', NOW(), NOW()
  ),
  (
    106,
    'Handcrafted Leather Chelsea Ankle Boots',
    'handcrafted-leather-chelsea-ankle-boots',
    'Premium full-grain leather Chelsea boots with elastic side gussets and a rubber outsole. Perfect balance of rugged durability and modern elegance.',
    103, 199.99, 149.99, 103, 105, 101, 'Classic', 'ACTIVE', NOW(), NOW()
  ),
  (
    107,
    'Minimalist Genuine Grain Leather Backpack',
    'minimalist-genuine-grain-leather-backpack',
    'Sleek modern backpack with dedicated 15-inch padded laptop compartment, water-resistant interior lining, and magnetic snap closure.',
    104, 119.99, 79.99, 104, 107, 108, 'Standard', 'ACTIVE', NOW(), NOW()
  ),
  (
    108,
    'Water-Resistant Tactical Messenger Bag',
    'water-resistant-tactical-messenger-bag',
    'Durable 1000D Cordura nylon canvas messenger bag featuring quick-release buckle straps and organizational multi-pocket dividers.',
    104, 74.99, 49.99, 104, 107, 104, 'Utility', 'ACTIVE', NOW(), NOW()
  ),
  (
    109,
    'Automatic Chronograph Rose Gold Mesh Watch',
    'automatic-chronograph-rose-gold-mesh-watch',
    'Precision Japanese quartz movement housed in a 40mm stainless steel case with scratch-resistant sapphire crystal glass and rose gold mesh band.',
    105, 299.99, 199.99, 104, 107, 107, 'Executive', 'ACTIVE', NOW(), NOW()
  ),
  (
    110,
    'Polarized Vintage Metal Frame Aviator Sunglasses',
    'polarized-vintage-metal-frame-aviator-sunglasses',
    'Classic aviator silhouette with ultra-light titanium metal frame and UV400 anti-glare polarized lenses for crystal-clear clarity.',
    106, 69.99, 39.99, 105, 107, 101, 'Unisex', 'ACTIVE', NOW(), NOW()
  ),
  (
    111,
    'Seamless Performance Dry-Fit Training Leggings',
    'seamless-performance-dry-fit-training-leggings',
    'Four-way stretch high-compression fabric designed for squat-proof performance, sweat-wicking breathability, and ergonomic support.',
    107, 64.99, 44.99, 101, 102, 103, 'High Rise', 'ACTIVE', NOW(), NOW()
  ),
  (
    112,
    'Thermal Insulated Waterproof Winter Puffer Coat',
    'thermal-insulated-waterproof-winter-puffer-coat',
    'Heavy-duty thermal insulation with windproof shell, detachable faux-fur hood, and deep fleece-lined handwarmer pockets.',
    108, 189.99, 139.99, 102, 105, 104, 'Heavy Duty', 'ACTIVE', NOW(), NOW()
  )
ON CONFLICT ("slug") DO UPDATE SET 
  "title" = EXCLUDED."title",
  "description" = EXCLUDED."description",
  "mrp" = EXCLUDED."mrp",
  "price" = EXCLUDED."price",
  "updatedAt" = NOW();

-- ------------------------------------------------------------------------------
-- 7. PRODUCT IMAGES (File Table)
-- ------------------------------------------------------------------------------
INSERT INTO "File" ("id", "feature", "featureId", "path", "createdAt", "updatedAt")
VALUES
  (110, 'PRODUCT', 101, '/images/products/product-1-bg-1.png', NOW(), NOW()),
  (111, 'PRODUCT', 101, '/images/products/product-1-bg-2.png', NOW(), NOW()),
  (112, 'PRODUCT', 102, '/images/products/product-2-bg-1.png', NOW(), NOW()),
  (113, 'PRODUCT', 102, '/images/products/product-2-bg-2.png', NOW(), NOW()),
  (114, 'PRODUCT', 103, '/images/products/product-3-bg-1.png', NOW(), NOW()),
  (115, 'PRODUCT', 103, '/images/products/product-3-bg-2.png', NOW(), NOW()),
  (116, 'PRODUCT', 104, '/images/products/product-4-bg-1.png', NOW(), NOW()),
  (117, 'PRODUCT', 104, '/images/products/product-4-bg-2.png', NOW(), NOW()),
  (118, 'PRODUCT', 105, '/images/products/product-5-bg-1.png', NOW(), NOW()),
  (119, 'PRODUCT', 105, '/images/products/product-5-bg-2.png', NOW(), NOW()),
  (120, 'PRODUCT', 106, '/images/products/product-6-bg-1.png', NOW(), NOW()),
  (121, 'PRODUCT', 106, '/images/products/product-6-bg-2.png', NOW(), NOW()),
  (122, 'PRODUCT', 107, '/images/products/product-7-bg-1.png', NOW(), NOW()),
  (123, 'PRODUCT', 107, '/images/products/product-7-bg-2.png', NOW(), NOW()),
  (124, 'PRODUCT', 108, '/images/products/product-8-bg-1.png', NOW(), NOW()),
  (125, 'PRODUCT', 109, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', NOW(), NOW()),
  (126, 'PRODUCT', 110, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', NOW(), NOW()),
  (127, 'PRODUCT', 111, 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80', NOW(), NOW()),
  (128, 'PRODUCT', 112, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET "path" = EXCLUDED."path";

-- ------------------------------------------------------------------------------
-- 8. PRODUCT STOCK INVENTORY
-- ------------------------------------------------------------------------------
INSERT INTO "Stock" ("id", "type", "productId", "quantity", "createdAt", "updatedAt")
VALUES
  (101, 'PRODUCT', 101, 150, NOW(), NOW()),
  (102, 'PRODUCT', 102, 85, NOW(), NOW()),
  (103, 'PRODUCT', 103, 40, NOW(), NOW()),
  (104, 'PRODUCT', 104, 60, NOW(), NOW()),
  (105, 'PRODUCT', 105, 120, NOW(), NOW()),
  (106, 'PRODUCT', 106, 35, NOW(), NOW()),
  (107, 'PRODUCT', 107, 75, NOW(), NOW()),
  (108, 'PRODUCT', 108, 90, NOW(), NOW()),
  (109, 'PRODUCT', 109, 25, NOW(), NOW()),
  (110, 'PRODUCT', 110, 110, NOW(), NOW()),
  (111, 'PRODUCT', 111, 95, NOW(), NOW()),
  (112, 'PRODUCT', 112, 45, NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET "quantity" = EXCLUDED."quantity";

-- ------------------------------------------------------------------------------
-- 9. PRODUCT REVIEWS & RATINGS
-- ------------------------------------------------------------------------------
INSERT INTO "ProductReview" ("id", "userId", "productId", "rating", "comment", "isHidden", "createdAt", "updatedAt")
VALUES
  (101, 102, 101, 5, 'Super soft fabric and perfect relaxed fit. Will definitely buy more colors!', false, NOW(), NOW()),
  (102, 103, 101, 4, 'Great quality t-shirt. Fits true to size.', false, NOW(), NOW()),
  (103, 102, 102, 5, 'Insanely warm hoodie, heavy weight fabric feels premium.', false, NOW(), NOW()),
  (104, 103, 105, 5, 'Super comfortable for daily running and gym workouts.', false, NOW(), NOW()),
  (105, 102, 107, 4, 'Leather quality is top notch. Plenty of room for laptop and charger.', false, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- ------------------------------------------------------------------------------
-- 10. APP CONFIGURATION DATA
-- ------------------------------------------------------------------------------
INSERT INTO "Config" ("id", "key", "value", "createdAt", "updatedAt")
VALUES
  (
    101,
    'COMP_INFO',
    '{"name": "DAMS Fashion & Lifestyle", "email": "support@dams.com", "phone": "+1 (800) 555-0199", "address": "100 Fashion Boulevard, Suite 400, New York, NY 10001"}'::jsonb,
    NOW(), NOW()
  ),
  (
    102,
    'SHIPPING',
    '{"amount": 5.99, "freeShippingThreshold": 99.00}'::jsonb,
    NOW(), NOW()
  )
ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = NOW();

-- ------------------------------------------------------------------------------
-- 11. SEQUENCE RE-SETTING (Crucial for Postgres Auto-Increment IDs)
-- ------------------------------------------------------------------------------
SELECT setval(pg_get_serial_sequence('"User"', 'id'), COALESCE((SELECT MAX(id) FROM "User"), 1));
SELECT setval(pg_get_serial_sequence('"Category"', 'id'), COALESCE((SELECT MAX(id) FROM "Category"), 1));
SELECT setval(pg_get_serial_sequence('"Hsn"', 'id'), COALESCE((SELECT MAX(id) FROM "Hsn"), 1));
SELECT setval(pg_get_serial_sequence('"Size"', 'id'), COALESCE((SELECT MAX(id) FROM "Size"), 1));
SELECT setval(pg_get_serial_sequence('"Color"', 'id'), COALESCE((SELECT MAX(id) FROM "Color"), 1));
SELECT setval(pg_get_serial_sequence('"Product"', 'id'), COALESCE((SELECT MAX(id) FROM "Product"), 1));
SELECT setval(pg_get_serial_sequence('"File"', 'id'), COALESCE((SELECT MAX(id) FROM "File"), 1));
SELECT setval(pg_get_serial_sequence('"Stock"', 'id'), COALESCE((SELECT MAX(id) FROM "Stock"), 1));
SELECT setval(pg_get_serial_sequence('"ProductReview"', 'id'), COALESCE((SELECT MAX(id) FROM "ProductReview"), 1));
SELECT setval(pg_get_serial_sequence('"Config"', 'id'), COALESCE((SELECT MAX(id) FROM "Config"), 1));
