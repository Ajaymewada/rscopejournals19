document.title = "Create Volume";
const sideListCls = new GenerateSideNav();
const sideList = sideListCls.create("articlelinks", "Create Volume");
const mobilesideList = sideListCls.createMobileNav();
$(".MobileSideNavBarContainer").html(mobilesideList);
$("#sidebarnav").html(sideList);

function createVolumeHandler() {
  $(".modal-title").text("Create Volume");
  $("#createVolumeModalID").modal("show");
  $("#modifyEditorID").attr("editorid", "");
  $("#volumeTitle").val("");
  $("#volumeBody").val("");
  $("#journalSelect").attr("disabled", false);
  $("#journalSelect").val("");
}

function createVolume() {
  let title = $("#volumeTitle").val();
  let body = $("#volumeBody").val();
  let journalid = document.getElementById("journalSelect").value;
  if (title === null || title === "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").html("Enter Title!");
    return;
  } else if (journalid === null || journalid === "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Select a Journal");
    return;
  }
  let data = {};
  var requestURL = "";
  $(".saveinprogress").removeClass("d-none");
  if ($("#modifyEditorID").attr("editorid") === "") {
    data = {
      title: title,
      body: body || "",
      journalid
    };
    requestURL = "/createVolume";
  } else {
    data = {
      volumeId: $("#modifyEditorID").attr("editorid") || "",
      title: title,
      body: body || "",
    };
    requestURL = "/updateVolumeById";
  }
  fetch(requestURL, {
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
      // console.log(responseData);
      $(".saveinprogress").addClass("d-none");
      $(".validationalert").removeClass("d-none alert-danger");
      if ($("#modifyEditorID").attr("editorid") === "") {
        $(".validationalert").text("Volume Added Successfully!");
      } else {
        $(".validationalert").text("Volume Updated Successfully!");
      }
      $(".validationalert").addClass("alert-success");
      setTimeout(() => {
        $(".validationalert").removeClass("alert-success");
        $(".validationalert").addClass("d-none alert-danger");
        getAllVolumes();
        $("#createVolumeModalID").modal("hide");
      }, 3000);
    });
}

function serachData() {
  $(".loader").removeClass("d-none");
  let searchValue = $("#search").val();
  if (searchValue === null || searchValue === "") {
    return;
  }
  let data = {
    searchTerm: searchValue,
  };
  fetch("/searchVolumesByTitleOrID", {
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
      // console.log(responseData);
      $(".loader").addClass("d-none");
      $(".paginator").hide();
      if (
        responseData !== null &&
        responseData.volumes &&
        responseData.volumes.length
      ) {
        globalVolumes = responseData.volumes;
        constructUITable(responseData.volumes);
      } else {
        $("#volumetBodyContainer").html(`No Volume With This ID`);
      }
    });
}

$(() => {
  $(".loader").removeClass("d-none");
  getAllVolumes();
  getAllJournals();
});
var currentPage = 1;
var globalVolumes = [];
function getAllVolumes() {
  $(".loader").removeClass("d-none");
  $(".paginator").show();
  $("#search").val("");
  let data = {
    page: currentPage,
  };
  fetch("/getVolumesWithPagination", {
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
      $(".loader").addClass("d-none");
      if (
        responseData !== null &&
        responseData.volumes &&
        responseData.volumes.length
      ) {
        globalVolumes = responseData.volumes;
        if (currentPage === 1) {
          paginator.initPaginator({
            totalPage: responseData.totalPages,
            previousPage: "Previous",
            nextPage: "Next",
            triggerFunc: updatePaginationUI,
          });
        }
        constructUITable(responseData.volumes);
      }
    });
}

function updatePaginationUI() {
  var selectdPg = $(".js-paginator").data("pageSelected");
  if (selectdPg !== null) {
    currentPage = selectdPg;
    getAllVolumes();
    $("html, body").animate(
      {
        scrollTop: $("#volumetBodyContainer").offset().top - 150,
      },
      500
    );
  }
}

function constructUITable(volumes) {
  if (volumes.length) {
    let Volumes = volumes;
    let tableRow = "";
    (Volumes || []).forEach((element, index) => {
      const { title, volumeID, createdAt, _id } = element;
      const newDate = new Date(createdAt);
      tableRow += `<tr>
                            <th scope="row">${volumeID.charAt(
                              volumeID.length - 1
                            )}</th>
                            <td>${volumeID}</td>
                            <td>${title}</td>
                            <td>${newDate.toDateString()}</td>
                            <td>
                                <button class="btn btn-primary" onclick="modifyVolume('${_id}')">Modify <i class="fa-solid fa-pen-to-square mx-1"></i></button>
                            </td>
                            <td>
                                <button class="btn btn-primary" onclick="viewIssues('${_id}')">View <i class="fa-solid fa-eye mx-1"></i></button>
                            </td>
                        </tr>`;
    });
    $("#volumetBodyContainer").html(tableRow);
  }
}

function modifyVolume(volumeID) {
  $("#journalSelect").attr("disabled", true);
  if (globalVolumes !== null && globalVolumes.length && volumeID !== null) {
    let selectedVolume = globalVolumes.find(
      (x) => x._id.toString() === volumeID.toString()
    );
    if (selectedVolume !== null) {
      $(".modal-title").text("Modify Volume");
      $("#modifyEditorID").attr("editorid", volumeID);
      const { title, body, journalid} = selectedVolume;
      $("#createVolumeModalID").modal("show");
      $("#volumeTitle").val(title || "");
      $("#volumeBody").val(body || "");
      $("#journalSelect").val(journalid);
      $(".emergencymsg").text("Journal can not be modified!😶‍🌫️");
    }
  }
}

async function viewIssues(volumeID) {
  if (volumeID == null || volumeID == "") {
    return;
  }
  let response = await fetch("/getIssuesByVolumeId", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      volumeuid: volumeID,
    }),
  });
  let data = await response.json();
  // console.log(issues);
  if (data.status && data.issues && data.issues.length) {
    let issueBadges = "";
    data.issues.forEach((issue) => {
      const { title } = issue;
      if (title !== null && title !== "") {
        issueBadges += `<h5 class="badge bg-primary mx-2">${title}</h5>`;
      }
    });
    $("#modalIssuesContainer").html(issueBadges);
  } else {
    let noIssues = `<h4 class="text-center text-primary">No Issues!</h4>`;
    $("#modalIssuesContainer").html(noIssues);
  }
  // modalIssuesContainer
  $("#viewIssuesModalID").modal("show");
}
