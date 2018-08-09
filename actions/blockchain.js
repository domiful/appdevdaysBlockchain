import axios from 'axios';



const endpoint = "http://129.213.53.222:4001/bcsgw/rest/v1/transaction/query";
const addEndpoint = "http://129.213.53.222:4001/bcsgw/rest/v1/transaction/invocation";

//For if this were actually secured
//const aToken = "Basic Y2xvdWQuYWRtaW46bG9vc0VANkRPdUJMZQ==";
//const backID = "627a3a2d-67df-4188-bfad-4a30273f2254";



export async function listAllVehicles() {
      /*
            For if this were actually secured
            var auth = {
                headers: {
                    "Authorization": aToken,
                    "Oracle-Mobile-Backend-ID": backID,
                    'Content-Type': 'application/json'
                }
            }
      */

      let message = {
                "channel":"mychannel",
                "chaincode":"dmvcc",
                "method":"listAllVehicles",
                "args":[],
                "chaincodeVer":"v1"
        };

      return axios.post(endpoint, message)//, auth)
        .then(function (response) {
          console.log(response);
          return response;
      })
        .catch(function (error) {
          console.log(error);
          return false;
        });
}

export async function listDealerVehicles(dealer) {
    /*
          For if this were actually secured
          var auth = {
              headers: {
                  "Authorization": aToken,
                  "Oracle-Mobile-Backend-ID": backID,
                  'Content-Type': 'application/json'
              }
          }
    */

    let message = {
              "channel":"mychannel",
              "chaincode":"dmvcc",
              "method":"listVehiclesFromDealer",
              "args":[dealer],
              "chaincodeVer":"v1"
      };

    return axios.post(endpoint, message)//, auth)
      .then(function (response) {
        console.log(response);
        return response;
    })
      .catch(function (error) {
        console.log(error);
        return false;
      });
}

export async function getVehicle(vin) {
    /*
          For if this were actually secured
          var auth = {
              headers: {
                  "Authorization": aToken,
                  "Oracle-Mobile-Backend-ID": backID,
                  'Content-Type': 'application/json'
              }
          }
    */

    let message = {
              "channel":"mychannel",
              "chaincode":"dmvcc",
              "method":"readVehicle",
              "args":[vin],
              "chaincodeVer":"v1"
      };

    return axios.post(endpoint, message)//, auth)
      .then(function (response) {
        //console.log(response);
        return response;
    })
      .catch(function (error) {
        console.log(error);
        return false;
      });
}

export async function getVehicleHistory(vin) {
    /*
          For if this were actually secured
          var auth = {
              headers: {
                  "Authorization": aToken,
                  "Oracle-Mobile-Backend-ID": backID,
                  'Content-Type': 'application/json'
              }
          }
    */

    let message = {
              "channel":"mychannel",
              "chaincode":"dmvcc",
              "method":"getHistoryForRecord",
              "args":[vin],
              "chaincodeVer":"v1"
      };

    return axios.post(endpoint, message)//, auth)
      .then(function (response) {
        console.log(response);
        return response;
    })
      .catch(function (error) {
        console.log(error);
        return false;
      });
}

export async function addCertifiedPart(message){

  console.log(message);
  return axios.post(addEndpoint, message)//, auth)
    .then(function (response) {
        console.log(response);
        return response;
    })
    .catch(function (error) {
      console.log(error);
      return false;
    });
}