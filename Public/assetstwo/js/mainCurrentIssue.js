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
          getAllInPressArticles(journal._id);
          console.log(journal);
        }
      });
  }
}

// $(() => {
//   getAllInPressArticles();
//   updateRightSideNavMenu();
// });

var articleslist;

function getAllInPressArticles(journalid) {
  if (journalid) {
    const url = `/getInPressArticles/${journalid}`;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        $(".loader-wrapper").addClass('d-none');
        if (
          data &&
          data.status === true &&
          data.articles &&
          data.articles.length
        ) {
          articleslist = data.articles;

          if (articleslist.length) {
            const articleContainer = $("#currentIssueContainer");
            let articleHTML = "";

            articleslist.forEach((article) => {
              const authorNamesHTML = generateAuthorNamesHTML(
                article.authorNames
              );

              articleHTML += `
                                <div class="col-lg-12 mb-5 background">
                                    <div class="row">
                                        <div class="edu-course course-style-4 course-style-14" style="width: 100%; box-sizing: border-box;">
                                            <div class="inner">
                                                <div class="content">
                                                    <div style="position: relative;">
                                                        <a class="articl-title">${
                                                          article.articletype ||
                                                          ""
                                                        }</a>
                                                        <span style="position: absolute; top: 0; right: 0;">
                                                            <a target="_blank" href="/${
                                                              article.pdffilepath
                                                            }">
                                                                <i class="fa-regular fa-file-pdf" style="font-size:20px;color:#F07317;"></i>
                                                            </a>
                                                        </span>
                                                    </div>
                                                    <h6 class="title">
                                                        <a title="${
                                                          article.title
                                                        }" class="cursor-pointer" onclick="increaseViews('${article._id}')" style="font-size:16px;">${article.title}</a>
                                                    </h6>
                                                    <p style="margin-bottom: 5px;">
                                                        ${authorNamesHTML}
                                                    </p>
                                                    <div class="course-rating">
                                                        <span class="rating-count"></span>
                                                    </div>
                                                    <p style="color: gray; font-size: 10px!important;">${article.citation}</p>
                                                    <div style="max-height: 120px !important;overflow-y: hidden !important;margin-bottom: 15px;">${article.abstract || ""}</div>
                                                    <a class="doi" style="font-size: 10px;">doi: ${article.dio || '10.3389/fnagi.2023.1340706'}</a>
                                                    <div style="border-bottom: 2px solid #e0e0e0; width:80%;"></div>
                                                    <ul class="course-meta" style="margin-top: 10px; margin-left:5px;">
                                                        <li><i class="icon-24"></i><span class="date" style="font-size: 10px;">Published on ${formatDate(
                                                          article.publisheddate
                                                        )}</span></li>
                                                        <li><i class="icon-25" style="margin-left:10px;"></i><span class="date" style="font-size: 10px;" id="views-${
                                                          article._id
                                                        }">${
                article.views || 0
              } views</span></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
            });

            articleContainer.html(articleHTML);
          }
        } else {
          // Handle the case where no data or articles are available
        }
      });
  } else {
    $(".loader-wrapper").addClass('d-none');
  }
}

function generateAuthorNamesHTML(authorNames) {
  if (!authorNames || authorNames.length === 0) {
    return "";
  }

  return `
        <p class="course-meta mt-3">
            <strong style="margin-right:5px;font-weight:200;font-size:13px;">Author :</strong>
            ${authorNames
              .map(
                (author) => `
                <span style="color: #F07317; margin-right: 5px;font-size: 12px;
                font-weight: 600;">
                    <i class="fa-regular fa-user" style="color: black; padding: 0px; font-size: 10px; border-radius: 50px; margin-right: 3px;"></i>
                    ${author}
                </span>`
              )
              .join("")}
        </p>`;
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// async function increaseViews(articleId) {
//     if (articleId != null) {
//       try {
//         const response = await fetch(`/updateArticleViews`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             "article_id": articleId
//           })
//         });
//         let data = await response.json();
//         console.log(response);
//         window.open(`/articlepage?article_id=${articleId}`, '_blank');
//       } catch (error) {
//         // Handle errors
//         console.error("Error updating views:", error);
//       }
//     }
//   }

// // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Right side Nav Container >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function  updateRightSideNavMenu() {
 const url = `/getInPressArticles/${journalid}`
  const requestOptions = {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
  };

  fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
          if (data && data.status === true && data.articles && data.articles.length) {
              articleslist = data.articles;

              if (articleslist.length) {
                  const articleContainer = $("#rightSideNavContainer");
                  let articleHTML = "";

                  articleslist.forEach((article) => {
                      const authorNamesHTML = generateAuthorNamesHTML(article.authorNames);

                      articleHTML += `
                          <div class="col-lg-12">
                              <div class="row">
                                      <div class="inner">
                                          <div class="content" style="margin-top:-15px;">
                                              <div>
                                              <h6 class="title">
                                          </h6>
                                          <div
                                              style="border-bottom: 2px solid #e0e0e0; width:80%;margin-bottom:15px;">
                                          </div>

                                              </div>
                                              <p class="title">
                                                  <a title="${article.title}" class="cursor-pointer" onclick="increaseViews('${article._id}')" style="font-size:16px;">${article.title}</a>
                                              </p>
                                              <p style="margin-bottom: 5px;">
                                                  ${authorNamesHTML}
                                              </p>
                                              <div class="course-rating">
                                                  <span class="rating-count"></span>
                                              </div>
                                              <p class="" style="color: gray; font-size: 10px!important;">
                                                  Foods 2024, 13(1), 151; https://doi.org/10.3390/foods13010151 (registering DOI) - ${formatDate(article.publisheddate)}
                                              </p>

                                              <a class="doi" style="font-size: 10px;">doi: 10.3389/fnagi.2023.1340706</a>

                                              <ul class="course-meta" style="margin-top: 0px;">
                                                  <li></i><span class="date orange course-price1" style="font-size: 10px;">Published on ${formatDate(article.publisheddate)}</span></li>

                                              </ul>
                                      </div>
                                  </div>
                              </div>
                          </div>`;
                  });

                  articleContainer.html(articleHTML);
              }
          } else {
              // Handle the case where no data or articles are available
          }
      });
}

