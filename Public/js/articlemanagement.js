document.title = "Add Article";
const sideListCls = new GenerateSideNav();
const sideList = sideListCls.create("articlelinks", "Article Management");
const mobilesideList = sideListCls.createMobileNav();
$(".MobileSideNavBarContainer").html(mobilesideList);
$("#sidebarnav").html(sideList);

$("#authorNames").tagEditor({
  delimiter: "",
  forceLowercase: false,
});

let sourceID1 = "abstractionID";
let labelText1 = "Abstraction" + `<span class="text-danger">*<span>`;
let sourceID2 = "citationID";
let labelText2 = "Citation" + `<span class="text-danger">*<span>`;

const abstractionTextarea = new GenerateCkEditor();
const citationTextarea = new GenerateCkEditor();

const textareaElement1 = abstractionTextarea.create(sourceID1, labelText1);
const textareaElement2 = citationTextarea.create(sourceID2, labelText2);

$("#articleAbstractContainer").html(textareaElement1);
$("#articleCitationContainer").html(textareaElement2);

abstractionTextarea.initEditor(sourceID1);
citationTextarea.initEditor(sourceID2);

$(() => {
  getData();
  getAllJournals();
});

$("#journalSelect").on("change", () => {
  let journalid = $("#journalSelect").val();
  if (journalid && journalid != "") {
    getData(journalid);
    // getArticlesByJournalID(journalid, (data) => {
    //   console.log(data);
    //   constructUITable(data);
    //   if (data.length <= 0) {
    //     $("#articledatacontaierID").html("");
    //   }
    // });
  }
});

function getArticlesByJournalID(journalid, callback) {
  fetch("/getArticlesByJournalID", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      journalid,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((responseData) => {
      if (responseData && responseData.status) {
        callback(responseData.data);
      }
    });
}

var currentPage = 1;
var articlesListGlobal = [];
function getData(journalid) {
  // $(".preloader").removeClass('d-none');
  $("#search").val("");
  $(".paginator").show();
  $(".loader").removeClass("d-none");
  const url = "/getArticlesPaginationWise";
  let data = {
    pageNumber: currentPage,
  };
  if (journalid) {
    data.journalid = journalid;
  }
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      $(".loader").addClass("d-none");
      // $(".preloader").addClass('d-none');
      if (data != null && data.status == true && data.articles != null) {
        let articleslist = data.articles;
        articlesListGlobal = data.articles;
        if (currentPage === 1) {
          paginator.initPaginator({
            totalPage: data.totalPages,
            previousPage: "Previous",
            nextPage: "Next",
            triggerFunc: updatePaginationUI,
          });
        }
        constructUITable(articleslist);
      }
      if (data && data.articles && data.articles.length <= 0) {
        $("#articledatacontaierID").html("<h5 class='mt-4 text-center'>No Articles!</h5>");
      }
    });
}

function clearFilter() {
    $("#journalSelect").val("");
    getData();
}

function updatePaginationUI() {
  var selectdPg = $(".js-paginator").data("pageSelected");
  if (selectdPg !== null) {
    currentPage = selectdPg;
    getData();
    $("html, body").animate(
      {
        scrollTop: $("#articledatacontaierID").offset().top - 150,
      },
      500
    );
  }
}

