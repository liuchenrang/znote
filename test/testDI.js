/**
 * Created by XingHuo on 16/6/4.
 */
function DI(){
    var self = this;
    this.di = {'cc':'00'};
    this.set = function(key,obj){
        self.di[key] = obj;
    }
    this.get = function(key){
        return self.di[key];
    }
}
const di = new DI();

di.set('service.note',{h:'o'})
di.set('service.category',{c:'o'})
console.log(di.get('service.category'))
