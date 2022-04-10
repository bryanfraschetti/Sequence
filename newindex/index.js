var redirect_uri = "http://127.0.0.1:8080/index.html";
var home_uri = "http://127.0.0.1:8080/home/home.html";

var client_id = "";
var client_secret = "";

// var now = new Date();

// if(now.getHours()<8 || now.getHours()>=20){
//     document.body.style.backgroundImage = "linear-gradient(to bottom, rgb(70,70,70), rgb(0,0,0))"
// }
// // else{document.body.style.backgroundImage = "linear-gradient(to bottom right, rgba(196, 34, 161, 0.7), rgba(21, 91, 124, 0.788))";}
// else{document.body.style.backgroundImage = "linear-gradient(to bottom right, #AA8E71 30%, #71AA8E";}

/*Urls*/
const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";


const loginSubmit = document.getElementById("clientSecret"); //variable to represent client secret box

function onPageLoad(){
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");

    if(window.location.search.length > 0){
        handleRedirect();
    }
}

loginSubmit.addEventListener("keydown", function isEnter(e){
    if(e.key === "Enter"){
        e.preventDefault()
        requestAuthorization();//While a person is typing in the password bar, check to see if they hit enter
    }
})

function requestAuthorization(){
    client_id = document.getElementById("clientId").value;
    client_secret = document.getElementById("clientSecret").value;
    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret);

    if(client_id === "2843145f9a1341e6b0d6f8ea156c5f69" && client_secret === "ec2d2ede8f2e4e40873040bc6e06750a"){//if credentials are good redirect
        let url = AUTHORIZE;
        url += "?client_id=" + client_id;
        url += "&response_type=code";
        url += "&redirect_uri=" + encodeURI(redirect_uri);
        url += "&show_dialog=true";
        url += "&scope=user-read-currently-playing%20playlist-modify-private%20playlist-modify-public";
        window.location.href = url;
    }
    else{//stay on page and let them know
        document.getElementById("login-error-msg").style.opacity = 1;
    }
}

function getcode(){
    let code = null;
    const queryString = window.location.search;
    if(queryString.length > 0){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
    }
    return code;
}

function fetchAccessToken(code){
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}

function handleRedirect(){
    let code = getcode();
    fetchAccessToken(code);
    window.history.pushState("", "", redirect_uri);
}

function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse(){
    if(this.status == 200){
        var data = JSON.parse(this.responseText);
        console.log(data);
        var data = JSON.parse(this.responseText);
        if(data.access_token != undefined){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if(data.refresh_token != undefined){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        // onPageLoad();
        window.location.href = home_uri;
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}