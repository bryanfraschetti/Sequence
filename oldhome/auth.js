var redirect_uri = "http://127.0.0.1:8080/index.html";
var home_uri = "http://127.0.0.1:8080/oldhome/home.html";

var client_id = "";
var client_secret = "";
var access_token = "";
var refresh_token = "";

// var now = new Date();

// if(now.getHours()<8 || now.getHours()>=20){
//     document.body.style.backgroundImage = "linear-gradient(to bottom, rgb(60,60,60), rgb(0,0,0))"
//     document.getElementById("PlaylistSection").style.background = "rgb(9, 153, 21)";
//     document.getElementById("Tracks").style.background = "rgb(2, 20, 35)";
// }
// // else{document.body.style.backgroundImage = "linear-gradient(to bottom right, rgba(196, 34, 161, 0.7), rgba(21, 91, 124, 0.788))";}
// else{
//     document.body.style.backgroundImage = "linear-gradient(to bottom right, #AA8E71 30%, #71AA8E";
//     document.getElementById("PlaylistSection").style.background = "#71A9AA80";
// }

var user_id = ""
var playlist_id = ""
var playlistName = ""
var songlist = []
var selectedSong = ""
var selectedSongKey = ""
var rearr = []

var sequencingopts = ["Circle of Fifths"]

const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
const CURRENTUSER = "https://api.spotify.com/v1/me"

function onPageLoad(){//when page loads get all credentials
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");
    access_token = localStorage.getItem("access_token");
    refresh_token = localStorage.getItem("refresh_token");
    callApi("GET", CURRENTUSER, null, getUser)
}

function getUser(){
    if(this.status == 200){
        var data = JSON.parse(this.responseText);
        user_id = data.id
    }

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
        // console.log(data);
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
    playlistName = s[s.selectedIndex].innerHTML;
    var TRACKS = "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks?";
    // console.log(TRACKS);
    // fields = "fields=items.track.name,items.track.artists.name,items.tracks.album.images"; idk this is breaking but we should minimize the data we request; probably passed as body ??
    callApi("GET", TRACKS, null, handleTracksResponse);
}

