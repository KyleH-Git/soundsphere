//grab create new playlist button
const newPlaylistEl = $('#new-list-btn');
//grab current playlist display div
let currentPlaylistEl = null;
//grab currently saved playlist div
const savedPlaylistEl = $('#playlist-display');
//grab playlist content display div
const contentPlaylistEl = $('#content-list');
const modalEl = $('#playlist-create');
const songDisplayEl = $('#song-name');

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
    savedPlaylistEl.on('click', '.playlist-card', function(event){
        currentPlaylistEl = $(this).attr('data-playlist-id');
        console.log(currentPlaylistEl);
    });
}

//create playlist function, called on create button click - modal for name + genre selection, saves current date created
//  get user inputs from modal store them in the playlist obj
//  add empty array of song objects to the playlist
//  song objects have artist name, album name, track name
function createPlaylist(){
    const playlist = {
        name: $('#playlist-name').val().trim(),
        genre: $('#form-select').val(),
        created: dayjs().format('M-D-YYYY'), 
        songs: []
    };

    //get currently saved playlists from storage
    const currentPlaylists = getSavedPlaylist();
    currentPlaylists.push(playlist);
    savePlaylist(currentPlaylists);
    displayPlaylist(currentPlaylists);
}

//display playlist function
//  on page load read any stored playlists and display them in the saved playlist div
//  playlist div has title, genre, date created, and delete button displayed
function displayPlaylist(){
    const playlists = getSavedPlaylist();
    savedPlaylistEl.empty();

    playlists.forEach((list, i) => {
        const listDisplay = $('<div>');
        listDisplay.attr('class', 'playlist-card');
        listDisplay.attr('data-playlist-id', i)
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
    playlists.splice(playlistID, 1);
    savePlaylist(playlists);
    displayPlaylist();
}

//display playlist content function - when a playlist is clicked, all current song objects in playlist are displayed
function displaySong(playlist){ 
    songDisplayEl.empty();
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
        songList.forEach((song, i)=> {
           
            const userSearch = song.title + " " + song.artist;
            let url = `https://genius-song-lyrics1.p.rapidapi.com/search/?q=${userSearch}&per_page=10&page=1`;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': 'bdaf43f0c1mshb586ac38305d76bp1edea3jsnb94c9478d441',
                    'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
                }
            } 
            setTimeout(() => {
                
        
                fetch(url, options).then(function (response) {
                    if (response.ok) {
                        response.json().then(async function (data) {
                            const id = data.hits[0].result.id;
                            url = `https://genius-song-lyrics1.p.rapidapi.com/song/details/?id=${id}&text_format=plain`;
                            
                         fetch(url, options).then(function (response) {
                            if (response.ok) {
                                response.json().then(function (data) {
                                    song.album = data.song.album.name;
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
                                    addSong.attr('data-song-id', i);
                                    songCard.append(songTitle, songArtist, songAlbum, addSong);
                                    songDisplayEl.append(songCard);
                                    localStorage.setItem('songs', JSON.stringify(songList));
                                });
                            }
                        });
                    });
                }
            });
        }, 50);           
        });     
        console.log(songList);
        
    }
}

function getSavedSongs(){
    const savedSongs = JSON.parse(localStorage.getItem('songs'));
    if(savedSongs !== null){
        return savedSongs;
    }
}

function saveSongs(songs){
    localStorage.setItem('songs', JSON.stringify(songs));
}

//add song function
function addSong(){
    //if there is a currently selected playlist
    console.log(currentPlaylistEl);
    if(currentPlaylistEl !== null){
        //add the clicked song to the song element of that playlist
        const savedSongs = getSavedSongs();
        const songIndex = $(this).attr('data-song-id');
        newSong = {
            title: savedSongs[songIndex].title,
            artist: savedSongs[songIndex].artist,
            album: savedSongs[songIndex].album,
        }
        console.log(newSong);
        const savedPlaylist = getSavedPlaylist();
        savedPlaylist[currentPlaylistEl].songs.push(newSong);
        savePlaylist(savedPlaylist);
        //remove the clicked song from the displayed songs
        deleteSong();
    }
}

//delete song function
function deleteSong(){
    const songID = $(this).attr('data-song-id');
    const songs = getSavedSongs();
    songs.splice(songID, 1);
    saveSongs(songs);
    songDisplayEl.empty();
    displaySongs();
}

function pageInit(){
    displaySongs();
    displayPlaylist();
}

//on page load, if songs have been selected from the main page display the songs from storage on the page
window.addEventListener("load", pageInit);

//event listener for create playlist button
modalEl.on('click', createPlaylist);

//event listener for clicking on a saved playlist to display it as current playlist - attach to parent only activate if clicked 
savedPlaylistEl.on('click', selectPlaylist);

//event listener for adding song to playlist
songDisplayEl.on('click', 'button', addSong);
    


//event listener for delete song from playlist - attach to parent only activate if clicked 

//event listener for lyrics button on current playlist songs - attach to parent only activate if clicked 
