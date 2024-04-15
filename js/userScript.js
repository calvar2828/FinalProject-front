
$(document).ready(()=>{
    enableTitle()
    enableFilter() //Imported filters from main page should be readen inside enableFilterst to decide if default should be used
    enableOwnerOptions()
    enableRegistrationFeature()

    const queryParams = getQueryParams()
    if(queryParams.filters){
        SearchFilters = JSON.parse(queryParams.data)
        console.log(SearchFilters)
    }
    if(window.sessionStorage.getItem('Token')){
        const encodedToken = window.sessionStorage.getItem('Token')
        let tokenPayload = encodedToken.split('.')[1]
        tokenPayload =  JSON.parse(atob(tokenPayload.replace(/-/g, '+').replace(/_/g, '/'))); //Decodes URLBase64 encoding
        console.log(tokenPayload)
        //ENABLE OWNER OPTIONS WHEN LOGGED IN AS AN OWNER
        if(tokenPayload.role === 'Owner'){
            $('.goOwnerPage').show()
            console.log('owner page')
        }

        $('.login-button > p').html('Log-Out')
        $('.pop-out-register > h2').html('Log-Out')
        $('.sign-in-button').hide()
        $('.pop-out-register > p').hide()
        $('.login-button').click((e)=>{
            window.sessionStorage.removeItem('Token')
            window.location.href = "./html/index_login.html"
        })
    }
})
function goHome() {
    window.location.href = "../index.html";
}
function showFilteredProperties(){
    window.location.href = "../html/user_properties.html";
}
//-----------------------------------------------------------------------------------------------------------------------------------
//MAIN FUNCTIONS:
function getQueryParams() {
    var queryParams = {};
    var queryString = window.location.search.substring(1); //Returns the query string part of the url without ?
    var vars = queryString.split("&");//Separate by each parameter
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("="); // convert the key value pair string into a 2 element array
        queryParams[pair[0]] = decodeURIComponent(pair[1]); // converts arrays into object
    }
    return queryParams;
}

const enableTitle = ()=>{
    $('.firstlayer').append(`<h1> Find a Space...</h1>`)
}
//ENABLE FILTER
const enableFilter = ()=>{
    $('.underlayer').append(
        `
        <label class="filter">
            <p>Search</p>
        </label>
        `
    )
   
    $('#two.overlayer').addClass('scale-in-center').append( `<div class="pop-out-filter"> </div>`)
 
    //HIDES OVELAYER FOR FILTER
    $('#two.overlayer, .pop-out-filter' ).hide()
 
    //FILTER BUTTON
    whenHovered($('.filter'))
 
    //ENABLES POP-OUT-FILTER WINDOW
    enablePopOutFilter()
}

