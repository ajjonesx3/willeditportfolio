import {useState} from 'react';
import './AddBlogPost.css';
import HomeButton from '../HomeButton.js';

const AddBlogPost = ({token}) => {

    const [responseMessages, setResponseMessages] = useState([]);

    const [blogTitle, setBlogTitle] = useState("");
    const [blogText, setBlogText] = useState("");

    const [file, setFile] = useState([]);

    async function uploadObject(obj, path) {
        const url = `https://api.github.com/repos/ajjonesx3/willportfolio/contents/${path}`;
        
        // Convert object to JSON string and then to Base64
        const content = btoa(JSON.stringify(obj, null, 2));
    
        // Fetch existing file to get the SHA (required for updates)
        let sha = null;
        try {
            const response = await fetch(url, {
                headers: { Authorization: `token ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                sha = data.sha; // Get file SHA if it exists
            }
        } catch (error) {
            console.log("File may not exist, proceeding with upload...");
        }
    
        // Prepare payload
        const payload = {
            message: `Upload ${path}`,
            content: content,
            sha: sha // Only include SHA if updating
        };
    
        // Upload new or updated file
        const uploadResponse = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `token ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
        });
    
        if (uploadResponse.ok) {
            //console.log(`✅ Uploaded: ${filePath}`);
            setResponseMessages((prev)=>[...prev, `✅ Uploaded: ${obj.title}`])
        } else {
            setResponseMessages((prev)=>[...prev, `❌ Error uploading: ${obj.title}`])
        }
    }

    const uploadFile = async (file, filePath) => {

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

    const folderSafe = (str) => {
        let ret = str.replaceAll(' ', '_');
        ret = ret.replaceAll('/', 'FS');
        ret = ret.replaceAll('.', 'DOT');
        return ret;
    }

    const handleClick = async () => {

        const folderName = folderSafe(blogTitle);

        setResponseMessages([]);

        const blogObject = {
            title: blogTitle,
            text: blogText,
        }

        const tFile = file;

        setFile();
        setBlogTitle("");
        setBlogText("");

        await uploadObject(blogObject, `src/WillBlogs/${folderName}/blogData.json`)
        await uploadFile(tFile,`src/WillBlogs/${folderName}/${tFile.name}`);

    }

    const onFileChange = e => {
        e.preventDefault();
        setFile(e.target.files[0]);
    }

    return (
        <div className="AddBlogPost">
            <div className="header">
                <HomeButton />
                <h1 className="title">Add Blog Post</h1>
            </div>
            <div className="blogForm">
                <div className="blogInputSection titleArea"> 
                    <input type="text" name="blogTitle" onChange={(e)=>setBlogTitle(e.target.value)} placeholder="Title" value={blogTitle} />
                </div>
                <div className="blogInputSection textArea">
                    <textarea type="text" name="blogText" onChange={(e)=>setBlogText(e.target.value)} placeholder="text content" value={blogText} />
                </div>
                <div className="blogInputSection">
                    <label for="fileInput">Media:</label>
                    <input onChange={onFileChange} type="file" name="fileInput" />
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
    )
}

export default AddBlogPost