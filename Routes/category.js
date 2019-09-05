

module.exports =(categories,knex) =>{categories.get("/",(req,res)=>{
    knex.select("*").from("category")
    .then((category) => {
        return res.send(category);
    }) 
    .catch((error)=>{
        return res.send(error)
    });
});

categories.get("/:Id",(req,res)=>{
    knex.select("*").from("category").where("category_id",req.params.Id)
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
categories.get("/inProduct/:product_id",(req,res)=>{
    let id=req.params.product_id;
    knex.select("*").from("category").join("product_category", function(){
        this.on("category.category_id", "=", "product_category.category_id")
    }).where("product_category.product_id", req.params.product_id)
    .then((data)=>{
        if (data.length>0){
        res.json(data)
        }else{
            res.send({"code": "USR_02","message": "The field example is empty.","field": "example","status": "500"})
        }
    })
})

categories.get("/inDepartment/:department_id",(req,res)=>{
    knex.select("*").from("category").where("department_id",req.params.department_id)
    .then((category) => {
        if (category.length>0){
            console.log(category)
            return res.json(category);
        }else{
            res.send({"code": "USR_02","message": "The field example is empty.","field": "example","status": "500"})
        }
    })
})
}