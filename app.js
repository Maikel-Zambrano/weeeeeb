const fs = require('fs');
const mongoose = require('mongoose');
//const express = require('express');
const {Client, MessageMedia} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios').default;
const cheerio = require('cheerio')
const SESSION_FILE_PATH = './session.json';
const ora = require('ora');
const chalk = require('chalk');

const express =  require('express');
const cors  =  require('cors');

const { dbConnection } =  require('./config');
const { Cheerio } = require('cheerio');
const { html } = require('cheerio/lib/api/manipulation');
const { Estudiante } = require('./models');
// const { Estudiante } = require('./models');
// const { response } =  require('express');

class Server {
    constructor(){
        this.app =  express();
        this.port = process.env.PORT;

        this.paths = {
            estudiantes: '/api/estudiantes'
        }

        this.conectarDB();
        this.middlewares();
        this.routes();
        
    }
    //// ASOCIAR RUTAS, MIDDLEWARES, LEVANTAR BASE DE DATOS
    async conectarDB(){
           await dbConnection();
    }
    middlewares(){
        this.app.use(cors());
        this.app.use(express.json());
        
    }
    routes(){
        this.app.use( this.paths.estudiantes  , require('./routes/estudiante') )
        
    }
    
    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Servidor corriendo en el puerto ${this.port}`)
        })

    }

}


module.exports = Server;


const sendMessage = (to,message) => {
    client.sendMessage( to, message)
 }
 
 const sendMedia = (to,file) => {
    const mediaFile = MessageMedia.fromFilePath(`./image/${file}`)
   client.sendMessage(to, mediaFile)
 }
  
 /**
 * Revisamos si tenemos credenciales guardadas para inciar sessio
 * este paso evita volver a escanear el QRCODE
 */
 const withSession = () => {
 // Si exsite cargamos el archivo con las credenciales
 const spinner = ora(`Cargando ${chalk.yellow('Validando session con Whatsapp...')}`);
 sessionData = require(SESSION_FILE_PATH);
 spinner.start();
 client = new Client({
   session: sessionData
 });

 client.on('ready', () => {
   console.log('Client is ready!');
   spinner.stop();
   listenMessage ();
   // sendMessage();
   // sendMedia();
   // connectionReady();
 });
 client.on('auth_failure', () => {
   spinner.stop();
   console.log(` ${chalk.blue('Error de autentificacion debes voler a generar el QRCODE e incluso Borrar el archivo "session.json" **')}`);
   client = new Client();
   client.on('qr', qr => {
       qrcode.generate(qr, { small: true });
   });
 
   client.on('ready', () => {
       console.log('Client is ready!');
       // connectionReady();
   });
 })
 client.initialize();
 }
 
 /**
 * Generamos un QRCODE para iniciar sesion
 */
 const withOutSession = () => {
 
 console.log('No tenemos session guardada');
 client = new Client();
 client.on('qr', qr => {
   qrcode.generate(qr, { small: true });
 });
 
 client.on('ready', () => {
   console.log(` ${chalk.blue('Ya puede estar en uso:  Client is ready !!!')}`);
   listenMessage ();
   // connectionReady();
 });
 
 client.on('auth_failure', () => {
   console.log(` ${chalk.blue('** Error de autentificacion debes volver a generar el QRCODE **')}`);
 })
 
 client.on('authenticated', (session) => {
   // Guardamos credenciales de de session para usar luego
   sessionData = session;
   fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
       if (err) {
           console.log(err);
       }
   });
 });
 
 client.initialize();
 }
 
 /**
 * Revisamos si existe archivo con credenciales!
 */
 (fs.existsSync(SESSION_FILE_PATH)) ? withSession() : withOutSession();
 



const listenMessage = () => {
  client.on('message', (msg)=>{
      const {from, to, body} =msg;
      
     
     
       if(body=='FACCI' || body=='Facci' || body=='facci' ){
         sendMessage(from, 'HOLA!!👋 te saluda el asistente virtual para el proceso de legalización. ¿En que te podemos ayudar?');
         sendMessage(from, 'ingresa el número de la opción que deseas acceder');
         sendMessage(from, '1.-información sobre el proceso de legalizacion \n 2.- requisitos para la legalizacion\n 3.-preguntas frecuentes \n 4.-¿tienes alguna duda?');
       }
       else{ 
        // sendMessage(from, 'por favor ingresa un número entre 1 y 4')
         if(body=='1'){
            sendMessage(from, 'el proceso de legalizacion en la facultad de ciencias informáticas es un requerimiento legal para confirmar la acreditación de un estudiante\
            de las materias que haya escogido y aprobado en el semestre anterior. \n dicho proceso se realiza en el departamento de secretariado de la Facultad')
            sendMessage(from,'gracias por su atención!!')
            sendMessage(from, 'si desea ver de nuevo las opciones del menú por favor ingrese el numero 0');
            
         }
         else{ 
             if(body=='2'){
          sendMessage(from, 'Te mostramos los requisitos para el proceso de legalización');
          sendMedia(from, 'imagen1.png');
          sendMedia(from,'imagen2.png')
          sendMessage(from, 'si desea ver de nuevo las opciones del menú por favor ingrese el numero 0');

          }
          else {
            if (body=='3'){ 
              sendMessage(from,'Por favor ingresa la letra (p) seguida del número de la pregunta que quieres realizar \n *ejemplo:(p1)');
              sendMessage(from, '1.- ¿cuando comienza el proceso de legalizacion? \n 2.-¿Qué sucede si no legalizo mi matricula? \n 3.- ¿Hasta que semestre debo legalizar mi matricula?  ');  
              sendMessage (from, 'si desea ver de nuevo las opciones del menú por favor ingrese el numero 0 ');
              
            }
            else{
              if(body=='4'){
                  sendMessage(from, 'en un momento un integrante de nuestro departamente se pondrá en contacto contigo.....')
                  sendMessage(from, '!!que tengas un buen dia')
              }
              else {
                if(body=='p1' || body=='P1'){
                     sendMessage(from, 'El proceso de legalizacion comienza el 29 de Enero del presente año para todos los estudiantes de la Facultad');
                     sendMessage (from, 'si desea ver de nuevo las opciones del menú por favor ingrese: el numero 3 ');
                   }else{
                    if(body=='p2' || body=='P2'){
                      sendMessage(from, 'En caso de no haber legalizado de manera oportuna su matricula en el secretariado de la facultad el estudiante no constará como \
                      aprobado al finalizar el semestre en el nivel correspondiente ');
                      sendMessage (from, 'si desea ver de nuevo las opciones del menú por favor ingrese el numero 3 ');
                         }else{
                          if(body=='p3' || body==' P3'){
                                  sendMessage(from, 'El proceso de legalización de la matricula inicia desde el primer semestre hasta el ultimo semestre \
                                  (decimo semestre)');
                                 sendMessage (from, 'si desea ver de nuevo las opciones del menú por favor ingrese el numero 0');
                                 }else{
                                   if (body=='0'){
                                  sendMessage(from, '1.-información sobre el proceso de legalizacion \n 2.- requisitos para la legalizacion\n 3.-preguntas frecuentes \n 4.-¿tienes alguna duda?');
                                 }else {
                                 }if(body!=0){
                                  sendMessage(from, 'disculpa no te entiendo');
                                  sendMessage(from,'Por favor ingresa la letra (p) seguida del número de la pregunta que quieres realizar \n *ejemplo:(p1)');

                                 }
                                 
                                 }
                         }
                   }
              }
            }
            
          }
         

          
         }
         
       }

      
       console.log(body);
   })
}
