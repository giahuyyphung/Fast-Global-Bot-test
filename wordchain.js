const Discord = require("discord.js");

class WordChainGame {
    constructor(channel) {
        this.channel = channel;
        this.players = new Set();
        this.words = [];
        this.currentWord = '';
        this.turn = null;
        this.inProgress = false;
    }

    startGame() {
        if (this.inProgress) {
            this.channel.send("Trò chơi đã bắt đầu rồi!");
            return;
        }

        this.inProgress = true;
        this.channel.send("Trò chơi nối từ đã bắt đầu! Người chơi đầu tiên hãy nhập từ bắt đầu.");
    }

    addPlayer(player) {
        this.players.add(player);
    }

    sendTurnMessage() {
        if (this.turn) {
            this.channel.send(`Lượt của ${this.turn.username}, hãy nối từ với từ cuối cùng là **${this.currentWord}**`);
        }
    }

    processWord(message) {
        if (!this.inProgress) return;

        const word = message.content.trim();
        const player = message.author;

        if (!this.currentWord || word.startsWith(this.currentWord.slice(-1))) {
            if (!this.isValidWord(word)) {
                this.channel.send("Từ không hợp lệ hoặc đã được sử dụng, vui lòng thử lại!");
                return;
            }

            this.words.push(word);
            this.currentWord = word;
            this.addPlayer(player);
            this.turn = this.getNextPlayer(player);
            this.sendTurnMessage();
        } else {
            this.channel.send("Từ phải bắt đầu bằng ký tự cuối của từ trước!");
        }
    }

    isValidWord(word) {
        // Kiểm tra từ đã được sử dụng chưa
        if (this.words.includes(word)) return false;

        // Kiểm tra từ có đúng 2 chữ hay không
        if (word.split(' ').length !== 2) return false;

        return true;
    }

    getNextPlayer(currentPlayer) {
        const players = Array.from(this.players);
        const currentIndex = players.indexOf(currentPlayer);
        return players[(currentIndex + 1) % players.length];
    }

    endGame() {
        this.channel.send("Trò chơi kết thúc!");
        this.resetGame();
    }

    resetGame() {
        this.players.clear();
        this.words = [];
        this.currentWord = '';
        this.turn = null;
        this.inProgress = false;
    }
}

module.exports = WordChainGame;
