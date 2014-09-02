Template.welcome.events = ({
  'click #selfEval': function(){
    Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.currentStage":"selfEval"}})
    var newPage = parseInt(Meteor.user().profile.selfEval.page)
    Router.go('selfEval', {page: newPage}) 
    //Router.go('selfEval')
  },
  'click #quiz': function(){
    Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.currentStage":"quiz"}})
    var newPage = parseInt(Meteor.user().profile.quiz.page)
    Router.go('quiz',{page: newPage})
  },
  'click #resultsSummary': function(){
    Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.currentStage":"resultsSummary"}})
    var newPage = parseInt(Meteor.user().profile.resultsSummary.page)
    Router.go('resultSummary',{page: newPage})
  },
  
})