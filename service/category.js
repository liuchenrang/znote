/**
 * Created by XingHuo on 16/5/11.
 */
'use strict';


const util = require('util');
const storage = require('../service/storage');
const vue = require('vue');
const events = require('events');
const $ = require('jquery');

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
    var dthis = this;
    var callback = function(){
        dthis.refreshList();
    }

    this.addListener('onCateAdd', callback );
    this.addListener('onCateDelete', callback );
    this.addListener('onCateLoad', callback ) ;
    this.addListener('renderCategory', this.doRender);


}
Category.list = []
Category.prototype.doRender = function(docs){
    console.log('doRender',docs)
    this.vue.items = docs;
}
Category.prototype.refreshList = function(){
    var cthis = this;
    this.storage.category.find({}, function (err, docs) {
        //this.list = docs;
        cthis.emit('renderCategory',docs)
    });
}


//new Category();

exports.Category = Category;