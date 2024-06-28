import { useState } from "react";
import axios from "axios";

export default function NewSeason() {
  const [season, setSeason] = useState({ seasonNumber: "", episodes: [] });
  const [episode, setEpisode] = useState({ title: "", desc: "", duration: "" });

  const handleSeasonChange = (e) => {
    const { name, value } = e.target;
    setSeason({ ...season, [name]: value });
  };

  const handleEpisodeChange = (e) => {
    const { name, value } = e.target;
    setEpisode({ ...episode, [name]: value });
  };

  const addEpisode = () => {
    setSeason({ ...season, episodes: [...season.episodes, episode] });
    setEpisode({ title: "", desc: "", duration: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/seasons", season);
      console.log("Season created:", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>New Season</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Season Number"
          name="seasonNumber"
          value={season.seasonNumber}
          onChange={handleSeasonChange}
        />
        <div>
          <h2>Add Episode</h2>
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={episode.title}
            onChange={handleEpisodeChange}
          />
          <input
            type="text"
            placeholder="Description"
            name="desc"
            value={episode.desc}
            onChange={handleEpisodeChange}
          />
          <input
            type="text"
            placeholder="Duration"
            name="duration"
            value={episode.duration}
            onChange={handleEpisodeChange}
          />
          <button type="button" onClick={addEpisode}>
            Add Episode
          </button>
        </div>
        <button type="submit">Create Season</button>
      </form>
    </div>
  );
}
