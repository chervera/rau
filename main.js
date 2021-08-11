let iso;
const filters = {};
let activeNavigation = "home";

function slugify(text) {

    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}


function readTextFile(file, callback) {
    const rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function init() {
    initMenuButton();
    initMenuNavigation();
    readTextFile("projectes.json", function (text) {
        const data = JSON.parse(text);
        initData(data);
    });
}

function initMenuNavigation() {
    document.querySelectorAll(".navigation").forEach(element => {
        element.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector('body').classList.remove(`active-${activeNavigation}`);
            document.querySelector('body').classList.add(`active-${element.dataset.navigation}`);
            activeNavigation = element.dataset.navigation;
            iso.arrange({ filter: "*" });
            toggleMenu();
        });
    })
}

function initMenuButton() {
    const menuToggler = document.querySelector('#toggle-nav');
    menuToggler.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu();
    });
}

function toggleMenu() {
    const body = document.querySelector('body');
    body.classList.toggle('open');
}

function initData(data) {
    const templateArxiu = document.querySelector("#arxius .template");
    const templateArxiuContainer = document.querySelector("#arxius .template-container");
    const templateProjecte = document.querySelector("#projectes-list .template");
    const templateProjecteContainer = document.querySelector("#projectes-list.template-container");
    const elem = document.querySelector('.grid');

    data.forEach(element => {
        if (validateProjecte(element)) {
            displayArxiu(element, templateArxiu, templateArxiuContainer);
            displayProjecte(element, templateProjecte, templateProjecteContainer);
        }
    });

    createFilters();
    activateFilters();


    imagesLoaded(templateProjecteContainer, function () {
        iso = new Isotope(elem, {
            // options
            itemSelector: '.grid__item',
            layoutMode: 'masonry',
            percentPosition: true,
            gutter: 25
        });

    })


    templateArxiu.remove();
    templateProjecte.remove();
}

function validateProjecte(element) {
    let isValid = true;
    let errorMessage = "";
    if (!element.id) {
        errorMessage += "El id és obligatòri\n";
        isValid = false;
    }
    if (!element.nom) {
        errorMessage += "El nom és obligatòri\n";
        isValid = false;
    }
    if (!element.any) {
        errorMessage += "L'any és obligatòri\n";
        isValid = false;
    }
    if (!element.lloc) {
        errorMessage += "El lloc és obligatòri\n";
        isValid = false;
    }
    if (!Array.isArray(element.imatges)) {
        errorMessage += "Les imatges han de ser un llistat\n";
        isValid = false;
    } else {
        element.imatges.forEach(imatge => {
            if (!imatge.url || !imatge.alt) {
                errorMessage += "La imatge seguent es incorrecta\n";
                errorMessage += imatge;
                errorMessage += "\n";
                isValid = false;
            }
        });
    }

    if (!Array.isArray(element.filtres)) {
        errorMessage += "Les imatges han de ser un llistat\n";
        isValid = false;
    }

    if (!isValid) {
        console.error("Error en el projecte:", element);
        console.log(errorMessage);
    }
    return isValid;
}

function displayArxiu(element, template, templateContainer) {

    let arxiu = template.cloneNode();
    arxiu.classList.remove("template");
    arxiu.textContent = `${element.nom} - ${element.any} / ${element.lloc}`;
    templateContainer.appendChild(arxiu);
};

function displayProjecte(element, template, templateContainer) {
    //<img src="assets/projecte1/projecte-1.png" class="grid__image" alt="loading" />
    const projecte = template.cloneNode();
    const image = document.createElement("img");
    image.src = element.imatges[0].url;
    image.alt = element.imatges[0].alt;
    image.classList.add("grid__image");
    projecte.appendChild(image);
    element.filtres.forEach(classe => {
        projecte.classList.add(slugify(classe));
        filters[slugify(classe)] = classe;
    });
    projecte.addEventListener('click', showProjecte);
    templateContainer.appendChild(projecte);
}

function showProjecte(e) {
    e.preventDefault();
    console.log('showProjecte');
}
function createFilters() {

    const templateFilter = document.querySelector("#filters .template");
    const templateFilterContainer = document.querySelector("#filters.template-container");
    let filter;

    Object.entries(filters).forEach(element => {
        filter = templateFilter.cloneNode();
        filter.classList.remove("template");
        filter.setAttribute("data-filter", `.${element[0]}`);
        filter.textContent = element[1];
        templateFilterContainer.appendChild(filter);
    });


    const todoFilter = templateFilter.cloneNode();
    todoFilter.textContent = "Tots";
    todoFilter.setAttribute("data-filter", "*");
    templateFilterContainer.appendChild(todoFilter);

    templateFilter.remove();
}

function activateFilters() {
    const filterButons = document.querySelectorAll('[data-filter]');
    filterButons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = button.dataset.filter;
            iso.arrange({ filter });
        })
    });
}


init();