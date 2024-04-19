document.title = "Processing Charge";
const sideListCls = new GenerateSideNav();
const sideList = sideListCls.create("usefullLinks", "Processing &nbsp; Fee");
const mobilesideList = sideListCls.createMobileNav();
$(".MobileSideNavBarContainer").html(mobilesideList);
$("#sidebarnav").html(sideList);

// Usagee
let sourceID1 = "ProcessingID"
let labelText1 = "Add Processing Fee" + `<span class="text-danger">*<span>`
let sourceID2 = "descriptionID"
let labelText2 = "Meta Description" + `<span class="text-danger">*<span>`

var charge;
var description;
function ckEditorInitiator() {
    charge = new GenerateCkEditor();
    description = new GenerateCkEditor();

    const textareaElement1 = charge.create(sourceID1, labelText1);
    const textareaElement2 = description.create(sourceID2, labelText2);

    $("#processingCharge").html(textareaElement1);
    $("#descriptionArea").html(textareaElement2);

    $('#TagsID').tagEditor({
        delimiter: '', /* space and comma */
        forceLowercase: false,
    });
    // Initialize CKEditor on the created textarea
    charge.initEditor(sourceID1);
    description.initEditor(sourceID2);
}


// Get data from CKEditor instance
// const editorData = charge.getData('editorTextArea');
// console.log(editorData);

// Set content in CKEditor instance
// charge.setValue('editorTextArea', '<p>This is new content.</p>');

// Destroy CKEditor instance
// charge.destroyEditor('editorTextArea');


$(() => {
    getData();
})
function getData() {
    const url = '/getProcessingCharge';
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
            if (data != null && data.status == true && data.data != null) {
                await ckEditorInitiator();
                const { processingcharge, keywords,metatitle } = data.data
                if(metatitle) {
                    $("#metaTitleID").val(metatitle);
                }
                charge.setValue(sourceID1, processingcharge || "");
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
    // Data to be sent in the POST request
    let charge1 = charge.getData(sourceID1);
    let description1 = description.getData(sourceID2);
    let keywords = $('#TagsID').tagEditor('getTags')[0].tags;
    let metatitle = $("#metaTitleID").val();
    if (charge1 == null || charge1 == "") {
        console.log("Enter Processing Charge");
        $(".validationalert").removeClass('d-none')
        $(".validationalert").text("Enter Processing Charge");
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
    
    } 
    else if(metatitle == null || metatitle == ""){
        $(".validationalert").removeClass('d-none')
        $(".validationalert").text("Enter Keywords");
        return;
    
    
    } else {
        $(".validationalert").addClass('d-none')
        console.log(charge1, description1, keywords)
        const data = {
            processingcharge: charge1,
            description: description1,
            keywords: keywords,
            metatitle
        };
        const url = '/processingcharge'
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            body: JSON.stringify(data), // Convert data to JSON format
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the response body as JSON
            })
            .then((responseData) => {
                // Handle the response data
                $(".validationalert").removeClass('d-none alert-danger')
                $(".validationalert").text("Charge added successfully!");
                $(".validationalert").addClass('alert-success');
                setTimeout(() => {
                    $(".validationalert").removeClass('alert-success');
                    $(".validationalert").addClass('d-none alert-danger');
                }, 3000);
                console.log('Response Data:', responseData);
            })
            .catch((error) => {
                // Handle any errors that occurred during the fetch
                console.error('Fetch Error:', error);
            });
    }
}



// jhzsncskjfscsxckjbcjxbc
