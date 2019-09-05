module.exports=(tax,knex)=>{
    tax.get("/",(req,res)=>{
        knex.select("*").from("tax")
        .then((resp)=>{
            res.send(resp)
        })
        .catch((err)=>{
            res.send(err)
        })
    })
    tax.get("/:tax_id",(req,res)=>{
        knex.select("*").from("tax").where("tax_id",req.params.tax_id)
        .then((resp)=>{
            if(resp.length>0){
                res.send(resp)
            }else{
                res.send({"error":"id not found"})
            }
        })
        .catch((err)=>{
            res.send(err)
        })
    })
}