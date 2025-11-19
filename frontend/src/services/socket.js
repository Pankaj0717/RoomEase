import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    if (!this.socket) {
      this.socket = io('http://localhost:5000', {
        transports: ['websocket'],
        reconnection: true
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
        if (userId) {
          this.socket.emit('register', userId);
        }
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  sendMessage(messageData) {
    this.emit('sendMessage', messageData);
  }

  onReceiveMessage(callback) {
    this.on('receiveMessage', callback);
  }

  onUserTyping(callback) {
    this.on('userTyping', callback);
  }

  emitTyping(data) {
    this.emit('typing', data);
  }
}

export default new SocketService();