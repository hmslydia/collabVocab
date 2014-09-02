//Organization.
// A unit has multiple stages (selfEval, quiz, resultSummary, etc.)
//
// Every stage has one StageMetaData entry that describes it's word_set and number of pages and stuff
// this is mostly to unify the stages (but it seems like a common pattern to have an aggregator object for a bunch of stuff.
//
// Every Stage has multiple StageData objects. 
// These are the "pages" or steps of each stage. 
// For example, a quiz page just has one word and some options
// a selfEval page has 3 words and you need to rate them all


Words = new Meteor.Collection("words");
/*
word:
definition:
*/

SelfEvals = new Meteor.Collection("selfEvals");
/*
  word_id: index into Words collection
  eval: (one of difficultyOptions)
  user_id:
  time:
  unit_id:
  
*/

QuizAnswers = new Meteor.Collection("quizAnswers");
/*
  word_id: index into Words collection
  answer: // text of the definition they chose as their answer (right now definitions don't have ids, they probably should
  user_id:
  time:
  unit_id:
*/

ResultsReview = new Meteor.Collection("resultsReview")
/*
  user_id:
  unit_id:
  // When people view the ResultSummary in the StageData, we can log that here.

*/

WordSets = new Meteor.Collection("wordSets");
/*
//this is used to construct the pages in a set
word_ids = [] //array of word_ids
*/

StageMetaData = new Meteor.Collection("stageMetaData"); 
/*
user_id:
creation_time:
stage_type: [selfEval, quiz, etc.]
num_pages:
word_set_id: word_set_id,
unit_id: Unit this stage belongs to
*/

StageData = new Meteor.Collection("stageData"); //I probably should have called this Pages
/*
user_id:
creation_time:
stage_meta_data_id: 
stage_type: [selfEval, quiz, etc.]
page: an integer indexing the page
public_data: ex. {word: "oblige", options; ["a", "b", "c"]}
private_data: ex. {answer: "b"}
unit_id: Unit this stage belongs to
*/

Units = new Meteor.Collection("units")
/*
user_id:
stages: [ {type: selfEval', stage_id: 00000000}  ] //ordered list, stage_id indexes into StageMetaData

*/