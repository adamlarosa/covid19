import React, { Component } from 'react';
import './App.css';

class App extends Component {
	constructor() {
		super();
		this.state = {
			data: {},
			main: {},
			in: "waiting",
			dead: 0,
			states : {}
		}
	}
	componentDidMount() { 
		this.getData();
	}

	accessData = () => {
		const stateTable = {
			AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas",
			CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware",
			FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho",
			IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas",
			KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
			MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
			MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", 
			NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", 
			NM: "New Mexico", NY: "New York", NC: "North Carolina", 
			ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", 
			PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", 
			SD: "South Dakota",	TN: "Tennessee", TX: "Texas", UT: "Utah", 
			VT: "Vermont", VA: "Virginia", WA: "Washington", 
			WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming"	
		}

		const results = this.state.data
		let totalDeaths = 0
		
		const resultsSize = Object.keys(results).length
		let states = {}	

		for (let i=0; i < resultsSize; i++){
			// Province is split between state & county.
			if (results[i].Province.split(", ")[1]) {
				let state = results[i].Province.split(", ")[1]
				if (Object.keys(states).includes(stateTable[state])) {
					states[stateTable[state]].push({
						location: results[i].Province.split(", ")[0],
						date: results[i].Date,
						deaths: results[i].Cases
					})
				} else {
					states[stateTable[state]] = []
					states[stateTable[state]].push({
						location: results[i].Province.split(", ")[0],
						date: results[i].Date,
						deaths: results[i].Cases
					})
				}
			} else {
			// Only state name is specified.
				let state = results[i].Province
				if (Object.keys(states).includes(state)) {
					states[state].push({
						date: results[i].Date,
						deaths: results[i].Cases
					})
				} else {
					states[state] = []
					states[state].push({
						date: results[i].Date,
						deaths: results[i].Cases
					})
				}
			}
		}

		this.setState({
			states
		})

		for (const state in states) {
			const stateSize = states[state].length
			const theDead = states[state][stateSize - 1].deaths
			const theTime = states[state][stateSize - 1].date

			totalDeaths = totalDeaths + theDead
			console.log(state, ":", theDead, theTime)
		}
		this.setState({dead: totalDeaths})
		console.log("Total Deaths: ", totalDeaths)
debugger
	} // end of accessData()

	getData = () => {
	// Get List Of Cases Per Country Per Province By Case Type From The First 
	// Recorded Case - status must be confirmed, recovered, or deaths
		fetch("https://api.covid19api.com/dayone/country/us/status/deaths")
		.then(resp => resp.json())
		.then(json => {
			if (json) {
				this.setState({ data: {...json}, in: "success" })
			} else {
				this.setState({in: "failure"})
			}
		})
	//root API
		fetch("https://api.covid19api.com/")
			.then(resp => resp.json())
			.then(json => {
				this.setState({ main: {...json} })
			})
	}

	showDownload = () => {
		switch (this.state.in) {
			case "waiting" :
				return "waiting for data";
			case "success" :
				return "download complete";
			case "failure":
				return "download failed";
			default :
				return "defaulting";
		}
	}

	showState = () => {
		console.log(this.state)
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					COVID-19 | {this.state.dead} American Fatalities
				</header>
				<main>
					<button onClick={() => this.accessData()}>
						- ? -
					</button>
					
					<br/>
					
					{this.showDownload()} 
					
					<br/><p/>

					...but if even ten or fifteen percent of the population decides<br/> 
					that what they're doing today is more important than the health<br/> 
					and welfare of the rest of Americans, they can spread the<br/> 
					virus in a very strong way because you know the level of contagion. 
					<br/><p/>
					- Dr. Deborah Birx<br/>White House Coronavirus Response Coordinator, 
					3/19/20
					<br/><p/>
					<button onClick={() => this.showState()}>
						- ! -
					</button>
				</main>
			</div>
		);
	}
}
export default App;
