// download_prog - displays multiple simulated progress bars indicating the speed to download a payload
// Author: David Kulp, dkulp@dizz.org

var msInterval = 100;
var bitsPerMs = { DSL: 3000, satellite: 12000, fiber1: 25000, fiber2: 1000000 };
var downloadedBits = { };

var payloadBits = undefined;  // set by form
var intervalId = undefined;

function displayMs(ms) {
    sec = ms / 1000;
    min = sec / 60;
    hour = min / 60;
    if (hour > 1) {
        return Math.floor(hour) + " hours " + (Math.floor(min) % 60) + " mins ";
    }
    else if (min > 1) {
        return (Math.floor(min) % 60) + " mins ";
    }
    else {
        return Math.floor(sec) + " secs";
    }
}

function setProgress(tag, downloaded, elapsedMs, totalMs) {
    val = downloaded / payloadBits * 100;
    div = $(tag);
    bar = div.find(".progress-bar");
    barWidth = bar.parent().width();
    if (val > 100) { val = 100; downloaded = payloadBits; elapsedMs = totalMs; }
    bar.width(barWidth * val / 100);
    bar.children("span").html((downloaded/1000000/8).toFixed(1) + "MB " + Math.round(val) + "% completed");
    div.find("small").html(displayMs(elapsedMs) + " / " + displayMs(totalMs) + " total");
}

function incProgress(k) {
    bitsPerInterval = bitsPerMs[k] * msInterval;
    downloadedBits[k] += bitsPerInterval;
}

function setProgressAll() {
    $.each(downloadedBits, function(k,v) { setProgress("#" + k, v, v/bitsPerMs[k], payloadBits/bitsPerMs[k]); })
}

function incProgressAll() {
    $.each(bitsPerMs, function(k,v) { incProgress(k); })
}

function updateAll() {
    setProgressAll();
    incProgressAll();
}

function resetDownloaded() {
    $.each(bitsPerMs, function(k,v) { downloadedBits[k] = 0; });
}

$( document ).ready(function() {
    $( "button.start" ).click(function( event ) {
        resetDownloaded();
        clearInterval(intervalId);
        intervalId = setInterval(updateAll, msInterval);
    });

    $( "button.reset" ).click(function( event ) {
        resetDownloaded();
        clearInterval(intervalId);
        setProgressAll();
    });

    $( "#payload" ).change(function( event ) { 
        resetDownloaded(); 
        payloadBits = this.value * 8; 
    });
    $( "#payload" ).change();
});


