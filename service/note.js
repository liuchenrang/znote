/**
 * Created by XingHuo on 16/5/11.
 */
'use strict';


const util = require('util');
const storage = require('../service/storage');
const vue = require('vue');
const events = require('events');
const $ = require('jquery');
const eventEmitter = new events.EventEmitter();

function Note() {
    this.storage = storage;
    events.EventEmitter.call(this);

    this.initOnEvent();
    this.initEmitEvent();

    var self = this;
    this.vue =  new vue({
        el: '#note-list',
        data: {
            items: []
        },
        methods: {
            click: function (event) {
                self.emit('onNoteItemClick',$(event.target).data('id'));
                $(event.target).parent().children().removeClass('active');
                $(event.target).addClass('active');
            }
        }
    })

    this.add = function(data, callback){
        var self = this;
        db.note.insert(data,function(err,rows){
            self.emit('onNoteAdd',rows)
            if (callback) {
                callback(err,rows)
            }
        });
    }
    this.delete = function(data, callback){
        var self = this;
        db.note.remove(data,function(err,rows){
            self.emit('onNoteDelete',rows)
            if (callback) {
                callback(err,rows)
            }
        });
    }
    this.find = function(data, callback){
        db.note.find({_id:data},function(err,rows){
            self.emit('onNoteFindByKey',rows)
            if (callback) {
                console.log("id:"+data)
                console.log(rows)
                mainWindow.editor.modleNote = rows[0];
                mainWindow.editor.initView(rows[0]);
                callback(err,rows)
            }
        });
    };
}

util.inherits(Note, events.EventEmitter);

Note.prototype.initEmitEvent = function() {
    this.emit('onNoteAdd');
}
Note.prototype.initOnEvent = function(){
    var self = this;
    var callback = function(){
        self.refreshList();
    }
    self.on('onNoteItemClick', function (id) {
        self.find(id,function(rows){

        });
    })
    this.on('onNoteAdd', callback );
    this.addListener('onNoteDelete', callback );
    this.addListener('onNoteLoad', callback ) ;
    this.addListener('renderNoteList', this.doRender);


}
Note.list = []
Note.prototype.doRender = function(docs){
    Note.list = docs;
    console.log('doRender',docs)
    this.vue.items = docs;
}
Note.prototype.refreshList = function(){
    var cthis = this;
    this.storage.note.find({}, function (err, docs) {
        //this.list = docs;
        cthis.emit('renderNoteList',docs)
    });
}


//new Category();

exports.Note = Note;