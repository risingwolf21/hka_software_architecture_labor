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
        fetch("https://localhost:5000/bund/v30/stationOverviewExtended?stationIds=" + id, {
            method: "GET",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            }
        })
            .then(res => res.json())
            .then(data => {
                setData(data);
            });
      try {
            // cb5422e7b5f85385d76e7b4b2d569a54

            // curl - X 'GET' \
            // 'https://dwd.api.proxy.bund.dev/v30/stationOverviewExtended?stationIds=10865,G005' \
            // -H 'accept: application/json'
            fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=cb5422e7b5f85385d76e7b4b2d569a54`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(res => res.json())
                .then(data => {
                    setData(data);
                })
                .catch(e => {
                    console.log(e)
                });
        } catch (e) {
            console.error(e)
        }
    }, [id]);


    return <Grid>
        {JSON.stringify(data)}
    </Grid>
}