$(() => {
    getData();
})
function getData() {
    const url = '/getWhySubmit';
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
                const { whysubmit, keywords, metatitle} = data.data;
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
                $("#whysubmit_container").html(whysubmit || "");
            //    $("#processing_charge_Container").addClass('background');
            }
        })
}