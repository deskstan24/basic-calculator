"use strict";

let currentNumber = "";
let previousNumber = "";
let currentOperator = "";

const currentDisplay = document.querySelector(".currentNumber");
const previousDisplay = document.querySelector(".previousNumber");

//Evemt Listeners
document.querySelector(".equal").addEventListener("click", calculate);
document.querySelector(".decimal").addEventListener("click", addDecimal);
document.querySelector(".clear").addEventListener("click", clearCalculator);
window.addEventListener("keydown", handleKeyPress);

//Get numbers 0 - 9
document.querySelectorAll(".number").forEach((button) => {
  button.addEventListener("click", () => handleNumber(button.textContent));
});

//Get operators
document.querySelectorAll(".operator").forEach((button) => {
  button.addEventListener("click", () => handleOperator(button.textContent));
});

function handleNumber(number) {
  if (previousNumber && !currentOperator && !currentNumber) {
    previousNumber = "";
  }

  //Keep display length as 11 didgits
  if (currentNumber.length <= 11) {
    currentNumber += number;
    updateDisplay();
  }
}

function handleOperator(operator) {
  if (!currentNumber && !previousNumber) return; //When no number is added

  if (currentNumber && previousDisplay && currentOperator) {
    calculate();
  }

  currentOperator = operator;
  if (currentNumber) {
    previousNumber = currentNumber;
    currentNumber = "";
  }
  updateDisplay();
}

function calculate() {
  if (!previousNumber || !currentNumber || !currentOperator) return;

  const prev = parseFloat(previousNumber);
  const current = parseFloat(currentNumber);
  let result;

  switch (currentOperator) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "x":
      result = prev * current;
      break;
    case "/":
      result = current === 0 ? "Error" : prev / current;
      break;
    default:
      return;
  }

  // Round long decimals
  result = typeof result === "number" ? roundNumber(result) : result;

  currentNumber = result.toString();
  previousNumber = "";
  currentOperator = "";
  updateDisplay();
}

function roundNumber(num) {
  return Math.round(num * 100000) / 100000;
}

function addDecimal() {
  if (!currentNumber.includes(".")) {
    currentNumber += currentNumber ? "." : "0.";
    updateDisplay();
  }
}

function clearCalculator() {
  currentNumber = "";
  previousNumber = "";
  currentOperator = "";
  updateDisplay();
}

//Display on Screen
function updateDisplay() {
  currentDisplay.textContent = currentNumber || "0";
  previousDisplay.textContent =
    previousNumber && currentOperator
      ? `${previousNumber} ${currentOperator}`
      : "";
}

function handleDelete() {
  if (currentNumber) {
    currentNumber = currentNumber.slice(0, -1);
    updateDisplay();
  }
}

// Handle keyboard input
function handleKeyPress(e) {
  e.preventDefault();

  if (e.key >= "0" && e.key <= "9") handleNumber(e.key);
  if (e.key === ".") addDecimal();
  if (e.key === "Enter" || e.key === "=") calculate();
  if (["+", "-", "*", "/"].includes(e.key)) {
    handleOperator(e.key === "*" ? "×" : e.key === "/" ? "÷" : e.key);
  }
  if (e.key === "Escape") clearCalculator();
  if (e.key === "Backspace") handleDelete();
}
