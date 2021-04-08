/*
gets the emails from all files then puts them in "Emails" and 'Public' List files
*/
function write_To_Emails_and_Public_List_Trigger() {
  var values = Object.values(AceAlBastoni.EmailsFileId);
  var emails = new Array();
  for (var fileId of values) {
    emails = emails.concat((AceAlBastoni.getContent(fileId)));
    emails.push(AceAlBastoni.getContent(fileId));
  }
  emails = emails.toString();
  emails = emails.match(/[.\w-]+@([\w-]+\.)+[\w-]+/g);
  //emails = emails.map(item => item.toLowerCase());
  emails = AceAlBastoni.unique(emails);
  AceAlBastoni.rename(emailsFileId, "Emails" + AceAlBastoni.getNamePostfix());
  AceAlBastoni.setContent(emails, emailsFileId);
  AceAlBastoni.setContent(emails, AceAlBastoni.PublicFileId['List']);
  console.log(emails.length);
  Updates_Number_Of_New_Emails_Trigger();
  Updates_Emails_2_Trigger();
}


//█████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████	
// TriggerLevel #1
////Written on 11 jan 2021 
function update_Public_JSON() {
  let values = Object.values(AceAlBastoni.JsonFileId);
  values = values.filter(id => id);
  var newJ = {}
  for (var id of values) {
    var accountName = AceAlBastoni.getKeyByValue(AceAlBastoni.JsonFileId, id)
    var temp = AceAlBastoni.getJsonFromFileOnDrive(id);
    console.log("Json From : " + accountName + " : " + (Object.keys(temp)).length);
    newJ = { ...newJ, ...temp };
  }
  var length = (Object.keys(newJ)).length;
  console.log(length);

  //Update the name of the file then 
  // --> delete the keys that should be from the removed emails 
  newJ = deleteRemoved_keys_From_Json_(newJ);
  length = (Object.keys(newJ)).length;
  AceAlBastoni.rename(AceAlBastoni.PublicFileId['JSON'], "Public JSON" + AceAlBastoni.getNamePostfix() + " " + length);
  AceAlBastoni.setJsonObjectOnFileOnDrive(newJ, AceAlBastoni.PublicFileId['JSON']);
  console.log(length);
}
//█████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████	
//Written on 12 jan 2021 
function sortEmails_Trigger() {
  var Emails_Object_SortedByFileId = '1k3czRE7-VhsnuOmSALKpEoD1wpNyUi1G';
  /*var values = Object.values(Crateriea);
  var random = Math.floor(Math.random() * values.length);
  var sortionType =values[random];*/
  var sortionType = Crateriea['timestamp'];

  var theJson = AceAlBastoni.getJsonFromFileOnDrive(AceAlBastoni.PublicFileId['JSON']);
  var emailsArray = AceAlBastoni.getListOfEmailsObjectsSortedBy(theJson, sortionType);
  // indexing 
  let ICounter = 0;
  emailsArray = emailsArray.map(
    item => { item['emailNo'] = ICounter; ICounter++; item['timestamp'] = AceAlBastoni._convertDate(item['timestamp']); return item; }
  );
  var emailsCount = emailsArray.length;
  AceAlBastoni.setJsonObjectOnFileOnDrive({ "emails": emailsArray }, Emails_Object_SortedByFileId)
  var name = "Sorted Emails By: SortedBy_ " + sortionType + " " + AceAlBastoni.getNamePostfix() + " _" + emailsCount;
  AceAlBastoni.rename(Emails_Object_SortedByFileId, name);
}
//█████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████	
//Written on 12 jan 2021 
//not used 
function archive() {
  console.log(new Date().getTime());
console.log(DriveApp.getFileById("1WO-yRJROb3Bzkr1GQu5k-CosbLAV6kKWImtNpsefKa8-l3Sxdcyb7eAL").makeCopy().setName("arch V1 test ace").getId());

 /* return
  console.log(DriveApp.getFileById(AceAlBastoni.PublicFileId['JSON']).makeCopy().setName("arch V1").getId());
*/
}

