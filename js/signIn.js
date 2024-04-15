$(document).ready(()=>{
    goTo($('#goHome'),'../index.html')
    refreshListOptions($('#user-type'))
    $('#submitRegistration').click((e)=>{
        try{
            e.preventDefault()
           
            let formInputs = $('#registrationForm').children()
            for(let i=0;i<formInputs.length;i++){
                if(formInputs[i].value == '') throw new Error('Please provide information for all fields...')
            }
            if(validateStrings($('#Fname'))) throw new Error('Names must not contain numbers...')
            if(validateStrings($('#Lname'))) throw new Error('Names must not contain numbers...')
            if(validateStrings($('#country'))) throw new Error('Names must not contain numbers...')
            if(validatePhoneNumbers($('#phone'))) throw new Error('Invalid phone number...')
            if(validateEmail($('#emailRegistration'))) throw new Error('Invalid email address...')
            if(confirmEmails($('#emailRegistration'),$('#emailRegistrationConfirmation'))) throw new Error('Emails do not match...')    
            if(confirmPassword($('#passwordRegistration'),$('#passwordRegistrationConfirmation'))) throw new Error('Passwords do not match...')
            $('#formMessage').html('')
            console.log('submitted')
            //$('#registrationForm').submit()
            //return
            CheckUserExistanceAndRegister()
            .then((response)=>{
                console.log(response)
                if(response.redirectedURL){
                    console.log('done')
                    window.location.href = response.redirectedURL
                    return
                }
                $('#formMessage').html(response.message)
            })
            .catch((error)=>{

            })
        }
        catch(error){
            console.log(error.message)
            console.error(error)
            $('#formMessage').html(error.message)
        }
    })
})
const CheckUserExistanceAndRegister = ()=>{
    const userData ={
        gender : $('#gender').val(),
        firstName : $('#Fname').val(),
        lastName : $('#Lname').val(),
        country : $('#country').val(),
        phone : $('#phone').val(),
        role : $('#user-type').val(),
        email : $('#emailRegistration').val(), 
        password : $('#passwordRegistration').val()
    }
    return fetch("http://localhost:9999/signIn",{
        method: "POST",
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(userData)
    })
    .then((response)=>{
       return response.json()
    })
}

const goTo = (button, url)=>{
    button.click(()=>{ 
        window.open(url, '_self') 
    })      
}

const validateStrings = (input)=>{
    let string = input.val()
    string = string.trim()
    let strArr = string.split('')
    
    for(let i=0; i<strArr.length; i++){
        if(!isNaN(strArr[i])) 
            return true
    }
    return false
}
const validatePhoneNumbers = (input)=>{
    let phone = input.val()
    phone = phone.trim()
    let phoneNums = phone.split('')
    if(phoneNums.length !== 10) return true
    for(let i=0;i<phoneNums.length;i++){
        if(isNaN(phoneNums[i])) 
            return true
    }
    return false
}
const validateEmail = (input)=>{
    let email = input.val()
    email = email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(email);//RETURNS TRUE IF INVALID
}


const refreshListOptions = (list)=>{

    list.click(()=>{
        let val = list.val()
        list.val('')
        list.on('mouseout',()=>{
            list.val(val)
        })
    })

}

const confirmPassword = (psswrd1,psswrd2)=>{
    if(psswrd1.val() !== psswrd2.val()) return true
    else return false
}
const confirmEmails = (email1,email2)=>{
    if(email1.val() !== email2.val()) return true
    else return false
}