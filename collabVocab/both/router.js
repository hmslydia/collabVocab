Router.map(function(){
  this.route('welcome',{
    path: "/",
    yieldTemplates: {
      'header': {to: 'header'}
    },
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
        Meteor.subscribe('stageMetaData'), 
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
        Meteor.subscribe('stageMetaData'), 
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
    //path: "selfEval/", //
    path: "resultsSummary/:page",
    yieldTemplates: {
      'header': {to: 'header'}
    },
    layoutTemplate: 'standardLayout',
    waitOn: function(){ 
      return [
        Meteor.subscribe('words'), 
        Meteor.subscribe('stageMetaData'), 
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