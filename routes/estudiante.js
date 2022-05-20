const { Router } =  require('express')
const { check } = require('express-validator')

const   {
    obtenerEstudiantes,
    obtenerEstudiante,
    crearEstudiante,
    actualizarEstudiante,
    borrarEstudiante}   = require('../controllers').Estudiante;

const { validarCampos } = require('../middlewares');


const router =  Router();

////      https://localhost:5702/api

router.get('/', obtenerEstudiantes );
router.get('/:id', [ check('id', 'Su id de mongo no es vAlido').isMongoId() ], obtenerEstudiante );
router.post('/', [ check('cedula', 'El nombre es obligatorio').not().isEmpty(),
                    validarCampos,
                 ], crearEstudiante);
router.put('/:id',  actualizarEstudiante);
router.delete('/:id', [ check('id','No es vAlido este id').isMongoId() ] ,  borrarEstudiante);

module.exports = router;