const fs = require('fs')

const Usuario = require('../models/usuario')
const Medico = require('../models/medico')
const Hospital = require('../models/hospital')

const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

const actualizarImagen = async (tipo, id, nombreArchivo) => {
    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) return false;

            const pathMedico = `./uploads/medicos/${medico.img}`;
            borrarImagen(pathMedico);

            medico.img = nombreArchivo;
            await medico.save();
            return true;
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) return false;

            const pathHospital = `./uploads/hospitales/${hospital.img}`;
            borrarImagen(pathHospital);

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) return false;

            const pathUsuario = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathUsuario);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
        default:
            break;
    }
}

module.exports = {
    actualizarImagen
}