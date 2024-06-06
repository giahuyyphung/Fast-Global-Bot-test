const Discord = require("discord.js");

class CountingGame {
    constructor(channel) {
        this.channel = channel;
        this.currentNumber = 1;
        this.lastUser = null;
        this.inProgress = true;
    }

    async handleMessage(message) {
        if (!this.inProgress) return;

        // Kiểm tra nếu người dùng gửi hình ảnh
        if (message.attachments.size > 0) {
            await message.reply("Không hình ảnh!");
            this.resetGame();
            return;
        }

        const content = message.content.trim();
        const user = message.author;

        // Kiểm tra nếu người dùng nhập số hoặc biểu thức toán học đúng
        if (this.isValidCount(content)) {
            const nextNumber = eval(content);
            if (nextNumber === this.currentNumber && user !== this.lastUser) {
                await message.react("✅");
                this.currentNumber++;
                this.lastUser = user;
            } else {
                await message.react("❌");
                if (user === this.lastUser) {
                    await message.reply("Bạn không thể count 2 lần liên tục!");
                } else {
                    await message.reply("Sai số!");
                }
                this.resetGame();
            }
        } else {
            await message.react("❌");
            await message.reply("Sai số!");
            this.resetGame();
        }
    }

    isValidCount(content) {
        // Kiểm tra nếu content chỉ chứa số hoặc biểu thức toán học hợp lệ
        return /^(\d+|\d+[\+\-\*\/]\d+)$/.test(content);
    }

    resetGame() {
        this.currentNumber = 1;
        this.lastUser = null;
        this.inProgress = true;
    }
}

module.exports = CountingGame;
