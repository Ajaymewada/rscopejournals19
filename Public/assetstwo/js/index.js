$(document).ready(function () {
    getData();
    getCoverbanner();
    getArticles();
})

var currentPage = 1; // Initial page number

function getData() {
    const url = '/getjournal';

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            if (data && data.status === true) {
                // console.log(data);
                const { about, issn, name } = data.data
                $("#journaltitlecontainerID h5")
                .text(name || "") 
                .css({
                        'font-size': '6px', 
                        'font-weight': 'bold'
                    });

                $("#journaltitlecontainerID h5").text(issn || "");
                $("#journalaboutID").html(about || "")
            }
        })
}

function getCoverbanner() {
    const cacheBuster = Date.now();
    const url = `/getcoverbanner?cacheBuster=${cacheBuster}`;

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
             'Cache-Control': 'no-cache',
             'Pragma': 'no-cache', 
            'If-Modified-Since': '0' 
        }
    };
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data && data.status === true) {
                console.log(data);
                $("#coverBannerImgID").attr('src', data.data.path)
            }
        })
}

function getArticles() {
    const url = '/getArticlesPaginationWise';
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pageNumber: currentPage
        })
    };
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            $(".loader").addClass('d-none');
            // $(".preloader").addClass('d-none');
            if (data !== null && data.status === true && data.articles !== null) {
                const totalDocuments = data.totalArticles || 0;
                const perPage = 5;
                if (currentPage === 1) {
                    paginator.initPaginator({
                        'totalPage': Math.ceil(totalDocuments / perPage),
                        'previousPage': 'Previous',
                        'nextPage': 'Next', 
                        'triggerFunc': updatePaginationUI
                    });
                }
                let articleslist = data.articles;
                articlesListGlobal = data.articles;
                if (articleslist.length) {
                    let articlelem = ""
                    articleslist.forEach(article => {
                        let authorNames = ""
                        if (article && article.authorNames && article.authorNames.length) {
                            article.authorNames.forEach(author => {
                                authorNames += `<li><i class="fa-solid fa-user-tie" style="font-size:20px;color:#9bd4ee;margin-right:5px;"></i>${author}</li>`
                            })
                        }
                        let trimmedTitle = article.title.substr(0, 45);
                        // console.log(trimmedTitle);
                        // console.log(article.title.length);
                        let dots = ""
                        if (article.title.length > 45){
                            dots = "..."
                        } else {
                            dots = ""
                        }
                        // console.log(dots);
                        articlelem += `<div class="edu-course course-style-4 course-style-8">
                                        <div class="inner">
                                            <div class="content">
                                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                                    <h6 class="title">
                                                        <a href="/articlepage?article_id=${article._id}" target="_blank" title="${article.title}">${trimmedTitle + dots}</a>
                                                    </h6>
                                                    <a target="_blank" href="${article.pdffilepath}"><i class="fa-solid fa-file-pdf" style="font-size:25px;color:red;"></i></a>
                                                </div>
                                                <ul class="course-meta">
                                                    ${authorNames}
                                                </ul>
                                                <ul class="course-meta">
                                                    <li>${article.abstract || ""}</li>
                                                    <li>${article.citation || ""}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>`
                    });
                    $("#articleDataContainer").html(articlelem)
                }
            }
        })
}

function updatePaginationUI() {
    var selectdPg = $('.js-paginator').data('pageSelected');
    console.log(selectdPg);
    if (selectdPg !== null) {
        currentPage = selectdPg;
        getArticles();
        $('html, body').animate({
            scrollTop: $('#articleDataContainer').offset().top - 150
        }, 500);
    }
}