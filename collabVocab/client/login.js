Template.welcome.helpers({
  units: function() {
    return Units.find() //only subscribed to my units
  }
});

Template.welcome.events = ({
  'click .selfEval': function(){
    var unit_id = this._id
    Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.currentStage":"selfEval", "profile.currentUnitId": unit_id}})
    var newPage = parseInt(Meteor.user().profile.selfEval.page)
    Router.go('selfEval', {page: newPage}) 
  },
  'click .quiz': function(){
    var unit_id = this._id
    Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.currentStage":"quiz", "profile.currentUnitId": unit_id}})
    var newPage = parseInt(Meteor.user().profile.quiz.page)
    Router.go('quiz',{page: newPage})
  },
  'click .resultsSummary': function(){
    var unit_id = this._id
    Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.currentStage":"resultsSummary", "profile.currentUnitId": unit_id}})
    var newPage = parseInt(Meteor.user().profile.resultsSummary.page)
    Router.go('resultsSummary',{page: newPage})
  },
  
})