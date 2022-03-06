var redirect_uri = "http://127.0.0.1:8080/index.html";
var home_uri = "http://127.0.0.1:8080/home/home.html";

var client_id = "";
var client_secret = "";
var access_token = "";
var refresh_token = "";

var now = new Date();

if(now.getHours()<8 || now.getHours()>=20){document.body.style.backgroundImage = "linear-gradient(to bottom, rgb(40,40,40), rgb(0,0,0))"}
else{document.body.style.backgroundImage = "linear-gradient(to bottom right, rgba(196, 34, 161, 0.7), rgba(21, 91, 124, 0.788))";}

var playlist_id = ""

const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";

function onPageLoad(){//when page loads get all credentials
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");
    access_token = localStorage.getItem("access_token");
    refresh_token = localStorage.getItem("refresh_token");
}

function refreshPlaylists(){
    callApi("GET", PLAYLISTS, null, handlePlaylistResponse);
}

function callApi(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Authorization', ' Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}

function handlePlaylistResponse(){
    if(this.status == 200){
        var data = JSON.parse(this.responseText);
        console.log(data);
        removeAllItems("playlists");
        data.items.forEach(el => addPlaylist(el));
    }
    else if(this.status == 401){
        refreshAccessToken();
    }
    else{
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function removeAllItems(elementId){
    let node = document.getElementById(elementId);
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function addPlaylist(el){
    let node = document.createElement("option");
    node.id = el.id;
    node.innerHTML = el.name;
    document.getElementById("playlists").appendChild(node);
}

function refreshAccessToken(){
    refresh_token = localStorage.getItem(refresh_token);
    let body = "grant_type=refresh_token";
    body += "refresh_token" + refresh_token;
    body += "client_id=" + client_id;
    callAuthorizationApi(body);
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
    else if(this.status == 401){
        refreshAccessToken();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
        window.location.href = redirect_uri;
    }
}

function selectPlaylist(s){
    playlist_id = s[s.selectedIndex].id;
    var TRACKS = PLAYLISTS + "/" + playlist_id + "/tracks";
    console.log(TRACKS);
    callApi("GET", TRACKS, null, handleTracksResponse);
}

function handleTracksResponse(){
    if(this.status == 200){
        document.getElementById("Tracks").style.visibility = visible;
        var data = JSON.parse(this.responseText);
        // console.log(data);
        removeAllItems("Tracks");
        data.items.forEach(el => addTracks(el));
    }
    else if(this.status == 401){
        refreshAccessToken();
    }
    else{
        console.log(this.responseText);
        alert(this.responseText);
}}

function addTracks(){}