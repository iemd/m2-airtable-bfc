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

let url = "https://www.bigfeedclub.ca/rest/default/V1/orders?fields=items[increment_id,customer_firstname,customer_lastname,grand_total,created_at,extension_attributes[delivery_date,delivery_time]]&searchCriteria[filter_groups][0][filters][0][field]=delivery_date&searchCriteria[filter_groups][0][filters][0][condition_type]=from&searchCriteria[filter_groups][0][filters][0][value]="+dateFrom+"&searchCriteria[filter_groups][1][filters][1][field]=delivery_date&searchCriteria[filter_groups][1][filters][1][condition_type]=to&searchCriteria[filter_groups][1][filters][1][value]="+dateTo+"&searchCriteria[sortOrders][0][field]=created_at&searchCriteria[sortOrders][0][direction]=DESC";

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
let tbl_orders = base.getTable('bigfeedclub_orders');
let createArray = [];
for (let result of results){
    
    createArray.push({
            fields: {
                'Order_ID': result.increment_id,
                'Firstname': result.customer_firstname,
                'Lastname': result.customer_lastname,
                'Grand_Total': result.grand_total,
                'Ordered_At': result.created_at,
                'Delivery_Date': result.extension_attributes.delivery_date,
                'Delivery_Time': result.extension_attributes.delivery_time
              
                               
            }
        });    
}
let query = await tbl_orders.selectRecordsAsync();
let records = query.records;

while (records.length > 0) {
    await tbl_orders.deleteRecordsAsync(records.slice(0, 1));
    records = records.slice(1);
}
while (createArray.length > 0) {
    await tbl_orders.createRecordsAsync(createArray.slice(0, 1));
    createArray = createArray.slice(1);
}

console.log(results.length+" Orders imported successfully!");

