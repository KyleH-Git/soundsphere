
const searchButtonEl = $('#search-button');
const searchBarEl = $('#search-content');
const chartSubmitEl = $('#input-form');
const chartEl = $('#charts');
const displayEl = $('#display-number');
const songDisplayEl = $('#song-display');

function handleBBFetch(event){
    event.preventDefault();
    const userChart = chartEl.find(":selected").val();
    const displayNum = displayEl.find(":selected").val();
    songDisplayEl.empty();
    let url = `https://billboard-api5.p.rapidapi.com/api/charts/${userChart}`

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'bdaf43f0c1mshb586ac38305d76bp1edea3jsnb94c9478d441',
            'X-RapidAPI-Host': 'billboard-api5.p.rapidapi.com'
        }
    };

    fetch(url, options).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data.chart.entries[0].title);
                for(i=0; i < displayNum; i++){
                    const songCard = $('<div>');
                    songCard.attr('class', 'card');

                    const title = $('<h2 class="title">');
                    title.text('\"'+data.chart.entries[i].title +'\"');

                    const rank = $('<h2>');
                    rank.text("Current rank: " + data.chart.entries[i].rank);

                    const artist = $('<h3>');
                    artist.text("Artist: " + data.chart.entries[i].artist);

                    const peak = $('<p>');
                    peak.text("Peak position: " + data.chart.entries[i].position.peakPosition);

                    const weeksOn = $('<p>');
                    weeksOn.text("Weeks on chart: " + data.chart.entries[i].position.weeksOnChart);

                    const addSong = $('<button>');
                    addSong.text("Add song");

                    songCard.append(title, rank, artist, peak, weeksOn, addSong);
                    songDisplayEl.append(songCard);
                }
            });
        };
    });
}

function getSong(){
    const savedSongs = JSON.parse(localStorage.getItem('songs'));

    if(savedSongs !== null){
        return savedSongs;
    }else{
        const emptySongs = [];
        return emptySongs;
    }
}

function saveSong(songs){
    localStorage.setItem('songs', JSON.stringify(songs));
}

function addSong(event){
    const songs = getSong();
    song = {
        title: $(event.target).siblings().eq(0).text().replace(/\"/g, ''), 
        artist: $(event.target).siblings().eq(2).text().replace("Artist: ", ""),
        album: '',
    };

    songs.push(song);
    console.log(song.title);
    console.log(song.artist);
    saveSong(songs);
}


chartSubmitEl.on('submit', handleBBFetch);
songDisplayEl.on('click', 'button', addSong);

searchBarEl.on('change', function(){ 
    console.log("hello");
    const hasText = searchBarEl.val();
    console.log(hasText);
    if(hasText){
        searchBarEl.parent().attr('class', 'open-search search');
    }
    else{
        searchBarEl.parent().removeClass('open-search');
    }
});

