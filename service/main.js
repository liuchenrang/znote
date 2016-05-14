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
//    var Vue = require('vue');

function Main() {
    this.note = new models.Note();
    this.note.category_id = category.getSelected();

    this.editor = new service.Editor(this.note);

    this.createNewNote = function(){
        this.node = new models.Note();
    }
    this.loadEditor = function(){
        $()
    }
    this.run = function () {
        console.log("run")
        $(function () {
            testEditor = editormd("edmd", {
                height: 400,
//        toc: true,
//        emoji: true,
//        taskList: true,
//        codeFold: true,
//        watch: false,
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
                            note.add({
                                title: $('#note-title').val(),
                                source: testEditor.getMarkdown(),
                                content: testEditor.getHTML(),
                                type: 1,
                                category_id: category.getSelected(),
                            })
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