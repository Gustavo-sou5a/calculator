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
    if (b === 0)
        return "Crazy";
    return a / b;
}

function operate(a, b, operation) {
    switch (operation) {
        case "+": operation = add; break;
        case "-": operation = subtract; break;
        case "*": operation = multiply; break;
        case "/": operation = divide; break;
    }
    return operation(a, b);
}

/**
 * Creating buttons for digits and operators on the DOM
 */
const NUM_DIGITS = 10;
const MAX_DIGITS_PER_NUMBER = 15;
const OPERATORS = [
    {op:"AC", name:"ac"},
    {op:"+", name:"plus"},
    {op:"-", name:"minus"},
    {op:"*", name:"mult"},
    {op:"/", name:"div"},
    {op:"=", name:"eq"}
];
const EMPTY_OPERTATION = {
    a: NaN,
    op: NaN,
    b: NaN,
    lastOp: NaN
};
let runningOperation = {...EMPTY_OPERTATION};

// Digits
const digitsDiv = document.querySelector("#digits");
for (let i = NUM_DIGITS-1; i >= 0; i--) {
    let digitBtn = document.createElement("button");
    digitBtn.textContent = i;
    digitBtn.classList.add(`digit-${i}`);
    digitBtn.classList.add("digit");
    digitBtn.addEventListener("click", () => {
        const display = document.querySelector("#display");
        addToDisplay(i);
    });
    digitBtn.addEventListener("mouseover", () => digitBtn.style.opacity = 0.5);
    digitBtn.addEventListener("mouseleave", () => digitBtn.style.opacity = 1);
    digitsDiv.appendChild(digitBtn);
}


// Adding the CE (Clear Entry) button for erasing the last input
let clearBtn = document.createElement("button");
clearBtn.textContent = "CE";
clearBtn.classList.add("clear");
clearBtn.addEventListener("click", () => removeFromDisplay());
clearBtn.addEventListener("mouseover", () => clearBtn.style.opacity = 0.5);
clearBtn.addEventListener("mouseleave", () => clearBtn.style.opacity = 1);
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
decimalBtn.addEventListener("mouseover", () => decimalBtn.style.opacity = 0.5);
decimalBtn.addEventListener("mouseleave", () => decimalBtn.style.opacity = 1);
digitsDiv.appendChild(decimalBtn);

// Operators
const operatorsDiv = document.querySelector("#operators");
OPERATORS.forEach((operator) => {
    let operatorBtn = document.createElement("button");
    operatorBtn.textContent = operator.op;
    operatorBtn.setAttribute("id", `operator-${operator.name}`);

    if (operator.op !== "AC")
        operatorBtn.classList.add("operator");
    
    operatorBtn.addEventListener("click", () => {
        operatorEventListener(operator.op);
        enableDigits();
    });
    operatorBtn.addEventListener("mouseover", () => operatorBtn.style.opacity = 0.5);
    operatorBtn.addEventListener("mouseleave", () => operatorBtn.style.opacity = 1);
    operatorBtn.disabled = true;
    operatorsDiv.appendChild(operatorBtn); 
});

function operatorEventListener(op) {
    if (op === "AC")
        eraseData();
    else if (Number.isNaN(runningOperation.b))
        startOperation(op);
    else
        endOperation(op);
}

/**
 * Adding the number (or decimal point) to the display
 */
function addToDisplay(num) {
    enableOperatorButtons();
    const display = document.querySelector("#display");

    if (runningOperation.lastOp === "=" || display.textContent === "Crazy") {
        if (num === ".")
            display.textContent = "0" + num;
        else
            display.textContent = num;
        runningOperation.lastOp = NaN;
    }
    else if (!Number.isNaN(runningOperation.op) 
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

    if (display.textContent.length > MAX_DIGITS_PER_NUMBER)
        disableDigits();
}
/**
 * Removes the last input given from the display
 */
function removeFromDisplay() {
    const display = document.querySelector("#display");
    let text = display.textContent;
    if (text === "Crazy")
        eraseData();
    else {
        display.textContent = text.slice(0, -1);
        (Number.isNaN(runningOperation.op)) ? runningOperation.a = display.textContent : runningOperation.b = display.textContent;
        if (text.length === 1) {
            display.textContent = 0;
            if (Number.isNaN(runningOperation.op))
                disableOperatorButtons();
        }
        else
            clearBtn.disabled = false;
    }

    enableDigits();
    // If the entry erased was the decimal point, we can use it again
    if (text.charAt(text.length - 1) === ".")
        enableDecimalPoint();    
}

/**
 * Starting the operation, using the number currently on
 * display and the operation clicked (given in the argument)
 */
function startOperation(op) {
    runningOperation.op = op;
    enableDecimalPoint();
}

/**
 * Ends an operation, which is when there was already
 * @param {*} op 
 */
function endOperation(nextOp) {
    const a = parseFloat(runningOperation.a);
    const b = parseFloat(runningOperation.b);
    const operation = runningOperation.op;
    let res = operate(a, b, operation);
    if (res !== "Crazy") {
        res = parseFloat(operate(a, b, operation).toFixed(12))

        disableEqualButton();
        enableDecimalPoint();

        const display = document.querySelector("#display");
        display.textContent = res;

        if (nextOp === "=") {
            runningOperation = {...EMPTY_OPERTATION};
            runningOperation.a = res;
            runningOperation.lastOp = "="; 
        }
        else {
            runningOperation.a = res;
            runningOperation.b = NaN;
            runningOperation.op = nextOp;
        }
    }
    else {
        const display = document.querySelector("#display");
        display.textContent = res;
        disableOperatorButtons();
        enableEraseButtons();
        runningOperation = {...EMPTY_OPERTATION};
    }
}

function eraseData() {
    enableDecimalPoint();
    runningOperation = {...EMPTY_OPERTATION};
    const display = document.querySelector("#display");
    display.textContent = 0;
    disableOperatorButtons();
}

function isFirstNumber() {
    return runningOperation.op !== NaN;
}

function disableDigits() {
    const digitsButtons = document.querySelectorAll(".digit");
    digitsButtons.forEach((button) => button.disabled = true);
}

function enableDigits() {
    const digitsButtons = document.querySelectorAll(".digit");
    digitsButtons.forEach((button) => button.disabled = false);
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

function enableEraseButtons() {
    const ce = document.querySelector(".clear");
    const ac = document.querySelector("#operator-ac");
    ce.disabled = false;
    ac.disabled = false;
}

addEventListener("keydown", (event) => {
    switch (event.key) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            // we can verify if only one is disabled, because they all disable and enable together
            const zeroBtn = document.querySelector(".digit-0");
            if (!zeroBtn.disabled)
                addToDisplay(event.key);
            break;
        case "+":
        case "-":
        case "*":
        case "/":
            // we can verify if only one is disabled, because they all disable and enable together
            const plusBtn = document.querySelector("#operator-plus");
            if (!plusBtn.disabled)
                operatorEventListener(event.key);
            break;
        case "Enter":
            const equalBtn = document.querySelector("#operator-eq");
            if (!equalBtn.disabled)
                operatorEventListener("=");
            break;
        case "Delete":
            const ac = document.querySelector("#operator-ac");
            if (!ac.disabled)
                operatorEventListener("AC");
            break;
        case "Backspace":
            const ce = document.querySelector(".clear");
            if (!ce.disabled)
                removeFromDisplay();
            break;
        case ".":
            const decimalBtn = document.querySelector(".decimal");
            if (!decimalBtn.disabled) {
                addToDisplay(".");
                decimalBtn.disabled = true;
            }
            break;
    }
});