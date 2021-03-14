//=================================MENU====================================
/*function addMenu() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('BigFeedClub API')
      .addItem('Get products','getBigFeedClubProducts')
      .addToUi();
}*/
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  var menuItems = [
    {name: 'Get products', functionName: 'getBigFeedClubProducts'},
    {name: 'Send to Airtable', functionName: 'sendToAirtable'}
  ];
  spreadsheet.addMenu('BigFeedClub API', menuItems);
}
//================================BIGFEEDCLUB PRODUCTS===============================================
function getBigFeedClubProducts() { 
  var url = "https://www.bigfeedclub.com/rest/default/V1/products?fields=items[sku,media_gallery_entries]&searchCriteria[filter_groups][0][filters][0][field]=status&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq";
  var headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer koutgvvgp34owf5t431myyptl1nctw8m"
    };
  var options = {
    "method": "get",
    "headers": headers
  };
  var response = UrlFetchApp.fetch(url,options);
  var data = JSON.parse(response.getContentText());
  var results = data.items; 
  var sheet = SpreadsheetApp.getActive().getSheetByName('bigfeedclub_products');
  //var header = ["sku", "base_image", "small_image", "thumbnail_image", "swatch_image","additional_images"];
  var header = ["sku","entryid","base_image"];
  var items = [header];   
  //var base_image, small_image, thumbnail_image;
  var entryid,base_image;
  var product_url = "https://www.bigfeedclub.com/media/catalog/product";

  results.forEach(function (result) {
     var medias = result.media_gallery_entries;
     medias.forEach(function (media) {
        if(media.types.includes("image"))
         entryid = media.id;
         base_image = media.file;
        /*if(media.types.includes("small_image"))
         small_image = media.file;
        if(media.types.includes("thumbnail"))
         thumbnail_image = media.file;*/ 
     });
    //items.push([result.sku,product_url+''+base_image,product_url+''+small_image,product_url+''+thumbnail_image,'image.jpg','image.jpg']);
    items.push([result.sku,entryid,product_url+''+base_image]);   
  
});
  sheet.getRange(1,1,items.length,items[0].length).setValues(items);
  //Logger.log(items[0].length);
}
//=================================AIRTABLE=============================================
function sendToAirtable(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var sht = sheet.getSheetByName('bigfeedclub_products');
  var drng = sht.getDataRange();
  var rng = sht.getRange(2,1,drng.getLastRow(),drng.getLastColumn()); //drng.getLastRow()
  var rngA = rng.getValues(); //Array of input values
  //--------------------------------------------------------------------
  var headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer keypWRXs7DnX5yWLl"
  };   
  //--------------------------------------------------------------------
  for(var i = 0; i < rngA.length; i++)
  {
  var record = {
  "records": [
    {
      "fields": {
        "sku": rngA[i][0],
        "entryid": rngA[i][1],
        "base_image": [
        	{
        	 "url": rngA[i][2]
        	}
       ]
      }  
    } 
  ]
  };  
  var options = {
    "method": "post",
    "headers": headers,
    'payload' : JSON.stringify(record)
  };
   UrlFetchApp.fetch("https://api.airtable.com/v0/appV0eMgz6pf1NyJ0/bigfeedclub_products",options); 
    //Logger.log(rngA[i][0]);
  }
}
//============================PRODUCT UPDATE================================
function updateProduct(){
   
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var sht = sheet.getSheetByName('getfrom_airtable');
  var drng = sht.getDataRange();
  var rng = sht.getRange(2,1,drng.getLastRow()-1,drng.getLastColumn()); //drng.getLastRow()
  var rngA = rng.getValues(); //Array of input values
  var rowCount = rngA.length;
  var base_image = rngA[rowCount-1][2];
  var entryid = rngA[rowCount-1][1];
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

  var entry = {
  "entry": {
    "id": entryid,
    "media_type": "image",
    "label": "test",
    "position": 0,
    "disabled": true,
    "types": [
       "image",
       "small_image",
       "thumbnail"
    ],
    "file": "",
    "content": {
      "base64_encoded_data": base64data,
      "type": "image/jpeg",
      "name": filename
    }
  }
};
 var headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer koutgvvgp34owf5t431myyptl1nctw8m"
    };
  var options = {
    "method": "put",
    "headers": headers,
    "payload" : JSON.stringify(entry)
  };
  var url = "https://www.bigfeedclub.com/rest/default/V1/products/"+sku+"/media/"+entryid;
  UrlFetchApp.fetch(url,options); 
}