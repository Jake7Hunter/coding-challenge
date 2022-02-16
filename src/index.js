// Variables
const jokeButton = document.getElementById(`jokeButton`);
const currentJoke = document.getElementById(`currentJoke`);
const form = document.getElementById(`form`)
const yourName = document.getElementById(`yourName`)
const yourJoke = document.getElementById(`yourJoke`)
const jokeEl = document.getElementById(`submittedJoke`)
const db = firebase.firestore()

// Joke Maker
jokeButton.addEventListener(`click`, function(){
    getNewJoke();
})

function getNewJoke(){
    fetch("https://geek-jokes.p.rapidapi.com/api?format=json", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "geek-jokes.p.rapidapi.com",
		"x-rapidapi-key": "b835837c2cmsh399aeb7d5ef62e2p100b8djsne36a83022141"
	}
}) 
    .then((response) => response.json())
    .then((obj) => {
        console.log(`obj`, obj);
        createNewJoke(obj);
    })
    .catch(err => {
        console.error(err);
    })
}

function createNewJoke(response){
    currentJoke.innerHTML = `<p>${response.joke}</p>`;
}

// Form
form.addEventListener(`submit`, function(event){
    event.preventDefault();

    if(yourName.value && yourJoke.value){
        addJoke(yourName.value, yourJoke.value)
    }

    function addJoke(Name, Joke){
        db.collection(`Jokes`)
        .add({
            your_name: Name,
            your_joke: Joke,
        })
        .then(function(docref){
            console.log(`document written with id:`, docref.id);
            getJokes();
            yourName.value = "";
            yourJoke.value = "";

        })
        .catch(function (err) {
            console.log(`error adding doc: `, err);
        })
    }

    function getJokes() {
        db.collection(`Jokes`)
        .get()
        .then((querySnapshot)=>{
            let output = "";

            querySnapshot.forEach((doc) => {
                console.log(doc.data());
                output += `<li>${doc.data().your_name}: ${doc.data().your_joke}</li>`; 
            });

            jokeEl.innerHTML = output;
        })
        .catch(function (err) {
            console.log(`error adding doc: `, err);
        })
    }

    getJokes();
});