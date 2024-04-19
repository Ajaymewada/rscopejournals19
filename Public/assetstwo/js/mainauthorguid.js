$(() => {
    getData();
})
function getData() {
    const url = '/getInstructionsForAuthor';
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
                const { instructions, description, keywords,metatitle } = data.data;
                if(metatitle) {
                    document.title = metatitle;
                }
                if(description) {
                    document.getElementsByTagName('meta')["description"].content = description;
                }
                if(keywords && keywords.length) {
                    document.getElementsByTagName('meta')["keywords"].content = keywords.join(",");
                }
                $("#instructions_for_Container").html(instructions || "");
                               $("#instructions_for_Container").addClass('background');
                
            }
        })
}