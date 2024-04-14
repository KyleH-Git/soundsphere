//grab create new playlist button
const newPlaylistEl = $('#new-list-btn');
//grab current playlist display div
const currentListEl = $('.current-list');
let currentPlaylistEl = null;
//grab currently saved playlist div
const savedPlaylistEl = $('#playlist-display');
//grab playlist content display div
const contentPlaylistEl = $('#content-list');
const modalEl = $('#playlist-create');
const songDisplayEl = $('#song-name');
const songDivEl = $('.song-display');
const playlistEl = $('.playlist-search')

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
    savedPlaylistEl.on('click', '.card-obj', function(event){
        currentPlaylistEl = $(this).attr('data-playlist-id');
        const lists = getSavedPlaylist();
        currentListEl.empty();
        currentListEl.text("Current Playlist: " + lists[currentPlaylistEl].name);
        if(lists[currentPlaylistEl].songs.length > 0){
            songDivEl.removeClass('hidden');
            songDivEl.empty();
            playlistEl.css('margin', '15px 5% 100% 40%');
            songDivEl.css('margin', '15px 10% 100% 5%');
            const songContainerTitle = $('<h2>')
            songContainerTitle.attr('class', 'current-list');
            songContainerTitle.text("Songs in: " + lists[currentPlaylistEl].name);
            songDivEl.append(songContainerTitle);
            const savedSongs = lists[currentPlaylistEl].songs;
            savedSongs.forEach((song, i)=> {
                const songCard = $('<div>');
                songCard.attr('class', 'card-obj');
                const title = $('<h3>');
                title.text(song.title);
                const artist = $('<p>');
                artist.text(song.artist);
                const album = $('<p>');
                album.text(song.album);
                const deleteBtn = $('<button>')
                deleteBtn.text("Delete");
                deleteBtn.attr('data-song-id', i);
                deleteBtn.attr('class', 'card-btn');
                songCard.append(title, artist, album, deleteBtn);
                songDivEl.append(songCard);
            });
        }else{
            songDivEl.attr('class', 'song-display hidden');
            playlistEl.css('margin', '0 25%');
        }
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
    const savedListTitle = $('<h2>');
    savedListTitle.text("Saved Playlists");
    savedListTitle.attr('class', 'current-list');
    savedPlaylistEl.append(savedListTitle);
    playlists.forEach((list, i) => {
        const listDisplay = $('<div>');
        listDisplay.attr('class', 'card-obj');
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
        deleteBtn.attr('class', 'card-btn');
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
        songCard.attr('class', 'card-obj');
        const title = $('<h3>');
        title.text(song.title);
        const artist = $('<p>');
        artist.text(song.artist);
        const album = $('<p>');
        album.text(song.album);
        songCard.append(title, artist, album);
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
        const savedSongsTitle = $('<h2>');
        savedSongsTitle.text("Unassigned Songs");
        savedSongsTitle.attr('class', 'current-list');
        songDisplayEl.append(savedSongsTitle);
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
                                    songCard.attr('class', 'card-obj');

                                    const songTitle = $('<h3>');
                                    songTitle.text(song.title);
                                    
                                    const songArtist = $('<p>');
                                    songArtist.text(song.artist);

                                    const songAlbum = $('<p>');
                                    songAlbum.text(song.album);
                                 
                                    const addSong = $('<button>');
                                    addSong.text('Add Song');
                                    addSong.attr('class', 'card-btn');
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
    if(currentPlaylistEl !== null){
        //add the clicked song to the song element of that playlist
        const savedSongs = getSavedSongs();
        const songIndex = $(this).attr('data-song-id');
        newSong = {
            title: savedSongs[songIndex].title,
            artist: savedSongs[songIndex].artist,
            album: savedSongs[songIndex].album,
        }
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
// songDivEl.on('click', 'button', function(){
//     const lists = getSavedPlaylist();
//     const songID = $(this).attr('data-song-id');
//     const savedSongs = lists[currentPlaylistEl].songs;
//     savedSongs.splice(songID, 1);
//     savePlaylist(lists);
    //display songs from list back into song-display
    //should break out display loop from selectPlaylist into it's own function to call here
//});

//event listener for lyrics button on current playlist songs - attach to parent only activate if clicked 
