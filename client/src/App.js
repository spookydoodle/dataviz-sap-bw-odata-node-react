import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import salesService from './services/salesService';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    salesService.get().then(data => this.setState({ data: data }));
  }

  render() {
    const { data } = this.state;

    return data ? (
      <React.Fragment>
        {data.map(row => <h1>{row.country.text} - {row.sales.value}</h1>)}
      </React.Fragment>
    ) : (
        <React.Fragment>
          dataviz app
        </React.Fragment>
      )
  }
}

export default App;