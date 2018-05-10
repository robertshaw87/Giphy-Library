// the default values for the category buttons, the user will add to this through the input element
var tagLibrary = ["cat", "kitten", "dog", "puppy", "bulldog", "squirrel", "penguin", "corgi"];

// this is my giphy api key
var giphyApiKey = "eHgmDylg8joewr7ihES0vUNAqBZPIsTj";

// my omdb api key
var movieKey = "6b7754e4"

// the default number of images we grab with each api call
var numImages = 12;
// this tracks the number of images we want with a more images button press
    // will be incremented by numImages before the ajax call
var moreImagesCount = numImages;

// storage for the images the user has favorited
    // key will be the gif id, value will be the entire image object that giphy passes us for that image id
var favoriteImages = {};
// will be storing all the pictures that we want displayed on the homepage
var homePictures = [];
// this stores the current image tag that we're searching for in order to help with the more images button logic
var currentTag = "";
// this is the movie poster to be displayed on the homepage
var homeMovie = undefined;

// display all the values of the tagLibrary as buttons in the buttons-area div
function displayButtons() {
    // clear the buttons area
    $("#buttons-area").empty();
    // iterate through the list of tags
    for (var i=0; i<tagLibrary.length; i++) {
        // make a new button element
        var newButton = $("<button>");
        // add the classes to that button, padding to size it and margins to space them
        newButton.addClass("btn btn-primary text-light search-tag p-1 pr-2 pl-2 mr-3 mb-3 ");
        // do I even need this?
        newButton.attr("type", "button");
        // set the text to be the current tag we've iterated to
        newButton.text(tagLibrary[i]);
        // put a data-name value here equal to the name for later api queries
        newButton.data("name", tagLibrary[i]);
        // add the new button to the front of the buttons area
        $("#buttons-area").prepend(newButton);
    }
}

// make the image card we're putting into the images output area after we get passed an image obj from the Giphy api
function makeImage(obj) {
    // make an image element to be the background of the card
    var tempImage = $("<img>");
    // bootstrap class to be the card background and our own imgCard-img class so we can refer to this later
    tempImage.addClass("card-img imgCard-img"); 
    // set the default picture to be the still image
    tempImage.attr("src", obj.images.original_still.url);
    // alt text will be the title of the gif
    tempImage.attr("alt", obj.title);
    // default state of the picture is not animated
    tempImage.attr("data-animated", false);
    // url of the still and animated pictures stored for later retrieval to toggle picture state
    tempImage.attr("data-still-url", obj.images.original_still.url);
    tempImage.attr("data-animated-url", obj.images.original.url)
    // make the image circular by default
    

    // make the image overlay that will only show on mouseover
    var tempImageOverlay = $("<div>");
    tempImageOverlay.addClass("card-img-overlay text-center p-1 infoCard");    
    // this is going to be the title of the gif that we're adding to the image overlay
    var tempImageTitle = $("<h6>");
    tempImageTitle.addClass("card-title");
    tempImageTitle.text(obj.title);
    // adding to the overlay, not the card
    tempImageOverlay.append(tempImageTitle);

    // the rating for the gif that we're also going to add to the overlay
    var tempImageRating = $("<p>");
    tempImageRating.addClass("card-text text-left");
    tempImageRating.text("Rating: " + obj.rating.toUpperCase());
    // adding to the overlay, not the card
    tempImageOverlay.append(tempImageRating);

    // this is the favorite button, it will be toggleable and also shows whether the current picture is favorited
        // also will be hidden with the overlay
    var tempFavoriteButton = $("<img>");
    // starting state of the heart depending on if they were already in the favorites
    if (!favoriteImages[obj.id]){
        tempFavoriteButton.attr("src", "assets/images/notFav.png");
    } else {
        tempFavoriteButton.attr("src", "assets/images/yesFav.png");
    }
    // make the heart smaller
    tempFavoriteButton.attr("height", "30px");
    // moving the button to the bottom right of the overlay
    tempFavoriteButton.attr("style", "bottom: 0; right: 0;");
    // stores the image object as data thanks to jQuery. We can pull this out later when we want to show the image
    tempFavoriteButton.data("favObject", obj);
    // favBtn is our own class used to refer to this button later
    // absolute positioning so its positioned relative to the overlay
    tempFavoriteButton.addClass("position-absolute favBtn mr-1 mb-1");
    // adding the favorite button to the overlay
    tempImageOverlay.append(tempFavoriteButton);

    // the download button, it's on the overlay so will be hidden when the overlay is hidden
    var tempDownloadButton = $("<img>");
    // setting the image to the download image
    tempDownloadButton.attr("src", "assets/images/download.png");
    // making the image the same size as the favorites button
    tempDownloadButton.attr("height", "25px");
    // move the button to the bottom left of the overlay
    tempDownloadButton.attr("style", "bottom: 0; left:0;");
    // store the url where the user will download the image
    tempDownloadButton.data("downloadUrl", obj.images.original.url);
    // downBtn is our own class used to refer to this button later
    // absolute positioning so its positioned relative to the overlay
    tempDownloadButton.addClass("position-absolute downBtn ml-1 mb-1");
    
    // make a wrapper so the user can download the gif
    var tempDownloadWrapper = $("<a>");
    // set the link url to the gif location
    tempDownloadWrapper.attr("href", obj.images.original.url);
    // set default download name to the title of the image
    tempDownloadWrapper.attr("download", obj.title);
    // opens the image in a new window in case the browser doesn't support one click downloads
    tempDownloadWrapper.attr("target", "_blank");
    
    // add the download button wrapper to the overlay
    tempDownloadWrapper.append(tempDownloadButton);
    tempImageOverlay.append(tempDownloadWrapper);

    // creates the wrapper card that we're going to add the image and the overlay to
    var tempCard = $("<div>");
    tempCard.addClass("card bg-dark col-lg-3 col-md-5 col-sm-6 col-12 p-0 mt-2 mb-4 text-light imgCard");
    tempCard.append(tempImage);
    tempCard.append(tempImageOverlay);
    
    // pass back the entire card we've made
    return tempCard;
}

