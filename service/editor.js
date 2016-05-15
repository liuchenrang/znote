/**
 * Created by XingHuo on 16/5/14.
 */

const vue = require('vue');
const events = require('events');
const $ = require('jquery');
const util = require('util');
const eventEmitter = new events.EventEmitter();

function Editor(modelNote){

    this.initOnEvent();
    this.note_title_id =  '#note-title';
    this.note_source_id =  '#note-source';
    this.initView(modelNote)

}
util.inherits(Editor, events.EventEmitter);

Editor.prototype.initOnEvent = function(){
    console.log("initOnEvent editor");

    eventEmitter.on('noteClick',function(id){
        console.log(id)
    })
}
Editor.prototype.initView = function(note){
    this.modleNote = note;
    this.setTitle()
    this.setSource()
}
Editor.prototype.getTitle = function(){

}
Editor.prototype.getContent = function(){

}
Editor.prototype.getSource = function(){

}

Editor.prototype.setTitle = function(){
    $(this.note_title_id).val(    this.modleNote.title  );
}

Editor.prototype.setSource = function(){
    console.log('source:' + this.modleNote.source)
    $(this.note_source_id).val( this.modleNote.source );
}

exports.Editor = Editor;