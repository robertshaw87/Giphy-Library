var tagLibrary = ["cat", "kitten", "puppy"];
var apiKey = "eHgmDylg8joewr7ihES0vUNAqBZPIsTj";
var numImages = 12;

// display all the values of the tagLibrary as buttons in the buttons-area div
function displayButtons() {
    $("#buttons-area").empty();
    for (var i=0; i<tagLibrary.length; i++) {
        var newButton = $("<button>");
        newButton.addClass("btn btn-outline-secondary text-light search-tag");
        newButton.attr("type", "button");
        newButton.text(tagLibrary[i]);
        newButton.data("name", tagLibrary[i]);
        $("#buttons-area").prepend(newButton);
    }
}

function makeImage(obj) {
    console.log(obj);
    var tempImage = $("<img>");
    tempImage.addClass("card-img-top"); 
    tempImage.attr("src", obj.images.fixed_width_still.url);
    tempImage.attr("alt", obj.title)
    tempImage.data("animated", false)
    tempImage.data("still-url", obj.images.fixed_width_still.url);
    tempImage.data("animated-url", obj.images.fixed_width.url)
    var tempCard = $("<div>");
    tempCard.addClass("card bg-dark col-md-3 col-sm-6 col-12 p-0 mt-2 mb-2 text-light");
    tempCard.append(tempImage);
    var tempImageOverlay = $("<div>");
    tempImageOverlay.addClass("card-img-overlay text-center p-0");
    tempImageOverlay.attr("style", "height: 100%; background-color: rgba(0,0,0,0);");
    var tempCardText = $("<h5>");
    tempCardText.attr("style", "background-color: rgba(0,0,0,.7);");
    tempCardText.text(obj.title);
    tempImageOverlay.append(tempCardText);
    tempCard.append(tempImageOverlay);
    var tempCardText = $("<h5>");
    tempCardText.addClass("text-center");
    tempCardText.text(obj.rating);
    tempCard.append(tempCardText);
    tempCard.attr("style", "height: 100%")
    return tempCard;
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
    var userQuery = "https://api.giphy.com/v1/gifs/search?api_key="+apiKey+"&q="+$(this).data("name")+"&limit="+numImages;
    console.log(userQuery);
    $.ajax({
        url: userQuery,
        method: "GET"
    }).then(function(response) {
        $("#pictures-area").empty();
        var result = response.data;
        for (var i=0; i<result.length; i++) {
            $("#pictures-area").append($("<div>").addClass("clearfix"))
            $("#pictures-area").append(makeImage(result[i]));
            $("#pictures-area").append($("<div>").addClass("col col-md-1 m-0 p-0"));

        }
      })
})

$(document).ready(function() {
    displayButtons()

});