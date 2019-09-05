const mysql =require("mysql");
const express=require("express");
const bodyparser=require("body-parser")
const jwt=require("jsonwebtoken")
const knex=require("knex")({
    client: 'mysql',
    connection: {
        "host":"localhost",
        "user":"root",
        "password":"pratik",
        "database":"turing"
}});
var app=express();
app.use(bodyparser())

var categories = express.Router();
app.use('/categories',categories);
require('./Routes/category')(categories,knex)

var attributes = express.Router();
app.use('/attributes',attributes);
require('./Routes/attributes')(attributes,knex)

var products = express.Router();
app.use('/products',products);
require('./Routes/products')(products,knex)


var customer = express.Router();
app.use('/customer',customer       );
require('./Routes/customer')(customer,knex,jwt)

var departments=express.Router();
app.use("/departments",departments)
require("./Routes/deparment")(departments,knex)

var shoppingcart=express.Router()
app.use("/shoppingcart",shoppingcart)
require("./Routes/shoppingcart")(shoppingcart,knex)

var tax=express.Router()
app.use("/tax",tax)
require("./Routes/tax")(tax,knex)

var shipping=express.Router()
app.use("/shipping",shipping)
require("./Routes/shipping")(shipping,knex)

var orders=express.Router()
app.use("/orders",orders)
require("./Routes/oders")(orders,knex)


var server=app.listen(9090,()=>{
    var port=server.address().port;
    console.log('http://localhost:'+port+"/departments/")
})