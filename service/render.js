/**
 * Created by XingHuo on 16/4/27.
 */
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var Twig = require('twig'), // Twig module
    twig = Twig.twig;       // Render function
var event = new EventEmitter();



render = {}
render.view = function(file,data,callback){
    console.log('render view '+file);

    fs.readFile(file,function (err, source) {
        var template = twig({
            data:''+source
        });

        document.write( template.render(data));
        event.on('uiRenderEnd', callback);
        event.emit('uiRenderEnd');
        console.log('render uiRenderEnd emit '+source);

    });
}

module.exports =  render;