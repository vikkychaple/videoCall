// import React, { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
// import Peer from "simple-peer";
// import { Button, Container, Row, Col, Form } from "react-bootstrap";

// const socket = io("http://localhost:5000"); // Update backend URL if needed

// const VideoCall = () => {
//      // eslint-disable-next-line
//     const [stream, setStream] = useState(null);
//     const [muted, setMuted] = useState(false);
//     const [videoEnabled, setVideoEnabled] = useState(true);
//     const [peers, setPeers] = useState([]);
//     const [userName, setUserName] = useState("");
//     const [joined, setJoined] = useState(false);
    
//     const userVideo = useRef();
//     const peersRef = useRef([]);

//     useEffect(() => {
//         if (!joined) return;

//         navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
//             setStream(stream);
//             userVideo.current.srcObject = stream;
//             socket.emit("join-room", { roomId: "room1", userName });

//             socket.on("user-connected", ({ userId, userName }) => {
//                 const peer = createPeer(userId, stream);
//                 peersRef.current.push({ peerID: userId, peer, userName });
//                 setPeers([...peersRef.current]);
//             });

//             socket.on("signal", ({ userId, signal }) => {
//                 const peer = peersRef.current.find(p => p.peerID === userId);
//                 if (peer) peer.peer.signal(signal);
//             });

//             socket.on("user-disconnected", (userId) => {
//                 const peerIndex = peersRef.current.findIndex(p => p.peerID === userId);
//                 if (peerIndex !== -1) {
//                     peersRef.current[peerIndex].peer.destroy();
//                     peersRef.current.splice(peerIndex, 1);
//                     setPeers([...peersRef.current]);
//                 }
//             });
//         });
//          // eslint-disable-next-line
//     }, [joined]);

//     const createPeer = (userId, stream) => {
//         const peer = new Peer({ initiator: true, trickle: false, stream });

//         peer.on("signal", (signal) => {
//             socket.emit("signal", { roomId: "room1", signal, userId });
//         });

//         return peer;
//     };

//     const handleJoin = () => {
//         if (userName.trim() !== "") setJoined(true);
//     };
//     const toggleVideo = () => {
//         stream.getVideoTracks()[0].enabled = !videoEnabled;
//         setVideoEnabled(!videoEnabled);
//     };

//     // const leaveCall = () => {
//     //     stream.getTracks().forEach((track) => track.stop());
//     //     socket.disconnect();
//     // };
//     return (
//         <Container className="mt-4 text-center">
//             {!joined ? (
//                 <div>
//                     <h2>Enter Your Name</h2>
//                     <Form.Control
//                         type="text"
//                         placeholder="Enter your name"
//                         value={userName}
//                         onChange={(e) => setUserName(e.target.value)}
//                         className="mb-3"
//                     />
//                     <Button onClick={handleJoin} disabled={!userName.trim()} variant="success">
//                         Join Call
//                     </Button>
//                 </div>
//             ) : (
//                 <>
//                     <h2 className="mb-3">Video Call</h2>
//                     <Row className="justify-content-center">
//                         <Col md={6} className="video-container">
//                             <div className="video-wrapper">
//                                 <video ref={userVideo} className="rounded shadow border" autoPlay playsInline muted={muted} />
//                                 <div className="name-tag">{userName} (You)</div>
//                             </div>
//                         </Col>
//                         {peers.map((p, index) => (
//                             <Col md={6} key={index} className="video-container">
//                                 <Video peer={p.peer} userName={p.userName} />
//                             </Col>
//                         ))}
//                     </Row>
//                     <Row className="mt-3">
//                         <Col>
//                             <Button variant={muted ? "danger" : "primary"} className="me-2" onClick={() => setMuted(!muted)}>
//                                 {muted ? "Unmute" : "Mute"}
//                             </Button>
//                             <Button variant={videoEnabled ? "warning" : "success"} className="me-2" onClick={toggleVideo}>
//                         {videoEnabled ? "Turn Off Video" : "Turn On Video"}
//                     </Button>
//                     <Button variant="dark" onClick={() => window.location.reload()}>Leave Call</Button>
//                         </Col>
//                     </Row>
//                 </>
//             )}
//         </Container>
//     );
// };