const enableOwnerOptions = ()=>{
    $('.underlayer').append(
        `
        <label class="goOwnerPage" onclick="goOwnerPage()">
            <p>Owner page</p>
        </label>
        `
    )
    $('.goOwnerPage').hide()
    whenHovered($('.goOwnerPage'))
}
function goOwnerPage(){
    window.location.href = "./html/index_ownerpage.html";
}
//-----------------------------------------------------------------------------------------------------------------------------------
//ENABLES THE POP-OUT FILTER FEATURES
const enablePopOutFilter = ()=>{
    //HEADER ATTACHED TO POP-OUT-WINDOW
    $('.pop-out-filter').append(
        `
        <nav><button id="reset-calendar" class="close-window"></button></nav>
        <header>
            <h2>Filters</h2>
            <div class="filter-bar">
                <label for="address">
                    <p id="address">Location</p>
                </label>
                <div class="separator"></div>
                <label for="check-in">
                    <p id="check-in">Check-In</p>
                </label>
                <div class="separator"></div>
                <label for="check-out">
                    <p id="check-out">Check-Out</p>
                </label>
            </div>                  
        </header>
        `
    )
    //MAIN ATTACHED TO POP-OUT-WINDOW && CALENDAR ATTACHED TO MAIN
    .append(
        `
        <main>
            <div class="address-list"></div>
            <div class="calendar"></div>
            <div class="other-filters"></div>
            
        </main>

        `
    )
    //FOOTER ATTACHED TO POP-OUT-WINDOW
    .append(
        `
        <footer>
            <button class="reset-filters"><p>Reset</p></button>
            <button class="search-button"><p>Search</p></button>
        </footer>
        `
    )
    $('.other-filters').append(
        `
        <label>
            <p>Start Date: </p>  <input type="text" readOnly>        
        </label>
        <label>
        <p>End Date: </p>  <input type="text" readOnly>        
        </label>
        <label>
        <p>Location: </p>  <input type="text" readOnly>        
        </label>
        <label>
        <p>Area (sqf): </p>  <input type="text" >        
        </label>
        <label>
        <p>Capacity: </p>  <input type="text" >        
        </label>
        <label>
        <p>Smoking: </p>  <input list="smoking">   
        <datalist id="smoking">
        <option>Yes</option>
        <option>No</option>
        </datalist>     
        </label>
        <label>
        <p>Public Transportation: </p>  <input list="smoking" >   
        <datalist id="smoking">
        <option>Yes</option>
        <option>No</option>
        </datalist>     
        </label>
        
        <p class="error"></p>        
        
        `
    )
    //LIST OPTIONS FOR SMOKING AND TP GETS REFRESHED EVERY TIMED CLICKED
    for(let i=0; i < $('input[list]').length; i++){
        refreshListOptions($($('input[list]')[i]))
    }
    //APPENDS A LOCATION OPTION TO THE LIST FOR EACH PROPERTY
    dataSet[2].forEach((property)=>{
        $('.address-list').append(`<p class="property-address">${property.address} (${property.neighborhood}) </p>`)    
    })
    //HIDES THE LOCATION LIST AT THE BEGINNING
    $('.address-list').hide()
    $('.error').hide()
    //CALENDAR CREATION!!!!!
    createCalendar()
    
    //ADDS CLICK LISTENER TO NEXT BUTTON OF CALENDAR
    $('.next').click(()=>{
        refreshDates()
        //Changes the month
        toNextMonth(new Date(), Calendar)
        //Display the month correctly
        assignDates()
        })
   //ADDS CLICK LISTENER TO LAST BUTTON OF CALENDAR
    $('.back').click(()=>{
        refreshDates()
        //Changes the month
        toLastMonth(new Date(), Calendar)
        //Display the month correctly
        assignDates()
        })

    //THIS BLOCK IDENTIFIES IF THE SELECTED DATE IS CHECKIN OR CHEKOUT
    whenHovered($('#address'))
    whenHovered($('#check-in'))
    whenHovered($('#check-out'))
    //ENABLES THE LOCATION FILTER LIST
    var addresses = $('.address-list').children()
    $('#address').click(()=>{
        $('.calendar').hide()
        $('.address-list').show()
        for(let i = 0; i < addresses.length; i++){
            fingering($(addresses[i]), 'rgb(255, 99, 71, 0.3)')
        }
    })
    //SETS THE CHOSEN LOCATION AS FILTER VALUE
    for(let i = 0; i < addresses.length; i++){
        $(addresses[i]).click((e)=>{
            SearchFilters.location = $(e.target).html()
            $($('.other-filters > label > input')[2]).val(`${SearchFilters.location}`)
        })
    }
    fingering($('.reset-filters'), 'rgb(255, 99, 71, 0.3)')
    resetFilters($('.reset-filters'))

    //TRY N CATCH BLOCK OF CODE FOR SUBMITTING THE FILTER PARAMETERS
    //WE ALSO VALIDATE AREA AND CAPACITY FIELDS SMOKING AND TP TOO
    //OTHER FIELDS ARE ALREADY 'VALIDATED' BY THEIR RESPECTIVE FUNCTIONS
    fingering($('.search-button'), 'rgb(173, 255, 00, 0.3)')
    $('.search-button').click(()=>{
        try{
        let inputs = $('.other-filters > label input')
        // console.log(numberInputs)
            if($(inputs[0]).val() === '') SearchFilters.checkIn = `${new Date().getDate()}-${Calendar.MonthsOfYear[(parseInt(new Date().getMonth()))][0]}-${new Date().getFullYear()}`
            if($(inputs[1]).val() === '') SearchFilters.checkOut = `${new Date().getDate()}-${Calendar.MonthsOfYear[(parseInt(new Date().getMonth()))][0]}-${new Date().getFullYear()}`
            if($(inputs[2]).val() === '') SearchFilters.location = 'anywhere'
            if(!NumberTypeValidation($(inputs[3]))) throw new Error('Please entre only numbers')
            if($(inputs[3]).val() === '') SearchFilters.area = 1000
            else SearchFilters.area = $(inputs[3]).val()
        
        //FILTER FOR CAPACITY
        if(!NumberTypeValidation($(inputs[4]))) throw new Error('Please entre only numbers')
            if($(inputs[4]).val() === '') SearchFilters.capacity = 1000
            else SearchFilters.capacity = $(inputs[4]).val()

        if(!yesOrNoValidation($(inputs[5]))) throw new Error('Please Select a valid option for smoking')

        if(!yesOrNoValidation($(inputs[6]))) throw new Error('Please Select a valid option for Public Transportation')

        //FILTER FOR SMOKING
        if($(inputs[5]).val() === 'Yes') SearchFilters.smoking = true
        else if($(inputs[5]).val() === 'No') SearchFilters.smoking = false
        else SearchFilters.smoking = 'IDC'

        //FILTER FOR PUBLIC TRANSPORTATION
        if($(inputs[6]).val() === 'Yes') SearchFilters.publicTransport = true
        else if($(inputs[6]).val() === 'No') SearchFilters.publicTransport = false
        else SearchFilters.publicTransport = 'IDC'

            //SEARCHFILTER PARAMETERS 

            //CLOSING OVERLAYER
            $('#two.overlayer').children().removeClass('scale-in-center').addClass('scale-out-center')
            $('#two.overlayer').removeClass('scale-in-center').addClass('scale-out-center')
            setTimeout(()=>{
                
                $('.month-year').html(`${Calendar.MonthsOfYear[parseInt(new Date().getMonth())][0]} - ${new Date().getFullYear()}`)
                Calendar.next = 0
                Calendar.back = 0
                          
                $('.calendar').hide()
                $('.address-list').hide()

                setTimeout(()=>{
                    $('section').addClass('kenburns-bottom-left')
                }, 500)
              
               setTimeout(()=>{ 
                //HERE GOES THE HTTP REQUEST WITH THE FILTERSEARCH INFORMATION IN JSON
                    console.log(SearchFilters)            
                    sendFilters(SearchFilters)
                    .then((data)=>{
                        window.location.href = `./cooworker_properties.html?filters=true&data=${JSON.stringify(data)}`
                    })
                    .catch((error)=>{ console.error(error)})
                },2000)
             
        })       
        }
        catch(e){
            console.log(e.message)
            $('.error').html(e.message).show()
        }        
    })                     
}
//-----------------------------------------------------------------------------------------------------------------------------------
const sendFilters = (filters)=>{
    const url = 'http://localhost:9999/filters'
    const filterBody = {
        checkIn : filters.checkIn, 
        checkOut : filters.checkOut, 
        location : filters.location, 
        area : filters.area, 
        capacity : filters.capacity,
        smoking : filters.smoking,
        publicTransport : filters.publicTransport,
    }
    return fetch(url,{
        method : "POST",
        headers : {'Content-type': 'application/json; charset=UTF-8'},
        body : JSON.stringify(filterBody)
    }).then((response)=>{
        return response.json()
    })
}


