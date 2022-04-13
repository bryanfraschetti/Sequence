var redirect_uri = "http://127.0.0.1:8080/index/index.html";//redirect uri
var home_uri = "http://127.0.0.1:8080/home/home.html";//home uri

//initialize credentials
var client_id = "";
var client_secret = "";
var access_token = "";
var refresh_token = "";

//Initialization of global variables
var user_id = "";


var playlist_id = "";
var playlistName = "";


var track_id = "";
var track_id_list = [];


var songlist = [];


var selectedSong = "";
var selectedSongKey = "";
var rearr = [];


var promise_list = [];


//list of sequencing options
var sequencingopts = ["Circle of Fifths"];


//list of endpoints
const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const CURRENTUSER = "https://api.spotify.com/v1/me";
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
var TRACKS = ""; //"Needs global scope, structured: https://api.spotify.com/v1/playlists/{playlist_id}/tracks?;
var AUDIOANALYSIS = ""; //Needs global scope but is dynamic and follows the structure: https://api.spotify.com/v1/audio-analysis/{track_id}

//list of important nodes
const playlist_table = document.getElementById("playlist-table")
const tracks_table = document.getElementById("tracks-table")

//Event listeners

/*We need event listeners on the playlists and the tracks to know what a user interacts with
A user's playlists, and the tracks in a playlist are subject to change; They are retrieved from the API and their html elements dynamically generated
It is, therefore, impossible to make event listeners in the traditional sense, since the elements are not known in advance

This is the solution:
    Add an event listener on the parent element,
    listen for any events and if an event is registered check: is it the parent element itself?
    if not, we know it was on one of the children
    We know what is needed to access the spotify endpoint (ie. playlist_id or track_id) and we can choose to structure our html any which way
    this is why later you will see the <td id="playlist_id">{{playlist name}}</td> has the id as such; an event on the playlist will retrieve the element's
    id and go to that spotify endpoint. The tr gets this same id for good measure
    A similar story applies to the td's of the tracks-table table
*/

playlist_table.addEventListener("click", function selectPlaylist(e){//listener on parent
    e.preventDefault;//for good measure (probably does not really matter since there would not be a default action)
    if(e.target !== e.currentTarget){//if clicked on element (child of event listener) is not the same as the element with the event listener (the parent)
        playlist_id = e.target.id;//assign playlist_id
        TRACKS = "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks?";//endpoint
        callApi("GET", TRACKS, null, handleTracksResponse);//on callback, run handleTracksResponse function
    }
})

