
async function onPageLoad(){//when page loads get all credentials; also load playlists
    const access_token = localStorage.getItem("access_token");
    const tokensExpired = tokenTimeValidity()

    if(tokensExpired){
        await refreshTokens()
    }

    fetch("https://api.spotify.com/v1/me", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ' Bearer ' + access_token
        }
    })
    .then(response => {
        if(response.ok){
            return response.json()
        }
        else{
            throw new Error(response)
        }
    })
    .then(response => {
        user_id = response.id//get user id
    })
    .catch(error => {
        alert(error)
        window.location.href = entry_point
    })

    await refreshPlaylists()

    let tr = document.createElement("tr")
    tracks_table.appendChild(tr)

    let img = document.createElement("img")
    img.classList.add("tableimg")
    img.id = "tableimg";
    img.src = empty_state_srcs[Math.floor(Math.random()*3)]
    tr.appendChild(img)

    let node = document.createElement("tr");
    node.id = "gentext";//first row
    node.classList.add("gentext")
    node.innerHTML = "This area will populate with songs once you select a playlist."
    tracks_table.appendChild(node);//add to tracks table

    loadAnimation()
}


async function refreshPlaylists(){//get playlists (when the button is pressed)
    const access_token = localStorage.getItem("access_token");
    const tokensExpired = tokenTimeValidity()

    if(tokensExpired){
        await refreshTokens()
    }

    fetch("https://api.spotify.com/v1/me/playlists?limit=0&offset=0", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ' Bearer ' + access_token
        }
    })
    .then(response => {
        if(response.ok){
            return response.json()
        }
        else{
            throw new Error(response)
        }
    })
    .then(response => {
        removeAllItems("playlist-list");//get rid of all playlists in the table
        var num_playlists = response.total //total number of playlists
        for(let i = 0; i <= Math.floor(num_playlists/50); i++){//get maximum number of playlists as many times as needed to get all playlists            
            fetch("https://api.spotify.com/v1/me/playlists?limit=50&offset=" + 50*i, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ' Bearer ' + access_token
                }
            })
            .then(response => {
                if(response.ok){
                    return response.json()
                }
                else{
                    throw new Error(response)
                }
            })
            .then(response => {
                response.items.forEach(el => {
                    
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
                })
            })
            .catch(error => {
                alert(error)
                window.location.href = entry_point
            })
        }
    })
    .catch(error => {
        alert(error)
        window.location.href = entry_point
    })
}


function removeAllItems(elementId){//takes in parent element id, as long as it has a child, the child is removed
    let node = document.getElementById(elementId);
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}



//Sequencing algorithms

function CoFArr(){
    var new_sequence = [];//reinit to have no tracks in case this is the second playlist someone is reorganizing
    new_sequence.push(init_song)

    var mutable_song_list = song_list.filter(obj => {return obj !== init_song})//remove song from mutable list (it will no longer be available for mutable_song_list.find() and so it won't duplicate)

    //resolving down the circle of fifths is equivalent to decrementing 7 semitones
    var next_key = modulo_12(init_song.endkey-7);
    var next_mode = init_song.endmode;//preserve modality
    var target_tempo = init_song.endtempo

    var next_song_list = []
    var next_song
    while(mutable_song_list.length >0){
        next_song_list = mutable_song_list.filter(obj => {
            return (
                obj.startkey === next_key && obj.startmode === next_mode//find song in resolved key
            )
        });

        if(next_song_list.length == 0){//no keys to resolve to, find song in same key
            next_key = modulo_12(next_key+7)//undo resolution
            next_song_list = mutable_song_list.filter(obj => {
                return (
                    obj.startkey === next_key && obj.startmode === next_mode//find song in resolved key
                )
            });

            if(next_song_list.length == 0){//no matches -> relative key
                next_key = relativeKey(next_key, next_mode)//relative key of end key
                next_mode = 1 - next_mode
    
                next_song_list = mutable_song_list.filter(obj => {
                    return (
                        obj.startkey === next_key && obj.startmode === next_mode //relative key
                    )
                })

                if(next_song_list.length == 0){//no relative key -> closest tempo
                    next_song_list = mutable_song_list
                }
            }
        }

        var closest = minDelta(next_song_list, target_tempo)
    
        next_song = next_song_list.find(obj => {return obj.starttempo == closest}) 

        new_sequence.push(next_song)
        mutable_song_list = mutable_song_list.filter(obj => {return obj !== next_song})//remove song from mutable list (it will no longer be available for mutable_song_list.find() and so it won't duplicate)

        next_key = modulo_12(next_song.endkey - 7)//set up key for next round
        next_mode = next_song.endmode
        target_tempo = next_song.endtempo
    }

    //pass body parameter
    //see https://developer.spotify.com/documentation/web-api/reference/#/operations/create-playlist for information on body parameters
    console.log(new_sequence)
    createPlaylist("CoF Sequenced ", new_sequence)
}

