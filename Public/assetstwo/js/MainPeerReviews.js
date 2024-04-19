$(() => {
    getData();
})
function getData() {
    const url = '/getpeerreview';
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data && data.status === true && data.data !== null) {
                const { peerreview, keywords,metatitle } = data.data;
                let description = data.data.description;
                if(metatitle) {
                    document.title = metatitle;
                }
                if(description) {
                    document.getElementsByTagName('meta')["description"].content = description;
                }
                if(keywords && keywords.length) {
                    document.getElementsByTagName('meta')["keywords"].content = keywords.join(",");
                }
                $("#peer_review_Container").html(peerreview || "");
               $("#peer_review_Container").addClass('background');
            }
        })
}


