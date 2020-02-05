const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const mqtt = require('./mqttCluster.js');

global.mtqqLocalPath = "mqtt://192.168.0.11";

var port = new SerialPort("/dev/ttyUSB0", {
  baudRate: 57600,
});

(async function(){
  var mqttCluster=await mqtt.getClusterAsync() 
  mqttCluster.subscribeData("rflinkTX", d => port.write(d.payload+"\r\n"));
  mqttCluster.subscribeData("stat/tasmota/RESULT", d => console.log(JSON.stringify(d)))
  console.log('listenging rflink rx now');
})();




const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
parser.on('data', process)

async function process(data){
  if (!data.includes('Oregon')){
    console.log(data)
  }
  var mqttCluster = await mqtt.getClusterAsync(); 
  mqttCluster.publishData('rflink',data)
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
  //port.write("10;TriState;802a60;10;ON;\r\n")
  //"20;46;TriState;ID=802a60;SWITCH=10;CMD=ON;"
  //10;NewKaku;0cac142;3;ON;
  
  mqttCluster.publishData(deviceType, dataObject);
}
