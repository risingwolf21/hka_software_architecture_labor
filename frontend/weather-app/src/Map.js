import { AppBar, Avatar, Box, Grid, List, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, Paper, Toolbar } from "@mui/material"
import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { useSelector } from "react-redux";
import { Search, SearchIconWrapper, StyledInputBase } from "./SearchBar";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const MapEvents = ({ stations, handleShownStations }) => {

    const [positions, setPositions] = useState();

    const distance = (a1, a2, b1, b2) => {
        return Math.sqrt(Math.pow(b1 - a1, 2) + Math.pow(b2 - a2, 2))
    }

    const findNearestStation = (lat, lng) => {
        console.log(stations[0])
        let stationWithDistance = stations.map(x => { return { ...x, distance: distance(lat, lng, x.BR_HIGH, x.LA_HIGH) } });
        stationWithDistance.sort((a, b) => a.distance - b.distance);
        setPositions(stationWithDistance.slice(0, 10));
        handleShownStations(stationWithDistance.slice(0, 10))
    }

    useMapEvents({
        click(e) {
            findNearestStation(e.latlng.lat, e.latlng.lng);
        },
    });
    return positions && positions.map(x => <Marker position={[x.BR_HIGH, x.LA_HIGH]}
        eventHandlers={{
            click: (e) => {
                console.log('marker clicked', e)
            },
        }} />)
}

const AllStations = ({ stations }) => {

    return stations && stations.filter(x => x.ENDE === "").slice(0, 1000).map(x => <Marker position={[x.BR_HIGH, x.LA_HIGH]} />)
}

export const Map = () => {

    const navigate = useNavigate();
    const [searchString, setSearchString] = useState("");
    const [selectedPos, setSelectedPos] = useState([49.0226481, 8.416547971872856]);
    const [selectedStations, setSelectedStations] = useState([]);
    const { stations } = useSelector(state => state.application);

    const keyPress = (e) => {
        if (e.keyCode === 13) {

        }
    }

    return <Grid>
        <AppBar position="sticky">
            <Toolbar>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        onKeyDown={keyPress}
                        placeholder="Search…"
                        onChange={(e) => setSearchString(e.target.value)}
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </Search>
            </Toolbar>
        </AppBar>
        <MapContainer
            style={{ width: "100vw", height: "95vh" }}
            center={selectedPos}
            zoom={10}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapEvents stations={stations} handleShownStations={setSelectedStations} />
        </MapContainer>

        <Paper sx={{
            position: "absolute",
            left: 0,
            top: 64,
            bottom: 0,
            m: 2,
            width: "250px",
            zIndex: 9999
        }}>
            <List sx={{ overflow: "auto" }}>
                {
                    selectedStations && selectedStations.map(x => <ListItem onClick={() =>
                        navigate("/station", { state: { id: x.STAT_ID, lat: x.BR_HIGH, lon: x.LA_HIGH } })}>
                        <ListItemAvatar>
                            <Avatar>
                                {x.BL}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={x.STAT_NAME} secondary={x.BR_HIGH + ", " + x.LA_HIGH} />
                    </ListItem>)
                }
            </List>
        </Paper>
    </Grid>
}