import {useSearchParams, useNavigate} from 'react-router';
import {useEffect} from 'react';

const Token = ({setToken}) => {

    const [searchParams, setSearchParams] = useSearchParams();
    const nav = useNavigate();


    useEffect(()=>{
        setToken(searchParams.get('portfolioght'));
        //sessionStorage.setItem("portfolioght", searchParams.get('portfolioght'));
        nav('/');
    },[])

    
}

export default Token;