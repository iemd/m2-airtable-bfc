function getTodayDateTime(offset){
        
	let d = new Date();
	let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	
	let ossign = offset.charAt(0);
    let os = offset.split(":");
    let oshour = Math.abs(parseInt(os[0]));
    let osminute = parseInt(os[1]);	
	offset = (oshour * 60) + osminute;
	offset = parseInt(ossign+offset);
	
    let tzd = new Date(utc + (offset * 60000));
	let tzdate = tzd.getFullYear() + "-" + (tzd.getMonth()+1) + "-" + tzd.getDate();
	let tztime = tzd.getHours() + ":" + tzd.getMinutes() + ":" + tzd.getSeconds();
	let datetime = {
	  'date': tzdate,
	  'time': tztime
	};
    return datetime;
}
/*
function getTomorrowDateTime(offset){
        
	let d = new Date();
	let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	
	let ossign = offset.charAt(0);
    let os = offset.split(":");
    let oshour = Math.abs(parseInt(os[0]));
    let osminute = parseInt(os[1]);	
	offset = (oshour * 60) + osminute;
	offset = parseInt(ossign+offset);
	
    let tzd = new Date(utc + (offset * 60000));
	let tzdate = tzd.getFullYear() + "-" + (tzd.getMonth()+1) + "-" + (tzd.getDate()+1);
	let tztime = tzd.getHours() + ":" + tzd.getMinutes() + ":" + tzd.getSeconds();
	let datetime = {
	  'date': tzdate,
	  'time': tztime
	};
    return datetime;
}
let cnst = getTodayDateTime('-03:30');
let dateFrom = cnst.date+" "+ '00:00:00';
let tnst = getTomorrowDateTime('-03:30');
let dateTo = tnst.date+" "+ '00:00:00';

let url = "https://www.bigfeedclub.ca/rest/default/V1/orders?fields=items[increment_id,created_at,items[sku,name,price,qty_ordered,row_total,tax_amount]]&searchCriteria[filter_groups][0][filters][0][field]=delivery_date&searchCriteria[filter_groups][0][filters][0][condition_type]=from&searchCriteria[filter_groups][0][filters][0][value]="+dateFrom+"&searchCriteria[filter_groups][1][filters][1][field]=delivery_date&searchCriteria[filter_groups][1][filters][1][condition_type]=to&searchCriteria[filter_groups][1][filters][1][value]="+dateTo+"&searchCriteria[sortOrders][0][field]=created_at&searchCriteria[sortOrders][0][direction]=DESC";
*/

let nst = getTodayDateTime('-03:30');
let todayDate = nst.date+" "+ '00:00:00';
let url = "https://www.bigfeedclub.ca/rest/default/V1/orders?fields=items[increment_id,created_at,items[sku,name,price,qty_ordered,row_total,tax_amount]]&searchCriteria[filter_groups][0][filters][0][field]=delivery_date&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][0][filters][0][value]="+todayDate+"&searchCriteria[sortOrders][0][field]=created_at&searchCriteria[sortOrders][0][direction]=DESC"

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
let tbl_orders = base.getTable('bigfeedclub_orders_items');
let createArray = [];
let order_id, items, no_of_items = 0;
let skus = []; // To modify createArray with product missing details.
if(results != null){
	for (let result of results){
		
		order_id = result.increment_id;           
		items = result.items;
		no_of_items += items.length;	
		for (let item of items){   
			skus.push(item.sku); // To modify createArray with product missing details.
			createArray.push({
					fields: {
						'sku': item.sku,
						'name': item.name,
						'base_image_url': "",   
						'price': item.price,
						'quantity_ordered': item.qty_ordered,
						'tax_amount': item.tax_amount,
						'row_total': item.row_total,
						'Order_ID': order_id,
						'item_id': 0,
						'availability': {name : 'Available'}

									   
					}
			});  
		}		
	}
}else{
            createArray.push({
					fields: {
						'sku': "No Items for today",
						'name': "No Items for today"
															   
					}
			});  	
}	
let query = await tbl_orders.selectRecordsAsync();
let records = query.records;

while (records.length > 0) {
    await tbl_orders.deleteRecordsAsync(records.slice(0, 10));
    records = records.slice(10);
}
// Fetch product details.
if(results != null){
let item_skus = skus.toString();
    url = "https://www.bigfeedclub.ca/rest/default/V1/products?fields=items[sku,media_gallery_entries,extension_attributes[stock_item[item_id,qty,is_in_stock]]]&searchCriteria[filter_groups][0][filters][0][field]=sku&searchCriteria[filter_groups][0][filters][0][value]="+item_skus+"&searchCriteria[filter_groups][0][filters][0][condition_type]=in";
    response = await fetch(url,options);
    data = await response.json();
    results = data.items;

let medias,base_image,stock,is_in_stock;
let product_url = "https://www.bigfeedclub.ca/media/catalog/product";

for (let result of results){
    medias = result.media_gallery_entries;
    stock =  result.extension_attributes.stock_item;
	if(stock.is_in_stock == true){is_in_stock = 'Available'}
    if(stock.is_in_stock == false){is_in_stock = 'Not Available'}

    for (let cA of createArray){
              if(cA.fields.sku == result.sku) {  
                cA.fields.item_id = stock.item_id;
				cA.fields.availability = {
					name: is_in_stock 
				};
               		   
              }
    }

    for (let media of medias){
        if(media.types.includes("image")) {
        
            base_image = media.file;
            for (let cA of createArray){
              if(cA.fields.sku == result.sku) {  
                cA.fields.base_image_url= product_url+base_image; 
				               		   
              }
            }
        } 
       
    }  
  
}
}else{
	    createArray.push({
			        fields: {
						'sku': "No Items for today",
						'name': "No Items for today"
															   
					}
		});  	
}
while (createArray.length > 0) {
    await tbl_orders.createRecordsAsync(createArray.slice(0, 10));
    createArray = createArray.slice(10);
}

console.log(no_of_items+" Products imported successfully!");
//==========================Step 2=================================================================

let table = base.getTable('bigfeedclub_orders_items');

let query = await table.selectRecordsAsync();
let updates = [];
for (let record of query.records) {
    if(record.getCellValue('base_image_url') != null){
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
    await table.updateRecordsAsync(updates.slice(0, 10));
    updates = updates.slice(10);
}
