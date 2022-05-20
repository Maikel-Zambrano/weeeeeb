const {Schema, model} =  require('mongoose');


const EstudianteSchema = Schema({
    nombres:{
        type:String
    },
    estado:{
        type: Boolean,
        default: true,
        required:true
    },
    apellidos:{
        type: String
    },
    celular:{
        type:String
    },
    cedula:{
        type:String
    }
})

EstudianteSchema.methods.toJSON = function(){
    const { __v, estado,  ...data } =  this.toObject();
    return data;
}

module.exports= model('Estudiante', EstudianteSchema)
