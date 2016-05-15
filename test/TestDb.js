/**
 * Created by XingHuo on 16/5/10.
 */

var db = require('../service/storage');


var doc = [{
    title:"协作",
    sort:1
},{
    title:"博客",
    sort:2
}];
title = new RegExp('sop');
db.note.find({title:title}, function (err, newDoc) {   // Callback is optional
    // newDoc is the newly inserted document, including its _id
    // newDoc has no key called notToBeSaved since its value was undefined
    console.log(newDoc)
});
