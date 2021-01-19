const {ipcRenderer} = require('electron')
var valid = require("valid-url");

var panel = document.getElementById("panel");
var searchbar = document.getElementById("urlbar");
var gotoButton = document.getElementById("goto");
var page = document.getElementById("page");
var oldUrl = undefined;
var bhistory = [];

window.onresize = function () {

    var pbound = panel.getBoundingClientRect();

    page.style.height = window.innerHeight - pbound.height
    page.style.width = window.innerWidth;

    console.log(pbound);

    var bound = page.getBoundingClientRect();

    ipcRenderer.send('resize', bound.x, bound.y, bound.height, bound.width);
}
ipcRenderer.on("seturl", function(event, url){
    console.log("SETURL", url);
    if(oldUrl != url){
        searchbar.value = url;
        oldUrl = url;
        bhistory.push({
            date: new Date(),
            url,
            oldUrl
        })
    }
})

gotoButton.onclick = function(){
    console.log(searchbar.value)
    if(valid.isUri(searchbar.value)){
        if(String(searchbar.value).startsWith("electik://")){
            console.log(searchbar.value);
            return;
        }else ipcRenderer.send("showurl", searchbar.value)
    }else{
        ipcRenderer.send("showurl", "https://www.google.com/search?q=" + searchbar.value)
    }
}

searchbar.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        gotoButton.click();
    }
});


setInterval(() => {
    ipcRenderer.send('geturl');
}, 1000);