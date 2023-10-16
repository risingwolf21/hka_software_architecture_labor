import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";

export const WeatherInformation = () => {

    const { id } = useParams();
    const [data, setData] = useState({});

    useEffect(() => {
        if (!id)
            return;
        fetch("https://dwd.api.proxy.bund.dev/v30/stationOverviewExtended?stationIds=" + id, {
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
    }, [id]);


    return <Grid>
        {JSON.stringify(data)}
    </Grid>
}