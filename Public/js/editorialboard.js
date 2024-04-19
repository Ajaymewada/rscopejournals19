document.title = "Editorial Board";
const sideListCls = new GenerateSideNav();
const sideList = sideListCls.create("mainMenu", "Editorial &nbsp; Board");
const mobilesideList = sideListCls.createMobileNav();
$(".MobileSideNavBarContainer").html(mobilesideList);
$("#sidebarnav").html(sideList);

// var editor = CKEDITOR.replace('authorBioID', {
//     // height: 350
// });

let sourceID1 = "authorBioID";
let labelText1 = "Add Bio" + `<span class="text-danger">*<span>`;
// let sourceID2 = "descriptionID"
// let labelText2 = "Add Description" + `<span class="text-danger">*<span>`

const addbio = new GenerateCkEditor();
// const description = new GenerateCkEditor();

const textareaElement1 = addbio.create(sourceID1, labelText1);
// const textareaElement2 = description.create(sourceID2, labelText2);

$("#authorbiocontainer").html(textareaElement1);
addbio.initEditor(sourceID1);
// $("#descriptionArea").html(textareaElement2);
// $('#DesignationID').tagEditor({
//     delimiter: '', /* space and comma */
//     forceLowercase: false,
// });
$("#intrestID").tagEditor({
  delimiter: "" /* space and comma */,
  forceLowercase: false,
});

$(() => {
  // getData();
  getAllJournals();
});
function getData() {
  const url = "/getEditorialBoard";
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data !== null && data.status === true && data.data !== null) {
        // const { name, affiliation, biography, description, keywords } = data.data
        // addbio.setValue(sourceID1, bio || "");
        // document.getElementById('authorName').value = author;
        // document.getElementById('afflication').value = afflication;
        // description.setValue(sourceID2, data.data.description || "");
        // if (keywords && Array.isArray(keywords) && keywords.length) {
        //     $('#TagsID').tagEditor('destroy');
        //     $('#TagsID').tagEditor({
        //         delimiter: '', /* space and comma */
        //         forceLowercase: false,
        //         initialTags: keywords
        //     });
        // }
      }
    });
}

function saveData() {
  const imageInput = document.getElementById("authorImage");
  let author = document.getElementById("authorName").value;
  let afflication = document.getElementById("afflication").value;
  let bio = addbio.getData(sourceID1);
  let designationsList = $("#DesignationID").val();
  let website = document.getElementById("websiteInput").value;
  let journalid = document.getElementById("journalSelect").value;
  let intrestList = $("#intrestID").tagEditor("getTags")[0].tags;

  if (author === null || author === "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter Author Name");
    return;
  } else if (afflication === null || afflication === "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter Afflication");
    return;
  } else if (designationsList === null || designationsList === "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter Designation");
    return;
  } else if (intrestList === null || intrestList.length === 0) {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter your intrests");
    return;
  } else if (bio === null || bio === "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter Bio");
    return;
  } else if (website === null || website === "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter website");
    return;
  } else if (journalid === null || journalid === "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Select a Journal");
    return;
  } else {
    $(".validationalert").addClass("d-none");
    console.log(
      author,
      afflication,
      designationsList,
      intrestList,
      bio,
      journalid
    );
    const formData = new FormData();
    if (imageInput.files.length > 0) {
      const imageFile = imageInput.files[0];
      formData.append("files", imageFile);
    }
    formData.append("name", author);
    formData.append("affiliation", afflication);
    formData.append("biography", bio);
    formData.append("description", "A description...");
    formData.append("designation", designationsList);
    formData.append("website", website);
    formData.append("journalid", journalid);
    formData.append("keywords", JSON.stringify(["keyword1", "keyword2"]));
    formData.append("intrest", JSON.stringify(intrestList));

    fetch("/editorialboard", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((responseData) => {
        console.log("responseData : ", responseData);
        $(".validationalert").removeClass("d-none alert-danger");
        $(".validationalert").text("Editorial Board Added Successfully!");
        $(".validationalert").addClass("alert-success");
        setTimeout(() => {
          $(".validationalert").removeClass("alert-success");
          $(".validationalert").addClass("d-none alert-danger");
        }, 3000);
        document.getElementById("authorImage").value = "";
        document.getElementById("authorName").value = "";
        document.getElementById("afflication").value = "";
        addbio.setValue(sourceID1, "");
        $("#DesignationID").val("");
        document.getElementById("websiteInput").value = "";
        document.getElementById("journalSelect").value = "";
        $("#intrestID").tagEditor("destroy");
        $("#intrestID").val("");
        $("#intrestID").tagEditor({
          delimiter: "",
          forceLowercase: false,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
