document.addEventListener('DOMContentLoaded', () => {
    showDogsList();
  })
  let dogFilter = 0;
  
  
  function getDogs() {
    const url = "http://localhost:3000/pups";
      // Fetch for all dogs list.
      return fetch(url , {
                method: "GET"
            }) 
            .then(res => res.json())
  }
  
  function getDogById(id) {
    const url = `http://localhost:3000/pups/${id}`;
      // Fetch dog for id.
      return fetch(url , {
        method: "GET"
    }) 
    .then(res => res.json())
  }
  
  function updateGoodBadDog(id, newValue){
    const url = `http://localhost:3000/pups/${id}`;
    // Update dog by id
    return fetch(url , {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        isGoodDog: newValue
      })
    })
    .then(r => r.json())
  }
  

  
  function showDogsList() {
      getDogs().then(showDogs);
  }
  
  function showDogs(dogsArray, filter = false) {
    const dogBar = document.querySelector("#dog-bar");
    dogBar.innerHTML = "";
    if (filter) {
      dogsArray.filter(dog => dog.isGoodDog).forEach(createDogsBar)
    } else {
      dogsArray.forEach(createDogsBar);
    }
  }
  
  function createDogsBar(dogObj) {
    const dogBar = document.querySelector("#dog-bar"),
      dogSpan = document.createElement("span");
      dogSpan.innerText = dogObj.name;
      dogSpan.dataset.id = dogObj.id;
      dogSpan.addEventListener("click", dogSpanClic);
  
    dogBar.append(dogSpan)
    return dogBar;
  }
  
  function dogSpanClic(e) {
    getDogById(e.target.dataset.id).then(createDogsInfo);
  }
  
  function createDogsInfo(dogObj) {
    const dogInfo = document.querySelector("#dog-info");
    dogInfo.innerHTML = "";
    const dogImg = document.createElement("img");
    dogImg.src = dogObj.image;
  
    const dogTitle = document.createElement("h2");
    dogTitle.innerText = dogObj.name;
  
    const dogBttn = document.createElement("button");
    dogBttn.innerText = dogObj.isGoodDog ? "Good Dog!" : "Bad Dog!";
    dogBttn.dataset.id = dogObj.id;
    dogBttn.addEventListener("click", dogBttnClic);
  
    dogInfo.append(dogImg, dogTitle, dogBttn);
  }
  
  function dogBttnClic(e) {
    let newValue;
    if (e.target.innerText.includes("Good")){
      e.target.innerText = "Bad Dog";
      newValue = false;
    } else {
      e.target.innerText = "Good Dog";
      newValue = true
    }
    updateGoodBadDog(e.target.dataset.id, newValue).then(updateDogBar);
  }
  
  function updateDogBar(){
    const dogsBttn = document.querySelector("#good-dog-filter");
    if (dogsBttn.innerText.includes("OFF")){
      getDogs().then(dogArray => showDogs(dogArray));
    } else {
      getDogs().then(dogArray => showDogs(dogArray, true));
    }
  }
  
  const bttnFilterBar = document.getElementById("good-dog-filter");
  bttnFilterBar.addEventListener("click", (e) => {
    const dogInfo = document.querySelector("#dog-info");
    dogInfo.innerHTML = "";
    if (bttnFilterBar.innerText.includes("OFF")) {
      bttnFilterBar.innerText = "Filter good dogs: ON";
    } else {
      bttnFilterBar.innerText = "Filter good dogs: OFF";
    }
    updateDogBar()
  })