//-----------------------------------------------------------------------------------------------------------------------------------
 
//ENABLES THE REGISTRATION FEATURE
//export { enableRegistrationFeature } 
const enableRegistrationFeature = ()=>{
 
    //The following section replaces adding html elements inside the index files.
   
    $('.underlayer').append(
        `
        <label class="register">
            <img src="../images/logos/birth-logo.png" alt="">
            <p>Register</p>
        </label>
        `
    )
    $('#one.overlayer').addClass('scale-in-center').append(
        `
        <div class="pop-out-register">
            <nav><button class="close-window"></button></nav>
            <h2>Please Login to Continue</h2>
            <button class="login-button"><p>Login</p></button>
            <p>or</p>
            <button class="sign-in-button"><p>Sign-In</p></button>
        </div>
        `
    )
    $('.close-window').append('<img src="../images/logos/closeX.webp"/>')
    //HIDES OVELAYERS FOR REGISTER
    $('#one.overlayer, .pop-out-register' ).hide()
   
    //REGISTER BUTTON
    whenHovered($('.register'))
 
    //TO CLOSE OVERLAYER
    whenHovered($('.close-window'))
 
    //TO LOG-IN PAGE
    whenHovered($('.login-button'), '../html/index_login.html')
   
    //TO SIGN-IN PAGE
    whenHovered($('.sign-in-button'),'../html/index_signin.html')
   
    //After DOM Elements added, the corner register features shows up when clicked.
    whenHovered($('.register'))
 
}
 
