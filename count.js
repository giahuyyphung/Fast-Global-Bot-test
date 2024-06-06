const Discord = require('discord.js');

class CountingGame {
    constructor(channel) {
        this.channel = channel;
        this.currentNumber = 0;
        this.lastUser = null;
        this.inProgress = false;
    }

    startGame() {
        this.currentNumber = 0;
        this.lastUser = null;
        this.inProgress = true;
        this.channel.send('Trò chơi đếm số bắt đầu! Hãy bắt đầu với số 1.');
    }

    endGame() {
        this.inProgress = false;
        this.channel.send('Trò chơi kết thúc.');
    }

    resetGame() {
        this.currentNumber = 0;
        this.lastUser = null;
        this.channel.send('Trò chơi đã được reset. Hãy bắt đầu lại với số 1.');
    }

    async processCount(message) {
        const content = message.content.trim();
        const nextNumber = this.currentNumber + 1;

        // Kiểm tra nếu tin nhắn chứa hình ảnh
        if (message.attachments.size > 0) {
            await message.react('❌');
            this.channel.send('Không chấp nhận hình ảnh. Trò chơi sẽ được reset.');
            this.resetGame();
            return;
        }

        // Kiểm tra nếu người chơi nhập công thức toán học hoặc số
        const validExpression = /^[\d\s+\-*/()]+$/;
        if (!validExpression.test(content)) {
            await message.react('❌');
            this.channel.send('Nhập không hợp lệ. Trò chơi sẽ được reset.');
            this.resetGame();
            return;
        }

        try {
            const result = eval(content);
            if (result !== nextNumber) {
                await message.react('❌');
                this.channel.send(`Sai số! Bạn phải nhập số ${nextNumber}. Trò chơi sẽ được reset.`);
                this.resetGame();
                return;
            }
        } catch (error) {
            await message.react('❌');
            this.channel.send('Nhập không hợp lệ. Trò chơi sẽ được reset.');
            this.resetGame();
            return;
        }

        // Kiểm tra nếu người chơi đếm hai lần liên tiếp
        if (message.author.id === this.lastUser) {
            await message.react('❌');
            this.channel.send('Bạn không thể đếm hai lần liên tiếp. Trò chơi sẽ được reset.');
            this.resetGame();
            return;
        }

        // Cập nhật trạng thái trò chơi
        this.currentNumber = nextNumber;
        this.lastUser = message.author.id;
        await message.react('✅');
    }
}

module.exports = CountingGame;
