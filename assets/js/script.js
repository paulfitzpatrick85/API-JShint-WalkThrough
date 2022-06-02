const API_KEY = "AyKHNtrxNT9prYSzp1cctLQpsQk"
const API_URL = "https://ci-jshint.herokuapp.com/api"          // saves typing url for each call to api
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));   // allow to trigger modals using js (create modal using single line of js)


//add event listener to first button. then call getStatus function,(e),event object, is passed but not needed now but is good practice with handlers
document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));


//create options - a comma separated list of options, rather then the consoles default indivual array of ["options", "es6"(e.g)], [options, es8(e.g)]
function processOptions(form) {         // processOptions is now added to function postForm also
    let optArray = [];
    for (let entry of form.entries()) {
        if (entry[0] === "options") {          //[0] = "options"
            optArray.push(entry[1]);           // [1] = "es6"
        }
    }
    form.delete("options");                    //delete existing options
    form.append("options", optArray.join());   // append new options, optArray is the value, join convert to string with comma by default
    return form;
}

//POST request
async function postForm(e) {
    const form =  processOptions(new FormData(document.getElementById("checksform")));     //formData is a js interface which grabs form data asan object in key pairs
    // for (let entry of form.entries()) {    //for testing return
    //     console.log(entry);
    }
//TEST -entries method allows us to iterate through form data to ensure data was captured 
    // for (let e of form.entries()){     
    //     console.log(e);
    // }

    const response = await fetch(API_URL, {  //must await fetch, as it returns a promise
        method: "POST",
        headers: {
                "Authorization": API_KEY,
             },
             body: form,                   
        });
//ABOVE-- how to send form data to api: because of the formData object we can add it to request.
// it will make a POST request to the api, authorize it with the api key, and attach the form as the body of the request
     
        const data = await response.json();
        //response is converted to json
        // json method returns a promise, which must be awaited also
        if (response.ok) {
            //console.log(data);   //used to test first time round
               displayErrors(data);
        } else {
            throw new Error(data.error);
        }



function displayErrors(data) {
    let heading = `JSHint Results for ${data.file}`; //pickup file value from returned json
    if (data.total_errors === 0) {
        results = `<div class="no _errors">No Errors Reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>` //classes are added if styling is wanted later
        for (let error of data.error_list) {    //names are coming from json that is returned- 
            results += `<div>At line <span class="line">${error.line}</span>,`;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;   //pass in error text returned from json
        }
    }
    document.getElementById("resultsModalTitle").innerHTML = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
};



//GET request
async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`  //this follows the "get" instruction from https://ci-jshint.herokuapp.com/

    const response = await fetch(queryString);  
    //response is converted to json
    // json method returns a promise, which must be awaited also
    const data = await response.json();          //data return will either be key expiry date or an error

    //if server returns code if 200, all is ok and ok property is true
    //console out server response
    if (response.ok) {
        displayStatus(data);  //display data in the modal instead of console logging
        //console.log(data) //can log data.expiry instead to only see date in console without the status code
    } else{
        throw new Error(data.error); //data.error is descriptive message from json that is returned
    }
}

//create modal
function displayStatus(data) {

    let heading = "API_Key status";
    let results = `<div>Your key is valid until</div>`
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerHTML = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}



