module.exports =(attributes,knex) =>{attributes.get("/",(req,res)=>{
    knex.select("*").from("attribute")
    .then((data) => {
        return res.json(data);
    }) 
    .catch((error)=>{
        res.send({"code": "USR_02","message": "The field example is empty.","field": "example","status": "500"})
    });

});

attributes.get("/:Id",(req,res)=>{
    knex.select("*").from("attribute").where("attribute_id",req.params.Id)
    .then((category) => {
        if (category.length>0){
        return res.json(category);
        }else{
            res.send({"code": "USR_02","message": "The field example is empty.","field": "example","status": "500"})
        }
    })
    .catch((error)=>{
        res.send("your error is in database")
    });
})


attributes.get("/value/:Id",(req,res)=>{
    knex.select("attribute_value_id","value").from("attribute_value").where("attribute_id",req.params.Id)
    .then((category) => {
        if (category.length>0){
        return res.json(category);
        }else{
            res.send({"code": "USR_02","message": "The field example is empty.","field": "example","status": "500"})
        }
    })
    .catch((error)=>{
        res.send("your error is in database")
    });
})


attributes.get("/inProduct/:Id",(req,res)=>{
    knex.select("*").from("attribute_value").join("attribute", function(){
        this.on("attribute_value.attribute_id", "=", "attribute.attribute_id")
    }).join("product_attribute", function(){
        this.on("attribute_value.attribute_value_id", "=", "product_attribute.attribute_value_id")
    }).where("product_attribute.product_id", req.params.Id)
    .then((data)=>{
        if (data.length>0){
        res.json(data)
        }else{
            res.send({"code": "USR_02","message": "The field example is empty.","field": "example","status": "500"})
        }
    })
})
}