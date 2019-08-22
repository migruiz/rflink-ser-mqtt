const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
var port = new SerialPort("/dev/ttyUSB0", {
  baudRate: 57600,
});
const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
parser.on('data', process)

function process(data){
  data = someText = data.replace(/(\r\n|\n|\r)/gm,"");
  var segments = data.toString().split(";")
  if (segments[0]!=="20"){
    return;
  }
  if (segments[0]==="00"){
    return;
  }
  const deviceType = segments[2];
  var dataObject ={deviceType:deviceType}  
  for (let index = 3; index < segments.length; index++) {
    const labelElement = segments[index];
    var subSegments = labelElement.split("=");
    const key = subSegments[0];
    const value = subSegments[1]
    if (value){
      dataObject[key] = value
    }
  }
  console.log(JSON.stringify(dataObject));
}