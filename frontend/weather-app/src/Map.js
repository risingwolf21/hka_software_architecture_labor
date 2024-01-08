import { AppBar, CardContent, Button, Grid, Card, CardActions, CardHeader, ListItem, ListItemAvatar, ListItemText, Typography, MenuItem, Paper, Toolbar } from "@mui/material"
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { useSelector } from "react-redux";
import { Search, SearchIconWrapper, StyledInputBase } from "./SearchBar";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { WeatherInformation, windDirectionAsText } from "./WeatherInformation";
import { Thermostat } from "@mui/icons-material";

const MapEvents = ({ selectPosition }) => {

    const [pos, setPos] = useState(null);

    useMapEvents({
        click(e) {
            setPos({ lat: e.latlng.lat, lon: e.latlng.lng })
            selectPosition(e.latlng.lat, e.latlng.lng);
        },
    });

    return pos ? <Marker position={[pos.lat, pos.lon]} /> : null
}

const CurrentWeatherInformation = ({ lat, lon }) => {

    const [data, setData] = useState();
    const navigate = useNavigate();

    async function loadData(lat, lon) {
        if (!lat || !lon)
            return;
        var dailyResponse = await fetch(`http://localhost:5000/openweather/data/2.5/weather?lat=${lat}&lon=${lon}&appid=cb5422e7b5f85385d76e7b4b2d569a54&lang=DE&units=metric&cnt=16`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
        if (dailyResponse.ok) {
            var dailyData = await dailyResponse.json();
            setData(dailyData);
        }
    }

    useEffect(() => {
        loadData(lat, lon);
    }, [lat, lon]);

    if (!data)
        return;

    return <Grid sx={{ position: "absolute", right: 0, top: "64px", width: "300px", m: 2, zIndex: 9999 }}>
        <Card sx={{ width: "300px" }}>
            <CardHeader title={data.name} />
            <ListItem dense>
                <ListItemAvatar>
                    <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} width={"40px"} height={"40px"} />
                </ListItemAvatar>
                <ListItemText primary={data.weather[0].description} />
            </ListItem>
            <ListItem dense>
                <ListItemAvatar>
                    <Thermostat />
                </ListItemAvatar>
                <ListItemText primary={data.main.temp + " °C"} secondary={"Tatsächliche Temperatur"} />
            </ListItem>
            <ListItem dense>
                <ListItemAvatar>
                    <Thermostat />
                </ListItemAvatar>
                <ListItemText primary={data.main.feels_like + " °C"} secondary={"Gefühlte Temperatur"} />
            </ListItem>
            <ListItem dense>
                <ListItemAvatar>
                </ListItemAvatar>
                <ListItemText primary={data.main.humidity + " %"} secondary={"Luftfeuchtigkeit"} />
            </ListItem>

            <ListItem dense>
                <ListItemAvatar>
                    <Typography>{windDirectionAsText(data.wind.deg)}</Typography>
                </ListItemAvatar>
                <ListItemText primary={data.wind.speed + " m/s"} secondary={"Windgeschwindigkeit"} />
            </ListItem>
            <CardContent>

            </CardContent>

            <CardActions>
                <Button variant="contained" onClick={() => navigate("/station", { state: { lat, lon } })}>Mehr Informationen</Button>
            </CardActions>

        </Card>
    </Grid>
}


export const Map = () => {

    const [searchString, setSearchString] = useState("");
    const [selectedPos, setSelectedPos] = useState([49.0226481, 8.416547971872856]);
    const navigate = useNavigate();

    const [selectedStation, setSelectedStation] = useState({ lat: null, lon: null });

    const keyPress = (e) => {
        if (e.keyCode === 13) {

        }
    }

    return <Grid sx={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
        <AppBar position="sticky">
            <Toolbar>
                {/* <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        onKeyDown={keyPress}
                        placeholder="Search…"
                        onChange={(e) => setSearchString(e.target.value)}
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </Search> */}
            </Toolbar>
        </AppBar>
        <MapContainer
            style={{ width: "100vw", height: "95vh" }}
            center={selectedPos}
            zoom={10}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapEvents selectPosition={(lat, lon) => {
                //navigate("/station", { state: { lat, lon } })
                setSelectedStation({ lat, lon });
            }} />
        </MapContainer>
        <CurrentWeatherInformation lat={selectedStation.lat} lon={selectedStation.lon} />

    </Grid>
}