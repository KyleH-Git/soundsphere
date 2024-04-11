//grab artist, title, and lyric elements from lyrics.html
const searchResultEl = $('.song-name');
const searchButtonEl = $('#search-button');
const searchBarEl = $('#search-content');
const displayEl = $('.lyrics');


function handleLyricFetch(){
    //construct url for search based on user input + clear search bar
    const userSearch = searchBarEl.val().trim();
    let url = `https://genius-song-lyrics1.p.rapidapi.com/search/?q=${userSearch}&per_page=10&page=1`;
    searchBarEl.val('');
    const hasText = searchBarEl.val();
    console.log(hasText);
    if(hasText){
        searchBarEl.parent().attr('class', 'open-search-bar search-bar');
    }
    else{
        searchBarEl.parent().removeClass('open-search-bar');
    }
    
    //create options obj with personal key to pass to fetch
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'bdaf43f0c1mshb586ac38305d76bp1edea3jsnb94c9478d441',
            'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
        }
    };

    //fetch request to genius api to search user inputted song to find genius song id
    fetch(url, options).then(function (response) {
        if (response.ok) {
        response.json().then(function (data) {
            const id = data.hits[0].result.id;

            //reassign url for lyric search with genius song id 
            url = `https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=${id}&text_format=plain`;

            //fetch request to genius api to search lyrics for song based on id
            fetch(url, options).then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        //clear displayEl and searchResultEl so that new lyrics can be added
                        searchResultEl.empty();
                        displayEl.empty();

                        //construct html elements to be put into display element and append them
                        const songCard = $('<div>');
                        songCard.attr('class', 'card');
                        
                        const title = $('<h3>');
                        title.text(data.lyrics.tracking_data.title)

                        const artist = $('<p>');
                        artist.text(data.lyrics.tracking_data.primary_artist);

                        const lyrics = $('<div>');
                        lyrics.text(data.lyrics.lyrics.body.plain);

                        searchResultEl.append(title, artist);
                        displayEl.append(lyrics);
                    
                    });
                }
            });
        });
        } 
    });
}

//eventlistener for search bar button click
searchButtonEl.on('click', handleLyricFetch);

searchBarEl.on('change', function(){   
    const hasText = searchBarEl.val();
    console.log(hasText);
    if(hasText){
        searchBarEl.parent().attr('class', 'open-search-bar search-bar');
    }
    else{
        searchBarEl.parent().removeClass('open-search-bar');
    }
});
 