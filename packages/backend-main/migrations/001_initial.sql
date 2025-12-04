-- 域名表
CREATE TABLE IF NOT EXISTS domains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 证书表
CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain_id INTEGER NOT NULL,
    certificate_data TEXT NOT NULL,
    private_key TEXT,
    valid_from DATETIME,
    valid_to DATETIME,
    status TEXT DEFAULT 'valid' CHECK (status IN ('valid', 'expiring', 'expired', 'revoked')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE CASCADE
);

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_certificates_domain_id ON certificates(domain_id);
CREATE INDEX IF NOT EXISTS idx_certificates_valid_to ON certificates(valid_to);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status);
CREATE INDEX IF NOT EXISTS idx_domains_name ON domains(name);
CREATE INDEX IF NOT EXISTS idx_domains_status ON domains(status);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 插入默认管理员用户（密码：admin123）
INSERT OR IGNORE INTO users (username, email, password_hash, role, status) 
VALUES ('admin', 'admin@example.com', 'admin123', 'admin', 'active');

-- 插入测试数据
INSERT OR IGNORE INTO domains (name, description, status) VALUES 
('example.com', 'Example domain for testing', 'active'),
('test.com', 'Test domain', 'active'),
('demo.com', 'Demo domain', 'inactive');

INSERT OR IGNORE INTO certificates (domain_id, certificate_data, valid_from, valid_to, status) VALUES 
(1, '-----BEGIN CERTIFICATE-----\nMIICljCCAX4CCQCKOGJQlJdZVTANBgkqhkiG9w0BAQsFADANMQswCQYDVQQGEwJV\nUzAeFw0yNDEwMDEwMDAwMDBaFw0yNTEwMDEwMDAwMDBaMA0xCzAJBgNVBAYTAlVT\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuJTzHtK8E2tQJbLKnVm\n-----END CERTIFICATE-----', 
datetime('now', '-30 days'), datetime('now', '+335 days'), 'valid'),
(1, '-----BEGIN CERTIFICATE-----\nMIICljCCAX4CCQCKOGJQlJdZVTANBgkqhkiG9w0BAQsFADANMQswCQYDVQQGEwJV\nUzAeFw0yMzEwMDEwMDAwMDBaFw0yNDEwMDEwMDAwMDBaMA0xCzAJBgNVBAYTAlVT\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuJTzHtK8E2tQJbLKnVm\n-----END CERTIFICATE-----', 
datetime('now', '-395 days'), datetime('now', '-30 days'), 'expired'),
(2, '-----BEGIN CERTIFICATE-----\nMIICljCCAX4CCQCKOGJQlJdZVTANBgkqhkiG9w0BAQsFADANMQswCQYDVQQGEwJV\nUzAeFw0yNDA1MDEwMDAwMDBaFw0yNTA1MDEwMDAwMDBaMA0xCzAJBgNVBAYTAlVT\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuJTzHtK8E2tQJbLKnVm\n-----END CERTIFICATE-----', 
datetime('now', '-60 days'), datetime('now', '+60 days'), 'expiring');