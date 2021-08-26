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
    user_id INT NOT NULL,
    role_id INT NOT NULL
);
CREATE TABLE role_has_permissions(
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
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



-- 

-- 
