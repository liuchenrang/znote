/**
 * Created by XingHuo on 16/5/14.
 */
function Note(){
    this.title = '';
    this.source = '';
    this.content = '';
    this.category_id = 0;
    this.tag_id = []
    this.create_at = +new Date();
    this.delete_at = 0;
    this.updated_at = +new Date();
}

exports.Note = Note;