DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;


USE bamazon;


CREATE TABLE products (
 
  id INTEGER AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL,
  PRIMARY KEY (id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Fire Extinguisher", "Fire Safety", 49.99, 20),
("Hammer", "Tools", 34.98, 50),
("Restroom Sign", "Signs", 19.99, 25),
("U-Bolts", "Nuts and Bolts", 0.49, 150),
("Circular Saw", "Tools", 129.95, 15),
("Box of Roofing Tacks", "Nails", 14.99, 20),
("Wet Floor Sign", "Signs", 13.49, 30),
("Video Doorbell", "Security", 199.99, 10),
("Crescent Wrench", "Tools", 8.99, 20),
("Fire Alarm", "Fire Safety", 29.23, 5);