tracks_table.addEventListener("click", function selectTrack(e){//parent listener
    e.preventDefault;//good measure
    if(e.target !== e.currentTarget){
        track_id = e.target.id;//trackid
        AUDIOANALYSIS = "https://api.spotify.com/v1/audio-analysis/" + track_id;//endpoint
        callApi("GET", AUDIOANALYSIS, null, handleAudioAnalysis);//call
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

function getUser(){//getting user
    if(this.status == 200){
        var data = JSON.parse(this.responseText);
        user_id = data.id;//get user id
    }
    else if(this.status == 401){
        refreshAccessToken();//refreshAccessToken if unauthorized
    }
    else{
        console.log(this.responseText);
        // alert(this.responseText);//otherwise alert user
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
        // alert(this.responseText);//alert user
    }
}

function addPlaylist(el){//for each element in the list of playlists
    /*DESIRED OUTPUT HTML STRUCTURE:
    <table class="playlist-table" id="playlist-table">
        <tr id="{{playlist_id}}">
            <td><img src="{{60px x 60px album art}}" class="cover-img"></td>
            <td id="{{playlist_id}}">{{Playlist ID}</td>
        </tr>
    </table>
    */

    let node = document.createElement("tr");//create a table row
    node.id = el.id;//row id = playlist id

    let playlist_cover_cell = document.createElement("td");//cell for cover art
    let playlist_cover = document.createElement("img");//img tag
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

function refreshPlaylists(){//get playlists (when the button is pressed)
    callApi("GET", PLAYLISTS, null, handlePlaylistResponse);
}

function handleTracksResponse(){//get a playlist's tracks
    if(this.status == 200){
        var data = JSON.parse(this.responseText);

//         let sequencer = document.getElementById("Sequencer")
//         while (sequencer.firstChild) {
//             sequencer.removeChild(sequencer.firstChild);
//         } ///I mean idrk what this is at this point

        removeAllItems("tracks-table");//remove all tracks and placeholder text
        let node = document.createElement("tr");
        node.id = "column-headers";//first row
        tracks_table.appendChild(node);//add to tracks table

        let nodeempty = document.createElement("td");//empty data cell
        node.appendChild(nodeempty);

        let nodetitle = document.createElement("td");//song title header
        nodetitle.innerHTML = "Song Title";
        node.appendChild(nodetitle);

        let nodeartist = document.createElement("td");//artist header
        nodeartist.innerHTML = "Artist";
        node.appendChild(nodeartist);

        songlist = [];//IMPORTANT: reinitialized to empty before adding songs (in case user sequences a different playlist)
        track_id_list = [];//same

        data.items.forEach(el => addTracks(el, data.items.length));//add track
    }
    else if(this.status == 401){
        refreshAccessToken();//refresh token
    }
    else{
        console.log(this.responseText);
        // alert(this.responseText);
    }
}

function addTracks(el, maxlength){

    /*DESIRED OUTPUT HTML STRUCTURE:
    <table class="tracks-table" id="tracks-table">
        <tr id="{{SONG NAME}}">
            <td><img src="{{medium size x medium album art}}" class="album-art" id={track_id}></td>
            <td id="{{track_id}}">{{SONG NAME}</td>
            <td id="{{track_id}}">{{ARTIST}}</td>
        </tr>
    </table>
    */

    track_id = el.track.id;//set track id

    let nodetr = document.createElement("tr");//for each song create a new row
    nodetr.id = el.track.name;//give row the id of the track name
    tracks_table.appendChild(nodetr);//append the row to track table

    let nodetd = document.createElement('td')//create td
    let nodepic = document.createElement('img');//tag for album art
    nodepic.src = el.track.album.images[1].url;//source the art
    nodepic.id = track_id;//img id is track id
    nodepic.className = "album-art";//class is album art
    nodetd.appendChild(nodepic)//add img to td
    nodetr.appendChild(nodetd);//add td to tr

    let nodetdtrack = document.createElement("td");//new cell
    nodetdtrack.id = track_id;//id is track id
    nodetdtrack.innerHTML = el.track.name;//innerhtml is song name
    nodetr.appendChild(nodetdtrack);//add td to tr

    let nodetdartist = document.createElement("td")//new cell
    nodetdartist.id = track_id;//cell id is track id
    nodetdartist.innerHTML = el.track.artists[0].name;//innerhtml is artist[0] name
    document.getElementById(el.track.name).appendChild(nodetdartist);

    track_id_list.push(track_id);//list of track ids

    promise_list.push(
        //callapi type thing
    )

    if(track_id_list.length === maxlength){
        for(counter=0; counter<track_id_list.length; counter++){
            //promise.all(promise_list) or something
            AUDIOANALYSIS = "https://api.spotify.com/v1/audio-analysis/" + track_id_list[counter];//endpoint with key signature and similar info
            callApi("GET", AUDIOANALYSIS, null, getTrackInfo)
        }
    }
}

function getTrackInfo(){
    if(this.status == 200){
        console.log("xaxaax")
        var data = JSON.parse(this.responseText);
        //list of song objects
        songlist.push({
            trackid: track_id_list[counter],//empty initialization, to make the structure more readable/understandable than if it is simply added later
            key: data.track.key,
            mode: data.track.mode
        })
        /*This is somewhat of a scuffed/brute force implementation but I did not really have a choice
        Initially I did not even use a list of the track ids, I just had track_id and then executed songlist.push({trackid: track_id})
        This proved to be problematic and strange because although the .forEach iterating through the tracks always manifests a unique
        track id in the line track_id = el.track.id, what happens is the script executes each iteration of addTracks() before ever (seeming) to call
        the api. The strange part is that when it did, it obtained all of the unique track key/mode data but the track_id of every song in the list
        was equivalent to the id of the last track in the playlist
        for example
        songlist[{
            trackid: "741KHLH3d9jRMtl5WJdkmE",
            key: 3,
            mode: 0
        },
        {
            trackid: "741KHLH3d9jRMtl5WJdkmE",
            key: 1,
            mode: 1
        },
        {
            trackid: "741KHLH3d9jRMtl5WJdkmE",
            key: 8,
            mode: 1
        }]
        Essentially, it seemed like instead of executing callApi as part of an addTracks iteration, it executed each iteration of callApi after
        the last track. Strangely instead of producing an array of length = playlist length of identical entries, it retrieved all of the unique
        key/mode information then, and this part makes sense if it calls the api after every addtracks iteration, it made the trackid of every entry
        equal to the last one. This is because track_id = el.track.id would be the last track id and then it would be assigned to every songlist element
        */
        /* My solution is create a list of track ids, on the last iteration of the api call, retroactively go back and iterate through the songlist
        correcting the empty track id to the corresponding id*/
        // if(songlist.length === track_id_list.length){
        //     for(let i=0; i<songlist.length;i++){
        //         songlist[i].trackid = track_id_list[i]
        //     }
        // }
    }
    else if(this.status == 401){
        refreshAccessToken();//refresh token
    }
    else {
        console.log(this.responseText);
        // alert(this.responseText);
        window.location.href = redirect_uri;//send to index
    }
}

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


//*****generalized methods*****//
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
    xhr.onload = handleAuthorizationResponse;//when xhr load event fires, execute handleAuthResponse function
}

function handleAuthorizationResponse(){
    if(this.status == 200){
        var data = JSON.parse(this.responseText);
        if(data.access_token != undefined){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);//set auth token
        }
        if(data.refresh_token != undefined){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);//set refresh token
        }
        window.location.href = home_uri;//redirect to home
    }
    else if(this.status == 401){
        refreshAccessToken();//refresh token
    }
    else {
        console.log(this.responseText);
        // alert(this.responseText);
        window.location.href = redirect_uri;//send to index
    }
}

