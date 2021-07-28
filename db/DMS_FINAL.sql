USE test_dms;
CREATE TABLE users(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL
);
CREATE TABLE documents(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    file VARCHAR(255) NOT NULL,
    owner_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL
);
CREATE TABLE users_log(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    firstname_old TEXT NOT NULL,
    lastname_old TEXT NOT NULL,
    username_old TEXT NOT NULL,
    email_old TEXT NOT NULL,
    password_old TEXT NOT NULL,
    firstname_new TEXT NOT NULL,
    lastname_new TEXT NOT NULL,
    username_new TEXT NOT NULL,
    email_new TEXT NOT NULL,
    password_new TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    updated_by INT NOT NULL
);
CREATE TABLE documents_log(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    document_id INT NOT NULL,
    owner_id_old INT NOT NULL,
    owner_id_new INT NOT NULL,
    file_old VARCHAR(255) NOT NULL,
    file_new VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    updated_by INT NOT NULL
);
CREATE TABLE roles(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL
);
CREATE TABLE roles_log(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    name_new VARCHAR(255) NOT NULL,
    name_old VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP NULL,
    updated_by INT NULL
);
CREATE TABLE permissions(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL
);
CREATE TABLE user_has_roles(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL
);
CREATE TABLE role_has_permissions(
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    permission_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY(permission_id, role_id)
);
CREATE TABLE document_shared_with_user(
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    document_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    PRIMARY KEY(document_id, user_id)
);
ALTER TABLE `user_has_roles`
ADD CONSTRAINT `user_has_roles_role_id_foreign` FOREIGN KEY(`role_id`) REFERENCES `roles`(`id`);
ALTER TABLE `user_has_roles`
ADD CONSTRAINT `user_has_roles_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`id`);
ALTER TABLE `documents`
ADD CONSTRAINT `documents_owner_id_foreign` FOREIGN KEY(`owner_id`) REFERENCES `users`(`id`);
ALTER TABLE `document_shared_with_user`
ADD CONSTRAINT `document_shared_with_user_document_id_foreign` FOREIGN KEY(`document_id`) REFERENCES `documents`(`id`);
ALTER TABLE `document_shared_with_user`
ADD CONSTRAINT `document_shared_with_user_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`id`);
ALTER TABLE `role_has_permissions`
ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY(`permission_id`) REFERENCES `permissions`(`id`);
ALTER TABLE `role_has_permissions`
ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY(`role_id`) REFERENCES `roles`(`id`);
-- documents trigger ;
CREATE TRIGGER documents_log_BEFORE_UPDATE BEFORE
UPDATE ON documents FOR EACH ROW
INSERT INTO documents_log
SET document_id = NEW.id,
    owner_id_old = OLD.owner_id,
    owner_id_new = NEW.owner_id,
    file_old = OLD.file,
    file_new = NEW.file,
    updated_at = CURRENT_TIMESTAMP,
    updated_by = NEW.owner_id;
-- users log trigger;
CREATE TRIGGER users_log_BEFORE_UPDATE BEFORE
UPDATE ON users FOR EACH ROW
INSERT INTO users_log
SET user_id = NEW.id,
    firstname_old = OLD.firstname,
    firstname_new = NEW.firstname,
    lastname_old = OLD.lastname,
    lastname_new = NEW.lastname,
    username_old = OLD.username,
    username_new = NEW.username,
    email_old = OLD.email,
    email_new = NEW.email,
    password_old = OLD.password,
    password_new = NEW.password,
    updated_at = CURRENT_TIMESTAMP,
    updated_by = NEW.id;
-- roles log trigger;
CREATE TRIGGER roles_log_BEFORE_UPDATE BEFORE
UPDATE ON ROLES FOR EACH ROW
INSERT INTO roles_log
SET role_id = NEW.id,
    name_old = OLD.name,
    name_new = NEW.name,
    updated_at = CURRENT_TIMESTAMP;
-- Insert Default Permissions and roles
INSERT INTO `permissions` (`name`)
VALUES ('CREATE_USER');
INSERT INTO `permissions` (`name`)
VALUES ('READ_USER');
INSERT INTO `permissions` (`name`)
VALUES ('UPDATE_USER');
INSERT INTO `permissions` (`name`)
VALUES ('DELETE_USER');
-- 
INSERT INTO `permissions` (`name`)
VALUES ('CREATE_DOCUMENTS');
INSERT INTO `permissions` (`name`)
VALUES ('READ_DOCUMENTS');
INSERT INTO `permissions` (`name`)
VALUES ('UPDATE_DOCUMENTS');
INSERT INTO `permissions` (`name`)
VALUES ('DELETE_DOCUMENTS');
INSERT INTO `permissions` (`name`)
VALUES ('SHARE_DOCUMENTS');
-- 
INSERT INTO `permissions` (`name`)
VALUES ('CREATE_ROLES');
INSERT INTO `permissions` (`name`)
VALUES ('READ_ROLES');
INSERT INTO `permissions` (`name`)
VALUES ('UPDATE_ROLES');
INSERT INTO `permissions` (`name`)
VALUES ('DELETE_ROLES');
-- 
INSERT INTO `roles` (`name`)
VALUES ('admin');
INSERT INTO `roles` (`name`)
VALUES ('user');