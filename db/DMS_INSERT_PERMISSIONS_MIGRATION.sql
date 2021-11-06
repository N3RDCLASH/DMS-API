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