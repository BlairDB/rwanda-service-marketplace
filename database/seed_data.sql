-- Seed data for Rwanda Real Estate Service Platform

-- Insert locations (Rwanda administrative divisions)
INSERT INTO locations (id, name_en, name_rw, location_type, parent_location_id) VALUES
-- Provinces
('550e8400-e29b-41d4-a716-446655440001', 'Kigali City', 'Umujyi wa Kigali', 'province', NULL),
('550e8400-e29b-41d4-a716-446655440002', 'Northern Province', 'Intara y''Amajyaruguru', 'province', NULL),
('550e8400-e29b-41d4-a716-446655440003', 'Southern Province', 'Intara y''Amajyepfo', 'province', NULL),
('550e8400-e29b-41d4-a716-446655440004', 'Eastern Province', 'Intara y''Iburasirazuba', 'province', NULL),
('550e8400-e29b-41d4-a716-446655440005', 'Western Province', 'Intara y''Iburengerazuba', 'province', NULL),

-- Kigali Districts
('550e8400-e29b-41d4-a716-446655440011', 'Gasabo', 'Gasabo', 'district', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440012', 'Kicukiro', 'Kicukiro', 'district', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440013', 'Nyarugenge', 'Nyarugenge', 'district', '550e8400-e29b-41d4-a716-446655440001');

-- Insert main service categories
INSERT INTO categories (id, name_en, name_rw, slug, description_en, description_rw, icon_name, sort_order) VALUES
-- Main categories
('550e8400-e29b-41d4-a716-446655440101', 'Pre-Transaction Services', 'Serivisi zo mbere y''ubucuruzi', 'pre-transaction', 'Services needed before buying or selling property', 'Serivisi zikenewe mbere yo kugura cyangwa kugurisha imitungo', 'search', 1),
('550e8400-e29b-41d4-a716-446655440102', 'Transaction Services', 'Serivisi z''ubucuruzi', 'transaction', 'Legal and financial services during property transactions', 'Serivisi z''amategeko n''amafaranga mu gihe cy''ubucuruzi bw''imitungo', 'document', 2),
('550e8400-e29b-41d4-a716-446655440103', 'Post-Transaction Services', 'Serivisi nyuma y''ubucuruzi', 'post-transaction', 'Construction and setup services after property acquisition', 'Serivisi z''ubwubatsi n''imitegurire nyuma yo kubona imitungo', 'hammer', 3),
('550e8400-e29b-41d4-a716-446655440104', 'Property Management', 'Gucunga imitungo', 'property-management', 'Ongoing property maintenance and management services', 'Serivisi zo gucunga no kubungabunga imitungo', 'building', 4),
('550e8400-e29b-41d4-a716-446655440105', 'Supporting Services', 'Serivisi zifasha', 'supporting-services', 'Materials, supplies and other supporting services', 'Ibikoresho, ibintu n''indi serivisi zifasha', 'truck', 5);

