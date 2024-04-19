document.title = "Add Article";
const sideListCls = new GenerateSideNav();
const sideList = sideListCls.create("articlelinks", "Add Article");
const mobilesideList = sideListCls.createMobileNav();
$(".MobileSideNavBarContainer").html(mobilesideList);
$("#sidebarnav").html(sideList);

$(() => {
  getAllJournals();
});

$("#authorNames").tagEditor({
  delimiter: "",
  forceLowercase: false,
});

$("#articleKeyWordsID").tagEditor({
  delimiter: "",
  forceLowercase: false,
});

let sourceID1 = "abstractionID";
let labelText1 = "Abstraction" + `<span class="text-danger">*<span>`;
let sourceID2 = "citationID";
let labelText2 = "Citation" + `<span class="text-danger">*<span>`;
let sourceID3 = "discriptionID";
let labelText3 = "Discription" + `<span class="text-danger">*<span>`;

const abstractionTextarea = new GenerateCkEditor();
const citationTextarea = new GenerateCkEditor();
const discriptionTextarea = new GenerateCkEditor();

const textareaElement1 = abstractionTextarea.create(sourceID1, labelText1);
const textareaElement2 = citationTextarea.create(sourceID2, labelText2);
const textareaElement3 = discriptionTextarea.create(sourceID3, labelText3);

$("#articleAbstractContainer").html(textareaElement1);
$("#articleCitationContainer").html(textareaElement2);
$("#articleDiscriptionContainer").html(textareaElement3);

abstractionTextarea.initEditor(sourceID1);
citationTextarea.initEditor(sourceID2);
discriptionTextarea.initEditor(sourceID3);

function saveData() {
  const fileInput = document.getElementById("articlePDFFile");
  const file = fileInput.files[0];
  let title = document.getElementById("articleTitle").value;
  let abstract = abstractionTextarea.getData(sourceID1);
  let citation = citationTextarea.getData(sourceID2);
  let discriptionText = discriptionTextarea.getData(sourceID3);
  let authorName = $("#authorNames").tagEditor("getTags")[0].tags;
  let articleKeyWords = $("#articleKeyWordsID").tagEditor("getTags")[0].tags;
  let publishedDate = $("#publishedDateID").val();
  let articleType = $("#articleTypeID").val();
  let articleDIO = $("#articledioID").val();
  let journalid = document.getElementById("journalSelect").value;
  if (title == null || title == "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").html("Enter Title!");
    return;
  } else if (journalid === null || journalid === "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Select a Journal");
    return;
  } else if (abstract == null || abstract == "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").html("Enter Abstract!");
    return;
  } else if (citation == null || citation == "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").html("Enter Citation!");
    return;
  } else if (articleDIO == null || articleDIO == "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").html("Enter DIO!");
    return;
  } else if (articleType == null || articleType == "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").html("Select Article Type!");
    return;
  } else if (publishedDate == null || publishedDate == "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").html("Select Publish Date!");
    return;
  } else if (discriptionText == null || discriptionText == "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").html("Enter Discription!");
    return;
  } else if (authorName == null || authorName.length == 0) {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").html("Enter Author Names!");
    return;
  } else if (articleKeyWords == null || articleKeyWords.length == 0) {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").html("Enter Keywords!");
    return;
  } else if (file == null) {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").html("Select File!");
    return;
  } else {
    $(".saveinprogress").removeClass("d-none");
    const formData = new FormData();

    formData.append("files", file);
    formData.append("title", title);
    formData.append("journalid", journalid);
    formData.append("authorNames", JSON.stringify(authorName));
    formData.append("articlekeywords", JSON.stringify(articleKeyWords));
    formData.append("abstract", abstract);
    formData.append("citation", citation);
    formData.append("discription", discriptionText);
    formData.append("publisheddate", publishedDate);
    formData.append("articletype", articleType);
    formData.append("dio", articleDIO);
    formData.append("pdffilepath", "sample.pdf");
    fetch("/addsaveArticle", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.status === false) {
          $(".validationalert").removeClass("d-none");
          $(".validationalert").text(
            data.msg ||
              "In-press articles are reached to 5, move the article to issue!"
          );
          $(".saveinprogress").addClass("d-none");
          return;
        }
        $(".validationalert").removeClass("d-none alert-danger");
        $(".validationalert").text("Article added successfully!");
        $(".validationalert").addClass("alert-success");
        setTimeout(() => {
          $(".validationalert").removeClass("alert-success");
          $(".validationalert").addClass("d-none alert-danger");
        }, 3000);
        $(".saveinprogress").addClass("d-none");
        clearForm();
        console.log("Article saved:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function clearForm() {
  document.getElementById("articlePDFFile").value = "";
  document.getElementById("articleTitle").value = "";
  abstractionTextarea.setValue(sourceID1, "");
  citationTextarea.setValue(sourceID2, "");
  discriptionTextarea.setValue(sourceID3, "");
  $("#authorNames").val("");
  $("#authorNames").tagEditor("destroy");
  $("#authorNames").tagEditor({
    delimiter: "",
    initialTags: [],
  });
  $("#articleKeyWordsID").val("");
  $("#articleKeyWordsID").tagEditor("destroy");
  $("#articleKeyWordsID").tagEditor({
    delimiter: "",
    initialTags: [],
  });
  $("#publishedDateID").val("");
  $("#articleTypeID").val("Open this select menu");
}
