var logs;
if (!window.localStorage.getItem("logs")){
    logs = {};
    logs.requestsNumber = 0;
    logs.requests = [];
} else {
    logs = JSON.parse( window.localStorage.getItem("logs"));
}
window.onload = function () {
    var logsElm = document.getElementById("loging");
    for (let key in logs.requests ) {
        var p = document.createElement("DIV");
        p.textContent = "Request number: " + key;
        logsElm.appendChild(p);

        p = document.createElement("DIV");
        p.textContent = "Request url: " + logs.requests[key].url;
        logsElm.appendChild(p);

        p = document.createElement("DIV");
        p.textContent = "Request method: " + logs.requests[key].type;
        logsElm.appendChild(p);

        p = document.createElement("DIV");
        p.textContent = "Request code: " + logs.requests[key].statusCode;
        logsElm.appendChild(p);

        p = document.createElement("DIV");
        p.textContent = "Request time: " + logs.requests[key].time;
        logsElm.appendChild(p);

        p = document.createElement("BR");
        p.textContent = "Request time: " + logs.requests[key].time;
        logsElm.appendChild(p);
    }
};