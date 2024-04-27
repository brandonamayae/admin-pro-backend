const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("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");

async function googleVerify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "817985495331-8u41le1eblm93lil1i231eofjertim5o.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload);
    // If the request specified a Google Workspace domain:
    // const domain = payload['hd'];

    return payload;
}

module.exports = {
    googleVerify
}