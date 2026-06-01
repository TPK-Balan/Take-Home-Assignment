const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const moviesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "movies_metadata.json"), "utf8")
);

app.get("/api/movies", (request, response) => {
  const movies = moviesData.map(({ id, title, tagline, vote_average }) => ({
    id,
    title,
    tagline,
    vote_average,
  }));
  response.json({ data: movies });
});

app.get("/api/movies/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const movie = moviesData.find((m) => m.id === id);
  if (!movie) {
    return response.status(404).json({ error: "Movie not found" });
  }
  response.json({ data: movie });
});

let port;
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
}

const listener = app.listen(port, () => {
  console.log("Server running on port", listener.address().port);
});
