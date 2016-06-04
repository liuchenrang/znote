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
    var self = this;
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
                var selected = $(event.target).data('id');
                self.emit('onCategoryItemClick',selected);

                $(event.target).parent().children().removeClass('active');
                $(event.target).addClass('active');
            }
        }
    })
    this.find = function(data, callback){
        db.category.find({_id:data},function(err,rows){
            self.emit('onCategoryFindByKey',rows)
            if (callback) {
                callback(err,rows)
            }
        });
    };
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
        var id =  $(this.container_id).children('.active').data('id');
        if (typeof(id) == 'undefined') {
            id = 0;
        }
        return id;

    }
}

util.inherits(Category, events.EventEmitter);

Category.prototype.initEmitEvent = function() {
    var self = this;
    self.emit('onCateLoad');
}
Category.selected = 0;
Category.prototype.initOnEvent = function(){
    var self = this;
    var callback = function(){
        self.refreshList();
    }

    self.on('onCateAdd', callback );
    self.on('onCateDelete', callback );
    self.on('onCateLoad', callback ) ;
    self.on('renderCategory', this.doRender);
    self.on('onCategoryItemClick', function(id){
        Category.selected = id;
        self.find(id,function(err,rows){
            if (rows) {
                if (rows[0]['title'] == '最新') {
                    di.get('service.note').search({delete_at:0});

                }else{
                    di.get('service.note').search({category_id:id,delete_at:0});
                }
            }

        })
    });

}
Category.list = []
Category.prototype.doRender = function(docs){
    logger.info('Category','doRender')
    this.vue.items = docs;
}
Category.prototype.refreshList = function(){
    var self = this;

    this.storage.category.find({}).sort({ sort: -1 }).exec(function (err, docs) {
        //this.list = docs;
        self.emit('renderCategory',docs)
    });
}


//new Category();

exports.Category = Category;