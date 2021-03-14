let inputConfig = input.config();
let sku = `${inputConfig.sku}`;
let item_id = `${inputConfig.item_id}`;
let stock_status = `${inputConfig.stock_status}`;
let is_in_stock;
if(stock_status == "In Stock"){ is_in_stock = true;}
if(stock_status == "Out Of Stock"){ is_in_stock = false;}
let stockitem = {
  "stockItem":{
    "is_in_stock":is_in_stock
  }
}
const url = "https://www.bigfeedclub.ca/rest/default/V1/products/"+sku+"/stockItems/"+item_id;

const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer sof2q1ubjrdrhz5m81yt4dbsgn2agoda"
    };
let options = {
    "method": "put",
    "headers": headers,
    "body" : JSON.stringify(stockitem)
};
let response = await fetch(url,options);
if(response.status == 200){	
  console.log(`${inputConfig.sku} is ${inputConfig.stock_status}`);
}else{
  console.log(response.statusText);
}

