$(() => {
    getData();
})
function getData() {
    const url = '/getProcessingCharge';
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
                const { processingcharge, description, keywords ,metatitle } = data.data;
                if(metatitle) {
                    document.title = metatitle;
                }
                if(description) {
                    document.getElementsByTagName('meta')["description"].content = description;
                }
                if(keywords && keywords.length) {
                    document.getElementsByTagName('meta')["keywords"].content = keywords.join(",");
                }
                $("#processing_charge_Container").html(processingcharge || "");
               $("#processing_charge_Container").addClass('background');
            }
        })
}


