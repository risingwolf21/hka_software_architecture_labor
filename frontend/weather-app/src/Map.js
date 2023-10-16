import { Box, Grid, List, ListItem, ListItemText } from "@mui/material"
import { Icon } from "leaflet";
import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { useSelector } from "react-redux";


const LocationMarker = () => {
    const [position, setPosition] = useState({ latitude: 0, longitude: 0 })

    const map = useMapEvents({
        click() {
            map.locate()
        },
        locationfound(e) {
            const { lat, lng } = e.latlng;
            console.log(e.latlng)
            setPosition({
                latitude: lat,
                longitude: lng,
            })
            map.flyTo(e.latlng, map.getZoom())
        },
    });

    return (
        position.latitude !== 0 ?
            <Marker
                position={[position.latitude, position.longitude]}
                interactive={false} />
            : null
    )
}

const MapEvents = ({ stations, handleShownStations }) => {

    const [positions, setPositions] = useState();

    const distance = (a1, a2, b1, b2) => {
        return Math.sqrt(Math.pow(b1 - a1, 2) + Math.pow(b2 - a2, 2))
    }

    const findNearestStation = (lat, lng) => {
        let stationWithDistance = stations.map(x => { return { ...x, distance: distance(lat, lng, x.geoBreite, x.geoLaenge) } });
        stationWithDistance.sort((a, b) => a.distance - b.distance);
        setPositions(stationWithDistance.slice(0, 10));
        handleShownStations(stationWithDistance.slice(0, 10))
    }

    useMapEvents({
        click(e) {
            findNearestStation(e.latlng.lat, e.latlng.lng);
        },
    });
    return positions && positions.map(x => <Marker position={[x.geoBreite, x.geoLaenge]}
        eventHandlers={{
            click: (e) => {
                console.log('marker clicked', e)
            },
        }} />)
}

export const Map = () => {

    const [selectedPos, setSelectedPos] = useState([49.0226481, 8.416547971872856]);
    const [selectedStations, setSelectedStations] = useState([]);
    const { stations } = useSelector(state => state.application);

    return <Grid>
        <MapContainer
            style={{ width: "100vw", height: "95vh" }}
            center={selectedPos}
            zoom={10}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapEvents stations={stations} handleShownStations={(x) => setSelectedStations(x)} />
        </MapContainer>

        <List sx={{ position: "absolute", left: 0, top: 56, bottom: 0, width: "20%" }}>
            {
                selectedStations && selectedStations.map((x, index) => <ListItem key={index}>
                    <ListItemText primary={x.Stationsname} secondary={x.geoBreite + ", " + x.geoLaenge} />
                </ListItem>)
            }
        </List>
    </Grid>
}