const Information = require('../Models/Information');
require('dotenv').config();
class NewsController {

    async getAllNews(req, res) { // GET ALL NEWS 
        try {
            var result = await Information.find();
            if (result) {
                let data = []
                result.forEach((info) => {
                    var infoObject = {
                        Id: info['_id'],
                        Title: info['Title'],
                        ImageUrl: info['ImageUrl'],
                        Details: info['Details'],
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

    async setNews(req, res) { // ADD NEW NEWS

        try {
            var Title = req.body.Title;
            var Details = req.body.Details;
            var ImageUrl = req.body.ImageUrl;
            if (Title && Details && ImageUrl) {
                const news = new Information({
                    Title: Title,
                    Details: Details,
                    ImageUrl: ImageUrl,
                });
                const result = await news.save();
                if (result) {
                    res.status(200).send({ message: 'News Saved!!', data: result });
                    return;
                }
                else {
                    res.status(400).send({ error: 'Could not Save news' });
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
    async deleteNews(req, res) { // DELETE NEWS AFTER GETTING ID.
        var Id = (req.body._Id).toString();
        try {
            if (Id.length > 0) {
                var result = await Information.deleteOne({ _id: Id });
                if (result) {
                    res.status(200).send({ message: 'News Deleted!!' });
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

module.exports = new NewsController();