//-----------------------------------------------------------------------------------------------------------------------------------
 
// SUPPLEMENTARY FUNCTIONS. BECAUSE MY IMPORT COMMAND NEVER WORKS....IDKW
 

let openOverlayer = (button, overlayer)=>{
    button.click(()=>{
        overlayer.removeClass('scale-out-center').addClass('scale-in-center').show()
       
        setTimeout(()=>{
            overlayer.children().removeClass('scale-out-center').addClass('scale-in-center').show()
                // scale in effect.
            },550)
     
        })

}
 
let closeOverlayer =(button, overlayer)=>{
    button.click(()=>{
        overlayer.children().removeClass('scale-in-center').addClass('scale-out-center')
        overlayer.removeClass('scale-in-center').addClass('scale-out-center')
        setTimeout(()=>{
    
            $('.month-year').html(`${Calendar.MonthsOfYear[parseInt(new Date().getMonth())][0]} - ${new Date().getFullYear()}`)
            Calendar.next = 0
            SearchFilters.checkIn = `${new Date().getDate()}-${Calendar.MonthsOfYear[(parseInt(new Date().getMonth()))][0]}-${new Date().getFullYear()}`
            SearchFilters.CheckOut = `${new Date().getDate()}-${Calendar.MonthsOfYear[(parseInt(new Date().getMonth()))][0]}-${new Date().getFullYear()}`
            
        
            $('.calendar').hide()
            $('.address-list').hide()
            
        },1000)
})

}
 
let fingering = (element, color)=>{
    element.on('mouseover',()=>{
        if(element.html() === ''){return}
        element.addClass('shadow').css({'backgroundColor': `${color}`, 'cursor':'pointer' })
    })
    element.on('mouseout',()=>{
        element.removeClass('shadow').css({'backgroundColor': 'inherit','cursor':'inherit' })
    })
}
 
let goTo = (button, url)=>{
    button.click(()=>{
        setTimeout(()=>{
            $('section').addClass('kenburns-bottom-left')
        }, 500)
       
        setTimeout(()=>{
            window.open(url, '_self')
        },1000)  
    })      
}
 
let whenHovered= (element, url)=>{
 
    //ASSIGNS CLICK LISTENER TO  REGISTER POP-OUT-WINDOW'S BUTTONS
   
    if(element[0].className === 'search-button'){
        fingering(element, 'red')
        closeOverlayer(element, $('#two.overlayer'))
        
    }
    else if(element[0].className === 'login-button' || element[0].className === 'sign-in-button'){
        //TRANSFORMS THE POINTER INTO SELECTOR WHEN HOVERED
        fingering(element, 'red')
        //ANYWAY THE OVERLAYER AND THE POP-OUT WINDOWS NEEDS TO BE CLOSED.
        closeOverlayer(element, $('#one.overlayer'))
        //IF THE BUTTON IS LOGIN OR SIGNIN WEB BROWSER REQUEST ANOTHER PAGE!!!
        goTo(element, url) //END POINT END POINT END POINT!!!
       
    }
    //cLOSES OVERLAYER AND POP-OUT WINDOWS
    else if(element[0].className === 'close-window'){    
        fingering(element, 'red')
        closeOverlayer(element, $('.overlayer'))
                          
    }
 
    //ASSIGNS CLICK LISTENER TO MAIN PAGE'S BUTTONS. NOT REAL BUTTONS.
    else if(element[0].className === 'register'){
        fingering(element, 'transparent')
        openOverlayer($('.register'), $('#one.overlayer') )      
    }
    else if(element[0].className === 'filter'){
        fingering(element, 'transparent')
        openOverlayer($('.filter'), $('#two.overlayer') )      
    }
    else if(element[0].className === 'goOwnerPage'){
        fingering(element, 'transparent')
    }
    else if(element[0].id === 'check-in')  {
        fingering(element, 'transparent')
        //console.log(element[0].id)
        toggleCalendar(element)

    }
        //openOverlayer($('.filter'), $('#two.overlayer') )      
    else if(element[0].id === 'check-out'){
        fingering(element, 'transparent')
        toggleCalendar(element)
    }
    else if(element[0].id === 'address'){
        fingering(element, 'transparent')
    }
    else if(element[0].className === 'next' || element[0].className === 'back'){
        fingering(element, 'transparent')

    }
    else return
}
//export { whenHovered }
//-----------------------------------------------------------------------------------------------------------------------------------
 