function RisSemArr(){
    var new_sequence = [];//init empty array
    new_sequence.push(init_song)

    var mutable_song_list = song_list.filter(obj => {return obj !== init_song})//remove song from mutable list (it will no longer be available for mutable_song_list.find() and so it won't duplicate)

    var next_key = modulo_12(init_song.endkey+1);
    var next_mode = init_song.endmode;//preserve modality
    var target_tempo = init_song.endtempo

    var next_song_list = []
    var next_song
    while(mutable_song_list.length >0){//key above same mode
        next_song_list = mutable_song_list.filter(obj => {
            return (
                obj.startkey === next_key && obj.startmode === next_mode//find song in key above
            )
        });

        if(next_song_list.length == 0){//key above different mode
            next_mode = 1 - next_mode
            next_song_list = mutable_song_list.filter(obj => {
                return (
                    obj.startkey === next_key && obj.startmode === next_mode//find song in key above
                )
            });

            if(next_song_list.length == 0){//no song
                next_key = modulo_12(init_song.endkey-7);//resolve
                next_mode = 1 - next_mode //reverse back to original mode
                next_song_list = mutable_song_list.filter(obj => {
                    return (
                        obj.startkey === next_key && obj.startmode === next_mode//find song in key above
                    )
                });

                if(next_song_list.length == 0){
                    next_song_list = mutable_song_list
                }
            }
        }
        var closest = minDelta(next_song_list, target_tempo)
    
        next_song = next_song_list.find(obj => {return obj.starttempo == closest}) 

        new_sequence.push(next_song)
        mutable_song_list = mutable_song_list.filter(obj => {return obj !== next_song})//remove song from mutable list (it will no longer be available for mutable_song_list.find() and so it won't duplicate)

        next_key = modulo_12(next_song.endkey + 1)//set up key for next round
        next_mode = next_song.endmode
        target_tempo = next_song.endtempo
    }
    createPlaylist("R.S. Sequenced ", new_sequence)
}

function DescSemArr(){
    var new_sequence = [];//reinit to have no tracks in case this is the second playlist someone is reorganizing

    var mutable_song_list = song_list;

    var next_song = init_song;//next_song is init_song (first song)
    new_sequence.push(next_song)//push first song

    var next_key = init_song.key;//next_key is the first song's key (I call it this so I can generalize the while loop)

    mutable_song_list = mutable_song_list.filter(obj => {return obj !== next_song})//remove song from mutable list (it will no longer be available for mutable_song_list.find() and so it won't duplicate)
    
    var check = 0;
    
    while(mutable_song_list.length > 0){
        next_key = modulo_12(next_key - 1)

        
        next_song = mutable_song_list.find(obj => {return obj.key === next_key})//find next song with the desired key

        if(next_song !== undefined){//a song with the key signature exists
            new_sequence.push(next_song)//push song
            mutable_song_list = mutable_song_list.filter(obj => {return obj !== next_song})//remove song from available songs
            check = 0;//reset check to 0
        }
        else{//no song exists with that key signature
            if(check < 13){//we have not yet spanned an octave from the last found track
                check++;//increment 1 to signify moving up a semitone
                continue;
            }
            else{//we have gone an entire octave without finding a key signature
                break;
            }
        }
        
    }
    createPlaylist("D.S Sequenced ", new_sequence)
}

