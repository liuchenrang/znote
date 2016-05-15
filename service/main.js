/**
 * Created by XingHuo on 16/5/14.
 */

var bootstrap = require("bootstrap");
var service = require("../service");
var models = require("../models");
const category = new service.Category();
var note = new service.Note();
var testEditor;

//    var bootstrap = require("bootstrap");

function Main() {
    this.testEditor = {};
    this.note = new models.Note();
    this.note.category_id = category.getSelected();
    this.note_create_markdown_id = '#note-create-markdown';
    this.editor = new service.Editor(this.note);

    this.createNewNote = function () {
        this.note = new models.Note();
        console.log(note);
        this.reloadNode(this.note);
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
        $(function () {
            self.testEditor = editormd("edmd", {
                height: (550-65),
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
                            self.note.source = testEditor.getMarkdown();
                            self.note.content = testEditor.getHTML();
                            self.note.category_id = category.getSelected();
                            self.note.type = 1;
                            self.note.tag = [];
                            console.log(self.note);
                            console.log(self.note._id);
                            if (self.note._id) {
                                note.update(self.note._id, self.note, function (err, rows) {
                                    console.log(err, rows);
                                })
                            } else {
                                note.add(self.note, function (err, rows) {
                                    console.log(err, rows);
                                })
                            }

                        },
                        "Ctrl-A": function (cm) { // default Ctrl-A selectAll
                            // custom
                            alert("Ctrl+A");
                            cm.execCommand("selectAll");
                        }
                    };

                    // setting signle key
                    var keyMap2 = {
                        "Ctrl-T": function (cm) {
                            alert("Ctrl+T");
                        }
                    };

                    this.addKeyMap(keyMap);
                    this.addKeyMap(keyMap2);
                    this.removeKeyMap(keyMap2);  // remove signle key
                }
            });

        })
    }

}

exports.Main = Main;