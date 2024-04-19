const sideListCls = new GenerateSideNav();
const sideList = sideListCls.create("mainMenu", "Editors &nbsp; Management");
const mobilesideList = sideListCls.createMobileNav();
$(".MobileSideNavBarContainer").html(mobilesideList);
$("#sidebarnav").html(sideList);

let sourceID1 = "authorBioID";
let labelText1 = "Add Bio<span class='text-danger'>*</span>";

const addbio = new GenerateCkEditor();
const textareaElement1 = addbio.create(sourceID1, labelText1);
$("#authorbiocontainer").html(textareaElement1);
addbio.initEditor(sourceID1);

$("#intrestID").tagEditor({
  delimiter: "",
  forceLowercase: false,
});

$(() => {
  getData();
});

var editorsListGlobal = [];
function getData() {
  // $(".preloader").removeClass('d-none');
  $("#search").val("");
  $(".loader").removeClass("d-none");
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
      $(".loader").addClass("d-none");
      // $(".preloader").addClass('d-none');
      if (data != null && data.status == true && data.data != null) {
        let editorslist = data.data;
        editorsListGlobal = data.data;
        if (editorslist.length) {
          let editortrelem = "";
          editorslist.forEach((editor) => {
            let designationElem = "";
            if (editor && editor.designation) {
              // editor.designation.forEach(item => designationElem += `${item}, `);
              designationElem = editor.designation;
            } else {
              designationElem = "NA";
            }
            let intrestElem = "";
            if (editor && editor.intrest && editor.intrest.length) {
              // editor.designation.forEach(item => designationElem += `${item}, `);
              intrestElem = editor.intrest.join("");
            } else {
              intrestElem = "NA";
            }
            let websiteInputElem = "";
            if (editor && editor.website) {
              websiteInputElem = editor.website;
            } else {
              websiteInputElem = "NA";
            }

            editortrelem += `<tr>
                                        <td class="ps-0">
                                            <div class="d-flex align-items-center">
                                                <div class="me-2 pe-1">
                                                    <img src="${editor.image}" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <div>
                                                    <h6 class="fw-semibold mb-1">${editor.name}</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <p class="mb-0 fs-3">${designationElem}</p>
                                        </td>
                                        <td>
                                        <p class="mb-0 fs-3 text-ellipses-100" title="${intrestElem}">${intrestElem}</p>
                                    </td>
                                    <td>
                                    <p class="mb-0 fs-3 text-ellipses-100" title="${websiteInputElem}">${websiteInputElem}</p>
                                </td>
                                        <td>
                                            <span style="cursor: pointer;" class="badge fw-semibold p-2 bg-light-primary text-primary" onclick="showEditorModalPopup('${editor._id}')"><i class="fa-solid fa-pen-to-square"></i> Modify</span>
                                        </td>
                                        <td>
                                        <button class="btn btn-danger" onclick="deleteEditor('${editor._id}')">Delete</button>
                                    </td>
                                    </tr>`;
          });
          $("#editordatacontaierID").html(editortrelem);
        }
      }
    });
}

function showEditorModalPopup(editorID) {
  let editorData = (editorsListGlobal || []).find(
    (elem) => elem._id.toString() === editorID.toString()
  );
  $("#modifyEditorID").attr("editorid", editorData._id);
  $(".modal-title").text(editorData.name);
  $("#websiteInput").val(editorData.website);
  $("#authorName").val(editorData.name);
  $("#afflication").val(editorData.affiliation);
  $("#DesignationID").val(editorData.designation || "");
  addbio.setValue(sourceID1, editorData.biography || "");
  if (
    editorData.intrest &&
    Array.isArray(editorData.intrest) &&
    editorData.intrest.length
  ) {
    $("#intrestID").tagEditor("destroy");
    $("#intrestID").tagEditor({
      delimiter: "" /* space and comma */,
      forceLowercase: false,
      initialTags: editorData.intrest,
    });
  }
  $("#editordetailsModalID").modal("show");
}

