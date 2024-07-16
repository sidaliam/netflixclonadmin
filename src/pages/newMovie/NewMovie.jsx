import { useContext, useState } from "react";
import "./newMovie.css";
import storage from "../../firebase";
import { MovieContext } from "../../context/movieContext/MovieContext";
import axios from "axios";

export default function NewMovie() {
  const [movie, setMovie] = useState({
    title: "",
    desc: "",
    img: null,
    imgTitle: null,
    imgSm: null,
    trailer: null,
    video: null,
    year: "",
    limit: "",
    genre: "",
    isSeries: false,
    subtitles: []
  });
  const [newSubtitle, setNewSubtitle] = useState({
    src: null,
    srcLang: "",
    label: ""
  });
  const [progressupload, setProgressUpload] = useState(0);
  const [uploaded, setUploaded] = useState(0);

  const { dispatch } = useContext(MovieContext);

  const handleChange = (e) => {
    const value = e.target.value;
    setMovie({
      ...movie,
      [e.target.name]: value
    });
  };

  const handleSubtitleChange = (e) => {
    const value = e.target.value;
    setNewSubtitle({
      ...newSubtitle,
      [e.target.name]: value
    });
  };

  const handleSubtitleFileChange = (e) => {
    setNewSubtitle({
      ...newSubtitle,
      src: e.target.files[0]
    });
  };

  const addSubtitle = () => {
    setMovie((prev) => ({
      ...prev,
      subtitles: [...prev.subtitles, newSubtitle]
    }));
    setNewSubtitle({
      src: null,
      srcLang: "",
      label: ""
    });
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
          setProgressUpload(progress);
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
    const itemsToUpload = [
      { file: movie.img, label: "img" },
      { file: movie.imgTitle, label: "imgTitle" },
      { file: movie.imgSm, label: "imgSm" },
      { file: movie.trailer, label: "trailer" },
      { file: movie.video, label: "video" },
    ];
    movie.subtitles.forEach((subtitle, index) => {
      itemsToUpload.push({
        file: subtitle.src,
        label: `subtitle${index}`,
        srcLang: subtitle.srcLang,
        labelSubtitle: subtitle.label
      });
    });
    upload(itemsToUpload);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      "https://backendnetflix-paxc.onrender.com/api/movies",
      movie
    );
  };

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Movie</h1>
      <form className="addProductForm">
        <div className="addProductItem">
          <label>sous titres</label>
          <input
            type="file"
            id="src"
            name="src"
            onChange={handleSubtitleFileChange}
          />
          <label>langue</label>
          <input
            type="text"
            id="srcLang"
            name="srcLang"
            value={newSubtitle.srcLang}
            onChange={handleSubtitleChange}
          />
          <label>label</label>
          <input
            type="text"
            id="label"
            name="label"
            value={newSubtitle.label}
            onChange={handleSubtitleChange}
          />
          <button type="button" onClick={addSubtitle}>
            Add Subtitle
          </button>
        </div>
        <div className="addProductItem">
          <label>Image</label>
          <input
            type="file"
            id="img"
            name="img"
            onChange={(e) => setMovie({ ...movie, img: e.target.files[0] })}
          />
        </div>
        <div className="addProductItem">
          <label>Title image</label>
          <input
            type="file"
            id="imgTitle"
            name="imgTitle"
            onChange={(e) => setMovie({ ...movie, imgTitle: e.target.files[0] })}
          />
        </div>
        <div className="addProductItem">
          <label>Thumbnail image</label>
          <input
            type="file"
            id="imgSm"
            name="imgSm"
            onChange={(e) => setMovie({ ...movie, imgSm: e.target.files[0] })}
          />
        </div>
        <div className="addProductItem">
          <label>Title</label>
          <input
            type="text"
            placeholder="John Wick"
            name="title"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input
            type="text"
            placeholder="description"
            name="desc"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Year</label>
          <input
            type="text"
            placeholder="Year"
            name="year"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Genre</label>
          <input
            type="text"
            placeholder="Genre"
            name="genre"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Duration</label>
          <input
            type="text"
            placeholder="Duration"
            name="duration"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Limit</label>
          <input
            type="text"
            placeholder="limit"
            name="limit"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Is Series?</label>
          <select name="isSeries" id="isSeries" onChange={handleChange}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <div className="addProductItem">
          <label>Trailer</label>
          <input
            type="file"
            name="trailer"
            onChange={(e) => setMovie({ ...movie, trailer: e.target.files[0] })}
          />
        </div>
        <div className="addProductItem">
          <label>Video</label>
          <input
            type="file"
            name="video"
            onChange={(e) => setMovie({ ...movie, video: e.target.files[0] })}
          />
        </div>
        <p>{progressupload} %</p>
        {uploaded === 5 ? (
          <button className="addProductButton" onClick={handleSubmit}>
            Create
          </button>
        ) : (
          <button className="addProductButton" onClick={handleUpload}>
            Upload
          </button>
        )}
      </form>
    </div>
  );
}
