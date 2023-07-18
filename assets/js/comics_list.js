
const searchResults = document.getElementById('search-results');
const directions = document.getElementById('directions');
const searchName = document.getElementById('search-name');

var startUrl = localStorage.getItem('tempUrl');

var url = "https://floating-headland-95050.herokuapp.com/" + startUrl + "?api_key=871377ac063cfca6e414991a01d6b3fdfce67591&format=json";

searchResults.textContent = "Results may take a few seconds to load...";

// test
console.log(url);

// call api for selected movie/show
fetch(url).then(function (response) {
    if(response.ok) {
        response.json().then(function (movieResults) {
            searchName.textContent = "Showing issues for: " + movieResults.results.name;

            // Clear results
            searchResults.innerHTML = '';

            // limit number of buttons to at most 10
            var tempLength = 10;

            // if there are less than 10 results, save how many
            if (movieResults.results.characters.length < 10){
                tempLength = movieResults.results.characters.length;
            }

            // loop for grabbing characters (max = 10)
            for(let i = 0; i < tempLength; i++) {
                var charUrl = "https://floating-headland-95050.herokuapp.com/" + movieResults.results.characters[i].api_detail_url + "?api_key=871377ac063cfca6e414991a01d6b3fdfce67591&format=json&field_list=first_appeared_in_issue,name";

                // test
                console.log(charUrl);

                // call api for character
                fetch(charUrl).then(function (response) {
                    if(response.ok) {
                    response.json().then(function (charResults) {
                        // grab id number from url in api results for first issue
                        var issueId = charResults.results.first_appeared_in_issue.api_detail_url.split('issue')[1];
                        var issueUrl = "https://floating-headland-95050.herokuapp.com/https://comicvine.gamespot.com/api/issue" + issueId + "?api_key=871377ac063cfca6e414991a01d6b3fdfce67591&format=json"

                        // test
                        console.log(issueUrl);

                        // create button for each issue listing the character that the issue is tied to
                        var issueItem = document.createElement('button');
                        issueItem.textContent = "First appearance of " + charResults.results.name;

                        // call api for character's first issue
                        fetch(issueUrl).then(function (response) {
                            if(response.ok) {
                                response.json().then(function (issueResults) {
                                    var favorite = document.createElement('input');
                                    favorite.setAttribute('type', 'checkbox');
                                    favorite.setAttribute('class', 'favorite');
                                    favorite.setAttribute('data-img-url', issueResults.results.image.original_url)
                                    favorite.setAttribute('onclick', 'saveFav()');
                                    issueItem.appendChild(favorite);

                                    var issueImage = document.createElement('img');
                                    issueImage.setAttribute('src', issueResults.results.image.original_url);
                                    issueItem.appendChild(issueImage);
                                    searchResults.appendChild(issueItem);
})}})})}})}})}})

function saveFav() {

    // test
    console.log("checked!");

    var checkboxes = document.getElementsByClassName('favorite');

    for(let i = 0; i < checkboxes.length; i++) {
        var favComic = [checkboxes[i].getAttribute('data-img-url')];
        var favoritesList = JSON.parse(localStorage.getItem('favorites'));

        // test
        console.log(favComic);

        if(checkboxes[i].checked) {
            // check if local storage is not empty
            if(favoritesList !== null) {
                // check if issue is not already in favs
                if(!(favoritesList.includes(checkboxes[i].getAttribute('data-img-url')))) {
                    // add to local storage
                    favoritesList = favoritesList.concat(favComic);
                    
                    // test
                    console.log(favoritesList);
                    localStorage.setItem('favorites', JSON.stringify(favoritesList));
                }
            }
            //  if local storage is empty
            else {
                // create item in local storage to store favs
                localStorage.setItem('favorites', JSON.stringify(favComic));
            }
        }
        else {
            
        }        
    }

    

    

    // if(JSON.parse(localStorage.getItem("cities")) !== null){
    //     cities = cities.concat(pastCities);
    // }

    // // add on new city info
    // cities.push(saveCity);
    // localStorage.setItem("cities", JSON.stringify(cities));
}