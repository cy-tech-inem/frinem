const { default: axios } = require('axios');
var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var C = xbee_api.constants;
require('dotenv').config()

const API_URL = process.env.API_URL;
const SERIAL_PORT = process.env.SERIAL_PORT;
var check_weight = false;
var double_check_weight = false;
var weight = 0;
const idOfXbee = 1;

axios.defaults.headers.common['Content-type']='application/json'
axios.defaults.headers.common['authorization']='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiWGJlZSRGcmluZW0iLCJpYXQiOjE2NDM5NzI5NTh9.7iDC3r_zyRjEOgRkoa0NHWyPTP-_yH_7OZK6DAeLlQE'

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 1
});

let serialport = new SerialPort(SERIAL_PORT, {
  baudRate: 9600,
}, function (err) {
  if (err) {
    return console.log('Error: ', err.message)
  }
});

serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);

serialport.on("open", function () {
  var frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.AT_COMMAND,
    command: "NI",
    commandParameter: [],
  };

  xbeeAPI.builder.write(frame_obj);

  frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: "FFFFFFFFFFFFFFFF",
    command: "NI",
    commandParameter: [],
  };
  xbeeAPI.builder.write(frame_obj);

});

// All frames parsed by the XBee will be emitted here

// storage.listSensors().then((sensors) => sensors.forEach((sensor) => console.log(sensor.data())))

xbeeAPI.parser.on("data", function (frame) {

  //on new device is joined, register it

  //on packet received, dispatch event
  //let dataReceived = String.fromCharCode.apply(null, frame.data);
  if (C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET === frame.type) {
    console.log("C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET");
    let dataReceived = String.fromCharCode.apply(null, frame.data);
    console.log(">> ZIGBEE_RECEIVE_PACKET >", dataReceived);

  }


  if (C.FRAME_TYPE.NODE_IDENTIFICATION === frame.type) {
    console.log("NODE_IDENTIFICATION");

  } else if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {

    console.log("----------------------")
    console.log(frame.digitalSamples.DIO0)
    console.log(frame.analogSamples)
    // if (frame.digitalSamples.DIO0 === 0){
    //   console.log("Quantité ajouté")
    //   axios.put("API_URL/products/1/quantity-increase")
    // }
    // optimisation de la requête pour récupérer les info du produit lié à une area
    
    axios.get(API_URL+"/areas/" + idOfXbee).then(res =>{

      // Si on n'arrive pas a récupérer les infos de l'area, on quitte
      if (!res?.data?.data?.area) {
        return
      }
      const product = res.data.data.area.product;
      const product_id = product.id
      const product_quantity = product.quantity;
      const product_weight = product.weight;
      const sensor_weight = frame.analogSamples.AD3;

      // Si aucun produit n'est associé a l'area, on quitte
      if (!product_id) {
        return
      }

      // Si on connait le poid du produit, on vérifie si le poid detecté change
      if (product_weight){
        check_weight = Math.abs(weight-sensor_weight) > (product_weight/2);
        // On update la quantité
        if (check_weight) {
          const value = sensor_weight/product_weight;
          const newQuantity = (value - Math.floor(value) - 0.5) < 0 ? Math.floor(sensor_weight/product_weight) : Math.ceil(sensor_weight/product_weight)
          axios.put(API_URL + "/products/" + product_id + "/quantity/" + newQuantity)
        }

      } else {
        check_weight = Math.abs(weight-sensor_weight) > 50;
        
        // On update du produit
        if (check_weight || double_check_weight) {
          if (double_check_weight) {
            axios.put(API_URL+"/products/"+product_id+"/weight/"+(sensor_weight/product_quantity))
            double_check_weight = false
          }
          else if (check_weight) {
            double_check_weight = true;
          }
        } else {
          double_check_weight = false
        }
      }

      
      
      weight = sensor_weight;
      check_weight = false
      
      // Si le poid detecté a changé, on update le poid du produit
      if (check_weight && !product_weight){
      }

      console.log(product);
    })
    console.log("----------------------")


  } else if (C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE === frame.type) {
    console.log("REMOTE_COMMAND_RESPONSE")
  } else {
    console.debug(frame);
    let dataReceived = String.fromCharCode.apply(null, frame.commandData)
    console.log(dataReceived);
  }

});
