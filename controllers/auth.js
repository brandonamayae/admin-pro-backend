const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            res.status(404).json({
                ok: false,
                msg: 'Las credenciales son invalidas'
            });
        }

        const validPassword = bcryptjs.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            res.status(400).json({
                ok: false,
                msg: 'Las credenciales son invalidas'
            });
        }

        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error, hable con el administrador'
        });
    }
}

module.exports = {
    login
}