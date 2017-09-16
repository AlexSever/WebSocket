import React from 'react';
import io from 'socket.io-client';
const socket = io();

export default class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            message: '',
            messages: []
        }
    }

    componentDidMount() {
        socket.on('new_message', (message) => {
            let messages = this.state.messages.slice();
            messages.push(message);
            this.setState({ messages });
        });
    }

    componentWillUnmount() {
        socket.emit('disconnect');
    }

    handleMessageInput = (event) => {
        this.setState({ message: event.target.value });
    };

    handleUsernameInput = (event) => {
        this.setState({ username: event.target.value });
    };

    sendMessage = () => {
        const message  = this.state.message;
        const username = this.state.username || 'Anonymous';
        if (message) {
            socket.emit('message', { username, message });
            this.setState({ message: '' });
        }
    };

    handleKeyDown = (e) => {
        if (e.keyCode == 13 ) {
            return this.sendMessage();
        }
    };

    render() {

        const messages = this.state.messages.map((message, i) => {
            return (
                <li key={i} style={{ listStyle: 'none' }}>
                    <strong>{ message.username + ': ' }</strong>
                    { message.message }
                </li>
            )
        });

        return (
            <div>
                <ul>
                    { messages }
                </ul>
                <input
                    placeholder="username"
                    value={ this.state.username }
                    onChange={ this.handleUsernameInput }
                />
                <input
                    placeholder="message"
                    value={ this.state.message }
                    onChange={ this.handleMessageInput }
                    onKeyDown={ this.handleKeyDown }
                />
                <button onClick={ this.sendMessage }>
                    Send
                </button>
            </div>
        );
    }
}