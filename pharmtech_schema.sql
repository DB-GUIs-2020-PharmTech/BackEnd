CREATE DATABASE pharmtech; 

USE pharmtech;

CREATE TABLE user_type(
	id INT AUTO_INCREMENT,
    type VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE user(
	id INT AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    password VARCHAR(100),
    email VARCHAR(500),
    userType_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (userType_id)
		REFERENCES user_type(id)
        ON UPDATE CASCADE
);

CREATE TABLE drug_types(
	id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO drug_types (name) VALUES ('antibiotic'), ('tranquilizer'), ('antipyretics'), ('analgesics');

CREATE TABLE drugs(
	id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(1000),
    sell_price FLOAT NOT NULL,
    purchase_price FLOAT NOT NULL,
    rec_stock_amount INT NOT NULL,
    drug_type INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(drug_type)
		REFERENCES drug_types(id)
        ON UPDATE CASCADE
);

CREATE TABLE inventory(
	batch_id INT AUTO_INCREMENT,
    quantity INT NOT NULL,
    exp_date DATE NOT NULL,
    drug_id INT NOT NULL,
    PRIMARY KEY (batch_id),
    FOREIGN KEY (drug_id)
		REFERENCES drugs(id)
        ON UPDATE CASCADE
);

CREATE TABLE perscriptions(
	id INT AUTO_INCREMENT,
    patient_id INT NOT NULL,
    drug_id INT NOT NULL,
    quantity INT NOT NULL,
    fill_date DATE,
    create_date DATE,
    doctor_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(patient_id)
		REFERENCES user(id)
        ON UPDATE CASCADE,
	FOREIGN KEY(doctor_id)
		REFERENCES user(id)
        ON UPDATE CASCADE,
	FOREIGN KEY(drug_id)
		REFERENCES drugs(id)
        ON UPDATE CASCADE
);

CREATE TABLE inventory_orders(
	id INT NOT NULL,
    drug_id INT NOT NULL,
    order_date DATE,
    fulfill_date DATE,
    quantity INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(drug_id)
		REFERENCES drugs(id)
        ON UPDATE CASCADE
);

