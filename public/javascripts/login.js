
var socketL;

var usernameEnteredHandler = function (e) {
    var name = $('#username').val();
    
    socketL.emit('people', { name: name });
    
    $('#loginContainer').hide();
    $('#voteContainer').show();
    $('#peopleContainer').show();
};

var updateCollaborators = function (names) {
    var list = _.map(names, function(name) {
        return "<div>" + name + "</div>";
    });
    $('#peopleList').html(list.join(" "));
    
}

$(document).ready(function () {
    $('#usernameSubmit').click(usernameEnteredHandler);
    $('#voteContainer').hide();
    $('#peopleContainer').hide();
    
    socketL = io.connect('http://localhost:3000');

    socketL.on('people', function (data) {
        console.log("Client recieved message with people: " + data.list);
        updateCollaborators(data.list);
    });
});