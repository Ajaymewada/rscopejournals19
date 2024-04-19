function getAllJournals() {
  const url = '/journalmanagement/App/controllers/Journal/getAllJournals';
  const requestOptions = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  };
  fetch(url, requestOptions)
      .then(response => response.json())
      .then(async data => {
          console.log(data)
          if (data && data.status && data.data && data.data.length) {
              let Journals = data.data;
              let options = '<option value="">Select Journal</option>';
              Journals.forEach((item) => {
                  options += `<option value="${item.JournalName}">${item.JournalName}</option>`; // Set both value and display text to the journal name
              })
              $("#journalSelect").html(options);
          }
      })
}







function handlesaveContact(e) {
  e.preventDefault();
  let issuerelated = document.getElementsByName("flexRadio");
  for (const radioButton of issuerelated) {
    if (radioButton.checked) {
      issuerelated = radioButton.value;
      break;
    }
  }

  const journalscategory = document.getElementById(
    "journalSelect"
  ).value;
  const subject = document.getElementById("form_subject").value;
  const fullname = document.getElementById("form_fullname").value;
  const email = document.getElementById("form_email").value;
  const message = document.getElementById("form_message").value;

  // Validate form fields
  if (issuerelated === "") {
    alert("Please select your Category!");
    return;
  } else if (journalscategory === "") {
    alert("Please Enter Your journalscategory");
    return;
  } else if (subject === "") {
    alert("Please enter your subject");
    return;
  } else if (fullname === "") {
    alert("Please enter your fullname");
    return;
  } else if (email === "") {
    alert("Please enter your email");
    return;
  } else if (message === "") {
    alert("Please enter your message");
    return;
  }

  // Log form values to console
  console.log(
    issuerelated,
    journalscategory,
    subject,
    email,
    fullname,
    message
  );

  // Prepare data to be sent via email
  const bodyValues = {
    flexRadio: issuerelated,
    journalSelect: journalscategory,
    form_subject: subject,
    form_fullname: fullname,
    form_email: email,
    form_message: message,
  };
  console.log(bodyValues);
  sendEmail(bodyValues);
}

function sendEmail(bodyValues) {
  const serviceID = "service_44jbxle";
  const tempID = "template_3277mk7"; 

  emailjs
    .send(serviceID, tempID, bodyValues)
    .then((res) => {
      console.log("Email sent successfully:", res);
      $(".successErrorMsg").removeClass("d-none alert-danger");
      $(".successErrorMsg").addClass("alert-success");
      $(".successErrorMsg").text("Email sent successfully!");
            document.getElementById("contact_form").reset();      

    })
    .catch((err) => {
      console.error("Email sending error:", err);
      $(".successErrorMsg").removeClass("d-none");
      $(".successErrorMsg").text("Failed to send email. Please try again later.!");
            document.getElementById("contact_form").reset();      

    });
}


// Call the getAllJournals function to populate the select dropdown initially
getAllJournals();