// displays the banner over the images with the argument as the zone descriptor
function displayBanner(str) {
    $("#banner-area").empty();
    // make the jumbotron
    var banner = $("<div>");
    banner.addClass("jumbotron col");
    // this is the wrapper around the banner content
    var bannerCont = $("<div>");
    bannerCont.addClass("row");
    bannerCont.append($("<div>").addClass("col"));    
    bannerCont.append($("<div>").addClass("display-4 banner-text").text("Welcome to the " + str + " zone!"));
    bannerCont.append($("<div>").addClass("col"));    
    banner.append(bannerCont);
    
    $("#banner-area").html(banner);
}

// displays the more images button in the utility area which is under the search bar
function displayHomeUtilityButton () {
    // remove any other buttons that might be there
    $("#utility-area").empty();
    // make a new button element
    var tempButton = $("<button>");
    tempButton.addClass("btn btn-info col");
    // this is the id we're going to be listening to
    tempButton.attr("id", "moreBtn")
    tempButton.text("More Images");
    // adding col to either side to automatically center the button
    $("#utility-area").append($("<div>").addClass("col"));
    $("#utility-area").append(tempButton)
    $("#utility-area").append($("<div>").addClass("col"));
}

// displays the images that were previously on the pictures area before switching to the favorites screen
function displayHome() {
    $("#pictures-area").empty();
    // the homePictures array stores all the image objects that were in the pictures area
    for (var i=0; i<homePictures.length; i++) {
        $("#pictures-area").append($("<div>").addClass("col col-md-1 col-lg-1 m-0 p-0"));
        // calling the makeImage function in order to make the image cards
        $("#pictures-area").append(makeImage(homePictures[i]));
    }
    if (currentTag){
        displayBanner(currentTag);
    } else {
        $("#banner-area").empty()
    }
    displayMovie();
    // show the more images button again
    displayHomeUtilityButton();
}

// displays all the images that the user has favorited in the pictures area
function displayFavorites() {
    $("#pictures-area").empty();
    // iterate through the favoriteImages object
    var tempKeys = Object.keys(favoriteImages);
    for (var i=0; i<tempKeys.length; i++) {
        $("#pictures-area").append($("<div>").addClass("col col-md-1 col-lg-1 m-0 p-0"));
        // calling the makeImage function with the image objects we have stored in favoriteImages in order to make the image cards
        $("#pictures-area").append(makeImage(favoriteImages[tempKeys[i]]));
    }
    $("#movie-area").empty();
    displayBanner("favorites");
    // display the clear favorites button
    displayFavUtilityButton();
}

