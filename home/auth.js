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
var playlist_name = "";


var track_id = "";
var track_id_list = [];


var song_list = [];


var selected_song = "";

var new_sequence = [];


//list of sequencing options
var sequencingopts = ["Circle of Fifths"];


var counter = 0;


//list of endpoints
const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const CURRENTUSER = "https://api.spotify.com/v1/me";
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
var TRACKS = ""; //"Needs global scope, structured: https://api.spotify.com/v1/playlists/{playlist_id}/tracks?;
var AUDIOANALYSIS = "https://api.spotify.com/v1/audio-analysis/"; //Needs global scope but is dynamic and follows the structure: https://api.spotify.com/v1/audio-analysis/{track_id}

//list of important nodes
const playlist_list = document.getElementById("playlist-list");
const tracks_table = document.getElementById("tracks-table");
const tracks_DOM = document.getElementById("tracks");

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

playlist_list.addEventListener("click", function selectPlaylist(e){//listener on parent
    song_list = [];//IMPORTANT: reinitialized to empty before adding songs (in case user sequences a different playlist)
    counter =  0; //reinit counter to 0 in case user selects new playlist  (or even the same)
    e.preventDefault;//for good measure (probably does not really matter since there would not be a default action)
    if(e.target !== e.currentTarget){//if clicked on element (child of event listener) is not the same as the element with the event listener (the parent)
        playlist_id = e.target.id;//assign playlist_id
        playlist_name = e.target.innerHTML;
        TRACKS = "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks?";//endpoint
        callApi("GET", TRACKS, null, getPlaylistSongs);//on callback, run getPlaylistSongs function
    }
})

//listener to create playlist
tracks_table.addEventListener("click", function selectTrack(e){//parent listener
    e.preventDefault;//good measure
    if(e.target !== e.currentTarget){
        selected_song = e.target.id;
        AUDIOANALYSIS = "https://api.spotify.com/v1/audio-analysis/" + selected_song;//endpoint
        callApi("GET", AUDIOANALYSIS, null, getSelectedSong);//call
    }
})

//scrollbar only visible on scroll:
var isScrolling;

//listener to make playlist scrollbar visible
playlist_list.addEventListener('scroll', function (e) {
    if (e.target.classList.contains("scroll-active") === false) {
        e.target.classList.add("scroll-active");
    }
	// Clear our timeout throughout the scroll
	window.clearTimeout(isScrolling);
	// Set a timeout to run after scrolling ends
	isScrolling = setTimeout(function(){
		// Run the callback
        e.target.classList.remove("scroll-active")
	}, 300);

}, false);

//listener to make tracks scrollbar visible
tracks_DOM.addEventListener('scroll', function (e) {
    if (e.target.classList.contains("scroll-active") === false) {
        e.target.classList.add("scroll-active");
    }
	// Clear our timeout throughout the scroll
	window.clearTimeout(isScrolling);
	// Set a timeout to run after scrolling ends
	isScrolling = setTimeout(function(){
		// Run the callback
        e.target.classList.remove("scroll-active")
	}, 300);

}, false);

//radio button emulation with actual buttons
var btnTip = document.getElementsByClassName("sequencer-buttons");
let activeBtn = null;//initially no active button
for(i=0;i<btnTip.length;i++){//for each button add an event listener
    btnTip[i].addEventListener("click", (e) => {
        e.currentTarget.classList.remove("inactive-sequencer");//remove inactive class from clicked button
        e.currentTarget.classList.add("active-sequencer");//add active class to clicked button

        if ((activeBtn != null && activeBtn != e.currentTarget)){//remove active class from all other buttons
            activeBtn.classList.add("inactive-sequencer");//make old stored button inactive
            activeBtn.classList.remove("active-sequencer");//remove active
        }
    
        activeBtn = e.currentTarget;//set stored active button equal to current target
    });
}

//*****at the bottom of the page are some generalized function calls such as callApi and removeAllItems*****//

function onPageLoad(){//when page loads get all credentials; also load playlists
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");
    access_token = localStorage.getItem("access_token");
    refresh_token = localStorage.getItem("refresh_token");
    callApi("GET", CURRENTUSER, null, getUser);//callApi is a generalized method call; ctrl+F callApi to see its declaration
    callApi("GET", PLAYLISTS, null, getUserPlaylists);
}

//collapse sidebar
$(document).ready(function () {
   $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('inactive');
        $('#tracks').toggleClass('inactive')
    });
});

function getUser(){//getting user
    if(this.status == 200){
        var data = JSON.parse(this.responseText);
        user_id = data.id;//get user id
    }
    else if(this.status == 401){
        refreshAccessToken();//refreshAccessToken if unauthorized
    }
    else{
        window.location.href = redirect_uri;//send to index
    }
}