function saveData() {
  let editor_id = $("#modifyEditorID").attr("editorid");
  // console.log("editor_id", editor_id);
  const imageInput = document.getElementById("authorImage");
  let author = document.getElementById("authorName").value;
  let afflication = document.getElementById("afflication").value;
  let website = document.getElementById("websiteInput").value;
  let designationsList = $("#DesignationID").val();
  let intrestList = $("#intrestID").tagEditor("getTags")[0].tags;
  let bio = addbio.getData(sourceID1);

  if (author == null || author == "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter Author Name");
    return;
  } else if (website == null || website == "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter website URL");
    return;
  } else if (designationsList == null || designationsList == "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter Designation");
    return;
  } else if (afflication == null || afflication == "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter Afflication");
    return;
  } else if (intrestList == null || intrestList.length == 0) {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter your intrests");
    return;
  } else if (bio == null || bio == "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Enter Bio");
    return;
  } else {
    $(".validationalert").addClass("d-none");
    // console.log(author, afflication, bio);
    if (editor_id != null && editor_id != "") {
      let data = {
        name: author,
        Website: website,
        affiliation: afflication,
        biography: bio,
        _id: editor_id,
        designation: designationsList,
        intrest: intrestList,
      };

      fetch("/editorialboardupdate", {
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
        .then((responseData) => {
          // Handle the response data here
          $(".validationalert").removeClass("d-none alert-danger");
          $(".validationalert").text("Editorial Board Updated Successfully!");
          $(".validationalert").addClass("alert-success");
          setTimeout(() => {
            $(".validationalert").removeClass("alert-success");
            $(".validationalert").addClass("d-none alert-danger");
          }, 3000);
          getData();
          $("#editordetailsModalID").modal('hide');
          console.log(responseData);
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
      name: title,
    };
    fetch("/searcheditorialboard", {
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
        console.log(data);
        $(".loader").addClass("d-none");
        if (data != null && data.status == true && data.data != null) {
          let editorslist = data.data;
          editorsListGlobal = data.data;
          if (editorslist.length) {
            let editortrelem = "";
            editorslist.forEach((editor) => {
              let designationElem = "";
              if (editor && editor.designation) {
                designationElem = editor.designation;
              } else {
                designationElem = "NA";
              }
              let intrestElem = "";
              if (editor && editor.intrest && editor.intrest.length) {
                intrestElem = editor.intrest.join("");
              } else {
                intrestElem = "NA";
              }
              let websiteInputElem = "";
              if (editor && editor.website) {
                websiteInputElem = editor.website;
              } else {
                websiteInputElem = "NA";
              }
              editortrelem += `<tr>
                                        <td class="ps-0">
                                            <div class="d-flex align-items-center">
                                                <div class="me-2 pe-1">
                                                    <img src="${editor.image}" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <div>
                                                    <h6 class="fw-semibold mb-1">${editor.name}</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <p class="mb-0 fs-3">${designationElem}</p>
                                        </td>
                                        <td>
                                        <p class="mb-0 fs-3 text-ellipses-100" title="${intrestElem}">${intrestElem}</p>
                                    </td>
                                    <td>
                                    <p class="mb-0 fs-3 text-ellipses-100" title="${websiteInputElem}">${websiteInputElem}</p>
                                </td>
                                        <td>
                                            <span style="cursor: pointer;" class="badge fw-semibold p-2 bg-light-primary text-primary" onclick="showEditorModalPopup('${editor._id}')"><i class="fa-solid fa-pen-to-square"></i> Modify</span>
                                        </td>
                                        <td>
                                        <button class="btn btn-danger" onclick="deleteEditor('${editor._id}')">Delete</button>
                                    </td>
                                    </tr>`;
            });
            $("#editordatacontaierID").html(editortrelem);
          }
        }
      });
  } else {
    getData();
  }
}
//------------------------------------------- deleate related code ---------------------------------------------------------------------
// Function to delete an editor
function deleteEditor(editorID) {
  const confirmDelete = confirm("Are you sure you want to delete this editor?");
  if (confirmDelete) {
    let obj = {
      editorID: editorID,
    };
    fetch("/deleteEditor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((responseData) => {
        $(".validationalert").removeClass("d-none alert-success");
        $(".validationalert").text("Editor deleted successfully!");
        setTimeout(() => {
          $(".validationalert").addClass("d-none alert-success");
        }, 3000);
        getData(); // Refresh data after deletion
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
// --------------------------------------------------------------------------------------------------------------------------------------
function handleSearchOnChange(e) {
  const { value } = e.target.value;
  console.log(value);
}
