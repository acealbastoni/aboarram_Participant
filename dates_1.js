// TriggerLevel #2
function Updates_Number_Of_New_Emails_Trigger() {
    var dates = [];       //['2021/02/15','2021/02/16']
    //----------- Start: Fill The array with 10 dayes befor today--------------------------------
    var counter = 6;
    while (--counter >= 0) {
        var aDate = new Date() - (counter * OnDay);
        dates.push(AceAlBastoni._convertDate(aDate));
    }
    //----------- End: Fill The array with 10 dayes befor today-----------------------------------
    for (var date of dates) {
        Utilities.sleep(100)
        var dateObject = getDateObject_(date);
        Field = 'Number Of New Emails';
        let from = dateObject.today;
        console.log(from)
        let to = dateObject.lastToday;
        console.log("Updating : " + AceAlBastoni._convertDate(new Date(from)));
        var countOfEmails = AceAlBastoni.getEmailsFromTo(from, to, AceAlBastoni.PublicFileId['JSON']).length;
        console.log(countOfEmails);
        AceAlBastoni.updateInSheet(Field, AceAlBastoni._convertDate(from), countOfEmails);

        from = dateObject.yesterDay;
        to = dateObject.lastYesterday;
        console.log("Updating : " + AceAlBastoni._convertDate(new Date(from)));
        var countOfEmails = AceAlBastoni.getEmailsFromTo(from, to, AceAlBastoni.PublicFileId['JSON']).length;
        console.log(countOfEmails);
        let color = ((dates.indexOf(date) % 2) === 0) ? '#43FF01' : 'white';
        AceAlBastoni.updateInSheet(Field, AceAlBastoni._convertDate(from), countOfEmails, color);
    }

}

function getDateObject_(param) {
    let today = new Date(AceAlBastoni._convertDate(new Date(param ? param : '')));
    console.log("today is : " + today)
    let lastToday = new Date(today.getTime() + (OnDay - 1));
    let yesterDay = new Date(today.getTime() - (OnDay));
    let lastYesterday = new Date(yesterDay.getTime() + (OnDay - 1));
    return { "today": today, "lastToday": lastToday, "yesterDay": yesterDay, "lastYesterday": lastYesterday }
}
//█████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████	
// TriggerLevel #2
function Updates_Emails_2_Trigger() {
    var sortionType = Crateriea['timestamp' || '@account' || 'emailAddress'];
    var theJson = AceAlBastoni.getJsonFromFileOnDrive(AceAlBastoni.PublicFileId['JSON']);
    var emailsArray = AceAlBastoni.getListOfEmailsObjectsSortedBy(theJson, sortionType);
    emailsArray = emailsArray.map(
        item => {
            return JSON.stringify([
                item['emailAddress'],
                AceAlBastoni._convertDate(item['timestamp']),
                item['@account']
            ]);
        }
    );
    emailsArray = AceAlBastoni.unique(emailsArray);
    emailsArray = emailsArray.map(item => JSON.parse(item));
    console.log(emailsArray.length);

    var sheet = SpreadsheetApp.openById(AceAlBastoni.AceAlBastoni_Spreadsheet).getSheetByName('emails_2');
    console.log(emailsArray.length);
    sheet.clear();
    sheet.getRange(1, 1, emailsArray.length, emailsArray[0].length).setValues(emailsArray);
}
//█████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████	

//Written on 26 Feb 2021 
function Update_SUMMITION() {
    let sheetName = 'dates_1'; var columnName_asKey = 'Date/Header'; var columnName_asValue = 'Number Of New Emails';
    var obj = AceAlBastoni.get_KVP_Object(sheetName, columnName_asKey, columnName_asValue);
    var counter = 59;
    var Array_of_Last_six_dates = [];    //['2021/02/15','2021/02/16']
    //----------- Start: Fill The array with 6 dayes befor today---------------------------------------
    while (--counter >= 0) {
        let aDate = new Date() - (counter * OnDay);
        Array_of_Last_six_dates.push(AceAlBastoni._convertDate(aDate));
    }
    /*===================================== End: Fill The array with 6 dayes befor today===============*/

    for (var date of Array_of_Last_six_dates) {
        var xDate = date
        //----------- Start: Fill The array with 30 dayes befor today----------------------------------------
        var dates = [];
        var counter = 32;
        while (--counter >= 0) {
            let aDate = new Date(xDate) - (counter * OnDay);
            dates.push(AceAlBastoni._convertDate(aDate));
        }
        /*===================================== End: Fill The array with 30 dayes befor today===============*/
        dates = dates.map(item => obj[item] ? obj[item] : 0);
        var s = get_SUMMITION_(dates);
        console.log("Updating: "+date +" with: "+s);
        AceAlBastoni.updateInSheet('SUMMITION', AceAlBastoni._convertDate(xDate), s, '')
    }

}

function get_SUMMITION_(arro) {
  arro = arro.slice(Math.max(arro.length - 32, 0))
  var sum = 0;
  arro.map((item) => { sum = sum + item });
  return sum;
}


//█████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████	

