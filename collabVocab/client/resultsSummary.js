Template.resultsSummary.helpers({
  
  results: function() {
    var page = parseInt(Meteor.user().profile.resultsSummary.page)
    var stageData = StageData.find({page:page}).fetch()
    if(stageData != undefined){  
      var correctAnswers = _.filter(stageData, function(data){
        return data.public_data.correct
      })
      var numCorrect = correctAnswers.length
      
      var incorrectAnswers = _.filter(stageData, function(data){
        return !data.public_data.correct
      })
      var numIncorrect = incorrectAnswers.length
      var numTotal = stageData.length
      var percentCorrect = Math.floor( (numCorrect/numTotal) * 100)
      console.log(correctAnswers)
      var resultsObj = {
        numCorrect: numCorrect,
        numIncorrect: numIncorrect,
        numTotal: numTotal,
        percentCorrect: percentCorrect,
        correctAnswers: correctAnswers, //_.pluck(correctAnswers, function(x) {return x.public_data}),
        incorrectAnswers: incorrectAnswers, //_.pluck(incorrectAnswers, function(x) {return x.public_data}),
      }
      console.log(resultsObj)
      return resultsObj
      
      
    }
  },
  
  
});