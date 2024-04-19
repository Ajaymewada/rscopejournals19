document.title = "Issues";
const sideListCls = new GenerateSideNav();
const sideList = sideListCls.create("articlelinks", "Issues");
const mobilesideList = sideListCls.createMobileNav();
$(".MobileSideNavBarContainer").html(mobilesideList);
$("#sidebarnav").html(sideList);

$(() => {
  $(".loader").removeClass("d-none");
  getAllIssues();
  getAllJournals();
});

async function createIssueHandler() {
  $("#createIssueModalID").modal("show");
  $("#createIssueModalID").modal("show");
  $("#IssueTitle").val("");
  $("#IssueBody").val("");
  $(".modal-title").text("Create Issue");
  $("#modifyEditorID").attr("editorid", "");
  $(".emergencymsg").text("");
}

$("#journalSelect").on("change", () => {
  let journalid = $("#journalSelect").val();
  if (journalid && journalid != "") {
    getVolumesByJournal(journalid, (data) => {
      if (data !== null) {
        const { volumes } = data;
        if (volumes && volumes.length) {
          let volumeOpt = `<option selected>Open this select menu</option>`;
          volumes.forEach((vol, index) => {
            if (vol._id && vol.title !== null && vol.title !== "") {
              volumeOpt += `<option value="${vol._id}">${vol.title}</option>`;
            }
          });
          $("#selectedVolume").html(volumeOpt);
          $("#selectedVolume").val("Open this select menu");
          $("#selectedVolume").attr("disabled", false);
        }
      }
    });
  }
});

function getVolumesByJournal(journalid, callback) {
  const url = `/getVolumesByJournal/${journalid}`;
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data)
      if (data && data.status == true) {
        console.log(data);
        callback(data);
      } else {
        callback(null);
      }
    });
}

function getAllVolumes(callback) {
  const url = `/getAllVolumes`;
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data)
      if (data && data.status == true) {
        console.log(data);
        callback(data);
      } else {
        callback(null);
      }
    });
}

function createIssue() {
  let title = $("#IssueTitle").val();
  let body = $("#IssueBody").val();
  let volumeuid = $("#selectedVolume").val();
  let journalid = document.getElementById("journalSelect").value;
  $("#journalSelect").attr("disabled", false);
  if (title === null || title === "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").html("Enter Title!");
    return;
  } else if (journalid === null || journalid === "") {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").text("Select a Journal");
    return;
  } else if (
    volumeuid === null ||
    volumeuid === "" ||
    volumeuid === "Open this select menu"
  ) {
    $(".validationalert").removeClass("d-none");
    $(".validationalert").html("Select Volume!");
    return;
  }
  $(".saveinprogress").removeClass("d-none");

  let data = {};
  var requestURL = "";
  $(".saveinprogress").removeClass("d-none");
  if ($("#modifyEditorID").attr("editorid") === "") {
    data = {
      title: title,
      body: body || "",
      volumeuid: volumeuid,
      journalid
    };
    requestURL = "/createIssue";
  } else {
    data = {
      IssueId: $("#modifyEditorID").attr("editorid") || "",
      title: title,
      body: body || "",
    };
    requestURL = "/updateIssueById";
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
        $(".validationalert").text("Issue Added Successfully!");
      } else {
        $(".validationalert").text("Issue Updated Successfully!");
      }
      $(".validationalert").addClass("alert-success");
      setTimeout(() => {
        $(".validationalert").removeClass("alert-success");
        $(".validationalert").addClass("d-none alert-danger");
        $("#createIssueModalID").modal("hide");
      }, 3000);
      getAllIssues();
    });
}

var currentPage = 1;
var globalIssues = [];
function getAllIssues() {
  $(".loader").removeClass("d-none");
  $(".paginator").show();
  $("#search").val("");
  let data = {
    page: currentPage,
  };
  fetch("/getIssuesWithPagination", {
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
        responseData.Issues &&
        responseData.Issues.length
      ) {
        globalIssues = responseData.Issues;
        if (currentPage === 1) {
          paginator.initPaginator({
            totalPage: responseData.totalPages,
            previousPage: "Previous",
            nextPage: "Next",
            triggerFunc: updatePaginationUI,
          });
        }
        constructUITable(responseData.Issues);
        getAllVolumes((data) => {
          if (data !== null) {
            const { volumes } = data;
            if (volumes && volumes.length) {
              let volumeOpt = `<option selected>Open this select menu</option>`;
              volumes.forEach((vol, index) => {
                if (vol._id && vol.title !== null && vol.title !== "") {
                  volumeOpt += `<option value="${vol._id}">${vol.title}</option>`;
                }
              });
              $("#selectedVolume").html(volumeOpt);
            }
          }
          $("#IssueTitle").val("");
          $("#IssueBody").val("");
          $(".modal-title").text("Create Issue");
          $("#modifyEditorID").attr("editorid", "");
          $("#selectedVolume").val("Open this select menu");
          $("#selectedVolume").attr("disabled", false);
          $(".emergencymsg").text("");
        });
      }
    });
}