function getUserPlaylists(){//getting playlists
    if(this.status == 200){
        var data = JSON.parse(this.responseText);
        removeAllItems("playlist-list");//get rid of all playlists in the table
        data.items.forEach(el => addPlaylist(el));//add each of the just obtained playlists
    }
    else if(this.status == 401){//token expired
        refreshAccessToken();
    }
    else{
        window.location.href = redirect_uri;//send to index
    }
}

function addPlaylist(el){//for each element in the list of playlists
    /*DESIRED OUTPUT HTML STRUCTURE:
    <table class="playlist-list" id="playlist-list">
        <tr id="{{playlist_id}}">
            <td><img src="{{60px x 60px album art}}" class="cover-img"></td>
            <td id="{{playlist_id}}">{{Playlist ID}</td>
        </tr>
    </table>
    <ul class="playlists" id="playlist-list">
        <li id="{{playlist_id}}">
            <img src="{{60px x 60px album art}}" class="cover-img">
            <p id="{{playlist_id}}">{{Playlist Name}</p>
        </tr>
    </table>

    */

    
    let node = document.createElement("li");//create a list item
    node.id = el.id;//li id = playlist id

    let playlist_cover = document.createElement("img");//img tag
    if(el.images.length !== 0){
        playlist_cover.src = ((el.images.slice(-1))[0]).url;//src for img
    }
    playlist_cover.className = "coverimg" //all images are cover images
    node.appendChild(playlist_cover);//append img to li

    let playlist_title = document.createElement("p");//create td for title
    playlist_title.className = "playlist-title"; //all titles are titles
    playlist_title.id = el.id ; //set table cell id to playlist id
    playlist_title.innerHTML = el.name;//inner html is the title
    node.appendChild(playlist_title);//append p to li

    playlist_list.appendChild(node);//append li to ul

}

function refreshPlaylists(){//get playlists (when the button is pressed)
    callApi("GET", PLAYLISTS, null, getUserPlaylists);
}

function getPlaylistSongs(){//get a playlist's tracks
    if(this.status == 200){
        var data = JSON.parse(this.responseText);

//         let sequencer = document.getElementById("Sequencer")
//         while (sequencer.firstChild) {
//             sequencer.removeChild(sequencer.firstChild);
//         } ///I mean idrk what this is at this point

        removeAllItems("tracks-table");//remove all tracks and placeholder text
        let node = document.createElement("tr");
        node.id = "header-row";//first row
        tracks_table.appendChild(node);//add to tracks table

        let nodealbumart = document.createElement("td");//song title header
        nodealbumart.innerHTML = "Album Art";
        nodealbumart.className = "tracks-table-header"
        node.appendChild(nodealbumart);

        let nodetitle = document.createElement("td");//song title header
        nodetitle.innerHTML = "Song Title";
        nodetitle.className = "tracks-table-header"
        node.appendChild(nodetitle);

        let nodeartist = document.createElement("td");//artist header
        nodeartist.innerHTML = "Artist";
        nodeartist.className = "tracks-table-header"
        node.appendChild(nodeartist);

        track_id_list = [];//same

        data.items.forEach(el => addTracks(el, data.items.length));//add track
    }
    else if(this.status == 401){
        refreshAccessToken();//refresh token
    }
    else{
        window.location.href = redirect_uri;//send to index
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
    nodepic.src = el.track.album.images[0].url;//source the art
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

    getAudioAnalysis(track_id, counter)//for each track get audio analysis
    counter++;
}

async function getAudioAnalysis(x, y) {
    //cannot use callApi because this method (getAudioAnalysis) requires parameters and it would be cumbersome to do this with the xhr.onload in callApi()
    //because of async, the order of completion does not correlate to call instantiation and so it is impossible to ensure that the correct track_id
    //corresponds to the corresponding fetched data; besides, using trackid: track_id is unreliable since the track_id will be varying throughout the
    //.forEach and the current track_id may not correspond to the currently fetched data, as would be seen in a synchronous fetch
    //synchronous fetch performance is atrocious, so we make an async function and fetch with the passed variables as is seen
    fetch(AUDIOANALYSIS + x, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': ' Bearer ' + access_token
        }
    }).then(response => response.json())
    .then(data => song_list.push(
        {
            trackid: track_id_list[y],
            startkey: data.sections[0].key,
            startmode: data.sections[0].mode,
            key: data.track.key,
            mode: data.track.mode,
            endkey: data.sections[data.sections.length-1].key,
            endmode: data.sections[data.sections.length-1].mode,
        }
    ))
}

