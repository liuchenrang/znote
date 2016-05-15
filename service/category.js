/**
 * Created by XingHuo on 16/5/11.
 */
'use strict';


const util = require('util');
const storage = require('../service/storage');
const vue = require('vue');
const events = require('events');
const $ = require('jquery');
const Logger = require('../utils/logger').Logger;
const logger = new Logger();

function Category() {
    this.container_id = '#note-cate';
    this.storage = storage;
    events.EventEmitter.call(this);
    // Initialize necessary properties from `EventEmitter` in this instance
    this.initOnEvent();

    this.initEmitEvent();
    this.vue =  new vue({
        el: this.container_id,
        data: {
            items: []
        },
        methods: {
            click: function (event) {
                $(event.target).parent().children().removeClass('active');
                $(event.target).addClass('active');
            }
        }
    })

    this.add = function(data, callback){
        var self = this;
        db.category.insert(data,function(err,rows){
            self.emit('onCateAdd',rows)
            if (callback) {
                callback(err,rows)
            }
        });
    }
    this.delete = function(data, callback){
        var self = this;
        db.category.remove(data,function(err,rows){
            self.emit('onCateDelete',rows)
            if (callback) {
                callback(err,rows)
            }
        });
    }
    this.getSelected = function(){
        return $(this.container_id).children('.active').data('id');
    }
}

util.inherits(Category, events.EventEmitter);

Category.prototype.initEmitEvent = function() {
    this.emit('onCateLoad');
}
Category.prototype.initOnEvent = function(){
    var self = this;
    var callback = function(){
        self.refreshList();
    }

    self.on('onCateAdd', callback );
    self.on('onCateDelete', callback );
    self.on('onCateLoad', callback ) ;
    self.on('renderCategory', this.doRender);

}
Category.list = []
Category.prototype.doRender = function(docs){
    logger.info('Category','doRender')
    this.vue.items = docs;
}
Category.prototype.refreshList = function(){
    var self = this;

    this.storage.category.find({}, function (err, docs) {
        //this.list = docs;
        self.emit('renderCategory',docs)
    });
}


//new Category();

exports.Category = Category;