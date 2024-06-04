import { Grid, Paper, Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';

const MovieList = (props) => {
  const [like, setLike] = useState('');

  return (
    <Grid container spacing={2} sx={{ px: 2, pt: 4 }}>
      {props.movies.map((movie, index) => (
        <Grid item xs={12} sm={6} md={3} lg={2} key={index}>
          <Paper
            elevation={3}
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 2,
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 10,
                "& .overlay": {
                  opacity: 1,
                },
                "& .like-button": {
                  opacity: 1,
                }
              },
            }}
          >
            <img
              src={movie.Poster}
              alt={movie.Title}
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderBottom: "none",
              }}
            />
            <Box
              className="overlay"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                opacity: 0,
                transition: "opacity 0.3s",
                p: 2,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxHeight: "3em",
                }}
              >
                {movie.Title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxHeight: "3em",
                }}
              >
                {movie.Year}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxHeight: "3em",
                }}
              >
                {`Rating: ${movie.imdbRating}`}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxHeight: "3em",
                }}
              >
                {`Genre: ${movie.Genre}`}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxHeight: "3em",
                }}
              >
                {`Director: ${movie.Director}`}
              </Typography>
              <Button
                className="like-button"
                onClick={() => {
                  props.handleFavourites(movie);
                  setLike(props.isFavouriteList ? 'Like' : 'Dislike');
                }}
                variant="contained"
                color="secondary"
                startIcon={<FavoriteIcon sx={{ color: props.isFavouriteList ? 'red' : 'white' }} />}
                sx={{
                  opacity: 0,
                  transition: "opacity 0.3s",
                }}
              >
                {props.isFavouriteList ? 'Dislike' : 'Like'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default MovieList;
