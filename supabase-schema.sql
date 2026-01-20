-- HerboGene LifeSciences E-Commerce Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    details TEXT,
    ingredients TEXT,
    price DECIMAL(10, 2) NOT NULL,
    mrp DECIMAL(10, 2),
    image_path VARCHAR(500),
    category VARCHAR(100),
    stock_quantity INTEGER DEFAULT 100,
    low_stock_threshold INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    gst_rate DECIMAL(5, 2) DEFAULT 18.00,
    weight_grams INTEGER DEFAULT 100,
    hsn_code VARCHAR(20) DEFAULT '21069099',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_slug ON products(slug);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,

    -- Customer Information
    customer_first_name VARCHAR(100) NOT NULL,
    customer_last_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,

    -- Shipping Address
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100) NOT NULL,
    shipping_pincode VARCHAR(10) NOT NULL,

    -- Order Amounts
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    coupon_code VARCHAR(50),
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    gst_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,

    -- Payment Information
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('razorpay', 'cod')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),

    -- Order Status
    order_status VARCHAR(30) DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
    tracking_number VARCHAR(100),
    shipping_carrier VARCHAR(100),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for orders
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_razorpay_order_id ON orders(razorpay_order_id);

-- =============================================
-- ORDER ITEMS TABLE
-- =============================================
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,

    -- Snapshot of product at time of purchase
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(10, 2) NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for order items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- =============================================
-- COUPONS TABLE
-- =============================================
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    minimum_order_amount DECIMAL(10, 2) DEFAULT 0,
    maximum_discount DECIMAL(10, 2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for coupons
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_is_active ON coupons(is_active);

-- =============================================
-- ADMIN USERS TABLE
-- =============================================
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for admin users
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- =============================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can read active products
CREATE POLICY "Anyone can view active products" ON products
    FOR SELECT USING (is_active = true);

-- Products: Service role can do everything
CREATE POLICY "Service role full access to products" ON products
    FOR ALL USING (auth.role() = 'service_role');

-- Orders: Service role can do everything
CREATE POLICY "Service role full access to orders" ON orders
    FOR ALL USING (auth.role() = 'service_role');

-- Order Items: Service role can do everything
CREATE POLICY "Service role full access to order_items" ON order_items
    FOR ALL USING (auth.role() = 'service_role');

-- Coupons: Anyone can read active coupons
CREATE POLICY "Anyone can view active coupons" ON coupons
    FOR SELECT USING (is_active = true);

-- Coupons: Service role can do everything
CREATE POLICY "Service role full access to coupons" ON coupons
    FOR ALL USING (auth.role() = 'service_role');

-- Admin Users: Service role can do everything
CREATE POLICY "Service role full access to admin_users" ON admin_users
    FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- SEED DATA: PRODUCTS
-- =============================================
INSERT INTO products (id, name, slug, description, details, ingredients, price, mrp, image_path, category, stock_quantity, gst_rate) VALUES
(1, 'Petoo-G Regular', 'petoo-g-regular', 'Expertly formulated digestive tablets for daily gut health and comfort.', 'Petoo-G Regular is our flagship digestive tablet, crafted with a time-tested blend of herbs and spices. It aids in digestion, relieves gas and bloating, and supports overall gut health. Perfect for after-meal consumption.', 'Black Salt, Cumin, Ginger, Black Pepper, Hing (Asafoetida)', 150, 180, '/products/regular.jpg', 'Digestive Tablets', 100, 18),
(2, 'Petoo-G Pudina', 'petoo-g-pudina', 'Refreshing mint-flavored digestive aid that soothes the stomach instantly.', 'Experience the cooling sensation of mint with Petoo-G Pudina. This variant combines the digestive power of Petoo-G with the refreshing taste of mint, making it an excellent choice for soothing acidity and nausea.', 'Mint Leaves, Black Salt, Cumin, Sugar', 160, 190, '/products/pudina.jpg', 'Digestive Tablets', 100, 18),
(3, 'Petoo-G Mango', 'petoo-g-mango', 'Tangy mango-flavored tablets that make digestion a delicious experience.', 'Petoo-G Mango brings the tangy goodness of raw mangoes to your digestive routine. It''s a favorite among kids and adults alike, stimulating the taste buds and promoting healthy appetite.', 'Dry Mango Powder, Black Salt, Spices', 160, 190, '/products/mango.jpg', 'Digestive Tablets', 100, 18),
(4, 'Petoo-G Imli', 'petoo-g-imli', 'Traditional tamarind zest combined with digestive herbs for tangy relief.', 'Relive your childhood memories with the sweet and sour taste of Imli (Tamarind). Petoo-G Imli is excellent for digestion and acts as a natural laxative.', 'Tamarind Pulp, Jaggery, Spices', 150, 180, '/products/imli.jpg', 'Digestive Tablets', 100, 18),
(5, 'Petoo-G Hing Goli', 'petoo-g-hing-goli', 'Classic Hing (Asafoetida) formulation for gas relief and improved digestion.', 'Hing (Asafoetida) is known as the ''Food of the Gods'' for its digestive properties. Petoo-G Hing Goli is a potent remedy for gas, bloating, and indigestion.', 'Hing, Black Salt, Dry Ginger', 140, 170, '/products/hing_goli.jpg', 'Digestive Tablets', 100, 18),
(6, 'Petoo-G Chand Tare', 'petoo-g-chand-tare', 'Unique star-shaped digestive treats loved by children and adults alike.', 'Fun shapes meet serious health benefits. Petoo-G Chand Tare are star and moon shaped digestive candies that make taking care of your tummy fun.', 'Sugar, Spices, Fruit Extracts', 120, 150, '/products/chaand_tare.jpg', 'Candy', 100, 18),
(7, 'Petoo-G Anardana', 'petoo-g-anardana', 'Rich pomegranate seeds blended with spices for a sweet and sour digestive treat.', 'Made from sun-dried pomegranate seeds, Petoo-G Anardana is rich in antioxidants and helps in relieving acidity and nausea.', 'Pomegranate Seeds, Black Pepper, Cumin', 180, 220, '/products/anardana.jpg', 'Digestive Tablets', 100, 18),
(8, 'Petoo-G Jal Jeera', 'petoo-g-jal-jeera', 'Cooling cumin spice blend that aids digestion and refreshes the body.', 'A perfect summer companion, Petoo-G Jal Jeera helps in cooling the body and improving digestion with its robust cumin flavor.', 'Cumin, Mint, Black Salt, Lemon Acid', 130, 160, '/products/jal_jeera.jpg', 'Digestive Tablets', 100, 18),
(9, 'Petoo-G Gol Gappe', 'petoo-g-gol-gappe', 'The authentic spicy taste of street food in a healthy digestive tablet form.', 'Get the zing of Gol Gappe water in a convenient tablet. A spicy, tangy treat that kickstarts digestion.', 'Mint, Coriander, Green Chilli, Spices', 140, 170, '/products/gol_gappe.jpg', 'Digestive Tablets', 100, 18),
(10, 'Petoo-G Candy', 'petoo-g-candy', 'Sweet digestive candies that combine taste with health benefits.', 'Hard boiled candies infused with digestive herbs. A quick and easy way to freshen your breath and settle your stomach.', 'Sugar, Herbal Extracts', 100, 120, '/products/candy.jpg', 'Candy', 100, 18),
(11, 'Petoo-G Chatters Pudina', 'petoo-g-chatters-pudina', 'Crunchy mint snacks that are light on the stomach and big on flavor.', 'Light, airy, and crispy snacks dusted with refreshing mint powder. Fried in healthy oils.', 'Rice Flour, Mint Powder, Edible Oil', 50, 60, '/products/chatters_pudina.jpg', 'Snacks', 100, 18),
(12, 'Petoo-G Chatters Tomato', 'petoo-g-chatters-tomato', 'Tangy tomato snacks made with wholesome ingredients for guilt-free munching.', 'The classic tang of tomato in a crunchy snack format. Perfect for tea-time munching.', 'Rice Flour, Tomato Powder, Spices', 50, 60, '/products/chatters_tomato.jpg', 'Snacks', 100, 18),
(13, 'Petoo-G Chips Onion', 'petoo-g-chips-onion', 'Savory onion flavored chips that are baked for a healthier snacking option.', 'Baked not fried. These onion chips offer a savory crunch without the excess oil.', 'Potato, Onion Powder, Spices', 60, 80, '/products/chips_onion.jpg', 'Snacks', 100, 18),
(14, 'Petoo-G Chips Tomato', 'petoo-g-chips-tomato', 'Classic tomato chips with a unique herbal twist for better digestion.', 'Crispy tomato chips seasoned with a hint of digestive herbs.', 'Potato, Tomato Powder, Herbs', 60, 80, '/products/chips_tomato.jpg', 'Snacks', 100, 18);

-- Reset the sequence to continue from the last inserted ID
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

-- =============================================
-- SEED DATA: SAMPLE COUPONS
-- =============================================
INSERT INTO coupons (code, description, discount_type, discount_value, minimum_order_amount, maximum_discount, usage_limit, is_active) VALUES
('WELCOME10', 'Welcome discount - 10% off on first order', 'percentage', 10, 200, 100, 1000, true),
('FLAT50', 'Flat Rs. 50 off on orders above Rs. 500', 'fixed', 50, 500, 50, 500, true),
('HERBOGENE20', 'Special 20% discount', 'percentage', 20, 300, 200, 100, true);

-- =============================================
-- SEED DATA: DEFAULT ADMIN USER
-- Password: admin123 (hashed with bcrypt)
-- IMPORTANT: Change this password after first login!
-- =============================================
INSERT INTO admin_users (email, password_hash, name, role) VALUES
('admin@herbogene.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4gd7X.q8MXo5XWTS', 'Admin', 'super_admin');

-- =============================================
-- HELPFUL VIEWS
-- =============================================

-- View for orders with item count
CREATE OR REPLACE VIEW orders_summary AS
SELECT
    o.*,
    COUNT(oi.id) as item_count,
    COALESCE(SUM(oi.quantity), 0) as total_items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

-- View for low stock products
CREATE OR REPLACE VIEW low_stock_products AS
SELECT * FROM products
WHERE stock_quantity <= low_stock_threshold
AND is_active = true;

-- View for daily order statistics
CREATE OR REPLACE VIEW daily_order_stats AS
SELECT
    DATE(created_at) as order_date,
    COUNT(*) as total_orders,
    SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_orders,
    SUM(CASE WHEN order_status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
    SUM(total_amount) as total_revenue,
    SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as collected_revenue
FROM orders
GROUP BY DATE(created_at)
ORDER BY order_date DESC;
