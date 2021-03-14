//-------------------------Step 1----------------------------

const url = "https://www.bigfeedclub.ca/rest/default/V1/products?fields=items[sku,name,extension_attributes[stock_item[item_id,qty,is_in_stock]]]&searchCriteria[filter_groups][0][filters][0][field]=status&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[currentPage]=1&searchCriteria[pageSize]=500";
const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer sof2q1ubjrdrhz5m81yt4dbsgn2agoda"
    };
const options = {
    "method": "get",
    "headers": headers
  };
let response = await fetch(url,options);
let data = await response.json();
let results = data.items;
let all_products = base.getTable('bigfeedclub_stock');
let createArray = [];
let is_in_stock;
for (let result of results){
    if(result.extension_attributes.stock_item.is_in_stock == true){is_in_stock = 'In Stock'}
    if(result.extension_attributes.stock_item.is_in_stock == false){is_in_stock = 'Out Of Stock'}
    createArray.push({
            fields: {
                'sku': result.sku,
                'name': result.name,
                'item_id': result.extension_attributes.stock_item.item_id,
                'quantity': result.extension_attributes.stock_item.qty,
                'stock_status': {name : is_in_stock}                                          
            }
        });    
}
let query = await all_products.selectRecordsAsync();
let records = query.records;

while (records.length > 0) {
    await all_products.deleteRecordsAsync(records.slice(0, 50));
    records = records.slice(50);
}
while (createArray.length > 0) {
    await all_products.createRecordsAsync(createArray.slice(0, 50));
    createArray = createArray.slice(50);
}

console.log(results.length+" products imported successfully!");

//--------------------Step 2----------------------------------------
const url = "https://www.bigfeedclub.ca/rest/default/V1/products?fields=items[sku,name,extension_attributes[stock_item[item_id,qty,is_in_stock]]]&searchCriteria[filter_groups][0][filters][0][field]=status&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[currentPage]=2&searchCriteria[pageSize]=500";
const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer sof2q1ubjrdrhz5m81yt4dbsgn2agoda"
    };
const options = {
    "method": "get",
    "headers": headers
  };
let response = await fetch(url,options);
let data = await response.json();
let results = data.items;
let all_products = base.getTable('bigfeedclub_stock');
let createArray = [];
let is_in_stock;
for (let result of results){
    if(result.extension_attributes.stock_item.is_in_stock == true){is_in_stock = 'In Stock'}
    if(result.extension_attributes.stock_item.is_in_stock == false){is_in_stock = 'Out Of Stock'}
    createArray.push({
            fields: {
                'sku': result.sku,
                'name': result.name,
                'item_id': result.extension_attributes.stock_item.item_id,
                'quantity': result.extension_attributes.stock_item.qty,
                'stock_status': {name : is_in_stock}                                          
            }
        });    
}
/*let query = await all_products.selectRecordsAsync();
let records = query.records;

while (records.length > 0) {
    await all_products.deleteRecordsAsync(records.slice(0, 50));
    records = records.slice(50);
}*/
while (createArray.length > 0) {
    await all_products.createRecordsAsync(createArray.slice(0, 50));
    createArray = createArray.slice(50);
}

console.log(results.length+" products imported successfully!");

//---------------------Step 3--------------------------------------
const url = "https://www.bigfeedclub.ca/rest/default/V1/products?fields=items[sku,name,extension_attributes[stock_item[item_id,qty,is_in_stock]]]&searchCriteria[filter_groups][0][filters][0][field]=status&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[currentPage]=3&searchCriteria[pageSize]=500";
const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer sof2q1ubjrdrhz5m81yt4dbsgn2agoda"
    };
const options = {
    "method": "get",
    "headers": headers
  };
let response = await fetch(url,options);
let data = await response.json();
let results = data.items;
let all_products = base.getTable('bigfeedclub_stock');
let createArray = [];
let is_in_stock;
for (let result of results){
    if(result.extension_attributes.stock_item.is_in_stock == true){is_in_stock = 'In Stock'}
    if(result.extension_attributes.stock_item.is_in_stock == false){is_in_stock = 'Out Of Stock'}
    createArray.push({
            fields: {
                'sku': result.sku,
                'name': result.name,
                'item_id': result.extension_attributes.stock_item.item_id,
                'quantity': result.extension_attributes.stock_item.qty,
                'stock_status': {name : is_in_stock}                                          
            }
        });    
}
/*let query = await all_products.selectRecordsAsync();
let records = query.records;

while (records.length > 0) {
    await all_products.deleteRecordsAsync(records.slice(0, 50));
    records = records.slice(50);
}*/
while (createArray.length > 0) {
    await all_products.createRecordsAsync(createArray.slice(0, 50));
    createArray = createArray.slice(50);
}

console.log(results.length+" products imported successfully!");
