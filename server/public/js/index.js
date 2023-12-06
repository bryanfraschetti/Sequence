const entry_point = "http://127.0.0.1:3000/"

async function requestAuthorization(){
    try {
        const response = await fetch("/initiateAuth", {
            method: "GET",
        })
        if(response.ok){
            data = await response.json()
            window.location.href = data.next
        }
        else{
            throw new Error("Response not OK")
        }
    }
    catch (error) {
        window.location.href = entry_point
    }
}

function Unauthorize(){
    Object.keys(localStorage).forEach(el => {
        localStorage.removeItem(el)
    })

    fetch("/Unauthorize", {
        method: "GET"
    }).then(response => {
        if(response.ok){
            return response.json()
        }
        else{
            throw new Error("Response not OK")
        }
    }).then(data => {
        if(!data.destroyed){
            throw new Error("Failed to unauthorize")
        }
    }).catch(error => {
        console.error(error)
    })
    
    window.location.href = entry_point
}