//MONTHS OBJECT CREATION FOR EASING THINGS:
 
let Calendar = {
 
    next:0,
    origin:'',
    MonthsOfYear : [
        ['January',31],
        ['February',28],
        ['March',31],
        ['April',30],
        ['May',31],
        ['June',30],
        ['July',31],
        ['August',31],
        ['September',30],
        ['October',31],
        ['November',30],
        ['December',31]
    ],
    DaysOfWeek : [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ]
 
}

let toggleCalendar = (element)=>{
    
    if(element[0].id === "check-in"){
        element.click(()=>{
            $('.calendar').hide()
            $('.address-list').hide()
            refreshDates()
            assignDates()
            $('.calendar').show()
            let elem = $('.month-days').children()
            for(let i=0; i<elem.length; i++){
                let subElem = $(elem[i]).children()   
                subElem[0].id = 'origin-clicked'
                fingering(subElem,'rgb(173, 255, 00, 0.3)')            
            }
        })
        let elem = $('.month-days').children()
        for(let i=0; i<elem.length; i++){
            let subElem = $(elem[i]).children() 
            subElem.click(()=>{ 
                //console.log()
                if(subElem.html()==='' || subElem[0].id === 'end-clicked') return
                let month = $('.month-year').html().split(' - ')
                let currentMonth = `${Calendar.MonthsOfYear[parseInt(new Date().getMonth())][0]}`
                if(subElem.html() < new Date().getDate() && month[0] === currentMonth ) return
                checkIn(SearchFilters, subElem)
                //console.log(`Start Date: ${SearchFilters.checkIn}`) 
                //console.log(Calendar.CheckInClicked)
            })
            //chooseDate(subElem)
        }

    }
    else if(element[0].id === "check-out"){
        element.click(()=>{
            $('.calendar').hide()
            $('.address-list').hide()
            refreshDates()
            assignDates()
            $('.calendar').show()
            let elem = $('.month-days').children()
            for(let i=0; i<elem.length; i++){
                let subElem = $(elem[i]).children()
                subElem[0].id = 'end-clicked' 
                fingering(subElem,'rgb(255, 99, 71, 0.3)')               
            }
        })
        let elem = $('.month-days').children()
            for(let i=0; i<elem.length; i++){
                let subElem = $(elem[i]).children()
                subElem.click(()=>{ 
                    if(subElem.html()===''|| subElem[0].id === 'origin-clicked') return
                    let month = $('.month-year').html().split(' - ')
                    let currentMonth = `${Calendar.MonthsOfYear[parseInt(new Date().getMonth())][0]}`
                    if(subElem.html() < new Date().getDate() && month[0] === currentMonth ) return
                    let checkInDate = SearchFilters.checkIn.split('-')
                    if(subElem.html() < checkInDate[0]) return                  
                    checkOut(SearchFilters, subElem)
                    //console.log(`End Date: ${SearchFilters.checkOut}`) 
                })
                
            }

    }

}
 
