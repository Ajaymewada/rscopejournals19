document.title = "Instructions For Authors";
const sideListCls = new GenerateSideNav();
const sideList = sideListCls.create("usefullLinks", "Instructions &nbsp; For &nbsp; Authors");
const mobilesideList = sideListCls.createMobileNav();
$(".MobileSideNavBarContainer").html(mobilesideList);
$("#sidebarnav").html(sideList);

// Usage
let sourceID1 = "instructionsID"
let labelText1 = "Instructions" + `<span class="text-danger">*<span>`
let sourceID2 = "descriptionID"
let labelText2 = "Meta Description" + `<span class="text-danger">*<span>`

var instruction;
var description;
function ckEditorInitiator() {
    instruction = new GenerateCkEditor();
    description = new GenerateCkEditor();

    const textareaElement1 = instruction.create(sourceID1, labelText1);
    const textareaElement2 = description.create(sourceID2, labelText2);

    $("#instructionArea").html(textareaElement1);
    $("#descriptionArea").html(textareaElement2);
    
    // Initialize CKEditor on the created textarea
    instruction.initEditor(sourceID1);
    description.initEditor(sourceID2);
}


$('#TagsID').tagEditor({
    delimiter: '', /* space and comma */
    forceLowercase: false,
});

$(() => {
    getData();
})
function getData() {
    const url = '/getInstructionsForAuthor';
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
                await ckEditorInitiator()
                const { instructions, keywords,metatitle } = data.data
                if(metatitle) {
                    $("#metaTitleID").val(metatitle);
                }
                instruction.setValue(sourceID1, instructions || "");
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
    // Define the data you want to send in the request body
    let instructions1 = instruction.getData(sourceID1);
    let description1 = description.getData(sourceID2);
    let keywords = $('#TagsID').tagEditor('getTags')[0].tags;
    let metatitle = $("#metaTitleID").val();
    if (instructions1 == null || instructions1 == "") {
        console.log("Enter instructions");
        $(".validationalert").removeClass('d-none')
        $(".validationalert").text("Enter Instructions");
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
    } else if(metatitle == null || metatitle == ""){
        $(".validationalert").removeClass('d-none')
        $(".validationalert").text("Enter Keywords");
        return;
    } else {
        $(".validationalert").addClass('d-none')
        // console.log(instructions1, description1, keywords)
        const data = {
            instructions: instructions1,
            description: description1,
            keywords: keywords,
            metatitle
        };
        fetch('/instructionsforauthor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            body: JSON.stringify(data), // Convert the data to JSON string
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((responseData) => {
                $(".validationalert").removeClass('d-none alert-danger')
                $(".validationalert").text("Instructions added successfully!");
                $(".validationalert").addClass('alert-success');
                setTimeout(() => {
                    $(".validationalert").removeClass('alert-success');
                    $(".validationalert").addClass('d-none alert-danger');
                }, 3000);
                // Handle the response data here
                console.log(responseData);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    // // Create a fetch request

}