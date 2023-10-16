import { AppBar, Box, Grid, Toolbar, Typography } from '@mui/material';
import logo from './logo.svg';
import { Map } from './Map';
import { useEffect } from 'react';
import raw from './stations/stations.txt';
import { useDispatch } from 'react-redux';
import { onStationsChanged } from './redux/applicationSlice';

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    fetch(raw)
      .then(r => r.text())
      .then(data => {
        const lines = data.split('\n');

        // Extract the header from the first line
        const headers = lines[0].split(/\s+/);

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

        const jsonData = JSON.stringify(stationData, null, 2);

        // Print the JSON data
        console.log(jsonData);
        dispatch(onStationsChanged(stationData))
      });
  })

  return <Grid
    container
    width="100%"
    direction="column"
    alignItems="center"
    justifyContent="center">
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Wetter App
        </Typography>
      </Toolbar>
    </AppBar>
    <Box sx={{ m: 0, p: 0 }}>
      <Map />
    </Box>
  </Grid>
}

export default App;
