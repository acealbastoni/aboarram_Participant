   function fefo(vvvv){    
var file = DriveApp.getFileById('1tfFIvfMJ1I61l4DT8PH4xIcvHbf7agcq');
GmailApp.sendEmail('elhlawy@gmail.com', 'Software Developer', 'Please see the attached file.', 
{
    attachments: [file.getAs(MimeType.PDF)],
    name: 'elhlawy@gmail.com'/*,
    from:"elhlawy@gmail.com"*/
}

);

console.log(MailApp.getRemainingDailyQuota())




     console.log(GmailApp.getAliases());
     
     ///updateInSheet(Field, date, countOfEmails, color) {
    //javadevelopermohamedgmailcom.secsec();   console.log('Hello'); 
   }

//AceAlBastoni_JDM