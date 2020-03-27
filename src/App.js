import React, { Component } from 'react';
import stateTable from './States'
import './App.css';

class App extends Component {
	constructor() {
		super();
		this.state = {
			main: {},
			in: "waiting",
			dead: 0,
			states : {},
			countries: {},
			slug: ""
		}
	}
	componentDidMount() { 
		this.getData();
	}

	processData = (initialObject) => {
		const resultsSize = Object.keys(initialObject).length;
		let states = {};

		for (let i=0; i < resultsSize; i++){
			if (initialObject[i].Province.split(", ")[1]) {
			// Province is split between state & county.
				let state = initialObject[i].Province.split(", ")[1]
				if (Object.keys(states).includes(stateTable[state])) {
					states[stateTable[state]].push({
						location: initialObject[i].Province.split(", ")[0],
						date: initialObject[i].Date,
						deaths: initialObject[i].Cases
					})
				} else {
					states[stateTable[state]] = []
					states[stateTable[state]].push({
						location: initialObject[i].Province.split(", ")[0],
						date: initialObject[i].Date,
						deaths: initialObject[i].Cases
					})
				}
			} else {
			// Only state name is specified.
				let state = initialObject[i].Province
				if (Object.keys(states).includes(state)) {
					states[state].push({
						date: initialObject[i].Date,
						deaths: initialObject[i].Cases
					})
				} else {
					states[state] = []
					states[state].push({
						date: initialObject[i].Date,
						deaths: initialObject[i].Cases
					})
				}
			}
		}
		return states;
	}

	countTheDead = (states) => {
		let totalDeaths = 0;
		for (const state in states) {
			const stateSize = states[state].length
			const theDead = states[state][stateSize - 1].deaths
			totalDeaths += theDead
		}
		return totalDeaths;
	}

	getData = () => {
		const { countTheDead, processData } = this
	// Get List Of Cases Per Country Per Province By Case Type From The First 
	// Recorded Case With Live Count - status: confirmed, recovered, or deaths
		fetch("https://api.covid19api.com/live/country/us/status/deaths")
								// switch between "live" and "dayone"
			.then(resp => resp.json())
			.then(json => {
				if (json) {
					this.setState({ 
						in: "success",
						states: processData(json),
						dead:  countTheDead(processData(json))
					})
				} else {
					this.setState({ in: "failure" })
				}
			})
	// root API
		fetch("https://api.covid19api.com/")
			.then(resp => resp.json())
			.then(json => {
				this.setState({ main: {...json} })
			})
	// list of countries and slugs
		fetch("https://api.covid19api.com/countries")
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
				return "download complete";
			case "failure":
				return "download failed";
			default :
				return "defaulting";
		}
	}

	formSubmit = (e) => {
		e.preventDefault();
		console.log(this.state.slug)
	}
	selectSlug = (e) => {
		this.setState({ slug: e.target.value})
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
					COVID-19 | {this.state.dead} American Fatalities
				</header>
				<main>
					<button onClick={() => this.topTest()}>
						- ? -
					</button>
					
					<br/>
					
					{this.showDownload()} 
					
					<br/><p/>

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

					<br/><p/>

					<button onClick={() => this.bottomTest()}>
						- ! -
					</button>
					
					<br/><p/>


					<form>
						<label>
							<select 
								value={this.state.value} 
								onChange={(e) =>this.selectSlug(e)}
							>
								{Object.keys(this.state.countries).map((c,i) => {
									return <option key={i}
										value={this.state.countries[c].Slug}
									>
										{this.state.countries[c].Country}
									</option>
								})}	
							</select>
						</label>
						<button
							onClick={(e) => this.formSubmit(e)}
							type="submit" 
							value="Submit" 
						>
							select
						</button>
					</form>
					
					<br/><p/>

				</main>
			</div>
		);
	}
}
export default App;
