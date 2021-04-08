var AceAlBastoni=AceAlBastoniAPI
var Crateriea = AceAlBastoni.Crateriea;
var account = Session.getUser().getEmail();
var objectStationID = AceAlBastoni.getObjectStationId(account);
var emailsFileId = AceAlBastoni.getEmailsFileId();
var OnDay = new Date('2021/1/9').getTime() - new Date('2021/1/8').getTime()
