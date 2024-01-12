import { AppBar, CardContent, Button, Grid, Card, CardActions, CardHeader, ListItem, ListItemAvatar, ListItemText, Typography, IconButton, ListItemSecondaryAction, Toolbar, List, ListItemButton } from "@mui/material"
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useSelector } from "react-redux";
import { Search, SearchIconWrapper, StyledInputBase } from "./SearchBar";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { WeatherInformation, windDirectionAsText } from "./WeatherInformation";
import { Place, Remove, Star, StarOutline, StartOutlined, Thermostat } from "@mui/icons-material";

const MapEvents = ({ selectPosition, position }) => {

    const map = useMap();

    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            if (!(position?.lat && position?.lon)) {
                selectPosition(e.latlng.lat, e.latlng.lng);
                map.flyTo(e.latlng, map.getZoom());
            }
        });
    }, [map]);

    useMapEvents({
        click(e) {
            selectPosition(e.latlng.lat, e.latlng.lng);
        },
    });

    return (position?.lat && position?.lon) ? <Marker position={[position.lat, position.lon]} /> : null
}

const FavoriteList = ({ favorites, removeFavorite, selectFavorite }) => {

    return <Card sx={{ width: "300px", mt: 2 }}>
        <CardHeader title={"Favoriten"} />
        <List sx={{ overflowY: "scroll", overflow: "hidden", height: "100%" }}>
            {
                favorites.map(x => <ListItemButton dense onClick={() => selectFavorite(x.lat, x.lon)}>
                    <ListItemAvatar>
                        <Place />
                    </ListItemAvatar>
                    <ListItemText primary={x.name} secondary={x.lat + ", " + x.lon} />
                    <ListItemSecondaryAction>
                        <IconButton onClick={() => removeFavorite(x)}>
                            <Remove />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItemButton>)
            }
        </List>
    </Card>
}

const CurrentWeatherInformation = ({ lat, lon, toggleFavorite, isFavorite }) => {

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

    return <Card sx={{ width: "300px" }}>
        <CardHeader title={data ? data.name : "Keine Daten vorhanden"} action={
            <IconButton aria-label="settings" onClick={() => data ? toggleFavorite({ name: data.name, lat: lat, lon: lon }) : null}>
                {
                    data && isFavorite(lat, lon, data.name) ? <Star /> : <StarOutline />
                }
            </IconButton>
        } />
        <ListItem dense>
            <ListItemAvatar>
                {
                    data && <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} width={"40px"} height={"40px"} />
                }
            </ListItemAvatar>
            <ListItemText primary={data ? data.weather[0].description : "Keine Daten vorhanden"} />
        </ListItem>
        <ListItem dense>
            <ListItemAvatar>
                <Thermostat />
            </ListItemAvatar>
            <ListItemText primary={data ? data.main.temp + " °C" : "Keine Daten vorhanden"} secondary={"Tatsächliche Temperatur"} />
        </ListItem>
        <ListItem dense>
            <ListItemAvatar>
                <Thermostat />
            </ListItemAvatar>
            <ListItemText primary={data ? data.main.feels_like + " °C" : "Keine Daten vorhanden"} secondary={"Gefühlte Temperatur"} />
        </ListItem>
        <ListItem dense>
            <ListItemAvatar>
            </ListItemAvatar>
            <ListItemText primary={data ? data.main.humidity + " %" : "Keine Daten vorhanden"} secondary={"Luftfeuchtigkeit"} />
        </ListItem>

        <ListItem dense>
            <ListItemAvatar>
                <Typography>{data ? windDirectionAsText(data.wind.deg) : "??"}</Typography>
            </ListItemAvatar>
            <ListItemText primary={data ? data.wind.speed + " m/s" : "Kein Daten vorhanden"} secondary={"Windgeschwindigkeit"} />
        </ListItem>
        <CardContent>

        </CardContent>

        <CardActions>
            <Button variant="contained" onClick={() => data ? navigate("/station", { state: { lat, lon } }) : null}>Mehr Informationen</Button>
        </CardActions>

    </Card>
}


export const Map = () => {

    const [searchString, setSearchString] = useState("");
    const [selectedPos, setSelectedPos] = useState([49.0226481, 8.416547971872856]);
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState(localStorage.getItem("favorites")?.split(";").map(x => JSON.parse(x)) ?? []);


    const [selectedStation, setSelectedStation] = useState({ lat: null, lon: null });

    const keyPress = (e) => {
        if (e.keyCode === 13) {

        }
    }

    const toggleFavorite = (item) => {
        if (favorites.some(x => x.lat === item.lat && x.lon === item.lon && item.name === x.name)) {
            setFavorites(favorites.filter(x => !(x.lat === item.lat && x.lon === item.lon && item.name === x.name)))
        } else {
            setFavorites([...favorites, item])
        }
        localStorage.setItem("favorites", favorites.map(x => JSON.stringify(x)).join(";"));
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
            <MapEvents position={selectedStation} selectPosition={(lat, lon) => {
                //navigate("/station", { state: { lat, lon } })
                setSelectedStation({ lat, lon });
            }} />
        </MapContainer>
        <Grid sx={{ position: "absolute", right: 0, top: "64px", bottom: 0, width: "300px", m: 2, zIndex: 9999, overflow: "hidden" }}>
            <CurrentWeatherInformation lat={selectedStation.lat} lon={selectedStation.lon} toggleFavorite={toggleFavorite} isFavorite={(lat, lon, name) => favorites.some(x => x.lat === lat && x.lon === lon && name === x.name)} />
            <FavoriteList favorites={favorites} removeFavorite={toggleFavorite} selectFavorite={(lat, lon) => setSelectedStation({ lat, lon })} />
        </Grid>

    </Grid>
}