/**
 * Created by XingHuo on 16/5/11.
 */
'use strict';


const util = require('util');
const storage = require('../service/storage');
const vue = require('vue');
const events = require('events');
const $ = require('jquery');
const BootstrapMenu = require('bootstrap-menu');

const Logger = require('../utils/logger').Logger;
const logger = new Logger();
var i = 0;
function Note() {
    var self = this;
    this.container_id = '#note-list';
    logger.info('service.note','I:'+ (i++));
    this.storage = storage;
    events.EventEmitter.call(this);

    this.initOnEvent();
    this.initEmitEvent();

    this.noteVue =  new vue({
        el: self.container_id,
        data: {
            items:[]
        },
        methods: {
            click: function (event) {
                self.emit('onNoteItemClick',$(event.target).parent().parent().data('id'));
                $(event.target).parent().children().removeClass('active');
                $(event.target).addClass('active');
            },
            click_more:function(event){
                var id = $(event.target).parent().parent().data('id');
                var menu = new BootstrapMenu('.note-item-btn-more', {
                    menuEvent: 'click',
                    menuSource: 'element',
                    actions: [{
                        name: '删除',
                        onClick: function(tg) {
                            console.log(id)
                            self.update(id,{'delete_at':+new Date()});
                            // run when the action is clicked
                        }
                    }, {
                        name: '移动',
                        onClick: function() {
                            // run when the action is clicked
                        }
                    }]
                });

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
                callback(err,rows)
            }
        });
    };
    this.search = function(data, callback){
        logger.info('service.note','serach ' + data)
        db.note.find(data).sort({ updated_at: -1 }).exec(function(err,rows){
            self.emit('onNoteFindBySearch',rows)
            logger.info('service.note','serachResult ' + rows)
            logger.info('service.note',rows)

            if (callback) {
                callback(err,rows)
            }
        });
    };
    this.update = function(id,data, callback){
        data.updated_at = +new Date();
        db.note.update({_id:id},data,{upsert:true,multi:false},function(err,rows){
            logger.info('service.note','emit onNoteUpdateByKey')
            self.emit('onNoteUpdateByKey',rows)
            if (callback) {
                callback(err,rows)
            }
        });
    };
}

util.inherits(Note, events.EventEmitter);

Note.prototype.initEmitEvent = function() {
    var self = this;
    self.emit('onNoteInit');
}
Note.prototype.initOnEvent = function(){
    var self = this;
    var callback = function(){
        self.refreshList();
    }
    var callback2 = function(docs){
        self.emit('renderNoteList',docs);
    };

    self.on('onNoteItemClick', self.onNoteItemClick)
    self.on('onNoteAdd', callback );
    self.on('onNoteFindBySearch', callback2 );
    self.on('onNoteDelete', callback );
    self.on('onNoteUpdateByKey', callback );
    self.on('onNoteInit', callback ) ;
    self.on('renderNoteList', this.doRender);

}
Note.prototype.onNoteItemClick = function(id){
    var self = this;
    self.find(id,function(err,rows){
        logger.info("service.note","onNoteItemClick Find Callback")

        if (!err) {
            mainWindow.reloadNode(rows[0]);
        }else{
            console.log(err)
        }

    });
}
Note.list = []
Note.prototype.doRender = function(docs){
    Note.list = docs;
    console.log('doRender',docs)
    this.noteVue.items = docs;
}
Note.prototype.refreshList = function(){
    var self = this;
    logger.info('service.note','do refreshList');
    this.storage.note.find({delete_at:0}).sort({ updated_at: -1 }).exec( function (err, docs) {
        //this.list = docs;
        logger.info('service.note','do renderNoteList');
        console.log(docs);

        self.emit('renderNoteList',docs)
    });
}


//new Category();

exports.Note = Note;