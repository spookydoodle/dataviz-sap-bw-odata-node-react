import React, { Component } from 'react';
import './App.css';
import salesService from './services/salesService';
import Dashboard from './pages/Dashboard';
import dummyData from './constants/dummyData';
import { State, Mode } from './logic/types';

class App extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: null,
      whoamiRequestDone: false,
      mode: "light",
      data: undefined,
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