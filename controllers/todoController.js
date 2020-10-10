var mongoose=require('mongoose');
var bodyParser = require('body-parser');

//connect to database
mongoose.connect('mongodb+srv://test:test@cluster0.faay7.mongodb.net/todo?retryWrites=true&w=majority',{ useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }).catch(error => handleError(error));

//create a schema <- this is like a blueprint
var todoSchema = new mongoose.Schema({
  item: String
});

var Todo = mongoose.model("Todo", todoSchema);

// var itemOne = Todo({item: 'buy flowers'}).save(function(err){
//   if(err) throw err;
//   console.log('item saved');
// });

// var data = [
//   {item: 'get milk'},
//   {item: 'shopping'},
//   {item: 'play'}
// ]
 var urlencodedParser = bodyParser.urlencoded({extended:false});

module.exports = function(app){
  app.get('/todo', function(req,res){
    //get data from mongoDB and pass it to view
    Todo.find({}, function(err, data){
      if(err) throw err;
      res.render('todo', {todos: data});

    });
  });
  app.post('/todo',urlencodedParser, function(req,res){
    //get data from the view and add it to mongodb
    var newTodo = Todo(req.body).save(function(err, data){
      if(err) throw err;
      res.json(data);
    });

  });
  app.delete('/todo/:item', function(req,res){
    //delete the requested item from mongodb
    Todo.find({item:req.params.item.replace(/\-/g, " ")}).remove(function(err, data){
      if(err) throw err;
      res.json(data);
    });
  });
}
