import { getCaretPositionXY2, observeElement, textToHtmlParagraph } from './utils';

console.log("EXECUTANDO O CONTENT SCRIPT .TS")

type helpText = {
    id: number;
    shortcut: string;
    type_spanish: string
    type_english: string
}


let helpTexts: helpText[] = [];
let counterHelpText = 0;

let activeElement: HTMLElement | null = null;

function firstGetTexts() {

    //I will change this function to only execute if there is no texts already in cache. dont worry about it now!

    if (helpTexts.length === 0) {
        //sending message to background.ts to get all text Types
        chrome.runtime.sendMessage({ type: 'getHelpTexts' }, (response) => {
            if (response.error) {
                console.error('error to retrieve help texts. ', response.error);
            } else {
                helpTexts = response.helpTexts;
                console.log('HelpTexts:', helpTexts);
                renderHelpTexts();
            }
        });
    }
}

firstGetTexts();

//function to search on given elements
function handleOnSearch(element: HTMLInputElement | HTMLDivElement, helptexts: helpText[]): helpText[] {

    let searchText: string = '';

    // verifies if is an edditable div
    if (element instanceof HTMLDivElement && element.getAttribute('contenteditable') === 'true') {
        // getting divText
        searchText = element.innerText.toLowerCase();
        
        // removing first two digits `//`
        if (searchText.startsWith('//')) {
            searchText = searchText.slice(2);  // Atribuindo o valor de volta
        }
    }

    // verifies if it is input or textarea
    if (element instanceof HTMLInputElement) {
        
        searchText = element.value.toLowerCase();
        
        if (searchText.startsWith('//')) {
            searchText = searchText.slice(2);  // getting value after two first digits
        }
    }

    // Filtering  texts accordly to texts above.
    const filteredHelpTexts = helptexts.filter(helpText =>
        helpText.shortcut.toLowerCase().includes(searchText)
    );

    return filteredHelpTexts;
}

// update templates by search
function updateHelpTexts(filteredHelpTexts: helpText[]) {

    const templatesList = document.querySelector('.templates_list');

    if (!templatesList) return;

    templatesList.innerHTML = '';

    // Iterate in helpTexts
    filteredHelpTexts.forEach(text => {

        const li = document.createElement('li');
        li.classList.add('template_item');

        li.id = `${text.id}`;

        // Creating LI content
        li.innerHTML = `
            <div class="list-full-title">${text.shortcut}</div>
            <div class="list-subtitle">${text.type_spanish}</div>
        `;

        li.addEventListener('click', () => {
            console.log(`${li.id} sendo clicado`);
        });

        templatesList.appendChild(li);
    });
}


// render helpTexts dinamically
function renderHelpTexts() {

    const templatesList = document.querySelector('.templates_list');

    if (!templatesList) return; // assuring ul exists.
    templatesList.innerHTML = '';

    helpTexts.forEach(text => {

        const li = document.createElement('li');
        li.classList.add('template_item'); // adding class

        li.id = `${text.id}`;

        li.innerHTML = `
            <div class="list-full-title">${text.shortcut}</div>
            <div class="list-subtitle">${text.type_spanish}</div>
        `;

        //adding event click on each LI that will open a new window!
        li.addEventListener('click', () => {


            const bodyContainer = document.querySelector("#content-body-container")
            const bodyContainerTemplate = document.querySelector("#content-body-container-template")

            //toggling classes
            bodyContainer?.classList.add("closed")
            bodyContainerTemplate?.classList.remove("closed")

            const button1toparea = document.querySelector("#button1toparea");
            const backButton = document.createElement("button")
            const imageInButton = document.createElement("img") as HTMLImageElement;


            //adding image
            if (imageInButton) {
                imageInButton.src = chrome.runtime.getURL("images/left-arrow-key.png");
                backButton.appendChild(imageInButton)
            }

            // getting button from div
            const button = button1toparea?.querySelector('button');
            if (button) {
                button.remove();
            }
            button1toparea?.appendChild(backButton)
            backButton.classList.add("button-header-container");


            //adding helpText to Text Template Area when clicked
            let triggerInput = document.querySelector(".trigger-input input") as HTMLInputElement;
            let bigTextInputTemplateTrigger = document.querySelector(".full-text-trigger");
            let textToPopulateInTemplateTrigger = helpTexts.find((item) => item.id.toString() === li.id.toString());
            if (textToPopulateInTemplateTrigger) {
                if (triggerInput) {
                    triggerInput.value = textToPopulateInTemplateTrigger.shortcut
                }
                if (bigTextInputTemplateTrigger) {
                    bigTextInputTemplateTrigger.append(textToHtmlParagraph(textToPopulateInTemplateTrigger.type_spanish) as HTMLInputElement);
                }
            }

            //click event to go back
            backButton.addEventListener('click', () => {

                bodyContainer?.classList.remove("closed")
                bodyContainerTemplate?.classList.add("closed")
                imageInButton.src = chrome.runtime.getURL("images/home.png");

                if (triggerInput) {
                    triggerInput.value = ""
                }
                if (bigTextInputTemplateTrigger) {
                    bigTextInputTemplateTrigger.innerHTML = "";
                }

            })


            console.log(`${li.id} sendo clicado`);
        });

        templatesList.appendChild(li);
    });

    // updating counter
    counterHelpText = helpTexts.length;
    // updating DOM
    updateTemplateCounter();

}