-- Pre-Transaction subcategories
INSERT INTO categories (id, name_en, name_rw, slug, description_en, parent_category_id, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440111', 'Real Estate Agents', 'Abacuruzi b''imitungo', 'real-estate-agents', 'Licensed real estate brokers and agents', '550e8400-e29b-41d4-a716-446655440101', 1),
('550e8400-e29b-41d4-a716-446655440112', 'Property Valuers', 'Abapima agaciro k''imitungo', 'property-valuers', 'Professional property appraisers and valuers', '550e8400-e29b-41d4-a716-446655440101', 2),
('550e8400-e29b-41d4-a716-446655440113', 'Land Surveyors', 'Abapima ubutaka', 'land-surveyors', 'Licensed land surveyors and mapping professionals', '550e8400-e29b-41d4-a716-446655440101', 3),
('550e8400-e29b-41d4-a716-446655440114', 'Architects', 'Abashushanya', 'architects', 'Licensed architects and building designers', '550e8400-e29b-41d4-a716-446655440101', 4),
('550e8400-e29b-41d4-a716-446655440115', 'Civil Engineers', 'Abashakashamikazi', 'civil-engineers', 'Structural and civil engineering professionals', '550e8400-e29b-41d4-a716-446655440101', 5),
('550e8400-e29b-41d4-a716-446655440116', 'Mortgage Officers', 'Abakozi b''inguzanyo z''imitungo', 'mortgage-officers', 'Bank loan officers and mortgage specialists', '550e8400-e29b-41d4-a716-446655440101', 6);

-- Transaction subcategories
INSERT INTO categories (id, name_en, name_rw, slug, description_en, parent_category_id, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440121', 'Notaries', 'Abanyabwenge', 'notaries', 'Licensed notaries for property documentation', '550e8400-e29b-41d4-a716-446655440102', 1),
('550e8400-e29b-41d4-a716-446655440122', 'Property Lawyers', 'Abavoka b''imitungo', 'property-lawyers', 'Legal professionals specializing in property law', '550e8400-e29b-41d4-a716-446655440102', 2),
('550e8400-e29b-41d4-a716-446655440123', 'Insurance Agents', 'Abakozi b''ubwishingizi', 'insurance-agents', 'Property and home insurance specialists', '550e8400-e29b-41d4-a716-446655440102', 3);

-- Post-Transaction subcategories
INSERT INTO categories (id, name_en, name_rw, slug, description_en, parent_category_id, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440131', 'Construction Contractors', 'Abakonzi', 'construction-contractors', 'General contractors and construction companies', '550e8400-e29b-41d4-a716-446655440103', 1),
('550e8400-e29b-41d4-a716-446655440132', 'Interior Designers', 'Abashushanya imbere y''amazu', 'interior-designers', 'Interior design and decoration professionals', '550e8400-e29b-41d4-a716-446655440103', 2),
('550e8400-e29b-41d4-a716-446655440133', 'Specialized Trades', 'Imyuga yihariye', 'specialized-trades', 'Plumbers, electricians, painters, tilers', '550e8400-e29b-41d4-a716-446655440103', 3),
('550e8400-e29b-41d4-a716-446655440134', 'Moving Services', 'Serivisi zo kwimura', 'moving-services', 'Professional moving and relocation companies', '550e8400-e29b-41d4-a716-446655440103', 4),
('550e8400-e29b-41d4-a716-446655440135', 'Security Services', 'Serivisi z''umutekano', 'security-services', 'Security installation and guard services', '550e8400-e29b-41d4-a716-446655440103', 5);

-- Property Management subcategories
INSERT INTO categories (id, name_en, name_rw, slug, description_en, parent_category_id, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440141', 'Property Managers', 'Abacunga imitungo', 'property-managers', 'Professional property management companies', '550e8400-e29b-41d4-a716-446655440104', 1),
('550e8400-e29b-41d4-a716-446655440142', 'Maintenance Services', 'Serivisi zo kubungabunga', 'maintenance-services', 'Repair and maintenance professionals', '550e8400-e29b-41d4-a716-446655440104', 2),
('550e8400-e29b-41d4-a716-446655440143', 'Cleaning Services', 'Serivisi zo gusukura', 'cleaning-services', 'Professional cleaning and fumigation services', '550e8400-e29b-41d4-a716-446655440104', 3),
('550e8400-e29b-41d4-a716-446655440144', 'Utility Support', 'Ubufasha bw''ibikorwa remezo', 'utility-support', 'WASAC, REG and utility liaison services', '550e8400-e29b-41d4-a716-446655440104', 4);

-- Supporting Services subcategories
INSERT INTO categories (id, name_en, name_rw, slug, description_en, parent_category_id, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440151', 'Hardware Stores', 'Amaduka y''ibikoresho', 'hardware-stores', 'Construction materials and hardware suppliers', '550e8400-e29b-41d4-a716-446655440105', 1),
('550e8400-e29b-41d4-a716-446655440152', 'Material Suppliers', 'Abatanga ibikoresho', 'material-suppliers', 'Cement, steel, tiles and building material suppliers', '550e8400-e29b-41d4-a716-446655440105', 2),
('550e8400-e29b-41d4-a716-446655440153', 'Furniture Stores', 'Amaduka y''ibikoresho by''amazu', 'furniture-stores', 'Furniture and home appliance retailers', '550e8400-e29b-41d4-a716-446655440105', 3),
('550e8400-e29b-41d4-a716-446655440154', 'Smart Home Services', 'Serivisi z''amazu y''ubwenge', 'smart-home-services', 'Smart home device installation and automation', '550e8400-e29b-41d4-a716-446655440105', 4);

-- Insert sample users
INSERT INTO users (id, email, phone, password_hash, first_name, last_name, user_type, email_verified) VALUES
('550e8400-e29b-41d4-a716-446655440201', 'admin@servicerw.com', '+250788000001', '$2b$10$example', 'Admin', 'User', 'admin', true),
('550e8400-e29b-41d4-a716-446655440202', 'john.doe@email.com', '+250788000002', '$2b$10$example', 'John', 'Doe', 'customer', true),
('550e8400-e29b-41d4-a716-446655440203', 'jane.smith@email.com', '+250788000003', '$2b$10$example', 'Jane', 'Smith', 'provider', true),
('550e8400-e29b-41d4-a716-446655440204', 'peter.builder@email.com', '+250788000004', '$2b$10$example', 'Peter', 'Uwimana', 'provider', true),
('550e8400-e29b-41d4-a716-446655440205', 'marie.realtor@email.com', '+250788000005', '$2b$10$example', 'Marie', 'Mukamana', 'provider', true);

-- Insert sample businesses
INSERT INTO businesses (id, owner_id, business_name, slug, description_en, category_id, location_id, address_en, phone_primary, whatsapp_number, email, is_verified, status) VALUES
-- Real Estate Agents
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440205', 'Kigali Premium Properties', 'kigali-premium-properties', 'Leading real estate agency in Kigali specializing in residential and commercial properties. Over 10 years of experience helping clients buy, sell, and rent properties across Rwanda.', '550e8400-e29b-41d4-a716-446655440111', '550e8400-e29b-41d4-a716-446655440011', 'KG 15 Ave, Kimisagara, Gasabo', '+250788123456', '+250788123456', 'info@kigaliproperties.rw', true, 'approved'),

('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440203', 'Rwanda Property Solutions', 'rwanda-property-solutions', 'Trusted real estate consultancy offering comprehensive property services including sales, rentals, and investment advice throughout Rwanda.', '550e8400-e29b-41d4-a716-446655440111', '550e8400-e29b-41d4-a716-446655440012', 'KG 201 St, Niboye, Kicukiro', '+250788234567', '+250788234567', 'contact@rwandaproperties.com', true, 'approved'),

-- Construction Contractors
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440204', 'BuildRight Construction Ltd', 'buildright-construction', 'Professional construction company specializing in residential and commercial buildings. Full-service from foundation to finishing with certified engineers and quality materials.', '550e8400-e29b-41d4-a716-446655440131', '550e8400-e29b-41d4-a716-446655440011', 'KG 45 Ave, Remera, Gasabo', '+250788345678', '+250788345678', 'info@buildright.rw', true, 'approved'),

('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440204', 'Modern Builders Rwanda', 'modern-builders-rwanda', 'Innovative construction company using modern techniques and sustainable materials. Specializing in eco-friendly residential and commercial projects.', '550e8400-e29b-41d4-a716-446655440131', '550e8400-e29b-41d4-a716-446655440013', 'KG 301 St, Nyamirambo, Nyarugenge', '+250788456789', '+250788456789', 'hello@modernbuilders.rw', false, 'approved'),

-- Architects
('550e8400-e29b-41d4-a716-446655440305', '550e8400-e29b-41d4-a716-446655440203', 'Design Studio Rwanda', 'design-studio-rwanda', 'Award-winning architectural firm creating innovative and sustainable designs for residential, commercial, and institutional projects across Rwanda.', '550e8400-e29b-41d4-a716-446655440114', '550e8400-e29b-41d4-a716-446655440011', 'KG 12 Ave, Kacyiru, Gasabo', '+250788567890', '+250788567890', 'studio@designrwanda.com', true, 'approved'),

-- Property Valuers
('550e8400-e29b-41d4-a716-446655440306', '550e8400-e29b-41d4-a716-446655440205', 'Rwanda Property Valuers', 'rwanda-property-valuers', 'Certified property valuation services for banks, insurance companies, and private clients. Accurate and timely property assessments across all property types.', '550e8400-e29b-41d4-a716-446655440112', '550e8400-e29b-41d4-a716-446655440012', 'KG 78 St, Gikondo, Kicukiro', '+250788678901', '+250788678901', 'valuations@rwandavaluers.com', true, 'approved'),

-- Notaries
('550e8400-e29b-41d4-a716-446655440307', '550e8400-e29b-41d4-a716-446655440203', 'Legal Documents Rwanda', 'legal-documents-rwanda', 'Licensed notary services for all property transactions. Fast, reliable, and professional documentation services with multilingual support.', '550e8400-e29b-41d4-a716-446655440121', '550e8400-e29b-41d4-a716-446655440013', 'KG 89 Ave, Muhima, Nyarugenge', '+250788789012', '+250788789012', 'notary@legaldocs.rw', true, 'approved'),

-- Interior Designers
('550e8400-e29b-41d4-a716-446655440308', '550e8400-e29b-41d4-a716-446655440205', 'Home Design Studio', 'home-design-studio', 'Creative interior design solutions for modern Rwandan homes. Specializing in contemporary African designs with international standards.', '550e8400-e29b-41d4-a716-446655440132', '550e8400-e29b-41d4-a716-446655440011', 'KG 34 St, Kimihurura, Gasabo', '+250788890123', '+250788890123', 'design@homestudio.rw', false, 'approved'),

-- Specialized Trades - Plumbers
('550e8400-e29b-41d4-a716-446655440309', '550e8400-e29b-41d4-a716-446655440204', 'TechFix Rwanda', 'techfix-rwanda', 'Professional plumbing, electrical, and HVAC services. 24/7 emergency services available across Kigali with certified technicians.', '550e8400-e29b-41d4-a716-446655440133', '550e8400-e29b-41d4-a716-446655440012', 'KG 56 Ave, Nyarutarama, Gasabo', '+250788901234', '+250788901234', 'service@techfix.rw', true, 'approved'),

-- Moving Services
('550e8400-e29b-41d4-a716-446655440310', '550e8400-e29b-41d4-a716-446655440203', 'Swift Movers Rwanda', 'swift-movers-rwanda', 'Professional moving and relocation services with secure storage facilities. Serving residential and commercial clients throughout Rwanda.', '550e8400-e29b-41d4-a716-446655440134', '550e8400-e29b-41d4-a716-446655440013', 'KG 67 St, Kigali City Center', '+250789012345', '+250789012345', 'book@swiftmovers.rw', true, 'approved'),

-- Property Managers
('550e8400-e29b-41d4-a716-446655440311', '550e8400-e29b-41d4-a716-446655440205', 'Elite Property Management', 'elite-property-management', 'Comprehensive property management services for landlords and property investors. Tenant screening, rent collection, and maintenance coordination.', '550e8400-e29b-41d4-a716-446655440141', '550e8400-e29b-41d4-a716-446655440011', 'KG 23 Ave, Kacyiru, Gasabo', '+250789123456', '+250789123456', 'manage@elitepm.rw', true, 'approved'),

-- Cleaning Services
('550e8400-e29b-41d4-a716-446655440312', '550e8400-e29b-41d4-a716-446655440204', 'CleanPro Services', 'cleanpro-services', 'Professional cleaning services for homes and offices. Post-construction cleaning, pest control, landscaping, and property maintenance.', '550e8400-e29b-41d4-a716-446655440143', '550e8400-e29b-41d4-a716-446655440012', 'KG 45 St, Gisozi, Gasabo', '+250789234567', '+250789234567', 'info@cleanpro.rw', false, 'approved'),

-- Hardware Stores
('550e8400-e29b-41d4-a716-446655440313', '550e8400-e29b-41d4-a716-446655440203', 'BuildMart Rwanda', 'buildmart-rwanda', 'One-stop shop for all construction materials and hardware. Quality products from trusted suppliers with competitive prices and delivery services.', '550e8400-e29b-41d4-a716-446655440151', '550e8400-e29b-41d4-a716-446655440013', 'KG 78 Ave, Nyabugogo, Nyarugenge', '+250789345678', '+250789345678', 'sales@buildmart.rw', true, 'approved'),

-- Material Suppliers
('550e8400-e29b-41d4-a716-446655440314', '550e8400-e29b-41d4-a716-446655440205', 'Rwanda Steel & Cement', 'rwanda-steel-cement', 'Leading supplier of construction materials including cement, steel, tiles, and roofing materials. Bulk orders and project supply services available.', '550e8400-e29b-41d4-a716-446655440152', '550e8400-e29b-41d4-a716-446655440011', 'KG 90 St, Industrial Zone, Gasabo', '+250789456789', '+250789456789', 'supply@rwandasteel.com', true, 'approved'),

-- Smart Home Services
('550e8400-e29b-41d4-a716-446655440315', '550e8400-e29b-41d4-a716-446655440204', 'SmartHome Rwanda', 'smarthome-rwanda', 'Modern smart home solutions including automation systems, security cameras, smart lighting, and IoT device installation for contemporary homes.', '550e8400-e29b-41d4-a716-446655440154', '550e8400-e29b-41d4-a716-446655440012', 'KG 12 Ave, Kigali Heights, Gasabo', '+250789567890', '+250789567890', 'tech@smarthome.rw', false, 'approved');
