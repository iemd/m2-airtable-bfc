//============================CREATE PRODUCT================================
function createProduct(){
   
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var sht = sheet.getSheetByName('create_product');
  var drng = sht.getDataRange();
  var rng = sht.getRange(2,1,drng.getLastRow()-1,drng.getLastColumn()); //drng.getLastRow()
  var rngA = rng.getValues(); //Array of input values
  var rowCount = rngA.length;
  
  var price = rngA[rowCount-1][5];
  var weight = rngA[rowCount-1][4];
  var qty = rngA[rowCount-1][3];
  var description = rngA[rowCount-1][2];
  var product_name = rngA[rowCount-1][1];
  var sku = rngA[rowCount-1][0];
  //Logger.log(rowCount);
  //Logger.log(rngA[rowCount-1][0]);

  var product = {
  
  "product": {
    "sku": sku,
    "name": product_name,
    "attribute_set_id": 4,
    "price": price,
    "status": 1,
    "visibility": 4,
    "type_id": "simple",
    "weight": weight,
    "extension_attributes": {
    	/*"category_links": [
            {
                "position": 0,
                "category_id": "3"
            }
            
        ],*/
        "stock_item": {
            "qty": qty,
            "is_in_stock": true
        }
    },
    "custom_attributes": [
        {
            "attribute_code": "description",
            "value": description
        }
    ]
  }
};
 var headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer koutgvvgp34owf5t431myyptl1nctw8m"
    };
  var options = {
    "method": "post",
    "headers": headers,
    "payload" : JSON.stringify(product)
  };
  var url = "https://www.bigfeedclub.com/rest/default/V1/products";
  UrlFetchApp.fetch(url,options); 

  
}

//============================UPDATE PRODUCT IMAGE================================
function updateProductImage(){
   
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var sht = sheet.getSheetByName('update_product_image');
  var drng = sht.getDataRange();
  var rng = sht.getRange(2,1,drng.getLastRow()-1,drng.getLastColumn()); //drng.getLastRow()
  var rngA = rng.getValues(); //Array of input values
  var rowCount = rngA.length;
  var base_image = rngA[rowCount-1][3];
  var entryid = rngA[rowCount-1][2];
  var product_name = rngA[rowCount-1][1];
  var sku = rngA[rowCount-1][0];
  //Logger.log(rowCount);
  //Logger.log(rngA[rowCount-1][0]);
  function GetFilename(url)
  {
   if (url)
   {
      var m = url.toString().match(/.*\/(.+?)\./);
      if (m && m.length > 1)
      {
         return m[1];
      }
    }
    return "";
   }
    var filename = GetFilename(base_image);
    var blob = UrlFetchApp.fetch(base_image).getBlob();
    var base64data = Utilities.base64Encode(blob.getBytes());               
   
   //Logger.log(base64data);

  var url = "https://www.bigfeedclub.com/rest/default/V1/products/"+sku+"/media/"+entryid;
  var method = "put";
  var entry = {
  "entry": {
    "id": entryid,
    "media_type": "image",
    "label": product_name,
    "position": 0,
    "disabled": false,
    "types": [
       "image",
       "small_image",
       "thumbnail",
       "swatch_image"
    ],
    "file": "",
    "content": {
      "base64_encoded_data": base64data,
      "type": "image/jpeg",
      "name": filename
    }
  }
};

if(entryid == ""){
  entry = {
  "entry": {    
    "media_type": "image",
    "label": product_name,
    "position": 0,
    "disabled": false,
    "types": [
       "image",
       "small_image",
       "thumbnail",
       "swatch_image"
    ],
    "file": "",
    "content": {
      "base64_encoded_data": base64data,
      "type": "image/jpeg",
      "name": filename
    }
   }
  };
   method = "post"; 
   url = "https://www.bigfeedclub.com/rest/default/V1/products/"+sku+"/media";
}
 
 var headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer koutgvvgp34owf5t431myyptl1nctw8m"
    };

    
  var options = {
    "method": method,
    "headers": headers,
    "payload" : JSON.stringify(entry)
  };
  
  UrlFetchApp.fetch(url,options); 
}

