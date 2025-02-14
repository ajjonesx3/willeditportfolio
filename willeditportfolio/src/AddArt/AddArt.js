import './AddArt.css';
import {useState} from 'react';

const options = ["Animation", "Design", "Storyboard"];

const AddArt = ({token}) => {

    const [files, setFiles] = useState([]);
    const [responseMessages, setResponseMessages] = useState([]);
    
    async function uploadFile(file, filePath) {

        setResponseMessages([]);

        const GITHUB_USERNAME = "ajjonesx3";
        const REPO = "willportfolio";
        const BRANCH = "main"; // Change if needed
        const TOKEN = token;
    
        // Convert file to Base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Data = reader.result.split(",")[1];
    
            // GitHub API URL for the file
            const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO}/contents/${filePath}`;
    
            // Check if file exists to get SHA (needed for updates)
            let sha = null;
            try {
                const response = await fetch(url, { headers: { Authorization: `token ${TOKEN}` } });
                if (response.ok) {
                    const json = await response.json();
                    sha = json.sha;
                }
            } catch (err) {
                console.log("File does not exist, creating a new one...");
            }
    
            // Upload file
            const commitMessage = `Upload ${filePath}`;
            const uploadResponse = await fetch(url, {
                method: "PUT",
                headers: {
                    Authorization: `token ${TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: commitMessage,
                    content: base64Data,
                    branch: BRANCH,
                    sha: sha,
                }),
            });
    
            if (uploadResponse.ok) {
                //console.log(`✅ Uploaded: ${filePath}`);
                setResponseMessages((prev)=>[...prev, `✅ Uploaded: ${file.name}`])
            } else {
                setResponseMessages((prev)=>[...prev, `❌ Error uploading ${file.name}:`])
            }
        };
    }
    
    const handleClick = async () => {
        for(let file of files){
            uploadFile(file,`src/WillArt/${file.name}`);
        }
    }

    const onFileChange = e => {
        e.preventDefault();
        console.log(e.target.files);
        setFiles(e.target.files);
    }

    return (
        <div className="AddArt">
            <h1 className="title">Add Art</h1>
            <div className="addArtForm">
                <div className="inputSection">
                    <label for="artTypeInput">Art Type:</label>
                    <select name="artTypeInput" className="artType">
                        {options.map((option, index)=>{
                            return <option id={index} value={option}>{option}</option>
                        })}
                    </select>
                </div>
                <div className="inputSection">
                    <label for="fileInput">File(s):</label>
                    <input onChange={onFileChange} type="file" name="fileInput" multiple></input>
                </div>
            </div>
            <div className="submitSection">
                <div onClick={handleClick} className="submitButton">
                    Submit
                </div>
            </div>
            <div className="responseMessages">
                {responseMessages.map(message=>{
                    return <h2>{message}</h2>
                })}
            </div>
        </div>
    );
}

export default AddArt;