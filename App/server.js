const raspi = require('raspi');
const Serial = require('raspi-serial').Serial;

raspi.init(() => {
  var serial = new Serial({portId:'/dev/ttyUSB0', baudRate:57600});
  serial.open(() => {
    serial.on('data', (data) => {
      process.stdout.write(data);
    });
  });
});