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

  return <Grid
    container
    width="100%"
    direction="column"
    alignItems="center"
    justifyContent="center">
    <Box sx={{ m: 0, p: 0, width: "100%" }}>
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
