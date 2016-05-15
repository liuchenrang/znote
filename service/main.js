/**
 * Created by XingHuo on 16/5/14.
 */

const bootstrap = require("bootstrap");
const service = require("../service");
const models = require("../models");
const category = new service.Category();
const note = new service.Note();
const Logger = require('../utils/logger').Logger;
const logger = new Logger();
var testEditor;

function Main() {
    this.testEditor = {};
    this.note = new models.Note();
    this.category = category;
    this.note.category_id = category.getSelected();
    this.note_create_markdown_id = '#note-create-markdown';
    this.note_search_input_id = '#note-search-input';
    this.editor = new service.Editor(this.note);

    this.createNewNote = function () {
        this.note = new models.Note();
        console.log(note);
        this.reloadNode(this.note);
    }
    this.searchNode = function () {
        var self = this;
        $(this.note_search_input_id).keyup(function(){
            var keyword = $(self.note_search_input_id).val();
            logger.info("main",'keyword:' + keyword);
            logger.info("main",{title:new RegExp(keyword)});
            var search = {}
            if (keyword) {
                search = {title:new RegExp(keyword)}
            }
            note.search(search,function(err,docs){
            })
        })
    }
    this.reloadNode = function (note) {
        this.note = note;
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
        console.log("run")
        var self = this;
        $(this.note_create_markdown_id).click(function(){
            self.createNewNote();
        })
        this.searchNode();
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
                            console.log(category.getSelected());
                            if ($('#note-title').val() == '') {
                                alert("请填写标题!")
                                return false;
                            }
                            self.note.title = $('#note-title').val();
                            self.note.source = self.testEditor.getMarkdown();
                            self.note.content = self.testEditor.getHTML();
                            var category_id = category.getSelected();
                            if (category_id) {
                                self.note.category_id = category.getSelected();
                            }
                            self.note.type = 1;
                            self.note.tag = [];
                            console.log(self.note);
                            console.log(self.note._id);
                            if (self.note._id) {
                                logger.info('main','update id: ' + self.note._id)
                                note.update(self.note._id, self.note, function (err, rows) {
                                    console.log(err, rows);
                                })
                            } else {
                                logger.info('main','add  ' + self.note.title)

                                note.add(self.note, function (err, rows) {
                                    console.log(err, rows);
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