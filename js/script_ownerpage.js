// Función para redirigir a la página de inicio
function goHome() {
    window.location.href = "../index.html";
}

// Función para redirigir a la página de agregar espacio
function goToAddspace() {
    window.location.href = "../html/index_addSpace.html";
}
// import { data } from "/Front/js/data.js";
// Definir los datos de las propiedades en forma de objetos JSON

const dataSet = 
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


// Función para mostrar las propiedades de un propietario específico
function showPropertiesByOwner(ownerEmail) {
    // Obtener las propiedades del propietario
    const properties = dataSet[2].filter(property => property.Email === ownerEmail);

    // Verificar si hay propiedades para mostrar
    if (properties.length > 0) {
        // Construir el HTML para mostrar las propiedades
        let propertiesHtml = '';
        properties.forEach(property => {
            propertiesHtml += `
                <div class="property">
                    <div class="propertyInfo">
                        <div id="picture" data-id="${property.id}">
                            <img id="im${property.id}" src="../images/properties/${property.id}/1.jpg">
                        </div>
                        <h2>${property.name}</h2>
                        <p><strong>Rental Price:</strong> ${property.rentalPrice}</p>
                        <p><strong>Capacity:</strong> ${property.capacity}</p>
                        <input type="button" value="Previous" id="previous${property.id}">
                        <input type="button" value="Next" id="next${property.id}">
                        <button onclick="showPropertyDetails(${property.id})">Details</button>
                    </div>
                </div>
            `;
        });

        // Mostrar las propiedades en el elemento con ID "listOfProperties"
        document.getElementById('listOfProperties').innerHTML = propertiesHtml;
    } else {
        // Si el propietario no tiene propiedades, mostrar un mensaje de error
        document.getElementById('listOfProperties').innerHTML = '<p>No properties found for this owner.</p>';
    }
}

// Función para cargar y mostrar los detalles de la propiedad
function showPropertyDetails(itemId) {
    // Redirigir a la página de detalles de la propiedad con el ID en la URL
    selectedPropertyId = itemId;
    window.location.href = "../html/index_SpaceDetails.html";
}

// Llamar a la función para mostrar las propiedades del propietario
showPropertiesByOwner("calvar2828@gmail.com"); // Aquí deberías pasar el correo electrónico del propietario

document.addEventListener('DOMContentLoaded', function () {
    // Definir las rutas de las imágenes para todas las propiedades
    const imagesProperties = [
        ["../images/properties/1/1.jpg", "../images/properties/1/2.jpg", "../images/properties/1/3.jpg"],
        ["../images/properties/2/1.jpg", "../images/properties/2/2.jpg", "../images/properties/2/3.jpg"],
        ["../images/properties/3/1.jpg", "../images/properties/3/2.jpg", "../images/properties/3/3.jpg"]
    ];

    // Variable para rastrear la posición actual de la imagen para cada propiedad
    let currentProperty = [0, 0];

    // Función para actualizar la imagen
    function updateImage(propertyId) {
        let imageElement = document.getElementById("im" + propertyId);
        let propertyIndex = parseInt(propertyId) - 1;
        imageElement.src = imagesProperties[propertyIndex][currentProperty[propertyIndex]];
    }

    // Asignar evento click para el botón "Previous" de cada propiedad
    for (let i = 0; i < dataSet[2].length; i++) {
        let propertyId = dataSet[2][i].id;
        document.getElementById(`previous${propertyId}`).addEventListener('click', function () {
            currentProperty[propertyId - 1]--;
            if (currentProperty[propertyId - 1] < 0) {
                currentProperty[propertyId - 1] = imagesProperties[propertyId - 1].length - 1;
            }
            updateImage(propertyId);
        });
    }

    // Asignar evento click para el botón "Next" de cada propiedad
    for (let i = 0; i < dataSet[2].length; i++) {
        let propertyId = dataSet[2][i].id;
        document.getElementById(`next${propertyId}`).addEventListener('click', function () {
            currentProperty[propertyId - 1]++;
            if (currentProperty[propertyId - 1] >= imagesProperties[propertyId - 1].length) {
                currentProperty[propertyId - 1] = 0;
            }
            updateImage(propertyId);
        });
    }
});
