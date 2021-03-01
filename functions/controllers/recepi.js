const functions = require("firebase-functions");
const express = require('express');
const cors = require('cors');

const admin = require('firebase-admin');
const { firestore } = require("firebase-admin");
admin.initializeApp();  

const db = admin.firestore();

const recepiApp = express();

recepiApp.use(cors({origin:true}));

recepiApp.get('/', async (req, res) => {
    const snapshot = await db.collection('recepy').get();

    let recepi = [];
    snapshot.forEach(doc => {
        let id = doc.id;
        let data = doc.data;    

        recepi.push({id, ...data})
    });

    res.status(200).send(JSON.stringify(recepi));
});

recepiApp.get("/:id", async (req, res)=>{
    const snapshot = await db.collection('recepy').doc(req.params.id).get();

    const recepyId = snapshot.id;
    const recepyData = snapshot.data;

    res.status(200).send(JSON.stringify({id: recepyId, ...recepyData}))
});

recepiApp.post('/', async (req, res) => {
    const recepi = req.body;
    await db.collection('recepy').add(recepi);
    res.status(201).send();
});

recepiApp.put('/:id', async (req, res) => {
    const body = req.body;
    await db.collection('recepy').doc(req.params.id).update({body});

    res.status(200).send();
});

recepiApp.delete("/:id", async(req, res) => {
    await db.collection('recepi').doc(req.params.id).delete();
    
    res.status(200).send();
});

exports.recepi = functions.https.onRequest(app);