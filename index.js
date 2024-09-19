const express = require('express');
const Pool = require('pg').Pool
const bodyparser = require('body-parser')
const app =express();
app.use(bodyparser.json())
app.use(
    bodyparser.urlencoded({
        extended : true,
    })
)

// creating pool here

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'api',
    password : 'password',
    port : '5555'
})

app.get('/' , function(req , res){
    res.json("welcome to server")
})

app.post('/blog' ,async function(req , res){
    const {title , content , author} = req.body;

    try {
        const result = await pool.query('INSERT INTO blog (title , content , author) VALUES ($1 , $2 , $3) RETURNING * ',[title , content , author]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message :"server down / error"
        })
    }
})

app.get('/blogs' , async function(req , res){
    try {
        const result = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
        res.status(200).json(
            result.rows
        )
    } catch (error) {
        res.status('500').json({
            message :"server down , not able to access rn"
        })
    }
});


app.delete('/deleteblog' , function(req , res){
    
})

app.get('/allBlog' , function(req , res){
    pool.query('SELECT * FROM Blogs',(err , result)=>{
        if(err){
            throw err
        }else{
            res.status(200).json(result.rows)
        }
    })
})

app.listen(3000 , function(req , res){
    console.log("server 3000 par hai")
})