function RisSemArrAlt(){
    var new_sequence = [];//reinit to have no tracks in case this is the second playlist someone is reorganizing
    new_sequence.push(init_song)

    var mutable_song_list = song_list.filter(obj => {return obj !== init_song})//remove song from mutable list (it will no longer be available for mutable_song_list.find() and so it won't duplicate)

    //resolving down the circle of fifths is equivalent to decrementing 7 semitones
    var next_key = modulo_12(init_song.endkey);//keep key
    var next_mode = 1 - init_song.endmode;//toggle modality
    var target_tempo = init_song.endtempo

    var next_song_list = []
    var next_song

    while(mutable_song_list.length >0){
        next_song_list = mutable_song_list.filter(obj => {//same key, opposite mode
            return (
                obj.startkey === next_key && obj.startmode === next_mode//find song in resolved key
            )
        });

        if(next_song_list.length == 0){//go up a key, keep initial modality
            next_key = modulo_12(next_key + 1)// go up a key
            next_mode = 1 - next_mode //get initial mode back
            next_song_list = mutable_song_list.filter(obj => {//same key, opposite mode
                return (
                    obj.startkey === next_key && obj.startmode === next_mode//find song in resolved key
                )
            });

            if(next_song_list.length == 0){
                next_key = modulo_12(next_key - 8)//resolve down from initial key
                next_mode = 1 - next_mode //get initial mode back
                next_song_list = mutable_song_list.filter(obj => {//same key, opposite mode
                    return (
                        obj.startkey === next_key && obj.startmode === next_mode//find song in resolved key
                    )
                });    
            }
        }

    }
    createPlaylist("R.S.A Sequenced ", new_sequence)
}

function Fader(){
    var new_sequence = [];//reinit to have no tracks in case this is the second playlist someone is reorganizing

    new_sequence.push(init_song)

    var mutable_song_list = song_list.filter(obj => {return obj !== init_song})//remove song from mutable list (it will no longer be available for mutable_song_list.find() and so it won't duplicate)
    
    var next_key = init_song.endkey
    var next_mode = init_song.endmode;//next song should start in this key and mode
    var target_tempo = init_song.endtempo

    var next_song_list = []
    var next_song

    while(mutable_song_list.length > 0){
        next_song_list = mutable_song_list.filter(obj => {
            return (
                obj.startkey === next_key && obj.startmode === next_mode//find song in same key
            )
        });
        
        if(next_song_list.length == 0){//no matches
            next_key = relativeKey(next_key, next_mode)//look for relative key
            next_mode = 1 - next_mode

            next_song_list = mutable_song_list.filter(obj => {
                return (
                    obj.startkey === next_key && obj.startmode === next_mode //relative key
                )
            })

            if(next_song_list.length == 0){//no exact key match nor relative key
                next_key = relativeKey(next_key, next_mode)//go back to original ending key
                next_mode = 1 - next_mode //toggle mode
                next_key = modulo_12(next_key - 7)//try resolving down

                next_song_list = mutable_song_list.filter(obj => {
                    return (
                        obj.startkey === next_key && obj.startmode === next_mode //relative key
                    )
                })

                if(next_song_list.length == 0){
                    next_song_list = mutable_song_list
                }
            }
        }

        var closest = minDelta(next_song_list, target_tempo)
    
        next_song = next_song_list.find(obj => {return obj.starttempo == closest}) 

        new_sequence.push(next_song)
        mutable_song_list = mutable_song_list.filter(obj => {return obj !== next_song})//remove song from mutable list (it will no longer be available for mutable_song_list.find() and so it won't duplicate)

        next_key = next_song.endkey
        next_mode = next_song.endmode
        target_tempo = next_song.endtempo
    }
    // console.log(new_sequence)
    console.log(new_sequence)
    createPlaylist("Fader Sequenced ", new_sequence)
}

