const newsrouter=require('express').Router();
const NewsController=require('../Controllers/News');

newsrouter.get('/get-news',NewsController.getAllNews);
newsrouter.post('/set-news',NewsController.setNews);
newsrouter.delete('/delete-news',NewsController.deleteNews);
module.exports=newsrouter;