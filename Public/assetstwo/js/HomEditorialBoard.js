function fetchAndRenderLatestEditorialBoard() {

    const url = '/getLatestEditorialBoard';


    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            const editorialBoardMembers = data.data;

            let EditorialBoardHtmlElm = '';

            editorialBoardMembers.forEach((ebm) => {
                EditorialBoardHtmlElm += `<div class="col-lg-2 col-sm-4 col-6 sal-animate" data-sal-delay="50" data-sal="slide-up" data-sal-duration="800">
                                <div class="edu-team-grid team-style-1 swiper-wrapper">
                                    <div class="inner swiper-slide">
                                        <div class="thumbnail-wrap">
                                            <div class="thumbnail">
                                                <a href="#" class="text-center">
                                                    <img src="${ebm.image}" class="size size_small" alt="Dr. Catherine J. Andersen">
                                                </a>
                                            </div>

                                        </div>
                                        <div class="content">
                                            <h5 class="title"><a href="#" class="font">${ebm.name}</a></h5>

                                        </div>
                                    </div>
                                </div>
                            </div>`
            })
            $("#EditorialBoardContainerID").html(EditorialBoardHtmlElm);
            $("#EditorialBoardContainerID img").addClass("size size_small");
            $("#EditorialBoardContainerID h5").addClass("font")

        })
        .catch(error => {
            console.error('Error fetching latest editorial board:', error);
            // Handle error (e.g., display a message to the user)
        });
}

// Call the function when the page loads
window.onload = fetchAndRenderLatestEditorialBoard;
