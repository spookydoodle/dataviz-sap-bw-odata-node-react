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
        {data ? data.map((row, i) => <h1 key={i}>{row.country.text} - {row.division.text} - {row.month.text} -{row.sales.value}</h1>) : null}
      </React.Fragment>
    ) : (
        <React.Fragment>
          dataviz app
        </React.Fragment>
      )
  }
}

export default App;