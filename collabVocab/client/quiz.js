
Template.quiz.helpers({

  publicData: function() {
    var page = parseInt(Meteor.user().profile.quiz.page)
    var stageData = StageData.findOne()
    if(stageData != undefined){      
      return stageData.public_data
    }
  },
  
  answerOptions: function(){
    var page = parseInt(Meteor.user().profile.quiz.page)
    var stageData = StageData.findOne()
    if(stageData != undefined){
      var word_id = stageData.public_data.word_id
      var answerOptions = stageData.public_data.answerOptions

      var answerOptionObjs = []
      _.each(answerOptions, function(answerOption){
        var answerOptionObj = {}
        answerOptionObj.word_id = word_id
        answerOptionObj.answerOption = answerOption
        answerOptionObjs.push(answerOptionObj)
      })
      return answerOptionObjs
    }
  }
});



function submitQuizAnswer(answer) {
    Meteor.call('submitQuizAnswer', answer, function(){
      goToNextQuizPage()
    })      
}


function goToNextQuizPage(){  
  var quizStatus = Meteor.user().profile.quiz.status  
  if (quizStatus == "completed" ){
    Router.go('welcome')
  }else{
    var page = Meteor.user().profile.quiz.page
    Router.go('quiz',{page: page}) 
  }
  
}

Template.quiz.events({
  'click .answerOption' : function(event) {
    submitQuizAnswer(this);
  }
});
