require('dotenv').config()
const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET//get confidential app credentials

const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";
const redirect_uri = "http://127.0.0.1:3000/";//crucial uris

const express = require('express')
const path = require('path')
const session = require('express-session');
const bodyParser = require('body-parser');//modules

const app = express()//instantiate
app.listen(3000)//instantiate

app.use(express.static(path.join(__dirname, 'public')))
app.use('/public', express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        }
    }
}))//handle css serving
app.use('/public', express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'text/javascript');
        }
    }
}))//handle js serving
app.use(session({
    secret: "JababaJoePapa",
    resave: false,
    saveUninitialized: false
}))//define session parameters

app.get("/", (req, res) => {//main entry point

    //These variables will be null unless authorization has been initiated
    var code = req.query.code//api response
    var spotifyState = req.query.state //state param returned from spotify
    var sessionState = req.session.state //state param stored in session when state was generated

    //if code && spotifyState, we have been redirected by spotify and must authenticate
    //check spotifyState against sessionState to ensure integrity
    const authorizationInitiated = (code && spotifyState && spotifyState === sessionState) ? 1 : 0

    console.log(authorizationInitiated)
    if(!authorizationInitiated){//not in authentication procedure
        res.sendFile(path.join(__dirname, 'public', "html", "index.html"))
    }
    else{//begin token generation
        body = "grant_type=authorization_code"
            + "&code=" + code
            + "&redirect_uri=" + encodeURI(redirect_uri)
            + "&client_id=" + client_id

        fetch(TOKEN, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(client_id + ":" + client_secret)
            },
            body: body,
        }).then(response => {
            if(response.ok){//successful token generation
                return response.json()
            }
            else{
                throw new Error("Response not OK")
            }
        }).then(jsonData => {
            const date = new Date()
            const expires = date.getTime() + 1000*jsonData.expires_in
            return {
                access_token: jsonData.access_token,
                refresh_token: jsonData.refresh_token,
                expires: expires
            }
        }).then(tokens => {//store tokens in session, redirect user to "/home"
            req.session.tokens = tokens;
            res.redirect("/home")
        }).catch(err => {//something went wrong, send user to home page with no query params so nothing is exposed
            console.error(err)
            res.redirect(redirect_uri)
        })
    }
    
})

app.get("/AuthCode", (req, res) => {//generate redirect uri to spotify authorization endpoint
    const state = generateRandomString(16)//state key for integrity
    let url = AUTHORIZE;
    url += "?client_id=" + "2843145f9a1341e6b0d6f8ea156c5f69";
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-currently-playing%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public";//requested permissions
    url += "&state=" + state
    req.session.state = state
    res.status(200).json({next: url})
})

app.get("/home", (req, res) => {//always give home.html
    res.sendFile(path.join(__dirname, 'public', "html", "home.html"))
})

//when home.html loads, this endpoint is reached to ensure both client and server agree on tokens
app.use('/AccessToken', bodyParser.json());
app.post("/AccessToken", (req, res) => {
    if(req.session.tokens){//new or continuing session -> overwrite client
        res.json({
            access_token: req.session.tokens.access_token,
            refresh_token: req.session.tokens.refresh_token,
            expires: req.session.tokens.expires
        })//send all token info
    }

    else if(!(req.session.tokens) && req.body.refresh_token && req.body.access_token && req.body.expires){
        //session ended or timed out but user had a previous session -> app is authorized
        //we need to get the most recent credentials used by client
        const date = new Date
        if(date.getTime() < req.body.expires - 300*1000){//if tokens have a lifespan longer than 5 minutes, keep them
            req.session.tokens = {
                access_token: req.body.access_token,
                refresh_token: req.body.refresh_token,
                expires: req.body.expires
            } 
            res.json({
                access_token: req.session.tokens.access_token,
                refresh_token: req.session.tokens.refresh_token,
                expires: req.session.tokens.expires
            })//send all token info
        }
        else {//tokens set to expire
            fetch(TOKEN + "?grant_type=refresh_token&refresh_token=" + refresh_token, {
                method: "POST",
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(client_id + ":" + client_secret)
                }
            }).then(response => {
                if(response.ok){
                    return response.json()
                }
            }).then(jsonData => {
                const date = new Date()
                const expires = date.getTime() + 1000*jsonData.expires_in
                return {
                    access_token: jsonData.access_token,
                    refresh_token: jsonData.refresh_token,
                    expires: expires
                }
            }).then(tokens => {//store tokens in session and send user tokens
                req.session.tokens = tokens;
                res.json(tokens)//send all token info
            }).catch(error => {//error refreshing
                console.log(error)
                res.json({
                    redirect_uri: redirect_uri
                })//send redirect
            })
        }
    }
    else{
        res.json({
            redirect_uri: redirect_uri
        })//send redirect
    }
})

app.use('/RefreshToken', bodyParser.json());
app.post("/RefreshToken", (req, res) => {
    let refresh_token = req.body.refresh_token
    fetch(TOKEN + "?grant_type=refresh_token&refresh_token=" + refresh_token, {
        method: "POST",
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ":" + client_secret)
        }
    }).then(response => {
        if(response.ok){
            return response.json()
        }
    }).then(jsonData => {
        const date = new Date()
        const expires = date.getTime() + 1000*jsonData.expires_in
        return {
            access_token: jsonData.access_token,
            refresh_token: jsonData.refresh_token,
            expires: expires
        }
    }).then(tokens => {//store tokens in session, redirect user to "/home"
        req.session.tokens = tokens;
        res.redirect("/home")
    }).catch(error => {
        console.log(error)
        res.redirect(redirect_uri)
    })
})



var generateRandomString = function (length) {//code provided by spotify tutorials
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};