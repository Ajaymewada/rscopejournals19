async function saveData(e) {
    e.preventDefault();
    let username = $("#usernameID").val();
    let password = $("#passwordID").val();
    console.log(username, password);
    const data = {
        username: username,
        password: password
    };
    // Basic client-side validation
    if (!username || !password) {
        console.error('Both username and password are required.');
        return;
    }
    try {
        let checkBox = document.getElementById('remeberID');
        if (checkBox.checked){
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
        } else {
            localStorage.clear();
        }
        $(".commonloader").removeClass('d-none');
        const response = await fetch('/adminlogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        console.log(responseData);
        
        if (responseData.success === true) {
            $(".loginalert").addClass('d-none');
            $(".commonloader").addClass('d-none');
            setCookie(responseData.admin.token);
            const loginTime = Date.now();
            localStorage.setItem('loginTime', loginTime);
            window.location.href = `/admin?_encoding=${responseData.admin.token}`
        } else {
            $(".commonloader").addClass('d-none');
            $(".loginalert").removeClass('d-none');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

const setCookie = (token) => {
    // Get the current date and time
    const currentDate = new Date();

    // Calculate the expiration date (current date + 30 minutes)
    const expirationDate = new Date(currentDate.getTime() + 30 * 60 * 1000);
    document.cookie = `jwt_token=${token}; expires=${expirationDate.toUTCString()}`;
}

const setUsernamePass = () => {
    // Retrieving data from localStorage
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    if (savedUsername != null && savedPassword != null) {
        $("#usernameID").val(savedUsername);
        $("#passwordID").val(savedPassword);
    }
}
setUsernamePass();


