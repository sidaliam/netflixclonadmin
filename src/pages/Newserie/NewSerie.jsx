import { useContext, useState } from "react";
import storage from "../../firebase";
import { MovieContext } from "../../context/movieContext/MovieContext";
import axios from "axios";

export default function NewSerie() {
  const [movie, setMovie] = useState({
    title: "",
    desc: "",
    duration: "",
    episodeNumber: "",
  });
  const [season, setSeason] = useState({ seasonNumber: "", episodes: [] });
  const [serie, setserie] = useState({
    title: "",
    desc: "",
    genre: "",
    seasons: [],
  });
  const [video, setVideo] = useState(null);
  const [uploaded, setUploaded] = useState(0);
  const [episodeserie, setEpisodeserie] = useState([]);
  const [saisonsserie, setsaisonsserie] = useState([]);
  const [img, setImg] = useState(null);
  const [imgTitle, setImgTitle] = useState(null);
  const [imgSm, setImgSm] = useState(null);
  const [trailer, setTrailer] = useState(null);

  const { dispatch } = useContext(MovieContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  const handleSeasonChange = (e) => {
    const { name, value, options } = e.target;
    if (name === "episodes") {
      const selectedValues = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setSeason({ ...season, episodes: selectedValues });
    } else {
      setSeason({ ...season, [name]: value });
    }
  };

  const handleSerieChange = (e) => {
    const { name, value, options } = e.target;
    if (name === "seasons") {
      const selectedValues = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setserie({ ...serie, seasons: selectedValues });
    } else {
      setserie({ ...serie, [name]: value });
    }
  };

  const upload = (items) => {
    items.forEach((item) => {
      const fileName = new Date().getTime() + item.label + item.file.name;
      const uploadTask = storage.ref(`/items/${fileName}`).put(item.file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            setMovie((prev) => {
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
    upload([{ file: video, label: "video" }]);
  };

  const handleUploadSerie = async (e) => {
    e.preventDefault();
    const uploadItems = [
      { file: img, label: "img" },
      { file: imgTitle, label: "imgTitle" },
      { file: imgSm, label: "imgSm" },
      { file: trailer, label: "trailer" },
    ];

    for (const item of uploadItems) {
      const fileName = new Date().getTime() + item.label + item.file.name;
      const uploadTask = storage.ref(`/items/${fileName}`).put(item.file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error(error);
            reject(error);
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
              setserie((prevSerie) => ({
                ...prevSerie,
                [item.label]: url,
              }));
              setUploaded((prev) => prev + 1);
              resolve();
            });
          }
        );
      });
    }
  };

  const handleEpisodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://backendnetflix-paxc.onrender.com/api/episodes", movie);
      setEpisodeserie([...episodeserie, res.data]);
      setSeason({ ...season, episodes: [...season.episodes, res.data._id] });
      setMovie({ title: "", desc: "", duration: "", episodeNumber: "" });
      setUploaded(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeasonSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://backendnetflix-paxc.onrender.com/api/seasons", season);
      console.log(res.data);
      setSeason({ seasonNumber: "", episodes: [] });
      setEpisodeserie([]);
      setsaisonsserie([...saisonsserie, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSerieSubmit = async (e) => {
    e.preventDefault();
    const serieData = { ...serie }; // no JSON.stringify
    try {
      await axios.post("https://backendnetflix-paxc.onrender.com/api/series", serieData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Episode</h1>
      <form className="addProductForm" onSubmit={handleEpisodeSubmit}>
        <div className="addProductItem">
          <label>Title</label>
          <input
            type="text"
            placeholder="John Wick"
            name="title"
            value={movie.title}
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input
            type="text"
            placeholder="description"
            name="desc"
            value={movie.desc}
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Duration</label>
          <input
            type="number"
            placeholder="Duration in min"
            name="duration"
            value={movie.duration}
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Episode Number</label>
          <input
            type="number"
            placeholder="Episode Number"
            name="episodeNumber"
            value={movie.episodeNumber}
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Video</label>
          <input
            type="file"
            name="video"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        </div>
        {uploaded === 1 ? (
          <button className="addProductButton" type="submit">
            Create
          </button>
        ) : (
          <button className="addProductButton" onClick={handleUpload}>
            Upload
          </button>
        )}
      </form>

      <h1 className="addProductTitle">New Season</h1>
      <form className="addProductForm" onSubmit={handleSeasonSubmit}>
        <div className="addProductItem">
          <label>Season Number</label>
          <input
            type="number"
            placeholder="Season Number"
            name="seasonNumber"
            value={season.seasonNumber}
            onChange={handleSeasonChange}
          />
        </div>
        <div className="addProductItem">
          <label>Episodes</label>
          <select
            multiple
            name="episodes"
            style={{ height: "280px" }}
            value={season.episodes}
            onChange={handleSeasonChange}
          >
            {episodeserie.map((ep) => (
              <option key={ep._id} value={ep._id}>
                {ep.title}
              </option>
            ))}
          </select>
        </div>
        <button className="addProductButton" type="submit">
          Create
        </button>
      </form>

      <h1 className="addProductTitle">New Series</h1>
      <form className="addProductForm" onSubmit={handleSerieSubmit}>
        <div className="addProductItem">
          <label>Serie title</label>
          <input
            type="text"
            placeholder="Season Number"
            name="title"
            value={serie.title}
            onChange={handleSerieChange}
          />
        </div>
        <div className="addProductItem">
          <label>Serie Desc</label>
          <input
            type="text"
            placeholder="Description"
            name="desc"
            value={serie.desc}
            onChange={handleSerieChange}
          />
        </div>
        <div className="addProductItem">
          <label>Serie genre</label>
          <input
            type="text"
            placeholder="Genre"
            name="genre"
            value={serie.genre}
            onChange={handleSerieChange}
          />
        </div>
        <div className="addProductItem">
          <label>img</label>
          <input
            type="file"
            name="img"
            onChange={(e) => setImg(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>imgTitle</label>
          <input
            type="file"
            name="imgTitle"
            onChange={(e) => setImgTitle(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>imgSm</label>
          <input
            type="file"
            name="imgSm"
            onChange={(e) => setImgSm(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>trailler</label>
          <input
            type="file"
            name="trailler"
            onChange={(e) => setTrailer(e.target.files[0])}
          />
        </div>

        <div className="addProductItem">
          <label>Seasons</label>
          <select
            multiple
            name="seasons"
            style={{ height: "280px" }}
            value={serie.seasons}
            onChange={handleSerieChange}
          >
            {saisonsserie.map((saison) => (
              <option key={saison._id} value={saison._id}>
                {saison.seasonNumber}
              </option>
            ))}
          </select>
        </div>
        {uploaded === 4 ? (
          <button className="addProductButton" type="submit">
            Create
          </button>
        ) : (
          <button className="addProductButton" onClick={handleUploadSerie}>
            Upload
          </button>
        )}
      </form>
    </div>
  );
}
