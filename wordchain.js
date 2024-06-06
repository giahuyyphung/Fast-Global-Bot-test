const Discord = require("discord.js");

class WordChainGame {
    constructor(channel) {
        this.channel = channel;
        this.players = [];
        this.words = [];
        this.currentWord = '';
        this.turn = 0;
        this.inProgress = false;
        this.lastPlayer = null;
    }

    startGame() {
        if (this.inProgress) {
            this.channel.send("Trò chơi đã bắt đầu rồi!");
            return;
        }

        this.inProgress = true;
        this.channel.send("Trò chơi nối từ đã bắt đầu! Người chơi đầu tiên hãy bắt đầu với một từ!");

        // Đặt người chơi hiện tại là null để bắt đầu mới
        this.lastPlayer = null;
    }

    addPlayer(player) {
        if (!this.players.includes(player)) {
            this.players.push(player);
        }
    }

    sendTurnMessage() {
        this.channel.send(`Lượt của ${this.players[this.turn].username}, hãy nối từ với từ cuối cùng là **${this.currentWord}**`);
    }

    processWord(word, player) {
        if (!this.inProgress) return;

        if (player === this.lastPlayer) {
            this.channel.send("Bạn không thể đi hai lượt liên tiếp!");
            return;
        }

        if (!this.isValidWord(word)) {
            this.channel.send("Từ không hợp lệ hoặc đã được sử dụng, vui lòng thử lại!");
            return;
        }

        if (!this.currentWord || word.startsWith(this.currentWord[this.currentWord.length - 1])) {
            this.words.push(word);
            this.currentWord = word;
            this.lastPlayer = player;
            this.turn = (this.turn + 1) % this.players.length;
            this.sendTurnMessage();
        } else {
            this.channel.send("Từ phải bắt đầu bằng ký tự của từ cuối cùng!");
        }
    }

    isValidWord(word) {
        if (this.words.includes(word) || word.split(' ').length !== 2) return false;
        return true;
    }

    endGame() {
        this.channel.send("Trò chơi kết thúc!");
        this.resetGame();
    }

    resetGame() {
        this.players = [];
        this.words = [];
        this.currentWord = '';
        this.turn = 0;
        this.inProgress = false;
        this.lastPlayer = null;
    }

    resetGameCommand() {
        this.channel.send("Trò chơi đã được reset!");
        this.resetGame();
    }
}

module.exports = WordChainGame;
