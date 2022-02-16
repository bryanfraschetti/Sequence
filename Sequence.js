var redirect_uri = "http://127.0.0.1:5500/index.html"

var client_id = ""
var client_secret = ""

const AUTHORIZE = "https://accounts.spotify.com/authorize"

function onPageLoad(){}

function requestAuthorization(){
    client_id = document.getElementById("clientId").value
    client_secret = document.getElementById("clientSecret").value

    let url = AUTHORIZE
    url += "?client_id=" + client_id
    url += "&response_type=code"
    url += "&redirect_uri=" + encodeURI(redirect_uri)
    url += "&show_dialog=true"
    url += "&scope=user-read-currently-playing playlist-modify-private playlist-modify-public"
    window.location.href = url
}