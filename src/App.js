import React, { Component } from 'react';
import './App.css';

class App extends Component {
	constructor() {
		super();
		this.state = {
			data: {}
		}
	}
	componentDidMount() { this.getData(); }

	getData = () => {
	//root API
		fetch("https://api.covid19api.com/")
			.then(resp => resp.json())
			.then(json => {
				this.setState({ data: {...json} })
			})
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					COVID-19
				</header>
				<main>

				</main>
			</div>
		);
	}
}
export default App;
