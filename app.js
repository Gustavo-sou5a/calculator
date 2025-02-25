/**
 * Functions used for operations between two numbers
 */
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    // ver caso onde b === 0
    return a / b;
}

function operate(a, b, operation) {
    return operation(a, b);
}

console.log(operate(3, 4, divide));


/**
 * Creating buttons for digits and operators on the DOM
 */
const NUM_DIGITS = 10;
const OPERATORS = ["AC", "+", "-", "*", "/", "="];
let decimalButtonActive = true;

const digitsDiv = document.querySelector("#digits");
for (let i = NUM_DIGITS-1; i >= 0; i--) {
    let digitBtn = document.createElement("button");
    digitBtn.textContent = i;
    digitBtn.classList.add(`digit-${i}`);
    digitBtn.classList.add("digit");
    digitBtn.addEventListener("click", () => addToDisplay(i));
    digitsDiv.appendChild(digitBtn);
}

// Adding the CE (Clear Entry) button for erasing the last input
let clearBtn = document.createElement("button");
clearBtn.textContent = "CE";
clearBtn.classList.add("clear");
clearBtn.addEventListener("click", () => {
    const display = document.querySelector("#display");
    let text = display.textContent;
    display.textContent = text.slice(0, -1);
    if (text.length === 1)
        display.textContent = 0;
    if (text.charAt(text.length - 1) === ".")
        decimalButtonActive = true;
});
digitsDiv.insertBefore(clearBtn, document.querySelector(".digit-0"));

// Adding the decimal button "." for float numbers
let decimalBtn = document.createElement("button");
decimalBtn.textContent = ".";
decimalBtn.classList.add("decimal");
decimalBtn.addEventListener("click", () => {
    if (decimalButtonActive) {
        addToDisplay(".");
        decimalButtonActive = false;
    }
});
digitsDiv.appendChild(decimalBtn);

const operatorsDiv = document.querySelector("#operators");
OPERATORS.forEach((operator) => {
    let operatorBtn = document.createElement("button");
    operatorBtn.textContent = operator;
    operatorBtn.setAttribute("id", `operator-${operator}`);
    if (operator !== "AC")
        operatorBtn.classList.add("operator");
    // operatorBtn.addEventListener("click", () => {

    // });
    operatorsDiv.appendChild(operatorBtn); 
});


/**
 * Adding the number (or decimal point) to the display
 */
function addToDisplay(num) {
    const display = document.querySelector("#display");
    if (display.textContent === "0" && num !== ".")
        display.textContent = num;
    else
        display.textContent += num;
}