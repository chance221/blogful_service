const ArticlesService = require('../src/articles-service');
const knex = require('knex');

describe(`Articles service object`, function() {
  
  let db;
  let testArticles = 
  [
    {
      id: 1,
      date_published: new Date('2029-01-22T16:28:32.615Z'),
      title: 'First test post!',
      content:'Loremm ipsum dolor sit amet consectetur'
    },
    {
      id: 2,
      date_published: new Date('2029-01-22T16:28:32.615Z'),
      title: 'Second test post!',
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
    },
    {
      id: 3,
      date_published: new Date('2029-01-22T16:28:32.615Z'),
      title: 'Third test post!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
    }
  ];

  before(() =>{
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })

  before(()=> db('blogful_articles').truncate())

  afterEach(() => db('blogful_articles').truncate())

  // before(()=>{
  //   return db
  //     .into('blogful_articles')
  //     .insert(testArticles)
  // });

  //Below is a test that fills the test database with articles held in the testArticles Array
  //Also note how the afterEach statement above clears the table AFTER EACH TEST
  //note context is the exact same as describe

  //describe(`getAllArticles()`, () => {
  context(`Given 'blogful_articles' has data`, ()=>{
    beforeEach(()=>{
      return db
      .into('blogful_articles')
      .insert(testArticles)
    })
    //it(`resolves all articles from 'blogful_articles' table`, () => {
      
    it(`getAllArticles() resolves all articles from 'blogful_articles' table`, () => {   
      
      /* test that ArticlesService.getAllArticles gets data from practice
      database that was filled with the data created above through running 
      psql script. We now pass that db into the 
      */
      return ArticlesService.getAllArticles(db)
        .then(actual=>{
          expect(actual).to.eql(testArticles)
        })
    })

    it(`getById() resolves an article by id from 'blogful_articles' table `, ()=>{
      
      const thirdId = 3

      const thirdTestArticle = testArticles[thirdId - 1]

      return ArticlesService.getById(db, thirdId)
        .then(actual =>{
          expect(actual).to.eql({
            id: thirdId,
            title: thirdTestArticle.title,
            content: thirdTestArticle.content,
            date_published: thirdTestArticle.date_published,
          })
        })
    })

    it(`deleteArticle() removes an article by id from 'bloggful_articles' table`, ()=>{
      const articleId = 3
      return ArticlesService.deleteArticle(db, articleId)
        .then(()=> ArticlesService.getAllArticles(db))
        .then(allArticles=>{
          //copy the test articles array without the "deleted article"
          const expected = testArticles.filter(article=> article.id !== articleId)
          expect(allArticles).to.eql(expected)
        })
    })

  })

  //Here we are testing that if the table has no data then it should return an empty array
  //It will be empty because we are emptying the data in each table after each test
  
  context(`Given 'blogful_articles' has no data`, ()=>{
    
    it(`getAllArticles() resolves an empty array`, ()=>{
      return ArticlesService.getAllArticles(db)
        .then(actual=>{
          expect(actual).to.eql([])
        })
    })

    it(`insertArticle() inserts a new article and resolves the new article with an 'id'`, () => {
    
      //test logic goes here for the inertArticle method
    
      const newArticle = {
      title: 'Test new title',
      content: 'Test new content',
      date_published: new Date('2020-01-01T00:00:00.000Z'),
      }

      return ArticlesService.insertArticle(db, newArticle)
    })

  })

  

  after(() => db.destroy()); //ends open connection to the database
})
