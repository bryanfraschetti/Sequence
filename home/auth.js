var redirect_uri = "http://127.0.0.1:8080/index/index.html";//redirect uri
var home_uri = "http://127.0.0.1:8080/home/home.html";//home uri

//initialize credentials
var client_id = "";
var client_secret = "";
var access_token = "";
var refresh_token = "";

//globally needed variables initialized to nothing
var user_id = "";
var playlist_id = "";
var playlistName = "";
var songlist = [];
var selectedSong = "";
var selectedSongKey = "";
var rearr = [];

//list of sequencing options
var sequencingopts = ["Circle of Fifths"];

//list of endpoints
const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
const CURRENTUSER = "https://api.spotify.com/v1/me";

//list of important nodes
const playlist_table = document.getElementById("playlist-table")
const tracks_table = document.getElementById("tracks-table")

//Event listeners
playlist_table.addEventListener("click", function selectTrack(e){
    if(e.target !== e.currentTarget){//if clicked on element (child of event listener) is not the same as the element with the event listener 
        var clickedItem = e.target.id;
        var TRACKS = "https://api.spotify.com/v1/playlists/" + clickedItem + "/tracks?"
        console.log(TRACKS)
        callApi("GET", TRACKS, null, handleTracksResponse);
    }
})

//*****at the bottom of the page are some generalized function calls such as callApi and removeAllItems*****//

function onPageLoad(){//when page loads get all credentials; also load playlists
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");
    access_token = localStorage.getItem("access_token");
    refresh_token = localStorage.getItem("refresh_token");
    callApi("GET", CURRENTUSER, null, getUser);//callApi is a generalized method call; ctrl+F callApi to see its declaration
    callApi("GET", PLAYLISTS, null, handlePlaylistResponse);
}

function getUser(){
    if(this.status == 200){
        var data = JSON.parse(this.responseText);
        user_id = data.id;//get user id
    }
    else if(this.status == 401){
        refreshAccessToken();//refreshAccessToken if unauthorized
    }
    else{
        console.log(this.responseText);
        alert(this.responseText);//otherwise alert user
    }
}

function handlePlaylistResponse(){//getting playlists
    if(this.status == 200){
        var data = JSON.parse(this.responseText);
        removeAllItems("playlist-table");//get rid of all playlists in the table
        data.items.forEach(el => addPlaylist(el));//add each of the just obtained playlists
    }
    else if(this.status == 401){//token expired
        refreshAccessToken();
    }
    else{
        console.log(this.responseText);
        alert(this.responseText);//alert user
    }
}

function addPlaylist(el){//for each element in the list of playlists
    let node = document.createElement("tr");//create a table row
    node.id = el.id;//row id = playlist id

    let playlist_cover_cell = document.createElement("td");//cell for cover art
    let playlist_cover = document.createElement("img");//img tag
    console.log(el.images.length)
    if(el.images.length !== 0){
        playlist_cover.src = ((el.images.slice(-1))[0]).url;//src for img
    }
    playlist_cover.className = "coverimg" //all images are cover images
    playlist_cover_cell.appendChild(playlist_cover);//append img to td
    node.appendChild(playlist_cover_cell);//append td to tr

    let playlist_title = document.createElement("td");//create td for title
    playlist_title.className = "playlist-title"; //all titles are titles
    playlist_title.id = el.id ; //set table cell id to playlist id
    playlist_title.innerHTML = el.name;//inner html is the title
    node.appendChild(playlist_title);//append td to tr

    playlist_table.appendChild(node);//append tr to table
}

function refreshPlaylists(){
    callApi("GET", PLAYLISTS, null, handlePlaylistResponse);//for when the button is pressed
}

