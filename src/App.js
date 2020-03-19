import React, { Component } from 'react';
import './App.css';

class App extends Component {
	constructor() {
		super();
		this.state = {
			data: {},
			main: {},
			in: "waiting"
		}
	}
	componentDidMount() { this.getData(); }

	getData = () => {
	// Get List Of Cases Per Country Per Province By Case Type From The First Recorded Case
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

	render() {
		return (
			<div className="App">
				<header className="App-header">
					COVID-19
				</header>
				<main>
					{this.showDownload()}
				</main>
			</div>
		);
	}
}
export default App;
