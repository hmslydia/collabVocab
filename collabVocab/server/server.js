var words = [
  {word: "a", definition: "A"},
  {word: "b", definition: "B"},
  {word: "c", definition: "C"},
  {word: "d", definition: "D"},
  {word: "e", definition: "E"},
  {word: "f", definition: "F"},
  {word: "g", definition: "G"},
  {word: "h", definition: "H"},
  {word: "i", definition: "I"}  
  ]
  
getTime = function(){
  return (new Date()).getTime()
}

Meteor.startup(function () {	
  var word_ids = []
  if (Words.find().count() === 0) {
    for (var i = 0; i < words.length; i++) {
			var thisWordObj = words[i]
      var word_id = Words.insert(thisWordObj)
      word_ids.push(word_id)
    }
  }
  
  if(WordSets.find().count() === 0){
    WordSets.insert({word_ids: word_ids})
  }
})

function augmentInsertObj(insertObj){
  insertObj.time = getTime()
  insertObj.user_id = Meteor.userId()
  insertObj.unit_id = Meteor.user().profile.currentUnitId
  return insertObj
}

function incrementPage(stage){
  var page = parseInt(Meteor.user().profile[stage].page)
  var numPages = parseInt(Meteor.user().profile[stage].numPages)
  //if this is the last page, don't increment, just set the status to completed

  if(page == (numPages-1)){
    //var varToSet = "profile."+stage+".status"
    Meteor.users.update({_id:Meteor.user()._id}, {$set: {"profile.quiz.status":"completed"}})
    diagnosticNumberCrunch(Meteor.userId(), Meteor.user().profile.currentUnitId)
  } else {
    if (page == 0){
      //var varToSet = "profile."+stage+".status"
      Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.quiz.status":"inProgress"}})
    }
    var newPage = page + 1
    //var varToSet = "profile."+stage+".page"
    Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.quiz.page": newPage }})    
  }  
}

Meteor.methods({
  submitSelfEval : function(selfEvals){
    _.each(selfEvals, function(selfEval){
      selfEval = augmentInsertObj(selfEval)
      SelfEvals.insert(selfEval)
    })
    
    //increment page
    var page = parseInt(Meteor.user().profile.selfEval.page)
    var numPages = parseInt(Meteor.user().profile.selfEval.numPages)
    //if this is the last page, don't increment, just set the status to completed
    if(page == (numPages-1)){
      Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.selfEval.status":"completed"}})
    } else {
      if (page == 0){
        Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.selfEval.status":"inProgress"}})
      }
      var newPage = page + 1
      Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.selfEval.page": newPage }})    
    }
  },
  
  submitQuizAnswer: function(answer){
    var quizAnswer = augmentInsertObj(answer)
    QuizAnswers.insert(quizAnswer)

    incrementPage("quiz")
  }
})

function createSelfEvalStage(user_id, word_set_id, wordsPerPage, unit_id){
  console.log('wpp', wordsPerPage)
  var stage_type = 'selfEval'
  //find out whice words we want to use
  var word_set = WordSets.findOne(word_set_id)

  var word_ids = word_set.word_ids
  var num_words = word_ids.length  
  
  var num_pages = Math.ceil(num_words/wordsPerPage)
  //enter something into the StageMetaData collection
  var stage_meta_data_id = StageMetaData.insert({
    user_id: user_id,
    creation_time: getTime(),
    stage_type: stage_type,
    num_pages: num_pages,
    word_set_id: word_set_id,
    unit_id: unit_id

  })
  
  _.each(word_ids, function(word_id, i){
    var wordObj = Words.findOne(word_id)
    var page = Math.floor(i/wordsPerPage)
    
    StageData.insert({
      user_id: user_id,
      stage_meta_data_id: stage_meta_data_id,
      stage_type: stage_type,
      page: page,
      public_data: wordObj,
      unit_id: unit_id
      //private_data: (none)
    })
  })
  return stage_meta_data_id
}

function createQuizStage(user_id, word_set_id, numAnswerOptions, unit_id){
  var stage_type = 'quiz'
  //find out whice words we want to use
  var word_set = WordSets.findOne(word_set_id)  
  var word_ids = word_set.word_ids
  var num_words = word_ids.length  
  
  var num_pages = num_words 
  
  var wordObjs = []
  
  _.each(word_ids, function(word_id){
    var wordObj = Words.findOne(word_id)
    wordObj.word_id = word_id
    wordObjs.push(wordObj)    
  })
  
  var pageObjs = []
  var wordObjs = _.shuffle(wordObjs)
  _.each(wordObjs, function(wordObj, i){
    var word = wordObj.word
    var page = i
    //start and array of definitions with the correct definition
    var answerOptions = [wordObj.definition] 
    
    //add more definitions that AREN'T this one
    var wordObjsMinusI = _.filter(wordObjs, function(wordObj){ return wordObj.word != word; });
    var wordObjsMinusI = _.shuffle(wordObjsMinusI)
    
    //take the first n of them
    for(var j = 0; j< numAnswerOptions; j++){
      var answerOption = wordObjsMinusI[j].definition
      answerOptions.push(answerOption)
    }
    //shuffle the definitions
    
    answerOptions = _.shuffle(answerOptions)
    
    pageObjs.push({
      page: page,
      word: word,
      word_id: wordObj.word_id,
      answerOptions: answerOptions
    })

  })
  
  //Insert Stuff
  var stage_meta_data_id = StageMetaData.insert({
    user_id: user_id,
    creation_time: getTime(),
    stage_type: stage_type,
    num_pages: num_pages,
    word_set_id: word_set_id,
    unit_id: unit_id

  })
   
  _.each(pageObjs, function(pageObj){    
    StageData.insert({
      user_id: user_id,
      stage_meta_data_id: stage_meta_data_id,
      stage_type: stage_type,
      page: pageObj.page,
      public_data: pageObj,
      unit_id: unit_id
      //private_data: (none)
    })
  })
  return stage_meta_data_id
  
}

