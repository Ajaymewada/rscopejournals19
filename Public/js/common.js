// Function to get the value of a cookie by name
function getCookieValue() {
    const cookies = document.cookie.split('; ');

    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');

        if (cookieName === "jwt_token") {
            return decodeURIComponent(cookieValue);
        }
    }

    return null;
}

function navigatetopage(url) {
    // event.preventDefault(); // Prevent the default link behavior
    const protectedURL = url;
    const token = getCookieValue();
    if (token == null) {
        window.location.href = '/authlogin';
    } else {
        const modifiedURL = `${protectedURL}?_encoding=${token}`;
        window.location.href = modifiedURL; // Navigate to the modified URL
    }
}

async function logoutAdmin() {
    var data = {
        token: getCookieValue()
    }
    const response = await fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    await response.json();
    document.cookie = `jwt_token=`;
    window.location.href = '/authlogin';
}

function checkLogout() {
    const token = getCookieValue();
    // OR const logoutTime = sessionStorage.getItem('logout');
    if (token === "") {
        window.location.href = '/authlogin';
    }
}

// Check every 1 second (adjust interval as needed)
setInterval(checkLogout, 1000);

// const logoutDuration = 30 * 60 * 1000; // 30 minutes in milliseconds

// function checkAutoLogout() {
//     const loginTime = parseInt(localStorage.getItem('loginTime'));
//     // OR const loginTime = parseInt(sessionStorage.getItem('loginTime'));

//     if (loginTime && Date.now() - loginTime > logoutDuration) {
//         logoutAdmin();
//     }
// }

// // Check every 1 minute (adjust interval as needed)
// setInterval(checkAutoLogout, 60000); // 1 minute in milliseconds

$(() => {
    let username = localStorage.getItem('username');
    if (username != null && username != "") {
        username = username.charAt(0).toLocaleUpperCase() + username.substr(1);
        $(".userName").text(username)
    }
})

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
                let options = '<option value="">Select One</option>';
                Journals.forEach((item) => {
                    options += `<option value="${item._id}">${item.JournalName}</option>`
                })
                $("#journalSelect").html(options);
                return Journals;
            }
        })
}


