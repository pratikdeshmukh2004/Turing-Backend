module.exports =(products,knex) =>{products.get("/",(req,res)=>{
    var body=req.query;
    var page=body.page;
    var limit=body.limit;
    var offset=limit*page-limit;
    var des=req.description_length;
    knex.select("*").from("product").limit(limit).offset(offset)
    .then((data)=>{
        if (data.length>0){
            res.json(data)
        }else{
            res.send({"name":"outof stock"})
        }
    })
})

products.get("/search",(req,res)=>{
    var search=req.query.search;
    knex.select("*").from("product").where("name","like","%"+search+" %")
    .then((data)=>{
        if (data.length>0){
            res.json({"count":data.length,
            "row":data})
        }else{
            res.send({"name":"product not found"})
        }
    })
})
products.get("/:product_id",(req,res)=>{
    knex.select("*").from("product").where("product_id",req.params.product_id)
    .then((data)=>{
        if (data.length>0){
            res.json(data)
        }else{
            res.send({
                "code": "USR_02",
                "message": "The field example is empty.",
                "field": "example",
                "status": "500"
              })
        }  
    })
})
products.get("/inCategory/:category_id",(req,res)=>{
    var body=req.query;
    var page=body.page;
    var limit=body.limit;
    var offset=limit*page-limit;
    var des=req.description_length;
    knex.select("*").from("product").join("product_category",function(){
        this.on("product.product_id","product_category.product_id")
    }).where("product_category.category_id",req.params.category_id).limit(limit).offset(offset)
    .then((data)=>{
        res.send({counts:data.length,rows:data})
    })
})

products.get("/inDepartment/:department_id",(req,res)=>{
    var body=req.query;
    var page=body.page;
    var limit=body.limit;
    var offset=limit*page-limit;
    var des=req.description_length;
    knex.select("*").from("category").join("product_category", function(){
        this.on("category.category_id","product_category.category_id")
    }).join('product',function(){
        this.on("product_category.product_id","product.product_id")
    }).where("department_id",req.params.department_id).limit(limit).offset(offset)
    .then((data)=>{
        var out=[]
        for (var i of data){
            var dic={
            "product_id": i.product_id,
            "name": i.name,
            "description":i.description,
            "price": i.price,
            "discounted_price": i.discounted_price,
            "thumbnail": i.thumbnail
            }
            out.push(dic)
        }
        res.send({counts:out.length,rows:out})
    })
})

products.get("/:product_id/details",(req,res)=>{
    knex.select("*").from("product").where("product_id",req.params.product_id)
    .then((data)=>{
        if (data.length>0){
            var out=[]
            for (var i of data){
                var dic={
                    "product_id": i.product_id,
                    "name": i.name,
                    "description":i.description,
                    "price": i.price,
                    "discounted_price": i.discounted_price,
                    "image": i.image,
                    "image2": i.image_2
                  }
                  out.push(dic)
            }
            res.json(out)
        }else{
            res.send({
                "code": "USR_02",
                "message": "The field example is empty.",
                "field": "example",
                "status": "500"
              })
        }  
    })
})

products.get("/:product_id/location",(req,res)=>{
    knex.select("*").from("product_category").join("category",function(){
        this.on("product_category.category_id","category.category_id")
    })
    .where("product_id",req.params.product_id)
    .then((data)=>{
        var out=[]
        for (var i of data){
            knex.select("name").from("department").where("department_id",i.department_id)
            .then((data1)=>{
                for (var j of data1){
                    var dic={
                        "category_id": i.category_id,
                        "category_name": i.name,
                        "department_id": i.department_id,
                        "department_name":j.name
                        }
                        out.push(dic)
                        console.log(req.headers.cookie)
                        res.set("token",{
                            'Content-Type': 'text/plain',
                            'Content-Length': '123',
                            'ETag': '12345'
                          })
                        res.send(dic)
                }
            })
        }
    })
})
}