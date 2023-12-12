import React from 'react'
import NavBar from '../Components/NavBar'
import Footer from "../Components/Footer"
import "../index.css"
import "./About.css"

const About = () => {
  return (
    <div>
      <NavBar></NavBar>
        <div className='postNav centerContent'>
          <div className='paragraphContainer'>
            <p className='myTitle'>
              What is Sequence
            </p>
            <p>
              Sequence is a web app that communicates with the Spotify API to access 
              information about the musical content in the songs that are in your music library 
              and reorganize your playlists based on your input. We also call it Sequence.js
              Who might wanna use it ?!?!
            </p>   
            <p className='myTitle'>
              How Sequence Started
            </p>
            <p>
              One night in high school, a group of us were listening to music through a speaker and 
              Danny said, "I wish Spotify would change their shuffling algorithm so that consecutive songs 
              would blend together better." We talked about this on and off for awhile, not really having 
              any idea how this could be accomplished until I began pursuing a career in software development. 
              This was during my third year of university when I landed a Full Stack software development job 
              and began learning principles of web development and I discovered the Spotify API.
            </p>
            <p className='myTitle'>
              How Sequence Works
            </p>
            <p>
              From a technical standpoint, Sequence works based on principles of authorization and authentication. 
              What that means is when you click the "Get Started!" button, you will be redirected to Spotify's log in page 
              to grant our app a variety of permissions. These are outlined in the scopes section
              /url to github?? GABAGPP
            </p>
            <p className='myTitle'>
              Want to Reach Out?
            </p>
            <p>
              Contact us using any of the platforms in the footer. We are open to suggestions,
            </p>
          </div>
        </div>
      <Footer></Footer>
    </div>
  )
}

export default About
