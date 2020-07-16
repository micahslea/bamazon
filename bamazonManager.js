var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
// require("events").EventEmitter.defaultMaxListeners = 15;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon",
});

connection.connect(function (err) {
  if (err) throw err;

  start();
});

function start() {
  inquirer
    .prompt({
      name: "item",
      type: "list",
      message: "Please choose one of the following choices.",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
      ],
    })
    .then(function (result) {
      if (result.item === "View Products for Sale") {
        displayProducts();
      }
      if (result.item === "View Low Inventory") {
        displayLow();
      }
      if (result.item === "Add to Inventory") {
        addInventory();
      }
      if (result.item === "Add New Product") {
        addNewProduct();
      }
    });
}

function displayProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      var table = new Table({
        head: ["ID", "Item Name", "Price", "Quantity"],
        colWidths: [4, 24, 12, 10],
      });

      table.push([
        res[i].id,
        res[i].product_name,
        "$" + res[i].price,
        res[i].stock_quantity,
      ]);
      console.log(table.toString());
    }
  });
}

function displayLow() {
  connection.query(
    "SELECT * FROM products WHERE stock_quantity <= 5",
    function (err, res) {
      if (err) throw err;

      for (var i = 0; i < res.length; i++) {
        var table = new Table({
          head: ["ID", "Item Name", "Price", "Quantity"],
          colWidths: [4, 24, 12, 10],
        });

        table.push([
          res[i].id,
          res[i].product_name,
          "$" + res[i].price,
          res[i].stock_quantity,
        ]);
        console.log(table.toString());
      }
    }
  );
}

function addInventory() {
  inquirer
    .prompt({
      name: "item",
      type: "list",
      message: "Choose an item and then add to its inventory.",
      choices: [
        "Fire Extinguisher",
        "Hammer",
        "Restroom Sign",
        "U-Bolts",
        "Circular Saw",
        "box of Roofing Tacks",
        "Wet Floor Sign",
        "Video Doorbell",
        "Crescent Wrench",
        "Fire Alarm",
      ],
    })
    .then(function (response) {
      inquirer
        .prompt({
          name: "units",
          type: "input",
          message: "Type the amount you would like to add to the inventory.",
        })
        .then(function (data) {
          connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
              var name = res[i].product_name;
              var quantity = res[i].stock_quantity;
              var add = quantity + parseInt(data.units);

              if (response.item == name) {
                connection.query(
                  "UPDATE products SET stock_quantity = " +
                    add +
                    " WHERE product_name = '" +
                    response.item +
                    "'",
                  function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " record(s) updated");
                    res.end();
                  }
                );
              }
            }
          });
        });
    });
}

function addNewProduct() {
  inquirer
    .prompt({
      name: "product",
      type: "input",
      message: "What is the name of the product you would like to add?",
    })
    .then(function (result) {
      var productName = result.product;
      inquirer
        .prompt({
          name: "department",
          type: "input",
          message: "Which department does this product belong to?",
        })
        .then(function (response) {
          var dept = response.department;
          inquirer
            .prompt({
              name: "price",
              type: "input",
              message: "What is the price for this product?",
            })
            .then(function (results) {
              var price = parseInt(results.price);
              inquirer
                .prompt({
                  name: "quantity",
                  type: "input",
                  message:
                    "How many units of this product would you like to put in stock?",
                })
                .then(function (data) {
                  var quantity = parseInt(data.quantity);
                  connection.query(
                    "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" +
                      productName +
                      "', '" +
                      dept +
                      "', " +
                      price +
                      ", " +
                      quantity +
                      ")",
                    function (err, res) {
                      if (err) throw err;
                      console.log("All info has been added!");
                    }
                  );
                });
            });
        });
    });
}

function exit() {
  return process.exit();
}
