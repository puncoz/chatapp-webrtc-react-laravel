import React, {Component} from "react";
import MediaHandler       from "./../MediaHandler";
import Pusher             from "pusher-js";
import Peer               from "simple-peer";

class App extends Component {
    constructor() {
        super();

        this.state = {
            hasMedia: false,
            otherUserId: null,
        };

        this.user = window.user;
        this.user.stream = null;
        this.peers = {};

        this.mediaHandler = new MediaHandler();

        this.setupPusher();

        this.callTo = this.callTo.bind(this);
        this.setupPusher = this.setupPusher.bind(this);
        this.startPeer = this.startPeer.bind(this);
    }

    componentWillMount() {
        this.mediaHandler.getPermissions().then(stream => {
            this.setState({hasMedia: true});
            this.user.stream = stream;

            try {
                this.myVideo.srcObject = stream;
            } catch (e) {
                this.myVideo.src = URL.createObjectURL(stream);
            }

            this.myVideo.play();
        });
    }

    setupPusher() {
        this.pusher = new Pusher(APP_KEY, {
            authEndpoint: "/pusher/auth",
            cluster: "ap2",
            auth: {
                params: this.user.id,
                header: {
                    "X-CSRF-Token": window.csrfToken,
                },
            },
        });

        this.channel = this.pusher.subscribe("presence-video-channel");

        this.channel.bind(`client-signal-${this.user.id}`, signal => {
            let peer = this.peers[signa.userId];

            // if peer is not already exists, its an incoming call.
            if (peer === undefined) {
                this.setState({
                    otherUserId: signal.userId,
                });

                peer = this.startPeer(signal.userId, false);
            }
        });
    }

    startPeer(peerId, isInitiator = true) {
        const peer = new Peer({
            initiator: isInitiator,
            stream: this.user.stream,
            trickle: false,
        });

        peer.on("signal", data => {
            this.channel.trigger(`client-signal-${peerId}`, {
                type: "signal",
                userId: this.user.id,
                data: data,
            });
        });

        peer.on("stream", stream => {
            try {
                this.userVideo.srcObject = stream;
            } catch (e) {
                this.userVideo.src = URL.createObjectURL(stream);
            }

            this.userVideo.play();
        });

        peer.on("close", () => {
            let peer = this.peers[peerId];
            if (peer !== undefined) {
                peer.destroy();
            }

            this.peers[peerId] = undefined;
        });
    }

    callTo(userId) {
        this.peers[userId] = this.startPeer(userId);
    }

    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">My Video</div>

                            <div className="card-body">
                                {[1, 2, 3, 4].map(userId => (
                                    <button onClick={() => this.callTo(userId)}>Call User {userId}</button>
                                ))}

                                <div className="video-container">
                                    <video className="my-video" ref={ref => {this.myVideo = ref;}}/>
                                    <video className="user-video" ref={ref => {this.userVideo = ref;}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
