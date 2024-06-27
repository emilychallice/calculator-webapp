let EXPR = "";
let EXPR_IS_ANS = false;
let DIVIDE_BY_ZERO_MSG = "Cannot divide by zero!";

const outputScreen = document.querySelector("#output-screen");
const clearButton = document.querySelector("#clear-button");
const equalsButton = document.querySelector("#equals-button");
const numberButtons = document.querySelectorAll(".number-button");
const operatorButtons = document.querySelectorAll(".operator-button");

const possibleOperators = [...operatorButtons].map((button) => button.textContent)

clearButton.onclick = clearButtonHandler;
equalsButton.onclick = equalsButtonHandler;
operatorButtons.forEach((button) => button.onclick = operatorButtonHandler);
numberButtons.forEach((button) => button.onclick = numberButtonHandler);

document.body.addEventListener("keydown", keydownHandler);

/*///////////////////*/
/* --- FUNCTIONS --- */
/*///////////////////*/

function updateOutputScreen(str) {
  outputScreen.textContent = String(str);
}

function containsOperators(str) {
  // Also returns false for one negative number with nothing before or after
  return possibleOperators.some((op) => str.includes(op)) && !/^-\d+$/.test(str);
}

function endsWithOperator(str) {
  return possibleOperators.includes(str.charAt(str.length - 1));
}

function clearButtonHandler() {
  EXPR = "";
  updateOutputScreen("0");
  EXPR_IS_ANS = false;
}

function keydownHandler(e) {
  let key = e.key;

  if (possibleOperators.includes(key)) {
    operatorButtonHandler(e);
  } else if ("1234567890.".includes(key)) {
    numberButtonHandler(e);
  } else if (key === '=' || key == "Enter") {
    equalsButtonHandler();
  } else if (key === "Backspace") {
    clearButtonHandler();
  }
}

function numberButtonHandler(e) {
  // Handle click or keydown
  let digit = (e.type === "click") ? e.target.textContent : e.key;

  EXPR = EXPR_IS_ANS ? digit : EXPR + digit;
  EXPR_IS_ANS = false;
  updateOutputScreen(EXPR);
}

function operatorButtonHandler(e) {
  // Handle click or keydown
  let operator = (e.type === "click") ? e.target.textContent : e.key;

  if (containsOperators(EXPR)) {
    if (endsWithOperator(EXPR)) {
       // Replace trailing operator with new operator
      EXPR = EXPR.slice(0, -1);
    } else {
      // If it has a preexisting full expression, evaluate that first
      EXPR = evaluateEXPR();
    }
  }
  EXPR += operator;
  EXPR_IS_ANS = false;
  updateOutputScreen(EXPR);
}

function equalsButtonHandler() {
   // Do not let user evaluate with trailing operator
  if(endsWithOperator(EXPR)) return;

  let answer = evaluateEXPR();
  updateOutputScreen(answer);
  EXPR = (answer === DIVIDE_BY_ZERO_MSG) ? "0" : String(answer)
  console.log(EXPR);
  EXPR_IS_ANS = true;
}

function evaluate(a, b, operator) {
  switch (operator) {
    case '+':
      return a + b;
      break;
    case '-':
      return a - b;
      break;
    case '*':
      return a * b;
      break;
    case '/':
      if (b !== 0) {
        return a / b;
      } else {
        return DIVIDE_BY_ZERO_MSG;
      }
  }
}

function evaluateEXPR() {
  if (EXPR == '.') return 0;
  if (EXPR_IS_ANS || !containsOperators(EXPR)) return +EXPR;

  // Extra parentheses around a regex split delimiter makes it part of the split array
  exprSplit = EXPR.split(/(\+|-|\*|\/)/);

  // Handle negative first number
  if (EXPR.charAt(0) === '-') {
    firstNumber = exprSplit.slice(0, 3).join('');
    exprSplit.splice(0, 3, firstNumber);
  }

  // Handle decimal on its own (or 'nothing') as an input
  exprSplit = exprSplit.map((x) => (x === '.' || x === '') ? "0.0" : x);
  console.log(exprSplit);

  return evaluate(+exprSplit[0], +exprSplit[2], exprSplit[1]);
}

// todo: Handling operator as first button clicked, and things like 23*=