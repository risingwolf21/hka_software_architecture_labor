import { AppBar, Box, Grid, Toolbar, Typography } from '@mui/material';
import logo from './logo.svg';
import { Map } from './Map';

const App = () => {
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
