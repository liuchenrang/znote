/**
 * Created by XingHuo on 16/5/12.
 */


var Datastore = require('nedb')

db = {};
db.user = new Datastore( __dirname + '/../database/users.db');
db.note = new Datastore( __dirname + '/../database/notes.db');
db.tag = new Datastore( __dirname + '/../database/tags.db');
db.category = new Datastore( __dirname + '/../database/category.db');

// You need to load each database (here we do it asynchronously)
db.user.loadDatabase();
db.note.loadDatabase();
db.tag.loadDatabase();
db.category.loadDatabase();

/**
 * Created by XingHuo on 16/5/10.
 */


module.exports = db;