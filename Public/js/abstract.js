// $(() => {
    
    
// })
var editor = CKEDITOR.replace('abstractEditor',{
    height: 350
});

function saveData() {
    console.log(editor.getData());
    $("#EditorData").html(editor.getData());
}