import express from "express";
import session from "express-session";

// Token Related Routes
import initiateAuthRoute from "./routes/tokenHandlers/initiateAuth.js";
import authorizationCallbackRoute from "./routes/tokenHandlers/authorizationCallback.js";
import accessTokenRoute from "./routes/tokenHandlers/accessToken.js";
import refreshTokenRoute from "./routes/tokenHandlers/refreshToken.js";
import unauthorizeRoute from "./routes/tokenHandlers/unauthorize.js";

// Cache Related routes
import createUserCacheRoute from "./routes/cacheHandlers/createUserCache.js";
import retrieveUserCacheRoute from "./routes/cacheHandlers/retrieveUserCache.js";
import updatePlaylistsCacheRoute from "./routes/cacheHandlers/updatePlaylistsCache.js";
import retrievePlaylistsCacheRoute from "./routes/cacheHandlers/retrievePlaylistsCache.js";
import updateTracklistCacheRoute from "./routes/cacheHandlers/updateTracklistCache.js";
import retrieveTracklistCacheRoute from "./routes/cacheHandlers/retrieveTracklistCache.js";
import createTrackCacheRoute from "./routes/cacheHandlers/createTrackCache.js";
import retrieveTrackCacheRoute from "./routes/cacheHandlers/retrieveTrackCache.js";

// Session signer
const cookieSigner = process.env.COOKIE_SIGNER;

// Instantiate
const app = express();
app.listen(3001);

// Define session parameters
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: cookieSigner,
  })
);

// OAuth routes
app.use("/api/initiateAuth", initiateAuthRoute); // Starts OAuth handshaking process
app.use("/api/authorizationCallback", authorizationCallbackRoute); // On callback (return) from Spotify
app.use("/api/AccessToken", accessTokenRoute); // This endpoint is to ensure both client and server agree on tokens
app.use("/api/RefreshToken", refreshTokenRoute); // This endpoint refreshes the users tokens
app.use("/api/Unauthorize", unauthorizeRoute); // Decommission Sequence

// Cache routes
app.use("/api/users/create", createUserCacheRoute); // Creates record in redis identified by Spotify userId
app.use("/api/users/cache", retrieveUserCacheRoute); // Retrieves record in redis using Spotify userId
app.use("/api/playlists/update", updatePlaylistsCacheRoute); // Modifies Redis record to store playlistIds & artwork
app.use("/api/playlists/cache", retrievePlaylistsCacheRoute); // Retrieves Redis record of playlistIds & artwork
app.use("/api/tracklist/update", updateTracklistCacheRoute); // Modifies cached tracklist of userId's playlistId
app.use("/api/tracklist/cache", retrieveTracklistCacheRoute); // Retrieves cached tracklist of userId's playlistId
app.use("/api/tracks/create", createTrackCacheRoute); // Caches audio analysis for trackId
app.use("/api/tracks/cache", retrieveTrackCacheRoute); // Retrieves audio analysis cache for trackId