let toNextMonth = (date, Calendar)=>{
    Calendar.next++
    if(parseInt(date.getMonth()) + Calendar.next <= 11){
        $('.month-year').html(`${Calendar.MonthsOfYear[parseInt(date.getMonth()) + Calendar.next][0]} - ${date.getFullYear()}`)
    }else {
        Calendar.next = 11 - parseInt(date.getMonth())
        return
    }
}
let toLastMonth = (date, Calendar)=>{
    Calendar.next--
    if(parseInt(date.getMonth()) + Calendar.next >= date.getMonth()){
        $('.month-year').html(`${Calendar.MonthsOfYear[parseInt(date.getMonth()) + Calendar.next][0]} - ${date.getFullYear()}`)
    }
    else {
        Calendar.next = 0
        return
    }
}
 let getDayOfWeek = (date, Calendar) =>{
   
    const dayIndex = new Date(date).getDay();
    return Calendar.DaysOfWeek[dayIndex];
}
let appendWeekDaysToCalendar = ()=>{
    Calendar.DaysOfWeek.forEach((day)=>{
        $('.week-days').append(`<p class = "week-day">${day}</p>`)
    })
}
let appendMonthDaysToCalendar = ()=>{
    $('.calendar').append(`<div class = "month-days"></div>`)
    let j =0
    for(let i = 0; i < 35; i++){
       
        if(j < 7){
            $('.month-days').append(`<div class="${Calendar.DaysOfWeek[j]}"><p class = "month-day"></div>`)
           
            j++
        }
        else{
            j = 0
            $('.month-days').append(`<div class="${Calendar.DaysOfWeek[j]}"><p class = "month-day"></div>`)
            j++
        }
    }
}
 
 
let assignDates = ()=>{
 
    let startIndex = getStartIndex() //INDEX OF DATE WHERE MONTH STARTS
    let monthDays = $('.month-days').children() //DATES CONTAINER
    let j=1
 
    for(let i = startIndex; i < monthDays.length; i++){
        if(j > getEndDate()){
            continue
        }
 
        $(monthDays[i]).children().html(j)
        j++
    }
   
    return (getEndDate()-(monthDays.length-startIndex))
}
 
 
let refreshDates = ()=>{

    let monthDays = $('.month-days').children() //DATES CONTAINER
    for(let i = 0; i < monthDays.length; i++){
        $(monthDays[i]).children().html('')
    }
 
}
let assignMissingDates=(missingDates, datemissing)=>{
    let startIndex = getStartIndex() //INDEX OF DATE WHERE MONTH STARTS
    let monthDays = $('.month-days').children() //DATES CONTAINER
    let i=startIndex-1
    while(missingDates>0){
        $(monthDays[i]).children().html(datemissing)
        i--
        missingDates--
    }
}
 
let getStartIndex = ()=>{
   
    //let currentDate = ``
    //
   
    let dynamicMonth1stDay = getDayOfWeek(`01-${$('.month-year').html().replace(/\s+/g, '')}`, Calendar) //GETS THE 1ST DAY OF MONTH
    let days = $('.month-days').children() //DATES CONTAINER
    //console.log(dynamicMonth1stDay)
    switch(dynamicMonth1stDay){
 
        case 'Sunday':
            return lookForStartIndex(dynamicMonth1stDay, days)
        case 'Monday':
            return lookForStartIndex(dynamicMonth1stDay, days)
        case 'Tuesday':
            return lookForStartIndex(dynamicMonth1stDay, days)
        case 'Wednesday':
            return lookForStartIndex(dynamicMonth1stDay, days)
        case 'Thursday':
            return lookForStartIndex(dynamicMonth1stDay, days)
        case 'Friday':
            return lookForStartIndex(dynamicMonth1stDay, days)
        case 'Saturday':
            return lookForStartIndex(dynamicMonth1stDay, days)
    }
   
 
}
 
let getEndDate = ()=>{
   
    let currentMonth = $('.month-year').html().split(' - ')
   
    for(let i =0; i < Calendar.MonthsOfYear.length; i++){
        if(currentMonth[0] === Calendar.MonthsOfYear[i][0]){
            //console.log(Calendar.MonthsOfYear[i][1])
            return Calendar.MonthsOfYear[i][1]
        }      
    }
}
 
 
let lookForStartIndex = (dynamicMonth1stDay, days)=>{
   
    for(let i=0; i < days.length; i++){
    if(days[i].className === `${dynamicMonth1stDay}`){
        //console.log(i)
        return i //RETURNS THE INDEX OF THE DATE WHER THE MONTH STARTS
        }
    }  
}
 
