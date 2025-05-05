import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './Pages/MainPage';
import CreateChartPage from './Pages/CreateChartPage';
import ViewInteractiveMapPage from './Pages/ViewInteractiveMap';
import ExportDataPage from './Pages/ExportDataPage';
import ViewStatisticsPage from './Pages/ViewStatisticsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/create" element={<CreateChartPage/>} />
        <Route path="/map" element={<ViewInteractiveMapPage/>}/>
        <Route path="/export" element={<ExportDataPage/>}/>
        <Route path="/stats" element={<ViewStatisticsPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
