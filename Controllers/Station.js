const Station = require('../Models/Station');
require('dotenv').config();
class StationController {
    async getAllStations(req, res) { // GETTING ALL STATIONS 
        try {
            var result = await Station.find(); //FETCHING ALL STATIONS
            if (result) {
                let data = []
                result.forEach((info) => { // MANIPULATING THE STATIONS OBJECT
                    var infoObject = {
                        Id: info['_id'],
                        Name: info['Name'],
                        Coordinates: info['Coordinates'],
                        ShortForm: info['ShortForm'],
                    }
                    data.push(infoObject);
                });
                res.status(200).send({ data: data });
            }
            else {
                res.status(200).send({ data: [] });
            }

        }
        catch (error) {
            console.log(error);
            res.status(400).send({ error: 'oops error occured at backend' });
        }
    }

    async setStation(req, res) { // ADD NEW STATION VALUE
       
        try {
            var Name = (req.body.Name).toString();
            var ShortForm = (req.body.ShortForm).toString();
            var Coordinates = (req.body.Coordinates).toString();
            if (Name.length > 0 && ShortForm.length > 0 && Coordinates.length > 0) {
                const station = new Station({
                    Name: Name,
                    ShortForm: ShortForm,
                    Coordinates: Coordinates,
                }); // ADD NEW STATION
                const result = await station.save(); // SAVE NEW STATION 
                if (result) {
                    res.status(200).send({ message: 'Station Saved!!', data: result });
                    return;
                }
                else {
                    res.status(400).send({ error: 'Could not add station' });
                    return;
                }
            }
            else {
                res.status(400).send({ error: 'Send proper data' });
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).send({ error: 'oops error occured at backend' });
        }
    }
    
    async deleteStation(req, res) { // DELETE STATION FROM ID
        var Id = (req.body._Id).toString();
        try {
            if (Id.length > 0) {
                var result = await Station.deleteOne({ _id: Id });
                if (result ) {
                    res.status(200).send({ message: 'Station Deleted!!' });
                    return;
                }
                else {
                    res.status(400).send({ error: 'Could not Delete news' });
                    return;
                }
            }
            else {
                res.status(400).send({ error: 'Send proper data' });
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).send({ error: 'oops error occured at backend' });
        }
    }

}

module.exports = new StationController();