const API_KEY = "AyKHNtrxNT9prYSzp1cctLQpsQk"
const API_URL = "https://ci-jshint.herokuapp.com/api"          // saves typing url for each call to api
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));   // allow to trigger modals using js (create modal using single line of js)

//add event listener to first button. then call getStatus function,(e),event object, is passed but not needed now but is good practice with handlers
document.getElementById("status").addEventListener("click", e => getStatus(e));

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`  //this follows the "get" instruction from https://ci-jshint.herokuapp.com/

    const response = await fetch(queryString);  
    //response is converted to json
    // json method returns a promise, which must be awaited also
    const data = await response.json();          //data return will either be key expiry date or an error

    //if server returns code if 200, all is ok and ok property is true
    //console out server response
    if (response.ok) {
        displayStatus(data.expiry);  //display data in the modal instead of console logging
        //console.log(data) //can log data.expiry instead to only see date in console without the status code
    } else{
        throw new Error(data.error); //data.error is descriptive message from json that is returned
    }
}

//create modal
function displayStatus(data) {

    let heading = "API_Key status";
    let results = `<div>Your key is valid until</div>`
    results += `<div class ="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerHTML = heading;
    Document.getElementById("results-content").innerHTML = results;
    resultsModal.show();

}