let createCalendar = ()=>{
    let date = new Date()
    let currentMonth = Calendar.MonthsOfYear[(parseInt(date.getMonth()))][0]
    //console.log(parseInt(date.getMonth()))
    let currentYear = date.getFullYear()
    origin = `${date.getDate()}-${Calendar.MonthsOfYear[(parseInt(date.getMonth()))][0]}-${date.getFullYear()}`
   
 
    $('.calendar').hide().append(
        `
        <div class="MONTH-YEAR">
            <p class ="back"> &#60 </p>
            <p class = "month-year">${currentMonth} - ${currentYear}</p>
            <p class ="next"> > </p>
        </div>
        `
    )
   
    .append(`<div class="week-days"></div>`) //THIS SETS WEEK DAYS AS HEADERS
 
    appendWeekDaysToCalendar()  //APPENDS WEEK DAYS FROM SUNDAY=0 TO SATURDAY =6
   
    appendMonthDaysToCalendar() //APPENDS A DAY FOR EACH MONTH DATE AND CLASSIFIES DAYS ACCORDING TO THE WEEKDAY LIKE COLUMNS
   
    whenHovered($('.back'))
    whenHovered($('.next'))
 
    //ALSO WE HAVE TO SET THE DAYS ORDER FOR THE CURRENT MONTH...
    // If i give a date to getDayOfWeek it returns the week day.
    assignDates()

 
}
var checkIn = (Filters, subElem)=>{
    let monthYear=$('.month-year').html().split(' - ')
    if(subElem.html() === '') return
    if(subElem[0].id === "origin-clicked"){
        let originDate = subElem.html()
        let originMonth = monthYear[0]
        let originYear = monthYear[1]
        Filters.checkIn = `${originDate}-${originMonth}-${originYear}`
        $($('.other-filters > label > input')[0]).val(`${Filters.checkIn}`)
    }

}

var checkOut = (Filters, subElem)=>{
    let monthYear=$('.month-year').html().split(' - ')
    if(subElem.html() === '') return
    if(subElem[0].id === "end-clicked"){
        let EndDate = subElem.html()
        let EndMonth = monthYear[0]
        let EndYear = monthYear[1]
        Filters.checkOut = `${EndDate}-${EndMonth}-${EndYear}`
        $($('.other-filters > label > input')[1]).val(`${Filters.checkOut}`)
    }else return
}
let refreshListOptions = (list)=>{
    list.click(()=>{
        list.val('')
    })
}
//INPUT VALIDATION FOR CAPACITY AND AREA FIELDS
let NumberTypeValidation = (input)=>{
    let filter = input.val()
    for(let char in filter){
        if(isNaN(filter.charAt(char))){
            return false
        }
    }
    return true
}
let yesOrNoValidation = (input)=>{
    let value = input.val()
    if(value === '')return true //EL QUE CALLA OTORGA
    else if(value === 'Yes') return true
    else if(value === 'No') return true
    else return false
}
let resetFilters = (button)=>{
    button.click(()=>{
        $('.other-filters input').val('')
        SearchFilters.checkIn= `${new Date().getDate()}-${Calendar.MonthsOfYear[(parseInt(new Date().getMonth()))][0]}-${new Date().getFullYear()}`
        SearchFilters.checkOut= `${new Date().getDate()}-${Calendar.MonthsOfYear[(parseInt(new Date().getMonth()))][0]}-${new Date().getFullYear()}`
        SearchFilters.location=`anywhere`
        SearchFilters.area= 1000,
        SearchFilters.capacity=1000
        SearchFilters.smoking= true
        SearchFilters.publicTransport= true
    })
}

//FILTER OBJECT
//THIS OBJ PARAMETERS GET REPLACED WHEN THE PAGE LOADS BY THE PARAMETERS FETCHED FROM THE MAIN PAGE POST
//AFTER FETCHED THE CODE DISLAYS THEM
let SearchFilters = {
    
    checkIn: `${new Date().getDate()}-${Calendar.MonthsOfYear[(parseInt(new Date().getMonth()))][0]}-${new Date().getFullYear()}`,
    checkOut: `${new Date().getDate()}-${Calendar.MonthsOfYear[(parseInt(new Date().getMonth()))][0]}-${new Date().getFullYear()}`,
    location:`anywhere`,
    area: 1000,
    capacity:1000,
    smoking: 'IDC',
    publicTransport: 'IDC'
}
//DATASET
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
const getProperties = ()=>{
    return fetch('http://localhost:9999/getProperties')
    .then((response)=>{
        if(!response.ok){
            throw new Error('Unable to fetch data')
        }
        return response.json()})
}
async function filterProperties(filters) {
    try{
        //console.log(filters)
        let filteredProperties = await getProperties()
        //console.log(filteredProperties)
        if (filters.publicTransport === 'IDC' && filters.smoking === 'IDC' && filters.capacity === 1000 && filters.area === 1000 && filters.location === 'anywhere') {
            return filteredProperties;
        }
    
    
        if (filters.smoking !== 'IDC') {
            filteredProperties = filteredProperties.filter(property => property.smoke === (filters.smoking === 'Yes' ? "Yes" : "No"));
        }
        if (filters.publicTransport !== 'IDC') {
            filteredProperties = filteredProperties.filter(property => property.publicTransportation === (filters.publicTransport === 'Yes' ? "Yes" : "No"));
        }
        if (filters.capacity !== 1000) {
            filteredProperties = filteredProperties.filter(property => property.capacity >= parseInt(filters.capacity));
        }

        if (filters.area !== 1000) {
            filteredProperties = filteredProperties.filter(property => property.area >= parseInt(filters.area));
        }
        if (filters.location!=='anywhere'){
            filteredProperties = filteredProperties.filter(property => property.address === filters.location );
        }   
        //console.log(filterProperties) 
        return filteredProperties;
    }
    catch(e){
        console.error(e)
    }   
}

