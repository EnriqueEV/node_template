
const promotion_rules = [
    {
    rule : "Nx$",
    discount_percentage : 20,
    n : 4
    },
    {
    rule : "AyA",
    discount_percentage : 15,
    n : 1
    }
    ]
    
function getPrecio(array,id){
    if (array.length <= 0){
        return {
            "status": "NOK",
            "error_message": "INTERNAL SERVER ERROR"
            }
    }
    var precio = 0
    var datails = []
    var new_precio = 0

    for (let i = 0; i<array.length; i++){
        if (!Number.isInteger(array[i]["amount"])||!Number.isInteger(array[i]["unit_base_price"])){
            return {
                "status": "NOK",
                "error_message": "INTERNAL SERVER ERROR"
                }
        }
        if (array[i]["amount"] <= 0 ||array[i]["unit_base_price"] <= 0){
            return {
            "status": "NOK",
            "error_message": "AMOUNT OR PRICE SHOULD BE GREATER THAN ZERO"
            }
            
        }
        if (array[i]["promotion"] =="Nx$" ){
            var desc = ~~(array[i]["amount"]/promotion_rules[0]["n"])
            if (desc >= 1) {
                if (desc == array[i]["amount"]/promotion_rules[0]["n"]){
                    new_precio =array[i]["amount"] * array[i]["unit_base_price"] * (100-promotion_rules[0]["discount_percentage"])/100 
                    precio += new_precio
                    datails.push({
                        "idem_id" : array[i]["item_id"],
                        "amount" : array[i]["amount"],
                        "total_price" : new_precio,
                        "promotion_applied" : "true"
                    })
                }
                else {
                    new_precio  = desc*promotion_rules[0]["n"] * array[i]["unit_base_price"] * (100-promotion_rules[0]["discount_percentage"])/100
                    new_precio  += (array[i]["amount"] - desc*promotion_rules[0]["n"])* array[i]["unit_base_price"]
                    precio += new_precio 
                    datails.push({
                        "idem_id" : array[i]["item_id"],
                        "amount" : array[i]["amount"],
                        "total_price" : new_precio,
                        "promotion_applied" : "true"
                    })
                }
            }
            else {
                
                new_precio = (array[i]["amount"])* array[i]["unit_base_price"] 
                precio += new_precio
                datails.push({
                    "idem_id" : array[i]["item_id"],
                    "amount" : array[i]["amount"],
                    "total_price" : new_precio,
                    "promotion_applied" : "false"
                })
            }
        }
        else if (array[i]["promotion"] =="AyA"){
            
            new_precio = (array[i]["amount"])* array[i]["unit_base_price"] * (100-promotion_rules[1]["discount_percentage"])/100
            precio += new_precio
            datails.push({
                "idem_id" : array[i]["item_id"],
                "amount" : array[i]["amount"],
                "total_price" : new_precio,
                "promotion_applied" : "true"
            })    
        }
        
        else if (array[i]["promotion"] ==""){
            new_precio = (array[i]["amount"])* array[i]["unit_base_price"] 
            precio += new_precio
            datails.push({
                "idem_id" : array[i]["item_id"],
                "amount" : array[i]["amount"],
                "total_price" : new_precio,
                "promotion_applied" : "false"
            })    
            
        }
        else {
            return {
                "status": "NOK",
                "error_message": "RULE DOES NOT EXIST"
                }
                
        }

        
    }
    return {
        "status": "OK",
        "cart_id": id,
        "total_cart_amount": precio,
        "details": datails
    }
};

exports.getAllProducts = (ctx) => {
    
    if (ctx.request.body.items === undefined || ctx.request.body.cart_id === undefined){
        ctx.status = 500
        ctx.body = {
            "status": "NOK",
            "error_message": "INTERNAL SERVER ERROR"
            }
        return ctx
    }
    for (let i = 0; i < ctx.request.body.items.length;i++){
        
        if (ctx.request.body.items[i]["item_id"] === undefined ||ctx.request.body.items[i]["promotion"] === undefined ||ctx.request.body.items[i]["amount"] === undefined ||ctx.request.body.items[i]["unit_base_price"] === undefined){
            ctx.status = 500
            ctx.body = {
                "status": "NOK",
                "error_message": "INTERNAL SERVER ERROR"
                }
            return ctx
        }
    }
    var respont =getPrecio(ctx.request.body.items,ctx.request.body.cart_id) 
    if (respont["status"] == "NOK"){
        if (respont["error_message"] ==  "INTERNAL SERVER ERROR"){
            ctx.status = 500
            ctx.body = respont
        }
        else{
            ctx.status = 400
            ctx.body = respont
        }
    }
    else {
    ctx.status = 200
    ctx.body = getPrecio(ctx.request.body.items,ctx.request.body.cart_id)
    } 
    return ctx
}
