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
    this.initView();
    // Initialize necessary properties from `EventEmitter` in this instance
    this.initOnEvent();
    this.initEmitEvent();

    this.find = function (data, callback) {
        db.category.find({_id: data}, function (err, rows) {
            self.emit('onCategoryFindByKey', rows)
            if (callback) {
                callback(err, rows)
            }
        });
    };
    this.add = function (data, callback) {
        var self = this;
        db.category.insert(data, function (err, rows) {
            self.emit('onCateAdd', rows)
            if (callback) {
                callback(err, rows)
            }
        });
    }
    this.delete = function (data, callback) {
        var self = this;
        db.category.remove(data, function (err, rows) {
            self.emit('onCateDelete', rows)
            if (callback) {
                callback(err, rows)
            }
        });
    }
    this.getSelected = function () {
        var id = $(this.container_id).children('.active').data('id');
        if (typeof(id) == 'undefined') {
            id = 0;
        }
        return id;

    }
}

util.inherits(Category, events.EventEmitter);

Category.prototype.initEmitEvent = function () {
    var self = this;
    self.emit('onCateLoad');
}
Category.selected = 0;
Category.prototype.initView = function () {
    var self = this;
    var cateContentMenu = '';
    cateContentMenu += '<ul class="dropdown-menu" id="cateContentMenu">';
    cateContentMenu += '<li><a href="javascript:;" id="cateContentDel">删除</a></li>';
    cateContentMenu += '</ul>';
    $('body').append(cateContentMenu);
    $('#cateContentDel').on('click',function(){
       var id = self.getSelected()
        if (id) {
            self.delete({_id:id},function(){
                di.get('service.note').delete({category_id: id});
            })
        }
    })

    this.vue = new vue({
        el: this.container_id,
        data: {
            items: []
        },
        methods: {
            click: function (event) {
                var selected = $(event.target).data('id');
                self.emit('onCategoryItemClick', selected);

                $(event.target).parent().children().removeClass('active');
                $(event.target).addClass('active');
            }
        }
    })

}


Category.prototype.initOnEvent = function () {
    var self = this;
    var callback = function () {
        self.refreshList();
    }
    $('.list-group-item').live('contextmenu', function (e) {
        //alert(e.which) // 1 = 鼠标左键 left; 2 = 鼠标中键; 3 = 鼠标右键
        var pageX = e.pageX;//鼠标单击的x坐标
        var pageY = e.pageY;//鼠标单击的y坐标
        //获取菜单并设置菜单的位置
        $("#cateContentMenu").css({
            left: pageX + "px",//设置菜单离页面左边距离，left等效于x坐标
            top: pageY + "px"//设置菜单离页面上边距离，top等效于y坐标
        }).fadeIn(500);//显示使用淡入效果,比如不需要动画可以使用show()替换;

        return false;//阻止链接跳转
    })
    $(document).live("mousedown", function (event) {
        //button等于0代表左键，button等于1代表中键
        if (event.button == 0 || event.button == 1) {
            $("#cateContentMenu").stop().fadeOut(200);//获取菜单停止动画，进行隐藏使用淡出效果
        }
    });
    //$('.list-group-item').on("contextmenu",function(event){
    //    var pageX = event.pageX;//鼠标单击的x坐标
    //    var pageY = event.pageY;//鼠标单击的y坐标
    //    //获取菜单并设置菜单的位置
    //    $("#contextMenu").css({
    //        left:pageX+"px",//设置菜单离页面左边距离，left等效于x坐标
    //        top:pageY+"px"//设置菜单离页面上边距离，top等效于y坐标
    //    }).stop().fadeIn(500);//显示使用淡入效果,比如不需要动画可以使用show()替换;
    //
    //    event.preventDefault();//阻止浏览器与事件相关的默认行为；此处就是弹出右键菜单
    //});
    self.on('onCateAdd', callback);
    self.on('onCateDelete', callback);
    self.on('onCateLoad', callback);
    self.on('renderCategory', this.doRender);
    self.on('onCategoryItemClick', function (id) {
        Category.selected = id;
        self.find(id, function (err, rows) {
            if (rows) {
                if (rows[0]['title'] == '最新') {
                    di.get('service.note').search({delete_at: 0});

                } else {
                    di.get('service.note').search({category_id: id, delete_at: 0});
                }
            }

        })
    });

}
Category.list = []
Category.prototype.doRender = function (docs) {
    logger.info('Category', 'doRender')
    this.vue.items = docs;
}
Category.prototype.refreshList = function () {
    var self = this;

    this.storage.category.find({}).sort({sort: -1}).exec(function (err, docs) {
        //this.list = docs;
        self.emit('renderCategory', docs)
    });
}


//new Category();

exports.Category = Category;