function handleTracksResponse(){
    if(this.status == 200){
        var data = JSON.parse(this.responseText);
        //console.log(data)

        removeAllItems("Tracks");
        let sequencer = document.getElementById("Sequencer")
        while (sequencer.firstChild) {
            sequencer.removeChild(sequencer.firstChild);
        }

        let node = document.createElement("tr");
        node.id = "Static";
        document.getElementById("Tracks").appendChild(node);

        let nodeempty = document.createElement("td");
        document.getElementById("Static").appendChild(nodeempty);

        let nodetitle = document.createElement("td");
        nodetitle.innerHTML = "Song Title";
        document.getElementById("Static").appendChild(nodetitle);

        let nodeartist = document.createElement("td");
        nodeartist.innerHTML = "Artist";
        document.getElementById("Static").appendChild(nodeartist);
        
        data.items.forEach(el => addTracks(el));
    }
    else if(this.status == 401){
        refreshAccessToken();
    }
    else{
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function addTracks(el){
    let nodetr = document.createElement("tr");
    nodetr.id = el.track.name;
    document.getElementById("Tracks").appendChild(nodetr);

    let nodepic = document.createElement('img');
    nodepic.src = (el.track.album.images.slice(-1))[0].url;
    document.getElementById(el.track.name).appendChild(nodepic);

    let nodetdtrack = document.createElement("td")
    nodetdtrack.id = el.track.id
    nodetdtrack.innerHTML = el.track.name;
    document.getElementById(el.track.name).appendChild(nodetdtrack);

    AUDIOANALYSIS = "https://api.spotify.com/v1/audio-analysis/" + el.track.id

    songlist.push({trackid: el.track.id, key: getKey(AUDIOANALYSIS), mode: getMode(AUDIOANALYSIS)})

    let nodetdartist = document.createElement("td")
    nodetdartist.id = el.track.id;
    nodetdartist.innerHTML = el.track.artists[0].name;
    document.getElementById(el.track.name).appendChild(nodetdartist);
}

function getKey(link){

    let xhr = new XMLHttpRequest();
    xhr.open("GET", link, true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Authorization', ' Bearer ' + access_token);
    xhr.send(null);
    // console.log(xhr.responseText)
    var data = JSON.parse(xhr.responseText);
    // console.log(data)
    return data.track.key
}

function getMode(link){
    let xhr = new XMLHttpRequest();
    xhr.open("GET", link, true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Authorization', ' Bearer ' + access_token);
    xhr.send(null);
    // console.log(xhr.responseText)

    var data = JSON.parse(xhr.responseText);

    return data.track.mode
}

var theParent = document.getElementById("Tracks");
theParent.addEventListener("click", function selectTrack(e){
    if(e.target !== e.currentTarget){
        var clickedItem = e.target.id;
        var AUDIOANALYSIS = "https://api.spotify.com/v1/audio-analysis/" + clickedItem;
        callApi("GET", AUDIOANALYSIS, null, handleAudioAnalysis);

        selectedSong = e.target.id;
    }
})


function handleAudioAnalysis(){
    if(this.status == 200){
        var data = JSON.parse(this.responseText);
        // console.log(data);

        let node = document.getElementById("Sequencer");
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }

        let nodesequencer = document.createElement("div");
        nodesequencer.id = "sequencerbox";
        document.getElementById("Sequencer").appendChild(nodesequencer);

        let nodetrackinfo = document.createElement("p");
        nodetrackinfo.id = "ptrackinfo";
        nodetrackinfo.innerHTML = keySigEnum(data.track.key, data.track.mode);
        document.getElementById("sequencerbox").appendChild(nodetrackinfo);

        //will probably need something like this later
        // let nodeSeqOptSel = document.createElement("select")
        // nodeSeqOptSel.id ="availseqlist"
        // nodeSeqOptSel.onchange = "getSequencing(this)"
        // document.getElementById("Sequencer").appendChild(nodeSeqOptSel)

        // let defaultopt = document.createElement("option")
        // defaultopt.innerHTML = "----- Select a Sequencing -----"
        // nodeSeqOptSel.appendChild(defaultopt)

        // sequencingopts.forEach(el => addNodeOpt(el))

        ///////////////// alert("Key: " + keySigEnum(data.track.key, data.track.mode) +
        ///////////////// " Tempo: " + data.track.tempo + " Confidence: " + data.track.tempo_confidence);

        CoFArr();
    }
    
    else if(this.status == 401){
        refreshAccessToken();
    }

    else{
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function keySigEnum(x,y){
    if(x === 0 && y === 0){return "This Track is in the key of C minor";}
    else if(x === 0 && y === 1){return "This Track is in the key of C major";}
    else if(x === 1 && y === 0){return "This Track is in the key of C# minor";}
    else if(x === 1 && y === 1){return "This Track is in the key of D♭ minor";}
    else if(x === 2 && y === 0){return "This Track is in the key of D minor";}
    else if(x === 2 && y === 1){return "This Track is in the key of D major";}
    else if(x === 3 && y === 0){return "This Track is in the key of E♭ minor";}
    else if(x === 3 && y === 1){return "This Track is in the key of E♭ major";}
    else if(x === 4 && y === 0){return "This Track is in the key of E minor";}
    else if(x === 4 && y === 1){return "This Track is in the key of E major";}
    else if(x === 5 && y === 0){return "This Track is in the key of F minor";}
    else if(x === 5 && y === 1){return "This Track is in the key of F major";}
    else if(x === 6 && y === 0){return "This Track is in the key of F# minor";}
    else if(x === 6 && y === 1){return "This Track is in the key of G♭ major";}
    else if(x === 7 && y === 0){return "This Track is in the key of G minor";}
    else if(x === 7 && y === 1){return "This Track is in the key of G major";}
    else if(x === 7 && y === 1){return "This Track is in the key of G major";}
    else if(x === 8 && y === 0){return "This Track is in the key of G# minor";}
    else if(x === 8 && y === 1){return "This Track is in the key of A♭ major";}
    else if(x === 9 && y === 0){return "This Track is in the key of A minor";}
    else if(x === 9 && y === 1){return "This Track is in the key of A major";}
    else if(x === 10 && y === 0){return "This Track is in the key of B♭ minor";}
    else if(x === 10 && y === 1){return "This Track is in the key of B♭ major";}
    else if(x === 11 && y === 0){return "This Track is in the key of B minor";}
    else if(x === 11 && y === 1){return "This Track is in the key of B major";}
    else if(x === -1){return "This track is in an unknown key"}
    else if(y !== 0 && y !== 1){return "This track is in an unknown mode"}
    else{return "Not enough information is known about this song";}
}


//may need later
// function addNodeOpt(x){
//     let nodeOpt = document.createElement("option")
//     nodeOpt.id = x;
//     nodeOpt.innerHTML = x
//     document.getElementById("availseqlist").appendChild(nodeOpt)
// }

// function getSequencing(elem){
//     var selectedVal = elem.value;

//     if(elem.value == "----- Select a Sequencing -----"){}
//     else{CoFArr()}
// }

function CoFArr(){
    rearr = []

    initSong = songlist.find(obj => {return obj.trackid === selectedSong})
    rearr[0] = initSong

    sameKeys = songlist.filter(obj => {return (obj.key === initSong.key && obj.mode === initSong.mode)})
    sameKeys.forEach(el => {if(el.trackid !== selectedSong){rearr.push(el)}})

    var nextKey = (initSong.key - 7)%12
    if(nextKey<0){
        nextKey = 12 + nextKey
    }
    else if(nextKey === -0){
        nextKey = 0
    }
    var nextMode = initSong.mode
    
    let i = 1;
    for(i; i<12; i=i+1){
        sameKeys = songlist.filter(obj => {return (obj.key === nextKey && obj.mode === nextMode)})
        console.log(sameKeys)
        sameKeys.forEach(el => rearr.push(el))
        console.log(nextKey)
        nextKey = (nextKey-7)%12
        if(nextKey<0){
            nextKey = 12 + nextKey
        }
        else if(nextKey === -0){
            nextKey = 0
        }
    }
    
    if(initSong.mode === 1){
        nextKey = (initSong.key - 3)%12
        if(nextKey<0){
            nextKey = 12 + nextKey
        }
        else if(nextKey === -0){
            nextKey = 0
        }
    }
    else if(initSong.mode === 0){
        nextKey = (initSong.key + 3)%12
        if(nextKey<0){
            nextKey = 12 + nextKey
        }
        else if(nextKey === -0){
            nextKey = 0
        }
    }

    nextMode = 1 - nextMode

    i=0
    for(i; i<12; i=i+1){
        sameKeys = songlist.filter(obj => {return (obj.key === nextKey && obj.mode === nextMode)})
        sameKeys.forEach(el => rearr.push(el))
        console.log(nextKey)
        nextKey = (nextKey-7)%12
        if(nextKey<0){
            nextKey = 12 + nextKey
        }
        else if(nextKey === -0){
            nextKey = 0
        }
    }

    CREATEPLAYLISTURL = "https://api.spotify.com/v1/users/" + user_id + "/playlists"

    callApi("POST", CREATEPLAYLISTURL, JSON.stringify({"name": playlistName + " COF Sequenced"}), intermediate)

    console.log(rearr)

}

function intermediate(){
    var data=JSON.parse(this.responseText)
    newPlaylistUriSplit = (data.href).split("/")
    newPlaylistId = newPlaylistUriSplit[newPlaylistUriSplit.length - 1]
    console.log(newPlaylistId)

    var uriList = []
    rearr.forEach(el => {
        uriList.push("spotify:track:" + el.trackid)
    }
    )

    console.log(rearr, uriList)

    uriJSON = JSON.stringify({"uris": uriList, "position": 0})

    callApi("POST", "https://api.spotify.com/v1/playlists/" + newPlaylistId + "/tracks", uriJSON, placeholder)
}

function placeholder(){
    console.log("xdxd")

}