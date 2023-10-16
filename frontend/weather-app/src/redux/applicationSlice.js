import { createSlice } from '@reduxjs/toolkit';

export const applicationReducer = createSlice({
    name: 'application',
    initialState: {
        stations: []
    },
    reducers: {
        onStationsChanged: (state, action) => {
            console.log(action.payload)
            state.stations = action.payload
        }
    }
});

export const { onStationsChanged } = applicationReducer.actions;

export default applicationReducer.reducer