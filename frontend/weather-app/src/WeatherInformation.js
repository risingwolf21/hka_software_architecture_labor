import React, { useEffect, useState } from "react";
import { AppBar, Card, CardContent, CardHeader, CardMedia, CircularProgress, Box, Grid, IconButton, LinearProgress, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Table, TableBody, TableCell, TableHead, TableRow, Toolbar, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "moment/locale/de";
import { format } from "date-fns";
import { North, South, SouthEast, East, West, NorthWest, NorthEast, SouthWest } from '@mui/icons-material';
import moment from 'moment';
moment.locale("de");


export const windDirectionAsText = (d) => {
    let directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

    d += 22.5;

    if (d < 0)
        d = 360 - Math.abs(d) % 360;
    else
        d = d % 360;

    let w = parseInt(d / 45);
    return `${directions[w]}`;
}

export const WeatherInformation = () => {

    const { state } = useLocation();
    const navigate = useNavigate();
    const { lat, lon } = state;
    const [data, setData] = useState();
    const [dailyData, setDailyData] = useState();
    const [hourlyData, setHourlyData] = useState();
    const [loading, setLoading] = useState(false);

    async function loadData(lat, lon) {
        setLoading(true);
        var response = await fetch(`http://localhost:5000/openweather/data/2.5/weather?lat=${lat}&lon=${lon}&appid=cb5422e7b5f85385d76e7b4b2d569a54&lang=DE&units=metric`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
        if (response.ok) {
            var data = await response.json();
            setData(data);
        }

        var dailyResponse = await fetch(`http://localhost:5000/openweather/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&appid=cb5422e7b5f85385d76e7b4b2d569a54&lang=DE&units=metric&cnt=16`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
        if (dailyResponse.ok) {
            var dailyData = await dailyResponse.json();
            setDailyData(dailyData);
        }

        var hourlyResponse = await fetch(`http://localhost:5000/openweatherpro/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=cb5422e7b5f85385d76e7b4b2d569a54&lang=DE&units=metric`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
        if (hourlyResponse.ok) {
            var hourlyData = await hourlyResponse.json();
            setHourlyData(hourlyData);
            console.log(hourlyData)
        }
        setLoading(false);
    }

    useEffect(() => {
        if (!lon || !lat)
            return;

        loadData(lat, lon);


    }, [lat, lon]);

    function windDirectionIcon(d) {
        let directions = [<North />, <NorthEast />, <East />, <SouthEast />, <South />, <SouthWest />, <West />, <NorthWest />];

        d += 22.5;

        if (d < 0)
            d = 360 - Math.abs(d) % 360;
        else
            d = d % 360;

        let w = parseInt(d / 45);
        return `${directions[w]}`;
    }


    return <Grid sx={{ width: "100%" }}>
        <AppBar position="sticky">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => navigate(-1)}
                >
                    <ArrowBackIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
        {
            loading && <LinearProgress sx={{ position: "absolute", left: 0, right: 0, top: "64px" }} />
        }
        {
            data && <Grid sx={{ display: "flex", flexDirection: "row", width: "100%" }}>

                <Grid sx={{ width: "50%", p: 2 }}>
                    <Card elevation={4} sx={{ mt: 2 }}>
                        <CardHeader title={data.name} />

                        <CardMedia>
                            <MapContainer
                                style={{ width: "100%", height: "400px" }}
                                center={[lat, lon]}
                                dragging={false}
                                touchZoom={false}
                                scrollWheelZoom={false}
                                boxZoom={false}
                                keyboard={false}
                                doubleClickZoom={false}
                                zoomControl={false}
                                zoom={10}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[lat, lon]} />
                            </MapContainer>
                        </CardMedia>
                    </Card>
                    <Card elevation={4} sx={{ mt: 2 }}>
                        <CardHeader title={"Aktuelles Wetter"} subheader={data.weather[0].description} />
                        <CardContent>
                            <Grid container sx={{ overflowX: "auto" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell align="left">Temperatur</TableCell>
                                            <TableCell align="left">Maximal heute</TableCell>
                                            <TableCell align="left">Minimal heute</TableCell>
                                            <TableCell align="left">Gefühlte Temperatur</TableCell>
                                            <TableCell align="left">Luftdruck</TableCell>
                                            <TableCell align="left">Luftfeuchtigkeit</TableCell>
                                            <TableCell align="left">Wind</TableCell>
                                            <TableCell align="left">Sonnenaufgang</TableCell>
                                            <TableCell align="left">Sonnenuntergang</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            data && <>
                                                <TableCell align="left">
                                                    <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} width={"40px"} height={"40px"} />
                                                </TableCell>
                                                <TableCell align="left">{data.main.temp} °C</TableCell>
                                                <TableCell align="left">{data.main.temp_max} °C</TableCell>
                                                <TableCell align="left">{data.main.temp_min} °C</TableCell>
                                                <TableCell align="left">{data.main.feels_like} °C</TableCell>
                                                <TableCell align="left">{data.main.pressure} hPa</TableCell>
                                                <TableCell align="left">{data.main.humidity} %</TableCell>
                                                <TableCell align="left">{data.wind.speed} m/s {windDirectionAsText(data.wind.deg)}</TableCell>
                                                <TableCell align="left">{format(new Date(data.sys.sunrise * 1000), "HH:mm")}</TableCell>
                                                <TableCell align="left">{format(new Date(data.sys.sunset * 1000), "HH:mm")}</TableCell>
                                            </>
                                        }
                                    </TableBody>
                                </Table>
                            </Grid>
                            <CardHeader title={"Stündliche Vorhersage"} />
                            <Grid container sx={{ overflowX: "auto", mt: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ position: "sticky", left: 0, backgroundColor: "white" }}>Uhrzeit</TableCell>
                                            {
                                                hourlyData && hourlyData.list.map(x => <TableCell align="left">{moment(new Date(x.dt * 1000)).format("DD.MM HH:mm")} Uhr</TableCell>)
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell component="th" scope="row" style={{ position: "sticky", left: 0, backgroundColor: "white" }}>Temperatur</TableCell>
                                            {
                                                hourlyData && hourlyData.list.map(x => <TableCell align="left">{x.main.temp} °C</TableCell>)
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row" style={{ position: "sticky", left: 0, backgroundColor: "white" }}>Wetter</TableCell>
                                            {
                                                hourlyData && hourlyData.list.map(x => <TableCell align="left"><img src={`https://openweathermap.org/img/wn/${x.weather[0].icon}@2x.png`} width={"40px"} height={"40px"} /></TableCell>)
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row" style={{ position: "sticky", left: 0, backgroundColor: "white" }}>Wind</TableCell>
                                            {
                                                hourlyData && hourlyData.list.map(x => <TableCell align="left">{x.wind.speed} m/s {windDirectionAsText(x.wind.deg)}</TableCell>)
                                            }
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid sx={{ width: "50%", p: 2 }}>
                    <Card elevation={4} sx={{ mt: 2 }}>
                        <CardHeader title={"16 Tage Vorhersage"} />
                        <CardContent>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Wochentag</TableCell>
                                        <TableCell>
                                        </TableCell>
                                        <TableCell align="left">Tagestemperatur</TableCell>
                                        <TableCell align="left">Minimal Temperatur</TableCell>
                                        <TableCell align="left">Maximal Temperatur</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        dailyData && dailyData.list.map(x => <TableRow key={x.dt} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="row">{moment(new Date(x.dt * 1000)).format("ddd, DD.MM")}</TableCell>
                                            <TableCell align="left">
                                                <img src={`https://openweathermap.org/img/wn/${x.weather[0].icon}@2x.png`} width={"40px"} height={"40px"} />
                                            </TableCell>
                                            <TableCell align="left">{x.temp.day + " °C"}</TableCell>
                                            <TableCell align="left">{x.temp.min + " °C"}</TableCell>
                                            <TableCell align="left">{x.temp.max + " °C"}</TableCell>
                                        </TableRow>)
                                    }
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        }
    </Grid >
}