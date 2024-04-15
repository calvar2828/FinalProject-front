// Función para redirigir a la página de inicio
function goHome(){
    window.location.href = "../index.html";
}


let dataSet = 
[
[], //Coworkes
[], //Owners
[    {
    type: "property",
    id: 1,
    name: "Property 1",
    rentalPrice: 1500,
    capacity: 4,
    neighborhood: "Downtown",
    address: "123 Main St",
    sqFeet: 1200,
    parking: "Yes",
    publicTransportation: "Yes",
    smoke: "Yes",
    Email: "calvar2828@gmail.com", 
    userType: "owner" 
},
{
    type: "property",
    id: 2,
    name: "Property 2",
    rentalPrice: 2000,
    capacity: 6,
    neighborhood: "Suburbia",
    address: "456 Elm St",
    sqFeet: 1800,
    parking: "No",
    publicTransportation: "No",
    smoke: "No",
    Email: "calvar2828@gmail.com", 
    userType: "owner" 
}], // Property
[] // Reservation
]


// Función para obtener la propiedad por su ID
function getPropertyById(id) {
    return dataSet[2].find(property => property.id === id);
}

// Función para cargar y mostrar los detalles de la propiedad
function showPropertyDetails(itemId) {
    // Obtener el objeto de la propiedad según su ID
    const item = getPropertyById(itemId);

    // Verificar si la propiedad existe
    if (item) {
        // Construir el HTML para mostrar los detalles de la propiedad con campos de entrada
        const propertyHtml = `
            <label><strong>Property Name:</strong> <input type="text" id="pName" value="${item.name}"></label><br>
            <label><strong>Rental Price:</strong> <input type="number" id="rentalPrice" value="${item.rentalPrice}"></label><br>
            <label><strong>Capacity:</strong> <input type="text" pattern="\d+" id="capacity" value="${item.capacity}"></label><br>
            <label><strong>Neighborhood:</strong> <input type="text" id="neighborhood" value="${item.neighborhood}"></label><br>
            <label><strong>Address:</strong> <input type="text" id="address" value="${item.address}"></label><br>
            <label><strong>Sq Feet:</strong> <input type="text" pattern="\d+" id="sqFeet" value="${item.sqFeet}"></label><br>
            <label><strong>Parking:</strong> 
                <select id="parking">
                    <option value="Yes" ${item.parking === 'Yes' ? 'selected' : ''}>Yes</option>
                    <option value="No" ${item.parking === 'No' ? 'selected' : ''}>No</option>
                </select>
            </label><br>
            <label><strong>Public Transportation:</strong> 
                <select id="publicTransportation">
                    <option value="Yes" ${item.publicTransportation === 'Yes' ? 'selected' : ''}>Yes</option>
                    <option value="No" ${item.publicTransportation === 'No' ? 'selected' : ''}>No</option>
                </select>
            </label><br>
            <label><strong>Smoke availability:</strong> 
                <select id="smoke">
                    <option value="Yes" ${item.smoke === 'Yes' ? 'selected' : ''}>Yes</option>
                    <option value="No" ${item.smoke === 'No' ? 'selected' : ''}>No</option>
                </select>
            </label><br>
            <button onclick="updateProperty(${itemId})" id="updateProperty">Update</button>
        `;

        // Mostrar los detalles de la propiedad en el elemento con ID "propertyInfo"
        document.getElementById('propertyInfo').innerHTML = propertyHtml;
    } else {
        // Si la propiedad no existe, mostrar un mensaje de error
        document.getElementById('propertyInfo').innerHTML = '<p>Property not found.</p>';
    }
}

showPropertyDetails(1)
