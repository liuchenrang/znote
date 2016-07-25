/**
 * Created by XingHuo on 16/5/14.
 */
function DI(){
    var self = this;
    this.di = {};
    this.set = function(key,obj){
        self.di[key] = obj;
    }
    this.get = function(key){
        return self.di[key];
    }
}
window.di = new DI();
const bootstrap = require("bootstrap");
const models = require("../models");
const service = require("../service");
const serviceNote = new service.Note();
const serviceCategory = new service.Category();
const Logger = require('../utils/logger').Logger;
const logger = new Logger();

di.set('service.note',serviceNote)
di.set('service.category',serviceCategory)

function Main() {
    this.testEditor = {};
    this.note = new models.Note();
    this.serviceNote = di.get('service.note');
    this.serviceCategory = di.get('service.category');
    this.note_create_markdown_id = '#note-create-markdown';
    this.note_search_input_id = '#note-search-input';
    this.editor = new service.Editor(this.note);

    this.createNewNote = function () {
        this.note = new models.Note();
        console.log(note);
        this.reloadNode(this.note);
    }
    this.createCate = function(){

    }
    this.searchNode = function () {
        var self = this;
        $(this.note_search_input_id).keyup(function(){
            var keyword = $(self.note_search_input_id).val();
            logger.info("main",'keyword:' + keyword);
            logger.info("main",{title:new RegExp(keyword)});
            var search = {delete_at:0}
            if (keyword) {
                search.title  = new RegExp(keyword);
            }

            di.get('service.note').search(search,function(err,docs){
            })
        })
    }
    this.reloadNode = function (note) {
        this.note = note;
        logger.info('main','reloadNode'+JSON.stringify(note))

        this.editor.initView(note);


        if (note.source == '' && mainWindow.testEditor.state.preview) {
            this.testEditor.previewing();
            this.testEditor.setMarkdown(note.source);
        }else{
            this.testEditor.setMarkdown(note.source);
            if (!mainWindow.testEditor.state.preview) {
                this.testEditor.previewing();
            }
        }

    }
    this.run = function () {
        console.log($)


        var self = this;
        $('.new-cate-input').keydown(function(event){
            if ( event.which == 13 ) {
                alert(1);

                event.preventDefault();
            }
        })
        $('#cate-btn-add').click(function(){
            if ($('.new-cate-input').hasClass('hide')) {
                $('.new-cate-input').removeClass('hide').addClass('show');
            }else{
                $('.new-cate-input').removeClass('show').addClass('hide');

            }
        })

        $(this.note_create_markdown_id).click(function(){
            self.createNewNote();
        })
        //this.searchNode();
        $(function () {

            self.testEditor = editormd("edmd", {
//        toc: true,
//        emoji: true,
//        taskList: true,
//        codeFold: true,
                watch: false,
//        flowChart: true,
//        sequenceDiagram: true,
                saveHTMLToTextarea: true,
                toolbarIcons: function () {
////              return editormd.toolbarModes['mini']; // full, simple, mini
//            // Using "||" set icons align right.
                    return ["undo", "redo", "|", "bold", "hr", "||", "watch", "fullscreen", "preview", "testIcon"]
                },
                path: "../bower_components/editor.md/lib/",
//        onfullscreen: function () {
//            this.editor.css("border-radius", 0).css("z-index", 120);
//        },
//        onfullscreenExit: function () {
//            this.editor.css({
//                zIndex: 10,
//                border: "none",
//                "border-radius": "5px"
//            });
//            this.resize();
//        }
                onload: function () {
                    var keyMap = {
                        "Ctrl-S": function (cm) {
                            console.log(self.serviceCategory.getSelected());
                            if ($('#note-title').val() == '') {
                                alert("请填写标题!")
                                return false;
                            }
                            self.note.title = $('#note-title').val();
                            self.note.source = self.testEditor.getMarkdown();
                            self.note.content = self.testEditor.getHTML();
                            var category_id = self.serviceCategory.getSelected();
                            if (category_id) {
                                self.note.category_id = self.serviceCategory.getSelected();
                            }
                            self.note.type = 1;
                            self.note.tag = [];
                            console.log(self.note);
                            console.log(self.note._id);
                            if (self.note._id) {
                                logger.info('main','update id: ' + self.note._id)
                                di.get('service.note').update(self.note._id, self.note, function (err, rows) {
                                    console.log(err, rows);
                                })
                            } else {
                                logger.info('main','add  ' + self.note.title)

                                di.get('service.note').add(self.note, function (err, rows) {
                                    console.log(err, rows);
                                    if (!err) {
                                        self.note = rows;
                                    }else{
                                        logger.info('ctrl s save err');
                                    }
                                })
                            }

                        },
                        "Ctrl-A": function (cm) { // default Ctrl-A selectAll
                            cm.execCommand("selectAll");
                        }
                    };

                    this.addKeyMap(keyMap);
                }
            });

        })
    }

}

exports.Main = Main;