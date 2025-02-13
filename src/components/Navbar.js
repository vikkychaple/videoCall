import React, { useEffect, useState } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { GearFill, LifePreserver } from "react-bootstrap-icons"; 

const CustomNavbar = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        return date.toLocaleDateString(undefined, options);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString();
    };

    return (
        <Navbar bg="secondary" variant="dark" expand="lg" className="py-2">
            <Container>
                
                <Navbar.Brand href="/">
                    <img
                        src="/images/logo.png"
                        alt="Logo"
                        height="40"
                        className="d-inline-block align-top"
                    />{" "}
                    Video Call App
                </Navbar.Brand>

                <Nav className="ms-auto d-flex align-items-center">
                  
                    <span className="text-white me-4">
                        {formatDate(currentTime)} | {formatTime(currentTime)}
                    </span>

                    
                    <Nav.Link href="/support" className="text-white">
                        <LifePreserver size={24} />
                    </Nav.Link>

                    
                    <Nav.Link href="/settings" className="text-white">
                        <GearFill size={24} />
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;