function handleTracksResponse(){
    if(this.status == 200){
        var data = JSON.parse(this.responseText);

//         let sequencer = document.getElementById("Sequencer")
//         while (sequencer.firstChild) {
//             sequencer.removeChild(sequencer.firstChild);
//         } ///I mean idrk what this is at this point

        removeAllItems("tracks-table");
        let node = document.createElement("tr");
        node.id = "Static";
        document.getElementById("tracks-table").appendChild(node);

        let nodeempty = document.createElement("td");
        document.getElementById("Static").appendChild(nodeempty);

        let nodetitle = document.createElement("td");
        nodetitle.innerHTML = "Song Title";
        document.getElementById("Static").appendChild(nodetitle);

        let nodeartist = document.createElement("td");
        nodeartist.innerHTML = "Artist";
        document.getElementById("Static").appendChild(nodeartist);

        songlist=[];//IMPORTANT: reinitialized to empty before adding songs (in case user sequences a different playlist)

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
    document.getElementById("tracks-table").appendChild(nodetr);

    let nodepic = document.createElement('img');
    nodepic.src = (el.track.album.images.slice(-1))[0].url;
    document.getElementById(el.track.name).appendChild(nodepic);

    let nodetdtrack = document.createElement("td")
    nodetdtrack.id = el.track.id
    nodetdtrack.innerHTML = el.track.name;
    document.getElementById(el.track.name).appendChild(nodetdtrack);

    AUDIOANALYSIS = "https://api.spotify.com/v1/audio-analysis/" + el.track.id

    songlist.push({trackid: el.track.id, key: callApi("GET", AUDIOANALYSIS, null, getKey), mode: callApi("GET", AUDIOANALYSIS, null, getMode)})

    let nodetdartist = document.createElement("td")
    nodetdartist.id = el.track.id;
    nodetdartist.innerHTML = el.track.artists[0].name;
    document.getElementById(el.track.name).appendChild(nodetdartist);
}


function getKey(){
    var data = JSON.parse(this.responseText);
    return data.track.key
}

function getMode(){
    var data = JSON.parse(this.responseText);
    return data.track.mode
}

// var theParent = document.getElementById("Tracks");
// theParent.addEventListener("click", function selectTrack(e){
//     if(e.target !== e.currentTarget){
//         var clickedItem = e.target.id;
//         var AUDIOANALYSIS = "https://api.spotify.com/v1/audio-analysis/" + clickedItem;
//         callApi("GET", AUDIOANALYSIS, null, handleAudioAnalysis);

//         selectedSong = e.target.id;
//     }
// })


// function handleAudioAnalysis(){
//     if(this.status == 200){
//         var data = JSON.parse(this.responseText);
//         // console.log(data);

//         let node = document.getElementById("Sequencer");
//         while (node.firstChild) {
//             node.removeChild(node.firstChild);
//         }

//         let nodesequencer = document.createElement("div");
//         nodesequencer.id = "sequencerbox";
//         document.getElementById("Sequencer").appendChild(nodesequencer);

//         let nodetrackinfo = document.createElement("p");
//         nodetrackinfo.id = "ptrackinfo";
//         nodetrackinfo.innerHTML = keySigEnum(data.track.key, data.track.mode);
//         document.getElementById("sequencerbox").appendChild(nodetrackinfo);

//         //will probably need something like this later
//         // let nodeSeqOptSel = document.createElement("select")
//         // nodeSeqOptSel.id ="availseqlist"
//         // nodeSeqOptSel.onchange = "getSequencing(this)"
//         // document.getElementById("Sequencer").appendChild(nodeSeqOptSel)

//         // let defaultopt = document.createElement("option")
//         // defaultopt.innerHTML = "----- Select a Sequencing -----"
//         // nodeSeqOptSel.appendChild(defaultopt)

//         // sequencingopts.forEach(el => addNodeOpt(el))

//         ///////////////// alert("Key: " + keySigEnum(data.track.key, data.track.mode) +
//         ///////////////// " Tempo: " + data.track.tempo + " Confidence: " + data.track.tempo_confidence);

//         CoFArr();
//     }
    
//     else if(this.status == 401){
//         refreshAccessToken();
//     }

//     else{
//         console.log(this.responseText);
//         alert(this.responseText);
//     }
// }

// function keySigEnum(x,y){
//     if(x === 0 && y === 0){return "This Track is in the key of C minor";}
//     else if(x === 0 && y === 1){return "This Track is in the key of C major";}
//     else if(x === 1 && y === 0){return "This Track is in the key of C# minor";}
//     else if(x === 1 && y === 1){return "This Track is in the key of D♭ minor";}
//     else if(x === 2 && y === 0){return "This Track is in the key of D minor";}
//     else if(x === 2 && y === 1){return "This Track is in the key of D major";}
//     else if(x === 3 && y === 0){return "This Track is in the key of E♭ minor";}
//     else if(x === 3 && y === 1){return "This Track is in the key of E♭ major";}
//     else if(x === 4 && y === 0){return "This Track is in the key of E minor";}
//     else if(x === 4 && y === 1){return "This Track is in the key of E major";}
//     else if(x === 5 && y === 0){return "This Track is in the key of F minor";}
//     else if(x === 5 && y === 1){return "This Track is in the key of F major";}
//     else if(x === 6 && y === 0){return "This Track is in the key of F# minor";}
//     else if(x === 6 && y === 1){return "This Track is in the key of G♭ major";}
//     else if(x === 7 && y === 0){return "This Track is in the key of G minor";}
//     else if(x === 7 && y === 1){return "This Track is in the key of G major";}
//     else if(x === 7 && y === 1){return "This Track is in the key of G major";}
//     else if(x === 8 && y === 0){return "This Track is in the key of G# minor";}
//     else if(x === 8 && y === 1){return "This Track is in the key of A♭ major";}
//     else if(x === 9 && y === 0){return "This Track is in the key of A minor";}
//     else if(x === 9 && y === 1){return "This Track is in the key of A major";}
//     else if(x === 10 && y === 0){return "This Track is in the key of B♭ minor";}
//     else if(x === 10 && y === 1){return "This Track is in the key of B♭ major";}
//     else if(x === 11 && y === 0){return "This Track is in the key of B minor";}
//     else if(x === 11 && y === 1){return "This Track is in the key of B major";}
//     else if(x === -1){return "This track is in an unknown key"}
//     else if(y !== 0 && y !== 1){return "This track is in an unknown mode"}
//     else{return "Not enough information is known about this song";}
// }


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

// function CoFArr(){
//     rearr = []

//     initSong = songlist.find(obj => {return obj.trackid === selectedSong})
//     rearr[0] = initSong

//     sameKeys = songlist.filter(obj => {return (obj.key === initSong.key && obj.mode === initSong.mode)})
//     sameKeys.forEach(el => {if(el.trackid !== selectedSong){rearr.push(el)}})

//     var nextKey = (initSong.key - 7)%12
//     if(nextKey<0){
//         nextKey = 12 + nextKey
//     }
//     else if(nextKey === -0){
//         nextKey = 0
//     }
//     var nextMode = initSong.mode
    
//     let i = 1;
//     for(i; i<12; i=i+1){
//         sameKeys = songlist.filter(obj => {return (obj.key === nextKey && obj.mode === nextMode)})
//         console.log(sameKeys)
//         sameKeys.forEach(el => rearr.push(el))
//         console.log(nextKey)
//         nextKey = (nextKey-7)%12
//         if(nextKey<0){
//             nextKey = 12 + nextKey
//         }
//         else if(nextKey === -0){
//             nextKey = 0
//         }
//     }
    
//     if(initSong.mode === 1){
//         nextKey = (initSong.key - 3)%12
//         if(nextKey<0){
//             nextKey = 12 + nextKey
//         }
//         else if(nextKey === -0){
//             nextKey = 0
//         }
//     }
//     else if(initSong.mode === 0){
//         nextKey = (initSong.key + 3)%12
//         if(nextKey<0){
//             nextKey = 12 + nextKey
//         }
//         else if(nextKey === -0){
//             nextKey = 0
//         }
//     }

//     nextMode = 1 - nextMode

//     i=0
//     for(i; i<12; i=i+1){
//         sameKeys = songlist.filter(obj => {return (obj.key === nextKey && obj.mode === nextMode)})
//         sameKeys.forEach(el => rearr.push(el))
//         console.log(nextKey)
//         nextKey = (nextKey-7)%12
//         if(nextKey<0){
//             nextKey = 12 + nextKey
//         }
//         else if(nextKey === -0){
//             nextKey = 0
//         }
//     }

//     CREATEPLAYLISTURL = "https://api.spotify.com/v1/users/" + user_id + "/playlists"

//     callApi("POST", CREATEPLAYLISTURL, JSON.stringify({"name": playlistName + " COF Sequenced"}), intermediate)

//     console.log(rearr)

// }

// function intermediate(){
//     var data=JSON.parse(this.responseText)
//     newPlaylistUriSplit = (data.href).split("/")
//     newPlaylistId = newPlaylistUriSplit[newPlaylistUriSplit.length - 1]
//     console.log(newPlaylistId)

//     var uriList = []
//     rearr.forEach(el => {
//         uriList.push("spotify:track:" + el.trackid)
//     }
//     )

//     console.log(rearr, uriList)

//     uriJSON = JSON.stringify({"uris": uriList, "position": 0})

//     callApi("POST", "https://api.spotify.com/v1/playlists/" + newPlaylistId + "/tracks", uriJSON, placeholder)
// }

// function placeholder(){
//     console.log("xdxd")

// }


//generalized methods
function callApi(method, url, body, callback){
    //takes inputs:
    //method: post,get,delete
    //url: the endpoint to do the action
    //body: necessary parameters
    //callback: the function to execute on return
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);//Uses async; performance of sync is DRASTICALLY worse: a playlist of 8songs took like 10x longer than a playlist of 45
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Authorization', ' Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}

function removeAllItems(elementId){//takes in parent element id, as long as it has a child, the child is removed
    let node = document.getElementById(elementId);
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function refreshAccessToken(){//refresh access token
    refresh_token = localStorage.getItem(refresh_token);//get refresh token
    let body = "grant_type=refresh_token";
    body += "refresh_token" + refresh_token;
    body += "client_id=" + client_id;//follow authorization flow
    callAuthorizationApi(body);
}

function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));//pass headers
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;//
}

function handleAuthorizationResponse(){
    if(this.status == 200){
        var data = JSON.parse(this.responseText);
        if(data.access_token != undefined){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if(data.refresh_token != undefined){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
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
