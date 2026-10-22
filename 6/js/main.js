const APP_ELEMENT_ID = "mainID";

function fetchStarData() {
  return fetch("js/stars.json").then(response => {
    if (!response.ok) {
      throw new Error(`Could not load star data (${response.status})`);
    }
    return response.json();
  });
}

/*Used an LLM to learn the general idea of these functions, as my layouts were consistently different page to page.
I learned to use i as a position so items marked "left" in my CSS 
would reside on the left side, meanwhile, all CSS styles labeled "right" stay on the right.*/
function renderStarLog(appElement, data) {
    document.title = "Dusty's Star Log";
    appElement.innerHTML = "<h1 style = \"color: white; text-align: center;\">CHOOSE FROM DUSTY'S STAR LOG</h1>" +
    data.categories.map((category, i) => {
        const left = i % 2 === 0;
        const img  = `<img src="${category.image}" alt="${category.alt}" class="${left ? "row-imgleft" : "row-imgright"}">`;
        const card = `
        <div class="${left ? "row-cardright" : "row-cardleft"}">
          <img src="${category.image}" alt="${category.alt}" class="mobile-img">
          <button type="button" class="link-decor-black" data-category="${category.id}">${category.title}</button>
          <p>${category.intro}</p>
          <p>Important things to note for the log entries:</p>
          <ul>${category.notes.map(n => `<li>${n}</li>`).join("")}</ul>
        </div>`;
      return `
        <div class="row">${left ? img + card : card + img}</div>
        <div class="${left ? "cred-leftRow" : "cred-rightRow"}">
          <p class="${left ? "leftCred" : "rightCred"}">IMAGE CREDIT: ${category.credit}</p>
        </div>`;
    }).join("");
}

/*Renders the first four choices after you select one of the main four categories. EX: Main Sequence Stars
to the four choices within the Main Sequence Star options.*/
function renderCategory(appElement, data, categoryId) {
  const category = data.categories.find(c => c.id === categoryId);
  appElement.innerHTML = `
    <h1 style="text-align:center;">${category.pageTitle}</h1>
    <div class="row1">
      ${category.stars.map(s => `<img src="${s.thumb}" alt="${s.thumbAlt}" class="row-img">`).join("")}
    </div>
    <div class="cred-row">
      ${category.stars.map(s => `<p class="leftCred" style="text-align:center;">${s.thumbCredit}</p>`).join("")}
    </div>
    <div class="row2">
      ${category.stars.map(s => `
        <div class="row-card">
          <img src="${s.thumb}" alt="${s.thumbAlt}" class="mobile-img">
          <p class="mobile-cred">${s.thumbCredit}</p>
          <button type="button" class="link-decor-black" data-category="${category.id}" data-star="${s.id}">${s.name}</button>
          <p style="text-align:center;">${s.summary}</p>
        </div>`).join("")}
      </div>
    ${buildBackButton("home")}`;
}

/*Function that allows the "go back" button to work as it uses the targetView to identify the page and display 
either "back to all star types" or "back to star choices". This is used in the function above and functions below.*/
function buildBackButton(targetView, categoryId = "") {
  const label = targetView === "home" ? "Back to all star types" : "Back to star choices";
  return `
    <button type="button" class="back-button" data-back-to="${targetView}" data-category="${categoryId}">
      <span aria-hidden="true">&larr;</span> ${label}
    </button>`;
}


/*Creates the row of images used in the four choices for stars. EX: After selecting Stellar Remnants, you're
taken to another page of four choices relating to stars in that category. Thie following two functions help 
build the layout for that specific page.*/
function buildImageRow(images){
    return images
        .map(image => `<img src="${image.src}" alt="${image.alt}" class="row-img">`)
        .join("");
}

function buildCreditRow(images) {
  return images
    .map(image => `<p class="leftCred" style="text-align:center;">${image.credit}</p>`)
    .join("");
}

/*This function renders the layout for the star page. EX: You chose Main Sequence Star, then Red Dwarf. This
is the layout for the page that display information about the Red Dwarf star. It works to identify the exact category 
and star id, allowing the necessary JSON information to fill their correct spots. Then it builds the layout 
utilizing previous functions.*/
function renderStar(appElement, data, categoryId, starId) {
  const category = data.categories.find(c => c.id === categoryId);
  const star = category.stars.find(s => s.id === starId);
  const [firstImage] = star.images;

  const cardImage = firstImage
    ? `<img src="${firstImage.src}" alt="${firstImage.alt}" class="mobile-img">
       <p class="mobile-cred">${firstImage.credit}</p>`
    : "";

  appElement.innerHTML = `
    <h1>${category.title}: ${star.name}</h1>
    <div class="main-card">
      ${cardImage}
      <h2 style="text-decoration:underline;">Dusty's Log Entry:</h2>
      <ul>${star.entry.map(e => `<li>${e.label}: ${e.value}</li>`).join("")}</ul>
      ${star.description.map(p => `<p>${p}</p>`).join("")}
    </div>
   <div class="row1">${buildImageRow(star.images)}</div>
    <div class="cred-row">${buildCreditRow(star.images)}</div>
    ${buildBackButton("category", category.id)}`;
}

/*Function that works with the actual back button, allowing the page's content to load the previous page.*/
function handleViewChange(event, appElement, data) {
  const backButton = event.target.closest("button[data-back-to]");
  if (backButton) {
    if (backButton.dataset.backTo === "home") {
      renderStarLog(appElement, data);
    } else {
      renderCategory(appElement, data, backButton.dataset.category);
    }
    return;
  }

  const button = event.target.closest("button[data-category]");
  if (!button) {
    return;
  }
  const { category, star } = button.dataset;
  if (star) {
    renderStar(appElement, data, category, star);
  } else {
    renderCategory(appElement, data, category);
  }
}

/*Render function for the function below.*/
function showMessage(appElement, message){
    appElement.textContent = message;
}


function initializeStarLog() {
  const appElement = document.getElementById(APP_ELEMENT_ID);
  showMessage(appElement, "Loading the star log...");
  fetchStarData()
    .then(data => {
      renderStarLog(appElement, data);
      appElement.addEventListener("click", event => handleViewChange(event, appElement, data));
    })
    .catch(() => {
      showMessage(appElement, "Sorry, the star log could not be loaded. Please try again later.");
    });
}

initializeStarLog();
