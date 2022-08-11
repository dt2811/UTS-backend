const stationrouter=require('express').Router();
const StationController=require('../Controllers/Station');

stationrouter.get('/get-station',StationController.getAllStations);
stationrouter.post('/set-station',StationController.setStation);
stationrouter.delete('/delete-station',StationController.deleteStation);
module.exports=stationrouter;