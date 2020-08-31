
import React from "react";
import { connect } from 'react-redux';
import socketIOClient from "socket.io-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LZString from 'lz-string';
import AES from 'crypto-js/aes';
import enc_utf8 from 'crypto-js/enc-utf8';
import { toast } from "react-toastify";
import 'styles/chatbox.scss';
import Request from 'Model/Request';
import EmojisTab from './EmojisTab.jsx';
import AbstractModal from 'Containers/Modals/AbstractModal.jsx';

class ChatBoxContainer extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            text: '',
            emojisTabShowFlag: false,
            uploadModalShowFlag: false,
            downloadModalShowFlag: false,
            isUploading: false,
        };
        this.downloadMessage = null;
        this.me = this.props.userInfo;
        this.socket = socketIOClient();
        this.downloadImg = this.downloadImg.bind(this);
    }

    toggleEmojiTabShowFlag = (flag = !this.state.emojisTabShowFlag) => {
        if (!flag) {
            $("#message-text").focus();
        }
        this.setState({ emojisTabShowFlag: flag });
    }

    appendEmojiToText = (emoji) => {
        let { text } = this.state;
        if (text.length == 200) return;
        const ind = $("#message-text").index();
        this.setState({ text: text + emoji });
    }

    setupImgDownload = (message) => {
        this.downloadMessage = message;
        this.toggleDownloadModalShowFlag();
    }

    getMessage = (message, key) => {
        const me = this.me || {};
        return <div key={key} className="chatbox-message-box-outer">
            <div className={`chatbox-message-box chatbox-message-align-${message.from._id == me._id ? 'right' : 'left'}`}>
                <div className="chatbox-message-from">
                    <b>{message.from._id == me._id ? 'You' : message.from.name}</b>
                    <span className="chatbox-message-time">{moment(message.createdAt).format('h:mm a')}</span>
                </div>
                {message.type == 1 ? <span className="chatbox-message-link" onClick={() => this.setupImgDownload(message)}>{message.file.name}</span> :
                    <span className="chatbox-message-text">{message.text}</span>}
            </div >
        </div>
    }

    getMessages = () => {
        const { messages } = this.state;
        return <div>
            {messages.map(this.getMessage)}
        </div>;
    }

    setText = (e) => {
        let value = e.target.value;
        if (value.length > 200) value = value.substr(0, 200);
        this.setState({ text: value })
    }

    pushMessage = (message) => {
        this.state.messages.push(message);
        const flag = message.from._id == this.me._id;
        if (flag) this.state.text = '';
        this.forceUpdate(() => {
            if (flag) this.scrollToBottom();
        });
    }

    sendMessage = (e) => {
        e.preventDefault();
        let text = this.state.text.trim();
        if (text.length == 0) return;
        Request.post("user/message", { text, type: 0 }).catch(error => toast.error(error.message));
    }

    getEmojisTab() {
        return <div className={`emojis-tab-outer emojis-tab-outer-${this.state.emojisTabShowFlag}`}>
            <EmojisTab onClick={this.appendEmojiToText} />
        </div>;
    }

    getFooter() {
        return <form onSubmit={this.sendMessage}>
            <div className="d-flex">
                <button className="sg-btn-primary emoji-button" type="button"
                    onClick={() => this.toggleEmojiTabShowFlag()}>😄</button>
                <input id="message-text"
                    autoComplete="off"
                    autoFocus={true}
                    onChange={this.setText}
                    // onFocus={() => this.toggleEmojiTabShowFlag(false)}
                    value={this.state.text} />
                <button className="sg-btn-primary send-button"
                    onClick={this.toggleUploadModalShowFlag}
                    type="button"><FontAwesomeIcon icon="upload" /></button>
                <button className="sg-btn-primary send-button"
                    type="submit"><FontAwesomeIcon icon="paper-plane" /></button>
            </div>
        </form>;
    }

    logout() {
        Request.delete('user/logout').then(resp => location.reload());
    }

    toggleUploadModalShowFlag = () => {
        this.setState({ uploadModalShowFlag: !this.state.uploadModalShowFlag });
    }

    toggleDownloadModalShowFlag = () => {
        this.setState({ downloadModalShowFlag: !this.state.downloadModalShowFlag });
    }

    uploadImg = (e) => {
        e.preventDefault();
        this.setState({ isUploading: true });
        const file = document.getElementById("upload-img").files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            const text = event.target.result;
            const etext = AES.encrypt(text, $("#img-upload-password").val()).toString();
            const content = LZString.compressToUTF16(etext);
            Request.post("user/message", { type: 1, file: { content, name: file.name } }).then(resp => {
                this.setState({ isUploading: false });
                this.toggleUploadModalShowFlag();
            }).catch(error => {
                this.setState({ isUploading: false });
                toast.error(error.message)
            });
        });
        reader.readAsDataURL(file);
    }

    getUploadModalBody() {
        return <form onSubmit={this.uploadImg}>
            <div><input id="upload-img" type="file" accept="image/*" required /></div>
            <label htmlFor="img-upload-password">Password</label>
            <div><input type="password" id="img-upload-password" required /></div>
            {this.state.isUploading && <div>Uploading please wait...</div>}
            <div className="d-flex">
                <button className="sg-btn m-auto" type="submit">Upload</button>
            </div>
        </form>;
    }

    getUploadModal() {
        return <AbstractModal
            header="Upload"
            body={this.getUploadModalBody()}
            show={this.state.uploadModalShowFlag}
            onClose={this.toggleUploadModalShowFlag} />
    }

    async downloadImg(e) {
        e.preventDefault();
        let { content } = this.downloadMessage.file;
        if (!content) {
            const { _id } = this.downloadMessage;
            try {
                const resp = await Request.get(`user/message/${this.downloadMessage._id}`);
                content = this.downloadMessage.file.content = LZString.decompressFromUTF16(resp.file.content);
            } catch (e) {
                return toast.error(e.message);
            }
        }
        let text;
        try {
            text = AES.decrypt(content, $("#img-download-password").val()).toString(enc_utf8);
        } catch (e) {
            return toast.error("Invalid password");
        }
        var element = document.createElement('a');
        element.setAttribute('href', text);
        element.setAttribute('download', this.downloadMessage.file.name);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    getDownloadModalBody() {
        return <form onSubmit={this.downloadImg}>
            <label htmlFor="img-download-password">Password</label>
            <div><input type="password" id="img-download-password" required autoFocus /></div>
            <div className="d-flex">
                <button className="sg-btn m-auto" type="submit">Download</button>
            </div>
        </form>;
    }

    getDownloadModal() {
        return <AbstractModal
            header="Download"
            body={this.getDownloadModalBody()}
            show={this.state.downloadModalShowFlag}
            onClose={this.toggleDownloadModalShowFlag} />
    }

    render() {
        return <div className={`chatbox`}>
            {this.getUploadModal()}
            {this.getDownloadModal()}
            <div className="chatbox-header sg-bg-primary">
                <span className="chatbox-title">Messages</span>
                <button className="sg-btn" onClick={this.logout}>Logout</button>
            </div>
            <div className="chatbox-body">
                {this.getMessages()}
            </div>
            <div className="chatbox-footer">
                {this.getFooter()}
                {this.getEmojisTab()}
            </div>
        </div>;
    }

    scrollToBottom() {
        var scroll = $('.chatbox-body');
        scroll.animate({ scrollTop: scroll.prop("scrollHeight") }, 500);
    }

    fetchMessages() {
        Request.get(`user/messages`)
            .then(messages => this.setState({ messages }));
    }

    componentDidMount() {
        this.scrollToBottom();
        this.fetchMessages();
        this.socket.on('EC_NEW_MESSAGE', this.pushMessage);
    }
}

export default connect(state => state)(ChatBoxContainer);