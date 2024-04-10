//grab artist, title, and lyric elements from lyrics.html
searchResultEl = $('#searchresult');
searchButtonEl = $('#seachbutton ');



function handleLyricFetch(){
   
    const songInfo = {
        title: '',
        artist: '',
        lyrics: ''
    }    
    //construct url for search based on user input
    // const userSearch = $('#searchbar').val().trim();
    // ${userSearch}

    const url = `https://genius-song-lyrics1.p.rapidapi.com/search/?q=satisfaction&per_page=10&page=1`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'bdaf43f0c1mshb586ac38305d76bp1edea3jsnb94c9478d441',
            'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
        }
    };

    fetch(url, options).then(function (response) {
        if (response.ok) {
        response.json().then(function (data) {
            console.log(data);
            console.log(data.hits[0].result.id);

            const id = data.hits[0].result.id;
            const urlLyrics = `https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=${id}&text_format=plain`;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': 'bdaf43f0c1mshb586ac38305d76bp1edea3jsnb94c9478d441',
                    'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
                }
            };

            fetch(urlLyrics, options).then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        console.log(data);
                        songInfo.lyrics = data.lyrics.lyrics.body.plain;
                        songInfo.artist = data.lyrics.tracking_data.primary_artist;
                        songInfo.title = data.lyrics.tracking_data.title;
                        console.log(songTitle);
                        console.log(songArtist);
                        console.log(songLryics);
                    
                    });
                }
            });
        });
        } 
    });
}

searchButtonEl.addEventListener('click', handleLyricFetch);
 