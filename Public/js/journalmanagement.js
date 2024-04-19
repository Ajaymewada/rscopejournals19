const sideListCls = new GenerateSideNav();
const sideList = sideListCls.create("mainMenu", "Journal Management");
const mobilesideList = sideListCls.createMobileNav();
$(".MobileSideNavBarContainer").html(mobilesideList);
$("#sidebarnav").html(sideList);

$(() => {
  getAllJournals();
  ckEditorEmbark();
});

var JournalsList;

function getAllJournals() {
  $("#search").val("");
  const url =
    "/journalmanagement/App/controllers/Journal/getAllJournalsWithOutStatus";
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(url, requestOptions)
    .then((response) => response.json())
    .then(async (data) => {
      if (data && data.status && data.data && data.data.length) {
        let Journals = data.data;
        JournalsList = data.data;
        console.log(Journals);
        let journalelem = "";
        if (Journals && Journals.length) {
          Journals.forEach((journal) => {
            const { JournalName, MainCategory, ISSNNumber, isActive } = journal;
            let statuselem = "";
            if (isActive) {
              statuselem = `<span class="badge rounded-pill bg-success">Active</span>`;
            } else {
              statuselem = `<span class="badge rounded-pill bg-danger">Inactive</span>`;
            }
            journalelem += `<tr>
                                <td class="ps-0">
                                    <div class="d-flex align-items-center">
                                        <div>
                                            <h6 class="fw-semibold mb-1">${JournalName}</h6>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <p class="mb-0 fs-3">${MainCategory}</p>
                                </td>
                                <td>
                                    <p class="mb-0 fs-3">${ISSNNumber}</p>
                                </td>
                                <td>
                                    <p class="mb-0 fs-3">${statuselem}</p>
                                </td>
                                <td>
                                    <span style="cursor: pointer;" class="badge fw-semibold p-2 bg-light-primary text-primary" onclick="showJournalModalPopup('${journal._id}')"><i class="fa-solid fa-pen-to-square"></i> Modify</span>
                                </td>
                            </tr>`;
          });
          $("#journalcontaierID").html(journalelem);
        }
      }
    });
}

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

function showJournalModalPopup(journalID) {
  if (JournalsList && JournalsList.length && journalID) {
    let selectedjournal = JournalsList.find((x) => x._id == journalID);
    if (selectedjournal) {
      $("#JournalModalID").modal("show");
      const {
        JournalName,
        MainCategory,
        ISSNNumber,
        ImpactFactorValue,
        About,
        NLMCode,
        JournalSlug,
        isActive,
        metadata,
      } = selectedjournal;
      $("#journalTitle").val(JournalName);
      $("#MainCategoryID").val(MainCategory);
      $("#issnNumber").val(ISSNNumber);
      $("#ImpactFactorValueID").val(ImpactFactorValue);
      $("#NLMCodeID").val(NLMCode);
      $("#JournalSlugID").val(JournalSlug);
      $("#isJournalActiveID").prop("checked", isActive);
      aboutjournal.setValue(sourceID1, About);
      description.setValue(sourceID2, metadata.description);
      $("#metaTitleID").val(metadata.title);
      if (
        metadata.keywords &&
        Array.isArray(metadata.keywords) &&
        metadata.keywords.length
      ) {
        $("#TagsID").tagEditor("destroy");
        $("#TagsID").tagEditor({
          delimiter: "",
          forceLowercase: false,
          initialTags: metadata.keywords,
        });
      }
      $("#modifyEditorID").attr("editorid", selectedjournal._id);
    }
  }
}

function saveData() {
  let JournalID = $("#modifyEditorID").attr("editorid");
  if (JournalID && JournalID !== "") {
    let about = aboutjournal.getData(sourceID1);
    let ISSN = document.getElementById("issnNumber").value;
    let MainCategory = document.getElementById("MainCategoryID").value;
    let isActive = $("#isJournalActiveID").prop("checked");
    let ImpactFactorValue = document.getElementById(
      "ImpactFactorValueID"
    ).value;
    let NLMCode = document.getElementById("NLMCodeID").value;
    let description1 = description.getData(sourceID2);
    let keywords = $("#TagsID").tagEditor("getTags")[0].tags;
    let metatitle = $("#metaTitleID").val();

    if (ISSN == null || ISSN == "") {
      console.log("Enter ISSN!");
      $(".validationalert").removeClass("d-none");
      $(".validationalert").text("Enter Journal ISSN!");
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
    } else {
      $(".validationalert").addClass("d-none");
      const url = "/journalmanagement/App/controllers/Journal/updateJournal";

      let data = {
        ISSNNumber: ISSN,
        About: about,
        MainCategory: MainCategory,
        ImpactFactorValue: Number(ImpactFactorValue),
        NLMCode: NLMCode,
        journalId: JournalID,
        isActive: isActive,
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
          $(".validationalert").text("Journal Updated successfully!");
          $(".validationalert").addClass("alert-success");
          document.getElementById("journalTitle").value = "";
          document.getElementById("issnNumber").value = "";
          aboutjournal.setValue(sourceID1, "");
          document.getElementById("MainCategoryID").value = "";
          document.getElementById("ImpactFactorValueID").value = "";
          document.getElementById("NLMCodeID").value = "";
          document.getElementById("JournalSlugID").value = "";
          setTimeout(() => {
            $(".validationalert").removeClass("alert-success");
            $(".validationalert").addClass("d-none alert-danger");
            $("#JournalModalID").modal("hide");
          }, 1000);
          getAllJournals();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
}

function searchData() {
  let title = $("#search").val();
  $(".loader").removeClass("d-none");
  if (title != null && title != "") {
    let data = {
      JournalName: title,
    };
    fetch("/journalmanagement/App/controllers/Journal/searchJournal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        $(".loader").addClass("d-none");
        if (data && data.status && data.data && data.data.length) {
          let Journals = data.data;
          JournalsList = data.data;
          console.log(Journals);
          let journalelem = "";
          if (Journals && Journals.length) {
            Journals.forEach((journal) => {
              const { JournalName, MainCategory, ISSNNumber, isActive } =
                journal;
              let statuselem = "";
              if (isActive) {
                statuselem = `<span class="badge rounded-pill bg-success">Active</span>`;
              } else {
                statuselem = `<span class="badge rounded-pill bg-danger">Inactive</span>`;
              }
              journalelem += `<tr>
                                    <td class="ps-0">
                                        <div class="d-flex align-items-center">
                                            <div>
                                                <h6 class="fw-semibold mb-1">${JournalName}</h6>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p class="mb-0 fs-3">${MainCategory}</p>
                                    </td>
                                    <td>
                                        <p class="mb-0 fs-3">${ISSNNumber}</p>
                                    </td>
                                    <td>
                                    <p class="mb-0 fs-3">${statuselem}</p>
                                    </td>
                                    <td>
                                        <span style="cursor: pointer;" class="badge fw-semibold p-2 bg-light-primary text-primary" onclick="showJournalModalPopup('${journal._id}')"><i class="fa-solid fa-pen-to-square"></i> Modify</span>
                                    </td>
                                </tr>`;
            });
            $("#journalcontaierID").html(journalelem);
          }
        }
      });
  } else {
    getAllJournals();
    $(".loader").addClass("d-none");
  }
}