// creates the clear favorites button that will remove all the favorites the user has
function displayFavUtilityButton() {
    // clear the utility area for the incoming button
    $("#utility-area").empty();
    // make an empty button object
    var tempButton = $("<button>");
    // add the coloring and bootstrap class for the button
    tempButton.addClass("btn btn-warning col");
    // set the id so we can listen to this later
    tempButton.attr("id", "clearFav")
    tempButton.text("Clear Favorites");
    // add the button to the utility area, with flanking cols so its centered
    $("#utility-area").append($("<div>").addClass("col"));
    $("#utility-area").append(tempButton)
    $("#utility-area").append($("<div>").addClass("col"));
}

// display the movie poster to the movie-area
function displayMovie() {
    if (!homeMovie){
        $("#movie-area").empty();
        return;
    }

    $("#movie-area").empty();
    // make a new link as the wrapper around the movie poster
    var posterCard = $("<a>");
    // provide the link to the imdb page for the movie that opens in a seperate tab
    posterCard.attr("href", "https://www.imdb.com/title/" + homeMovie.imdbID);
    posterCard.attr("target", "_blank");
    posterCard.addClass("card movie-card col");
    // making the movie poster that's going to be the content of the link
    var poster = $("<img>");
    poster.addClass("card-img movie-poster");
    poster.attr("src", homeMovie.Poster);
    posterCard.append(poster);
    var posterInfo = $("<div>");
    // This is the card overlay that has the title, year released and the plot of the movie
    posterInfo.addClass("card-img-overlay text-center text-light p1 movie-info");
    posterInfo.append($("<h6>").text(homeMovie.Title).addClass("card-title"))
    posterInfo.append($("<p>").text(homeMovie.Released).addClass("card-text"))
    posterInfo.append($("<p>").text(homeMovie.Plot).addClass("card-text"))
    posterCard.append(posterInfo)
    // adding the poster and the info to the movie area
    var posterRow = $("<div>");
    posterRow.addClass("row mt-1 p-2");
    posterRow.append($("<div>").addClass("col-1"));
    posterRow.append(posterCard);
    posterRow.append($("<div>").addClass("col-1"));

    var blurbRow = $("<h4>");
    blurbRow.addClass("row mt-3 text-center pr-4 pl-4 movie-blurb");
    blurbRow.text("Other users that searched for " + currentTag + " liked this movie!");
    $("#movie-area").append(blurbRow)
    $("#movie-area").append(posterRow)
}

// if the user clicks the more images button, will find 12 new images to display and put them on the top of the pictures area
$(document).on("click", "#moreBtn", function(event) {
    // set the query url for our ajax call, increment the number of images we want
    moreImagesCount += numImages;
    // we will be getting the total number of images we want from the giphy api
    var userQuery = "https://api.giphy.com/v1/gifs/search?api_key="+giphyApiKey+"&q="+currentTag+"&limit="+moreImagesCount;
    // sending the request to the Giphy api
    
    $.ajax({
        url: userQuery,
        method: "GET"
    }).then(function(response) {
        // clear the homePictures array that we're storing all the pictures we're going to display on
        // and then put all the images from our reponse into that array
        homePictures = [];
        while(response.data.length >0){
            homePictures.push(response.data.pop());
        }
        // show the pictures area using our new images array
        
        displayHome();
    })
})

// clears all the stored favorites from the user on click
$(document).on("click", "#clearFav", function(event) {
    favoriteImages = {};
    // remove the copy stored in the local storage also
    localStorage.removeItem("fav");
    displayFavorites();
})

// handles moving to the home tab
$(document).on("click", ".navHome", function(event) {
    // change the active tab
    $(".navHome").addClass("active");
    $(".navFav").removeClass("active");
    // display all the pictures we stored from the home screen
    displayButtons();
    displayHome()
});

// handles moving to the favorites tab
$(document).on("click", ".navFav", function(event) {
    // change the active tab
    $(".navFav").addClass("active");
    $(".navHome").removeClass("active");
    // display the images that have been favorited so far
    displayButtons();
    displayFavorites();
});

// handles the user adding an image to favorites
    // its a toggle effect where if the image was already in favorites we remove it
$(document).on("click", ".favBtn", function(event) {
    // create a temporary pointer to the image object we have stored in the button element
    var ImageObj = $(this).data("favObject");
    // check if the image was already favorited
    if (favoriteImages[ImageObj.id]){
        // if the image was already favorited, we delete it from the favorite storage object
        delete favoriteImages[ImageObj.id]
        // change the favorite button state to reflect the new status
        $(this).attr("src", "assets/images/notFav.png");
    } else {
        // if the image wasn't already favorited, we add it to the favorite storage object
        favoriteImages[ImageObj.id] = ImageObj;
        // change the favorite button state to reflect the new status
        $(this).attr("src", "assets/images/yesFav.png");
    }
    // stores the user's current favorites to the local storage after converting the json object into a string
    localStorage.setItem("fav", JSON.stringify(favoriteImages));
});

