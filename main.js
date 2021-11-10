let iso;
let flkty;
let data;

const filters = {};
const SECTION = {
    HOME: "home",
    PROJECTES: "projectes",
    PROJECTE_VIEWER: "projecte-viewer",
    RAU: "rau"
};

const ISOTOPE_OPTIONS = {
    // options
    masonry: {
        gutter: 25,
        fitWidth: true,
        stagger: 30
    }
};

let activeNavigation = SECTION.HOME;

function init() {
    initFirstSection();
    initMenuButton();
    initMenuNavigation();
    initActions();
    readTextFile("projectes.json", function (text) {
        data = JSON.parse(text);
        initData(data);
    });
}

function initActions() {
    const llegirMes = document.querySelector('#see-more-project');
    llegirMes.addEventListener('click', function (e) {
        e.preventDefault();
        showMoreInfo();
    });

    const tancarLlegitMes = document.querySelector('#close-see-more-project');
    tancarLlegitMes.addEventListener('click', function (e) {
        e.preventDefault();
        closeMoreInfo();
    });

    const tancarProjecteViewer = document.querySelector('#close-project-viewer');
    tancarProjecteViewer.addEventListener('click', function (e) {
        e.preventDefault();
        closeMoreInfo();
        closeProjecteContainer();
    });

    const goToProjects = function (e) {
        e.preventDefault();
        navigateTo(SECTION.PROJECTES);
    }

    const initNavigation = document.querySelector('#init-navigation');
    initNavigation.addEventListener('click', goToProjects);
    const scrollDownButton = document.querySelector('#link-down');
    scrollDownButton.addEventListener('click', goToProjects);

    const prevImage = document.querySelector('#previous-image');
    prevImage.addEventListener('click', function (e) {
        e.preventDefault();
        flkty.previous();
    });

    const nextImage = document.querySelector('#next-image');
    nextImage.addEventListener('click', function (e) {
        e.preventDefault();
        flkty.next();
    });

    const policyPrivacy = document.querySelector('#privacy-policy-shower');
    policyPrivacy.addEventListener('click', function (e) {
        e.preventDefault();
        showPolicyPrivacy();
    });

    const legalAdvise = document.querySelector('#legal-advise-shower');
    legalAdvise.addEventListener('click', function (e) {
        e.preventDefault();
        showLegalAdvise();
    });

    const closerPrivacyPolice = document.querySelector('#close-privacy-policy');
    closerPrivacyPolice.addEventListener('click', function (e) {
        e.preventDefault();
        closePrivacyPolice();
    });

    const closerLegalAdvise = document.querySelector('#close-legal-advise');
    closerLegalAdvise.addEventListener('click', function (e) {
        e.preventDefault();
        closeLegalAdvise();
    });



}

function showPolicyPrivacy() {
    const privacyPolicy = document.querySelector('#privacy-policy');
    privacyPolicy.classList.add('open');
}

function closePrivacyPolice() {
    const privacyPolicy = document.querySelector('#privacy-policy');
    privacyPolicy.classList.remove('open');
}

function showLegalAdvise() {
    const legalAdvise = document.querySelector('#legal-advise');
    legalAdvise.classList.add('open');
}

function closeLegalAdvise() {
    const legalAdvise = document.querySelector('#legal-advise');
    legalAdvise.classList.remove('open');
}

function showMoreInfo() {
    const moreInfoContainer = document.querySelector('#projecte-mas-info');
    moreInfoContainer.classList.add('open');
}

function closeMoreInfo() {
    const moreInfoContainer = document.querySelector('#projecte-mas-info');
    moreInfoContainer.classList.remove('open');
}

function initFirstSection() {
    document.querySelector('body').classList.add(`active-${activeNavigation}`);
}

function initMenuNavigation() {
    document.querySelectorAll(".navigation").forEach(element => {
        element.addEventListener('click', e => {
            e.preventDefault();
            navigateTo(element.dataset.navigation);
            toggleMenu();
        });
    })
}

function navigateTo(target) {
    closeMoreInfo();
    closeProjecteContainer();
    document.querySelector('body').classList.remove(`active-${activeNavigation}`);
    document.querySelector('body').classList.add(`active-${target}`);
    activeNavigation = target;

    setTimeout(function () {
        iso.arrange({ filter: "*" });
        document.getElementById('projectes-list').classList.remove('preloading');
    }, 750)

    scrollToInit();
}

function scrollToInit() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
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

