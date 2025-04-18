const express = require('express')
const { Pool } = require('pg');
const bcrypt = require('bcrypt')
const cors = require('cors')
const app = express()
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

app.use(cors({
    origin: "http://localhost:3000", // Local frontend dev server
    credentials: true
  }));
  
app.use(express.json())

const {PGHOST,
    PGDATABASE,
    PGUSER,
    PGPASSWORD} = process.env
const pool = new Pool({
    host: PGHOST,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: {
        require: true
    }
})

const authenticateToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
      jwtToken = authHeader.split(" ")[1];
      
    }
    if (jwtToken === undefined) {
      response.status(401).json({msg: "Invalid JWT Token"});
    } else {
      jwt.verify(jwtToken, "MY_TOKEN", async (error, payload) => {
        if (error) {
            response.status(401).json({msg: "Invalid User Details"});
        } else {
            request.user = payload
            next();
        }
      });
    }
};

app.get('/showadmin', authenticateToken, async (request, response) => {
    const client = await pool.connect()
    try{
        // console.log(request.user) all the details of user is here
        const tableCreationQuery = `
           SELECT * FROM admin
        `
        const result = await client.query(tableCreationQuery)
        response.json(result.rows)
    }
    catch(err){
        response.json({msg: 'some internal error occured'})
    }
    finally{
        client.release()
    }
})

app.post("/admin-login", async (request, response) => {
    const client = await pool.connect()
    try{
        const {useremail, userpassword} = request.body
        const searchUserquery = `SELECT * FROM admin WHERE email='${useremail}'`
        const result = await client.query(searchUserquery)
        if(result.rows.length === 0){
            return response.status(401).json({msg: "Invalid user email"})
        }
        const {name, email, password} = result.rows[0]
        if(email === useremail){
            const isPasswordMatched = await bcrypt.compare(userpassword, password)
            const payload = {name: name, email: useremail, password: userpassword}
            if(isPasswordMatched){
                const jwtToken = jwt.sign(payload, "MY_TOKEN")
                return response.json({jwtToken: jwtToken})
            }
            else{
                
                return response.status(401).json({msg: 'Invalid Password'})
            }
        }
        else{
            return response.status(401).json({msg: "Invalid user email"})
        }

    }
    catch(err){
        response.json({msg: 'some internal error occured'})
    }
    finally{
        client.release()
    }

})

app.post('/admin-signup', async (request, response) => {
    const client = await pool.connect()
    try{
        const {name,password,email} = request.body
        if(!name || !password || !email){
            return response.json({msg: 'email or password or name not be empty'})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const searchUser = `SELECT * FROM admin WHERE email='${email}'`
        const result = await client.query(searchUser)
        if(result.rows.length > 0){
            response.json({msg: 'username or email already exists!!'})
        }
        else{
            const insertionquery = `
                INSERT INTO admin(name,email,password)
                VALUES('${name}', '${email}', '${hashedPassword}')
            `
            await client.query(insertionquery)
            response.json({msg: "data inserted successfully"})
        }
    }
    catch(err){
        response.json({msg: "Some Internal Error Happened"})
    }
    finally{
        client.release()
    }
})

app.get('/products', async (request,response)=>{
    
    const client = await pool.connect()
    try{
        const getProductQuery = `SELECT * FROM product`
        const result = await client.query(getProductQuery)
        response.json(result.rows)
    }
    catch(err){
        response.status(404).json({msg: 'Some Internal Error Occured'})
    }
    finally{
        client.release()
    }
})

app.post('/add-product', authenticateToken, async (request,response) => {
    const client = await pool.connect()
    try{
        const {productName, pricePerUnit, productImgUrl} = request.body
        if(!productName || !pricePerUnit || !productImgUrl){
            return response.status(400).json({msg: 'please fill all the product detail'})
        }
        
        const insertDataQuery = `
            INSERT INTO product(product_name, price_per_unit, product_img_url)
            VALUES('${productName}', ${parseInt(pricePerUnit)}, '${productImgUrl}');
        `
        await client.query(insertDataQuery)
        response.status(200).json({msg: 'product created successfully'})
    }
    catch(err){
        response.json({msg: 'Some Internal Error Occured'})
    }
    finally{
        client.release()
    }
})

app.delete("/admin-delete/:deleteEmail", async (request,response) => {
    const client = await pool.connect()
    try{
        const {deleteEmail} = request.params
        await client.query(`DELETE FROM admin WHERE email = '${deleteEmail}'`)
        response.json("admin deleted successfully")
    }
    catch(err){
        response.status(404).json({msg: "Some Internal Error Occured"})
    }
    finally{
        client.release()
    }
})


app.post("/order/placed", async (request,response) => {
    const client = await pool.connect()
    try{
        const {order_id, product_id, quantity, buyer_name, contact_info, delivery_address} = request.body
        if(!product_id || !quantity || !buyer_name || !contact_info || !delivery_address){
            return response.status(400).json({msg: 'please fill all the order info'})
        }
        const insertDataQuery = `
            INSERT INTO orders(order_id, product_id, quantity, buyer_name, contact_info, delivery_address)
            VALUES('${order_id}', ${product_id}, ${quantity}, '${buyer_name}', '${contact_info}', '${delivery_address}');
        `
        await client.query(insertDataQuery)
        response.status(200).json({msg: 'Order placed successfully'})

    }
    catch(err){
        response.status(404).json({msg: "Some Internal Error Occured"})
    }
    finally{
        client.release()
    }
})



app.get("/show-order/:orderId", async (request,response) => {
    const client = await pool.connect()
    try{
        const {orderId} = request.params
        if(!orderId){
            return response.status(400).json({msg: 'please fill  the order Id'})
        }
        const selectquery = `
            SELECT * FROM orders WHERE order_id='${orderId}'
        `
        const result = await client.query(selectquery)
        if(result.rows.length > 0){
            return response.status(200).json(result.rows)
        }
        else{
            return response.status(400).json({msg: 'Invalid Order Id'})
        }

    }
    catch(err){
        response.status(404).json({msg: "Some Internal Error Occured"})
    }
    finally{
        client.release()
    }
})


app.get("/show/allordered/product",authenticateToken, async (request,response) => {
    const client = await pool.connect()
    try{
        const selectquery = `
            SELECT * FROM orders INNER JOIN product ON orders.product_id=product.product_id
        `
        const result = await client.query(selectquery)
        if(result.rows.length > 0){
            return response.status(200).json(result.rows)
        }
        else{
            return response.status(400).json({msg: 'Invalid Order Id'})
        }

    }
    catch(err){
        response.status(404).json({msg: "Some Internal Error Occured"})
    }
    finally{
        client.release()
    }
})


app.put('/update-product', authenticateToken, async(request, response) => {
    const client = await pool.connect()
    try{
        const {status,orderId} = request.body
        if(!orderId){
            return response.status(400).json({msg: 'Please Provide OrderId'})
        }
        const selectquery = `
            SELECT * FROM orders Where order_id = '${orderId}'
        `
        const result = await client.query(selectquery)
        if(result.rows.length > 0){
            const updateQuery = `
                UPDATE orders
                SET status = '${status}'
                WHERE order_id = '${orderId}';
            `
            await client.query(updateQuery)
            return response.status(200).json({msg: 'Status updated Successfully'})
        }
        else{
            return response.status(400).json({msg: 'Invalid Order Id'})
        }

    }
    catch(err){
        response.status(404).json({msg: "Some Internal Error Occured"})
    }
    finally{
        client.release()
    }
})

app.listen(3001 || process.env.PORT, () => {
    console.log('server is listening at port 3000')
})

module.exports = app