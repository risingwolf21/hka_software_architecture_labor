import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";

export const WeatherInformation = () => {

    const { state } = useLocation();
    const { id, lat, lon } = state;
    const [data, setData] = useState({});

    console.log(id, lat, lon)

    useEffect(() => {
        if (!id)
            return;
        fetch("http://localhost:5000/bund/v30/stationOverviewExtended?stationIds=" + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            }
        })
            .then(resp => {
                console.log(resp)
                if (!resp.ok) {
                    throw `Server error: [${JSON.stringify(resp)}] [${resp.statusText}] [${resp.url}]`;
                }
                return resp.json()
            })
            .then(data => {
                setData(data);
                console.log(data)
            })
            .catch(err => console.error(err));
        fetch(`http://localhost:5000/openweather/data/2.5/weather?lat=${lat}&lon=${lon}&appid=cb5422e7b5f85385d76e7b4b2d569a54`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
            .then(resp => {
                if (!resp.ok) {
                    throw `Server error: [${JSON.stringify(resp)}] [${resp.statusText}] [${resp.url}]`;
                }
                return resp.json()
            })
            .then(data => {
                setData(data);
                console.log(data);
            })
            .catch(err => console.error(err));
    }, [id]);


    return <Grid>
        {JSON.stringify(data)}
    </Grid>
}