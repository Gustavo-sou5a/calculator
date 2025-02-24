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
const OPERATORS = ["+", "-", "*", "/", "=", "CLR"];

const digitsDiv = document.querySelector("#digits");
for (let i = 0; i < NUM_DIGITS; i++) {
    let digitBtn = document.createElement("button");
    digitBtn.textContent = i;
    digitsDiv.appendChild(digitBtn);
}

const operatorsDiv = document.querySelector("#operators");
OPERATORS.forEach((operator) => {
    let operatorBtn = document.createElement("button");
    operatorBtn.textContent = operator;
    operatorsDiv.appendChild(operatorBtn); 
});
