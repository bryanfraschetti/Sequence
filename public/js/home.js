const redirect_uri = "http://127.0.0.1:3000/"

async function Exchange(){
    try{
        const access_token = localStorage.getItem("access_token")
        const refresh_token = localStorage.getItem("refresh_token")
        const expires = localStorage.getItem("expires")//get current states

        if(access_token && refresh_token && expires){//all are defined
            const response = await fetch('/AccessToken', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token,
                    expires: expires//post current state to endpoint
                })
            })
            if(response.ok){
                data = await response.json()
                if(data.access_token && data.refresh_token && data.expires){//all are successfully defined
                    localStorage.setItem("access_token", data.access_token)
                    localStorage.setItem("refresh_token", data.refresh_token)
                    localStorage.setItem("expires", data.expires)
                }
                else if(data.redirect_uri){//something went wrong, controlled redirect
                    window.location.href = data.redirect_uri
                }
                else{//something went wrong
                    window.location.href = redirect_uri
                }
            }
        }
        else{//not all are defined
            window.location.href = redirect_uri
        }
    }
    catch (error){//something went wrong
        window.location.href = redirect_uri
    }
}

// async function refreshTokens(){
//     try {
//         let refresh_token = localStorage.getItem("refresh_token")
//         const response = await fetch("/RefreshToken", {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 refresh_token: refresh_token
//             })
//         })
//         if(response.ok){
//             data = await response.json()
//             console.log(data)
//         }
//     }
//     catch (error) {
//         console.error(error)
//     }

// }