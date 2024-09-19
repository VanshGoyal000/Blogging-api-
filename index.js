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


app.get('/blogs/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // 4. Update a blog by ID
  app.put('/blogs/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, author } = req.body;
    try {
      const result = await pool.query(
        'UPDATE blogs SET title = $1, content = $2, author = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
        [title, content, author, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // 5. Delete a blog by ID
  app.delete('/blogs/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
app.listen(3000 , function(req , res){
    console.log("server 3000 par hai")
})