async function requestAuthorization(){
    try {
        const response = await fetch("/AuthCode", {
            method: "GET",
        })
        if(response.ok){
            data = await response.json()
            window.location.href = data.next
        }
    }
    catch (error) {
        console.error(error)
    }

}



