$(document).ready(()=>{
    $('#buttonSubmitAddPP').click((e)=>{
        e.preventDefault()
        addNewProperty()
        .then((data)=>{
            console.log(data.message)
        })
        .catch((e)=>{console.error(e)})


    })
})
function goHome(){
    window.location.href = "../index.html";
}

const addNewProperty = () => {
    const url = 'http://localhost:9999/addProperty';

    if($('#pName').val() === '') return

    const formData = new FormData();
    formData.append('name', $('#pName').val());
    formData.append('price', $('#rentalPrice').val());
    formData.append('capacity', $('#capacity').val());
    formData.append('neighborhood', $('#neighborhood').val());
    formData.append('address', $('#address').val());
    formData.append('area', $('#sqFeet').val());
    formData.append('parking', $('#parking').val());
    formData.append('publicTransportation', $('#publicTransportation').val());
    formData.append('smoke', $('#smoke').val());
    const fileInput = $('#images')[0];
    if (fileInput.files.length > 0) {
        formData.append('images', fileInput.files[0]);
    }

    return fetch(url, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('Token')
        },
        body: formData
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });
};

/*
const addNewProperty = ()=>{
    const url = 'http://localhost:9999/addProperty'
    const newProperty = {
        name : $('#pName').val(),
        price : $('#rentalPrice').val(),
        capacity : $('#capacity').val(),
        neighborhood : $('#neighborhood').val(),
        address : $('#address').val(),
        area : $('#sqFeet').val(),
        parking : $('#parking').val(),
        publicTransportation : $('#publicTransportation').val(),
        smoke : $('#smoke').val(),
        images : $('#images')[0].files
        
    }
    return fetch(url,{
        method : "POST",
        headers : {'Content-type': 'application/json; charset=UTF-8'},
        body : JSON.stringify(newProperty)
    })
    //return await response.json()
}
*/