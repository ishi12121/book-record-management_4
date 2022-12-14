 const express = require("express");

 const dotenv = require('dotenv');

 // database connection
 const DbConnection = require("./databaseConnection");
 // JSON data import
 const {users} = require('./data/users.json');
//importing routes
const userRouter = require("./routes/users");
const booksRouter = require("./routes/books");

dotenv.config();


 const app = express();

 DbConnection();

 const PORT = 8081;

 app.use(express.json());

 app.get('/',(req,res) => {
    res.status(200).json({
        Message: "Server is up and running"

    });
});

app.use('/users', userRouter);
app.use('/books', booksRouter);

/**
 * Route: /users
 * Method: GET
 * Description: Get all users  
 * Access: Public
 * parameters: None
 */
app.get('/users/:id',(req,res) =>{
    const {id} = req.params
    const user = users.find((each) => each.id === id  );
    if (!user) {
        return res.status(404).json({
        success:false,
        message:"User not found",
        });
    }
    return res.status(200).json({
        success: true,
        data: user,
        
    });
});

/**
 * Route: /users/:id
 * Method: GET
 * Description: Get single user by id 
 * Access: Public
 * parameters: None
 */

app.get('/users', (req,res) =>{
    res.status(200).json({
        success: true,
        data: users,
    });
});

/**
 * Route: /users
 * Method: POST
 * Description: Create new user 
 * Access: Public
 * parameters: None
 */
app.post('/users',(req,res) => {
    const {id,name,surname,email,subscriptionType,subscriptionDate} = 
    req.body;

    const user = users.find((each) => each.id === id);

    if(user){
        return res.status(404).json({
            success: false,
            message: "User exists with this id",

        });

    }

    users.push({
        id,
        name,
        surname,
        email,
        subscriptionDate,
        subscriptionType,
    });
    return res.status(201).json({
        success: true,
        data: users,

    });

});

/**
 * Route: /users/:id
 * Method: PUT
 * Description: Updating  user data 
 * Access: Public
 * parameters: id
 */
app.put('/users/:id', (req,res) =>{
    const {id} = req.params;
    const {data} = req.body;

    const user = users.find((each) => each.id === id);

    if(!user) 
    return res.status(404).json({success: false, message: "User not found"});

const updatedUser = users.map((each) => {
    if(each.id === id){
        return {
            ...each,
            ...data,
        };

    }

    return each;
});

return res.status(200).json({
    success: true,
    data: updatedUser,
});


});


/**
 * Route: /users/:id
 * Method: DELETE
 * Description: Delete a user by id
 * Access: Public
 * parameters: id
 */

app.delete('/users/:id', (req,res) => {
    const {id} = req.params;
    const user = users.find((each) => each.id === id);

    if(!user){
        return res.status(202).json({
            success: false,
            message: "User to be deleted was not found",

        });

    }

    const index = users.indexOf(user);
    users.splice(index,1);

    return res.status(200).json({ success: true, data: users});

});



app.get("*",(req,res) =>{
    res.status(404).json({
        message: "This route does not exist",

    });
});


 app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
 });