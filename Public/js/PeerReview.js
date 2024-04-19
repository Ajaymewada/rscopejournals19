document.title = "Peer Review";
const sideListCls = new GenerateSideNav();
const sideList = sideListCls.create("usefullLinks", "Peer Review");
const mobilesideList = sideListCls.createMobileNav();
$(".MobileSideNavBarContainer").html(mobilesideList);
$("#sidebarnav").html(sideList);

// Usagee
let sourceID1 = "PeerReviewID"
let labelText1 = "Add Peer Review" + `<span class="text-danger">*<span>`
let sourceID2 = "descriptionID"
let labelText2 = "Meta Description" + `<span class="text-danger">*<span>`

var PeerReview;
var description;
function ckEditorInitiator() {
    PeerReview = new GenerateCkEditor();
    description = new GenerateCkEditor();

    const textareaElement1 = PeerReview.create(sourceID1, labelText1);
    const textareaElement2 = description.create(sourceID2, labelText2);

    $("#PeerReviewTextEditor").html(textareaElement1);
    $("#descriptionArea").html(textareaElement2);

    $('#TagsID').tagEditor({
        delimiter: '', /* space and comma */
        forceLowercase: false,
    });
    // Initialize CKEditor on the created textarea
    PeerReview.initEditor(sourceID1);
    description.initEditor(sourceID2);
}


$(() => {
    getData();
})

function getData() {
    const url = '/getpeerreview';
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
                const { peerreview, keywords,metatitle } = data.data
                if(metatitle) {
                    $("#metaTitleID").val(metatitle);
                }
                PeerReview.setValue(sourceID1, peerreview || "");
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
    let PeerReview1 = PeerReview.getData(sourceID1);
    let description1 = description.getData(sourceID2);
    let keywords = $('#TagsID').tagEditor('getTags')[0].tags;
    let metatitle = $("#metaTitleID").val();
    if (PeerReview1 == null || PeerReview1 == "") {
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
        console.log(PeerReview1, description1, keywords)
        const data = {
            peerreview: PeerReview1,
            description: description1,
            keywords: keywords,
            metatitle
        };
        const url = '/peerreview'
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((responseData) => {
                // Handle the response data
                $(".validationalert").removeClass('d-none alert-danger')
                $(".validationalert").text("Peer Review  added successfully!");
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

