var tagLibrary = ["cat", "kitten", "puppy"];
var apiKey = "eHgmDylg8joewr7ihES0vUNAqBZPIsTj";

// display all the values of the tagLibrary as buttons in the buttons-area div
function displayButtons() {
    $("#buttons-area").empty();
    for (var i=0; i<tagLibrary.length; i++) {
        var newButton = $("<button>");
        newButton.addClass("btn btn-outline-secondary search-tag");
        newButton.attr("type", "button");
        newButton.text(tagLibrary[i]);
        newButton.data("name", tagLibrary[i]);
        $("#buttons-area").prepend(newButton);
    }
}

function makeImage(obj) {
    console.log(obj);
    var tempImage = $("<img>");
}

// add the category we input when we click the add button
$(document).on("click", "#add-button", function(event) {
    event.preventDefault();
    // This line of code will grab the input from the input area
    var newQuery = $("#user-input").val().trim();
    // clear the input area
    $("#user-input").val("");
    tagLibrary.push(newQuery);

    // Calling renderButtons which handles the processing of our movie array
    displayButtons();

  });

// get the images we want with an ajax call to the giphy API when we click the button
$(document).on("click", ".search-tag", function(event){
    // set the query url for our ajax call, we dont want more than 10 results
    var userQuery = "https://api.giphy.com/v1/gifs/search?api_key="+apiKey+"&q="+$(this).data("name")+"&limit=10";
    console.log(userQuery);
    $.ajax({
        url: userQuery,
        method: "GET"
    }).then(function(response) {
        var result = response.data;
        for (var i=0; i<result.length; i++) {
            makeImage(result[i]);
        }
      })
})

$(document).ready(function() {
    displayButtons()

});