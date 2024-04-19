$(() => {
    getData();
})
function getData() {
    const url = '/getDocumentForAuthor';
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(async data => {
            // console.log(data)
            if (data && data !== null) {
                const { keywords, name, metatitle,description} = data;
                if(metatitle) {
                    document.title = metatitle;
                }
                if(description) {
                    document.getElementsByTagName('meta')["description"].content = description;
                }
                if(keywords && keywords.length) {
                    document.getElementsByTagName('meta')["keywords"].content = keywords.join(",");
                }
                $("#forAuthorsContainer").html(name || "");
                document.title = title || "For Authors";
            }
        })
}