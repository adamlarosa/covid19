import React, { Component } from 'react';
//import stateTable from './States'
import './App.css';

let renderCount = 1

class App extends Component {
	constructor() {
		super();
		this.state = {
			in: "waiting",
			dead: 0,
			sick: {},
			confirmed: 0,
			states : {},
			countries: {},
			slug: "us"
		}
	}
	componentDidMount() { 
		this.getData(this.state.slug);
	}

	renderLog = () => {
		console.log("render", renderCount)
		renderCount++;
	}


	processData = (results) => {
		let states = {};
		for (const result in results){
			const info = results[result];
			const state = info.Province
			const city = info.City
			if (Object.keys(states).includes(state)) {
				if (Object.keys(states[state]).includes(city)) {
					states[state][city].push({
						date: info.Date,
						cases: info.Cases
					})
				} else {
					states[state][city] = []
					states[state][city].push({
						date: info.Date,
						cases: info.Cases
					})
				}
			} else {
				states[state] = {}
				states[state][city] = []
				states[state][city].push({
					date: info.Date,
					cases: info.Cases
				})
			}
			
		}
		return states;
	}

	countCases = (states) => {
		let totalCases = 0;
		for (const state in states) {
			for (const city in states[state]) {
				const array_size = states[state][city].length - 1
				totalCases += states[state][city][array_size].cases
			}
		}
		return totalCases;
	}

	getData = (slug) => {
		// const { states } = this.state 
		this.setState({ in: "waiting" })
		const { countCases, processData } = this
	// Get List Of Cases Per Country Per Province By Case Type From The First 
	// Recorded Case With Live Count - status: confirmed, recovered, or deaths
		//fetch(`https://api.covid19api.com/live/country/${slug}/status/deaths`)
		fetch(`https://api.covid19api.com/dayone/country/${slug}/status/deaths/live`)
								// switch between "live" and "dayone"
			.then(resp => resp.json())
			.then(json => {
				if (json) {
					this.setState({ 
						in: "success",
						states: processData(json),
						dead:  countCases(processData(json))
					})
				} else {
					this.setState({ in: "failure" })
				}
			})
		fetch(`https://api.covid19api.com/dayone/country/${slug}/status/confirmed/live`)
			.then(resp => resp.json())
			.then(json => {
				this.setState({
					sick: processData(json),
					confirmed:  countCases(processData(json))
				})
			})
	// // root API
		fetch("https://api.covid19api.com/")
			.then(resp => resp.json())
			.then(json => {
				this.setState({ main: {...json} })
			})
		fetch("https://api.covid19api.com/countries")
	// list of countries and slugs
			.then(resp => resp.json())
			.then(json => {
				this.setState({ countries: {...json}})
			})
	}

	showDownload = () => {
		switch (this.state.in) {
			case "waiting" :
				return "waiting for data";
			case "success" :
				return "";
			case "failure":
				return "download failed";
			default :
				return "defaulting";
		}
	}

	selectCountry = (e) => {
		this.setState({slug: e.target.value})
	}
	formSubmit = (e) => {
		e.preventDefault();
		this.getData(this.state.slug)
	}
   
	topTest = (input) => {
		for (const state in input) {
			for (const city in input[state]) {
				const lastEntry = input[state][city].length - 1
				if (input[state][city][lastEntry].cases !== 0) {
					console.log (state, city, input[state][city][lastEntry].cases)
				}
			}
		}
	}

	bottomTest = () => {	
		console.log("App State: ", this.state)
	}

	render() {
		this.renderLog();
		return (
			<div className="App">
				<header className="App-header">
				{this.state.confirmed} Confirmed | COVID-19 | {this.state.dead} Fatalities
				</header>
				<main>

					<form>
						<select 
							value={this.state.slug} 
							onChange={(e) =>this.selectCountry(e)}
						>
							{Object.keys(this.state.countries).map((c,i) => {
								return (
									<option
										key={i}
										value={this.state.countries[c].Slug}
									>
										{this.state.countries[c].Country}
									</option>
								)
							})}	
						</select>
						<button
							onClick={(e) => this.formSubmit(e)}
							type="submit" 
							value="Submit" 
						>
							select
						</button>
					</form>

					<button onClick={() => this.topTest(this.state.states)}>
						- ? -
					</button>
					
					<br/>
					
					{this.showDownload()} 

					<div className="quote">
						...but if even ten or fifteen percent of the population decides<br/> 
						that what they're doing today is more important than the health<br/> 
						and welfare of the rest of Americans, they can spread the<br/> 
						virus in a very strong way because you know the level of contagion. 
					
						<br/><p/>
						<div id="author" className="quote">
							- Dr. Deborah Birx<br/>White House Coronavirus Response Coordinator, 
							3/19/20
						</div>
					</div>

					{/* <br/><p/> */}

					<button onClick={() => this.bottomTest()}>
						- ! -
					</button>
					
					<br/><p/>



					
					<br/><p/>

				</main>
			</div>
		);
	}
}
export default App;
