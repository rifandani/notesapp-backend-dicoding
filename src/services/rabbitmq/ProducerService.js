const amqp = require('amqplib');

const ProducerService = {
  sendMessage: async (queue, message) => {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);

    // objek channel yg dgunakan untuk memanggil API dlam mengoperasikan transaksi protokol AMQP
    const channel = await connection.createChannel();

    // membuat channel baru bila channel yang diperiksa tidak ada
    await channel.assertQueue(queue, {
      durable: true, // menjaga agar queue tetap tersedia ketika server message broker restart
    });

    // kirim pesan dalam bentuk Buffer, message dalam bentuk string
    await channel.sendToQueue(queue, Buffer.from(message));

    // tutup koneksi setelah satu detik berlangsung dari pengiriman pesan
    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

module.exports = ProducerService;
