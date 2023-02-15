import { useState } from "react";
import axios from "axios";
import { FileUploader } from "react-drag-drop-files";
import PropagateLoader from "react-spinners/PropagateLoader";

const fileTypes = ["JPEG", "PNG", "JPG"];

axios.defaults.baseURL = "http://localhost:5001";

function App() {
  const [file, setFile] = useState(null);

  const [file2, setFile2] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      try {
        const resp = await axios({
          url: "/upload", //your url
          method: "POST",
          data: formData,
          responseType: "blob", // important
        });
        setFile2(resp.data);
        // create file link in browser's memory
        const href = URL.createObjectURL(resp.data);

        // create "a" HTML element with href to file & click
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "file.png"); //or any other extension
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleChange = (file: any) => {
    setFile(file[0]);
  };
  const handleClear = () => {
    setFile(null);
    setFile2(null);
  };
  return (
    <div className="h-screen w-screen flex flex-col items-center mt-20">
      <FileUploader
        multiple={true}
        handleChange={handleChange}
        name="file"
        types={fileTypes}
      />
      <div className="flex items-center gap-4">
        <button
          className="py-1.5 px-5 bg-blue-500 text-white rounded mt-4"
          onClick={handleSubmit}
        >
          Upload
        </button>
        <button
          className="py-1.5 px-4 bg-blue-500 text-white rounded mt-4"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>
      {loading && (
        <div className="my-8 flex flex-col items-center">
          <p className="mb-4">Processing... Please wait...</p>
          <PropagateLoader size={20} color="#3B82F6" />
        </div>
      )}
      <div className="flex mt-4 text-xl font-semibold gap-4">
        <div className="text-center">
          <h2>Uploaded photo</h2>
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="selected file"
              className="rounded-2xl max-h-80 object-contain"
            />
          )}
        </div>
        <div className="text-center">
          <h2>Enhanced photo</h2>
          {file2 && (
            <img
              src={URL.createObjectURL(file2)}
              alt="selected file"
              className="rounded-2xl max-h-80 object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
