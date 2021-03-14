const url = "https://www.bigfeedclub.ca/rest/default/V1/products?fields=items[sku,name]&searchCriteria[filter_groups][0][filters][0][field]=status&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq";
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
for (let result of results){
    
    createArray.push({
            fields: {
                'sku': result.sku,
                'name': result.name
              
                               
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

//-----------Second Step----------------------------------------

let table = base.getTable('bigfeedclub_stock');
let query = await table.selectRecordsAsync();
let updates = [];
let url, response, data, result;
const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer sof2q1ubjrdrhz5m81yt4dbsgn2agoda"
    };
const options = {
    "method": "get",
    "headers": headers
};

let sku,is_in_stock;
let i = 0;
for (let record of query.records) { 
    sku = record.getCellValue('sku');
    console.log(record.getCellValue('sku'));
    url = "https://www.bigfeedclub.ca/rest/default/V1/products/"+sku+"?fields=extension_attributes[stock_item[item_id,qty,is_in_stock]]";  
    response = await fetch(url,options);
    data = await response.json();
    result = data.extension_attributes.stock_item;
    if(result.is_in_stock == true){is_in_stock = 'InStock'}
    if(result.is_in_stock == false){is_in_stock = 'OutOfStock'}
    updates.push({
            id: record.id,
            fields: {
                'quantity': result.qty,
                'stock_status':{name : 'InStock'}
            }
    });
    i++;
    if (i === 15) { break; }   
}
while (updates.length > 0) {
    await table.updateRecordsAsync(updates.slice(0, 5));
    updates = updates.slice(5);
} 


