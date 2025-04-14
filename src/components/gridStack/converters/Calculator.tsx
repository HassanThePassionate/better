"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Percent,
  Divide,
  X,
  Minus,
  Plus,
  Equal,
  Delete,
  Clock,
  Trash2,
  XCircle,
} from "lucide-react";

type HistoryItem = {
  id: string;
  calculation: string;
  result: string;
  timestamp: Date;
};

export default function Calculator() {
  const [display, setDisplay] = useState<string>("0");
  const [memory, setMemory] = useState<number>(0);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(true);
  const [pendingOperator, setPendingOperator] = useState<string | null>(null);
  const [pendingValue, setPendingValue] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentCalculation, setCurrentCalculation] = useState<string>("");
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const displayInputRef = useRef<HTMLInputElement>(null);

  // Handle direct input in the display
  const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow numbers, operators, and parentheses for expressions
    if (/^[0-9+\-*/().]*$/.test(value) || value === "") {
      setDisplay(value === "" ? "0" : value);
      setWaitingForOperand(false);
    }
  };

  // Handle Enter key to evaluate expressions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      evaluateExpression();
    }
  };

  // Evaluate the expression in the display
  const evaluateExpression = () => {
    try {
      // Replace × with * and ÷ with / for evaluation
      const expressionToEvaluate = display
        .replace(/×/g, "*")
        .replace(/÷/g, "/");

      // Use Function constructor instead of eval for better security
      // This is still not 100% secure but better than eval
      const result = new Function(`return ${expressionToEvaluate}`)();

      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(), // Add unique ID for each history item
        calculation: display,
        result: result.toString(),
        timestamp: new Date(),
      };
      setHistory([historyItem, ...history]);

      // Update display with result
      setDisplay(result.toString());
      setWaitingForOperand(true);
      setCurrentCalculation("");
      setPendingOperator(null);
      setPendingValue(0);
    } catch (error) {
      setDisplay("Error");
      setWaitingForOperand(true);
      console.log(error);
    }
  };

  const clearAll = () => {
    setDisplay("0");
    setWaitingForOperand(true);
    setPendingOperator(null);
    setPendingValue(0);
    setCurrentCalculation("");
  };

  //   const clearDisplay = () => {
  //     setDisplay("0");
  //     setWaitingForOperand(true);
  //   };

  const backspace = () => {
    if (waitingForOperand) return;

    const newDisplay = display.length > 1 ? display.slice(0, -1) : "0";
    setDisplay(newDisplay);
    if (newDisplay === "0") {
      setWaitingForOperand(true);
    }
  };

  const digitPressed = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
      setCurrentCalculation(currentCalculation + digit);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
      setCurrentCalculation(currentCalculation + digit);
    }
  };

  const decimalPressed = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      setCurrentCalculation(currentCalculation + "0.");
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
      setCurrentCalculation(currentCalculation + ".");
    }
  };

  const unaryOperatorPressed = (operator: string) => {
    const operand = Number.parseFloat(display);
    let result = 0;
    let operationText = "";

    switch (operator) {
      case "sqrt":
        if (operand < 0) {
          setDisplay("Error");
          setWaitingForOperand(true);
          return;
        }
        result = Math.sqrt(operand);
        operationText = `√(${operand})`;
        break;
      case "square":
        result = operand * operand;
        operationText = `(${operand})²`;
        break;
      case "reciprocal":
        if (operand === 0) {
          setDisplay("Error");
          setWaitingForOperand(true);
          return;
        }
        result = 1 / operand;
        operationText = `1/(${operand})`;
        break;
      case "negate":
        result = -operand;
        operationText = `-(${operand})`;
        break;
      case "percent":
        result = operand / 100;
        operationText = `${operand}%`;
        break;
    }

    setDisplay(result.toString());
    setWaitingForOperand(true);

    // Add to history
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      calculation: operationText,
      result: result.toString(),
      timestamp: new Date(),
    };
    setHistory([historyItem, ...history]);
    setCurrentCalculation(result.toString());
  };

  const binaryOperatorPressed = (operator: string) => {
    const operand = Number.parseFloat(display);
    let operatorSymbol = "";

    switch (operator) {
      case "+":
        operatorSymbol = " + ";
        break;
      case "-":
        operatorSymbol = " - ";
        break;
      case "*":
        operatorSymbol = " × ";
        break;
      case "/":
        operatorSymbol = " ÷ ";
        break;
    }

    if (pendingOperator !== null) {
      const result = calculate(pendingValue, operand, pendingOperator);
      setDisplay(result.toString());
      setPendingValue(result);
      setCurrentCalculation(result.toString() + operatorSymbol);
    } else {
      setPendingValue(operand);
      setCurrentCalculation(currentCalculation + operatorSymbol);
    }

    setPendingOperator(operator);
    setWaitingForOperand(true);
  };

  const equalsPressed = () => {
    // If the display contains an expression, evaluate it directly
    if (display.match(/[+\-*/]/)) {
      evaluateExpression();
      return;
    }

    const operand = Number.parseFloat(display);

    if (pendingOperator !== null) {
      const result = calculate(pendingValue, operand, pendingOperator);
      setDisplay(result.toString());

      // Add to history
      const calculation = `${pendingValue} ${getOperatorSymbol(
        pendingOperator
      )} ${operand}`;
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        calculation: calculation,
        result: result.toString(),
        timestamp: new Date(),
      };
      setHistory([historyItem, ...history]);

      setPendingValue(result);
      setPendingOperator(null);
      setCurrentCalculation("");
    }

    setWaitingForOperand(true);
  };

  const getOperatorSymbol = (operator: string): string => {
    switch (operator) {
      case "+":
        return "+";
      case "-":
        return "-";
      case "*":
        return "×";
      case "/":
        return "÷";
      default:
        return operator;
    }
  };

  const calculate = (
    leftOperand: number,
    rightOperand: number,
    operator: string
  ): number => {
    switch (operator) {
      case "+":
        return leftOperand + rightOperand;
      case "-":
        return leftOperand - rightOperand;
      case "*":
        return leftOperand * rightOperand;
      case "/":
        return leftOperand / rightOperand;
      default:
        return rightOperand;
    }
  };

  const memoryRecall = () => {
    setDisplay(memory.toString());
    setWaitingForOperand(true);
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const memoryAdd = () => {
    setMemory(memory + Number.parseFloat(display));
    setWaitingForOperand(true);
  };

  const memorySubtract = () => {
    setMemory(memory - Number.parseFloat(display));
    setWaitingForOperand(true);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // New function to remove a single history item
  const removeHistoryItem = (id: string) => {
    setHistory(history.filter((item) => item.id !== id));
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const buttonClass = (type: "function" | "number" | "operator" | "equals") => {
    const baseClass =
      "flex items-center justify-center rounded-full text-base font-medium h-10 w-10 shadow-sm active:scale-95 transition-transform";

    switch (type) {
      case "function":
        return cn(baseClass, "bg-card text-text");
      case "number":
        return cn(baseClass, "bg-badge text-text");
      case "operator":
        return cn(baseClass, "bg-brand text-text-primary");
      case "equals":
        return cn(baseClass, "bg-brand text-text-primary");
      default:
        return baseClass;
    }
  };

  const handleHistoryItemClick = useCallback(
    (item: HistoryItem) => {
      setDisplay(item.result);
      setWaitingForOperand(true);
    },
    [setDisplay, setWaitingForOperand]
  );

  return (
    <div className='flex flex-col md:flex-row gap-3 max-w-2xl mx-auto'>
      <div className='flex-1'>
        <div className='bg-card p-3 rounded-xl mb-2'>
          <div className='relative flex items-center justify-end h-12 overflow-hidden'>
            <input
              ref={displayInputRef}
              type='text'
              value={display}
              onChange={handleDisplayChange}
              onKeyDown={handleKeyDown}
              className='w-full text-right text-3xl font-light text-text bg-transparent border-none focus:outline-none'
              inputMode='text'
              placeholder='Enter expression'
            />
          </div>
          {currentCalculation && (
            <div className='text-right text-sm text-foreground mt-1 h-4 overflow-hidden'>
              {currentCalculation}
            </div>
          )}
        </div>

        <div className='grid grid-cols-4 gap-2 p-1'>
          {/* First row */}
          <button onClick={clearAll} className={buttonClass("function")}>
            C
          </button>
          <button
            onClick={() => unaryOperatorPressed("negate")}
            className={buttonClass("function")}
          >
            +/-
          </button>
          <button
            onClick={() => unaryOperatorPressed("percent")}
            className={buttonClass("function")}
          >
            <Percent className='h-4 w-4' />
          </button>
          <button
            onClick={() => binaryOperatorPressed("/")}
            className={buttonClass("operator")}
          >
            <Divide className='h-4 w-4' />
          </button>

          {/* Second row */}
          <button
            onClick={() => digitPressed("7")}
            className={buttonClass("number")}
          >
            7
          </button>
          <button
            onClick={() => digitPressed("8")}
            className={buttonClass("number")}
          >
            8
          </button>
          <button
            onClick={() => digitPressed("9")}
            className={buttonClass("number")}
          >
            9
          </button>
          <button
            onClick={() => binaryOperatorPressed("*")}
            className={buttonClass("operator")}
          >
            <X className='h-4 w-4' />
          </button>

          {/* Third row */}
          <button
            onClick={() => digitPressed("4")}
            className={buttonClass("number")}
          >
            4
          </button>
          <button
            onClick={() => digitPressed("5")}
            className={buttonClass("number")}
          >
            5
          </button>
          <button
            onClick={() => digitPressed("6")}
            className={buttonClass("number")}
          >
            6
          </button>
          <button
            onClick={() => binaryOperatorPressed("-")}
            className={buttonClass("operator")}
          >
            <Minus className='h-4 w-4' />
          </button>

          {/* Fourth row */}
          <button
            onClick={() => digitPressed("1")}
            className={buttonClass("number")}
          >
            1
          </button>
          <button
            onClick={() => digitPressed("2")}
            className={buttonClass("number")}
          >
            2
          </button>
          <button
            onClick={() => digitPressed("3")}
            className={buttonClass("number")}
          >
            3
          </button>
          <button
            onClick={() => binaryOperatorPressed("+")}
            className={buttonClass("operator")}
          >
            <Plus className='h-4 w-4' />
          </button>

          {/* Fifth row */}
          <button
            onClick={() => digitPressed("0")}
            className='flex items-center justify-start pl-5 rounded-full text-base font-medium h-10 col-span-2 bg-[#333333] text-white shadow-sm active:scale-95 transition-transform'
          >
            0
          </button>
          <button onClick={decimalPressed} className={buttonClass("number")}>
            .
          </button>
          <button onClick={equalsPressed} className={buttonClass("equals")}>
            <Equal className='h-4 w-4' />
          </button>
        </div>

        {/* Scientific functions in a separate section */}
        <div className='mt-3 bg-card p-2 rounded-xl'>
          <div className='flex justify-between items-center'>
            <h3 className='text-xs font-medium text-text mb-2 px-1'>
              SCIENTIFIC
            </h3>
            <button
              onClick={toggleHistory}
              className='flex items-center text-xs text-brand mb-2 px-1'
            >
              <Clock className='h-3 w-3 mr-1' />
              {showHistory ? "Hide History" : "Show History"}
            </button>
          </div>
          <div className='grid grid-cols-4 gap-2'>
            <button
              onClick={memoryClear}
              className='bg-badge rounded-lg p-2 text-xs text-text shadow-sm'
            >
              MC
            </button>
            <button
              onClick={memoryRecall}
              className='bg-badge rounded-lg p-2 text-xs text-text shadow-sm'
            >
              MR
            </button>
            <button
              onClick={memoryAdd}
              className='bg-badge rounded-lg p-2 text-xs text-text shadow-sm'
            >
              M+
            </button>
            <button
              onClick={memorySubtract}
              className='bg-badge rounded-lg p-2 text-xs text-text shadow-sm'
            >
              M-
            </button>

            <button
              onClick={() => unaryOperatorPressed("sqrt")}
              className='bg-badge rounded-lg p-2 text-xs text-text shadow-sm'
            >
              √
            </button>
            <button
              onClick={() => unaryOperatorPressed("square")}
              className='bg-badge rounded-lg p-2 text-xs text-text shadow-sm'
            >
              x²
            </button>
            <button
              onClick={() => unaryOperatorPressed("reciprocal")}
              className='bg-badge rounded-lg p-2 text-xs text-text shadow-sm'
            >
              1/x
            </button>
            <button
              onClick={backspace}
              className='bg-badge rounded-lg p-2 text-xs text-text shadow-sm'
            >
              <Delete className='h-3 w-3 mx-auto' />
            </button>
          </div>
        </div>
      </div>

      {/* History panel - visible on larger screens or when toggled */}
      <div
        className={cn(
          "bg-card rounded-xl p-3 transition-all",
          showHistory ? "block" : "hidden md:block",
          "md:w-64"
        )}
      >
        <div className='flex justify-between items-center mb-2'>
          <h3 className='text-sm font-medium text-text'>History</h3>
          <button
            onClick={clearHistory}
            className='flex items-center text-xs text-error'
            disabled={history.length === 0}
          >
            <Trash2 className='h-3 w-3 mr-1' />
            Clear
          </button>
        </div>

        {history.length === 0 ? (
          <div className='text-center text-foreground opacity-70 text-sm py-4'>
            No calculations yet
          </div>
        ) : (
          <div className='space-y-2 max-h-[400px] overflow-y-auto'>
            {history.map((item) => (
              <div key={item.id} className='relative group'>
                <button
                  onClick={() => handleHistoryItemClick(item)}
                  className='w-full bg-badge rounded-lg p-2 text-left hover:bg-hover transition-colors'
                >
                  <div className='text-xs text-foreground'>
                    {item.calculation}
                  </div>
                  <div className='text-base font-medium'>{item.result}</div>
                  <div className='text-xs text-foreground'>
                    {item.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </button>
                <button
                  onClick={() => removeHistoryItem(item.id)}
                  className='absolute top-1 right-1 p-1 rounded-full text-foreground hover:text-error opacity-0 group-hover:opacity-100 transition-opacity'
                  aria-label='Remove history item'
                >
                  <XCircle className='h-4 w-4' />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
