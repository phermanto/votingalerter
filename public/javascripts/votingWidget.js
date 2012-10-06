var lowThreshold = -4;
var highThreshold = 4;
var socketC;

var getRating = function () {
    var value = $('#voteWrapper').attr('ratingval');
    return parseInt(value);
}

var updateRating = function (value) {
    //var displayElem = $('#voteContainer');
    var displayElem = $('[ratingval]');
    displayElem.attr("ratingval", value);
    if (value > 0) {
        
        $(".decision").removeClass("visible");
        $("#tooFast").addClass("visible");
    } else if (value < 0) {
        $(".decision").removeClass("visible");
        $("#tooSlow").addClass("visible");
    } else {
        $(".decision").removeClass("visible");
        $("#justRight").addClass("visible");
    }
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
var getNumberParticipants = function (e) {
    return $("#peopleList div").length;
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
    socketC = io.connect('http://' + window.location.hostname + ':3000');

    socketC.on('count', function (data) {
        console.log("Client recieved message with value: " + data.value);
        updateRating(data.value);
    });
    
    $('#low').click(voteLowHandler);
    $('#high').click(voteHighHandler);
});