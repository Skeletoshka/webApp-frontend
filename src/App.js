import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Client from './Client';
import Post from "./Post"
import moment from 'moment';
import 'moment/locale/ru';

document.documentElement.lang = 'ru';
moment.locale('ru');

class App extends Component {
  render() {
    return (
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/client' element={<Client />} />
            <Route path='/post' element={<Post />} />
          </Routes>
        </BrowserRouter>
    )
  }
}

export default App;