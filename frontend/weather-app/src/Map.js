import { AppBar, Avatar, Box, Grid, List, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, Paper, Toolbar } from "@mui/material"
import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { useSelector } from "react-redux";
import { Search, SearchIconWrapper, StyledInputBase } from "./SearchBar";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { WeatherInformation } from "./WeatherInformation";

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


export const Map = () => {

    const [searchString, setSearchString] = useState("");
    const [selectedPos, setSelectedPos] = useState([49.0226481, 8.416547971872856]);
    const navigate = useNavigate();

    const [selectedStation, setSelectedStation] = useState({ lat: null, lon: null });

    const keyPress = (e) => {
        if (e.keyCode === 13) {

        }
    }

    return <Grid>
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
                navigate("/station", { state: { lat, lon } })
            }} />
        </MapContainer>
    </Grid>
}