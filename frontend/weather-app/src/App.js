import { AppBar, Box, Grid, Toolbar, Typography } from '@mui/material';
import logo from './logo.svg';
import { Map } from './Map';
import { useEffect } from 'react';
import raw from './stations/stations.txt';
import { useDispatch } from 'react-redux';
import { onStationsChanged } from './redux/applicationSlice';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { WeatherInformation } from './WeatherInformation';

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    fetch(raw)
      .then(r => r.text())
      .then(data => {
        const lines = data.split('\n');

        // Extract the header from the first line
        const headers = lines[1].split(/\s+/);

        // Initialize an array to store station data
        const stationData = [];

        // Iterate over the remaining lines and parse the data
        for (let i = 2; i < lines.length; i++) {
          const line = lines[i];
          const values = line.split(/\s+/);
          const station = {};

          // Populate the station object with values using the header as keys
          for (let j = 0; j < headers.length; j++) {
            station[headers[j]] = values[j];
          }

          stationData.push(station);
        }

        const jsonData = JSON.stringify(stationData.slice(1), null, 2);

        // Print the JSON data
        dispatch(onStationsChanged(jsonData))
      });
  })

  return <Grid
    container
    width="100%"
    direction="column"
    alignItems="center"
    justifyContent="center">
    <Box sx={{ m: 0, p: 0 }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate replace to={"/map"} />} />
          <Route path="/map" element={<Map />} />
          <Route path="/station" element={<WeatherInformation />} />
        </Routes>
      </BrowserRouter>
    </Box>
  </Grid>
}

export default App;
