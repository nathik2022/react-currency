import { useEffect, useState } from 'react';
import Axios from 'axios';
import Dropdown from 'react-dropdown';
import { HiSwitchHorizontal } from 'react-icons/hi';
import 'react-dropdown/style.css';
import './App.css';

function App() {

// Initializing all the state variables
//const [info, setInfo] = useState([0=>'GBP','I]);
const [info, setInfo] = useState(0);
const [input, setInput] = useState(1);
const [from, setFrom] = useState("GBP");
const [to, setTo] = useState("INR");
//const [result]= useState(0);
const [options] = useState(["GBP","USD","INR","CHF","AUD","CAD"]);
const [output, setOutput] = useState(0);

// Calling the api whenever the dependency changes
useEffect(() => {
	Axios.get(
              //`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}.json`)
              `http://localhost:8000/api/exchangerate/to/${to}/from/${from}/amount/${input}`
            )
        .then((res) => {
            console.log("res",res);
            if(res.data.result !== undefined){
              setInfo(res.data.result);
            }
            
        })
        .catch((err) => console.log("err", err));
}, [convert, from, input, to]);

// Calling the convert function whenever
// a user switches the currency
// useEffect(() => {
// 	//setOptions(Object.keys(info));
//   //alert('effect');
// 	convert();
// }, [info])
	
// Function to convert the currency
// eslint-disable-next-line react-hooks/exhaustive-deps
function convert() {
  var rate = info;
  //console.log("final",rate);
  setOutput(rate);
}

// Function to switch between two currency
function flip() {
	var temp = from;
	setFrom(to);
	setTo(temp);
}

return (
	<div className="App">
	<div className="heading">
		<h1>Currency converter</h1>
	</div>
	<div className="container">
		<div className="left">
		<h3>Amount</h3>
		<input type="text"
			placeholder="Enter the amount"
			onChange={(e) => setInput(e.target.value)} />
		</div>
		<div className="middle">
		<h3>From</h3>
		<Dropdown options={options}
					onChange={(e) => { setFrom(e.value) }}
		value={from} placeholder="From" />
		</div>
		<div className="switch">
		<HiSwitchHorizontal size="30px"
						onClick={() => { flip()}}/>
		</div>
		<div className="right">
		<h3>To</h3>
		<Dropdown options={options}
					onChange={(e) => {setTo(e.value)}}
		value={to} placeholder="To" />
		</div>
	</div>
	<div className="result">
		<button onClick={()=>{convert()}}>Convert</button>
		<h2>Converted Amount:</h2>
		<p>{input+" "+from+" = "+output.toFixed(2) + " " + to}</p>

	</div>
	</div>
);
}

export default App;