function updateTemplateCounter() {
    const templateCounter = document.querySelector(".templateCounter");
    if (templateCounter) {
        templateCounter.innerHTML = `Templates (${counterHelpText})`;
    }
}


function toggleExtension() {

    const existing_desk_container = document.querySelector("#desk-container");


    fetch(chrome.runtime.getURL("shortcutComponent.html"))
        .then(response => {
            return response.text()
        })
        .then(html => {
            const existing_shortcut_window = document.querySelector(".shortcut-box");
            if (existing_shortcut_window) {
                existing_shortcut_window.remove()
            } else {
                const shortcutBoxHtml = document.createElement("div");
                shortcutBoxHtml.innerHTML = html
                const shortcutBox = shortcutBoxHtml.querySelector(".shortcut-box")
                if (shortcutBox) {
                    document.body.append(shortcutBox)

                    // calling observeElement only after .shortcut-box class being add in DOM
                    observeElement('.shortcut-box', (element) => {
                        renderHelpTextsShortcutWindow();
                    });
                }
            }

        })
        .catch(error => console.log(error))



    if (existing_desk_container) {
        existing_desk_container.remove();

    } else {
        fetch(chrome.runtime.getURL("side_extension.html"))
            .then(response => {
                return response.text()
            })
            .then(html => {

                const container = document.createElement("div");
                container.innerHTML = html;
                document.body.appendChild(container);

                //adding css to the file
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = chrome.runtime.getURL('styles.css')
                document.head.appendChild(link);

                //getting main container
                const desk_container = document.querySelector("#desk-container");
                if (desk_container) {
                    desk_container.id = "desk-container";



                    //Adding button to expand extension
                    const toggleButton = document.getElementById("desk-container-toggle-button");
                    toggleButton?.addEventListener("click", () => {
                        desk_container.classList.toggle("open"); // Alterna a classe 'open'
                    });

                    const closeButton = document.getElementById("closeButton");
                    closeButton?.addEventListener("click", () => {
                        desk_container.remove();
                    });

                    // Change the search function to fire with the 'input' event
                    const searchbox = desk_container.querySelector(".searchbox-body-container-text") as HTMLInputElement;
                    if (searchbox) {
                        searchbox.addEventListener("input", (event) => {
                            const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
                            const filteredHelpTexts = handleOnSearch(searchbox, helpTexts);
                            updateHelpTexts(filteredHelpTexts);
                        });
                    }

                    //Button to toggle Templates
                    const arrowKeyTemplateButton = desk_container.querySelector(".arrowKeyTemplate");
                    if (arrowKeyTemplateButton) {

                        const templates_expanded = document.querySelector("#templatesDiv") as HTMLElement;
                        arrowKeyTemplateButton.addEventListener("click", () => {
                            if (templates_expanded) {

                                templates_expanded.classList.toggle("templates_closed"); // toggle classes 'templates_closed' and "templates_expanded"



                                const iconToggler = document.querySelector(".templates_closed")
                                if (iconToggler) {
                                    imageElementArrowKey.src = chrome.runtime.getURL("images/right-arrow-key.png");
                                    templates_expanded.style.right = "-900px";  // change styles inline
                                } else {
                                    imageElementArrowKey.src = chrome.runtime.getURL("images/left-arrow-key.png");
                                    templates_expanded.style.right = "0px";  // change styles inline

                                }
                            }
                        })
                    }

                    //Adding button to footer
                    const footerButton = desk_container.querySelector(".footer-body-container button")
                    if (footerButton) {
                        footerButton.addEventListener("click", () => {
                            chrome.commands.onCommand("pressButton")
                        })
                    }

                    //Adding images
                    // Corrects the image path dynamically
                    const imageElement = document.querySelector(".svgLupa img") as HTMLImageElement;
                    if (imageElement) {
                        imageElement.src = chrome.runtime.getURL("images/search_icon_png.png");
                    }

                    //Arrow key image button
                    const imageElementArrowKey = document.querySelector(".arrowKeyTemplate img") as HTMLImageElement;
                    if (imageElementArrowKey) {
                        imageElementArrowKey.src = chrome.runtime.getURL("images/left-arrow-key.png");
                    }

                    //Arrow key image button
                    const buttonHeaderContainerImg = document.querySelector(".button-header-container img") as HTMLImageElement;
                    if (buttonHeaderContainerImg) {
                        buttonHeaderContainerImg.src = chrome.runtime.getURL("images/home.png");
                    }


                }



            })
            .catch(err => console.error("Erro ao carregar o sidebar.html", err));
    }
}