//Written on 27 Feb 2021 
function Update_REPRESENTATION() {
 let dataRange = SpreadsheetApp.openById(AceAlBastoni.AceAlBastoni_Spreadsheet)
        .getSheetByName('dates_1').getDataRange().getValues();
        let test = [];       //['2021/02/15','2021/02/16']
    //----------- Start: Fill The array with 10 dayes befor today--------------------------------
    var Number_Of_Dayes_Before_Now = 30;
    while (--Number_Of_Dayes_Before_Now >= 0) {
        var aDate = new Date() - (Number_Of_Dayes_Before_Now * OnDay);
        test.push(AceAlBastoni._convertDate(aDate));
    }
    //----------- End: Fill The array with 10 dayes befor today-----------------------------------
  
    let SUMMITION_Column = getColumn_('SUMMITION', dataRange);
    let Date_HeaderColumn = getColumn_('Date/Header', dataRange);
    
    let oo = {}
     test.map(element => {
        let dateIndex = Date_HeaderColumn.indexOf(element.toString());
        let _Object = getFenceRepresentation_(dateIndex, SUMMITION_Column);
        let compared_Value = _Object['value'];
        let last30DayArr = _Object['array'];
        let resul = getWearFenceRepresentation_(compared_Value, last30DayArr);
        oo[element]=resul;
        let color = ((test.indexOf(element) % 2) === 0)? '#F0BCEF' : 'white';
        if(resul!='N') {color = 'red'}
        console.log(resul);
        AceAlBastoni.updateInSheet('REPRESENTATION',element,resul,color);
        return resul;
    })

    console.log(oo);

   
    
}

function getFenceRepresentation_(dateIndex, SUMMITION_Column) {
    let Num_Of_Last_Days = 30;
    var citrus = SUMMITION_Column.slice((dateIndex - (Num_Of_Last_Days - 1)), dateIndex + 1);
    return { "value": citrus.pop(), "array": citrus };
}

function getColumn_(columnName, dataRange) {
    let index_Of_The_Column = dataRange[0].indexOf(columnName.toString());
    let column = dataRange.map(row => (columnName === "Date/Header") ? AceAlBastoni
        ._convertDate(row[index_Of_The_Column]) : row[index_Of_The_Column])
    return column;
}

function getWearFenceRepresentation_(todayHoursSummitionValue, las30DaySumms) {
    var mean = getAverage_(las30DaySumms);
    var SD = standardDeviation_(las30DaySumms, mean);
    if (mean == 0 && SD == 0) {
        return "ID";
    }
    else if (todayHoursSummitionValue >= mean + (4 * SD))
        return "W+++";
    else if ((todayHoursSummitionValue >= mean + (3 * SD)) && (todayHoursSummitionValue < (mean + (4 * SD))))
        return "W++";
    else if ((todayHoursSummitionValue >= mean + (2 * SD)) && (todayHoursSummitionValue < (mean + (3 * SD))))
        return "W+";
    else if (todayHoursSummitionValue <= mean - (4 * SD))
        return "W---";
    else if ((todayHoursSummitionValue <= mean - (3 * SD)) && (todayHoursSummitionValue > (mean - (4 * SD))))
        return "W--";
    else if ((todayHoursSummitionValue <= mean - (2 * SD)) && (todayHoursSummitionValue > (mean - (3 * SD))))
        return "W-";
    else
        return "N";  //Not Anomall
}

function sumArrayElements_(inputArr) {
    var sum = 0;
    inputArr.map(item => sum = (sum + item))
    return sum;
}

function standardDeviation_(values, avg) {
    var squareDiffs = values.map(function (value) { var diff = value - avg; var sqrDiff = diff * diff; return sqrDiff; });
    var sum = sumArrayElements_(squareDiffs);
    var nMinus1 = (values.length - 1);
    var variance = sum / nMinus1;
    return Math.sqrt(variance);
}

function getAverage_(data) {
    var sum = data.reduce(function (sum, value) { return sum + value; }, 0);
    var avg = sum / data.length;
    return avg;
}
function updateInShee8888888888888t_RemoveMe(Field, date, countOfEmails, color) {

    date = new Date(date);
    var sheet = SpreadsheetApp.openById(AceAlBastoni_Spreadsheet).getSheetByName('dates_1');

    var headerHorizon = sheet.getDataRange().getValues()[0];
    var dateColumnNumber = headerHorizon.indexOf(Field.toString()) + 1;

    var LastRow = sheet.getDataRange().getLastRow();

    var headerVertival = sheet.getRange(1, 1, LastRow).getValues();
    headerVertival = headerVertival.map(item => item[0].toString());
    var FieldNumber = headerVertival.indexOf(date.toString()) + 1;
    //const color = Math.floor(Math.random()*16777215).toString(16);
    sheet.getRange(FieldNumber, dateColumnNumber).setValue(countOfEmails).setBackground(/*'#'+*/color);
}





//█████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████	
//Written on 26 jan 2021 
function deleteRemoved_keys_From_Json_(JSON_Emails) {
    let removedEmailsList = AceAlBastoni.getRemovedEmails();
    for (var email of removedEmailsList) {
        delete JSON_Emails[email];
    }
    return JSON_Emails;
}