function updatePaginationUI() {
  var selectdPg = $(".js-paginator").data("pageSelected");
  if (selectdPg !== null) {
    currentPage = selectdPg;
    getAllIssues();
    $("html, body").animate(
      {
        scrollTop: $("#issuetBodyContainer").offset().top - 150,
      },
      500
    );
  }
}

function constructUITable(Issues) {
  if (Issues.length) {
    let Issues1 = Issues;
    let tableRow = "";
    (Issues1 || []).forEach((element, index) => {
      const { title, IssueID, createdAt, _id, volumeuid } = element;
      const newDate = new Date(createdAt);
      tableRow += `<tr>
                            <th scope="row">${IssueID.charAt(
                              IssueID.length - 1
                            )}</th>
                            <td>${IssueID}</td>
                            <td>${title}</td>
                            <td>${newDate.toDateString()}</td>
                            <td>${volumeuid.title || ""}</td>
                            <td>
                                <button class="btn btn-primary" onclick="modifyIssue('${_id}')">Modify <i class="fa-solid fa-pen-to-square mx-1"></i></button>
                            </td>
                            <td>
                                <button class="btn btn-primary" onclick="viewArticles('${_id}')">View <i class="fa-solid fa-eye mx-1"></i></button>
                            </td>
                        </tr>`;
    });
    $("#issuetBodyContainer").html(tableRow);
  }
}

function modifyIssue(IssueID) {
  if (globalIssues !== null && globalIssues.length && IssueID !== null) {
    let selectedIssue = globalIssues.find(
      (x) => x._id.toString() === IssueID.toString()
    );
    if (selectedIssue !== null) {
      $(".modal-title").text("Modify Issue");
      $("#modifyEditorID").attr("editorid", IssueID);
      const { title, body, volumeuid, journalid} = selectedIssue;
      getAllVolumes((data) => {
        if (data !== null) {
          const { volumes } = data;
          if (volumes && volumes.length) {
            let volumeOpt = `<option selected>Open this select menu</option>`;
            volumes.forEach((vol, index) => {
              if (vol._id && vol.title !== null && vol.title !== "") {
                volumeOpt += `<option value="${vol._id}">${vol.title}</option>`;
              }
            });
            $("#selectedVolume").html(volumeOpt);
          }
        }
        $("#createIssueModalID").modal("show");
        $("#IssueTitle").val(title || "");
        $("#IssueBody").val(body || "");
        $("#journalSelect").val(journalid);
        $("#selectedVolume").val(volumeuid._id);
        $("#selectedVolume").attr("disabled", true);
        $("#journalSelect").attr("disabled", true);
        $(".emergencymsg").text("Journal & Volume can not be modified!😶‍🌫️");
      });
    }
  }
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
  fetch("/searchIssuesByTitleOrID", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      $(".loader").addClass("d-none");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((responseData) => {
      // console.log(responseData);
      $(".paginator").hide();
      if (
        responseData !== null &&
        responseData.Issues &&
        responseData.Issues.length
      ) {
        globalIssues = responseData.Issues;
        constructUITable(responseData.Issues);
      }
    });
}

async function viewArticles(issueID) {
  if (issueID === null || issueID === "") {
    return;
  }
  let response = await fetch("/getArticlesByIssueId", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      issueuid: issueID,
    }),
  });
  let data = await response.json();
  if (data.status && data.articles && data.articles.length) {
    let artcileBadges = "";
    data.articles.forEach((article) => {
      const { title } = article;
      if (title !== null && title !== "") {
        artcileBadges += `<h5 class="badge bg-primary mx-2">${title}</h5>`;
      }
    });
    $("#modalArticlesContainer").html(artcileBadges);
  } else {
    let noArticles = `<h4 class="text-center text-primary">No Articles!</h4>`;
    $("#modalArticlesContainer").html(noArticles);
  }
  $(".modal-title").text("Articles");
  $("#viewArticlesModalID").modal("show");
}
