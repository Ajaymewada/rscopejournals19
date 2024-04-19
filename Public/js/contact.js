document.title = "Editorialoffice";
const sideListCls = new GenerateSideNav();
const sideList = sideListCls.create("mainMenu", "Editorialoffice");
const mobilesideList = sideListCls.createMobileNav();
$(".MobileSideNavBarContainer").html(mobilesideList);
$("#sidebarnav").html(sideList);

// Usage
let sourceID1 = "contactusID";
let labelText1 = "Editorial Office Details" + `<span class="text-danger">*<span>`;
let sourceID2 = "descriptionID";
let labelText2 = "Meta Description" + `<span class="text-danger">*<span>`;

var contactus;
var description;

function ckEditorInitiator() {
  contactus = new GenerateCkEditor();
  description = new GenerateCkEditor();

  const textareaElement1 = contactus.create(sourceID1, labelText1);
  const textareaElement2 = description.create(sourceID2, labelText2);

  $("#contactusArea").html(textareaElement1);
  $("#descriptionArea").html(textareaElement2);

  contactus.initEditor(sourceID1);
  description.initEditor(sourceID2);
}

$(async () => {
  $("#TagsID").tagEditor({
    delimiter: "",
    forceLowercase: false,
    initialTags: [],
  });
  await ckEditorInitiator();
  getAllJournals();
});

$("#journalSelect").on("change", () => {
  let journalid = document.getElementById("journalSelect").value;
  if (journalid) {
    const url = `/getEditorialOfficeByJournalId/${journalid}`;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then(async (data) => {
        if (data && data.status) {
          const { contactDetails, keywords, metatitle } = data.data[0];
          if (metatitle) {
            $("#metaTitleID").val(metatitle);
          }
          contactus.setValue(sourceID1, contactDetails || "");
          description.setValue(sourceID2, data.data[0].description || "");
          if (keywords && Array.isArray(keywords) && keywords.length) {
            $("#TagsID").tagEditor("destroy");
            $("#TagsID").tagEditor({
              delimiter: "",
              forceLowercase: false,
              initialTags: keywords,
            });
          }
        } else {
          contactus.setValue(sourceID1, "");
          description.setValue(sourceID2, "");
          $("#TagsID").tagEditor("destroy");
          $("#TagsID").val("");
          $("#TagsID").tagEditor({
            delimiter: "",
            forceLowercase: false,
          });
          $("#metaTitleID").val("");
        }
        console.log(data);
      });
  }
});

function saveData() {
  let name = contactus.getData(sourceID1);

  let description1 = description.getData(sourceID2);
  let keywords = $("#TagsID").tagEditor("getTags")[0].tags;
  let metatitle = $("#metaTitleID").val();
  let journalid = document.getElementById("journalSelect").value;
  if (name == null || name == "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter For Editorialoffice Details");
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
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter Keywords");
    return;
  } else if (journalid === null || journalid === "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Select a Journal");
    return;
  } else {
    $(".validationalert").addClass("d-none");
    const data = {
      name: name,
      description: description1,
      keywords: keywords,
      metatitle,
      journalid: journalid,
    };
    fetch("/addContactInformation", {
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
          throw new Error("Failed to add for Editorial Office Details!");
        }
      })
      .then((data) => {
        // Handle the response data here (e.g., show a success message)
        $(".validationalert").removeClass("d-none alert-danger");
        $(".validationalert").text("Editorial Office Details added successfully!");
        $(".validationalert").addClass("alert-success");
        setTimeout(() => {
          $(".validationalert").removeClass("alert-success");
          $(".validationalert").addClass("d-none alert-danger");
        }, 3000);
        contactus.setValue(sourceID1, "");
        description.setValue(sourceID2, "");
        $("#TagsID").tagEditor("destroy");
        $("#TagsID").val("");
        $("#TagsID").tagEditor({
          delimiter: "",
          forceLowercase: false,
        });
        $("#journalSelect").val("");
        $("#metaTitleID").val("");
        console.log("Editorial Office Details added successfully", data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Error adding For Editorial Office Details:", error);
      });
  }
}
