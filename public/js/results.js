document.getElementById("input").focus();

// lets you use "Enter" key and button to search
var input = document.getElementById("input");
input.addEventListener("keyup", function(event) {
  // Enter key is 13
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("searchBtn").click();
  }
});

// get info from API and display
async function findGame() {
  const gameName = $('#input').val();
	console.log(gameName);
  $('#holder').html('');
  const url = `/searchByTitle?title=${gameName}`;
  const data = await fetchData(url);

  for (let i=0; i<data.length; i++) {
    $('#holder').append(`<div class="card">
          <img src="${data[i].image}" class="card-img-top">
          <div class="card-body">
            <h6 class="card-title">${data[i].title}</h6>
						<div class="inner-card"><br>
            <p class="card-text"><b>Genre:</b> ${data[i].genre}</p>
						<p class="card-text"><b>Mode:</b> ${data[i].mode}</p>
						<p class="card-text"><b>Platform:</b> ${data[i].platform}</p>
						<p class="card-text"><b>Price:</b> ${data[i].price}</p>
						<p class="card-text"><b>Release Date:</b> ${data[i].releaseDate}</p>
						</div><hr>
						<button class="btn btn-outline-info"><a href="#" class="wishlistBtn" gameId="${data[i].gameId}">Add to Wishlist</a></button>
						<script src="/js/wishlist.js"></script>
          </div>
        </div>`);
  }
}

async function findGameByPrice() {
	let priceLength = $("input:checked").val();
	console.log(priceLength);
  $('#holder').html('');
  const url = `/searchByPrice?price=${priceLength}`;
  const data = await fetchData(url);

  for (let i=0; i<data.length; i++) {
    $('#holder').append(`<div class="card">
          <img src="${data[i].image}" class="card-img-top">
          <div class="card-body">
            <h5 class="card-title">${data[i].title}</h5>
            <p class="card-text">Genre: ${data[i].genre}</p>
						<p class="card-text">Mode: ${data[i].mode}</p>
						<p class="card-text">Platform: ${data[i].platform}</p>
						<p class="card-text">Price: ${data[i].price}</p>
						<p class="card-text">Release Date: ${data[i].releaseDate}</p>
            <a href="#" gameId="${data[i].gameId}" class="btn btn-outline-info">Add to Wishlist</a>
          </div>
        </div>`);
  }
}

async function findGameByPlatform() {
	let platform = $("option:selected").val();
	console.log(platform);
  $('#holder').html('');
  const url = `/searchByPlatform?platform=${platform}`;
  const data = await fetchData(url);

  for (let i=0; i<data.length; i++) {
    $('#holder').append(`<div class="card">
          <img src="${data[i].image}" class="card-img-top">
          <div class="card-body">
            <h5 class="card-title">${data[i].title}</h5>
            <p class="card-text">Genre: ${data[i].genre}</p>
						<p class="card-text">Mode: ${data[i].mode}</p>
						<p class="card-text">Platform: ${data[i].platform}</p>
						<p class="card-text">Price: ${data[i].price}</p>
						<p class="card-text">Release Date: ${data[i].releaseDate}</p>
            <a href="#" gameId="${data[i].gameId}" class="btn btn-outline-info">Add to Wishlist</a>
          </div>
        </div>`);
  }
}

async function findGameByGenre() {
	const genre = $("#genre_id option:selected").val();
	console.log(genre);
  $('#holder').html('');
  const url = `/searchByGenre?genre=${genre}`;
  const data = await fetchData(url);

  for (let i=0; i<data.length; i++) {
    $('#holder').append(`<div class="card">
          <img src="${data[i].image}" class="card-img-top">
          <div class="card-body">
            <h5 class="card-title">${data[i].title}</h5>
            <p class="card-text">Genre: ${data[i].genre}</p>
						<p class="card-text">Mode: ${data[i].mode}</p>
						<p class="card-text">Platform: ${data[i].platform}</p>
						<p class="card-text">Price: ${data[i].price}</p>
						<p class="card-text">Release Date: ${data[i].releaseDate}</p>
            <a href="#" gameId="${data[i].gameId}" class="btn btn-outline-info">Add to Wishlist</a>
          </div>
        </div>`);
  }
}

async function findGameByMode() {
	const mode = $("#mode_id option:selected").val();
	console.log(mode);
  $('#holder').html('');
  const url = `/searchByMode?mode=${mode}`;
  const data = await fetchData(url);

  for (let i=0; i<data.length; i++) {
    $('#holder').append(`<div class="card">
          <img src="${data[i].image}" class="card-img-top">
          <div class="card-body">
            <h5 class="card-title">${data[i].title}</h5>
            <p class="card-text">Genre: ${data[i].genre}</p>
						<p class="card-text">Mode: ${data[i].mode}</p>
						<p class="card-text">Platform: ${data[i].platform}</p>
						<p class="card-text">Price: ${data[i].price}</p>
						<p class="card-text">Release Date: ${data[i].releaseDate}</p>
            <a href="#" gameId="${data[i].gameId}" class="btn btn-outline-info">Add to Wishlist</a>
          </div>
        </div>`);
  }
}

// fetch data method
async function fetchData(url) {
  let response = await fetch(url)
  let data = await response.json()
  return data
}