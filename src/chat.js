import { createStore, applyMiddleware } from 'redux';

const ON_MESSAGE = 'ON_MESSAGE';
const ON_RESET = "RESET";

export const sendMessage = (text, sender='user', time, more, moreInfo) => ({
    type: ON_MESSAGE,
    payload: {text, sender, time, more, moreInfo} 
});

export const resetSession = (text, sender='bot', time, more, moreInfo) => ({
    type: ON_RESET,
    payload: {text, sender, time, more, moreInfo} 
})

export const getCurrentDate = () => {
    var currentTime = new Date(); //Current Date
    // var currentOffset = currentTime.getTimezoneOffset();
    // var ISTOffset = 330;
    // var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
    var date = currentTime.getDate(); // Current Date
    var month = currentTime.getMonth() + 1; //Current Month
    var year = currentTime.getFullYear(); //Current Year
    var hours = currentTime.getHours(); //Current Hours
    var min = currentTime.getMinutes(); //Current Minutes
    var sec = currentTime.getSeconds(); //Current Seconds
    return date + '/' + month + '/' + year
           + ' ' + hours + ':' + min + ':' + sec;
  }

const messageMiddleware = () => next => action => {
    document.getElementById("textInput").value = '';
    document.getElementsByClassName("spinner")[0].hidden = false;
    next(action);
    
    if(action.type === ON_MESSAGE){
        const {text} = action.payload;
        let wasServerTimeout = true;
        let wasCallTimeOut = true;
        const timeout = setTimeout(() => {
            if(wasServerTimeout){
                document.getElementsByClassName("spinner")[0].hidden = true;
                next(resetSession("Session timed out", 'bot', getCurrentDate(), false, ''));
            }
        } , 2*60*1000)

        const callTimeOut = setTimeout(() => {
            if(wasCallTimeOut){
                document.getElementsByClassName("spinner")[0].hidden = true;
                //wasServerTimeout = false;
                next(sendMessage("I am still learning, I can assist you with Incident Management, Job Monitoring, Smart Recommendations for Issue resolutions, In case you have any other issues, please reach out to our expert services team on 1800-801-2222. \nThank you for contacting us", 'bot', getCurrentDate(), false, ''));
            }
        } , 20000)
        
        fetch('http://127.0.0.1:5023/process?msg='+text, {
            method: 'POST',
            mode: 'cors',
            dataType: 'json',
            timeout: 2000
        }).then(results => {
                return results.clone().json();
        }).then(data => {
            let message = data.message;
            let more = false;
            if(data.onlyMessage === false){
                let inc_message = '';
                data.mostRelavent.forEach(element => {
                    inc_message = inc_message + '\nIncident: ' + element.inc_number + '\nResolution: '
                    + element.resolution;
                });
                message = message + inc_message;
            }
            let moreInfo = '';
            if(data.more === true){
                moreInfo = moreInfo + 'Few more Related Incidents: \n';
                more = true;
                data.showMore.forEach(element => {
                    moreInfo = moreInfo + element.inc_number + ', ';
                });
                moreInfo = moreInfo.substring(0,moreInfo.length -2);
            }
            setTimeout(function() { //Start the timer
                wasServerTimeout = false;
                wasCallTimeOut = false;
                document.getElementsByClassName("spinner")[0].hidden = true;
                next(sendMessage(message, 'bot', getCurrentDate(), more, moreInfo)); //After 200ms, set render to true
            }.bind(this), 1000)
            //next(sendMessage(message, 'bot'));
        }).catch(error => {
            console.log('found error', error)
          });
    }
}



const initState = [{text: 'Hey, I am D Operate - your IT virtual assistant for all your support needs. Before we get started, May I please know your ID?'
                    , sender: 'bot', time: getCurrentDate(), more: false, moreInfo: ''}];

const messageReducer = (state=initState, action) => {
    switch(action.type){
        case ON_MESSAGE:
            return [...state, action.payload]
        case ON_RESET:
            return initState;
        default:
            return state;
    }
}

export const store = createStore(messageReducer, applyMiddleware(messageMiddleware));

