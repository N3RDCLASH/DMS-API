-- documents trigger ;
CREATE TRIGGER documents_log_BEFORE_UPDATE BEFORE
UPDATE
    ON documents FOR EACH ROW
INSERT INTO
    documents_log
SET
    document_id = NEW.id,
    owner_id_old = OLD.owner_id,
    owner_id_new = NEW.owner_id,
    file_old = OLD.file,
    file_new = NEW.file,
    updated_at = CURRENT_TIMESTAMP,
    updated_by = NEW.updated_by;

-- users log trigger;
CREATE TRIGGER users_log_BEFORE_UPDATE BEFORE
UPDATE
    ON users FOR EACH ROW
INSERT INTO
    users_log
SET
    user_id = NEW.id,
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
    updated_by = NEW.updated_by;

-- roles log trigger;
CREATE TRIGGER roles_log_BEFORE_UPDATE BEFORE
UPDATE
    ON ROLES FOR EACH ROW
INSERT INTO
    roles_log
SET
    role_id = NEW.id,
    name_old = OLD.name,
    name_new = NEW.name,
    updated_at = CURRENT_TIMESTAMP,
    updated_by = NEW.updated_by;