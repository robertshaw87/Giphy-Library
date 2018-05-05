var tagLibrary = ["cat", "kitten", "puppy"];

function displayButtons() {
    $("#buttons-area").empty();
    for (var i=0; i<tagLibrary.length; i++) {
        var newButton = $("<button>");
        newButton.addClass("btn btn-outline-secondary");
        newButton.attr("type", "button");
        newButton.text(tagLibrary[i]);
        newButton.attr("data-name", tagLibrary[i]);
        $("#buttons-area").prepend(newButton);
    }
}

$(document).ready(function() {
    displayButtons()

});