const filteredProperties = filterProperties(SearchFilters);


async function showAllProperties() {
    const filteredProperties = await filterProperties(SearchFilters);
    console.log(filteredProperties)

    if (filteredProperties.length > 0) {
        let propertiesHtml = '';
        filteredProperties.forEach(property => {
            propertiesHtml += `
                <div class="property">
                    <div class="propertyInfo">
                        <div id="picture" data-id="${property.propertyID}">
                            <img id="im${property.propertyID}" src=${property.imageURL} alt="${property.propertyName}">
                        </div>
                        <h2>${property.propertyName}</h2>
                        <p><strong>Rental Price:</strong> ${property.price}</p>
                        <p><strong>Capacity:</strong> ${property.capacity}</p>
                        <div>
                            <input type="button" value="Previous" class="button-gallery" id="previous${property.propertyID}">
                            <input type="button" value="Next" class="button-gallery" id="next${property.propertyID}">
                            <!-- Aquí agregamos el evento onclick con el ID de la propiedad -->
                            <button onclick="showPropertyDetails(${property.propertyID})" class="button-gallery">Details</button>
                        </div>
                    </div>
                </div>
            `;
        });

        document.getElementById('listOfProperties').innerHTML = propertiesHtml;
    } else {
        document.getElementById('listOfProperties').innerHTML = '<p>No properties found.</p>';
    }
}




// Función para cargar y mostrar los detalles de la propiedad
function showPropertyDetails(itemId) {
    const selectedPropertyId = itemId;
    window.location.href = `../html/cooworker_space_details.html?id=${selectedPropertyId}`;
}
showAllProperties();
document.addEventListener('DOMContentLoaded', function () {
    const imagesProperties = [
        ["../images/properties/1/1.jpg", "../images/properties/1/2.jpg", "../images/properties/1/3.jpg"],
        ["../images/properties/2/1.jpg", "../images/properties/2/2.jpg", "../images/properties/2/3.jpg"],
        ["../images/properties/3/1.jpg", "../images/properties/3/2.jpg", "../images/properties/3/3.jpg"]
    ];
    const filteredProperties = filterProperties(SearchFilters);
    // variable para rastrear la posición actual de la imagen para cada propiedad
    let currentProperty = [0, 0];

    function updateImage(propertyId) {
        let imageElement = document.getElementById("im" + propertyId);
        let propertyIndex = parseInt(propertyId) - 1;
        imageElement.src = imagesProperties[propertyIndex][currentProperty[propertyIndex]];
    }

    for (let i = 0; i < filteredProperties.length; i++) {
        let propertyId = filteredProperties[i].id;
        document.getElementById(`previous${propertyId}`).addEventListener('click', function () {
            currentProperty[propertyId - 1]--;
            if (currentProperty[propertyId - 1] < 0) {
                currentProperty[propertyId - 1] = imagesProperties[propertyId - 1].length - 1;
            }
            updateImage(propertyId);
        });
    }

    for (let i = 0; i < filteredProperties.length; i++) {
        let propertyId = filteredProperties[i].id;
        document.getElementById(`next${propertyId}`).addEventListener('click', function () {
            currentProperty[propertyId - 1]++;
            if (currentProperty[propertyId - 1] >= imagesProperties[propertyId - 1].length) {
                currentProperty[propertyId - 1] = 0;
            }
            updateImage(propertyId);
        });
    }
});

