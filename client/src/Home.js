import React, { useEffect, useState, lazy, Suspense } from "react";
import Heading from "./component/Heading";
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  CircularProgress,
  Switch,
} from "@mui/material";
import { auth, firestore } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import SearchBox from "./component/SearchBox";
import { ListAlt } from "@mui/icons-material";
import CreateListDialog from "./component/CreateListDialog";
import "./Styles/Home.css";
const MovieList = lazy(() => import("./component/MovieList"));
const Home = () => {
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [query, setQuery] = useState("");
  const [likeLists, setLikeLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showListOptions, setShowListOptions] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getRandomMovies = async () => {
    const url = `https://www.omdbapi.com/?apikey=6ea4ba50&type=series&s=popular`;

    const response = await fetch(url);
    const responseJson = await response.json();

    if (responseJson.Search) {
      const randomMovies = responseJson.Search.sort(
        () => Math.random() - 0.5
      ).slice(0, 20);
      const moviesWithDetails = await Promise.all(
        randomMovies.map(async (movie) => {
          const detailsResponse = await fetch(
            `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=6ea4ba50`
          );
          const detailsJson = await detailsResponse.json();
          return detailsJson;
        })
      );
      setMovies(moviesWithDetails);
    }
  };

  const getMovieDetails = async (query) => {
    if (query) {
      let url = `https://www.omdbapi.com/?apikey=6ea4ba50&type=series&s=${query}&r=json`;
      const response = await fetch(url);
      const responseJson = await response.json();

      if (responseJson.Search) {
        const moviesWithDetails = await Promise.all(
          responseJson.Search.map(async (movie) => {
            const detailsResponse = await fetch(
              `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=6ea4ba50`
            );
            const detailsJson = await detailsResponse.json();
            return detailsJson;
          })
        );

        const filteredMovies = moviesWithDetails.filter((movie) => {
          return (
            movie.Poster &&
            movie.Poster.trim() !== "N/A" &&
            movie.Title &&
            movie.Title.trim() !== ""
          );
        });

        setMovies(filteredMovies);
      }
    } else {
      getRandomMovies();
    }
  };

  useEffect(() => {
    getMovieDetails("");
  }, []);

  useEffect(() => {
    if (query) {
      getMovieDetails(query);
    }
  }, [query]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Fetch user's like lists
      const userLikeListsRef = collection(
        firestore,
        "users",
        user.uid,
        "likeLists"
      );
      const unsubscribe = onSnapshot(userLikeListsRef, (snapshot) => {
        const lists = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setLikeLists(lists);
      });
      return () => unsubscribe();
    }
  }, []);

  const handleAddToFavourites = async (movie) => {
    if (selectedList) {
      setFavourites([...favourites, movie]);

      const listRef = doc(
        firestore,
        "users",
        auth.currentUser.uid,
        "likeLists",
        selectedList
      );
      await setDoc(listRef, { movies: [...favourites, movie] }, { merge: true })
        .then(() => {})
        .catch((error) => {
          setFavourites(
            favourites.filter((favMovie) => favMovie.imdbID !== movie.imdbID)
          );
          console.error("Error adding movie to favorites:", error);
        });
    }
  };

  const handleRemoveFromFavourites = async (movie) => {
    if (selectedList) {
      const newMovies = favourites.filter(
        (favMovie) => favMovie.imdbID !== movie.imdbID
      );
      setFavourites(newMovies);

      const listRef = doc(
        firestore,
        "users",
        auth.currentUser.uid,
        "likeLists",
        selectedList
      );
      await setDoc(listRef, { movies: newMovies }, { merge: true })
        .then(() => {})
        .catch((error) => {
          setFavourites([...favourites, movie]);
          console.error("Error removing movie from favorites:", error);
        });
    }
  };

  const handleCreateList = async () => {
    const listName = prompt("Enter the name for the new list:");
    if (listName) {
      const listRef = collection(
        firestore,
        "users",
        auth.currentUser.uid,
        "likeLists"
      );
      await addDoc(listRef, { name: listName, movies: [] });
    }
  };

  const handleSelectList = (listId) => {
    setSelectedList(listId);

    if (listId) {
      const listRef = doc(
        firestore,
        "users",
        auth.currentUser.uid,
        "likeLists",
        listId
      );
      getDoc(listRef).then((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setFavourites(data.movies || []);
        }
      });
    } else {
      setFavourites([]);
    }
  };
  const handleSignOut = () => {
    auth.signOut().then(() => {
      navigate("/signin");
    });
  };

  const isSmallScreen = windowWidth <= 768;

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`Homepage ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <Box
        sx={{
          backgroundColor: darkMode ? "#111" : "#fff",
          color: darkMode ? "#fff" : "#000",
          minHeight: "100vh",
        }}
      >
        <AppBar
          position="static"
          sx={{ backgroundColor: "transparent", boxShadow: "none" }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Heading title="CineVista" darkMode={darkMode} />

            {isSmallScreen ? (
              <Button onClick={() => setShowListOptions(!showListOptions)}>
                <ListAlt sx={{ marginRight: "5px" }} />
              </Button>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <Switch
                  color="primary"
                  checked={darkMode}
                  onChange={handleThemeToggle}
                  name={darkMode ? "Dark Mode" : "Light Mode"}
                />
                <SearchBox
                  query={query}
                  setQuery={setQuery}
                  fullWidth
                  sx={{ marginRight: "20px" }}
                />
                <Button
                  className={`create-list-button ${
                    darkMode ? "dark-mode" : "light-mode"
                  }`}
                  onClick={handleOpenDialog}
                >
                  Create List
                </Button>
                <CreateListDialog
                  open={dialogOpen}
                  onClose={handleCloseDialog}
                />
                <Box sx={{ marginLeft: "10px" }}>
                  <Typography
                    color={darkMode ? "inherit" : "primary"}
                    variant="body1"
                    component="span"
                  >
                    Select List:
                  </Typography>
                  <select
                    onChange={(e) => handleSelectList(e.target.value)}
                    style={{
                      padding: "0.5rem",
                      fontSize: "1rem",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      backgroundColor: "#f9f9f9",
                      color: "#333",
                      width: "200px",
                    }}
                  >
                    <option value="">- - - -</option>
                    {likeLists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.name}
                      </option>
                    ))}
                  </select>
                </Box>
                <Button
                  color={darkMode ? "inherit" : "primary"}
                  onClick={handleSignOut}
                  className="sign-out-button"
                >
                  Sign Out
                </Button>
              </Box>
            )}

            {isSmallScreen && showListOptions && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <SearchBox
                  query={query}
                  setQuery={setQuery}
                  fullWidth
                  sx={{ marginBottom: "10px" }}
                />
                <Button
                  className={`create-list-button ${
                    darkMode ? "dark-mode" : "light-mode"
                  }`}
                  onClick={handleCreateList}
                >
                  Create List
                </Button>
                <Box sx={{ marginTop: "10px", width: "100%" }}>
                  <Typography
                    color={darkMode ? "inherit" : "primary"}
                    variant="body1"
                    component="span"
                  >
                    Select List:
                  </Typography>
                  <select
                    style={{ marginLeft: "10px", width: "100%" }}
                    onChange={(e) => handleSelectList(e.target.value)}
                  >
                    <option value="">- - - -</option>
                    {likeLists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.name}
                      </option>
                    ))}
                  </select>
                </Box>
                <Button
                  color={darkMode ? "inherit" : "primary"}
                  onClick={handleSignOut}
                  className="sign-out-button"
                  style={{ marginTop: "10px" }}
                >
                  Sign Out
                </Button>
              </Box>
            )}
          </Toolbar>
        </AppBar>
        <Box p={3}>
          <Box mb={4}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                borderBottom: "2px solid #3f51b5",
                width: "fit-content",
                color: "#3f51b5",
                letterSpacing: "2px",
                padding: "0.5rem 0",
              }}
            >
              Movies
            </Typography>

            <Suspense fallback={<CircularProgress color="inherit" />}>
              <MovieList
                movies={movies}
                handleFavourites={handleAddToFavourites}
                isFavouriteList={false}
              />
            </Suspense>
          </Box>
          <Box>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                borderBottom: "2px solid #3f51b5",
                width: "fit-content",
                color: "#3f51b5",
                letterSpacing: "2px",
                padding: "0.5rem 0",
              }}
            >
              List
            </Typography>

            <Suspense fallback={<CircularProgress color="inherit" />}>
              <MovieList
                movies={favourites}
                handleFavourites={handleRemoveFromFavourites}
                isFavouriteList={true}
              />
            </Suspense>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Home;
