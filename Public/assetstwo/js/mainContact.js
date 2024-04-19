$(() => {
    getData();
});

function getData() {
    const url = '/getContactInformation';
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
            if (data && data.status === true) {
                const { contactDetails ,metatitle,description,keywords } = data.data;
                if(metatitle) {
                    document.title = metatitle;
                }
                if(description) {
                    document.getElementsByTagName('meta')["description"].content = description;
                }
                if(keywords && keywords.length) {
                    document.getElementsByTagName('meta')["keywords"].content = keywords.join(",");
                }
                $("#contactContainer").html(contactDetails || "");
                // $("#contactContainer").html(description || "");
                // $("#contactContainer").html(keywords || "");
                
                // Add the shadow class to apply the styling
                $("#contactContainer").addClass('background');
            }
        });
}

// $(document).ready(function () {
//     getData2();
//     getCoverbanner();
// });

// function getData2() {
//     const url = '/getjournal';

//     const requestOptions = {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     };
//     fetch(url, requestOptions)
//         .then(response => response.json())
//         .then(data => {
//             if (data && data.status == true) {
//                 const { about, issn, name } = data.data;
//                 $("#journaltitlecontainerID span").text(name || "");
//                 $("#journaltitlecontainerID h4").text(issn || "");
//             }
//         });
// }

// function getCoverbanner() {
//     const url = '/getcoverbanner';

//     const requestOptions = {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     };
//     fetch(url, requestOptions)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data)
//             if (data && data.status == true) {
//                 console.log(data);
//                 $("#coverBannerImgID").attr('src', data.data.path);
                
//                 // Add the shadow class to apply the styling
//                 $("#coverBannerImgID").addClass('shadow');
//             }
//         });
// }
