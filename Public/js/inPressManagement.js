document.title = "In Press";
const sideListCls = new GenerateSideNav();
const sideList = sideListCls.create("articlelinks", "In Press");
const mobilesideList = sideListCls.createMobileNav();
$(".MobileSideNavBarContainer").html(mobilesideList);
$("#sidebarnav").html(sideList);
$(() => {
  getAllInPressArticles();
});
var global_articles;
function getAllInPressArticles() {
  $(".loader").removeClass("d-none");
  const url = "/getAllInPressArticles";
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
      if (
        data &&
        data.status == true &&
        data.articles &&
        data.articles.length
      ) {
        constructUITable(data.articles);
        global_articles = data.articles;
      } else {
      }
    });
}

function constructUITable(articles) {
  if (articles.length) {
    let Articles = articles;
    let tableRow = "";
    (Articles || []).forEach((element, index) => {
      const { title, articleID, createdAt, _id, statusflag } = element;
      const newDate = new Date(createdAt);
      tableRow += `<tr>
                            <th scope="row">${index + 1}</th>
                            <td>${articleID}</td>
                            <td title="${title}">${title.substr(0, 25)}...</td>
                            <td>${newDate.toDateString()}</td>
                            <td>
                                <span class="badge fw-semibold p-2 bg-light-primary text-primary">${
                                  statusflag || "In-Press"
                                }</span>
                            </td>
                            <td>
                                <button class="btn btn-primary" onclick="moveArticle('${_id}')"><i class="fa-solid fa-pen-to-square mx-1"></i>Move</button>
                            </td>
                        </tr>`;
    });
    $("#articlesBodyContainer").html(tableRow);
  }
}

async function moveArticle(article_id) {
  console.log(article_id);
  console.log(global_articles);
  if (global_articles && global_articles.length && article_id) {
    let selectedArticle = global_articles.find(
      (art) => art._id.toString() === article_id.toString()
    );
    if (selectedArticle) {
      if (selectedArticle.journal && selectedArticle.journal.JournalName) {
        $("#bindedToJournal").text(selectedArticle.journal.JournalName);
      }
      $("#modifyEditorID").attr("editorid", article_id);
      const volumes = await getVolumesByJournal(selectedArticle.journalid);
      if (volumes && volumes.length) {
        let volumeOpt = `<option selected>Open this select menu</option>`;
        volumes.forEach((vol, index) => {
          if (vol._id && vol.title !== null && vol.title !== "") {
            volumeOpt += `<option value="${vol._id}">${vol.title}</option>`;
          }
        });
        $("#selectedVolume").html(volumeOpt);
      }
      // const { title } = selectedArticle
      $(".modal-title").text("Move Article");
      $("#modifyArticleModalID").modal("show");
    }
  }
}

function getVolumesByJournal(journalid) {
  return new Promise((resolve) => {
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
          // console.log(data)
          if (data && data.status == true) {
            console.log(data);
            resolve(data.volumes)
          } else {
            resolve(null);
          }
        });
    } catch (error) {
        resolve(null);
    }
  });
}

$("#selectedVolume").on("change", () => {
  let volume_id = $("#selectedVolume").val();
  if (volume_id !== null && volume_id !== "") {
    let requestURL = "/getIssuesByVolumeId";
    fetch(requestURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        volumeuid: volume_id,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.status && data.issues && data.issues.length) {
          let issuesOpt = `<option selected>Open this select menu</option>`;
          data.issues.forEach((iss, index) => {
            if (iss._id && iss.title !== null && iss.title !== "") {
              issuesOpt += `<option value="${iss._id}">${iss.title}</option>`;
            }
          });
          $("#selectedIssue").html(issuesOpt);
        } else {
          let issuesOpt = `<option selected>Open this select menu</option>`;
          $("#selectedIssue").html(issuesOpt);
        }
      });
  }
});

function getAllVolumes() {
  return new Promise((resolve, reject) => {
    try {
      const url = "/getAllVolumes";
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
            resolve(data);
          } else {
            resolve(null);
          }
        });
    } catch (error) {
      resolve(null);
    }
  });
}

function moveArticleHandler() {
  let article_id = $("#modifyEditorID").attr("editorid");
  let selectedVolume = $("#selectedVolume").val();
  let selectedIssue = $("#selectedIssue").val();
  try {
    if (
      article_id !== null &&
      article_id !== "" &&
      selectedVolume !== null &&
      selectedVolume !== "" &&
      selectedIssue !== null &&
      selectedIssue !== ""
    ) {
      let requestURL = "/movearticletoIssue";
      fetch(requestURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          articleuid: article_id,
          selectedVolume,
          selectedIssue,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.status) {
            $(".saveinprogress").addClass("d-none");
            $(".validationalert").removeClass("d-none alert-danger");
            $(".validationalert").addClass("alert-success");
            $(".validationalert").text("Article Moved Successfully!");
            setTimeout(() => {
              $(".validationalert").removeClass("alert-success");
              $(".validationalert").addClass("d-none alert-danger");
              $("#modifyArticleModalID").modal("hide");
              getAllInPressArticles();
            }, 3000);
          }
        });
    }
  } catch (error) {}
}
