import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
    const [display, setDisplay] = useState("0");
    const [previousValue, setPreviousValue] = useState(null);
    const [operation, setOperation] = useState(null);
    const [resetDisplay, setResetDisplay] = useState(false);
    const [justCalculated, setJustCalculated] = useState(false);

    // Add keyboard event listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Numbers
            if (/^[0-9]$/.test(e.key)) {
                handleNumberClick(parseInt(e.key));
            }
            // Operators
            else if (e.key === '+') handleOperator("+");
            else if (e.key === '-') handleOperator("-");
            else if (e.key === '*') handleOperator("*");
            else if (e.key === '/') handleOperator("/");
            else if (e.key === '%') handleOperator("%");
            // Equals (Enter or =)
            else if (e.key === '=' || e.key === 'Enter') calculate();
            // Decimal
            else if (e.key === '.') handleDecimal();
            // Clear (Escape)
            else if (e.key === 'Escape') clear();
            // Backspace
            else if (e.key === 'Backspace') {
                if (display.length > 1) {
                    setDisplay(display.slice(0, -1));
                } else {
                    setDisplay("0");
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [display, previousValue, operation, justCalculated]); // Add dependencies

    const handleNumberClick = (num) => {
        if (justCalculated) {
            setDisplay(num.toString());
            setPreviousValue(null); // Reset previous value to start fresh
            setJustCalculated(false);
        } else if (display === "0" || resetDisplay) {
            setDisplay(num.toString());
            setResetDisplay(false);
        } else {
            setDisplay(display + num.toString());
        }
    };

    const handleDecimal = () => {
        if (justCalculated) {
            setDisplay("0.");
            setPreviousValue(null); // Reset previous value to start fresh
            setJustCalculated(false);
        } else if (resetDisplay) {
            setDisplay("0.");
            setResetDisplay(false);
        } else if (!display.includes(".")) {
            setDisplay(display + ".");
        }
    };

    const handleOperator = (op) => {
        setJustCalculated(false);
        if (previousValue === null) {
            setPreviousValue(parseFloat(display));
        } else if (operation) {
            calculate();
        }
        setOperation(op);
        setResetDisplay(true);
    };

    const calculate = async () => {
        if (previousValue !== null && operation) {
            try {
                const result = await invoke("calculate", {
                    a: previousValue,
                    b: parseFloat(display),
                    operation: operation
                });
                setDisplay(result.toString());
                setPreviousValue(result);
                setJustCalculated(true);
            } catch (error) {
                console.error("Calculation error:", error);
                setDisplay(`Error: ${error}`);
            }
            setOperation(null);
        }
    };

    const clear = () => {
        setDisplay("0");
        setPreviousValue(null);
        setOperation(null);
        setResetDisplay(false);
        setJustCalculated(false);
    };

    return (
        <div className="calculator">
            <div className="display">{display}</div>
            <div className="keypad">
                <button onClick={clear}>AC</button>
                <button onClick={() => setDisplay((parseFloat(display) * -1).toString())}>+/-</button>
                <button onClick={() => handleOperator("%")}>%</button>
                <button className="operator" onClick={() => handleOperator("/")}>÷</button>

                <button onClick={() => handleNumberClick(7)}>7</button>
                <button onClick={() => handleNumberClick(8)}>8</button>
                <button onClick={() => handleNumberClick(9)}>9</button>
                <button className="operator" onClick={() => handleOperator("*")}>×</button>

                <button onClick={() => handleNumberClick(4)}>4</button>
                <button onClick={() => handleNumberClick(5)}>5</button>
                <button onClick={() => handleNumberClick(6)}>6</button>
                <button className="operator" onClick={() => handleOperator("-")}>-</button>

                <button onClick={() => handleNumberClick(1)}>1</button>
                <button onClick={() => handleNumberClick(2)}>2</button>
                <button onClick={() => handleNumberClick(3)}>3</button>
                <button className="operator" onClick={() => handleOperator("+")}>+</button>

                <button className="wide" onClick={() => handleNumberClick(0)}>0</button>
                <button onClick={handleDecimal}>.</button>
                <button className="operator" onClick={calculate}>=</button>
            </div>
        </div>
    );
}

export default App;