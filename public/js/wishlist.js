$(".wishlistBtn").on("click", addToWishlist);

async function addToWishlist(){

  //alert("logging in...");
  let gameId = $(this).attr("gameId");
	console.log(gameId)

  let url = "/addToWishlist";
  let response = await fetch(url,
  	{ method: 'post',
      body: JSON.stringify({"gameId": gameId}),
      headers: {
        "Content-Type": "application/json", "Accept": "application/json"
      }         
    });

}