function constructUITable(articles) {
  if (articles.length) {
    let Articles = articles;
    let tableRow = "";
    (Articles || []).forEach((element, index) => {
      const {
        title,
        articleID,
        createdAt,
        _id,
        statusflag,
        volumeuid,
        issueuid,
      } = element;
      if (statusflag && articleID) {
        const newDate = new Date(createdAt);
        let tooltipelm = "";
        if (volumeuid && issueuid) {
          tooltipelm = `<span style="cursor:pointer;" class="badge fw-semibold p-2 bg-light-primary text-primary" data-bs-toggle="tooltip" data-bs-html="true" title="<p class='fs-4'>Volume: ${volumeuid.title}</p><p class='fs-4'>Issue: ${issueuid.title}</p>">${statusflag}</span>`;
        } else {
          tooltipelm = `<span style="cursor:pointer;" class="badge fw-semibold p-2 bg-light-primary text-primary">${statusflag}</span>`;
        }
        tableRow += `<tr>
                            <th scope="row">${index + 1}</th>
                            <td>${articleID}</td>
                            <td title="${title}">${title.substr(0, 25)}...</td>
                            <td>${newDate.toDateString()}</td>
                            <td>
                                ${tooltipelm}
                            </td>
                            <td>
                                <button class="btn btn-primary" onclick="showEditorModalPopup('${_id}')"><i class="fa-solid fa-pen-to-square mx-1"></i>Modify</button>
                            </td>
                        </tr>`;
      }
    });
    $("#articledatacontaierID").html(tableRow);
    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
}

function showEditorModalPopup(articleID) {
  let articleData = (articlesListGlobal || []).find(
    (elem) => elem._id.toString() === articleID.toString()
  );
  $("#modifyEditorID").attr("editorid", `${articleData._id}`);
  $("#articleTitle").val(articleData.title);
  // $('.modal-title').text(articleData.title);
  abstractionTextarea.setValue(sourceID1, articleData.abstract);
  citationTextarea.setValue(sourceID2, articleData.citation);
  $("#authorNames").tagEditor("destroy");
  $("#authorNames").tagEditor({
    delimiter: "",
    forceLowercase: false,
    initialTags: articleData.authorNames || [],
  });
  $("#articledetailsModalID").modal("show");
}

function modifyArticle() {
  let articleID = $("#modifyEditorID").attr("editorid");
  let title = $("#articleTitle").val();
  let abstract = abstractionTextarea.getData(sourceID1);
  let citation = citationTextarea.getData(sourceID2);
  let authorNames = $("#authorNames").tagEditor("getTags")[0].tags;
  if (articleID != null && articleID != "") {
    if (title == null || title == "") {
      $(".validationalert").removeClass("d-none");
      $(".validationalert").html("Enter Title!");
      return;
    } else if (abstract == null || abstract == "") {
      $(".validationalert").removeClass("d-none");
      $(".validationalert").html("Enter Abstract!");
      return;
    } else if (citation == null || citation == "") {
      $(".validationalert").removeClass("d-none");
      $(".validationalert").html("Enter Citation!");
      return;
    } else if (authorNames == null || authorNames.length == 0) {
      $(".validationalert").removeClass("d-none");
      $(".validationalert").html("Enter Author Names!");
      return;
    } else {
      let data = {
        title: title,
        abstract: abstract,
        citation: citation,
        authorNames: authorNames,
        _id: articleID,
      };
      fetch("/addupdateArticle", {
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
          $(".validationalert").text("Article Updated Successfully!");
          $(".validationalert").addClass("alert-success");
          setTimeout(() => {
            $(".validationalert").removeClass("alert-success");
            $(".validationalert").addClass("d-none alert-danger");
            getData();
            $("#articledetailsModalID").modal("hide");
          }, 3000);

          console.log(responseData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
}

function serachData() {
  let title = $("#search").val();
  $(".loader").removeClass("d-none");
  $(".paginator").hide();
  if (title != null && title != "") {
    let data = {
      name: title,
    };
    fetch("/searchArticle", {
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
        if (data != null && data.status == true && data.articles != null) {
          let articleslist = data.articles;
          articlesListGlobal = data.articles;
          constructUITable(articleslist);
        }
      });
  } else {
    getData();
  }
}

// let articlelem = ""
// articleslist.forEach(article => {
//     // <td>
//     //     <p class="mb-0 fs-3" style="width: 200px !important; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${article.abstract.substr(0, 30)}</p>
//     // </td>
//     articlelem += `<tr>
//                                         <td class="ps-0" colspan="4">
//                                             <div class="d-flex align-items-center">
//                                                 <div>
//                                                     <h6 class="fw-semibold mb-1">${article.title.substr(0, 25)}</h6>
//                                                 </div>
//                                             </div>
//                                         </td>

//                                         <td>
//                                             <span style="cursor: pointer;" class="badge fw-semibold p-2 bg-light-primary text-primary" onclick="showEditorModalPopup('${article._id}')"><i class="fa-solid fa-pen-to-square"></i> Modify</span>
//                                         </td>
//                                     </tr>`
// });
// $("#articledatacontaierID").html(articlelem)

// if (articleslist.length) {
//     let articlelem = ""
//     articleslist.forEach(article => {
//         articlelem += `<tr>
//                                         <td class="ps-0" colspan="4">
//                                             <div class="d-flex align-items-center">
//                                                 <div>
//                                                     <h6 class="fw-semibold mb-1">${article.title.substr(0, 30)}</h6>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                         <td>
//                                             <span style="cursor: pointer;" class="badge fw-semibold p-2 bg-light-primary text-primary" onclick="showEditorModalPopup('${article._id}')"><i class="fa-solid fa-pen-to-square"></i> Modify</span>
//                                         </td>
//                                     </tr>`
//     });
//     $("#articledatacontaierID").html(articlelem)
// }
