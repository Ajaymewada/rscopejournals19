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
      .then((data) => {
        $(".loader-container").hide();
        if (data && data.status) {
          const { journal } = data;
          localStorage.setItem("JournalInfo", JSON.stringify(journal));
          // document.getElementById("coverBannerImgID").src = journal.CoverBanner.path;
          $("#ISSNNOID").text(journal.ISSNNumber || "NA");
          $("#journaltitlecontainerID").text(journal.JournalName);
          $("#JournalDesc").html(journal.About);
          // console.log(journal);
          getAimsAndScopeByJournalId(journal._id);
        }
      });
  }
}

function getAimsAndScopeByJournalId(journalid) {
  if (journalid) {
    const url = `/getaimsscopebyjournalid/${journalid}`;
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
          const { aimsandscope, keywords, metatitle } = data.data[0];
          // $("#aimsAndScopeTitle").text(metatitle);
          document.title = metatitle;
          document
            .querySelector('meta[name="description"]')
            .setAttribute("content", data.data[0].description);

          $("#aimandscopeDesc").html(aimsandscope);
          if (keywords && Array.isArray(keywords) && keywords.length) {
            document
              .querySelector('meta[name="keywords"]')
              .setAttribute("content", keywords.join(","));
          }
        } else {
          $("#aimandscopeDesc").html(`<h1>No Aims And Scope Data</h1>`);
        }
      });
  }
}
