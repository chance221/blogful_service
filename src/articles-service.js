/* 
Services area a way to modularize code so you Dont Repeat Yourself (DRY)
by encapsulating functionality so that you group together methods that 
perform related task.

Below you are creating an object to store related methods

This is the essence of ccreating a microservice. 

*/

const ArticlesService = {

  getAllArticles(knex){
    // AS we want this to occur asyncronously we need to return a promise
    return knex
    .select('*')
    .from('blogful_articles')
  },

  insertArticle(knex, newArticle){
    return knex
      .insert(newArticle)
      .into('blogful_articles')
      .returning('*')
      .then(rows=>{
        return rows[0]
      })
  },

  getById(knex, id){
    return knex
    .from('blogful_articles')
    .select('*').where('id', id).first()
  },

  deleteArticle(knex, id){
    return knex('blogful_articles')
      .where({ id })
      .delete()
  },

  updateArticle(knex, id, newArticleFields){
    return knex('blogful_articles')
      .where({id})
      .update(newArticleFields)
  },


};



module.exports = ArticlesService;