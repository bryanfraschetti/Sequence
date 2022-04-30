//some important uris to redirect to
var redirect_uri = "http://127.0.0.1:8080/index/index.html";
var home_uri = "http://127.0.0.1:8080/home/home.html";

//app credentials
var client_id = "2843145f9a1341e6b0d6f8ea156c5f69";
var client_secret = "ec2d2ede8f2e4e40873040bc6e06750a";

//Static Spotify Endpoints
const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";

//When html body loads, this function runs
function onPageLoad(){
    // client_id = localStorage.getItem("client_id");
    // client_secret = localStorage.getItem("client_secret");

    if(window.location.search.length > 0){//query string including ?
        handleRedirect();
    }
}

function handleRedirect(){//happens once the body loads
    let code = getcode();
    fetchAccessToken(code);//execute this function which is essentially passed the return value of getcode()
    window.history.pushState("", "", redirect_uri);//adds this page to history stack
}

function getcode(){
    let code = null;
    const queryString = window.location.search;//get query string
    if(queryString.length > 0){//pretty much always true since query string includes ?
        const urlParams = new URLSearchParams(queryString);//returns an object of the query string
        code = urlParams.get('code');//get value of object property code
    }
    return code;
}

function fetchAccessToken(code){
    let body = "grant_type=authorization_code";//grant type is auth code
    body += "&code=" + code;//the return value of getcode()
    body += "&redirect_uri=" + encodeURI(redirect_uri);//encode redirect_uri (index.html)
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;//app credentials
    callAuthorizationApi(body);//call api with this body
}

function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);//post to spotify token uri
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));//request headers
    xhr.send(body);//send the body to the server
    xhr.onload = handleAuthorizationResponse; //setting onload property to the handleAuthorization property
}

function handleAuthorizationResponse(){
    if(this.status == 200){//successful connection
        var data = JSON.parse(this.responseText);
        if(data.access_token != undefined){
            access_token = data.access_token;//get access token and set it in local storage
            localStorage.setItem("access_token", access_token);
        }
        if(data.refresh_token != undefined){
            refresh_token = data.refresh_token;//get and set refresh token
            localStorage.setItem("refresh_token", refresh_token);
        }
        window.location.href = home_uri;//redirect to home page as we have successfully got tokens
    }
    else {
        alert(this.responseText);
    }
}

function requestAuthorization(){//happens on button click
    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret);

    let url = AUTHORIZE;//redirect to spotify permission requests
    url += "?client_id=" + "2843145f9a1341e6b0d6f8ea156c5f69";
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-currently-playing%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public";//requested permissions
    window.location.href = url;//
}