toggleExtension();


// Type to store the position of the shortcut window
type ShortcutWindowPositionType = {
    x: number | null;
    y: number | null;
}

const shortcutWindowPosition: ShortcutWindowPositionType = {
    x: null,
    y: null
}

// Function to close the shortcut window
const handleCloseShortcutWindow = () => {
    shortcutWindowPosition.x = null;
    shortcutWindowPosition.y = null;
    toggleShortcutBox(false);  // closes shortcut-box

}

// Function to detect clicks outside the shortcut-box
const clickOutsideToCloseShortcutWindow = () => {


    // adding a event listener for page clicks
    document.addEventListener('click', (event: MouseEvent) => {

        const shortcutBox = document.querySelector('.shortcut-box') as HTMLElement;

        const rect = shortcutBox?.getBoundingClientRect();

        // verifies if click was outside shortcut-box area
        if (rect &&
            (event.clientX < rect.left || event.clientX > rect.right ||
                event.clientY < rect.top || event.clientY > rect.bottom)) {

            // click out, closing window
            shortcutBox.classList.add("hiddenShortcutBox");
            shortcutBox.classList.remove("showedShortcutBox");
            handleCloseShortcutWindow();
        }
    });
}

clickOutsideToCloseShortcutWindow();


// toggleFunction for shortcutBox
export function toggleShortcutBox(isActive: boolean) {

    const shortcutBox = document.querySelector('.shortcut-box') as HTMLElement;

    if (shortcutBox) {
        if (isActive) {
            const activeElement = document.activeElement as HTMLElement;

            const caretPosition = getCaretPositionXY2(activeElement)

            if (caretPosition) {
                shortcutBox.classList.remove("hiddenShortcutBox");
                shortcutBox.classList.add("showedShortcutBox");
                shortcutBox.style.display = 'block';  // show shortcut-box
                shortcutBox.style.position = 'absolute';
                shortcutBox.style.top = `${caretPosition.y + 60}px`;  // 60 pixels under caret Position
                shortcutBox.style.left = `${caretPosition.x}px`;    
            }
        } else {
            shortcutBox.style.display = 'none';    // hides shortcut-box

        }
    } else {
        console.log("not in if of shortcutBox")
    }
}


