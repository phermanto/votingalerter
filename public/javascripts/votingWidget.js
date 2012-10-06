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
        $(".decision").hide();
        $("#tooFast").show();
    } else if (value < 0) {
        $(".decision").hide();
        $("#tooSlow").show();
    } else {
        $(".decision").hide();
        $("#justRight").show();
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
    $("[id=low]").attr("disabled", "disabled");
    $("[id=high]").removeAttr("disabled");
};

var voteHighHandler = function (e) {
    updateCountHandler(1);
    $("[id=low]").removeAttr("disabled");
    $("[id=high]").attr("disabled", "disabled")
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