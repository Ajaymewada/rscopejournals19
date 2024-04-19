var JournalData = document.getElementById("JournalDataElm").innerHTML;
JournalData = JSON.parse(JournalData);
console.log(JournalData);

setTimeout(() => {
  getJournalById();
}, 1000);

function getJournalById() {
  if (JournalData) {
    const url = `/journalmanagement/App/controllers/Journal/${JournalData}`;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        $(".loader-container").hide();
        if (data && data.status) {
          const { journal } = data;
          localStorage.setItem("JournalInfo", JSON.stringify(journal));
          // document.getElementById("coverBannerImgID").src = journal.CoverBanner.path;
          $("#ISSNNOID").text(journal.ISSNNumber || "NA");
          $("#journaltitlecontainerID").text(journal.JournalName);
          $("#JournalDesc").html(journal.About);
          getVolumesByJournal(journal._id);
          console.log(journal);
        }
      });
  }
}

let Volumes;
$(() => {
  $("#go-back").hide();
  $("#go_back_issue").hide();
  // getAllVolumes();
  // getCoverbanner();
});
function getCoverbanner() {
  const url = "/getcoverbanner";

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
      if (data && data.status === true) {
        console.log(data);
        $("#coverBannerImgID").attr("src", data.data.path);

        // Add the shadow class to apply the styling
        $("#coverBannerImgID").addClass("shadow");
      }
    });
}
function getVolumesByJournal(journalid) {
  $("#allIssuesContainer").hide();
  $("#allArticleContainer").hide();
  try {
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
        if (data && data.status == true) {
          Volumes = data.volumes;
          if (Volumes.length) {
            constructUI(Volumes);
          }
        } else {
        }
      });
  } catch (error) {}
}
// <div><h5 class="card-title">${element.title}</h5></div>
function constructUI(Volumes) {
  let fileManagerElem = "";
  fileManagerElem += `<div class="row">`;
  Volumes.forEach((element) => {
    fileManagerElem += `<div class="col-lg-2 col-md-4 col-sm-3 pt-5">
            <div role="button" volumeID="${element._id}" onclick="OpenVolumeAndGetIssues('${element._id}')">
            <img class="img-fluid" src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/folder-blue-512.png" />
            <div class="card-body position_volume"></div>
            </div>
            <div class="text-center mt-2">${element.title}</div>
        </div>`;
  });
  fileManagerElem += `</div>`;
  $("#allVolumesContainer").html(fileManagerElem);
}

async function OpenVolumeAndGetIssues(volumeID) {
  $("#allArticleContainer").hide();
  $("#allVolumesContainer").hide();
  $("#allIssuesContainer").empty();
  $("#allIssuesContainer").show();
  $("#go-back").show();
  $("#go_back_issue").hide();
  if (volumeID === null || volumeID === "") {
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
  if (data.status && data.issues && data.issues.length) {
    let issuefilemanagerElem = "";
    issuefilemanagerElem += `<div class="row">`;
    data.issues.forEach((issue) => {
      const { title, _id } = issue;
      if (title !== null && title !== "" && _id !== null) {
        issuefilemanagerElem += `<div class="col-lg-2 col-md-4 col-sm-3 pt-5">
                    <div role="button" volumeID="${_id}" onclick="OpenIssueAndGetArticle('${_id}')">
                    <img class="img-fluid" src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/folder-blue-512.png" />
                        <div class="card-body">
                            <h5 class="card-title">${title}</h5>
                        </div>
                    </div>
                </div>`;
      }
    });
    issuefilemanagerElem += `</div>`;
    $("#allIssuesContainer").html(issuefilemanagerElem);
  } else {
    let noIssues = `<div class="row">
            <div class="col-lg-3 offset-lg-3">
                <img class="img-fluid" style="width: 450px;" src="" alt="">
            </div>
        </div>`;
    noIssues += `<h4 class="text-center text-primary">No Issues!</h4>`;
    $("#allIssuesContainer").html(noIssues);
  }
}

function goBack() {
  $("#allIssuesContainer").hide();
  $("#allVolumesContainer").show();
  $("#allArticleContainer").hide();
  $("#go_back_issue").hide();
  $("#go-back").hide();
}
function goBackIssue() {
  $("#allIssuesContainer").show();
  $("#allVolumesContainer").hide();
  $("#allArticleContainer").hide();
  $("#go_back_issue").hide();
  $("#go-back").show();
}
var articleslist;
async function OpenIssueAndGetArticle(issueID) {
  $("#allIssuesContainer").hide();
  $("#allVolumesContainer").hide();
  $("#allArticleContainer").show();
  $("#go-back").hide();
  $("#go_back_issue").show();
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
    let articlelem = "";
    articleslist = data.articles;
    articleslist.forEach((article) => {
      let authorNames = "";
      if (article && article.authorNames && article.authorNames.length) {
        article.authorNames.forEach((author) => {
          authorNames += `<span style="color: #F07317; margin-right: 5px;font-size: 12px;
                    font-weight: 600;">
                        <i class="fa-regular fa-user" style="background-color: black; color: white; padding: 5px; font-size: 6px; border-radius: 50px; margin-right: 3px;"></i>
                        ${author}
                    </span>`;
        });
      }
      let trimmedTitle = article.title.substr(0, 45);
      let dots = "";
      if (article.title.length > 45) {
        dots = "...";
      } else {
        dots = "";
      }
      articlelem += `<div class="edu-course course-style-4 course-style-8 background ml-5">
            <div class="inner w-100">
                <div class="content">
                    <div class="row">
                    <div style="position: relative;">
                    <a class="articl-title">${article.articletype || ""}</a>
                    <span style="position: absolute; top: 0; right: 0;">
                        <a target="_blank" href="/${article.pdffilepath}">
                            <i class="fa-regular fa-file-pdf" style="font-size:20px;color:#F07317;"></i>
                        </a>
                    </span>
                </div>
                        
                    </div>
                    <h6 class="title">
                    <a title="${
                      article.title
                    }" class="cursor-pointer" onclick="increaseViews('${
        article._id
      }')" style="font-size:16px;">${article.title}</a>
                </h6>

                    <p class="doi" style="color: gray; font-size: 10px!important;">
                    ${article.citation}
                    <ul class="course-meta mb-3">
                        ${authorNames}
                    </ul>
                    </p>

                    <div style="max-height: 120px !important;overflow-y: hidden !important;margin-bottom: 15px;">${article.abstract || ""}</div>
                                    <a class="doi" style="font-size: 10px;">doi: ${article.dio || '10.3389/fnagi.2023.1340706'} </a>
                                    <div style="border-bottom: 2px solid #e0e0e0; width:80%; margin-top:5px;"></div>
                                    <ul class="course-meta" style="margin-top: 10px;">
                                        <li><i class="icon-24"></i><span class="date" style="font-size: 10px;">Published on ${formatDate(
                                          article.publisheddate
                                        )}</span></li>
                                        <li><i class="icon-25 ml-4"></i><span class="date" style="font-size: 10px;" id="views-${
                                          article._id
                                        }">${
        article.views || 0
      } views</span></li>
                                    </ul>
                    
                </div>
            </div>
    </div>`;
    });
    $("#allArticleContainer").html(articlelem);
  } else {
    let noArticles = `<h4 class="text-center text-primary">No Articles!</h4>`;
    $("#allArticleContainer").html(noArticles);
  }
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
