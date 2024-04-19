document.title = "Submission CheckList";
const sideListCls = new GenerateSideNav();
const sideList = sideListCls.create("usefullLinks", "Submission CheckList");
const mobilesideList = sideListCls.createMobileNav();
$(".MobileSideNavBarContainer").html(mobilesideList);
$("#sidebarnav").html(sideList);

// Usage
let sourceID1 = "submissionID";
let labelText1 = "Submission checkList" + `<span class="text-danger">*<span>`;
let sourceID2 = "descriptionID";
let labelText2 = "Meta Description" + `<span class="text-danger">*<span>`;

var Submission;
var description;

function ckEditorInitiator() {
  Submission = new GenerateCkEditor();
  description = new GenerateCkEditor();

  const textareaElement1 = Submission.create(sourceID1, labelText1);
  const textareaElement2 = description.create(sourceID2, labelText2);

  $("#SubmissionArea").html(textareaElement1);
  $("#descriptionArea").html(textareaElement2);

  // Initialize CKEditor on the created textarea
  Submission.initEditor(sourceID1);
  description.initEditor(sourceID2);
}

$(() => {
  // ckEditorInitiator();
  $("#TagsID").tagEditor({
    delimiter: "" /* space and comma */,
    forceLowercase: false,
    initialTags: [],
  });
});


$(async () => {
  await getData();
})
function getData() {
  const url = 'getSubmissionCheckList';
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
      if (data && data.status == true) {
        await ckEditorInitiator();
        const { submissionDetails, keywords, metatitle } = data.data;
        if (metatitle) {
          $("#metaTitleID").val(metatitle);
        }
        if (submissionDetails) {
          Submission.setValue(sourceID1, submissionDetails || "");
        }
        if(data.data.description && description) {
          description.setValue(sourceID2, data.data.description || "");
        }
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
  let SubmissionDetails = Submission.getData(sourceID1);
  let description1 = description.getData(sourceID2);
  let keywords = $("#TagsID").tagEditor("getTags")[0].tags;
  let metatitle = $("#metaTitleID").val();
  if (SubmissionDetails == null || SubmissionDetails == "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter For submission Details");
    return;
  } else if (description1 == null || description1 == "") {
    console.log("Enter description");
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter Description");
    return;
  } else if (keywords == null || keywords.length == 0) {
    console.log("Enter Keywords");
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter Keywords");
    return;
  } else if (metatitle == null || metatitle == "") {
    $(".validationalert").removeClass('d-none')
    $(".validationalert").text("Enter Keywords");
    return;
  } else {
    $(".validationalert").addClass("d-none");
    // console.log(name, description1, keywords)
    const data = {
      submissionDetails: SubmissionDetails,
      description: description1,
      keywords: keywords,
      metatitle
    };
    fetch("/addsubmissionchecklist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to add for submission CheckList!");
        }
      })
      .then((data) => {
        // Handle the response data here (e.g., show a success message)
        $(".validationalert").removeClass("d-none alert-danger");
        $(".validationalert").text("submission CheckList Details added successfully!");
        $(".validationalert").addClass("alert-success");
        setTimeout(() => {
          $(".validationalert").removeClass("alert-success");
          $(".validationalert").addClass("d-none alert-danger");
        }, 3000);
        console.log("submission CheckList Details added successfully", data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Error adding For  submission CheckList Details:", error);
      });
  }
}
