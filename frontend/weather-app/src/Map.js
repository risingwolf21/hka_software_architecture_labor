import { Box } from "@mui/material"
import { useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";


export const Map = () => {

    const [selectedPlace, setSelectedPlace] = useState({ lat: 49.0226481, lon: 8.416547971872856, name: "MTV Karlsruhe" });

    return <MapContainer
        style={{ width: "100vw", height: "100vh" }}
        center={[selectedPlace.lat, selectedPlace.lon]}
        zoom={10}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[selectedPlace.lat, selectedPlace.lon]} />
    </MapContainer>
}