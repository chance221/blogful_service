/*Examples of queries using Postgre and Knex*/

const knex = require('knex')
require('dotenv').config() //notice how you imported the .env file. THIS IS IMPORTANT IN SET THIS AS THE CONFIG FOR A MODULE


//this establishes the connection instance
const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});


//another way of connecting without using the .env file.

// const knexInstance = knex({
//   client: 'pg',
//   connection: {
//     host: '127.0.0.1',
//     user:'dunder_mifflin',
//     password:'dunder',
//     database:'knex-practice'
//   }
// });

console.log('knex and driver installed correctly');


//find the first result in the amazong_products table that has the name 'Point of view gun'
knexInstance
.select('product_id', 'name', 'price', 'category')
.from('amazong_products')
.where({name: 'Point of view gun'})
.first()//ONLY RETURNS THE FIRST RESULT(for more efficient querying)
.then(result=>{
    console.log(result)
  })


  //the function below uses ILIKE (LIKE STATEMENT that is case insensitive)
function searchByProductName (searchTerm){
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result=>{
      console.log(result)
    })

};

searchByProductName('holo');


//We can use LIMIT and OFFSET in the query to dictate how many 
//results will be sent back at a time and keep an index on which results need to be shown

function paginateProducts(page) {
  const productsPerPage = 10;
  const offset = productsPerPage * (page -1)
  knexInstance
  .select('product_id', 'name', 'price', 'category')
  .from('amazong_products')
  .limit(productsPerPage)
  .offset(offset)
  .then(result =>{
    console.log(result)
  })
}

paginateProducts(2);



// when we are looking for data that is or is not null we need to use IS NOT NULL or in knex whereNotNull 

function getProductsWithImages(){
  knexInstance
  .select('product_id', 'name', 'price', 'category', 'image')
  .from('amazong_products')
  .whereNotNull('image')
  .then(result => {
    console.log(result)
  })
}

getProductsWithImages();

/*for more complicated queries the query itself will look alot more different than the knex query

this is what a query that groups views in the last 30 days by region


SELECT video_name, region, count(date_viewed) AS views
FROM whopipe_video_views
  WHERE date_viewed > (now() - '30 days'::INTERVAL)
GROUP BY video_name, region
ORDER BY region ASC, views DESC;'

below is what the knex query will look like
*/



function mostPopularVideosForDays(days) {
  knexInstance
    .select('video_name', 'region')
    .count('date_viewed AS views')
    .where(
      'date_viewed',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
    )
    .from('whopipe_video_views')
    .groupBy('video_name', 'region')
    .orderBy([
      { column: 'region', order: 'ASC' },
      { column: 'views', order: 'DESC' },
    ])
    .then(result => {
      console.log(result)
    })
}

mostPopularVideosForDays(30);