//Frequently used functions
function modulo_12(x){//For negative numbers % modulo does not behave the way in which I want
    if(x>0){
        return x%12
    }
    else if(x == 0){//Sometimes -0 occurs, and although it might not matter, to be sure I resolve all -0 instances to 0
        return 0
    }
    else{
        return 12+x
    }
}

function relativeKey(key, mode){
    if(mode == 1){//if the key we could not find was major, prep to check for relative minor
        key = modulo_12(key-3)
    }
    else{//otherwise prep to check for relative major
        key = modulo_12(key+3)
    }
    return key
}

function minDelta(list, target){
    var min_delta = list[0].starttempo//start with first song
    if(list.length>1){//if there are more songs, we need to iteratively find the smallest
        for(let i=1; i<list.length; i++){
            min_delta = Math.abs(list[i].starttempo - target) < Math.abs(min_delta-target) ? list[i].starttempo:min_delta 
            /*Math.abs(list[i].starttempo - target) is the tempo difference of the next song
            min_delta-target is current smallest difference
            if tempo diff of next song is smaller than the smallest so far, update min_delta
            otherwise keep it*/
        }
    }
    return min_delta//return smallest
}

async function createPlaylist(sequencing_mode, new_sequence){
    const access_token = localStorage.getItem("access_token");
    const tokensExpired = tokenTimeValidity()

    if(tokensExpired){
        await refreshTokens()
    }

    fetch("https://api.spotify.com/v1/users/" + user_id + "/playlists", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ' Bearer ' + access_token
        },
        body: JSON.stringify({'name': sequencing_mode + playlist_name})
    })
    .then(response => {
        if(response.ok){
            return response.json()
        }
        else{
            throw new Error(response)
        }
    })
    .then(response => {
        var new_playlist_uri_split = (response.href).split("/");//split by /
        var new_playlist_id = new_playlist_uri_split[new_playlist_uri_split.length - 1];//get string after the last /

        loadAnimation()
        
        var uri_list = []//array of uris

        //for every element in the new sequencing, add an element in the uri list that is a string "spotify:track:"{{ track_id }}
        //https://developer.spotify.com/documentation/web-api/reference/#/operations/add-tracks-to-playlist has info on how to do this
        //see the section on that page: Body application/json > uris array of strings

        for(let i = 0; i<new_sequence.length; i++){
            uri_list.push("spotify:track:" + new_sequence[i].trackid);
        }
        //the list of spotify track uris goes in the order of new_sequence, thus, when this is passed to uriJSON, and then posted, the order is preserved
        //hence no reason to do that weird counter and async stuff that was previously required for the track info

        uriJSON = JSON.stringify({"uris": uri_list});//convert uri_list to json and pass this as body

        fetch("https://api.spotify.com/v1/playlists/" + new_playlist_id + "/tracks", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ' Bearer ' + access_token
            },
            body: uriJSON
        })
        //maybe loading circle into checkmark <<.then() on promise fulfilled probably
    })
    .catch(error => {
        console.log(error)
    })
}

//Script to listen for events like playlist and track selection

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

