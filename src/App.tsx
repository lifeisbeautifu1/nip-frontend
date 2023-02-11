import { useState } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5012";

function App() {
  const [file, setFile] = useState(null);

  const [file2, setFile2] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
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
      }
    }
  };
  return (
    <div>
      <h1>hello</h1>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => {
            // @ts-ignore
            setFile(e.target.files[0]);
            setFile2(null);
          }}
          type="file"
          name="file"
          id="file"
          accept=".png, .jpg, .jpeg"
        />
        <button>submit</button>
      </form>
      <div>
        <div>
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="selected file"
              className="rounded-2xl max-h-80 object-contain"
            />
          )}
        </div>
        <div>
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
