document.addEventListener('DOMContentLoaded', function() {
    const viewButtons = document.querySelectorAll('.view-details');
    viewButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        const animalId = button.parentNode.id;
        loadAnimalDetails(animalId);
      });
    });
  });


  function loadAnimalDetails(animalId) {
    fetch(`http://localhost:3000/characters/${animalId}`)
      .then(function(response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(function(animal) {
        const animalDetails = document.getElementById('animal-details');

        // Retrieve the vote count from local storage
        let votes = localStorage.getItem(`votes_${animalId}`);

        // If vote count is not in local storage, use the initial value from the API response
        if (votes === null) {
          votes = animal.votes;
        }

        animalDetails.innerHTML = `
          <h3>${animal.name}</h3>
          <img src="${animal.image}" alt="${animal.name}">
          <p>Votes: <span id="votes-count">${votes}</span></p>
          <button onclick="voteForAnimal(${animal.id})">Vote</button>`;
      });
  }

  function voteForAnimal(animalId) {
    fetch(`http://localhost:3000/characters/${animalId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(function(animal) {
        const votesElement = document.querySelector('#votes-count');
        animal.votes++;

        // Update the vote count in local storage
        localStorage.setItem(`votes_${animalId}`, animal.votes);

        votesElement.textContent = `Votes: ${animal.votes}`;
        const voteButton = document.querySelector('#animal-details button');
        voteButton.click = animal.votes++;
        updateVotes(animalId, animal.votes);
      })
   
  }

  function updateVotes(animalId, votes) {
    fetch(`http://localhost:3000/characters/${animalId}/vote`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ votes: votes })
    })
      .then(function(response) {
        if (response.ok) {
          console.log('Votes updated successfully.');
        } else {
          throw new Error('Network response was not ok.');
        }
      })
  
  }

  function addAnimal(name, image) {
    const animalList = document.querySelector('.animal-list');
    const animalId = animalList.children.length + 1;
    const listItem = document.createElement('li');
    listItem.id = animalId;
    listItem.innerHTML = `${name} <button class="view-details">View Animal Details</button>`;
    animalList.appendChild(listItem);

    const viewButton = listItem.querySelector('.view-details');
    viewButton.addEventListener('click', function() {
      loadAnimalDetails(animalId);
    });

    const newAnimal = {
      id: animalId,
      name: name,
      image: image,
      votes: 0
    };
    saveAnimal(newAnimal);
  }
  
  const addAnimalForm = document.getElementById('add-animal-form');
      addAnimalForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const animalNameInput = document.getElementById('animal-name');
        const animalImageInput = document.getElementById('animal-image');
        const animalName = animalNameInput.value;
        const animalImage = animalImageInput.value;
        addAnimal(animalName, animalImage);
        animalNameInput.value = '';
        animalImageInput.value = '';
      });  
