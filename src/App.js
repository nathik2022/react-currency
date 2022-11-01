import { useEffect, useState } from 'react';
import Axios from 'axios';
import Dropdown from 'react-dropdown';
import { HiSwitchHorizontal } from 'react-icons/hi';
import 'react-dropdown/style.css';
import './App.css';


function App() {

	
	//Initializing variables for local storage
	const expirationDuration = 1000 * 60 * 2; // 2 minutes
	const [currentTime] = useState(new Date().getTime()); //current time
	const [existingTo] = useState(localStorage.getItem("existingTo"));
	const [existingFrom] = useState(localStorage.getItem("existingFrom"));
	const [existingRate] = useState(localStorage.getItem("existingRate"));
	const [cacheTime,setCacheTime] = useState(false);
	const existingAcceptedTime = localStorage.getItem("existingAcceptedTime");
	
	var timeCheck = 0;
	var prevAcceptedExpired = existingAcceptedTime != null && currentTime - existingAcceptedTime > expirationDuration;

	if(existingAcceptedTime != null){
		 timeCheck = currentTime - existingAcceptedTime;
	}		
	
	//alert('time check'+timeCheck);
	//alert('expiration duration time check'+expirationDuration);
	
	//time expired clear cache
	if(prevAcceptedExpired){
		//alert(existingAcceptedTime);

		localStorage.clear();
	}

	//const notAccepted = useState(false);
	var notAccepted = false;
	
	if(existingTo == null || existingFrom == null || existingRate == null){
		 notAccepted = true;
	}


	
	
	// Initializing all the state variables
	const [info, setInfo] = useState(0);
	const [input, setInput] = useState(1);
	const [from, setFrom] = useState("GBP");
	const [to, setTo] = useState("INR");
	//const [result]= useState(0);
	const [options] = useState(["GBP","USD","INR","CHF","AUD","CAD"]);
	const [output, setOutput] = useState(0);


	// Calling the api whenever the dependency changes
	useEffect(() => {
		if(to != existingTo || from != existingFrom){
			notAccepted = true;	
		}
		if(notAccepted || prevAcceptedExpired){
			Axios.get(
					//`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}.json`)
					`http://localhost:8000/api/exchangerate/to/${to}/from/${from}/amount/${input}`
					)
				.then((res) => {
					console.log(res);
					var result =res.data.info.rate; 
					if(result){
						if(res.data.info.rate !== undefined){
							setInfo(res.data.info.rate);
							//convert();
							var rate = (res.data.info.rate) * input;
							console.log("final",rate);
							//console.log("through api call");
							setOutput(rate);
							setCacheTime(false);
							localStorage.setItem("existingTo", to);
							localStorage.setItem("existingFrom", from);
							localStorage.setItem("existingRate", res.data.info.rate);
							localStorage.setItem("existingAcceptedTime",new Date().getTime());
							
						}
					}
					
				})
				.catch((err) => console.log("err", err));
		}else{
			//console.log('alternative without calling api');
			var rate = existingRate * input;
			console.log("final",rate);
			setOutput(rate);	
		}

	}, [from,to,cacheTime]);

	
	// Function to convert the currency
	// eslint-disable-next-line react-hooks/exhaustive-deps
	function convert() {
        timeCheck = (new Date().getTime()) - (localStorage.getItem("existingAcceptedTime"));
		if(timeCheck > expirationDuration){
			prevAcceptedExpired = true;
			setCacheTime(true);
			//console.log("timechnage call use effect for rate");
		
		}else{	
			var rate = info * input;
			//console.log("final",rate);
			setOutput(rate);
		}
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


