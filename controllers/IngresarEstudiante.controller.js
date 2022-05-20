const {Estudiante} = require('../models')

// function postEstudiante(req, res){
//     const { body } = req;
//     //const estudent=Estudiantes.push(body);
//     Estudiante.create(body);
//     res.status(200).send({mensaje: 'Dato insertado correctamente'})
//   }
  async function postEstudiante(req, res){
let estudiante=[];
    const { body } = req;
        //const estudent=Estudiantes.push(body);
        Estudiante.create(body)
        const newEstudiante= estudiante.push(Estudiante);
        
        res.status(200).send({estudiante})
        }
  module.exports=postEstudiante;