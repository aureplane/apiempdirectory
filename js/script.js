let employees = [];
const urlAPI = 'https://randomuser.me/api/?results=12&nat=us&inc=name,picture,dob,location,phone,email&noinfo';
const container = document.querySelector('.wrap');
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');
let index = 0;
let search = document.getElementById('search');
const nextIcon = document.querySelector(".icon-next");
const returnIcon = document.querySelector(".icon-return");

// ======================================================= //
//    Get months and days formatted (with 2 digits)  //
// ======================================================= //

function getMonthFormatted(date) {
	let month = date.getMonth() + 1;
	return month < 10 ? '0' + month : month;
}

function getDayFormatted(date) {
	let day = date.getDate();
	return day < 10 ? '0' + day : day;
}


// ====================== //
//   Fetch data from API  //
// ====================== //

fetch(urlAPI)
    .then(response => response.json())
    .then( response => response.results)
    .then(displayEmployees)
    .catch(err => {
        container.innerHTML = '<h3>Something went wrong!</h3>';
        console.log(err);
      })


// ====================== //
//   Helper Functions  //
// ====================== //

function displayEmployees(employeeData) {
    employees = employeeData;

    let employeeHTML = '';

    employees.forEach((employee,index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let picture = employee.picture;

    employeeHTML += `
        <div class="person-card" data-index="${index}">
            <img class="avatar" src="${picture.large}" alt="${name.first} ${name.last}">
            <div class="person-text">
                <h2 class="profile-name">${name.first} ${name.last}</h2>
                <p class="email">${email}</p>
                <p class="city">${city}</p>
            </div>
        </div>
    `
    });

    container.innerHTML = employeeHTML;

}


function displayModal(index) {
    // use object destructuring make our template literal cleaner
    let { name, dob, phone, email, location: { city, street, state, postcode }, picture } = employees[index];
    let date = new Date(dob.date);
    let month = getMonthFormatted(date);
    let day = getDayFormatted(date);
    const modalHTML = `
        <div class=content-item-modal>
            <img class="avatar" src="${picture.large}" />
                <div class="person-text">
                    <h2 class="name">${name.first} ${name.last}</h2>
                    <p class="email">${email}</p>
                    <p class="address">${city}</p>
                    <hr />
                    <p>${phone}</p>
                    <p class="address">${street.name}, ${state}, ${postcode}</p>
                    <p>Birthday: ${month}/${day}/${date.getYear()}</p>
                </div>
        </div>
    `;
    overlay.classList.remove("hidden");
    modalContainer.innerHTML =modalHTML;
    return index;
}


// ====================== //
//   Display Modal        //
// ====================== //

container.addEventListener('click', (e) => {
    const card = e.target.closest(".person-card");
    index = parseInt(card.getAttribute('data-index'));

    displayModal(index);
    console.log(index);
});

// ====================== //
//   Close Modal          //
// ====================== //

modalClose.addEventListener('click', (e) => {
    overlay.classList.add("hidden");
})

// ================================= //
//  Navigate back and forth in modal  //
// ================================= //

function prev() {
    index -= 1;
    if (index<0) {
        index = employees.length - 1;
    }
    displayModal(index);
}

function next() {
    index += 1; 
    if (index > employees.length - 1) {
        index = 0;
    }
    displayModal(index);
}

nextIcon.addEventListener('click', next);
returnIcon.addEventListener('click', prev);


// ================================= //
// Search Function //
// ================================= //

search.addEventListener('keyup', () => { 
    let cards = document.getElementsByClassName("person-card");
    let names = document.querySelectorAll(".profile-name");
    const inputSearch = search.value.toLowerCase();

    for (let i=0; i<names.length; i++) {
        if (names[i].textContent.toLowerCase().indexOf(inputSearch) > -1) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
})

