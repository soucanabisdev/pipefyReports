const https = require('https'); // or 'https' for https:// URLs
const fs = require('fs');
const axios = require("axios");
const { url } = require('inspector');

var urlReport = ''


async function app (){

    var idReport = ''

   /* optionsPipe = {
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
        idReport = response.data.data.exportPipeReport.pipeReportExport
        return idReport
      })
      .catch(function (error) {
        console.log(error);
      });*/

      optionsPipe = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyIjp7ImlkIjozMDE5OTU2ODEsImVtYWlsIjoiZmVsaXBlcm9zZW5la0BnbWFpbC5jb20iLCJhcHBsaWNhdGlvbiI6MzAwMTQyMDIwfX0.JugAF92MqbUV_fLVKEcF5jUI3G4G2hlAmLeBJ-dEfsEIlX3gdKO1IfbQRUYvHvAk569vuD9K_zCrKylY6R6agw',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            query: '{ pipeReportExport(id: 304165464) { fileURL state startedAt requestedBy { id } } }'

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
    
   
      
}

app()

const file = fs.createWriteStream("relatorio.xlsx");
https.get("https://app-storage-service.pipefy.com/v1/signed/orgs/0ec0a956-43d7-4305-8b15-0faa0a513586/reports/94176a02-c43c-472f-93bb-f5c150149b8c/pedidos_concluidos_18-02-2023.xlsx?expires_on=1676734416&signature=tSk6op7xtjYXUTASMnqCsyUBTBu7nRcjVtfodR9%2BOYI%3D", function(response) {
   response.pipe(file);

   // after download completed close filestream
   file.on("finish", () => {
       file.close();
       console.log("Download Completed");
   });
});