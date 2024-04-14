
const searchButtonEl = $('#search-button');
const searchBarEl = $('#search-content');
const chartSubmitEl = $('#input-form');
const chartEl = $('#charts');
const displayEl = $('#display-number');
const songDisplayEl = $('#song-display');

//creates query to billboard api, generates cards to fill songDisplayEl
function handleBBFetch(event){
    event.preventDefault();
    const userChart = chartEl.find(":selected").val();
    const displayNum = displayEl.find(":selected").val();
    songDisplayEl.empty();
    date = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
    console.log(date);
    let url = `https://billboard2.p.rapidapi.com/${userChart}?date=${date}`

    console.log(url);

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'bdaf43f0c1mshb586ac38305d76bp1edea3jsnb94c9478d441',
            'X-RapidAPI-Host': 'billboard2.p.rapidapi.com'
        }
    };

    fetch(url, options).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                for(i=0; i < displayNum; i++){
                    const songCard = $('<div>');
                    songCard.attr('class', 'card-obj');

                    if(userChart != "artist_100"){
                        const title = $('<h2 class="title">');
                        title.text('\"'+data[i].title +'\"');
                        title.toString().replace("&#039;", '\'');
                        songCard.append(title);
                    }
                    const rank = $('<h4>');
                    rank.text("Current rank: " + data[i].rank);

                    const artist = $('<h3>');
                    artist.text("Artist: " + data[i].artist);

                    const peak = $('<p>');
                    peak.text("Peak position: " + data[i].peak_position);

                    const weeksOn = $('<p>');
                    weeksOn.text("Weeks on chart: " + data[i].weeks_on_chart);

                    const addSong = $('<button>');
                    addSong.attr('class', 'card-btn');
                    addSong.text("Add song");

                    songCard.append(artist, rank, peak, weeksOn, addSong);
                    songDisplayEl.append(songCard);
                }
            });
        };
    });
}

//functions to get songs from local storage, save songs to local storage, and add songs to local storage
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
        artist: $(event.target).siblings().eq(1).text().replace("Artist: ", ""),
        album: '',
    };

    songs.push(song);
    saveSong(songs);
}


//event listeners for Billboard API form submit, add song to local storage button
chartSubmitEl.on('submit', handleBBFetch);
songDisplayEl.on('click', 'button', addSong);