//listener for playlist selection
const tracks_header = document.getElementById("tracklist-heading")
playlist_list.addEventListener("click", async function selectPlaylist(e){//listener on parent
    song_list = [];//IMPORTANT: reinitialized to empty before adding songs (in case user sequences a different playlist)
    e.preventDefault;//for good measure (probably does not really matter since there would not be a default action)
    if(e.target !== e.currentTarget){
        //if clicked on element (child of event listener) is not the same as the element with the event listener (the parent)
        //cant be the li element or the album image becomes part of the playlist title
        
        loadAnimation()
        playlist_id = e.target.id;//assign playlist_id
        playlist_name = e.target.innerHTML;
        const access_token = localStorage.getItem("access_token");
        const tokensExpired = tokenTimeValidity()
    
        if(tokensExpired){
            await refreshTokens()
        }

        fetch("https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks", {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': ' Bearer ' + access_token
            }
        })
        .then(response => {
            if(response.ok){ 
                return response.json()
            }
            else{
                throw new Error(response)
            }
        })
        .then(response => {
            tracks_header.innerHTML = '"' + playlist_name + '"' + " Tracklist"//use playlist name in header

            var num_songs = response.total
        
            removeAllItems("tracks-table");//remove all tracks and placeholder text

            if(num_songs == 0){//if no songs, display empty state art
                let node = document.createElement("tr");
                node.id = "gentext";//first row
                node.classList.add("gentext")
                node.innerHTML = "This playlist does not appear to have any songs :(. Try adding some and coming back later"
                tracks_table.appendChild(node);//add to tracks table

                let tr = document.createElement("tr")
                tracks_table.appendChild(tr)
                let img = document.createElement("img")
                img.classList.add("tableimg")
                img.classList.add("active")
                img.id = "tableimg";
                img.src = empty_state_srcs[Math.floor(Math.random()*3)]
                tr.appendChild(img)
            }
            else{//if not 0, start animation and create header row
                let node = document.createElement("tr");
                node.id = "gentext";//first row
                tracks_table.appendChild(node);//add to tracks table

                let nodealbumart = document.createElement("td");//song title header
                nodealbumart.innerHTML = "Album";
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

                track_id_list = [];//empty list of tracks
            
                
                response.items.forEach((el, index) => {
                    // addTracks(el)

                    /*DESIRED OUTPUT HTML STRUCTURE:
                    <table class="tracks-table" id="tracks-table">
                        <tr class="track-row">
                            <td><img src="{{medium size x medium album art}}" class="album-art" id={track_id}></td>
                            <td id="{{track_id}}">{{SONG NAME}</td>
                            <td id="{{track_id}}">{{ARTIST}}</td>
                        </tr>
                    </table>
                    */

                    var track_id = el.track.id;//set track id

                    let nodetr = document.createElement("tr");//for each song create a new row
                    nodetr.classList.add("tracks-row")
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
                    nodetr.appendChild(nodetdartist);
                
                    track_id_list.push(track_id);//list of track ids
                    // console.log("here (phase 1)" + track_id)
                
                    await = getAudioAnalysis(track_id, index, el.track.name);//for each track get audio analysis

                    if(index + 1 == num_songs){
                        loadAnimation()
                    }

                });//add each track
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
})

async function getAudioAnalysis(track_id, index, track_name) {
    const access_token = localStorage.getItem("access_token");
    const tokensExpired = tokenTimeValidity()

    if(tokensExpired){
        await refreshTokens()
    }
    // console.log("here (phase 2)" + track_id_list[y])
    //cannot use callApi because this method (getAudioAnalysis) requires parameters (trackid, counter) and it would be cumbersome to do this with the xhr.onload in callApi()
    //because of async, the order of completion does not correlate to call instantiation and so it is impossible to ensure that the correct track_id
    //corresponds to the corresponding fetched data; using trackid: track_id is unreliable since the track_id will be varying throughout the
    //.forEach and the current track_id may not correspond to the currently fetched data, as would be seen in a synchronous fetch
    //synchronous fetch performance is atrocious, so we make an async function and fetch with the passed variables as is seen
    fetch("https://api.spotify.com/v1/audio-analysis/" + track_id, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': ' Bearer ' + access_token
        }
    }).then(response => {
        if(response.ok){ 
            return response.json()
        }
        else{
            throw new Error(response)
        }
    })
    .then(data => {

        if(data.sections[data.sections.length-1].tempo == 0){
            data.sections[data.sections.length-1].tempo = data.track.tempo
        }

        song_list.push({
            songtitle: track_name,
            trackid: track_id_list[index],

            startkey: data.sections[0].key,
            startmode: data.sections[0].mode,
            starttempo: data.sections[0].tempo,

            key: data.track.key,
            mode: data.track.mode,
            tempo: data.track.tempo,

            endkey: data.sections[data.sections.length-1].key,
            endmode: data.sections[data.sections.length-1].mode,
            endtempo: data.sections[data.sections.length-1].tempo,
        })
    })
    .catch(error => {
        console.log(error)
    })
}

//listener for track selection
tracks_table.addEventListener("click", function selectTrack(e){//parent listener
    e.preventDefault;//good measure
    if(e.target !== e.currentTarget && e.target.nodeName.toLowerCase() !== "li" && e.target.id !== "gentext" && e.target.id !== "tableimg"){
        /* Search in the song_list for the track with the same id as that which was selected and return the whole song object 
        Assign such a song to init_song, which is short for any of initial/initialize/initializing song */
        init_song = song_list.find(obj => {return obj.trackid === e.target.id});

        loadAnimation()
        
        //Get sequencing mode
        if(activeBtn === null || activeBtn.innerHTML === "Circle of Fifths"){//activeBtn === null -> not set -> default is CofArr
            CoFArr();
        }
        else if(activeBtn.innerHTML === "Rising Semitone Modal"){
            RisSemArr();
        }
        else if(activeBtn.innerHTML === "Descending Semitone Modal"){
            DescSemArr();
        }
        else if(activeBtn.innerHTML === "Rising Semitone Alternate"){
            RisSemArrAlt();
        }
        else if(activeBtn.innerHTML === "Fader"){
            Fader();
            
        }
    }
})

//radio button emulation with divs that look like buttons (active btn selects sequencing)

var btnSet = document.getElementsByClassName("sequencer-buttons");
let activeBtn = null;//initially no active button

for(let i=0;i<btnSet.length;i++){//for each button add an event listener
    btnSet[i].addEventListener("click", (e) => {
        e.currentTarget.classList.remove("inactive-sequencer");//remove inactive class from clicked button
        e.currentTarget.classList.add("active-sequencer");//add active class to clicked button
        e.currentTarget.parentElement.classList.remove("seq-wrapper-inactive");
        e.currentTarget.parentElement.classList.add("seq-wrapper-active");

        if ((activeBtn != null && activeBtn != e.currentTarget)){//remove active class from all other buttons
            activeBtn.classList.add("inactive-sequencer");//make old stored button inactive
            activeBtn.classList.remove("active-sequencer");//remove active
            activeBtn.parentElement.classList.add("seq-wrapper-inactive");
            activeBtn.parentElement.classList.remove("seq-wrapper-active");
        }
    
        activeBtn = e.currentTarget;//set stored active button equal to current target
    });
}

//Script to make scrollbar only visible on scroll:
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
	}, 600);

}, false);

//listener to make tracks scrollbar visible
const tracks_DOM = document.getElementById("tracks")
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
	}, 600);

}, false);

//Script to handle collapsing sidebar (and associated animation)
$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
         $('#sidebar').toggleClass('inactive');
         $('#tracks').toggleClass('inactive');
         $('#sidebarCollapse').toggleClass('active')
         $('#left-arrow').toggleClass('active')            
         $('#right-arrow').toggleClass('active');
     });
 });

//remove animation for window resizing
let resizeTimer;
window.addEventListener("resize", () => {
    document.body.classList.add("resize-animation-stopper");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove("resize-animation-stopper");
    }, 400);
});