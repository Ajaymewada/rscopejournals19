$(document).ready(async function () {
  console.log("ready!");
  // await getData();
  ckEditorEmbark();
});

// Usage
let sourceID1 = "aboutJournalID";
let labelText1 = "About Journal" + `<span class="text-danger">*<span>`;
let sourceID2 = "descriptionID";
let labelText2 = "Meta Description" + `<span class="text-danger">*<span>`;

var aboutjournal;
var description;

var textareaElement1;
function ckEditorEmbark() {
  aboutjournal = new GenerateCkEditor();
  description = new GenerateCkEditor();

  textareaElement1 = aboutjournal.create(sourceID1, labelText1);
  const textareaElement2 = description.create(sourceID2, labelText2);

  $("#aboutJournalContainer").html(textareaElement1);
  $("#descriptionArea").html(textareaElement2);

  aboutjournal.initEditor(sourceID1);
  description.initEditor(sourceID2);
}

const sideListCls = new GenerateSideNav();
const sideList = sideListCls.create("mainMenu", "Add Journal");
const mobilesideList = sideListCls.createMobileNav();
$(".MobileSideNavBarContainer").html(mobilesideList);
$("#sidebarnav").html(sideList);
// document.title = "Journal";

$("#TagsID").tagEditor({
  delimiter: "" /* space and comma */,
  forceLowercase: false,
});

function saveData() {
  let about = aboutjournal.getData(sourceID1);
  let name = document.getElementById("journalTitle").value;
  let ISSN = document.getElementById("issnNumber").value;
  let MainCategory = document.getElementById("MainCategoryID").value;
  let ImpactFactorValue = document.getElementById("ImpactFactorValueID").value;
  let NLMCode = document.getElementById("NLMCodeID").value;
  let JournalSlug = document.getElementById("JournalSlugID").value;
  let description1 = description.getData(sourceID2);
  let keywords = $("#TagsID").tagEditor("getTags")[0].tags;
  let metatitle = $("#metaTitleID").val();

  // const coverbanner = document.getElementById('CoverBannerFileID');

  if (name == null || name == "") {
    console.log("Enter Name!");
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter Journal Title!");
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
  } else if (ISSN == null || ISSN == "") {
    console.log("Enter ISSN!");
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter Journal ISSN!");
    return;
  } else if (about == null || about == "") {
    console.log("Enter about!");
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter About Journal!");
    return;
  } else if (MainCategory == null || MainCategory == "") {
    console.log("Enter MainCategory!");
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter Journal Main Category!");
    return;
  } else if (ImpactFactorValue == null || ImpactFactorValue == "") {
    console.log("Enter ImpactFactorValue!");
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter Journal Impact Factor Value!");
    return;
  } else if (NLMCode == null || NLMCode == "") {
    console.log("Enter NLMCode!");
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter Journal NLM Code!");
    return;
  } else if (JournalSlug == null || JournalSlug == "") {
    console.log("Enter JournalSlug!");
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter Journal Journal Slug!");
    return;
  } else {
    $(".validationalert").addClass("d-none");
    const url = "/journalmanagement/saveJournal";

    let data = {
      JournalName: name,
      ISSNNumber: ISSN,
      About: about,
      MainCategory: MainCategory,
      ImpactFactorValue: Number(ImpactFactorValue),
      NLMCode: NLMCode,
      JournalSlug: JournalSlug,
      isActive: true
    };
    
    data.metadata = {
      title: metatitle,
      keywords: keywords,
      description: description1
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    console.log(requestOptions);

    fetch(url, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to add journal");
        }
      })
      .then((data) => {
        $(".validationalert").removeClass("d-none alert-danger");
        $(".validationalert").text("Journal added successfully!");
        $(".validationalert").addClass("alert-success");
        document.getElementById("journalTitle").value = "";
        document.getElementById("issnNumber").value = "";
        aboutjournal.setValue(sourceID1, "");
        document.getElementById("MainCategoryID").value = "";
        document.getElementById("ImpactFactorValueID").value = "";
        document.getElementById("NLMCodeID").value = "";
        document.getElementById("JournalSlugID").value = "";
        // document.getElementById('CoverBannerFileID').value = "";
        // getData();
        setTimeout(() => {
          $(".validationalert").removeClass("alert-success");
          $(".validationalert").addClass("d-none alert-danger");
        }, 3000);
        console.log("Journal added successfully:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  // else if (coverbanner.files.length <= 0) {
  //     console.log("Choose Cover Banner!");
  //     $(".validationalert").removeClass('d-none')
  //     $(".validationalert").text("Choose Cover Banner!");
  //     return;
  // }
}

function getData() {
  const url = "/getjournal";

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
      await ckEditorEmbark();
      // if (data && data.status == true) {
      //     await ckEditorEmbark();
      //     // const { about, issn, name } = data.data
      //     // document.getElementById("journalTitle").value = name;
      //     // document.getElementById("issnNumber").value = issn;
      //     // aboutjournal.setValue(sourceID1, about);
      //     // $("#issnNumber").prop('disabled', true);
      // } else {
      //     await ckEditorEmbark();
      // }
    });
}

$("#journalTitle").on("change", async (event) => {
  if (event.target.value && event.target.value !== "") {
    const value = event.target.value.trim();
    const slug = await generateSlug(value);
    if (slug && slug !== "") {
      $("#JournalSlugID").val(slug);
    }
  } else {
    $("#JournalSlugID").val("");
  }
});

function generateSlug(input) {
  const slug = input.toLowerCase().replace(/\s+/g, "-");
  return slug;
}

// let sourceID2 = "descriptionID"
// let labelText2 = "Add Description" + `<span class="text-danger">*<span>`
// const description = new GenerateCkEditor();
// const textareaElement2 = description.create(sourceID2, labelText2);
// $("#descriptionArea").html(textareaElement2);
// Initialize CKEditor on the created textarea
// description.initEditor(sourceID2);
