const reader = require('xlsx')
const axios = require("axios");
const express = require('express');
const api = express();
api.use(express.json());
api.use(express.urlencoded({
  extended: true
}));
const https = require('https');
const fs = require('fs');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

api.get('/novo-relatorio', async (req, res) => {
 
  var idReport = ''
  var urlReport = ''

 optionsPipe = {
      method: 'POST',
      headers: {
          'accept': 'application/json',
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyIjp7ImlkIjozMDE5OTU2ODEsImVtYWlsIjoiZmVsaXBlcm9zZW5la0BnbWFpbC5jb20iLCJhcHBsaWNhdGlvbiI6MzAwMTQyMDIwfX0.JugAF92MqbUV_fLVKEcF5jUI3G4G2hlAmLeBJ-dEfsEIlX3gdKO1IfbQRUYvHvAk569vuD9K_zCrKylY6R6agw',
          'Content-Type': 'application/json'
      },
      data: JSON.stringify({
          query: 'mutation { exportPipeReport(input: {pipeId: 301587647, pipeReportId: 300369040}) { pipeReportExport { id fileURL report { id } } } }'

      })
  };

  await axios('https://api.pipefy.com/graphql', optionsPipe)
    .then(function (response) {
      idReport = response.data.data.exportPipeReport.pipeReportExport.id
      return idReport
    })
    .catch(function (error) {
      console.log(error);
    });


    await delay(10000)
 
    optionsPipe = {
      method: 'POST',
      headers: {
          'accept': 'application/json',
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyIjp7ImlkIjozMDE5OTU2ODEsImVtYWlsIjoiZmVsaXBlcm9zZW5la0BnbWFpbC5jb20iLCJhcHBsaWNhdGlvbiI6MzAwMTQyMDIwfX0.JugAF92MqbUV_fLVKEcF5jUI3G4G2hlAmLeBJ-dEfsEIlX3gdKO1IfbQRUYvHvAk569vuD9K_zCrKylY6R6agw',
          'Content-Type': 'application/json'
      },
      data: JSON.stringify({
          query: '{ pipeReportExport(id: '+idReport+') { fileURL state startedAt requestedBy { id } } }'

      })
  };

  await axios('https://api.pipefy.com/graphql', optionsPipe)
    .then(function (response) {

      urlReport = response.data.data.pipeReportExport.fileURL

      return urlReport
    })
    .catch(function (error) {
      console.log(error);
    });

    file = fs.createWriteStream("relatorio.xlsx");
   
      https.get(urlReport,  function(response) {
        response.pipe(file);

        file.on("finish", () => {
            file.close();
            console.log("NOVO RELATÓRIO CRIADO!   - "+idReport+" - "+req.body.hour+":"+req.body.minute+"h");
            console.log(urlReport)
            console.log()
        });
      });
      res.send("<h4>Relatório criado com sucessso!</h4>")

      res.status(200).end()
})

  api.get('/', async (req, res) => {
    
    const xlsx = `${__dirname}/relatorio.xlsx`;
    res.download(xlsx)

  })

  api.listen(process.env.PORT || 3000, () => {
      console.log('API RUN!');
    });
  