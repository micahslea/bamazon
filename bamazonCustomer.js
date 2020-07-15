var mysql = require("mysql");
var inquirer = require("inquirer");

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
  itemDisplay();
});

function start() {
  inquirer
    .prompt({
      name: "idOfItem",
      type: "input",
      message:
        "What is the item number of the product you would like to purchase?\n",
    })
    .then(function (item) {
      if (item.idOfItem) {
        inquirer
          .prompt({
            name: "quantity",
            type: "input",
            message: "How many units of the item would you like?",
          })
          .then(function (units) {
            connection.query("SELECT * FROM products", function (err, res) {
              if (err) {
                throw err;
              }
              for (var i = 0; i < res.length; i++) {
                var id = res[i].id;
                var name = res[i].product_name;
                var price = res[i].price;
                var quantity = res[i].stock_quantity;
                var total = price * units.quantity;
                var reduce = quantity - units.quantity;

                if (item.idOfItem == id) {
                  if (units.quantity <= quantity) {
                    console.log(
                      "You have ordered " +
                        units.quantity +
                        "s  of a " +
                        name +
                        ".\n Your total is $" +
                        total.toFixed(2)
                    );

                    connection.query(
                      "UPDATE products SET stock_quantity = " +
                        reduce +
                        " WHERE id = " +
                        item.idOfItem,
                      function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " record(s) updated");
                      }
                    );
                  } else {
                    console.log(
                      "***Insufficient quantity! Your order cannot be completed. There are only " +
                        quantity +
                        " units of this item.***"
                    );
                  }
                }
              }
            });
          });
      }
    });
}

function itemDisplay() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(
        res[i].id + " " + res[i].product_name + " $" + res[i].price + "\n"
      );
    }
  });
}
