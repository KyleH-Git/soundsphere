//grab create new playlist button
const newPlaylistEl = $('#new-list-btn');
//grab current playlist display div
const currentPlaylistEl = ('#current-list');
//grab currently saved playlist div
const savedPlaylistEl = ('#saved-list');
//grab playlist content display div
const contentPlaylistEl = ('#content-list');

//get playlists from storage function, called on page load
function getSavedPlaylist(){
    //  get string from local storage, turn it into an array
    const storedPlaylist = JSON.parse(localStorage.getItem('playlists'));
    
    //if array has something in it, return it, otherwise return an empty array
    if(storedPlaylist !== null){
        return storedPlaylist;
    }else{
        const emptyPlaylist = [];
        return emptyPlaylist;
    }
}

function savePlaylist(playlist){
    localStorage.setItem('playlists', JSON.stringify(playlist));
}

function selectPlaylist(){
    currentPlaylistEl.on('click', '.playlist-card', function(event){
        contentPlaylistEl = $(this.listDisplay);
    });
}

//create playlist function, called on create button click - modal for name + genre selection, saves current date created
//  get user inputs from modal store them in the playlist obj
//  add empty array of song objects to the playlist
//  song objects have artist name, album name, track name
function createPlaylist(){
    const playlist = {
        name: modalnameinput,
        genre: modaldropdowninput,
        created: dayjs('M-D-YYYY'), 
        songs: []
    };

    //get currently saved playlists from storage
    const currentPlaylists = getSavedPlaylist();
    currentPlaylists.push(playlist);
}

//display playlist function
//  on page load read any stored playlists and display them in the saved playlist div
//  playlist div has title, genre, date created, and delete button displayed
function displayPlaylist(){
    const playlists = getSavedPlaylist();
    playlists.forEach((list, i) => {
        const listDisplay = $('<div>');
        listDisplay.attr('class', 'playlist-card');
        const listName = $('<h3>');
        listName.text(list.name);
        const listGenre = $('<h4>');
        listGenre.text(list.genre);
        const listDate = $('<p>');
        listDate.text(list.created);
        const deleteBtn = $('<button>')
        deleteBtn.text("Delete");
        deleteBtn.attr('data-playlist-id', i);
        deleteBtn.text("Delete");
        deleteBtn.on('click', deletePlaylist);

        listDisplay.append(listName, listGenre, listDate, deleteBtn);
        savedPlaylistEl.append(listDisplay);
    });
}

//delete playlist function
function deletePlaylist(){
    const playlistID = $(this).attr('data-playlist-id');
    const playlists = getSavedPlaylist();

    playlists.forEach((list, i)=> {
        if(i === playlistID){
            playlists.splice(i, 1);
        }
    });

    savePlaylist(playlists);
    displayPlaylist();
}

//display playlist content function - when a playlist is clicked, all current song objects in playlist are displayed
function displaySong(playlist){ 
    playlist.songs.forEach(song => {
        const songCard = $('<div>');
        songCard.attr('class', 'card');

        const title = $('<h3>');
        title.text(song.title);
        const artist = $('<p>');
        artist.text(song.artist);
        const album = $('<p>');
        album.text(song.album);
        const deleteBtn = $('<button>');
        deleteBtn.text("Delete");
        deleteBtn.on('click', deleteSong);
        songCard.append(title, artist, album, deleteBtn);
        contentPlaylistEl.append(songCard);
    });
}

//get any stored songs from local storage
function getSongs(){
    const savedSongs = JSON.parse(localStorage.getItem('songs'));
        return savedSongs;   
}

//display songs from local storage
function displaySongs(){
    const songList = getSongs();

    //if there are songs, loop through the array and find album name from stored title + artist
    if(songList !== null){
        songList.forEach(song => {
           
            const userSearch = song.title + " " + song.artist;
            let url = `https://genius-song-lyrics1.p.rapidapi.com/search/?q=${userSearch}&per_page=10&page=1`;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': 'bdaf43f0c1mshb586ac38305d76bp1edea3jsnb94c9478d441',
                    'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
                }
            }
                fetch(url, options).then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            const id = data.hits[0].result.id;
                            url = `https://genius-song-lyrics1.p.rapidapi.com/song/details/?id=${id}&text_format=plain`;
                            
                        fetch(url, options).then(function (response) {
                            if (response.ok) {
                                response.json().then(function (data) {
                                    song.album = data.song.album.name;
                                    const songDisplayEl = $('#song-name');
                                    const songCard = $('<div>');
                                    songCard.attr('class', 'card');

                                    const songTitle = $('<p>');
                                    songTitle.text(song.title);
                                    
                                    const songArtist = $('<p>');
                                    songArtist.text(song.artist);

                                    const songAlbum = $('<p>');
                                    songAlbum.text(song.album);
                                 
                                    const addSong = $('<button>');
                                    addSong.text('Add Song');
                                    addSong.on('click', function (){
                                        if(currentPlaylistEl !== null){
                                            currentPlaylistEl.push(song);
                                        }
                                    });
                                    songCard.append(songTitle, songArtist, songAlbum, addSong);
                                    songDisplayEl.append(songCard);
                                });
                            }
                        });
                    });
                }
            });
            
            
            //create song html elements to be displayed in the song div and add them.
            
        });     
        console.log(songList);
        localStorage.setItem('songs', JSON.stringify(songList));
    }
}

//add song function
function addSong(){

}

//delete song function
function deleteSong(){

}

//on page load, if songs have been selected from the main page display the songs from storage on the page
window.onload = displaySongs;


//event listener for create playlist button

//event listener for clicking on a saved playlist to display it as current playlist - attach to parent only activate if clicked 

//event listener for delete song from playlist - attach to parent only activate if clicked 

//event listener for delete playlist from saved lists - attach to parent only activate if clicked 

//event listener for lyrics button on current playlist songs - attach to parent only activate if clicked 
