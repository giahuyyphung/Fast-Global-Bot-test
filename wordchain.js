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
        this.channel.send("Trò chơi nối từ đã bắt đầu!");
        this.setRandomWord();
    }

    addPlayer(player) {
        if (!this.players.includes(player)) {
            this.players.push(player);
        }
    }

    setRandomWord() {
        const randomWords = ['con cá', 'cá chim', 'chim sẻ', 'sẻ non'];
        this.currentWord = randomWords[Math.floor(Math.random() * randomWords.length)];
        this.words.push(this.currentWord);
        this.channel.send(`Từ bắt đầu là: **${this.currentWord}**`);
        this.sendTurnMessage();
    }

    sendTurnMessage() {
        this.channel.send(`Lượt của ${this.players[this.turn].username}, hãy nối từ với từ cuối cùng là **${this.currentWord}**`);
    }

    processWord(word, player) {
        if (!this.inProgress) return;

        if (player === this.lastPlayer) {
            this.channel.send("Bạn không thể nối 2 lần liên tiếp!");
            this.resetGame();
            return;
        }

        if (this.containsImage(word)) {
            this.channel.send("Không được gửi hình ảnh!");
            this.resetGame();
            return;
        }

        if (!this.isValidWord(word)) {
            this.channel.send("Từ không hợp lệ hoặc đã được sử dụng, vui lòng thử lại!");
            this.resetGame();
            return;
        }

        const lastChar = this.currentWord.split(' ').pop();
        const firstChar = word.split(' ')[0];
        if (firstChar === lastChar) {
            this.words.push(word);
            this.currentWord = word;
            this.lastPlayer = player;
            this.turn = (this.turn + 1) % this.players.length;

            // Bỏ qua lượt nếu người chơi hiện tại là người chơi cuối cùng
            if (this.players[this.turn] === this.lastPlayer) {
                this.turn = (this.turn + 1) % this.players.length;
            }

            player.send("✅");
            this.sendTurnMessage();
        } else {
            this.channel.send("Từ phải bắt đầu bằng ký tự của từ cuối cùng!");
            this.resetGame();
        }
    }

    isValidWord(word) {
        if (this.words.includes(word)) return false;
        if (word.split(' ').length !== 2) return false;
        return true;
    }

    containsImage(message) {
        return message.attachments && message.attachments.some(attachment => attachment.width);
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
}

module.exports = WordChainGame;
