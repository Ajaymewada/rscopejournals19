$(() => {
    getAllJournals();
})

function getAllJournals() {
    const url = '/journalmanagement/App/controllers/Journal/getAllJournals';
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(async data => {
            if (data && data.status && data.data && data.data.length) {
                let Journals = data.data;
                Journals = await Journals.filter(item => item.isActive);
                displayJournals(Journals);
            }
        })
}

function displayJournals(Journals) {
    if (Journals && Journals.length) {
        let journalhtmlSci = "";
        let journalhtmlEng = "";
        let journalhtmlHlt = "";
        Journals.forEach(journal => {
            if (journal && journal.MainCategory && journal.MainCategory == "Science" && journal.JournalName) {
                journalhtmlSci += generateJournalHtmlCode(journal);
            } else if (journal && journal.MainCategory && journal.MainCategory == "Engineering" && journal.JournalName) {
                journalhtmlEng += generateJournalHtmlCode(journal);
            } else if (journal && journal.MainCategory && journal.MainCategory == "Health" && journal.JournalName) {
                journalhtmlHlt += generateJournalHtmlCode(journal);
            }
        });
        let noJournalMsg = `<div class="col-lg-12>
            <h1 class="title">No Journals</h1>
            </div>`
        if (journalhtmlSci === "") {
            journalhtmlSci = noJournalMsg;
        }
        if (journalhtmlEng === "") {
            journalhtmlEng = noJournalMsg;
        }
        if (journalhtmlHlt === "") {
            journalhtmlHlt = noJournalMsg;
        }

        $("#JournalsOfSciences").html(journalhtmlSci);
        $("#JournalsEngineering").html(journalhtmlEng);
        $("#JournalsHealth").html(journalhtmlHlt);
    }
}

function generateAcronym(name) {
    const words = name.split(' ');
    let acronym = '';
    words.forEach(word => {
        if (word.charAt(0) === word.charAt(0).toUpperCase()) {
            acronym += word.charAt(0).toUpperCase();
        }
    });
    if (acronym === "") {
        acronym = "NA"
    }
    return `[${acronym}]`;
}

function generateJournalHtmlCode(journal) {
    let journalhtml = `<div class="col-lg-4 col-md-6" data-sal-delay="50" data-sal="slide-up" data-sal-duration="800">
                        <div class="categorie-grid categorie-style-2 color-extra06-style edublink-svg-animate">
                            <div class="icon">
                                <img src="/assetsthree/images/favicon.png" alt="" srcset="">
                            </div>
                            <div class="content">
                                <h1 class="title">
                                  <a href="${journal.JournalSlug}" target="_blank" style="cursor: pointer;">${journal.JournalName + " " + generateAcronym(journal.JournalName) || "NA"}</a>
                                </h1>
                            </div>
                        </div>
                    </div>`
    return journalhtml;
}
