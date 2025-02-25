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

    // é preciso passar para numeros, removendo os "." no final, se houver
    return operation(a, b);
}

console.log(operate(3, 4, divide));


/**
 * Creating buttons for digits and operators on the DOM
 */
const NUM_DIGITS = 10;
const OPERATORS = [{op:"AC", name:"ac"},
    {op:"+", name:"plus"},
    {op:"-", name:"minus"},
    {op:"*", name:"mult"},
    {op:"/", name:"div"},
    {op:"=", name:"eq"}];
const EMPTY_OPERTATION = {
    a: NaN,
    op: NaN,
    b: NaN
};
let runningOperation = {...EMPTY_OPERTATION};

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
    removeFromDisplay();
});
clearBtn.disabled = true;
digitsDiv.insertBefore(clearBtn, document.querySelector(".digit-0"));

// Adding the decimal button "." for float numbers
let decimalBtn = document.createElement("button");
decimalBtn.textContent = ".";
decimalBtn.classList.add("decimal");
decimalBtn.addEventListener("click", () => {
    addToDisplay(".");
    decimalBtn.disabled = true;  
});
digitsDiv.appendChild(decimalBtn);

const operatorsDiv = document.querySelector("#operators");
OPERATORS.forEach((operator) => {
    let operatorBtn = document.createElement("button");
    operatorBtn.textContent = operator.op;
    operatorBtn.setAttribute("id", `operator-${operator.name}`);

    if (operator.op !== "AC")
        operatorBtn.classList.add("operator");
    
    operatorBtn.addEventListener("click", () => {
        if (operator.op === "AC")
            eraseData();
        else if (Number.isNaN(runningOperation.b))
            startOperation(operator.op);
        else
            endOperation(operator.op);
    });
    operatorBtn.disabled = true;
    operatorsDiv.appendChild(operatorBtn); 
});


/**
 * Adding the number (or decimal point) to the display
 */
function addToDisplay(num) {
    enableOperatorButtons();
    const display = document.querySelector("#display");

    if (!Number.isNaN(runningOperation.op) 
        && Number.isNaN(runningOperation.b)) {
        if (num === ".")
            display.textContent = "0" + num;
        else
            display.textContent = num;
    }

    else if (display.textContent === "0" && num !== ".")
        display.textContent = num;
    else
        display.textContent += num;

    (Number.isNaN(runningOperation.op)) ? runningOperation.a = display.textContent : runningOperation.b = display.textContent;

    console.log(runningOperation.a);
    console.log(runningOperation.b);
}

/**
 * Removes the last input given from the display
 */
function removeFromDisplay() {
    const display = document.querySelector("#display");
    let text = display.textContent;
    display.textContent = text.slice(0, -1);

    (Number.isNaN(runningOperation.op)) ? runningOperation.a = display.textContent : runningOperation.b = display.textContent;

    if (text.length === 1) {
        display.textContent = 0;
        if (Number.isNaN(runningOperation.op))
            disableOperatorButtons();
    }
    else
        clearBtn.disabled = false;

    // If the entry erased was the decimal point, we can use it again
    if (text.charAt(text.length - 1) === ".")
        enableDecimalPoint();
}

/**
 * Starting the operation, using the number currently on
 * display and the operation clicked (given in the argument)
 */
function startOperation(op) {
    const display = document.querySelector("#display");
    // console.log(runningOperation.a);
    // console.log(runningOperation.op);
    if (op === "=") {
        operate()
    }
    else {
        runningOperation.op = op;
        enableDecimalPoint();
    }
}

/**
 * Ends an operation, which is when there was already
 * @param {*} op 
 */
function endOperation(op) {
    
}

function eraseData() {
    enableDecimalPoint();
    runningOperation = {...EMPTY_OPERTATION};
    display.textContent = 0;
    disableOperatorButtons();
}

function isFirstNumber() {
    return runningOperation.op !== NaN;
}

function enableOperatorButtons() {
    const operatorButtons = document.querySelectorAll("#operators button");
    operatorButtons.forEach((button) => button.disabled = false);
    const clearBtn = document.querySelector(".clear");
    clearBtn.disabled = false;
    (Number.isNaN(runningOperation.op)) ? disableEqualButton() : enableEqualButton();
}

function disableOperatorButtons() {
    const operatorButtons = document.querySelectorAll("#operators button");
    operatorButtons.forEach((button) => button.disabled = true);
    const clearBtn = document.querySelector(".clear");
    clearBtn.disabled = true;
}

function enableDecimalPoint() {
    const decimalBtn = document.querySelector(".decimal");
    decimalBtn.disabled = false;
}

function disableDecimalPoint() {
    const decimalBtn = document.querySelector(".decimal");
    decimalBtn.disabled = true;
}

function enableEqualButton() {
    const equalBtn = document.querySelector("#operator-eq");
    equalBtn.disabled = false;
}

function disableEqualButton() {
    const equalBtn = document.querySelector("#operator-eq");
    equalBtn.disabled = true;
}