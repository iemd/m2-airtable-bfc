let inputConfig = input.config();
let product = {
  
  "product": {
    "sku": `${inputConfig.sku}`,
    "name": `${inputConfig.product_name}`,
    "attribute_set_id": 4,
    "price": `${inputConfig.price}`,
    "status": 1,
    "visibility": 4,
    "type_id": "simple",
    "weight": `${inputConfig.weight}`,
    "extension_attributes": {
    	/*"category_links": [
            {
                "position": 0,
                "category_id": "3"
            }
            
        ],*/
        "stock_item": {
            "qty": `${inputConfig.qty}`,
            "is_in_stock": true
        }
    },
    "custom_attributes": [
        {
            "attribute_code": "description",
            "value": `${inputConfig.description}`
        }
    ]
  }
};

const url = "https://www.bigfeedclub.ca/rest/default/V1/products";

const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer sof2q1ubjrdrhz5m81yt4dbsgn2agoda"
    };
let options = {
    "method": "post",
    "headers": headers,
    "body" : JSON.stringify(product)
};
let response = await fetch(url,options);
if(response.status == 200){	
  console.log(`${inputConfig.sku} product created successfully`);
}else{
  console.log(response.statusText);
}
//console.log(JSON.stringify(product));
//console.log(`sku, ${inputConfig.sku}`);

