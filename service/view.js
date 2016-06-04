/**
 * Created by XingHuo on 16/6/4.
 */
const Vue = require('vue');

View = function(){
    this.vue = new Vue({
        el: '#app',
        data: {
            cate_items: [
            ],
            note_itmes: [
            ]
        }
    })
}
module.exports = View;