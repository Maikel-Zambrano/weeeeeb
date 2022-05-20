const { Estudiante } = require('../models')
const { response } =  require('express');
const obtenerEstudiantes= async (req, res = response)=>{

    const { limite= 10, desde=0 } =  req.query;
    const query = { estado:true }
    
    const [ total, estudiantes  ] =  await Promise.all(
        [
            Estudiante.countDocuments(query),
            Estudiante.find(query).skip(desde).limit(limite)
        ]
    );

    res.json({
        total, 
        estudiantes
    })
}

const obtenerEstudiante = async (req, res = response)=>{
    const { id } =  req.params
    const estudiante = await Estudiante.findById(id)
    res.json(estudiante)
}
const crearEstudiante= async (req, res= response)=>{
    const { estado,  ...body } = req.body;

    const existeEstudiante =  await Estudiante.findOne({ cedula: body.cedula });
    if (existeEstudiante)
    {
        return res.status(400).json({
            msg:`El Estudiante con cedula: ${existeEstudiante.cedula} ya existe`
        })
    }

    const data  = {
        ...body,
        cedula: body.cedula
    }

    const estudiante =  new Estudiante(data);
    const estudianteNuevo =  await estudiante.save()
    res.status(201).json(estudianteNuevo);

}
const actualizarEstudiante= async  (req, res = response)=>{
    const { id } =  req.params;
    const { estado,  ...data } = req.body;
    const estudianteModificado = await  Estudiante.findByIdAndUpdate(id, data, {new: true } );
    res.json(estudianteModificado);

}
///  DELETE   http://localhost:3000/api/productos/27364527345723645
const borrarEstudiante=async (req, res= response)=>{
    const { id } =  req.params;
    const EstudianteBorrado = await  Estudiante.findByIdAndUpdate(id, { estado:false }, {new: true } );
    res.json(EstudianteBorrado);
}

module.exports = {
    obtenerEstudiantes,
    obtenerEstudiante,
    crearEstudiante,
    actualizarEstudiante,
    borrarEstudiante
};