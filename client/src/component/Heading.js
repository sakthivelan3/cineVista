import { Box, Typography } from "@mui/material";
import React from "react";

const Heading = (props) => {
    return(
        <Box className="Heading">
            <Typography variant="h3" p={3} sx={{ 
                color: props.darkMode ? 'white' : 'black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'capitalize',
                textAlign: 'left',
                marginLeft: '-26px'
                }}>
                {props.title}
            </Typography>
        </Box>
    )
}

export default Heading;
