import { useState } from "react";
import axios from "axios";
import storage from "../../firebase"; // Assurez-vous que le chemin est correct

export default function NewSer() {
  const [series, setSeries] = useState({ title: "", desc: "", img: "", imgTitle: "", imgSm: "", trailer: "", genre: "", seasons: [] });
  const [season, setSeason] = useState({ seasonNumber: "", episodes: [] });
  const [uploaded, setUploaded] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeries({ ...series, [name]: value });
  };

  const handleSeasonChange = (e) => {
    const { name, value } = e.target;
    setSeason({ ...season, [name]: value });
  };

  const addSeason = () => {
    setSeries({ ...series, seasons: [...series.seasons, season] });
    setSeason({ seasonNumber: "", episodes: [] });
  };

  const upload = (items) => {
    items.forEach((item) => {
      const fileName = new Date().getTime() + item.label + item.file.name;
      const uploadTask = storage.ref(`/items/${fileName}`).put(item.file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            setSeries((prev) => {
              return { ...prev, [item.label]: url };
            });
            setUploaded((prev) => prev + 1);
          });
        }
      );
    });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    upload([
      { file: series.img, label: "img" },
      { file: series.imgTitle, label: "imgTitle" },
      { file: series.imgSm, label: "imgSm" },
      { file: series.trailer, label: "trailer" }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/series", series);
      console.log("Series created:", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>New Series</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" name="title" value={series.title} onChange={handleChange} />
        <input type="text" placeholder="Description" name="desc" value={series.desc} onChange={handleChange} />
        <input type="text" placeholder="Genre" name="genre" value={series.genre} onChange={handleChange} />
        <input type="file" name="img" onChange={(e) => setSeries({ ...series, img: e.target.files[0] })} />
        <input type="file" name="imgTitle" onChange={(e) => setSeries({ ...series, imgTitle: e.target.files[0] })} />
        <input type="file" name="imgSm" onChange={(e) => setSeries({ ...series, imgSm: e.target.files[0] })} />
        <input type="file" name="trailer" onChange={(e) => setSeries({ ...series, trailer: e.target.files[0] })} />
        {uploaded === 4 ? (
          <button type="submit">Create Series</button>
        ) : (
          <button onClick={handleUpload}>Upload</button>
        )}
        <div>
          <h2>Add Season</h2>
          <input type="text" placeholder="Season Number" name="seasonNumber" value={season.seasonNumber} onChange={handleSeasonChange} />
          <button type="button" onClick={addSeason}>Add Season</button>
        </div>
      </form>
    </div>
  );
}
