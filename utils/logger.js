/**
 * Created by XingHuo on 16/5/15.
 */

function Logger(){
    this.info = function(category,msg){
        console.log(category,msg);
    }
}
exports.Logger = Logger;