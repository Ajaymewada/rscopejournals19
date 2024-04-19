$(() => {
    getData();
})
function getData() {
    const url = '/getArticleTypes';
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data && data.status === true && data.data !== null) {
                const { articletypes, keywords, metatitle} = data.data;
                const description = data.data.description;
                if(metatitle) {
                    document.title = metatitle;
                }
                if(description) {
                    document.getElementsByTagName('meta')["description"].content = description;
                }
                if(keywords && keywords.length) {
                    document.getElementsByTagName('meta')["keywords"].content = keywords.join(",");
                }
                $("#articletypes_Container").html(articletypes || "");
            //    $("#processing_charge_Container").addClass('background');
            }
        })
}