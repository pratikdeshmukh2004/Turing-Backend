var facebook=require("passport-facebook");
module.exports=(customer,knex,jwt)=>{    
    customer.post("/",(req,res)=>{
        console.log(req.body);
        knex.select("*").from("customer").where("email",req.body.email)
        .then((data)=>{
            if (data.length<1){
                knex("customer").insert(req.body)
                .then((result)=>{
                    knex.select("*").from("customer").where("email",req.body.email)
                    .then((user)=>{
                        console.log(user[0].name);
                        var token = jwt.sign({"customer_id": user[0].customer_id,"name": user[0].name,"role": "customer",},"lala",{expiresIn:'24h'})
                        res.cookie("Bearer AbC"+token)   
                        res.send({
                            "customer": {
                            "schema": {user},
                            "accessToken": "Bearer AbC"+token,
                            "expires_in": "24h"
                            }
                        })
                        })
                    })
                .catch((err)=>{
                    console.log(err);
                    
                })
            }else{
                res.send({"Error":"This User Already Exists..."})
            }

        })
    })
    customer.post("/login",(req,res)=>{
        console.log(req.body);
        knex.select("*").from("customer").where("email",req.body.email)
        .then((data)=>{
            if (data.length>0){
                if (data[0].password==req.body.password){
                    var token = jwt.sign({"customer_id": data[0].customer_id,"name": data[0].name,"role": "customer",},"lala",{expiresIn:'24h'})
                    res.cookie("Bearer AbC"+token)
                    delete data[0].password;
                    res.send({
                        "customer": {
                        "schema": {data},
                        "accessToken": "Bearer AbC"+token,
                        "expires_in": "24h"
                        }
                    })
                }else{
                    res.send({
                        "error": {
                          "status": 400,
                          "code": "USR_01",
                          "message": "Email or Password is invalid.",
                          "field": "password"
                        }
                      })
                }
            }
            else{
                res.send({
                    "Error":"This user dosent exists..."
                })
            }
        })
    })
    customer.get("/facebook",(req,res)=>{
        facebook.use(new FacebookStrategy({
            clientID: "353578892216705",
            clientSecret: "3da4993c79f12f207d96a0b733bbeb3a"
          },
          function(accessToken, refreshToken, profile, cb) {
            User.findOrCreate({ facebookId: profile.id }, function (err, user) {
              res.send(cb(err, user))
            });
          }
        ));
    })
    customer.put("/",(req,res)=>{
        var ep=req.headers.cookie
        if(ep!=undefined){
            ep=ep.split(" ")
            ep=ep[ep.length-1]
            console.log(ep);
            ep=ep.slice(3,-10)
            var tokendata=jwt.verify(ep,"lala")
            knex.select("*").from("customer").where("customer_id",tokendata.customer_id)
            .then((data)=>{
                if (data[0].name==tokendata.name){
                    knex("customer").where("customer_id",tokendata.customer_id).update(req.body)
                    .then((data)=>{
                        knex.select("*").from("customer").where("email",req.body.email)
                        .then((user)=>{
                            res.send({
                                "customer": {
                                "schema": {user}
                                }
                            })
                            })
                        })
                    .catch((err)=>{
                        res.send(err)
                    })
                }else{
                    res.send({"Error":{
                        "login":"login again then update..."
                    }})
                }
        })
    }else{
        res.send({"Error":{
            "login":"first login then update..."
        }})
    }
    })
    customer.get("/",(req,res)=>{
        var ep=req.headers.cookie
        if(ep!=undefined){
            ep=ep.split(" ")
            ep=ep[ep.length-1]
            console.log(ep);
            ep=ep.slice(3,-10)
            var tokendata=jwt.verify(ep,"lala")
            knex.select("*").from("customer").where("customer_id",tokendata.customer_id)
            .then((data)=>{ 
                delete data[0].password;
                res.send(data)
            })
        }else{
            res.send({"Error":"First login"})
        }
    })
    customer.put("/address",(req,res)=>{
        var ep=req.headers.cookie
        if(ep!=undefined){
            ep=ep.split(" ")
            ep=ep[ep.length-1]
            console.log(ep);
            ep=ep.slice(3,-10)
            var tokendata=jwt.verify(ep,"lala")
            console.log(tokendata);
            
            knex.select("*").from("customer").where("customer_id",tokendata.customer_id)
            .then((data)=>{
                if (data[0].name==tokendata.name){
                    knex("customer").where("customer_id",tokendata.customer_id).update(req.body)
                    .then((data)=>{
                        knex.select("*").from("customer").where("customer_id",tokendata.customer_id)
                        .then((user)=>{
                            delete user[0].password;
                            res.send({
                                "customer": {
                                "schema": {user}
                                }
                            })
                            })
                        })
                    .catch((err)=>{
                        res.send(err)
                    })
                }else{
                    res.send({"Error":{
                        "login":"login again then update..."
                    }})
                }
        })
    }else{
        res.send({"Error":{
            "login":"first login then update..."
        }})
    }
    })
    customer.put("/creditCard",(req,res)=>{
        console.log("lali");
        
        var ep=req.headers.cookie
        if(ep!=undefined){
            ep=ep.split(" ")
            ep=ep[ep.length-1]
            console.log(ep);
            ep=ep.slice(3,-10)
            var tokendata=jwt.verify(ep,"lala")
            console.log(tokendata);
            
            knex.select("*").from("customer").where("customer_id",tokendata.customer_id)
            .then((data)=>{
                if (data[0].name==tokendata.name){
                    knex("customer").where("customer_id",tokendata.customer_id).update(req.body)
                    .then((data)=>{
                        knex.select("*").from("customer").where("customer_id",tokendata.customer_id)
                        .then((user)=>{
                            delete user[0].password;
                            res.send({
                                "customer": {
                                "schema": {user}
                                }
                            })
                            })
                        })
                    .catch((err)=>{
                        res.send(err)
                    })
                }else{
                    res.send({"Error":{
                        "login":"login again then update..."
                    }})
                }
        })
    }else{
        res.send({"Error":{
            "login":"first login then update..."
        }})
    }
    })
    
}