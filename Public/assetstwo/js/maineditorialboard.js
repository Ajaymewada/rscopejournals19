var JournalData = document.getElementById("JournalDataElm").innerHTML;
JournalData = JSON.parse(JournalData);
console.log(JournalData);

setTimeout(() => {
  getJournalById();
}, 1000);

function getJournalById() {
  if (JournalData && JournalData) {
      const url = `/journalmanagement/App/controllers/Journal/${JournalData}`;
      const requestOptions = {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      };
      fetch(url, requestOptions)
          .then(response => response.json())
          .then(data => {
              $(".loader-container").hide();
              if (data && data.status) {
                  const { journal } = data;
                  localStorage.setItem("JournalInfo", JSON.stringify(journal));
                  // document.getElementById("coverBannerImgID").src = journal.CoverBanner.path;
                  $("#ISSNNOID").text(journal.ISSNNumber || "NA");
                  $("#journaltitlecontainerID").text(journal.JournalName);
                  $("#JournalDesc").html(journal.About);
                  console.log(journal);
                  getEditorialBoardByJournalId();
              }
          })
  }
}
var EditorialBoardMembers = [];

function getEditorialBoardByJournalId() {
  let JournalDetails = JSON.parse(localStorage.getItem("JournalInfo"));
  if (JournalDetails && JournalDetails._id) {
    const url = `/geteditorialbyjournalid/${JournalDetails._id}`;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data);
        if (data && data.status) {
          EditorialBoardMembers = data.data;
          let editorCard = "";
          data.data.forEach((editor) => {
            const {
              name,
              image,
              affiliation,
              designation,
              intrest,
              website,
              biography,
              keywords,
            } = editor;
            let interestElem = ""
            if(intrest && intrest.length) {
              intrest.forEach((int) => {
                interestElem += `<span class="ps-2">${int},</span>`
              })
            } else {
              interestElem = "NA"
            }
            editorCard += `<div class="mb--10 sal-animate background mb-5" data-sal-delay="150" data-sal="slide-up" data-sal-duration="800">
            <div class="edu-team-grid team-style-1">
                <div class="row align-items-center">
                    <!-- Image column for larger screens -->
                    <div class="col-lg-2 col-md-1 col-sm-3 d-none d-md-block">
                        <div class="thumbnail editorialThumb">
                            <a href="team-details.html" style="border-radius: 50% !important; height: 100px !important; width: 100px !important; display: block;">
                                <img style="height: 100%; border-radius: 50;" src="../${image}" class="img-fluid" alt="team images">
                            </a>
                        </div>
                    </div>
        
                    <div class="col-lg-10 col-md-10 col-sm-10">
                        <div class="content padding-1" style="text-align: left;">
                            <div class="col-lg-12 col-md-12 ">
                                <!-- Image for smaller screens -->
                                <div class="thumbnail editorialThumb margin d-md-none mb-3">
                                    <a href="team-details.html" style="border-radius: 50% !important; height: 100px !important; width: 100px !important; display: block;">
                                        <img style="height: 100%; border-radius: 50;" src="../${image}" class="img-fluid" alt="team images">
                                    </a>
                                </div>
                                <div class="ml-4 mar">
                                <h5 class="title" title="${name}">${name}</h5>
                                <h6 class="title">
                                    <a href="${website}" style="color:#ef7720;font-size:12px;" target="_blank">Website</a>
                                </h6>
                                <span class="designation">${designation}</span>
                                <div>
                                    <span class="affiliation">${affiliation}</span>
                                </div>
                                <div>
                                    <span class="interest"style="padding-right:10px;"><strong class="interest-title">Interests: </strong>${interestElem}</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="btn bg-primarycolor text-white ml-4" onclick="openBiography('${editor._id}')" style="font-size: 10px; margin-top: 10px;border-radius:5px;">Biography</button>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        `;
          });
          $("#editorial_board_Container").html(editorCard || "");
        } else {
          $("#editorial_board_Container").html(`<h1>No Editorial Board Data</h1>`);
        }
      });
  }
}

    function openBiography(dataId) {
    console.log("sdncvsdcghs");
    if (EditorialBoardMembers.length) {
      let editor = EditorialBoardMembers.find(
        (x) => x._id.toString() == dataId.toString()
      );
      console.log(editor);
      $("#editorBiography").modal("show");
      $("#editorBiographyBody").html(editor.biography);
    }
  }