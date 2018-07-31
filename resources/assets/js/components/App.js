import React, {Component} from "react";
import MediaHandler       from "./../MediaHandler";

class App extends Component {
    constructor() {
        super();

        this.state = {
            hasMedia: false,
            otherUserId: null,
        };

        this.mediaHandler = new MediaHandler();
    }

    componentWillMount() {
        this.mediaHandler.getPermissions().then(stream => {
            this.setState({hasMedia: true});

            try {
                this.myVideo.srcObject = stream;
            } catch (e) {
                this.myVideo.src = URL.createObjectURL(stream);
            }

            this.myVideo.play();
        });
    }

    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">My Video</div>

                            <div className="card-body">
                                <div className="video-container">
                                    <video className="my-video" ref={ref => {this.myVideo = ref;}}></video>
                                    <video className="user-video" ref={ref => {this.userVideo = ref;}}></video>
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