// const Video = ({ peer, userName }) => {
//     const ref = useRef();

//     useEffect(() => {
//         peer.on("stream", (stream) => {
//             ref.current.srcObject = stream;
//         });
//     }, [peer]);

//     return (
//         <div className="video-wrapper">
//             <video ref={ref} autoPlay playsInline className="rounded shadow border" />
//             <div className="name-tag">{userName}</div>
//         </div>
//     );
// };

// export default VideoCall;




import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { Button, Container, Row, Col, Form } from "react-bootstrap";

const socket = io("http://localhost:5000"); // Backend URL for signaling

const VideoCall = () => {
    const { roomId } = useParams(); // Get room ID from URL
    // eslint-disable-next-line
    const [stream, setStream] = useState(null);
    const [muted, setMuted] = useState(false);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [peers, setPeers] = useState([]);
    const [userName, setUserName] = useState("");
    const [joined, setJoined] = useState(false);
    
    const userVideo = useRef();
    const peersRef = useRef([]);

    useEffect(() => {
        if (!joined) return;

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream);
            userVideo.current.srcObject = stream;
            socket.emit("join-room", { roomId, userName });

            socket.on("user-connected", ({ userId, userName }) => {
                const peer = createPeer(userId, stream);
                peersRef.current.push({ peerID: userId, peer, userName });
                setPeers([...peersRef.current]);
            });

            socket.on("signal", ({ userId, signal }) => {
                const peer = peersRef.current.find(p => p.peerID === userId);
                if (peer) peer.peer.signal(signal);
            });

            socket.on("user-disconnected", (userId) => {
                const peerIndex = peersRef.current.findIndex(p => p.peerID === userId);
                if (peerIndex !== -1) {
                    peersRef.current[peerIndex].peer.destroy();
                    peersRef.current.splice(peerIndex, 1);
                    setPeers([...peersRef.current]);
                }
            });
        });
        // eslint-disable-next-line
    }, [joined]);

    const createPeer = (userId, stream) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on("signal", (signal) => {
            socket.emit("signal", { roomId, signal, userId });
        });

        return peer;
    };

    const handleJoin = () => {
        if (userName.trim() !== "") setJoined(true);
    };

    return (
        <Container className="mt-4 text-center">
            {!joined ? (
                <div>
                    <h2>Enter Your Name</h2>
                    <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="mb-3"
                    />
                    <Button onClick={handleJoin} disabled={!userName.trim()} variant="success">
                        Join Call
                    </Button>
                    <p className="mt-3">
                        Share this link to invite others: <br />
                        <code>{window.location.href}</code>
                    </p>
                </div>
            ) : (
                <>
                    <h2 className="mb-3">Video Call</h2>
                    <Row className="justify-content-center">
                        <Col md={6} className="video-container">
                            <div className="video-wrapper">
                                <video ref={userVideo} className="rounded shadow border" autoPlay playsInline muted={muted} />
                                <div className="name-tag">{userName} (You)</div>
                            </div>
                        </Col>
                        {peers.map((p, index) => (
                            <Col md={6} key={index} className="video-container">
                                <Video peer={p.peer} userName={p.userName} />
                            </Col>
                        ))}
                    </Row>
                    <Row className="mt-3">
                        <Col>
                            <Button variant={muted ? "danger" : "primary"} className="me-2" onClick={() => setMuted(!muted)}>
                                {muted ? "Unmute" : "Mute"}
                            </Button>
                            <Button variant={videoEnabled ? "warning" : "success"} className="me-2" onClick={() => setVideoEnabled(!videoEnabled)}>
                                {videoEnabled ? "Turn Off Video" : "Turn On Video"}
                            </Button>
                            <Button variant="dark" onClick={() => window.location.reload()}>Leave Call</Button>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

const Video = ({ peer, userName }) => {
    const ref = useRef();

    useEffect(() => {
        peer.on("stream", (stream) => {
            ref.current.srcObject = stream;
        });
    }, [peer]);

    return (
        <div className="video-wrapper">
            <video ref={ref} autoPlay playsInline className="rounded shadow border" />
            <div className="name-tag">{userName}</div>
        </div>
    );
};

export default VideoCall;