function getSelectedSong(){
    if(this.status == 200){
        var data = JSON.parse(this.responseText);

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

        CoFArr();
    }
    
    else if(this.status == 401){
        refreshAccessToken();
    }

    else{
        window.location.href = redirect_uri;//send to index
    }
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
    new_sequence = [];//reinit to have no tracks in case this is the second playlist someone is reorganizing

    init_song = song_list.find(obj => {return obj.trackid === selected_song});

    /* Search in the song_list for the track with the same name as that which was selected and return the whole song object 
    Assign such a song to init_song, which is short for any of initial/initialize/initializing song */

    new_sequence[0] = init_song; //Set the first song in the new list to be that track

    same_keys = song_list.filter(obj => {return (obj.key === init_song.key && obj.mode === init_song.mode)});//songs of same key
    same_keys.forEach(el => {if(el.trackid !== selected_song){new_sequence.push(el)}});//put all songs of the same key in the new_sequence

    //resolving down the circle of fifths is equivalent to decrementing 7 semitones
    // if 0<=key<12 (<=11), we are good since this corresponds to a note
    // key = 12 would be C; this is because 12mod12 ≡ 0; Essentially, every 12 the key resets so we take mod12 (getting the remainder)
    // D (enumeration: 2) resolves to G (enumeration: 7), this is because (2-7)mod(12) = -5mod(12) = 7
    // strangely javascript mod function does not behave like mod in most languages, and so if it the subtraction
    // produces a negative, the 12 must be added back

    var next_key = (init_song.key - 7)%12;
    if(next_key<0){
        next_key = 12 + next_key; 
    }
    else if(next_key === -0){//sometimes the output would be -0; if this happens, simply correct it to 0
        //(this is a safety measure, although it should not really matter since +0 == 0 == -0 are all true)
        next_key = 0;
    }
    var next_mode = init_song.mode;//preserve modality
    
    let i = 1;//we have just completed iteration 0, we then do this process until we get back to the starting key (12 times bc 12 keys per mode)
    for(i; i<12; i=i+1){
        //same algorithm
        same_keys = song_list.filter(obj => {return (obj.key === next_key && obj.mode === next_mode)});
        same_keys.forEach(el => new_sequence.push(el));
        next_key = (next_key-7)%12;
        // console.log(same_keys)
        // console.log(next_key)
        if(next_key<0){
            next_key = 12 + next_key;
        }
        else if(next_key === -0){
            next_key = 0;
        }
    }
    
    if(init_song.mode === 1){//if first song was major, relative minor is 3 semitones down
        next_key = (init_song.key - 3)%12;//take mod 12
        if(next_key<0){//modulo correction
            next_key = 12 + next_key;
        }
        else if(next_key === -0){//precautionary
            next_key = 0;
        }
    }
    else if(init_song.mode === 0){//if first song was minor, relative major is +3
        next_key = (init_song.key + 3)%12; //take mod 12 since (11+3)mod12=14mod12≡2mod12
        if(next_key<0){//0<=init_song<=11 ... 3<=init_song+3<=14 so this should not happen, but for structural consistency
            next_key = 12 + next_key;
        }
        else if(next_key === -0){
            next_key = 0;
        }
    }

    next_mode = 1 - next_mode;
    //a simple way of complementation
    //if first song was major switch to minor: next_mode = 1-1 = 0
    //if first song was minor switch to major: next_mode = 1-0 = 1

    //same process, iteration 0 has not been done yet so start with i=0
    i=0;
    for(i; i<12; i=i+1){
        same_keys = song_list.filter(obj => {return (obj.key === next_key && obj.mode === next_mode)});
        same_keys.forEach(el => new_sequence.push(el));
        // console.log(next_key);
        next_key = (next_key-7)%12;
        if(next_key<0){
            next_key = 12 + next_key;
        }
        else if(next_key === -0){
            next_key = 0;
        }
    }

    CREATEPLAYLISTURL = "https://api.spotify.com/v1/users/" + user_id + "/playlists";//url to post to

    //pass body
    //see https://developer.spotify.com/documentation/web-api/reference/#/operations/create-playlist for information on body parameters
    callApi("POST", CREATEPLAYLISTURL, JSON.stringify({"name": playlist_name + " COF Sequenced"}), populateNewPlaylist)//call api to create playlist
    //has callback function that populates the playlist

    // console.log(new_sequence)//view new sequence
}


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
        window.location.href = redirect_uri;//send to index
    }
}

/* Convert enumeration into something easily understandable */
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

function populateNewPlaylist(){
    var data=JSON.parse(this.responseText);//returns a lot of info, including the new playlist url
    // console.log(data)
    //playlist_id is after the last slash
    new_playlist_uri_split = (data.href).split("/");//split by /
    new_playlist_id = new_playlist_uri_split[new_playlist_uri_split.length - 1];//get string after the last /

    var uri_list = []//array of uris

    //for every element in the new sequencing, add an element in the uri list that is a string "spotify:track:"{{ track_id }}
    //https://developer.spotify.com/documentation/web-api/reference/#/operations/add-tracks-to-playlist has info on how to do this
    //see the section on that page: Body application/json > uris array of strings
    new_sequence.forEach(el => {
        uri_list.push("spotify:track:" + el.trackid);
    })

    uriJSON = JSON.stringify({"uris": uri_list, "position": 0});//convert uri_list to json and pass this as body

    callApi("POST", "https://api.spotify.com/v1/playlists/" + new_playlist_id + "/tracks", uriJSON, null);

    //maybe some sort of visual queue
}