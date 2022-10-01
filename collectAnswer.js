function doPost(e) {
  let params = JSON.parse(e.postData.getDataAsString());
  let myData = params.myData;
  let amount = myData.amount;
  let detail = myData.detail;
  let kind = myData.kind;
  let card = myData.card;
  var result = {};
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  if (myData) {
    let obj = getAnswerAndSet(amount, detail, kind, card);
    result = {
      "file": obj.fileName,
      "balance": obj.balance,
      "amount": amount,
      "detail": detail,
      "kind": kind,
      "card": card
    };
  } else {
    result = {
      "error":{
        "message":"エラー"
      }
    };
  }
  
  output.setContent(JSON.stringify(result));
  return output;
}

function getAnswerAndSet(amount, detail, kind, card){
  var today = new Date();
  var d = today.getDate();
  var m = today.getMonth() + 1;
  var y = today.getFullYear();
  var date = y + "/" + m + "/" + d;

  var folder = DriveApp.getFolderById("YourFolderId");
  var destination = folder.getFolders().next();
  var file = destination.getFiles().next();
  const fileName = file.getName()
  const parentFolderName = file.getParents().next().getName();
  var sheets = SpreadsheetApp.open(file)
  
  let input = [[date, amount, detail, kind]];

  var sheet = sheets.getSheetByName("交易");
  var lastRow = sheet.getRange("B5").getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow() + 1;
  sheet.getRange(lastRow, 2, 1, 4).setValues(input);
  if (card != 'None') {
    let cardInput = [[date, amount, detail, card]];
    sheet.getRange(lastRow, 7, 1, 4).setValues(cardInput);
  }

  sheet = sheets.getSheetByName("汇总");
  let balance = sheet.getRange("I15").getValue();

  let obj = {
    fileName: parentFolderName + '/' + fileName,
    balance: balance
  }

  return obj;
}
