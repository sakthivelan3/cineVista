// SearchBox.js
import React from "react";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from "@mui/material";

const SearchBox = (props) => {
    return(
        <Box>
            <TextField
                type="text"
                value={props.value}
                onChange={(event)=> props.setQuery(event.target.value)}
                placeholder="Type Movie name"
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}

                sx={{
                    backgroundColor:'white',
                    borderRadius:30, // Set a stable border radius here
                }}
            />
        </Box>
    )
}

export default SearchBox;
