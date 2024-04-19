class GenerateCkEditor {
    constructor() {
        // Constructor, if needed
    }

    create(id, labelText) {
        // const textarea = document.createElement('textarea');
        // textarea.id = id;
        // return textarea;
        const label = document.createElement('label');
        label.innerHTML = labelText;

        const textarea = document.createElement('textarea');
        textarea.id = id;

        const container = document.createElement('div');
        container.appendChild(label);
        container.appendChild(textarea);
        return container;
    }

    initEditor(id) {
        CKEDITOR.replace(id,{
            // height: 350
        });
    }

    getData(id) {
        return CKEDITOR.instances[id].getData();
    }

    setValue(id, content) {
        if (CKEDITOR.instances[id]) {
            CKEDITOR.instances[id].setData(content);
        }
    }

    destroyEditor(id) {
        if (CKEDITOR.instances[id]) {
            CKEDITOR.instances[id].destroy();
        }
    }
}