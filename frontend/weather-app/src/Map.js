import { Box } from "@mui/material"
import { useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";


export const Map = () => {

    const [selectedPlace, setSelectedPlace] = useState({ lat: 49.0226481, lon: 8.416547971872856, name: "MTV Karlsruhe" });

    return <div style={{ position: "relative", display: "flex", height: "100vh", widht: "100vh" }}>
        <MapContainer
            center={[selectedPlace.lat, selectedPlace.lon]}
            zoom={10}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[selectedPlace.lat, selectedPlace.lon]} />
        </MapContainer>
    </div>
}