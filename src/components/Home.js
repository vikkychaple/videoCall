import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import { v4 as uuidV4 } from "uuid";

const Home = () => {
    const navigate = useNavigate();

    const createRoom = () => {
        const roomId = uuidV4(); // Generate a unique room ID
        navigate(`/room/${roomId}`); // Redirect user to the room
    };

    return (
        <Container className="text-center mt-5">
            <h1>Welcome to Video Call App</h1>
            <p>Click the button below to start a new call.</p>
            <Button variant="primary" onClick={createRoom}>
                Start a New Call
            </Button>
        </Container>
    );
};

export default Home;
