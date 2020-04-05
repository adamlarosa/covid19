import React, { Component } from 'react';
import stateTable from './States'
import './App.css';

class App extends Component {
	constructor() {
		super();
		this.state = {
			in: "waiting",
			dead: 0,
			confirmed: 0,
			states : {},
			countries: {},
			slug: "us"
		}
	}
	componentDidMount() { 
		this.getData(this.state.slug);
	}

	processData = (results) => {

		let states = {};
		for (const result in results){
			const info = results[result];
			if (info.Province.split(", ")[1]) {
			// Province is split between state & county.
				let state = info.Province.split(", ")[1]
				if (Object.keys(states).includes(stateTable[state])) {
					states[stateTable[state]].push({
						location: info.Province.split(", ")[0],
						date: info.Date,
						deaths: info.Cases
					})
				} else {
					states[stateTable[state]] = []
					states[stateTable[state]].push({
						location: info.Province.split(", ")[0],
						date: info.Date,
						deaths: info.Cases
					})
				}
			} else {
			// Only state name is specified.
				let state = info.Province
				if (Object.keys(states).includes(state)) {
					states[state].push({
						date: info.Date,
						deaths: info.Deaths
					})
				} else {
					states[state] = []
					states[state].push({
						date: info.Date,
						deaths: info.Deaths
					})
				}
			}
		}
		return states;
	}

	countCases = (states) => {
		let totalCases = 0;
		for (const state in states) {
			const stateSize = states[state].length
			const cases = states[state][stateSize - 1].deaths
			totalCases += cases
		}
		return totalCases;
	}

	getData = (slug) => {
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
		fetch(`https://api.covid19api.com/live/country/${slug}/status/confirmed`)
			.then(resp => resp.json())
			.then(json => {
				this.setState({
					confirmed:  countCases(processData(json))
				})
			})
	// // root API
	// 	fetch("https://api.covid19api.com/")
	// 		.then(resp => resp.json())
	// 		.then(json => {
	// 			this.setState({ main: {...json} })
	// 		})
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
   
	topTest = () => {
		console.log("App State: ", this.state)
	}

	bottomTest = () => {	
		console.log("States Data: ", this.state.states)
	}

	render() {
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
										{this.state.countries[c].Country === "US" ?
											"United States"
										:
											this.state.countries[c].Country
										}
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

					<button onClick={() => this.topTest()}>
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
