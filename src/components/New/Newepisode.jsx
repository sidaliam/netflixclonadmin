import { useState } from "react";
import axios from "axios";

export default function NewEpisode() {
  const [episode, setEpisode] = useState({ title: "", desc: "", duration: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEpisode({ ...episode, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/episodes", episode);
      console.log("Episode created:", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>New Episode</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={episode.title}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Description"
          name="desc"
          value={episode.desc}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Duration"
          name="duration"
          value={episode.duration}
          onChange={handleChange}
        />
        <button type="submit">Create Episode</button>
      </form>
    </div>
  );
}
