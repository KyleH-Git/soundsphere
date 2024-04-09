//fetch request the genius api


const url = 'https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=2396871&text_format=plain';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'bdaf43f0c1mshb586ac38305d76bp1edea3jsnb94c9478d441',
		'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
	}
};

fetch(url, options).then(function (response) {
    console.log("im here");
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
      });
    } 
  });

  console.log("after the fetch");

//console log the response object
