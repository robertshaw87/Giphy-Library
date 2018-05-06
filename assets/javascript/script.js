var tagLibrary = ["cat", "kitten", "dog", "puppy", "bulldog", "corgi"];
var apiKey = "eHgmDylg8joewr7ihES0vUNAqBZPIsTj";
var numImages = 12;
var favoriteImages = {};

// display all the values of the tagLibrary as buttons in the buttons-area div
function displayButtons() {
    $("#buttons-area").empty();
    for (var i=0; i<tagLibrary.length; i++) {
        var newButton = $("<button>");
        newButton.addClass("btn btn-outline-secondary text-light search-tag mr-3 mb-3 ");
        newButton.attr("type", "button");
        newButton.text(tagLibrary[i]);
        newButton.data("name", tagLibrary[i]);
        $("#buttons-area").prepend(newButton);
    }
}

function makeImage(obj) {

    var tempImage = $("<img>");
    tempImage.addClass("card-img imgCard-img"); 
    tempImage.attr("src", obj.images.fixed_width_still.url);
    tempImage.attr("alt", obj.title);
    tempImage.attr("data-animated", false);
    tempImage.attr("data-still-url", obj.images.fixed_width_still.url);
    tempImage.attr("data-animated-url", obj.images.fixed_width.url)

    var tempImageOverlay = $("<div>");
    tempImageOverlay.addClass("card-img-overlay text-center p-0 infoCard");
    tempImageOverlay.attr("style", "height: 100%; background-color: rgba(0,0,0,0.7);");
    
    var tempImageTitle = $("<h6>");
    tempImageTitle.addClass("card-title");
    tempImageTitle.text(obj.title);
    tempImageOverlay.append(tempImageTitle);

    var tempImageRating = $("<p>");
    tempImageRating.addClass("card-text");
    tempImageRating.text("Rating: " + obj.rating.toUpperCase());
    tempImageOverlay.append(tempImageRating);

    var tempFavoriteButton = $("<button>");
    tempFavoriteButton.attr("style", "bottom: 0; right: 0 ");
    tempFavoriteButton.addClass("btn position-absolute mb-1 mr-1 favBtn");
    if (!favoriteImages[obj.id]){
        tempFavoriteButton.addClass("btn-dark");
    } else {
        tempFavoriteButton.addClass("btn-danger");
    }
    tempFavoriteButton.data("favObject", obj);
    tempFavoriteButton.text("Favorite");
    tempImageOverlay.append(tempFavoriteButton);

    var tempCard = $("<div>");
    tempCard.addClass("card bg-dark col-lg-3 col-md-5 col-sm-6 col-12 p-0  mt-2 mb-4 text-light imgCard");
    tempCard.attr("style", "height: 100%");
    tempCard.append(tempImage);
    tempCard.append(tempImageOverlay);
    
    return tempCard;
}

$(document).on("click", ".favBtn", function(event){
    var ImageObj = $(this).data("favObject");
    if (favoriteImages[ImageObj.id]){
        delete favoriteImages[ImageObj.id]
        $(this).removeClass("btn-danger");
        $(this).addClass("btn-dark");
    } else {
        favoriteImages[ImageObj.id] = ImageObj;
        $(this).removeClass("btn-dark");
        $(this).addClass("btn-danger");
    }
});

$("#user-input").keydown(function (event){
    if (event.which === 13){
        $("#add-button").click();
    }
});

// add the category we input when we click the add button
$(document).on("click", "#add-button", function(event) {
    event.preventDefault();
    // This line of code will grab the input from the input area
    var newQuery = $("#user-input").val().trim();
    // clear the input area
    $("#user-input").val("");
    if (newQuery != "") {
    tagLibrary.push(newQuery);
    }
    // Calling renderButtons which handles the processing of our movie array
    displayButtons();

  });

// get the images we want with an ajax call to the giphy API when we click the button
$(document).on("click", ".search-tag", function(event){
    // set the query url for our ajax call, we dont want more than 10 results
    var userQuery = "https://api.giphy.com/v1/gifs/search?api_key="+apiKey+"&q="+$(this).data("name")+"&limit="+numImages;
    $.ajax({
        url: userQuery,
        method: "GET"
    }).then(function(response) {
        $("#pictures-area").empty();
        var result = response.data;
        for (var i=0; i<result.length; i++) {
            // $("#pictures-area").append($("<div>").addClass("clearfix"))
            $("#pictures-area").append($("<div>").addClass("col col-md-1 col-lg-1 m-0 p-0"));
            $("#pictures-area").append(makeImage(result[i]));


        }
      })
})

$(document).on("click", ".imgCard", function(event){
    if ($(event.target).is("button")) return;
    image = $(".imgCard-img", this);
    var state = image.data("animated");
    if (!state){
        image.attr("src", image.data("animated-url"));
        image.data("animated", true)
    } else if (state) {
        image.attr("src", image.data("still-url"));
        image.data("animated", false)
    }
})

$(document).ready(function() {
    displayButtons()
});