// makes it so the user can press enter instead of having to click the submit button to add their input to the buttons library
$("#user-input").keydown(function (event){
    // 13 is the value assigned to the enter key
    if (event.which === 13){
        // clicks the #add-button element
        $("#add-button").click();
    }
});

// add the category we input when we click the add button
$(document).on("click", "#add-button", function(event) {
    event.preventDefault();
    // grab the input from the input area
    var newQuery = $("#user-input").val().trim();
    // clear the input area
    $("#user-input").val("");
    // if the user typed something
    if (newQuery != "") {
        // add the new search item to the button library
        tagLibrary.push(newQuery);
    }
    // displays all the buttons, the one we just added will be in the front
    displayButtons();

  });

// get the images we want with an ajax call to the giphy API when we click the category button
$(document).on("click", ".search-tag", function(event){
    // set the active nav tab to home
    $(".navHome").addClass("active");
    $(".navFav").removeClass("active");
    $("#movie-area").empty();
    // display the more images button below the add category input area
    // this is so we effectively move to the images tab if the user was in favorites
    displayHomeUtilityButton();
    currentTag = $(this).data("name")
    // set the query url for our ajax call, grab the default 12 results
    var userQuery = "https://api.giphy.com/v1/gifs/search?api_key="+giphyApiKey+"&q="+currentTag+"&limit="+numImages;
    $.ajax({
        url: userQuery,
        method: "GET"
    }).then(function(response) {
        
        // clear the pictures-area image storage array
        homePictures = [];
        // move the image objects from the api response to the storage array,
        // stored in reverse order so the later pictures are first
        while(response.data.length >0){
            homePictures.push(response.data.pop());
        }
        // display the images we received
        displayHome();
    })
    var movieParams = $.param({
            apikey : movieKey,
            s : currentTag,
    });
    var movieQuery = "https://www.omdbapi.com/?" + movieParams
    $.ajax({
        url: movieQuery,
        method: "GET"
        }).then(function(response){
            var movArr = response.Search;
            var curMovie = response.Search[Math.floor(Math.random() * (response.Search.length))];  
            movieParams = $.param({
            apikey : movieKey,
            i : curMovie.imdbID,
            plot : "short"});
            if (curMovie.Poster !== "N/A"){
                $.ajax({
                    url: "https://www.omdbapi.com/?" + movieParams,
                    method: "GET"
                }).then(function(response){
                    // store the movie poster to be displayed
                    homeMovie = response;
                    displayMovie();
                })
            } else {
                $("#movie-area").empty();
            }
    });
})

// animate the gif if the user clicks anywhere within the card wrapping it (includes the image overlay)
$(document).on("click", ".imgCard", function(event){
    // will not trigger the pause/play effect on the gif if the user clicks on the favorite button
    if ($(event.target).is(".favBtn") || $(event.target).is(".downBtn")) {
        return;
    }
    // find the image element stored within the card
    image = $(".imgCard-img", this);
    // check if the image is already animated
    var state = image.data("animated");
    // if the image wasn't already animated, we "unpause" the gif
    if (!state){
        // set the image url to be the animated image
        image.attr("src", image.data("animated-url"));
        // change the image state
        image.data("animated", true);
        // make the iamge and the wrapper card rectangular while playing
        image.attr("style", "border-radius: 10px");
        $(this).attr("style", "border-radius: 10px");
        $(this).addClass("imgCard-play");
        
    // if the image was already animated, we "pause" the gif
    } else if (state) {
        // set the image url to be the still image
        image.attr("src", image.data("still-url"));
        // change the image state
        image.data("animated", false);
        // make the image and the wrapper card circular
        image.attr("style", "border-radius: 100%");
        $(this).attr("style", "border-radius: 100%");
        $(this).removeClass("imgCard-play")
    }
})

$(document).ready(function() {
    // grab the user's stored favorites from the local storage
        // parse the stored stringified json back into an object
    favoriteImages = JSON.parse(localStorage.getItem("fav"));
    // if the user doesn't have favorites stored, instantiate favorite images as an empty object
    if (!favoriteImages) {
        favoriteImages = {};
    }
    displayHome();
    displayButtons();
});