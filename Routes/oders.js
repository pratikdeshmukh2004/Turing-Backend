var jwt = require("jsonwebtoken")
module.exports=(orders,knex)=>{
    function checktoken(req,res,next){
        var ep=req.headers.cookie
        if(ep!=undefined){
            ep=ep.split(" ")
            ep=ep[ep.length-1]
            ep=ep.slice(3,-10)
            jwt.verify(ep,"lala",(err,tokendata)=>{
                if (!err){
                knex.select("*").from("customer").where("name",tokendata.name)
                .then((t)=>{
                    if (t.length>0){
                        next()
                    }else{
                        res.send({
                            "error": {
                            "status": 401,
                            "code": "AUT_02",
                            "message": "Access Unauthorized",
                            "field": "NoAuth"
                            }
                        })
                    }
                })
                }else{
                    res.send({"error": {
                        "status": 401,
                        "code": "AUT_02",
                        "message": "Access Unauthorized",
                        "field": "NoAuth"
                        }
                    })
                }
            })
        }else{
            res.send({
                "error": {
                  "status": 401,
                  "code": "AUT_02",
                  "message": "Access Unauthorized",
                  "field": "NoAuth"
                }
              })
        }
    }
    orders.post("/", checktoken, (req,res)=>{
        var ep=req.headers.cookie
        ep=ep.split(" ")
        ep=ep[ep.length-1]
        ep=ep.slice(3,-10)
        var tokendata=jwt.verify(ep,"lala")
        var body=req.body;
        var newdic={};  
            knex.select("*").from("product").join("shopping_cart",function(){
                this.on("product.product_id","shopping_cart.product_id")
            }).where("cart_id",body.cart_id)
            .then((resp)=>{
                console.log(resp);
                
                if(resp.length>0){
                    newdic["total_amount"]=resp[0].price*resp[0].quantity
                    newdic["created_on"]=new Date()
                    newdic["customer_id"]=tokendata.customer_id
                    newdic["shipping_id"]=body.shipping_id
                    newdic["tax_id"]=body.tax_id
                    knex("orders").insert(newdic)
                    .then((data)=>{
                        knex("order_detail").insert({
                            "item_id":resp[0].item_id,
                            "order_id":data[0],
                            "product_id":resp[0].product_id,
                            "attributes":resp[0].attributes,
                            "product_name":resp[0].name,
                            "quantity":resp[0].quantity,
                            "unit_cost":resp[0].price
                        })
                        .then((od)=>{
                        knex.select("*").from("shopping_cart").where("cart_id",body.cart_id).delete()
                        .then((d)=>{
                            res.send({"order_id":data[0]})
                        })
                        .catch((err)=>{
                            res.send(err)
                        })
                    })
                    })
                    .catch((err)=>{
                        res.send(err)
                    })
                }else{
                    res.send(
                    {error:"cart_id not found"}
                    )
                }
            })
    })
    orders.get("/inCustomer", checktoken,(req,res)=>{
        var ep=req.headers.cookie
        if(ep!=undefined){
            ep=ep.split(" ")
            ep=ep[ep.length-1]
            ep=ep.slice(3,-10)
            jwt.verify(ep,"lala",(err,tokendata)=>{
                if (!err){
                    console.log(tokendata);
                    knex.select("*").from("customer").where("name",tokendata.name)
                    .then((t)=>{
                        if (t.length>0){
                            knex.select("*").from("orders").where("customer_id",tokendata.customer_id)
                            .then((resp)=>{
                                res.send(resp)
                            })
                        }else{
                            res.send({"Error":"First login the you get orders"})
                        }
                    })
                    .catch((err)=>{
                        res.send(err)
                    })
                }else{
                    res.send({"Error":"First login the you get orders"})
                }
                })
        }
    })
    orders.get("/:order_id",checktoken,(req,res)=>{
        knex.select("*").from("order_detail").where("order_id",req.params.order_id)
        .then((resp)=>{
            resp[0]["subtotal"]=resp[0].unit_cost*resp[0].quantity
            res.send(resp)
        })
    })
    orders.get("/shortDetail/:order_id",checktoken,(req,res)=>{
        knex.select("*")
        .from("orders")
        .join("order_detail",function(){
            this.on("orders.order_id","order_detail.order_id")
        })
        .where("orders.order_id",req.params.order_id)
        .then((resp)=>{
            res.send({
                "order_id": resp[0].order_id,
                "total_amount": resp[0].total_amount,
                "created_on": resp[0].created_on,
                "shipped_on": resp[0].shipped_on,
                "status": resp[0].status,
                "name": resp[0].product_name
              })
        })
    })
}