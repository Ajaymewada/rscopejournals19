document.title = "Aims And Scope";
const sideListCls = new GenerateSideNav();
const sideList = sideListCls.create("mainMenu", "Aims and Scope");
const mobilesideList = sideListCls.createMobileNav();
$(".MobileSideNavBarContainer").html(mobilesideList);
$("#sidebarnav").html(sideList);

// Usage
let sourceID1 = "aimsAndScopeID";
let labelText1 = "Aim's & Scope" + `<span class="text-danger">*<span>`;
let sourceID2 = "descriptionID";
let labelText2 = "Meta Description" + `<span class="text-danger">*<span>`;

var aimscope;
var description;
function ckEditorInitiator() {
  aimscope = new GenerateCkEditor();
  description = new GenerateCkEditor();

  const textareaElement1 = aimscope.create(sourceID1, labelText1);
  const textareaElement2 = description.create(sourceID2, labelText2);

  $("#aimsscopeArea").html(textareaElement1);
  $("#descriptionArea").html(textareaElement2);

  // Initialize CKEditor on the created textarea
  aimscope.initEditor(sourceID1);
  description.initEditor(sourceID2);
}

$("#journalSelect").on("change", () => {
  let journalid = document.getElementById("journalSelect").value;
  if (journalid) {
    const url = `/getaimsscopebyjournalid/${journalid}`;
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
          const { aimsandscope, keywords, metatitle } = data.data[0];
          if (metatitle) {
            $("#metaTitleID").val(metatitle);
          }

          aimscope.setValue(sourceID1, aimsandscope || "");
          description.setValue(sourceID2, data.data[0].description || "");
          if (keywords && Array.isArray(keywords) && keywords.length) {
            $("#TagsID").tagEditor("destroy");
            $("#TagsID").tagEditor({
              delimiter: "" /* space and comma */,
              forceLowercase: false,
              initialTags: keywords,
            });
          }
        } else {
          aimscope.setValue(sourceID1, "");
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

$("#TagsID").tagEditor({
  delimiter: "" /* space and comma */,
  forceLowercase: false,
});

$(async () => {
  // getData();
  await ckEditorInitiator();
  getAllJournals();
});

function getData() {
  const url = "/getaims-and-scope";
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(url, requestOptions)
    .then((response) => response.json())
    .then(async (data) => {
      console.log(data);
      if (data && data.status == true) {
        await ckEditorInitiator();
        const { aimsandscope, keywords, metatitle } = data.data;
        if (metatitle) {
          $("#metaTitleID").val(metatitle);
        }

        aimscope.setValue(sourceID1, aimsandscope || "");
        description.setValue(sourceID2, data.data.description || "");
        $("#journalSelect").val("");
        if (keywords && Array.isArray(keywords) && keywords.length) {
          $("#TagsID").tagEditor("destroy");
          $("#TagsID").tagEditor({
            delimiter: "" /* space and comma */,
            forceLowercase: false,
            initialTags: keywords,
          });
        }
      } else {
        await ckEditorInitiator();
      }
    });
}

function saveData() {
  // Create an object with the data you want to send in the request body
  let aimscope1 = aimscope.getData(sourceID1);
  let description1 = description.getData(sourceID2);
  let keywords = $("#TagsID").tagEditor("getTags")[0].tags;
  let journalid = document.getElementById("journalSelect").value;
  // let metatitle = $("#metaTitleID").val();
  //  let keywords = $("#TagsID").val();
  let metatitle = $("#metaTitleID").val();
  if (aimscope1 == null || aimscope1 == "") {
    console.log("Enter aimscope");
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter Aim's And Scope");
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
    console.log(aimscope1, description1, keywords);
    const data = {
      aimsandscope: aimscope1,
      description: description1,
      keywords: keywords,
      metatitle,
      journalid: journalid,
    };
    fetch("/aimsandscope", {
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
          throw new Error("Failed to add aims and scope");
        }
      })
      .then((data) => {
        // Handle the response data here (e.g., show a success message)
        $(".validationalert").removeClass("d-none alert-danger");
        $(".validationalert").text("Aims And Scope added successfully!");
        $(".validationalert").addClass("alert-success");
        aimscope.setValue(sourceID1, "");
        description.setValue(sourceID2, "");
        $("#TagsID").tagEditor("destroy");
        $("#TagsID").val("");
        $("#TagsID").tagEditor({
          delimiter: "",
          forceLowercase: false,
        });
        $("#journalSelect").val("");
        $("#metaTitleID").val("");
        setTimeout(() => {
          $(".validationalert").removeClass("alert-success");
          $(".validationalert").addClass("d-none alert-danger");
        }, 3000);
        console.log("Aims and scope added successfully", data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Error adding aims and scope:", error);
      });
  }
}
