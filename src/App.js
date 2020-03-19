import React, { Component } from 'react';
import './App.css';

class App extends Component {
	constructor() {
		super();
		this.state = {
			main: {},
			in: "waiting"
		}
	}
	componentDidMount() { this.getData(); }

	getData = () => {
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
