var JournalData = document.getElementById("JournalDataElm").innerHTML;
JournalData = JSON.parse(JournalData);
console.log(JournalData);

setTimeout(() => {
  getJournalById();
}, 1000);

// $(() => {
//   getAimsAndScopeByJournalId();
// });

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
      .then(async (data) => {
        $(".loader-container").hide();
        if (data && data.status) {
          const { journal } = data;
          await localStorage.setItem("JournalInfo", JSON.stringify(journal));
          // document.getElementById("coverBannerImgID").src = journal.CoverBanner.path;
          $("#ISSNNOID").text(journal.ISSNNumber || "NA");
          $("#journaltitlecontainerID").text(journal.JournalName);
          $("#JournalDesc").html(journal.About);
          console.log(journal);
          getEditorialOfficeByJournalId();
        }
      });
  }
}

function getEditorialOfficeByJournalId() {
  let JournalDetails = JSON.parse(localStorage.getItem("JournalInfo"));
  console.log(JournalDetails);
  if (JournalDetails && JournalDetails._id) {
    const url = `/getEditorialOfficeByJournalId/${JournalDetails._id}`;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then(async (data) => {
        if (data && data.status) {
          const { contactDetails, keywords, metatitle } = data.data[0];
          document.title = metatitle;
          document
            .querySelector('meta[name="description"]')
            .setAttribute("content", data.data[0].description);

          $("#editorial_office_Container").html(contactDetails);
          if (keywords && Array.isArray(keywords) && keywords.length) {
            document
              .querySelector('meta[name="keywords"]')
              .setAttribute("content", keywords.join(','));
          }
        }
      });
  }
}