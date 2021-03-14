const url = "https://www.bigfeedclub.com/rest/default/V1/products?fields=items[sku,name,price,weight,media_gallery_entries,custom_attributes]&searchCriteria[filter_groups][0][filters][0][field]=status&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[currentPage]=1&searchCriteria[pageSize]=500";
const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer koutgvvgp34owf5t431myyptl1nctw8m"
    };
const options = {
    "method": "get",
    "headers": headers
  };
let response = await fetch(url,options);
let data = await response.json();
let results = data.items;
let all_products = base.getTable('bigfeedclub_all_products');
let createArray = [];
let entryid, base_image, medias, custom_attributes,description;
let product_url = "https://www.bigfeedclub.com/media/catalog/product";
for (let result of results){
    medias = result.media_gallery_entries;
    custom_attributes = result.custom_attributes;
    for (let media of medias){
        if(media.types.includes("image")) {
         entryid = media.id;
         base_image = media.file;
        } 
    }  
    for (let custom_attribute of custom_attributes){
        if(custom_attribute.attribute_code == 'description'){
         description = custom_attribute.value;
        } 
    }   
    createArray.push({
            fields: {
                'sku': result.sku,
                'name': result.name,
                'description': description,
                'weight': result.weight,
                'price': result.price,
                'entryid': entryid,
                'base_image_url': product_url+''+base_image
                
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


//===============================Step 2============================================================================
let table = base.getTable('bigfeedclub_all_products');

let query = await table.selectRecordsAsync();
let updates = [];
for (let record of query.records) {
     updates.push({
            id: record.id,
            fields: {
                'base_image': [
                   { url: record.getCellValue('base_image_url')}
              ]
            }
        });
    
}
while (updates.length > 0) {
    await table.updateRecordsAsync(updates.slice(0, 50));
    updates = updates.slice(50);
}
//===============================Step 3============================================================================
const url = "https://www.bigfeedclub.com/rest/default/V1/products?fields=items[sku,name,price,weight,media_gallery_entries,custom_attributes]&searchCriteria[filter_groups][0][filters][0][field]=status&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[currentPage]=2&searchCriteria[pageSize]=500";
const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer koutgvvgp34owf5t431myyptl1nctw8m"
    };
const options = {
    "method": "get",
    "headers": headers
  };
let response = await fetch(url,options);
let data = await response.json();
let results = data.items;
let all_products = base.getTable('bigfeedclub_all_products');
let createArray = [];
let entryid, base_image, medias, custom_attributes,description;
let product_url = "https://www.bigfeedclub.com/media/catalog/product";
for (let result of results){
    medias = result.media_gallery_entries;
    custom_attributes = result.custom_attributes;
    for (let media of medias){
        if(media.types.includes("image")) {
         entryid = media.id;
         base_image = media.file;
        } 
    }  
    for (let custom_attribute of custom_attributes){
        if(custom_attribute.attribute_code == 'description'){
         description = custom_attribute.value;
        } 
    }   
    createArray.push({
            fields: {
                'sku': result.sku,
                'name': result.name,
                'description': description,
                'weight': result.weight,
                'price': result.price,
                'entryid': entryid,
                'base_image_url': product_url+''+base_image
                
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

//===================Step 4============================================
let table = base.getTable('bigfeedclub_all_products');

let query = await table.selectRecordsAsync();
let updates = [];
for (let record of query.records) {
	if(record.getCellValue('base_image') == null){
     updates.push({
            id: record.id,
            fields: {
                'base_image': [
                   { url: record.getCellValue('base_image_url')}
              ]
            }
        });
    } 
}
while (updates.length > 0) {
    await table.updateRecordsAsync(updates.slice(0, 50));
    updates = updates.slice(50);
}
//====================Step 5=============================================
const url = "https://www.bigfeedclub.com/rest/default/V1/products?fields=items[sku,name,price,weight,media_gallery_entries,custom_attributes]&searchCriteria[filter_groups][0][filters][0][field]=status&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[currentPage]=3&searchCriteria[pageSize]=500";
const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer koutgvvgp34owf5t431myyptl1nctw8m"
    };
const options = {
    "method": "get",
    "headers": headers
  };
let response = await fetch(url,options);
let data = await response.json();
let results = data.items;
let all_products = base.getTable('bigfeedclub_all_products');
let createArray = [];
let entryid, base_image, medias, custom_attributes,description;
let product_url = "https://www.bigfeedclub.com/media/catalog/product";
for (let result of results){
    medias = result.media_gallery_entries;
    custom_attributes = result.custom_attributes;
    for (let media of medias){
        if(media.types.includes("image")) {
         entryid = media.id;
         base_image = media.file;
        } 
    }  
    for (let custom_attribute of custom_attributes){
        if(custom_attribute.attribute_code == 'description'){
         description = custom_attribute.value;
        } 
    }   
    createArray.push({
            fields: {
                'sku': result.sku,
                'name': result.name,
                'description': description,
                'weight': result.weight,
                'price': result.price,
                'entryid': entryid,
                'base_image_url': product_url+''+base_image
                
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
//=====================Step 6====================================================
let table = base.getTable('bigfeedclub_all_products');

let query = await table.selectRecordsAsync();
let updates = [];
for (let record of query.records) {
	if(record.getCellValue('base_image') == null){
     updates.push({
            id: record.id,
            fields: {
                'base_image': [
                   { url: record.getCellValue('base_image_url')}
              ]
            }
        });
    } 
}
while (updates.length > 0) {
    await table.updateRecordsAsync(updates.slice(0, 50));
    updates = updates.slice(50);
}