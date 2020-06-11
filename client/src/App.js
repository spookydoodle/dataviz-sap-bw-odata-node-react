import React, { Component } from 'react';
import './App.css';
import salesService from './services/salesService';
import dummyData from './constants/dummyData';
import Dashboard from './pages/Dashboard';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    salesService.get()
      .then(data => this.setState({ data: data }))
      .catch(err => this.setState({ data: dummyData }));
  }

  render() {
    const { data } = this.state;

    return <Dashboard data={data} />
  }
}

export default App;