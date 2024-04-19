$(document).ready(function () {
    var articleID = GetParameterValues('article_id');
    if (articleID && articleID !== null && articleID !== "") {
        getArticleData(articleID);
    } else {
        $("#articleViewContainer").html(`<h1 class="text-center text-primary">No Data Found!</h1>`);
    }
    function GetParameterValues(param) {
        var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < url.length; i++) {
            var urlparam = url[i].split('=');
            if (urlparam[0] == param) {
                return urlparam[1];
            }
        }
    }
});

async function getArticleData(articleID) {
    let response = await fetch("/getArticleByID", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            article_id: articleID
        })
    })
    let data = await response.json();
    if (data && data.article) {
        constructUID(data.article);
    } else {
        $("#articleViewContainer").html(`<h4 class="text-center text-primary my-5 py-5">No Data Found!</h4>`);
    }
}

function constructUID(article) {
    let articlelem = ""
    let authorNames = ""
    if (article && article.authorNames && article.authorNames.length) {
        article.authorNames.forEach(author => {
            authorNames += `<span style="color: #F07317; margin-right: 5px;font-size: 12px;
            font-weight: 600;">
                <i class="fa-regular fa-user" style="background-color: black; color: white; padding: 5px; font-size: 6px; border-radius: 50px; margin-right: 3px;"></i>
                ${author}
            </span>`
        })
    }
    articlelem += `<div class="edu-course course-style-4 course-style-8 background mb-3">
                        <div class="inner">
                            <div class="content">
                                <div class="row py-4">
                                <div style="position: relative;">
                                <a class="articl-title">${article.articletype || ""}</a>
                                <span style="position: absolute; top: 0; right: 0;">
                                    <a target="_blank" href="${article.pdffilepath}">
                                        <i class="fa-regular fa-file-pdf" style="font-size:20px;color:#F07317;"></i>
                                    </a>
                                </span>
                            </div>
                                    
                                       

                            
                                    
                                </div>
                                <h6 class="title">
                                <a title="${article.title}" class="cursor-pointer" onclick="increaseViews('${article._id}')" style="font-size:16px;">${article.title}</a>
                            </h6>

                                <p class="doi" style="color: gray; font-size: 10px!important;">
                                ${article.citation}
                                <ul class="course-meta mb-3">
                                    ${authorNames}
                                </ul>

                                <p class="doi" style="color: gray; font-size: 10px!important;">
                                ${article.citation}
                            </p>

                            <div style="max-height: 120px !important;overflow-y: hidden !important;margin-bottom: 15px;">${article.abstract || ""}</div>
                                                <a class="doi" style="font-size: 10px;">doi: ${article.dio || '10.3389/fnagi.2023.1340706'}</a>
                                                <div style="border-bottom: 2px solid #e0e0e0; width:80%; margin-top:5px;"></div>
                                                <ul class="course-meta" style="margin-top: 10px;">
                                                    <li><i class="icon-24"></i><span class="date" style="font-size: 10px;">Published on ${formatDate(article.publisheddate)}</span></li>
                                                    <li><i class="icon-25"></i><span class="date" style="font-size: 10px;" id="views-${article._id}">${article.views || 0} views</span></li>
                                                </ul>
                                
                            </div>
                        </div>
                </div>`
    $("#articleViewContainer").html(articlelem);
}


function formatDate(dateString) {
    if (!dateString) {
        return "";
    }
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}


