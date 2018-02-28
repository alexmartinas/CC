
window.onload = function() {
    var raspuns;
    var request = new XMLHttpRequest();
    var url = 'https://newsapi.org/v2/top-headlines?' +
        'country=us&' +
        'apiKey=cbb01973cc74429e91624c1f9ca54bad';
    request.open("GET", url);
    request.send();
    request.onloadend = function (data) {
        logs.requests[logs.requestsNumber] = {};
        logs.requests[logs.requestsNumber].type = "GET";
        logs.requests[logs.requestsNumber].url = url;
        logs.requests[logs.requestsNumber].statusCode = data.srcElement.status;
        logs.requests[logs.requestsNumber].time = Date.now();
        logs.requestsNumber++;
        window.localStorage.setItem("logs", JSON.stringify(logs));
        raspuns = JSON.parse(data.srcElement.response).articles;
        var i = 0;
        while (raspuns[i].description === null || raspuns[i].urlToImage === null || raspuns.url === null || raspuns.title === null){
            i++;
        }
        document.getElementById('news-title').textContent = raspuns[i].title;
        document.getElementById('news-description').textContent = raspuns[i].description;
        document.getElementById('news-source').href = raspuns[i].url;
        document.getElementById('news-image').src = raspuns[i].urlToImage;
        document.getElementById('translated-news-image').src = raspuns[i].urlToImage;
        document.getElementById('translated-news-source').href = raspuns[i].url;
        document.getElementById('news-source').style.display = 'block';
        document.getElementById('news-image').style.display = 'block';

        console.log(raspuns);
    };
};

function translateText() {
    var raspuns;
    var title = document.getElementById('news-title').textContent;
    var description = document.getElementById('news-description').textContent;
    var request = new XMLHttpRequest();
    var url = 'https://www.googleapis.com/language/translate/v2?key=AIzaSyBH1WAZbfad7TTBVl-mS4KLiFxhfoaPjpo&source=en&target=ro&q=' + title + '&q=' + description;
    request.open('GET', url);
    request.onloadend = function (data) {
        logs.requests[logs.requestsNumber] = {};
        logs.requests[logs.requestsNumber].type = "GET";
        logs.requests[logs.requestsNumber].url = url;
        logs.requests[logs.requestsNumber].statusCode = data.srcElement.status;
        logs.requests[logs.requestsNumber].time = Date.now();
        logs.requestsNumber++;
        window.localStorage.setItem("logs", JSON.stringify(logs));
        raspuns = JSON.parse(data.srcElement.response).data.translations;
        document.getElementById('translated-news-title').textContent = raspuns[0].translatedText;
        document.getElementById('translated-news-title').style.display = 'block';
        document.getElementById('translated-news-description').textContent = raspuns[1].translatedText;
        document.getElementById('translated-news-description').style.display = 'block';
        document.getElementById('translated-news-source').style.display = 'block';
        document.getElementById('translated-news-image').style.display = 'block';
        document.getElementById('get-audio-button').style.display = 'block';

    };
    request.send();
}


var audioFile;
function textToSpeech() {
    var raspuns;
    var token;
    //get tts token
    var requestToken = new XMLHttpRequest();
    var url = "https://api.cognitive.microsoft.com/sts/v1.0/issueToken";
    requestToken.open('POST', url);
    requestToken.setRequestHeader('Ocp-Apim-Subscription-Key', '56d368557837449b99537bab27fa43a1');
    requestToken.send();
    requestToken.onloadend = function (data) {
        logs.requests[logs.requestsNumber] = {};
        logs.requests[logs.requestsNumber].type = "POST";
        logs.requests[logs.requestsNumber].url = url;
        logs.requests[logs.requestsNumber].statusCode = data.srcElement.status;
        logs.requests[logs.requestsNumber].time = Date.now();
        logs.requestsNumber++;
        window.localStorage.setItem("logs", JSON.stringify(logs));
        token = data.srcElement.response;
        var title = document.getElementById('translated-news-title').textContent;
        var description = document.getElementById('translated-news-description').textContent;
        var request = new XMLHttpRequest();
        url = 'https://speech.platform.bing.com/synthesize';
        request.open('POST', url);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.setRequestHeader('X-Microsoft-OutputFormat', 'audio-16khz-32kbitrate-mono-mp3');
        request.setRequestHeader('Authorization', token);
        request.responseType = 'blob';
        var body = '<speak version=\'1.0\' xml:lang=\'ro-RO\'><voice xml:lang=\'ro-RO\' xml:gender=\'Male\' name=\'Microsoft Server Speech Text to Speech Voice (ro-RO, Andrei)\'>' + title + '.' + description + '</voice></speak>'
        request.send(body);
        request.onloadend = function (data) {
            logs.requests[logs.requestsNumber] = {};
            logs.requests[logs.requestsNumber].type = "POST";
            logs.requests[logs.requestsNumber].url = url;
            logs.requests[logs.requestsNumber].statusCode = data.srcElement.status;
            logs.requests[logs.requestsNumber].time = Date.now();
            logs.requestsNumber++;
            window.localStorage.setItem("logs", JSON.stringify(logs));
            audioFile = data.srcElement.response;
            document.getElementById('news-audio').src = URL.createObjectURL(audioFile);
            document.getElementById('news-audio').style.display = 'block';
        }
    };

}