// event to capture "//" and show shortcutbox

 document.addEventListener('keydown', (event) => {

    try {
        activeElement = document.activeElement as HTMLElement;
        console.log("active element", activeElement);

        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.getAttribute('contenteditable') === 'true') {
            

            let currentInputValue = '';

            // verifying inputs and textareas
            if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                //getting actual value of active element
                currentInputValue = (activeElement as HTMLInputElement | HTMLTextAreaElement).value;
            }
            // verifying divs
            else if (activeElement.getAttribute('contenteditable') === 'true') {
                currentInputValue = activeElement.innerText || activeElement.textContent || ''; //getting actual value of active div
            }

            // verifying if user pressed "/"
            if (event.key === '/') {
                // verifies if previous value is a "/"
                if (currentInputValue.endsWith('/')) {

                    // getting coords of active element
                    const rect = activeElement.getBoundingClientRect();

                    // storing position for shortcutbox
                    shortcutWindowPosition.x = rect.left;
                    shortcutWindowPosition.y = rect.bottom;

                    // showing shortcutbox with new position
                    toggleShortcutBox(true);

                }
            }

            //adding EventListenners to activeElements, this listenner will add function to filter the given element
            if (activeElement instanceof (HTMLInputElement) || activeElement instanceof (HTMLDivElement)) {
                if (currentInputValue.length > 2) {
                    if (shortcutWindowPosition.x !== null) {
                        if (activeElement instanceof (HTMLInputElement)) {
                            activeElement.addEventListener("input", (event) => {
                                const filteredHelpTexts = handleOnSearch(activeElement as HTMLInputElement, helpTexts);
                                updateHelpTextsShortcutWindow(filteredHelpTexts);
                            });
                        }

                        if (activeElement instanceof (HTMLDivElement)) {
                            activeElement.addEventListener('input', (event) => {
                                const filteredHelpTexts = handleOnSearch(activeElement as HTMLInputElement, helpTexts);
                                updateHelpTextsShortcutWindow(filteredHelpTexts);
                            });
                        }
                    }
                }
            }

        }
    } catch (err) {
        console.log("Error: ", err)
    }

}, { capture: true }); 



// render helpTexts dinamically in Shortcut Window
function renderHelpTextsShortcutWindow() {

    const templatesShortcutList = document.querySelector('.templates-list-shortcut-box');

    if (!templatesShortcutList) return; // verifying if ul exists
    templatesShortcutList.innerHTML = '';

    helpTexts.forEach(text => {

        const li = document.createElement('li');
        li.classList.add('shortcut_item'); // adding classe

        li.id = `${text.id}`;

        li.innerHTML = `
            <div class="shortcut-title">${text.shortcut}</div>
            <div class="shortcut-description">${text.type_spanish}</div>
        `;

        //adding event click on each LI that will open a new window!
        li.addEventListener('click', () => {

            // Adds the text to the element with the active cursor
            addTextToActiveElementWhenClicked(activeElement as HTMLElement, text.type_spanish);

            //closeShortcutBox
            handleCloseShortcutWindow();

        });

        templatesShortcutList.appendChild(li);
    });
}

function addTextToActiveElementWhenClicked(element: HTMLElement, textToAdd: string) {
    // verifies if element is an input or textArea
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        //inserting text in element
        element.value = textToAdd;
    }

    // verifies if element is a div with contentEditable
    else if (element instanceof HTMLDivElement && element.getAttribute('contenteditable') === 'true') {
        element.innerHTML = textToAdd;
    } else {
        console.log("Element not edittable");
    }
}


// update templates by search in active element
function updateHelpTextsShortcutWindow(filteredHelpTexts: helpText[]) {

    const templatesShortcutList = document.querySelector('.templates-list-shortcut-box');

    if (!templatesShortcutList) return;

    templatesShortcutList.innerHTML = '';

    // Iterate in helpTexts
    filteredHelpTexts.forEach(text => {

        const li = document.createElement('li');
        li.classList.add('shortcut_item');

        li.id = `${text.id}`;

        // Creating LI content
        li.innerHTML = `
            <div class="shortcut-title">${text.shortcut}</div>
            <div class="shortcut-description">${text.type_spanish}</div>
        `;

        li.addEventListener('click', () => {

            //adding event click on each LI that will open a new window!
            addTextToActiveElementWhenClicked(activeElement as HTMLElement, text.type_spanish);

            //closeShortcutBox
            handleCloseShortcutWindow();

        });

        templatesShortcutList.appendChild(li);
    });
}




