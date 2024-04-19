// document.title = "Cover Banner";
// const sideListCls = new GenerateSideNav();
// const sideList = sideListCls.create("mainMenu", "Cover Banner");
// $("#sidebarnav").html(sideList);

// //   const dragDropArea = document.getElementById('dragDropArea');
//   const uploadButton = document.getElementById('uploadButton');
//   const previewImage = document.getElementById('previewImage');
//   const errorMessage = document.getElementById('errorMessage');

// //   dragDropArea.addEventListener('dragover', (e) => {
// //     e.preventDefault();
// //     dragDropArea.classList.add('dragover');
// //   });

// //   dragDropArea.addEventListener('dragleave', () => {
// //     dragDropArea.classList.remove('dragover');
// //   });

// //   dragDropArea.addEventListener('drop', (e) => {
// //     e.preventDefault();
// //     dragDropArea.classList.remove('dragover');

// //     const file = e.dataTransfer.files[0];
// //     handleFile(file);
// //   });

// //   document.addEventListener('dragenter', (e) => {
// //     e.preventDefault();
// //   });

//   uploadButton.addEventListener('click', () => {
//     const fileInput = document.createElement('input');
//     fileInput.type = 'file';
//     fileInput.accept = '.jpg, .jpeg, .png';
//     fileInput.style.display = 'none';

//     fileInput.addEventListener('change', (e) => {
//       const file = e.target.files[0];
//       console.log(file);
//       const formData = new FormData();
//       formData.append('coverbanner', file);
//       fetch('/uploadcoverbanner', {
//         method: 'POST',
//         body: formData,
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json();
//         })
//         .then((data) => {
//           console.log('Upload successful:', data);
//         })
//         .catch((error) => {
//           console.error('Error:', error);
//         });
//       handleFile(file);
//     });

//     document.body.appendChild(fileInput);
//     fileInput.click();
//     document.body.removeChild(fileInput);
//   });

//   function handleFile(file) {
//     if (file) {
//       const fileType = file.type.toLowerCase();
//       const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
//         document.querySelector('.fileName').innerHTML = "File Name: " + file.name;
//       if (allowedFormats.includes(fileType)) {
//         errorMessage.classList.add('d-none');

//         const reader = new FileReader();
//         reader.onload = function (e) {
//           previewImage.src = e.target.result;
//           previewImage.classList.remove('d-none');
//         };
//         reader.readAsDataURL(file);
//       } else {
//         errorMessage.classList.remove('d-none');
//         previewImage.classList.add('d-none');
//       }
//     }
//   }

// function saveData() {

// }


















document.title = "Cover Banner";
const sideListCls = new GenerateSideNav();
const sideList = sideListCls.create("mainMenu", "Cover Banner");
const mobilesideList = sideListCls.createMobileNav();
$(".MobileSideNavBarContainer").html(mobilesideList);
$("#sidebarnav").html(sideList);

//   const dragDropArea = document.getElementById('dragDropArea');
const uploadButton = document.getElementById('uploadButton');
const previewImage = document.getElementById('previewImage');
const errorMessage = document.getElementById('errorMessage');

//   dragDropArea.addEventListener('dragover', (e) => {
//     e.preventDefault();
//     dragDropArea.classList.add('dragover');
//   });

//   dragDropArea.addEventListener('dragleave', () => {
//     dragDropArea.classList.remove('dragover');
//   });

//   dragDropArea.addEventListener('drop', (e) => {
//     e.preventDefault();
//     dragDropArea.classList.remove('dragover');

//     const file = e.dataTransfer.files[0];
//     handleFile(file);
//   });

//   document.addEventListener('dragenter', (e) => {
//     e.preventDefault();
//   });

uploadButton.addEventListener('click', () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.jpg, .jpeg, .png';
  fileInput.style.display = 'none';

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    $("#uploadloaderID").removeClass('d-none');
    if(file){
    const formData = new FormData();
    formData.append('files', file);
    fetch('/uploadCoverBanner', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if(data && data.status == true) {
          $("#uploadloaderID").addClass('d-none');
          $('#coverbanneralert').removeClass('d-none');
          handleFile(file);
          setTimeout(() => {
            $('#coverbanneralert').addClass('d-none');
          }, 3000);
        }
        // console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
    } else {
      $("#uploadloaderID").addClass('d-none');
    }
  });

  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
});

function handleFile(file) {
  if (file) {
    const fileType = file.type.toLowerCase();
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
    document.querySelector('.fileName').innerHTML = "File Name: " + file.name;
    if (allowedFormats.includes(fileType)) {
      errorMessage.classList.add('d-none');

      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.classList.remove('d-none');
      };
      reader.readAsDataURL(file);
    } else {
      errorMessage.classList.remove('d-none');
      previewImage.classList.add('d-none');
    }
  }
}