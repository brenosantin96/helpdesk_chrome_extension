//this .tsfile deals with the logic and behavior inside the iframe (side_extension.html)
//Code here is sandboxed and cannot directly access the host page's DOM or JavaScript.
//Communicates with the host page via postMessage.
import { getCaretPositionXY2, observeElement, textToHtmlParagraph } from './utils';


const message = {
    action: "action",
    data: { key: "value" }
};

type helpText = {
    id: number;
    shortcut: string;
    type_spanish: string
    type_english: string
}

let helpTexts: helpText[] = [];
let counterHelpText = 0;

// Top-level initialization

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

        addListenersToLI(li);

        templatesList.appendChild(li);
    });

    // updating counter
    counterHelpText = helpTexts.length;

    // updating DOMs
    updateTemplateCounter();

}

firstGetTexts();

function updateTemplateCounter() {
    const templateCounter = document.querySelector(".templateCounter");
    if (templateCounter) {
        templateCounter.innerHTML = `Templates (${counterHelpText})`;
    }
}


//function to search on given elements
function handleOnSearch(element: HTMLInputElement | HTMLDivElement | HTMLTextAreaElement, helptexts: helpText[]): helpText[] {

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
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {

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

// Function to handle initialization logic
function handleInitialization(data: any) {

    // Apply iframe styles
    const stylesPath = chrome.runtime.getURL("iframe.css");
    applyStylesheet(stylesPath);
}

// Function to apply stylesheet
function applyStylesheet(stylesPath: string) {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.type = "text/css";
    linkElement.href = stylesPath;
    document.head.appendChild(linkElement);
}

function createButtons() {

    const iframe_extension = document.querySelector(".iframe_extension");
    if (iframe_extension) {

        //Adding button to expand extension
        const toggleButton = document.getElementById("desk-container-toggle-button");
        toggleButton?.addEventListener("click", () => {
            iframe_extension.classList.toggle("open"); // Alterna a classe 'open'
        });

    }

}

// Event listener for messages
window.addEventListener("message", (event) => {
    // Ensure the message is valid and has the expected token
    if (event.data.token === "150296") {
        if (event.data.action === "init") {
            handleInitialization(event.data);
        }
    }
});

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {

    const deskContainer = document.getElementById("desk-container");
    const deskContainerBody = document.querySelector(".desk-container-body");
    const toggleButton = document.getElementById("desk-container-toggle-button");
    
    //validators
    let isOpenedArrowKeyTemplateButton = false;

    // Add click event listener to toggle visibility
    toggleButton?.addEventListener("click", () => {
        deskContainer?.classList.toggle("open");
        deskContainerBody?.classList.toggle("openDeskContainer"); //this is adding the class in html, but NOT in styles, display keep it "NONE"

        //sending info to iframe parent component
        const isOpen = deskContainer?.classList.contains("open");
        if (isOpen) {
            let newMessage = { ...message, action: "toggleExtension", data: { key: "extensionOppened" } }
            window.parent.postMessage(newMessage, "*");
        } else {
            let newMessage = { ...message, action: "toggleExtension", data: { key: "extensionClosed" } }
            window.parent.postMessage(newMessage, "*");
        }

    });

    // Adding images
    const imageElementArrowKey = document.querySelector(".arrowKeyTemplate img") as HTMLImageElement;
    const arrowKeyTemplateButton = document.querySelector(".arrowKeyTemplate"); //to use later
    const templatesList = document.querySelector(".templates_list") as HTMLElement;
    imageElementArrowKey.src = chrome.runtime.getURL("images/left-arrow-key.png");

    arrowKeyTemplateButton?.addEventListener("click", () => {
        //logic to show templates here;

        //starts with false
        if (isOpenedArrowKeyTemplateButton) {
            //here menu template is opened, then it will make a click to close
            isOpenedArrowKeyTemplateButton = false;
            imageElementArrowKey.src = chrome.runtime.getURL("images/left-arrow-key.png");
            templatesList.style.transition = "all ease 0.3s"
            templatesList.style.right = "27px"
            
        } else {
            //here it is closed, then it will make a click to open
            isOpenedArrowKeyTemplateButton = true;
            templatesList.style.transition = "all ease 0.3s"
            templatesList.style.right = "-400px"
            imageElementArrowKey.src = chrome.runtime.getURL("images/right-arrow-key.png");
        }
    })

    // Change the search function to fire with the 'input' event
    const searchbox = deskContainer?.querySelector(".searchbox-body-container-text") as HTMLInputElement;
    if (searchbox) {
        searchbox.addEventListener("input", (event) => {
            const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
            const filteredHelpTexts = handleOnSearch(searchbox, helpTexts);
            updateHelpTexts(filteredHelpTexts);
        });
    }


});

function addListenersToLI(li: HTMLLIElement) {

    li.addEventListener("click", () => {

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

    })
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

        addListenersToLI(li);

        templatesList.appendChild(li);
    });
}



/* 

How They Work Together contentScript.ts and side_extension.ts

Adds the iframe (side_extension.html) to the page.
Sends a message to the iframe to initialize or update its content.
Acts as a middleman if you need data from the background script, storage, or APIs.
side_extension.ts:

Receives the message sent by contentScript.ts (e.g., initialization data).
Handles all functionality and interactions inside the iframe.

*/