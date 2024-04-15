$(document).ready(()=>{
    $('form').on('submit',(e)=>{
        const form = {
            email : $(e.target).children()[1].value,
            password : $(e.target).children()[3].value, 
        }
        console.log(form)
        e.preventDefault()
        userLogIn(form)
        .then((data)=>{

            if(data.message) {
                $('#formMessageLogin').html(data.message)
            }
            else if(data.accessToken){
                window.location.href = `../index.html?loggedIn=true&accessToken=${data.accessToken}`
            }
        })
        .catch((error)=>{
            console.log(error)
        })
        
    })
    
})

const userLogIn = (form)=>{
    
    return fetch('http://localhost:9999/logIn',{
        method : "POST",
        headers : {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body : JSON.stringify(form)  //The password should be hashed before sending and dehashed on server side to compare
        
    })
    .then((response)=>{
        return response.json()

    })
    .catch((error)=>{
        console.error(error)
    })
}