$(() => {
    getAllInPressArticles();
});

var articleslist;

function getAllInPressArticles() {
    const url = "/getInPressArticles";
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
                    let articleContainer = $("#currentIssueContainer_1");
                    let articleHTML = "";

                    articleslist.forEach((article) => {
                        let authorNamesHTML = "";
                        if (article && article.authorNames && article.authorNames.length) {
                            authorNamesHTML = `
                                <ul class="course-meta">
                                    ${article.authorNames.map((author) => `
                                        <li style="color: #F07317;">
                                            <i class="fa-regular fa-user" style="background-color: black; color: white; padding: 3px; font-size: 7.5px; border-radius: 50px; margin-right: 3px;"></i>
                                            ${author}
                                        </li>`
                                    ).join('')}
                                </ul>`;
                        }

                        let trimmedTitle = article.title.substr(0, 45);
                        let dots = article.title.length > 45 ? "..." : "";

                        articleHTML += `
                            <div class="col-lg-12">
                            <div class="row">

                            <div class="edu-course course-style-4 course-style-14 shadow"
                                style="width: 100%;box-sizing: border-box;">
                                <div class="inner">

                                    <div class="content">
                                        <h6 class="title">

                                            <a href="course-details.html"
                                                style="font-size:18px;">Popular Articles</a>
                                        </h6>
                                        <div
                                            style="border-bottom: 2px solid #e0e0e0; width:80%;margin-top:5px;">
                                        </div>

                                        <div class="course-rating">

                                            <span class="rating-count"></span>
                                        </div>
                                       
                                        <p>Special Issue in IJMS
                                            Novel Concepts, New Perspectives, and Current Therapies for Parkinson's Disease
                                            <p class="doi"
                                            style="color:gray;font-size:10px;">
                                            Guest Editor: Malgorzata Zaremba
                                            </p>
                                            
                                        </p>
                                        <div class="orange course-price1">
                                            Published on: 15 January 2024
                                        </div>
                                        <div
                                            style="border-bottom: 2px solid #e0e0e0; width:80%;margin-top:5px;">
                                        </div>
                                        
                                        

                                        <div class="course-rating">

                                            <span class="rating-count"></span>
                                        </div>
                                       
                                        <p>Special Issue in IJMS
                                            Adenylate Kinase in Human Health and Disease
                                            <p class="doi"
                                            style="color:gray;font-size:10px;">
                                            Guest Editor: Koichi Fujisawa
                                            </p>
                                            <div class="course-price1 orange">
                                                Deadline: 31 January 2024
                                            </div>
                                        </p>
                                        <div
                                            style="border-bottom: 2px solid #e0e0e0; width:80%;margin-top:5px;">
                                        </div>
                                        


                                        <div class="course-rating">

                                            <span class="rating-count"></span>
                                        </div>
                                       
                                        <p>Special Issue in IJMS
                                            Neuroinflammation in the Pathogenesis of Alzheimer's Disease and Related Dementias
                                            <p class="doi"
                                            style="color:gray;font-size:10px;">
                                            Guest Editor: Amal Kaddoumi
                                            </p>
                                            <div class="course-price1 orange">
                                                Deadline: 15 February 2024
                                            </div>
                                        </p>
                                        <div
                                            style="border-bottom: 2px solid #e0e0e0; width:80%;margin-top:5px;">
                                        </div>




                                        <div class="course-rating">

                                            <span class="rating-count"></span>
                                        </div>
                                       
                                        <p>Special Issue in IJMS
                                            Future Trends in Biomaterials and Devices for Cells and Tissues
                                            <p class="doi"
                                            style="color:gray;font-size:10px;">
                                            Guest Editors: Loredana De Bartolo, Antonella Piscioneri, Seeram Ramakrishna
                                            </p>
                                            <div class="course-price1 orange">
                                                Deadline: 27 February 2024
                                            </div>
                                        </p>
                                        <div
                                            style="border-bottom: 2px solid #e0e0e0; width:80%;margin-top:5px;">
                                        </div>

                                      
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
}


// arun updated ----------------------------------------------------------------------------------------------------/
// async function increaseViews(articleId) {
//     if (articleId != null) {
//       try {
//         const response = await fetch(/updateArticleViews, {
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
//         window.open(/articlepage?article_id=${articleId}, '_blank');
//       } catch (error) {
//         // Handle errors
//         console.error("Error updating views:", error);
//       }
//     }
//   }