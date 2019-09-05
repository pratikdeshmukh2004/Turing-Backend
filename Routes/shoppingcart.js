module.exports=(shoppingcart,knex)=>{
    shoppingcart.get("/generateUniqueId",(req,res)=>{
        var unique=["QWERTYUIOPASDFGHJKLZXCVBNM","1234567890","qwertyuiopasdfghjklzxcvbnm"]
        var uniqueId=""
        for (j=0;j<5;j++){
            for (i of unique){
                uniqueId+=i[Math.floor(Math.random()*i.length)];
            }
        }
        res.send({
            "cart_id": uniqueId
          })
    })
    shoppingcart.post("/add",(req,res)=>{
        knex.select("*").from("shopping_cart").where("cart_id",req.body.cart_id)
        .then((data)=>{
            console.log("working...");
            if(data.length<1){
                var body=req.body;
                body["added_on"]= new Date()
                body["quantity"]=1
                knex("shopping_cart").insert(body)
                .then((data)=>{
                    knex.select("*").from("shopping_cart").where("cart_id",req.body.cart_id)
                    .then((resp)=>{
                        knex.select("*").from("shopping_cart").join("product",function(){
                            this.on("product.product_id",req.body.product_id)
                        }).where("cart_id",req.body.cart_id)
                        .then((resp)=>{
                            resp[0]["subtotal"]=resp[0].quantity*resp[0].price                       
                            res.send([
                                {
                                    "item_id": resp[0].item_id,
                                    "product_id": resp[0].product_id,
                                    "attributes": resp[0].attributes,
                                    "quantity": resp[0].quantity,
                                    "name": resp[0].name,
                                    "price": resp[0].price,
                                    "image": resp[0].image,
                                    "subtotal": resp[0].subtotal
                                }
                            ])
                        })
                    })
                })
                .catch((err)=>{
                    res.send(err)
                })
            }else{
                var body=req.body;
                body["quantity"]=data[0].quantity+1
                body["added_on"]= new Date()
                knex("shopping_cart").update(body).where("cart_id",body.cart_id)
                .then((result)=>{
                    knex.select("*").from("shopping_cart").join("product",function(){
                        this.on("product.product_id",req.body.product_id)
                    }).where("cart_id",req.body.cart_id)
                    .then((resp)=>{
                        resp[0]["subtotal"]=resp[0].quantity*resp[0].price                       
            res.send([
                {
                    "item_id": resp[0].item_id,
                    "product_id": resp[0].product_id,
                    "attributes": resp[0].attributes,
                    "quantity": resp[0].quantity,
                    "name": resp[0].name,
                    "price": resp[0].price,
                    "image": resp[0].image,
                    "subtotal": resp[0].subtotal
                }
            ])
                    })
                })
                .catch((err)=>{
                    res.send(err)
                })
            }
        })
        .catch((err)=>{
            res.send(err)
        })
    })
    shoppingcart.get("/:cart_id",(req,res)=>{
        var cart_id=req.params.cart_id;
        knex.select("*").from("shopping_cart").join("product",function(){
            this.on("product.product_id","shopping_cart.product_id")
        }).where("cart_id",req.params.cart_id)
        .then((resp)=>{
            if(resp.length>0){
            resp[0]["subtotal"]=resp[0].quantity*resp[0].price                       
            res.send([
                {
                    "item_id": resp[0].item_id,
                    "product_id": resp[0].product_id,
                    "attributes": resp[0].attributes,
                    "quantity": resp[0].quantity,
                    "name": resp[0].name,
                    "price": resp[0].price,
                    "image": resp[0].image,
                    "subtotal": resp[0].subtotal
                }
            ])
        }else{
            res.send([{
                "code": "USR_02",
                "message": "The field example is empty.",
                "field": "example",
                "status": "500"
              }])
        }
        })
    })
    shoppingcart.put("/update/:item_id",(req,res)=>{
        console.log("working...");
        
        var item_id=req.params.item_id;
        knex("shopping_cart").update(req.body)
        .then((result)=>{
            knex.select("*").from("shopping_cart").join("product",function(){
                this.on("product.product_id","shopping_cart.product_id")
            }).where("item_id",item_id)
            .then((resp)=>{
                if(resp.length>0){
                resp[0]["subtotal"]=resp[0].quantity*resp[0].price                       
                res.send([
                    {
                        "item_id": resp[0].item_id,
                        "product_id": resp[0].product_id,
                        "attributes": resp[0].attributes,
                        "quantity": resp[0].quantity,
                        "name": resp[0].name,
                        "price": resp[0].price,
                        "image": resp[0].image,
                        "subtotal": resp[0].subtotal
                    }
                ])
            }else{
                res.send([{
                    "code": "USR_02",
                    "message": "The field example is empty.",
                    "field": "example",
                    "status": "500"
                  }])
            }
        })

        })
    })
    shoppingcart.delete("/empty/:cart_id",(req,res)=>{
        knex.select("*").from("shopping_cart").where("cart_id",req.params.cart_id).delete()
        .then((resp)=>{
            res.send([])
        })
        .catch((err)=>{
            res.send([{  "code": "USR_02",
            "message": "The field example is empty.",
            "field": "example",
            "status": "500"
          }])
        })
    })
    shoppingcart.get("/totalAmount/:cart_id",(req,res)=>{
        knex.select("*").from("shopping_cart").join("product",function(){
            this.on("shopping_cart.product_id","product.product_id")
        }).where("cart_id",req.params.cart_id)
        .then((resp)=>{
            res.send({"total_amount":resp[0].price*resp[0].quantity})
        })
        .catch((err)=>{
            res.send(err)
        })
    })
    shoppingcart.delete("/removeProduct/:item_id",(req,res)=>{
        knex.select("*").from("shopping_cart").where("item_id",req.params.item_id).delete()
        .then((resp)=>{
            res.send([])
        })
        .catch((err)=>{
            res.send(err)
        })
    })
    shoppingcart.get("/moveToCart/:item_id",(req,res)=>{
        knex.select("*").from("shopping_cart").where("item_id",req.params.item_id)
        .then((resp)=>{
            if (resp.length>0){
                knex("Cart").insert(resp[0])
                .then((d)=>{
                    knex.select("*").from("shopping_cart").where("item_id",req.params.item_id).delete()
                    .then((done)=>{
                        res.send("deleted")
                    })
                })
            }else{
                res.send({"id not found":"Error"})
            }
        })
    })
    shoppingcart.get("/saveForLatter/:item_id",(req,res)=>{
        knex.select("*").from("shopping_cart").where("item_id",req.params.item_id)
        .then((resp)=>{
            if (resp.length>0){
                knex("saveforlatter").insert(resp[0])
                .then((d)=>{
                    res.send("saved")
                })
            }else{
                res.send({"id not found":"Error"})
            }
        })
    })
    shoppingcart.get("/getSaved/:cart_id",(req,res)=>{
        knex.select("*").from("saveforlatter").where("cart_id",req.params.cart_id).join("product",function(){
            this.on("product.product_id","saveforlatter.product_id")
        })
        .then((resp)=>{
            console.log(resp);
            
            if (resp.length>0){
                res.send({
                    "item_id": resp[0].item_id,
                    "name": resp[0].name,
                    "attributes": resp[0].attributes,
                    "price": resp[0].price
                  })
            }else{
                res.send({"error":"id not found"})
            }
        })
    })
}