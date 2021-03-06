document.querySelector("#login").addEventListener("click", login);

async function login(){

  //alert("logging in...");
  let username = document.querySelector("#username").value;
  let pwd = document.querySelector("#password").value;

  let url = "/api/login";
  let response = await fetch(url,
  	{ method: 'post',
      body: JSON.stringify({"username": username, "password": pwd}),
      headers: {
        "Content-Type": "application/json", "Accept": "application/json"
      }         
    });

    let data = await response.json();
    console.log(data.authentication);

    if (data.authentication == "success") {
      window.location.href = "../";
    } else {
    document.querySelector("#errorMsg").innerHTML = "Wrong credentials";
    }
		
}