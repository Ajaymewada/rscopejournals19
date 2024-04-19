var JournalData = document.getElementById("JournalDataElm").innerHTML;
JournalData = JSON.parse(JournalData);
console.log(JournalData);

var articleslist;

setTimeout(() => {
  getAllInPressArticles();
}, 1000);

function getAllInPressArticles() {
  if (JournalData) {
    const url = `/getInPressArticles/${JournalData}`;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        // $(".loader-wrapper").addClass("d-none");
        if (
          data &&
          data.status === true &&
          data.articles &&
          data.articles.length
        ) {
          articleslist = data.articles;

          if (articleslist.length) {
            const articleContainer = $("#rightSideNavContainer");
            let articleHTML = "";

            articleslist.forEach((article) => {
              const authorNamesHTML = generateAuthorNamesHTML(
                article.authorNames
              );

              articleHTML += `
                          <div class="col-lg-12 mb-5">
                              <div class="row">
                                      <div class="inner">
                                          <div class="content" style="margin-top:-15px;">
                                              <div>
                                              <h6 class="title">
                                          </h6>
                                    </div>
                                              <p class="title">
                                                  <a title="${
                                                    article.title
                                                  }" class="cursor-pointer" onclick="increaseViews('${
                article._id
              }')" style="font-size:16px;">${article.title}</a>
                                              </p>
                                              <p style="margin-bottom: 5px;">
                                                  ${authorNamesHTML}
                                              </p>
                                              <div class="course-rating">
                                                  <span class="rating-count"></span>
                                              </div>
                                              <p class="" style="color: gray; font-size: 10px!important;">
                                                  Foods 2024, 13(1), 151; https://doi.org/10.3390/foods13010151 (registering DOI) - ${formatDate(
                                                    article.publisheddate
                                                  )}
                                              </p>

                                              <a class="doi" style="font-size: 10px;">doi: 10.3389/fnagi.2023.1340706</a>

                                              <ul class="course-meta" style="margin-top: 0px;">
                                                  <li></i><span class="date orange course-price1" style="font-size: 10px;">Published on ${formatDate(
                                                    article.publisheddate
                                                  )}</span></li>

                                              </ul>
                                      </div>
                                  </div>
                              </div>
                              <div
                                              style="border-bottom: 2px solid #e0e0e0;width:80%;margin-bottom:15px;margin-top: 15px;">
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
    // $(".loader-wrapper").addClass("d-none");
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
