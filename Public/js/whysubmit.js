document.title = "Why Submit";
const sideListCls = new GenerateSideNav();
const sideList = sideListCls.create("usefullLinks", "Why Submit");
const mobilesideList = sideListCls.createMobileNav();
$(".MobileSideNavBarContainer").html(mobilesideList);
$("#sidebarnav").html(sideList);


// Usage
let sourceID1 = "whySubmitID"
let labelText1 = "Submit" + `<span class="text-danger">*<span>`
let sourceID2 = "descriptionID"
let labelText2 = "Meta Description" + `<span class="text-danger">*<span>`
var whysubmittexteditor;
var description;

function ckEditorInitiator() {
    whysubmittexteditor = new GenerateCkEditor();
    description = new GenerateCkEditor();

    const textareaElement1 = whysubmittexteditor.create(sourceID1, labelText1);
    const textareaElement2 = description.create(sourceID2, labelText2);

    $("#whysubmitArea").html(textareaElement1);
    $("#descriptionArea").html(textareaElement2);

    // Initialize CKEditor on the created textarea
    whysubmittexteditor.initEditor(sourceID1);
    description.initEditor(sourceID2);
}

$('#TagsID').tagEditor({
    delimiter: '', /* space and comma */
    forceLowercase: false,
});

$(() => {
    // setTimeout(() => {
    //     ckEditorInitiator();
    // }, 1000);
    getData();
})
function getData() {
    const url = '/getWhySubmit';
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(async data => {
            console.log(data)
            if (data && data.data !== null) {
                await ckEditorInitiator();
                const { whysubmit, keywords, metatitle} = data.data;
                if(metatitle) {
                    $("#metaTitleID").val(metatitle);
                }
                // document.title = title || "For Editors";
                whysubmittexteditor.setValue(sourceID1, whysubmit || "");
                description.setValue(sourceID2, data.data.description || "");
                if (keywords && Array.isArray(keywords) && keywords.length) {
                    $('#TagsID').tagEditor('destroy');
                    $('#TagsID').tagEditor({
                        delimiter: '', /* space and comma */
                        forceLowercase: false,
                        initialTags: keywords
                    });
                }
            } else {
                await ckEditorInitiator();
            }
        })
}

function saveData() {
    // Create an object with the data you want to send in the request body
    let whysubmit1 = whysubmittexteditor.getData(sourceID1);
    let description1 = description.getData(sourceID2);
    let keywords = $('#TagsID').tagEditor('getTags')[0].tags;
    let metatitle = $("#metaTitleID").val();
    if (whysubmit1 == null || whysubmit1 == "") {
        $(".validationalert").removeClass('d-none')
        $(".validationalert").text("Enter For Editors");
        return;
    } else if (description1 == null || description1 == "") {
        console.log("Enter description");
        $(".validationalert").removeClass('d-none')
        $(".validationalert").text("Enter Description");
        return;
    } else if (keywords == null || keywords.length == 0) {
        console.log("Enter Keywords");
        $(".validationalert").removeClass('d-none')
        $(".validationalert").text("Enter Keywords");
        return;
    } else if (metatitle == null || metatitle == ""){
        $(".validationalert").removeClass('d-none')
        $(".validationalert").text("Enter Keywords");
        return;
    } else {
        $(".validationalert").addClass('d-none');
        // console.log(name, description1, keywords)
        const data = {
            whysubmit: whysubmit1,
            description: description1,
            keywords: keywords,
            metatitle
        };
        fetch('/savewhysubmit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to add for whysubmittexteditor!');
                }
            })
            .then(data => {
                // Handle the response data here (e.g., show a success message)
                $(".validationalert").removeClass('d-none alert-danger')
                $(".validationalert").text("For WhySubmit added successfully!");
                $(".validationalert").addClass('alert-success');
                setTimeout(() => {
                    $(".validationalert").removeClass('alert-success');
                    $(".validationalert").addClass('d-none alert-danger');
                }, 3000);
                console.log('For Why Submit added successfully', data);
            })
            .catch(error => {
                // Handle any errors that occurred during the fetch
                console.error('Error adding For whysubmittexteditor:', error);
            });
    }
}