// // var editor = CKEDITOR.replace('aboutJournalID', {
// //     // height: 350
// // });
// // Usage
// let sourceID1 = "aboutJournalID"
// let labelText1 = "About Journal" + `<span class="text-danger">*<span>`
// // let sourceID2 = "descriptionID"
// // let labelText2 = "Add Description" + `<span class="text-danger">*<span>`

// const aboutjournal = new GenerateCkEditor();
// // const description = new GenerateCkEditor();

// const textareaElement1 = aboutjournal.create(sourceID1, labelText1);
// // const textareaElement2 = description.create(sourceID2, labelText2);

// $("#aboutJournalContainer").html(textareaElement1);
// // $("#descriptionArea").html(textareaElement2);


// // Initialize CKEditor on the created textarea
// aboutjournal.initEditor(sourceID1);
// // description.initEditor(sourceID2);

// const sideListCls = new GenerateSideNav();
// const sideList = sideListCls.create("mainMenu", "Add Journal");
// $("#sidebarnav").html(sideList);

// document.title = "Journal";

// function saveData() {
//     let about = aboutjournal.getData(sourceID1)
//     let name = document.getElementById("journalTitle").value;
//     let ISSN = document.getElementById("issnNumber").value;
//     if (name == null || name == "") {
//         console.log("Enter Name!");
//         $(".validationalert").removeClass('d-none')
//         $(".validationalert").text("Enter Journal Title!");
//         return;
//     } else if (ISSN == null || ISSN == "") {
//         console.log("Enter ISSN!");
//         $(".validationalert").removeClass('d-none')
//         $(".validationalert").text("Enter Journal ISSN!");
//         return;
//     } else if (about == null || about == "") {
//         console.log("Enter about!");
//         $(".validationalert").removeClass('d-none')
//         $(".validationalert").text("Enter About Journal!");
//         return;
//     } else {
//         $(".validationalert").addClass('d-none');
//         console.log(name, about, ISSN);
//         const dataToSend = {
//             name: name,
//             issn: ISSN,
//             about: about,
//             description: "Description of the journal...",
//             keywords: ["keyword1", "keyword2"],
//             coverbanner: ""
//         };

//         const url = '/addjournal';

//         const requestOptions = {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(dataToSend)
//         };

//         // Send the POST request
//         // fetch(url, requestOptions)
//         //     .then(response => {
//         //         if (response.ok) {
//         //             return response.json();
//         //         } else {
//         //             throw new Error('Failed to add journal');
//         //         }
//         //     })
//         //     .then(data => {
//         //         console.log('Journal added successfully:', data);
//         //     })
//         //     .catch(error => {
//         //         console.error('Error:', error);
//         //     });
//     }

// }
