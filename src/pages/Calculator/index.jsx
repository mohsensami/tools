import { useState } from 'react';
// import './index.css';

function Index() {
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState([]);

    const clear = () => {
        setDisplay('0');
        setExpression([]);
    };

    const handleClick = (value) => {
        setDisplay(value);
        setExpression([...expression, value]);
    };

    const handleResult = () => {
        const result = expression
            .join('')
            .split(/(\D)/g)
            .map((value) => (value.match(/\d/g) ? parseInt(value, 0) : value))
            .reduce((acc, value, index, array) => {
                switch (value) {
                    case '+':
                        return (acc = acc + array[index + 1]);
                    case '-':
                        return (acc = acc - array[index + 1]);
                    case 'x':
                        return (acc = acc * array[index + 1]);
                    case '÷':
                        return (acc = acc / array[index + 1]);
                    default:
                        return acc;
                }
            });
        setDisplay(result);
        setExpression('');
    };

    return (
        <div className="App">
            <div className="container mx-auto">
                <h3 className="bg-gray-200 h-12 flex items-center justify-center">{display}</h3>
                <h3 className="bg-gray-300 h-12 my-4 flex items-center justify-center">{expression}</h3>
            </div>

            <div dir="ltr" className="container mx-auto py-10">
                <h1 className="text-2xl font-bold mb-5"> Calculator</h1>
                <div className="grid grid-cols-4 gap-4">
                    <input
                        type="text"
                        id="result"
                        className="col-span-4 text-center border py-4 text-3xl font-bold rounded-lg"
                        value={display}
                        readonly
                    />
                    <button
                        onClick={() => clear()}
                        id="clear"
                        className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg col-span-2"
                    >
                        C
                    </button>
                    <button id="backspace" className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg">
                        ←
                    </button>
                    <button
                        onClick={() => handleClick('÷')}
                        id="divide"
                        className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg"
                    >
                        ÷
                    </button>
                    <button
                        onClick={() => handleClick(7)}
                        id="seven"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
                    >
                        7
                    </button>
                    <button
                        onClick={() => handleClick(8)}
                        id="eight"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
                    >
                        8
                    </button>
                    <button
                        onClick={() => handleClick(9)}
                        id="nine"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
                    >
                        9
                    </button>
                    <button
                        onClick={() => handleClick('x')}
                        id="multiply"
                        className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg"
                    >
                        x
                    </button>
                    <button
                        onClick={() => handleClick(4)}
                        id="four"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
                    >
                        4
                    </button>
                    <button
                        onClick={() => handleClick(5)}
                        id="five"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
                    >
                        5
                    </button>
                    <button
                        onClick={() => handleClick(6)}
                        id="six"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
                    >
                        6
                    </button>
                    <button
                        onClick={() => handleClick('-')}
                        id="subtract"
                        className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg"
                    >
                        -
                    </button>
                    <button
                        onClick={() => handleClick(1)}
                        id="one"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
                    >
                        1
                    </button>
                    <button
                        onClick={() => handleClick(2)}
                        id="two"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
                    >
                        2
                    </button>
                    <button
                        onClick={() => handleClick(3)}
                        id="three"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
                    >
                        3
                    </button>
                    <button
                        onClick={() => handleClick('+')}
                        id="add"
                        className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg"
                    >
                        +
                    </button>
                    <button
                        onClick={() => handleClick(0)}
                        id="zero"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg col-span-2"
                    >
                        0
                    </button>
                    <button
                        onClick={() => handleClick('-')}
                        id="decimal"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
                    >
                        .
                    </button>
                    <button
                        onClick={() => handleResult()}
                        id="equals"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                    >
                        =
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Index;