function nl2br(str) {
    return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
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

function initData(data) {
    const templateArxiu = document.querySelector("#arxius .template");
    const templateArxiuContainer = document.querySelector("#arxius .template-container");
    const templateProjecte = document.querySelector("#projectes-list .template");
    const templateProjecteContainer = document.querySelector("#projectes-list.template-container");
    const elem = document.querySelector('.grid');

    data.forEach(element => {
        if (validateProjecte(element)) {
            displayArxiu(element, templateArxiu, templateArxiuContainer);
            displayProjecteThumb(element, templateProjecte, templateProjecteContainer);
        }
    });

    createFilters();
    activateFilters();


    imagesLoaded(templateProjecteContainer, function () {
        iso = new Isotope(elem, ISOTOPE_OPTIONS);
    });


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
    if (!element.descripcio) {
        errorMessage += "La descripció és obligatòria\n";
        isValid = false;
    }
    if (!element.mesinfo) {
        errorMessage += "El mesinfo és obligatòri\n";
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
    arxiu.textContent = `${element.nom} - ${element.lloc}, ${element.any}`;
    arxiu.addEventListener('click', e => displayProjecte(e, element.id));
    templateContainer.appendChild(arxiu);
};

function displayProjecteThumb(element, template, templateContainer) {
    //<img src="assets/projecte1/projecte-1.png" class="grid__image" alt="loading" />
    const projecte = template.cloneNode(true);
    const image = document.createElement("img");
    //clean template
    projecte.querySelector(".grit__item__loading").remove();
    //fill template
    image.src = element.imatges[0].url;
    image.alt = element.imatges[0].alt;
    image.classList.add("grid__image");
    projecte.appendChild(image);

    projecte.querySelector(".grid__item__title").innerHTML = element.nom;
    projecte.querySelector(".grid__item__moreinfo").innerHTML = `${element.lloc}, ${element.any}`;

    element.filtres.forEach(classe => {
        projecte.classList.add(slugify(classe));
        filters[slugify(classe)] = classe;
    });
    projecte.addEventListener('click', e => displayProjecte(e, element.id));
    templateContainer.appendChild(projecte);


}

function displayProjecte(e, id) {
    e.preventDefault();
    const project = findProjectById(id);

    initProjecteImages(project);

    let element;

    element = document.querySelector(".projecte-viewer__title");
    element.textContent = project.nom;

    element = document.querySelector(".projecte-viewer__subtitle");
    element.textContent = `${project.lloc} / ${project.any}`;

    element = document.querySelector("#projecte-nom");
    element.innerHTML = nl2br(project.nom);

    element = document.querySelector("#projecte-descripcio");
    element.innerHTML = nl2br(project.descripcio);

    element = document.querySelector("#projecte-mesinfo");
    element.innerHTML = generateMesInfo(project.mesinfo);

    showProjecteContainer();

}

function generateMesInfo(mesInfo) {
    if (typeof mesInfo === 'string') {
        return nl2br(mesInfo);
    } else {
        let moreInfo = '';
        for (var [key, value] of Object.entries(mesInfo)) {
            moreInfo += `<strong>${key}</strong>: ${value}<br/>`;
        }
        return moreInfo;
    }
}



function showProjecteContainer() {
    let container = document.querySelector('#projecte-viewer');
    container.classList.add('open');
    let bodyContainer = document.querySelector('body');
    bodyContainer.classList.add('open-project');
}

function closeProjecteContainer() {
    let container = document.querySelector('#projecte-viewer');
    container.classList.remove('open');
    let bodyContainer = document.querySelector('body');
    bodyContainer.classList.remove('open-project');
}

function initProjecteImages(project) {

    if (flkty) {
        flkty.destroy();
    }

    //<div class="carousel-cell">
    //<img src="assets/projecte1/projecte-1.png" />
    //</div>

    carouselContainer = document.querySelector('#projecte-carousel');
    carouselContainer.innerHTML = '';
    let cell, image;
    project.imatges.forEach(imatge => {
        image = document.createElement("img");
        image.setAttribute('data-flickity-lazyload', imatge.url);

        cell = document.createElement("div");
        cell.classList.add('carousel-cell');
        cell.appendChild(image);

        carouselContainer.appendChild(cell);
    });
    imagesLoaded(carouselContainer, function () {
        flkty = new Flickity('#projecte-carousel', {
            lazyLoad: 1,
            imagesLoaded: true,
            pageDots: true,
            fade: true,
            prevNextButtons: false,
        });


    });
}

function findProjectById(id) {
    return data.find((project) => project.id == id);
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
    todoFilter.textContent = "tots";
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

window.addEventListener('load', init);