
const searchButtonEl = $('#search-button');
const searchBarEl = $('#search-content');


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