createResultSummaryStage = function(user_id, word_set_id, unit_id){
//Insert Stuff
  var stage_type = "resultsSummary"
  var num_pages = 1
  var stage_meta_data_id = StageMetaData.insert({
    user_id: user_id,
    creation_time: getTime(),
    stage_type: stage_type,
    num_pages: num_pages,
    word_set_id: word_set_id,
    unit_id: unit_id
  })
   
  summary = {} //SUMMARY IS BLANK WHEN INITIALIZED, it will be populate after they complete the quiz   
  StageData.insert({
    user_id: user_id,
    stage_meta_data_id: stage_meta_data_id,
    stage_type: stage_type,
    page: 0,
    public_data: summary,
    unit_id: unit_id
    //private_data: (none)
  })
  
  return stage_meta_data_id  
}

//statuses: ['notStarted', 'inProgress', 'completed']


createDiagnosticUnit = function(user){
  var user_id = user._id
  
  // insert a new unit
  var unit_id = Units.insert({user_id: user_id, stages: []}) //for now, init to blank, will populate later

  var word_set = WordSets.findOne() //IMPROVE THIS
  var wordsPerPage = 3
  
  var selfEvalStageMetaDataId = createSelfEvalStage(user_id, word_set._id, wordsPerPage, unit_id)
  
  var numAnswerOptions = 5
  var quizStageMetaDataId = createQuizStage(user_id, word_set._id, numAnswerOptions, unit_id)
  
  var resultSummaryStageMetaDataId = createResultSummaryStage(user_id, word_set._id, unit_id)
  
  var stagesData = []
  stagesData.push({type: 'selfEval', id: selfEvalStageMetaDataId})
  stagesData.push({type: 'quiz', id: quizStageMetaDataId})
  stagesData.push({type: 'resultSummary', id: resultSummaryStageMetaDataId})
  
  
  
  Units.update({_id: unit_id}, {$set: {"stages": stagesData }})
  
  // initialize this unit for the user
  // (set the profile information )
  
  var diagnosticStages = ['selfEval', 'quiz', 'resultSummary']
  _.each(diagnosticStages,function(stage){
    user.profile[stage] = {}  
    user.profile[stage].page = 0
    user.profile[stage].status = "notStarted"
  })

  user.profile.currentStage = 'selfEval'
  user.profile.currentUnitId = unit_id
  user.profile.selfEval.numPages = StageMetaData.findOne(selfEvalStageMetaDataId).num_pages  
  user.profile.quiz.numPages = StageMetaData.findOne(quizStageMetaDataId).num_pages
  
}

/*
this will output an array of objects, one for each word

{
word:
word_id

defintiion:

difficultyEstimate:

quizAnswer:

correct: true/false
}
*/
diagnosticNumberCrunch = function(user_id, unit_id){
  var unit = Units.findOne(unit_id)
  var stages = unit.stages
  
  var selfEvalStageMetaDataId = stages[0].id
  var quizStageMetaDataId = stages[1].id
  var resultSummaryStageMetaDataId = stages[2].id
  
  var selfEvalData = SelfEvals.find({unit_id:unit_id}).fetch()
  var quizData = QuizAnswers.find({unit_id:unit_id}).fetch()
  
  
  _.each(selfEvalData, function(selfEval){
    var obj = {}
    
    obj.word_id = selfEval.word_id
    obj.difficultyOption = selfEval.eval
    
    var word = Words.findOne(selfEval.word_id)
    console.log(selfEval.word_id)
    obj.word = word.word
    obj.definition = word.definition
    
    var thisQuizData = _.filter(quizData, function(quizItem){
        return quizItem.word_id == selfEval.word_id
    })[0]

    
    obj.answer = thisQuizData.answerOption    
    obj.correct = (obj.answer == obj.definition)
    
    //insert obj into the StageData collection    
    StageData.insert({
      user_id: user_id,
      creation_time: getTime(),
      stage_meta_data_id: resultSummaryStageMetaDataId,
      stage_type: 'resultsSummary',
      page: 0,
      public_data: obj,
      private_data: [],
      unit_id: unit_id      
    })
  })
  
}

Accounts.onCreateUser(function(options, user) {
  // We're enforcing at least an empty profile object to avoid needing to check
  // for its existence later.
  user.profile = options.profile ? options.profile : {};
  
  createDiagnosticUnit(user)
  return user;
});