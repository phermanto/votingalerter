var lowThreshold = -4;
var highThreshold = 4;
var socketC;

var getRating = function () {
    var value = $('#progressRating').attr('ratingval');
    return parseInt(value);
}

var updateRating = function (value) {
    var displayElem = $('#progressRating');
    displayElem.attr("ratingval", value);
};

var isInThreshold = function (value) {
    if (value < lowThreshold) {
        return -1;
    } else if (value > highThreshold) {
        return 1;
    }
    return 0;
}

var voteLowHandler = function (e) {
    updateCountHandler(-1);
};

var voteHighHandler = function (e) {
    updateCountHandler(1);
};
var updateCountHandler = function(valueToAdd) {
    var currentRating = getRating();
    var value = currentRating + valueToAdd;
    
    var thresholdValue = isInThreshold(value);
    if (thresholdValue === -1) {
        alert("Too LOW!");
    } else if (thresholdValue === 1) {
        alert("Too HIGH!");
    } else {
        updateRating(value);
        console.log("Client emitting message with value: " + value);
        socketC.emit('count', { value: value });
    }
}

$(document).ready(function () {
    socketC = io.connect('http://localhost:3000');

    socketC.on('count', function (data) {
        console.log("Client recieved message with value: " + data.value);
        updateRating(data.value);
    });
    
    $('#low').click(voteLowHandler);
    $('#high').click(voteHighHandler);
});