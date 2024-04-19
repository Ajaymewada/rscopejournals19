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

          const {title, keywords, description} = journal.metadata;

          document.title = title;
          document
            .querySelector('meta[name="description"]')
            .setAttribute("content", description);
          if (keywords && Array.isArray(keywords) && keywords.length) {
            document
              .querySelector('meta[name="keywords"]')
              .setAttribute("content", keywords.join(","));
          }
          console.log(journal);
        }
      });
  }
}
