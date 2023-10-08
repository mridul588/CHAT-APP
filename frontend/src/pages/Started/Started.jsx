import React, { useContext } from 'react'
import ChatContext from '../../Context/ChatProvider';
import { useNavigate } from 'react-router-dom';

const Started = () => {
    const navigate = useNavigate();
    const {user} = useContext(ChatContext);

    useEffect(() => {
       if(!user){
         navigate('/')
       }
       else{
        navigate('/chats')
       }
    }, []);

    return (
        <div>Started</div>
    )
}

export default Started