const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    });
}

const crearUsuario = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya se encuentra registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contrasena
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

        await usuario.save();

        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }

}

const actualizarUsuario = async (req, res = response) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                of: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email != email) {
            const existeEmail = await Usuario.findOne({ email: req.body.email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.status(200).json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const borrarUsuario = async (req, res = response) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                of: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Se elimino el usuario'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}