Router.map(function(){
  this.route('welcome',{
    path: "/",
    yieldTemplates: {
      'header': {to: 'header'}
    },
    waitOn: function(){ 
      //var user_id = Meteor.userId()
      return [
        Meteor.subscribe('units'), 
        //Meteor.subscribe('stages'), 
        //Meteor.subscribe('stageData'),
        //Meteor.subscribe('stageData', this.params.page)
        ] 
    },
    action: function () {
      if(this.ready() ||  Meteor.user() ){
        this.render()
      }
    }
  })

  this.route('selfEval', {
    //path: "selfEval/", //
    path: "selfEval/:page",
    yieldTemplates: {
      'header': {to: 'header'}
    },
    layoutTemplate: 'standardLayout',
    waitOn: function(){ 
      //var user_id = Meteor.userId()
      return [
        Meteor.subscribe('words'), 
        Meteor.subscribe('stages'), 
        //Meteor.subscribe('stageData'),
        Meteor.subscribe('stageData', this.params.page)
        ] 
    },
    action: function () {
      if(this.ready() ||  Meteor.user() ){
        this.render()
      }
    }
  })
  
  this.route('quiz', {
    //path: "selfEval/", //
    path: "quiz/:page",
    yieldTemplates: {
      'header': {to: 'header'}
    },
    layoutTemplate: 'standardLayout',
    waitOn: function(){ 
      return [
        Meteor.subscribe('words'), 
        Meteor.subscribe('stages'), 
        Meteor.subscribe('stageData', this.params.page)
        ] 
    },
    action: function () {
      if(this.ready() ||  Meteor.user() ){
        this.render()
      }
    }
  })
  
  this.route('resultsSummary', {
    path: "resultsSummary/:page",
    yieldTemplates: {
      'header': {to: 'header'}
    },
    layoutTemplate: 'standardLayout',
    waitOn: function(){ 
      return [
        Meteor.subscribe('words'), 
        Meteor.subscribe('stages'), 
        Meteor.subscribe('stageData', this.params.page)
        ] 
    },
    action: function () {
      if(this.ready() ||  Meteor.user() ){
        this.render()
      }
    }
  })
})