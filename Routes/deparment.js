const ips = '192.168.1.36'
module.exports =(departments,knex) =>{
departments.get("/",(req,res)=>{
    knex.select("*").from("department")
    .then((department) => {
        return res.json(department);
    }) 
    .catch((error)=>{
        res.send({"code": "USR_02","message": "The field example is empty.","field": "example","status": "500"})
    });

});
departments.get("/:Id",(req,res)=>{
    
    var id = req.params.Id;
    knex.select("*").from("department").where("department_id",id)
    .then((department) => {
        if (department.length>0){
        return res.json(department);
        }else{
            res.send({"code": "USR_02","message": "The field example is empty.","field": "example","status": "500"})
        }
    })
    .catch((error)=>{
        res.send("your error is in database")
    });
})
}