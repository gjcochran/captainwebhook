
-- Drop tables for reset
DROP TABLE IF EXISTS request;
DROP TABLE IF EXISTS request_bin;

CREATE TABLE request_bin (
    id SERIAL PRIMARY KEY,
    bin_id VARCHAR(13) UNIQUE NOT NULL
);

CREATE TABLE request (
    id SERIAL PRIMARY KEY,
    requestbin_id INTEGER NOT NULL REFERENCES request_bin(id) ON DELETE CASCADE,
    mongo_key VARCHAR(50),
    method VARCHAR(10),
    path_name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Generated dummy data below
INSERT INTO request_bin (bin_id) VALUES
('XyZ123Abc4567'),
('AbC789XyZ3210'),
('PqR456LmN7890'),
('GhI012JkL3456'),
('MnO678VwX1234');

INSERT INTO request (requestbin_id, mongo_key, method, path_name, created_at) VALUES
(1, 'a1b2c3d4e5f6a7b8c9d0e1f2', 'GET', '/api/v1/resource', '2024-05-26 10:30:00 UTC'),
(1, 'zxy98765432109876543210', 'GET', '/api/v2/resource', '2024-05-26 13:00:00 UTC'),
(1, 'mnopqrs1234567890abcdef', 'POST', '/api/v1/new', '2024-05-26 16:00:00 UTC'),

(2, 'f6e5d4c3b2a1f6e5d4c3b2a1', 'POST', '/api/v1/resource', '2024-05-26 11:00:00 UTC'),
(2, 'mnopqrstuvwxmnopqrstuvwx', 'POST', '/api/v2/resource', '2024-05-26 13:30:00 UTC'),

(3, '1234567890abcdef12345678', 'PUT', '/api/v1/update', '2024-05-26 11:30:00 UTC'),

(4, '0987654321fe0987654321fe', 'PATCH', '/api/v1/patch', '2024-05-26 12:30:00 UTC'),
(4, 'stuvwxmnopqrstuvwxmnopqr', 'PATCH', '/api/v2/patch', '2024-05-26 15:00:00 UTC'),
(4, 'yzabcdef1234567890abcdef', 'GET', '/api/v1/info', '2024-05-26 20:00:00 UTC');
