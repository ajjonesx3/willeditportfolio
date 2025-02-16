import {useNavigate} from 'react-router';

const HomeButton = () => {
    const nav = useNavigate();

    const handleClick = () => {
        nav("/");
    }

    return (
        <div onClick={handleClick} className="homeButton">
            Home
        </div>
    )
}

export default HomeButton;